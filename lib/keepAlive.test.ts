import { describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import {
  verifyCronAuthorization,
  pingSupabaseDatabase,
} from './keepAlive';
import * as productsModule from './products';
import { publicSupabase } from './supabase/public';
import { GET as cronGET, HEAD as cronHEAD } from '../app/api/cron/keep-alive/route';
import { GET as aliasGET, HEAD as aliasHEAD } from '../app/api/keep-alive/route';

describe('verifyCronAuthorization', () => {
  it('harus mengizinkan request jika CRON_SECRET tidak dikonfigurasi (mode gratis/bebas)', () => {
    expect(verifyCronAuthorization(null, null, undefined)).toBe(true);
    expect(verifyCronAuthorization(null, null, '')).toBe(true);
    expect(verifyCronAuthorization('Bearer invalid', 'wrong-key', '   ')).toBe(true);
  });

  it('harus mengizinkan jika header Authorization: Bearer cocok dengan CRON_SECRET', () => {
    const secret = 'my-super-secret-key-123';
    expect(
      verifyCronAuthorization(`Bearer ${secret}`, null, secret)
    ).toBe(true);

    // Case-insensitive 'bearer'
    expect(
      verifyCronAuthorization(`bearer ${secret}`, null, secret)
    ).toBe(true);

    // Whitespace trimming
    expect(
      verifyCronAuthorization(`Bearer  ${secret}  `, null, secret)
    ).toBe(true);
  });

  it('harus mengizinkan jika query param ?key= cocok dengan CRON_SECRET', () => {
    const secret = 'my-super-secret-key-123';
    expect(
      verifyCronAuthorization(null, secret, secret)
    ).toBe(true);

    // Whitespace trimming
    expect(
      verifyCronAuthorization(null, `  ${secret}  `, secret)
    ).toBe(true);
  });

  it('harus menolak jika token Bearer salah', () => {
    const secret = 'my-super-secret-key-123';
    expect(
      verifyCronAuthorization('Bearer wrong-token', null, secret)
    ).toBe(false);
  });

  it('harus menolak jika query param key salah', () => {
    const secret = 'my-super-secret-key-123';
    expect(
      verifyCronAuthorization(null, 'wrong-token', secret)
    ).toBe(false);
  });

  it('harus menolak jika secret dikonfigurasi tapi request tidak menyertakan kredensial', () => {
    const secret = 'my-super-secret-key-123';
    expect(
      verifyCronAuthorization(null, null, secret)
    ).toBe(false);
    expect(
      verifyCronAuthorization('Basic dXNlcjpwYXNz', null, secret)
    ).toBe(false);
  });
});

describe('pingSupabaseDatabase', () => {
  it('harus mengembalikan connected: false jika Supabase belum terkonfigurasi', async () => {
    const isConfiguredSpy = vi
      .spyOn(productsModule, 'isSupabaseConfigured')
      .mockReturnValueOnce(false);

    const result = await pingSupabaseDatabase();
    expect(result.connected).toBe(false);
    expect(result.error).toContain('Supabase credentials are not configured');

    isConfiguredSpy.mockRestore();
  });

  it('harus mengembalikan connected: true jika query Supabase sukses', async () => {
    const isConfiguredSpy = vi
      .spyOn(productsModule, 'isSupabaseConfigured')
      .mockReturnValueOnce(true);

    const selectMock = vi.fn().mockReturnValue({
      limit: vi.fn().mockResolvedValue({
        data: [{ id: 'prod-123' }],
        error: null,
      }),
    });

    const fromSpy = vi.spyOn(publicSupabase, 'from').mockReturnValue({
      select: selectMock,
    } as unknown as ReturnType<typeof publicSupabase.from>);

    const result = await pingSupabaseDatabase();
    expect(result.connected).toBe(true);
    expect(result.sampleId).toBe('prod-123');
    expect(typeof result.latencyMs).toBe('number');

    isConfiguredSpy.mockRestore();
    fromSpy.mockRestore();
  });

  it('harus mengembalikan connected: false jika query Supabase mengembalikan error', async () => {
    const isConfiguredSpy = vi
      .spyOn(productsModule, 'isSupabaseConfigured')
      .mockReturnValueOnce(true);

    const selectMock = vi.fn().mockReturnValue({
      limit: vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database paused or unreachable' },
      }),
    });

    const fromSpy = vi.spyOn(publicSupabase, 'from').mockReturnValue({
      select: selectMock,
    } as unknown as ReturnType<typeof publicSupabase.from>);

    const result = await pingSupabaseDatabase();
    expect(result.connected).toBe(false);
    expect(result.error).toBe('Database paused or unreachable');

    isConfiguredSpy.mockRestore();
    fromSpy.mockRestore();
  });
});

describe('Route /api/cron/keep-alive GET and HEAD', () => {
  it('harus merespons 200 OK ketika authorized dan database aktif', async () => {
    const isConfiguredSpy = vi
      .spyOn(productsModule, 'isSupabaseConfigured')
      .mockReturnValue(true);

    const selectMock = vi.fn().mockReturnValue({
      limit: vi.fn().mockResolvedValue({
        data: [{ id: 'prod-test' }],
        error: null,
      }),
    });

    const fromSpy = vi.spyOn(publicSupabase, 'from').mockReturnValue({
      select: selectMock,
    } as unknown as ReturnType<typeof publicSupabase.from>);

    const req = new NextRequest('http://localhost:3000/api/cron/keep-alive');
    const res = await cronGET(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.status).toBe('ok');
    expect(data.database.connected).toBe(true);

    // Test HEAD: harus mengembalikan status 200 dengan body null sesuai RFC 9110
    const headReq = new NextRequest('http://localhost:3000/api/cron/keep-alive', { method: 'HEAD' });
    const headRes = await cronHEAD(headReq);
    expect(headRes.status).toBe(200);
    expect(headRes.body).toBeNull();
    expect(headRes.headers.get('Cache-Control')).toBe('no-store, max-age=0');

    // Test alias route /api/keep-alive
    const aliasReq = new NextRequest('http://localhost:3000/api/keep-alive');
    const aliasRes = await aliasGET(aliasReq);
    expect(aliasRes.status).toBe(200);
    const aliasHeadRes = await aliasHEAD(new NextRequest('http://localhost:3000/api/keep-alive', { method: 'HEAD' }));
    expect(aliasHeadRes.status).toBe(200);
    expect(aliasHeadRes.body).toBeNull();

    isConfiguredSpy.mockRestore();
    fromSpy.mockRestore();
  });

  it('harus mengizinkan akses jika ?secret= query parameter cocok', async () => {
    const origSecret = process.env.CRON_SECRET;
    const isConfiguredSpy = vi
      .spyOn(productsModule, 'isSupabaseConfigured')
      .mockReturnValue(true);

    const selectMock = vi.fn().mockReturnValue({
      limit: vi.fn().mockResolvedValue({
        data: [{ id: 'prod-test' }],
        error: null,
      }),
    });

    const fromSpy = vi.spyOn(publicSupabase, 'from').mockReturnValue({
      select: selectMock,
    } as unknown as ReturnType<typeof publicSupabase.from>);

    try {
      process.env.CRON_SECRET = 'my-secret-key';
      const req = new NextRequest('http://localhost:3000/api/cron/keep-alive?secret=my-secret-key');
      const res = await cronGET(req);
      expect(res.status).toBe(200);
    } finally {
      if (origSecret !== undefined) {
        process.env.CRON_SECRET = origSecret;
      } else {
        delete process.env.CRON_SECRET;
      }
      isConfiguredSpy.mockRestore();
      fromSpy.mockRestore();
    }
  });

  it('harus merespons 401 ketika CRON_SECRET dikonfigurasi namun token salah', async () => {
    const origSecret = process.env.CRON_SECRET;
    try {
      process.env.CRON_SECRET = 'super-secret';
      const req = new NextRequest('http://localhost:3000/api/cron/keep-alive', {
        headers: {
          authorization: 'Bearer wrong-secret',
        },
      });
      const res = await cronGET(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.status).toBe('unauthorized');
    } finally {
      if (origSecret !== undefined) {
        process.env.CRON_SECRET = origSecret;
      } else {
        delete process.env.CRON_SECRET;
      }
    }
  });

  it('harus merespons 500 ketika query Supabase gagal', async () => {
    const isConfiguredSpy = vi
      .spyOn(productsModule, 'isSupabaseConfigured')
      .mockReturnValue(true);

    const selectMock = vi.fn().mockReturnValue({
      limit: vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Connection refused' },
      }),
    });

    const fromSpy = vi.spyOn(publicSupabase, 'from').mockReturnValue({
      select: selectMock,
    } as unknown as ReturnType<typeof publicSupabase.from>);

    const req = new NextRequest('http://localhost:3000/api/cron/keep-alive');
    const res = await cronGET(req);
    expect(res.status).toBe(500);

    const data = await res.json();
    expect(data.status).toBe('error');
    expect(data.error).toBe('Connection refused');

    // Test HEAD on 500 status returns 500 and null body
    const headRes = await cronHEAD(req);
    expect(headRes.status).toBe(500);
    expect(headRes.body).toBeNull();

    isConfiguredSpy.mockRestore();
    fromSpy.mockRestore();
  });
});

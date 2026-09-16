import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { updateSession } from './middleware';

describe('updateSession (middleware logic)', () => {
  it('harus mengembalikan response langsung untuk rute non-admin tanpa proteksi', async () => {
    const req = new NextRequest('http://localhost:3000/produk');
    const res = await updateSession(req);
    expect(res.status).toBe(200);
    expect(res.headers.get('location')).toBeNull();
  });

  it('harus mengarahkan /admin dan /admin/ ke /admin/login saat belum login', async () => {
    const req1 = new NextRequest('http://localhost:3000/admin');
    const res1 = await updateSession(req1);
    expect(res1.status).toBe(307);
    expect(new URL(res1.headers.get('location')!).pathname).toBe('/admin/login');

    const req2 = new NextRequest('http://localhost:3000/admin/');
    const res2 = await updateSession(req2);
    expect(res2.status).toBe(307);
    expect(new URL(res2.headers.get('location')!).pathname).toBe('/admin/login');
  });

  it('harus mengizinkan akses ke /admin/login tanpa redirect', async () => {
    const req = new NextRequest('http://localhost:3000/admin/login');
    const res = await updateSession(req);
    expect(res.status).toBe(200);
    expect(res.headers.get('location')).toBeNull();
  });

  it('harus mengarahkan rute terlindungi /admin/dashboard ke /admin/login saat belum login', async () => {
    const req = new NextRequest('http://localhost:3000/admin/dashboard');
    const res = await updateSession(req);
    expect(res.status).toBe(307);
    expect(new URL(res.headers.get('location')!).pathname).toBe('/admin/login');
  });
});

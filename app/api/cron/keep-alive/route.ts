import { NextResponse, type NextRequest } from 'next/server';
import {
  verifyCronAuthorization,
  pingSupabaseDatabase,
} from '@/lib/keepAlive';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get('authorization');
  const queryKey =
    request.nextUrl.searchParams.get('key') ||
    request.nextUrl.searchParams.get('secret');

  const isAuthorized = verifyCronAuthorization(authHeader, queryKey, cronSecret);
  if (!isAuthorized) {
    return NextResponse.json(
      {
        status: 'unauthorized',
        message: 'Unauthorized: Token atau secret CRON_SECRET tidak valid atau tidak disertakan.',
        timestamp: new Date().toISOString(),
      },
      {
        status: 401,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  }

  const result = await pingSupabaseDatabase();

  if (!result.connected) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Keep-alive ping Supabase gagal. Database mungkin offline atau kredensial salah.',
        latency_ms: result.latencyMs,
        error: result.error,
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  }

  return NextResponse.json(
    {
      status: 'ok',
      message: 'Supabase keep-alive ping sukses. Aktivitas database tercatat (mencegah auto-pause).',
      latency_ms: result.latencyMs,
      database: {
        connected: true,
        sample_id: result.sampleId,
      },
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}

export async function HEAD(request: NextRequest) {
  const getResponse = await GET(request);
  return new Response(null, {
    status: getResponse.status,
    statusText: getResponse.statusText,
    headers: getResponse.headers,
  });
}

import { NextResponse, NextRequest } from 'next/server';
import crypto from 'node:crypto';
import { rateLimit } from '@/app/lib/api/rate-limit';

export function GET(req: NextRequest) {
  const startTime = Date.now();
  const requestId = crypto.randomBytes(8).toString('hex');

  // Rate limit: 30 requests per 60 seconds per IP
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';
  const rl = rateLimit(`${ip}:/api/csrf`, { limit: 30, windowSeconds: 60 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSeconds) } }
    );
  }

  try {
    // Validate environment configuration
    if (!process.env.CSRF_SECRET) {
      console.error('[csrf] CRITICAL: CSRF_SECRET environment variable not set', {
        requestId,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Generate nonce and signature
    const nonce = crypto.randomBytes(16).toString('hex');
    const sig = crypto.createHmac('sha256', process.env.CSRF_SECRET).update(nonce).digest('hex');

    console.log('[csrf] Token issued', { requestId });

    const isProduction = process.env.NODE_ENV === 'production';

    const res = NextResponse.json({ nonce });
    res.cookies.set('csrf_nonce', nonce, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
      path: '/',
    });
    res.cookies.set('csrf_sig', sig, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
      path: '/',
    });

    return res;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('[csrf] Token generation failed', {
      requestId,
      timestamp: new Date().toISOString(),
      durationMs: duration,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json({ error: 'Failed to generate CSRF token' }, { status: 500 });
  }
}

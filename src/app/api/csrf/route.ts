import { NextResponse, NextRequest } from 'next/server';
import crypto from 'node:crypto';

export function GET(req: NextRequest) {
  const startTime = Date.now();
  const requestId = crypto.randomBytes(8).toString('hex');

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

    console.log('[csrf] Token issued', {
      requestId,
      timestamp: new Date().toISOString(),
      nonceLength: nonce.length,
      sigLength: sig.length,
      origin: req.headers.get('origin') || 'none',
      userAgent: req.headers.get('user-agent')?.substring(0, 100) || 'none',
      ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
    });

    const res = NextResponse.json({ nonce });
    res.cookies.set('csrf_nonce', nonce, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/',
    });
    res.cookies.set('csrf_sig', sig, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/',
    });

    const duration = Date.now() - startTime;
    console.log('[csrf] Request completed', {
      requestId,
      durationMs: duration,
      success: true,
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

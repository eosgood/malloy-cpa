import { NextResponse } from 'next/server';
import crypto from 'node:crypto';

export function GET() {
  const nonce = crypto.randomBytes(16).toString('hex');
  const sig = crypto.createHmac('sha256', process.env.CSRF_SECRET!).update(nonce).digest('hex');

  const res = NextResponse.json({ nonce });
  res.cookies.set('csrf_nonce', nonce, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
  });
  res.cookies.set('csrf_sig', sig, { httpOnly: true, sameSite: 'lax', secure: true, path: '/' });
  return res;
}

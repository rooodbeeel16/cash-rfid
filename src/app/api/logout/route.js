// src/app/api/logout/route.js
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  const cookie = serialize('token', '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0) // expire immediately
  });

  const res = NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
  res.headers.set('Set-Cookie', cookie);
  return res;
}

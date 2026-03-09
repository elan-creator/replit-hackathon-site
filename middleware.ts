import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/site-auth';

const PUBLIC_PATHS = ['/login', '/api/auth/login'];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return true;
  }
  if (pathname.startsWith('/_next/') || pathname.startsWith('/favicon') || pathname.endsWith('.ico') || pathname.endsWith('.png') || pathname.endsWith('.svg') || pathname.endsWith('.jpg')) {
    return true;
  }
  return false;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get('site_auth')?.value;
  if (token && await verifyAuthToken(token)) {
    return NextResponse.next();
  }

  const loginUrl = new URL('/login', req.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token');

  if (!token && request.nextUrl.pathname.startsWith('/threaded')) {
    return NextResponse.redirect(new URL('/yuma-app', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/threaded/:path*'
};

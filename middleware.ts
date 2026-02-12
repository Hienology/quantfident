import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'quantfident_session';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    const redirectUrl = new URL('/?auth=1', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};

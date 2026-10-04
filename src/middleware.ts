import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public admin dashboard preview, login & verify endpoints
  if (
    pathname === '/admin' ||
    pathname === '/admin/login' ||
    pathname === '/admin/verify' ||
    pathname === '/api/admin/login' ||
    pathname === '/api/admin/verify' ||
    pathname === '/api/admin/logout'
  ) {
    return NextResponse.next();
  }

  // Check admin session cookie for protected admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const sessionCookie = request.cookies.get('admin_session')?.value;

    if (!sessionCookie || sessionCookie.trim() === '') {
      if (pathname.startsWith('/api/admin')) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized: Admin session required' },
          { status: 401 }
        );
      }

      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};

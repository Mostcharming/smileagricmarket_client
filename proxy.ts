import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface DecodedToken {
  exp?: number;
  role?: string;
  id?: string;
  email?: string;
  [key: string]: unknown;
}

// Decode base64url encoded JWT payload safely in the Edge Runtime
function decodeJwt(token: string): DecodedToken | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload) as DecodedToken;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('smileAgrimarketCookie')?.value;

  // Validate session token
  let session: DecodedToken | null = null;
  let isAuthenticated = false;
  let isExpired = false;

  if (token) {
    session = decodeJwt(token);
    if (session) {
      isExpired = session.exp ? session.exp * 1000 < Date.now() : false;
      isAuthenticated = !isExpired;
    }
  }

  // Get user role if authenticated (read from cookie or fallback to JWT payload)
  let role = (request.cookies.get('smileAgrimarketRole')?.value || '').toLowerCase();
  if (!role && session) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawUser = (session.user || session.admin || session.marketingAdmin || session) as any;
    role = String(rawUser?.role || session?.role || '').toLowerCase();
  }

  const isAdmin = role === 'admin';
  const isMarketing = role === 'marketing' || role === 'marketing_admin' || role === 'marketing-admin';

  // Route categories
  const isAdminLoginPage = pathname === '/admin';
  const isMarketingLoginPage = pathname === '/marketing';
  const isRegularLoginPage = pathname === '/login';

  const isAdminRoute = pathname.startsWith('/admin/') || pathname === '/admin';
  const isMarketingRoute = pathname.startsWith('/marketing/') || pathname === '/marketing';

  // Auth pages (login, signup, forgot password, otp verification, etc.)
  const isAuthPage = [
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/verify-otp',
  ].includes(pathname) || isAdminLoginPage || isMarketingLoginPage;

  // 1. Handle authenticated users visiting login/auth pages (redirect them to dashboards of matching roles)
  if (isAuthPage && isAuthenticated) {
    if (isAdminLoginPage && isAdmin) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    if (isMarketingLoginPage && isMarketing) {
      return NextResponse.redirect(new URL('/marketing/dashboard', request.url));
    }
    if (isRegularLoginPage || pathname === '/signup') {
      if (!isAdmin && !isMarketing) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }

  // 2. Protect Admin Routes (e.g., /admin/dashboard, /admin/users, but NOT /admin login page)
  if (isAdminRoute && !isAdminLoginPage) {
    if (!isAuthenticated || !isAdmin) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  // 3. Protect Marketing Routes (e.g., /marketing/dashboard, but NOT /marketing login page)
  if (isMarketingRoute && !isMarketingLoginPage) {
    if (!isAuthenticated || (!isMarketing && !isAdmin)) {
      return NextResponse.redirect(new URL('/marketing', request.url));
    }
    return NextResponse.next();
  }

  // 4. Protect Main User Routes (e.g., /dashboard, /invest, /profile, /settings, /my-farms, /my-portfolio)
  // These routes are listed explicitly in matcher config below
  const isUserProtectedRoute = [
    '/dashboard',
    '/invest',
    '/my-farms',
    '/my-portfolio',
    '/profile',
    '/settings',
  ].some(route => pathname === route || pathname.startsWith(route + '/'));

  if (isUserProtectedRoute) {
    if (!isAuthenticated || isAdmin || isMarketing) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      // Clean up the invalid cookie if it exists but expired
      if (isExpired) {
        response.cookies.delete('smileAgrimarketCookie');
      }
      return response;
    }
  }

  return NextResponse.next();
}

// Config matcher to limit middleware execution for optimal performance
export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/invest/:path*',
    '/my-farms/:path*',
    '/my-portfolio/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/admin/:path*',
    '/marketing/:path*',
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/verify-otp',
    '/onboarding',
  ],
};

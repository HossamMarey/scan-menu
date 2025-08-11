import { NextRequest, NextResponse } from 'next/server';
import { intlMiddleware } from './lib/localization';

/**
 * Middleware function to handle all requests
 * - Handles locale routing (ar as default, en with /en prefix)
 */
export default async function middleware(request: NextRequest) {
  return intlMiddleware(request);
}

/**
 * Configure which paths should be handled by the middleware
 * - Exclude static files, API routes, etc.
 */
export const config = {
  matcher: [
    // Match all paths except those starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico, robots.txt, sitemap.xml (common root files)
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};

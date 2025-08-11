import createMiddleware from 'next-intl/middleware';
import { i18nRouting } from './src/lib/localization/routing';

export default createMiddleware(i18nRouting);

export const config = {
  // Skip all internal paths and static assets
  matcher: ['/((?!_next|.*\\.\w+$|api|favicon.ico).*)'],
};

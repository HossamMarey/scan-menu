// Custom middleware for locale detection with cookie persistence
import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { i18nRouting } from './routing';
import { LANGUAGE_COOKIE, defaultLocale } from './config';

// Create the next-intl middleware
export const intlMiddleware = createIntlMiddleware(i18nRouting);

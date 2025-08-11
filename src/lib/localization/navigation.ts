import { createNavigation } from 'next-intl/navigation';
import { i18nRouting } from './routing';

/**
 * Create navigation utilities for internationalization
 * These utilities help with creating links and navigating between locales
 *
 * - Link: A component for creating links that preserve the current locale
 * - redirect: A function for redirecting to a different page while preserving the locale
 * - usePathname: A hook for getting the current pathname without the locale prefix
 * - useRouter: A hook for navigating between pages while preserving the locale
 * - getPathname: A function for getting the pathname for a specific locale
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(i18nRouting);

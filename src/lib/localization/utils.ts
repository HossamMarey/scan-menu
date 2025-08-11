// Localization utility functions
import { LANGUAGES, defaultLocale } from './config';
import type { ILocaleCode } from './config';

/**
 * Get text direction for a locale
 */
export function getDirection(locale: ILocaleCode): 'ltr' | 'rtl' {
  return LANGUAGES.find(lang => lang.code === locale)?.direction || 'ltr';
}

/**
 * Get display label for a locale
 */
export function getLocaleLabel(locale: ILocaleCode): string {
  return LANGUAGES.find(lang => lang.code === locale)?.label || 'English';
}

/**
 * Get native name for a locale
 */
export function getLocaleNativeName(locale: ILocaleCode): string {
  return LANGUAGES.find(lang => lang.code === locale)?.nativeName || 'English';
}

/**
 * Get flag emoji for a locale
 */
export function getLocaleFlag(locale: ILocaleCode): string {
  return LANGUAGES.find(lang => lang.code === locale)?.flag || '🇺🇸';
}

/**
 * Check if a locale is supported
 */
export function isSupportedLocale(locale: string): locale is ILocaleCode {
  return LANGUAGES.some(lang => lang.code === locale);
}

/**
 * Get the opposite locale (for language switcher)
 */
export function getAlternateLocale(currentLocale: ILocaleCode): ILocaleCode {
  return LANGUAGES.find(lang => lang.code === currentLocale)?.code === 'en'
    ? 'ar'
    : 'en';
}

/**
 * Normalize locale string to supported locale or default
 */
export function normalizeLocale(locale?: string | null): ILocaleCode {
  if (!locale || !isSupportedLocale(locale)) {
    return defaultLocale;
  }
  return locale;
}

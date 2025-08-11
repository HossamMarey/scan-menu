import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale, i18n_cookie, LANGUAGE_COOKIE } from './config';

export const i18nRouting = defineRouting({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // This will make the default locale without a prefix
  // and other locales will have the /<locale> prefix
  localePrefix: 'as-needed',

  // localeCookie: true,
  localeCookie: LANGUAGE_COOKIE,
});

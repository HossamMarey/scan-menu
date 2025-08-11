'use client';

import {
  ILocaleCode,
  locales,
  defaultLocale,
  i18n_cookie,
  LANGUAGES,
} from './config';
import { useTranslations, useLocale } from 'next-intl';

import { useParams } from 'next/navigation';
import { useMemo, useTransition } from 'react';
import Cookies from 'js-cookie';
import { useRouter, usePathname } from './navigation';
/**
 * Custom hook for language-related functionality
 * Provides access to translations, current locale, and language switching
 *
 * @param namespace - The translation namespace to use (defaults to 'Common')
 * @returns Object containing locale, changeLanguage function, and translation function
 */
export const useLanguage = (namespace: string = 'Common') => {
  // Get the current locale
  const locale = useLocale() as ILocaleCode;

  // Get the router and pathname for navigation
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const isRtl = locale === 'ar';
  const [isPending, startTransition] = useTransition();

  // Get the translation function for the specified namespace
  const t = useTranslations(namespace);

  /**
   * Change the application language
   * This will navigate to the same page with the new locale
   *
   * @param lang - The language code to switch to ('en' or 'ar')
   */
  const changeLanguage = (lang: ILocaleCode) => {
    if (lang === locale) return;

    startTransition(() => {
      Cookies.set(i18n_cookie, lang);

      // Navigate to the same page with the new locale
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: lang }
      );
    });
  };

  const localInfo = useMemo(() => {
    return LANGUAGES.find(lang => lang.code === locale) || LANGUAGES[0];
  }, [locale]);

  return { locale, changeLanguage, t, isRtl, locales, localInfo };
};

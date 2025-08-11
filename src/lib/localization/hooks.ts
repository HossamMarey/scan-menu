'use client';

// Client-side localization hooks
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from './navigation';

import { getAlternateLocale, getDirection } from './utils';
import { LANGUAGE_COOKIE, type ILocaleCode } from './config';
import { useTransition } from 'react';
import Cookies from 'js-cookie';
import { useParams } from 'next/navigation';
/**
 * Hook to get current locale with type safety
 */
export function useCurrentLocale(): ILocaleCode {
  return useLocale() as ILocaleCode;
}

/**
 * Hook to get text direction for current locale
 */
export function useDirection(): 'ltr' | 'rtl' {
  const locale = useCurrentLocale();
  return getDirection(locale);
}

/**
 * Hook to switch between locales with persistence
 */
export function useLocaleSwitch() {
  const currentLocale = useCurrentLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: ILocaleCode) => {
    if (newLocale === currentLocale) {
      return;
    }

    // startTransition(() => {
    // })
    Cookies.set(LANGUAGE_COOKIE.name, newLocale);

    // Navigate to the same page with the new locale
    router.replace(
      // @ts-expect-error -- TypeScript will validate that only known `params`
      // are used in combination with a given `pathname`. Since the two will
      // always match for the current route, we can skip runtime checks.
      { pathname, params },
      { locale: newLocale }
    );
  };

  const toggleLocale = () => {
    const newLocale = getAlternateLocale(currentLocale);

    console.log('newLocalenewLocale', newLocale);
    switchLocale(newLocale);
  };

  return {
    currentLocale,
    switchLocale,
    toggleLocale,
    alternateLocale: getAlternateLocale(currentLocale),
  };
}

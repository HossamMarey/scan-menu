// Server-side localization utilities
import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

import { LANGUAGE_COOKIE, type ILocaleCode, defaultLocale } from './config';
import { normalizeLocale } from './utils';
import { i18nRouting } from './routing';

/**
 * Get locale from cookies (user preference) or default
 * SERVER-SIDE ONLY - Do not import in client components
 */
export async function getLocaleFromCookies(): Promise<ILocaleCode> {
  const cookieStore = await cookies();
  const locale = cookieStore.get(LANGUAGE_COOKIE.name)?.value;
  return normalizeLocale(locale);
}

/**
 * Next-intl request configuration
 * Provides messages for each locale and defines supported locales
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default getRequestConfig(
  async ({ requestLocale }: { requestLocale: string }) => {
    // Ensure that the incoming locale is supported
    // if (!locales.includes(requestLocale as ILocaleCode)) {
    //   notFound();
    // }

    const currentlocale: string = (await requestLocale) || defaultLocale;

    // Dynamically import the JSON messages for the locale
    const messages = (await import(`../../../messages/${currentlocale}.json`))
      .default;

    // Ensure that a valid locale is used
    const safeLocale = i18nRouting.locales.includes(
      currentlocale as ILocaleCode
    )
      ? currentlocale
      : i18nRouting.defaultLocale;

    return {
      messages,
      locale: safeLocale,
    };
  }
);

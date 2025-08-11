export type ILocaleCode = 'ar' | 'en';

export interface ILocale {
  code: ILocaleCode;
  name: string;
  label: string;
  countryCode: string;
  direction: 'ltr' | 'rtl';
  flag: string;
  nativeName: string;
}

export type LocaleObject = Record<ILocaleCode, string>;
export interface LanguageValue {
  value: string;
  translations: LocaleObject;
}

export const LANGUAGES: ILocale[] = [
  {
    code: 'en',
    name: 'English',
    label: 'English',
    countryCode: 'US',
    direction: 'ltr',
    flag: '🇺🇸',
    nativeName: 'English',
  },
  {
    code: 'ar',
    name: 'Arabic',
    label: 'العربية',
    countryCode: 'EG',
    direction: 'rtl',
    flag: '🇪🇬',
    nativeName: 'العربية',
  },
];

export const locales: ILocaleCode[] = LANGUAGES.map(lang => lang.code);
export const defaultLocale = LANGUAGES[0].code;

export const i18n_cookie = 'SC_LOCALE';

// Cookie configuration for language persistence
export const LANGUAGE_COOKIE = {
  name: i18n_cookie,
  maxAge: 365 * 24 * 60 * 60, // 1 year in seconds
  path: '/',
  sameSite: 'lax' as const,
};

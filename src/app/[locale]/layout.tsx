import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import {
  defaultLocale,
  getDirection,
  locales,
  type ILocaleCode,
} from '@/lib/localization';
import { Geist, Geist_Mono, Alexandria } from 'next/font/google';
import { Providers } from '@/components/providers';
import { getSession } from "@/server/auth/utils";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const arFont = Alexandria({
  subsets: ['arabic'],
  weight: ['400', '400', '700', '800'],
});

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

// Generate static params for supported locales
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }];
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: paramsLocale } = await params;
  const locale = paramsLocale || defaultLocale;

  // Validate that the incoming locale is supported
  if (!locales.includes(locale as ILocaleCode)) {
    notFound();
  }

  setRequestLocale(locale);

  // Provide messages to client components
  const messages = await getMessages();

  // Get direction for the locale to avoid hydration mismatch
  const direction = getDirection(locale as ILocaleCode);

  // Prepare font classes to ensure consistency
  const fontClasses = `${geistSans.variable} ${geistMono.variable} ${locale === 'ar' ? arFont.className : ''
    }`.trim();



  return (
    <html
      lang={locale}
      dir={direction}
      className={fontClasses}
      suppressHydrationWarning
    >
      <body className="antialiased" suppressHydrationWarning>
        <Providers >
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}

import { getTranslations } from 'next-intl/server';
import { SignInButton } from '@/components/auth/sign-in-button';

/**
 * Sign-in page for authentication
 * Provides Google OAuth sign-in interface with localized content
 */
export default async function SignInPage() {
  const t = await getTranslations('auth');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('signInTitle')}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t('signInDescription')}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <SignInButton />

          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            {t('termsAgreement')}
          </p>
        </div>
      </div>
    </div>
  );
}

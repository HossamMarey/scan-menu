import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

/**
 * Authentication error page
 * Displays error messages when authentication fails
 */
interface AuthErrorPageProps {
  searchParams: { error?: string };
}

export default async function AuthErrorPage({
  searchParams,
}: AuthErrorPageProps) {
  const t = await getTranslations('auth');
  const error = searchParams.error;

  const getErrorMessage = (error?: string) => {
    switch (error) {
      case 'Configuration':
        return t('errors.configuration');
      case 'AccessDenied':
        return t('errors.accessDenied');
      case 'Verification':
        return t('errors.verification');
      default:
        return t('errors.default');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
            <svg
              className="h-6 w-6 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            {t('authenticationError')}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {getErrorMessage(error)}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <Button asChild className="w-full">
            <Link href="/auth/signin">{t('tryAgain')}</Link>
          </Button>

          <Button asChild variant="outline" className="w-full">
            <Link href="/">{t('backToHome')}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useTranslations } from 'next-intl';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { SignInButton } from '@/components/auth/sign-in-button';

export default function HomePage() {
  const t = useTranslations('Common.home');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          {t('welcome')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
          {t('description')}
        </p>

        <div className="flex flex-col items-center gap-4">
          <SignInButton />
        </div>
      </div>
    </div>
  );
}

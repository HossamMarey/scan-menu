'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

/**
 * Sign-in/Sign-out button component
 * Handles Google OAuth authentication with localized text
 */
export function SignInButton() {
  const { data: session, status } = useSession();
  const t = useTranslations('auth');

  if (status === 'loading') {
    return (
      <Button variant="outline" disabled>
        {t('loading')}
      </Button>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          {t('welcomeBack', { name: session.user.name })}
        </span>
        <Button variant="outline" onClick={() => signOut()} className="text-sm">
          {t('signOut')}
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={() => signIn('google')}
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      {t('signInWithGoogle')}
    </Button>
  );
}

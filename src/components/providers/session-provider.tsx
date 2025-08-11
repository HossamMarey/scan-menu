'use client';

import { SessionProvider, SessionProviderProps } from 'next-auth/react';
import { ReactNode } from 'react';

/**
 * Session provider wrapper for NextAuth
 * Provides authentication context to client components
 */
interface AuthSessionProviderProps {
  children: ReactNode;

}

export function AuthSessionProvider({ children, }: AuthSessionProviderProps) {
  return <SessionProvider  >{children}</SessionProvider>;
}

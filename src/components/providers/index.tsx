'use client';

import { ThemeProvider } from './theme-provider';
import { ToastProvider } from './toast-provider';
import { AuthSessionProvider } from './session-provider';
import { SessionProviderProps } from "next-auth/react";

/**
 * Global providers wrapper that combines all app-level providers
 * Provides theme support, toast notifications, and authentication context
 */
interface ProvidersProps {
  children: React.ReactNode;

}

export function Providers({ children }: ProvidersProps) {


  return (
    <AuthSessionProvider >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <ToastProvider />
      </ThemeProvider>
    </AuthSessionProvider>
  );
}

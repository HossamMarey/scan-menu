'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

/**
 * Theme provider component that wraps the application with theme support
 * Provides light/dark mode functionality with system preference detection
 */
interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: 'class' | 'data-theme';
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

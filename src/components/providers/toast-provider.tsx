'use client';

import { Toaster } from '@/components/ui/sonner';

/**
 * Toast provider component that provides toast notifications throughout the app
 * Uses Sonner for beautiful and accessible toast notifications
 */
export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      expand={false}
      visibleToasts={4}
    />
  );
}

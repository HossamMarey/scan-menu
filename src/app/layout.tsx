import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ScanMenu',
  description: 'Create and track beautiful digital menus',
};

// Root layout should not render html/body when using [locale] segments
// The locale layout will handle the complete html structure
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

'use client';
import Link, { LinkProps } from 'next/link';
import { useParams } from 'next/navigation';
import { defaultLocale } from './config';
import { useMemo } from 'react';

/**
 * Props type for ClientLink component
 * Combines Next.js LinkProps with HTML anchor attributes
 * and allows for React children
 */
type Props = LinkProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children?: React.ReactNode;
  };

/**
 * ClientLink component
 * A wrapper around Next.js Link component for client-side navigation
 * Used for internationalized routing
 */
export default function ClientLink({
  children,
  href,
  target,
  ...props
}: Props) {
  // Get current locale from URL params or use default locale
  const params = useParams();
  const locale = params?.locale ? params.locale : defaultLocale;

  // Check if the href is a string and if it's an external link
  const isExternal = typeof href === 'string' && href.startsWith('http');

  // Ensure href is a valid value, default to '#' if undefined
  const customHref = useMemo(() => {
    if (!isExternal && locale !== defaultLocale) {
      return `/${locale}${href}`;
    }
    return href;
  }, [href, locale, isExternal]);

  return (
    <Link {...props} href={customHref} target={isExternal ? '_blank' : target}>
      {children}
    </Link>
  );
}

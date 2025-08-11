'use client';

import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

/**
 * Create restaurant button component
 * Quick action button for creating a new restaurant
 */
export function CreateRestaurantButton() {
  const t = useTranslations('dashboard');

  return (
    <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
      <Link href="/dashboard/restaurants/new">
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        {t('actions.createRestaurant')}
      </Link>
    </Button>
  );
}

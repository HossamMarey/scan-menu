'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { IRestaurant, IMenu, IUser } from '@/server/db/types';
import Link from 'next/link';

/**
 * Dashboard overview component
 * Shows restaurants, menus, and quick stats
 */
interface DashboardOverviewProps {
  restaurants: IRestaurant[];
  menus: IMenu[];
  user: IUser;
}

export function DashboardOverview({ restaurants, menus }: DashboardOverviewProps) {
  const t = useTranslations('dashboard');

  const stats = {
    totalRestaurants: restaurants.length,
    totalMenus: menus.length,
    activeMenus: menus.filter(m => m.status === 'published').length,
    draftMenus: menus.filter(m => m.status === 'draft').length,
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {t('stats.restaurants')}
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalRestaurants}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {t('stats.totalMenus')}
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalMenus}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {t('stats.activeMenus')}
          </h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.activeMenus}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {t('stats.draftMenus')}
          </h3>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {stats.draftMenus}
          </p>
        </div>
      </div>

      {/* Restaurants Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('sections.restaurants')}
            </h2>
            <Button asChild size="sm">
              <Link href="/dashboard/restaurants/new">
                {t('actions.createRestaurant')}
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="p-6">
          {restaurants.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {t('empty.restaurants')}
              </p>
              <Button asChild>
                <Link href="/dashboard/restaurants/new">
                  {t('actions.createFirstRestaurant')}
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant._id.toString()}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {restaurant.name.en}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      restaurant.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}>
                      {restaurant.isActive ? t('status.active') : t('status.inactive')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    /{restaurant.slug}
                  </p>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/dashboard/restaurants/${restaurant._id}`}>
                        {t('actions.manage')}
                      </Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link href={`/dashboard/restaurants/${restaurant._id}/menus/new`}>
                        {t('actions.addMenu')}
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Menus Section */}
      {menus.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('sections.recentMenus')}
            </h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {menus.slice(0, 5).map((menu) => (
                <div
                  key={menu._id.toString()}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {menu.name.en}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {typeof menu.restaurantId === 'object' && menu.restaurantId && 'name' in menu.restaurantId 
                        ? (menu.restaurantId as { name: { en: string } }).name.en 
                        : 'Unknown Restaurant'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      menu.status === 'published'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : menu.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}>
                      {t(`menuStatus.${menu.status}`)}
                    </span>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/dashboard/menus/${menu._id}`}>
                        {t('actions.view')}
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/server/auth/utils';
import { connectToDatabase } from '@/server/db/connect';
import { Restaurant, Menu } from '@/server/db/models';
import { getTranslations } from 'next-intl/server';
import { DashboardOverview } from '@/components/dashboard/overview';
import { CreateRestaurantButton } from '@/components/dashboard/create-restaurant-button';

/**
 * Dashboard home page for restaurant owners
 * Shows overview of restaurants and menus with quick actions
 * Requires authentication - redirects to sign-in if not authenticated
 */
export default async function DashboardPage() {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      redirect('/auth/signin');
    }

    await connectToDatabase();

    // Get user's restaurants and menus
    const restaurants = await Restaurant.find({ ownerId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    const menus = await Menu.find({
      restaurantId: { $in: restaurants.map(r => r._id) }
    })
      .populate('restaurantId', 'name slug')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const t = await getTranslations('dashboard');

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('welcome', { name: user.name })}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {t('subtitle')}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-4">
              <CreateRestaurantButton />
            </div>
          </div>

          {/* Dashboard Overview */}
          <DashboardOverview 
            restaurants={restaurants}
            menus={menus}
            user={user}
          />
        </div>
      </div>
    );

  } catch (error) {
    console.error('❌ Dashboard error:', error);
    
    // If there's an error (like DB connection), redirect to debug page
    redirect('/dashboard/debug');
  }
}
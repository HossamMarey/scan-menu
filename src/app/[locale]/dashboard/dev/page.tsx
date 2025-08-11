import { connectToDatabase } from '@/server/db/connect';
import { Restaurant, Menu, User } from '@/server/db/models';
import { getTranslations } from 'next-intl/server';
import { DashboardOverview } from '@/components/dashboard/overview';
import { CreateRestaurantButton } from '@/components/dashboard/create-restaurant-button';

/**
 * Development dashboard page (bypasses authentication for testing)
 * Remove this file in production!
 */
export default async function DevDashboardPage() {
  const t = await getTranslations('dashboard');

  // Create a mock user for development
  const mockUser = {
    _id: 'dev-user-id',
    name: 'Development User',
    email: 'dev@scanmenu.app',
    role: 'user',
    isActive: true,
  };

  try {
    await connectToDatabase();

    // Get sample data (empty arrays for now)
    const restaurants: any[] = [];
    const menus: any[] = [];

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Development Notice */}
          <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            <p className="font-medium">🚧 Development Mode</p>
            <p className="text-sm">This is a development dashboard. Set up authentication to access the real dashboard.</p>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('welcome', { name: mockUser.name })}
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
            user={mockUser as any}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error('❌ Error in dev dashboard:', error);
    
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Database Connection Error
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Please check your MongoDB connection in .env.local
          </p>
          <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-4 rounded">
            MONGODB_URI=mongodb://localhost:27017/scanmenu
          </pre>
        </div>
      </div>
    );
  }
}

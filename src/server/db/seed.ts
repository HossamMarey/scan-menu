import mongoose from 'mongoose';
import { connectToDatabase } from './connect';
import { Plan } from './models';

/**
 * Database seeding utilities for development and testing
 * Creates default plans and sample data
 */

/**
 * Seed default subscription plans
 */
export async function seedPlans(): Promise<void> {
  await connectToDatabase();

  const plans = [
    {
      name: 'Free',
      slug: 'free',
      price: 0,
      currency: 'USD',
      features: [
        'basic_analytics',
        'qr_codes',
        'pdf_upload',
        'basic_customization',
      ],
      limits: {
        restaurants: 1,
        menus: 3,
        links: 10,
        visits: 1000,
        storage: 50, // 50MB
      },
      isActive: true,
    },
    {
      name: 'Pro',
      slug: 'pro',
      price: 1999, // $19.99 in cents
      currency: 'USD',
      features: [
        'advanced_analytics',
        'custom_qr_codes',
        'unlimited_pdf_upload',
        'advanced_customization',
        'custom_branding',
        'social_links',
        'utm_tracking',
      ],
      limits: {
        restaurants: 5,
        menus: 50,
        links: 500,
        visits: 50000,
        storage: 1000, // 1GB
      },
      isActive: true,
    },
    {
      name: 'Enterprise',
      slug: 'enterprise',
      price: 4999, // $49.99 in cents
      currency: 'USD',
      features: [
        'enterprise_analytics',
        'white_label',
        'api_access',
        'priority_support',
        'custom_integrations',
        'advanced_security',
        'team_management',
      ],
      limits: {
        restaurants: 50,
        menus: 1000,
        links: 10000,
        visits: 1000000,
        storage: 10000, // 10GB
      },
      isActive: true,
    },
  ];

  for (const planData of plans) {
    const existingPlan = await Plan.findOne({ slug: planData.slug });
    if (!existingPlan) {
      await Plan.create(planData);
      console.log(`✅ Created plan: ${planData.name}`);
    } else {
      console.log(`⚠️ Plan already exists: ${planData.name}`);
    }
  }
}

/**
 * Clear all data from the database (use with caution!)
 */
export async function clearDatabase(): Promise<void> {
  await connectToDatabase();

  const collections = [
    'users',
    'restaurants',
    'menus',
    'menulinks',
    'visits',
    'plans',
    'subscriptions',
  ];

  for (const collection of collections) {
    try {
      if (mongoose.connection.db) {
        await mongoose.connection.db.collection(collection).deleteMany({});
        console.log(`🗑️ Cleared collection: ${collection}`);
      }
    } catch (error) {
      console.error(`❌ Error clearing collection ${collection}:`, error);
    }
  }
}

/**
 * Run all seeding operations
 */
export async function seedDatabase(): Promise<void> {
  try {
    console.log('🌱 Starting database seeding...');

    await seedPlans();

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
}

// Allow running this file directly for development
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('🎉 Seeding completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

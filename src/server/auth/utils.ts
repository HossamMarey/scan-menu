import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from './config';
import { connectToDatabase } from '@/server/db/connect';
import { User } from '@/server/db/models';
import { IUser } from '@/server/db/types';

/**
 * Authentication utilities for server-side components and API routes
 * Provides helper functions for user authentication and authorization
 */

/**
 * Get the current authenticated user from the database
 * Returns null if user is not authenticated or not found
 */
export async function getCurrentUser(): Promise<IUser | null> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return null;
    }

    await connectToDatabase();

    const user = await User.findById(session.user.id);

    if (!user || !user.isActive) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('❌ Error getting current user:', error);
    return null;
  }
}

/**
 * Require authentication for a server component or page
 * Redirects to sign-in page if user is not authenticated
 */
export async function requireAuth(): Promise<IUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/signin');
  }

  return user;
}

/**
 * Check if user has admin role
 */
export async function requireAdmin(): Promise<IUser> {
  const user = await requireAuth();

  if (user.role !== 'admin') {
    redirect('/unauthorized');
  }

  return user;
}

/**
 * Get session for client-side components
 * Use this in client components with useSession hook
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Check if user is authenticated (boolean check)
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}

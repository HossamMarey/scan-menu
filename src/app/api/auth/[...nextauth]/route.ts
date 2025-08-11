import NextAuth from 'next-auth';
import { authOptions } from '@/server/auth/config';

/**
 * NextAuth API route handlers for App Router
 * Handles all authentication endpoints (/api/auth/*)
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

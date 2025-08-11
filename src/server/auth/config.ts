import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { connectToDatabase } from '@/server/db/connect';
import { User } from '@/server/db/models';

/**
 * NextAuth configuration for Google OAuth authentication
 * Integrates with MongoDB User model and provides JWT session strategy
 */
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          await connectToDatabase();

          // Check if user already exists
          const existingUser = await User.findOne({
            authProviderId: account.providerAccountId,
          });

          if (!existingUser) {
            // Create new user
            await User.create({
              authProviderId: account.providerAccountId,
              email: user.email!,
              name: user.name!,
              avatar: user.image,
              role: 'user',
              isActive: true,
            });
            console.log(`✅ Created new user: ${user.email}`);
          }

          return true;
        } catch (error) {
          console.error('❌ Error during sign in:', error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, account, user }) {
      // Persist the OAuth account info and user data to the token
      if (account && user) {
        try {
          await connectToDatabase();

          const dbUser = await User.findOne({
            authProviderId: account.providerAccountId,
          });

          if (dbUser) {
            token.userId = dbUser._id.toString();
            token.role = dbUser.role;
            token.isActive = dbUser.isActive;
          }
        } catch (error) {
          console.error('❌ Error fetching user in JWT callback:', error);
        }
      }
      return token;
    },

    async session({ session, token }) {
      // Send properties to the client
      if (token && session.user) {
        session.user.id = token.userId as string;
        session.user.role = token.role as string;
        session.user.isActive = token.isActive as boolean;
      }
      return session;
    },
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  events: {
    async signIn({ user, isNewUser }) {
      if (isNewUser) {
        console.log(`🎉 New user signed up: ${user.email}`);
      }
    },
  },
};



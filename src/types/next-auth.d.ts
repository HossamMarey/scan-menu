import 'next-auth';

/**
 * Type definitions for NextAuth to extend default session and user types
 * Adds custom properties for our ScanMenu application
 */
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      role: string;
      isActive: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
    role: string;
    isActive: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string;
    role: string;
    isActive: boolean;
  }
}

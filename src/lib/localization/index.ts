// Localization module exports - CLIENT SIDE ONLY
// For server-side utilities, import directly from './server'

// Configuration
export * from './config';

// Routing
export * from './routing';

// Utilities
export * from './utils';

// Client-side hooks
export * from './hooks';

// Client-side components
export * from './ClientLink';

export * from './middleware';
export * from './navigation';
export * from './useLanguage';

// Note: Server utilities are NOT exported here to avoid client/server boundary issues
// Import server utilities directly: import { getLocaleFromCookies } from '@/lib/localization/server'

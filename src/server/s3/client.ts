import { S3Client } from '@aws-sdk/client-s3';

/**
 * AWS S3 client configuration for ScanMenu file storage
 * Handles PDF menu uploads and restaurant branding assets
 */

// Validate required environment variables
const requiredEnvVars = {
  S3_REGION: process.env.S3_REGION,
  S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
};

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required S3 environment variables: ${missingVars.join(', ')}`
  );
}

/**
 * S3 client instance with AWS SDK v3
 */
export const s3Client = new S3Client({
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

/**
 * S3 bucket configuration
 */
export const S3_CONFIG = {
  BUCKET_NAME: process.env.S3_BUCKET_NAME!,
  REGION: process.env.S3_REGION!,
  
  // File upload limits
  MAX_FILE_SIZE: {
    PDF: 20 * 1024 * 1024, // 20MB for PDFs
    IMAGE: 5 * 1024 * 1024, // 5MB for images
  },
  
  // Allowed file types
  ALLOWED_MIME_TYPES: {
    PDF: ['application/pdf'],
    IMAGE: [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'image/svg+xml',
    ],
  },
  
  // S3 key prefixes for organization
  KEY_PREFIXES: {
    MENUS: 'menus/',
    RESTAURANTS: 'restaurants/',
    LOGOS: 'restaurants/logos/',
    BANNERS: 'restaurants/banners/',
  },
} as const;

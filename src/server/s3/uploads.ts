import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, S3_CONFIG } from './client';
import { nanoid } from 'nanoid';

/**
 * S3 upload utilities for ScanMenu file management
 * Provides presigned URLs for secure client-side uploads
 */

export type FileType = 'PDF' | 'IMAGE';
export type UploadPurpose = 'menu' | 'logo' | 'banner';

/**
 * File validation result
 */
export interface FileValidation {
  isValid: boolean;
  error?: string;
  fileType?: FileType;
}

/**
 * Presigned upload URL response
 */
export interface PresignedUploadUrl {
  uploadUrl: string;
  key: string;
  publicUrl: string;
  expiresIn: number;
}

/**
 * Validate file based on mime type and size
 */
export function validateFile(
  mimeType: string,
  fileSize: number,
  purpose: UploadPurpose
): FileValidation {
  // Determine file type
  let fileType: FileType;
  
  if ((S3_CONFIG.ALLOWED_MIME_TYPES.PDF as readonly string[]).includes(mimeType)) {
    fileType = 'PDF';
  } else if ((S3_CONFIG.ALLOWED_MIME_TYPES.IMAGE as readonly string[]).includes(mimeType)) {
    fileType = 'IMAGE';
  } else {
    return {
      isValid: false,
      error: `Unsupported file type: ${mimeType}. Allowed types: ${[
        ...S3_CONFIG.ALLOWED_MIME_TYPES.PDF,
        ...S3_CONFIG.ALLOWED_MIME_TYPES.IMAGE,
      ].join(', ')}`,
    };
  }

  // Validate file size
  const maxSize = S3_CONFIG.MAX_FILE_SIZE[fileType];
  if (fileSize > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return {
      isValid: false,
      error: `File size exceeds ${maxSizeMB}MB limit for ${fileType} files`,
    };
  }

  // Validate purpose compatibility
  if (purpose === 'menu' && fileType !== 'PDF') {
    return {
      isValid: false,
      error: 'Menu uploads must be PDF files',
    };
  }

  if ((purpose === 'logo' || purpose === 'banner') && fileType !== 'IMAGE') {
    return {
      isValid: false,
      error: 'Logo and banner uploads must be image files',
    };
  }

  return {
    isValid: true,
    fileType,
  };
}

/**
 * Generate S3 key for file upload
 */
export function generateS3Key(
  purpose: UploadPurpose,
  restaurantId: string,
  fileName: string,
  fileExtension: string
): string {
  const timestamp = Date.now();
  const uniqueId = nanoid(8);
  const sanitizedFileName = fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .toLowerCase();

  switch (purpose) {
    case 'menu':
      return `${S3_CONFIG.KEY_PREFIXES.MENUS}${restaurantId}/${timestamp}_${uniqueId}_${sanitizedFileName}.${fileExtension}`;
    case 'logo':
      return `${S3_CONFIG.KEY_PREFIXES.LOGOS}${restaurantId}/${timestamp}_${uniqueId}_${sanitizedFileName}.${fileExtension}`;
    case 'banner':
      return `${S3_CONFIG.KEY_PREFIXES.BANNERS}${restaurantId}/${timestamp}_${uniqueId}_${sanitizedFileName}.${fileExtension}`;
    default:
      throw new Error(`Invalid upload purpose: ${purpose}`);
  }
}

/**
 * Generate presigned URL for file upload
 */
export async function generatePresignedUploadUrl(
  purpose: UploadPurpose,
  restaurantId: string,
  fileName: string,
  mimeType: string,
  fileSize: number
): Promise<PresignedUploadUrl> {
  // Validate file
  const validation = validateFile(mimeType, fileSize, purpose);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  // Generate file extension from mime type
  const fileExtension = mimeType.split('/')[1] || 'bin';
  
  // Generate S3 key
  const key = generateS3Key(purpose, restaurantId, fileName, fileExtension);

  // Create presigned URL
  const command = new PutObjectCommand({
    Bucket: S3_CONFIG.BUCKET_NAME,
    Key: key,
    ContentType: mimeType,
    ContentLength: fileSize,
    // Add metadata for tracking
    Metadata: {
      purpose,
      restaurantId,
      originalFileName: fileName,
      uploadedAt: new Date().toISOString(),
    },
  });

  const expiresIn = 3600; // 1 hour
  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn });

  // Generate public URL
  const publicUrl = `https://${S3_CONFIG.BUCKET_NAME}.s3.${S3_CONFIG.REGION}.amazonaws.com/${key}`;

  return {
    uploadUrl,
    key,
    publicUrl,
    expiresIn,
  };
}

/**
 * Delete file from S3
 */
export async function deleteS3File(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: S3_CONFIG.BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
}

/**
 * Get public URL for S3 object
 */
export function getS3PublicUrl(key: string): string {
  return `https://${S3_CONFIG.BUCKET_NAME}.s3.${S3_CONFIG.REGION}.amazonaws.com/${key}`;
}

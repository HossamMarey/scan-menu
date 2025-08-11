'use client';

/**
 * Client-side upload utilities for ScanMenu
 * Handles file uploads to S3 via presigned URLs
 */

export interface UploadOptions {
  file: File;
  purpose: 'menu' | 'logo' | 'banner';
  restaurantId: string;
  menuId?: string;
  onProgress?: (progress: number) => void;
}

export interface UploadResult {
  success: boolean;
  key?: string;
  publicUrl?: string;
  error?: string;
}

/**
 * Upload file to S3 using presigned URL
 */
export async function uploadFile(options: UploadOptions): Promise<UploadResult> {
  const { file, purpose, restaurantId, menuId, onProgress } = options;

  try {
    // Step 1: Get presigned URL
    onProgress?.(10);
    
    const presignedResponse = await fetch('/api/uploads/presigned-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        purpose,
        restaurantId,
      }),
    });

    if (!presignedResponse.ok) {
      const error = await presignedResponse.json();
      throw new Error(error.error || 'Failed to get upload URL');
    }

    const { data: presignedData } = await presignedResponse.json();
    onProgress?.(20);

    // Step 2: Upload file to S3
    const uploadResponse = await fetch(presignedData.uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.statusText}`);
    }

    onProgress?.(80);

    // Step 3: Complete upload (notify our backend)
    const completeResponse = await fetch('/api/uploads/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: presignedData.key,
        purpose,
        restaurantId,
        menuId,
      }),
    });

    if (!completeResponse.ok) {
      const error = await completeResponse.json();
      throw new Error(error.error || 'Failed to complete upload');
    }

    const { data: completeData } = await completeResponse.json();
    onProgress?.(100);

    return {
      success: true,
      key: completeData.key,
      publicUrl: completeData.publicUrl,
    };

  } catch (error) {
    console.error('❌ Upload failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Validate file before upload
 */
export function validateFileForUpload(
  file: File,
  purpose: 'menu' | 'logo' | 'banner'
): { isValid: boolean; error?: string } {
  // File size limits
  const maxSizes = {
    menu: 20 * 1024 * 1024, // 20MB for PDFs
    logo: 5 * 1024 * 1024,  // 5MB for images
    banner: 5 * 1024 * 1024, // 5MB for images
  };

  // Allowed mime types
  const allowedTypes = {
    menu: ['application/pdf'],
    logo: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'],
    banner: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'],
  };

  // Check file size
  if (file.size > maxSizes[purpose]) {
    const maxSizeMB = Math.round(maxSizes[purpose] / (1024 * 1024));
    return {
      isValid: false,
      error: `File size exceeds ${maxSizeMB}MB limit for ${purpose} uploads`,
    };
  }

  // Check file type
  if (!allowedTypes[purpose].includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type for ${purpose}. Allowed types: ${allowedTypes[purpose].join(', ')}`,
    };
  }

  return { isValid: true };
}

import { NextRequest, NextResponse } from 'next/server';
import { generatePresignedUploadUrl, UploadPurpose } from '@/server/s3/uploads';
import { getCurrentUser } from '@/server/auth/utils';

/**
 * API route for generating presigned upload URLs
 * POST /api/uploads/presigned-url
 */

interface PresignedUrlRequest {
  fileName: string;
  mimeType: string;
  fileSize: number;
  purpose: UploadPurpose;
  restaurantId: string;
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: PresignedUrlRequest = await request.json();
    const { fileName, mimeType, fileSize, purpose, restaurantId } = body;

    // Validate required fields
    if (!fileName || !mimeType || !fileSize || !purpose || !restaurantId) {
      return NextResponse.json(
        { error: 'Missing required fields: fileName, mimeType, fileSize, purpose, restaurantId' },
        { status: 400 }
      );
    }

    // TODO: Validate user owns the restaurant (Phase 5)
    // For now, we'll skip this validation until restaurant management is implemented

    // Generate presigned URL
    const presignedData = await generatePresignedUploadUrl(
      purpose,
      restaurantId,
      fileName,
      mimeType,
      fileSize
    );

    return NextResponse.json({
      success: true,
      data: presignedData,
    });

  } catch (error) {
    console.error('❌ Error generating presigned URL:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to generate upload URL',
        success: false,
      },
      { status: 500 }
    );
  }
}

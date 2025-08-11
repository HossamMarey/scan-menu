import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/server/auth/utils';
import { getS3PublicUrl } from '@/server/s3/uploads';

/**
 * API route for completing file uploads
 * POST /api/uploads/complete
 * Called after successful S3 upload to update database records
 */

interface CompleteUploadRequest {
  key: string;
  purpose: string;
  restaurantId: string;
  menuId?: string; // For menu PDF uploads
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
    const body: CompleteUploadRequest = await request.json();
    const { key, purpose, restaurantId, menuId } = body;

    // Validate required fields
    if (!key || !purpose || !restaurantId) {
      return NextResponse.json(
        { error: 'Missing required fields: key, purpose, restaurantId' },
        { status: 400 }
      );
    }

    // Generate public URL
    const publicUrl = getS3PublicUrl(key);

    // TODO: Update database records based on purpose (Phase 5)
    // For now, we'll just return the upload information
    // In Phase 5, we'll update Menu.pdfKey, Restaurant.logoKey, etc.

    console.log(`✅ File upload completed:`, {
      key,
      purpose,
      restaurantId,
      menuId,
      publicUrl,
      userId: user._id,
    });

    return NextResponse.json({
      success: true,
      data: {
        key,
        publicUrl,
        purpose,
        restaurantId,
        menuId,
      },
    });

  } catch (error) {
    console.error('❌ Error completing upload:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to complete upload',
        success: false,
      },
      { status: 500 }
    );
  }
}

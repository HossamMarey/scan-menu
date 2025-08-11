'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { uploadFile, validateFileForUpload, UploadOptions } from '@/lib/uploads/client';
import { useTranslations } from 'next-intl';

/**
 * File upload component for ScanMenu
 * Handles PDF menu uploads and restaurant branding assets
 */
interface FileUploadProps {
  purpose: 'menu' | 'logo' | 'banner';
  restaurantId: string;
  menuId?: string;
  onUploadComplete?: (result: { key: string; publicUrl: string }) => void;
  onUploadError?: (error: string) => void;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
}

export function FileUpload({
  purpose,
  restaurantId,
  menuId,
  onUploadComplete,
  onUploadError,
  accept,
  maxSizeMB,
  className = '',
}: FileUploadProps) {
  const t = useTranslations('uploads');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Default accept types based on purpose
  const defaultAccept = {
    menu: '.pdf',
    logo: '.jpg,.jpeg,.png,.webp,.svg',
    banner: '.jpg,.jpeg,.png,.webp,.svg',
  };

  // Default max sizes
  const defaultMaxSizes = {
    menu: 20,
    logo: 5,
    banner: 5,
  };

  const acceptTypes = accept || defaultAccept[purpose];
  const maxSize = maxSizeMB || defaultMaxSizes[purpose];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateFileForUpload(file, purpose);
    if (!validation.isValid) {
      onUploadError?.(validation.error || 'Invalid file');
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    const uploadOptions: UploadOptions = {
      file: selectedFile,
      purpose,
      restaurantId,
      menuId,
      onProgress: setUploadProgress,
    };

    const result = await uploadFile(uploadOptions);

    if (result.success && result.key && result.publicUrl) {
      onUploadComplete?.({
        key: result.key,
        publicUrl: result.publicUrl,
      });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else {
      onUploadError?.(result.error || 'Upload failed');
    }

    setIsUploading(false);
    setUploadProgress(0);
  };

  const handleCancel = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* File Input */}
      <div className="flex flex-col space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptTypes}
          onChange={handleFileSelect}
          disabled={isUploading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
        />
        <p className="text-xs text-gray-500">
          {t('maxSize', { size: maxSize })} • {t('allowedTypes', { types: acceptTypes })}
        </p>
      </div>

      {/* Selected File Info */}
      {selectedFile && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={handleUpload}
                disabled={isUploading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isUploading ? t('uploading') : t('upload')}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                disabled={isUploading}
              >
                {t('cancel')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{t('uploading')}</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

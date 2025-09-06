import { put, del, list, ListBlobResultBlob } from '@vercel/blob';
import { Readable } from 'stream';

export interface UploadResult {
  url: string;
  pathname: string;
  contentType: string;
  size: number;
}

export interface DeleteResult {
  success: boolean;
}

export class BlobService {
  private static instance: BlobService;

  private constructor() {}

  public static getInstance(): BlobService {
    if (!BlobService.instance) {
      BlobService.instance = new BlobService();
    }
    return BlobService.instance;
  }

  /**
   * Upload a file to Vercel Blob
   */
  async uploadFile(
    file: File | Buffer | Readable,
    filename: string,
    options?: {
      contentType?: string;
      access?: 'public' | 'private';
      addRandomSuffix?: boolean;
    }
  ): Promise<UploadResult> {
    try {
      const blob = await put(filename, file, {
        access: (options?.access || 'public') as 'public',
        addRandomSuffix: options?.addRandomSuffix ?? true,
        contentType: options?.contentType,
      });

      return {
        url: blob.url,
        pathname: blob.pathname,
        contentType: blob.contentType,
        size: 0, // Vercel blob doesn't return size in PutBlobResult
      };
    } catch (error) {
      console.error('Error uploading file to blob:', error);
      throw new Error('Failed to upload file');
    }
  }

  /**
   * Upload an image file
   */
  async uploadImage(
    file: File | Buffer | Readable,
    filename?: string
  ): Promise<UploadResult> {
    const timestamp = Date.now();
    const imageFilename = filename || `images/${timestamp}-${Math.random().toString(36).substring(7)}.jpg`;
    
    return this.uploadFile(file, imageFilename, {
      contentType: 'image/jpeg',
      access: 'public',
      addRandomSuffix: true,
    });
  }

  /**
   * Upload a video file
   */
  async uploadVideo(
    file: File | Buffer | Readable,
    filename?: string
  ): Promise<UploadResult> {
    const timestamp = Date.now();
    const videoFilename = filename || `videos/${timestamp}-${Math.random().toString(36).substring(7)}.mp4`;
    
    return this.uploadFile(file, videoFilename, {
      contentType: 'video/mp4',
      access: 'public',
      addRandomSuffix: true,
    });
  }

  /**
   * Upload a document file
   */
  async uploadDocument(
    file: File | Buffer | Readable,
    filename?: string,
    contentType?: string
  ): Promise<UploadResult> {
    const timestamp = Date.now();
    const documentFilename = filename || `documents/${timestamp}-${Math.random().toString(36).substring(7)}.pdf`;
    
    return this.uploadFile(file, documentFilename, {
      contentType: contentType || 'application/pdf',
      access: 'public',
      addRandomSuffix: true,
    });
  }

  /**
   * Delete a file from Vercel Blob
   */
  async deleteFile(url: string): Promise<DeleteResult> {
    try {
      await del(url);
      return { success: true };
    } catch (error) {
      console.error('Error deleting file from blob:', error);
      return { success: false };
    }
  }

  /**
   * List files in a directory
   */
  async listFiles(prefix?: string): Promise<ListBlobResultBlob[]> {
    try {
      const { blobs } = await list({ prefix });
      return blobs;
    } catch (error) {
      console.error('Error listing files from blob:', error);
      throw new Error('Failed to list files');
    }
  }

  /**
   * Generate a unique filename
   */
  generateFilename(originalName: string, prefix?: string): string {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(7);
    const extension = originalName.split('.').pop() || 'bin';
    const baseName = originalName.split('.')[0] || 'file';
    
    const sanitizedBaseName = baseName
      .replace(/[^a-zA-Z0-9]/g, '_')
      .toLowerCase();
    
    const filename = `${sanitizedBaseName}-${timestamp}-${randomSuffix}.${extension}`;
    
    return prefix ? `${prefix}/${filename}` : filename;
  }

  /**
   * Get content type from file extension
   */
  getContentType(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    const mimeTypes: Record<string, string> = {
      // Images
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
      
      // Videos
      'mp4': 'video/mp4',
      'avi': 'video/x-msvideo',
      'mov': 'video/quicktime',
      'wmv': 'video/x-ms-wmv',
      'flv': 'video/x-flv',
      'webm': 'video/webm',
      
      // Documents
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'txt': 'text/plain',
      
      // Audio
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'ogg': 'audio/ogg',
      
      // Archives
      'zip': 'application/zip',
      'rar': 'application/x-rar-compressed',
      '7z': 'application/x-7z-compressed',
    };
    
    return mimeTypes[extension || ''] || 'application/octet-stream';
  }

  /**
   * Validate file size
   */
  validateFileSize(size: number, maxSize: number = 10 * 1024 * 1024): boolean {
    return size <= maxSize;
  }

  /**
   * Validate file type
   */
  validateFileType(filename: string, allowedTypes: string[]): boolean {
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension ? allowedTypes.includes(extension) : false;
  }
}

// Export singleton instance
export const blobService = BlobService.getInstance();

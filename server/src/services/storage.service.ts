import { supabaseAdmin } from '../config/supabase';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const BUCKET_NAME = 'issue-photos';

export class StorageService {
  /**
   * Upload a photo to Supabase Storage
   * @param file - Buffer containing the file data
   * @param fileName - Original file name
   * @param mimeType - MIME type of the file
   * @param userId - User ID for file path
   * @returns Public URL of uploaded photo
   */
  static async uploadPhoto(
    file: Buffer,
    fileName: string,
    mimeType: string,
    userId: string
  ): Promise<string> {
    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new Error(`Invalid file type: ${mimeType}. Allowed: JPEG, PNG, WebP`);
    }

    // Validate file size
    if (file.length > MAX_FILE_SIZE) {
      throw new Error(`File too large: ${file.length} bytes. Max: ${MAX_FILE_SIZE} bytes`);
    }

    // Generate unique file path
    const extension = fileName.split('.').pop() || 'jpg';
    const timestamp = Date.now();
    const uniqueName = `${userId}/${timestamp}.${extension}`;

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(uniqueName, file, {
        contentType: mimeType,
        upsert: false,
      });

    if (error) {
      throw new Error(`Failed to upload photo: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  }
}
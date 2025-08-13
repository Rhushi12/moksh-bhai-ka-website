// Google Drive Configuration and Helpers
// This file contains configuration settings and utility functions for Google Drive integration

// Configuration constants
export const GOOGLE_DRIVE_CONFIG = {
  // API endpoints
  API_BASE_URL: 'https://www.googleapis.com/drive/v3',
  UPLOAD_URL: 'https://www.googleapis.com/upload/drive/v3/files',
  
  // File settings
  MAX_FILE_SIZE: 2 * 1024 * 1024 * 1024, // 2GB
  SUPPORTED_VIDEO_TYPES: [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/avi',
    'video/mov',
    'video/wmv',
    'video/flv'
  ],
  
  // Upload settings
  CHUNK_SIZE: 5 * 1024 * 1024, // 5MB chunks
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
  
  // Video compression settings
  COMPRESSION_TARGET_SIZE: 25 * 1024 * 1024, // 25MB
  COMPRESSION_QUALITY: 0.8,
  
  // Cache settings
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  MAX_CACHE_SIZE: 100 // Maximum number of cached items
};

// Utility functions
export const googleDriveUtils = {
  // Check if file is a supported video type
  isSupportedVideoType(mimeType) {
    return GOOGLE_DRIVE_CONFIG.SUPPORTED_VIDEO_TYPES.includes(mimeType);
  },

  // Check if file size is within limits
  isFileSizeValid(fileSize) {
    return fileSize <= GOOGLE_DRIVE_CONFIG.MAX_FILE_SIZE;
  },

  // Generate unique file name
  generateFileName(diamondId, originalName) {
    const timestamp = Date.now();
    const extension = originalName.split('.').pop();
    return `${diamondId}_${timestamp}.${extension}`;
  },

  // Format file size for display
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Get video duration (if available)
  async getVideoDuration(file) {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      
      video.onerror = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(null);
      };
      
      video.src = URL.createObjectURL(file);
    });
  },

  // Compress video if needed
  async compressVideo(file, targetSize = GOOGLE_DRIVE_CONFIG.COMPRESSION_TARGET_SIZE) {
    if (file.size <= targetSize) {
      return file;
    }

    try {
      console.log('🎬 Compressing video...');
      
      // Create video element for compression
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set up video
      video.src = URL.createObjectURL(file);
      await new Promise((resolve) => {
        video.onloadedmetadata = resolve;
      });
      
      // Calculate compression ratio
      const compressionRatio = targetSize / file.size;
      const quality = Math.max(0.1, compressionRatio * GOOGLE_DRIVE_CONFIG.COMPRESSION_QUALITY);
      
      // Set canvas dimensions
      canvas.width = video.videoWidth * quality;
      canvas.height = video.videoHeight * quality;
      
      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to blob
      const compressedBlob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'video/mp4', quality);
      });
      
      // Clean up
      URL.revokeObjectURL(video.src);
      
      console.log('✅ Video compressed successfully');
      return new File([compressedBlob], file.name, { type: 'video/mp4' });
    } catch (error) {
      console.error('❌ Video compression failed:', error);
      return file; // Return original file if compression fails
    }
  },

  // Create video thumbnail
  async createVideoThumbnail(file) {
    try {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      video.src = URL.createObjectURL(file);
      await new Promise((resolve) => {
        video.onloadedmetadata = resolve;
      });
      
      // Seek to 1 second or 25% of duration
      video.currentTime = Math.min(1, video.duration * 0.25);
      
      await new Promise((resolve) => {
        video.onseeked = resolve;
      });
      
      // Set canvas dimensions
      canvas.width = 320;
      canvas.height = 240;
      
      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to blob
      const thumbnailBlob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.8);
      });
      
      // Clean up
      URL.revokeObjectURL(video.src);
      
      return thumbnailBlob;
    } catch (error) {
      console.error('❌ Failed to create video thumbnail:', error);
      return null;
    }
  },

  // Validate video file
  validateVideoFile(file) {
    const errors = [];
    
    // Check file type
    if (!this.isSupportedVideoType(file.type)) {
      errors.push(`Unsupported video type: ${file.type}`);
    }
    
    // Check file size
    if (!this.isFileSizeValid(file.size)) {
      errors.push(`File size too large: ${this.formatFileSize(file.size)}`);
    }
    
    // Check if file is empty
    if (file.size === 0) {
      errors.push('File is empty');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Get video metadata
  async getVideoMetadata(file) {
    const duration = await this.getVideoDuration(file);
    const thumbnail = await this.createVideoThumbnail(file);
    
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      duration,
      thumbnail,
      lastModified: file.lastModified
    };
  },

  // Cache management
  cache: new Map(),
  
  // Set cache item
  setCacheItem(key, value, ttl = GOOGLE_DRIVE_CONFIG.CACHE_DURATION) {
    if (this.cache.size >= GOOGLE_DRIVE_CONFIG.MAX_CACHE_SIZE) {
      // Remove oldest item
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl
    });
  },
  
  // Get cache item
  getCacheItem(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  },
  
  // Clear cache
  clearCache() {
    this.cache.clear();
  },
  
  // Clean expired cache items
  cleanCache() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
};

// Error handling
export class GoogleDriveError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = 'GoogleDriveError';
    this.code = code;
    this.details = details;
  }
}

// Error codes
export const GOOGLE_DRIVE_ERROR_CODES = {
  INITIALIZATION_FAILED: 'INITIALIZATION_FAILED',
  AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
  DOWNLOAD_FAILED: 'DOWNLOAD_FAILED',
  FILE_NOT_FOUND: 'FILE_NOT_FOUND',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  INVALID_FILE: 'INVALID_FILE',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

// Error messages
export const GOOGLE_DRIVE_ERROR_MESSAGES = {
  [GOOGLE_DRIVE_ERROR_CODES.INITIALIZATION_FAILED]: 'Failed to initialize Google Drive API',
  [GOOGLE_DRIVE_ERROR_CODES.AUTHENTICATION_FAILED]: 'Authentication failed. Please sign in again.',
  [GOOGLE_DRIVE_ERROR_CODES.UPLOAD_FAILED]: 'Failed to upload video to Google Drive',
  [GOOGLE_DRIVE_ERROR_CODES.DOWNLOAD_FAILED]: 'Failed to download video from Google Drive',
  [GOOGLE_DRIVE_ERROR_CODES.FILE_NOT_FOUND]: 'Video file not found',
  [GOOGLE_DRIVE_ERROR_CODES.PERMISSION_DENIED]: 'Permission denied. Please check file permissions.',
  [GOOGLE_DRIVE_ERROR_CODES.QUOTA_EXCEEDED]: 'Storage quota exceeded. Please free up space.',
  [GOOGLE_DRIVE_ERROR_CODES.INVALID_FILE]: 'Invalid video file. Please check file type and size.',
  [GOOGLE_DRIVE_ERROR_CODES.NETWORK_ERROR]: 'Network error. Please check your connection.',
  [GOOGLE_DRIVE_ERROR_CODES.UNKNOWN_ERROR]: 'An unknown error occurred.'
};

// Helper function to create errors
export const createGoogleDriveError = (code, details = {}) => {
  const message = GOOGLE_DRIVE_ERROR_MESSAGES[code] || GOOGLE_DRIVE_ERROR_MESSAGES[GOOGLE_DRIVE_ERROR_CODES.UNKNOWN_ERROR];
  return new GoogleDriveError(message, code, details);
};

export default {
  GOOGLE_DRIVE_CONFIG,
  googleDriveUtils,
  GoogleDriveError,
  GOOGLE_DRIVE_ERROR_CODES,
  GOOGLE_DRIVE_ERROR_MESSAGES,
  createGoogleDriveError
};












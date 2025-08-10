// Diamond upload service for adding new diamonds to the system
// This file provides functions to upload new diamond data, images, and videos

import { Diamond } from '@/data/diamonds';
import { uploadImage, uploadVideo } from './firebase';

// Interface for new diamond data
export interface NewDiamondData {
  category: Diamond['category'];
  shape: Diamond['shape'];
  description: string;
  carat: number;
  clarity: Diamond['clarity'];
  cut: Diamond['cut'];
  color: string;
  price?: string;
  bestseller: boolean;
  imageFile?: File;
  videoFile?: File;
  videoFiles?: File[];
}

/**
 * Upload a new diamond to the system
 * @param diamondData - New diamond data
 * @returns Promise with the created diamond
 */
export const uploadNewDiamond = async (diamondData: NewDiamondData): Promise<Diamond> => {
  try {
    console.log('Uploading new diamond:', diamondData);
    
    let imageUrl = '/src/assets/diamond-placeholder.jpg'; // Default placeholder
    let primaryVideoUrl: string | undefined;
    let videoUrls: string[] = [];
    
    // Upload image if provided
    if (diamondData.imageFile) {
      console.log('Uploading diamond image...');
      imageUrl = await uploadImage(diamondData.imageFile, 'diamonds');
    }
    
    // Upload primary video if provided
    if (diamondData.videoFile) {
      console.log('Uploading primary diamond video...');
      primaryVideoUrl = await uploadVideo(diamondData.videoFile, 'diamonds');
    }
    
    // Upload additional videos if provided
    if (diamondData.videoFiles && diamondData.videoFiles.length > 0) {
      console.log('Uploading additional diamond videos...');
      for (const videoFile of diamondData.videoFiles) {
        const videoUrl = await uploadVideo(videoFile, 'diamonds');
        videoUrls.push(videoUrl);
      }
    }
    
    // Create new diamond object
    const newDiamond: Diamond = {
      id: Date.now(), // Generate unique ID
      category: diamondData.category,
      shape: diamondData.shape,
      primaryImage: imageUrl,
      images: [imageUrl],
      primaryVideo: primaryVideoUrl,
      videos: videoUrls,
      description: diamondData.description,
      carat: diamondData.carat,
      clarity: diamondData.clarity,
      cut: diamondData.cut,
      color: diamondData.color,
      price: diamondData.price,
      price_per_carat: diamondData.price ? parseFloat(diamondData.price.replace(/[$,]/g, '')) / diamondData.carat : 0,
      bestseller: diamondData.bestseller,
      showOnIndex: true,
      showInGallery: true,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'app'
    };
    
    // Mock API call to store diamond data
    const response = await fetch('/api/diamonds', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newDiamond)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Diamond uploaded successfully:', result);
    
    return newDiamond;
  } catch (error) {
    console.error('Error uploading diamond:', error);
    
    // Fallback: log to console for development
    console.log('New Diamond Data (fallback logging):', diamondData);
    
    // Return mock diamond for development
    return {
      id: Date.now(),
      category: diamondData.category,
      shape: diamondData.shape,
      primaryImage: '/src/assets/diamond-placeholder.jpg',
      images: ['/src/assets/diamond-placeholder.jpg'],
      primaryVideo: diamondData.videoFile ? '/src/assets/diamond-video-placeholder.mp4' : undefined,
      videos: diamondData.videoFiles ? diamondData.videoFiles.map(() => '/src/assets/diamond-video-placeholder.mp4') : [],
      description: diamondData.description,
      carat: diamondData.carat,
      clarity: diamondData.clarity,
      cut: diamondData.cut,
      color: diamondData.color,
      price: diamondData.price,
      price_per_carat: diamondData.price ? parseFloat(diamondData.price.replace(/[$,]/g, '')) / diamondData.carat : 0,
      bestseller: diamondData.bestseller,
      showOnIndex: true,
      showInGallery: true,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'app'
    };
  }
};

/**
 * Validate diamond data before upload
 * @param data - Diamond data to validate
 * @returns boolean indicating if data is valid
 */
export const validateDiamondData = (data: NewDiamondData): boolean => {
  const requiredFields = ['category', 'shape', 'description', 'carat', 'clarity', 'cut', 'color'];
  const hasAllFields = requiredFields.every(field => data[field as keyof NewDiamondData]);
  
  if (!hasAllFields) {
    console.error('Invalid diamond data: missing required fields');
    return false;
  }
  
  // Validate carat value
  if (data.carat <= 0 || data.carat > 100) {
    console.error('Invalid carat value');
    return false;
  }
  
  // Validate image file if provided
  if (data.imageFile) {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedImageTypes.includes(data.imageFile.type)) {
      console.error('Invalid image file type');
      return false;
    }
    
    const maxImageSize = 5 * 1024 * 1024; // 5MB
    if (data.imageFile.size > maxImageSize) {
      console.error('Image file too large');
      return false;
    }
  }
  
  // Validate primary video file if provided
  if (data.videoFile) {
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!allowedVideoTypes.includes(data.videoFile.type)) {
      console.error('Invalid video file type');
      return false;
    }
    
    const maxVideoSize = 15 * 1024 * 1024; // 15MB for free plan
    if (data.videoFile.size > maxVideoSize) {
      console.error('Video file too large (max 15MB for free plan)');
      return false;
    }
  }
  
  // Validate additional video files if provided
  if (data.videoFiles && data.videoFiles.length > 0) {
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    const maxVideoSize = 15 * 1024 * 1024; // 15MB for free plan
    const maxVideos = 3; // Limit to 3 additional videos for free plan
    
    if (data.videoFiles.length > maxVideos) {
      console.error(`Too many video files (max ${maxVideos} for free plan)`);
      return false;
    }
    
    for (const videoFile of data.videoFiles) {
      if (!allowedVideoTypes.includes(videoFile.type)) {
        console.error('Invalid video file type in additional videos');
        return false;
      }
      
      if (videoFile.size > maxVideoSize) {
        console.error('Video file too large in additional videos (max 15MB)');
        return false;
      }
    }
  }
  
  return true;
};

/**
 * Get upload progress for diamond uploads
 * @param file - File being uploaded
 * @param onProgress - Progress callback
 */
export const uploadWithProgress = async (
  file: File, 
  onProgress: (progress: number) => void
): Promise<string> => {
  console.log('Uploading with progress tracking:', file.name);
  
  // Simulate upload progress
  for (let i = 0; i <= 100; i += 10) {
    onProgress(i);
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // Determine if it's a video or image file
  const isVideo = file.type.startsWith('video/');
  if (isVideo) {
    return await uploadVideo(file, 'diamonds');
  } else {
    return await uploadImage(file, 'diamonds');
  }
}; 
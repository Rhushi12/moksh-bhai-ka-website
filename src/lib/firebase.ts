// Firebase configuration and real-time data integration
// This file provides Firebase setup and real-time listeners for diamond data

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import googleDriveService from '@/services/googleDriveService';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADTRiHPNC3DSFdQ8u0WsYv2FWZkdDjCjI",
  authDomain: "moksh-46904.firebaseapp.com",
  projectId: "moksh-46904",
  storageBucket: "moksh-46904.firebasestorage.app",
  messagingSenderId: "124955720743",
  appId: "1:124955720743:web:72c3647f05f677930f6202",
  measurementId: "G-7BDGDVG097"
};

// Initialize Firebase with proper types
import type { FirebaseApp } from 'firebase/app';
import type { Analytics } from 'firebase/analytics';
import type { Firestore } from 'firebase/firestore';
import type { FirebaseStorage } from 'firebase/storage';

let app: FirebaseApp | null = null;
let analytics: Analytics | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

try {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized successfully');
  
  // Initialize Analytics only in browser environment
  if (typeof window !== 'undefined') {
    try {
      analytics = getAnalytics(app);
      console.log('✅ Firebase Analytics initialized');
    } catch (error) {
      console.warn('⚠️ Analytics initialization failed:', error);
    }
  }
  
  // Initialize Firestore
  db = getFirestore(app);
  console.log('✅ Firestore initialized successfully');
  
  // Initialize Storage
  storage = getStorage(app);
  console.log('✅ Firebase Storage initialized successfully');
  
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  // Keep null values for type safety
  app = null;
  analytics = null;
  db = null;
  storage = null;
}

export { app, analytics, db, storage };

// New function to get videos for a diamond (Google Drive integration)
export const getDiamondVideos = async (diamondId: string): Promise<any[]> => {
  try {
    console.log('🎥 Getting videos for diamond:', diamondId);
    
    // Try Google Drive first
    try {
      const videos = await googleDriveService.getDiamondVideos(diamondId);
      if (videos && videos.length > 0) {
        console.log('✅ Found videos in Google Drive:', videos.length);
        return videos;
      }
    } catch (error) {
      console.warn('⚠️ Google Drive not available, trying Firestore:', error);
    }
    
    // Fallback to Firestore if Google Drive fails
    if (!db) {
      console.warn('⚠️ Firestore not available, returning empty videos array');
      return [];
    }

    // Query the diamond_videos collection for videos belonging to this diamond
    const videosCollection = collection(db, 'diamond_videos');
    const q = query(videosCollection, where('diamondId', '==', diamondId));
    const snapshot = await getDocs(q);
    
    const videos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log('🎥 Found videos in Firestore:', videos.length);
    return videos;
  } catch (error) {
    console.error('❌ Error getting diamond videos:', error);
    return [];
  }
};

// New function to get a single video by ID (Google Drive integration)
export const getVideoById = async (videoId: string): Promise<any | null> => {
  try {
    console.log('🎥 Getting video by ID:', videoId);
    
    // Try Google Drive first
    try {
      const video = await googleDriveService.getVideo(videoId);
      if (video) {
        console.log('✅ Found video in Google Drive:', video.id);
        return video;
      }
    } catch (error) {
      console.warn('⚠️ Google Drive not available, trying Firestore:', error);
    }
    
    // Fallback to Firestore if Google Drive fails
    if (!db) {
      console.warn('⚠️ Firestore not available, returning null');
      return null;
    }

    const videoDoc = doc(db, 'diamond_videos', videoId);
    const videoSnapshot = await getDoc(videoDoc);
    
    if (videoSnapshot.exists()) {
      const videoData = {
        id: videoSnapshot.id,
        ...videoSnapshot.data()
      };
      console.log('🎥 Found video in Firestore:', videoData.id);
      return videoData;
    } else {
      console.warn('⚠️ Video not found:', videoId);
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting video by ID:', error);
    return null;
  }
};

// Function to load videos for diamonds and attach them to the diamond objects (Google Drive integration)
export const loadVideosForDiamonds = async (diamonds: any[]): Promise<any[]> => {
  try {
    console.log('🎥 Loading videos for diamonds:', diamonds.length);
    
    const diamondsWithVideos = await Promise.all(
      diamonds.map(async (diamond) => {
        // Check if diamond has video references
        if (diamond.videoRefs && Array.isArray(diamond.videoRefs) && diamond.videoRefs.length > 0) {
          console.log('🎥 Loading videos for diamond:', diamond.id, 'Video refs:', diamond.videoRefs);
          
          // Load all videos for this diamond
          const videos = await Promise.all(
            diamond.videoRefs.map(async (videoId: string) => {
              const video = await getVideoById(videoId);
              return video;
            })
          );
          
          // Filter out null videos (failed to load)
          const validVideos = videos.filter(video => video !== null);
          
          // Set videos array and primary video for backward compatibility
          const videosArray = validVideos.map(video => {
            // Handle both Google Drive and Firestore video formats
            if (video.webContentLink) {
              // Google Drive format
              return video.webContentLink;
            } else if (video.videoData || video.videoUrl) {
              // Firestore format
              return video.videoData || video.videoUrl;
            } else {
              return '';
            }
          });
          
          const primaryVideo = diamond.primaryVideoRef 
            ? validVideos.find(video => video.id === diamond.primaryVideoRef)?.webContentLink || validVideos[0]?.webContentLink || ''
            : validVideos[0]?.webContentLink || '';
          
          return {
            ...diamond,
            videos: videosArray,
            primaryVideo: primaryVideo,
            // Keep the original references for future use
            videoRefs: diamond.videoRefs,
            primaryVideoRef: diamond.primaryVideoRef
          };
        } else {
          // No video references, return diamond as is
          return {
            ...diamond,
            videos: diamond.videos || [],
            primaryVideo: diamond.primaryVideo || ''
          };
        }
      })
    );
    
    console.log('🎥 Successfully loaded videos for diamonds');
    return diamondsWithVideos;
  } catch (error) {
    console.error('❌ Error loading videos for diamonds:', error);
    return diamonds;
  }
};

// New function to upload video to Google Drive
export const uploadVideoToGoogleDrive = async (file: File, diamondId: string, options: any = {}) => {
  try {
    console.log('🎥 Uploading video to Google Drive:', file.name);
    
    // Initialize Google Drive service
    const isInitialized = await googleDriveService.initialize();
    if (!isInitialized) {
      throw new Error('Failed to initialize Google Drive service');
    }
    
    // Upload video to Google Drive
    const result = await googleDriveService.uploadVideo(file, diamondId, options);
    
    console.log('✅ Video uploaded to Google Drive successfully:', result.id);
    return result;
  } catch (error) {
    console.error('❌ Failed to upload video to Google Drive:', error);
    throw error;
  }
};

// New function to delete video from Google Drive
export const deleteVideoFromGoogleDrive = async (videoId: string) => {
  try {
    console.log('🗑️ Deleting video from Google Drive:', videoId);
    
    // Initialize Google Drive service
    const isInitialized = await googleDriveService.initialize();
    if (!isInitialized) {
      throw new Error('Failed to initialize Google Drive service');
    }
    
    // Delete video from Google Drive
    const result = await googleDriveService.deleteVideo(videoId);
    
    console.log('✅ Video deleted from Google Drive successfully:', videoId);
    return result;
  } catch (error) {
    console.error('❌ Failed to delete video from Google Drive:', error);
    throw error;
  }
};

// Initialize Firebase function (for backward compatibility)
export const initializeFirebase = () => {
  console.log('Firebase initialized with config:', firebaseConfig);
  return {
    firestore: () => ({
      collection: (collectionName: string) => ({
        onSnapshot: (callback: (snapshot: any) => void) => {
          // Real-time listener for diamonds collection
          console.log(`Setting up real-time listener for ${collectionName} collection`);
          
          if (!db || !db.collection) {
            console.warn('⚠️ Firestore not available, using mock data');
            // Fallback to mock data if Firestore is not available
            const interval = setInterval(() => {
              const mockSnapshot = {
                docs: [
                  {
                    id: '1',
                    data: () => ({
                      id: 1,
                      category: 'Investment Diamonds',
                      shape: 'Round',
                      primaryImage: '/diamond-round.jpg',
                      images: ['/diamond-round.jpg'],
                      description: 'A magnificent 3.5-carat round brilliant diamond with exceptional fire and brilliance. This investment-grade stone represents the pinnacle of diamond cutting artistry and is perfect for serious collectors.',
                      carat: 3.5,
                      clarity: 'FL',
                      cut: 'Excellent',
                      color: 'D',
                      price: '$25,000',
                      price_per_carat: 7143,
                      bestseller: true,
                      showOnIndex: true,
                      showInGallery: true,
                      updatedAt: new Date().toISOString(),
                      management: {
                        isManaged: true,
                        managedBy: 'Moksh P Mehta',
                        status: 'active',
                        priority: 'high',
                        tags: ['round', 'brilliant', 'investment']
                      }
                    })
                  }
                ]
              };
              callback(mockSnapshot);
            }, 5000);

            return () => {
              clearInterval(interval);
              console.log('Mock Firebase listener unsubscribed');
            };
          }

          // Use real Firestore
          const collectionRef = collection(db, collectionName);
          return onSnapshot(collectionRef, (snapshot) => {
            console.log(`🔥 Real-time update from Firebase: ${snapshot.docs.length} documents`);
            callback(snapshot);
          }, (error) => {
            console.error('❌ Firebase listener error:', error);
          });
        },
        add: (data: any) => {
          console.log('Adding new document to Firebase:', data);
          if (!db) {
            return Promise.resolve({ id: 'new-doc-id' });
          }
          const collectionRef = collection(db, 'diamonds');
          return addDoc(collectionRef, data);
        },
        update: (id: string, data: any) => {
          console.log('Updating document in Firebase:', id, data);
          if (!db) {
            return Promise.resolve();
          }
          const docRef = doc(db, 'diamonds', id);
          return updateDoc(docRef, data);
        },
        delete: (id: string) => {
          console.log('Deleting document in Firebase:', id);
          if (!db) {
            return Promise.resolve();
          }
          const docRef = doc(db, 'diamonds', id);
          return deleteDoc(docRef);
        }
      })
    })
  };
};

// Mock Firebase storage for image uploads
export const uploadImage = async (file: File, path: string): Promise<string> => {
  console.log('Uploading image to Firebase Storage:', { file: file.name, path });
  
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return mock download URL
  const downloadURL = `https://firebasestorage.googleapis.com/mock/${path}/${file.name}`;
  console.log('Image uploaded successfully:', downloadURL);
  
  return downloadURL;
};

// Mock Firebase storage for video uploads
export const uploadVideo = async (file: File, path: string): Promise<string> => {
  console.log('Uploading video to Firebase Storage:', { file: file.name, path, size: file.size });
  
  // Simulate upload delay (longer for videos)
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Return mock download URL
  const downloadURL = `https://firebasestorage.googleapis.com/mock/${path}/videos/${file.name}`;
  console.log('Video uploaded successfully:', downloadURL);
  
  return downloadURL;
};

// Real-time listener hook for diamonds with comprehensive error handling
import type { Diamond } from '../data/diamonds';

export const useDiamondsListener = (callback: (diamonds: Diamond[]) => void) => {
  console.log('🎯 useDiamondsListener: Creating new listener instance');
  
  if (!db) {
    console.error('❌ Firestore not available - Firebase not initialized properly');
    // Return a no-op cleanup function
    return () => {
      console.log('🎯 useDiamondsListener: No cleanup needed - no listener created');
    };
  }
  
  try {
    // Use real Firestore
    const diamondsCollection = collection(db, 'diamonds');
    console.log('🎯 useDiamondsListener: Setting up listener for diamonds collection');
    
    const unsubscribe = onSnapshot(diamondsCollection, async (snapshot) => {
      console.log('🔥 Real-time update from Firebase:', snapshot.docs.length, 'diamonds');
      
      // Check if we have any documents
      if (snapshot.docs.length === 0) {
        console.warn('⚠️ No diamonds found in Firebase collection');
        callback([]);
        return;
      }
      
      console.log('🔥 Firebase snapshot docs:', snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })));
      
      const diamonds: Diamond[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Ensure all required fields have defaults
          primaryImage: data.primaryImage || data.image || '/diamond-round.jpg',
          images: data.images || [data.primaryImage || data.image || '/diamond-round.jpg'],
          price: data.price || '$0',
          price_per_carat: data.price_per_carat || 0,
          bestseller: data.bestseller ?? false,
          showOnIndex: data.showOnIndex ?? true,
          showInGallery: data.showInGallery ?? true,
          management: data.management || {
            isManaged: false,
            status: 'active',
            priority: 'medium',
            tags: []
          }
        };
      });
      
      console.log('🔥 Processed diamonds from Firebase:', diamonds);
      
      // Load videos for diamonds using the new video storage structure
      try {
        const diamondsWithVideos = await loadVideosForDiamonds(diamonds);
        console.log('🎥 Diamonds with videos loaded:', diamondsWithVideos.length);
        callback(diamondsWithVideos);
      } catch (videoError) {
        console.error('❌ Error loading videos, returning diamonds without videos:', videoError);
        callback(diamonds);
      }
    }, (error) => {
      console.error('❌ Firebase listener error:', error);
      // Call callback with empty array on error
      callback([]);
    });

    return () => {
      unsubscribe();
      console.log('🎯 useDiamondsListener: Real listener cleaned up');
    };
  } catch (error) {
    console.error('❌ Error setting up Firebase listener:', error);
    // Return a no-op cleanup function
    return () => {
      console.log('🎯 useDiamondsListener: No cleanup needed - listener setup failed');
    };
  }
}; 
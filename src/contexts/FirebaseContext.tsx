// Centralized Firebase context to manage diamond data
// This ensures only ONE listener is active at a time across the entire app

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useDiamondsListener, db } from '@/lib/firebase';
import { Diamond } from '@/data/diamonds';
import { getDiamonds } from '@/data/diamonds'; // Import fallback data

interface FirebaseContextType {
  diamonds: Diamond[];
  isLoading: boolean;
  error: string | null;
  isOffline: boolean;
  lastUpdated: Date | null;
  retryConnection: () => void;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

interface FirebaseProviderProps {
  children: ReactNode;
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  console.log('🔥 FirebaseProvider: Component rendering');
  
  const [diamonds, setDiamonds] = useState<Diamond[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Function to load fallback data
  const loadFallbackData = async () => {
    console.log('🔄 Loading fallback diamond data...');
    try {
      const fallbackDiamonds = await getDiamonds();
      setDiamonds(fallbackDiamonds);
      setIsOffline(true);
      setError('Using offline data - Firebase connection unavailable');
      setLastUpdated(new Date());
      console.log('✅ Fallback data loaded successfully:', fallbackDiamonds.length, 'diamonds');
    } catch (fallbackError) {
      console.error('❌ Failed to load fallback data:', fallbackError);
      setError('Unable to load diamond data - please check your connection');
      setDiamonds([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to retry Firebase connection
  const retryConnection = () => {
    console.log('🔄 Retrying Firebase connection...');
    setRetryCount(prev => prev + 1);
    setIsLoading(true);
    setError(null);
    setIsOffline(false);
  };

  // SINGLE LISTENER: This is the only place where useDiamondsListener should be used
  useEffect(() => {
    console.log('🔥 FirebaseProvider: Setting up SINGLE Firebase listener');
    console.log('🔥 FirebaseProvider: Firebase db available:', !!db);
    console.log('🔥 FirebaseProvider: Firebase db type:', typeof db);
    
    // Safety check for db availability
    if (!db) {
      console.error('❌ Firebase db is not available - loading fallback data');
      loadFallbackData();
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setIsOffline(false);
    
    let unsubscribe: (() => void) | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    try {
      // Set a timeout for Firebase connection
      timeoutId = setTimeout(() => {
        console.warn('⚠️ Firebase connection timeout - loading fallback data');
        if (unsubscribe) {
          unsubscribe();
        }
        loadFallbackData();
      }, 10000); // 10 second timeout

      unsubscribe = useDiamondsListener((updatedDiamonds) => {
        console.log('🔥 FirebaseProvider: Received diamond updates:', updatedDiamonds.length, 'diamonds');
        
        // Clear timeout since we received data
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }

        // Check if we received valid data
        if (!updatedDiamonds || updatedDiamonds.length === 0) {
          console.warn('⚠️ No diamonds received from Firebase - loading fallback data');
          loadFallbackData();
          return;
        }

        console.log('🔥 FirebaseProvider: Raw diamonds data:', updatedDiamonds);
        
        // Process diamonds to handle Base64 images and ensure all required fields
        const processedDiamonds = updatedDiamonds.map(diamond => {
          console.log('💎 Processing diamond:', {
            id: diamond.id,
            shape: diamond.shape,
            primaryImage: diamond.primaryImage,
            imagesCount: diamond.images?.length,
            hasBase64: diamond.primaryImage?.startsWith('data:image')
          });
          
          return {
            ...diamond,
            // Ensure images are properly formatted for display
            primaryImage: diamond.primaryImage || '/diamond-round.jpg',
            images: diamond.images && diamond.images.length > 0 ? diamond.images : ['/diamond-round.jpg'],
            // Ensure required fields have defaults
            price: diamond.price || '$0',
            price_per_carat: diamond.price_per_carat || 0,
            bestseller: diamond.bestseller ?? false,
            showOnIndex: diamond.showOnIndex ?? true,
            showInGallery: diamond.showInGallery ?? true,
            // Ensure management field exists
            management: diamond.management || {
              isManaged: false,
              status: 'active',
              priority: 'medium',
              tags: []
            }
          };
        });
        
        // Update with real Firebase data
        setDiamonds(processedDiamonds);
        setLastUpdated(new Date());
        setIsOffline(false);
        setError(null);
        console.log('🔥 FirebaseProvider: Final processed diamonds:', processedDiamonds);
        console.log('🔥 FirebaseProvider: Updated diamonds with Firebase data (including Base64 images)');
        setIsLoading(false);
      });

    } catch (error) {
      console.error('❌ Error setting up Firebase listener:', error);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      loadFallbackData();
    }

    // Cleanup: This is the ONLY listener that should exist
    return () => {
      console.log('🔥 FirebaseProvider: Cleaning up SINGLE Firebase listener');
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [retryCount]); // Re-run when retryCount changes

  const value: FirebaseContextType = {
    diamonds,
    isLoading,
    error,
    isOffline,
    lastUpdated,
    retryConnection
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

// Hook to use Firebase data
export const useFirebase = (): FirebaseContextType => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}; 
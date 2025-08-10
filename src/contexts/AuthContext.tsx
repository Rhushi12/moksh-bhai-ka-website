import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getFirestore, doc, getDoc, setDoc, updateDoc, Firestore } from 'firebase/firestore';
import { app } from '../lib/firebase';
import { getSessionId, clearSessionId } from '../lib/sessionUtils';

// User interface
interface User {
  name: string;
  phone: string;
  isAuthenticated: boolean;
  verifiedAt?: Date;
  hasSkippedLogin?: boolean; // New field to track if user skipped login
}

// Context interface
interface AuthContextType {
  user: User;
  login: (name: string, phone: string) => void;
  logout: () => void;
  skipLogin: () => void; // New function to handle skipping login
  isAuthenticated: boolean;
  getUserName: () => string;
  hasCompletedAuth: () => boolean; // New function to check if user has completed auth (login or skip)
  isLoading: boolean; // New field to track loading state
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props for the provider component
interface AuthProviderProps {
  children: ReactNode;
}

// Authentication provider component
// This component manages the global authentication state for the application
// It provides login/logout functionality and user information to all child components
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  console.log('🔐 AuthProvider: Component rendering');
  
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize user state from Firebase or defaults
  const [user, setUser] = useState<User>(() => {
    // Default guest user - will be updated from Firebase
    return {
      name: 'Guest',
      phone: '',
      isAuthenticated: false,
      hasSkippedLogin: false
    };
  });

  // Initialize Firebase Firestore with proper typing
  let db: Firestore | null = null;
  try {
    if (app) {
      db = getFirestore(app);
    } else {
      console.warn('⚠️ Firebase app not available - using guest mode');
    }
  } catch (error) {
    console.error('❌ Error initializing Firestore:', error);
  }

  // Load user data from Firebase on component mount
  useEffect(() => {
    const loadUserFromFirebase = async () => {
      try {
        console.log('🔐 Loading user data from Firebase...');
        
        if (!db) {
          console.warn('⚠️ Firestore not available - using default guest state');
          setIsLoading(false);
          return;
        }
        
        // SECURITY FIX: Use session-specific user document instead of global 'current-user'
        const sessionId = getSessionId();
        const userDocRef = doc(db, 'users', sessionId);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('🔐 Found session-specific user data in Firebase:', userData);
          
          // Convert verifiedAt string back to Date object if it exists
          if (userData.verifiedAt) {
            userData.verifiedAt = new Date(userData.verifiedAt.toDate());
          }
          
          setUser({
            name: userData.name || 'Guest',
            phone: userData.phone || '',
            isAuthenticated: userData.isAuthenticated || false,
            verifiedAt: userData.verifiedAt,
            hasSkippedLogin: userData.hasSkippedLogin || false
          });
        } else {
          console.log('🔐 No session-specific user data found in Firebase, using default guest state');
          // User doesn't exist in Firebase, keep default guest state
        }
      } catch (error) {
        console.error('❌ Error loading user from Firebase:', error);
        // Fallback to sessionStorage if Firebase fails (not localStorage for security)
        const sessionId = getSessionId();
        const savedUser = sessionStorage.getItem(`diamond-auth-user-${sessionId}`);
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            if (parsedUser.verifiedAt) {
              parsedUser.verifiedAt = new Date(parsedUser.verifiedAt);
            }
            setUser(parsedUser);
          } catch (localError) {
            console.error('❌ Error parsing sessionStorage data:', localError);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromFirebase();
  }, [db]);

  // Save user state to Firebase whenever it changes
  useEffect(() => {
    const saveUserToFirebase = async () => {
      if (isLoading) return; // Don't save during initial load
      
      try {
        console.log('🔐 Saving user data to Firebase:', user);
        
        // SECURITY FIX: Use session-specific user document
        const sessionId = getSessionId();
        const userDocRef = doc(db, 'users', sessionId);
        await setDoc(userDocRef, {
          name: user.name,
          phone: user.phone,
          isAuthenticated: user.isAuthenticated,
          verifiedAt: user.verifiedAt,
          hasSkippedLogin: user.hasSkippedLogin,
          sessionId: sessionId,
          updatedAt: new Date()
        });
        
        console.log('✅ User data saved to Firebase successfully for session:', sessionId);
      } catch (error) {
        console.error('❌ Error saving user to Firebase:', error);
        // Fallback to sessionStorage if Firebase fails (not localStorage for security)
        const sessionId = getSessionId();
        sessionStorage.setItem(`diamond-auth-user-${sessionId}`, JSON.stringify(user));
      }
    };

    saveUserToFirebase();
  }, [user, db, isLoading]);

  /**
   * Login function - called after successful OTP verification
   * @param name - User's full name
   * @param phone - User's phone number
   */
  const login = (name: string, phone: string) => {
    setUser({
      name,
      phone,
      isAuthenticated: true,
      verifiedAt: new Date(),
      hasSkippedLogin: false
    });
  };

  /**
   * Logout function - resets user to guest state and clears session
   */
  const logout = async () => {
    try {
      // Clear session storage
      clearSessionId();
      
      // Clear any Firebase data for current session
      if (db) {
        const currentSessionId = getSessionId();
        // Note: We don't delete the Firebase document here as getSessionId() creates a new one
        // The old session data will remain isolated to that session
      }
      
      // Reset user state
      setUser({
        name: 'Guest',
        phone: '',
        isAuthenticated: false,
        hasSkippedLogin: false
      });
      
      console.log('🔐 User logged out successfully');
    } catch (error) {
      console.error('❌ Error during logout:', error);
      // Still reset user state even if cleanup fails
      setUser({
        name: 'Guest',
        phone: '',
        isAuthenticated: false,
        hasSkippedLogin: false
      });
    }
  };

  /**
   * Skip login function - marks user as having skipped login
   */
  const skipLogin = () => {
    setUser({
      name: 'Guest',
      phone: '',
      isAuthenticated: false,
      hasSkippedLogin: true
    });
  };

  /**
   * Get user name for display - returns "Guest" if not authenticated
   * @returns User's name or "Guest"
   */
  const getUserName = (): string => {
    return user.isAuthenticated ? user.name : 'Guest';
  };

  /**
   * Check if user has completed authentication (either logged in or skipped)
   * @returns boolean indicating if user has completed auth flow
   */
  const hasCompletedAuth = (): boolean => {
    return user.isAuthenticated || user.hasSkippedLogin === true;
  };

  // Context value object
  const value: AuthContextType = {
    user,
    login,
    logout,
    skipLogin,
    isAuthenticated: user.isAuthenticated,
    getUserName,
    hasCompletedAuth,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use the authentication context
 * @returns AuthContextType
 * @throws Error if used outside of AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
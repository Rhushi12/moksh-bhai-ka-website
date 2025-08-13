// Setup User Preferences for Onboarding
// This script sets up initial user preferences data in Firebase

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADTRiHPNC3DSFdQ8u0WsYv2FWZkdDjCjI",
  authDomain: "moksh-46904.firebaseapp.com",
  projectId: "moksh-46904",
  storageBucket: "moksh-46904.firebasestorage.app",
  messagingSenderId: "124955720743",
  appId: "1:124955720743:web:72c3647f05f677930f6202",
  measurementId: "G-7BDGDVG097"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to set up user preferences
async function setupUserPreferences() {
  console.log('🎭 Setting up user preferences in Firebase...');
  
  try {
    // Set up onboarding preferences
    const onboardingDocRef = doc(db, 'user-preferences', 'onboarding');
    await setDoc(onboardingDocRef, {
      is_onboarding_complete: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    console.log('✅ Onboarding preferences set up successfully');
    console.log('   - is_onboarding_complete: false');
    console.log('   - This will allow the onboarding modal to show for new users');
    
    // Set up a default user document
    const userDocRef = doc(db, 'users', 'current-user');
    await setDoc(userDocRef, {
      name: 'Guest',
      phone: '',
      isAuthenticated: false,
      hasSkippedLogin: false,
      verifiedAt: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    console.log('✅ Default user document set up successfully');
    console.log('   - name: Guest');
    console.log('   - isAuthenticated: false');
    console.log('   - hasSkippedLogin: false');
    
    console.log('🎉 User preferences setup completed!');
    console.log('📊 Summary:');
    console.log('   - Onboarding preferences initialized');
    console.log('   - Default user document created');
    console.log('   - Ready for new users to start onboarding');
    
  } catch (error) {
    console.error('❌ Error setting up user preferences:', error);
  }
}

// Run the function
setupUserPreferences();












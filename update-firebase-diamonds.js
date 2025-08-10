// Update Firebase Diamonds with Name Fields
// This script adds name fields to existing diamonds in Firebase

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

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

// Function to update existing diamonds with name fields
async function updateDiamondsWithNames() {
  console.log('🔄 Starting to update diamonds with name fields...');
  
  try {
    const diamondsCollection = collection(db, 'diamonds');
    const snapshot = await getDocs(diamondsCollection);
    
    console.log(`📊 Found ${snapshot.docs.length} diamonds to update`);
    
    for (let i = 0; i < snapshot.docs.length; i++) {
      const doc = snapshot.docs[i];
      const diamondData = doc.data();
      
      console.log(`💎 Processing diamond ${i + 1}: ${diamondData.shape} Cut`);
      
      // Check if name field already exists
      if (diamondData.name) {
        console.log(`   ✅ Diamond already has name: "${diamondData.name}"`);
        continue;
      }
      
      // Generate name based on shape
      const name = `${diamondData.shape} Cut Diamond`;
      
      // Update the document with name field
      await updateDoc(doc.ref, {
        name: name,
        updatedAt: new Date().toISOString()
      });
      
      console.log(`   ✅ Added name: "${name}"`);
      console.log(`   📝 Shape: ${diamondData.shape}`);
      console.log(`   💎 Carat: ${diamondData.carat}ct`);
      console.log(`   💰 Price: ${diamondData.price}`);
      console.log('   ---');
    }
    
    console.log('🎉 All diamonds have been successfully updated with name fields!');
    console.log('📊 Summary:');
    console.log(`   Total diamonds processed: ${snapshot.docs.length}`);
    console.log('   All diamonds now have name fields');
    console.log('   Names follow format: "{Shape} Cut Diamond"');
    
  } catch (error) {
    console.error('❌ Error updating diamonds:', error);
  }
}

// Run the function
updateDiamondsWithNames(); 
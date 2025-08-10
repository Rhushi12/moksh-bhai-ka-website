// Update Existing Diamonds with Management Field
// This script adds the management field to existing diamonds in Firebase

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

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

// Management data templates based on diamond characteristics
const getManagementData = (diamond) => {
  const baseManagement = {
    isManaged: true,
    managedBy: 'Moksh P Mehta',
    managedAt: new Date().toISOString(),
    status: 'active',
    lastUpdated: new Date().toISOString()
  };

  // Customize management data based on diamond properties
  switch (diamond.shape) {
    case 'Alphabet':
      return {
        ...baseManagement,
        managementNotes: 'Premium alphabet collection - high demand item',
        priority: 'high',
        tags: ['alphabet', 'premium', 'collection', 'custom']
      };
    case 'Custom':
      return {
        ...baseManagement,
        managementNotes: 'Unique custom cut - one of a kind piece',
        priority: 'medium',
        tags: ['custom', 'unique', 'faceted', 'luxury']
      };
    case 'Crescent':
      return {
        ...baseManagement,
        managementNotes: 'Rare crescent cut - exceptional craftsmanship',
        priority: 'high',
        tags: ['crescent', 'rare', 'moon-shaped', 'exceptional']
      };
    case 'Round':
      return {
        ...baseManagement,
        managementNotes: 'Classic round brilliant - investment grade',
        priority: 'medium',
        tags: ['round', 'brilliant', 'investment', 'classic']
      };
    default:
      return {
        ...baseManagement,
        managementNotes: `${diamond.shape} cut diamond - ${diamond.category}`,
        priority: diamond.bestseller ? 'high' : 'medium',
        tags: [diamond.shape.toLowerCase(), diamond.category.toLowerCase().replace(' ', '-')]
      };
  }
};

// Function to update existing diamonds with management field
async function updateDiamondsWithManagement() {
  console.log('🔄 Starting to update existing diamonds with management field...');
  
  try {
    const diamondsCollection = collection(db, 'diamonds');
    const snapshot = await getDocs(diamondsCollection);
    
    console.log(`📊 Found ${snapshot.docs.length} diamonds to update`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const docSnapshot of snapshot.docs) {
      const diamond = docSnapshot.data();
      const docId = docSnapshot.id;
      
      // Check if management field already exists
      if (diamond.management) {
        console.log(`⏭️ Diamond ${diamond.shape} already has management field, skipping...`);
        skippedCount++;
        continue;
      }
      
      console.log(`💎 Updating diamond: ${diamond.shape} Cut`);
      
      // Get management data based on diamond properties
      const managementData = getManagementData(diamond);
      
      // Update the document with management field
      const docRef = doc(db, 'diamonds', docId);
      await updateDoc(docRef, {
        management: managementData
      });
      
      console.log(`✅ Updated diamond ${diamond.shape} with management data:`);
      console.log(`   Status: ${managementData.status}`);
      console.log(`   Priority: ${managementData.priority}`);
      console.log(`   Tags: ${managementData.tags.join(', ')}`);
      console.log('---');
      
      updatedCount++;
    }
    
    console.log('🎉 Diamond management update completed!');
    console.log('📊 Summary:');
    console.log(`   Total diamonds processed: ${snapshot.docs.length}`);
    console.log(`   Updated: ${updatedCount}`);
    console.log(`   Skipped (already had management): ${skippedCount}`);
    console.log('📝 Management fields added:');
    console.log('   - isManaged: boolean');
    console.log('   - managedBy: string');
    console.log('   - managedAt: timestamp');
    console.log('   - managementNotes: string');
    console.log('   - status: active/inactive/pending/archived');
    console.log('   - priority: low/medium/high/urgent');
    console.log('   - tags: string array');
    console.log('   - lastUpdated: timestamp');
    
  } catch (error) {
    console.error('❌ Error updating diamonds with management field:', error);
  }
}

// Run the function
updateDiamondsWithManagement(); 
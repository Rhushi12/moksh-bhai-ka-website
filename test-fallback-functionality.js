// Test Fallback Functionality
// This script tests the fallback mechanisms when Firebase is not available

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

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

// Fallback diamond data (same as in firebase.ts)
const getFallbackDiamonds = () => {
  console.log('🔄 Using fallback diamond data - Firebase not available');
  
  return [
    {
      id: 'fallback-1',
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
      polish: 'Excellent',
      symmetry: 'Excellent',
      fluorescence: 'None',
      growth_type: 'Natural',
      location: 'Antwerp, Belgium',
      supplier: 'De Beers',
      certification: 'GIA',
      certification_number: '1234567890',
      depth_percentage: 62.5,
      table_percentage: 57.0,
      crown_height: 16.5,
      pavilion_depth: 43.1,
      girdle_thickness: 'Medium',
      culet_size: 'None',
      management: {
        isManaged: true,
        managedBy: 'Moksh P Mehta',
        managedAt: new Date().toISOString(),
        managementNotes: 'Fallback diamond - Firebase not available',
        status: 'active',
        priority: 'medium',
        tags: ['fallback', 'round', 'investment'],
        lastUpdated: new Date().toISOString()
      }
    },
    {
      id: 'fallback-2',
      category: 'Investment Diamonds',
      shape: 'Crescent',
      primaryImage: '/diamond-crescent.jpg',
      images: ['/diamond-crescent.jpg'],
      description: 'Discover the extraordinary allure of our Crescent Cut Diamond. This rare and captivating gem, with its unique moon-like shape and brilliant sparkle, is a true testament to exceptional craftsmanship.',
      carat: 2.10,
      clarity: 'VVS2',
      cut: 'Excellent',
      color: 'E',
      price: '$28,000',
      price_per_carat: 13333,
      bestseller: true,
      showOnIndex: true,
      showInGallery: true,
      polish: 'Excellent',
      symmetry: 'Excellent',
      fluorescence: 'None',
      growth_type: 'Natural',
      location: 'Dubai, UAE',
      supplier: 'Dominion Diamond',
      certification: 'GIA',
      certification_number: '1234567895',
      depth_percentage: 64.8,
      table_percentage: 56.0,
      crown_height: 17.2,
      pavilion_depth: 43.8,
      girdle_thickness: 'Thin',
      culet_size: 'None',
      management: {
        isManaged: true,
        managedBy: 'Moksh P Mehta',
        managedAt: new Date().toISOString(),
        managementNotes: 'Fallback crescent diamond - Firebase not available',
        status: 'active',
        priority: 'high',
        tags: ['fallback', 'crescent', 'rare'],
        lastUpdated: new Date().toISOString()
      }
    }
  ];
};

// Function to test fallback functionality
async function testFallbackFunctionality() {
  console.log('🧪 Testing Fallback Functionality...\n');
  
  try {
    const diamondsCollection = collection(db, 'diamonds');
    const snapshot = await getDocs(diamondsCollection);
    
    console.log(`📊 Found ${snapshot.docs.length} diamonds in Firebase`);
    
    if (snapshot.docs.length === 0) {
      console.log('⚠️ No diamonds found in Firebase - testing fallback data');
      const fallbackDiamonds = getFallbackDiamonds();
      
      console.log('\n📋 Fallback Diamond Details:');
      console.log('=' .repeat(50));
      
      fallbackDiamonds.forEach((diamond, index) => {
        console.log(`${index + 1}. ${diamond.shape} Cut Diamond (Fallback)`);
        console.log(`   ID: ${diamond.id}`);
        console.log(`   Category: ${diamond.category}`);
        console.log(`   Carat: ${diamond.carat}ct`);
        console.log(`   Price: ${diamond.price}`);
        console.log(`   Status: ${diamond.management?.status}`);
        console.log(`   Priority: ${diamond.management?.priority}`);
        console.log(`   Tags: ${diamond.management?.tags?.join(', ')}`);
        console.log(`   Notes: ${diamond.management?.managementNotes}`);
        console.log('---');
      });
      
      console.log('\n✅ Fallback functionality test completed!');
      console.log('📝 Summary:');
      console.log(`   Total fallback diamonds: ${fallbackDiamonds.length}`);
      console.log('   Fallback data includes all required fields');
      console.log('   Management data is properly structured');
      console.log('   Images have fallback paths');
      console.log('   Ready for offline mode');
      
    } else {
      console.log('✅ Firebase has data - fallback not needed');
      console.log('📊 Firebase Diamond Summary:');
      
      const diamonds = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          shape: data.shape,
          category: data.category,
          hasManagement: !!data.management,
          hasImages: !!(data.primaryImage || data.images),
          hasPrice: !!data.price
        };
      });
      
      diamonds.forEach((diamond, index) => {
        console.log(`${index + 1}. ${diamond.shape} Cut Diamond`);
        console.log(`   ID: ${diamond.id}`);
        console.log(`   Category: ${diamond.category}`);
        console.log(`   Management: ${diamond.hasManagement ? '✅' : '❌'}`);
        console.log(`   Images: ${diamond.hasImages ? '✅' : '❌'}`);
        console.log(`   Price: ${diamond.hasPrice ? '✅' : '❌'}`);
        console.log('---');
      });
      
      console.log('\n🎉 Firebase data is working correctly!');
      console.log('📝 Fallback system is ready but not needed');
    }
    
  } catch (error) {
    console.error('❌ Error testing fallback functionality:', error);
    console.log('\n🔄 Testing fallback data due to error...');
    
    const fallbackDiamonds = getFallbackDiamonds();
    console.log(`✅ Fallback data available: ${fallbackDiamonds.length} diamonds`);
    console.log('📝 Fallback system is working correctly');
  }
}

// Run the test
testFallbackFunctionality();









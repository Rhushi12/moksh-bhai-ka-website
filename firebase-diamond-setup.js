// Firebase Diamond Setup Script
// Add all 4 diamonds with correct specifications and images

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

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

// Diamond data with correct specifications and images
const diamonds = [
  {
    // Diamond 1: Alphabet Collection
    name: 'Alphabet Cut Diamond',
    category: 'Investment Diamonds',
    shape: 'Alphabet',
    image: '/diamond-alphabet.jpg',
    description: 'Introducing our exclusive Alphabet Collection - a bespoke set of 26 diamond letters crafted with precision and elegance. Each letter ranges from 0.10ct to 0.50ct, featuring FL to VVS1 clarity and D to G color grades. Perfect for personalized luxury jewelry. Contact us to create your custom alphabet masterpiece.',
    carat: 0.10,
    clarity: 'FL',
    cut: 'Excellent',
    color: 'D',
    price: '$10,000',
    bestseller: true,
    updatedAt: new Date().toISOString(),
    management: {
      isManaged: true,
      managedBy: 'Moksh P Mehta',
      managedAt: new Date().toISOString(),
      managementNotes: 'Premium alphabet collection - high demand item',
      status: 'active',
      priority: 'high',
      tags: ['alphabet', 'premium', 'collection', 'custom'],
      lastUpdated: new Date().toISOString()
    }
  },
  {
    // Diamond 2: Custom Cut Ring
    name: 'Custom Cut Diamond',
    category: 'Investment Diamonds',
    shape: 'Custom',
    image: '/diamond-custom.jpg',
    description: 'Experience the brilliance of our Custom Faceted Cut Diamond. This unique 1.50-carat masterpiece showcases exceptional craftsmanship with its distinctive faceting pattern. Perfect for those seeking one-of-a-kind luxury. Make this extraordinary piece yours today.',
    carat: 1.50,
    clarity: 'VVS1',
    cut: 'Excellent',
    color: 'D',
    price: '$22,500',
    bestseller: true,
    updatedAt: new Date().toISOString(),
    management: {
      isManaged: true,
      managedBy: 'Moksh P Mehta',
      managedAt: new Date().toISOString(),
      managementNotes: 'Unique custom cut - one of a kind piece',
      status: 'active',
      priority: 'medium',
      tags: ['custom', 'unique', 'faceted', 'luxury'],
      lastUpdated: new Date().toISOString()
    }
  },
  {
    // Diamond 3: Crescent Cut
    name: 'Crescent Cut Diamond',
    category: 'Investment Diamonds',
    shape: 'Crescent',
    image: '/diamond-crescent.jpg',
    description: 'Discover the extraordinary allure of our Crescent Cut Diamond. This rare and captivating gem, with its unique moon-like shape and brilliant sparkle, is a true testament to exceptional craftsmanship. Elevate your jewelry collection with a piece that stands out. Inquire now to make this exquisite diamond yours.',
    carat: 2.10,
    clarity: 'VVS2',
    cut: 'Excellent',
    color: 'E',
    price: '$28,000',
    bestseller: true,
    updatedAt: new Date().toISOString(),
    management: {
      isManaged: true,
      managedBy: 'Moksh P Mehta',
      managedAt: new Date().toISOString(),
      managementNotes: 'Rare crescent cut - exceptional craftsmanship',
      status: 'active',
      priority: 'high',
      tags: ['crescent', 'rare', 'moon-shaped', 'exceptional'],
      lastUpdated: new Date().toISOString()
    }
  },
  {
    // Diamond 4: Round Cut Diamond
    name: 'Round Cut Diamond',
    category: 'Investment Diamonds',
    shape: 'Round',
    image: '/diamond-round.jpg',
    description: 'A magnificent 3.5-carat round brilliant diamond with exceptional fire and brilliance. This investment-grade stone represents the pinnacle of diamond cutting artistry and is perfect for serious collectors.',
    carat: 3.5,
    clarity: 'FL',
    cut: 'Excellent',
    color: 'D',
    price: '$25,000',
    bestseller: true,
    updatedAt: new Date().toISOString(),
    management: {
      isManaged: true,
      managedBy: 'Moksh P Mehta',
      managedAt: new Date().toISOString(),
      managementNotes: 'Classic round brilliant - investment grade',
      status: 'active',
      priority: 'medium',
      tags: ['round', 'brilliant', 'investment', 'classic'],
      lastUpdated: new Date().toISOString()
    }
  }
];

// Function to add diamonds to Firebase
async function addDiamondsToFirebase() {
  console.log('🚀 Starting to add diamonds to Firebase...');
  
  try {
    const diamondsCollection = collection(db, 'diamonds');
    
    for (let i = 0; i < diamonds.length; i++) {
      const diamond = diamonds[i];
      console.log(`💎 Adding diamond ${i + 1}: ${diamond.shape} Cut`);
      
      const docRef = await addDoc(diamondsCollection, diamond);
      console.log(`✅ Diamond ${i + 1} added successfully with ID: ${docRef.id}`);
      console.log(`   Shape: ${diamond.shape}`);
      console.log(`   Carat: ${diamond.carat}ct`);
      console.log(`   Price: ${diamond.price}`);
      console.log(`   Image: ${diamond.image}`);
      console.log('---');
    }
    
    console.log('🎉 All diamonds have been successfully added to Firebase!');
    console.log('📊 Summary:');
    console.log(`   Total diamonds added: ${diamonds.length}`);
    console.log('   Shapes: Alphabet, Custom, Crescent, Round');
    console.log('   All marked as bestsellers');
    console.log('📝 Note: Add your actual diamond images to the /public folder');
    
  } catch (error) {
    console.error('❌ Error adding diamonds to Firebase:', error);
  }
}

// Run the function
addDiamondsToFirebase(); 
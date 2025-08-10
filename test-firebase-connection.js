// Test Firebase Connection and Data
// Run this to verify your Firebase setup is working

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyADTRiHPNC3DSFdQ8u0WsYv2FWZkdDjCjI",
  authDomain: "moksh-46904.firebaseapp.com",
  projectId: "moksh-46904",
  storageBucket: "moksh-46904.firebasestorage.app",
  messagingSenderId: "124955720743",
  appId: "1:124955720743:web:72c3647f05f677930f6202",
  measurementId: "G-7BDGDVG097"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testFirebaseConnection() {
  console.log('🧪 Testing Firebase Connection...');
  
  try {
    // Test diamonds collection
    const diamondsSnapshot = await getDocs(collection(db, 'diamonds'));
    console.log('✅ Diamonds Collection:', diamondsSnapshot.size, 'documents');
    
    diamondsSnapshot.forEach((doc) => {
      console.log('💎 Diamond:', doc.id, doc.data().shape, doc.data().price);
    });
    
    // Test leads collection
    const leadsSnapshot = await getDocs(collection(db, 'leads'));
    console.log('✅ Leads Collection:', leadsSnapshot.size, 'documents');
    
    leadsSnapshot.forEach((doc) => {
      console.log('📞 Lead:', doc.id, doc.data().name, doc.data().status);
    });
    
    console.log('🎉 Firebase connection successful!');
    
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
  }
}

testFirebaseConnection(); 
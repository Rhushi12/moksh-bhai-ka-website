// Test Contact Messages Functionality
// This script tests the contact messages collection and management

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqQqQqQqQqQqQqQqQqQqQqQqQqQqQqQ",
  authDomain: "moksh-46904.firebaseapp.com",
  projectId: "moksh-46904",
  storageBucket: "moksh-46904.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Test contact messages
async function testContactMessages() {
  console.log('🧪 Testing Contact Messages Functionality...\n');

  try {
    // Test 1: Add a sample contact message
    console.log('📝 Test 1: Adding sample contact message...');
    const sampleMessage = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      message: 'I am interested in your diamond collection. Please contact me for more details.',
      source: 'Contact Page',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      createdAt: serverTimestamp(),
      status: 'New',
      readAt: null
    };

    const docRef = await addDoc(collection(db, 'contact_messages'), sampleMessage);
    console.log('✅ Sample message added with ID:', docRef.id);

    // Test 2: Check existing messages
    console.log('\n📋 Test 2: Checking existing messages...');
    const messagesSnapshot = await getDocs(collection(db, 'contact_messages'));
    const messages = messagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log(`✅ Found ${messages.length} contact messages:`);
    messages.forEach((msg, index) => {
      console.log(`   ${index + 1}. ${msg.name} (${msg.email}) - Status: ${msg.status}`);
      console.log(`      Message: ${msg.message.substring(0, 50)}...`);
      console.log(`      Created: ${msg.createdAt?.toDate?.() || 'Unknown'}`);
    });

    // Test 3: Check message statistics
    console.log('\n📊 Test 3: Message Statistics...');
    const newMessages = messages.filter(m => m.status === 'New').length;
    const readMessages = messages.filter(m => m.status === 'Read').length;
    const repliedMessages = messages.filter(m => m.status === 'Replied').length;

    console.log(`✅ Statistics:`);
    console.log(`   - Total Messages: ${messages.length}`);
    console.log(`   - New Messages: ${newMessages}`);
    console.log(`   - Read Messages: ${readMessages}`);
    console.log(`   - Replied Messages: ${repliedMessages}`);

    // Test 4: Verify collection structure
    console.log('\n🔍 Test 4: Verifying collection structure...');
    if (messages.length > 0) {
      const sampleMsg = messages[0];
      const requiredFields = ['name', 'email', 'message', 'status', 'createdAt'];
      const optionalFields = ['source', 'ipAddress', 'userAgent', 'readAt'];
      
      console.log('✅ Required fields check:');
      requiredFields.forEach(field => {
        if (sampleMsg[field] !== undefined) {
          console.log(`   ✓ ${field}: ${sampleMsg[field]}`);
        } else {
          console.log(`   ✗ ${field}: Missing`);
        }
      });

      console.log('✅ Optional fields check:');
      optionalFields.forEach(field => {
        if (sampleMsg[field] !== undefined) {
          console.log(`   ✓ ${field}: ${sampleMsg[field]}`);
        } else {
          console.log(`   - ${field}: Not present`);
        }
      });
    }

    console.log('\n🎉 All contact message tests completed successfully!');
    console.log('\n📱 Next Steps:');
    console.log('   1. Start the development server: npm run dev');
    console.log('   2. Navigate to /contact to test the form');
    console.log('   3. Submit a contact form to add a real message');
    console.log('   4. Navigate to /messages to view and manage messages');
    console.log('   5. Test the sliding sidebar navigation');

  } catch (error) {
    console.error('❌ Error testing contact messages:', error);
  }
}

// Run the test
testContactMessages(); 
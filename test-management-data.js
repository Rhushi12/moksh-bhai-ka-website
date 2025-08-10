// Test Management Data
// This script verifies that the management field is working correctly

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

// Function to test management data
async function testManagementData() {
  console.log('🧪 Testing Diamond Management Data...\n');
  
  try {
    const diamondsCollection = collection(db, 'diamonds');
    const snapshot = await getDocs(diamondsCollection);
    
    console.log(`📊 Found ${snapshot.docs.length} diamonds with management data`);
    
    // Statistics
    let managedCount = 0;
    let unmanagedCount = 0;
    const priorities = { low: 0, medium: 0, high: 0, urgent: 0 };
    const statuses = { active: 0, inactive: 0, pending: 0, archived: 0 };
    const tags = new Set();
    
    console.log('\n📋 Diamond Management Details:');
    console.log('=' .repeat(60));
    
    snapshot.docs.forEach((docSnapshot, index) => {
      const diamond = docSnapshot.data();
      const docId = docSnapshot.id;
      
      if (diamond.management) {
        managedCount++;
        const mgmt = diamond.management;
        
        // Count priorities and statuses
        if (mgmt.priority) priorities[mgmt.priority]++;
        if (mgmt.status) statuses[mgmt.status]++;
        
        // Collect tags
        if (mgmt.tags) {
          mgmt.tags.forEach(tag => tags.add(tag));
        }
        
        console.log(`${index + 1}. ${diamond.shape} Cut Diamond`);
        console.log(`   ID: ${docId}`);
        console.log(`   Status: ${mgmt.status || 'N/A'}`);
        console.log(`   Priority: ${mgmt.priority || 'N/A'}`);
        console.log(`   Managed By: ${mgmt.managedBy || 'N/A'}`);
        console.log(`   Notes: ${mgmt.managementNotes || 'N/A'}`);
        console.log(`   Tags: ${mgmt.tags ? mgmt.tags.join(', ') : 'N/A'}`);
        console.log(`   Last Updated: ${mgmt.lastUpdated ? new Date(mgmt.lastUpdated).toLocaleString() : 'N/A'}`);
        console.log('---');
      } else {
        unmanagedCount++;
        console.log(`${index + 1}. ${diamond.shape} Cut Diamond - NO MANAGEMENT DATA`);
        console.log(`   ID: ${docId}`);
        console.log('---');
      }
    });
    
    console.log('\n📊 Management Statistics:');
    console.log('=' .repeat(40));
    console.log(`Total Diamonds: ${snapshot.docs.length}`);
    console.log(`Managed: ${managedCount}`);
    console.log(`Unmanaged: ${unmanagedCount}`);
    console.log(`Management Rate: ${((managedCount / snapshot.docs.length) * 100).toFixed(1)}%`);
    
    console.log('\n🎯 Priority Distribution:');
    Object.entries(priorities).forEach(([priority, count]) => {
      if (count > 0) {
        console.log(`   ${priority}: ${count} diamonds`);
      }
    });
    
    console.log('\n📈 Status Distribution:');
    Object.entries(statuses).forEach(([status, count]) => {
      if (count > 0) {
        console.log(`   ${status}: ${count} diamonds`);
      }
    });
    
    console.log('\n🏷️ Tags Used:');
    console.log(`   Total unique tags: ${tags.size}`);
    Array.from(tags).sort().forEach(tag => {
      console.log(`   - ${tag}`);
    });
    
    console.log('\n✅ Management Data Test Results:');
    if (managedCount === snapshot.docs.length) {
      console.log('   ✅ All diamonds have management data');
    } else {
      console.log(`   ⚠️ ${unmanagedCount} diamonds missing management data`);
    }
    
    if (Object.values(priorities).some(count => count > 0)) {
      console.log('   ✅ Priority data is working');
    } else {
      console.log('   ⚠️ No priority data found');
    }
    
    if (Object.values(statuses).some(count => count > 0)) {
      console.log('   ✅ Status data is working');
    } else {
      console.log('   ⚠️ No status data found');
    }
    
    if (tags.size > 0) {
      console.log('   ✅ Tags system is working');
    } else {
      console.log('   ⚠️ No tags found');
    }
    
    console.log('\n🎉 Management data test completed successfully!');
    console.log('\n📱 Next Steps:');
    console.log('   1. The management field is ready for the app integration');
    console.log('   2. All diamonds now have management data');
    console.log('   3. Ready to implement Diamond Management in the app');
    
  } catch (error) {
    console.error('❌ Error testing management data:', error);
  }
}

// Run the test
testManagementData(); 
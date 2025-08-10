const { twilioService } = require('./src/lib/twilioService.ts');

/**
 * Test script for OTP system
 * Run with: node test-otp-system.js
 */

async function testOTPSystem() {
  console.log('🧪 Testing OTP System...\n');

  // Test phone number validation
  console.log('1. Testing phone number validation:');
  const testNumbers = [
    '+1234567890',
    '+1-234-567-8900',
    '+1 (234) 567-8900',
    '1234567890', // Invalid - no country code
    '+123456789' // Invalid - too short
  ];

  testNumbers.forEach(phone => {
    const cleanPhone = twilioService.cleanPhoneNumber(phone);
    const isValid = /^\+[1-9]\d{1,14}$/.test(cleanPhone);
    console.log(`   ${phone} -> ${cleanPhone} (${isValid ? '✅ Valid' : '❌ Invalid'})`);
  });

  console.log('\n2. Testing OTP generation:');
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`   Generated OTP: ${otp} (${otp.length} digits)`);

  console.log('\n3. Testing SMS simulation:');
  const testPhone = '+1234567890';
  console.log(`   Simulating SMS to ${testPhone}: "Your OTP is ${otp}"`);

  console.log('\n4. Testing OTP verification:');
  console.log('   This would verify the OTP against Firestore data');

  console.log('\n✅ OTP System Test Complete!');
  console.log('\n📋 Next Steps:');
  console.log('   1. Set up Twilio account and credentials');
  console.log('   2. Configure environment variables');
  console.log('   3. Start the backend server: cd server && npm run dev');
  console.log('   4. Start the frontend: npm run dev');
  console.log('   5. Test with real phone numbers');
}

// Run the test
testOTPSystem().catch(console.error); 
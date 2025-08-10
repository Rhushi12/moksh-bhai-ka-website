// Test script to verify EmailJS configuration
// Run this after setting up EmailJS to test your credentials

console.log('🔧 Testing EmailJS Configuration...\n');

// Check if environment variables are set
const serviceId = process.env.VITE_EMAILJS_SERVICE_ID;
const templateId = process.env.VITE_EMAILJS_TEMPLATE_ID;
const userId = process.env.VITE_EMAILJS_USER_ID;

console.log('📋 Environment Variables:');
console.log(`Service ID: ${serviceId ? '✅ Set' : '❌ Missing'}`);
console.log(`Template ID: ${templateId ? '✅ Set' : '❌ Missing'}`);
console.log(`User ID: ${userId ? '✅ Set' : '❌ Missing'}\n`);

if (!serviceId || !templateId || !userId) {
  console.log('❌ Missing EmailJS credentials. Please check your .env file.');
  console.log('\n📝 To set up EmailJS:');
  console.log('1. Go to https://www.emailjs.com/');
  console.log('2. Create account and add email service');
  console.log('3. Create email template');
  console.log('4. Get your credentials and add to .env file');
  console.log('\n📖 See EMAILJS_SETUP_GUIDE.md for detailed instructions');
} else {
  console.log('✅ EmailJS credentials are configured!');
  console.log('\n🎯 Next steps:');
  console.log('1. Restart your development server');
  console.log('2. Test the OTP form with your email');
  console.log('3. Check your email for the OTP');
}

console.log('\n💡 Note: In development mode, OTPs will show in console even without EmailJS setup'); 
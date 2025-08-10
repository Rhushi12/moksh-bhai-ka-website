const twilio = require('twilio');

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send OTP via SMS using Twilio
 * @param {string} phone - Phone number in international format
 * @param {string} otp - 6-digit OTP code
 * @returns {Promise<Object>} - Success status and message
 */
async function sendOTPSMS(phone, otp) {
  try {
    const message = await client.messages.create({
      body: `Your Diamond Elegance Studio verification code is: ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });

    console.log(`✅ SMS sent successfully to ${phone}, SID: ${message.sid}`);
    return {
      success: true,
      message: 'OTP sent successfully',
      sid: message.sid
    };
  } catch (error) {
    console.error(`❌ Error sending SMS to ${phone}:`, error);
    return {
      success: false,
      message: error.message || 'Failed to send OTP',
      error: error.code
    };
  }
}

/**
 * Express.js endpoint for sending OTP
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { phone, otp } = req.body;

    // Validate input
    if (!phone || !otp) {
      return res.status(400).json({
        error: 'Phone number and OTP are required'
      });
    }

    // Validate phone number format
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    if (!phoneRegex.test(cleanPhone)) {
      return res.status(400).json({
        error: 'Invalid phone number format. Please use international format (e.g., +1234567890)'
      });
    }

    // Validate OTP format
    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        error: 'Invalid OTP format. Must be 6 digits.'
      });
    }

    // Send SMS
    const result = await sendOTPSMS(cleanPhone, otp);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('❌ API Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
} 
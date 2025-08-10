const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8085;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting for OTP endpoints
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many OTP requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Diamond Elegance OTP Service'
  });
});

// OTP sending endpoint
app.post('/api/send-otp', otpLimiter, async (req, res) => {
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

    // Check if Twilio credentials are configured
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
      console.warn('⚠️ Twilio credentials not configured, simulating SMS');
      return res.status(200).json({
        success: true,
        message: 'OTP sent successfully (simulated)',
        sid: 'simulated_sid'
      });
    }

    // Import Twilio client
    const twilio = require('twilio');
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // Send SMS
    const message = await client.messages.create({
      body: `Your Diamond Elegance Studio verification code is: ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: cleanPhone
    });

    console.log(`✅ SMS sent successfully to ${cleanPhone}, SID: ${message.sid}`);
    
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      sid: message.sid
    });

  } catch (error) {
    console.error('❌ Error sending OTP:', error);
    
    // Handle specific Twilio errors
    if (error.code === 21211) {
      return res.status(400).json({
        error: 'Invalid phone number format'
      });
    } else if (error.code === 21608) {
      return res.status(400).json({
        error: 'Phone number is not verified for trial accounts'
      });
    } else if (error.code === 21614) {
      return res.status(400).json({
        error: 'Invalid phone number'
      });
    }

    res.status(500).json({
      error: 'Failed to send OTP',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Server error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Diamond Elegance OTP Server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
  console.log(`📧 OTP endpoint: http://localhost:${PORT}/api/send-otp`);
  
  if (!process.env.TWILIO_ACCOUNT_SID) {
    console.warn('⚠️  TWILIO_ACCOUNT_SID not set - SMS will be simulated');
  }
  if (!process.env.TWILIO_AUTH_TOKEN) {
    console.warn('⚠️  TWILIO_AUTH_TOKEN not set - SMS will be simulated');
  }
  if (!process.env.TWILIO_PHONE_NUMBER) {
    console.warn('⚠️  TWILIO_PHONE_NUMBER not set - SMS will be simulated');
  }
});

module.exports = app; 
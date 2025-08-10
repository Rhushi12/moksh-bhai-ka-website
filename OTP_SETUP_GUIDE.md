# OTP System Setup Guide

This guide will help you set up a real OTP (One-Time Password) system using Twilio for international SMS delivery.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### 2. Set Up Twilio Account

1. **Create a Twilio Account**
   - Go to [Twilio Console](https://console.twilio.com/)
   - Sign up for a free account
   - Verify your email and phone number

2. **Get Your Twilio Credentials**
   - In the Twilio Console, find your Account SID and Auth Token
   - Note down your Twilio phone number (you'll get one for free)

3. **Configure Environment Variables**

   **Frontend (.env.local):**
   ```env
   VITE_API_BASE_URL=http://localhost:3001
   ```

   **Backend (server/.env):**
   ```env
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   SESSION_SECRET=your_session_secret_here
   ```

### 3. Start the Servers

```bash
# Terminal 1: Start the backend server
cd server
npm run dev

# Terminal 2: Start the frontend
npm run dev
```

## 📱 How It Works

### Frontend Flow
1. User enters name and phone number
2. Frontend calls Twilio service
3. Twilio service generates OTP and stores it in Firestore
4. Backend API sends SMS via Twilio
5. User enters OTP code
6. Frontend verifies OTP against stored data
7. User is authenticated and can access the portfolio

### Backend Flow
1. Receives OTP request from frontend
2. Validates phone number format
3. Sends SMS via Twilio API
4. Returns success/error response

## 🔧 Configuration Options

### Phone Number Validation
The system supports international phone number formats:
- `+1234567890`
- `+1-234-567-8900`
- `+1 (234) 567-8900`

### OTP Settings
- **Length**: 6 digits
- **Expiry**: 10 minutes
- **Rate Limit**: 5 requests per 15 minutes per IP

### SMS Message Template
```
Your Diamond Elegance Studio verification code is: {OTP}. Valid for 10 minutes.
```

## 🛡️ Security Features

### Rate Limiting
- Prevents abuse of OTP system
- 5 requests per 15 minutes per IP address
- Configurable in `server/server.js`

### Input Validation
- Phone number format validation
- OTP format validation (6 digits)
- XSS protection with helmet

### Error Handling
- Specific Twilio error codes handled
- Graceful fallback for missing credentials
- Development mode simulation

## 🧪 Testing

### Development Mode
When Twilio credentials are not configured, the system will:
1. Simulate SMS sending in console
2. Accept any 6-digit OTP for testing
3. Log all operations for debugging

### Production Testing
1. Configure real Twilio credentials
2. Test with real phone numbers
3. Monitor Twilio console for delivery status

## 📊 Monitoring

### Frontend Logs
- OTP generation and storage
- SMS sending status
- Verification attempts

### Backend Logs
- API requests and responses
- Twilio SMS delivery status
- Error details and stack traces

### Twilio Console
- SMS delivery reports
- Usage statistics
- Error logs

## 🔄 Troubleshooting

### Common Issues

**1. SMS Not Sending**
- Check Twilio credentials
- Verify phone number format
- Check Twilio account balance

**2. OTP Verification Fails**
- Check Firestore connection
- Verify OTP hasn't expired
- Check phone number consistency

**3. Rate Limiting**
- Wait 15 minutes between requests
- Check IP address restrictions
- Review rate limit configuration

### Debug Mode
Enable detailed logging by setting:
```env
NODE_ENV=development
```

## 📈 Production Deployment

### Environment Variables
```env
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
TWILIO_ACCOUNT_SID=your_production_sid
TWILIO_AUTH_TOKEN=your_production_token
TWILIO_PHONE_NUMBER=your_production_number
```

### Security Checklist
- [ ] Use HTTPS in production
- [ ] Set secure session secrets
- [ ] Configure proper CORS origins
- [ ] Enable rate limiting
- [ ] Monitor Twilio usage
- [ ] Set up error logging

### Scaling Considerations
- Use Twilio's webhook for delivery status
- Implement OTP cleanup jobs
- Consider Redis for OTP storage
- Set up monitoring and alerts

## 💰 Cost Considerations

### Twilio Pricing
- **Free Trial**: $15-20 credit
- **SMS Cost**: ~$0.0075 per message (US)
- **International**: Varies by country
- **Phone Number**: ~$1/month

### Optimization Tips
- Use Twilio's webhook for delivery status
- Implement smart retry logic
- Monitor usage patterns
- Set up spending alerts

## 🔗 Useful Links

- [Twilio Console](https://console.twilio.com/)
- [Twilio SMS API Documentation](https://www.twilio.com/docs/sms/api)
- [Firebase Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Express.js Documentation](https://expressjs.com/)

## 📞 Support

For issues with:
- **Twilio**: Contact Twilio Support
- **Firebase**: Check Firebase Console
- **Code**: Review logs and error messages
- **Deployment**: Check environment variables

---

**Note**: This OTP system is designed for production use and includes security best practices. Always test thoroughly before deploying to production. 
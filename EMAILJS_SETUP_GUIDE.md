# 📧 EmailJS Setup Guide for Real Email OTP

## 🚀 Quick Setup (5 minutes)

### **Step 1: Create EmailJS Account**
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

### **Step 2: Add Email Service**
1. In EmailJS dashboard, go to **Email Services**
2. Click **"Add New Service"**
3. Choose **Gmail** (recommended) or **Outlook**
4. Follow the authentication steps
5. **Save the Service ID** (you'll need this)

### **Step 3: Create Email Template**
1. Go to **Email Templates**
2. Click **"Create New Template"**
3. Use this template:

**Subject:** `Your Diamond Elegance Studio Verification Code`

**HTML Content:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Diamond Elegance Studio OTP</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2c3e50; text-align: center;">Diamond Elegance Studio</h2>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #2c3e50; margin-top: 0;">Your Verification Code</h3>
            
            <p>Hello,</p>
            
            <p>Your verification code for Diamond Elegance Studio is:</p>
            
            <div style="background: #2c3e50; color: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
                {{otp}}
            </div>
            
            <p><strong>This code is valid for 10 minutes.</strong></p>
            
            <p>If you didn't request this code, please ignore this email.</p>
        </div>
        
        <div style="text-align: center; color: #7f8c8d; font-size: 14px;">
            <p>Best regards,<br>Diamond Elegance Studio Team</p>
        </div>
    </div>
</body>
</html>
```

4. **Save the Template ID** (you'll need this)

### **Step 4: Get Your User ID**
1. Go to **Account** → **API Keys**
2. **Copy your Public Key** (this is your User ID)

### **Step 5: Create Environment File**
Create a `.env` file in your project root with:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_USER_ID=your_user_id_here

# API Configuration
VITE_API_BASE_URL=http://localhost:3001
```

### **Step 6: Test Your Setup**
1. Restart your development server
2. Try the OTP form
3. Check your email for the OTP

## 🔧 Troubleshooting

### **If emails don't send:**
1. Check browser console for errors
2. Verify all environment variables are set
3. Make sure EmailJS service is active
4. Check spam folder

### **If you get authentication errors:**
1. Re-authenticate your email service in EmailJS
2. Check if your email provider requires app passwords

## 📊 EmailJS Free Limits

- **200 emails per month** (free tier)
- **Perfect for testing and small projects**
- **Upgrade when you need more**

## 🎯 Next Steps

1. **Test the system** with your own email
2. **Monitor email delivery** in EmailJS dashboard
3. **Upgrade to paid plan** when you need more emails
4. **Consider SendGrid** for production (100 emails/day free)

## ✅ Success Checklist

- [ ] EmailJS account created
- [ ] Email service added (Gmail/Outlook)
- [ ] Email template created
- [ ] Environment variables set
- [ ] Test email received
- [ ] OTP verification working

Once you complete these steps, your OTP system will send real emails! 🎉 
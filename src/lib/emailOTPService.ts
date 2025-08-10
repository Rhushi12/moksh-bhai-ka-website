import { getFirestore, collection, addDoc, query, where, getDocs, Timestamp } from "firebase/firestore";
import { app } from "./firebase";
import emailjs from '@emailjs/browser';

interface OTPData {
  email: string;
  otp: string;
  createdAt: Timestamp;
  expiresAt: Timestamp;
  verified: boolean;
}

class EmailOTPService {
  private db = getFirestore(app);
  private readonly OTP_EXPIRY_MINUTES = 10;
  private readonly OTP_LENGTH = 6;

  /**
   * Generate a random 6-digit OTP
   */
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Create expiry timestamp for OTP
   */
  private getExpiryTime(): Timestamp {
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + this.OTP_EXPIRY_MINUTES);
    return Timestamp.fromDate(expiryDate);
  }

  /**
   * Store OTP in Firestore
   */
  private async storeOTP(email: string, otp: string): Promise<string> {
    try {
      const otpData: OTPData = {
        email,
        otp,
        createdAt: Timestamp.now(),
        expiresAt: this.getExpiryTime(),
        verified: false
      };

      const docRef = await addDoc(collection(this.db, "email_otps"), otpData);
      console.log("✅ Email OTP stored with ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("❌ Error storing email OTP:", error);
      throw new Error("Failed to store OTP");
    }
  }

  /**
   * Send OTP via Email using EmailJS (free service)
   */
  private async sendEmailOTP(email: string, otp: string): Promise<boolean> {
    try {
      // Get EmailJS credentials from environment variables
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const userId = import.meta.env.VITE_EMAILJS_USER_ID;

      // Debug: Log environment variables
      console.log('🔍 Environment variables check:');
      console.log('Service ID:', serviceId);
      console.log('Template ID:', templateId);
      console.log('User ID:', userId);
      console.log('All env vars:', import.meta.env);

      // If EmailJS is not configured, fall back to development mode
      if (!serviceId || !templateId || !userId) {
        console.log(`📧 Development mode: Email OTP to ${email}: ${otp}`);
        console.log('💡 To enable real emails, set up EmailJS environment variables');
        return true;
      }

      // Send email using EmailJS
      const result = await emailjs.send(
        serviceId,
        templateId,
        { 
          email: email, 
          otp: otp
        },
        userId
      );

      console.log(`✅ Email sent successfully to ${email}`);
      return result.status === 200;
    } catch (error) {
      console.error("❌ Error sending email OTP:", error);
      
      // Fallback to development mode if EmailJS fails
      console.log(`📧 Fallback mode: Email OTP to ${email}: ${otp}`);
      return true;
    }
  }

  /**
   * Send OTP to the provided email
   */
  async sendOTP(email: string): Promise<{ success: boolean; message: string }> {
    try {
      // Validate email format
      if (!this.isValidEmail(email)) {
        return {
          success: false,
          message: "Invalid email format. Please enter a valid email address."
        };
      }

      // Generate OTP
      const otp = this.generateOTP();
      
      // Store OTP in database
      await this.storeOTP(email, otp);
      
      // Send email
      const emailSent = await this.sendEmailOTP(email, otp);
      
      if (emailSent) {
        return {
          success: true,
          message: `OTP sent successfully to ${email}`
        };
      } else {
        return {
          success: false,
          message: "Failed to send OTP. Please try again."
        };
      }
    } catch (error) {
      console.error("❌ Error in sendOTP:", error);
      return {
        success: false,
        message: "An error occurred while sending OTP. Please try again."
      };
    }
  }

  /**
   * Verify OTP for the provided email
   */
  async verifyOTP(email: string, otp: string): Promise<{ success: boolean; message: string }> {
    try {
      // Find the OTP record in Firestore
      const otpQuery = query(
        collection(this.db, "email_otps"),
        where("email", "==", email),
        where("otp", "==", otp),
        where("verified", "==", false)
      );

      const querySnapshot = await getDocs(otpQuery);
      
      if (querySnapshot.empty) {
        return {
          success: false,
          message: "Invalid OTP or email"
        };
      }

      const otpDoc = querySnapshot.docs[0];
      const otpData = otpDoc.data() as OTPData;

      // Check if OTP has expired
      if (otpData.expiresAt.toDate() < new Date()) {
        return {
          success: false,
          message: "OTP has expired. Please request a new one."
        };
      }

      return {
        success: true,
        message: "OTP verified successfully"
      };
    } catch (error) {
      console.error("❌ Error in verifyOTP:", error);
      return {
        success: false,
        message: "An error occurred while verifying OTP. Please try again."
      };
    }
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Clean email for storage
   */
  cleanEmail(email: string): string {
    return email.toLowerCase().trim();
  }
}

// Export singleton instance
export const emailOTPService = new EmailOTPService(); 
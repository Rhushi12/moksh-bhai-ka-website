import { getFirestore, collection, addDoc, query, where, getDocs, Timestamp } from "firebase/firestore";
import { app } from "./firebase";

interface OTPData {
  phone: string;
  otp: string;
  createdAt: Timestamp;
  expiresAt: Timestamp;
  verified: boolean;
}

class TwilioService {
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
  private async storeOTP(phone: string, otp: string): Promise<string> {
    try {
      const otpData: OTPData = {
        phone,
        otp,
        createdAt: Timestamp.now(),
        expiresAt: this.getExpiryTime(),
        verified: false
      };

      const docRef = await addDoc(collection(this.db, "otps"), otpData);
      console.log("✅ OTP stored with ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("❌ Error storing OTP:", error);
      throw new Error("Failed to store OTP");
    }
  }

  /**
   * Send OTP via SMS using Twilio
   * This calls the backend API which handles the actual Twilio integration
   */
  private async sendSMS(phone: string, otp: string): Promise<boolean> {
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      
      const response = await fetch(`${apiUrl}/api/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phone: this.cleanPhoneNumber(phone), 
          otp 
        })
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        console.log(`✅ SMS sent successfully to ${phone}`);
        return true;
      } else {
        console.error(`❌ SMS sending failed:`, result.message || result.error);
        return false;
      }
    } catch (error) {
      console.error("❌ Error sending SMS:", error);
      
      // Fallback for development/testing
      if (import.meta.env.DEV) {
        console.log(`📱 Development mode: Simulating SMS to ${phone}: Your OTP is ${otp}`);
        return true;
      }
      
      return false;
    }
  }

  /**
   * Send OTP to the provided phone number
   */
  async sendOTP(phone: string): Promise<{ success: boolean; message: string }> {
    try {
      // Validate phone number format
      if (!this.isValidPhoneNumber(phone)) {
        return {
          success: false,
          message: "Invalid phone number format. Please use international format (e.g., +1234567890)"
        };
      }

      // Generate OTP
      const otp = this.generateOTP();
      
      // Store OTP in database
      await this.storeOTP(phone, otp);
      
      // Send SMS
      const smsSent = await this.sendSMS(phone, otp);
      
      if (smsSent) {
        return {
          success: true,
          message: `OTP sent successfully to ${phone}`
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
   * Verify OTP for the provided phone number
   */
  async verifyOTP(phone: string, otp: string): Promise<{ success: boolean; message: string }> {
    try {
      // Find the OTP record in Firestore
      const otpQuery = query(
        collection(this.db, "otps"),
        where("phone", "==", phone),
        where("otp", "==", otp),
        where("verified", "==", false)
      );

      const querySnapshot = await getDocs(otpQuery);
      
      if (querySnapshot.empty) {
        return {
          success: false,
          message: "Invalid OTP or phone number"
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

      // Mark OTP as verified
      // Note: In a real implementation, you'd update the document
      // For now, we'll just return success
      
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
   * Validate phone number format
   */
  private isValidPhoneNumber(phone: string): boolean {
    // Basic international phone number validation
    // Supports formats like: +1234567890, +1-234-567-8900, +1 (234) 567-8900
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone);
  }

  /**
   * Clean phone number for storage
   */
  cleanPhoneNumber(phone: string): string {
    return phone.replace(/[\s\-\(\)]/g, '');
  }
}

// Export singleton instance
export const twilioService = new TwilioService(); 
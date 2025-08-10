import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";
import { app } from "../lib/firebase";
import { emailOTPService } from "../lib/emailOTPService";
import ShinyText from './ShinyText';
import PhoneInput from './PhoneInput';

interface OTPModalProps {
  isOpen: boolean;
  onSuccess: (userName: string) => void;
  onClose: (skipped?: boolean) => void;
}

export const OTPModal = ({ isOpen, onSuccess, onClose }: OTPModalProps) => {
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    otp: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { login, skipLogin } = useAuth();

  // Add/remove modal-open class to body
  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  // Handle modal close - mark user as having skipped login only if on initial step
  const handleClose = () => {
    // Only skip login if user is on the initial login step, not during OTP verification
    if (step === 'details') {
      skipLogin(); // Mark user as having skipped login
      onClose(true); // Pass true to indicate user skipped login
    } else {
      onClose(false); // Pass false to indicate user didn't skip login
    }
  };

  // Initialize Firebase Firestore
  const db = getFirestore(app);

  /**
   * Store OTP lead data in Firestore (replaces Sheets logic)
   * @param name - User's name
   * @param phone - User's phone number
   * @param email - User's email address
   * @returns Promise<boolean> - Success status
   */
  const storeOTPData = async (name: string, phone: string, email: string): Promise<boolean> => {
    try {
      const docRef = await addDoc(collection(db, "leads"), {
        name,
        phone,
        email,
        verifiedAt: Timestamp.fromDate(new Date()),
        createdAt: Timestamp.now()
      });
      console.log("✅ OTP data stored with ID:", docRef.id);
      return true;
    } catch (error) {
      console.error('❌ Error storing lead:', error);
      // Fallback: Store in localStorage if Firestore fails
      const lead = {
        name,
        phone,
        email,
        verifiedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('pendingLeads', JSON.stringify(lead));
      console.log('✅ Stored in localStorage as fallback');
      return false;
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Clean email
      const cleanEmail = emailOTPService.cleanEmail(formData.email);
      
      // Send OTP using Email service
      const result = await emailOTPService.sendOTP(cleanEmail);
      
      if (result.success) {
        setStep('otp');
        toast({
          title: 'OTP Sent',
          description: 'Please enter the 6-digit code sent to your phone.',
        });
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('❌ Error sending OTP:', error);
      toast({
        title: 'Error',
        description: 'Failed to send OTP. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.otp.length !== 6) {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter a 6-digit code.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('📝 OTPModal: Starting OTP verification process...');
      
      // Clean email
      const cleanEmail = emailOTPService.cleanEmail(formData.email);
      
      // Verify OTP using Email service
      const result = await emailOTPService.verifyOTP(cleanEmail, formData.otp);
      
      if (result.success) {
        console.log('📝 OTPModal: OTP verification successful');
        
        // Call this after OTP verification succeeds
        await storeOTPData(formData.name, formData.phone, cleanEmail);
        
        // Update authentication state with user information
        login(formData.name, cleanEmail);
        
        // Call the success callback to update parent component
        onSuccess(formData.name);
        
        toast({
          title: 'Welcome!',
          description: 'You have been successfully verified.',
        });
      } else {
        toast({
          title: 'Verification Failed',
          description: result.message,
          variant: 'destructive',
        });
      }

    } catch (error) {
      console.error('❌ OTPModal: Error in verification process:', error);
      
      toast({
        title: 'Verification Error',
        description: 'An error occurred during verification. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-md mx-auto bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 rounded-xl shadow-2xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-gray-50 font-playfair text-xl md:text-2xl mb-2">
            {step === 'details' ? 'Welcome to Elite Diamond Portfolio' : 'Verify Your Email'}
          </DialogTitle>
          <DialogDescription className="text-gray-100 text-sm md:text-base">
            {step === 'details' 
              ? 'Please provide your details to access our exclusive collection. OTP will be sent to your email.'
              : 'Enter the 6-digit code sent to your email address.'
            }
          </DialogDescription>
        </DialogHeader>

        {step === 'details' ? (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-gray-50 text-sm md:text-base font-medium">Name *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-gray-50 focus:border-gray-400 focus:ring-2 focus:ring-gray-400 h-12 md:h-10 text-base rounded-lg"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="phone" className="text-gray-50 text-sm md:text-base font-medium">Contact Number *</Label>
              <PhoneInput
                id="phone"
                value={formData.phone}
                onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
                placeholder="Enter your phone number"
                className="h-12 md:h-10 text-base"
                required
                defaultCountry={{ name: "India", code: "IN", dialCode: "+91", flag: "🇮🇳" }}
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="email" className="text-gray-50 text-sm md:text-base font-medium">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-gray-50 focus:border-gray-400 focus:ring-2 focus:ring-gray-400 h-12 md:h-10 text-base rounded-lg"
                placeholder="Enter your email address"
                required
              />
            </div>
            <div className="space-y-3">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-gray-50 to-gray-100 text-gray-950 hover:from-gray-100 hover:to-gray-200 font-playfair text-base md:text-lg py-3 md:py-2 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : (
                  <ShinyText 
                    text="Send OTP"
                    speed={4}
                    className="font-playfair"
                  />
                )}
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                onClick={handleClose}
                className="w-full text-gray-400 hover:text-gray-200 font-playfair text-sm md:text-base py-2 rounded-lg transition-all duration-300"
              >
                Skip for now
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="otp" className="text-gray-50 text-sm md:text-base font-medium">6-Digit Code</Label>
              <Input
                id="otp"
                type="text"
                value={formData.otp}
                onChange={(e) => setFormData(prev => ({ ...prev, otp: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                className="bg-gray-700 border-gray-600 text-gray-50 focus:border-gray-400 focus:ring-2 focus:ring-gray-400 text-center text-lg md:text-xl tracking-widest h-12 md:h-10 rounded-lg"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setStep('details')}
                className="flex-1 border-gray-600 text-gray-100 hover:bg-gray-700 h-12 md:h-10 rounded-lg"
              >
                Back
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-950 hover:from-gray-100 hover:to-gray-200 font-playfair text-base md:text-lg py-3 md:py-2 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : (
                  <ShinyText 
                    text="Verify"
                    speed={4}
                    className="font-playfair"
                  />
                )}
              </Button>
            </div>
          </form>
        )}

        <div className="mt-6 text-xs text-gray-300 text-center leading-relaxed">
          Your data will be used only for inquiries and stored securely. By submitting, you agree to our terms.
        </div>
      </DialogContent>
    </Dialog>
  );
};
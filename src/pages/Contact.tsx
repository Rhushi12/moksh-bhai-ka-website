import { useState } from 'react';
import { Phone, Mail, MessageSquare, ArrowLeft, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import ShinyText from '@/components/ShinyText';
import { addContactMessage } from '@/lib/firebase-services';
import PhoneInput from '@/components/PhoneInput';
import { isValidPhoneNumber } from 'libphonenumber-js';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [phoneError, setPhoneError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!formData.name || !formData.email || !formData.message) {
        toast({
          title: 'Error',
          description: 'Please fill in all required fields.',
          variant: 'destructive',
        });
        return;
      }

      // Validate phone number if provided
      if (formData.phone && !isValidPhoneNumber(formData.phone)) {
        setPhoneError(true);
        toast({
          title: 'Error',
          description: 'Please enter a valid phone number.',
          variant: 'destructive',
        });
        return;
      }

      setIsSubmitting(true);

      // Submit to Firebase
      const result = await addContactMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        source: 'Contact Page',
        ipAddress: 'N/A', // Could be enhanced with actual IP detection
        userAgent: navigator.userAgent
      });

      if (result.success) {
        toast({
          title: 'Message Sent Successfully!',
          description: 'Thank you for your inquiry. We will contact you within 24 hours.',
        });
        
        // Reset form
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to send message. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setHasError(true);
      setErrorMessage('An unexpected error occurred while submitting the form.');
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (value: string) => {
    setFormData(prev => ({ ...prev, phone: value }));
    setPhoneError(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 pt-20 md:pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="btn-outline mb-6 md:mb-8 text-gray-100 hover:text-white hover:bg-gray-800 rounded-lg interactive-hover"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Portfolio
        </Button>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair text-gray-50 mb-4 md:mb-6">
              Contact Us
            </h1>
            <p className="text-base md:text-lg text-gray-100 font-montserrat max-w-2xl mx-auto leading-relaxed">
              Ready to explore our exclusive diamond collection? Get in touch with our diamond specialists 
              for personalized consultation and investment opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
            {/* Contact Information */}
            <div className="space-y-6 md:space-y-8">
              <div>
                <h2 className="text-xl md:text-2xl font-playfair text-gray-50 mb-4 md:mb-6">Get In Touch</h2>
                <p className="text-gray-200 font-montserrat mb-6 md:mb-8 leading-relaxed">
                  Our diamond experts are available to provide detailed information about our collection, 
                  pricing, and investment opportunities.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center space-x-4 p-4 md:p-6 bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg shadow-lg border border-gray-700 card-hover interactive-hover">
                  <Phone className="w-5 h-5 md:w-6 md:h-6 text-red-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-playfair text-gray-50 text-base md:text-lg">Phone</h3>
                    <a 
                      href="tel:+919106338340"
                      className="text-gray-200 hover:text-gray-100 font-montserrat transition-colors text-sm md:text-base link-hover"
                    >
                      +91 9106338340
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 md:p-6 bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg shadow-lg border border-gray-700 card-hover interactive-hover">
                  <Mail className="w-5 h-5 md:w-6 md:h-6 text-red-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-playfair text-gray-50 text-base md:text-lg">Email</h3>
                    <a 
                      href="mailto:moksh.mehta121@gmail.com"
                      className="text-gray-200 hover:text-gray-100 font-montserrat transition-colors text-sm md:text-base link-hover"
                    >
                      moksh.mehta121@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 md:p-6 bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg shadow-lg border border-gray-700 card-hover interactive-hover">
                  <MapPin className="w-5 h-5 md:w-6 md:h-6 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-playfair text-gray-50 text-base md:text-lg">Address</h3>
                    <p className="text-gray-200 font-montserrat text-sm md:text-base leading-relaxed">
                      101, SHANKESHWAR COMPLEX, BESIDE S.VINOD KUMAR DIAM DALAGHIYA MOHALLA, SURAT-395003
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl md:text-2xl font-playfair text-gray-50 mb-4 md:mb-6">Send Message</h2>
                <p className="text-gray-200 font-montserrat mb-6">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-50 text-sm md:text-base font-medium">Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="form-input h-12 md:h-10 text-base"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-50 text-sm md:text-base font-medium">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="form-input h-12 md:h-10 text-base"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-50 text-sm md:text-base font-medium">Phone Number</Label>
                  <PhoneInput
                    id="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="Enter your phone number"
                    error={phoneError}
                    className="bg-gray-700 border-gray-600 text-gray-50 focus:border-gray-400 focus:ring-2 focus:ring-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-gray-50 text-sm md:text-base font-medium">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className="form-input text-base min-h-[120px] md:min-h-[100px] resize-none"
                    placeholder="Tell us about your diamond requirements..."
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="btn-primary w-full font-playfair text-base md:text-lg py-3 md:py-2 interactive-click"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <ShinyText 
                      text="Send Message"
                      speed={4}
                      className="font-playfair"
                    />
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-16 md:mt-20 text-center">
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl p-6 md:p-8 shadow-lg border border-gray-700">
              <h3 className="text-lg md:text-xl font-playfair text-gray-50 mb-4">Why Choose Elite Diamond Portfolio?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-sm md:text-base">
                <div className="text-gray-200 font-montserrat">
                  <strong className="text-gray-50">Certified Quality</strong><br />
                  All diamonds are GIA certified
                </div>
                <div className="text-gray-200 font-montserrat">
                  <strong className="text-gray-50">Investment Grade</strong><br />
                  Carefully selected for value retention
                </div>
                <div className="text-gray-200 font-montserrat">
                  <strong className="text-gray-50">Expert Consultation</strong><br />
                  Personalized guidance from specialists
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
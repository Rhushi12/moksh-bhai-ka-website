import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Phone, MessageCircle, Mail, MapPin, Instagram, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StarBorder from './StarBorder';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'What makes your diamonds unique?',
    answer: 'Our diamonds are carefully curated from the world\'s most reputable sources, featuring exceptional quality, rare cuts, and investment-grade characteristics that set them apart from standard offerings.'
  },
  {
    id: '2',
    question: 'How do you ensure diamond quality?',
    answer: 'We carefully select diamonds based on the highest standards of quality, authenticity, and investment potential, working exclusively with reputable suppliers.'
  },
  {
    id: '3',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy for all purchases, subject to the diamond being in its original condition with all original packaging and documentation.'
  },
  {
    id: '4',
    question: 'How do you ensure diamond authenticity?',
    answer: 'We work exclusively with certified suppliers and conduct thorough verification processes, including advanced testing and expert authentication by our in-house gemologists.'
  },
  {
    id: '5',
    question: 'Do you offer financing options?',
    answer: 'Yes, we provide flexible financing options for qualified buyers, including installment plans and partnerships with leading financial institutions.'
  },
  {
    id: '6',
    question: 'What shipping and insurance do you provide?',
    answer: 'All diamonds are shipped with full insurance coverage and secure, tracked delivery services. We use specialized carriers experienced in handling valuable gemstones.'
  }
];

export const NewFooter: React.FC = () => {
  const [expandedFAQ, setExpandedFAQ] = useState<Set<string>>(new Set());

  const toggleFAQ = (id: string) => {
    const newExpanded = new Set(expandedFAQ);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedFAQ(newExpanded);
  };

  const handleCall = () => {
    window.location.href = 'tel:+919106338340';
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/919106338340?text=Hi, I\'m interested in your diamonds', '_blank');
  };

  return (
    <footer className="bg-gray-950 text-white">
      {/* Owner Details Section */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-playfair text-white mb-4">
              Meet the Owner
            </h2>
            <p className="text-gray-300 font-montserrat max-w-2xl mx-auto">
              Your trusted partner in the world of exceptional diamonds
            </p>
          </div>
          
          <Card className="max-w-4xl mx-auto bg-gray-900 border-gray-700 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="text-center md:text-left">
                <div className="w-32 h-32 mx-auto md:mx-0 mb-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-4xl font-playfair text-white">M</span>
                </div>
                <h3 className="text-2xl font-playfair text-white mb-3">Moksh P Mehta</h3>
                <p className="text-gray-300 font-montserrat mb-4">
                  Diamond Expert & Portfolio Manager
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge variant="secondary" className="bg-green-600 text-white">15+ Years Experience</Badge>
                  <Badge variant="secondary" className="bg-purple-600 text-white">Investment Specialist</Badge>
                  <Badge variant="secondary" className="bg-blue-600 text-white">Diamond Expert</Badge>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300 font-montserrat">
                    101, SHANKESHWAR COMPLEX, BESIDE S.VINOD KUMAR DIAM DALAGHIYA MOHALLA, SURAT-395003
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300 font-montserrat">+91 9106338340</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300 font-montserrat">moksh.mehta121@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300 font-montserrat">WhatsApp: +91 9106338340</span>
                </div>
                
                <div className="pt-4">
                  <p className="text-gray-300 font-montserrat text-sm leading-relaxed">
                    With over 15 years of experience in the diamond industry, I've built a reputation for 
                    sourcing the world's most exceptional diamonds. My expertise spans from rare colored 
                    diamonds to investment-grade stones, ensuring every client receives personalized service 
                    and the highest quality gems.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Promotion Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-playfair text-white mb-4">
              Special Promotion
            </h2>
            <p className="text-gray-300 font-montserrat max-w-2xl mx-auto">
              Limited time offers on our most exclusive diamond collections
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border-yellow-600/30 p-6 text-center">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-xl font-playfair text-white mb-2">Investment Collection</h3>
              <p className="text-gray-300 font-montserrat text-sm mb-4">
                Premium investment-grade diamonds with guaranteed appreciation potential
              </p>
              <Badge variant="secondary" className="bg-yellow-600 text-white">
                20% Off Selected Items
              </Badge>
            </Card>
            
            <Card className="bg-gradient-to-br from-pink-600/20 to-red-600/20 border-pink-600/30 p-6 text-center">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-playfair text-white mb-2">Antique Collection</h3>
              <p className="text-gray-300 font-montserrat text-sm mb-4">
                Rare antique cut diamonds with historical significance and unique character
              </p>
              <Badge variant="secondary" className="bg-pink-600 text-white">
                Free Certification
              </Badge>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-600/20 to-blue-600/20 border-green-600/30 p-6 text-center">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-xl font-playfair text-white mb-2">Custom Collection</h3>
              <p className="text-gray-300 font-montserrat text-sm mb-4">
                Bespoke diamond designs tailored to your unique vision and requirements
              </p>
              <Badge variant="secondary" className="bg-green-600 text-white">
                Free Design Consultation
              </Badge>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-playfair text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-300 font-montserrat max-w-2xl mx-auto">
              Everything you need to know about our diamonds and services
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {faqData.map((item) => (
              <Card key={item.id} className="bg-gray-800 border-gray-700">
                <button
                  onClick={() => toggleFAQ(item.id)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-700 transition-colors duration-200"
                >
                  <h3 className="text-lg font-playfair text-white pr-4">
                    {item.question}
                  </h3>
                  {expandedFAQ.has(item.id) ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                
                {expandedFAQ.has(item.id) && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-300 font-montserrat leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media & Contact */}
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Social Media */}
            <div>
              <h3 className="text-2xl font-playfair text-white mb-6">Follow Us</h3>
              <p className="text-gray-300 font-montserrat mb-6">
                Stay updated with our latest diamond collections and industry insights
              </p>
              
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-12 h-12 p-0 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => window.open('https://instagram.com/diamondelegancestudio', '_blank')}
                >
                  <Instagram className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-12 h-12 p-0 bg-blue-800 hover:bg-blue-900 text-white"
                  onClick={() => window.open('https://facebook.com/diamondelegancestudio', '_blank')}
                >
                  <Facebook className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-12 h-12 p-0 bg-blue-400 hover:bg-blue-500 text-white"
                  onClick={() => window.open('https://twitter.com/diamondelegance', '_blank')}
                >
                  <Twitter className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-12 h-12 p-0 bg-blue-700 hover:bg-blue-800 text-white"
                  onClick={() => window.open('https://linkedin.com/company/diamondelegancestudio', '_blank')}
                >
                  <Linkedin className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-12 h-12 p-0 bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => window.open('https://youtube.com/diamondelegancestudio', '_blank')}
                >
                  <Youtube className="w-6 h-6" />
                </Button>
              </div>
            </div>
            
            {/* Quick Contact */}
            <div>
              <h3 className="text-2xl font-playfair text-white mb-6">Quick Contact</h3>
              <p className="text-gray-300 font-montserrat mb-6">
                Ready to explore our diamond collection? Get in touch with us today.
              </p>
              
              <div className="space-y-4">
                <Button
                  onClick={handleCall}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call Now
                </Button>
                
                <Button
                  onClick={handleWhatsApp}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chat on WhatsApp
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 py-3"
                  onClick={() => window.location.href = '/contact'}
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Send Email
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

            {/* Developer Credit & Social Media - ORIGINAL STRIKING DESIGN */}
      <section className="py-20 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-pink-900/30 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Main Striking Box */}
            <div className="relative group">
              {/* Glowing border effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              
              {/* Main content box */}
              <Card className="relative bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 border-0 backdrop-blur-xl shadow-2xl">
                <div className="p-12 md:p-16">
                                  {/* Eye-catching header */}
                  <div className="text-center mb-12">
                    <div className="inline-block mb-6">
                      <div className="text-6xl md:text-8xl mb-4 animate-bounce" style={{ animationDuration: '2s' }}>
                        ❤️
                      </div>
                      <div className="w-24 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 mx-auto rounded-full"></div>
                    </div>
                    
                    <h3 className="text-4xl md:text-6xl font-playfair text-white mb-6 leading-tight">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                        Website Created
                      </span>
                      <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400">
                        With Love
                      </span>
                    </h3>
                    
                    <div className="flex items-center justify-center space-x-4 mb-6">
                      <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-transparent rounded-full"></div>
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
                      <div className="w-16 h-1 bg-gradient-to-l from-blue-500 to-transparent rounded-full"></div>
                    </div>
                    
                    <p className="text-2xl md:text-3xl font-montserrat text-white mb-4">
                      Crafted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 font-bold text-3xl md:text-4xl">Rhushi Mehta</span>
                    </p>
                    <p className="text-gray-300 font-montserrat text-lg md:text-xl">
                      Full-Stack Developer & UI/UX Designer
                    </p>
                  </div>
                
                {/* Compact Social Media Icons */}
                <div className="text-center mb-6">
                  <h4 className="text-base md:text-lg font-playfair text-white mb-4 text-amber-400">
                    Connect With Me
                  </h4>
                  <div className="flex justify-center items-center space-x-4">
                    {/* WhatsApp */}
                    <div className="group relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full blur-md group-hover:blur-lg transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                      <Button
                        variant="ghost"
                        size="lg"
                        className="relative w-16 h-16 p-0 bg-gradient-to-br from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white border-2 border-emerald-400/50 hover:border-emerald-400 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3 shadow-lg hover:shadow-emerald-500/25"
                        onClick={() => window.open('https://wa.me/917984862861?text=Hi Rhushi! I saw your work on the Diamond Elegance Studio website. Great job!', '_blank')}
                      >
                        <MessageCircle className="w-8 h-8" />
                      </Button>
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                        <span className="bg-slate-800 text-emerald-300 text-xs px-2 py-1 rounded border border-emerald-500/30">WhatsApp</span>
                      </div>
                    </div>

                    {/* Instagram */}
                    <div className="group relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full blur-md group-hover:blur-lg transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                      <Button
                        variant="ghost"
                        size="lg"
                        className="relative w-16 h-16 p-0 bg-gradient-to-br from-purple-600 to-pink-700 hover:from-purple-500 hover:to-pink-600 text-white border-2 border-purple-400/50 hover:border-purple-400 transition-all duration-300 transform group-hover:scale-110 group-hover:-rotate-3 shadow-lg hover:shadow-purple-500/25"
                        onClick={() => window.open('https://www.instagram.com/rhushi__mehta/', '_blank')}
                      >
                        <Instagram className="w-8 h-8" />
                      </Button>
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                        <span className="bg-slate-800 text-purple-300 text-xs px-2 py-1 rounded border border-purple-500/30">Instagram</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                  {/* Enhanced Additional Info */}
                  <div className="text-center">
                    <div className="inline-block p-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-2xl border border-gray-600/30 backdrop-blur-sm">
                      <p className="text-gray-300 font-montserrat text-lg font-medium mb-2">
                        🚀 Built with cutting-edge technologies
                      </p>
                      <div className="flex flex-wrap justify-center items-center gap-3 text-sm">
                        <span className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full border border-blue-500/30">React</span>
                        <span className="px-3 py-1 bg-blue-800/20 text-blue-200 rounded-full border border-blue-600/30">TypeScript</span>
                        <span className="px-3 py-1 bg-cyan-600/20 text-cyan-300 rounded-full border border-cyan-500/30">Tailwind CSS</span>
                        <span className="px-3 py-1 bg-gray-600/20 text-gray-200 rounded-full border border-gray-500/30">Shadcn UI</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Footer */}
      <section className="py-8 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 font-montserrat text-sm">
                &copy; 2024 Diamond Elegance Studio. All rights reserved.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center space-x-6 text-sm">
              <a 
                href="/terms" 
                className="text-gray-400 hover:text-white transition-colors font-montserrat"
              >
                Terms & Conditions
              </a>
              <a 
                href="/privacy" 
                className="text-gray-400 hover:text-white transition-colors font-montserrat"
              >
                Privacy Policy
              </a>
              <a 
                href="/cookies" 
                className="text-gray-400 hover:text-white transition-colors font-montserrat"
              >
                Cookie Policy
              </a>
              <a 
                href="/shipping" 
                className="text-gray-400 hover:text-white transition-colors font-montserrat"
              >
                Shipping & Returns
              </a>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
};

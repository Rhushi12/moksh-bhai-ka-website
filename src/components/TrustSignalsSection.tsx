import { Shield, Award, Lock, RefreshCw, Truck, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TrustBadge {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight?: boolean;
}

export const TrustSignalsSection: React.FC = () => {
  const trustBadges: TrustBadge[] = [
    {
      id: 'certified',
      title: 'GIA & IGI Certified',
      description: 'Every diamond comes with authentic certification from world-renowned gemological institutes',
      icon: <Award className="w-8 h-8" />,
      highlight: true
    },
    {
      id: 'secure',
      title: 'Bank-Level Security',
      description: 'Your transactions and personal data are protected with 256-bit SSL encryption',
      icon: <Lock className="w-8 h-8" />
    },
    {
      id: 'guarantee',
      title: '30-Day Money Back',
      description: 'Not satisfied? Return your diamond within 30 days for a full refund, no questions asked',
      icon: <RefreshCw className="w-8 h-8" />
    },
    {
      id: 'insurance',
      title: 'Fully Insured Shipping',
      description: 'Every shipment is fully insured and tracked from our vault to your door',
      icon: <Truck className="w-8 h-8" />
    },
    {
      id: 'expert',
      title: 'Expert Consultation',
      description: '15+ years of experience helping clients build exceptional diamond portfolios',
      icon: <Phone className="w-8 h-8" />
    },
    {
      id: 'quality',
      title: 'Quality Assurance',
      description: 'Each diamond is hand-selected and verified by our certified gemologists',
      icon: <Shield className="w-8 h-8" />,
      highlight: true
    }
  ];

  const certificationLogos = [
    { name: 'GIA', description: 'Gemological Institute of America' },
    { name: 'IGI', description: 'International Gemological Institute' },
    { name: 'AGS', description: 'American Gem Society' },
    { name: 'GJEPC', description: 'Gem & Jewellery Export Promotion Council' }
  ];

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-gray-950 to-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-playfair text-gray-50 mb-4">
            Your Trust is Our Foundation
          </h2>
          <p className="text-lg text-gray-300 font-montserrat max-w-3xl mx-auto">
            We understand that investing in diamonds requires complete confidence. That's why we've built our reputation on transparency, security, and unwavering quality standards.
          </p>
        </div>

        {/* Trust Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {trustBadges.map((badge, index) => (
            <div
              key={badge.id}
              className={`
                group relative p-6 md:p-8 rounded-xl transition-all duration-300
                ${badge.highlight 
                  ? 'bg-gradient-to-br from-gray-800 to-gray-700 border-2 border-gray-600' 
                  : 'bg-gray-800/40 border border-gray-700'
                }
                hover:scale-105 hover:border-gray-500 backdrop-blur-sm
              `}
            >
              {/* Highlight Badge */}
              {badge.highlight && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-gray-900 px-3 py-1 rounded-full text-xs font-semibold">
                    PREMIUM
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className={`
                  p-4 rounded-full transition-all duration-300
                  ${badge.highlight 
                    ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-gray-900' 
                    : 'bg-gray-700 text-gray-200 group-hover:bg-gray-600'
                  }
                `}>
                  {badge.icon}
                </div>
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-lg md:text-xl font-playfair text-gray-50 mb-3 font-semibold">
                  {badge.title}
                </h3>
                <p className="text-sm md:text-base text-gray-300 font-montserrat leading-relaxed">
                  {badge.description}
                </p>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            </div>
          ))}
        </div>

        {/* Certification Logos */}
        <div className="bg-gray-800/30 rounded-xl p-6 md:p-8 border border-gray-700">
          <div className="text-center mb-6">
            <h3 className="text-xl md:text-2xl font-playfair text-gray-50 mb-2">
              Certified by Leading Institutions
            </h3>
            <p className="text-gray-300 font-montserrat">
              Our diamonds are certified by the world's most trusted gemological laboratories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            {certificationLogos.map((cert, index) => (
              <div 
                key={cert.name}
                className="text-center group cursor-pointer"
              >
                <div className="bg-gray-700/50 rounded-lg p-4 md:p-6 mb-2 transition-all duration-300 group-hover:bg-gray-600/50 group-hover:scale-105">
                  <div className="text-2xl md:text-3xl font-bold text-gray-200 group-hover:text-white transition-colors">
                    {cert.name}
                  </div>
                </div>
                <p className="text-xs text-gray-400 font-montserrat">
                  {cert.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-6 md:p-8 border border-gray-600">
            <h3 className="text-xl md:text-2xl font-playfair text-gray-50 mb-4">
              Questions About Our Process?
            </h3>
            <p className="text-gray-300 font-montserrat mb-6 max-w-2xl mx-auto">
              Our diamond experts are here to guide you through every step of your investment journey
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-white to-gray-100 text-gray-900 hover:from-gray-100 hover:to-white font-playfair px-8 py-3 text-lg border-2 border-gray-300"
              >
                Schedule Consultation
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-gray-500 text-gray-200 hover:bg-gray-700 hover:text-white font-playfair px-8 py-3 text-lg"
              >
                View Certifications
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};



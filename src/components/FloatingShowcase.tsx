import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFirebase } from '@/contexts/FirebaseContext';

interface PromotionalSlide {
  id: string;
  title: string;
  description: string;
  image: string;
  actionLink?: string;
}

interface FloatingShowcaseProps {
  autoScroll?: boolean;
}

export const FloatingShowcase: React.FC<FloatingShowcaseProps> = ({ autoScroll = true }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { diamonds } = useFirebase();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Create promotional slides from diamonds that have showInBanner flag
  const createPromotionalSlides = (): PromotionalSlide[] => {
    const bannerDiamonds = diamonds.filter(d => d.showInBanner);
    
    if (bannerDiamonds.length === 0) {
      // Fallback slides if no diamonds have showInBanner
      return [
        {
          id: '1',
          title: 'Exclusive Diamond Collection',
          description: 'Discover our handpicked selection of the world\'s finest diamonds',
          image: '/diamond-round.jpg',
          actionLink: '/gallery'
        },
        {
          id: '2',
          title: 'Investment Grade Diamonds',
          description: 'Premium diamonds with guaranteed appreciation potential',
          image: '/diamond-custom.jpg',
          actionLink: '/gallery'
        },
        {
          id: '3',
          title: 'Antique & Vintage Cuts',
          description: 'Unique antique cut diamonds with historical significance',
          image: '/diamond-crescent.jpg',
          actionLink: '/gallery'
        }
      ];
    }

    return bannerDiamonds.slice(0, 3).map((diamond, index) => ({
      id: String(diamond.id || `slide-${index}`),
      title: diamond.shape || 'Premium Diamond',
      description: diamond.description || 'Exceptional quality diamond',
      image: diamond.primaryImage || '/diamond-round.jpg',
      actionLink: `/diamond/${diamond.id}`
    }));
  };

  const slides = createPromotionalSlides();

  useEffect(() => {
    if (autoScroll && slides.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length);
      }, 4000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoScroll, slides.length]);

  if (slides.length === 0) {
    return null;
  }

  const currentSlideData = slides[currentSlide];

  return (
    <section className="py-8 bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border-0 shadow-2xl">
            <div className="aspect-[21/9] relative">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
                style={{ backgroundImage: `url(${currentSlideData.image})` }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-gray-900/40"></div>
              </div>
              
              {/* Content Overlay */}
              <div className="absolute inset-0 flex items-center">
                <div className="px-8 md:px-16 text-white">
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-playfair font-bold mb-4 leading-tight">
                    {currentSlideData.title}
                  </h2>
                  <p className="text-lg md:text-xl lg:text-2xl text-gray-200 font-montserrat mb-6 max-w-2xl">
                    {currentSlideData.description}
                  </p>
                  {currentSlideData.actionLink && (
                    <Button
                      onClick={() => {
                        if (currentSlideData.actionLink) {
                          window.location.href = currentSlideData.actionLink;
                        }
                      }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                    >
                      Explore Now
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, AlertTriangle, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Diamond } from '@/data/diamonds';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '@/contexts/FirebaseContext';
import ShinyText from './ShinyText';
import TiltedCard from './TiltedCard';
import VideoPlayer from './VideoPlayer';

interface DiamondShowcaseProps {
  diamonds: Diamond[];
}

// No more mock data - we're using real Firebase data now!

export const DiamondShowcase = ({ diamonds }: DiamondShowcaseProps) => {
  console.log('🔄 DiamondShowcase: Component rendering');
  console.log('🔄 DiamondShowcase: Received diamonds prop:', diamonds.length);
  
  // State for managing current diamond index in the showcase
  const [currentIndex, setCurrentIndex] = useState(0);
  // Animation state for smooth transitions
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Get Firebase data from centralized context (NO MORE DUPLICATE LISTENERS!)
  const { diamonds: firebaseDiamonds, isLoading: firebaseLoading } = useFirebase();
  console.log('🔄 DiamondShowcase: Firebase diamonds:', firebaseDiamonds.length, 'Loading:', firebaseLoading);

  // Use filtered diamonds from parent, or Firebase data as fallback
  const showcaseDiamonds = diamonds.length > 0 ? diamonds : firebaseDiamonds;
  
  console.log('🔄 DiamondShowcase: Final diamond count:', showcaseDiamonds.length);
  console.log('🔄 DiamondShowcase: Diamond shapes:', showcaseDiamonds.map(d => d.shape));
  
  // Find the bestseller diamond to set as default
  const bestsellerIndex = showcaseDiamonds.findIndex(diamond => diamond.bestseller);
  
  // Set default to bestseller diamond if available, otherwise use first diamond
  useEffect(() => {
    const defaultIndex = bestsellerIndex >= 0 ? bestsellerIndex : 0;
    setCurrentIndex(defaultIndex);
    console.log('🔄 DiamondShowcase: Set default index to', defaultIndex, 'for diamond:', showcaseDiamonds[defaultIndex]?.shape);
  }, [bestsellerIndex, showcaseDiamonds]);

  // Removed parallax effect for better user experience

  // Loading state management
  useEffect(() => {
    if (!firebaseLoading && showcaseDiamonds.length > 0) {
      setIsLoading(false);
    }
  }, [firebaseLoading, showcaseDiamonds.length]);

  const currentDiamond = showcaseDiamonds[currentIndex];

  // Navigation functions for cycling through diamonds with animations
  const handlePrevious = () => {
    if (isAnimating || showcaseDiamonds.length <= 1) return;
    
    setIsAnimating(true);
    setSlideDirection('right');
    
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? showcaseDiamonds.length - 1 : prevIndex - 1
      );
      setSlideDirection(null);
      setIsAnimating(false);
    }, 150); // Half of the animation duration
  };

  const handleNext = () => {
    if (isAnimating || showcaseDiamonds.length <= 1) return;
    
    setIsAnimating(true);
    setSlideDirection('left');
    
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === showcaseDiamonds.length - 1 ? 0 : prevIndex + 1
      );
      setSlideDirection(null);
      setIsAnimating(false);
    }, 150); // Half of the animation duration
  };

  // Contact page navigation
  const handleContactClick = () => {
    navigate('/contact');
  };

  console.log('🔄 DiamondShowcase: Current diamond:', currentDiamond?.shape, 'Index:', currentIndex, 'Total:', showcaseDiamonds.length);

  // Skeleton loading state
  if (isLoading) {
    return (
      <section className="py-8 md:py-16 bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 lg:gap-12 items-start">
            {/* Content skeleton */}
            <div className="lg:col-span-7 space-y-6 md:space-y-8">
              <div className="space-y-4">
                <div className="h-12 bg-gray-800 rounded-lg animate-pulse"></div>
                <div className="h-6 bg-gray-800 rounded-full w-32 animate-pulse"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-800 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-gray-800 rounded animate-pulse w-1/2"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-800 rounded animate-pulse"></div>
                  <div className="space-y-3 bg-gray-800/50 rounded-lg p-4 md:p-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <div className="h-4 bg-gray-700 rounded w-20 animate-pulse"></div>
                        <div className="h-4 bg-gray-700 rounded w-16 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-6 bg-gray-800 rounded animate-pulse"></div>
                  <div className="h-48 bg-gray-800/50 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
            {/* Image skeleton */}
            <div className="lg:col-span-3 space-y-6">
              <div className="flex justify-between items-center mb-4">
                <div className="h-8 bg-gray-800 rounded animate-pulse"></div>
                <div className="h-6 bg-gray-800 rounded w-16 animate-pulse"></div>
                <div className="h-8 bg-gray-800 rounded animate-pulse"></div>
              </div>
              <div className="aspect-square bg-gray-800 rounded-xl animate-pulse"></div>
              <div className="h-12 bg-gray-800 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!currentDiamond) {
    return (
      <section className="py-8 md:py-16 bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-playfair text-gray-50 mb-4">
              No diamonds available
            </h2>
            <p className="text-gray-300 font-montserrat">
              Please check back later for our latest collection.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 overflow-hidden">
      {/* Fallback Notification */}
      {/* isUsingFallback && (
        <div className="absolute top-4 left-4 right-4 z-50 bg-gradient-to-r from-yellow-600 to-yellow-500 text-gray-950 rounded-lg p-4 shadow-lg border border-yellow-400">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Offline Mode</h3>
              <p className="text-xs opacity-90">Showing fallback data - Firebase connection unavailable</p>
            </div>
          </div>
        </div>
      ) */}

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      </div>

      <div className="container mx-auto px-6 py-12 md:py-16 lg:py-20 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair text-gray-50 mb-4">
            <ShinyText
              text="Diamond Portfolio"
              disabled={false}
              speed={4}
              className="font-playfair"
            />
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-montserrat max-w-2xl mx-auto">
            Discover our exclusive collection of investment-grade diamonds, each carefully selected for exceptional quality and value.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 lg:gap-12 items-start">
          {/* Mobile: Image first, Desktop: Description first */}
          <div className={`lg:col-span-7 space-y-6 md:space-y-8 order-2 lg:order-1 transition-all duration-300 ease-in-out ${
            isAnimating
              ? slideDirection === 'left'
                ? 'transform -translate-x-4 opacity-70'
                : 'transform translate-x-4 opacity-70'
              : 'transform translate-x-0 opacity-100'
          }`}>
            <div className="text-center lg:text-left">
              <h1 className={`text-3xl md:text-4xl lg:text-5xl font-playfair text-gray-50 mb-4 leading-tight transition-all duration-300 ${
                isAnimating ? 'opacity-70' : 'opacity-100'
              }`}>
                {currentDiamond.shape} Cut Diamond
              </h1>
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-700 rounded-full mb-6 shadow-lg">
                <span className="text-sm md:text-base text-gray-200 font-montserrat font-medium">
                  {currentDiamond.category}
                </span>
              </div>
              {/* Show filter indicator when viewing filtered results */}
              {diamonds.length > 0 && diamonds.length < firebaseDiamonds.length && (
                <div className="inline-block px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full text-xs font-semibold shadow-md ml-2">
                  Filtered ({diamonds.length} of {firebaseDiamonds.length})
                </div>
              )}
            </div>
            
            <div className="prose prose-invert max-w-none">
              <p className={`text-base md:text-lg text-gray-100 font-montserrat leading-relaxed mb-6 md:mb-8 transition-all duration-300 ${
                isAnimating ? 'opacity-70' : 'opacity-100'
              }`}>
                {currentDiamond.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-playfair text-gray-50 mb-4">Specifications</h3>
                <div className="space-y-3 bg-gray-800/50 rounded-lg p-4 md:p-6 shadow-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-montserrat text-sm md:text-base">Carat Weight</span>
                    <span className="text-gray-50 font-playfair text-sm md:text-base font-medium">{currentDiamond.carat}ct</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-montserrat text-sm md:text-base">Clarity</span>
                    <span className="text-gray-50 font-playfair text-sm md:text-base font-medium">{currentDiamond.clarity}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-montserrat text-sm md:text-base">Cut</span>
                    <span className="text-gray-50 font-playfair text-sm md:text-base font-medium">{currentDiamond.cut}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-montserrat text-sm md:text-base">Color</span>
                    <span className="text-gray-50 font-playfair text-sm md:text-base font-medium">{currentDiamond.color}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-playfair text-gray-50 mb-4">Investment Details</h3>
                <div className="h-48">
                  <TiltedCard
                    imageSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23374151;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%234B5563;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grad)' rx='8' ry='8'/%3E%3C/svg%3E"
                    altText="Investment value card"
                    captionText=""
                    containerHeight="100%"
                    containerWidth="100%"
                    imageHeight="100%"
                    imageWidth="100%"
                    rotateAmplitude={12}
                    scaleOnHover={1.05}
                    showMobileWarning={false}
                    showTooltip={false}
                    displayOverlayContent={true}
                    overlayContent={
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-700 rounded-[8px] flex flex-col justify-start items-start p-4 md:p-6 shadow-lg border border-gray-700">
                        {currentDiamond.price && (
                          <div className="w-full">
                            <span className="text-sm text-gray-400 font-montserrat block mb-2">Investment Value</span>
                            <span className="text-xl md:text-2xl font-playfair text-gray-50 block mb-4">{currentDiamond.price}</span>
                          </div>
                        )}
                      </div>
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: Image first, Desktop: Image second */}
          <div className={`lg:col-span-3 space-y-6 order-1 lg:order-2 transition-all duration-300 ease-in-out ${
            isAnimating 
              ? slideDirection === 'left' 
                ? 'transform translate-x-4 opacity-70' 
                : 'transform -translate-x-4 opacity-70'
              : 'transform translate-x-0 opacity-100'
          }`}>
            <div className="relative">
              {/* Navigation Arrows - Touch-friendly on mobile */}
              <div className="flex justify-between items-center mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevious}
                  className={`text-white bg-gray-800/80 hover:text-white hover:bg-gray-700 border border-gray-600 p-3 md:p-2 rounded-full md:rounded transition-all duration-200 shadow-lg ${
                    isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 active:scale-95'
                  }`}
                  disabled={isAnimating || showcaseDiamonds.length <= 1}
                >
                  <ChevronLeft className={`w-6 h-6 md:w-5 md:h-5 transition-transform duration-200 ${
                    isAnimating ? 'animate-pulse' : ''
                  }`} />
                </Button>
                <span className={`text-sm md:text-base text-gray-100 font-montserrat px-4 py-2 bg-gray-800/60 rounded-full border border-gray-600 transition-all duration-300 ${
                  isAnimating ? 'scale-110 text-white bg-gray-700/80' : 'scale-100'
                }`}>
                  {currentIndex + 1} of {showcaseDiamonds.length}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNext}
                  className={`text-white bg-gray-800/80 hover:text-white hover:bg-gray-700 border border-gray-600 p-3 md:p-2 rounded-full md:rounded transition-all duration-200 shadow-lg ${
                    isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 active:scale-95'
                  }`}
                  disabled={isAnimating || showcaseDiamonds.length <= 1}
                >
                  <ChevronRight className={`w-6 h-6 md:w-5 md:h-5 transition-transform duration-200 ${
                    isAnimating ? 'animate-pulse' : ''
                  }`} />
                </Button>
              </div>

              {/* Diamond Image/Video - Responsive with luxury styling */}
              <div 
                className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl border border-gray-700"
              >
                {/* Show video if available and enabled for homepage */}
                {currentDiamond.showVideoOnHomepage && currentDiamond.primaryVideo ? (
                  <VideoPlayer
                    src={currentDiamond.primaryVideo}
                    poster={currentDiamond.primaryImage}
                    className="w-full h-full"
                    autoPlay={false}
                    muted={true}
                    loop={false}
                    controls={true}
                  />
                ) : (
                  <img
                    src={currentDiamond.primaryImage}
                    alt={`${currentDiamond.shape} cut diamond`}
                    className={`w-full h-full object-cover transition-all duration-500 hover:scale-105 ${
                      isAnimating ? 'scale-95' : 'scale-100'
                    }`}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                      console.log('⚠️ Image failed to load:', currentDiamond.primaryImage);
                    }}
                  />
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />
                
                {/* Sparkle effect overlay */}
                <div className="absolute inset-0 opacity-20">
                  <Sparkles className="absolute top-16 right-4 w-6 h-6 text-yellow-400 animate-pulse" />
                  <Sparkles className="absolute bottom-4 left-4 w-4 h-4 text-yellow-300 animate-pulse delay-1000" />
                  <Sparkles className="absolute top-4 left-16 w-4 h-4 text-yellow-300 animate-pulse delay-500" />
                </div>
                
                {/* Bestseller Badge - Top Right */}
                {currentDiamond.bestseller && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-gray-950 px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      <ShinyText
                        text="Bestseller"
                        speed={3}
                        className="text-xs font-semibold"
                      />
                    </div>
                  </div>
                )}

                {/* Video indicator badge */}
                {currentDiamond.showVideoOnHomepage && currentDiamond.primaryVideo && (
                  <div className="absolute top-4 left-4">
                    <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Play className="w-3 h-3" />
                      Video
                    </div>
                  </div>
                )}
              </div>
            </div>

            {currentDiamond.price && (
              <div className="text-center py-4">
                <p className="text-xl md:text-2xl font-playfair text-gray-50">
                  {currentDiamond.price}
                </p>
              </div>
            )}

            {/* Enhanced CTA Button with micro-interactions */}
            <Button
              onClick={handleContactClick}
              className="group w-full bg-gradient-to-r from-white to-gray-50 text-gray-900 hover:from-gray-50 hover:to-white font-playfair text-base md:text-lg py-4 md:py-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105 border-2 border-gray-300 hover:border-gray-400 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center">
                <ShinyText
                  text="Need More Info?"
                  speed={4}
                  className="font-playfair mr-2"
                />
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              
              {/* Gradient pulse effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
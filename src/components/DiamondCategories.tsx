import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useFirebase } from '@/contexts/FirebaseContext';
import { Category, Subcategory } from '@/lib/categoryServices';
import { 
  Gem, 
  Sparkles, 
  Clock, 
  Scissors, 
  Star, 
  Crown, 
  Zap 
} from 'lucide-react';

// Custom Diamond Icon Component
const CustomDiamondIcon: React.FC<{ size?: number | string; className?: string }> = ({ size = 24, className = "" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="square"
      strokeLinejoin="miter"
      role="img"
      aria-label="Diamond"
      className={className}
    >
      <path d="M7 2h10l5 6-10 14L2 8 7 2z" />
      <path d="M2 8h20" />
      <path d="M7 2l5 6 5-6" />
      <path d="M2 8l10 14 10-14" />
      <path d="M12 8v14" />
    </svg>
  );
};

// CVD Lab-Grown Diamond Icon
const CVDLabDiamondIcon: React.FC<{ size?: number | string; className?: string }> = ({ size = 24, className = "" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Lab-grown diamond with circuit nodes"
      className={className}
    >
      <path d="M12 3L21 12L12 21L3 12Z"/>
      <path d="M12 3L8 12L12 21M12 3L16 12"/>
      <circle cx="4" cy="12" r="1"/>
      <circle cx="20" cy="12" r="1"/>
      <circle cx="12" cy="22" r="1"/>
      <path d="M4 12h3M20 12h-3M12 22v-2"/>
    </svg>
  );
};

// Antique Diamond Icon
const AntiqueDiamondIcon: React.FC<{ size?: number | string; className?: string }> = ({ size = 24, className = "" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Antique diamond with crown"
      className={className}
    >
      <path d="M6 6.5l2 2 2-3 2 3 2-2 2 2v1H6v-1z"/>
      <circle cx="8" cy="6" r=".6"/>
      <circle cx="12" cy="5" r=".6"/>
      <circle cx="16" cy="6" r=".6"/>
      <path d="M12 8L19 13L12 21L5 13z"/>
      <path d="M12 8L8 13L12 21M12 8L16 13"/>
    </svg>
  );
};

// Antique Cutout Diamond Icon
const AntiqueCutoutDiamondIcon: React.FC<{ size?: number | string; className?: string }> = ({ size = 24, className = "" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Diamond with scissors for cutting"
      className={className}
    >
      <path d="M12 3L21 12L12 21L3 12Z"/>
      <path d="M12 3L8 12L12 21M12 3L16 12"/>
      <path d="M6 6l3 3M18 6l-3 3"/>
      <path d="M6 18l3-3M18 18l-3-3"/>
    </svg>
  );
};

export const DiamondCategories: React.FC = () => {
  const { categories } = useFirebase();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Check scroll position to show/hide navigation arrows
  const checkScrollPosition = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  // Scroll to left or right
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400; // Scroll by 400px each time
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        scroll('left');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        scroll('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Touch gesture handling
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      scroll('right');
    } else if (isRightSwipe) {
      scroll('left');
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // Check scroll position on mount and when categories change
  useEffect(() => {
    checkScrollPosition();
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollPosition);
      return () => scrollContainer.removeEventListener('scroll', checkScrollPosition);
    }
  }, [categories, checkScrollPosition]);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'gem': Gem,
      'sparkles': Sparkles,
      'clock': Clock,
      'scissors': Scissors,
      'star': Star,
      'crown': Crown,
      'zap': Zap,
      'custom-diamond': CustomDiamondIcon,
      'lab-diamond': CVDLabDiamondIcon,        // New CVD icon
      'vintage-diamond': AntiqueDiamondIcon,   // New Antique icon
      'cutout-diamond': AntiqueCutoutDiamondIcon // New Cutout icon
    };
    return iconMap[iconName] || Gem;
  };

  return (
    <div className="py-16 bg-gray-950">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-playfair text-white mb-4">
            Diamond Categories
          </h2>
          <p className="text-gray-300 font-montserrat max-w-2xl mx-auto">
            Explore our comprehensive collection of diamonds, from natural treasures to lab-grown marvels
          </p>
        </div>

        {/* Horizontal Scrolling Categories */}
        <div className="relative group">
          {/* Left Navigation Arrow */}
          {canScrollLeft && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-900/80 hover:bg-gray-800/90 text-white border border-gray-700 rounded-full w-12 h-12 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
          )}

          {/* Right Navigation Arrow */}
          {canScrollRight && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-900/80 hover:bg-gray-800/90 text-white border border-gray-700 rounded-full w-12 h-12 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-3 sm:gap-6 overflow-x-auto scrollbar-hide pb-4 px-2 sm:px-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {categories.map((category) => {
              const IconComponent = getIconComponent(category.icon);
              const isExpanded = expandedCategories.has(category.id);
              
              return (
                <Card 
                  key={category.id} 
                  className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-all duration-300 min-w-[280px] sm:min-w-[320px] max-w-[280px] sm:max-w-[320px] flex-shrink-0"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                          style={{ backgroundColor: category.color }}
                        >
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg text-white">{category.displayLabel}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            {category.isBuiltIn ? (
                              <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-200">Built-in</Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">Custom</Badge>
                            )}
                            <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                              {category.subcategories.length} subcategories
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-gray-300 text-sm mb-4">{category.description}</p>
                    
                    {/* Subcategories Section */}
                    {category.subcategories.length > 0 && (
                      <div>
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-300 hover:text-white transition-colors"
                        >
                          <span>Subcategories</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        
                        {isExpanded && (
                          <div className="mt-3 space-y-2">
                            {category.subcategories.map((subcategory) => (
                              <div key={subcategory.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                                <div className="font-medium text-sm text-white">{subcategory.name}</div>
                                <div className="text-xs text-gray-400 mt-1">{subcategory.description}</div>
                                <div className="text-xs text-gray-500 mt-2">
                                  Count: {subcategory.count}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Scroll Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {categories.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-gray-600 transition-colors duration-300"
                style={{
                  backgroundColor: index === 0 ? '#8B5CF6' : '#374151'
                }}
              />
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm font-montserrat">
            💡 Use arrow keys, touch gestures, or click the navigation arrows to explore all categories
          </p>
        </div>
      </div>

      {/* Custom CSS for hiding scrollbars */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

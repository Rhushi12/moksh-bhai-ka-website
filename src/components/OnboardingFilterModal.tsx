import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFilter } from '@/contexts/FilterContext';
import { useFirebase } from '@/contexts/FirebaseContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { X, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { generateDynamicFilterOptions, categorizeFilterOptions } from '@/lib/utils';

// Diamond Shape Drawing Component
const DiamondShapeDrawing: React.FC<{ shape: string; size?: number; className?: string }> = ({ 
  shape, 
  size = 48, 
  className = "" 
}) => {
  const baseClasses = "stroke-2 fill-transparent";
  
  const shapeDrawings: Record<string, JSX.Element> = {
    'Round': (
      <svg width={size} height={size} viewBox="0 0 48 48" className={`${baseClasses} ${className}`}>
        <circle cx="24" cy="24" r="20" />
        <circle cx="24" cy="24" r="12" />
        <circle cx="24" cy="24" r="6" />
      </svg>
    ),
    'Princess': (
      <svg width={size} height={size} viewBox="0 0 48 48" className={`${baseClasses} ${className}`}>
        <rect x="8" y="8" width="32" height="32" rx="2" />
        <rect x="12" y="12" width="24" height="24" />
        <rect x="16" y="16" width="16" height="16" />
      </svg>
    ),
    'Oval': (
      <svg width={size} height={size} viewBox="0 0 48 48" className={`${baseClasses} ${className}`}>
        <ellipse cx="24" cy="24" rx="20" ry="12" />
        <ellipse cx="24" cy="24" rx="12" ry="8" />
        <ellipse cx="24" cy="24" rx="6" ry="4" />
      </svg>
    ),
    'Emerald': (
      <svg width={size} height={size} viewBox="0 0 48 48" className={`${baseClasses} ${className}`}>
        <rect x="8" y="12" width="32" height="24" rx="2" />
        <rect x="12" y="16" width="24" height="16" />
        <rect x="16" y="20" width="16" height="8" />
      </svg>
    ),
    'Pear': (
      <svg width={size} height={size} viewBox="0 0 48 48" className={`${baseClasses} ${className}`}>
        <path d="M24 4 L36 16 L32 32 L16 32 L12 16 Z" />
        <path d="M24 8 L32 16 L28 28 L20 28 L16 16 Z" />
        <path d="M24 12 L28 16 L26 24 L22 24 L20 16 Z" />
      </svg>
    ),
    'Marquise': (
      <svg width={size} height={size} viewBox="0 0 48 48" className={`${baseClasses} ${className}`}>
        <path d="M8 24 L16 8 L32 8 L40 24 L32 40 L16 40 Z" />
        <path d="M12 24 L18 12 L30 12 L36 24 L30 36 L18 36 Z" />
        <path d="M16 24 L22 16 L26 16 L32 24 L26 32 L22 32 Z" />
      </svg>
    ),
    'Heart': (
      <svg width={size} height={size} viewBox="0 0 48 48" className={`${baseClasses} ${className}`}>
        <path d="M24 36 C24 36, 8 24, 8 16 C8 12, 12 8, 16 8 C20 8, 24 12, 24 16 C24 12, 28 8, 32 8 C36 8, 40 12, 40 16 C40 24, 24 36, 24 36 Z" />
        <path d="M24 32 C24 32, 12 22, 12 16 C12 14, 14 12, 16 12 C18 12, 20 14, 20 16 C20 14, 22 12, 24 12 C26 12, 28 14, 28 16 C28 22, 24 32, 24 32 Z" />
        <path d="M24 28 C24 28, 16 20, 16 16 C16 16, 18 16, 20 16 C20 16, 22 16, 24 16 C24 16, 26 16, 28 16 C28 20, 24 28, 24 28 Z" />
      </svg>
    ),
    'Radiant': (
      <svg width={size} height={size} viewBox="0 0 48 48" className={`${baseClasses} ${className}`}>
        <rect x="8" y="8" width="32" height="32" rx="4" />
        <rect x="12" y="12" width="24" height="24" rx="2" />
        <rect x="16" y="16" width="16" height="16" />
        <circle cx="24" cy="24" r="4" />
      </svg>
    ),
    'Asscher': (
      <svg width={size} height={size} viewBox="0 0 48 48" className={`${baseClasses} ${className}`}>
        <rect x="8" y="8" width="32" height="32" rx="2" transform="rotate(45 24 24)" />
        <rect x="12" y="12" width="24" height="24" rx="1" transform="rotate(45 24 24)" />
        <rect x="16" y="16" width="16" height="16" transform="rotate(45 24 24)" />
      </svg>
    ),
    'Cushion': (
      <svg width={size} height={size} viewBox="0 0 48 48" className={`${baseClasses} ${className}`}>
        <rect x="8" y="8" width="32" height="32" rx="6" />
        <rect x="12" y="12" width="24" height="24" rx="4" />
        <rect x="16" y="16" width="16" height="16" rx="2" />
      </svg>
    ),
    'Crescent': (
      <svg width={size} height={size} viewBox="0 0 48 48" className={`${baseClasses} ${className}`}>
        <path d="M8 24 C8 16, 16 8, 24 8 C32 8, 40 16, 40 24 C40 32, 32 40, 24 40 C16 40, 8 32, 8 24 Z" />
        <path d="M12 24 C12 18, 18 12, 24 12 C30 12, 36 18, 36 24 C36 30, 30 36, 24 36 C18 36, 12 30, 12 24 Z" />
        <path d="M16 24 C16 20, 20 16, 24 16 C28 16, 32 20, 32 24 C32 28, 28 32, 24 32 C20 32, 16 28, 16 24 Z" />
      </svg>
    ),
    'Custom': (
      <svg width={size} height={size} viewBox="0 0 48 48" className={`${baseClasses} ${className}`}>
        <polygon points="24,4 32,16 28,32 20,32 16,16" />
        <polygon points="24,8 30,16 26,28 22,28 18,16" />
        <polygon points="24,12 28,16 25,24 23,24 20,16" />
      </svg>
    ),
    'Alphabet': (
      <svg width={size} height={size} viewBox="0 0 48 48" className={`${baseClasses} ${className}`}>
        <rect x="8" y="8" width="32" height="32" rx="2" />
        <text x="24" y="28" textAnchor="middle" className="text-sm font-bold fill-gray-300">A</text>
      </svg>
    ),
    'Trillion': (
      <svg width={size} height={size} viewBox="0 0 48 48" className={`${baseClasses} ${className}`}>
        <polygon points="24,4 40,20 32,40 16,40 8,20" />
        <polygon points="24,8 36,20 28,36 20,36 12,20" />
        <polygon points="24,12 32,20 24,32 20,32 16,20" />
      </svg>
    ),
    'Baguette': (
      <svg width={size} height={size} viewBox="0 0 48 48" className={`${baseClasses} ${className}`}>
        <rect x="8" y="16" width="32" height="16" />
        <rect x="12" y="18" width="24" height="12" />
        <rect x="16" y="20" width="16" height="8" />
      </svg>
    ),
    'Bullet': (
      <svg width={size} height={size} viewBox="0 0 48 48" className={`${baseClasses} ${className}`}>
        <ellipse cx="24" cy="24" rx="20" ry="8" />
        <ellipse cx="24" cy="24" rx="12" ry="6" />
        <ellipse cx="24" cy="24" rx="6" ry="4" />
      </svg>
    ),
    'Cabochon': (
      <svg width={size} height={size} viewBox="0 0 48 48" className={`${baseClasses} ${className}`}>
        <ellipse cx="24" cy="24" rx="20" ry="16" />
        <ellipse cx="24" cy="24" rx="12" ry="10" />
        <ellipse cx="24" cy="24" rx="6" ry="5" />
      </svg>
    ),
    'Carre': (
      <svg width={size} height={size} viewBox="0 0 48 48" className={`${baseClasses} ${className}`}>
        <rect x="8" y="8" width="32" height="32" />
        <rect x="12" y="12" width="24" height="24" />
        <rect x="16" y="16" width="16" height="16" />
      </svg>
    ),
    'Colette': (
      <svg width={size} height={size} viewBox="0 0 48 48" className={`${baseClasses} ${className}`}>
        <polygon points="24,4 36,16 32,32 16,32 12,16" />
        <polygon points="24,8 32,16 28,28 20,28 16,16" />
        <polygon points="24,12 28,16 26,24 22,24 20,16" />
      </svg>
    ),
    'Crown': (
      <svg width={size} height={size} viewBox="0 0 48 48" className={`${baseClasses} ${className}`}>
        <path d="M8 32 L16 16 L24 8 L32 16 L40 32 L36 40 L12 40 Z" />
        <path d="M12 32 L18 18 L24 12 L30 18 L36 32 L32 36 L16 36 Z" />
        <path d="M16 32 L22 20 L24 16 L26 20 L32 32 L28 36 L20 36 Z" />
      </svg>
    ),
    'Diamond': (
      <svg width={size} height={size} viewBox="0 0 48 48" className={`${baseClasses} ${className}`}>
        <polygon points="24,4 40,24 24,44 8,24" />
        <polygon points="24,8 36,24 24,40 12,24" />
        <polygon points="24,12 32,24 24,36 16,24" />
      </svg>
    ),
    'Fancy': (
      <svg width={size} height={size} viewBox="0 0 48 48" className={`${baseClasses} ${className}`}>
        <polygon points="24,4 36,16 32,32 16,32 12,16" />
        <polygon points="24,8 32,16 28,28 20,28 16,16" />
        <polygon points="24,12 28,16 26,24 22,24 20,16" />
      </svg>
    ),
    'Hexagon': (
      <svg width={size} height={size} viewBox="0 0 48 48" className={`${baseClasses} ${className}`}>
        <polygon points="24,4 40,12 40,28 24,36 8,28 8,12" />
        <polygon points="24,8 36,14 36,26 24,32 12,26 12,14" />
        <polygon points="24,12 32,16 32,24 24,28 16,24 16,16" />
      </svg>
    ),
    'Kite': (
      <svg width={size} height={size} viewBox="0 0 48 48" className={`${baseClasses} ${className}`}>
        <polygon points="24,4 40,20 32,40 16,40 8,20" />
        <polygon points="24,8 36,20 28,36 20,36 12,20" />
        <polygon points="24,12 32,20 24,32 20,32 16,20" />
      </svg>
    ),
    'Lozenge': (
      <svg width={size} height={size} viewBox="0 0 48 48" className={`${baseClasses} ${className}`}>
        <polygon points="24,4 40,24 24,44 8,24" />
        <polygon points="24,8 36,24 24,40 12,24" />
        <polygon points="24,12 32,24 24,36 16,24" />
      </svg>
    ),
    'Octagon': (
      <svg width={size} height={size} viewBox="0 0 48 48" className={`${baseClasses} ${className}`}>
        <polygon points="16,4 32,4 40,16 40,32 32,44 16,44 8,32 8,16" />
        <polygon points="20,8 28,8 34,16 34,28 28,36 20,36 14,28 14,16" />
        <polygon points="24,12 30,16 30,28 24,32 18,28 18,16" />
      </svg>
    ),
    'Pentagon': (
      <svg width={size} height={size} viewBox="0 0 48 48" className={`${baseClasses} ${className}`}>
        <polygon points="24,4 40,16 36,32 12,32 8,16" />
        <polygon points="24,8 36,16 32,28 16,28 12,16" />
        <polygon points="24,12 32,16 28,24 20,24 16,16" />
      </svg>
    ),
    'Rose': (
      <svg width={size} height={size} viewBox="0 0 48 48" className={`${baseClasses} ${className}`}>
        <path d="M24 4 C24 4, 8 16, 8 24 C8 32, 24 44, 24 44 C24 44, 40 32, 40 24 C40 16, 24 4, 24 4 Z" />
        <path d="M24 8 C24 8, 12 18, 12 24 C12 30, 24 40, 24 40 C24 40, 36 30, 36 24 C36 18, 24 8, 24 8 Z" />
        <path d="M24 12 C24 12, 16 20, 16 24 C16 28, 24 36, 24 36 C24 36, 32 28, 32 24 C32 20, 24 12, 24 12 Z" />
      </svg>
    ),
    'Square': (
      <svg width={size} height={size} viewBox="0 0 48 48" className={`${baseClasses} ${className}`}>
        <rect x="8" y="8" width="32" height="32" />
        <rect x="12" y="12" width="24" height="24" />
        <rect x="16" y="16" width="16" height="16" />
      </svg>
    ),
    'Triangle': (
      <svg width={size} height={size} viewBox="0 0 48 48" className={`${baseClasses} ${className}`}>
        <polygon points="24,4 40,40 8,40" />
        <polygon points="24,8 36,36 12,36" />
        <polygon points="24,12 32,32 16,32" />
      </svg>
    ),
    'Trapezoid': (
      <svg width={size} height={size} viewBox="0 0 48 48" className={`${baseClasses} ${className}`}>
        <polygon points="8,32 16,8 32,8 40,32" />
        <polygon points="12,32 18,12 30,12 36,32" />
        <polygon points="16,32 20,16 28,16 32,32" />
      </svg>
    ),
  };

  return shapeDrawings[shape] || shapeDrawings['Round'];
};

interface OnboardingFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingFilterModal: React.FC<OnboardingFilterModalProps> = ({
  isOpen,
  onClose
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { diamonds: firebaseDiamonds } = useFirebase();
  const { applyOnboardingFilters, setOnboardingComplete } = useFilter();

  // Generate dynamic filter options based on available diamonds
  const dynamicOptions = useMemo(() => {
    return generateDynamicFilterOptions(firebaseDiamonds || []);
  }, [firebaseDiamonds]);

  // Categorize the dynamic options
  const categorizedOptions = useMemo(() => {
    return categorizeFilterOptions(dynamicOptions);
  }, [dynamicOptions]);

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
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedShape, setSelectedShape] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedClarity, setSelectedClarity] = useState<string>('');
  const [selectedCut, setSelectedCut] = useState<string>('');
  const [colorType, setColorType] = useState<'white' | 'fancy'>('white');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const totalSteps = 3;

  // Handle shape selection with enhanced feedback
  const handleShapeSelect = (shape: string) => {
    setSelectedShape(shape);
    toast({
      title: 'Shape selected',
      description: `${shape} shape has been selected for your preferences.`,
    });
  };

  // Handle color selection with enhanced feedback
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    toast({
      title: 'Color selected',
      description: `${color} color has been selected for your preferences.`,
    });
  };

  // Handle clarity selection with enhanced feedback
  const handleClaritySelect = (clarity: string) => {
    setSelectedClarity(clarity);
    toast({
      title: 'Clarity selected',
      description: `${clarity} clarity has been selected for your preferences.`,
    });
  };

  // Handle cut selection with enhanced feedback
  const handleCutSelect = (cut: string) => {
    setSelectedCut(cut);
    toast({
      title: 'Cut selected',
      description: `${cut} cut has been selected for your preferences.`,
    });
  };

  // Handle next step with smooth transition
  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setIsTransitioning(true);
      await new Promise(resolve => setTimeout(resolve, 150));
      setCurrentStep(currentStep + 1);
      setIsTransitioning(false);
    } else {
      handleComplete();
    }
  };

  // Handle previous step with smooth transition
  const handlePrevious = async () => {
    if (currentStep > 1) {
      setIsTransitioning(true);
      await new Promise(resolve => setTimeout(resolve, 150));
      setCurrentStep(currentStep - 1);
      setIsTransitioning(false);
    }
  };

  // Handle skip onboarding
  const handleSkip = () => {
    setOnboardingComplete(true);
    onClose();
    toast({
      title: 'Onboarding skipped',
      description: 'You can always adjust your preferences later in the filters.',
    });
    // Navigate to home page
    navigate('/');
  };

  // Handle complete onboarding
  const handleComplete = () => {
    // Apply the selected filters
    applyOnboardingFilters({
      shape: selectedShape ? [selectedShape] : [],
      color: selectedColor ? [selectedColor] : [],
      clarity: selectedClarity ? [selectedClarity] : [],
      cut: selectedCut ? [selectedCut] : [],
      color_type: colorType,
    });

    // Mark onboarding as complete
    setOnboardingComplete(true);

    // Close modal
    onClose();
    
    toast({
      title: 'Preferences saved!',
      description: 'Your diamond preferences have been saved and applied to the gallery.',
    });
    
    // Navigate to home page
    navigate('/');
  };

  // Get shape color
  const getShapeColor = (shape: string) => {
    const shapeColors: Record<string, string> = {
      'Round': 'bg-blue-500',
      'Princess': 'bg-pink-500',
      'Oval': 'bg-purple-500',
      'Emerald': 'bg-green-500',
      'Pear': 'bg-yellow-500',
      'Marquise': 'bg-red-500',
      'Heart': 'bg-red-400',
      'Radiant': 'bg-orange-500',
      'Asscher': 'bg-indigo-500',
      'Cushion': 'bg-teal-500',
      'Crescent': 'bg-cyan-500',
      'Custom': 'bg-gray-500',
      'Alphabet': 'bg-violet-500',
    };
    return shapeColors[shape] || 'bg-gray-500';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" data-modal="onboarding">
      <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Welcome to Diamond Elegance Studio</h2>
              <p className="text-sm text-gray-300">Let's personalize your experience</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="text-white hover:bg-gray-700 hover:text-white transition-colors duration-200"
            title="Skip onboarding"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Enhanced Progress Bar - Fixed */}
        <div className="px-6 py-4 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-300">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-gray-300">{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          {/* Step indicators */}
          <div className="flex justify-center space-x-2 mt-3">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i + 1 <= currentStep 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content with smooth transitions - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">What's your preferred diamond shape?</h3>
                  <p className="text-gray-300 mb-6">Select the shape that catches your eye the most. Each shape has unique characteristics and appeal.</p>
                  <p className="text-sm text-gray-400 mb-4">Visual outlines show the diamond shape profiles</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(categorizedOptions.shapeCategories).map(([category, shapes]) => (
                    <div key={category}>
                      <h4 className="text-sm font-medium text-gray-200 mb-4">{category}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {shapes.map((shape) => (
                          <Card
                            key={shape}
                            className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                              selectedShape === shape
                                ? 'ring-2 ring-white bg-gray-700 border-gray-600 shadow-lg shadow-white/10'
                                : 'bg-gray-800 border-gray-700 hover:border-gray-600 hover:bg-gray-700 hover:shadow-md'
                            }`}
                            onClick={() => handleShapeSelect(shape)}
                          >
                            <CardContent className="p-4 text-center">
                              <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                                <DiamondShapeDrawing 
                                  shape={shape} 
                                  size={48} 
                                  className={`transition-all duration-300 ${
                                    selectedShape === shape 
                                      ? "stroke-white scale-110 drop-shadow-lg" 
                                      : "stroke-gray-400 hover:stroke-gray-300 hover:scale-105"
                                  }`} 
                                />
                              </div>
                              <p className="text-sm text-white font-medium">{shape}</p>
                              {selectedShape === shape && (
                                <Badge className="mt-2 bg-white text-gray-900 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">Selected</Badge>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">What color grade interests you?</h3>
                  <p className="text-gray-300 mb-6">Choose between white diamonds or fancy colored diamonds</p>
                </div>
                
                <Tabs value={colorType} onValueChange={(value) => setColorType(value as 'white' | 'fancy')}>
                  <TabsList className="grid w-full grid-cols-2 bg-gray-700 border-gray-600">
                    <TabsTrigger value="white" className="text-white data-[state=active]:bg-gray-600 data-[state=active]:text-white transition-all duration-200">White Diamonds</TabsTrigger>
                    <TabsTrigger value="fancy" className="text-white data-[state=active]:bg-gray-600 data-[state=active]:text-white transition-all duration-200">Fancy Colors</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="white" className="space-y-4">
                    <div className="grid grid-cols-4 gap-3">
                      {Object.entries(categorizedOptions.colorCategories)
                        .filter(([category]) => category !== 'Fancy')
                        .flatMap(([category, colors]) => colors)
                        .map((color) => (
                        <Card
                          key={color}
                          className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                            selectedColor === color
                              ? 'ring-2 ring-white bg-gray-700 border-gray-600 shadow-lg shadow-white/10'
                              : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                          }`}
                          onClick={() => handleColorSelect(color)}
                        >
                          <CardContent className="p-3 text-center">
                            <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                              <span className="text-gray-900 text-xs font-bold">{color}</span>
                            </div>
                            <p className="text-xs text-white">{color}</p>
                            {selectedColor === color && (
                              <Badge className="mt-1 bg-white text-gray-900 text-xs animate-in fade-in-0 slide-in-from-bottom-2 duration-300">✓</Badge>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="fancy" className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {(categorizedOptions.colorCategories['Fancy'] || []).map((color) => (
                        <Card
                          key={color}
                          className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                            selectedColor === color
                              ? 'ring-2 ring-white bg-gray-700 border-gray-600 shadow-lg shadow-white/10'
                              : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                          }`}
                          onClick={() => handleColorSelect(color)}
                        >
                          <CardContent className="p-3 text-center">
                            <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center">
                              <span className="text-white text-xs font-bold">💎</span>
                            </div>
                            <p className="text-xs text-white">{color}</p>
                            {selectedColor === color && (
                              <Badge className="mt-1 bg-white text-gray-900 text-xs animate-in fade-in-0 slide-in-from-bottom-2 duration-300">✓</Badge>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Quality preferences</h3>
                  <p className="text-gray-300 mb-6">Select your preferred clarity and cut grades</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Clarity Selection */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-200 mb-3">Clarity Grade</h4>
                    <div className="space-y-2">
                      {Object.entries(categorizedOptions.clarityCategories).map(([category, clarities]) => (
                        <div key={category}>
                          <h5 className="text-xs text-gray-400 mb-2">{category}</h5>
                          <div className="grid grid-cols-2 gap-2">
                            {clarities.map((clarity) => (
                              <Button
                                key={clarity}
                                variant="outline"
                                size="sm"
                                onClick={() => handleClaritySelect(clarity)}
                                className={`text-white hover:bg-gray-700 hover:text-white bg-gray-700 transition-all duration-200 transform hover:scale-105 ${
                                  selectedClarity === clarity ? 'ring-2 ring-white shadow-lg shadow-white/10' : ''
                                }`}
                              >
                                {clarity}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cut Selection */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-200 mb-3">Cut Grade</h4>
                    <div className="space-y-2">
                      {Object.entries(categorizedOptions.cutCategories).map(([category, cuts]) => (
                        <div key={category}>
                          <h5 className="text-xs text-gray-400 mb-2">{category}</h5>
                          <div className="grid grid-cols-2 gap-2">
                            {cuts.map((cut) => (
                              <Button
                                key={cut}
                                variant="outline"
                                size="sm"
                                onClick={() => handleCutSelect(cut)}
                                className={`text-white hover:bg-gray-700 hover:text-white bg-gray-700 transition-all duration-200 transform hover:scale-105 ${
                                  selectedCut === cut ? 'ring-2 ring-white shadow-lg shadow-white/10' : ''
                                }`}
                              >
                                {cut}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700 flex-shrink-0">
          <Button
            variant="outline"
            onClick={handleSkip}
            className="text-white hover:bg-gray-700 hover:text-white bg-gray-700 transition-colors duration-200"
          >
            Skip
          </Button>
          
          <div className="flex items-center space-x-3">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="text-white hover:bg-gray-700 hover:text-white bg-gray-700 transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-200 transform hover:scale-105"
            >
              {currentStep === totalSteps ? (
                <>
                  Complete Setup
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 
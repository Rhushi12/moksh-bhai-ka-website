import { useState, useEffect } from 'react';
import { Diamond } from 'lucide-react';

interface ShapeData {
  name: string;
  icon: string;
  description: string;
  category: string;
  count: number;
  bestsellerCount: number;
  totalValue: number;
}

interface DiamondShapeSelectorProps {
  selectedShape: string | null;
  onShapeSelect: (shape: string | null) => void;
}

// SVG Icons for diamond shapes
const shapeIcons = {
  Round: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1" fill="none"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
    </svg>
  ),
  Princess: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="4" width="16" height="16" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <rect x="6" y="6" width="12" height="12" stroke="currentColor" strokeWidth="1" fill="none"/>
      <rect x="8" y="8" width="8" height="8" fill="currentColor"/>
    </svg>
  ),
  Marquise: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <ellipse cx="12" cy="12" rx="10" ry="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <ellipse cx="12" cy="12" rx="6" ry="3.5" stroke="currentColor" strokeWidth="1" fill="none"/>
      <ellipse cx="12" cy="12" rx="2" ry="1.2" fill="currentColor"/>
    </svg>
  ),
  Emerald: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="6" width="16" height="12" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <rect x="6" y="8" width="12" height="8" stroke="currentColor" strokeWidth="1" fill="none"/>
      <rect x="8" y="10" width="8" height="4" fill="currentColor"/>
    </svg>
  ),
  Pear: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4C8 4 6 8 6 12C6 16 8 20 12 20C16 20 18 16 18 12C18 8 16 4 12 4Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M12 6C9 6 8 9 8 12C8 15 9 18 12 18C15 18 16 15 16 12C16 9 15 6 12 6Z" stroke="currentColor" strokeWidth="1" fill="none"/>
      <path d="M12 8C10 8 10 10 10 12C10 14 10 16 12 16C14 16 14 14 14 12C14 10 14 8 12 8Z" fill="currentColor"/>
    </svg>
  ),
  Oval: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <ellipse cx="12" cy="12" rx="10" ry="8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <ellipse cx="12" cy="12" rx="6" ry="4.8" stroke="currentColor" strokeWidth="1" fill="none"/>
      <ellipse cx="12" cy="12" rx="2" ry="1.6" fill="currentColor"/>
    </svg>
  ),
  Heart: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M12 19.35l-1.45-1.32C5.4 13.36 2 10.28 2 6.5 2 3.42 4.42 1 7.5 1c1.74 0 3.41.81 4.5 2.09C13.09 1.81 14.76 1 16.5 1 19.58 1 22 3.42 22 6.5c0 3.78-3.4 6.86-8.55 11.54L12 19.35z" stroke="currentColor" strokeWidth="1" fill="none"/>
      <path d="M12 17.35l-1.45-1.32C5.4 11.36 2 8.28 2 4.5 2 1.42 4.42 -1 7.5 -1c1.74 0 3.41.81 4.5 2.09C13.09 -1.81 14.76 -1 16.5 -1 19.58 -1 22 1.42 22 4.5c0 3.78-3.4 6.86-8.55 11.54L12 17.35z" fill="currentColor"/>
    </svg>
  ),
  Radiant: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="4" width="16" height="16" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <rect x="6" y="6" width="12" height="12" stroke="currentColor" strokeWidth="1" fill="none"/>
      <rect x="8" y="8" width="8" height="8" fill="currentColor"/>
      <path d="M12 4L12 20M4 12L20 12" stroke="currentColor" strokeWidth="0.5" opacity="0.5"/>
    </svg>
  ),
  Asscher: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="4" width="16" height="16" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <rect x="6" y="6" width="12" height="12" stroke="currentColor" strokeWidth="1" fill="none"/>
      <rect x="8" y="8" width="8" height="8" fill="currentColor"/>
      <path d="M4 4L20 20M20 4L4 20" stroke="currentColor" strokeWidth="0.5" opacity="0.5"/>
    </svg>
  ),
  Cushion: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <rect x="6" y="6" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1" fill="none"/>
      <rect x="8" y="8" width="8" height="8" rx="1" fill="currentColor"/>
    </svg>
  ),
  Crescent: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M12 4C7.59 4 4 7.59 4 12s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8z" stroke="currentColor" strokeWidth="1" fill="none"/>
      <path d="M12 6C8.69 6 6 8.69 6 12s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" fill="currentColor"/>
    </svg>
  ),
  Custom: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12,2 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <polygon points="12,4 14,8 19,9 15,12 16,18 12,16 8,18 9,12 5,9 10,8" stroke="currentColor" strokeWidth="1" fill="none"/>
      <polygon points="12,6 13,8 16,9 13,10 14,15 12,14 10,15 11,10 8,9 11,8" fill="currentColor"/>
    </svg>
  ),
  Alphabet: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="4" width="16" height="16" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <text x="12" y="16" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor">A</text>
    </svg>
  )
};

export const DiamondShapeSelector = ({ selectedShape, onShapeSelect }: DiamondShapeSelectorProps) => {
  const [shapes, setShapes] = useState<ShapeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load shapes from database
  useEffect(() => {
    const loadShapes = async () => {
      try {
        setIsLoading(true);
        
        // Try to load from local database first
        try {
          const databaseData = require('../../database/shapes.json');
          if (databaseData && databaseData.availableShapes) {
            setShapes(databaseData.availableShapes);
            console.log('✅ Loaded shapes from database:', databaseData.availableShapes.length);
            return;
          }
        } catch (dbError) {
          console.warn('⚠️ Could not load shapes from database, using fallback');
        }

        // Fallback to hardcoded shapes
        const fallbackShapes: ShapeData[] = [
          { name: 'Round', icon: '●', description: 'Classic round brilliant cut', category: 'Classic', count: 1, bestsellerCount: 1, totalValue: 25000 },
          { name: 'Princess', icon: '◆', description: 'Square cut with sharp corners', category: 'Classic', count: 1, bestsellerCount: 0, totalValue: 18500 },
          { name: 'Marquise', icon: '◊', description: 'Elongated oval with pointed ends', category: 'Fancy', count: 0, bestsellerCount: 0, totalValue: 0 },
          { name: 'Emerald', icon: '▭', description: 'Rectangular step-cut', category: 'Classic', count: 1, bestsellerCount: 0, totalValue: 28000 },
          { name: 'Pear', icon: '◐', description: 'Tear-drop shape', category: 'Fancy', count: 0, bestsellerCount: 0, totalValue: 0 },
          { name: 'Oval', icon: '◯', description: 'Elongated round cut', category: 'Fancy', count: 1, bestsellerCount: 1, totalValue: 35000 },
          { name: 'Heart', icon: '♡', description: 'Romantic heart shape', category: 'Fancy', count: 0, bestsellerCount: 0, totalValue: 0 },
          { name: 'Radiant', icon: '◇', description: 'Square or rectangular brilliant', category: 'Fancy', count: 0, bestsellerCount: 0, totalValue: 0 },
          { name: 'Asscher', icon: '⬟', description: 'Square step-cut with cropped corners', category: 'Classic', count: 0, bestsellerCount: 0, totalValue: 0 },
          { name: 'Cushion', icon: '◘', description: 'Square with rounded corners', category: 'Fancy', count: 1, bestsellerCount: 1, totalValue: 22500 },
          { name: 'Crescent', icon: '☾', description: 'Unique moon-like shape', category: 'Unique', count: 1, bestsellerCount: 1, totalValue: 28000 },
          { name: 'Custom', icon: '✦', description: 'Bespoke faceting pattern', category: 'Unique', count: 1, bestsellerCount: 1, totalValue: 22500 },
          { name: 'Alphabet', icon: 'A', description: 'Personalized letter shapes', category: 'Unique', count: 1, bestsellerCount: 1, totalValue: 10000 }
        ];
        
        setShapes(fallbackShapes);
        console.log('✅ Loaded fallback shapes:', fallbackShapes.length);
        
      } catch (error) {
        console.error('❌ Error loading shapes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadShapes();
  }, []);

  const handleShapeClick = (shapeName: string) => {
    const newShape = selectedShape === shapeName ? null : shapeName;
    onShapeSelect(newShape);
    
    // Smooth scroll to showcase
    const showcase = document.getElementById('diamond-showcase');
    if (showcase) {
      showcase.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Filter shapes to only show those with diamonds
  const availableShapes = shapes.filter(shape => shape.count > 0);

  if (isLoading) {
    return (
      <section className="py-12 md:py-16 border-t border-gray-700 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-xl md:text-2xl font-playfair text-gray-50 text-center mb-8 md:mb-12">
            Loading Diamond Shapes...
          </h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 border-t border-gray-700 bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-xl md:text-2xl font-playfair text-gray-50 text-center mb-8 md:mb-12">
          Select Diamond Shape
        </h2>
        
        {/* Responsive grid: Mobile 2, Tablet 3, Desktop 4, Large Desktop 6 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 max-w-6xl mx-auto">
          {availableShapes.map((shape) => {
            const IconComponent = shapeIcons[shape.name as keyof typeof shapeIcons];
            const isSelected = selectedShape === shape.name;
            
            return (
              <button
                key={shape.name}
                onClick={() => handleShapeClick(shape.name)}
                className={`
                  group flex flex-col items-center p-4 md:p-6 rounded-xl transition-all duration-300
                  hover:scale-105 md:hover:scale-110 hover:shadow-lg hover:shadow-gray-500/20
                  min-h-[100px] md:min-h-[120px] justify-center relative overflow-hidden
                  ${isSelected 
                    ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-950 shadow-lg scale-105' 
                    : 'bg-gray-800/30 text-gray-200 hover:text-gray-100 hover:bg-gray-800/50 border border-gray-700'
                  }
                `}
                aria-label={`Select ${shape.name} cut diamonds`}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
                )}
                
                <div className={`
                  mb-3 transition-all duration-300 group-hover:scale-110
                  ${isSelected ? 'text-gray-950 scale-110' : 'text-gray-200'}
                `}>
                  {IconComponent || (
                    <div className="w-6 h-6 flex items-center justify-center text-lg font-bold">
                      {shape.icon}
                    </div>
                  )}
                </div>
                
                <span className={`
                  text-xs md:text-sm font-montserrat transition-colors duration-300 text-center font-medium
                  ${isSelected ? 'text-gray-950' : 'text-gray-200'}
                `}>
                  {shape.name}
                </span>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            );
          })}
        </div>

        {selectedShape && (
          <div className="text-center mt-8 md:mt-12">
            <button
              onClick={() => onShapeSelect(null)}
              className="inline-flex items-center space-x-2 text-sm text-gray-400 hover:text-gray-200 underline font-montserrat transition-colors px-4 py-2 rounded-lg hover:bg-gray-800/50"
            >
              <span>Clear filter</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
export interface Diamond {
  id: number | string;
  category: 'Rough Diamonds' | 'Polished Diamonds' | 'Colored Diamonds' | 'Certified Diamonds' | 'Investment Diamonds';
  shape: 'Round' | 'Princess' | 'Marquise' | 'Emerald' | 'Pear' | 'Oval' | 'Heart' | 'Radiant' | 'Asscher' | 'Cushion' | 'Crescent' | 'Custom' | 'Alphabet' | 'Trillion' | 'Baguette' | 'Bullet' | 'Cabochon' | 'Carre' | 'Colette' | 'Crown' | 'Diamond' | 'Fancy' | 'Hexagon' | 'Kite' | 'Lozenge' | 'Octagon' | 'Pentagon' | 'Rose' | 'Square' | 'Triangle' | 'Trapezoid';
  primaryImage: string; // Main/featured image (can be URL or Base64)
  images: string[]; // Array of all diamond images (can be URLs or Base64)
  primaryVideo?: string; // Main/featured video (can be URL) - for backward compatibility
  videos?: string[]; // Array of all diamond videos (can be URLs) - for backward compatibility
  
  // New video reference fields for updated storage structure
  videoRefs?: string[]; // Array of video document IDs in diamond_videos collection
  primaryVideoRef?: string; // Reference to primary video document ID
  showVideoInGallery?: boolean; // Whether to show video in gallery
  showVideoOnHomepage?: boolean; // Whether to show video on homepage
  showInBanner?: boolean; // Whether to show in banner advertisement
  
  description: string;
  carat: number;
  clarity: 'FL' | 'IF' | 'VVS1' | 'VVS2' | 'VS1' | 'VS2' | 'SI1' | 'SI2' | 'SI3' | 'I1' | 'I2' | 'I3';
  cut: 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor' | 'Hearts and Arrows' | '8X' | '3X' | 'Ideal' | 'Super Ideal' | 'Premium' | 'Signature';
  color: 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';
  price: string;
  price_per_carat: number;
  bestseller: boolean;
  showOnIndex: boolean;
  showInGallery: boolean;
  uploadedAt?: string;
  uploadedBy?: 'app' | 'manual';
  
  // Additional detailed fields for filtering
  polish?: 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor';
  symmetry?: 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor';
  fluorescence?: 'None' | 'Faint' | 'Medium' | 'Strong' | 'Very Strong';
  growth_type?: 'Natural' | 'Lab Grown' | 'CVD' | 'HPHT' | 'Mixed';
  location?: string;
  supplier?: string;

  depth_percentage?: number;
  table_percentage?: number;
  crown_height?: number;
  pavilion_depth?: number;
  girdle_thickness?: 'Very Thin' | 'Thin' | 'Medium' | 'Slightly Thick' | 'Thick' | 'Very Thick';
  culet_size?: 'None' | 'Very Small' | 'Small' | 'Medium' | 'Large' | 'Very Large';
  
  // Management fields
  management?: {
    isManaged: boolean;
    managedBy?: string;
    managedAt?: string;
    managementNotes?: string;
    status: 'active' | 'inactive' | 'pending' | 'archived';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    tags?: string[];
    lastUpdated?: string;
  };
  
  // Certification fields
  certification?: 'GIA' | 'IGI' | 'AGS' | 'HRD' | 'Other';
  certification_number?: string;
  
  // Additional location and origin fields
  origin_country?: string;
  mine_location?: string;
}

// Load diamonds from database JSON file
let diamonds: Diamond[] = [];

// In a Vite/React environment, we can't use require() for JSON files
// We'll use the fallback data for now
// TODO: Implement proper data loading from Firebase or API
console.log('📊 Using fallback diamond data');

diamonds = [
    {
      id: 1,
      category: 'Investment Diamonds',
      shape: 'Round',
      primaryImage: '/diamond-round.jpg',
      images: [
        '/diamond-round.jpg',
        '/diamond-round.jpg',
        '/diamond-round.jpg'
      ],
      description: 'A magnificent 3.5-carat round brilliant diamond with exceptional fire and brilliance. This investment-grade stone represents the pinnacle of diamond cutting artistry and is perfect for serious collectors.',
      carat: 3.5,
      clarity: 'FL',
      cut: 'Excellent',
      color: 'D',
      price: '$25,000',
      price_per_carat: 7143,
      bestseller: true,
      showOnIndex: true,
      showInGallery: true,
      showInBanner: true,
      polish: 'Excellent',
      symmetry: 'Excellent',
      fluorescence: 'None',
      growth_type: 'Natural',
      location: 'Antwerp, Belgium',
      supplier: 'De Beers',

      depth_percentage: 62.5,
      table_percentage: 57.0,
      crown_height: 16.5,
      pavilion_depth: 43.1,
      girdle_thickness: 'Medium',
      culet_size: 'None'
    },
    {
      id: 2,
      category: 'Certified Diamonds',
      shape: 'Princess',
      primaryImage: '/diamond-round.jpg',
      images: [
        '/diamond-round.jpg',
        '/diamond-round.jpg',
        '/diamond-round.jpg'
      ],
      description: 'An exquisite 2.8-carat princess cut diamond with perfect symmetry and exceptional clarity. Features ideal proportions for maximum brilliance.',
      carat: 2.8,
      clarity: 'VVS1',
      cut: 'Ideal',
      color: 'E',
      price: '$18,500',
      price_per_carat: 6607,
      bestseller: false,
      showOnIndex: true,
      showInGallery: true,
      showInBanner: true,
      polish: 'Excellent',
      symmetry: 'Excellent',
      fluorescence: 'Faint',
      growth_type: 'Natural',
      location: 'Mumbai, India',
      supplier: 'Alrosa',

      depth_percentage: 74.2,
      table_percentage: 68.0,
      crown_height: 12.5,
      pavilion_depth: 40.8,
      girdle_thickness: 'Thin',
      culet_size: 'None'
    },
    {
      id: 3,
      category: 'Colored Diamonds',
      shape: 'Oval',
      primaryImage: '/diamond-round.jpg',
      images: [
        '/diamond-round.jpg',
        '/diamond-round.jpg',
        '/diamond-round.jpg'
      ],
      description: 'A rare 2.2-carat fancy pink oval diamond with exceptional saturation and brilliance. This colored diamond is a true collector\'s piece with unique characteristics.',
      carat: 2.2,
      clarity: 'VS1',
      cut: 'Excellent',
      color: 'Fancy Pink',
      price: '$35,000',
      price_per_carat: 15909,
      bestseller: true,
      showOnIndex: true,
      showInGallery: true,
      showInBanner: true,
      polish: 'Excellent',
      symmetry: 'Excellent',
      fluorescence: 'Medium',
      growth_type: 'Natural',
      location: 'New York, USA',
      supplier: 'Rio Tinto',

      depth_percentage: 61.8,
      table_percentage: 58.0,
      crown_height: 15.2,
      pavilion_depth: 42.5,
      girdle_thickness: 'Medium',
      culet_size: 'Very Small'
    },
    {
      id: 4,
      category: 'Polished Diamonds',
      shape: 'Emerald',
      primaryImage: '/diamond-round.jpg',
      images: [
        '/diamond-round.jpg',
        '/diamond-round.jpg',
        '/diamond-round.jpg'
      ],
      description: 'A sophisticated 4.1-carat emerald cut diamond with exceptional step-cut faceting and remarkable transparency. Perfect for those who appreciate classic elegance.',
      carat: 4.1,
      clarity: 'VVS2',
      cut: 'Very Good',
      color: 'F',
      price: '$28,000',
      price_per_carat: 6829,
      bestseller: false,
      showOnIndex: true,
      showInGallery: true,
      polish: 'Very Good',
      symmetry: 'Very Good',
      fluorescence: 'None',
      growth_type: 'Natural',
      location: 'Tel Aviv, Israel',
      supplier: 'Petra Diamonds',

      depth_percentage: 67.5,
      table_percentage: 65.0,
      crown_height: 14.8,
      pavilion_depth: 45.2,
      girdle_thickness: 'Slightly Thick',
      culet_size: 'Small'
    },
    {
      id: 5,
      category: 'Investment Diamonds',
      shape: 'Cushion',
      primaryImage: '/diamond-round.jpg',
      images: [
        '/diamond-round.jpg',
        '/diamond-round.jpg',
        '/diamond-round.jpg'
      ],
      description: 'A stunning 3.0-carat cushion cut diamond combining vintage charm with modern precision. Features exceptional fire and scintillation for maximum visual impact.',
      carat: 3.0,
      clarity: 'VVS1',
      cut: 'Excellent',
      color: 'D',
      price: '$22,500',
      price_per_carat: 7500,
      bestseller: true,
      showOnIndex: true,
      showInGallery: true,
      polish: 'Excellent',
      symmetry: 'Excellent',
      fluorescence: 'Faint',
      growth_type: 'Natural',
      location: 'Hong Kong',
      supplier: 'Lucara Diamond',

      depth_percentage: 63.2,
      table_percentage: 59.0,
      crown_height: 16.8,
      pavilion_depth: 41.5,
      girdle_thickness: 'Medium',
      culet_size: 'None'
    },
    {
      id: 6,
      category: 'Investment Diamonds',
      shape: 'Crescent',
      primaryImage: '/diamond-crescent.jpg',
      images: [
        '/diamond-crescent.jpg',
        '/diamond-crescent.jpg',
        '/diamond-crescent.jpg'
      ],
      description: 'Discover the extraordinary allure of our Crescent Cut Diamond. This rare and captivating gem, with its unique moon-like shape and brilliant sparkle, is a true testament to exceptional craftsmanship. Elevate your jewelry collection with a piece that stands out. Inquire now to make this exquisite diamond yours.',
      carat: 2.10,
      clarity: 'VVS2',
      cut: 'Excellent',
      color: 'E',
      price: '$28,000',
      price_per_carat: 13333,
      bestseller: true,
      showOnIndex: true,
      showInGallery: true,
      polish: 'Excellent',
      symmetry: 'Excellent',
      fluorescence: 'None',
      growth_type: 'Natural',
      location: 'Dubai, UAE',
      supplier: 'Dominion Diamond',

      depth_percentage: 64.8,
      table_percentage: 56.0,
      crown_height: 17.2,
      pavilion_depth: 43.8,
      girdle_thickness: 'Thin',
      culet_size: 'None'
    },
    {
      id: 7,
      category: 'Investment Diamonds',
      shape: 'Custom',
      primaryImage: '/src/assets/diamond-custom.jpg',
      images: [
        '/src/assets/diamond-custom.jpg',
        '/src/assets/diamond-custom-2.jpg',
        '/src/assets/diamond-custom-3.jpg'
      ],
      description: 'Experience the brilliance of our Custom Faceted Cut Diamond. This unique 1.50-carat masterpiece showcases exceptional craftsmanship with its distinctive faceting pattern. Perfect for those seeking one-of-a-kind luxury. Make this extraordinary piece yours today.',
      carat: 1.50,
      clarity: 'VVS1',
      cut: 'Excellent',
      color: 'D',
      price: '$22,500',
      price_per_carat: 15000,
      bestseller: true,
      showOnIndex: true,
      showInGallery: true,
      polish: 'Excellent',
      symmetry: 'Excellent',
      fluorescence: 'None',
      growth_type: 'Natural',
      location: 'London, UK',
      supplier: 'Stornoway Diamond',

      depth_percentage: 61.5,
      table_percentage: 58.5,
      crown_height: 15.8,
      pavilion_depth: 42.2,
      girdle_thickness: 'Medium',
      culet_size: 'Very Small'
    },
    {
      id: 8,
      category: 'Investment Diamonds',
      shape: 'Alphabet',
      primaryImage: '/src/assets/diamond-alphabet.jpg',
      images: [
        '/src/assets/diamond-alphabet.jpg',
        '/src/assets/diamond-alphabet-2.jpg',
        '/src/assets/diamond-alphabet-3.jpg'
      ],
      description: 'Introducing our exclusive Alphabet Collection - a bespoke set of 26 diamond letters crafted with precision and elegance. Each letter ranges from 0.10ct to 0.50ct, featuring FL to VVS1 clarity and D to G color grades. Perfect for personalized luxury jewelry. Contact us to create your custom alphabet masterpiece.',
      carat: 0.10,
      clarity: 'FL',
      cut: 'Excellent',
      color: 'D',
      price: '$10,000',
      price_per_carat: 100000,
      bestseller: true,
      showOnIndex: true,
      showInGallery: true,
      polish: 'Excellent',
      symmetry: 'Excellent',
      fluorescence: 'None',
      growth_type: 'Natural',
      location: 'Zurich, Switzerland',
      supplier: 'Mountain Province Diamonds',

      depth_percentage: 62.0,
      table_percentage: 57.5,
      crown_height: 16.0,
      pavilion_depth: 43.0,
      girdle_thickness: 'Thin',
      culet_size: 'None'
    }
  ];

export { diamonds };

/**
 * Get all diamonds
 * @returns Array of all diamonds
 */
export const getDiamonds = async (): Promise<Diamond[]> => {
  console.log('🔍 getDiamonds called');
  console.log('📊 Total diamonds available:', diamonds.length);
  
  // Simulate async loading for consistency with future Firebase integration
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return diamonds;
};

/**
 * Get diamonds filtered by category, shape, and bestseller status
 * @param category - Filter by diamond category
 * @param shape - Filter by diamond shape
 * @param bestseller - Filter by bestseller status
 * @returns Filtered array of diamonds
 */
export const getFilteredDiamonds = (category?: string, shape?: string, bestseller?: boolean) => {
  console.log('🔍 getFilteredDiamonds called with:', { category, shape, bestseller });
  console.log('📊 Total diamonds available:', diamonds.length);
  
  const filtered = diamonds.filter(diamond => {
    const categoryMatch = !category || diamond.category === category;
    const shapeMatch = !shape || diamond.shape === shape;
    const bestsellerMatch = bestseller === undefined || diamond.bestseller === bestseller;
    
    const matches = categoryMatch && shapeMatch && bestsellerMatch;
    
    if (category || shape || bestseller !== undefined) {
      console.log(`💎 Diamond ${diamond.id} (${diamond.shape}):`, {
        categoryMatch,
        shapeMatch,
        bestsellerMatch,
        matches
      });
    }
    
    return matches;
  });
  
  console.log('✅ Filtered diamonds result:', {
    totalDiamonds: diamonds.length,
    filteredCount: filtered.length,
    filters: { category, shape, bestseller }
  });
  
  return filtered;
};

/**
 * Get only bestseller diamonds
 * @returns Array of bestseller diamonds
 */
export const getBestsellerDiamonds = () => getFilteredDiamonds(undefined, undefined, true);

/**
 * Sync diamonds with Firebase (for future backend integration)
 * @param diamonds - Array of diamonds to sync
 */
export const syncDiamondsWithFirebase = async (diamonds: Diamond[]) => {
  try {
    console.log('🔄 Syncing diamonds with Firebase...');
    
    // This would be replaced with actual Firebase integration
    // For now, we'll just log the diamonds
    diamonds.forEach(diamond => {
      console.log(`💎 Diamond ${diamond.id}: ${diamond.shape} Cut - ${diamond.carat}ct`);
    });
    
    console.log('✅ Diamonds synced successfully');
  } catch (error) {
    console.error('❌ Error syncing diamonds:', error);
  }
};

/**
 * Get diamonds from Firebase (for future backend integration)
 * @returns Promise<Diamond[]> - Array of diamonds from Firebase
 */
export const getDiamondsFromFirebase = async (): Promise<Diamond[]> => {
  try {
    console.log('🔄 Fetching diamonds from Firebase...');
    
    // This would be replaced with actual Firebase integration
    // For now, we'll return the local diamonds array
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
    console.log('✅ Diamonds fetched successfully');
    return diamonds;
  } catch (error) {
    console.error('❌ Error fetching diamonds:', error);
    return [];
  }
};
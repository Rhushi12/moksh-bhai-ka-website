import { db } from './firebase';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';

export interface Subcategory {
  id: string;
  name: string;
  description: string;
  count: number;
}

export interface Category {
  id: string;
  value: string; // Internal identifier
  displayLabel: string; // User-facing name
  description: string;
  color: string;
  icon: string;
  subcategories: Subcategory[];
  isBuiltIn: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Built-in categories that cannot be modified
export const BUILT_IN_CATEGORIES: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    value: 'natural',
    displayLabel: 'Natural Diamonds',
    description: 'Authentic diamonds formed naturally over millions of years',
    color: '#8B5CF6', // Purple
    icon: 'custom-diamond', // Changed from 'gem' to 'custom-diamond'
    subcategories: [
      { id: 'natural-round', name: 'Round Brilliant', description: 'Classic round cut diamonds', count: 45 },
      { id: 'natural-fancy', name: 'Fancy Shapes', description: 'Princess, oval, emerald cuts', count: 32 },
      { id: 'natural-colored', name: 'Colored Natural', description: 'Rare colored natural diamonds', count: 18 }
    ],
    isBuiltIn: true
  },
  {
    value: 'cvd',
    displayLabel: 'CVD Diamonds',
    description: 'Lab-grown diamonds using Chemical Vapor Deposition',
    color: '#F97316', // Orange
    icon: 'lab-diamond', // Changed from 'sparkles' to 'lab-diamond'
    subcategories: [
      { id: 'cvd-round', name: 'CVD Round', description: 'Lab-grown round diamonds', count: 28 },
      { id: 'cvd-fancy', name: 'CVD Fancy', description: 'Lab-grown fancy shapes', count: 22 },
      { id: 'cvd-colored', name: 'CVD Colored', description: 'Lab-grown colored diamonds', count: 15 }
    ],
    isBuiltIn: true
  },
  {
    value: 'antique',
    displayLabel: 'Antique Diamonds',
    description: 'Vintage and antique cut diamonds with historical significance',
    color: '#06B6D4', // Cyan
    icon: 'vintage-diamond', // Changed from 'clock' to 'vintage-diamond'
    subcategories: [
      { id: 'antique-old-mine', name: 'Old Mine Cut', description: 'Classic antique cut diamonds', count: 12 },
      { id: 'antique-rose-cut', name: 'Rose Cut', description: 'Traditional rose cut diamonds', count: 8 },
      { id: 'antique-european', name: 'European Cut', description: 'Early brilliant cut diamonds', count: 14 }
    ],
    isBuiltIn: true
  },
  {
    value: 'antique-cutout',
    displayLabel: 'Antique Cutout',
    description: 'Unique antique-style cutout diamonds',
    color: '#10B981', // Emerald
    icon: 'cutout-diamond', // Changed from 'scissors' to 'cutout-diamond'
    subcategories: [
      { id: 'antique-cutout-geometric', name: 'Geometric', description: 'Geometric antique patterns', count: 6 },
      { id: 'antique-cutout-floral', name: 'Floral', description: 'Floral antique patterns', count: 4 },
      { id: 'antique-cutout-abstract', name: 'Abstract', description: 'Abstract antique patterns', count: 3 }
    ],
    isBuiltIn: true
  }
];

// Get all categories (built-in + custom from Firebase)
export const getCategories = async (): Promise<Category[]> => {
  try {
    if (!db) {
      console.warn('⚠️ Firebase not available, returning built-in categories only');
      return BUILT_IN_CATEGORIES.map(cat => ({
        ...cat,
        id: cat.value,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }));
    }

    // Get custom categories from Firebase
    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    const customCategories: Category[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Category[];

    // Combine built-in and custom categories
    const builtInCategories: Category[] = BUILT_IN_CATEGORIES.map(cat => ({
      ...cat,
      id: cat.value,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }));

    return [...builtInCategories, ...customCategories];
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    // Return built-in categories as fallback
    return BUILT_IN_CATEGORIES.map(cat => ({
      ...cat,
      id: cat.value,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }));
  }
};

// Listen to category changes in real-time
export const useCategoriesListener = (callback: (categories: Category[]) => void) => {
  if (!db) {
    console.warn('⚠️ Firebase not available, cannot set up categories listener');
    return () => {};
  }

  const categoriesRef = collection(db, 'categories');
  const q = query(categoriesRef, orderBy('createdAt', 'desc'));

  return onSnapshot(q, (snapshot) => {
    try {
      const customCategories: Category[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];

      // Combine built-in and custom categories
      const builtInCategories: Category[] = BUILT_IN_CATEGORIES.map(cat => ({
        ...cat,
        id: cat.value,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }));

      const allCategories = [...builtInCategories, ...customCategories];
      callback(allCategories);
    } catch (error) {
      console.error('❌ Error processing categories snapshot:', error);
      // Return built-in categories as fallback
      const builtInCategories: Category[] = BUILT_IN_CATEGORIES.map(cat => ({
        ...cat,
        id: cat.value,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }));
      callback(builtInCategories);
    }
  }, (error) => {
    console.error('❌ Categories listener error:', error);
    // Return built-in categories as fallback
    const builtInCategories: Category[] = BUILT_IN_CATEGORIES.map(cat => ({
      ...cat,
      id: cat.value,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }));
    callback(builtInCategories);
  });
};

// Get icon component name based on icon string
export const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    'gem': 'Gem',
    'sparkles': 'Sparkles',
    'clock': 'Clock',
    'scissors': 'Scissors',
    'star': 'Star',
    'crown': 'Crown',
    'zap': 'Zap',
    'custom-diamond': 'CustomDiamondIcon'  // Add your custom icon here
  };
  
  return iconMap[iconName] || 'Gem';
};

import React, { createContext, useContext, useReducer, ReactNode, useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, setDoc, Firestore } from 'firebase/firestore';
import { app } from '../lib/firebase';
import { getSessionId } from '../lib/sessionUtils';

// Filter state interface
export interface FilterState {
  // Basic filters
  shape: string[];
  color: string[];
  clarity: string[];
  cut: string[];
  
  // Ranges
  carat_range: {
    min: number;
    max: number;
  };
  price_range: {
    min: number;
    max: number;
  };
  
  // Advanced filters
  growth_type: string[];
  location: string[];
  supplier: string[];
  
  // Price type
  price_type: 'total' | 'per_carat';
  
  // Color type
  color_type: 'white' | 'fancy';
  
  // Search
  search_query: string;
  
  // UI state
  is_filter_panel_open: boolean;
  is_onboarding_complete: boolean;
  is_first_visit: boolean;
}

// Action types
type FilterAction =
  | { type: 'SET_SHAPE'; payload: string[] }
  | { type: 'SET_COLOR'; payload: string[] }
  | { type: 'SET_CLARITY'; payload: string[] }
  | { type: 'SET_CUT'; payload: string[] }
  | { type: 'SET_CARAT_RANGE'; payload: { min: number; max: number } }
  | { type: 'SET_PRICE_RANGE'; payload: { min: number; max: number } }
  | { type: 'SET_GROWTH_TYPE'; payload: string[] }
  | { type: 'SET_LOCATION'; payload: string[] }
  | { type: 'SET_SUPPLIER'; payload: string[] }
  | { type: 'SET_PRICE_TYPE'; payload: 'total' | 'per_carat' }
  | { type: 'SET_COLOR_TYPE'; payload: 'white' | 'fancy' }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTER_PANEL_OPEN'; payload: boolean }
  | { type: 'SET_ONBOARDING_COMPLETE'; payload: boolean }
  | { type: 'SET_FIRST_VISIT'; payload: boolean }
  | { type: 'RESET_ALL_FILTERS' }
  | { type: 'APPLY_ONBOARDING_FILTERS'; payload: Partial<FilterState> };

// Initial state
const initialState: FilterState = {
  shape: [],
  color: [],
  clarity: [],
  cut: [],
  carat_range: { min: 0, max: 50 },
  price_range: { min: 0, max: 1000000 },
  growth_type: [],
  location: [],
  supplier: [],
  price_type: 'total',
  color_type: 'white',
  search_query: '',
  is_filter_panel_open: false,
      is_onboarding_complete: true, // Mark all users as having completed onboarding
  is_first_visit: true,
};

// Reducer function
function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_SHAPE':
      return { ...state, shape: action.payload };
    case 'SET_COLOR':
      return { ...state, color: action.payload };
    case 'SET_CLARITY':
      return { ...state, clarity: action.payload };
    case 'SET_CUT':
      return { ...state, cut: action.payload };
    case 'SET_CARAT_RANGE':
      return { ...state, carat_range: action.payload };
    case 'SET_PRICE_RANGE':
      return { ...state, price_range: action.payload };
    case 'SET_GROWTH_TYPE':
      return { ...state, growth_type: action.payload };
    case 'SET_LOCATION':
      return { ...state, location: action.payload };
    case 'SET_SUPPLIER':
      return { ...state, supplier: action.payload };
    case 'SET_PRICE_TYPE':
      return { ...state, price_type: action.payload };
    case 'SET_COLOR_TYPE':
      return { ...state, color_type: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, search_query: action.payload };
    case 'SET_FILTER_PANEL_OPEN':
      return { ...state, is_filter_panel_open: action.payload };
    case 'SET_ONBOARDING_COMPLETE':
      return { ...state, is_onboarding_complete: action.payload };
    case 'SET_FIRST_VISIT':
      return { ...state, is_first_visit: action.payload };
    case 'RESET_ALL_FILTERS':
      return {
        ...initialState,
        is_filter_panel_open: state.is_filter_panel_open,
        is_onboarding_complete: state.is_onboarding_complete,
        is_first_visit: state.is_first_visit,
      };
    case 'APPLY_ONBOARDING_FILTERS':
      return {
        ...state,
        ...action.payload,
        is_onboarding_complete: true,
        is_first_visit: false,
      };
    default:
      return state;
  }
}

// Context interface
interface FilterContextType {
  state: FilterState;
  dispatch: React.Dispatch<FilterAction>;
  isLoading: boolean; // New field to track loading state
  // Helper functions
  setShape: (shapes: string[]) => void;
  setColor: (colors: string[]) => void;
  setClarity: (clarities: string[]) => void;
  setCut: (cuts: string[]) => void;
  setCaratRange: (range: { min: number; max: number }) => void;
  setPriceRange: (range: { min: number; max: number }) => void;
  setGrowthType: (types: string[]) => void;
  setLocation: (locations: string[]) => void;
  setSupplier: (suppliers: string[]) => void;
  setPriceType: (type: 'total' | 'per_carat') => void;
  setColorType: (type: 'white' | 'fancy') => void;
  setSearchQuery: (query: string) => void;
  toggleFilterPanel: () => void;
  resetAllFilters: () => void;
  applyOnboardingFilters: (filters: Partial<FilterState>) => void;
  setOnboardingComplete: (complete: boolean) => void;
  setFirstVisit: (firstVisit: boolean) => void;
  hasActiveFilters: () => boolean;
  getActiveFiltersCount: () => number;
}

// Create context
const FilterContext = createContext<FilterContextType | undefined>(undefined);

// Provider component
interface FilterProviderProps {
  children: ReactNode;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  console.log('🔍 FilterProvider: Component rendering');
  
  const [state, dispatch] = useReducer(filterReducer, initialState);
  const [isLoading, setIsLoading] = useState(true);

  // Session ID is now managed by centralized utility

  // Load onboarding state from Firebase on component mount
  useEffect(() => {
    const loadOnboardingFromFirebase = async () => {
      try {
        console.log('🔍 Loading onboarding state from Firebase...');
        
        let db: Firestore | null = null;
        try {
          if (app) {
            db = getFirestore(app);
          } else {
            console.warn('⚠️ Firebase app not available for onboarding');
          }
        } catch (error) {
          console.error('❌ Error initializing Firestore:', error);
        }
        
        if (!db) {
          console.warn('⚠️ Firestore not available - using default filter state');
          setIsLoading(false);
          return;
        }
        
        // SECURITY FIX: Use session-specific onboarding document
        const sessionId = getSessionId();
        const onboardingDocRef = doc(db, 'user_preferences', sessionId);
        const onboardingDoc = await getDoc(onboardingDocRef);
        
        if (onboardingDoc.exists()) {
          const onboardingData = onboardingDoc.data();
          console.log('🔍 Found session-specific onboarding data in Firebase:', onboardingData);
          
          if (onboardingData.is_onboarding_complete) {
            dispatch({ type: 'SET_ONBOARDING_COMPLETE', payload: true });
          }
          
          // Mark as not first visit if document exists
          dispatch({ type: 'SET_FIRST_VISIT', payload: false });
        } else {
          console.log('🔍 No session-specific onboarding data found in Firebase - this is first visit');
          // Keep default state (is_first_visit: true)
        }
      } catch (error) {
        console.error('❌ Error loading onboarding from Firebase:', error);
        // Continue with default state
      } finally {
        setIsLoading(false);
      }
    };

    loadOnboardingFromFirebase();
  }, []);

  // Save onboarding state to Firebase whenever it changes
  useEffect(() => {
    const saveOnboardingToFirebase = async () => {
      if (isLoading) return; // Don't save during initial load
      
      try {
        console.log('🎭 Saving onboarding state to Firebase:', { isOnboardingComplete: state.is_onboarding_complete });
        
        let db: Firestore | null = null;
        try {
          if (app) {
            db = getFirestore(app);
          } else {
            console.warn('⚠️ Firebase app not available for saving onboarding');
            return;
          }
        } catch (error) {
          console.error('❌ Error initializing Firestore:', error);
          return;
        }
        
        if (!db) {
          console.warn('⚠️ Firestore not available - skipping save');
          return;
        }
        
        // SECURITY FIX: Use session-specific onboarding document
        const sessionId = getSessionId();
        const onboardingDocRef = doc(db, 'user_preferences', sessionId);
        await setDoc(onboardingDocRef, {
          is_onboarding_complete: state.is_onboarding_complete,
          is_first_visit: state.is_first_visit,
          sessionId: sessionId,
          updatedAt: new Date()
        });
        
        console.log('✅ Onboarding state saved to Firebase successfully for session:', sessionId);
      } catch (error) {
        console.error('❌ Error saving onboarding to Firebase:', error);
      }
    };

    saveOnboardingToFirebase();
  }, [state.is_onboarding_complete, state.is_first_visit, isLoading]);

  // Helper functions
  const setShape = (shapes: string[]) => dispatch({ type: 'SET_SHAPE', payload: shapes });
  const setColor = (colors: string[]) => dispatch({ type: 'SET_COLOR', payload: colors });
  const setClarity = (clarities: string[]) => dispatch({ type: 'SET_CLARITY', payload: clarities });
  const setCut = (cuts: string[]) => dispatch({ type: 'SET_CUT', payload: cuts });
  const setCaratRange = (range: { min: number; max: number }) => dispatch({ type: 'SET_CARAT_RANGE', payload: range });
  const setPriceRange = (range: { min: number; max: number }) => dispatch({ type: 'SET_PRICE_RANGE', payload: range });
  const setGrowthType = (types: string[]) => dispatch({ type: 'SET_GROWTH_TYPE', payload: types });
  const setLocation = (locations: string[]) => dispatch({ type: 'SET_LOCATION', payload: locations });
  const setSupplier = (suppliers: string[]) => dispatch({ type: 'SET_SUPPLIER', payload: suppliers });
  const setPriceType = (type: 'total' | 'per_carat') => dispatch({ type: 'SET_PRICE_TYPE', payload: type });
  const setColorType = (type: 'white' | 'fancy') => dispatch({ type: 'SET_COLOR_TYPE', payload: type });
  const setSearchQuery = (query: string) => dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  const toggleFilterPanel = () => dispatch({ type: 'SET_FILTER_PANEL_OPEN', payload: !state.is_filter_panel_open });
  const resetAllFilters = () => dispatch({ type: 'RESET_ALL_FILTERS' });
  const applyOnboardingFilters = (filters: Partial<FilterState>) => dispatch({ type: 'APPLY_ONBOARDING_FILTERS', payload: filters });
  const setOnboardingComplete = (complete: boolean) => dispatch({ type: 'SET_ONBOARDING_COMPLETE', payload: complete });
  const setFirstVisit = (firstVisit: boolean) => dispatch({ type: 'SET_FIRST_VISIT', payload: firstVisit });

  // Utility functions
  const hasActiveFilters = () => {
    return (
      state.shape.length > 0 ||
      state.color.length > 0 ||
      state.clarity.length > 0 ||
      state.cut.length > 0 ||
      state.growth_type.length > 0 ||
      state.location.length > 0 ||
      state.supplier.length > 0 ||
      state.search_query.length > 0 ||
      state.carat_range.min > 0 ||
      state.carat_range.max < 50 ||
      state.price_range.min > 0 ||
      state.price_range.max < 1000000
    );
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (state.shape.length > 0) count++;
    if (state.color.length > 0) count++;
    if (state.clarity.length > 0) count++;
    if (state.cut.length > 0) count++;
    if (state.growth_type.length > 0) count++;
    if (state.location.length > 0) count++;
    if (state.supplier.length > 0) count++;
    if (state.search_query.length > 0) count++;
    if (state.carat_range.min > 0 || state.carat_range.max < 50) count++;
    if (state.price_range.min > 0 || state.price_range.max < 1000000) count++;
    return count;
  };

  const value: FilterContextType = {
    state,
    dispatch,
    isLoading,
    setShape,
    setColor,
    setClarity,
    setCut,
    setCaratRange,
    setPriceRange,
    setGrowthType,
    setLocation,
    setSupplier,
    setPriceType,
    setColorType,
    setSearchQuery,
    toggleFilterPanel,
    resetAllFilters,
    applyOnboardingFilters,
    setOnboardingComplete,
    setFirstVisit,
    hasActiveFilters,
    getActiveFiltersCount,
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};

// Custom hook to use the filter context
export const useFilter = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
}; 
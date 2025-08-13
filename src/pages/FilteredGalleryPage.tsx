import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { FilterPanel } from '@/components/FilterPanel';
import { Header } from '@/components/Header';
import { useFilter } from '@/contexts/FilterContext';
import { useFirebase } from '@/contexts/FirebaseContext';
import { Diamond } from '@/data/diamonds';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Filter, Heart, Eye, Share2, Download, Star, TrendingUp, Clock, Loader2, Search, X, Grid3X3, Plus, Sliders, List, CheckSquare, Settings, ChevronDown } from 'lucide-react';
import { CategoryManagement } from '@/components/CategoryManagement';

// Skeleton loader component
const DiamondCardSkeleton: React.FC = () => (
  <Card className="bg-gray-800 border-gray-700 animate-pulse">
    <CardContent className="p-0">
      {/* Image skeleton */}
      <div className="aspect-square bg-gray-700 rounded-t-lg" />
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded w-24" />
            <div className="h-3 bg-gray-700 rounded w-16" />
          </div>
          <div className="flex space-x-1">
            <div className="w-8 h-8 bg-gray-700 rounded" />
            <div className="w-8 h-8 bg-gray-700 rounded" />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-3 bg-gray-700 rounded w-12" />
            <div className="h-3 bg-gray-700 rounded w-16" />
          </div>
          <div className="flex justify-between">
            <div className="h-3 bg-gray-700 rounded w-16" />
            <div className="h-6 bg-gray-700 rounded w-12" />
          </div>
          <div className="flex justify-between">
            <div className="h-3 bg-gray-700 rounded w-14" />
            <div className="h-6 bg-gray-700 rounded w-16" />
          </div>
          <div className="flex justify-between">
            <div className="h-3 bg-gray-700 rounded w-10" />
            <div className="h-3 bg-gray-700 rounded w-12" />
          </div>
        </div>
        
        <div className="h-4 bg-gray-700 rounded w-20" />
        
        <div className="flex space-x-2">
          <div className="flex-1 h-8 bg-gray-700 rounded" />
          <div className="w-8 h-8 bg-gray-700 rounded" />
          <div className="w-8 h-8 bg-gray-700 rounded" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export const FilteredGalleryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const { state, toggleFilterPanel, hasActiveFilters, getActiveFiltersCount } = useFilter();
  const { diamonds: firebaseDiamonds, isLoading, error } = useFirebase();
  const [savedDiamonds, setSavedDiamonds] = useState<Set<number>>(new Set());
  const [wishlistDiamonds, setWishlistDiamonds] = useState<Set<number>>(new Set());
  const [sortBy, setSortBy] = useState<'price' | 'carat' | 'date' | 'popularity' | 'shape' | 'clarity' | 'color'>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [visibleCards, setVisibleCards] = useState<number>(8);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDiamonds, setSelectedDiamonds] = useState<Set<number>>(new Set());
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [isCategoryManagementOpen, setIsCategoryManagementOpen] = useState(false);
  const [isSortPanelOpen, setIsSortPanelOpen] = useState(false);

  // Add error boundary state
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  console.log('🖼️ FilteredGalleryPage: Firebase diamonds:', firebaseDiamonds?.length || 0, 'Loading:', isLoading);
  
  // Safety check for firebaseDiamonds
  const safeDiamonds = useMemo(() => {
    if (!firebaseDiamonds || !Array.isArray(firebaseDiamonds)) {
      console.warn('⚠️ firebaseDiamonds is not an array:', firebaseDiamonds);
      return [];
    }
    return firebaseDiamonds;
  }, [firebaseDiamonds]);

  console.log('🖼️ FilteredGalleryPage: Diamond images:', safeDiamonds.map(d => ({ 
    id: d.id, 
    shape: d.shape, 
    primaryImage: d.primaryImage?.substring(0, 50) + '...',
    hasBase64: d.primaryImage?.startsWith('data:image')
  })));

  // URL Management for Filters
  useEffect(() => {
    // Read URL parameters and sync with filter state
    const shapeParam = searchParams.get('shape');
    const clarityParam = searchParams.get('clarity');
    const colorParam = searchParams.get('color');
    const priceMinParam = searchParams.get('priceMin');
    const priceMaxParam = searchParams.get('priceMax');
    const caratMinParam = searchParams.get('caratMin');
    const caratMaxParam = searchParams.get('caratMax');
    const sortByParam = searchParams.get('sortBy') as 'price' | 'carat' | 'date' | 'popularity' | null;
    const sortOrderParam = searchParams.get('sortOrder') as 'asc' | 'desc' | null;

    // Update local state based on URL parameters
    if (sortByParam) setSortBy(sortByParam);
    if (sortOrderParam) setSortOrder(sortOrderParam);
  }, [searchParams]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    // Add filter parameters
    if (state.shape.length > 0) {
      params.set('shape', state.shape.join(','));
    }
    if (state.clarity.length > 0) {
      params.set('clarity', state.clarity.join(','));
    }
    if (state.color.length > 0) {
      params.set('color', state.color.join(','));
    }
    if (state.price_range.min !== 0) {
      params.set('priceMin', state.price_range.min.toString());
    }
    if (state.price_range.max !== 1000000) {
      params.set('priceMax', state.price_range.max.toString());
    }
    if (state.carat_range.min !== 0) {
      params.set('caratMin', state.carat_range.min.toString());
    }
    if (state.carat_range.max !== 50) {
      params.set('caratMax', state.carat_range.max.toString());
    }
    
    // Add sort parameters
    params.set('sortBy', sortBy);
    params.set('sortOrder', sortOrder);

    // Update URL without page reload
    setSearchParams(params, { replace: true });
  }, [state, sortBy, sortOrder, setSearchParams]);

  // Filter diamonds based on current filter state
  const filteredDiamonds = useMemo(() => {
    try {
      return safeDiamonds.filter(diamond => {
        // Shape filter
        if (state.shape.length > 0 && !state.shape.includes(diamond.shape)) {
          return false;
        }

        // Color filter
        if (state.color.length > 0 && !state.color.includes(diamond.color)) {
          return false;
        }

        // Clarity filter
        if (state.clarity.length > 0 && !state.clarity.includes(diamond.clarity)) {
          return false;
        }

        // Cut filter
        if (state.cut.length > 0 && !state.cut.includes(diamond.cut)) {
          return false;
        }

        // Carat range filter
        const carat = parseFloat((diamond.carat || 0).toString());
        if (carat < state.carat_range.min || carat > state.carat_range.max) {
          return false;
        }

        // Price range filter
        if (diamond.price) {
          const price = parseFloat((diamond.price || '0').replace(/[$,]/g, ''));
          if (state.price_type === 'total') {
            if (price < state.price_range.min || price > state.price_range.max) {
              return false;
            }
          } else {
            // Per carat price
            const pricePerCarat = price / carat;
            if (pricePerCarat < state.price_range.min || pricePerCarat > state.price_range.max) {
              return false;
            }
          }
        }

        return true;
      });
    } catch (error) {
      console.error('❌ Error filtering diamonds:', error);
      setHasError(true);
      setErrorMessage('Error filtering diamonds');
      return [];
    }
  }, [safeDiamonds, state]);

  // Get filtered and sorted diamonds
  const sortedDiamonds = useMemo(() => {
    try {
      let filtered = safeDiamonds;

      // Apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(diamond => 
          (diamond.shape || '').toLowerCase().includes(query) ||
          (diamond.color || '').toLowerCase().includes(query) ||
          (diamond.clarity || '').toLowerCase().includes(query) ||
          (diamond.cut || '').toLowerCase().includes(query) ||
          (diamond.carat || 0).toString().includes(query) ||
          (diamond.price || '').toLowerCase().includes(query) ||
          (diamond.description || '').toLowerCase().includes(query)
        );
      }

      // Apply category filter
      if (selectedCategory) {
        filtered = filtered.filter(diamond => {
          // Add category filtering logic here if needed
          return true;
        });
      }

      // Apply other filters from context
      if (state.shape.length > 0) {
        filtered = filtered.filter(diamond => state.shape.includes(diamond.shape));
      }
      if (state.color.length > 0) {
        filtered = filtered.filter(diamond => state.color.includes(diamond.color));
      }
      if (state.clarity.length > 0) {
        filtered = filtered.filter(diamond => state.clarity.includes(diamond.clarity));
      }
      if (state.cut.length > 0) {
        filtered = filtered.filter(diamond => state.cut.includes(diamond.cut));
      }

      // Sort the filtered results
      return filtered.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (sortBy) {
          case 'price':
            aValue = parseFloat((a.price || '0').replace(/[$,]/g, ''));
            bValue = parseFloat((b.price || '0').replace(/[$,]/g, ''));
            break;
          case 'carat':
            aValue = a.carat || 0;
            bValue = b.carat || 0;
            break;
          case 'shape':
            aValue = (a.shape || '').toLowerCase();
            bValue = (b.shape || '').toLowerCase();
            break;
          case 'clarity':
            aValue = (a.clarity || '').toLowerCase();
            bValue = (b.clarity || '').toLowerCase();
            break;
          case 'color':
            aValue = (a.color || '').toLowerCase();
            bValue = (b.color || '').toLowerCase();
            break;
          case 'date':
            aValue = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0;
            bValue = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0;
            break;
          case 'popularity':
            // Mock popularity based on ID (in real app, this would be from analytics)
            aValue = a.id || 0;
            bValue = b.id || 0;
            break;
          default:
            return 0;
        }
        
        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    } catch (error) {
      console.error('❌ Error sorting diamonds:', error);
      setHasError(true);
      setErrorMessage('Error sorting diamonds');
      return [];
    }
  }, [safeDiamonds, searchQuery, selectedCategory, state, sortBy, sortOrder]);

  // Handle save diamond
  const handleSaveDiamond = (diamondId: number) => {
    const newSavedDiamonds = new Set(savedDiamonds);
    if (newSavedDiamonds.has(diamondId)) {
      newSavedDiamonds.delete(diamondId);
      toast({
        title: 'Removed from saved',
        description: 'Diamond removed from your saved items.',
      });
    } else {
      newSavedDiamonds.add(diamondId);
      toast({
        title: 'Added to saved',
        description: 'Diamond added to your saved items.',
      });
    }
    setSavedDiamonds(newSavedDiamonds);
  };

  // Handle add to wishlist
  const handleAddToWishlist = (diamondId: number) => {
    const newWishlistDiamonds = new Set(wishlistDiamonds);
    if (newWishlistDiamonds.has(diamondId)) {
      newWishlistDiamonds.delete(diamondId);
      toast({
        title: 'Removed from wishlist',
        description: 'Diamond removed from your wishlist.',
      });
    } else {
      newWishlistDiamonds.add(diamondId);
      toast({
        title: 'Added to wishlist',
        description: 'Diamond added to your wishlist.',
      });
    }
    setWishlistDiamonds(newWishlistDiamonds);
  };

  // Handle share diamond
  const handleShareDiamond = async (diamond: Diamond) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${diamond.shape} Diamond`,
          text: `Check out this amazing ${diamond.shape} diamond!`,
          url: `${window.location.origin}/diamond/${diamond.id}`,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${window.location.origin}/diamond/${diamond.id}`);
        toast({
          title: 'Link copied!',
          description: 'Diamond link has been copied to your clipboard.',
        });
      }
    } catch (error) {
      toast({
        title: 'Share failed',
        description: 'Unable to share the diamond. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Handle export diamond
  const handleExportDiamond = (diamond: Diamond) => {
    const diamondData = {
      id: diamond.id,
      shape: diamond.shape,
      carat: diamond.carat,
      color: diamond.color,
      clarity: diamond.clarity,
      cut: diamond.cut,
      price: diamond.price,
      category: diamond.category,
      description: diamond.description,
    };

    const dataStr = JSON.stringify(diamondData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${diamond.shape}-diamond-${diamond.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Export successful!',
      description: 'Diamond data has been exported as JSON file.',
    });
  };

  // Handle view diamond details
  const handleViewDiamond = (diamondId: number | string) => {
    navigate(`/diamond/${diamondId}`);
  };

  // Handle sort change
  const handleSortChange = (newSortBy: 'price' | 'carat' | 'date' | 'popularity' | 'shape' | 'clarity' | 'color') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  // Handle view mode change
  const handleViewModeChange = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  // Handle save search
  const handleSaveSearch = () => {
    toast({
      title: 'Search Saved',
      description: 'Your current search criteria has been saved.',
    });
  };

  // Handle modify filters
  const handleModifyFilters = () => {
    toggleFilterPanel();
  };

  // Handle select all/none
  const handleSelectAll = () => {
    if (selectedDiamonds.size === sortedDiamonds.length) {
      setSelectedDiamonds(new Set());
    } else {
      setSelectedDiamonds(new Set(sortedDiamonds.map(d => Number(d.id))));
    }
  };

  // Handle individual diamond selection
  const handleDiamondSelection = (diamondId: number) => {
    const newSelected = new Set(selectedDiamonds);
    if (newSelected.has(diamondId)) {
      newSelected.delete(diamondId);
    } else {
      newSelected.add(diamondId);
    }
    setSelectedDiamonds(newSelected);
  };



  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchQuery('');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already applied through the useMemo
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  // Infinite scrolling functionality
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Load more when user is near bottom (within 100px)
      if (scrollTop + windowHeight >= documentHeight - 100) {
        if (visibleCards < sortedDiamonds.length && !isLoadingMore) {
          console.log('📜 Loading more diamonds...', visibleCards, 'of', sortedDiamonds.length);
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCards(prev => Math.min(prev + 8, sortedDiamonds.length));
            setIsLoadingMore(false);
          }, 300); // Small delay for smooth loading effect
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleCards, sortedDiamonds.length, isLoadingMore]);

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

  // Get clarity color
  const getClarityColor = (clarity: string) => {
    const clarityColors: Record<string, string> = {
      'FL': 'bg-green-100 text-green-800',
      'IF': 'bg-green-100 text-green-800',
      'VVS1': 'bg-blue-100 text-blue-800',
      'VVS2': 'bg-blue-100 text-blue-800',
      'VS1': 'bg-yellow-100 text-yellow-800',
      'VS2': 'bg-yellow-100 text-yellow-800',
      'SI1': 'bg-orange-100 text-orange-800',
      'SI2': 'bg-orange-100 text-orange-800',
      'SI3': 'bg-red-100 text-red-800',
      'I1': 'bg-red-100 text-red-800',
      'I2': 'bg-red-100 text-red-800',
      'I3': 'bg-red-100 text-red-800',
    };
    return clarityColors[clarity] || 'bg-gray-100 text-gray-800';
  };

  // Error boundary - if there's an error, show error page
  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💎</div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-50">Something went wrong</h2>
            <p className="text-gray-300 mb-6">{errorMessage}</p>
            <Button 
              onClick={() => {
                setHasError(false);
                setErrorMessage('');
                window.location.reload();
              }} 
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-700 hover:text-white bg-gray-700 transition-colors duration-200"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-300">Loading diamonds...</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }, (_, i) => (
              <DiamondCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state from Firebase
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💎</div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-50">Error Loading Diamonds</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-700 hover:text-white bg-gray-700 transition-colors duration-200"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900">
      {/* Main Header */}
      <Header 
        title="Diamond Gallery"
      />

      {/* Page Content Section */}
      <div className="pt-20">
        {/* Action Buttons Section - Like the image */}
        {/* Results and Controls Bar */}
        <div className="border-b border-gray-800 bg-gray-900/30">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Left Side - Results Count and Search */}
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-300 font-montserrat">
                    Showing {sortedDiamonds.length} of {safeDiamonds.length} diamonds
                  </span>
                  {hasActiveFilters() && (
                    <Badge variant="secondary" className="bg-gray-700 text-gray-50 border-gray-600">
                      {getActiveFiltersCount()} filters active
                    </Badge>
                  )}
                </div>
                
                {/* Search Box - Moved below the count as per image */}
                <div className="flex items-center space-x-2">
                  {isSearchOpen && (
                    <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-1 border border-gray-600">
                      <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
                        <Input
                          type="text"
                          placeholder="Search diamonds..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="bg-transparent border-none text-white placeholder-gray-400 focus:ring-0 focus:outline-none w-48"
                          autoFocus
                        />
                        <Button
                          type="submit"
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-white p-1"
                        >
                          <Search className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleSearchClear}
                          className="text-gray-400 hover:text-white p-1"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </form>
                    </div>
                  )}
                  
                  {/* Search Toggle Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSearchToggle}
                    className={`border-gray-600 text-white hover:bg-gray-700 hover:text-white bg-gray-700 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 ${
                      isSearchOpen ? 'ring-2 ring-gray-50' : ''
                    }`}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
              
              {/* Right Side - Action Buttons */}
              <div className="flex flex-col items-end space-y-3">
                {/* Top Row - Change View Button */}
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleViewModeChange}
                    className="flex flex-col items-center space-y-1 p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
                  >
                    {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid3X3 className="w-5 h-5" />}
                    <span className="text-xs">Change View</span>
                  </Button>
                </div>
                
                                                  {/* Bottom Row - Sort and Filter Controls */}
                 <div className="flex items-center space-x-3">
                   {/* Sorting Button with Sliding Menu */}
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={() => setIsSortPanelOpen(!isSortPanelOpen)}
                     className="border-gray-600 text-white hover:bg-gray-700 hover:text-white bg-gray-700 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
                   >
                     <List className="h-4 w-4 mr-2" />
                     {sortBy === 'price' && sortOrder === 'asc' && 'Price (Low to High)'}
                     {sortBy === 'price' && sortOrder === 'desc' && 'Price (High to Low)'}
                     {sortBy === 'carat' && sortOrder === 'asc' && 'Carat (Low to High)'}
                     {sortBy === 'carat' && sortOrder === 'desc' && 'Carat (High to Low)'}
                     {sortBy === 'shape' && sortOrder === 'asc' && 'Shape (A to Z)'}
                     {sortBy === 'shape' && sortOrder === 'desc' && 'Shape (Z to A)'}
                     {sortBy === 'clarity' && sortOrder === 'asc' && 'Clarity (A to Z)'}
                     {sortBy === 'clarity' && sortOrder === 'desc' && 'Clarity (Z to A)'}
                     {sortBy === 'color' && sortOrder === 'asc' && 'Color (A to Z)'}
                     {sortBy === 'color' && sortOrder === 'desc' && 'Color (Z to A)'}
                     {sortBy === 'date' && sortOrder === 'asc' && 'Date (Oldest First)'}
                     {sortBy === 'date' && sortOrder === 'desc' && 'Date (Newest First)'}
                     {sortBy === 'popularity' && 'Popularity'}
                     <ChevronDown className="h-4 w-4 ml-2" />
                   </Button>
                   
                   {/* Filters Button */}
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={toggleFilterPanel}
                     className="border-gray-600 text-white hover:bg-gray-700 hover:text-white bg-gray-700 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
                   >
                     <Filter className="h-4 w-4 mr-2" />
                     Filters
                     {hasActiveFilters() && (
                       <Badge variant="secondary" className="ml-2 bg-gray-600 text-white text-xs">
                         {getActiveFiltersCount()}
                       </Badge>
                     )}
                   </Button>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sorting Panel - Sliding Menu */}
        {isSortPanelOpen && (
          <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Sort Options</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSortPanelOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {/* Price Sorting */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-300">Price</h4>
                  <div className="space-y-1">
                    <Button
                      variant={sortBy === 'price' && sortOrder === 'asc' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setSortBy('price');
                        setSortOrder('asc');
                        setIsSortPanelOpen(false);
                      }}
                      className={`w-full ${
                        sortBy === 'price' && sortOrder === 'asc'
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'border-gray-600 text-white hover:bg-gray-700 hover:text-white bg-gray-700'
                      }`}
                    >
                      Low to High
                    </Button>
                    <Button
                      variant={sortBy === 'price' && sortOrder === 'desc' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setSortBy('price');
                        setSortOrder('desc');
                        setIsSortPanelOpen(false);
                      }}
                      className={`w-full ${
                        sortBy === 'price' && sortOrder === 'desc'
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'border-gray-600 text-white hover:bg-gray-700 hover:text-white bg-gray-700'
                      }`}
                    >
                      High to Low
                    </Button>
                  </div>
                </div>

                {/* Carat Sorting */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-300">Carat</h4>
                  <div className="space-y-1">
                    <Button
                      variant={sortBy === 'carat' && sortOrder === 'asc' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setSortBy('carat');
                        setSortOrder('asc');
                        setIsSortPanelOpen(false);
                      }}
                      className={`w-full ${
                        sortBy === 'carat' && sortOrder === 'asc'
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'border-gray-600 text-white hover:bg-gray-700 hover:text-white bg-gray-700'
                      }`}
                    >
                      Low to High
                    </Button>
                    <Button
                      variant={sortBy === 'carat' && sortOrder === 'desc' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setSortBy('carat');
                        setSortOrder('desc');
                        setIsSortPanelOpen(false);
                      }}
                      className={`w-full ${
                        sortBy === 'carat' && sortOrder === 'desc'
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'border-gray-600 text-white hover:bg-gray-700 hover:text-white bg-gray-700'
                      }`}
                    >
                      High to Low
                    </Button>
                  </div>
                </div>

                {/* Shape Sorting */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-300">Shape</h4>
                  <div className="space-y-1">
                    <Button
                      variant={sortBy === 'shape' && sortOrder === 'asc' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setSortBy('shape');
                        setSortOrder('asc');
                        setIsSortPanelOpen(false);
                      }}
                      className={`w-full ${
                        sortBy === 'shape' && sortOrder === 'asc'
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'border-gray-600 text-white hover:bg-gray-700 hover:text-white bg-gray-700'
                      }`}
                    >
                      A to Z
                    </Button>
                    <Button
                      variant={sortBy === 'shape' && sortOrder === 'desc' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setSortBy('shape');
                        setSortOrder('desc');
                        setIsSortPanelOpen(false);
                      }}
                      className={`w-full ${
                        sortBy === 'shape' && sortOrder === 'desc'
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'border-gray-600 text-white hover:bg-gray-700 hover:text-white bg-gray-700'
                      }`}
                    >
                      Z to A
                    </Button>
                  </div>
                </div>

                {/* Clarity Sorting */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-300">Clarity</h4>
                  <div className="space-y-1">
                    <Button
                      variant={sortBy === 'clarity' && sortOrder === 'asc' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setSortBy('clarity');
                        setSortOrder('asc');
                        setIsSortPanelOpen(false);
                      }}
                      className={`w-full ${
                        sortBy === 'clarity' && sortOrder === 'asc'
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'border-gray-600 text-white hover:bg-gray-700 hover:text-white bg-gray-700'
                      }`}
                    >
                      A to Z
                    </Button>
                    <Button
                      variant={sortBy === 'clarity' && sortOrder === 'desc' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setSortBy('clarity');
                        setSortOrder('desc');
                        setIsSortPanelOpen(false);
                      }}
                      className={`w-full ${
                        sortBy === 'clarity' && sortOrder === 'desc'
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'border-gray-600 text-white hover:bg-gray-700 hover:text-white bg-gray-700'
                      }`}
                    >
                      Z to A
                    </Button>
                  </div>
                </div>

                {/* Color Sorting */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-300">Color</h4>
                  <div className="space-y-1">
                    <Button
                      variant={sortBy === 'color' && sortOrder === 'asc' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setSortBy('color');
                        setSortOrder('asc');
                        setIsSortPanelOpen(false);
                      }}
                      className={`w-full ${
                        sortBy === 'color' && sortOrder === 'asc'
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'border-gray-600 text-white hover:bg-gray-700 hover:text-white bg-gray-700'
                      }`}
                    >
                      A to Z
                    </Button>
                    <Button
                      variant={sortBy === 'color' && sortOrder === 'desc' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setSortBy('color');
                        setSortOrder('desc');
                        setIsSortPanelOpen(false);
                      }}
                      className={`w-full ${
                        sortBy === 'color' && sortOrder === 'desc'
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'border-gray-600 text-white hover:bg-gray-700 hover:text-white bg-gray-700'
                      }`}
                    >
                      Z to A
                    </Button>
                  </div>
                </div>

                {/* Date Sorting */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-300">Date</h4>
                  <div className="space-y-1">
                    <Button
                      variant={sortBy === 'date' && sortOrder === 'asc' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setSortBy('date');
                        setSortOrder('asc');
                        setIsSortPanelOpen(false);
                      }}
                      className={`w-full ${
                        sortBy === 'date' && sortOrder === 'asc'
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'border-gray-700 hover:bg-gray-700 hover:text-white bg-gray-700'
                      }`}
                    >
                      Oldest First
                    </Button>
                    <Button
                      variant={sortBy === 'date' && sortOrder === 'desc' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setSortBy('date');
                        setSortOrder('desc');
                        setIsSortPanelOpen(false);
                      }}
                      className={`w-full ${
                        sortBy === 'date' && sortOrder === 'desc'
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'border-gray-600 text-white hover:bg-gray-700 hover:text-white bg-gray-700'
                      }`}
                    >
                      Newest First
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Diamond Cards Gallery View */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedDiamonds.slice(0, visibleCards).map((diamond) => {
              try {
                return (
                  <Card 
                    key={diamond.id} 
                    className="bg-gray-800 border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105 interactive-hover cursor-pointer"
                    onClick={() => handleViewDiamond(diamond.id)}
                  >
                    <CardContent className="p-0">
                      {/* Diamond Image */}
                      <div className="relative aspect-square bg-gradient-to-br from-gray-700 to-gray-800 rounded-t-lg overflow-hidden">
                        {/* Selection Checkbox - Top Left */}
                        <div className="absolute top-2 left-2 z-10">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDiamondSelection(Number(diamond.id));
                            }}
                            className={`w-8 h-8 p-0 rounded-full transition-all duration-200 ${
                              selectedDiamonds.has(Number(diamond.id))
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                          >
                            <CheckSquare className="w-4 h-4" />
                          </Button>
                        </div>

                        <img
                          src={diamond.primaryImage || '/diamond-round.jpg'}
                          alt={`${diamond.shape || 'Diamond'} diamond`}
                          className="w-full h-full object-cover"
                          onLoad={() => {
                            console.log('✅ Gallery image loaded:', diamond.primaryImage?.substring(0, 50) + '...');
                          }}
                          onError={(e) => {
                            console.error('❌ Gallery image failed to load:', diamond.primaryImage);
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            // Show fallback emoji
                            const fallback = target.parentElement?.querySelector('.fallback-emoji') as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center fallback-emoji" style={{ display: 'none' }}>
                          <div className="text-6xl">💎</div>
                        </div>
                        
                        {/* Action Buttons Overlay */}
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveDiamond(Number(diamond.id));
                            }}
                            className={`w-8 h-8 p-0 rounded-full transition-all duration-200 ${
                              savedDiamonds.has(Number(diamond.id))
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToWishlist(Number(diamond.id));
                            }}
                            className={`w-8 h-8 p-0 rounded-full transition-all duration-200 ${
                              wishlistDiamonds.has(Number(diamond.id))
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                          >
                            <Star className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Diamond Details */}
                      <div className="p-4 space-y-3">
                        {/* Diamond Specifications - Like the image */}
                        <div className="space-y-2">
                          {/* First Line: Shape, Carat, Color, Clarity */}
                          <div className="text-sm text-gray-100 font-medium">
                            {diamond.shape || 'Round'} {diamond.carat || 0}ct {diamond.color || 'N/A'} {diamond.clarity || 'N/A'}
                          </div>
                          
                          {/* Second Line: Cut, Polish, Symmetry, Fluorescence */}
                          <div className="text-sm text-gray-300">
                            {diamond.cut || 'N/A'}.{diamond.polish || 'N/A'}.{diamond.symmetry || 'N/A'}/{diamond.fluorescence || 'NONE'}
                          </div>
                          
                          {/* Third Line: Price */}
                          <div className="text-lg font-bold text-gray-100">
                            {formatPrice(diamond.price || '0')}
                          </div>
                          
                          {/* Fourth Line: Total Price */}
                          <div className="text-sm text-gray-400">
                            Total Price
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDiamond(diamond.id);
                            }}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 mr-2"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          
                          {/* Three dots menu - Like the image */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Add more options menu here
                            }}
                            className="w-8 h-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                          >
                            <span className="text-lg">⋯</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              } catch (error) {
                console.error('❌ Error rendering diamond card:', error, diamond);
                return (
                  <Card key={diamond.id} className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="text-center text-gray-400">
                        <div className="text-4xl mb-2">💎</div>
                        <p>Error loading diamond</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              }
            })}
          </div>

          {/* Load More Button */}
          {visibleCards < sortedDiamonds.length && (
            <div className="text-center mt-8">
              <Button
                onClick={() => setVisibleCards(prev => Math.min(prev + 8, sortedDiamonds.length))}
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-700 hover:text-white bg-gray-700 transition-all duration-200 transform hover:scale-105"
              >
                Load More Diamonds ({visibleCards} of {sortedDiamonds.length})
              </Button>
            </div>
          )}
          
          {/* Loading indicator */}
          {isLoadingMore && (
            <div className="text-center mt-8 py-4">
              <div className="inline-flex items-center space-x-2 text-gray-400">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="font-montserrat">Loading more diamonds...</span>
              </div>
            </div>
          )}
          
          {/* End of diamonds message */}
          {visibleCards >= sortedDiamonds.length && sortedDiamonds.length > 0 && !isLoadingMore && (
            <div className="text-center mt-8 py-8">
              <div className="text-gray-400 font-montserrat">
                <div className="text-2xl mb-2">✨</div>
                <p>You've reached the end of our diamond collection!</p>
                <p className="text-sm mt-2">Showing all {sortedDiamonds.length} diamonds</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      <FilterPanel />

      {/* Category Management Modal */}
      <CategoryManagement
        isOpen={isCategoryManagementOpen}
        onClose={() => setIsCategoryManagementOpen(false)}
      />
    </div>
  );
}; 
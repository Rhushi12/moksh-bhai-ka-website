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
import { Filter, Heart, Eye, Share2, Download, Star, TrendingUp, Clock, Loader2, Search, X } from 'lucide-react';

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
  const [sortBy, setSortBy] = useState<'price' | 'carat' | 'date' | 'popularity'>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [visibleCards, setVisibleCards] = useState<number>(8);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

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
  const handleSortChange = (newSortBy: 'price' | 'carat' | 'date' | 'popularity') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
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
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
        title="Diamond Gallery"
      />

      {/* Page Content Section */}
      <div className="pt-20">
        {/* Results and Controls Bar */}
        <div className="border-b border-gray-800 bg-gray-900/30">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Left Side - Results Count */}
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
              
                             {/* Right Side - Sorting and Filter Controls */}
               <div className="flex items-center space-x-2">
                 {/* Search Box */}
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
                   <Search className="w-4 h-4" />
                   Search
                 </Button>
                 
                 {/* Sort Controls */}
                 <div className="flex items-center space-x-2">
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={() => handleSortChange('price')}
                     className={`border-gray-600 text-white hover:bg-gray-700 hover:text-white bg-gray-700 transition-all duration-200 transform hover:scale-105 ${
                       sortBy === 'price' ? 'ring-2 ring-gray-50' : ''
                     }`}
                   >
                     Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                   </Button>
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={() => handleSortChange('carat')}
                     className={`border-gray-600 text-white hover:bg-gray-700 hover:text-white bg-gray-700 transition-all duration-200 transform hover:scale-105 ${
                       sortBy === 'carat' ? 'ring-2 ring-gray-50' : ''
                     }`}
                   >
                     Carat {sortBy === 'carat' && (sortOrder === 'asc' ? '↑' : '↓')}
                   </Button>
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={() => handleSortChange('date')}
                     className={`border-gray-600 text-white hover:bg-gray-700 hover:text-white bg-gray-700 transition-all duration-200 transform hover:scale-105 ${
                       sortBy === 'date' ? 'ring-2 ring-gray-50' : ''
                     }`}
                   >
                     Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                   </Button>
                 </div>
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={toggleFilterPanel}
                   className="border-gray-600 text-white hover:bg-gray-700 hover:text-white bg-gray-700 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
                 >
                   <Filter className="w-4 h-4" />
                   Filters
                 </Button>
               </div>
            </div>
          </div>
        </div>

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
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-100 text-lg">{diamond.shape || 'Diamond'}</h3>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShareDiamond(diamond);
                              }}
                              className="w-8 h-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                            >
                              <Share2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleExportDiamond(diamond);
                              }}
                              className="w-8 h-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Diamond Specifications */}
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Carat</span>
                            <span className="text-gray-100 font-medium">{diamond.carat || 0} ct</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Color</span>
                            <span className="text-gray-100 font-medium">{diamond.color || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Clarity</span>
                            <span className="text-gray-100 font-medium">{diamond.clarity || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Cut</span>
                            <span className="text-gray-100 font-medium">{diamond.cut || 'N/A'}</span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="pt-2">
                          <div className="text-2xl font-bold text-gray-100">
                            {formatPrice(diamond.price || '0')}
                          </div>
                          <div className="text-sm text-gray-400">
                            ${formatPrice(parseFloat((diamond.price || '0').replace(/[$,]/g, '')) / parseFloat((diamond.carat || 0).toString()))}/ct
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2 pt-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDiamond(diamond.id);
                            }}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
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
    </div>
  );
}; 
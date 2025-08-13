import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFirebase } from '@/contexts/FirebaseContext';
import { Diamond } from '@/data/diamonds';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import VideoPlayer from '@/components/VideoPlayer';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Download, 
  Eye, 
  Calendar, 
  User, 
  Star,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Play,
  Pause,
  MessageCircle
} from 'lucide-react';
import { Label } from '@/components/ui/label';

export const DiamondDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { diamonds: firebaseDiamonds, isLoading, error: firebaseError } = useFirebase();
  const [diamond, setDiamond] = useState<Diamond | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isMediaTransitioning, setIsMediaTransitioning] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [hasError, setHasError] = useState<boolean>(false);

  // Safety check for firebaseDiamonds
  const safeDiamonds = React.useMemo(() => {
    if (!firebaseDiamonds || !Array.isArray(firebaseDiamonds)) {
      console.warn('⚠️ firebaseDiamonds is not an array:', firebaseDiamonds);
      return [];
    }
    return firebaseDiamonds;
  }, [firebaseDiamonds]);

  // Get all media (images and videos)
  const getAllMedia = (diamond: Diamond) => {
    try {
      const media = [];
      
      // Add primary image
      if (diamond.primaryImage) {
        media.push({ type: 'image', url: diamond.primaryImage });
      }
      
      // Add additional images
      if (diamond.images && Array.isArray(diamond.images)) {
        diamond.images.forEach(url => {
          if (url && url !== diamond.primaryImage) {
            media.push({ type: 'image', url });
          }
        });
      }
      
      // Add primary video
      if (diamond.primaryVideo) {
        media.push({ type: 'video', url: diamond.primaryVideo });
      }
      
      // Add additional videos
      if (diamond.videos && Array.isArray(diamond.videos)) {
        diamond.videos.forEach(url => {
          if (url && url !== diamond.primaryVideo) {
            media.push({ type: 'video', url });
          }
        });
      }
      
      return media.length > 0 ? media : [{ type: 'image', url: '/diamond-round.jpg' }];
    } catch (error) {
      console.error('❌ Error getting media for diamond:', error);
      return [{ type: 'image', url: '/diamond-round.jpg' }];
    }
  };

  const diamondMedia = diamond ? getAllMedia(diamond) : [];
  const currentMedia = diamondMedia[currentMediaIndex];
  const hasVideos = diamond?.videos && diamond.videos.length > 0 || diamond?.primaryVideo;

  // Find diamond from Firebase data
  useEffect(() => {
    if (id && safeDiamonds.length > 0) {
      console.log('🔍 DiamondDetailPage: Looking for diamond with ID:', id, 'Type:', typeof id);
      console.log('🔍 DiamondDetailPage: Available diamonds:', safeDiamonds.map(d => ({ id: d.id, idType: typeof d.id, shape: d.shape })));
      
      const foundDiamond = safeDiamonds.find(d => {
        const match = d.id === id || d.id === parseInt(id) || d.id === id.toString();
        console.log('🔍 Comparing:', { searchId: id, diamondId: d.id, match });
        return match;
      });
      
      if (foundDiamond) {
        console.log('✅ DiamondDetailPage: Found diamond:', foundDiamond.shape);
        setDiamond(foundDiamond);
        setError(null);
      } else {
        console.log('❌ DiamondDetailPage: Diamond not found with ID:', id);
        setError('Diamond not found');
      }
    } else if (id && !isLoading) {
      // Only show error if Firebase has finished loading and we still don't have the diamond
      setError('Diamond not found');
    }
  }, [id, safeDiamonds, isLoading]);

  // Handle save diamond
  const handleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? 'Removed from saved' : 'Added to saved',
      description: isSaved ? 'Diamond removed from your saved items.' : 'Diamond added to your saved items.',
    });
  };

  // Handle share diamond
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${diamond?.shape} Diamond`,
          text: `Check out this amazing ${diamond?.shape} diamond!`,
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
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
  const handleExport = () => {
    if (!diamond) return;

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



  // Handle schedule viewing
  const handleScheduleViewing = () => {
    toast({
      title: 'Schedule Viewing',
      description: 'Viewing scheduler would open here in a real application.',
    });
  };

  // Handle contact expert
  const handleContactExpert = () => {
    navigate('/contact');
  };

  // Handle add to wishlist
  const handleAddToWishlist = () => {
    setIsInWishlist(!isInWishlist);
    toast({
      title: isInWishlist ? 'Removed from wishlist' : 'Added to wishlist',
      description: isInWishlist ? 'Diamond removed from your wishlist.' : 'Diamond added to your wishlist.',
    });
  };

  // Handle media navigation
  const handleMediaChange = (direction: 'next' | 'prev') => {
    setIsMediaTransitioning(true);
    setTimeout(() => {
      if (direction === 'next') {
        setCurrentMediaIndex((prev) => (prev + 1) % diamondMedia.length);
      } else {
        setCurrentMediaIndex((prev) => (prev - 1 + diamondMedia.length) % diamondMedia.length);
      }
      setIsMediaTransitioning(false);
    }, 150);
  };

  // Handle media selection
  const handleMediaSelect = (index: number) => {
    setIsMediaTransitioning(true);
    setTimeout(() => {
      setCurrentMediaIndex(index);
      setIsMediaTransitioning(false);
    }, 150);
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
            <p className="text-gray-300 mb-6">An error occurred while loading the diamond details.</p>
            <Button 
              onClick={() => {
                setHasError(false);
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
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-50 mx-auto mb-4"></div>
              <p className="text-gray-100">Loading diamond details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state from Firebase
  if (firebaseError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💎</div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-50">Error Loading Diamond</h2>
            <p className="text-gray-300 mb-6">{firebaseError}</p>
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

  if (error || !diamond) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💎</div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-50">Diamond Not Found</h2>
            <p className="text-gray-300 mb-6">{error || 'The requested diamond could not be found.'}</p>
            <Button 
              onClick={() => navigate('/gallery')} 
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-700 hover:text-white bg-gray-700 transition-colors duration-200"
            >
              Back to Gallery
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/gallery')} 
                className="border-gray-600 text-white hover:bg-gray-700 hover:text-white bg-gray-700 transition-all duration-200 transform hover:scale-105"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Gallery
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-50 font-playfair">{diamond.shape} Diamond</h1>
                <p className="text-sm text-gray-400">ID: {diamond.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSave}
                className={`border-gray-600 text-white hover:bg-gray-700 hover:text-white bg-gray-700 transition-all duration-200 transform hover:scale-105 ${isSaved ? 'ring-2 ring-yellow-400' : ''}`}
              >
                <Heart className={`h-4 w-4 mr-2 ${isSaved ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                {isSaved ? 'Saved' : 'Save'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleShare}
                className="border-gray-600 text-white hover:bg-gray-700 hover:text-white bg-gray-700 transition-all duration-200 transform hover:scale-105"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExport}
                className="border-gray-600 text-white hover:bg-gray-700 hover:text-white bg-gray-700 transition-all duration-200 transform hover:scale-105"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Media Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden group">
              {/* Show video or image based on current media */}
              {currentMedia?.type === 'video' ? (
                <VideoPlayer
                  src={currentMedia.url}
                  poster={diamond.primaryImage}
                  className="w-full h-full"
                  autoPlay={false}
                  muted={true}
                  loop={false}
                  controls={true}
                />
              ) : (
                <img
                  src={currentMedia?.url || '/placeholder.svg'}
                  alt={`${diamond.shape} diamond`}
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    isMediaTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                  }`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
              )}
              
              {/* Navigation arrows */}
              <button
                onClick={() => handleMediaChange('prev')}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/70"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleMediaChange('next')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/70"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              
              {/* Media indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {diamondMedia.map((media, index) => (
                  <button
                    key={index}
                    onClick={() => handleMediaSelect(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentMediaIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>

              {/* Video indicator badge */}
              {hasVideos && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-black bg-opacity-50 text-white">
                    <Play className="w-3 h-3 mr-1" />
                    Video Available
                  </Badge>
                </div>
              )}
            </div>

            {/* Thumbnail gallery */}
            <div className="flex space-x-2 overflow-x-auto">
              {diamondMedia.map((media, index) => (
                <button
                  key={index}
                  onClick={() => handleMediaSelect(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-200 transform hover:scale-105 relative ${
                    index === currentMediaIndex ? 'ring-2 ring-white' : 'ring-1 ring-gray-600'
                  }`}
                >
                  {media.type === 'video' ? (
                    <div className="relative w-full h-full">
                      <img
                        src={diamond.primaryImage || '/placeholder.svg'}
                        alt={`${diamond.shape} diamond video thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  ) : (
                    <img
                      src={media.url}
                      alt={`${diamond.shape} diamond thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Diamond Details */}
          <div className="space-y-6">
            {/* Quick Overview */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-50">Quick Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-300">Carat Weight</Label>
                    <p className="text-lg font-semibold text-gray-50">{diamond.carat} ct</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-300">Color</Label>
                    <Badge className="bg-white text-gray-900 border border-gray-200">
                      {diamond.color}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-300">Clarity</Label>
                    <Badge className={`${getClarityColor(diamond.clarity)}`}>
                      {diamond.clarity}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-300">Cut</Label>
                    <p className="text-lg font-semibold text-gray-50">{diamond.cut}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Information */}
            {diamond.price && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-50">Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-300">Total Price</Label>
                    <p className="text-3xl font-bold text-gray-50">{formatPrice(diamond.price)}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-300">Price per Carat</Label>
                    <p className="text-lg font-semibold text-gray-50">
                      {formatPrice(parseFloat(diamond.price.replace(/[$,]/g, '')) / parseFloat(diamond.carat.toString()))}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-50">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-100 leading-relaxed">{diamond.description}</p>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-50">Specifications</CardTitle>
              </CardHeader>
              <CardContent className="pb-8">
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-700 border-gray-600">
                    <TabsTrigger value="details" className="text-white data-[state=active]:bg-gray-600 data-[state=active]:text-white transition-all duration-200">Details</TabsTrigger>
                    <TabsTrigger value="origin" className="text-white data-[state=active]:bg-gray-600 data-[state=active]:text-white transition-all duration-200">Origin</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="space-y-4 mt-4 pb-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-300">Shape</Label>
                        <Badge className={`${getShapeColor(diamond.shape)} text-white`}>
                          {diamond.shape}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-300">Category</Label>
                        <p className="text-gray-50">{diamond.category}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-300">Measurements</Label>
                        <p className="text-gray-50">6.5 x 6.5 x 4.0 mm</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-300">Depth %</Label>
                        <p className="text-gray-50">61.5%</p>
                      </div>
                    </div>
                  </TabsContent>
                  

                  
                  <TabsContent value="origin" className="space-y-4 mt-4 pb-4">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <div>
                          <Label className="text-sm text-gray-300">Origin</Label>
                          <p className="text-gray-50">Botswana</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Star className="h-5 w-5 text-gray-400" />
                        <div>
                          <Label className="text-sm text-gray-300">Certification</Label>
                          <p className="text-gray-50">GIA</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sticky Call-to-Action Section */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 p-4 z-50">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-sm text-gray-300">Interested in this diamond?</p>
                  <p className="text-lg font-semibold text-gray-50">{formatPrice(diamond.price || '0')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">

                <Button
                  variant="outline"
                  onClick={handleScheduleViewing}
                  className="text-white hover:bg-gray-700 hover:text-white bg-gray-700 transition-all duration-200 transform hover:scale-105"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Viewing
                </Button>
                <Button
                  onClick={() => window.location.href = 'tel:+919106338340'}
                  className="bg-green-600 hover:bg-green-700 text-white transition-all duration-200 transform hover:scale-105"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
                <Button
                  onClick={() => window.open('https://wa.me/919106338340?text=Hi, I\'m interested in this diamond: ' + encodeURIComponent(diamond?.description || ''), '_blank')}
                  className="bg-green-500 hover:bg-green-600 text-white transition-all duration-200 transform hover:scale-105"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  onClick={handleAddToWishlist}
                  className={`transition-all duration-200 transform hover:scale-105 ${
                    isInWishlist ? 'ring-2 ring-pink-400 text-pink-400' : 'text-white hover:bg-gray-700 hover:text-white bg-gray-700'
                  }`}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isInWishlist ? 'fill-current' : ''}`} />
                  {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
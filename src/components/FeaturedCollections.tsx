import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Star, TrendingUp, Sparkles, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Diamond } from '@/data/diamonds';

interface FeaturedCollectionsProps {
  diamonds: Diamond[];
}

interface Collection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  filter: (diamond: Diamond) => boolean;
  badge?: string;
  gradient: string;
  textColor: string;
}

export const FeaturedCollections: React.FC<FeaturedCollectionsProps> = ({ diamonds }) => {
  const navigate = useNavigate();
  const [hoveredCollection, setHoveredCollection] = useState<string | null>(null);

  const collections: Collection[] = [
    {
      id: 'bestsellers',
      title: 'Bestsellers',
      description: 'Our most popular diamonds chosen by discerning collectors',
      icon: <Star className="w-6 h-6" />,
      filter: (diamond) => diamond.bestseller,
      badge: 'Popular',
      gradient: 'from-gray-700 via-gray-600 to-gray-500',
      textColor: 'text-white'
    },
    {
      id: 'investment',
      title: 'Investment Grade',
      description: 'Premium diamonds with exceptional appreciation potential',
      icon: <TrendingUp className="w-6 h-6" />,
      filter: (diamond) => diamond.category === 'Investment Diamonds',
      badge: 'High Value',
      gradient: 'from-gray-800 via-gray-700 to-gray-600',
      textColor: 'text-white'
    },
    {
      id: 'certified',
      title: 'Certified Collection',
      description: 'GIA & IGI certified diamonds with verified authenticity',
      icon: <Crown className="w-6 h-6" />,
      filter: (diamond) => diamond.category === 'Certified Diamonds',
      badge: 'Verified',
      gradient: 'from-slate-700 via-slate-600 to-slate-500',
      textColor: 'text-white'
    },
    {
      id: 'rare',
      title: 'Rare Finds',
      description: 'Exceptional cuts and unique shapes for the true connoisseur',
      icon: <Sparkles className="w-6 h-6" />,
      filter: (diamond) => ['Heart', 'Marquise', 'Pear', 'Custom'].includes(diamond.shape),
      badge: 'Exclusive',
      gradient: 'from-zinc-700 via-zinc-600 to-zinc-500',
      textColor: 'text-white'
    }
  ];

  const getCollectionDiamonds = (collection: Collection) => {
    return diamonds.filter(collection.filter).slice(0, 3);
  };

  const handleCollectionClick = (collectionId: string) => {
    // Navigate to gallery with appropriate filters applied
    navigate('/gallery', { 
      state: { 
        filterType: collectionId,
        fromHomepage: true 
      } 
    });
  };

  const handleViewAllClick = () => {
    navigate('/gallery');
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-playfair text-gray-50 mb-4">
            Featured Collections
          </h2>
          <p className="text-lg text-gray-300 font-montserrat max-w-3xl mx-auto mb-8">
            Discover our curated collections, each carefully selected to meet the highest standards of quality, beauty, and investment potential
          </p>
          
          <Button
            onClick={handleViewAllClick}
            variant="outline"
            className="border-2 border-gray-500 text-gray-200 hover:bg-gray-700 hover:text-white font-playfair px-6 py-2"
          >
            View Full Gallery
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {collections.map((collection) => {
            const collectionDiamonds = getCollectionDiamonds(collection);
            const isHovered = hoveredCollection === collection.id;

            return (
              <Card
                key={collection.id}
                className="group bg-gray-800/40 border-gray-700 overflow-hidden transition-all duration-300 hover:border-gray-600 hover:scale-105 cursor-pointer"
                onMouseEnter={() => setHoveredCollection(collection.id)}
                onMouseLeave={() => setHoveredCollection(null)}
                onClick={() => handleCollectionClick(collection.id)}
              >
                <CardContent className="p-0">
                  {/* Collection Header */}
                  <div className={`bg-gradient-to-r ${collection.gradient} p-6 relative overflow-hidden`}>
                    <div className={`relative z-10 ${collection.textColor}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {collection.icon}
                          <h3 className="text-xl md:text-2xl font-playfair font-semibold">
                            {collection.title}
                          </h3>
                        </div>
                        {collection.badge && (
                          <Badge variant="secondary" className="bg-white/20 text-current border-white/30">
                            {collection.badge}
                          </Badge>
                        )}
                      </div>
                      <p className={`text-sm md:text-base font-montserrat opacity-90`}>
                        {collection.description}
                      </p>
                      <div className="mt-4 text-sm font-medium">
                        {collectionDiamonds.length} diamonds available
                      </div>
                    </div>
                    
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.3),transparent_50%)]"></div>
                    </div>
                  </div>

                  {/* Diamond Preview */}
                  <div className="p-6">
                    {collectionDiamonds.length > 0 ? (
                      <div className="grid grid-cols-3 gap-4">
                        {collectionDiamonds.map((diamond, index) => (
                          <div
                            key={diamond.id}
                            className={`
                              relative aspect-square rounded-lg overflow-hidden bg-gray-700 transition-all duration-300
                              ${isHovered ? 'scale-105' : 'scale-100'}
                            `}
                            style={{ transitionDelay: `${index * 100}ms` }}
                          >
                            <img
                              src={diamond.primaryImage}
                              alt={`${diamond.shape} diamond`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder.svg';
                              }}
                            />
                            
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/20 transition-opacity duration-300 group-hover:bg-black/10" />
                            
                            {/* Diamond Info */}
                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                              <p className="text-white text-xs font-montserrat">
                                {diamond.carat}ct {diamond.shape}
                              </p>
                              <p className="text-gray-300 text-xs">
                                {diamond.price}
                              </p>
                            </div>

                            {/* Bestseller Badge */}
                            {diamond.bestseller && (
                              <div className="absolute top-2 right-2">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-gray-400 mb-2">
                          <Sparkles className="w-8 h-8 mx-auto opacity-50" />
                        </div>
                        <p className="text-gray-400 text-sm font-montserrat">
                          Collection coming soon
                        </p>
                      </div>
                    )}

                    {/* View Collection Button */}
                    <div className="mt-6 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white font-montserrat transition-all duration-300 group-hover:border-gray-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCollectionClick(collection.id);
                        }}
                      >
                        View Collection
                        <ChevronRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom Stats */}
        <div className="mt-12 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { label: 'Total Diamonds', value: diamonds.length },
              { label: 'Bestsellers', value: diamonds.filter(d => d.bestseller).length },
              { label: 'Investment Grade', value: diamonds.filter(d => d.category === 'Investment Diamonds').length },
              { label: 'Certified', value: diamonds.filter(d => d.category === 'Certified Diamonds').length }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-playfair text-gray-50 font-bold">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400 font-montserrat">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

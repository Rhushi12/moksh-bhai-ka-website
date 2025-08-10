import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Diamond } from '@/data/diamonds';
import { formatPrice } from '@/lib/utils';
import VideoPlayer from './VideoPlayer';

interface DiamondCardProps {
  diamond: Diamond;
  className?: string;
}

export const DiamondCard: React.FC<DiamondCardProps> = ({ diamond, className = '' }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [mediaIndex, setMediaIndex] = useState(0);

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

  const getColorClass = (color: string) => {
    if (color.startsWith('Fancy')) {
      return 'bg-gradient-to-r from-pink-100 to-purple-100 text-purple-800';
    }
    
    const colorGrades: Record<string, string> = {
      'D': 'bg-white text-gray-900 border border-gray-200',
      'E': 'bg-gray-50 text-gray-800',
      'F': 'bg-gray-100 text-gray-700',
      'G': 'bg-yellow-50 text-yellow-800',
      'H': 'bg-yellow-100 text-yellow-700',
      'I': 'bg-orange-50 text-orange-800',
      'J': 'bg-orange-100 text-orange-700',
      'K': 'bg-red-50 text-red-800',
      'L': 'bg-red-100 text-red-700',
      'M': 'bg-red-200 text-red-600',
    };
    
    return colorGrades[color] || 'bg-gray-100 text-gray-800';
  };

  // Get all media (images and videos)
  const allMedia = [
    ...(diamond.images || []).map(url => ({ type: 'image', url })),
    ...(diamond.videos || []).map(url => ({ type: 'video', url }))
  ];

  const currentMedia = allMedia[mediaIndex];
  const hasVideos = diamond.videos && diamond.videos.length > 0;
  const hasMultipleMedia = allMedia.length > 1;

  const handleMediaToggle = () => {
    if (hasVideos && diamond.primaryVideo) {
      setShowVideo(!showVideo);
    }
  };

  const handleNextMedia = () => {
    if (hasMultipleMedia) {
      setMediaIndex((prev) => (prev + 1) % allMedia.length);
    }
  };

  const handlePrevMedia = () => {
    if (hasMultipleMedia) {
      setMediaIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);
    }
  };

  return (
    <Link to={`/diamond/${diamond.id}`} className="block">
      <Card className={`group card-interactive overflow-hidden bg-gray-800 border-gray-700 diamond-card ${className}`}>
        <div className="relative">
          {/* Media Container */}
          <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 relative overflow-hidden">
            {/* Show video if available and selected */}
            {showVideo && diamond.primaryVideo ? (
              <VideoPlayer
                src={diamond.primaryVideo}
                poster={diamond.primaryImage}
                className="w-full h-full"
                autoPlay={false}
                muted={true}
                loop={false}
                controls={true}
              />
            ) : (
              /* Show image */
              <img
                src={diamond.primaryImage}
                alt={`${diamond.shape} diamond`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 interactive-hover"
                onLoad={() => {
                  console.log('✅ Image loaded successfully:', diamond.primaryImage?.substring(0, 50) + '...');
                }}
                onError={(e) => {
                  console.error('❌ Image failed to load:', diamond.primaryImage);
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            )}
            
            {/* Video indicator */}
            {hasVideos && (
              <div className="absolute top-2 left-2 z-10">
                <Badge 
                  className="bg-black bg-opacity-50 text-white cursor-pointer hover:bg-opacity-70 transition-all"
                  onClick={(e) => {
                    e.preventDefault();
                    handleMediaToggle();
                  }}
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                  Video
                </Badge>
              </div>
            )}
            
            {/* Bestseller badge */}
            {diamond.bestseller && (
              <Badge className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900">
                Bestseller
              </Badge>
            )}
            
            {/* Shape badge */}
            <Badge 
              className={`absolute top-2 ${hasVideos ? 'right-16' : 'right-2'} ${getShapeColor(diamond.shape)} text-white`}
            >
              {diamond.shape}
            </Badge>

            {/* Media navigation arrows */}
            {hasMultipleMedia && (
              <>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handlePrevMedia();
                  }}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all z-10"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleNextMedia();
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all z-10"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </>
            )}

            {/* Media indicator dots */}
            {hasMultipleMedia && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {allMedia.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === mediaIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Title and Category */}
          <div>
            <h3 className="font-semibold text-lg line-clamp-1 text-gray-50">
              {diamond.shape} Diamond
            </h3>
            <p className="text-sm text-gray-300">
              {diamond.category}
            </p>
          </div>

          {/* 4C's Information */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-400">Carat:</span>
              <span className="font-medium ml-1 text-gray-50">{diamond.carat}ct</span>
            </div>
            <div>
              <span className="text-gray-400">Color:</span>
              <Badge 
                variant="secondary" 
                className={`ml-1 text-xs ${getColorClass(diamond.color)}`}
              >
                {diamond.color}
              </Badge>
            </div>
            <div>
              <span className="text-gray-400">Clarity:</span>
              <Badge 
                variant="secondary" 
                className={`ml-1 text-xs ${getClarityColor(diamond.clarity)}`}
              >
                {diamond.clarity}
              </Badge>
            </div>
            <div>
              <span className="text-gray-400">Cut:</span>
              <span className="font-medium ml-1 text-gray-50">{diamond.cut}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-300 line-clamp-2">
            {diamond.description}
          </p>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <div className="w-full">
            {/* Price */}
            {diamond.price && (
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-gray-50">
                  {formatPrice(diamond.price)}
                </span>
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-50 hover:bg-gray-700 hover:text-gray-50">
                  View Details
                </Button>
              </div>
            )}
            
            {/* Management status if available */}
            {diamond.management && (
              <div className="flex items-center justify-between text-xs">
                <Badge 
                  variant={diamond.management.status === 'active' ? 'default' : 'secondary'}
                  className={`text-xs ${
                    diamond.management.status === 'active' 
                      ? 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-950' 
                      : 'bg-gray-700 text-gray-50'
                  }`}
                >
                  {diamond.management.status}
                </Badge>
                {diamond.management.priority && (
                  <Badge 
                    variant={
                      diamond.management.priority === 'urgent' ? 'destructive' :
                      diamond.management.priority === 'high' ? 'default' :
                      diamond.management.priority === 'medium' ? 'secondary' : 'outline'
                    }
                    className={`text-xs ${
                      diamond.management.priority === 'urgent' ? 'bg-red-500 text-white' :
                      diamond.management.priority === 'high' ? 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-950' :
                      diamond.management.priority === 'medium' ? 'bg-gray-700 text-gray-50' :
                      'border-gray-600 text-gray-50'
                    }`}
                  >
                    {diamond.management.priority}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}; 
import React from 'react';
import { Sparkles } from 'lucide-react';

interface LoadingOverlayProps {
  message?: string;
  isLoading?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  message = "Loading...",
  isLoading = false
}) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <div className="relative">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-progress-bar"></div>
        </div>
        
        {/* Main Loading Content */}
        <div className="flex flex-col items-center space-y-6 p-8">
          {/* Spinning Diamond Icon */}
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center animate-spin-slow">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            
            {/* Outer Ring */}
            <div className="absolute inset-0 border-2 border-gray-600 rounded-lg animate-pulse"></div>
            
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-lg animate-shimmer"></div>
          </div>
          
          {/* Loading Text */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-white font-playfair">
              {message}
            </h3>
            <p className="text-gray-400 text-sm font-montserrat">
              Please wait while we prepare your experience
            </p>
          </div>
          
          {/* Animated Dots */}
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay; 
import React, { useState, useRef, useEffect } from 'react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  width?: string | number;
  height?: string | number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  className = '',
  autoPlay = false,
  muted = true,
  loop = false,
  controls = true,
  width = '100%',
  height = 'auto'
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isGoogleDrive, setIsGoogleDrive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check if the video source is from Google Drive
  useEffect(() => {
    const isGoogleDriveUrl = src.includes('drive.google.com') || src.includes('docs.google.com');
    setIsGoogleDrive(isGoogleDriveUrl);
    
    if (isGoogleDriveUrl) {
      console.log('🎥 Detected Google Drive video:', src);
    }
  }, [src]);

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    console.error('Video failed to load:', src);
  };

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error('Failed to play video:', error);
      });
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  // Convert Google Drive URL to direct video URL if needed
  const getVideoUrl = () => {
    if (!src) return '';
    
    // If it's already a direct Google Drive video URL, return as is
    if (src.includes('drive.google.com/uc?export=view')) {
      return src;
    }
    
    // If it's a Google Drive file ID, convert to direct URL
    if (src.includes('drive.google.com/file/d/')) {
      const fileId = src.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)?.[1];
      if (fileId) {
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
      }
    }
    
    // If it's just a file ID, convert to direct URL
    if (/^[a-zA-Z0-9-_]+$/.test(src)) {
      return `https://drive.google.com/uc?export=view&id=${src}`;
    }
    
    return src;
  };

  if (hasError) {
    return (
      <div className={`video-error ${className}`} style={{ width, height }}>
        <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="text-gray-500 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">
              {isGoogleDrive ? 'Google Drive video unavailable' : 'Video unavailable'}
            </p>
            {isGoogleDrive && (
              <p className="text-xs text-gray-400 mt-1">
                Check file permissions or try refreshing
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  const videoUrl = getVideoUrl();

  return (
    <div className={`video-player relative ${className}`} style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">
              {isGoogleDrive ? 'Loading Google Drive video...' : 'Loading video...'}
            </p>
          </div>
        </div>
      )}
      
      {/* Google Drive indicator */}
      {isGoogleDrive && !isLoading && (
        <div className="absolute top-2 left-2 z-10">
          <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Google Drive
          </div>
        </div>
      )}
      
      <video
        ref={videoRef}
        src={videoUrl}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={controls}
        className="w-full h-full object-cover rounded-lg"
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onError={handleError}
        onPlay={handlePlay}
        onPause={handlePause}
        playsInline
        preload="metadata"
        crossOrigin="anonymous"
      >
        <source src={videoUrl} type="video/mp4" />
        <source src={videoUrl} type="video/webm" />
        <source src={videoUrl} type="video/ogg" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer; 
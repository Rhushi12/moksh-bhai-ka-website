import React from 'react';

interface SkeletonProps {
  className?: string;
  lines?: number;
  height?: string;
  width?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  lines = 1, 
  height = 'h-4', 
  width = 'w-full' 
}) => {
  if (lines === 1) {
    return (
      <div className={`animate-pulse bg-gray-700 rounded ${height} ${width} ${className}`} />
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div 
          key={index} 
          className={`animate-pulse bg-gray-700 rounded ${height} ${width}`}
          style={{ animationDelay: `${index * 0.1}s` }}
        />
      ))}
    </div>
  );
};

interface CardSkeletonProps {
  className?: string;
  showImage?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  showActions?: boolean;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  className = '',
  showImage = true,
  showTitle = true,
  showDescription = true,
  showActions = true,
}) => {
  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-lg p-6 ${className}`}>
      {showImage && (
        <div className="animate-pulse bg-gray-700 rounded-lg h-48 mb-4" />
      )}
      
      <div className="space-y-3">
        {showTitle && (
          <div className="animate-pulse bg-gray-700 rounded h-6 w-3/4" />
        )}
        
        {showDescription && (
          <div className="space-y-2">
            <div className="animate-pulse bg-gray-700 rounded h-4 w-full" />
            <div className="animate-pulse bg-gray-700 rounded h-4 w-2/3" />
          </div>
        )}
        
        {showActions && (
          <div className="flex space-x-2 pt-4">
            <div className="animate-pulse bg-gray-700 rounded h-10 w-20" />
            <div className="animate-pulse bg-gray-700 rounded h-10 w-20" />
          </div>
        )}
      </div>
    </div>
  );
};

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  className = '',
}) => {
  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gray-700 px-6 py-4 border-b border-gray-700">
        <div className="flex space-x-4">
          {Array.from({ length: columns }).map((_, index) => (
            <div 
              key={index} 
              className="animate-pulse bg-gray-700 rounded h-4 flex-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      <div className="divide-y divide-gray-700">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4">
            <div className="flex space-x-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div 
                  key={colIndex} 
                  className="animate-pulse bg-gray-700 rounded h-4 flex-1"
                  style={{ animationDelay: `${(rowIndex + colIndex) * 0.05}s` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface GallerySkeletonProps {
  items?: number;
  className?: string;
}

export const GallerySkeleton: React.FC<GallerySkeletonProps> = ({
  items = 6,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <CardSkeleton 
          key={index} 
          className="h-80"
          showImage={true}
          showTitle={true}
          showDescription={true}
          showActions={false}
        />
      ))}
    </div>
  );
};

interface FormSkeletonProps {
  fields?: number;
  className?: string;
}

export const FormSkeleton: React.FC<FormSkeletonProps> = ({
  fields = 4,
  className = '',
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="space-y-2">
          <div className="animate-pulse bg-gray-700 rounded h-4 w-24" />
          <div className="animate-pulse bg-gray-700 rounded h-12 w-full" />
        </div>
      ))}
      
      <div className="flex space-x-4 pt-4">
        <div className="animate-pulse bg-gray-700 rounded h-12 w-24" />
        <div className="animate-pulse bg-gray-700 rounded h-12 w-24" />
      </div>
    </div>
  );
};

interface ModalSkeletonProps {
  className?: string;
}

export const ModalSkeleton: React.FC<ModalSkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`bg-gray-900 border border-gray-700 rounded-lg max-w-2xl w-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-700">
        <div className="space-y-2">
          <div className="animate-pulse bg-gray-700 rounded h-6 w-48" />
          <div className="animate-pulse bg-gray-700 rounded h-4 w-32" />
        </div>
        <div className="animate-pulse bg-gray-700 rounded h-8 w-8" />
      </div>
      
      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="animate-pulse bg-gray-700 rounded h-4 w-full" />
        <div className="animate-pulse bg-gray-700 rounded h-4 w-3/4" />
        <div className="animate-pulse bg-gray-700 rounded h-4 w-1/2" />
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-700">
        <div className="animate-pulse bg-gray-700 rounded h-10 w-20" />
        <div className="animate-pulse bg-gray-700 rounded h-10 w-24" />
      </div>
    </div>
  );
}; 
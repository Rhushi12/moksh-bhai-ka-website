import React from 'react';
import { AlertTriangle, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface OfflineStatusProps {
  isOffline: boolean;
  error: string | null;
  lastUpdated: Date | null;
  retryConnection: () => void;
  isLoading: boolean;
}

export const OfflineStatus: React.FC<OfflineStatusProps> = ({
  isOffline,
  error,
  lastUpdated,
  retryConnection,
  isLoading
}) => {
  if (!isOffline && !error) {
    return null;
  }

  return (
    <div className="fixed top-20 left-4 right-4 z-50 md:left-6 md:right-6 lg:left-8 lg:right-8">
      <Alert className={`border-l-4 ${
        isOffline 
          ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20' 
          : 'border-red-500 bg-red-50 dark:bg-red-950/20'
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            {isOffline ? (
              <WifiOff className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
            )}
            <div className="flex-1">
              <AlertTitle className="text-sm font-semibold">
                {isOffline ? 'Offline Mode' : 'Connection Error'}
              </AlertTitle>
              <AlertDescription className="text-sm mt-1">
                {error || 'Unable to connect to Firebase. Using offline data.'}
                {lastUpdated && (
                  <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Last updated: {lastUpdated.toLocaleString()}
                  </span>
                )}
              </AlertDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={retryConnection}
            disabled={isLoading}
            className="ml-4 flex-shrink-0"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Wifi className="h-4 w-4" />
            )}
            <span className="ml-2 hidden sm:inline">
              {isLoading ? 'Connecting...' : 'Retry'}
            </span>
          </Button>
        </div>
      </Alert>
    </div>
  );
};









import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { FloatingShowcase } from '@/components/FloatingShowcase';
import { DescriptionSection } from '@/components/DescriptionSection';
import { DiamondCategories } from '@/components/DiamondCategories';
import { NewFooter } from '@/components/NewFooter';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { useAuth } from '@/contexts/AuthContext';
import { useFirebase } from '@/contexts/FirebaseContext';
import React from 'react';
import { Button } from '@/components/ui/button';

const Index = () => {
  console.log('🏠 Index: Component rendering');
  
  const navigate = useNavigate();
  
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Get authentication state from context - this will update the header greeting automatically
  const { user } = useAuth();
  
  // Get Firebase diamonds data
  const { diamonds: firebaseDiamonds, isLoading, error: firebaseError } = useFirebase();
  console.log('🏠 Index: Firebase diamonds:', firebaseDiamonds?.length || 0, 'Loading:', isLoading);

  // Safety check for firebaseDiamonds
  const safeDiamonds = React.useMemo(() => {
    if (!firebaseDiamonds || !Array.isArray(firebaseDiamonds)) {
      console.warn('⚠️ firebaseDiamonds is not an array:', firebaseDiamonds);
      return [];
    }
    return firebaseDiamonds;
  }, [firebaseDiamonds]);

  // Add smooth scrolling behavior
  useEffect(() => {
    console.log('🏠 Index: Setting up smooth scrolling');
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      console.log('🏠 Index: Cleaning up smooth scrolling');
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  // Error boundary - if there's an error, show error page
  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-950">
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

  // Error state from Firebase
  if (firebaseError) {
    return (
      <div className="min-h-screen bg-gray-950">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💎</div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-50">Error Loading Data</h2>
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

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="pt-20">
        {/* Floating Showcase - Top of page */}
        <FloatingShowcase diamonds={safeDiamonds} />

        {/* Description Section - 5 lines with empty block */}
        <DescriptionSection />

        {/* Diamond Categories - Natural, CVD, Antique, etc. */}
        <DiamondCategories />
      </main>

      {/* New Footer with Owner Details, Promotion, FAQ, Social Media */}
      <NewFooter />

      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
};

export default Index;

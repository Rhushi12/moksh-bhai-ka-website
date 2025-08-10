import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { DiamondShowcase } from '@/components/DiamondShowcase';
import { DiamondShapeSelector } from '@/components/DiamondShapeSelector';
import { StatsSection } from '@/components/StatsSection';
import { TrustSignalsSection } from '@/components/TrustSignalsSection';
import { FeaturedCollections } from '@/components/FeaturedCollections';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { useAuth } from '@/contexts/AuthContext';
import { useFilter } from '@/contexts/FilterContext';
import { useFirebase } from '@/contexts/FirebaseContext';
import React from 'react';
import { Button } from '@/components/ui/button';

const Index = () => {
  console.log('🏠 Index: Component rendering');
  
  const navigate = useNavigate();
  const { state } = useFilter();
  
  // Filter states for diamond categories and shapes
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
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

  // Filter Firebase diamonds based on current filters
  const filteredDiamonds = React.useMemo(() => {
    try {
      return safeDiamonds.filter(diamond => {
        const categoryMatch = !selectedCategory || diamond.category === selectedCategory;
        const shapeMatch = !selectedShape || diamond.shape === selectedShape;
        return categoryMatch && shapeMatch;
      });
    } catch (error) {
      console.error('❌ Error filtering diamonds:', error);
      setHasError(true);
      setErrorMessage('Error filtering diamonds');
      return [];
    }
  }, [safeDiamonds, selectedCategory, selectedShape]);

  // Debug logging for filtering
  useEffect(() => {
    console.log('🔍 Filter Debug:', {
      selectedCategory,
      selectedShape,
      totalFirebaseDiamonds: safeDiamonds.length,
      filteredDiamondsCount: filteredDiamonds.length,
      filteredDiamonds: filteredDiamonds.map(d => ({ id: d.id, shape: d.shape, name: d.description?.substring(0, 30) }))
    });
  }, [selectedCategory, selectedShape, filteredDiamonds, safeDiamonds.length]);

  const handleCategorySelect = (category: string | null) => {
    console.log('🏷️ Category selected:', category);
    setSelectedCategory(category);
  };

  const handleShapeSelect = (shape: string | null) => {
    console.log('💎 Shape selected:', shape);
    setSelectedShape(shape);
  };

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
      <Header
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
      />

      {/* Main Content */}
      <main className="pt-20">
        {/* Diamond Showcase */}
        <DiamondShowcase diamonds={filteredDiamonds} />

        {/* Statistics Section */}
        <StatsSection 
          totalDiamonds={safeDiamonds.length}
          portfolioValue={safeDiamonds.reduce((total, diamond) => total + (diamond.price_per_carat * diamond.carat), 0)}
        />

        {/* Featured Collections */}
        <FeaturedCollections diamonds={safeDiamonds} />

        {/* Diamond Shape Selector */}
        <DiamondShapeSelector
          selectedShape={selectedShape}
          onShapeSelect={handleShapeSelect}
        />

        {/* Trust Signals Section */}
        <TrustSignalsSection />
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-gray-950 border-t border-gray-800 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-playfair text-gray-50 mb-4">Elite Diamond Portfolio</h3>
              <p className="text-gray-300 font-montserrat text-sm leading-relaxed">
                Curating exceptional diamonds for discerning collectors and investors worldwide. 
                15+ years of expertise in diamond sourcing and portfolio management.
              </p>
              <div className="flex space-x-4 text-sm text-gray-400">
                <span className="px-2 py-1 bg-gray-800 rounded">GIA Certified</span>
                <span className="px-2 py-1 bg-gray-800 rounded">Insured</span>
                <span className="px-2 py-1 bg-gray-800 rounded">Verified</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-playfair text-gray-50">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <a href="/gallery" className="block text-gray-400 hover:text-gray-200 transition-colors font-montserrat">
                  Diamond Gallery
                </a>
                <a href="/contact" className="block text-gray-400 hover:text-gray-200 transition-colors font-montserrat">
                  Expert Consultation
                </a>
                <a href="#" className="block text-gray-400 hover:text-gray-200 transition-colors font-montserrat">
                  Investment Guide
                </a>
                <a href="#" className="block text-gray-400 hover:text-gray-200 transition-colors font-montserrat">
                  Certification Process
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-playfair text-gray-50">Contact Us</h4>
              <div className="space-y-2 text-sm text-gray-400 font-montserrat">
                <p>Email: info@elitediamonds.com</p>
                <p>Phone: +1 (555) 123-4567</p>
                <p>Hours: Mon-Fri 9AM-6PM EST</p>
                <p className="text-xs text-gray-500 mt-2">
                  Response time: Within 24 hours
                </p>
              </div>
            </div>

            {/* Trust & Security */}
            <div className="space-y-4">
              <h4 className="text-lg font-playfair text-gray-50">Security & Trust</h4>
              <div className="space-y-2 text-sm text-gray-400 font-montserrat">
                <p>✓ 256-bit SSL Encryption</p>
                <p>✓ Fully Insured Shipping</p>
                <p>✓ 30-Day Money Back</p>
                <p>✓ Expert Authentication</p>
              </div>
              <div className="flex space-x-2 pt-2">
                <div className="w-8 h-6 bg-gray-700 rounded text-xs flex items-center justify-center text-gray-300">SSL</div>
                <div className="w-8 h-6 bg-gray-700 rounded text-xs flex items-center justify-center text-gray-300">GIA</div>
                <div className="w-8 h-6 bg-gray-700 rounded text-xs flex items-center justify-center text-gray-300">IGI</div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 font-montserrat text-sm">
                &copy; 2024 Elite Diamond Portfolio. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-gray-200 transition-colors font-montserrat">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-200 transition-colors font-montserrat">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-200 transition-colors font-montserrat">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
};

export default Index;

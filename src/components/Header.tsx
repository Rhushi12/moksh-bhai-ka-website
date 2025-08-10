import { useState, useEffect } from 'react';
import { Menu, X, LogOut, MessageSquare, Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ShinyText from './ShinyText';
import './ShinyText.css';

interface HeaderProps {
  onCategorySelect: (category: string | null) => void;
  selectedCategory: string | null;
  showHomeButton?: boolean;
  title?: string;
}

const categories = [
  'Rough Diamonds',
  'Polished Diamonds', 
  'Colored Diamonds',
  'Certified Diamonds',
  'Investment Diamonds'
];

export const Header = ({ onCategorySelect, selectedCategory, showHomeButton = false, title }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  // Get authentication state and functions from the auth context
  // This allows the header to display dynamic user information and handle logout
  const { user, logout, getUserName } = useAuth();

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Handle sticky scroll behavior
  useEffect(() => {
    let ticking = false;

    const updateScrollState = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleCategoryClick = (category: string) => {
    const newCategory = selectedCategory === category ? null : category;
    onCategorySelect(newCategory);
    setIsMenuOpen(false);
    
    // Scroll to showcase
    const showcase = document.getElementById('diamond-showcase');
    if (showcase) {
      showcase.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleContactClick = () => {
    window.location.href = '/contact';
    setIsMenuOpen(false);
  };

  /**
   * Handle logout - resets user to guest state
   */
  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsMenuOpen(false);
    }
  };

  const handleHomeClick = () => {
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleSearchClick = () => {
    navigate('/gallery');
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-950 to-gray-900 border-b border-gray-800 shadow-xl transition-all duration-300 ease-out ${
        isScrolled ? 'bg-gray-950/95 backdrop-blur-sm' : ''
      }`}>
        <div className={`container mx-auto px-4 md:px-6 transition-all duration-300 ${
          isScrolled ? 'py-2' : 'py-3 md:py-4'
        }`}>
          <div className="flex items-center justify-between">
            {/* Left - Logo */}
            <div className="flex-shrink-0 mr-4">
              <button
                onClick={handleHomeClick}
                className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                aria-label="Go to home"
              >
                <div 
                  className="font-bold text-2xl font-playfair"
                  style={{
                    background: 'linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.9) 50%, rgba(255, 255, 255, 0) 60%)',
                    backgroundSize: '200% 100%',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    color: 'white',
                    animation: 'shine 3s linear infinite'
                  }}
                >
                  M
                </div>
              </button>
            </div>

            {/* Left - User Greeting */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col">
                <ShinyText 
                  text={title || `Welcome, ${getUserName()}`}
                  disabled={false}
                  speed={4}
                  className="font-playfair text-base md:text-lg truncate"
                />
                {/* Show verification status for authenticated users */}
                {user.isAuthenticated && user.verifiedAt && (
                  <span className="text-xs text-gray-400 font-montserrat truncate">
                    Verified {user.verifiedAt.toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            {/* Center - Site Title */}
            <div className="flex-1 text-center px-2">
              <ShinyText 
                text="Moksh P Mehta"
                disabled={false}
                speed={4}
                className="text-lg md:text-2xl lg:text-3xl font-playfair tracking-wide truncate"
              />
            </div>

            {/* Right - Search, Menu Toggle and Home Button */}
            <div className="flex-1 flex justify-end items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSearchClick}
                className="text-gray-100 hover:text-white hover:bg-gray-800 p-2 md:p-3 rounded-lg interactive-hover interactive-click"
                aria-label="Search diamonds"
              >
                <Search className="w-5 h-5 md:w-6 md:h-6" />
              </Button>
              {showHomeButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleHomeClick}
                  className="text-gray-100 hover:text-white hover:bg-gray-800 p-2 md:p-3 rounded-lg interactive-hover interactive-click"
                  aria-label="Go to home"
                >
                  <Home className="w-5 h-5 md:w-6 md:h-6" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-100 hover:text-white hover:bg-gray-800 p-2 md:p-3 rounded-lg interactive-hover interactive-click"
                aria-label="Toggle menu"
              >
                <Menu className="w-5 h-5 md:w-6 md:h-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Backdrop - Translucent overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}

      {/* Sliding Sidebar Panel */}
      <div 
        className={`
          fixed top-0 right-0 h-full z-50 bg-gradient-to-b from-gray-950 to-gray-900 border-l border-gray-800 shadow-2xl
          w-[90%] md:w-[70%] max-w-md
          transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Panel Header with Close Button */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-700">
          <h2 className="text-lg md:text-xl font-playfair text-gray-100">Menu</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-100 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-all duration-200"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </Button>
        </div>

        {/* Panel Content */}
        <div className="p-4 md:p-6 overflow-y-auto h-full">
          <div className="space-y-4">
            {/* Categories Section */}
            <div>
              <div className="text-sm text-gray-400 font-montserrat mb-3 font-medium">Categories</div>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`
                      w-full text-left py-3 px-4 rounded-lg transition-all duration-200 font-montserrat text-base
                      ${selectedCategory === category 
                        ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-950 shadow-lg' 
                        : 'text-gray-200 hover:text-gray-50 hover:bg-gray-800'
                      }
                    `}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Divider */}
            <div className="border-t border-gray-700 pt-4">
              <div className="space-y-2">
                {showHomeButton && (
                  <button
                    onClick={handleHomeClick}
                    className="w-full text-left py-3 px-4 rounded-lg transition-all duration-200 font-montserrat text-gray-200 hover:text-gray-50 hover:bg-gray-800 flex items-center gap-3 text-base"
                  >
                    <Home className="w-4 h-4" />
                    Home
                  </button>
                )}
                <button
                  onClick={handleSearchClick}
                  className="w-full text-left py-3 px-4 rounded-lg transition-all duration-200 font-montserrat text-gray-200 hover:text-gray-50 hover:bg-gray-800 flex items-center gap-3 text-base"
                >
                  <Search className="w-4 h-4" />
                  Search Diamonds
                </button>
                <button
                  onClick={handleContactClick}
                  className="w-full text-left py-3 px-4 rounded-lg transition-all duration-200 font-montserrat text-gray-200 hover:text-gray-50 hover:bg-gray-800 text-base"
                >
                  Contact
                </button>
                    
                    {/* Show logout button only if user is authenticated */}
                    {user.isAuthenticated && (
                      <button
                        onClick={handleLogout}
                        className="w-full text-left py-3 px-4 rounded-lg transition-all duration-200 font-montserrat text-gray-200 hover:text-gray-50 hover:bg-gray-800 flex items-center gap-3 text-base"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    )}
                  </div>
                </div>

            {/* Clear Filter Option */}
            {selectedCategory && (
              <div className="pt-3">
                <button
                  onClick={() => onCategorySelect(null)}
                  className="text-sm text-gray-400 hover:text-gray-200 underline font-montserrat"
                >
                  Clear category filter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
import { useState, useEffect } from 'react';
import { Menu, X, LogOut, MessageSquare, Home, Search, Gem, Sparkles, Crown, Star, Zap, Clock, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useFirebase } from '@/contexts/FirebaseContext';
import { useNavigate } from 'react-router-dom';
import ShinyText from './ShinyText';
import './ShinyText.css';
import { Category } from '@/lib/categoryServices';

interface HeaderProps {
  showHomeButton?: boolean;
  title?: string;
}

// Custom Diamond Icon Component
const CustomDiamondIcon: React.FC<{ size?: number | string; className?: string }> = ({ size = 24, className = "" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="square"
      strokeLinejoin="miter"
      role="img"
      aria-label="Diamond"
      className={className}
    >
      <path d="M7 2h10l5 6-10 14L2 8 7 2z" />
      <path d="M2 8h20" />
      <path d="M2 8h20" />
      <path d="M7 2l5 6 5-6" />
      <path d="M2 8l10 14 10-14" />
      <path d="M12 8v14" />
    </svg>
  );
};

// CVD Lab-Grown Diamond Icon
const CVDLabDiamondIcon: React.FC<{ size?: number | string; className?: string }> = ({ size = 24, className = "" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Lab-grown diamond with circuit nodes"
      className={className}
    >
      <path d="M12 3L21 12L12 21L3 12Z"/>
      <path d="M12 3L8 12L12 21M12 3L16 12"/>
      <circle cx="4" cy="12" r="1"/>
      <circle cx="20" cy="12" r="1"/>
      <circle cx="12" cy="22" r="1"/>
      <path d="M4 12h3M20 12h-3M12 22v-2"/>
    </svg>
  );
};

// Antique Diamond Icon
const AntiqueDiamondIcon: React.FC<{ size?: number | string; className?: string }> = ({ size = 24, className = "" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Antique diamond with crown"
      className={className}
    >
      <path d="M6 6.5l2 2 2-3 2 3 2-2 2 2v1H6v-1z"/>
      <circle cx="8" cy="6" r=".6"/>
      <circle cx="12" cy="5" r=".6"/>
      <circle cx="16" cy="6" r=".6"/>
      <path d="M12 8L19 13L12 21L5 13z"/>
      <path d="M12 8L8 13L12 21M12 8L16 13"/>
    </svg>
  );
};

// Antique Cutout Diamond Icon
const AntiqueCutoutDiamondIcon: React.FC<{ size?: number | string; className?: string }> = ({ size = 24, className = "" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Diamond with scissors for cutting"
      className={className}
    >
      <path d="M12 3L21 12L12 21L3 12Z"/>
      <path d="M12 3L8 12L12 21M12 3L16 12"/>
      <path d="M6 6l3 3M18 6l-3 3"/>
      <path d="M6 18l3-3M18 18l-3-3"/>
    </svg>
  );
};

// Icon mapping for category icons
const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    'gem': Gem,
    'sparkles': Sparkles,
    'clock': Clock,
    'scissors': Scissors,
    'star': Star,
    'crown': Crown,
    'zap': Zap,
    'custom-diamond': CustomDiamondIcon,
    'lab-diamond': CVDLabDiamondIcon,        // New CVD icon
    'vintage-diamond': AntiqueDiamondIcon,   // New Antique icon
    'cutout-diamond': AntiqueCutoutDiamondIcon // New Cutout icon
  };
  
  return iconMap[iconName] || Gem;
};

// Local categories for fallback (not used anymore)
// const localCategories = [
//   'Natural Diamonds',
//   'CVD Diamonds',
//   'Antique Diamonds',
//   'Antique Cutout',
//   'Investment Diamonds'
// ];

export const Header = ({ showHomeButton = false, title }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  // Get authentication state and functions from the auth context
  // This allows the header to display dynamic user information and handle logout
  const { user, logout, getUserName } = useAuth();
  // Get categories from Firebase context
  const { categories } = useFirebase();

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

  const handleContactClick = () => {
    window.location.href = '/contact';
    setIsMenuOpen(false);
  };

  const handleHomeClick = () => {
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleSearchClick = () => {
    navigate('/gallery');
    setIsMenuOpen(false);
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category.displayLabel);
    navigate(`/gallery?category=${category.value}`);
    setIsMenuOpen(false);
  };

  const handleBackdropClick = () => {
    setIsMenuOpen(false);
  };

  /**
   * Handle logout - resets user to guest state
   */
  const handleLogout = () => {
    logout();
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
                text={selectedCategory || "Moksh P Mehta"}
                disabled={false}
                speed={4}
                className="text-lg md:text-2xl lg:text-3xl font-playfair tracking-wide truncate"
              />
            </div>

            {/* Right - Diamond Categories, Search, Menu Toggle and Home Button */}
            <div className="flex-1 flex justify-end items-center space-x-2">
              {/* Diamond Category Logos */}
              <div className="hidden md:flex items-center space-x-2 mr-4">
                {categories && categories.length > 0 ? categories.map((category) => {
                  const IconComponent = getIconComponent(category.icon);
                  return (
                    <Button
                      key={String(category.id)}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCategoryClick(category)}
                      className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-110 group ${
                        selectedCategory === category.displayLabel 
                          ? 'text-white shadow-lg' 
                          : 'text-gray-300 hover:text-white hover:bg-gray-800'
                      }`}
                      style={{
                        backgroundColor: selectedCategory === category.displayLabel ? category.color : 'transparent'
                      }}
                      aria-label={`View ${category.displayLabel}`}
                    >
                      <div className="relative">
                        <IconComponent className="w-5 h-5" />
                        {/* Hover effect */}
                        <div 
                          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"
                          style={{ backgroundColor: category.color }}
                        ></div>
                      </div>
                    </Button>
                  );
                }) : null}
              </div>
              
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
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsMenuOpen(false);
            }
          }}
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
            {/* Diamond Categories Section */}
            <div>
              <div className="text-sm text-gray-400 font-montserrat mb-3 font-medium">Diamond Categories</div>
              <div className="space-y-2">
                {categories && categories.length > 0 ? categories.map((category) => {
                  const IconComponent = getIconComponent(category.icon);
                  return (
                    <button
                      key={String(category.id)}
                      onClick={() => handleCategoryClick(category)}
                      className={`
                        w-full text-left py-3 px-4 rounded-lg transition-all duration-200 font-montserrat text-base flex items-center gap-3
                        ${selectedCategory === category.displayLabel
                          ? 'text-white shadow-lg' 
                          : 'text-gray-200 hover:text-gray-50 hover:bg-gray-800'
                        }
                      `}
                      style={{
                        backgroundColor: selectedCategory === category.displayLabel ? category.color : 'transparent'
                      }}
                    >
                      <IconComponent className="w-4 h-4" />
                      {category.displayLabel}
                    </button>
                  );
                }) : null}
              </div>
            </div>
            
            {/* Legacy Categories Section - Removed since we're using Firebase categories */}
            {/* <div>
              <div className="text-sm text-gray-400 font-montserrat mb-3 font-medium">Other Categories</div>
              <div className="space-y-2">
                {localCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {}} // Removed interactive category selection
                    className={`
                      w-full text-left py-3 px-4 rounded-lg transition-all duration-200 font-montserrat text-base
                      ${false // Removed selectedCategory logic
                        ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-950 shadow-lg' 
                        : 'text-gray-200 hover:text-gray-50 hover:bg-gray-800'
                      }
                    `}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div> */}
            
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
            {false && ( // Removed selectedCategory logic
              <div className="pt-3">
                <button
                  onClick={() => {}} // Removed onCategorySelect(null)
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
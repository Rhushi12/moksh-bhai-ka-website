import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";
import PhoneInputDemo from "./components/PhoneInputDemo";
import { FilteredGalleryPage } from "./pages/FilteredGalleryPage";
import { DiamondDetailPage } from "./pages/DiamondDetailPage";
import Management from "./pages/Management";
import { AuthProvider } from "./contexts/AuthContext";
import { FirebaseProvider, useFirebase } from "./contexts/FirebaseContext";
import { FilterProvider } from "./contexts/FilterContext";
import { LenisProvider, useLenis } from "./contexts/LenisContext";
import ErrorBoundary from "./components/ErrorBoundary";
import { CustomCursor } from "./components/CustomCursor";
import LoadingOverlay from "./components/LoadingOverlay";
import { OfflineStatus } from "./components/OfflineStatus";
import { useState, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import { useFilter } from "./contexts/FilterContext";
import { OTPModal } from "./components/OTPModal";
// import { OnboardingFilterModal } from "./components/OnboardingFilterModal"; // Disabled

const queryClient = new QueryClient();

// Component to manage modal state and conditional rendering
const AppContent = () => {
  try {
    const { user, hasCompletedAuth, isLoading: authLoading } = useAuth();
    const { state, isLoading: filterLoading } = useFilter();
    const { diamonds, isLoading: firebaseLoading, error, isOffline, lastUpdated, retryConnection } = useFirebase();
    const { setIsModalOpen } = useLenis();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Check if all contexts are loaded
    const isLoading = authLoading || filterLoading || firebaseLoading;
    
    // Debug logging
    console.log('🔐 AppContent: Auth state:', {
      user: user?.name || 'Guest',
      isAuthenticated: user?.isAuthenticated || false,
      hasSkippedLogin: user?.hasSkippedLogin || false,
      hasCompletedAuth: hasCompletedAuth ? hasCompletedAuth() : false,
      isHomePage: location.pathname === '/',
      authLoading,
      filterLoading,
      firebaseLoading,
      isLoading,
      diamondsCount: diamonds?.length || 0,
      isOffline,
      error
    });
    
    // Modal states - only show if user hasn't completed auth and Firebase has loaded
    const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    
    // Only show modals on the home page (Index)
    const isHomePage = location.pathname === '/';
    const shouldShowOTPModal = isHomePage && !isLoading && !hasCompletedAuth?.() && isOTPModalOpen;
    const shouldShowOnboardingModal = false; // Disabled onboarding modal
    const shouldShowModals = shouldShowOTPModal || shouldShowOnboardingModal;
    
    // Debug logging for modal state
    console.log('🎭 Modal state:', {
      isHomePage,
      isLoading,
      hasCompletedAuth: hasCompletedAuth ? hasCompletedAuth() : false,
      isOTPModalOpen,
      showOnboarding,
      shouldShowOTPModal,
      shouldShowOnboardingModal,
      shouldShowModals
    });
    
    // Ensure OTP modal shows for new users after Firebase data is loaded
    useEffect(() => {
      if (!isLoading && isHomePage && !hasCompletedAuth?.() && !isOTPModalOpen) {
        console.log('🎭 Showing OTP modal for new user after Firebase load');
        setIsOTPModalOpen(true);
      }
    }, [isHomePage, hasCompletedAuth, isOTPModalOpen, isLoading]);

    // Reset onboarding modal state when navigating away from home page
    useEffect(() => {
      if (!isHomePage) {
        setShowOnboarding(false);
      }
    }, [isHomePage]);
    
    // Handle OTP success
    const handleOTPSuccess = (name: string) => {
      console.log('🎭 OTP Success - closing OTP modal');
      setIsOTPModalOpen(false);
      
      // Always show onboarding after successful OTP verification if first visit and not complete
      if (state?.is_first_visit && !state?.is_onboarding_complete) {
        console.log('🎭 Showing onboarding modal after successful OTP');
        setShowOnboarding(true);
      }
    };
    
    // Handle OTP close
    const handleOTPClose = (skipped?: boolean) => {
      console.log('🎭 OTP Close - skipped:', skipped);
      setIsOTPModalOpen(false);
      
      if (skipped) {
        // User skipped login, show onboarding if first visit and not complete
        if (state?.is_first_visit && !state?.is_onboarding_complete) {
          console.log('🎭 Showing onboarding modal after skipping OTP');
          setShowOnboarding(true);
        }
      }
    };
    
    // Handle onboarding close
    const handleOnboardingClose = () => {
      console.log('🎭 Onboarding Close');
      setShowOnboarding(false);
    };
    
    // Modal state management with Lenis
    useEffect(() => {
      const hasAnyModalOpen = shouldShowOTPModal || shouldShowOnboardingModal;
      
      if (hasAnyModalOpen) {
        console.log('🔒 Modal open - disabling Lenis');
        setIsModalOpen(true);
      } else {
        console.log('🔓 All modals closed - enabling Lenis');
        setIsModalOpen(false);
      }
    }, [shouldShowOTPModal, shouldShowOnboardingModal, setIsModalOpen]);
    
    // If modals should be shown, render modal layout
    if (shouldShowModals) {
      return (
        <div className="min-h-screen bg-gray-950">
          {/* OTP Modal */}
          <OTPModal
            isOpen={isOTPModalOpen}
            onSuccess={handleOTPSuccess}
            onClose={handleOTPClose}
          />

          {/* Onboarding Filter Modal - Disabled */}
        </div>
      );
    }
    
    // Otherwise, render the main application layout
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
        {/* Offline Status Component */}
        <OfflineStatus
          isOffline={isOffline}
          error={error}
          lastUpdated={lastUpdated}
          retryConnection={retryConnection}
          isLoading={firebaseLoading}
        />
        
        {/* Custom Cursor */}
        <CustomCursor />
        
        {/* Loading Overlay */}
        <LoadingOverlay isLoading={isLoading} message="Loading diamonds..." />
        
        {/* Main Content */}
        <div className={`transition-opacity duration-300 ${shouldShowModals ? 'opacity-50' : 'opacity-100'}`}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/management" element={<Management />} />
            <Route path="/gallery" element={<FilteredGalleryPage />} />
            <Route path="/diamond/:id" element={<DiamondDetailPage />} />
            <Route path="/phone-input" element={<PhoneInputDemo />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        
        {/* Modals */}
        {shouldShowOTPModal && (
          <OTPModal
            isOpen={isOTPModalOpen}
            onClose={handleOTPClose}
            onSuccess={handleOTPSuccess}
          />
        )}
        
        {/* Onboarding modal disabled */}
      </div>
    );
  } catch (error) {
    console.error('❌ Error in AppContent:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="text-gray-300 mb-4">We're working on fixing the problem.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
};

// Main App Component
function App() {
  // Enable smooth scrolling globally
  useEffect(() => {
    // Set smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      // Restore original behavior on cleanup
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <LenisProvider>
            <FirebaseProvider>
              <AuthProvider>
                <FilterProvider>
                  <AppContent />
                </FilterProvider>
              </AuthProvider>
            </FirebaseProvider>
          </LenisProvider>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

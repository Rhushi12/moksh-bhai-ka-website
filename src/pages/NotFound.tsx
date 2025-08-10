import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      console.error(
        "404 Error: User attempted to access non-existent route:",
        location.pathname
      );
    } catch (error) {
      console.error('Error logging 404:', error);
    }
  }, [location.pathname]);

  const handleGoHome = () => {
    try {
      navigate('/');
    } catch (error) {
      console.error('Error navigating home:', error);
      window.location.href = '/';
    }
  };

  const handleGoBack = () => {
    try {
      navigate(-1);
    } catch (error) {
      console.error('Error going back:', error);
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="text-center space-y-6 p-8">
        <div className="space-y-4">
          <h1 className="text-8xl md:text-9xl font-playfair text-gray-50 font-bold">404</h1>
          <h2 className="text-2xl md:text-3xl font-playfair text-gray-100 mb-2">Page Not Found</h2>
          <p className="text-lg text-gray-300 font-montserrat max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={handleGoHome}
            className="btn-primary interactive-click"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
          
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="btn-outline interactive-click"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

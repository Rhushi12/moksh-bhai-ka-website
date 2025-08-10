import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Phone, Mail, X, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const FloatingActionButton: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleContactClick = () => {
    navigate('/contact');
    setIsExpanded(false);
  };

  const handlePhoneClick = () => {
    window.location.href = 'tel:+15551234567';
    setIsExpanded(false);
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:info@elitediamonds.com';
    setIsExpanded(false);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsExpanded(false);
  };

  // Hide FAB when user scrolls to the very top
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  const actions = [
    {
      id: 'contact',
      label: 'Contact Expert',
      icon: <MessageCircle className="w-5 h-5" />,
      onClick: handleContactClick,
      className: 'bg-blue-600 hover:bg-blue-700 text-white'
    },
    {
      id: 'phone',
      label: 'Call Now',
      icon: <Phone className="w-5 h-5" />,
      onClick: handlePhoneClick,
      className: 'bg-green-600 hover:bg-green-700 text-white'
    },
    {
      id: 'email',
      label: 'Send Email',
      icon: <Mail className="w-5 h-5" />,
      onClick: handleEmailClick,
      className: 'bg-purple-600 hover:bg-purple-700 text-white'
    },
    {
      id: 'top',
      label: 'Back to Top',
      icon: <ChevronUp className="w-5 h-5" />,
      onClick: handleScrollToTop,
      className: 'bg-gray-600 hover:bg-gray-700 text-white'
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action Buttons */}
      <div className={`
        flex flex-col-reverse space-y-reverse space-y-3 mb-3 transition-all duration-300 ease-in-out
        ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
      `}>
        {actions.map((action, index) => (
          <div
            key={action.id}
            className={`
              transform transition-all duration-300 ease-in-out
              ${isExpanded 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-2 scale-95'
              }
            `}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <Button
              onClick={action.onClick}
              className={`
                ${action.className} 
                shadow-lg hover:shadow-xl transition-all duration-200 
                min-w-[140px] justify-start group relative overflow-hidden
              `}
              size="sm"
            >
              <span className="flex items-center space-x-2">
                {action.icon}
                <span className="text-sm font-medium">{action.label}</span>
              </span>
              
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Button>
          </div>
        ))}
      </div>

      {/* Main FAB Button */}
      <Button
        onClick={toggleExpanded}
        className={`
          w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300
          ${isExpanded 
            ? 'bg-red-600 hover:bg-red-700 rotate-45' 
            : 'bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500'
          }
          text-white border-2 border-gray-500 hover:border-gray-400
          flex items-center justify-center group relative overflow-hidden
        `}
        aria-label={isExpanded ? 'Close actions' : 'Quick actions'}
      >
        {isExpanded ? (
          <X className="w-6 h-6 transition-transform duration-300" />
        ) : (
          <MessageCircle className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
        )}
        
        {/* Pulse Animation for main button when closed */}
        {!isExpanded && (
          <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-30" />
        )}
        
        {/* Hover Effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Button>

      {/* Tooltip for main button */}
      {!isExpanded && (
        <div className="absolute bottom-16 right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
            Quick Contact Options
            <div className="absolute top-full right-4 border-4 border-transparent border-t-gray-900" />
          </div>
        </div>
      )}
    </div>
  );
};

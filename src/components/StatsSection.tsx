import { useState, useEffect } from 'react';
import { TrendingUp, Diamond, Users, Globe, Award, Shield } from 'lucide-react';

interface StatItem {
  id: string;
  label: string;
  value: number;
  suffix: string;
  icon: React.ReactNode;
  description: string;
}

interface StatsSectionProps {
  totalDiamonds?: number;
  portfolioValue?: number;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ 
  totalDiamonds = 0, 
  portfolioValue = 0 
}) => {
  const [animatedStats, setAnimatedStats] = useState<Record<string, number>>({});
  const [isVisible, setIsVisible] = useState(false);

  // Dynamic stats based on actual data
  const stats: StatItem[] = [
    {
      id: 'portfolio',
      label: 'Portfolio Value',
      value: portfolioValue > 0 ? portfolioValue : 2500000,
      suffix: '+',
      icon: <TrendingUp className="w-6 h-6" />,
      description: 'Total investment value'
    },
    {
      id: 'diamonds',
      label: 'Premium Diamonds',
      value: totalDiamonds > 0 ? totalDiamonds : 150,
      suffix: '+',
      icon: <Diamond className="w-6 h-6" />,
      description: 'Curated collection'
    },
    {
      id: 'experience',
      label: 'Years Experience',
      value: 15,
      suffix: '+',
      icon: <Award className="w-6 h-6" />,
      description: 'Industry expertise'
    },
    {
      id: 'clients',
      label: 'Satisfied Clients',
      value: 500,
      suffix: '+',
      icon: <Users className="w-6 h-6" />,
      description: 'Worldwide customers'
    },
    {
      id: 'countries',
      label: 'Countries Served',
      value: 25,
      suffix: '+',
      icon: <Globe className="w-6 h-6" />,
      description: 'Global reach'
    },
    {
      id: 'certification',
      label: 'Certified Diamonds',
      value: 98,
      suffix: '%',
      icon: <Shield className="w-6 h-6" />,
      description: 'GIA & IGI certified'
    }
  ];

  // Animation function for counting up numbers
  const animateValue = (finalValue: number, duration: number = 2000): Promise<void> => {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(finalValue * easedProgress);
        
        return currentValue;
      };

      const updateValue = () => {
        const currentValue = animate();
        
        if (currentValue < finalValue) {
          requestAnimationFrame(updateValue);
        } else {
          resolve();
        }
        
        return currentValue;
      };

      updateValue();
    });
  };

  // Initialize animations when component becomes visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('stats-section');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  // Animate numbers when visible
  useEffect(() => {
    if (!isVisible) return;

    const animateStats = async () => {
      // Animate each stat with staggered timing
      const animationPromises = stats.map((stat, index) => {
        return new Promise<void>((resolve) => {
          setTimeout(async () => {
            const startTime = Date.now();
            const duration = 1500 + (index * 200); // Staggered animation
            
            const animate = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easedProgress = 1 - Math.pow(1 - progress, 3);
              const currentValue = Math.floor(stat.value * easedProgress);
              
              setAnimatedStats(prev => ({
                ...prev,
                [stat.id]: currentValue
              }));
              
              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                resolve();
              }
            };
            
            animate();
          }, index * 100);
        });
      });

      await Promise.all(animationPromises);
    };

    animateStats();
  }, [isVisible, stats]);

  const formatValue = (value: number, suffix: string): string => {
    if (suffix === '+' && value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M${suffix}`;
    }
    if (suffix === '+' && value >= 1000) {
      return `${(value / 1000).toFixed(0)}K${suffix}`;
    }
    return `${value.toLocaleString()}${suffix}`;
  };

  return (
    <section 
      id="stats-section"
      className="py-12 md:py-16 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-playfair text-gray-50 mb-4">
            Trusted by Collectors Worldwide
          </h2>
          <p className="text-lg text-gray-300 font-montserrat max-w-2xl mx-auto">
            Building exceptional diamond portfolios with transparency, expertise, and uncompromising quality
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className={`
                group text-center p-4 md:p-6 rounded-xl transition-all duration-500
                bg-gray-800/30 backdrop-blur-sm border border-gray-700
                hover:bg-gray-700/50 hover:border-gray-600 hover:scale-105
                ${isVisible ? 'animate-in slide-in-from-bottom-4' : 'opacity-0'}
              `}
              style={{
                animationDelay: `${index * 100}ms`,
                animationDuration: '600ms',
                animationFillMode: 'both'
              }}
            >
              {/* Icon */}
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full text-gray-100 group-hover:from-gray-500 group-hover:to-gray-400 transition-all duration-300">
                  {stat.icon}
                </div>
              </div>

              {/* Animated Value */}
              <div className="mb-2">
                <span className="text-2xl md:text-3xl lg:text-4xl font-playfair text-gray-50 font-bold block">
                  {formatValue(animatedStats[stat.id] || 0, stat.suffix)}
                </span>
              </div>

              {/* Label */}
              <h3 className="text-sm md:text-base font-montserrat text-gray-200 font-medium mb-1">
                {stat.label}
              </h3>

              {/* Description */}
              <p className="text-xs text-gray-400 font-montserrat">
                {stat.description}
              </p>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-300 font-montserrat text-sm md:text-base mb-4">
            Join thousands of investors who trust us with their diamond portfolio
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400">
            <span className="px-3 py-1 bg-gray-800/50 rounded-full border border-gray-700">GIA Certified</span>
            <span className="px-3 py-1 bg-gray-800/50 rounded-full border border-gray-700">IGI Verified</span>
            <span className="px-3 py-1 bg-gray-800/50 rounded-full border border-gray-700">Insured Shipping</span>
            <span className="px-3 py-1 bg-gray-800/50 rounded-full border border-gray-700">30-Day Returns</span>
          </div>
        </div>
      </div>
    </section>
  );
};



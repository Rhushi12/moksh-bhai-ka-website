import React from 'react';
import { Card } from '@/components/ui/card';

export const DescriptionSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-playfair text-white mb-4">
            About Diamond Elegance Studio
          </h2>
          <p className="text-gray-300 font-montserrat max-w-2xl mx-auto">
            Discover the story behind our passion for exceptional diamonds
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <Card className="bg-gray-800 border-gray-700 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Description Lines */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-300 font-montserrat leading-relaxed">
                    Founded with a vision to bring the world's most exceptional diamonds to discerning collectors and investors, 
                    Diamond Elegance Studio has established itself as a premier destination for rare and investment-grade gemstones.
                  </p>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-300 font-montserrat leading-relaxed">
                    Our expert team, led by certified gemologists with decades of industry experience, 
                    carefully curates each diamond based on the highest standards of quality, authenticity, and investment potential.
                  </p>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-300 font-montserrat leading-relaxed">
                    We specialize in sourcing diamonds from the most reputable suppliers worldwide, 
                    including rare colored diamonds, antique cuts, and modern precision-cut stones that meet our exacting standards.
                  </p>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-300 font-montserrat leading-relaxed">
                    Every diamond in our collection undergoes rigorous testing and certification processes, 
                    ensuring that our clients receive only the finest quality stones with complete transparency and documentation.
                  </p>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-300 font-montserrat leading-relaxed">
                    Beyond exceptional diamonds, we provide personalized consultation services, 
                    helping clients build investment portfolios and create bespoke jewelry pieces that reflect their unique vision and style.
                  </p>
                </div>
              </div>
              
              {/* Empty Block for Future Content */}
              <div className="flex items-center justify-center">
                <div className="w-full h-64 bg-gray-700 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📝</div>
                    <p className="text-gray-400 font-montserrat text-sm">
                      Content Block
                    </p>
                    <p className="text-gray-500 font-montserrat text-xs">
                      Ready for future content
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};


import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateCursorPosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if we're inside a modal or overlay
      const isInModal = target.closest('[role="dialog"]') || 
                       target.closest('.modal') || 
                       target.closest('[data-modal]') ||
                       (target.closest('.fixed') && target.closest('.z-50')) ||
                       target.closest('.fixed.inset-0');
      
      if (isInModal) {
        // Show default cursor in modals
        document.body.style.cursor = 'auto';
        setIsHovering(false);
        return;
      }
      
      // Hide default cursor for main content
      document.body.style.cursor = 'none';
      
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.closest('.diamond-card') ||
        target.closest('.interactive') ||
        target.closest('[data-interactive]') ||
        target.closest('.cursor-pointer') ||
        target.closest('.hover\\:scale-105') ||
        target.closest('.hover\\:bg-gray-700') ||
        target.closest('.hover\\:shadow-lg') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('textarea') ||
        target.closest('[role="tab"]') ||
        target.closest('[role="menuitem"]') ||
        target.closest('.card') ||
        target.closest('.btn') ||
        target.closest('.button')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    document.addEventListener('mousemove', updateCursorPosition);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', updateCursorPosition);
      document.removeEventListener('mousemove', handleMouseMove);
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 pointer-events-none z-[9999] transition-all duration-300 ease-out ${
        isHovering ? 'scale-150 opacity-80' : 'scale-100 opacity-60'
      }`}
      style={{
        transform: `translate(${position.x - 8}px, ${position.y - 8}px)`,
      }}
    >
      <div className="w-4 h-4 bg-white rounded-full mix-blend-difference shadow-lg" />
    </div>
  );
}; 
import React, { createContext, useContext, useRef, useEffect, ReactNode } from 'react';
import Lenis from '@studio-freight/lenis';

interface LenisContextType {
  lenis: Lenis | null;
  stop: () => void;
  start: () => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const LenisContext = createContext<LenisContextType | null>(null);

interface LenisProviderProps {
  children: ReactNode;
}

export const LenisProvider: React.FC<LenisProviderProps> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  useEffect(() => {
    let rafId: number;

    try {
      if (!isModalOpen) {
        console.log('🔓 Lenis: Initializing smooth scroll (modal closed)');
        
        // Disable Lenis completely for instant scrolling
        // lenisRef.current = new Lenis({...});

        // Disable RAF loop since Lenis is disabled
        // function raf(time: number) {
        //   lenisRef.current?.raf(time);
        //   rafId = requestAnimationFrame(raf);
        // }
        // rafId = requestAnimationFrame(raf);

        // Re-enable body scroll when modal is closed
        document.body.style.overflow = '';
      } else {
        console.log('🔒 Lenis: Modal open - destroying Lenis instance');
        
        // Disable body scroll when modal is open
        document.body.style.overflow = 'hidden';
      }
    } catch (error) {
      console.error('❌ Error in LenisProvider:', error);
    }

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (lenisRef.current) {
        console.log('🧹 Lenis: Cleaning up instance');
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      // Ensure scroll is re-enabled on cleanup
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const stop = () => {
    console.log('🔒 Lenis: Stopping smooth scroll');
    lenisRef.current?.stop();
  };

  const start = () => {
    console.log('🔓 Lenis: Starting smooth scroll');
    lenisRef.current?.start();
  };

  const value: LenisContextType = {
    lenis: lenisRef.current,
    stop,
    start,
    isModalOpen,
    setIsModalOpen,
  };

  return (
    <LenisContext.Provider value={value}>
      {children}
    </LenisContext.Provider>
  );
};

export const useLenis = (): LenisContextType => {
  const context = useContext(LenisContext);
  if (!context) {
    throw new Error('useLenis must be used within a LenisProvider');
  }
  return context;
}; 
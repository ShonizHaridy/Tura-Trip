import React, { useState, useEffect } from 'react';
import { ArrowUp2 } from 'iconsax-react';

const LeftScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkIsMobile = () => {
      return window.innerWidth <= 768;
    };
    
    setIsMobile(checkIsMobile());
    
    const handleResize = () => {
      setIsMobile(checkIsMobile());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show button when page is scrolled down, considering screen height
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const screenHeight = window.innerHeight;
      
      // Show button when scrolled down more than half screen height
      setIsVisible(scrollTop > screenHeight * 0.5);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed left-4 top-[80%] lg:top-[60%] transform -translate-y-1/2 z-50 transition-all duration-300 ease-in-out`}
    >
      {isMobile ? (
        // Mobile version - 24x24px
        <button
          onClick={scrollToTop}
          className="relative flex flex-col justify-center items-center w-8 h-8 bg-white rounded-full border-2 border-[#2BA6A4] cursor-pointer transition-all duration-200 hover:scale-110"
          style={{
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
          }}
          title="Scroll to top"
        >
          {/* Mobile Arrow - 16px */}
          <ArrowUp2 
            size="16" 
            color="#2BA6A4"
            variant="Bold"
          />
          
          {/* Mobile Top Text */}
          <span 
            className="text-[#2BA6A4]"
            style={{
              fontFamily: 'Roboto',
              fontWeight: 500,
              fontSize: '8px',
              lineHeight: '9px',
              width: '14px',
              height: '9px'
            }}
          >
            Top
          </span>
        </button>
      ) : (
        // Desktop version - 48x48px  
        <button
          onClick={scrollToTop}
          className="relative flex flex-col justify-end items-center w-12 h-12 bg-white rounded-full border-2 border-[#2BA6A4] cursor-pointer transition-all duration-200 hover:scale-105"
          style={{
            padding: '8px 13px',
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
          }}
          title="Scroll to top"
        >
          {/* Desktop Arrow - 24px */}
          <ArrowUp2 
            size="24" 
            color="#2BA6A4"
            // className="mb-1"
            variant="Bold"
          />
          
          {/* Desktop Top Text */}
          <span 
            className="text-[#2BA6A4]"
            style={{
              fontFamily: 'Roboto',
              fontWeight: 700,
              fontSize: '12px',
              lineHeight: '14px',
              width: '20px',
              height: '14px'
            }}
          >
            Top
          </span>
        </button>
      )}
    </div>
  );
};

export default LeftScrollToTop;
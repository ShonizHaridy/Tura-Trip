// src/components/EdgeSocialMedia.jsx
import React, { useState, useEffect, useRef } from 'react';
import { IoLogoWhatsapp } from 'react-icons/io';
import { FaTelegramPlane } from 'react-icons/fa';

const EdgeSocialMedia = () => {
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isTelegramOpen, setIsTelegramOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Timeout refs for auto-close
  const whatsappTimeoutRef = useRef(null);
  const telegramTimeoutRef = useRef(null);
  
  // Auto-close delay (in milliseconds)
  const AUTO_CLOSE_DELAY = 4000; // 4 seconds

  // Detect if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };
    
    setIsMobile(checkIsMobile());
    
    const handleResize = () => {
      setIsMobile(checkIsMobile());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-close function for WhatsApp
  const startWhatsAppAutoClose = () => {
    if (isMobile) {
      clearTimeout(whatsappTimeoutRef.current);
      whatsappTimeoutRef.current = setTimeout(() => {
        setIsWhatsAppOpen(false);
      }, AUTO_CLOSE_DELAY);
    }
  };

  // Auto-close function for Telegram
  const startTelegramAutoClose = () => {
    if (isMobile) {
      clearTimeout(telegramTimeoutRef.current);
      telegramTimeoutRef.current = setTimeout(() => {
        setIsTelegramOpen(false);
      }, AUTO_CLOSE_DELAY);
    }
  };

  // Clear timeouts
  const clearAutoCloseTimeouts = () => {
    clearTimeout(whatsappTimeoutRef.current);
    clearTimeout(telegramTimeoutRef.current);
  };

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      clearAutoCloseTimeouts();
    };
  }, []);

  const handleWhatsAppClick = (e) => {
    clearTimeout(whatsappTimeoutRef.current);
    
    if (isMobile && !isWhatsAppOpen) {
      e.preventDefault();
      e.stopPropagation();
      setIsWhatsAppOpen(true);
      startWhatsAppAutoClose();
      return;
    }
    window.open('https://wa.me/2001055957451', '_blank');
  };

  const handleTelegramClick = (e) => {
    clearTimeout(telegramTimeoutRef.current);
    
    if (isMobile && !isTelegramOpen) {
      e.preventDefault();
      e.stopPropagation();
      setIsTelegramOpen(true);
      startTelegramAutoClose();
      return;
    }
    window.open('https://t.me/abdulhurghada', '_blank');
  };

  const handleWhatsAppContainerClick = (e) => {
    if (isMobile) {
      e.preventDefault();
      clearTimeout(whatsappTimeoutRef.current);
      if (!isWhatsAppOpen) {
        setIsWhatsAppOpen(true);
        startWhatsAppAutoClose();
      }
    }
  };

  const handleTelegramContainerClick = (e) => {
    if (isMobile) {
      e.preventDefault();
      clearTimeout(telegramTimeoutRef.current);
      if (!isTelegramOpen) {
        setIsTelegramOpen(true);
        startTelegramAutoClose();
      }
    }
  };

  // Reset auto-close timer when interacting with open buttons
  const handleInteraction = (buttonType) => {
    if (isMobile) {
      if (buttonType === 'whatsapp' && isWhatsAppOpen) {
        clearTimeout(whatsappTimeoutRef.current);
        startWhatsAppAutoClose();
      } else if (buttonType === 'telegram' && isTelegramOpen) {
        clearTimeout(telegramTimeoutRef.current);
        startTelegramAutoClose();
      }
    }
  };

  // Close buttons when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobile) {
        const socialContainer = e.target.closest('[data-social-container]');
        if (!socialContainer) {
          setIsWhatsAppOpen(false);
          setIsTelegramOpen(false);
          clearAutoCloseTimeouts();
        }
      }
    };

    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobile]);

  return (
    <div className="fixed right-0 top-[80%] lg:top-[60%] transform -translate-y-1/2 z-50 flex flex-col space-y-2" data-social-container>
      
      {/* WhatsApp Button */}
      <div 
        className={`group relative transition-transform duration-300 ease-in-out ${
          isWhatsAppOpen ? 'transform translate-x-5' : 'transform translate-x-10 md:translate-x-10'
        }`}
        onMouseEnter={() => !isMobile && setIsWhatsAppOpen(true)}
        onMouseLeave={() => !isMobile && setIsWhatsAppOpen(false)}
        onClick={handleWhatsAppContainerClick}
        onTouchStart={() => handleInteraction('whatsapp')}
        data-social-container
      >
        <button
          onClick={handleWhatsAppClick}
          className={`flex items-center ${
            isWhatsAppOpen ? 'w-20 md:w-24' : 'w-16 md:w-18'
          } h-12 md:h-14 bg-[#25D366] hover:bg-[#20b954] text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-l-full cursor-pointer`}
          title={isMobile && !isWhatsAppOpen ? "Tap to expand" : "Contact us on WhatsApp"}
        >
          {/* Icon */}
          <div className="flex items-center justify-center w-12 h-full md:w-14">
            <IoLogoWhatsapp className="w-6 h-6 md:w-7 md:h-7" />
          </div>
          
          {/* Empty text container */}
          <div className={`overflow-hidden transition-all duration-300 ${
            isWhatsAppOpen ? 'w-8 md:w-10 opacity-100' : 'w-0 opacity-0'
          }`}>
          </div>
        </button>
        
        {/* Pulse animation dot */}
        <div className={`absolute top-2 right-2 w-3 h-3 bg-white rounded-full ${
          isMobile && !isWhatsAppOpen ? 'animate-bounce' : 'animate-ping'
        } opacity-75`}></div>
      </div>

      {/* Telegram Button */}
      <div 
        className={`group relative transition-transform duration-300 ease-in-out ${
          isTelegramOpen ? 'transform translate-x-5' : 'transform translate-x-10 md:translate-x-10'
        }`}
        onMouseEnter={() => !isMobile && setIsTelegramOpen(true)}
        onMouseLeave={() => !isMobile && setIsTelegramOpen(false)}
        onClick={handleTelegramContainerClick}
        onTouchStart={() => handleInteraction('telegram')}
        data-social-container
      >
        <button
          onClick={handleTelegramClick}
          className={`flex items-center ${
            isTelegramOpen ? 'w-20 md:w-24' : 'w-16 md:w-18'  // ✅ FIXED: Now using isTelegramOpen instead of isWhatsAppOpen
          } h-12 md:h-14 bg-[#0088cc] hover:bg-[#006fa8] text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-l-full cursor-pointer`}
          title={isMobile && !isTelegramOpen ? "Tap to expand" : "Contact us on Telegram"}
        >
          {/* Icon */}
          <div className="flex items-center justify-center w-12 h-full md:w-14">
            <FaTelegramPlane className="w-6 h-6 md:w-7 md:h-7" />
          </div>
          
          {/* Empty text container */}
          <div className={`overflow-hidden transition-all duration-300 ${
            isTelegramOpen ? 'w-8 md:w-10 opacity-100' : 'w-0 opacity-0'
          }`}>
          </div>
        </button>
        
        {/* Pulse animation dot */}
        <div className={`absolute top-2 right-2 w-3 h-3 bg-white rounded-full ${
          isMobile && !isTelegramOpen ? 'animate-bounce' : 'animate-ping'
        } opacity-75`}></div>
      </div>
    </div>
  );
};

export default EdgeSocialMedia;
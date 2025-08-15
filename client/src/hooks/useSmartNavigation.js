// src/hooks/useSmartNavigation.js - UPDATED FOR RUSSIAN DEFAULT
import { useNavigate as useReactRouterNavigate } from 'react-router-dom';
import { useLanguageContext } from '../contexts/LanguageContext';

export const useNavigate = () => {
  const navigate = useReactRouterNavigate();
  const { currentLanguage, DEFAULT_LANGUAGE } = useLanguageContext();

  const smartNavigate = (to, options = {}) => {
    // Don't modify admin routes
    if (typeof to === 'string' && to.startsWith('/admin')) {
      return navigate(to, options);
    }

    // Don't modify external URLs
    if (typeof to === 'string' && (to.startsWith('http') || to.startsWith('mailto') || to.startsWith('tel'))) {
      return navigate(to, options);
    }

    // ✅ CHANGED: For Russian (default), use path as-is
    if (currentLanguage === DEFAULT_LANGUAGE) {
      return navigate(to, options);
    }

    // ✅ CHANGED: For other languages (including English), add prefix
    if (typeof to === 'string') {
      const prefixedPath = to.startsWith('/') ? `/${currentLanguage}${to}` : `/${currentLanguage}/${to}`;
      return navigate(prefixedPath, options);
    }

    // Handle object navigation (with pathname)
    if (typeof to === 'object' && to.pathname) {
      const prefixedTo = {
        ...to,
        pathname: to.pathname.startsWith('/') ? `/${currentLanguage}${to.pathname}` : `/${currentLanguage}/${to.pathname}`
      };
      return navigate(prefixedTo, options);
    }

    return navigate(to, options);
  };

  return smartNavigate;
};

export { useLocation, useParams } from 'react-router-dom';
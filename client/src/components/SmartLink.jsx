// src/components/SmartLink.jsx - UPDATED FOR RUSSIAN DEFAULT
import { Link } from 'react-router-dom';
import { useLanguageContext } from '../contexts/LanguageContext';

const SmartLink = ({ to, children, ...props }) => {
  const { currentLanguage, DEFAULT_LANGUAGE } = useLanguageContext();
  
  // Don't modify admin routes
  if (typeof to === 'string' && to.startsWith('/admin')) {
    return <Link to={to} {...props}>{children}</Link>;
  }

  // Don't modify external URLs
  if (typeof to === 'string' && (to.startsWith('http') || to.startsWith('mailto') || to.startsWith('tel'))) {
    return <Link to={to} {...props}>{children}</Link>;
  }

  // ✅ CHANGED: For Russian (default), use path as-is
  if (currentLanguage === DEFAULT_LANGUAGE) {
    return <Link to={to} {...props}>{children}</Link>;
  }

  // ✅ CHANGED: For other languages (including English), add prefix
  const prefixedPath = typeof to === 'string' 
    ? (to.startsWith('/') ? `/${currentLanguage}${to}` : `/${currentLanguage}/${to}`)
    : to;

  return <Link to={prefixedPath} {...props}>{children}</Link>;
};

export default SmartLink;
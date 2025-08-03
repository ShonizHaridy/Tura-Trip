import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { IoMdArrowDropdown } from "react-icons/io";

const SearchDropdown = ({ 
  placeholder, 
  options = [], 
  value, 
  onChange, 
  onSelect,
  loading = false,
  searchable = false,
  onSearch
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const { t } = useTranslation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    if (onChange) onChange(newValue);
    if (searchable && onSearch && newValue.length >= 2) {
      onSearch(newValue);
    }
    if (!isOpen) setIsOpen(true);
  };

  const handleOptionSelect = (option) => {
    setSearchTerm(option.name);
    if (onSelect) onSelect(option);
    setIsOpen(false);
  };

  const filteredOptions = searchable && searchTerm 
    ? options.filter(option => 
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  return (
    <div className="relative flex-1 min-w-0" ref={dropdownRef}>
      <div className="flex items-center gap-1 py-2 flex-1 min-w-0">
        <IoMdArrowDropdown 
          className={`w-5 h-5 text-white flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          className="bg-transparent text-white placeholder:text-white outline-none w-full text-sm lg:text-base font-semibold font-family-primary"
        />
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto z-50">
          {loading ? (
            <div className="px-4 py-3 text-gray-500 text-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600 mx-auto"></div>
            </div>
          ) : filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-800 border-b border-gray-100 last:border-b-0"
              >
                {option.image_url && (
                  <img
                    src={option.image_url}
                    alt={option.name}
                    className="w-8 h-8 rounded object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{option.name}</div>
                  {option.tours_count && (
                    <div className="text-xs text-gray-500">
                      {option.tours_count} {t('common.tours')}
                    </div>
                  )}
                </div>
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-gray-500 text-center text-sm">
              {searchTerm ? t('common.noResults') : t('common.startTyping')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
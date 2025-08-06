// src/components/admin/AddCityModal.jsx
import React, { useState, useRef, useEffect } from "react";
import enFlag from "../../assets/flags/en.png";
import ruFlag from "../../assets/flags/ru.png";
import itFlag from "../../assets/flags/it.png";
import deFlag from "../../assets/flags/de.png";
import adminService from "../../services/adminService";

const AddCityModal = ({ onClose, onSave }) => {
  const languages = [
    { code: "en", name: "English", flag: enFlag },
    { code: "ru", name: "Russian", flag: ruFlag },
    { code: "it", name: "Italian", flag: itFlag },
    { code: "de", name: "German", flag: deFlag },
  ];

  const [activeLanguage, setActiveLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const [formData, setFormData] = useState({
    is_active: true,
    hero_image: null,
    translations: {
      en: { name: "", tagline: "", description: "" },
      ru: { name: "", tagline: "", description: "" },
      it: { name: "", tagline: "", description: "" },
      de: { name: "", tagline: "", description: "" },
    },
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    // Check if all languages have required fields filled
    languages.forEach(lang => {
      if (!formData.translations[lang.code].name.trim()) {
        if (!newErrors[lang.code]) newErrors[lang.code] = {};
        newErrors[lang.code].name = `${lang.name} city name is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      translations: {
        ...prev.translations,
        [activeLanguage]: {
          ...prev.translations[activeLanguage],
          [field]: value
        }
      }
    }));

    // Clear error for current field and language
    if (errors[activeLanguage]?.[field]) {
      setErrors(prev => ({
        ...prev,
        [activeLanguage]: {
          ...prev[activeLanguage],
          [field]: undefined
        }
      }));
    }
  };

  const handleLanguageSelect = (languageCode) => {
    setActiveLanguage(languageCode);
    setIsLanguageDropdownOpen(false);
  };

  const handleImageUpload = (file) => {
    setFormData(prev => ({ ...prev, hero_image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const submitData = new FormData();
      
      // Add basic city data
      submitData.append('is_active', formData.is_active);
      
      // Add image if provided
      if (formData.hero_image) {
        submitData.append('hero_image', formData.hero_image);
      }
      
      // Add translations
      submitData.append('translations', JSON.stringify(formData.translations));

      const response = await adminService.createCity(submitData);
      
      if (response.success) {
        onSave(response.data);
      } else {
        setErrors({ submit: response.message || "Failed to create city" });
      }
    } catch (error) {
      console.error('Create city error:', error);
      setErrors({ submit: "An error occurred while creating the city" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4 w-full max-w-2xl bg-white rounded-xl shadow-lg p-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-end items-center gap-2 w-full border-b border-gray-300 pb-2">
          <div className="flex pb-2 items-center gap-2 flex-1">
            <div className="flex items-center gap-2">
              <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
                <path
                  d="M9.65366 2.66675H7.12033C4.20033 2.66675 2.66699 4.20008 2.66699 7.10675V9.64008C2.66699 12.5467 4.20033 14.0801 7.10699 14.0801H9.64033C12.547 14.0801 14.0803 12.5467 14.0803 9.64008V7.10675C14.0937 4.20008 12.5603 2.66675 9.65366 2.66675Z"
                  fill="#2BA6A4"
                />
                <path
                  d="M9.65366 2.66675H7.12033C4.20033 2.66675 2.66699 4.20008 2.66699 7.10675V9.64008C2.66699 12.5467 4.20033 14.0801 7.10699 14.0801H9.64033C12.547 14.0801 14.0803 12.5467 14.0803 9.64008V7.10675C14.0937 4.20008 12.5603 2.66675 9.65366 2.66675Z"
                  fill="black"
                  fillOpacity="0.2"
                />
                <g opacity="0.4">
                  <path
                    d="M24.8933 2.66675H22.3599C19.4533 2.66675 17.9199 4.20008 17.9199 7.10675V9.64008C17.9199 12.5467 19.4533 14.0801 22.3599 14.0801H24.8933C27.7999 14.0801 29.3333 12.5467 29.3333 9.64008V7.10675C29.3333 4.20008 27.7999 2.66675 24.8933 2.66675Z"
                    fill="#2BA6A4"
                  />
                  <path
                    d="M24.8933 2.66675H22.3599C19.4533 2.66675 17.9199 4.20008 17.9199 7.10675V9.64008C17.9199 12.5467 19.4533 14.0801 22.3599 14.0801H24.8933C27.7999 14.0801 29.3333 12.5467 29.3333 9.64008V7.10675C29.3333 4.20008 27.7999 2.66675 24.8933 2.66675Z"
                    fill="black"
                    fillOpacity="0.2"
                  />
                </g>
                <path
                  d="M24.8933 17.9067H22.3599C19.4533 17.9067 17.9199 19.4401 17.9199 22.3467V24.8801C17.9199 27.7867 19.4533 29.3201 22.3599 29.3201H24.8933C27.7999 29.3201 29.3333 27.7867 29.3333 24.8801V22.3467C29.3333 19.4401 27.7999 17.9067 24.8933 17.9067Z"
                  fill="#2BA6A4"
                />
                <path
                  d="M24.8933 17.9067H22.3599C19.4533 17.9067 17.9199 19.4401 17.9199 22.3467V24.8801C17.9199 27.7867 19.4533 29.3201 22.3599 29.3201H24.8933C27.7999 29.3201 29.3333 27.7867 29.3333 24.8801V22.3467C29.3333 19.4401 27.7999 17.9067 24.8933 17.9067Z"
                  fill="black"
                  fillOpacity="0.2"
                />
                <path
                  opacity="0.4"
                  d="M9.65366 17.9067H7.12033C4.20033 17.9067 2.66699 19.4401 2.66699 22.3467V24.8801C2.66699 27.8001 4.20033 29.3334 7.10699 29.3334H9.64033C12.547 29.3334 14.0803 27.8001 14.0803 24.8934V22.3601C14.0937 19.4401 12.5603 17.9067 9.65366 17.9067Z"
                  fill="#145DA0"
                />
              </svg>
              <h2
                className="text-xl font-bold text-right"
                style={{ color: "#124645" }}
              >
                Add New City
              </h2>
            </div>
          </div>

          {/* Language Selector with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="flex h-12 py-3 items-center gap-2 hover:bg-gray-50 rounded-md px-2 transition-colors"
            >
              <img 
                src={languages.find(lang => lang.code === activeLanguage)?.flag} 
                alt={activeLanguage}
                className="w-6 h-6 rounded-sm"
              />
              <span className="text-gray-900 text-xl font-medium">
                {languages.find(lang => lang.code === activeLanguage)?.name}
              </span>
              <svg
                className={`w-4 h-4 text-gray-900 transition-transform ${
                  isLanguageDropdownOpen ? 'rotate-180' : ''
                }`}
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M11.9465 5.45337H7.79316H4.05317C3.41317 5.45337 3.09317 6.2267 3.5465 6.68004L6.99983 10.1334C7.55317 10.6867 8.45317 10.6867 9.0065 10.1334L10.3198 8.82004L12.4598 6.68004C12.9065 6.2267 12.5865 5.45337 11.9465 5.45337Z"
                  fill="currentColor"
                />
              </svg>
            </button>

            {/* Language Dropdown */}
            {isLanguageDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="py-1">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      type="button"
                      onClick={() => handleLanguageSelect(language.code)}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                        activeLanguage === language.code ? 'bg-teal-50 text-teal-700' : 'text-gray-700'
                      }`}
                    >
                      <img 
                        src={language.flag} 
                        alt={language.code} 
                        className="w-5 h-5 rounded-sm" 
                      />
                      <span className="text-base font-medium">{language.name}</span>
                      {errors[language.code] && (
                        <div className="ml-auto w-2 h-2 bg-red-500 rounded-full"></div>
                      )}
                      {activeLanguage === language.code && (
                        <svg className="ml-auto w-4 h-4 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-start gap-6 w-full"
        >
          {/* City Name */}
          <div className="flex flex-col items-start gap-4 w-full">
            <div className="flex items-center gap-6 w-full">
              <div className="flex flex-col items-end gap-1 flex-1">
                <label
                  className="w-full text-xl font-normal"
                  style={{ color: "#222E50" }}
                >
                  City Name ({languages.find(lang => lang.code === activeLanguage)?.name})
                </label>
                <div className={`flex h-9 px-4 py-3 justify-end items-center gap-2 w-full border rounded-md bg-white ${
                  errors[activeLanguage]?.name ? 'border-red-500' : 'border-gray-200'
                }`}>
                  <input
                    type="text"
                    value={formData.translations[activeLanguage].name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder={`Enter city name in ${languages.find(lang => lang.code === activeLanguage)?.name}`}
                    className="flex-1 text-danim-900 placeholder-rose-black-200 text-base font-normal outline-none border-none"
                    required
                  />
                </div>
                {errors[activeLanguage]?.name && (
                  <span className="text-red-500 text-sm w-full">
                    {errors[activeLanguage].name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div className="flex flex-col items-start gap-4 w-full">
            <div className="flex items-center gap-6 w-full">
              <div className="flex flex-col items-end gap-1 flex-1">
                <label
                  className="w-full text-xl font-normal"
                  style={{ color: "#222E50" }}
                >
                  Tagline ({languages.find(lang => lang.code === activeLanguage)?.name})
                </label>
                <div className="flex h-9 px-4 py-3 justify-end items-center gap-2 w-full border border-gray-200 rounded-md bg-white">
                  <input
                    type="text"
                    value={formData.translations[activeLanguage].tagline}
                    onChange={(e) => handleInputChange('tagline', e.target.value)}
                    placeholder={`Enter tagline in ${languages.find(lang => lang.code === activeLanguage)?.name}`}
                    className="flex-1 text-danim-900 placeholder-rose-black-200 text-base font-normal outline-none border-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description & Highlights */}
          <div className="flex flex-col items-start gap-4 w-full">
            <div className="flex items-center gap-6 w-full">
              <div className="flex flex-col items-end gap-1 flex-1">
                <label
                  className="w-full text-xl font-normal"
                  style={{ color: "#222E50" }}
                >
                  Description & Highlights ({languages.find(lang => lang.code === activeLanguage)?.name})
                </label>
                <div className="flex px-4 py-3 justify-end items-start gap-2 w-full border border-gray-200 rounded-md bg-white">
                  <textarea
                    value={formData.translations[activeLanguage].description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder={`Write city description and highlights in ${languages.find(lang => lang.code === activeLanguage)?.name}`}
                    className="flex-1 text-danim-900 placeholder-rose-black-200 text-base font-normal outline-none border-none resize-none"
                    rows="4"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Commented out Tour Categories section */}
          {/* 
          <div className="flex flex-col items-start gap-4 w-full">
            <label className="text-xl font-normal" style={{ color: "#222E50" }}>
              Tour Categories
            </label>
            <div className="grid grid-cols-2 gap-4 w-full">
              {tourCategories.map((category) => (
                <label key={category.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.categories.includes(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                  />
                  <span className="text-gray-700 text-sm">{category.name}</span>
                </label>
              ))}
            </div>
          </div>
          */}

          {/* City Image */}
          <div className="flex flex-col items-start gap-4 w-full">
            <label className="text-xl font-normal" style={{ color: "#222E50" }}>
              City Image
            </label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-500 transition-colors cursor-pointer w-full"
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = (e) => {
                  const file = e.target.files?.[0] || null;
                  handleImageUpload(file);
                };
                input.click();
              }}
            >
              {formData.hero_image ? (
                <div className="flex items-center justify-center">
                  <img
                    src={URL.createObjectURL(formData.hero_image)}
                    alt="City Preview"
                    className="max-h-32 object-contain rounded"
                  />
                </div>
              ) : (
                <>
                  <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-gray-600 mb-2">Upload or drag a file here</p>
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm"
                  >
                    Choose File
                  </button>
                  <p className="text-xs text-gray-500 mt-1">
                    The file size must not exceed 10 MB and be in PDF format.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Error Messages */}
          {errors.submit && (
            <div className="text-red-500 text-sm w-full text-center">
              {errors.submit}
            </div>
          )}

          {/* Validation Summary */}
          <div className="w-full">
            <div className="text-sm text-gray-600 mb-2">
              Translation Progress:
            </div>
            <div className="grid grid-cols-4 gap-2">
              {languages.map((language) => {
                const isComplete = formData.translations[language.code].name.trim();
                return (
                  <div
                    key={language.code}
                    className={`flex items-center gap-2 p-2 rounded-md ${
                      isComplete ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}
                  >
                    <img src={language.flag} alt={language.code} className="w-4 h-4 rounded-sm" />
                    <span className="text-xs font-medium">{language.name}</span>
                    <div className={`w-2 h-2 rounded-full ${
                      isComplete ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex px-0 py-4 items-center gap-4 w-full">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex px-4 py-2 justify-center items-center gap-3 flex-1 rounded border border-teal-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
              style={{ backgroundColor: "#F3F3EE" }}
            >
              <span
                className="text-xl font-semibold"
                style={{ color: "#1F7674" }}
              >
                Cancel
              </span>
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex px-4 py-2 justify-center items-center gap-3 flex-1 rounded bg-teal-700 hover:bg-teal-800 transition-colors disabled:opacity-50"
            >
              <span
                className="text-xl font-semibold"
                style={{ color: "#EAF6F6" }}
              >
                {loading ? "Adding..." : "Add"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCityModal;
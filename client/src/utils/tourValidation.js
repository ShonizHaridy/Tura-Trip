// src/utils/tourValidation.js
export const validateTourLanguages = (languages, isEdit = false) => {
  const errors = {};
  const requiredFields = ['title', 'category', 'duration', 'description'];
  
  Object.entries(languages).forEach(([langCode, content]) => {
    const missingFields = requiredFields.filter(field => !content[field]?.trim());
    
    if (missingFields.length > 0) {
      errors[langCode] = missingFields;
    }
  });
  
  return {
    hasErrors: Object.keys(errors).length > 0,
    errors,
    canIgnore: isEdit // For edit, errors can be ignored
  };
};

// Update your AddTour and EditTour components


// For EditTour - make alert ignorable
const handleNext = () => {
  if (currentStep >= 2 && currentStep <= 5) {
    const langCode = ['en', 'ru', 'it', 'de'][currentStep - 2];
    const validation = validateTourLanguages({ [langCode]: formData.languages[langCode] }, true);
    
    if (validation.hasErrors) {
      const missingFields = validation.errors[langCode].join(', ');
      const proceed = window.confirm(`Missing fields for ${languages[currentStep - 2].name}: ${missingFields}\n\nDo you want to continue anyway?`);
      if (!proceed) return;
    }
  }
  
  setCurrentStep((prev) => Math.min(5, prev + 1));
};
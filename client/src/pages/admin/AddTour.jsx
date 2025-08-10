import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GalleryAdd, DollarCircle, Location, ArrowLeft, ArrowDown2, Trash } from 'iconsax-react';

import enFlag from "../../assets/flags/en.png";
import ruFlag from "../../assets/flags/ru.png";
import itFlag from "../../assets/flags/it.png";
import deFlag from "../../assets/flags/de.png";

import AdminLayout from "../../components/admin/AdminLayout";
import adminService from "../../services/adminService";

const languages = [
  { code: "en", name: "English", flag: enFlag },
  { code: "ru", name: "Russian", flag: ruFlag },
  { code: "it", name: "Italian", flag: itFlag },
  { code: "de", name: "German", flag: deFlag },
];

const steps = [
  { id: 1, title: "Basic Info", description: "Images, location, and pricing" },
  { id: 2, title: "English", description: "Content in English" },
  { id: 3, title: "Russian", description: "Content in Russian" },
  { id: 4, title: "Italian", description: "Content in Italian" },
  { id: 5, title: "German", description: "Content in German" },
];

const AddTour = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [currentInputValues, setCurrentInputValues] = useState({
    step1: {
      city_id: "",
      category_id: "",
      location: "",
      price_adult: "",
      price_child: "",
      featured_tag: "",
      discount_percentage: "",
    },
    languages: {
      en: { title: "", category: "", duration: "", availability: "", description: "", included: "", not_included: "", trip_program: "", take_with_you: "" },
      ru: { title: "", category: "", duration: "", availability: "", description: "", included: "", not_included: "", trip_program: "", take_with_you: "" },
      it: { title: "", category: "", duration: "", availability: "", description: "", included: "", not_included: "", trip_program: "", take_with_you: "" },
      de: { title: "", category: "", duration: "", availability: "", description: "", included: "", not_included: "", trip_program: "", take_with_you: "" },
    }
  });

  // Refs for Step 1 - NO STATE, NO onChange!
  const cityRef = useRef();
  const categoryRef = useRef();
  const locationRef = useRef();
  const priceAdultRef = useRef();
  const priceChildRef = useRef();
  const featuredTagRef = useRef();
  const discountRef = useRef();

  // Refs for language inputs
  const langRefs = {
    en: {
      title: useRef(),
      category: useRef(),
      duration: useRef(),
      availability: useRef(),
      description: useRef(),
      included: useRef(),
      not_included: useRef(),
      trip_program: useRef(),
      take_with_you: useRef(),
    },
    ru: {
      title: useRef(),
      category: useRef(),
      duration: useRef(),
      availability: useRef(),
      description: useRef(),
      included: useRef(),
      not_included: useRef(),
      trip_program: useRef(),
      take_with_you: useRef(),
    },
    it: {
      title: useRef(),
      category: useRef(),
      duration: useRef(),
      availability: useRef(),
      description: useRef(),
      included: useRef(),
      not_included: useRef(),
      trip_program: useRef(),
      take_with_you: useRef(),
    },
    de: {
      title: useRef(),
      category: useRef(),
      duration: useRef(),
      availability: useRef(),
      description: useRef(),
      included: useRef(),
      not_included: useRef(),
      trip_program: useRef(),
      take_with_you: useRef(),
    },
  };

  // State only for images and final form data
  const [formData, setFormData] = useState({
    cover_image: null,
    tour_images: [null, null, null, null],
    // Final data captured only on Next/Save
    finalData: {
      city_id: "",
      category_id: "",
      location: "",
      price_adult: "",
      price_child: "",
      featured_tag: "",
      discount_percentage: "",
      status: "active",
      languages: {
        en: { title: "", category: "", duration: "", availability: "", description: "", included: "", not_included: "", trip_program: "", take_with_you: "" },
        ru: { title: "", category: "", duration: "", availability: "", description: "", included: "", not_included: "", trip_program: "", take_with_you: "" },
        it: { title: "", category: "", duration: "", availability: "", description: "", included: "", not_included: "", trip_program: "", take_with_you: "" },
        de: { title: "", category: "", duration: "", availability: "", description: "", included: "", not_included: "", trip_program: "", take_with_you: "" },
      },
    }
  });

  // Fetch cities and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citiesResponse, categoriesResponse] = await Promise.all([
          adminService.getCities(),
          adminService.getCategories({ active_only: true })
        ]);

        if (citiesResponse.success) {
          setCities(citiesResponse.data.filter(city => city.is_active));
        }
        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data.filter(cat => cat.is_active));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to load cities and categories');
      }
    };

    fetchData();
  }, []);

  // Image handling (only thing that needs immediate state update)
  const handleImageUpload = (index, file, isCover = false) => {
    // Capture current input values before re-render
    captureCurrentStepData();
    
    if (isCover) {
      setFormData(prev => ({ ...prev, cover_image: file }));
    } else {
      setFormData(prev => {
        const newImages = [...prev.tour_images];
        newImages[index] = file;
        return { ...prev, tour_images: newImages };
      });
    }
  };


  const removeImage = (index) => {
    setFormData(prev => {
      const newImages = [...prev.tour_images];
      newImages[index] = null;
      return { ...prev, tour_images: newImages };
    });
  };

  // Capture values only when needed!
  const captureCurrentStepData = () => {
    if (currentStep === 1) {
      const stepData = {
        city_id: cityRef.current?.value || "",
        category_id: categoryRef.current?.value || "",
        location: locationRef.current?.value || "",
        price_adult: priceAdultRef.current?.value || "",
        price_child: priceChildRef.current?.value || "",
        featured_tag: featuredTagRef.current?.value || null,
        discount_percentage: discountRef.current?.value || "",
      };
      
      // Always update current values (even if validation fails)
      setCurrentInputValues(prev => ({
        ...prev,
        step1: stepData
      }));
      
      return stepData;
    } else if (currentStep >= 2 && currentStep <= 5) {
      const langCode = ["en", "ru", "it", "de"][currentStep - 2];
      const langData = {
        title: langRefs[langCode].title.current?.value || "",
        category: langRefs[langCode].category.current?.value || "",
        duration: langRefs[langCode].duration.current?.value || "",
        availability: langRefs[langCode].availability.current?.value || "",
        description: langRefs[langCode].description.current?.value || "",
        included: langRefs[langCode].included.current?.value || "",
        not_included: langRefs[langCode].not_included.current?.value || "",
        trip_program: langRefs[langCode].trip_program.current?.value || "",
        take_with_you: langRefs[langCode].take_with_you.current?.value || "",
      };

      // Always update current values
      setCurrentInputValues(prev => ({
        ...prev,
        languages: {
          ...prev.languages,
          [langCode]: langData
        }
      }));
      
      return { [langCode]: langData };
    }
    return {};
  };


const validateStep = (step, data) => {
  const newErrors = {};

  if (step === 1) {
    if (!data.city_id) newErrors.city_id = "City is required";
    if (!data.category_id) newErrors.category_id = "Category is required";
    if (!data.location || data.location.trim() === '') newErrors.location = "Location is required";
    if (!data.price_adult || data.price_adult <= 0) newErrors.price_adult = "Adult price must be greater than 0";
    if (!data.price_child || data.price_child <= 0) newErrors.price_child = "Child price must be greater than 0";
    
    // Optional: Validate images
    if (!formData.cover_image) {
      newErrors.cover_image = "Cover image is required";
    }
  }

  if (step >= 2 && step <= 5) {
    const langCode = ["en", "ru", "it", "de"][step - 2];
    const content = data[langCode];

    if (!content.title || content.title.trim() === '') {
      newErrors[`${langCode}.title`] = "Tour title is required";
    }
    if (!content.duration || content.duration.trim() === '') {
      newErrors[`${langCode}.duration`] = "Duration is required";
    }
    if (!content.description || content.description.trim() === '') {
      newErrors[`${langCode}.description`] = "Description is required";
    }
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleNext = () => {
    // Capture data only when clicking Next
    const stepData = captureCurrentStepData();
    
    if (validateStep(currentStep, stepData)) {
      // Only proceed if validation passes
      if (currentStep === 1) {
        setFormData(prev => ({
          ...prev,
          finalData: { ...prev.finalData, ...stepData }
        }));
      } else {
        const langCode = ["en", "ru", "it", "de"][currentStep - 2];
        setFormData(prev => ({
          ...prev,
          finalData: {
            ...prev.finalData,
            languages: {
              ...prev.finalData.languages,
              ...stepData
            }
          }
        }));
      }
      
      setCurrentStep(prev => Math.min(5, prev + 1));
      setErrors({});
    }
    // If validation fails, values are still preserved in currentInputValues
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
    setErrors({}); // Clear errors when going back
  };

  const handleCancel = () => {
    navigate("/admin/tours");
  };

const handleSave = async () => {
  // Capture final step data
  const stepData = captureCurrentStepData();
  
  if (!validateStep(currentStep, stepData)) return;

  // Update final data with last step
  const langCode = ["en", "ru", "it", "de"][currentStep - 2];
  const finalFormData = {
    ...formData.finalData,
    languages: {
      ...formData.finalData.languages,
      ...stepData
    }
  };

  setLoading(true);
  try {
    const submitData = new FormData();
    
    // Add basic tour data
    submitData.append('city_id', finalFormData.city_id);
    submitData.append('category_id', finalFormData.category_id);
    submitData.append('location', finalFormData.location);
    submitData.append('price_adult', finalFormData.price_adult);
    submitData.append('price_child', finalFormData.price_child);
    submitData.append('featured_tag', finalFormData.featured_tag || '');
    submitData.append('discount_percentage', finalFormData.discount_percentage || '0');
    submitData.append('status', finalFormData.status);

    // Add cover image with correct field name for backend
    if (formData.cover_image) {
      submitData.append('coverImage', formData.cover_image); // Changed from 'cover_image'
    }

    // Add tour images with correct field name for backend
    formData.tour_images.forEach((image) => {
      if (image) {
        submitData.append('tourImages', image); // Changed from 'tour_images'
      }
    });

    // Prepare content for all languages
    const contentData = {};
    Object.keys(finalFormData.languages).forEach(langCode => {
      const langContent = finalFormData.languages[langCode];
      if (langContent.title) {
        contentData[langCode] = {
          title: langContent.title,
          category: langContent.category || '',
          duration: langContent.duration,
          availability: langContent.availability,
          description: langContent.description,
          included: langContent.included.split('\n').filter(item => item.trim()),
          not_included: langContent.not_included.split('\n').filter(item => item.trim()),
          trip_program: langContent.trip_program.split('\n').filter(item => item.trim()),
          take_with_you: langContent.take_with_you.split('\n').filter(item => item.trim())
        };
      }
    });

    submitData.append('content', JSON.stringify(contentData));

    const response = await adminService.createTour(submitData);
    
    if (response.success) {
      alert('Tour created successfully!');
      navigate("/admin/tours");
    } else {
      // Handle backend validation errors
      if (response.errors && Array.isArray(response.errors)) {
        const errorMessages = response.errors.map(err => err.msg).join(', ');
        alert('Validation failed: ' + errorMessages);
      } else {
        alert('Failed to create tour: ' + (response.message || 'Unknown error'));
      }
    }
  } catch (error) {
    console.error('Error creating tour:', error);
    
    // Handle different types of errors
    if (error.response) {
      // Backend returned an error response
      const { status, data } = error.response;
      
      if (status === 400 && data.errors) {
        // Validation errors
        const errorMessages = data.errors.map(err => err.msg).join(', ');
        alert('Validation failed: ' + errorMessages);
      } else if (status === 413) {
        // File too large
        alert('File size too large. Please use smaller images (max 5MB each).');
      } else {
        alert('Failed to create tour: ' + (data.message || 'Server error'));
      }
    } else if (error.request) {
      // Network error
      alert('Network error. Please check your connection and try again.');
    } else {
      // Other error
      alert('Failed to create tour. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};

  // Step indicator component
  const StepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="relative w-[480px] h-8">
        <div className="absolute left-4 top-[15px] w-[448px] h-0.5 flex">
          <div className={`w-28 h-0.5 ${currentStep > 1 ? "bg-[#2BA6A4]" : "bg-[#DDDDD9]"}`} />
          <div className={`w-28 h-0.5 ${currentStep > 2 ? "bg-[#2BA6A4]" : "bg-[#DDDDD9]"}`} />
          <div className={`w-28 h-0.5 ${currentStep > 3 ? "bg-[#2BA6A4]" : "bg-[#DDDDD9]"}`} />
          <div className={`w-28 h-0.5 ${currentStep > 4 ? "bg-[#2BA6A4]" : "bg-[#DDDDD9]"}`} />
        </div>

        <div className="absolute left-0 top-0 w-[480px] h-8 flex items-center justify-between">
          {steps.map((step) => (
            <div key={step.id} className="relative">
              {step.id === currentStep ? (
                <div className="w-8 h-8 rounded-full border-2 border-[#2BA6A4] bg-white flex items-center justify-center">
                  <div className="w-[10px] h-[10px] rounded-full bg-[#2BA6A4]" />
                </div>
              ) : step.id < currentStep ? (
                <div className="w-8 h-8 rounded-full bg-[#2BA6A4] flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M16.7071 5.29289C17.0976 5.68342 17.0976 6.31658 16.7071 6.70711L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071L3.29289 10.7071C2.90237 10.3166 2.90237 9.68342 3.29289 9.29289C3.68342 8.90237 4.31658 8.90237 4.70711 9.29289L8 12.5858L15.2929 5.29289C15.6834 4.90237 16.3166 4.90237 16.7071 5.29289Z"
                      fill="white"
                    />
                  </svg>
                </div>
              ) : (
                <div className={`w-8 h-8 rounded-full border-2 ${step.id === 4 || step.id === 5 ? "border-[#ADADA9]" : "border-[#D1D5DB]"} bg-white`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // File Upload Component (same as before)
// File Upload Component - UPDATED with image preview
const FileUploadArea = ({ label, onUpload, file, isLarge = false }) => (
  <div className="flex flex-col gap-2">
    <div className="text-[22px] font-normal text-[#100147] leading-[26.4px]" style={{ fontFamily: "Tai Heritage Pro" }}>
      {label}
    </div>
    <div
      className={`border-2 border-dashed border-[#8A8D95] rounded-2xl cursor-pointer bg-white relative group overflow-hidden ${
        isLarge ? "h-48" : "h-32"
      } ${file ? "bg-gray-50" : ""}`}
      onClick={() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e) => {
          const file = e.target.files?.[0] || null;
          onUpload(file);
        };
        input.click();
      }}
    >
      {file ? (
        <>
          {/* Image Display */}
          <img
            src={URL.createObjectURL(file)}
            alt="Cover"
            className="w-full h-full object-cover rounded-2xl"
          />
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl">
            <div className="text-white text-center">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-2">
                <path
                  d="M10.7521 23.3996C10.366 25.0809 8.41456 26.782 6.31738 25.3972C6.31738 25.3972 7.67526 26.604 10.4333 26.604H22.4646C23.9666 26.604 25.2654 25.5567 25.5843 24.0884L27.0886 16.6898C27.5357 14.3721 26.0064 13.2725 23.9703 13.2725H15.5231C14.0248 13.2725 12.7272 14.3148 12.4059 15.7781L10.7521 23.3996Z"
                  stroke="white"
                  strokeWidth="1.44"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.4344 26.6046C6.46547 26.6046 4.12793 24.2721 4.12793 20.313V11.684C4.12793 7.73001 5.58251 5.39746 9.5415 5.39746H11.7545C12.549 5.39746 13.2963 5.77231 13.7719 6.40744L14.782 7.75118C15.2602 8.38507 16.0086 8.75868 16.8031 8.76116H18.6711C22.0922 8.76116 23.6527 10.2618 24.0175 13.2631"
                  stroke="white"
                  strokeWidth="1.44"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="text-sm font-medium">Click to change</div>
            </div>
          </div>
        </>
      ) : (
        /* Default Upload UI */
        <div className="flex justify-between items-center h-full p-6">
          <div className="flex items-center gap-4">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.7521 23.3996C10.366 25.0809 8.41456 26.782 6.31738 25.3972C6.31738 25.3972 7.67526 26.604 10.4333 26.604H22.4646C23.9666 26.604 25.2654 25.5567 25.5843 24.0884L27.0886 16.6898C27.5357 14.3721 26.0064 13.2725 23.9703 13.2725H15.5231C14.0248 13.2725 12.7272 14.3148 12.4059 15.7781L10.7521 23.3996Z"
                stroke="#8A8D95"
                strokeWidth="1.44"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.4344 26.6046C6.46547 26.6046 4.12793 24.2721 4.12793 20.313V11.684C4.12793 7.73001 5.58251 5.39746 9.5415 5.39746H11.7545C12.549 5.39746 13.2963 5.77231 13.7719 6.40744L14.782 7.75118C15.2602 8.38507 16.0086 8.75868 16.8031 8.76116H18.6711C22.0922 8.76116 23.6527 10.2618 24.0175 13.2631"
                stroke="#8A8D95"
                strokeWidth="1.44"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-sm text-danim-900 font-normal" style={{ fontFamily: "Roboto" }}>
              Upload or drag a file here
            </div>
          </div>
          <button
            className="px-3 py-2 bg-[#DDE7E9] text-[#124645] rounded text-base font-semibold"
            style={{ fontFamily: "Roboto" }}
          >
            Choose File
          </button>
        </div>
      )}
    </div>
  </div>
);

  // Tour Images Upload Component (same as before)
// Tour Images Upload Component - UPDATED with image previews
const TourImagesUpload = () => (
  <div className="flex flex-col gap-2">
    <div className="h-[26px] text-[22px] font-normal text-[#222E50] leading-[26.4px]" style={{ fontFamily: "Tai Heritage Pro" }}>
      Tour images
    </div>
    <div className="flex flex-col p-4 gap-2 border-2 border-dashed border-[#ADADA9] rounded-lg bg-white">
      <div className="flex justify-end gap-6">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`relative flex flex-col justify-center items-center gap-2 flex-1 p-2 border-2 border-dashed rounded-lg cursor-pointer group overflow-hidden ${
              formData.tour_images[index] ? "border-[#2BA6A4] bg-white" : "border-[#868683] bg-white"
            }`}
            style={{ aspectRatio: '1/1' }}
            onClick={() => {
              if (!formData.tour_images[index]) {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = (e) => {
                  const file = e.target.files?.[0] || null;
                  handleImageUpload(index, file);
                };
                input.click();
              }
            }}
          >
            {formData.tour_images[index] ? (
              <>
                {/* Image Preview */}
                <img
                  src={URL.createObjectURL(formData.tour_images[index])}
                  alt="Tour Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                {/* Hover Overlay with Delete */}
                <div 
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                >
                  <Trash size="32" color="red" />
                </div>
              </>
            ) : (
              /* Empty Upload Slot */
              <GalleryAdd size="32" color="#8A8D95" />
            )}
          </div>
        ))}
      </div>
      <div className="text-xs text-[#868683] font-medium" style={{ fontFamily: "Roboto" }}>
        Maximum size 50MB<br />
        Allowed files: jpg, png, gif
      </div>
    </div>
  </div>
);

  // Step 1 Content - NO onChange handlers!
  const Step1Content = () => (
    <div className="flex flex-col p-4 gap-4 bg-white rounded-xl shadow-[0px_4px_4px_-1px_rgba(12,12,13,0.1),0px_4px_4px_-1px_rgba(12,12,13,0.05)]">
      <div className="flex justify-end items-center gap-2 pb-2 border-b border-[#D1D1D1]">
        <div className="flex items-center gap-2 flex-1">
          <svg width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.4">
              <path
                d="M21.587 3.1665H10.4137C5.56033 3.1665 2.66699 6.05984 2.66699 10.9132V22.0732C2.66699 26.9398 5.56033 29.8332 10.4137 29.8332H21.5737C26.427 29.8332 29.3203 26.9398 29.3203 22.0865V10.9132C29.3337 6.05984 26.4403 3.1665 21.587 3.1665Z"
                fill="#2BA6A4"
              />
            </g>
            <path
              d="M21.3337 15.4998H17.0003V11.1665C17.0003 10.6198 16.547 10.1665 16.0003 10.1665C15.4537 10.1665 15.0003 10.6198 15.0003 11.1665V15.4998H10.667C10.1203 15.4998 9.66699 15.9532 9.66699 16.4998C9.66699 17.0465 10.1203 17.4998 10.667 17.4998H15.0003V21.8332C15.0003 22.3798 15.4537 22.8332 16.0003 22.8332C16.547 22.8332 17.0003 22.3798 17.0003 21.8332V17.4998H21.3337C21.8803 17.4998 22.3337 17.0465 22.3337 16.4998C22.3337 15.9532 21.8803 15.4998 21.3337 15.4998Z"
              fill="#2BA6A4"
            />
          </svg>
          <div className="text-[22px] font-bold text-[#124645] leading-[33px]" style={{ fontFamily: "Cairo" }}>
            Add New Tour
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <StepIndicator />

        <div className="flex flex-col gap-4">
          <div className="flex gap-6">
            <div className="flex flex-col gap-2 flex-1">
              <FileUploadArea
                label="Cover Image"
                onUpload={(file) => handleImageUpload(0, file, true)}
                file={formData.cover_image}
                isLarge={true}
              />
            </div>
            <div className="flex-1">
              <TourImagesUpload />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col gap-1 flex-1">
              <div className="text-[20px] font-normal text-[#222E50] leading-[24px]" style={{ fontFamily: "Tai Heritage Pro" }}>
                City
              </div>
              <div className="relative">
                <select
                  ref={cityRef}
                  defaultValue={currentInputValues.step1.city_id}
                  className="w-full h-[38px] px-4 text-danim-900 border border-[#E8E7EA] rounded-lg bg-white text-[16px] font-normal appearance-none"
                  style={{ fontFamily: "Roboto" }}
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
                <ArrowDown2 size="24" color="#8A8D95" className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
              {errors.city_id && <span className="text-red-500 text-sm">{errors.city_id}</span>}
            </div>
            
            <div className="flex flex-col gap-1 flex-1">
              <div className="text-[20px] font-normal text-[#222E50] leading-[24px]" style={{ fontFamily: "Tai Heritage Pro" }}>
                Category
              </div>
              <div className="relative">
                <select
                  ref={categoryRef}
                  defaultValue={currentInputValues.step1.category_id}
                  className="w-full h-[38px] px-4 text-danim-900 border border-[#E8E7EA] rounded-lg bg-white text-[16px] font-normal appearance-none"
                  style={{ fontFamily: "Roboto" }}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <ArrowDown2 size="24" color="#8A8D95" className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
              {errors.category_id && <span className="text-red-500 text-sm">{errors.category_id}</span>}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col gap-1 flex-1">
              <div className="text-[20px] font-normal text-[#222E50] leading-[24px]" style={{ fontFamily: "Tai Heritage Pro" }}>
                Location
              </div>
              <div className="relative flex justify-end items-center gap-2 h-[38px] px-4 border border-[#E8E7EA] rounded-lg bg-white">
                <Location size="24" color="#8A8D95" />
                <input
                  ref={locationRef}
                  type="text"
                  defaultValue={currentInputValues.step1.location}
                  placeholder="Enter Location"
                  className="flex-1 text-[16px] font-normal text-danim-900 outline-none border-none"
                  style={{ fontFamily: "Roboto" }}
                />
              </div>
              {errors.location && <span className="text-red-500 text-sm">{errors.location}</span>}
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <div className="text-[20px] font-normal text-[#222E50] leading-[24px]" style={{ fontFamily: "Tai Heritage Pro" }}>
                Featured Tag (Optional)
              </div>
              <div className="relative">
                <select
                  ref={featuredTagRef}
                  defaultValue={currentInputValues.step1.featured_tag}
                  className="w-full h-[38px] px-4 text-danim-900 border border-[#E8E7EA] rounded-lg bg-white text-[16px] font-normal appearance-none"
                  style={{ fontFamily: "Roboto" }}
                >
                  <option value="">No Featured Tag</option>
                  <option value="popular">Popular</option>
                  <option value="great_value">Great Value</option>
                  <option value="new">New</option>
                </select>
                <ArrowDown2 size="24" color="#8A8D95" className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex items-center gap-6 flex-1">
              <div className="flex flex-col gap-1 flex-1">
                <div className="text-[20px] font-normal text-[#222E50] leading-[24px]" style={{ fontFamily: "Tai Heritage Pro" }}>
                  Price for adult (above 11)
                </div>
                <div className="relative flex justify-end items-center gap-2 h-[38px] px-4 border border-[#E8E7EA] rounded-lg bg-white">
                  <DollarCircle size="24" color="#8A8D95" />
                  <input
                    ref={priceAdultRef}
                    type="number"
                    defaultValue={currentInputValues.step1.price_adult}
                    placeholder="Per Person"
                    className="flex-1 text-[16px] font-normal text-danim-900 outline-none border-none"
                    style={{ fontFamily: "Roboto" }}
                    min="0"
                    step="0.01"
                  />
                </div>
                {errors.price_adult && <span className="text-red-500 text-sm">{errors.price_adult}</span>}
              </div>
              
              <div className="flex flex-col gap-1 flex-1">
                <div className="text-[20px] font-normal text-[#222E50] leading-[24px]" style={{ fontFamily: "Tai Heritage Pro" }}>
                  Price for child (5-11 years)
                </div>
                <div className="relative flex justify-end items-center gap-2 h-[38px] px-4 border border-[#E8E7EA] rounded-lg bg-white">
                  <DollarCircle size="24" color="#8A8D95" />
                  <input
                    ref={priceChildRef}
                    type="number"
                    defaultValue={currentInputValues.step1.price_child}
                    placeholder="Per child"
                    className="flex-1 text-[16px] font-normal text-danim-900 outline-none border-none"
                    style={{ fontFamily: "Roboto" }}
                    min="0"
                    step="0.01"
                  />
                </div>
                {errors.price_child && <span className="text-red-500 text-sm">{errors.price_child}</span>}
              </div>
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <div className="text-[20px] font-normal text-[#222E50] leading-[24px]" style={{ fontFamily: "Tai Heritage Pro" }}>
                Discount % (Optional)
              </div>
              <input
                ref={discountRef}
                type="number"
                defaultValue={formData.finalData.discount_percentage}
                placeholder="0"
                className="w-full h-[38px] px-4 text-danim-900 border border-[#E8E7EA] rounded-lg bg-white text-[16px] font-normal"
                style={{ fontFamily: "Roboto" }}
                min="0"
                max="100"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            onClick={handleCancel}
            className="flex justify-center items-center gap-3 flex-1 px-4 py-2 border border-[#1F7674] text-[#1F7674] bg-[#F3F3EE] hover:bg-gray-100 rounded-md text-[20px] font-semibold transition-colors"
            style={{ fontFamily: "Roboto" }}
          >
            Cancel
          </button>

          <button
            onClick={handleNext}
            className="flex justify-center items-center gap-3 flex-1 px-4 py-2 bg-[#1F7674] hover:bg-[#124645] text-[#EAF6F6] rounded-md text-[20px] font-semibold transition-colors"
            style={{ fontFamily: "Roboto" }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );

  // Language Step Content - NO onChange handlers!
  const LanguageStepContent = ({ langCode }) => {
    const language = languages.find((l) => l.code === langCode);
    // const content = formData.finalData.languages[langCode];
    const content = currentInputValues.languages[langCode];

    return (
      <div className="flex flex-col p-4 gap-4 bg-white rounded-xl shadow-[0px_4px_4px_-1px_rgba(12,12,13,0.1),0px_4px_4px_-1px_rgba(12,12,13,0.05)]">
        <div className="flex justify-end items-center gap-2 pb-2 border-b border-[#D1D1D1]">
          <div className="flex items-center gap-2 flex-1">
            <svg width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g opacity="0.4">
                <path
                  d="M21.587 3.1665H10.4137C5.56033 3.1665 2.66699 6.05984 2.66699 10.9132V22.0732C2.66699 26.9398 5.56033 29.8332 10.4137 29.8332H21.5737C26.427 29.8332 29.3203 26.9398 29.3203 22.0865V10.9132C29.3337 6.05984 26.4403 3.1665 21.587 3.1665Z"
                  fill="#2BA6A4"
                />
              </g>
              <path
                d="M21.3337 15.4998H17.0003V11.1665C17.0003 10.6198 16.547 10.1665 16.0003 10.1665C15.4537 10.1665 15.0003 10.6198 15.0003 11.1665V15.4998H10.667C10.1203 15.4998 9.66699 15.9532 9.66699 16.4998C9.66699 17.0465 10.1203 17.4998 10.667 17.4998H15.0003V21.8332C15.0003 22.3798 15.4537 22.8332 16.0003 22.8332C16.547 22.8332 17.0003 22.3798 17.0003 21.8332V17.4998H21.3337C21.8803 17.4998 22.3337 17.0465 22.3337 16.4998C22.3337 15.9532 21.8803 15.4998 21.3337 15.4998Z"
                fill="#2BA6A4"
              />
            </svg>
            <div className="text-[22px] font-bold text-[#124645] leading-[33px]" style={{ fontFamily: "Cairo" }}>
              Add New Tour
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <StepIndicator />

          <div className="flex flex-col gap-2">
            <div className="flex items-center py-3 w-[180px] h-12 gap-2">
            <img
              src={language?.flag}
              alt={language?.name}
              className="w-6 h-5 object-contain rounded-sm flex-shrink-0"
            />
            <div className="text-[20px] font-medium text-[#010818]" style={{ fontFamily: "Roboto" }}>
              {language?.name}
            </div>
          </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-6">
                <div className="flex flex-col gap-1 flex-1">
                  <div className="text-[20px] font-normal text-[#222E50] leading-[24px]" style={{ fontFamily: "Tai Heritage Pro" }}>
                    Tour Title
                  </div>
                  <input
                    ref={langRefs[langCode].title}
                    type="text"
                    defaultValue={content.title}
                    placeholder="Enter tour title"
                    className="w-full h-[38px] px-4 text-danim-900 placeholder-rose-black-200 border border-[#E8E7EA] rounded-md bg-white text-[16px] font-normal"
                    style={{ fontFamily: "Roboto" }}
                  />
                  {errors[`${langCode}.title`] && <span className="text-red-500 text-sm">{errors[`${langCode}.title`]}</span>}
                </div>
                
                {/* <div className="flex flex-col gap-1 flex-1">
                  <div className="text-[20px] font-normal text-[#222E50] leading-[24px]" style={{ fontFamily: "Tai Heritage Pro" }}>
                    Tour Category
                  </div>
                  <input
                    ref={langRefs[langCode].category}
                    type="text"
                    defaultValue={content.category}
                    placeholder="Enter category"
                    className="w-full h-[38px] px-4 text-danim-900 placeholder-rose-black-200 border border-[#E8E7EA] rounded-md bg-white text-[16px] font-normal"
                    style={{ fontFamily: "Roboto" }}
                  />
                  {errors[`${langCode}.category`] && <span className="text-red-500 text-sm">{errors[`${langCode}.category`]}</span>}
                </div> */}
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex flex-col gap-1 flex-1">
                  <div className="text-[20px] font-normal text-[#222E50] leading-[24px]" style={{ fontFamily: "Tai Heritage Pro" }}>
                    Duration
                  </div>
                  <input
                    ref={langRefs[langCode].duration}
                    type="text"
                    defaultValue={content.duration}
                    placeholder="e.g 4 hours, Full Day"
                    className="w-full h-[38px] px-4 text-danim-900 placeholder-rose-black-200  border border-[#E8E7EA] rounded-md bg-white text-[16px] font-normal"
                    style={{ fontFamily: "Roboto" }}
                  />
                  {errors[`${langCode}.duration`] && <span className="text-red-500 text-sm">{errors[`${langCode}.duration`]}</span>}
                </div>
                
                <div className="flex flex-col gap-1 flex-1">
                  <div className="text-[20px] font-normal text-[#222E50] leading-[24px]" style={{ fontFamily: "Tai Heritage Pro" }}>
                    Availability
                  </div>
                  <input
                    ref={langRefs[langCode].availability}
                    type="text"
                    defaultValue={content.availability}
                    placeholder="all days"
                    className="w-full h-[38px] px-4 text-danim-900 placeholder-rose-black-200  border border-[#E8E7EA] rounded-md bg-white text-[16px] font-normal"
                    style={{ fontFamily: "Roboto" }}
                  />
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex flex-col gap-4 flex-1">
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="text-[20px] font-normal text-[#222E50] leading-[24px]" style={{ fontFamily: "Tai Heritage Pro" }}>
                      Description & Highlights
                    </div>
                    <textarea
                      ref={langRefs[langCode].description}
                      defaultValue={content.description}
                      placeholder="Input Text"
                      rows={8}
                      className="w-full p-4 text-danim-900 placeholder-rose-black-200  border border-[#E8E7EA] rounded-md bg-white text-[16px] font-normal resize-none"
                      style={{ fontFamily: "Roboto" }}
                    />
                    {errors[`${langCode}.description`] && <span className="text-red-500 text-sm">{errors[`${langCode}.description`]}</span>}
                  </div>
                  
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="text-[20px] font-normal text-[#222E50] leading-[24px]" style={{ fontFamily: "Tai Heritage Pro" }}>
                      What's included
                    </div>
                    <textarea
                      ref={langRefs[langCode].included}
                      defaultValue={content.included}
                      placeholder="Write in points (one per line)"
                      rows={5}
                      className="w-full p-4 text-danim-900 placeholder-rose-black-200  border border-[#E8E7EA] rounded-md bg-white text-[16px] font-normal resize-none"
                      style={{ fontFamily: "Roboto" }}
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="text-[20px] font-normal text-[#222E50] leading-[24px]" style={{ fontFamily: "Tai Heritage Pro" }}>
                      What's not included
                    </div>
                    <textarea
                      ref={langRefs[langCode].not_included}
                      defaultValue={content.not_included}
                      placeholder="Write in points (one per line)"
                      rows={5}
                      className="w-full p-4 text-danim-900 placeholder-rose-black-200  border border-[#E8E7EA] rounded-md bg-white text-[16px] font-normal resize-none"
                      style={{ fontFamily: "Roboto" }}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col gap-4 flex-1">
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="text-[20px] font-normal text-[#222E50] leading-[24px]" style={{ fontFamily: "Tai Heritage Pro" }}>
                      Trip Program
                    </div>
                    <textarea
                      ref={langRefs[langCode].trip_program}
                      defaultValue={content.trip_program}
                      placeholder="Write the program in points (one per line)"
                      rows={16}
                      className="w-full p-4 text-danim-900 placeholder-rose-black-200  border border-[#E8E7EA] rounded-md bg-white text-[16px] font-normal resize-none"
                      style={{ fontFamily: "Roboto" }}
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="text-[20px] font-normal text-[#222E50] leading-[24px]" style={{ fontFamily: "Tai Heritage Pro" }}>
                      Take with you
                    </div>
                    <textarea
                      ref={langRefs[langCode].take_with_you}
                      defaultValue={content.take_with_you}
                      placeholder="Write in points (one per line)"
                      rows={5}
                      className="w-full p-4 text-danim-900 placeholder-rose-black-200  border border-[#E8E7EA] rounded-md bg-white text-[16px] font-normal resize-none"
                      style={{ fontFamily: "Roboto" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              onClick={handlePrevious}
              className="flex justify-center items-center gap-3 flex-1 px-4 py-2 border border-[#1F7674] text-[#1F7674] bg-[#F3F3EE] hover:bg-gray-100 rounded-md text-[20px] font-semibold transition-colors"
              style={{ fontFamily: "Roboto" }}
            >
              ← Previous
            </button>

            <button
              onClick={currentStep === 5 ? handleSave : handleNext}
              disabled={loading}
              className="flex justify-center items-center gap-3 flex-1 px-4 py-2 bg-[#1F7674] hover:bg-[#124645] text-[#EAF6F6] rounded-md text-[20px] font-semibold transition-colors disabled:opacity-50"
              style={{ fontFamily: "Roboto" }}
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {currentStep === 5 ? (loading ? "Saving..." : "Save Tour") : "Next →"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1Content />;
      case 2:
        return <LanguageStepContent langCode="en" />;
      case 3:
        return <LanguageStepContent langCode="ru" />;
      case 4:
        return <LanguageStepContent langCode="it" />;
      case 5:
        return <LanguageStepContent langCode="de" />;
      default:
        return <Step1Content />;
    }
  };

  return (
    <AdminLayout activeItem="Tours">
      <div className="flex flex-col items-center gap-6">
        <div className="w-full max-w-full">
          <div className="mb-6 flex justify-end">
            <button
              onClick={handleCancel}
              className="flex items-center justify-center gap-2 w-[150px] h-10 px-3 py-2 border border-[#1F7674] text-[#1F7674] bg-[#F3F3EE] hover:bg-gray-100 rounded transition-colors font-semibold text-[16px]"
              style={{ fontFamily: "Roboto" }}
            >
              <ArrowLeft size="16" color="#1F7674" />
              Back
            </button>
          </div>

          {renderStepContent()}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddTour;
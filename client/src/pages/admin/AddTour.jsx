import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "de", name: "German", flag: "🇩🇪" },
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
  const [formData, setFormData] = useState({
    city: "",
    location: "",
    priceAdult: "",
    priceChild: "",
    featuredTag: "", // NEW
    discountPercentage: "", // NEW
    coverImage: null,
    tourImages: [null, null, null, null],
    languages: {
      en: {
        title: "",
        category: "",
        duration: "",
        availability: "",
        description: "",
        included: "",
        notIncluded: "",
        tripProgram: "",
        takeWithYou: "",
      },
      ru: {
        title: "",
        category: "",
        duration: "",
        availability: "",
        description: "",
        included: "",
        notIncluded: "",
        tripProgram: "",
        takeWithYou: "",
      },
      it: {
        title: "",
        category: "",
        duration: "",
        availability: "",
        description: "",
        included: "",
        notIncluded: "",
        tripProgram: "",
        takeWithYou: "",
      },
      de: {
        title: "",
        category: "",
        duration: "",
        availability: "",
        description: "",
        included: "",
        notIncluded: "",
        tripProgram: "",
        takeWithYou: "",
      },
    },
  });

  const [errors, setErrors] = useState({});

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const updateLanguageContent = (lang, field, value) => {
    setFormData((prev) => ({
      ...prev,
      languages: {
        ...prev.languages,
        [lang]: {
          ...prev.languages[lang],
          [field]: value,
        },
      },
    }));
  };

  const handleImageUpload = (index, file, isCover = false) => {
    if (isCover) {
      updateFormData("coverImage", file);
    } else {
      const newImages = [...formData.tourImages];
      newImages[index] = file;
      updateFormData("tourImages", newImages);
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.city) newErrors.city = "City is required";
      if (!formData.location) newErrors.location = "Location is required";
      if (!formData.priceAdult)
        newErrors.priceAdult = "Adult price is required";
      if (!formData.priceChild)
        newErrors.priceChild = "Child price is required";
    }

    if (step >= 2 && step <= 5) {
      const langCode = ["en", "ru", "it", "de"][step - 2];
      const content = formData.languages[langCode];

      if (!content.title)
        newErrors[`${langCode}.title`] = "Tour title is required";
      if (!content.category)
        newErrors[`${langCode}.category`] = "Category is required";
      if (!content.duration)
        newErrors[`${langCode}.duration`] = "Duration is required";
      if (!content.description)
        newErrors[`${langCode}.description`] = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleNext = () => {
  if (currentStep >= 2 && currentStep <= 5) {
    const langCode = ['en', 'ru', 'it', 'de'][currentStep - 2];
    const validation = validateTourLanguages({ [langCode]: formData.languages[langCode] }, false);
    
    if (validation.hasErrors) {
      const missingFields = validation.errors[langCode].join(', ');
      alert(`Please fill all required fields for ${languages[currentStep - 2].name}: ${missingFields}`);
      return;
    }
  }
  
  if (validateStep(currentStep)) {
    setCurrentStep((prev) => Math.min(5, prev + 1));
  }
};

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleCancel = () => {
    navigate("/admin/tours");
  };

  const handleSave = () => {
    if (validateStep(currentStep)) {
      console.log("Saving tour:", formData);
      navigate("/admin/tours");
    }
  };

  // Step indicator component matching the Figma design exactly
  const StepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="relative w-[480px] h-8">
        {/* Connectors */}
        <div className="absolute left-4 top-[15px] w-[448px] h-0.5 flex">
          <div
            className={`w-28 h-0.5 ${currentStep > 1 ? "bg-[#2BA6A4]" : "bg-[#DDDDD9]"}`}
          />
          <div
            className={`w-28 h-0.5 ${currentStep > 2 ? "bg-[#2BA6A4]" : "bg-[#DDDDD9]"}`}
          />
          <div
            className={`w-28 h-0.5 ${currentStep > 3 ? "bg-[#2BA6A4]" : "bg-[#DDDDD9]"}`}
          />
          <div
            className={`w-28 h-0.5 ${currentStep > 4 ? "bg-[#2BA6A4]" : "bg-[#DDDDD9]"}`}
          />
        </div>

        {/* Steps */}
        <div className="absolute left-0 top-0 w-[480px] h-8 flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              {step.id === currentStep ? (
                <div className="w-8 h-8 rounded-full border-2 border-[#2BA6A4] bg-white flex items-center justify-center">
                  <div className="w-[10px] h-[10px] rounded-full bg-[#2BA6A4]" />
                </div>
              ) : step.id < currentStep ? (
                <div className="w-8 h-8 rounded-full bg-[#2BA6A4] flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M16.7071 5.29289C17.0976 5.68342 17.0976 6.31658 16.7071 6.70711L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071L3.29289 10.7071C2.90237 10.3166 2.90237 9.68342 3.29289 9.29289C3.68342 8.90237 4.31658 8.90237 4.70711 9.29289L8 12.5858L15.2929 5.29289C15.6834 4.90237 16.3166 4.90237 16.7071 5.29289Z"
                      fill="white"
                    />
                  </svg>
                </div>
              ) : (
                <div
                  className={`w-8 h-8 rounded-full border-2 ${step.id === 4 || step.id === 5 ? "border-[#ADADA9]" : "border-[#D1D5DB]"} bg-white`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // File Upload Component matching Figma design
  const FileUploadArea = ({
    label,
    onUpload,
    file,
    isLarge = false,
    isCover = false,
  }) => (
    <div className="flex flex-col gap-2">
      <div
        className="text-[22px] font-normal text-[#100147] leading-[26.4px]"
        style={{ fontFamily: "Tai Heritage Pro" }}
      >
        {label}
      </div>
      <div
        className={`border-2 border-dashed border-[#8A8D95] rounded-2xl cursor-pointer bg-white p-6 ${
          isLarge ? "h-auto" : "h-32"
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
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center gap-4">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
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
            <div
              className="text-sm text-[#2D2D3A] font-normal"
              style={{ fontFamily: "Roboto" }}
            >
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
      </div>
      {isLarge && (
        <div
          className="text-xs text-[#7F7F7F] font-medium"
          style={{ fontFamily: "Roboto" }}
        >
          The file size must not exceed 10 MB and be in PDF format.
        </div>
      )}
    </div>
  );

  // Tour Images Upload Component matching Figma design
  const TourImagesUpload = () => (
    <div className="flex flex-col gap-2">
      <div
        className="h-[26px] text-[22px] font-normal text-[#222E50] leading-[26.4px]"
        style={{ fontFamily: "Tai Heritage Pro" }}
      >
        Tour images
      </div>
      <div className="flex flex-col p-4 gap-2 border-2 border-dashed border-[#ADADA9] rounded-lg bg-white">
        <div className="flex justify-end gap-6">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`flex flex-col justify-center items-center gap-2 flex-1 p-8 border-2 border-dashed rounded-lg bg-white cursor-pointer ${
                index === 3
                  ? "border-[#E81E1E] bg-[#F3F3EE]"
                  : "border-[#868683]"
              }`}
              onClick={() => {
                if (index === 3) return; // Delete functionality
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = (e) => {
                  const file = e.target.files?.[0] || null;
                  handleImageUpload(index, file);
                };
                input.click();
              }}
            >
              {index === 3 ? (
                <svg
                  width="33"
                  height="32"
                  viewBox="0 0 33 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M28.5 7.97331C24.06 7.53331 19.5933 7.30664 15.14 7.30664C12.5 7.30664 9.86 7.43997 7.22 7.70664L4.5 7.97331"
                    stroke="#E81E1E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.833 6.6265L12.1263 4.87984C12.3397 3.61317 12.4997 2.6665 14.753 2.6665H18.2463C20.4997 2.6665 20.673 3.6665 20.873 4.89317L21.1663 6.6265"
                    stroke="#E81E1E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M25.6329 12.1865L24.7662 25.6132C24.6195 27.7065 24.4995 29.3332 20.7795 29.3332H12.2195C8.49954 29.3332 8.37954 27.7065 8.23288 25.6132L7.36621 12.1865"
                    stroke="#E81E1E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.2734 22H18.7134"
                    stroke="#E81E1E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.167 16.6665H19.8337"
                    stroke="#E81E1E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  width="33"
                  height="32"
                  viewBox="0 0 33 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.4997 13.3333C13.9724 13.3333 15.1663 12.1394 15.1663 10.6667C15.1663 9.19391 13.9724 8 12.4997 8C11.0269 8 9.83301 9.19391 9.83301 10.6667C9.83301 12.1394 11.0269 13.3333 12.4997 13.3333Z"
                    stroke="#8A8D95"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17.8337 2.6665H12.5003C5.83366 2.6665 3.16699 5.33317 3.16699 11.9998V19.9998C3.16699 26.6665 5.83366 29.3332 12.5003 29.3332H20.5003C27.167 29.3332 29.8337 26.6665 29.8337 19.9998V13.3332"
                    stroke="#8A8D95"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21.5 6.6665H28.8333"
                    stroke="#8A8D95"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M25.167 10.3333V3"
                    stroke="#8A8D95"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M4.05957 25.2666L10.6329 20.8532C11.6862 20.1466 13.2062 20.2266 14.1529 21.0399L14.5929 21.4266C15.6329 22.3199 17.3129 22.3199 18.3529 21.4266L23.8996 16.6666C24.9396 15.7732 26.6196 15.7732 27.6596 16.6666L29.8329 18.5332"
                    stroke="#8A8D95"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
        <div
          className="text-xs text-[#868683] font-medium"
          style={{ fontFamily: "Roboto" }}
        >
          Maximum size 50MB
          <br />
          Allowed files: jpg, png, xls
        </div>
      </div>
    </div>
  );

  // Step 1 Content matching Figma design
  const Step1Content = () => (
    <div className="flex flex-col p-4 gap-4 bg-white rounded-xl shadow-[0px_4px_4px_-1px_rgba(12,12,13,0.1),0px_4px_4px_-1px_rgba(12,12,13,0.05)]">
      <div className="flex justify-end items-center gap-2 pb-2 border-b border-[#D1D1D1]">
        <div className="flex items-center gap-2 flex-1">
          <svg
            width="32"
            height="33"
            viewBox="0 0 32 33"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
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
          <div
            className="text-[22px] font-bold text-[#124645] leading-[33px]"
            style={{ fontFamily: "Cairo" }}
          >
            Add New Tour
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <StepIndicator />

        <div className="flex flex-col gap-4">
          <div className="flex gap-6">
            {/* Cover Image */}
            <div className="flex flex-col gap-2 flex-1">
              <FileUploadArea
                label="Cover Image"
                onUpload={(file) => handleImageUpload(0, file, true)}
                file={formData.coverImage}
                isLarge={true}
                isCover={true}
              />
            </div>

            {/* Tour Images */}
            <div className="flex-1">
              <TourImagesUpload />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-6 flex-1">
              <div className="flex flex-col gap-1 flex-1">
                <div
                  className="text-[20px] font-normal text-[#222E50] leading-[24px]"
                  style={{ fontFamily: "Tai Heritage Pro" }}
                >
                  City
                </div>
                <div className="relative flex justify-end items-center gap-2 h-[38px] px-4 border border-[#E8E7EA] rounded-lg bg-white">
                  <div
                    className="flex-1 text-[16px] font-normal text-[#8A8D95]"
                    style={{ fontFamily: "Roboto" }}
                  >
                    Select City
                  </div>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.9201 8.94995L13.4001 15.47C12.6301 16.24 11.3701 16.24 10.6001 15.47L4.08008 8.94995"
                      stroke="#8A8D95"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex items-center gap-6 flex-1">
                <div className="flex flex-col gap-1 flex-1">
                  <div
                    className="text-[20px] font-normal text-[#222E50] leading-[24px]"
                    style={{ fontFamily: "Tai Heritage Pro" }}
                  >
                    Location
                  </div>
                  <div className="relative flex justify-end items-center gap-2 h-[38px] px-4 border border-[#E8E7EA] rounded-lg bg-white">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.9999 13.4299C13.723 13.4299 15.1199 12.0331 15.1199 10.3099C15.1199 8.58681 13.723 7.18994 11.9999 7.18994C10.2768 7.18994 8.87988 8.58681 8.87988 10.3099C8.87988 12.0331 10.2768 13.4299 11.9999 13.4299Z"
                        stroke="#8A8D95"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M3.61971 8.49C5.58971 -0.169998 18.4197 -0.159997 20.3797 8.5C21.5297 13.58 18.3697 17.88 15.5997 20.54C13.5897 22.48 10.4097 22.48 8.38971 20.54C5.62971 17.88 2.46971 13.57 3.61971 8.49Z"
                        stroke="#8A8D95"
                        strokeWidth="1.5"
                      />
                    </svg>
                    <div
                      className="flex-1 text-[16px] font-normal text-[#8A8D95]"
                      style={{ fontFamily: "Roboto" }}
                    >
                      Enter Location
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex items-center gap-6 flex-1">
              <div className="flex items-end gap-4 flex-1">
                <div className="flex flex-col gap-1 flex-1">
                  <div
                    className="text-[20px] font-normal text-[#222E50] leading-[24px]"
                    style={{ fontFamily: "Tai Heritage Pro" }}
                  >
                    Price for adult (above 11)
                  </div>
                  <div className="relative flex justify-end items-center gap-2 h-[38px] px-4 border border-[#E8E7EA] rounded-lg bg-white">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.67188 14.3298C8.67188 15.6198 9.66188 16.6598 10.8919 16.6598H13.4019C14.4719 16.6598 15.3419 15.7498 15.3419 14.6298C15.3419 13.4098 14.8119 12.9798 14.0219 12.6998L9.99187 11.2998C9.20187 11.0198 8.67188 10.5898 8.67188 9.36984C8.67188 8.24984 9.54187 7.33984 10.6119 7.33984H13.1219C14.3519 7.33984 15.3419 8.37984 15.3419 9.66984"
                        stroke="#8A8D95"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 6V18"
                        stroke="#8A8D95"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="#8A8D95"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div
                      className="flex-1 text-[16px] font-normal text-[#8A8D95]"
                      style={{ fontFamily: "Roboto" }}
                    >
                      Per Person
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-end gap-4 flex-1">
                <div className="flex flex-col gap-1 flex-1">
                  <div
                    className="text-[20px] font-normal text-[#222E50] leading-[24px]"
                    style={{ fontFamily: "Tai Heritage Pro" }}
                  >
                    Price for child (5-11 years)
                  </div>
                  <div className="relative flex justify-end items-center gap-2 h-[38px] px-4 border border-[#E8E7EA] rounded-lg bg-white">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.67188 14.3298C8.67188 15.6198 9.66188 16.6598 10.8919 16.6598H13.4019C14.4719 16.6598 15.3419 15.7498 15.3419 14.6298C15.3419 13.4098 14.8119 12.9798 14.0219 12.6998L9.99187 11.2998C9.20187 11.0198 8.67188 10.5898 8.67188 9.36984C8.67188 8.24984 9.54187 7.33984 10.6119 7.33984H13.1219C14.3519 7.33984 15.3419 8.37984 15.3419 9.66984"
                        stroke="#8A8D95"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 6V18"
                        stroke="#8A8D95"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="#8A8D95"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div
                      className="flex-1 text-[16px] font-normal text-[#8A8D95]"
                      style={{ fontFamily: "Roboto" }}
                    >
                      Per child
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons - Inside the card */}
        <div className="flex items-center gap-4 pt-4">
          <button
            onClick={currentStep === 1 ? handleCancel : handlePrevious}
            className="flex justify-center items-center gap-3 flex-1 px-4 py-2 border border-[#1F7674] text-[#1F7674] bg-[#F3F3EE] hover:bg-gray-100 rounded-md text-[20px] font-semibold transition-colors"
            style={{ fontFamily: "Roboto" }}
          >
            Cancel
          </button>

          <button
            onClick={currentStep === 5 ? handleSave : handleNext}
            className="flex justify-center items-center gap-3 flex-1 px-4 py-2 bg-[#1F7674] hover:bg-[#124645] text-[#EAF6F6] rounded-md text-[20px] font-semibold transition-colors"
            style={{ fontFamily: "Roboto" }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );

  // Language Step Content matching Figma design
  const LanguageStepContent = ({ langCode }) => {
    const language = languages.find((l) => l.code === langCode);
    const content = formData.languages[langCode];

    return (
      <div className="flex flex-col p-4 gap-4 bg-white rounded-xl shadow-[0px_4px_4px_-1px_rgba(12,12,13,0.1),0px_4px_4px_-1px_rgba(12,12,13,0.05)]">
        <div className="flex justify-end items-center gap-2 pb-2 border-b border-[#D1D1D1]">
          <div className="flex items-center gap-2 flex-1">
            <svg
              width="32"
              height="33"
              viewBox="0 0 32 33"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
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
            <div
              className="text-[22px] font-bold text-[#124645] leading-[33px]"
              style={{ fontFamily: "Cairo" }}
            >
              Add New Tour
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <StepIndicator />

          <div className="flex flex-col gap-2">
            <div className="flex items-center py-3 w-[180px] h-12 gap-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_4222_25081)">
                  <path
                    d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
                    fill="#F0F0F0"
                  />
                  <path
                    d="M11.4775 11.9996H23.9993C23.9993 10.9165 23.8549 9.86725 23.5859 8.86914H11.4775V11.9996Z"
                    fill="#D80027"
                  />
                  <path
                    d="M11.4775 5.73885H22.238C21.5034 4.54016 20.5642 3.48065 19.4691 2.6084H11.4775V5.73885Z"
                    fill="#D80027"
                  />
                  <path
                    d="M12.0001 23.9998C14.8243 23.9998 17.4201 23.0237 19.4699 21.3911H4.53027C6.58012 23.0237 9.17591 23.9998 12.0001 23.9998Z"
                    fill="#D80027"
                  />
                  <path
                    d="M1.76098 18.2603H22.2384C22.8281 17.298 23.2855 16.2462 23.5863 15.1299H0.413086C0.713883 16.2462 1.17124 17.298 1.76098 18.2603Z"
                    fill="#D80027"
                  />
                  <path
                    d="M5.55863 1.87397H6.65217L5.63498 2.61295L6.02353 3.80869L5.00639 3.0697L3.98925 3.80869L4.32487 2.7757C3.42928 3.52172 2.64431 4.39575 1.99744 5.36963H2.34783L1.70034 5.84002C1.59947 6.0083 1.50272 6.17925 1.41 6.35273L1.71919 7.30434L1.14234 6.88523C0.998953 7.18903 0.867797 7.49967 0.749906 7.81678L1.09055 8.86528H2.34783L1.33064 9.60427L1.71919 10.8L0.702047 10.061L0.0927656 10.5037C0.0317812 10.9939 0 11.4932 0 12H12C12 5.37262 12 4.59131 12 0C9.62944 0 7.41961 0.687656 5.55863 1.87397ZM6.02353 10.8L5.00639 10.061L3.98925 10.8L4.3778 9.60427L3.36061 8.86528H4.61789L5.00639 7.66955L5.39489 8.86528H6.65217L5.63498 9.60427L6.02353 10.8ZM5.63498 6.10861L6.02353 7.30434L5.00639 6.56536L3.98925 7.30434L4.3778 6.10861L3.36061 5.36963H4.61789L5.00639 4.17389L5.39489 5.36963H6.65217L5.63498 6.10861ZM10.3279 10.8L9.31073 10.061L8.29359 10.8L8.68214 9.60427L7.66495 8.86528H8.92223L9.31073 7.66955L9.69923 8.86528H10.9565L9.93933 9.60427L10.3279 10.8ZM9.93933 6.10861L10.3279 7.30434L9.31073 6.56536L8.29359 7.30434L8.68214 6.10861L7.66495 5.36963H8.92223L9.31073 4.17389L9.69923 5.36963H10.9565L9.93933 6.10861ZM9.93933 2.61295L10.3279 3.80869L9.31073 3.0697L8.29359 3.80869L8.68214 2.61295L7.66495 1.87397H8.92223L9.31073 0.678234L9.69923 1.87397H10.9565L9.93933 2.61295Z"
                    fill="#0052B4"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_4222_25081">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <div
                className="text-[20px] font-medium text-[#010818]"
                style={{ fontFamily: "Roboto" }}
              >
                {language?.name}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="h-[156px] flex flex-col gap-4">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col gap-1 flex-1">
                    <div
                      className="text-[20px] font-normal text-[#222E50] leading-[24px]"
                      style={{ fontFamily: "Tai Heritage Pro" }}
                    >
                      Tour Title
                    </div>
                    <div className="relative flex justify-end items-center gap-2 h-[38px] px-4 border border-[#E8E7EA] rounded-lg bg-white">
                      <div
                        className="flex-1 text-[16px] font-normal text-[#8A8D95]"
                        style={{ fontFamily: "Roboto" }}
                      >
                        Enter tour title
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <div
                      className="text-[20px] font-normal text-[#222E50] leading-[24px]"
                      style={{ fontFamily: "Tai Heritage Pro" }}
                    >
                      Tour Category
                    </div>
                    <div className="relative flex justify-end items-center gap-2 h-[38px] px-4 border border-[#E8E7EA] rounded-lg bg-white">
                      <div
                        className="flex-1 text-[16px] font-normal text-[#8A8D95]"
                        style={{ fontFamily: "Roboto" }}
                      >
                        Select Category
                      </div>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19.9201 8.9502L13.4001 15.4702C12.6301 16.2402 11.3701 16.2402 10.6001 15.4702L4.08008 8.9502"
                          stroke="#8A8D95"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col gap-1 flex-1">
                    <div
                      className="text-[20px] font-normal text-[#222E50] leading-[24px]"
                      style={{ fontFamily: "Tai Heritage Pro" }}
                    >
                      Duration
                    </div>
                    <div className="relative flex justify-end items-center gap-2 h-[38px] px-4 border border-[#E8E7EA] rounded-lg bg-white">
                      <div
                        className="flex-1 text-[16px] font-normal text-[#8A8D95]"
                        style={{ fontFamily: "Roboto" }}
                      >
                        e.g 4 hours, Full Day
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <div
                      className="text-[20px] font-normal text-[#222E50] leading-[24px]"
                      style={{ fontFamily: "Tai Heritage Pro" }}
                    >
                      Availbilty
                    </div>
                    <div className="relative flex justify-end items-center gap-2 h-[38px] px-4 border border-[#E8E7EA] rounded-lg bg-white">
                      <div
                        className="flex-1 text-[16px] font-normal text-[#8A8D95]"
                        style={{ fontFamily: "Roboto" }}
                      >
                        all days
                      </div>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19.9201 8.94995L13.4001 15.47C12.6301 16.24 11.3701 16.24 10.6001 15.47L4.08008 8.94995"
                          stroke="#8A8D95"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex flex-col gap-4 flex-1">
                  <div className="h-[208px] flex items-start gap-6">
                    <div className="h-[210px] flex flex-col gap-1 flex-1">
                      <div
                        className="text-[20px] font-normal text-[#222E50] leading-[24px]"
                        style={{ fontFamily: "Tai Heritage Pro" }}
                      >
                        Description & Hightlights
                      </div>
                      <div className="flex justify-end items-start gap-2 flex-1 p-4 border border-[#E8E7EA] rounded-lg bg-white">
                        <div
                          className="flex-1 text-[16px] font-normal text-[#8A8D95]"
                          style={{ fontFamily: "Roboto" }}
                        >
                          Input Text
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="h-[129px] flex items-center gap-6">
                    <div className="flex flex-col gap-1 flex-1">
                      <div
                        className="text-[20px] font-normal text-[#222E50] leading-[24px]"
                        style={{ fontFamily: "Tai Heritage Pro" }}
                      >
                        What's included
                      </div>
                      <div className="flex justify-end items-start gap-2 flex-1 p-4 border border-[#E8E7EA] rounded-lg bg-white">
                        <div
                          className="flex-1 text-[16px] font-normal text-[#8A8D95]"
                          style={{ fontFamily: "Roboto" }}
                        >
                          Write in points
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="h-[129px] flex items-center gap-6">
                    <div className="flex flex-col gap-1 flex-1">
                      <div
                        className="text-[20px] font-normal text-[#222E50] leading-[24px]"
                        style={{ fontFamily: "Tai Heritage Pro" }}
                      >
                        What's not included
                      </div>
                      <div className="flex justify-end items-start gap-2 flex-1 p-4 border border-[#E8E7EA] rounded-lg bg-white">
                        <div
                          className="flex-1 text-[16px] font-normal text-[#8A8D95]"
                          style={{ fontFamily: "Roboto" }}
                        >
                          Write in points
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4 flex-1">
                  <div className="h-[354px] flex items-center gap-6">
                    <div className="flex flex-col gap-1 flex-1">
                      <div
                        className="text-[20px] font-normal text-[#222E50] leading-[24px]"
                        style={{ fontFamily: "Tai Heritage Pro" }}
                      >
                        Trip Program
                      </div>
                      <div className="flex justify-end items-start gap-2 flex-1 p-4 border border-[#E8E7EA] rounded-lg bg-white">
                        <div
                          className="flex-1 text-[16px] font-normal text-[#8A8D95]"
                          style={{ fontFamily: "Roboto" }}
                        >
                          Write the program in points
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="h-[129px] flex items-center gap-6">
                    <div className="flex flex-col gap-1 flex-1">
                      <div
                        className="text-[20px] font-normal text-[#222E50] leading-[24px]"
                        style={{ fontFamily: "Tai Heritage Pro" }}
                      >
                        Take with you
                      </div>
                      <div className="flex justify-end items-start gap-2 flex-1 p-4 border border-[#E8E7EA] rounded-lg bg-white">
                        <div
                          className="flex-1 text-[16px] font-normal text-[#8A8D95]"
                          style={{ fontFamily: "Roboto" }}
                        >
                          Write in points
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons - Inside the card */}
          <div className="flex items-center gap-4 pt-4">
            <button
              onClick={currentStep === 1 ? handleCancel : handlePrevious}
              className="flex justify-center items-center gap-3 flex-1 px-4 py-2 border border-[#1F7674] text-[#1F7674] bg-[#F3F3EE] hover:bg-gray-100 rounded-md text-[20px] font-semibold transition-colors"
              style={{ fontFamily: "Roboto" }}
            >
              {currentStep === 1 ? "Cancel" : "← Previous"}
            </button>

            <button
              onClick={currentStep === 5 ? handleSave : handleNext}
              className="flex justify-center items-center gap-3 flex-1 px-4 py-2 bg-[#1F7674] hover:bg-[#124645] text-[#EAF6F6] rounded-md text-[20px] font-semibold transition-colors"
              style={{ fontFamily: "Roboto" }}
            >
              {currentStep === 5 ? "Save Changes" : "Next →"}
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
        <div className="w-[1104px] max-w-full">
          {/* Back Button */}
          <div className="mb-6 flex justify-end">
            <button
              onClick={handleCancel}
              className="flex items-center justify-center gap-2 w-[150px] h-10 px-3 py-2 border border-[#1F7674] text-[#1F7674] bg-[#F3F3EE] hover:bg-gray-100 rounded transition-colors font-semibold text-[16px]"
              style={{ fontFamily: "Roboto" }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.37967 3.95312L2.33301 7.99979L6.37967 12.0465"
                  stroke="#1F7674"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.6663 8H2.44629"
                  stroke="#1F7674"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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

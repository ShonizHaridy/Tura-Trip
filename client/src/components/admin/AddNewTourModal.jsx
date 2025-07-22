import React, { useState } from "react";

const AddNewTourModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    availability: "",
    duration: "",
    description: "",
    highlights: "",
    included: "",
    notIncluded: "",
    takeWith: "",
    program: "",
  });

  const languages = [
    { id: "english", name: "English", flag: "🇺🇸" },
    { id: "german", name: "German", flag: "🇩🇪" },
    { id: "russian", name: "Russian", flag: "🇷🇺" },
    { id: "italian", name: "Italian", flag: "🇮🇹" },
  ];

  const steps = [
    { id: 1, name: "Basic Info", completed: currentStep > 1 },
    { id: 2, name: "Description", completed: currentStep > 2 },
    { id: 3, name: "Details", completed: currentStep > 3 },
    { id: 4, name: "Review", completed: currentStep > 4 },
    { id: 5, name: "Complete", completed: false },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving tour data:", formData);
    onClose();
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step.id === currentStep
                ? "bg-teal-600 text-white"
                : step.completed
                  ? "bg-teal-600 text-white"
                  : "bg-gray-300 text-gray-600"
            }`}
          >
            {step.completed ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              step.id
            )}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-16 h-1 mx-2 ${step.completed ? "bg-teal-600" : "bg-gray-300"}`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderLanguageSelector = () => (
    <div className="mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <span className={`text-2xl`}>
          {languages.find((lang) => lang.id === selectedLanguage)?.flag}
        </span>
        <span className="font-medium text-gray-900">
          {languages.find((lang) => lang.id === selectedLanguage)?.name}
        </span>
      </div>
    </div>
  );

  const renderFormContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {renderLanguageSelector()}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tour Title
                </label>
                <input
                  type="text"
                  placeholder="Enter tour title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tour Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select Category</option>
                  <option value="sea-excursions">Sea Excursions</option>
                  <option value="historical-cities">Historical Cities</option>
                  <option value="safari-adventure">Safari & Adventure</option>
                  <option value="entertainment-spa">Entertainment & Spa</option>
                  <option value="transfer">Transfer</option>
                  <option value="individual">Individual</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  placeholder="e.g 4 hours, Full Day"
                  value={formData.duration}
                  onChange={(e) =>
                    handleInputChange("duration", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <select
                  value={formData.availability}
                  onChange={(e) =>
                    handleInputChange("availability", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">all days</option>
                  <option value="daily">Daily</option>
                  <option value="weekdays">Weekdays Only</option>
                  <option value="weekends">Weekends Only</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {renderLanguageSelector()}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description & Highlights
                </label>
                <textarea
                  placeholder={
                    currentStep === 1
                      ? "Input text"
                      : "Write city description and highlights"
                  }
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trip Program
                </label>
                <textarea
                  placeholder="Write the program in points"
                  value={formData.program}
                  onChange={(e) => handleInputChange("program", e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What's included
                </label>
                <textarea
                  placeholder="Write in points"
                  value={formData.included}
                  onChange={(e) =>
                    handleInputChange("included", e.target.value)
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Take with you
                </label>
                <textarea
                  placeholder="Write in points"
                  value={formData.takeWith}
                  onChange={(e) =>
                    handleInputChange("takeWith", e.target.value)
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What's not included
              </label>
              <textarea
                placeholder="Write in points"
                value={formData.notIncluded}
                onChange={(e) =>
                  handleInputChange("notIncluded", e.target.value)
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-teal-600 rounded-md flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Add New Tour
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderStepIndicator()}
          {renderFormContent()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === 1 ? "Cancel" : "← Back"}
          </button>
          <button
            onClick={currentStep === steps.length - 1 ? handleSave : handleNext}
            className="px-6 py-2 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700 transition-colors"
          >
            {currentStep === steps.length - 1 ? "Save" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewTourModal;

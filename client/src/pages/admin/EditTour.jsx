// src/pages/admin/EditTour.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

// Sample data for editing
const sampleData = {
  city: "hurghada",
  location: "Makady Bay, Hurghada 46628 Egypt",
  priceAdult: "50",
  priceChild: "25",
  coverImage: "cover.jpg",
  tourImages: [
    "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=300",
    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300",
  ],
  languages: {
    en: {
      title: "Diving the Whole Day",
      category: "sea-excursions",
      duration: "Full Day",
      availability: "all-days",
      description:
        "Kick up the desert dust as you race across the sands on your own all-terrain vehicle (ATV) on this thrilling adrenaline safari, with door-to-door transfers from Hurghada hotels. Learn the basics and take a test drive before your guide leads you on a 12-mile (20-kilometer) journey across the desert to a Bedouin village.",
      included: "• Masks\n• Fins\n• Diving Suits",
      notIncluded:
        "• Hotel Pick-up & Drop-off\n• Air-conditioned vehicle\n• Camel Ride\n• Bedouin Village & Bedouin Tea\n• Quad Bike Ride\n• Lunch & Drinks on Yacht",
      tripProgram:
        "• Transfer approximately 08:30\n• Accommodation on the yacht and departure to the sea, around 10:00\n• Two snorkeling stops on the reefs, lasting about one hour each\n• Disembarkation on the island for rest and swimming from the shore\n• Lunch and drinks on the yacht\n• Return to the hotel around 17:00",
      takeWithYou:
        "• Swim Suit, Towel, Water, Sunscreen, Sunglasses\n• Diving Suits and Snorkeling fins available to rent on site",
    },
    ru: {
      title: "Дайвинг целый день",
      category: "морские-экскурсии",
      duration: "Полный день",
      availability: "все-дни",
      description:
        "Наслаждайтесь дайвингом в Красном море и откройте для себя удивительные коралловые рифы",
      included: "• Маски для дайвинга\n• Ласты\n• Костю��ы для дайвинга",
      notIncluded: "• Трансфер из отеля\n• Напитки\n• Обед",
      tripProgram: "Подробная программа экскурсии",
      takeWithYou: "• Купальный костюм\n• Полотенце\n• Солнцезащитный крем",
    },
    it: {
      title: "Immersioni per tutto il giorno",
      category: "escursioni-marine",
      duration: "Giornata intera",
      availability: "tutti-i-giorni",
      description:
        "Goditi le immersioni nel Mar Rosso e scopri le barriere coralline",
      included: "• Maschere\n• Pinne\n• Mute da sub",
      notIncluded: "• Trasferimento dall'hotel\n• Bevande\n• Pranzo",
      tripProgram: "Programma dettagliato dell'escursione",
      takeWithYou: "• Costume da bagno\n• Asciugamano\n• Crema solare",
    },
    de: {
      title: "Ganztägiges Tauchen",
      category: "meeresausflüge",
      duration: "Ganzer Tag",
      availability: "alle-tage",
      description:
        "Genießen Sie das Tauchen im Roten Meer und entdecken Sie Korallenriffe",
      included: "• Masken\n• Flossen\n• Tauchanzüge",
      notIncluded: "• Hoteltransfer\n• Getränke\n• Mittagessen",
      tripProgram: "Detailliertes Ausflugsprogramm",
      takeWithYou: "• Badeanzug\n• Handtuch\n• Sonnencreme",
    },
  },
};

const EditTour = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(sampleData);
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

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleCancel = () => {
    navigate("/admin/tours");
  };

  const handleSave = () => {
    // TODO: Save tour changes
    console.log("Saving tour changes:", formData);
    navigate("/admin/tours");
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center gap-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                  step.id < currentStep
                    ? "bg-teal-600 border-teal-600 text-white"
                    : step.id === currentStep
                      ? "bg-white border-teal-600 text-teal-600"
                      : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                {step.id < currentStep ? (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
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
              <span className="text-xs mt-1 text-center">{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-20 h-0.5 mx-4 ${step.id < currentStep ? "bg-teal-600" : "bg-gray-300"}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const Step1Content = () => (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <svg
            className="w-8 h-8 text-teal-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <h2 className="text-xl font-bold text-gray-800">Edit Tour</h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded">
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            Active
          </span>
        </div>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tour Cover */}
          <div className="space-y-4">
            <label className="text-lg font-medium text-gray-700">
              Tour Cover
            </label>
            <div className="border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 2v6h6V2M9 9h6v6H9V9zm6 7v6h6v-6h-6z"
                    />
                  </svg>
                  <div>
                    <div className="font-bold text-gray-800">Cover Image</div>
                    <div className="text-xs text-gray-500">Uploaded</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-600 hover:text-red-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tour Images */}
          <div className="space-y-4">
            <label className="text-lg font-medium text-gray-700">
              Tour Images
            </label>
            <div className="flex gap-3">
              {formData.tourImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Tour ${index + 1}`}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <button className="absolute -top-1 -right-1 w-6 h-6 bg-white/75 rounded-sm flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              <div className="w-24 h-24 border border-dashed border-gray-300 rounded flex items-center justify-center relative">
                <button className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center shadow">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-lg font-medium text-gray-700">City</label>
            <select
              value={formData.city}
              onChange={(e) => updateFormData("city", e.target.value)}
              className="w-full h-10 px-3 border border-gray-300 rounded-lg"
            >
              <option value="cairo">Cairo</option>
              <option value="alexandria">Alexandria</option>
              <option value="luxor">Luxor</option>
              <option value="aswan">Aswan</option>
              <option value="hurghada">Hurghada</option>
              <option value="sharm">Sharm El Sheikh</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-lg font-medium text-gray-700">
              Location
            </label>
            <div className="relative">
              <input
                value={formData.location}
                onChange={(e) => updateFormData("location", e.target.value)}
                className="w-full h-10 pl-10 pr-3 border border-gray-300 rounded-lg"
                disabled
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-lg font-medium text-gray-700">
              Price for adult (above 11)
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.priceAdult}
                onChange={(e) => updateFormData("priceAdult", e.target.value)}
                placeholder="Per Person"
                className="w-full h-10 pl-10 pr-3 border border-gray-300 rounded-lg"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-lg font-medium text-gray-700">
              Price for child (5-11 years)
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.priceChild}
                onChange={(e) => updateFormData("priceChild", e.target.value)}
                placeholder="Per child"
                className="w-full h-10 pl-10 pr-3 border border-gray-300 rounded-lg"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const LanguageStepContent = ({ langCode }) => {
    const language = languages.find((l) => l.code === langCode);
    const content = formData.languages[langCode];

    return (
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
          <svg
            className="w-8 h-8 text-teal-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <h2 className="text-xl font-bold text-gray-800">Edit Tour</h2>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 py-3">
            <span className="text-2xl">{language?.flag}</span>
            <span className="text-lg font-medium text-gray-800">
              {language?.name}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-lg font-medium text-gray-700">
                Tour Title
              </label>
              <input
                value={content.title}
                onChange={(e) =>
                  updateLanguageContent(langCode, "title", e.target.value)
                }
                className="w-full h-10 px-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-lg font-medium text-gray-700">
                Tour Category
              </label>
              <select
                value={content.category}
                onChange={(e) =>
                  updateLanguageContent(langCode, "category", e.target.value)
                }
                className="w-full h-10 px-3 border border-gray-300 rounded-lg"
              >
                <option value="adventure">Adventure</option>
                <option value="cultural">Cultural</option>
                <option value="historical">Historical</option>
                <option value="religious">Religious</option>
                <option value="wildlife">Wildlife</option>
                <option value="beach">Beach</option>
                <option value="sea-excursions">Sea Excursions</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-lg font-medium text-gray-700">
                Duration
              </label>
              <input
                value={content.duration}
                onChange={(e) =>
                  updateLanguageContent(langCode, "duration", e.target.value)
                }
                className="w-full h-10 px-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-lg font-medium text-gray-700">
                Availability
              </label>
              <input
                value={content.availability}
                onChange={(e) =>
                  updateLanguageContent(
                    langCode,
                    "availability",
                    e.target.value,
                  )
                }
                className="w-full h-10 px-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-lg font-medium text-gray-700">
                  Description & Highlights
                </label>
                <textarea
                  value={content.description}
                  onChange={(e) =>
                    updateLanguageContent(
                      langCode,
                      "description",
                      e.target.value,
                    )
                  }
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="text-lg font-medium text-gray-700">
                  What's included
                </label>
                <textarea
                  value={content.included}
                  onChange={(e) =>
                    updateLanguageContent(langCode, "included", e.target.value)
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="text-lg font-medium text-gray-700">
                  What's not included
                </label>
                <textarea
                  value={content.notIncluded}
                  onChange={(e) =>
                    updateLanguageContent(
                      langCode,
                      "notIncluded",
                      e.target.value,
                    )
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-lg font-medium text-gray-700">
                  Trip Program
                </label>
                <textarea
                  value={content.tripProgram}
                  onChange={(e) =>
                    updateLanguageContent(
                      langCode,
                      "tripProgram",
                      e.target.value,
                    )
                  }
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="text-lg font-medium text-gray-700">
                  Take with you
                </label>
                <textarea
                  value={content.takeWithYou}
                  onChange={(e) =>
                    updateLanguageContent(
                      langCode,
                      "takeWithYou",
                      e.target.value,
                    )
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
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
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 px-4 py-2 border border-teal-600 text-teal-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>
        </div>

        <StepIndicator />
        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6">
          <button
            onClick={currentStep === 1 ? handleCancel : handlePrevious}
            className="px-8 py-3 border border-teal-600 text-teal-600 bg-gray-50 hover:bg-gray-100 rounded-lg text-lg font-semibold transition-colors"
          >
            {currentStep === 1 ? "Cancel" : "← Previous"}
          </button>

          <button
            onClick={currentStep === 5 ? handleSave : handleNext}
            className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-lg font-semibold transition-colors"
          >
            {currentStep === 5 ? "Save Changes" : "Next →"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditTour;

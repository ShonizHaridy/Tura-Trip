// src/pages/admin/ViewTour.jsx
import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";

const ViewTour = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  // Sample tour data - would be fetched from API based on id
  const tour = {
    id: 1,
    title: "Diving the Whole Day",
    city: "Hurghada",
    location: "Makady Bay, Hurghada 46628 Egypt",
    priceAdult: "50 USD",
    priceChild: "25 USD",
    status: "Active",
    coverImage:
      "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800",
    tourImages: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300",
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300",
      "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=300",
    ],
    languages: {
      en: {
        title: "Diving the Whole Day",
        category: "Sea Excursions",
        duration: "Full Day",
        availability: "all days",
        description:
          "Kick up the desert dust as you race across the sands on your own all-terrain vehicle (ATV) on this thrilling adrenaline safari, with door-to-door transfers from Hurghada hotels. Learn the basics and take a test drive before your guide leads you on a 12-mile (20-kilometer) journey across the desert to a Bedouin village. Refresh with water and Bedouin tea and take a camel ride before you head back through the sand to the start point.",
        included: "Masks\nFins\nDiving Suits",
        notIncluded:
          "Hotel Pick-up & Drop-off\nAir-conditioned vehicle\nCamel Ride\nBedouin Village & Bedouin Tea\nQuad Bike Ride\nLunch & Drinks on Yacht",
        tripProgram:
          "Transfer approximately 08:30 (the exact time is announced after booking; the road to the port is from 10 to 40 minutes, depending on the location of the hotel)\nAccommodation on the yacht and departure to the sea, around 10:00 (subject to the permission of the tourist police)\nTwo snorkeling stops on the reefs, lasting about one hour each (at the discretion of the guide on site)\nDisembarkation on the island for rest and swimming from the shore, about 1-1.5 hours (standard time for group excursions)\nLunch and drinks on the yacht (various salads, rice, pasta, nuggets, fish/meat sausages; cola, Pepsi, water, tea, coffee)\nRide on an inflatable banana and a tablet (standard one lap for all sea group programs in Hurghada)\nReturn to the hotel around 17:00 (time may vary slightly).",
        takeWithYou:
          "Swim Suit, Towel, Water, Sunscreen, Sunglasses\nDiving Suits and Snorkeling fins available to rent on site",
      },
      ru: {
        title: "Дайвинг целый день",
        category: "Морские экскурсии",
        duration: "Полный де��ь",
        availability: "все дни",
        description:
          "Наслаждайтесь дайвингом в Красном море и откройте для себя удивительные коралловые рифы",
        included: "Маски для дайвинга\nЛасты\nКостюмы для дайвинга",
        notIncluded: "Трансфер из отеля\nНапитки\nОбед",
        tripProgram: "Подробная программа экскурсии",
        takeWithYou: "Купальный костюм\nПолотенце\nСолнцезащитный крем",
      },
      it: {
        title: "Immersioni per tutto il giorno",
        category: "Escursioni marine",
        duration: "Giornata intera",
        availability: "tutti i giorni",
        description:
          "Goditi le immersioni nel Mar Rosso e scopri le barriere coralline",
        included: "Maschere\nPinne\nMute da sub",
        notIncluded: "Trasferimento dall'hotel\nBevande\nPranzo",
        tripProgram: "Programma dettagliato dell'escursione",
        takeWithYou: "Costume da bagno\nAsciugamano\nCrema solare",
      },
      de: {
        title: "Ganztägiges Tauchen",
        category: "Meeresausflüge",
        duration: "Ganzer Tag",
        availability: "alle Tage",
        description:
          "Genießen Sie das Tauchen im Roten Meer und entdecken Sie Korallenriffe",
        included: "Masken\nFlossen\nTauchanzüge",
        notIncluded: "Hoteltransfer\nGetränke\nMittagessen",
        tripProgram: "Detailliertes Ausflugsprogramm",
        takeWithYou: "Badeanzug\nHandtuch\nSonnencreme",
      },
    },
  };

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ru", name: "Russian", flag: "🇷🇺" },
    { code: "it", name: "Italian", flag: "🇮🇹" },
    { code: "de", name: "German", flag: "🇩🇪" },
  ];

  const currentLanguage = tour.languages[selectedLanguage] || tour.languages.en;

  return (
    <AdminLayout activeItem="Tours">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <Link
            to={`/admin/tours/edit/${id}`}
            className="flex items-center gap-2 px-4 py-2 rounded text-white bg-teal-600 hover:bg-teal-700 transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={() => navigate("/admin/tours")}
            className="flex items-center gap-2 px-3 py-2 rounded border border-teal-600 bg-gray-50 text-teal-600 hover:bg-gray-100 transition-colors"
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

        {/* Tour View Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Card Header */}
          <div className="flex justify-between items-center pb-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded bg-teal-600">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path
                    d="M28.3332 12.2C25.2532 7.36003 20.7465 4.57336 15.9998 4.57336C13.6265 4.57336 11.3198 5.2667 9.21317 6.56003C7.1065 7.8667 5.21317 9.77336 3.6665 12.2C2.33317 14.2934 2.33317 17.6934 3.6665 19.7867C6.7465 24.64 11.2532 27.4134 15.9998 27.4134C18.3732 27.4134 20.6798 26.72 22.7865 25.4267C24.8932 24.12 26.7865 22.2134 28.3332 19.7867C29.6665 17.7067 29.6665 14.2934 28.3332 12.2ZM15.9998 21.3867C13.0132 21.3867 10.6132 18.9734 10.6132 16C10.6132 13.0267 13.0132 10.6134 15.9998 10.6134C18.9865 10.6134 21.3865 13.0267 21.3865 16C21.3865 18.9734 18.9865 21.3867 15.9998 21.3867Z"
                    fill="white"
                    fillOpacity="0.4"
                  />
                  <path
                    d="M16.0002 12.1866C13.9069 12.1866 12.2002 13.8933 12.2002 16C12.2002 18.0933 13.9069 19.8 16.0002 19.8C18.0935 19.8 19.8135 18.0933 19.8135 16C19.8135 13.9066 18.0935 12.1866 16.0002 12.1866Z"
                    fill="white"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">View Tour</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 rounded-xl text-xs bg-green-100 text-green-800">
                {tour.status}
              </span>
            </div>
          </div>

          {/* Images Section */}
          <div className="flex gap-4 mt-6">
            {/* Cover Image */}
            <div className="flex-1">
              <h3 className="text-xl font-medium mb-4 text-gray-700">
                Cover Image
              </h3>
              <div className="w-full h-48 rounded-lg overflow-hidden">
                <img
                  src={tour.coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Tour Images */}
            <div className="flex-1">
              <h3 className="text-xl font-medium mb-4 text-gray-700">
                Tour Images
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {tour.tourImages.map((image, index) => (
                  <div
                    key={index}
                    className="w-full h-24 rounded overflow-hidden"
                  >
                    <img
                      src={image}
                      alt={`Tour ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Location and Pricing */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-xl font-medium mb-2 text-gray-700">
                City
              </label>
              <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                <span className="text-gray-600">{tour.city}</span>
              </div>
            </div>
            <div>
              <label className="block text-xl font-medium mb-2 text-gray-700">
                Location
              </label>
              <div className="p-3 rounded-lg border border-gray-200 bg-gray-50 flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
                <span className="text-gray-600">{tour.location}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-4">
            <div>
              <label className="block text-xl font-medium mb-2 text-gray-700">
                Price for adult (above 11)
              </label>
              <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                <span className="text-gray-600">{tour.priceAdult}</span>
              </div>
            </div>
            <div>
              <label className="block text-xl font-medium mb-2 text-gray-700">
                Price for child (5-11 years)
              </label>
              <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                <span className="text-gray-600">{tour.priceChild}</span>
              </div>
            </div>
          </div>

          {/* Language Selection */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4 p-3">
              <div className="relative">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
                <svg
                  className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Tour Details */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xl font-medium mb-2 text-gray-700">
                  Tour Title
                </label>
                <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                  <span className="text-gray-600">{currentLanguage.title}</span>
                </div>
              </div>
              <div>
                <label className="block text-xl font-medium mb-2 text-gray-700">
                  Tour Category
                </label>
                <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                  <span className="text-gray-600">
                    {currentLanguage.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block text-xl font-medium mb-2 text-gray-700">
                  Duration
                </label>
                <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                  <span className="text-gray-600">
                    {currentLanguage.duration}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-xl font-medium mb-2 text-gray-700">
                  Availability
                </label>
                <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                  <span className="text-gray-600">
                    {currentLanguage.availability}
                  </span>
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-xl font-medium mb-2 text-gray-700">
                    Description & Highlights
                  </label>
                  <div className="p-3 rounded-lg border border-gray-200 bg-gray-50 min-h-48">
                    <span className="text-gray-600 whitespace-pre-line">
                      {currentLanguage.description}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-xl font-medium mb-2 text-gray-700">
                    What's included
                  </label>
                  <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                    <span className="text-gray-600 whitespace-pre-line">
                      {currentLanguage.included}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-xl font-medium mb-2 text-gray-700">
                    What's not included
                  </label>
                  <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                    <span className="text-gray-600 whitespace-pre-line">
                      {currentLanguage.notIncluded}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xl font-medium mb-2 text-gray-700">
                    Trip Program
                  </label>
                  <div className="p-3 rounded-lg border border-gray-200 bg-gray-50 min-h-80">
                    <span className="text-gray-600 whitespace-pre-line">
                      {currentLanguage.tripProgram}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-xl font-medium mb-2 text-gray-700">
                    Take with you
                  </label>
                  <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                    <span className="text-gray-600 whitespace-pre-line">
                      {currentLanguage.takeWithYou}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ViewTour;

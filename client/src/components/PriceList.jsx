// src/components/PriceList.jsx
import React from "react";
import { useTranslation } from "react-i18next";

const PriceList = ({ isOpen, onClose, pricesData = [] }) => {
  const { t } = useTranslation();

  const getCityDisplayName = () => {
    console.log("Prices Data:", pricesData);
  if (pricesData.length === 1) {
    return pricesData[0].city_name;
  } else if (pricesData.length > 1) {
    return t("priceList.allCities"); // Add this translation
  }
  return t("priceList.priceList"); // Fallback
};

  // Fallback data if no pricesData provided
  const defaultExcursions = [
    {
      name: "Jerusalem from Hurghada",
      adultPrice: "$250",
      childPrice: "$100",
    },
    {
      name: "Luxor (different programs) + $2 discount on another excursion",
      adultPrice: "$40",
      childPrice: "from $20",
    },
  ];

  // Transform API data to component format
  const excursions = pricesData.length > 0 
    ? pricesData.flatMap(city => 
        city.tours?.map(tour => ({
          name: tour.title || "Tour",
          adultPrice: `$${tour.price_adult}`,
          childPrice: `$${tour.price_child}`,
        })) || []
      )
    : defaultExcursions;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-4 md:p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-300 mb-6">
          <div className="flex items-center gap-2">
            <svg
              width="24"
              height="25"
              viewBox="0 0 32 33"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 md:w-8 md:h-8"
            >
              <path
                opacity="0.4"
                d="M15.9998 29.7C23.3636 29.7 29.3332 23.7305 29.3332 16.3667C29.3332 9.00286 23.3636 3.03333 15.9998 3.03333C8.63604 3.03333 2.6665 9.00286 2.6665 16.3667C2.6665 23.7305 8.63604 29.7 15.9998 29.7Z"
                fill="#3F62AE"
              />
              <path
                d="M19.0135 16.5L17.0002 15.7933V11.2733H17.4802C18.5602 11.2733 19.4402 12.22 19.4402 13.38C19.4402 13.9267 19.8935 14.38 20.4402 14.38C20.9869 14.38 21.4402 13.9267 21.4402 13.38C21.4402 11.1133 19.6669 9.27333 17.4802 9.27333H17.0002V8.5C17.0002 7.95333 16.5469 7.5 16.0002 7.5C15.4535 7.5 15.0002 7.95333 15.0002 8.5V9.27333H14.1335C12.1602 9.27333 10.5469 10.94 10.5469 12.98C10.5469 15.3667 11.9335 16.1267 12.9869 16.5L15.0002 17.2067V21.7133H14.5202C13.4402 21.7133 12.5602 20.7667 12.5602 19.6067C12.5602 19.06 12.1069 18.6067 11.5602 18.6067C11.0135 18.6067 10.5602 19.06 10.5602 19.6067C10.5602 21.8733 12.3335 23.7133 14.5202 23.7133H15.0002V24.5C15.0002 25.0467 15.4535 25.5 16.0002 25.5C16.5469 25.5 17.0002 25.0467 17.0002 24.5V23.7267H17.8669C19.8402 23.7267 21.4535 22.06 21.4535 20.02C21.4402 17.62 20.0535 16.86 19.0135 16.5ZM13.6535 14.62C12.9735 14.38 12.5602 14.1533 12.5602 12.9933C12.5602 12.0467 13.2669 11.2867 14.1469 11.2867H15.0135V15.1L13.6535 14.62ZM17.8669 21.7267H17.0002V17.9133L18.3469 18.38C19.0269 18.62 19.4402 18.8467 19.4402 20.0067C19.4402 20.9533 18.7335 21.7267 17.8669 21.7267Z"
                fill="#3F62AE"
              />
            </svg>
            <h2 className="text-lg md:text-[22px] font-bold text-[#2D467C] font-cairo">
                {t("priceList.titleWithCity", { city: getCityDisplayName() })}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#145DA0] hover:bg-gray-100 p-1 rounded"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 md:w-8 md:h-8"
            >
              <path
                opacity="0.4"
                d="M21.5865 2.66669H10.4132C5.55984 2.66669 2.6665 5.56002 2.6665 10.4134V21.5734C2.6665 26.44 5.55984 29.3334 10.4132 29.3334H21.5732C26.4265 29.3334 29.3198 26.44 29.3198 21.5867V10.4134C29.3332 5.56002 26.4398 2.66669 21.5865 2.66669Z"
                fill="#145DA0"
              />
              <path
                d="M17.4133 16L20.48 12.9333C20.8666 12.5466 20.8666 11.9066 20.48 11.52C20.0933 11.1333 19.4533 11.1333 19.0666 11.52L16 14.5866L12.9333 11.52C12.5466 11.1333 11.9066 11.1333 11.52 11.52C11.1333 11.9066 11.1333 12.5466 11.52 12.9333L14.5866 16L11.52 19.0666C11.1333 19.4533 11.1333 20.0933 11.52 20.48C11.72 20.68 11.9733 20.7733 12.2266 20.7733C12.48 20.7733 12.7333 20.68 12.9333 20.48L16 17.4133L19.0666 20.48C19.2666 20.68 19.52 20.7733 19.7733 20.7733C20.0266 20.7733 20.28 20.68 20.48 20.48C20.8666 20.0933 20.8666 19.4533 20.48 19.0666L17.4133 16Z"
                fill="#145DA0"
              />
            </svg>
          </button>
        </div>

        {/* Historical Banner */}
        <div className="mb-4">
          <div className="bg-[#BEE3E3] rounded-[10px] px-2 py-3 md:py-4 flex justify-center items-center">
            <h3 className="text-[#120E2B] text-center font-cairo text-lg md:text-[20px] font-bold">
              {t("priceList.historical")}
            </h3>
          </div>
        </div>

        {/* Mobile Cards Layout */}
        <div className="block md:hidden space-y-4">
          {excursions.map((excursion, index) => (
            <div
              key={index}
              className="bg-white border border-[#E6E6E8] rounded-lg p-4"
            >
              <h4 className="text-[#555A64] font-roboto text-sm font-medium mb-3">
                {excursion.name}
              </h4>
              <div className="flex justify-between items-center">
                <div className="text-center">
                  <div className="text-[#010818] font-roboto text-xs font-medium mb-1">
                    {t("priceList.adults")}
                  </div>
                  <div className="text-[#2D467C] font-roboto text-sm font-medium">
                    {excursion.adultPrice}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[#010818] font-roboto text-xs font-medium mb-1">
                    {t("priceList.children")}
                  </div>
                  <div className="text-[#2D467C] font-roboto text-sm font-medium">
                    {excursion.childPrice}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden md:block border border-[#E6E6E8] rounded-lg bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <div className="flex min-w-[600px]">
              {/* Excursion Column */}
              <div className="flex-1 min-w-[300px]">
                <div className="bg-[#ECEFF7] px-4 py-3 border-b border-[#E6E6E8]">
                  <div className="text-[#010818] font-roboto text-[16px] leading-[19.2px]">
                    {t("priceList.excursion")}
                  </div>
                </div>
                {excursions.map((excursion, index) => (
                  <div
                    key={index}
                    className="px-4 py-4 border-b border-[#E6E6E8] last:border-b-0"
                  >
                    <div className="text-[#555A64] font-roboto text-[16px] leading-[19.2px]">
                      {excursion.name}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Adults Column */}
              <div className="w-px bg-[#E6E6E8]"></div>
              <div className="w-48">
                <div className="bg-[#ECEFF7] px-4 py-3 border-b border-[#E6E6E8]">
                  <div className="text-[#010818] font-roboto text-[16px] leading-[19.2px]">
                    {t("priceList.priceAdults")}
                  </div>
                </div>
                {excursions.map((excursion, index) => (
                  <div
                    key={index}
                    className="px-4 py-4 border-b border-[#E6E6E8] last:border-b-0"
                  >
                    <div className="text-[#2D467C] font-roboto text-[16px] leading-[19.2px]">
                      {excursion.adultPrice}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Children Column */}
              <div className="w-px bg-[#E6E6E8]"></div>
              <div className="w-48">
                <div className="bg-[#ECEFF7] px-4 py-3 border-b border-[#E6E6E8]">
                  <div className="text-[#010818] font-roboto text-[16px] leading-[19.2px]">
                    {t("priceList.priceChildren")}
                  </div>
                </div>
                {excursions.map((excursion, index) => (
                  <div
                    key={index}
                    className="px-4 py-4 border-b border-[#E6E6E8] last:border-b-0"
                  >
                    <div className="text-[#2D467C] font-roboto text-[16px] leading-[19.2px]">
                      {excursion.childPrice}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceList;
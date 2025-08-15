// src/components/PriceList.jsx - Updated version
import React from "react";
import { useTranslation } from "react-i18next";

const PriceList = ({ isOpen, onClose, pricesData = [] }) => {
  const { t } = useTranslation();

  const getCityDisplayName = () => {
    if (pricesData.length === 1) {
      return pricesData[0].city_name;
    } else if (pricesData.length > 1) {
      return t("priceList.allCities");
    }
    return t("priceList.priceList");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-60">
      <div className="bg-white rounded-xl p-4 md:p-8 w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-300 mb-6">
          <div className="flex items-center gap-2">
            <svg width="24" height="25" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-8 md:h-8">
              <path opacity="0.4" d="M15.9998 29.7C23.3636 29.7 29.3332 23.7305 29.3332 16.3667C29.3332 9.00286 23.3636 3.03333 15.9998 3.03333C8.63604 3.03333 2.6665 9.00286 2.6665 16.3667C2.6665 23.7305 8.63604 29.7 15.9998 29.7Z" fill="#3F62AE"/>
              <path d="M19.0135 16.5L17.0002 15.7933V11.2733H17.4802C18.5602 11.2733 19.4402 12.22 19.4402 13.38C19.4402 13.9267 19.8935 14.38 20.4402 14.38C20.9869 14.38 21.4402 13.9267 21.4402 13.38C21.4402 11.1133 19.6669 9.27333 17.4802 9.27333H17.0002V8.5C17.0002 7.95333 16.5469 7.5 16.0002 7.5C15.4535 7.5 15.0002 7.95333 15.0002 8.5V9.27333H14.1335C12.1602 9.27333 10.5469 10.94 10.5469 12.98C10.5469 15.3667 11.9335 16.1267 12.9869 16.5L15.0002 17.2067V21.7133H14.5202C13.4402 21.7133 12.5602 20.7667 12.5602 19.6067C12.5602 19.06 12.1069 18.6067 11.5602 18.6067C11.0135 18.6067 10.5602 19.06 10.5602 19.6067C10.5602 21.8733 12.3335 23.7133 14.5202 23.7133H15.0002V24.5C15.0002 25.0467 15.4535 25.5 16.0002 25.5C16.5469 25.5 17.0002 25.0467 17.0002 24.5V23.7267H17.8669C19.8402 23.7267 21.4535 22.06 21.4535 20.02C21.4402 17.62 20.0535 16.86 19.0135 16.5Z" fill="#3F62AE"/>
            </svg>
            <h2 className="text-lg md:text-[22px] font-bold text-[#2D467C] font-cairo">
              {t("priceList.titleWithCity", { city: getCityDisplayName() })}
            </h2>
          </div>
          <button onClick={onClose} className="text-[#145DA0] hover:bg-gray-100 p-1 rounded">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-8 md:h-8">
              <path opacity="0.4" d="M21.5865 2.66669H10.4132C5.55984 2.66669 2.6665 5.56002 2.6665 10.4134V21.5734C2.6665 26.44 5.55984 29.3334 10.4132 29.3334H21.5732C26.4265 29.3334 29.3198 26.44 29.3198 21.5867V10.4134C29.3332 5.56002 26.4398 2.66669 21.5865 2.66669Z" fill="#145DA0"/>
              <path d="M17.4133 16L20.48 12.9333C20.8666 12.5466 20.8666 11.9066 20.48 11.52C20.0933 11.1333 19.4533 11.1333 19.0666 11.52L16 14.5866L12.9333 11.52C12.5466 11.1333 11.9066 11.1333 11.52 11.52C11.1333 11.9066 11.1333 12.5466 11.52 12.9333L14.5866 16L11.52 19.0666C11.1333 19.4533 11.1333 20.0933 11.52 20.48C11.72 20.68 11.9733 20.7733 12.2266 20.7733C12.48 20.7733 12.7333 20.68 12.9333 20.48L16 17.4133L19.0666 20.48C19.2666 20.68 19.52 20.7733 19.7733 20.7733C20.0266 20.7733 20.28 20.68 20.48 20.48C20.8666 20.0933 20.8666 19.4533 20.48 19.0666L17.4133 16Z" fill="#145DA0"/>
            </svg>
          </button>
        </div>

        {/* Check if we have data */}
        {pricesData.length === 0 || !pricesData[0].categories ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-6">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="mx-auto text-gray-400">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[#2D467C] mb-2">
              {t("priceList.noDataTitle") || "No Pricing Data Available"}
            </h3>
            <p className="text-gray-600 max-w-md">
              {t("priceList.noDataMessage") || "We apologize, but pricing information is not currently available. Please check back soon or contact us for assistance."}
            </p>
          </div>
        ) : (
          /* Categories with Tours */
          <div className="space-y-8">
            {pricesData.map((city) => (
              <div key={city.city_id || 'single'}>
                {/* City Header (only show if multiple cities) */}
                {pricesData.length > 1 && (
                  <h3 className="text-xl font-bold text-[#2D467C] mb-4 border-b-2 border-[#3F62AE] pb-2">
                    {city.city_name}
                  </h3>
                )}
                
                {/* Categories */}
                {city.categories?.map((category) => (
                  <div key={category.category_id} className="mb-8">
                    {/* Category Header */}
                    <div className="bg-[#BEE3E3] rounded-[10px] px-4 py-3 mb-4">
                      <h4 className="text-[#120E2B] text-center font-cairo text-lg md:text-[20px] font-bold">
                        {category.category_name}
                      </h4>
                      <p className="text-center text-sm text-[#120E2B] mt-1">
                        {category.tours_count} {t('common.tours')} • 
                        ${category.min_price} - ${category.max_price}
                      </p>
                    </div>

                    {/* Tours Table for this Category */}
                    {category.tours?.length > 0 ? (
                      <div className="border border-[#E6E6E8] rounded-lg bg-white overflow-hidden mb-6">
                        <div className="grid grid-cols-12 w-full">
                          {/* Table Header */}
                          <div className="col-span-6 sm:col-span-7 md:col-span-8 bg-[#ECEFF7] px-2 md:px-4 py-3 border-b border-[#E6E6E8] border-r border-[#E6E6E8]">
                            <div className="text-[#010818] font-roboto text-sm md:text-[16px] leading-[19.2px] font-medium">
                              {t("priceList.excursion")}
                            </div>
                          </div>
                          <div className="col-span-3 sm:col-span-2 md:col-span-2 bg-[#ECEFF7] px-1 md:px-4 py-3 border-b border-[#E6E6E8] border-r border-[#E6E6E8]">
                            <div className="text-[#010818] font-roboto text-xs md:text-[16px] leading-[19.2px] font-medium text-center">
                              {t("priceList.adults")}
                            </div>
                          </div>
                          <div className="col-span-3 sm:col-span-3 md:col-span-2 bg-[#ECEFF7] px-1 md:px-4 py-3 border-b border-[#E6E6E8]">
                            <div className="text-[#010818] font-roboto text-xs md:text-[16px] leading-[19.2px] font-medium text-center">
                              {t("priceList.children")}
                            </div>
                          </div>

                          {/* Tour Rows */}
                          {category.tours.map((tour, index) => (
                            <React.Fragment key={tour.id}>
                              <div className="col-span-6 sm:col-span-7 md:col-span-8 px-2 md:px-4 py-3 md:py-4 border-b border-[#E6E6E8] last:border-b-0 border-r border-[#E6E6E8]">
                                <div className="text-[#555A64] font-roboto text-sm md:text-[16px] leading-tight md:leading-[19.2px] break-words">
                                  {tour.title}
                                </div>
                              </div>
                              <div className="col-span-3 sm:col-span-2 md:col-span-2 px-1 md:px-4 py-3 md:py-4 border-b border-[#E6E6E8] last:border-b-0 border-r border-[#E6E6E8] flex items-center justify-center">
                                <div className="text-[#2D467C] font-roboto text-sm md:text-[16px] leading-[19.2px] font-medium text-center">
                                  ${tour.price_adult}
                                </div>
                              </div>
                              <div className="col-span-3 sm:col-span-3 md:col-span-2 px-1 md:px-4 py-3 md:py-4 border-b border-[#E6E6E8] last:border-b-0 flex items-center justify-center">
                                <div className="text-[#2D467C] font-roboto text-sm md:text-[16px] leading-[19.2px] font-medium text-center">
                                  ${tour.price_child}
                                </div>
                              </div>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <p>{t("priceList.noToursInCategory")} {category.category_name}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceList;
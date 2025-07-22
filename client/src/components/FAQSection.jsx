// src/components/FAQSection.jsx - FIXED with real API data
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { LuDollarSign } from "react-icons/lu";
import { ArrowDown2 } from "iconsax-react";

const FAQSection = ({ onOpenPriceList, todaysPrices = [] }) => {
  const { t } = useTranslation();
  const [openItems, setOpenItems] = useState([]);

  const toggleItem = (index) => {
    setOpenItems((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index],
    );
  };

  // Generate FAQ items from real API data
  const faqItems = todaysPrices.length > 0 
    ? todaysPrices.map((cityData, index) => ({
        title: `Current prices on ${new Date().toLocaleDateString()} in ${cityData.city_name}`,
        content: `${cityData.total_tours} tours available. Prices from $${cityData.min_price} to $${cityData.max_price}. Average price: $${cityData.avg_price}`,
        onClick: index === 0 ? onOpenPriceList : null, // Only first item (Hurghada) opens modal
      }))
    : [
        {
          title: t("homepage.priceList.hurghadaPrices"),
          content: "Price list content for Hurghada excursions...",
          onClick: onOpenPriceList,
        },
        {
          title: t("homepage.priceList.sharmPrices"),
          content: "Price list content for Sharm El-Sheikh excursions...",
        },
        {
          title: t("homepage.priceList.marsaPrices"),
          content: "Price list content for Marsa Alam excursions...",
        },
      ];

  return (
    <div className="w-full bg-[#F3F3EE] py-10 md:py-20 px-4 md:px-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-6 md:gap-10">
          {/* Title */}
          <div className="text-center">
            <h2 className="text-[#233660] font-great-vibes text-3xl md:text-4xl leading-[120%]">
              {t("homepage.priceList.title")}
            </h2>
          </div>

          {/* FAQ Items */}
          <div className="flex flex-col gap-4 md:gap-6">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="bg-[#FEFEFD] rounded-md border border-transparent hover:border-[#E6E6E8] transition-colors"
              >
                <button
                  onClick={() => {
                    if (item.onClick) {
                      item.onClick();
                    } else {
                      toggleItem(index);
                    }
                  }}
                  className="w-full flex justify-between items-center px-4 md:px-6 py-3 md:py-4 text-left"
                >
                  <div className="flex items-center gap-2">
                    <LuDollarSign className="text-[#2D467C] w-5 h-5 md:w-6 md:h-6" />
                    <h3 className="text-[#2D467C] font-family-primary text-xs md:text-sm font-semibold">
                      {item.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 md:gap-6">
                    <div className="w-px h-[25px] md:h-[35px] bg-[#ADADA9]"></div>
                    <ArrowDown2 
                      size={24}
                      color="#3F62AE"
                      className={`transition-transform w-6 h-6 md:w-8 md:h-8 ${
                        openItems.includes(index) || item.onClick ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>
                {openItems.includes(index) && !item.onClick && (
                  <div className="px-4 md:px-6 pb-3 md:pb-4">
                    <div className="text-[#555A64] font-roboto text-sm md:text-[16px] leading-[24px]">
                      {item.content}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
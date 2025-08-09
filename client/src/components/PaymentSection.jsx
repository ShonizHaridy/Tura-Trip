import React, { useState, useEffect } from "react";
import VisaCard from "./VisaCard";
import { useTranslation, Trans } from "react-i18next";
import publicService from "../services/publicService";

const PaymentSection = ({ onOpenConverter }) => {
  const { t } = useTranslation();
  const [commissionRates, setCommissionRates] = useState({
    RUB: 7,   // Default fallback
    KZT: 10,  // Default fallback  
    UAH: 3    // Default fallback
  });

  useEffect(() => {
    const fetchCommissionRates = async () => {
      try {
        const response = await publicService.getCommissionRates();
        const rates = response.data.reduce((acc, commission) => ({
          ...acc,
          [commission.currency_code]: parseFloat(commission.commission_amount)
        }), {});
        setCommissionRates(prev => ({ ...prev, ...rates }));
      } catch (error) {
        console.error('Error fetching commission rates:', error);
        // Keep default fallback values
      }
    };
    
    fetchCommissionRates();
  }, []);

  return (
    <div className="w-full relative flex items-center overflow-hidden pt-10 pb-16">
      <div className="w-full pl-4 lg:pl-15">
        {/* Two Column Layout - Mobile and Desktop */}
        <div className="flex gap-1 md:gap-2 items-center justify-between">          
          {/* LEFT COLUMN - Text and Button */}
          <div className="flex flex-col gap-4">
            <h2 className="max-w-170 text-danim-800 font-family-primary text-sm md:text-2xl font-medium leading-normal">
              {t("homepage.payment.title")}
              <br />
              <Trans
                i18nKey="homepage.payment.rates"
                values={{
                  rub: commissionRates.RUB || 7,      // ✅ Dynamic
                  tenge: commissionRates.KZT || 10,   // ✅ Dynamic
                  uah: commissionRates.UAH || 3,      // ✅ Dynamic
                }}
                components={[
                  <span className="text-[#56B8B6]" />,
                  <span className="text-[#56B8B6]" />,
                  <span className="text-[#56B8B6]" />,
                ]}
              />
            </h2>
            
            <button
              onClick={onOpenConverter}
              className="self-start inline-flex px-[2px] sm:px-1 md:px-6 py-1 sm:py-2 md:py-3 justify-center items-center gap-3 rounded-md border border-[#2D467C] bg-[#DDE7E9] shadow-sm hover:bg-[#BEE3E3] transition-colors"
            >
              <span className="text-[#233660] font-family-primary text-[12px] sm:text-sm md:text-xl font-semibold text-center">
                {t("homepage.payment.converterButton")}
              </span>
            </button>
          </div>

          {/* RIGHT COLUMN - Cards Container */}
          <div className="relative w-[120px] sm:w-[300px] md:w-[400px] h-[200px] lg:h-[440px] overflow-hidden flex-shrink-0">
            {/* Card 1 - Golden */}
            <VisaCard
              className="absolute top-5 right-[-30px] lg:right-[-85px] z-10"
              rotation="-15deg"
              background="linear-gradient(111.97deg, #F9ECA0 0%, #F5AF19 100%)"
            />
            
            {/* Card 2 - Blue */}
            <VisaCard
              className="absolute top-13 lg:top-28 right-[-15px] lg:right-[-40px] z-30"
              rotation="-15deg"
              background="linear-gradient(111.97deg, #78FDFF 0%, #78C2FF 100%)"
            />
            
            {/* Card 3 - Purple */}
            <VisaCard
              className="absolute top-23 md:lg:top-48 right-[-65px] lg:right-[-140px] z-20"
              rotation="-15deg"
              background="linear-gradient(111.97deg, #4949E7 0%, #86A8E7 48.06%, #91EAE4 100%)"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;
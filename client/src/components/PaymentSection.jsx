import React from "react";
import VisaCard from "./VisaCard";

const PaymentSection = ({ onOpenConverter }) => {
  return (
    <div className="w-full bg-[#F3F3EE] relative flex items-center overflow-hidden">
      <div className="w-full pl-4">
        {/* Two Column Layout - Mobile and Desktop */}
        <div className="flex gap-1 md:gap-2 items-center justify-between">          
          {/* LEFT COLUMN - Text and Button */}
          <div className="flex flex-col gap-4">
            <h2 className="text-danim-800 font-family-primary text-sm md:text-2xl font-medium leading-normal">
              We can accept payment in rubles, tenge or hryvnia by transfer to a card:
              <br />
              $1 = Central Bank exchange rate + 7{" "}
              <span className="text-[#56B8B6]">₽</span> ; or 10{" "}
              <span className="text-[#56B8B6]">₸</span> ; or 3{" "}
              <span className="text-[#56B8B6]">₴</span> ; also transfer USD T to a crypto wallet
            </h2>
            
            <button
              onClick={onOpenConverter}
              className="inline-flex h-[40px] md:h-[52px] px-3 md:px-6 py-2 md:py-3 justify-center items-center gap-3 rounded-md border border-[#2D467C] bg-[#DDE7E9] shadow-sm hover:bg-[#BEE3E3] transition-colors"
            >
              <span className="text-[#233660] font-family-primary text-sm md:text-xl font-semibold text-center">
                Open Online Currency Converter
              </span>
            </button>
          </div>

          {/* RIGHT COLUMN - Cards Container - MADE MUCH WIDER */}
          <div className="relative w-[200px] sm:w-[300px] md:w-[400px] h-[200px] lg:h-[440px] overflow-hidden flex-shrink-0"> {/* Made responsive */}
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
            className="absolute top-23 md: lg:top-48 right-[-65px] lg:right-[-140px] z-20"
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
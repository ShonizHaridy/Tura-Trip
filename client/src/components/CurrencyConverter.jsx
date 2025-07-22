// src/components/CurrencyConverter.jsx - FIXED with real calculations
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const CurrencyConverter = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [usdAmounts, setUsdAmounts] = useState(['', '', '']);
  
  // Exchange rates with commissions
  const rates = {
    rub: { rate: 80.9, commission: 7 },
    tenge: { rate: 515.9, commission: 10 },
    uah: { rate: 41.5, commission: 3 }
  };

  // Calculate converted amount
  const calculateAmount = (usdAmount, currency) => {
    if (!usdAmount || isNaN(usdAmount)) return '0';
    const { rate, commission } = rates[currency];
    const result = (parseFloat(usdAmount) * rate) + commission;
    return Math.round(result / 10) * 10; // Round up to nearest 10
  };

  // Handle USD input change
  const handleUsdChange = (index, value) => {
    const newAmounts = [...usdAmounts];
    newAmounts[index] = value;
    setUsdAmounts(newAmounts);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-4 md:p-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-lg">
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
                d="M23.2268 6.37992H7.18681L9.69344 3.87333C10.0801 3.48667 10.0801 2.84659 9.69344 2.45992C9.30677 2.07326 8.66678 2.07326 8.28011 2.45992L4.06677 6.6733C3.97344 6.76663 3.90681 6.87329 3.85347 6.99329C3.80014 7.11329 3.77344 7.24659 3.77344 7.37992C3.77344 7.51326 3.80014 7.64664 3.85347 7.76664C3.90681 7.88664 3.97344 7.9933 4.06677 8.08663L8.28011 12.2999C8.48011 12.4999 8.73344 12.5933 8.98678 12.5933C9.24011 12.5933 9.49344 12.4999 9.69344 12.2999C10.0801 11.9133 10.0801 11.2733 9.69344 10.8866L7.18681 8.37993H23.2268C24.8801 8.37993 26.2268 9.72659 26.2268 11.3799V15.8066C26.2268 16.3533 26.6801 16.8066 27.2268 16.8066C27.7735 16.8066 28.2268 16.3533 28.2268 15.8066V11.3799C28.2268 8.61993 25.9868 6.37992 23.2268 6.37992Z"
                fill="#3F62AE"
              />
              <path
                opacity="0.4"
                d="M28.2268 25.62C28.2268 25.4867 28.2001 25.3533 28.1468 25.2333C28.0934 25.1133 28.0268 25.0067 27.9335 24.9133L23.7201 20.7C23.3335 20.3134 22.6935 20.3134 22.3068 20.7C21.9201 21.0867 21.9201 21.7267 22.3068 22.1134L24.8134 24.62H8.77344C7.1201 24.62 5.77344 23.2734 5.77344 21.62V17.1934C5.77344 16.6467 5.3201 16.1934 4.77344 16.1934C4.22677 16.1934 3.77344 16.6467 3.77344 17.1934V21.62C3.77344 24.38 6.01344 26.62 8.77344 26.62H24.8134L22.3068 29.1266C21.9201 29.5133 21.9201 30.1534 22.3068 30.54C22.5068 30.74 22.7601 30.8333 23.0135 30.8333C23.2668 30.8333 23.5201 30.74 23.7201 30.54L27.9335 26.3267C28.0268 26.2333 28.0934 26.1267 28.1468 26.0067C28.2001 25.8867 28.2268 25.7534 28.2268 25.62Z"
                fill="#3F62AE"
              />
            </svg>
            <h2 className="text-lg md:text-[22px] font-bold text-[#2D467C] font-cairo">
              Currency Converter
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
                d="M21.5865 2.66666H10.4132C5.55984 2.66666 2.6665 5.55999 2.6665 10.4133V21.5733C2.6665 26.44 5.55984 29.3333 10.4132 29.3333H21.5732C26.4265 29.3333 29.3198 26.44 29.3198 21.5867V10.4133C29.3332 5.55999 26.4398 2.66666 21.5865 2.66666Z"
                fill="#145DA0"
              />
              <path
                d="M17.4133 16L20.48 12.9333C20.8666 12.5467 20.8666 11.9067 20.48 11.52C20.0933 11.1333 19.4533 11.1333 19.0666 11.52L16 14.5867L12.9333 11.52C12.5466 11.1333 11.9066 11.1333 11.52 11.52C11.1333 11.9067 11.1333 12.5467 11.52 12.9333L14.5866 16L11.52 19.0667C11.1333 19.4533 11.1333 20.0933 11.52 20.48C11.72 20.68 11.9733 20.7733 12.2266 20.7733C12.48 20.7733 12.7333 20.68 12.9333 20.48L16 17.4133L19.0666 20.48C19.2666 20.68 19.52 20.7733 19.7733 20.7733C20.0266 20.7733 20.28 20.68 20.48 20.48C20.8666 20.0933 20.8666 19.4533 20.48 19.0667L17.4133 16Z"
                fill="#145DA0"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="opacity-80">
          {/* Mobile Version - Stacked Layout */}
          <div className="block md:hidden space-y-6">
            {/* USD Input Section */}
            <div className="bg-white border border-[#E6E6E8] rounded-lg overflow-hidden">
              <div className="bg-[#ECEFF7] px-4 py-3 border-b border-[#E6E6E8]">
                <div className="text-[#010818] text-center font-roboto text-sm md:text-[16px] leading-[19.2px]">
                  Enter the amount in USD
                </div>
              </div>
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 px-4 py-3 border-b border-[#E6E6E8] last:border-b-0"
                >
                  <span className="text-[#2D467C] font-roboto text-sm">$</span>
                  <input
                    type="number"
                    placeholder="USD"
                    value={usdAmounts[index]}
                    onChange={(e) => handleUsdChange(index, e.target.value)}
                    className="flex-1 h-[36px] px-3 py-2 border border-[#E8E7EA] rounded-lg text-[#8A8D95] font-roboto text-sm text-right"
                  />
                  <span className="text-[#233660] font-roboto text-sm">×</span>
                </div>
              ))}
            </div>

            {/* Currency Calculations */}
            {[
              { currency: "₽", key: "rub", name: "rubles" },
              { currency: "₸", key: "tenge", name: "tenge" },
              { currency: "₴", key: "uah", name: "UHA" },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white border border-[#E6E6E8] rounded-lg overflow-hidden"
              >
                <div className="bg-[#ECEFF7] px-4 py-3 border-b border-[#E6E6E8]">
                  <div className="text-[#010818] font-roboto text-sm font-medium">
                    {item.currency} Calculation
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  {/* Formula */}
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <span className="text-[#2D467C] font-roboto text-lg">(</span>
                    <span className="text-[#2D467C] font-roboto text-sm">
                      {rates[item.key].rate} {item.currency}
                    </span>
                    <svg
                      width="20"
                      height="21"
                      viewBox="0 0 24 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 12.8333H18"
                        stroke="#145DA0"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 18.8333V6.83334"
                        stroke="#145DA0"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-[#2D467C] font-roboto text-sm">
                      {rates[item.key].commission} {item.name}
                    </span>
                    <span className="text-[#2D467C] font-roboto text-lg">)</span>
                  </div>
                  {/* Result */}
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-[#2D467C] font-roboto text-lg">=</span>
                    <input
                      type="text"
                      value={calculateAmount(usdAmounts[index], item.key)}
                      readOnly
                      className="flex-1 max-w-[200px] h-[36px] px-3 py-2 border border-[#E8E7EA] rounded-lg text-[#8A8D95] font-roboto text-sm text-center bg-gray-50"
                    />
                    <span className="text-[#2D467C] font-roboto text-sm">
                      {item.currency}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Version - Table Layout */}
          <div className="hidden md:block border border-[#E6E6E8] rounded-lg bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <div className="flex min-w-[768px]">
                {/* Left Column */}
                <div className="flex-1 min-w-[200px]">
                  {/* Header */}
                  <div className="bg-[#ECEFF7] px-4 py-3 border-b border-[#E6E6E8]">
                    <div className="text-[#010818] text-center font-roboto text-[16px] leading-[19.2px]">
                      Enter the amount in USD
                    </div>
                  </div>

                  {/* USD Rows */}
                  {[0, 1, 2].map((index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 px-4 py-4 border-b border-[#E6E6E8]"
                    >
                      <span className="text-[#2D467C] font-roboto text-[16px]">
                        $
                      </span>
                      <div className="flex-1">
                        <input
                          type="number"
                          placeholder="USD"
                          value={usdAmounts[index]}
                          onChange={(e) => handleUsdChange(index, e.target.value)}
                          className="w-full h-[38px] px-4 py-3 border border-[#E8E7EA] rounded-lg text-[#8A8D95] font-roboto text-[16px] text-right"
                        />
                      </div>
                      <span className="text-[#233660] font-roboto text-[16px]">
                        ×
                      </span>
                    </div>
                  ))}
                </div>

                {/* Middle Column */}
                <div className="w-px bg-[#E6E6E8]"></div>
                <div className="flex-1 min-w-[300px]">
                  {/* Header */}
                  <div className="bg-[#ECEFF7] px-4 py-3 border-b border-[#E6E6E8] flex justify-between items-center">
                    <div className="text-[#010818] font-roboto text-[16px] leading-[19.2px]">
                      Price for {new Date().toLocaleDateString()}
                    </div>
                    <div className="w-[137px] text-[#010818] text-center font-roboto text-[16px] leading-[19.2px]">
                      Organizer's commission
                    </div>
                  </div>

                  {/* Price Rows */}
                  {[
                    { currency: "₽", key: "rub", name: "rubles" },
                    { currency: "₸", key: "tenge", name: "tenge" },
                    { currency: "₴", key: "uah", name: "UHA" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2 px-4 py-4 border-b border-[#E6E6E8]">
                      <span className="text-[#2D467C] font-roboto text-[24px] leading-[28.8px]">
                        (
                      </span>
                      <span className="text-[#2D467C] font-roboto text-[16px]">
                        {rates[item.key].rate} {item.currency}
                      </span>
                      <svg
                        width="24"
                        height="25"
                        viewBox="0 0 24 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 12.8333H18"
                          stroke="#145DA0"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 18.8333V6.83334"
                          stroke="#145DA0"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-[#2D467C] font-roboto text-[16px]">
                        {rates[item.key].commission} {item.name}
                      </span>
                      <span className="text-[#2D467C] font-roboto text-[24px] leading-[28.8px]">
                        )
                      </span>
                    </div>
                  ))}
                </div>

                {/* Right Column */}
                <div className="w-px bg-[#E6E6E8]"></div>
                <div className="flex-1 min-w-[200px]">
                  {/* Header */}
                  <div className="bg-[#ECEFF7] px-4 py-3 border-b border-[#E6E6E8]">
                    <div className="text-[#010818] font-roboto text-[16px] leading-[19.2px]">
                      Total Amount
                    </div>
                  </div>

                  {/* Total Rows */}
                  {[
                    { symbol: "₽", key: "rub" },
                    { symbol: "₸", key: "tenge" },
                    { symbol: "₴", key: "uah" },
                  ].map((total, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-4 py-4 border-b border-[#E6E6E8]"
                    >
                      <span className="text-[#2D467C] font-roboto text-[24px] leading-[28.8px]">
                        =
                      </span>
                      <input
                        type="text"
                        value={calculateAmount(usdAmounts[index], total.key)}
                        readOnly
                        className="flex-1 h-[38px] px-4 py-3 border border-[#E8E7EA] rounded-lg text-[#8A8D95] font-roboto text-[16px] bg-gray-50"
                      />
                      <span className="text-[#2D467C] font-roboto text-[16px] leading-[19.2px]">
                        {total.symbol}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6">
          <div className="text-[#120E2B] font-roboto text-sm md:text-[16px] text-center md:text-left">
            The commission is added to the exchange rate for each dollar
            <br />
            The amount is rounded up by a multiple of 10
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
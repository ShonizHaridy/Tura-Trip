import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import publicService from "../services/publicService"; // Adjust path as needed

const CurrencyConverter = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [usdAmounts, setUsdAmounts] = useState(['', '', '']);
  const [calculatedAmounts, setCalculatedAmounts] = useState(['0', '0', '0']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exchangeRates, setExchangeRates] = useState({});
  
  // Move window width check outside of render
  const isMobile = useMemo(() => typeof window !== 'undefined' && window.innerWidth < 768, []);
  
  // Centralized currency data - commission is flat amount, not percentage
  const currencies = useMemo(() => [
    { 
      currency: "₽", 
      key: "RUB", 
      name: { desktop: "rubles", mobile: "rub" }, 
      commission: 7 // Flat amount added to exchange rate
    },
    { 
      currency: "₸", 
      key: "KZT", 
      name: { desktop: "tenge", mobile: "tng" }, 
      commission: 10 // Flat amount added to exchange rate
    },
    { 
      currency: "₴", 
      key: "UAH", 
      name: { desktop: "UHA", mobile: "uah" }, 
      commission: 3 // Flat amount added to exchange rate
    }
  ], []);

  // Fetch exchange rates when component mounts or when isOpen changes
  useEffect(() => {
    if (isOpen) {
      fetchExchangeRates();
    }
  }, [isOpen]);

  // Fetch current exchange rates from API
  const fetchExchangeRates = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const ratePromises = currencies.map(async (currency) => {
        const response = await publicService.convertCurrency(1, 'USD', currency.key);
        return {
          key: currency.key,
          rate: response.data.exchangeRate,
          currencyInfo: response.data.currencyInfo
        };
      });

      const rates = await Promise.all(ratePromises);
      const ratesObj = rates.reduce((acc, rate) => ({
        ...acc,
        [rate.key]: rate
      }), {});
      
      setExchangeRates(ratesObj);
    } catch (err) {
      console.error('Error fetching exchange rates:', err);
      setError(t('currencyConverter.fetchError'));
    } finally {
      setLoading(false);
    }
  }, [currencies]);

  // Calculate amount using API rate + commission (same as original logic)
  const calculateAmount = useCallback((usdAmount, currencyData) => {
    if (!usdAmount || isNaN(usdAmount) || parseFloat(usdAmount) <= 0) return '0';
    
    const rateData = exchangeRates[currencyData.key];
    if (!rateData) return '0';
    
    // Original logic: multiply USD amount by (exchange rate + commission)
    const result = parseFloat(usdAmount) * (rateData.rate + currencyData.commission);
    
    // Round to nearest 10 as in original logic
    return Math.round(result / 10) * 10;
  }, [exchangeRates]);

  // Handle calculation when button is clicked
  const handleCalculate = useCallback(() => {
    if (Object.keys(exchangeRates).length === 0) {
      setError(t('currencyConverter.ratesNotLoaded'));
      return;
    }

    const newCalculatedAmounts = currencies.map((currencyData, index) => {
      if (!usdAmounts[index] || usdAmounts[index] === '') {
        return '0';
      }
      return calculateAmount(usdAmounts[index], currencyData);
    });

    setCalculatedAmounts(newCalculatedAmounts);
  }, [usdAmounts, currencies, calculateAmount, exchangeRates]);

  // Optimize the USD change handler
  const handleUsdChange = useCallback((index, value) => {
    // Only allow valid number inputs
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setUsdAmounts(prev => {
        const newAmounts = [...prev];
        newAmounts[index] = value;
        return newAmounts;
      });
    }
  }, []);

  // Get display rate for currency (base rate without commission)
  const getDisplayRate = useCallback((currencyKey) => {
    const rateData = exchangeRates[currencyKey];
    if (!rateData) return 'Loading...';
    return rateData.rate.toFixed(2);
  }, [exchangeRates]);

  // Memoize reusable components
  const TableCell = useCallback(({ children, className = "", ...props }) => (
    <div className={`flex items-center justify-center ${className}`} {...props}>
      {children}
    </div>
  ), []);

  const InputField = useCallback(({ value, onChange, placeholder, className = "", readOnly = false, ...props }) => (
    <input
      type={readOnly ? "text" : "text"}
      inputMode={readOnly ? undefined : "numeric"}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className={`border border-[#E8E7EA] rounded-lg text-[#8A8D95] bg-white transition-all duration-200 ${className}`}
      style={{ fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif' }}
      {...props}
    />
  ), []);

  const Divider = useCallback(({ symbol, className = "" }) => (
    <div className={`flex items-center justify-center ${className}`}>
      {symbol === '+' ? (
        <svg 
          viewBox="0 0 24 25" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 flex-shrink-0"
        >
          <path d="M6 12.8333H18" stroke="#145DA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 18.8333V6.83334" stroke="#145DA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <span 
          className="text-[#233660] md:text-[#2D467C] font-semibold" 
          style={{ fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif' }}
        >
          {symbol}
        </span>
      )}
    </div>
  ), []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-[95vw] lg:max-w-none max-h-[90vh] p-4 md:p-6 lg:p-8 flex flex-col gap-4 md:gap-6 overflow-hidden" 
           style={{ width: 'min(95vw, 1000px)' }}>
        
        {/* Header */}
        <div className="flex justify-between items-start gap-2 pb-4 border-b border-[#D1D1D1] flex-shrink-0">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <svg
              width="32" height="33" viewBox="0 0 32 33" fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 flex-shrink-0"
            >
              <path d="M23.2268 6.37992H7.18681L9.69344 3.87333C10.0801 3.48667 10.0801 2.84659 9.69344 2.45992C9.30677 2.07326 8.66678 2.07326 8.28011 2.45992L4.06677 6.6733C3.97344 6.76663 3.90681 6.87329 3.85347 6.99329C3.80014 7.11329 3.77344 7.24659 3.77344 7.37992C3.77344 7.51326 3.80014 7.64664 3.85347 7.76664C3.90681 7.88664 3.97344 7.9933 4.06677 8.08663L8.28011 12.2999C8.48011 12.4999 8.73344 12.5933 8.98678 12.5933C9.24011 12.5933 9.49344 12.4999 9.69344 12.2999C10.0801 11.9133 10.0801 11.2733 9.69344 10.8866L7.18681 8.37993H23.2268C24.8801 8.37993 26.2268 9.72659 26.2268 11.3799V15.8066C26.2268 16.3533 26.6801 16.8066 27.2268 16.8066C27.7735 16.8066 28.2268 16.3533 28.2268 15.8066V11.3799C28.2268 8.61993 25.9868 6.37992 23.2268 6.37992Z" fill="#3F62AE"/>
              <path opacity="0.4" d="M28.2268 25.62C28.2268 25.4867 28.2001 25.3533 28.1468 25.2333C28.0934 25.1133 28.0268 25.0067 27.9335 24.9133L23.7201 20.7C23.3335 20.3134 22.6935 20.3134 22.3068 20.7C21.9201 21.0867 21.9201 21.7267 22.3068 22.1134L24.8134 24.62H8.77344C7.1201 24.62 5.77344 23.2734 5.77344 21.62V17.1934C5.77344 16.6467 5.3201 16.1934 4.77344 16.1934C4.22677 16.1934 3.77344 16.6467 3.77344 17.1934V21.62C3.77344 24.38 6.01344 26.62 8.77344 26.62H24.8134L22.3068 29.1266C21.9201 29.5133 21.9201 30.1534 22.3068 30.54C22.5068 30.74 22.7601 30.8333 23.0135 30.8333C23.2668 30.8333 23.5201 30.74 23.7201 30.54L27.9335 26.3267C28.0268 26.2333 28.0934 26.1267 28.1468 26.0067C28.2001 25.8867 28.2268 25.7534 28.2268 25.62Z" fill="#3F62AE"/>
            </svg>
            <h2 className="text-base md:text-xl lg:text-[22px] font-bold text-[#2D467C]" 
                style={{ fontFamily: 'Cairo, -apple-system, Roboto, Helvetica, sans-serif' }}>
              {t('currencyConverter.title')}
            </h2>
            {loading && (
              <div className="ml-2 w-4 h-4 border-2 border-[#145DA0] border-t-transparent rounded-full animate-spin"></div>
            )}
          </div>
          <button onClick={onClose} className="text-[#145DA0] hover:bg-gray-100 p-1 rounded flex-shrink-0">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8">
              <path opacity="0.4" d="M21.5865 2.66666H10.4132C5.55984 2.66666 2.6665 5.55999 2.6665 10.4133V21.5733C2.6665 26.44 5.55984 29.3333 10.4132 29.3333H21.5732C26.4265 29.3333 29.3198 26.44 29.3198 21.5867V10.4133C29.3332 5.55999 26.4398 2.66666 21.5865 2.66666Z" fill="#145DA0"/>
              <path d="M17.4133 16L20.48 12.9333C20.8666 12.5467 20.8666 11.9067 20.48 11.52C20.0933 11.1333 19.4533 11.1333 19.0666 11.52L16 14.5867L12.9333 11.52C12.5466 11.1333 11.9066 11.1333 11.52 11.52C11.1333 11.9067 11.1333 12.5467 11.52 12.9333L14.5866 16L11.52 19.0667C11.1333 19.4533 11.1333 20.0933 11.52 20.48C11.72 20.68 11.9733 20.7733 12.2266 20.7733C12.48 20.7733 12.7333 20.68 12.9333 20.48L16 17.4133L19.0666 20.48C19.2666 20.68 19.52 20.7733 19.7733 20.7733C20.0266 20.7733 20.28 20.68 20.48 20.48C20.8666 20.0933 20.8666 19.4533 20.48 19.0667L17.4133 16Z" fill="#145DA0"/>
            </svg>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-700 text-sm">{error}</span>
            <button 
              onClick={fetchExchangeRates}
              className="ml-auto text-red-600 hover:text-red-800 text-sm underline"
            >
              {t('currencyConverter.retry')}
            </button>
          </div>
        )}

        {/* Single Responsive Table Layout */}
        <div className="opacity-80 flex-1 overflow-auto">
          <div className="bg-white border border-[#E6E6E8] rounded-lg overflow-hidden min-h-0">
            
            {/* Header Row - Responsive */}
            <div className="flex bg-[#ECEFF7] border-b border-[#E6E6E8]">
              <TableCell className="px-2 md:px-3 lg:px-4 py-2 md:py-3 h-12 md:h-[50px] lg:h-[55px] flex-1">
                <div className="text-[#010818] text-[10px] md:text-sm lg:text-base text-center lg:leading-[19.2px]" 
                     style={{ fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif' }}>
                  <span className="">{t('currencyConverter.usdAmount')}</span>
                </div>
              </TableCell>
              
              <div className="w-6 md:w-10 lg:w-[60px] h-12 md:h-[50px] lg:h-[55px] bg-[#ECEFF7]"></div>
              
              <TableCell className="px-2 md:px-3 lg:px-4 py-2 md:py-3 h-12 md:h-[50px] lg:h-[55px] flex-1">
                <div className="text-[#010818] text-[10px] md:text-sm lg:text-base text-center lg:leading-[19.2px]" 
                     style={{ fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif' }}>
                  <span className="md:inline">{t('currencyConverter.currentRate')}<br />{new Date().toLocaleDateString()}</span>
                </div>
              </TableCell>
              
              <div className="w-6 md:w-10 lg:w-[60px] h-12 md:h-[50px] lg:h-[55px] bg-[#ECEFF7]"></div>
              
              <TableCell className="px-2 md:px-3 lg:px-4 py-2 md:py-3 h-12 md:h-[50px] lg:h-[55px] flex-1">
                <div className="text-[#010818] text-[10px] md:text-sm lg:text-base text-center lg:leading-[19.2px]" 
                     style={{ fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif' }}>
                  <span className="lg:inline">{t('currencyConverter.organizerCommission')}</span>
                </div>
              </TableCell>
              
              <div className="w-6 md:w-10 lg:w-[60px] h-12 md:h-[50px] lg:h-[55px] bg-[#ECEFF7]"></div>
              
              <TableCell className="px-2 md:px-3 lg:px-4 py-2 md:py-3 h-12 md:h-[50px] lg:h-[55px] flex-1">
                <div className="text-[#010818] text-[10px] md:text-sm lg:text-base text-center lg:leading-[19.2px]" 
                     style={{ fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif' }}>
                  {t('currencyConverter.totalAmount')}
                </div>
              </TableCell>
            </div>

            {/* Data Rows - Single Layout for All Screens */}
            {currencies.map((currencyData, index) => (
              <div key={index} className="flex border-t border-[#E6E6E8]">
                {/* USD Input */}
                <TableCell className="px-1 md:px-3 lg:px-4 py-2 md:py-3 lg:py-4 h-14 md:h-16 lg:h-[70.667px] flex-1">
                  <div className="flex items-center gap-1 md:gap-2 justify-center">
                    <span className="text-[#2D467C] text-[10px] md:text-base flex-shrink-0" 
                          style={{ fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif' }}>$</span>
                    <InputField
                      placeholder="USD"
                      value={usdAmounts[index]}
                      onChange={(e) => handleUsdChange(index, e.target.value)}
                      className="w-[45px] md:w-20 lg:w-[100px] h-[28px] md:h-8 lg:h-[38px] px-1 md:px-3 lg:px-4 py-1 md:py-2 lg:py-3 text-[9px] md:text-sm lg:text-base text-center"
                      disabled={loading}
                    />
                  </div>
                </TableCell>

                {/* × Divider */}
                <Divider 
                  symbol="×" 
                  className="w-6 md:w-10 lg:w-[60px] py-2 md:py-3 lg:py-4 h-14 md:h-16 lg:h-[70.667px] text-[12px] md:text-lg lg:text-xl" 
                />

                {/* Price */}
                <TableCell className="px-1 md:px-3 lg:px-4 py-2 md:py-3 lg:py-4 h-14 md:h-16 lg:h-[70.667px] flex-1">
                  <div className="flex items-center gap-1 lg:gap-2">
                    <span className="text-[#2D467C] text-[9px] md:text-sm lg:text-xl lg:leading-[28.8px] flex-shrink-0" 
                          style={{ fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif' }}>(</span>
                    <InputField
                      value={`${getDisplayRate(currencyData.key)}${window.innerWidth < 768 ? '' : ` ${currencyData.currency}`}`}
                      readOnly
                      className="w-[40px] md:w-20 lg:w-[100px] h-[28px] md:h-8 lg:h-[38px] px-1 md:px-3 lg:px-4 py-1 md:py-2 lg:py-3 text-[8px] md:text-sm lg:text-base text-center"
                    />
                    <span className="text-[#2D467C] text-[9px] md:hidden flex-shrink-0" 
                          style={{ fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif' }}>
                      {currencyData.currency}
                    </span>
                  </div>
                </TableCell>

                {/* + Divider */}
                <Divider 
                  symbol="+" 
                  className="w-6 md:w-10 lg:w-[60px] py-2 md:py-3 lg:py-4 h-14 md:h-16 lg:h-[70.667px]" 
                />

                {/* Commission - Fixed: Show as flat amount, not percentage */}
                <TableCell className="px-1 md:px-3 lg:px-4 py-2 md:py-3 lg:py-4 h-14 md:h-16 lg:h-[70.667px] flex-1">
                  <div className="flex items-center gap-1">
                    <InputField
                      value={`${currencyData.commission}${window.innerWidth >= 768 ? ` ${currencyData.name.desktop}` : ''}`}
                      readOnly
                      className="w-[35px] md:w-20 lg:w-[100px] h-[28px] md:h-8 lg:h-[38px] px-1 md:px-3 lg:px-4 py-1 md:py-2 lg:py-3 text-[8px] md:text-sm lg:text-base text-center"
                    />
                    <span className="text-[#2D467C] text-[9px] md:text-sm lg:text-xl lg:leading-[28.8px] flex-shrink-0" 
                          style={{ fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif' }}>)</span>
                  </div>
                </TableCell>

                {/* = Divider */}
                <Divider 
                  symbol="=" 
                  className="w-6 md:w-10 lg:w-[60px] py-2 md:py-3 lg:py-4 h-14 md:h-16 lg:h-[70.667px] text-[12px] md:text-lg lg:text-xl lg:leading-[28.8px]" 
                />

                {/* Total */}
                <TableCell className="px-1 md:px-3 lg:px-4 py-2 md:py-3 lg:py-4 h-14 md:h-16 lg:h-[70.667px] flex-1">
                  <div className="flex items-center gap-1 justify-center">
                    <InputField
                      value={calculatedAmounts[index]}
                      readOnly
                      className="w-[40px] md:flex-1 lg:w-[100px] h-[28px] md:h-8 lg:h-[38px] px-1 md:px-3 lg:px-4 py-1 md:py-2 lg:py-3 text-[7px] md:text-sm lg:text-base text-center min-w-0"
                    />
                    <span className="text-[#2D467C] text-[9px] md:text-sm lg:text-base lg:leading-[19.2px] flex-shrink-0" 
                          style={{ fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif' }}>
                      {currencyData.currency}
                    </span>
                  </div>
                </TableCell>
              </div>
            ))}
          </div>
        </div>

        {/* Footer with Calculate Button */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div className="text-[#120E2B] text-[10px] md:text-sm lg:text-base w-full lg:max-w-[467px]" 
               style={{ fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif' }}>
              <span className="md:hidden">
                {t('currencyConverter.commissionNote')}<br />
                {t('currencyConverter.roundingNote')}<br />
                <span className="text-green-600">✓ {t('currencyConverter.liveRates')}</span>
              </span>
              <span className="hidden md:inline">
                {t('currencyConverter.commissionNote')}<br />
                {t('currencyConverter.roundingNote')}<br />
                <span className="text-green-600">✓ {t('currencyConverter.liveRates')}</span>
              </span>
          </div>
          
          {/* Calculate Button */}
          <button
            onClick={handleCalculate}
            disabled={loading || Object.keys(exchangeRates).length === 0}
            className="bg-[#145DA0] hover:bg-[#0f4a85] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold px-4 md:px-6 py-2 md:py-3 rounded-lg transition-colors duration-200 flex items-center gap-2 ml-4 flex-shrink-0"
            style={{ fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif' }}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
              >
                <path 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            )}
            <span className="text-sm md:text-base">
              {loading ? t('currencyConverter.calculating') : t('currencyConverter.calculate')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
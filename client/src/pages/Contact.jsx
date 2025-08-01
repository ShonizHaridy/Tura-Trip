// src/pages/Contact.jsx
import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import Logo from '../assets/logo-icon.svg?react';
import publicService from '../services/publicService';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({ 
    code: 'RU', 
    name: 'Russia', 
    dialCode: '+7',
    flag: '🇷🇺' 
  });
  const [allCountries, setAllCountries] = useState([]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  // Auto-detect country on component mount
  useEffect(() => {
    const detectCountry = async () => {
      try {
        console.log('🔄 Detecting country...');
        const result = await publicService.getClientCountry();
        console.log('🌍 Country detection result:', result);
        
        if (result.success) {
          // Add flag emoji to detected country if not present
          const detectedCountry = {
            ...result.data.detectedCountry,
            // flag: getCountryFlag(result.data.detectedCountry.code)
          };
          
          // Add flag emoji to all countries
          // const countriesWithFlags = result.data.allCountries.map(country => ({
          //   ...country,
          //   // flag: getCountryFlag(country.code)
          // }));
          // REMOVE the getCountryFlag function completely and just use:
const countriesWithFlags = result.data.allCountries.map(country => ({
  ...country,
  // No flag property needed for CDN method
}));
//   const countriesWithFlags = result.data.allCountries.map(country => ({
//   ...country,
//   // No flag property needed for CDN method
// }));
          
          setSelectedCountry(detectedCountry);
          setAllCountries(countriesWithFlags);
          console.log('✅ Country set to:', detectedCountry);
        }
      } catch (error) {
        console.error('❌ Country detection failed:', error);
        // Set default countries with flags
        setAllCountries([
          { code: 'RU', name: 'Russia', dialCode: '+7', flag: '🇷🇺' },
          { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
          { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
          { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' },
          { code: 'AE', name: 'UAE', dialCode: '+971', flag: '🇦🇪' },
        ]);
      }
    };

    detectCountry();
  }, []);

  // Helper function to get flag emoji
  // const getCountryFlag = (countryCode) => {
  //   const flags = {
  //     'EG': '🇪🇬', 'US': '🇺🇸', 'GB': '🇬🇧', 'FR': '🇫🇷', 'DE': '🇩🇪',
  //     'IT': '🇮🇹', 'ES': '🇪🇸', 'SA': '🇸🇦', 'AE': '🇦🇪', 'KW': '🇰🇼',
  //     'QA': '🇶🇦', 'BH': '🇧🇭', 'OM': '🇴🇲', 'JO': '🇯🇴', 'LB': '🇱🇧',
  //     'CA': '🇨🇦', 'AU': '🇦🇺', 'IN': '🇮🇳', 'CN': '🇨🇳', 'JP': '🇯🇵',
  //     'BR': '🇧🇷', 'RU': '🇷🇺', 'TR': '🇹🇷'
  //   };
  //   return flags[countryCode] || '🌍';
  // };



  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const result = await publicService.submitContactForm(formData);
      if (result.success) {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        alert("Thank you! Your message has been sent successfully.");
      }
    } catch (error) {
      alert("Sorry, there was an error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCountrySelect = (country) => {
    console.log('🏳️ Country selected:', country);
    setSelectedCountry(country);
    setShowCountryDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCountryDropdown && !event.target.closest('.country-selector')) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCountryDropdown]);

  return (
    <div className="bg-white">
      {/* Main Contact Section */}
      <div className="flex flex-col lg:flex-row lg:items-start gap-4 md:gap-6 px-4 md:px-8 lg:px-20 pt-[120px] md:pt-[130px] pb-[60px] max-w-[1440px] mx-auto">
        
        {/* Left Contact Info Section - UNCHANGED */}
        <div className="w-full lg:w-[416px] min-h-[600px] lg:h-[1100px] p-4 md:p-8 lg:p-[72px_16px] flex justify-between items-center rounded-2xl bg-gradient-to-b from-[rgba(114,195,194,0.9)] to-[rgba(99,147,210,0.9)] shadow-[0px_8px_28px_0px_rgba(20,20,43,0.10)]">
          <div className="flex flex-col justify-between items-center flex-1 self-stretch gap-6 lg:gap-0">
            <div className="flex flex-col items-center gap-6 lg:gap-10">
              <Logo className="w-47 h-36 lg:w-85 lg:h-65"></Logo>
            </div>

            <div className="flex-1 lg:h-[658px] p-4 md:p-6 lg:p-[24px_16px] flex flex-col items-start gap-6 lg:gap-9 self-stretch rounded-xl">
              <div className="flex flex-col items-start gap-2 self-stretch">
                <h2 className="text-[#F3F3EE] font-['Tai_Heritage_Pro'] text-2xl md:text-3xl lg:text-[32px] xl:text-[36px] font-normal leading-normal self-stretch">
                  {t("contact.info.title")}
                </h2>
                <h3 className="text-[#F3F3EE] font-['Tai_Heritage_Pro'] text-xl md:text-2xl lg:text-[28px] font-normal leading-normal">
                  {t("contact.info.subtitle")}
                </h3>
              </div>

              <div className="flex flex-col items-start gap-4 lg:gap-6 self-stretch">
                <p className="text-[#1A2949] font-family-primary text-base lg:text-lg font-normal leading-normal self-stretch">
                  {t("contact.info.description")}
                </p>

                <div className="flex flex-col items-start gap-6 lg:gap-12 self-stretch">
                  {/* Email Contact */}
                  <div className="flex items-start gap-3 lg:gap-5 self-stretch">
                    <div className="flex w-12 h-12 lg:w-14 lg:h-14 justify-center items-center gap-2.5 rounded-xl bg-[#FEFEFD] flex-shrink-0">
                      <svg width="20" height="20" className="lg:w-6 lg:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 3.5H7C4 3.5 2 5 2 8.5V15.5C2 19 4 20.5 7 20.5H17C20 20.5 22 19 22 15.5V8.5C22 5 20 3.5 17 3.5ZM17.47 9.59L14.34 12.09C13.68 12.62 12.84 12.88 12 12.88C11.16 12.88 10.31 12.62 9.66 12.09L6.53 9.59C6.21 9.33 6.16 8.85 6.41 8.53C6.67 8.21 7.14 8.15 7.46 8.41L10.59 10.91C11.35 11.52 12.64 11.52 13.4 10.91L16.53 8.41C16.85 8.15 17.33 8.2 17.58 8.53C17.84 8.85 17.79 9.33 17.47 9.59Z" fill="#2BA6A4"/>
                      </svg>
                    </div>
                    <div className="flex flex-col items-start gap-1 lg:gap-2 flex-1 min-w-0">
                      <p className="text-white font-family-primary text-lg lg:text-xl font-semibold leading-normal self-stretch">
                        {t("contact.info.email.label")}
                      </p>
                      <p className="text-[#343946] font-family-primary text-lg lg:text-xl font-normal leading-normal self-stretch break-all">
                        info@turatrip.com
                      </p>
                    </div>
                  </div>

                  {/* Phone Contact */}
                  <div className="flex items-start gap-3 lg:gap-5 self-stretch">
                    <div className="flex w-12 h-12 lg:w-[54px] lg:h-[54px] justify-center items-center gap-2.5 rounded-xl bg-[#FEFEFD] flex-shrink-0">
                      <svg width="20" height="20" className="lg:w-6 lg:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.05 14.95L9.2 16.8C8.81 17.19 8.19 17.19 7.79 16.81C7.68 16.7 7.57 16.6 7.46 16.49C6.43 15.45 5.5 14.36 4.67 13.22C3.85 12.08 3.19 10.94 2.71 9.81C2.24 8.67 2 7.58 2 6.54C2 5.86 2.12 5.21 2.36 4.61C2.6 4 2.98 3.44 3.51 2.94C4.15 2.31 4.85 2 5.59 2C5.87 2 6.15 2.06 6.4 2.18C6.66 2.3 6.89 2.48 7.07 2.74L9.39 6.01C9.57 6.26 9.7 6.49 9.79 6.71C9.88 6.92 9.93 7.13 9.93 7.32C9.93 7.56 9.86 7.8 9.72 8.03C9.59 8.26 9.4 8.5 9.16 8.74L8.4 9.53C8.29 9.64 8.24 9.77 8.24 9.93C8.24 10.01 8.25 10.08 8.27 10.16C8.3 10.24 8.33 10.3 8.35 10.36C8.53 10.69 8.84 11.12 9.28 11.64C9.73 12.16 10.21 12.69 10.73 13.22C10.83 13.32 10.94 13.42 11.04 13.52C11.44 13.91 11.45 14.55 11.05 14.95Z" fill="#2BA6A4"/>
                        <path d="M21.9716 18.33C21.9716 18.61 21.9216 18.9 21.8216 19.18C21.7916 19.26 21.7616 19.34 21.7216 19.42C21.5516 19.78 21.3316 20.12 21.0416 20.44C20.5516 20.98 20.0116 21.37 19.4016 21.62C19.3916 21.62 19.3816 21.63 19.3716 21.63C18.7816 21.87 18.1416 22 17.4516 22C16.4316 22 15.3416 21.76 14.1916 21.27C13.0416 20.78 11.8916 20.12 10.7516 19.29C10.3616 19 9.97156 18.71 9.60156 18.4L12.8716 15.13C13.1516 15.34 13.4016 15.5 13.6116 15.61C13.6616 15.63 13.7216 15.66 13.7916 15.69C13.8716 15.72 13.9516 15.73 14.0416 15.73C14.2116 15.73 14.3416 15.67 14.4516 15.56L15.2116 14.81C15.4616 14.56 15.7016 14.37 15.9316 14.25C16.1616 14.11 16.3916 14.04 16.6416 14.04C16.8316 14.04 17.0316 14.08 17.2516 14.17C17.4716 14.26 17.7016 14.39 17.9516 14.56L21.2616 16.91C21.5216 17.09 21.7016 17.3 21.8116 17.55C21.9116 17.8 21.9716 18.05 21.9716 18.33Z" fill="#2BA6A4"/>
                      </svg>
                    </div>
                    <div className="flex flex-col items-start gap-1 lg:gap-2 flex-1 min-w-0">
                      <p className="text-white font-family-primary text-lg lg:text-xl font-semibold leading-normal self-stretch">
                        {t("contact.info.phone.label")}
                      </p>
                      <p className="text-[#343946] font-family-primary text-lg lg:text-xl font-normal leading-normal self-stretch">
                        +2001055957451
                      </p>
                    </div>
                  </div>

                  {/* Location Contact */}
                  <div className="flex items-start gap-3 lg:gap-5 self-stretch">
                    <div className="flex w-12 h-12 lg:w-[54px] lg:h-[54px] justify-center items-center gap-2.5 rounded-xl bg-[#FEFEFD] flex-shrink-0">
                      <svg width="20" height="20" className="lg:w-6 lg:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.6211 8.45C19.5711 3.83 15.5411 1.75 12.0011 1.75C12.0011 1.75 12.0011 1.75 11.9911 1.75C8.46107 1.75 4.42107 3.82 3.37107 8.44C2.20107 13.6 5.36107 17.97 8.22107 20.72C9.28107 21.74 10.6411 22.25 12.0011 22.25C13.3611 22.25 14.7211 21.74 15.7711 20.72C18.6311 17.97 21.7911 13.61 20.6211 8.45ZM12.0011 13.46C10.2611 13.46 8.85107 12.05 8.85107 10.31C8.85107 8.57 10.2611 7.16 12.0011 7.16C13.7411 7.16 15.1511 8.57 15.1511 10.31C15.1511 12.05 13.7411 13.46 12.0011 13.46Z" fill="#2BA6A4"/>
                      </svg>
                    </div>
                    <div className="flex flex-col items-start gap-1 lg:gap-2 flex-1 min-w-0">
                      <p className="text-white font-family-primary text-lg lg:text-xl font-semibold leading-normal">
                        {t("contact.info.location.label")}
                      </p>
                      <p className="text-[#343946] font-family-primary text-lg lg:text-xl font-normal leading-normal self-stretch">
                        {t("contact.info.location.address")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Contact Form Section */}
        <div className="flex min-h-[600px] lg:h-[1100px] p-6 md:p-12 lg:p-[72px] flex-col justify-between items-center flex-1 rounded-2xl bg-gradient-to-b from-[rgba(114,195,194,0.9)] to-[rgba(99,147,210,0.9)] shadow-[0px_8px_28px_0px_rgba(20,20,43,0.10)]">
          <div className="flex flex-col justify-between items-center flex-1 self-stretch gap-6 lg:gap-0">
            
            {/* Header Section */}
            <div className="flex flex-col items-start gap-2 self-stretch">
              <div className="flex flex-col items-center gap-4 self-stretch">
                <h1 className="text-white text-center text-shadow-[0px_14px_42px_rgba(20,20,43,0.14)] font-['Bebas_Neue'] text-3xl md:text-4xl lg:text-5xl xl:text-[56px] font-normal leading-normal self-stretch">
                  {t("contact.form.title")}
                </h1>
                <p className="text-[#F3F3EE] text-center text-shadow-[0px_14px_42px_rgba(20,20,43,0.14)] font-family-primary text-lg md:text-xl lg:text-2xl font-normal leading-normal self-stretch">
                  {t("contact.form.description")}
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="flex w-full max-w-none lg:max-w-[626px] p-6 md:p-8 lg:p-[40px_32px] flex-col items-center gap-2 rounded-xl bg-[#F9F9F7] shadow-[0px_14px_42px_0px_rgba(20,20,43,0.14)]">
              <form onSubmit={handleSubmit} className="flex flex-col items-start gap-6 lg:gap-8 self-stretch">
                
                {/* First Name & Last Name Row */}
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 self-stretch">
                  <div className="flex flex-col items-end gap-1 flex-1 w-full md:w-auto">
                    <label className="text-[#222E50] font-['Tai_Heritage_Pro'] text-lg lg:text-xl font-normal leading-[1.2] self-stretch">
                      {t("contact.form.firstName")}
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder={t("contact.form.firstNamePlaceholder")}
                      className="flex h-10 lg:h-[38px] p-3 justify-end items-center gap-2 self-stretch rounded-lg border border-[#E8E7EA] bg-white text-[#8A8D95] font-family-primary text-sm lg:text-base font-normal leading-normal focus:outline-none focus:border-sea-green-500"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-1 w-full md:w-auto">
                    <label className="text-[#222E50] font-['Tai_Heritage_Pro'] text-lg lg:text-xl font-normal leading-[1.2] self-stretch">
                      {t("contact.form.lastName")}
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder={t("contact.form.lastNamePlaceholder")}
                      className="flex h-10 lg:h-[38px] p-3 justify-end items-center gap-2 self-stretch rounded-lg border border-[#E8E7EA] bg-white text-[#8A8D95] font-family-primary text-sm lg:text-base font-normal leading-normal focus:outline-none focus:border-sea-green-500"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Email & Phone Row */}
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 self-stretch">
                  <div className="flex flex-col items-start gap-2 flex-1 w-full md:w-auto">
                    <div className="flex flex-col items-end gap-1 self-stretch">
                      <label className="text-[#222E50] font-['Tai_Heritage_Pro'] text-lg lg:text-xl font-normal leading-[1.2] self-stretch">
                        {t("contact.form.email")}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t("contact.form.emailPlaceholder")}
                        className="flex h-10 lg:h-[38px] p-3 justify-end items-center gap-2 self-stretch rounded-lg border border-[#E8E7EA] bg-white text-[#8A8D95] font-family-primary text-sm lg:text-base font-normal leading-normal focus:outline-none focus:border-sea-green-500"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-1 w-full md:w-auto">
                    <label className="text-[#222E50] font-['Tai_Heritage_Pro'] text-lg lg:text-[22px] font-normal leading-[1.2] self-stretch">
                      {t("contact.form.phone")}
                    </label>
                    <div className="flex h-10 lg:h-[38px] items-center self-stretch rounded-lg border border-[#E6E6E6] bg-white" style={{ overflow: 'visible' }}>
                      {/* FIXED: Country selector with proper flag display */}
                      <div className="relative country-selector" style={{ zIndex: 1000 }}>
                        <div 
                          className="flex items-center gap-2 px-3 border-r border-[#E6E6E6] bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => {
                            console.log('Dropdown clicked, current state:', showCountryDropdown);
                            setShowCountryDropdown(!showCountryDropdown);
                          }
                          }
                        >
                          <div className="flex items-center gap-2">
                            {/* Display current country flag and dial code */}
                          <img 
                            src={`https://flagcdn.com/16x12/${selectedCountry.code.toLowerCase()}.png`}
                            alt={selectedCountry.name}
                            className="w-4 h-3"
                          /> 
                          <span className="text-sm text-gray-700 font-medium">{selectedCountry.dialCode}</span>
                            <svg width="12" height="12" className="lg:w-4 lg:h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M13.2787 5.96655L8.93208 10.3132C8.41875 10.8266 7.57875 10.8266 7.06542 10.3132L2.71875 5.96655" stroke="#B3B3B3" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </div>
                        
                        {/* Country Dropdown */}
                        {showCountryDropdown && (
                          <div className="absolute top-full left-0 z-50 bg-white border border-gray-200 rounded-lg text-black shadow-xl max-h-48 overflow-y-auto w-50 mt-1"> 
                            {/* style={{
                              top: '100%',
                              left: '0',
                              zIndex: 9999,
                              marginTop: '4px'
                            }}
                          > */}
                            {allCountries.map((country) => (
                              <div
                                key={country.code}
                                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                                onClick={() => handleCountrySelect(country)}
                              >
                                <img 
                                  src={`https://flagcdn.com/16x12/${country.code.toLowerCase()}.png`}
                                  alt={country.name}
                                  className="w-4 h-3"
                                />                                
                                <span className="flex-1 text-sm font-medium">{country.name}</span>
                                <span className="text-sm text-gray-500">{country.dialCode}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={t("contact.form.phonePlaceholder")}
                        className="text-[#8A8D95] font-family-primary text-sm lg:text-base font-normal leading-normal flex-1 outline-none px-3 min-w-0 focus:text-gray-700"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                {/* Subject Row */}
                <div className="flex items-center gap-6 self-stretch">
                  <div className="flex flex-col items-end gap-1 flex-1">
                    <label className="text-[#222E50] font-['Tai_Heritage_Pro'] text-lg lg:text-xl font-normal leading-[1.2] self-stretch">
                      {t("contact.form.subject")}
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder={t("contact.form.subjectPlaceholder")}
                      className="flex h-10 lg:h-[38px] p-3 justify-end items-center gap-2 self-stretch rounded-lg border border-[#E8E7EA] bg-white text-[#8A8D95] font-family-primary text-sm lg:text-base font-normal leading-normal focus:outline-none focus:border-sea-green-500"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div className="flex flex-col items-end gap-1 self-stretch">
                  <label className="text-[#222E50] font-['Tai_Heritage_Pro'] text-lg lg:text-xl font-normal leading-[1.2] self-stretch">
                    {t("contact.form.message")}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t("contact.form.messagePlaceholder")}
                    className="flex p-3 justify-end items-start gap-2 self-stretch h-32 lg:h-[218px] rounded-lg border border-[#E8E7EA] bg-white text-[#8A8D95] font-family-primary text-sm lg:text-base font-normal leading-normal resize-none focus:outline-none focus:border-sea-green-500"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex p-3 justify-center items-center gap-3 self-stretch rounded-md transition-colors ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-[#1F7674] hover:bg-[#124645]'
                  }`}
                >
                  <span className="text-[#EAF6F6] font-family-primary text-xl lg:text-2xl font-semibold leading-normal">
                    {isSubmitting ? "Sending..." : t("contact.form.send")}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Debug info - Remove in production */}
      {/* <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs">
        Selected: {selectedCountry.flag} {selectedCountry.name} ({selectedCountry.dialCode})
      </div> */}
    </div>
  );
};

export default Contact;
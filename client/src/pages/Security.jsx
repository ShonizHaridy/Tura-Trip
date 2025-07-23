// src/pages/Security.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldTick, SecuritySafe, Health, Call } from 'iconsax-react';

const Security = () => {
  const { t } = useTranslation();

  const securityFeatures = [
    {
      icon: ShieldTick,
      key: "travelInsurance"
    },
    {
      icon: SecuritySafe,
      key: "licensedOperators"
    },
    {
      icon: Health,
      key: "safetyProtocols"
    },
    {
      icon: Call,
      key: "emergencySupport"
    }
  ];

  const safetyTips = {
    beforeTrip: [
      "checkRequirements",
      "reviewItinerary", 
      "keepContacts",
      "followRecommendations"
    ],
    duringTrip: [
      "stayWithGroup",
      "beAware",
      "keepBelongings",
      "reportConcerns"
    ]
  };

  return (
    <div className="min-h-screen bg-white pt-[100px]">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-danim to-sea-green-600">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bebas text-white mb-6">
              {t("security.hero.title")}
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              {t("security.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bebas text-danim-800 mb-4">
              {t("security.approach.title")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("security.approach.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {securityFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-sea-green-50 rounded-xl flex items-center justify-center mb-6">
                    <IconComponent variant="bulk" color="#2BA6A4" className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-danim-800 mb-4">
                    {t(`security.features.${feature.key}.title`)}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t(`security.features.${feature.key}.description`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* General Safety Information */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bebas text-danim-800 mb-8 text-center">
              {t("security.tips.title")}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-danim-800 mb-6">
                  {t("security.tips.beforeTrip.title")}
                </h3>
                <ul className="space-y-3 text-gray-700">
                  {safetyTips.beforeTrip.map((tip, index) => (
                    <li key={index}>• {t(`security.tips.beforeTrip.${tip}`)}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-danim-800 mb-6">
                  {t("security.tips.duringTrip.title")}
                </h3>
                <ul className="space-y-3 text-gray-700">
                  {safetyTips.duringTrip.map((tip, index) => (
                    <li key={index}>• {t(`security.tips.duringTrip.${tip}`)}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      {/* <section className="py-20 bg-gradient-to-br from-danim-800 to-danim">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bebas text-white mb-6">
            {t("security.contact.title")}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            {t("security.contact.description")}
          </p>
          <button className="bg-white text-danim-800 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg">
            {t("security.contact.button")}
          </button>
        </div>
      </section> */}
    </div>
  );
};

export default Security;
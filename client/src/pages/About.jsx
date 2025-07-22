// src/pages/About.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  WalletRemove,
  ShieldTick,
  VolumeHigh,
  Personalcard,
  Timer1,
  EmojiHappy,
  Camera,
  EyeSlash,
  Global,
  MessageQuestion,
  WalletCheck,
} from "iconsax-react";

const About = () => {
  const { t } = useTranslation();

  const features = [
    { icon: WalletRemove, key: "noPrepayment" },
    { icon: ShieldTick, key: "insuranceValid" },
    { icon: Personalcard, key: "personalManager" },
    { icon: VolumeHigh, key: "englishGuides" },
    { icon: Timer1, key: "quickReservation" },
    { icon: EmojiHappy, key: "happyCustomers" },
    { icon: Camera, key: "realPhotos" },
    { icon: EyeSlash, key: "noHiddenExtra" }
  ];

  const services = [
    { name: "historicalCities", bgUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/c5976d2eb1be4ead941dcd5efa41c25b533939b4?width=340" },
    { name: "seaExcursions", bgUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/2f2e9110f0dc7be631ad1dd82ace7f75a3374e3f?width=340" },
    { name: "safariAdventure", bgUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/deffebbff8bdac3353e5d8baeb897c72e7396cd6?width=340" },
    { name: "entertainmentSpa", bgUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/c5976d2eb1be4ead941dcd5efa41c25b533939b4?width=340" },
    { name: "transportation", bgUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/6deb9728f816cb68fb46b106832a2bac201cae52?width=340" },
    { name: "individualTours", bgUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/c5976d2eb1be4ead941dcd5efa41c25b533939b4?width=340" }
  ];

  const teamMembers = [
    {
      name: "Adel Huessin",
      role: "founderCeo",
      description: "founderDescription",
      img: "https://cdn.builder.io/api/v1/image/assets/TEMP/deffebbff8bdac3353e5d8baeb897c72e7396cd6?width=340",
    },
    {
      name: "Mohammed Esmail", 
      role: "tourOperationsManager",
      description: "tourManagerDescription",
      img: "https://cdn.builder.io/api/v1/image/assets/TEMP/deffebbff8bdac3353e5d8baeb897c72e7396cd6?width=340",
    },
    {
      name: "Mohammed ali",
      role: "russianRelationsDirector", 
      description: "russianDirectorDescription",
      img: "https://cdn.builder.io/api/v1/image/assets/TEMP/deffebbff8bdac3353e5d8baeb897c72e7396cd6?width=340",
    },
    {
      name: "Mostafa ahmed",
      role: "customerExperienceLead",
      description: "customerLeadDescription", 
      img: "https://cdn.builder.io/api/v1/image/assets/TEMP/deffebbff8bdac3353e5d8baeb897c72e7396cd6?width=340",
    },
  ];

  const whyChooseFeatures = [
    { icon: Global, key: "diverseOptions" },
    { icon: MessageQuestion, key: "multilingualSupport" },
    { icon: WalletCheck, key: "flexiblePayment" },
    { icon: ShieldTick, key: "safetyFirst" }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative h-[483px] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/src/assets/Aboutus.jpg')`,
        }}
      >
        <div className="text-center text-white px-4">
          <h1 className="text-5xl lg:text-6xl font-bold mb-4">{t("about.hero.title")}</h1>
          <p className="text-lg lg:text-xl max-w-3xl mx-auto">
            {t("about.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Plan Your Trip Section */}
      <section className="flex py-20 px-[72px] justify-between items-center w-full h-[917px] bg-white">
        <div className="flex flex-col items-start gap-[60px]">
          <div className="flex h-[243px] flex-col justify-center items-start gap-[46px] w-full">
            <h2 className="text-danim-700 font-great-vibes text-[48px] font-normal leading-[40px]">
              {t("about.planTrip.subtitle")}
            </h2>
            <div className="flex flex-col items-start gap-2 w-full">
              <h3 className="text-danim-700 font-family-display text-[70px] font-normal leading-[78px]">
                {t("about.planTrip.title")}
              </h3>
              <p className="w-[508px] text-black font-inter text-[16px] font-normal leading-[28px]">
                {t("about.planTrip.description")}
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="flex items-start gap-6">
            <div className="flex flex-col items-start gap-6">
              {features.slice(0, 4).map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex w-10 h-10 p-2 justify-center items-center gap-2 rounded-[50px]">
                      <IconComponent
                        variant="bulk"
                        color="#3F62AE"
                        className="w-8 h-8"
                      />
                    </div>
                    <div className="flex flex-col items-start gap-2">
                      <span className="text-[#2D467C] font-roboto text-[18px] font-bold">
                        {t(`about.features.${feature.key}`)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col items-start gap-6">
              {features.slice(4, 8).map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex w-10 h-10 p-2 justify-center items-center gap-2 rounded-[8px]">
                      <IconComponent
                        variant="bulk"
                        color="#3F62AE"
                        className="w-8 h-8"
                      />
                    </div>
                    <div className="flex flex-col items-start gap-2">
                      <span className="text-[#2D467C] font-roboto text-[18px] font-bold">
                        {t(`about.features.${feature.key}`)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Images */}
        <div className="relative w-[607px] h-[757px]">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/7c17a7029fce170077a1c476f2f5af565c4c9e59?width=751"
            alt={t("about.images.resortPool")}
            className="absolute top-0 right-0 w-[376px] h-[441px] rounded-[24px] shadow-[0px_8px_28px_rgba(20,20,43,0.10)] object-cover"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/36243efbf1a3e9241c1d3731f3b2904b80cae2aa?width=767"
            alt={t("about.images.desertBuggy")}
            className="absolute top-[98px] left-0 w-[384px] h-[449px] rounded-[24px] shadow-[0px_8px_28px_rgba(20,20,43,0.10)] object-cover"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/b1dba8229033f5ae6488845180989724e43460e2?width=767"
            alt={t("about.images.boatTour")}
            className="absolute top-[464px] left-[222px] w-[384px] h-[292px] rounded-[24px] shadow-[0px_8px_28px_rgba(20,20,43,0.10)] object-cover"
          />
        </div>
      </section>

      {/* Services Section */}
      <section className="flex py-24 px-[72px] flex-col items-center gap-10 bg-[rgba(17,32,51,0.18)]">
        <div className="flex flex-col items-start gap-12 w-full">
          <div className="flex w-[768px] flex-col items-start gap-6">
            <div className="flex flex-col items-start gap-3 w-full">
              <h2 className="text-[#1A2949] font-bebas text-[56px] font-normal leading-[44px] tracking-[-1.12px]">
                {t("about.services.title")}
              </h2>
            </div>
            <p className="text-[#1A2949] font-roboto text-[20px] font-normal leading-[25.4px]">
              {t("about.services.subtitle")}
            </p>
          </div>
        </div>

        <div className="flex p-8 items-start gap-10 rounded-[24px] bg-[#FEFEFD] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex flex-col justify-center items-start gap-3"
            >
              <div
                className="flex w-[170px] h-[116px] justify-center items-center gap-2 rounded-[16px]"
                style={{
                  background: `url('${service.bgUrl}') lightgray 50% / cover no-repeat`,
                }}
              ></div>
              <div className="flex flex-col items-start gap-2 w-full">
                <h3 className="text-[#2D467C] text-center font-roboto text-[18px] font-bold">
                  {t(`about.services.${service.name}`)}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Tura Trip Section */}
      <section className="flex py-20 px-[72px] flex-col justify-center items-center gap-10 bg-white">
        <div className="flex w-[1296px] flex-col justify-center items-center gap-8">
          <h2 className="text-center text-[#233660] font-bebas text-[56px] font-normal leading-[120%]">
            {t("about.company.title")}
          </h2>
          <div className="flex items-center gap-10">
            <div className="w-[636px] text-[#1A2949] font-family-primary text-[27px] font-normal leading-[180%]">
              <div dangerouslySetInnerHTML={{ __html: t("about.company.description") }} />
            </div>
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F18ed9e795a594d2e8a734bedc16dd837%2F8e319e79cf5e41ad8428b06b29cb0829?format=webp&width=800"
              alt={t("about.company.officeAlt")}
              className="w-[458px] h-[491px] rounded-[32px] shadow-[0px_14px_42px_rgba(20,20,43,0.14)] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative w-full h-[625px] bg-gradient-to-b from-transparent to-black/40">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40"></div>
        <div className="flex flex-col justify-center items-center gap-8 absolute left-[72px] top-[80px] w-[1296px] h-[465px]">
          <h2 className="text-center text-[#233660] font-bebas text-[56px] font-normal leading-[120%] drop-shadow-[0px_8px_28px_rgba(20,20,43,0.10)]">
            {t("about.team.title")}
          </h2>

          <div className="flex items-center gap-6">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="flex w-[306px] flex-col justify-center items-start shadow-[0px_8px_28px_rgba(20,20,43,0.10)]"
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-[306px] h-[214px] object-cover rounded-t-[16px]"
                />
                <div className="flex w-[306px] p-4 flex-col items-start gap-4 bg-[#FEFEFD] rounded-b-[16px]">
                  <div className="flex flex-col justify-between items-start  w-full">
                    <h3 className="text-[#2D467C] font-roboto text-[20px] font-bold">
                      {member.name}
                    </h3>
                    <div className="flex items-center gap-1 w-full">
                      <p className="w-[270px] text-[#666664] font-roboto text-[16px] font-normal">
                        {t(`about.team.${member.description}`)}
                      </p>
                    </div>
                    <div className="w-[274px] bg-[#BFD1D3]"></div>
                    <div className="flex items-center gap-2 w-full">
                      <div className="flex h-6 px-[10px] py-[2px] justify-center items-center rounded bg-[#F3F4F6]">
                        <span className="text-[#1F2937] font-roboto text-[12px] font-normal">
                          {t(`about.team.${member.role}`)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-[60px] px-[72px] bg-white">
        <div className="flex flex-col justify-center items-center gap-10 max-w-[1296px] mx-auto">
          <h2 className="text-center text-[#233660] font-bebas text-[56px] font-normal leading-[120%]">
            {t("about.whyChoose.title")}
          </h2>

          <div className="flex flex-col justify-center items-center gap-8 w-full">
            {/* First Row */}
            <div className="flex justify-center items-start gap-8 w-full">
              {whyChooseFeatures.slice(0, 2).map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex p-6 items-start gap-4 rounded-[20px] bg-[#ECEFF7] flex-1 max-w-[632px]">
                    <div className="relative w-16 h-16">
                      <div className="w-16 h-16 rounded-[12px] bg-[#C3CEE6]"></div>
                      <div className="absolute top-4 left-4">
                        <IconComponent
                          variant="bulk"
                          color="#3F62AE"
                          className="w-8 h-8"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-start gap-2 flex-1">
                      <h3 className="text-[#272727] font-roboto text-[24px] font-bold">
                        {t(`about.whyChoose.${feature.key}.title`)}
                      </h3>
                      <p className="text-[#272727] font-roboto text-[20px] font-normal opacity-70 leading-normal">
                        {t(`about.whyChoose.${feature.key}.description`)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Second Row */}
            <div className="flex justify-center items-center gap-8 w-full">
              {whyChooseFeatures.slice(2, 4).map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex p-6 items-start gap-4 rounded-[20px] bg-[#ECEFF7] flex-1 max-w-[632px]">
                    <div className="relative w-16 h-16">
                      <div className="w-16 h-16 rounded-[12px] bg-[#C3CEE6]"></div>
                      <div className="absolute top-4 left-4">
                        <IconComponent
                          variant="bulk"
                          color="#3F62AE"
                          className="w-8 h-8"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-start gap-2 flex-1">
                      <h3 className="text-[#272727] font-roboto text-[24px] font-bold">
                        {t(`about.whyChoose.${feature.key}.title`)}
                      </h3>
                      <p className="text-[#272727] font-roboto text-[20px] font-normal opacity-70 leading-normal">
                        {t(`about.whyChoose.${feature.key}.description`)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="relative py-20 bg-cover"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/src/assets/aboutbrowse.jpg')`,
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            {t("about.cta.title")}
          </h2>
          <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
            {t("about.cta.description")}
          </p>
          <button className="bg-white text-danim-800 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg">
            {t("about.cta.button")}
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;
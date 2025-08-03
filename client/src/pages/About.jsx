// src/pages/About.jsx
import React from 'react';
import { Link } from 'react-router-dom';
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
    { name: "historicalCities", bgUrl: "/images/services1.png" },
    { name: "seaExcursions", bgUrl: "/images/services2.png" },
    { name: "safariAdventure", bgUrl: "/images/services3.png" },
    { name: "entertainmentSpa", bgUrl: "/images/services4.png" },
    { name: "transportation", bgUrl: "/images/services5.png" },
    { name: "individualTours", bgUrl: "/images/services6.png" }
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
        className="relative h-[280px] lg:h-[483px] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/images/Aboutus.jpg')`,
        }}
      >
        <div className="text-center text-white px-4 pt-20">
          <h1 className="text-[28px] md:text-5xl lg:text-6xl text-isabelline font-bold font-family-primary mb-4">{t("about.hero.title")}</h1>
          <p className="text-[18px] md:text-lg lg:text-xl text-isabelline-600 font-family-primary mx-auto">
            {t("about.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Plan Your Trip Section */}
      <section className="flex flex-col gap-10 lg:gap-[186px] lg:flex-row py-10 lg:py-20 px-4 lg:px-[72px] pb-18 justify-between items-center w-full  bg-white">
        <div className="flex flex-col lg:items-start gap-[60px]">
          <div className="flex flex-col justify-center items-start gap-6 w-full">
            <div className="flex flex-col items-start gap-8 w-full">
              <h2 className="text-danim-700 font-great-vibes text-[48px] font-normal leading-[40px]">
                {t("about.planTrip.subtitle")}
              </h2>
              <h3 className="text-danim-700 font-family-display text-[40px] lg:text-[70px] font-normal leading-[78px]">
                {t("about.planTrip.title")}
              </h3>
            </div>
            <p className=" text-black font-inter text-[16px] font-normal leading-[28px]">
              {t("about.planTrip.description")}
            </p>
          </div>

          {/* Features Grid */}
          <div className="flex items-start lg:gap-6 font-family-primary">
            <div className="flex flex-1 flex-col items-start gap-1 lg:gap-6">
              {features.slice(0, 4).map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex items-center gap-1 lg:gap-2">
                    <div className="flex w-8 h-8 lg:w-10 lg:h-10 p-2 justify-center items-center gap-2 rounded-[50px]">
                      <IconComponent
                        variant="Bulk"
                        color="#3F62AE"
                        className="w-6 h-6 lg:w-8 lg:h-8"
                      />
                    </div>
                    <div className="flex flex-col items-start gap-2">
                      <span className="text-[#2D467C] font-roboto text-[11px] lg:text-[18px] font-semibold lg:font-bold">
                        {t(`about.features.${feature.key}`)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-1 flex-col items-start gap-1 lg:gap-6">
              {features.slice(4, 8).map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex items-center gap-1 lg:gap-2">
                    <div className="flex w-8 h-8 lg:w-10 lg:h-10 p-2 justify-center items-center gap-2 rounded-[50px]">
                      <IconComponent
                        variant="Bulk"
                        color="#3F62AE"
                        className="w-6 h-6 lg:w-8 lg:h-8"
                      />
                    </div>
                    <div className="flex flex-col items-start gap-2">
                      <span className="text-[#2D467C] font-roboto text-[11px] lg:text-[18px] font-semibold lg:font-bold">
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
        <div className="relative w-full max-w-[343px] lg:max-w-[1200px] h-[427px] lg:h-[757px]">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/7c17a7029fce170077a1c476f2f5af565c4c9e59?width=751"
            alt={t("about.images.resortPool")}
            className="z-1 absolute top-0 right-[2.5%] w-[60.6%] rounded-[14px] lg:rounded-[24px] shadow-[0px_8px_28px_rgba(20,20,43,0.10)] object-cover"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/36243efbf1a3e9241c1d3731f3b2904b80cae2aa?width=767"
            alt={t("about.images.desertBuggy")}
            className="z-2 absolute top-[16.3%] left-0 w-[63%] rounded-[14px] lg:rounded-[24px] shadow-[0px_8px_28px_rgba(20,20,43,0.10)] object-cover"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/b1dba8229033f5ae6488845180989724e43460e2?width=767"
            alt={t("about.images.boatTour")}
            className="z-3 absolute top-[55%] right-[2.5%] w-[63%] rounded-[14px] lg:rounded-[24px] shadow-[0px_8px_28px_rgba(20,20,43,0.10)] object-cover"
          />
        </div>
      </section>

      {/* Services Section */}
      <section className="flex py-10 lg:py-24 px-4 lg:px-[72px] flex-col items-center gap-10 bg-[rgba(17,32,51,0.18)]">
        <div className="flex flex-col items-start w-full px-2">
          <div className="flex flex-col items-start gap-4 lg:gap-6">
            <div className="flex flex-col items-start w-full">
              <h2 className="text-[#1A2949] font-family-display text-4xl lg:text-[56px] font-normal leading-[44px] tracking-[-2%]">
                {t("about.services.title")}
              </h2>
            </div>
            <p className="text-[#1A2949] font-family-primary text-[20px] font-normal leading-[25.4px]">
              {t("about.services.subtitle")}
            </p>
          </div>
        </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:p-8 lg:items-start lg:gap-10 gap-4 p-4 rounded-[24px] bg-[#FEFEFD] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex flex-col justify-center items-start gap-3"
            >
              <div
                className="flex w-full lg:w-[170px] h-[116px] md:[150px] lg:h-[116px] justify-center items-center gap-2 rounded-[16px]"
                style={{
                  background: `url('${service.bgUrl}') lightgray 50% / cover no-repeat`,
                }}
              ></div>
              <div className="flex flex-col items-center gap-2 w-full">
                <h3 className="text-[#2D467C] text-center font-family-primary text-[18px] font-semibold lg:font-bold">
                  {t(`about.services.${service.name}`)}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Tura Trip Section */}
      <section className="flex py-6 lg:py-20 px-4 lg:px-[72px] flex-col justify-center items-center gap-10 bg-white">
        <div className="flex  flex-col justify-center items-center gap-4 lg:gap-8">
          <h2 className="text-center text-[#233660] font-family-display text-[32px] lg:text-[56px] font-normal leading-[120%]">
            {t("about.company.title")}
          </h2>
          <div className="flex flex-col-reverse lg:flex-row items-center gap-10">
            <div className=" text-[#1A2949] font-family-primary text-[20px] lg:text-[27px] font-normal leading-[180%]">
              <div dangerouslySetInnerHTML={{ __html: t("about.company.description") }} />
            </div>
            <img
              src="/images/aboutturatrip.png"
              alt={t("about.company.officeAlt")}
              className="w-[344px] h-[256px] lg:w-[458px] lg:h-[491px] rounded-[32px] shadow-[0px_14px_42px_rgba(20,20,43,0.14)] object-cover"
              // className="w-fit object-cover laspect-[500/600] bg-amber-700"
            />
          </div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className="relative w-full h-[625px] bg-gradient-to-b from-transparent to-black/40">
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
      </section> */}

      {/* Why Choose Us Section */}
      <section className="py-10 lg:py-15 px-4 lg:px-[72px] bg-white">
        <div className="flex flex-col justify-center items-center gap-8 lg:gap-10 max-w-[1296px] mx-auto">
          <h2 className="text-center text-[#233660] font-family-display text-[32px] lg:text-[56px] font-normal leading-[120%]">
            {t("about.whyChoose.title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {whyChooseFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="flex p-6 items-start gap-4 rounded-[20px] bg-[#ECEFF7] flex-1 max-w-[632px]">
                  <div className="relative w-16 h-16">
                    <div className="w-16 h-16 rounded-[12px] bg-[#C3CEE6]"></div>
                    <div className="absolute top-4 left-4">
                      <IconComponent
                        variant="Bulk"
                        color="#3F62AE"
                        className="w-8 h-8"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-2 flex-1">
                    <h3 className="text-[#272727] font-family-primary text-[20px] lg:text-[24px] font-semibold">
                      {t(`about.whyChoose.${feature.key}.title`)}
                    </h3>
                    <p className="text-[#272727] font-family-primary text-[14px] lg:text-[20px] font-medium opacity-70 leading-normal">
                      {t(`about.whyChoose.${feature.key}.description`)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="relative py-20 bg-cover"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/aboutbrowse.jpg')`,
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-[18px] lg:text-4xl font-bold text-white mb-4">
            {t("about.cta.title")}
          </h2>
          <p className="text-[16px] text-gray-200 mb-8 max-w-2xl mx-auto">
            {t("about.cta.description")}
          </p>
          <Link 
          to="/browse-tours"
          className="bg-white-secondary2 text-sea-green-900 px-3 lg:px-4 py-2 rounded-sm lg:rounded-[6px] font-semibold hover:bg-sea-green-600 hover:text-sea-green-900 transition-colors text-lg">
            {t("about.cta.button")}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
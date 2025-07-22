// src/pages/Payment.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const Payment = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white">
      {/* Hero Banner Section */}
      <section className="relative h-[483px] flex items-center justify-center bg-gradient-to-r from-black/30 to-black/30 bg-[url('src/assets/payment-hero.jpg')] bg-cover bg-center">
        <div className="flex w-full max-w-[889px] flex-col justify-center items-center gap-2 px-4">
          <h1 className="text-center text-gray-100 font-family-primary text-4xl md:text-5xl lg:text-[56px] font-bold leading-normal drop-shadow-[0_14px_42px_rgba(20,20,43,0.14)]">
            {t("payment.hero.title")}
          </h1>
          <p className="text-center text-[#DDDDD9] font-family-primary text-lg md:text-xl lg:text-2xl font-normal leading-normal drop-shadow-[0_14px_42px_rgba(20,20,43,0.14)]">
            {t("payment.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="flex flex-col items-center">
        <div className="relative max-w-[1246px] w-full px-4 md:px-8 lg:px-12 py-16">
          {/* Background SVG */}
          <svg
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[1144px] h-auto opacity-20 fill-[#A7B7DA] -z-10"
            viewBox="0 0 1144 536"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1143.53 534.658H1016.95L778.752 296.457L540.62 534.658H413.974L507.89 440.811L364.777 297.767L126.645 535.898H0L301.523 234.444L72.4177 5.33833L76.4142 1.34189H194.998L364.777 171.121L428.1 234.444L571.144 377.488L715.498 233.203L486.324 4.098L490.32 0.101562H608.972L778.752 169.881L842.074 233.203L1143.53 534.658Z" />
          </svg>

          {/* Content Sections */}
          <div className="relative z-10 flex flex-col gap-9 md:gap-9 lg:gap-9">
            {/* Section 01 - Payment Methods */}
            <section className="flex flex-col md:flex-row items-start gap-4 md:gap-8">
              <div className="text-rose-black-300 font-family-display text-4xl md:text-5xl lg:text-[48px] font-normal leading-normal flex-shrink-0">
                01
              </div>
              <div className="flex flex-col gap-4 flex-1">
                <div className="px-0 md:px-4">
                  <div className="flex items-center gap-4 mb-4">
                    <h2 className="text-danim font-family-display text-3xl md:text-4xl lg:text-[48px] font-normal leading-normal">
                      {t("payment.methods.title")}
                    </h2>
                  </div>
                  <p className="text-rose-black-400 font-family-primary text-xl md:text-2xl lg:text-[28px] font-medium leading-normal mb-4">
                    {t("payment.methods.subtitle")}
                  </p>
                </div>
                <div className="text-rose-black-400 font-family-primary text-lg md:text-xl lg:text-2xl font-normal leading-[1.4] space-y-2">
                  <div>{t("payment.methods.transfer")}</div>
                  <div>{t("payment.methods.cash")}</div>
                </div>
              </div>
            </section>

            {/* Section 02 - Features of Payment */}
            <section className="flex flex-col md:flex-row items-start gap-4 md:gap-8">
              <div className="text-rose-black-300 font-family-display text-4xl md:text-5xl lg:text-[48px] font-normal leading-normal flex-shrink-0">
                02
              </div>
              <div className="flex flex-col gap-4 flex-1">
                <div className="px-0 md:px-4">
                  <div className="flex items-center gap-4 mb-4">
                    <h2 className="text-danim font-family-display text-3xl md:text-4xl lg:text-[48px] font-normal leading-normal">
                      {t("payment.features.title")}
                    </h2>
                  </div>
                </div>
                <div className="text-rose-black-400 font-family-primary text-lg md:text-xl lg:text-2xl leading-[1.4] space-y-6">
                  <div dangerouslySetInnerHTML={{ __html: t("payment.features.noPrepayment") }} />
                  <div dangerouslySetInnerHTML={{ __html: t("payment.features.convenientMethods") }} />
                  <div dangerouslySetInnerHTML={{ __html: t("payment.features.nonCashPayment") }} />
                </div>
              </div>
            </section>

            {/* Section 03 - Refund of Prepayment */}
            <section className="flex flex-col md:flex-row items-start gap-4 md:gap-8">
              <div className="text-rose-black-300 font-family-display text-4xl md:text-5xl lg:text-[48px] font-normal leading-normal flex-shrink-0">
                03
              </div>
              <div className="flex flex-col gap-4 flex-1">
                <div className="px-0 md:px-4">
                  <div className="flex items-center gap-4 mb-4">
                    <h2 className="text-danim font-family-display text-3xl md:text-4xl lg:text-[48px] font-normal leading-normal">
                      {t("payment.refund.title")}
                    </h2>
                  </div>
                </div>
                <div className="text-rose-black-400 font-family-primary text-lg md:text-xl lg:text-2xl font-normal leading-[1.4] space-y-4">
                  <p>{t("payment.refund.conditions")}</p>
                  <p>{t("payment.refund.exception")}</p>
                  <p>{t("payment.refund.process")}</p>
                </div>
              </div>
            </section>

            {/* Section 04 - What to do if organizers don't fulfill obligations */}
            <section className="flex flex-col md:flex-row items-start gap-4 md:gap-8">
              <div className="text-rose-black-300 font-family-display text-4xl md:text-5xl lg:text-[48px] font-normal leading-normal flex-shrink-0">
                04
              </div>
              <div className="flex flex-col gap-4 flex-1">
                <div className="px-0 md:px-4">
                  <div className="flex items-center gap-4 mb-4">
                    <h2 className="text-danim font-family-display text-3xl md:text-4xl lg:text-[48px] font-normal leading-normal">
                      {t("payment.obligations.title")}
                    </h2>
                  </div>
                </div>
                <div className="text-rose-black-400 font-family-primary text-lg md:text-xl lg:text-2xl font-bold leading-[1.4] space-y-6">
                  <p className="font-normal">{t("payment.obligations.intro")}</p>
                  <div className="space-y-3">
                    <div dangerouslySetInnerHTML={{ __html: t("payment.obligations.step1") }} />
                    <div dangerouslySetInnerHTML={{ __html: t("payment.obligations.step2") }} />
                    <div dangerouslySetInnerHTML={{ __html: t("payment.obligations.step3") }} />
                    <div dangerouslySetInnerHTML={{ __html: t("payment.obligations.step4") }} />
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: t("payment.obligations.resolution") }} />
                  <p className="font-normal">{t("payment.obligations.recommendation")}</p>
                  <div dangerouslySetInnerHTML={{ __html: t("payment.obligations.alternatives") }} />
                  <p className="font-normal">{t("payment.obligations.caseByCase")}</p>
                  <div dangerouslySetInnerHTML={{ __html: t("payment.obligations.afterTour") }} />
                  <div className="space-y-4">
                    <div dangerouslySetInnerHTML={{ __html: t("payment.obligations.requirement1") }} />
                    <div dangerouslySetInnerHTML={{ __html: t("payment.obligations.requirement2") }} />
                    <div dangerouslySetInnerHTML={{ __html: t("payment.obligations.requirement3") }} />
                  </div>
                  <div className="mt-8 space-y-4">
                    <div dangerouslySetInnerHTML={{ __html: t("payment.obligations.disclaimer") }} />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
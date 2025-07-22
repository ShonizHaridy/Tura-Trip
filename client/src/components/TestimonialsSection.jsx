// src/components/TestimonialsSection.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";

const TestimonialsSection = ({ reviews = [] }) => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fallback testimonials if no reviews provided
  const defaultTestimonials = [
    {
      id: 1,
      client_name: "Judith Black",
      review_text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed urna nulla vitae laoreet augue. Amet feugiat est integer dolor auctor adipiscing nunc urna, sit.",
      review_date: "2025-04-24T00:00:00.000Z",
      screenshot_image_url: "https://cdn.builder.io/api/v1/image/assets%2F18ed9e795a594d2e8a734bedc16dd837%2F15d2ca86e6434dcda59dcc7ba68c42f0?format=webp&width=800",
    }
  ];

  const testimonials = reviews.length > 0 ? reviews : defaultTestimonials;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  const currentTestimonial = testimonials[currentSlide];
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div
      className="w-full bg-[#F3F3EE] py-10 md:py-20 px-4 md:px-40 relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, #F3F3EE 18.34%, rgba(243, 243, 238, 0.00) 54.85%, #F3F3EE 84.15%), url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Cpath d="M0,50 Q25,25 50,50 T100,50 L100,100 L0,100 Z" fill="%23ffffff" opacity="0.1"/%3E%3C/svg%3E') lightgray 0px -35.5px / 100% 117.444% no-repeat`,
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 md:mb-20">
          <div className="flex justify-center items-center mb-2">
            <h2 className="text-[#233660] font-great-vibes text-3xl md:text-[67px] leading-[120%]">
              {t("homepage.testimonials.title")}
            </h2>
          </div>
          <p className="text-[#233660] font-roboto text-lg md:text-[28px]">
            {t("homepage.testimonials.subtitle")}
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          <div className="flex flex-col justify-center items-center gap-12">
            
            {/* Mobile: Stacked layout (column) */}
            <div className="lg:hidden w-full max-w-[343px] mx-auto">
              <div className="relative">
                <img
                  src={currentTestimonial.screenshot_image_url || "https://via.placeholder.com/129x251"}
                  alt="Review screenshot"
                  className="w-[129px] h-[251px] object-cover rounded-xl mx-auto mb-2"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/129x251";
                  }}
                />
                <div className="bg-white rounded-2xl p-6 shadow-[0px_14px_42px_0px_rgba(20,20,43,0.14)]">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mb-6"
                  >
                    <path
                      d="M14.028 6C6.684 11.184 1.5 19.68 1.5 29.04C1.5 36.672 6.108 41.136 11.436 41.136C16.476 41.136 20.22 37.104 20.22 32.352C20.22 27.6 16.908 24.144 12.588 24.144C11.724 24.144 10.572 24.288 10.284 24.432C11.004 19.536 15.612 13.776 20.22 10.896L14.028 6ZM38.796 6C31.596 11.184 26.412 19.68 26.412 29.04C26.412 36.672 31.02 41.136 36.348 41.136C41.244 41.136 45.132 37.104 45.132 32.352C45.132 27.6 41.676 24.144 37.356 24.144C36.492 24.144 35.484 24.288 35.196 24.432C35.916 19.536 40.38 13.776 44.988 10.896L38.796 6Z"
                      fill="#72C3C2"
                    />
                  </svg>
                  <blockquote className="text-[#124645] font-roboto text-lg font-medium leading-normal mb-6">
                    {currentTestimonial.review_text}
                  </blockquote>
                  <div>
                    <div className="text-[#555A64] font-roboto text-base font-medium leading-6">
                      {currentTestimonial.client_name}
                    </div>
                    <div className="text-[#555A64] font-roboto text-base font-medium leading-6">
                      {formatDate(currentTestimonial.review_date)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop: Side by side layout (row) */}
            <div className="hidden lg:flex justify-center items-center max-w-6xl mx-auto">
              <div className="flex items-center gap-8 bg-white rounded-2xl p-6 shadow-[0px_14px_42px_0px_rgba(20,20,43,0.14)] w-full">
                <img
                  src={currentTestimonial.screenshot_image_url || "https://via.placeholder.com/200x400"}
                  alt="Review screenshot"
                  className="w-[200px] h-[400px] object-cover rounded-xl flex-shrink-0"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/200x400";
                  }}
                />
                <div className="flex-1 space-y-6">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.028 6C6.684 11.184 1.5 19.68 1.5 29.04C1.5 36.672 6.108 41.136 11.436 41.136C16.476 41.136 20.22 37.104 20.22 32.352C20.22 27.6 16.908 24.144 12.588 24.144C11.724 24.144 10.572 24.288 10.284 24.432C11.004 19.536 15.612 13.776 20.22 10.896L14.028 6ZM38.796 6C31.596 11.184 26.412 19.68 26.412 29.04C26.412 36.672 31.02 41.136 36.348 41.136C41.244 41.136 45.132 37.104 45.132 32.352C45.132 27.6 41.676 24.144 37.356 24.144C36.492 24.144 35.484 24.288 35.196 24.432C35.916 19.536 40.38 13.776 44.988 10.896L38.796 6Z"
                      fill="#72C3C2"
                    />
                  </svg>
                  <blockquote className="text-[#124645] font-roboto text-[28px] font-medium leading-9">
                    {currentTestimonial.review_text}
                  </blockquote>
                  <div>
                    <div className="text-[#555A64] font-roboto text-[18px] font-medium leading-6">
                      {currentTestimonial.client_name}
                    </div>
                    <div className="text-[#555A64] font-roboto text-[18px] font-medium leading-6">
                      {formatDate(currentTestimonial.review_date)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center items-center gap-10 w-full">
              <button
                onClick={prevSlide}
                className="p-2 border border-[#3F62AE] rounded-lg cursor-pointer hover:bg-[#3F62AE]/50 hover:text-white transition-colors"
              >
                <ArrowLeft2 size="32" color="#3F62AE" />
              </button>

              {/* Dots */}
              <div className="flex gap-2 lg:gap-4">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-[10px] h-[10px] rounded-full transition-colors ${
                      index === currentSlide
                        ? "bg-[#3F62AE]"
                        : "bg-[#3F62AE] opacity-50"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="p-2 border border-[#3F62AE] rounded-lg cursor-pointer hover:bg-[#3F62AE]/50 hover:text-white transition-colors"
              >
                <ArrowRight2 size="32" color="#3F62AE" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
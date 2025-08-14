// src/components/ExcursionCard.jsx
import {
  Bus,
  Timer1,
  Calendar2
} from 'iconsax-react';

import { RiShieldUserLine } from "react-icons/ri";


const ExcursionCard = ({
  onNavigate,
  id,
  title,
  image,
  category,
  duration,
  durationUnit,
  transportation,
  daysOfWeek,
  reviews,
  originalPrice,
  price,
  priceUnit,
  isFeatured = false,
  featuredLabel = "Popular"
}) => {

  const hasDiscount = originalPrice && price && originalPrice != price;


  return (
    <div className="relative w-full max-w-[298px] mx-auto">
      {/* Main card container */}
      <div 
        className={`${isFeatured ? 'ml-2' : ''} bg-[#FEFEFD] rounded-xl shadow-[0px_8px_28px_0px_rgba(20,20,43,0.10)] overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 group`} 
        onClick={onNavigate}
      >
        {/* Image container */}
        <div className="p-2.5 pt-[10px]">
          <div className="relative h-[180px] w-full rounded-lg overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Content container */}
        <div className="px-4 pb-4 flex flex-col gap-3">
          {/* Title */}
          <h3 className="text-[#1A2B49] font-roboto text-lg font-bold leading-tight text-center min-h-[2.5rem] flex items-center justify-center">
            {title}
          </h3>

          {/* Category badge */}
          <div className="flex justify-start">
            <div className="inline-flex items-center justify-center px-2.5 py-0.5 bg-[#F3F4F6] rounded-[10px]">
              <span className="text-[#233660] font-roboto text-xs font-normal">
                {category}
              </span>
            </div>
          </div>

          {/* Details section */}
          <div className="flex flex-col gap-2">
            {/* Duration row */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <Timer1 color='currentColor' className="w-4 h-4 text-[#8A8D95]" />
                <span className="text-[#8A8D95] font-roboto text-sm font-normal">
                  Duration:
                </span>
              </div>
              <span className="text-[#8A8D95] font-roboto text-sm font-normal">
                {duration} {durationUnit}
              </span>
            </div>

            {/* Transportation or Days of Week */}
            { daysOfWeek ? (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <Calendar2 color='currentColor' className="w-4 h-4 text-[#8A8D95]" />
                  <span className="text-[#8A8D95] font-roboto text-sm font-normal">
                    Days of Week:
                  </span>
                </div>
                <span className="text-[#8A8D95] font-roboto text-sm font-normal">
                  {daysOfWeek}
                </span>
              </div>
            ) : transportation ? (
              <div className="flex items-center gap-2">
                <Bus color='currentColor' className="w-4 h-4 text-[#8A8D95]" />
                <span className="text-[#8A8D95] font-roboto text-sm font-normal">
                  {transportation}
                </span>
              </div>
            ) : null}
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-[#DDDDD9] my-2"></div>

          {/* Bottom section */}
          <div className="flex justify-between items-center">
            {/* Reviews */}
            {/* <div className="flex items-center gap-1">
              <RiShieldUserLine className="w-4 h-4 text-[#233660]" />
              <span className={`text-[#233660] font-roboto text-xs font-normal ${isFeatured ? 'underline underline-offset-2' : ''}`}>
                {reviews} Reviews
              </span>
            </div> */}
            <div className="flex items-center gap-1">
              <RiShieldUserLine className="w-4 h-4 text-[#233660]" />
              <span className={`text-[#233660] font-roboto text-xs font-normal ${isFeatured ? 'underline underline-offset-2' : ''}`}>
                {reviews === 0 ? (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">New Tour!</span>
                ) : (
                  `${reviews} Reviews`
                )}
              </span>
            </div>

            {/* Pricing */}
            <div className="flex items-center gap-2">
              {/* Original price (strikethrough) */}
              {hasDiscount && (
                  <span className="text-[#8A8D95] font-roboto text-lg font-normal line-through">
                    ${originalPrice}
                  </span>
                )}
              
              {/* Current price */}
              <div className="text-right">
                <div className="text-[#2CA6A4] font-roboto text-2xl font-bold leading-tight">
                  ${price}
                </div>
                {!isFeatured && priceUnit && (
                  <div className="text-[#8A8D95] font-roboto text-xs font-normal">
                    {priceUnit}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular badge - only for featured cards */}
      {isFeatured && (
        <div className="absolute left-0 top-[6px] z-10">
          {/* Badge background */}
          <div 
            className="h-[35px] bg-[#2BA6A4] rounded-tl-md rounded-tr-md rounded-br-md relative py-1 px-3 min-w-[80px] inline-flex items-center justify-center"
            style={{
              background: "linear-gradient(0deg, rgba(0, 0, 0, 0.20), rgba(0, 0, 0, 0.20)), #2BA6A4",
            }}
          >
            <span className="text-white font-roboto text-lg lg:text-2xl font-semibold whitespace-nowrap text-center leading-tight">
              {featuredLabel}
            </span>
            
            {/* Triangle corner - positioned at bottom left of badge */}
            <svg
              className="absolute left-0 top-full w-2 h-2"
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
            >
              <path d="M8 8L0 0H8V8Z" fill="#01596B" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcursionCard;
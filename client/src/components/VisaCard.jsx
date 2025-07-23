// VisaCard.jsx
import VisaLogo from '../assets/visa.svg?react';
import cardIcon from '../assets/cardicon.png';

const VisaCard = ({ 
  holderName = "Ismoilov Sanjarbek",
  cardNumber = "1205 0304 6559 1202",
  expiryDate = "03/06",
  cvv = "755",
  width = "140px",
  height = "90px",
  rotation = "0deg",
  background = "linear-gradient(111.97deg, #78FDFF 0%, #78C2FF 100%)",
  shadow = "0px 1.64px 1.64px 0px #00000040", // Add shadow prop
  className = "" // Add className prop

}) => {
  return (
    <div 
      className={`w-[122px] lg:w-[296px] ${className}`} // Responsive sizing
      style={{
        // width: width,
        // height: height,
        transform: `rotate(${rotation})`,
        background: background,
        // border: '1.64px solid #78FDFF',
        // borderImage: 'linear-gradient(111.97deg, rgba(120, 253, 255, 0.1) 0%, rgba(120, 194, 255, 0.1) 100%) 1',
        borderRadius: '6.55px'
      }}> 
      <div className="p-[6.55px] lg:p-4 h-full flex flex-col justify-between">
        {/* Top Row - Name and Icon */}
        <div className="flex flex-col justify-between gap-5 lg:gap-12">
        <div className="flex justify-between items-start">
          <span className="text-black font-inter font-medium text-[6.55px] lg:text-base"
                style={{
                  letterSpacing: '-1%'
                }}>
            {holderName}
          </span>
          <img 
            src={cardIcon} 
            alt="Card Icon"
            className="w-2.5 h-2.5 lg:w-5 lg:h-5"
          />
        </div>

        {/* Bottom Section - Card Details */}
        <div className='flex flex-col gap-2 lg:gap-5'>
            <div>
          {/* Card Number */}
          <div className="text-black font-inter text-[3.28px] lg:text-[8px]"
               style={{
                 letterSpacing: '-1%'
               }}>
            Card number
          </div>
          <div className="text-black font-inter font-medium text-[8.19px] lg:text-[20px]"
               style={{
                 letterSpacing: '-1%'
               }}>
            {cardNumber}
          </div>
          </div>

          {/* Expiry, CVV and VISA Row */}
          <div className="flex relative justify-between w-full">
            <div className="flex gap-2 lg:gap-5 items-start">
            <div className='flex flex-col gap-[1.6px] lg:gap-1'>
              <div className="text-black font-inter text-[3.28px] lg:text-[8px]"
                   style={{
                     letterSpacing: '-1%'
                   }}>
                Expiry date
              </div>
              <div className="text-black font-inter font-medium text-[4.51px] lg:text-[11px]"
                   style={{
                     letterSpacing: '-1%'
                   }}>
                {expiryDate}
              </div>
            </div>
            <div className='flex flex-col gap-[1.6px] lg:gap-1'>
              <div className="text-black font-inter text-[3.28px] lg:text-[8px]"
                   style={{
                     letterSpacing: '-1%'
                   }}>
            CVV
              </div>
              <div className="text-black font-inter font-medium text-[4.51px] lg:text-[11px]"
                   style={{
                     letterSpacing: '-1%'
                   }}>
                {cvv}
              </div>
            </div>
            </div>
            <div className="absolute bottom-0 right-0">
                <VisaLogo className="fill-blue-600 w-[10.5px] h-[3.38px] lg:w-[25.66px] lg:h-[8.25px]"/>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default VisaCard;
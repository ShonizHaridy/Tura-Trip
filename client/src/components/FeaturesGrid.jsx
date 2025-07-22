// src/components/FeaturesGrid.jsx
import { 
  WalletRemove, 
  ShieldTick, 
  VolumeHigh,
  Personalcard,
  Timer1,
  EmojiHappy,
  Camera,
  EyeSlash
} from 'iconsax-react';

const FeaturesGrid = ({ section = "hero", position = "middle" }) => {
  const allFeatures = [
    {
      id: 1,
      icon: WalletRemove,
      title: "No Prepayment",
      section: "hero"
    },
    {
      id: 2,
      icon: Timer1,
      title: "Reservation in 3 minutes",
      section: "next"
    },

    {
      id: 3,
      icon: VolumeHigh,
      title: "English Speaking Guides",
      section: "hero"
    },
    {
      id: 4,
      icon: Personalcard,
      title: "Personal Manager",
      section: "hero"
    },
    {
      id: 5,
      icon: ShieldTick,
      title: "Insurance is Valid",
      section: "hero"
    },
    {
      id: 6,
      icon: EmojiHappy,
      title: "2400 Happy Customers",
      section: "next"
    },
    {
      id: 7,
      icon: Camera,
      title: "Real Photos excursions",
      section: "next"
    },
    {
      id: 8,
      icon: EyeSlash,
      title: "No Hidden Extra",
      section: "next"
    }
  ];

  const features = allFeatures.filter(feature => feature.section === section);

  // Conditional border radius based on position
  const getBorderRadius = () => {
    if (position === "bottom") {
      // Hero section (bottom) - keep top corners rounded, remove bottom corners
      return "rounded-t-[24px] lg:rounded-t-[20px] pb-0";
    } else if (position === "top") {
      // Next section (top) - keep bottom corners rounded, remove top corners
      return "rounded-b-[24px] lg:rounded-b-[20px] pt-0";
    } else {
      // Default - all corners rounded
      return "rounded-3xl lg:rounded-2xl";
    }
  };



  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className={`bg-[#fefefd] ${getBorderRadius()} shadow-[0px_2px_8px_rgba(0,0,0,0.03)] p-2 lg:p-4`}>
        {/* Desktop: 4 columns, Mobile: 2 columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div key={feature.id} className="flex items-center gap-2 lg:gap-3">
                {/* Icon Container */}
                <div className="w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center rounded-lg bg-white">
                  <IconComponent variant="Bulk" color='currentColor' className="w-6 h-6 lg:w-8 lg:h-8 text-danim" />
                </div>

                {/* Text */}
                <span className="text-danim-700 font-family-primary font-semibold text-[11px] lg:text-base leading-none">
                  {feature.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeaturesGrid;
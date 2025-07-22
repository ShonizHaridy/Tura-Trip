// src/pages/Security.jsx
import React from 'react';
import { ShieldTick, SecuritySafe, Health, Call, Car, UserTick, InfoCircle, Warning2 } from 'iconsax-react';

const Security = () => {
  const securityFeatures = [
    {
      icon: ShieldTick,
      title: "Comprehensive Travel Insurance",
      description: "All our tours include valid travel insurance covering medical emergencies, accidents, and trip interruptions."
    },
    {
      icon: SecuritySafe,
      title: "Licensed Tour Operators",
      description: "We work only with licensed, certified tour operators and guides registered with Egyptian Tourism Authority."
    },
    {
      icon: Health,
      title: "Emergency Medical Support",
      description: "Our guides are trained in first aid, and we maintain partnerships with medical facilities in all tour destinations."
    },
    {
      icon: Call,
      title: "24/7 Emergency Hotline",
      description: "Round-the-clock emergency support line available in multiple languages for immediate assistance."
    },
    {
      icon: Car,
      title: "Safe Transportation",
      description: "All vehicles undergo regular safety inspections with professional, experienced drivers holding valid licenses."
    },
    {
      icon: UserTick,
      title: "Vetted Local Guides",
      description: "Our local guides undergo background checks and regular training on safety protocols and emergency procedures."
    }
  ];

  const safetyGuidelines = [
    {
      title: "Before Your Trip",
      items: [
        "Register with your embassy or consulate",
        "Purchase travel insurance (included in our packages)",
        "Check current health advisories and vaccination requirements",
        "Inform family/friends of your travel itinerary",
        "Ensure your passport is valid for at least 6 months"
      ]
    },
    {
      title: "During Your Trip",
      items: [
        "Stay with your group and follow guide instructions",
        "Keep copies of important documents in separate locations",
        "Stay hydrated and use sun protection",
        "Respect local customs and dress codes",
        "Be aware of your surroundings at all times"
      ]
    },
    {
      title: "Emergency Procedures",
      items: [
        "Contact your guide immediately in any emergency",
        "Call our 24/7 emergency hotline: +20 XXX XXX XXX",
        "Know the location of nearest medical facilities",
        "Keep emergency contact information accessible",
        "Follow evacuation procedures if instructed"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-[100px]">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-danim to-sea-green-600">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bebas text-white mb-6">
              Your Safety is Our Priority
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              At Tura Trip, we implement comprehensive security measures and safety protocols 
              to ensure your Egyptian adventure is both memorable and secure.
            </p>
            <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-flex">
              <ShieldTick variant="bulk" color="#ffffff" className="w-8 h-8" />
              <span className="text-white font-semibold text-lg">Fully Insured & Licensed Tours</span>
            </div>
          </div>
        </div>
      </section>

      {/* Security Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bebas text-danim-800 mb-4">
              Our Security Measures
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every aspect of your journey is protected by our comprehensive security framework
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 border border-gray-100"
                >
                  <div className="w-16 h-16 bg-sea-green-50 rounded-xl flex items-center justify-center mb-6">
                    <IconComponent variant="bulk" color="#2BA6A4" className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-danim-800 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Safety Guidelines */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bebas text-danim-800 mb-4">
              Safety Guidelines
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Essential safety information to ensure a secure and enjoyable experience
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {safetyGuidelines.map((section, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 border border-gray-200"
              >
                <h3 className="text-2xl font-bold text-danim-800 mb-6 flex items-center gap-3">
                  <InfoCircle variant="bulk" color="#3F62AE" className="w-6 h-6" />
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-sea-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Contact Section */}
      <section className="py-20 bg-gradient-to-br from-danim-800 to-danim">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Warning2 variant="bulk" color="#ffffff" className="w-16 h-16 mx-auto mb-8" />
            <h2 className="text-4xl lg:text-5xl font-bebas text-white mb-6">
              Emergency Contacts
            </h2>
            <p className="text-xl text-white/90 mb-12">
              Keep these important numbers accessible during your trip
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <Call variant="bulk" color="#ffffff" className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">24/7 Emergency Hotline</h3>
                <p className="text-3xl font-bold text-white mb-2">+20 XXX XXX XXX</p>
                <p className="text-white/80">Available in Arabic, English, Russian</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <Health variant="bulk" color="#ffffff" className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">Medical Emergency</h3>
                <p className="text-3xl font-bold text-white mb-2">123</p>
                <p className="text-white/80">Egypt National Emergency Number</p>
              </div>
            </div>

            <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Important Embassy Contacts</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
                <div>
                  <h4 className="font-semibold mb-2">Russian Embassy</h4>
                  <p>+20 2 2574 9353</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">German Embassy</h4>
                  <p>+20 2 2728 2000</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">UK Embassy</h4>
                  <p>+20 2 2791 6000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insurance & Legal Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bebas text-danim-800 mb-8 text-center">
              Insurance & Legal Information
            </h2>
            
            <div className="bg-white rounded-2xl p-8 shadow-soft mb-8">
              <h3 className="text-2xl font-bold text-danim-800 mb-6">Travel Insurance Coverage</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-danim-700">Medical Coverage</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Emergency medical treatment up to $100,000</li>
                    <li>• Emergency dental treatment up to $1,000</li>
                    <li>• Medical evacuation and repatriation</li>
                    <li>• 24/7 medical assistance hotline</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-danim-700">Trip Protection</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Trip cancellation due to covered reasons</li>
                    <li>• Trip interruption coverage</li>
                    <li>• Lost or delayed baggage compensation</li>
                    <li>• Personal liability coverage</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-soft">
              <h3 className="text-2xl font-bold text-danim-800 mb-6">Terms & Conditions</h3>
              <div className="space-y-4 text-gray-700">
                <p>
                  All Tura Trip excursions are operated under the regulations of the Egyptian Ministry of Tourism 
                  and Antiquities. Our company is fully licensed and insured to operate tourism services in Egypt.
                </p>
                <p>
                  By booking with us, you agree to follow all safety guidelines provided by our guides and 
                  acknowledge that adventure activities carry inherent risks. We recommend reading our full 
                  terms and conditions before booking.
                </p>
                <p>
                  For complete terms, conditions, and insurance policy details, please contact our customer 
                  service team or visit our office in Hurghada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-sea-green-600 to-sea-green-700">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bebas text-white mb-6">
            Book with Confidence
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Experience Egypt's wonders with complete peace of mind. Our comprehensive safety measures 
            and insurance coverage ensure your adventure is both thrilling and secure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-sea-green-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg">
              View Our Tours
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-sea-green-700 transition-colors text-lg">
              Contact Security Team
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Security;
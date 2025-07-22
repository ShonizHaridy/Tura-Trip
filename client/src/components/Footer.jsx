import React from 'react'
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from '../assets/logo-icon.svg?react';
import TripAdvisor from '../assets/trip_advisor.svg?react'
import { IoLogoWhatsapp } from 'react-icons/io'
import { FaFacebookF, FaInstagram, FaVk } from 'react-icons/fa'

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-rose-black-500 text-white pb-12">
      <div className="container mx-auto px-6 pt-12">
        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-5 gap-12 border-b border-gray-700 pb-6">
            {/* Column 1 - Logo + Contact */}
            <div>
              <div className="p-1 mb-6">
              <Link to="/">
                <Logo
                  className="h-15 lg:h-31 w-auto fill-white"
                />
              </Link>
              </div>
              
              <h3 className="font-semibold text-lg mb-4">{t("footer.contact.title")}</h3>
              <p className="text-gray-300 mb-2">{t("footer.contact.call")} : +123 400 123 </p>
              <p className="text-gray-400 text-sm mb-2 leading-relaxed">
                {t("footer.contact.description")}
              </p>
              <p className="text-gray-400 text-sm mb-6">{t("footer.contact.email")}</p>
              
              <a 
                href="https://wa.me/2001055957451" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-white text-teal-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                <IoLogoWhatsapp className="w-5 h-5" />
                {t("nav.bookNow")}
              </a>
            </div>

            {/* Column 2 - Quick Links */}
            <div>
              <h3 className="font-semibold text-lg mb-6">{t("footer.quickLinks.title")}</h3>
              <ul className="space-y-3">
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">{t("footer.quickLinks.home")}</Link></li>
                <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">{t("footer.quickLinks.about")}</Link></li>
                <li><Link to="/payment" className="text-gray-300 hover:text-white transition-colors">{t("footer.quickLinks.payment")}</Link></li>
                <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">{t("footer.quickLinks.contact")}</Link></li>
              </ul>
            </div>

            {/* Column 3 - Explore Destinations */}
            <div>
              <h3 className="font-semibold text-lg mb-6">{t("footer.destinations.title")}</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">{t("footer.destinations.hurghada")}</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">{t("footer.destinations.sharmElsheikh")}</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">{t("footer.destinations.marsaAlam")}</a></li>
              </ul>
            </div>

            {/* Column 4 - Terms and policies */}
            <div>
              <h3 className="font-semibold text-lg mb-6">{t("footer.legal.title")}</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">{t("footer.legal.termsOfService")}</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">{t("footer.legal.privacyPolicy")}</a></li>
                <li><Link to="/security" className="text-gray-400 hover:text-white transition-colors">
                  {t("footer.legal.security")}
                </Link>   
                </li>
              </ul>

              {/* Social Media Icons */}
              <div className="flex gap-4 justify-start mt-10">
                <a 
                  href="https://www.facebook.com/profile.php?id=61578182916161&mibextid=ZbWKwL" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <FaFacebookF className="w-6 h-6" />
                </a>
                <a 
                  href="https://www.instagram.com/turatrip/?utm_source=qr&r=nametag" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <FaInstagram className="w-6 h-6" />
                </a>
                <a 
                  href="https://vk.com/id1057462635" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <FaVk className="w-6 h-6" />
                </a>
              </div>

            </div>

            {/* Column 5 - TripAdvisor */}
            <div className="flex justify-end">
              <a 
                href="https://www.tripadvisor.com/Profile/turatrip" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <TripAdvisor className="w-14 h-12 fill-white" />
              </a>
            </div>
          </div>


        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Logo */}
          <div className="p-1 mb-8">
              <Link to="/">
                <Logo
                  className="h-15 lg:h-31 w-auto fill-white"
                />
              </Link>          
          </div>

          {/* Two Columns - Sitemap and Explore Destinations */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Sitemap */}
            <div>
              <h3 className="font-semibold text-base mb-4">{t("footer.quickLinks.title")}</h3>
              <ul className="space-y-3 text-sm">
                <li><Link to="/" className="text-gray-300">{t("footer.quickLinks.home")}</Link></li>
                <li><Link to="/about" className="text-gray-300">{t("footer.quickLinks.about")}</Link></li>
                <li><Link to="/payment" className="text-gray-300">{t("footer.quickLinks.payment")}</Link></li>
                <li><Link to="/contact" className="text-gray-300">{t("footer.quickLinks.contact")}</Link></li>
              </ul>
            </div>

            {/* Explore Destinations */}
            <div>
              <h3 className="font-semibold text-base mb-4">{t("footer.destinations.title")}</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-gray-300">{t("footer.destinations.hurghada")}</a></li>
                <li><a href="#" className="text-gray-300">{t("footer.destinations.sharmElsheikh")}</a></li>
                <li><a href="#" className="text-gray-300">{t("footer.destinations.marsaAlam")}</a></li>
              </ul>
            </div>
          </div>

          {/* Book Now Button */}
          <a 
            href="https://wa.me/2001055957451" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 text-[20px] font-family-primary font-semibold bg-isabelline text-sea-green-700 rounded-[6px] lg:rounded-md border-1 mb-8"
          >
            <IoLogoWhatsapp className="w-5 h-5" />
            {t("nav.bookNow")}
          </a>

          {/* Divider */}
          <hr className="border-gray-700 mb-8" />

          {/* Social Media Icons */}
          <div className="flex justify-center gap-6 mb-8">
            <a 
              href="https://www.facebook.com/profile.php?id=61578182916161&mibextid=ZbWKwL" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white"
            >
              <FaFacebookF className="w-6 h-6" />
            </a>
            <a 
              href="https://www.instagram.com/turatrip/?utm_source=qr&r=nametag" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white"
            >
              <FaInstagram className="w-6 h-6" />
            </a>
            <a 
              href="https://vk.com/id1057462635" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white"
            >
              <FaVk className="w-6 h-6" />
            </a>
          </div>

          {/* Bottom Links and TripAdvisor */}
          <div className="flex items-center justify-between space-y-4">
            <div className="text-xs text-gray-400 text-center">
              <a href="#" className="hover:text-white">{t("footer.legal.termsOfService")}</a>
              <span className="mx-2">|</span>
              <a href="#" className="hover:text-white">{t("footer.legal.privacyPolicy")}</a>
              <span className="mx-2">|</span>
              <Link to="/security" className="hover:text-white">{t("footer.legal.security")}</Link>
            </div>
            
            <div className="">
              <a 
                href="https://www.tripadvisor.com/Profile/turatrip" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <TripAdvisor className="w-14 h-12 fill-white" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright - Same for both mobile and desktop */}
      <div className="">
        <div className="container mx-auto px-6 py-4">
          <p className="text-center font-family-primary font-medium text-sm text-white">
            Tura Trip - Novix Code © 2025 - All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
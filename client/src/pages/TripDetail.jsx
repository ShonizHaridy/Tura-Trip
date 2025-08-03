// src/pages/TripDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ExcursionCard from "../components/ExcursionCard";
import { Message, Car, Buildings, Bus, Shield, Image, Location, Timer1, Calendar2, UserTag, TickCircle, ArrowLeft2, ArrowRight2, ArrowDown2 } from 'iconsax-react';
import PofileIcon from '../assets/SVG/Profile Icon.svg?react';
import publicService from "../services/publicService";

import { SlugHelper } from '../utils/slugHelper';

const TripDetail = () => {
  const { cityName, tripId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [tripData, setTripData] = useState(null);
  const [moreLikeThis, setMoreLikeThis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showMoreTripProgram, setShowMoreTripProgram] = useState(false);
  const [showAllMoreLikeThis, setShowAllMoreLikeThis] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    comment: ''
  });
  const [reviewImages, setReviewImages] = useState({
    client_image: null,
    profile_image: null
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchTripData();
  }, [cityName, tripId, i18n.language]);

  const fetchTripData = async () => {
    try {
      setLoading(true);
      
      const response = await publicService.getTourDetails(cityName, tripId, i18n.language);
      
      if (response.success) {
        setTripData(response.data);
        setMoreLikeThis(response.data.moreLikeThis || []);
        console.log('✅ Trip data loaded:', response.data);
      }
    } catch (error) {
      console.error('Error fetching trip data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllMoreLikeThis = async () => {
    if (showAllMoreLikeThis) {
      setShowAllMoreLikeThis(false);
      return;
    }

    try {
      setLoadingMore(true);
      
      const response = await publicService.getMoreLikeThisTours(tripId, {
        language: i18n.language,
        limit: 50
      });
      
      if (response.success) {
        setMoreLikeThis(response.data.tours || []);
        setShowAllMoreLikeThis(true);
      }
    } catch (error) {
      console.error('Error loading more like this tours:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleImageSelect = (imageType) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          alert(t('tripDetail.review.fileTooLarge') || 'File too large. Maximum size is 5MB.');
          return;
        }
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert(t('tripDetail.review.invalidFileType') || 'Please select a valid image file.');
          return;
        }
        
        setReviewImages(prev => ({
          ...prev,
          [imageType]: file
        }));
      }
    };
    input.click();
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) {
      alert(t('tripDetail.review.fillAllFields') || 'Please fill all fields');
      return;
    }

    try {
      setSubmittingReview(true);
      
      // Prepare review data with images
      const reviewData = {
        client_name: reviewForm.name,
        comment: reviewForm.comment,
        language: i18n.language,
        ...reviewImages // Include any selected images
      };
      
      const response = await publicService.submitReview(tripId, reviewData);
      
      if (response.success) {
        alert(t('tripDetail.review.success') || 'Review submitted successfully!');
        setReviewForm({ name: '', comment: '' });
        setReviewImages({ client_image: null, profile_image: null });
        // Optionally refresh the trip data to show the new review
        fetchTripData();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(t('tripDetail.review.error') || 'Error submitting review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const generateBreadcrumb = () => {
    const currentPath = location.pathname;
    const referrer = document.referrer;
    
    // Parse current tour's city/category
    const currentCity = tour.city_name;
    const currentCategory = content?.category || tour.category_type;
    
    // Determine previous context based on referrer or navigation state
    if (referrer.includes('/destination/') && !referrer.includes(tour.id)) {
      // Coming from another city page
      const referrerCitySlug = referrer.split('/destination/')[1].split('/')[0];
      const parsedReferrer = SlugHelper.parseCitySlug(referrerCitySlug);
      
      if (parsedReferrer.id !== tour.city_id) {
        // Different city - show both cities
        return {
          showBothCities: true,
          referrerCity: parsedReferrer,
          currentCity: { id: tour.city_id, name: currentCity }
        };
      }
    }
    
    return {
      showBothCities: false,
      currentCity: { id: tour.city_id, name: currentCity },
      currentCategory: currentCategory
    };
  };

  const getCitySlug = () => {
    // return cityName.toLowerCase().replace(/\s+/g, '-');
    return cityName;
  };

  const getCategorySlug = () => {
    if (!tripData?.content?.category) return '';
    return tripData.content.category.toLowerCase().replace(/\s+/g, '-');
  };

  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };

  const handleCityClick = () => {
    const cityUrl = SlugHelper.createCityUrl(tour.city_id, tour.city_name);
    navigate(cityUrl);
  };

  const handleCategoryClick = () => {
    navigate(`/destination/${getCitySlug()}?category=${encodeURIComponent(tripData.content.category)}`);
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">{t('common.loading') || 'Loading...'}</div>
      </div>
    );
  }

  if (!tripData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">{t('tripDetail.notFound') || 'Trip not found'}</div>
      </div>
    );
  }
  if (!tripData.content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-24">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-danim-100 rounded-full flex items-center justify-center">
              <Calendar2 size={32} color="#3F62AE" variant="Bulk" />
            </div>
          </div>
          
          {/* Main Message */}
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-danim-800">
              {t('tripDetail.contentNotAvailable') || 'Content Not Available Yet'}
            </h2>
            <p className="text-lg text-rose-black-300">
              {t('tripDetail.contentComingSoon') || 'Tour details will be available soon. Please check back later!'}
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 justify-center bg-isabelline text-sea-green-900 px-6 py-3 rounded-lg border border-danim-200 hover:bg-danim-50 transition-colors font-semibold"
            >
              <ArrowLeft2 size={20} color="currentColor" />
              {t('common.goBack') || 'Go Back'}
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="bg-danim text-white px-6 py-3 rounded-lg hover:bg-danim-700 transition-colors font-semibold"
            >
              {t('common.backToHome') || 'Back to Home'}
            </button>
          </div>
          
          {/* Contact Info */}
          <div className="pt-4 border-t border-isabelline-600">
            <p className="text-sm text-rose-black-300 mb-3">
              {t('tripDetail.needHelp') || 'Need immediate assistance?'}
            </p>
            <button
              onClick={() => window.open("https://wa.me/2001055957451", "_blank")}
              className="inline-flex items-center gap-2 text-sea-green-600 hover:text-sea-green-700 font-medium"
            >
              <Message size={16} color="currentColor" variant="Bulk" />
              {t('common.contactUs') || 'Contact Us'}
            </button>
          </div>
        </div>
      </div>
    );
  }


  const { tour, content, images, reviews, avgRating, reviewsCount } = tripData;

const tripProgramText = Array.isArray(content?.trip_program) ? content.trip_program.join(' ') : '';
  const shouldShowReadMore = tripProgramText.length > 300;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto px-4 md:px-18 pt-32 pb-10 space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-4 text-sm">
          <div 
            className="flex items-center justify-center w-5 h-5 cursor-pointer hover:opacity-70"
            onClick={handleHomeClick}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.7071 2.29289C10.3166 1.90237 9.68342 1.90237 9.29289 2.29289L2.29289 9.29289C1.90237 9.68342 1.90237 10.3166 2.29289 10.7071C2.68342 11.0976 3.31658 11.0976 3.70711 10.7071L4 10.4142V17C4 17.5523 4.44772 18 5 18H7C7.55228 18 8 17.5523 8 17V15C8 14.4477 8.44772 14 9 14H11C11.5523 14 12 14.4477 12 15V17C12 17.5523 12.4477 18 13 18H15C15.5523 18 16 17.5523 16 17V10.4142L16.2929 10.7071C16.6834 11.0976 17.3166 11.0976 17.7071 10.7071C18.0976 10.3166 18.0976 9.68342 17.7071 9.29289L10.7071 2.29289Z"
                fill="#8A8D95"
              />
            </svg>
          </div>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.29289 14.7071C6.90237 14.3166 6.90237 13.6834 7.29289 13.2929L10.5858 10L7.29289 6.70711C6.90237 6.31658 6.90237 5.68342 7.29289 5.29289C7.68342 4.90237 8.31658 4.90237 8.70711 5.29289L12.7071 9.29289C13.0976 9.68342 13.0976 10.3166 12.7071 10.7071L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071Z"
              fill="#9CA3AF"
            />
          </svg>
          <span 
            className="text-rose-black-300 font-semibold cursor-pointer hover:text-[#1F7674]"
            onClick={handleCityClick}
          >
            {tour.city_name}
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.29289 14.7071C6.90237 14.3166 6.90237 13.6834 7.29289 13.2929L10.5858 10L7.29289 6.70711C6.90237 6.31658 6.90237 5.68342 7.29289 5.29289C7.68342 4.90237 8.31658 4.90237 8.70711 5.29289L12.7071 9.29289C13.0976 9.68342 13.0976 10.3166 12.7071 10.7071L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071Z"
              fill="#9CA3AF"
            />
          </svg>
          <span 
            className="text-rose-black-300 font-semibold cursor-pointer hover:text-[#1F7674]"
            onClick={handleCategoryClick}
          >
            {content.category}
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.29289 14.7071C6.90237 14.3166 6.90237 13.6834 7.29289 13.2929L10.5858 10L7.29289 6.70711C6.90237 6.31658 6.90237 5.68342 7.29289 5.29289C7.68342 4.90237 8.31658 4.90237 8.70711 5.29289L12.7071 9.29289C13.0976 9.68342 13.0976 10.3166 12.7071 10.7071L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071Z"
              fill="#9CA3AF"
            />
          </svg>
          <span className="text-rose-black-300 font-semibold">
            {content.title}
          </span>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Left Column - Trip Info */}
          <div className="flex-1 space-y-4">
            {/* Title Section */}
            <div className="space-y-4">
              <h1
                className="text-4xl lg:text-5xl font-normal text-[#3F62AE]"
                style={{ fontFamily: "Bebas Neue, sans-serif" }}
              >
                {content.title}
              </h1>

              {/* Location */}
              <div className="flex items-center gap-2">
                <Location size="24" color="#2BA6A4" variant="Bulk" />
                <span className="text-xl font-semibold text-[#2BA6A4]">
                  {tour.location}
                </span>
              </div>

              {/* Trip Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.8327 8.83333C13.8327 12.0533 11.2193 14.6667 7.99935 14.6667C4.77935 14.6667 2.16602 12.0533 2.16602 8.83333C2.16602 5.61333 4.77935 3 7.99935 3C11.2193 3 13.8327 5.61333 13.8327 8.83333Z"
                      stroke="#555A64"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 5.33325V8.66659"
                      stroke="#555A64"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 1.33325H10"
                      stroke="#555A64"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-sm text-rose-black-300">{t('tripDetail.duration') || 'Duration'}:</span>
                  <span className="text-sm text-[#8A8D95]">{content.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.33398 1.33325V3.33325"
                      stroke="#555A64"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10.666 1.33325V3.33325"
                      stroke="#555A64"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2.33398 6.06006H13.6673"
                      stroke="#555A64"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 5.66659V11.3333C14 13.3333 13 14.6666 10.6667 14.6666H5.33333C3 14.6666 2 13.3333 2 11.3333V5.66659C2 3.66659 3 2.33325 5.33333 2.33325H10.6667C13 2.33325 14 3.66659 14 5.66659Z"
                      stroke="#555A64"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.99764 9.13338H8.00363"
                      stroke="#555A64"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.52889 9.13338H5.53488"
                      stroke="#555A64"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.52889 11.1334H5.53488"
                      stroke="#555A64"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-sm text-rose-black-300">{t('tripDetail.daysOfWeek') || 'Days of Week'}:</span>
                  <span className="text-sm text-[#8A8D95]">{content.availability}</span>
                </div>
              </div>

              {/* Reviews */}
              <div className="flex items-center gap-2">
                <UserTag size={24} color="#233660" />
                <span className="text-danim-800 font-semibold underline">
                  {reviewsCount} {t('common.reviews') || 'Reviews'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Pricing */}
          <div className="w-full lg:w-[305px] flex flex-col gap-8">
            {/* Pricing */}
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="text-3xl font-bold text-[#3F62AE]">${formatPrice(tour.price_adult)}</div>
                <div className="text-xs font-semibold text-[#778088]">
                  {t('tripDetail.pricing.adult') || 'Adult (above 12)'}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-[#3F62AE]">${formatPrice(tour.price_child)}</div>
                <div className="text-xs font-semibold text-[#778088]">
                  {t('tripDetail.pricing.child') || 'Child (5-11 years)'}
                </div>
              </div>
            </div>

            {/* Book Now Button */}
            <button
              onClick={() => window.open("https://wa.me/2001055957451", "_blank")}
              className="w-full bg-[#1F7674] text-[#EAF6F6] py-4 px-6 rounded-md text-2xl font-semibold hover:bg-[#1F7674]/90 transition-colors cursor-pointer"
            >
              {t('nav.bookNow') || 'Book Now'}
            </button>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="h-[244px] lg:h-[552px] flex items-center gap-4 lg:gap-6 shadow-lg relative">
          {/* Main Image with Navigation */}
          <div className="flex-1 relative h-full">
            <div
              className="w-full h-full rounded-md lg:rounded-lg bg-cover bg-center relative"
              style={{
                backgroundImage: `url('${images && images.length > 0 ? images[selectedImage]?.image_url : tour.cover_image_url}')`,
              }}
            >
              {/* Navigation Dots */}
              {images && images.length > 0 && (
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-2.5 h-2.5 rounded-full cursor-pointer ${
                        index === selectedImage ? "bg-white" : "bg-white opacity-50"
                      }`}
                    ></div>
                  ))}
                </div>
              )}

              {/* Navigation Arrows */}
              {images && images.length > 1 && (
                <>
                  <button 
                    onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
                    className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-white/60 p-2 rounded-lg cursor-pointer"
                  >
                    <svg
                      className="w-6 h-6 lg:w-8 lg:h-8"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.1191 26.5602L11.4258 17.8669C10.3991 16.8402 10.3991 15.1602 11.4258 14.1335L20.1191 5.44019"
                        stroke="#1F7674"
                        strokeWidth="3"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setSelectedImage(prev => prev < images.length - 1 ? prev + 1 : 0)}
                    className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-white/60 p-2 rounded-lg cursor-pointer"
                  >
                    <svg
                      className="w-6 h-6 lg:w-8 lg:h-8"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.8809 26.5602L20.5742 17.8669C21.6009 16.8402 21.6009 15.1602 20.5742 14.1335L11.8809 5.44019"
                        stroke="#1F7674"
                        strokeWidth="3"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Thumbnail Images */}
          {images && images.length > 1 && (
            <div className="flex flex-col gap-2 lg:gap-6 w-[74px] lg:w-[306px] h-full">
              {(() => {
                let thumbnailIndices = [];
                
                if (images.length <= 4) {
                  thumbnailIndices = images
                    .map((_, index) => index)
                    .filter(index => index !== selectedImage)
                    .slice(0, 3);
                } else {
                  for (let i = 0; i < 3; i++) {
                    let index = (selectedImage + i + 1) % images.length;
                    thumbnailIndices.push(index);
                  }
                }
                
                return thumbnailIndices.map((imageIndex, displayIndex) => (
                  <img
                    key={`${imageIndex}-${displayIndex}`}
                    src={images[imageIndex].image_url}
                    alt=""
                    onClick={() => setSelectedImage(imageIndex)}
                    className="flex-1 w-full rounded-md lg:rounded-lg object-cover cursor-pointer md:h-[168px]"
                    style={{ height: 'calc((244px - 16px) / 3)' }}
                  />
                ));
              })()}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="rounded-r-lg space-y-6 pt-4">
          <div className="flex flex-col lg:flex-row items-start gap-6">
            {/* Left Content */}
            <div className="flex-1 space-y-6">
              {/* About Section */}
              <div className="space-y-2">
                <h2 className="text-3xl font-semibold text-danim-700">{t('common.about') || 'About'}</h2>
                <p className="text-xl text-rose-black-300 leading-relaxed">
                  {content.description}
                </p>
              </div>

              {/* Trip Program Section */}
              <div className="space-y-2">
                <h2 className="text-3xl font-semibold text-danim-700">
                  {t('tripDetail.tripProgram') || 'Trip Program'}
                </h2>
                <div className="space-y-4">
                  <div className="text-lg text-rose-black-300 font-family-primary">
                    {content.trip_program && content.trip_program.length > 0 ? (
                      <div>
                        {(showMoreTripProgram ? content.trip_program : content.trip_program.slice(0, 5)).map((item, index) => (
                          <div key={index}>• {item}<br /></div>
                        ))}
                      </div>
                    ) : (
                      <p>{t('tripDetail.tripProgramSoon') || 'Trip program information will be available soon.'}</p>
                    )}
                  </div>
                  {shouldShowReadMore && content.trip_program && content.trip_program.length > 5 && (
                    <button
                      onClick={() => setShowMoreTripProgram(!showMoreTripProgram)}
                      className="flex items-center gap-2 text-[#222E50]"
                    >
                      <span>{showMoreTripProgram ? (t('common.readLess') || 'Read Less') : (t('common.readMore') || 'Read More')}</span>
                      <ArrowDown2 
                        size={16} 
                        color="#222E50" 
                        className={`transition-transform ${showMoreTripProgram ? 'rotate-180' : ''}`}
                      />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Features Card */}
            <div className="w-full lg:w-[306px] bg-white border border-[#3F62AE] rounded-3xl p-6 shadow-lg">
              <div className="grid grid-cols-1 gap-6 h-full">
                {/* Feature Items */}
                {[
                  t('tripDetail.features.booking3Min') || "Booking in 3 Min.",
                  t('tripDetail.features.noPrepayment') || "No Prepayment",
                  t('tripDetail.features.hotelPickup') || "Hotel Pickup",
                  t('features.insuranceValid') || "Insurance is valid",
                  t('tripDetail.features.russianGuide') || "Russian Speaking Guide",
                  t('tripDetail.features.noHiddenCharges') || "No Hidden Extra",
                  t('tripDetail.features.personalManager') || "Personal Manager",
                  t('tripDetail.features.realPhotos') || "Real Photos and Reviews",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <TickCircle size={24} color="#2BA6A4" variant="Bulk" />
                    <span className="text-lg font-medium text-danim-800">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* What's Included Section */}
          <div className="p-6 rounded-xl bg-gradient-to-b from-[rgba(114,195,194,0.20)] to-[rgba(99,147,210,0.20)]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* What's Included */}
              <div className="space-y-2">
                <h3 className="text-3xl font-semibold text-danim-700">
                  {t('tripDetail.whatsIncluded') || "What's included"}
                </h3>
                <div className="text-xl text-rose-black-300 leading-relaxed font-family-primary font-medium">
                  {content.included && content.included.length > 0 ? (
                    content.included.map((item, index) => (
                      <div key={index}>• {item}<br /></div>
                    ))
                  ) : (
                    <div>{t('tripDetail.defaultIncluded') || 'Hotel Pick-up & Drop-off'}<br />
                    {t('tripDetail.airConditioned') || 'Air-conditioned vehicle'}<br />
                    {t('tripDetail.camelRide') || 'Camel Ride'}<br />
                    {t('tripDetail.bedouinVillage') || 'Bedouin Village & Bedouin Tea'}<br />
                    {t('tripDetail.quadBike') || 'Quad Bike Ride'}<br />
                    {t('tripDetail.lunchDrinks') || 'Lunch & Drinks on Yacht'}</div>
                  )}
                </div>
              </div>

              {/* What's Not Included */}
              <div className="space-y-2">
                <h3 className="text-3xl font-semibold text-danim-700">
                  {t('tripDetail.whatsNotIncluded') || "What's Not included"}
                </h3>
                <div className="text-xl text-rose-black-300 leading-relaxed font-family-primary font-medium">
                  {content.not_included && content.not_included.length > 0 ? (
                    content.not_included.map((item, index) => (
                      <div key={index}>• {item}<br /></div>
                    ))
                  ) : (
                    <div>{t('tripDetail.masks') || 'Masks'}<br />
                    {t('tripDetail.fins') || 'Fins'}<br />
                    {t('tripDetail.divingSuits') || 'Diving Suits'}</div>
                  )}
                </div>
              </div>

              {/* Take with you */}
              <div className="space-y-2">
                <h3 className="text-3xl font-semibold text-danim-700">
                  {t('tripDetail.takeWithYou') || "Take with you"}
                </h3>
                <div className="text-xl text-rose-black-300 leading-relaxed font-family-primary font-medium">
                  {content.take_with_you && content.take_with_you.length > 0 ? (
                    content.take_with_you.map((item, index) => (
                      <div key={index}>• {item}<br /></div>
                    ))
                  ) : (
                    <div>{t('tripDetail.defaultTakeWith') || 'Swim Suit, Towel, Water, Sunscreen, Sunglasses'}<br />
                    {t('tripDetail.rentAvailable') || 'Diving Suits and Snorkeling fins available to rent on site'}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-danim-700">{t('tripDetail.details') || 'Details'}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Detail Items */}
              <div className="flex items-start gap-2">
                <div>
                  <Car
                  size={24}
                  color="#145DA0"
                  variant="Bulk"
                />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl text-danim-800">{t('tripDetail.detailItems.pickupDetails.title') || 'Pickup details'}</h4>
                  <p className="text-lg text-rose-black-300 pr-7">
                    {t('tripDetail.detailItems.pickupDetails.description') || 'Once you book with us, our agent will reach out confirming your room number'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div>
                <Buildings
                  size={24}
                  color="#145DA0"
                  variant="Bulk"
                />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl text-danim-800">
                    {t('tripDetail.detailItems.hotelPickupOffered.title') || 'Hotel pickup offered'}
                  </h4>
                  <p className="text-lg text-rose-black-300 pr-7">
                    {t('tripDetail.detailItems.hotelPickupOffered.description') || 'During checkout you will be able to select from the list of included hotels.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div>
                <Bus
                  size={24}
                  color="#145DA0"
                  variant="Bulk"
                />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl text-danim-800">
                    {t('tripDetail.detailItems.additionalPickup.title') || 'Additional pickup options'}
                  </h4>
                  <p className="text-lg text-rose-black-300 pr-7">
                    {t('tripDetail.detailItems.additionalPickup.description') || 'During checkout you will be able to select from the list of Hurghada, Red Sea, Egypt'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div>
                <Shield
                  size={24}
                  color="#145DA0"
                  variant="Bulk"
                />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl text-danim-800">
                    {t('tripDetail.detailItems.cancellationPolicy.title') || 'Cancellation policy'}
                  </h4>
                  <p className="text-lg text-rose-black-300 pr-7">
                    {t('tripDetail.detailItems.cancellationPolicy.description') || 'For a full refund, you must cancel at least 24 hours before the experience\'s start time.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-0.5 bg-[#BFD1D3]"></div>

      {/* Customer Reviews Section */}
      <div className="space-y-10">
        <div className="space-y-8">
          <h2 className="text-3xl font-semibold text-danim-700">
            {t('tripDetail.customerReviews') || 'Customer Reviews'}
          </h2>

          {/* Review Input */}
          <form onSubmit={handleReviewSubmit} className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-[#F3F4F6] rounded-full flex items-center justify-center overflow-hidden">
                {reviewImages.profile_image ? (
                  <img 
                    src={URL.createObjectURL(reviewImages.profile_image)} 
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <PofileIcon />
                )}
              </div>
              <div className="border border-[#B0B2B7] rounded px-2 py-2 w-60">
                <input
                  type="text"
                  placeholder={t('tripDetail.review.namePlaceholder') || 'Name*'}
                  value={reviewForm.name}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full text-[#8A8D95] bg-transparent outline-none"
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => handleImageSelect('profile_image')}
                className="bg-[#DDE7E9] p-2 rounded cursor-pointer hover:bg-[#C1D3D6] transition-colors"
                title={t('tripDetail.review.selectProfileImage') || 'Select profile image'}
              >
                <Image size={16} color="#145DA0" variant="Bulk" />
              </button>
            </div>

            {/* Review Text Area */}
            <div className="border-2 border-[#E8E7EA] rounded-lg p-4 bg-[#FEFEFD] relative">
              <div className="flex flex-col gap-2">
                {/* Custom Placeholder with Icon */}
                {!reviewForm.comment && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
                    <Message size={24} color="#8A8D95" variant="Linear" />
                    <span className="text-[#8A8D95]">
                      {t('tripDetail.review.writeReview') || 'Write Your Review'}
                    </span>
                  </div>
                )}
                
                {/* Textarea */}
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                  className="w-full bg-transparent outline-none text-[#555A64] resize-none pt-8 min-h-[100px]"
                  required
                />
                
                {/* Image Preview */}
                {reviewImages.client_image && (
                  <div className="relative inline-block">
                    <img 
                      src={URL.createObjectURL(reviewImages.client_image)} 
                      alt="Review image preview"
                      className="max-w-[200px] max-h-[150px] object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setReviewImages(prev => ({ ...prev, client_image: null }))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                )}
                
                {/* Buttons */}
                <div className="flex justify-end gap-2">
                  <button 
                    type="button" 
                    onClick={() => handleImageSelect('client_image')}
                    className="bg-[#DDE7E9] p-2 rounded cursor-pointer hover:bg-[#C1D3D6] transition-colors"
                    title={t('tripDetail.review.selectImage') || 'Select image'}
                  >
                    <Image size={16} color="#145DA0" variant="Bulk" />
                  </button>
                  <button 
                    type="submit" 
                    disabled={submittingReview}
                    className="bg-[#DDE7E9] px-3 py-2 rounded text-[#124645] font-semibold cursor-pointer disabled:opacity-50 hover:bg-[#C1D3D6] transition-colors"
                  >
                    {submittingReview ? (t('common.loading') || 'Loading...') : (t('tripDetail.review.send') || 'Send')}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Reviews List */}
          {reviews && reviews.length > 0 ? (
            <div className="pl-10 space-y-6">
              {reviews.map((review, index) => (
                <div key={index} className="space-y-3 text-black">
                  <div className="flex items-center gap-2">
                    <div className="flex w-10 h-10 rounded-full bg-gray-200 overflow-hidden justify-center">
                      {review.profile_image_url ? (
                        <img 
                          src={review.profile_image_url} 
                          alt={review.client_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <PofileIcon />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{review.client_name}</div>
                    </div>
                  </div>
                  <div className="bg-danim-50 rounded-lg p-6">
                    <div className="mb-4">
                      {review.comment}
                    </div>
                    
                    {/* Display client image if it exists */}
                    {review.client_image_url && (
                      <div className="mb-4">
                        <img 
                          src={review.client_image_url} 
                          alt="Review image"
                          className="max-w-[300px] max-h-[200px] object-cover rounded-lg border-2 border-gray-200"
                        />
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span>{new Date(review.review_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {index < reviews.length - 1 && (
                    <div className="w-full h-px"></div>
                  )}
                </div>
              ))}
            </div>
          ) : (
              <div className="pl-10 space-y-6">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="space-y-3 text-black">
                    <div className="flex items-center gap-2">
                      <div className="flex w-10 h-10 rounded-full bg-gray-200 overflow-hidden justify-center">
                        <PofileIcon />
                      </div>
                      <div>
                        <div className="font-medium">{t('tripDetail.review.customer')} {index + 1}</div>
                      </div>
                    </div>
                    <div className="bg-danim-50 rounded-lg p-6">
                      <div className="mb-4">
                        <span className="underline font-medium text-black">
                          {t('tripDetail.review.sampleTitle') || 'Great experience!'}
                        </span>
                        <br />
                        {t('tripDetail.review.sampleComment') || 'Amazing tour with wonderful guide and beautiful locations. Highly recommended!'}
                      </div>
                      <div className="flex justify-between items-center text-sm font-medium">
                        <span>2025/05/02</span>
                      </div>
                    </div>
                    {index < 2 && (
                      <div className="w-full h-px"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-0.5 bg-[#BFD1D3]"></div>

        {/* More Like This Trip Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-semibold text-danim-700">
              {t('tripDetail.moreLikeThis') || 'More Like This Trip'}
            </h2>
            <button 
              onClick={loadAllMoreLikeThis}
              disabled={loadingMore}
              className="border border-[#1F7674] text-[#1F7674] bg-[#F3F3EE] px-4 py-2 rounded-md font-semibold"
            >
              {loadingMore ? (t('common.loading') || 'Loading...') : (showAllMoreLikeThis ? (t('common.viewLess') || 'view less') : (t('common.seeAll') || 'view all'))}
            </button>
          </div>

          {/* Trip Cards using ExcursionCard */}
          {moreLikeThis && moreLikeThis.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(showAllMoreLikeThis ? moreLikeThis : moreLikeThis.slice(0, 4)).map((trip) => (
                <Link key={trip.id}   to={SlugHelper.createTourUrl(trip.city_id, trip.city_name, trip.id)}>
                  <ExcursionCard
                    id={trip.id}
                    title={trip.title}
                    image={trip.cover_image_url || "/src/assets/luxor.png"}
                    category={trip.category || trip.category_type}
                    duration={trip.duration || "Full Day"}
                    durationUnit=""
                    daysOfWeek={trip.availability || "Almost Daily"}
                    reviews={trip.reviews_count || 0}
                    price={parseFloat(trip.price_adult)}
                    originalPrice={trip.discount_percentage > 0 ? Math.round(parseFloat(trip.price_adult) / (1 - trip.discount_percentage / 100)) : null}
                    priceUnit="per person"
                    isFeatured={trip.featured_tag || false}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center py-8 text-gray-500 col-span-full">
                {t('tripDetail.noSimilarTours') || 'No similar tours found'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripDetail;
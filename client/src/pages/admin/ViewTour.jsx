// src/pages/admin/ViewTour.jsx - FIXED VERSION
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import adminService from "../../services/adminService";

// Import flags like EditTour
import enFlag from "../../assets/flags/en.png";
import ruFlag from "../../assets/flags/ru.png";
import itFlag from "../../assets/flags/it.png";
import deFlag from "../../assets/flags/de.png";

const ViewTour = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Language configuration with imported flags
  const languages = [
    { code: "en", name: "English", flag: enFlag },
    { code: "ru", name: "Russian", flag: ruFlag },
    { code: "it", name: "Italian", flag: itFlag },
    { code: "de", name: "German", flag: deFlag },
  ];

  useEffect(() => {
    fetchTour();
  }, [id]);

  const fetchTour = async () => {
    try {
      setLoading(true);
      const response = await adminService.getTourById(id);
      
      if (response.success) {
        setTour(response.data);
      } else {
        setError("Tour not found");
      }
    } catch (error) {
      console.error('Error fetching tour:', error);
      setError("Failed to load tour");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout activeItem="Tours">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BA6A4]"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !tour) {
    return (
      <AdminLayout activeItem="Tours">
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <p className="text-red-500 text-lg">{error}</p>
            <button
              onClick={() => navigate("/admin/tours")}
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              Back to Tours
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const currentLanguage = tour.content?.[selectedLanguage] || tour.content?.en || {};

  return (
    <AdminLayout activeItem="Tours">
      <div className="flex flex-col items-center gap-6">
        <div className="w-full max-w-full">
          {/* Back Button */}
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => navigate("/admin/tours")}
              className="flex items-center justify-center gap-2 w-[150px] h-10 px-3 py-2 border border-[#1F7674] text-[#1F7674] bg-[#F3F3EE] hover:bg-gray-100 rounded transition-colors font-semibold text-[16px] cursor-pointer"
              style={{ fontFamily: "Roboto" }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
          </div>

          {/* Main Content Card */}
          <div className="flex flex-col p-4 gap-4 bg-white rounded-xl shadow-[0px_4px_4px_-1px_rgba(12,12,13,0.1),0px_4px_4px_-1px_rgba(12,12,13,0.05)]">
            {/* Header */}
            <div className="flex justify-between items-center gap-2 pb-2 border-b border-[#D1D1D1]">
              <div className="flex items-center gap-2 flex-1">
                <div className="p-2 rounded bg-teal-600">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path
                      d="M28.3332 12.2C25.2532 7.36003 20.7465 4.57336 15.9998 4.57336C13.6265 4.57336 11.3198 5.2667 9.21317 6.56003C7.1065 7.8667 5.21317 9.77336 3.6665 12.2C2.33317 14.2934 2.33317 17.6934 3.6665 19.7867C6.7465 24.64 11.2532 27.4134 15.9998 27.4134C18.3732 27.4134 20.6798 26.72 22.7865 25.4267C24.8932 24.12 26.7865 22.2134 28.3332 19.7867C29.6665 17.7067 29.6665 14.2934 28.3332 12.2ZM15.9998 21.3867C13.0132 21.3867 10.6132 18.9734 10.6132 16C10.6132 13.0267 13.0132 10.6134 15.9998 10.6134C18.9865 10.6134 21.3865 13.0267 21.3865 16C21.3865 18.9734 18.9865 21.3867 15.9998 21.3867Z"
                      fill="white"
                      fillOpacity="0.4"
                    />
                    <path
                      d="M16.0002 12.1866C13.9069 12.1866 12.2002 13.8933 12.2002 16C12.2002 18.0933 13.9069 19.8 16.0002 19.8C18.0935 19.8 19.8135 18.0933 19.8135 16C19.8135 13.9066 18.0935 12.1866 16.0002 12.1866Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <div className="text-[22px] font-bold text-[#124645] leading-[33px]" style={{ fontFamily: "Cairo" }}>
                  View Tour
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  to={`/admin/tours/edit/${id}`}
                  className="flex items-center gap-2 px-4 py-2 rounded text-white bg-teal-600 hover:bg-teal-700 transition-colors"
                >
                  Edit Tour
                </Link>
                <span className={`px-3 py-1 rounded-xl text-xs ${
                  tour.tour?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {tour.tour?.status || 'Active'}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {/* Images Section */}
              <div className="flex gap-6">
                {/* Cover Image */}
                <div className="flex-1">
                  <h3 className="text-[20px] font-normal text-[#222E50] leading-[24px] mb-2" style={{ fontFamily: "Tai Heritage Pro" }}>Cover Image</h3>
                  <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100 border border-[#E8E7EA]">
                    {tour.tour?.cover_image_url ? (
                      <img
                        src={tour.tour.cover_image_url}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No cover image
                      </div>
                    )}
                  </div>
                </div>

                {/* Tour Images */}
                <div className="flex-1">
                  <h3 className="text-[20px] font-normal text-[#222E50] leading-[24px] mb-2" style={{ fontFamily: "Tai Heritage Pro" }}>Tour Images</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {tour.images && tour.images.length > 0 ? (
                      tour.images.slice(0, 4).map((image, index) => (
                        <div key={index} className="w-full h-24 rounded overflow-hidden bg-gray-100 border border-[#E8E7EA]">
                          <img
                            src={image.image_url}
                            alt={`Tour ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 h-24 rounded overflow-hidden bg-gray-100 border border-[#E8E7EA] flex items-center justify-center text-gray-400">
                        No tour images
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Basic Info Section */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[20px] font-normal text-[#222E50] leading-[24px] mb-2" style={{ fontFamily: "Tai Heritage Pro" }}>City</label>
                  <div className="p-3 rounded-lg border border-[#E8E7EA] bg-gray-50">
                    <span className="text-gray-600">{tour.tour?.city_name || 'N/A'}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[20px] font-normal text-[#222E50] leading-[24px] mb-2" style={{ fontFamily: "Tai Heritage Pro" }}>Location</label>
                  <div className="p-3 rounded-lg border border-[#E8E7EA] bg-gray-50 flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M11.9999 13.4299C13.723 13.4299 15.1199 12.0331 15.1199 10.3099C15.1199 8.58681 13.723 7.18994 11.9999 7.18994C10.2768 7.18994 8.87988 8.58681 8.87988 10.3099C8.87988 12.0331 10.2768 13.4299 11.9999 13.4299Z"
                        stroke="#8A8D95"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M3.61971 8.49C5.58971 -0.169998 18.4197 -0.159997 20.3797 8.5C21.5297 13.58 18.3697 17.88 15.5997 20.54C13.5897 22.48 10.4097 22.48 8.38971 20.54C5.62971 17.88 2.46971 13.57 3.61971 8.49Z"
                        stroke="#8A8D95"
                        strokeWidth="1.5"
                      />
                    </svg>
                    <span className="text-gray-600">{tour.tour?.location || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[20px] font-normal text-[#222E50] leading-[24px] mb-2" style={{ fontFamily: "Tai Heritage Pro" }}>Price for adult (above 11)</label>
                  <div className="p-3 rounded-lg border border-[#E8E7EA] bg-gray-50">
                    <span className="text-gray-600">${tour.tour?.price_adult || 'N/A'}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[20px] font-normal text-[#222E50] leading-[24px] mb-2" style={{ fontFamily: "Tai Heritage Pro" }}>Price for child (5-11 years)</label>
                  <div className="p-3 rounded-lg border border-[#E8E7EA] bg-gray-50">
                    <span className="text-gray-600">${tour.tour?.price_child || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Language Selection */}
              <div className="flex items-center gap-4 mb-4">
                <label className="text-[20px] font-normal text-[#222E50] leading-[24px]" style={{ fontFamily: "Tai Heritage Pro" }}>Language:</label>
                <div className="relative">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="appearance-none text-gray-900 bg-white border border-[#E8E7EA] rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-teal-500 min-w-[160px] text-[16px] font-normal"
                    style={{ fontFamily: "Roboto" }}
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src={languages.find(l => l.code === selectedLanguage)?.flag}
                    alt={languages.find(l => l.code === selectedLanguage)?.name}
                    className="w-6 h-4 object-contain rounded-sm"
                  />
                  <span className="text-sm text-gray-600" style={{ fontFamily: "Roboto" }}>
                    {languages.find(l => l.code === selectedLanguage)?.name}
                  </span>
                </div>
              </div>

              {/* Language Content */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[20px] font-normal text-[#222E50] leading-[24px] mb-2" style={{ fontFamily: "Tai Heritage Pro" }}>Tour Title</label>
                  <div className="p-3 rounded-lg border border-[#E8E7EA] bg-gray-50">
                    <span className="text-gray-600">{currentLanguage.title || 'No title available'}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[20px] font-normal text-[#222E50] leading-[24px] mb-2" style={{ fontFamily: "Tai Heritage Pro" }}>Duration</label>
                  <div className="p-3 rounded-lg border border-[#E8E7EA] bg-gray-50">
                    <span className="text-gray-600">{currentLanguage.duration || 'No duration available'}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[20px] font-normal text-[#222E50] leading-[24px] mb-2" style={{ fontFamily: "Tai Heritage Pro" }}>Category</label>
                  <div className="p-3 rounded-lg border border-[#E8E7EA] bg-gray-50">
                    <span className="text-gray-600">{currentLanguage.category || 'No category available'}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[20px] font-normal text-[#222E50] leading-[24px] mb-2" style={{ fontFamily: "Tai Heritage Pro" }}>Availability</label>
                  <div className="p-3 rounded-lg border border-[#E8E7EA] bg-gray-50">
                    <span className="text-gray-600">{currentLanguage.availability || 'No availability info'}</span>
                  </div>
                </div>
              </div>

              {/* Content Sections */}
              <div className="flex gap-6">
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-[20px] font-normal text-[#222E50] leading-[24px] mb-2" style={{ fontFamily: "Tai Heritage Pro" }}>Description & Highlights</label>
                    <div className="p-3 rounded-lg border border-[#E8E7EA] bg-gray-50 min-h-[120px]">
                      <span className="text-gray-600 whitespace-pre-line">
                        {currentLanguage.description || 'No description available'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[20px] font-normal text-[#222E50] leading-[24px] mb-2" style={{ fontFamily: "Tai Heritage Pro" }}>What's included</label>
                    <div className="p-3 rounded-lg border border-[#E8E7EA] bg-gray-50">
                      <div className="text-gray-600">
                        {currentLanguage.included && Array.isArray(currentLanguage.included) ? (
                          <ul className="list-disc list-inside space-y-1">
                            {currentLanguage.included.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        ) : (
                          'No information available'
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[20px] font-normal text-[#222E50] leading-[24px] mb-2" style={{ fontFamily: "Tai Heritage Pro" }}>What's not included</label>
                    <div className="p-3 rounded-lg border border-[#E8E7EA] bg-gray-50">
                      <div className="text-gray-600">
                        {currentLanguage.not_included && Array.isArray(currentLanguage.not_included) ? (
                          <ul className="list-disc list-inside space-y-1">
                            {currentLanguage.not_included.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        ) : (
                          'No information available'
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-[20px] font-normal text-[#222E50] leading-[24px] mb-2" style={{ fontFamily: "Tai Heritage Pro" }}>Trip Program</label>
                    <div className="p-3 rounded-lg border border-[#E8E7EA] bg-gray-50 min-h-[240px]">
                      <div className="text-gray-600">
                        {currentLanguage.trip_program && Array.isArray(currentLanguage.trip_program) ? (
                          <ol className="list-decimal list-inside space-y-2">
                            {currentLanguage.trip_program.map((item, index) => (
                              <li key={index} className="leading-relaxed">{item}</li>
                            ))}
                          </ol>
                        ) : (
                          'No program information available'
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[20px] font-normal text-[#222E50] leading-[24px] mb-2" style={{ fontFamily: "Tai Heritage Pro" }}>Take with you</label>
                    <div className="p-3 rounded-lg border border-[#E8E7EA] bg-gray-50">
                      <div className="text-gray-600">
                        {currentLanguage.take_with_you && Array.isArray(currentLanguage.take_with_you) ? (
                          <ul className="list-disc list-inside space-y-1">
                            {currentLanguage.take_with_you.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        ) : (
                          'No information available'
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ViewTour;
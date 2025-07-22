// src/pages/CityPage.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ExcursionCard from "../components/ExcursionCard";
import { useLocalizedText } from "../utils/helpers";
import {
  Home2,
  ArrowDown2,
  WalletRemove,
  Shield,
  EyeSlash,
  Category,
  Timer,
} from "iconsax-react";

// Import mock data
import { mockCityData, mockTrips, mockCategories } from "../data/mockData";

const City = () => {
  const { cityName } = useParams();
  const { t } = useTranslation();
  const { getLocalizedText, currentLanguage } = useLocalizedText();
  const [cityData, setCityData] = useState(null);
  const [trips, setTrips] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Trips");
  const [loading, setLoading] = useState(true);
  const [showPricing, setShowPricing] = useState(false);

  useEffect(() => {
    fetchCityDataMock();
  }, [cityName, currentLanguage]); // Re-fetch when language changes

  const fetchCityDataMock = async () => {
    try {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const cityInfo = mockCityData[cityName];
      if (cityInfo) {
        setCityData(cityInfo);
        setTrips(mockTrips[cityName] || []);

        // Get localized categories
        const localizedCategories = mockCategories[cityName];
        if (localizedCategories) {
          const categoriesInCurrentLang = getLocalizedText(localizedCategories);
          setCategories([
            t("common.allTrips") || "All Trips",
            ...categoriesInCurrentLang,
          ]);
        }
      }
    } catch (error) {
      console.error("Error with mock data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrips =
    selectedCategory === (t("common.allTrips") || "All Trips")
      ? trips
      : trips.filter(
          (trip) => getLocalizedText(trip.category) === selectedCategory,
        );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">{t("common.loading") || "Loading..."}</div>
      </div>
    );
  }

  if (!cityData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">
          {t("common.cityNotFound") || "City not found"}
        </div>
      </div>
    );
  }

  const categoryTabs = [
    "All Trips",
    "Historical Cities",
    "Sea Excursions",
    "Safari and Adventure",
    "Transfer",
    "Individual Tours",
  ];

  return (
    <div className="min-h-screen pt-[100px]">
      {/* Category Tabs - Fixed position */}
      <div className="w-full flex flex-col items-start border-b-2 border-[#E6E6E8] shadow-[0px_2px_12px_0px_rgba(20,20,43,0.08)] bg-white fixed top-[100px] left-0 right-0 z-40">
        <div className="w-full px-[70px] h-12">
          <div className="flex h-12 items-center">
            {categoryTabs.map((tab, index) => (
              <div
                key={tab}
                className={`flex-1 flex items-center justify-center px-6 h-12 cursor-pointer transition-all duration-200 ${
                  selectedCategory === tab
                    ? "bg-[rgba(234,246,246,0.60)] border-b-2 border-[#2BA6A4]"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedCategory(tab)}
              >
                <div className="flex flex-col justify-center items-start gap-1 h-[27px]">
                  <span
                    className={`text-base font-bold text-center ${
                      selectedCategory === tab
                        ? "text-[#1F7674]"
                        : "text-[#8A8D95]"
                    }`}
                  >
                    {tab}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-[70px] pt-16">
        {/* Breadcrumb */}
        <div className="inline-flex items-center gap-4 py-6 rounded-md">
          <div className="flex w-5 h-5 justify-center items-center">
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
          <div className="flex justify-center items-center">
            <span className="text-sm font-bold text-[#555A64] font-roboto">
              Hurghada
            </span>
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
          <div className="flex justify-center items-center">
            <span className="text-sm font-bold text-[#555A64] font-roboto">
              All Trips
            </span>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="relative w-[1296px] h-[349px] rounded-[32px] overflow-hidden mb-8">
          <div
            className="w-full h-full bg-cover bg-center relative"
            style={{
              background: `linear-gradient(0deg, rgba(0, 0, 0, 0.30) 0%, rgba(0, 0, 0, 0.30) 100%), url('${cityData.heroImage}') lightgray 50% / cover no-repeat`,
            }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <h1 className="text-[56px] font-bold text-[#F3F3EE] mb-2 leading-normal">
                {getLocalizedText(cityData.name)}
              </h1>
              <p className="text-2xl font-medium text-[#F7F7F4] max-w-lg">
                {getLocalizedText(cityData.description)}
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="w-[1296px] flex flex-col gap-10 mb-20">
          {/* About Section */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-[32px] font-semibold text-[#2D467C]">
                About
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-xl font-normal text-[#555A64] leading-[25.4px]">
                {getLocalizedText(cityData.longDescription)}
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="flex items-start gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center">
                <WalletRemove size={32} color="#3F62AE" variant="Bulk" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-lg font-semibold text-[#2D467C]">
                  No Prepayment
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center">
                <Shield size={32} color="#3F62AE" variant="Bulk" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-lg font-semibold text-[#2D467C]">
                  Insurance is Valid
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <EyeSlash size={32} color="#3F62AE" variant="Bulk" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-lg font-semibold text-[#2D467C]">
                  No Hidden Extra
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="flex flex-col gap-6">
            <div
              className="flex items-center justify-between w-full p-6 rounded-md bg-[#EAF6F6] cursor-pointer"
              onClick={() => setShowPricing(!showPricing)}
            >
              <div className="flex items-center gap-4">
                <svg width="24" height="25" viewBox="0 0 24 25" fill="none">
                  <path
                    d="M12 1.5V23.5M17 5.5H9.5C8.57174 5.5 7.6815 5.86875 7.02513 6.52513C6.36875 7.1815 6 8.07174 6 9C6 9.92826 6.36875 10.8185 7.02513 11.4749C7.6815 12.1313 8.57174 12.5 9.5 12.5H14.5C15.4283 12.5 16.3185 12.8687 16.9749 13.5251C17.6313 14.1815 18 15.0717 18 16C18 16.9283 17.6313 17.8185 16.9749 18.4749C16.3185 19.1313 15.4283 19.5 14.5 19.5H6"
                    stroke="#2D467C"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-xl font-medium text-[#2D467C]">
                  Current prices Today in Hurghada
                </span>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-px h-9 bg-[#ADADA9]"></div>
                <ArrowDown2
                  size={32}
                  color="#3F62AE"
                  className={`transition-transform ${showPricing ? "rotate-180" : ""}`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* All Trips Section */}
        <div className="flex flex-col gap-5 mb-20">
          <div className="w-[768px]">
            <h2 className="text-[60px] font-normal text-[#3F62AE] leading-[44px] tracking-[-1.2px] font-['Bebas_Neue']">
              ALL TRIPS
            </h2>
          </div>
          <div className="w-[1283px] h-px bg-[#B3B3B3]"></div>
        </div>

        {/* Trip Cards Grid */}
        <div className="flex justify-center gap-10 mb-20">
          {filteredTrips.slice(0, 4).map((trip) => (
            <Link key={trip.id} to={`/destination/${cityName}/${trip.id}`}>
              <div className="w-[270px] h-[405px] bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="w-[250px] h-[180px] mx-auto mt-2.5 rounded-lg overflow-hidden">
                  <img
                    src={trip.image}
                    alt={getLocalizedText(trip.title)}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-2.5 pt-3">
                  <h3 className="text-base font-semibold text-[#1C2B38] mb-4 text-center min-h-[38px] flex items-center justify-center">
                    {getLocalizedText(trip.title)}
                  </h3>

                  <div className="flex flex-col gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Timer size={16} color="#495560" />
                      <span className="text-sm font-medium text-[#495560]">
                        Duration 2 hours
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg
                        width="16"
                        height="12"
                        viewBox="0 0 16 12"
                        fill="none"
                      >
                        <path
                          d="M12.3143 4.28516L12.1611 4.2303L10.864 1.7983C10.6204 1.34126 10.2571 0.959041 9.81302 0.692515C9.36894 0.42599 8.86077 0.285184 8.34286 0.285156H5.07657C4.47677 0.285132 3.89217 0.473872 3.40562 0.824631C2.91907 1.17539 2.55525 1.67037 2.36571 2.23944L1.74743 4.0943C1.22943 4.31263 0.78735 4.67891 0.476523 5.14728C0.165697 5.61566 -6.13215e-05 6.16531 1.70175e-08 6.72744V7.99944C1.70175e-08 8.81087 0.483429 9.50801 1.17714 9.8223C1.26698 10.337 1.53045 10.8054 1.92367 11.1495C2.31689 11.4936 2.81612 11.6925 3.33821 11.7132C3.8603 11.7339 4.37372 11.5751 4.79296 11.2633C5.21221 10.9515 5.51196 10.5054 5.64229 9.99944H10.3577C10.488 10.5054 10.7878 10.9515 11.207 11.2633C11.6263 11.5751 12.1397 11.7339 12.6618 11.7132C13.1839 11.6925 13.6831 11.4936 14.0763 11.1495C14.4696 10.8054 14.733 10.337 14.8229 9.8223C15.1737 9.66394 15.4713 9.40772 15.6801 9.08439C15.8889 8.76105 16 8.38434 16 7.99944V7.61201C15.9999 7.02221 15.8173 6.44689 15.4772 5.965C15.1371 5.48312 14.6563 5.11829 14.1006 4.92058L12.3749 4.30687V4.28516H12.3143ZM5.07657 1.42801H6.28571V4.28516H2.888L3.44914 2.60058C3.56291 2.259 3.78135 1.9619 4.07346 1.75143C4.36557 1.54096 4.71653 1.42781 5.07657 1.42801ZM7.42857 1.42801H8.34286C8.65364 1.4279 8.9586 1.51228 9.22513 1.67212C9.49166 1.83195 9.70973 2.06124 9.856 2.33544L10.896 4.28516H7.42857V1.42801ZM12.1177 5.42801L13.7177 5.99716C14.0511 6.11582 14.3396 6.33473 14.5436 6.62386C14.7476 6.91298 14.8571 7.25816 14.8571 7.61201V7.99944C14.8571 8.19944 14.7886 8.38344 14.6743 8.52973C14.4871 8.09033 14.1669 7.72061 13.7588 7.47251C13.3507 7.2244 12.8751 7.11037 12.3989 7.14643C11.9226 7.1825 11.4696 7.36684 11.1035 7.67357C10.7374 7.9803 10.4766 8.39401 10.3577 8.85658H5.64229C5.52338 8.39401 5.26256 7.9803 4.89646 7.67357C4.53036 7.36684 4.07737 7.1825 3.60112 7.14643C3.12487 7.11037 2.64929 7.2244 2.24117 7.47251C1.83306 7.72061 1.51292 8.09033 1.32571 8.52973C1.20677 8.37861 1.14234 8.19175 1.14286 7.99944V6.72744C1.14286 6.21316 1.37143 5.74458 1.73714 5.42801H12.1177ZM2.28571 9.42801C2.28571 9.12491 2.40612 8.83422 2.62045 8.61989C2.83478 8.40556 3.12547 8.28516 3.42857 8.28516C3.73168 8.28516 4.02237 8.40556 4.23669 8.61989C4.45102 8.83422 4.57143 9.12491 4.57143 9.42801C4.57143 9.73112 4.45102 10.0218 4.23669 10.2361C4.02237 10.4505 3.73168 10.5709 3.42857 10.5709C3.12547 10.5709 2.83478 10.4505 2.62045 10.2361C2.40612 10.0218 2.28571 9.73112 2.28571 9.42801ZM12.5714 8.28516C12.8745 8.28516 13.1652 8.40556 13.3796 8.61989C13.5939 8.83422 13.7143 9.12491 13.7143 9.42801C13.7143 9.73112 13.5939 10.0218 13.3796 10.2361C13.1652 10.4505 12.8745 10.5709 12.5714 10.5709C12.2683 10.5709 11.9776 10.4505 11.7633 10.2361C11.549 10.0218 11.4286 9.73112 11.4286 9.42801C11.4286 9.12491 11.549 8.83422 11.7633 8.61989C11.9776 8.40556 12.2683 8.28516 12.5714 8.28516Z"
                          fill="#495560"
                        />
                      </svg>
                      <span className="text-sm font-medium text-[#495560]">
                        {getLocalizedText(trip.transportation)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Category size={16} color="#555A64" />
                      <span className="text-sm font-medium text-[#495560]">
                        {getLocalizedText(trip.category)}
                      </span>
                    </div>
                  </div>

                  <div className="h-px w-full bg-[#E8EAEB] mb-3"></div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-[#778088]">
                      {trip.reviews} reviews
                    </span>
                    <div className="text-right">
                      <div className="text-xl font-bold text-[#2CA6A4]">
                        ${trip.price}
                      </div>
                      <div className="text-xs font-semibold text-[#778088]">
                        per person
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Second Row of Cards */}
        <div className="flex justify-center gap-10 mb-20">
          {filteredTrips.slice(4, 8).map((trip) => (
            <Link key={trip.id} to={`/destination/${cityName}/${trip.id}`}>
              <div className="w-[270px] h-[405px] bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="w-[250px] h-[180px] mx-auto mt-2.5 rounded-lg overflow-hidden">
                  <img
                    src={trip.image}
                    alt={getLocalizedText(trip.title)}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-2.5 pt-3">
                  <h3 className="text-base font-semibold text-[#1C2B38] mb-4 text-center min-h-[38px] flex items-center justify-center">
                    {getLocalizedText(trip.title)}
                  </h3>

                  <div className="flex flex-col gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Timer size={16} color="#495560" />
                      <span className="text-sm font-medium text-[#495560]">
                        Duration 2 hours
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg
                        width="16"
                        height="12"
                        viewBox="0 0 16 12"
                        fill="none"
                      >
                        <path
                          d="M12.3143 4.28516L12.1611 4.2303L10.864 1.7983C10.6204 1.34126 10.2571 0.959041 9.81302 0.692515C9.36894 0.42599 8.86077 0.285184 8.34286 0.285156H5.07657C4.47677 0.285132 3.89217 0.473872 3.40562 0.824631C2.91907 1.17539 2.55525 1.67037 2.36571 2.23944L1.74743 4.0943C1.22943 4.31263 0.78735 4.67891 0.476523 5.14728C0.165697 5.61566 -6.13215e-05 6.16531 1.70175e-08 6.72744V7.99944C1.70175e-08 8.81087 0.483429 9.50801 1.17714 9.8223C1.26698 10.337 1.53045 10.8054 1.92367 11.1495C2.31689 11.4936 2.81612 11.6925 3.33821 11.7132C3.8603 11.7339 4.37372 11.5751 4.79296 11.2633C5.21221 10.9515 5.51196 10.5054 5.64229 9.99944H10.3577C10.488 10.5054 10.7878 10.9515 11.207 11.2633C11.6263 11.5751 12.1397 11.7339 12.6618 11.7132C13.1839 11.6925 13.6831 11.4936 14.0763 11.1495C14.4696 10.8054 14.733 10.337 14.8229 9.8223C15.1737 9.66394 15.4713 9.40772 15.6801 9.08439C15.8889 8.76105 16 8.38434 16 7.99944V7.61201C15.9999 7.02221 15.8173 6.44689 15.4772 5.965C15.1371 5.48312 14.6563 5.11829 14.1006 4.92058L12.3749 4.30687V4.28516H12.3143ZM5.07657 1.42801H6.28571V4.28516H2.888L3.44914 2.60058C3.56291 2.259 3.78135 1.9619 4.07346 1.75143C4.36557 1.54096 4.71653 1.42781 5.07657 1.42801ZM7.42857 1.42801H8.34286C8.65364 1.4279 8.9586 1.51228 9.22513 1.67212C9.49166 1.83195 9.70973 2.06124 9.856 2.33544L10.896 4.28516H7.42857V1.42801ZM12.1177 5.42801L13.7177 5.99716C14.0511 6.11582 14.3396 6.33473 14.5436 6.62386C14.7476 6.91298 14.8571 7.25816 14.8571 7.61201V7.99944C14.8571 8.19944 14.7886 8.38344 14.6743 8.52973C14.4871 8.09033 14.1669 7.72061 13.7588 7.47251C13.3507 7.2244 12.8751 7.11037 12.3989 7.14643C11.9226 7.1825 11.4696 7.36684 11.1035 7.67357C10.7374 7.9803 10.4766 8.39401 10.3577 8.85658H5.64229C5.52338 8.39401 5.26256 7.9803 4.89646 7.67357C4.53036 7.36684 4.07737 7.1825 3.60112 7.14643C3.12487 7.11037 2.64929 7.2244 2.24117 7.47251C1.83306 7.72061 1.51292 8.09033 1.32571 8.52973C1.20677 8.37861 1.14234 8.19175 1.14286 7.99944V6.72744C1.14286 6.21316 1.37143 5.74458 1.73714 5.42801H12.1177ZM2.28571 9.42801C2.28571 9.12491 2.40612 8.83422 2.62045 8.61989C2.83478 8.40556 3.12547 8.28516 3.42857 8.28516C3.73168 8.28516 4.02237 8.40556 4.23669 8.61989C4.45102 8.83422 4.57143 9.12491 4.57143 9.42801C4.57143 9.73112 4.45102 10.0218 4.23669 10.2361C4.02237 10.4505 3.73168 10.5709 3.42857 10.5709C3.12547 10.5709 2.83478 10.4505 2.62045 10.2361C2.40612 10.0218 2.28571 9.73112 2.28571 9.42801ZM12.5714 8.28516C12.8745 8.28516 13.1652 8.40556 13.3796 8.61989C13.5939 8.83422 13.7143 9.12491 13.7143 9.42801C13.7143 9.73112 13.5939 10.0218 13.3796 10.2361C13.1652 10.4505 12.8745 10.5709 12.5714 10.5709C12.2683 10.5709 11.9776 10.4505 11.7633 10.2361C11.549 10.0218 11.4286 9.73112 11.4286 9.42801C11.4286 9.12491 11.549 8.83422 11.7633 8.61989C11.9776 8.40556 12.2683 8.28516 12.5714 8.28516Z"
                          fill="#495560"
                        />
                      </svg>
                      <span className="text-sm font-medium text-[#495560]">
                        {getLocalizedText(trip.transportation)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Category size={16} color="#555A64" />
                      <span className="text-sm font-medium text-[#495560]">
                        {getLocalizedText(trip.category)}
                      </span>
                    </div>
                  </div>

                  <div className="h-px w-full bg-[#E8EAEB] mb-3"></div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-[#778088]">
                      {trip.reviews} reviews
                    </span>
                    <div className="text-right">
                      <div className="text-xl font-bold text-[#2CA6A4]">
                        ${trip.price}
                      </div>
                      <div className="text-xs font-semibold text-[#778088]">
                        per person
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View More Button */}
        <div className="flex flex-col items-center gap-2.5 w-full mb-20">
          <button className="flex w-[266px] px-4 py-2 justify-center items-center gap-3 rounded-md border border-[#1F7674] bg-[#F3F3EE]">
            <span className="text-xl font-semibold text-[#1F7674] font-roboto">
              View More
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default City;

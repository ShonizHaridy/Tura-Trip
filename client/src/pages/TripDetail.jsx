import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ExcursionCard from "../components/ExcursionCard"; // Add this import


// Import mock data
import { mockTripDetails, mockRelatedTrips } from "../data/mockData"; // Add mockRelatedTrips


const TripDetail = () => {
  const { cityName, tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [relatedTrips, setRelatedTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showMoreTripProgram, setShowMoreTripProgram] = useState(false);

  useEffect(() => {
    fetchTripDataMock();
  }, [cityName, tripId]);

  const fetchTripDataMock = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));

      const tripDetails = mockTripDetails[parseInt(tripId)];
      if (tripDetails) {
        setTrip(tripDetails);
        // Use the updated mockRelatedTrips
        setRelatedTrips(mockRelatedTrips[parseInt(tripId)] || []);
      }
    } catch (error) {
      console.error("Error with mock data:", error);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Trip not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Content Container */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-18 pt-32 pb-10 space-y-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center justify-center w-5 h-5">
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
          <span className="text-[#555A64] font-semibold">Hurghada</span>
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
          <span className="text-[#555A64] font-semibold">Sea Excursions</span>
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
          <span className="text-[#555A64] font-semibold">
            Paradise Island (Hula Hula!)
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
                Paradise Island (Hula Hula!)
              </h1>

              {/* Location */}
              <div className="flex items-center gap-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g opacity="0.4">
                    <path
                      d="M20.6191 8.45C19.5691 3.83 15.5391 1.75 11.9991 1.75C11.9991 1.75 11.9991 1.75 11.9891 1.75C8.45912 1.75 4.41912 3.82 3.36912 8.44C2.19912 13.6 5.35912 17.97 8.21912 20.72C9.27912 21.74 10.6391 22.25 11.9991 22.25C13.3591 22.25 14.7191 21.74 15.7691 20.72C18.6291 17.97 21.7891 13.61 20.6191 8.45Z"
                      fill="#2BA6A4"
                    />
                  </g>
                  <path
                    d="M11.9996 13.4599C13.7393 13.4599 15.1496 12.0496 15.1496 10.3099C15.1496 8.57022 13.7393 7.15991 11.9996 7.15991C10.2599 7.15991 8.84961 8.57022 8.84961 10.3099C8.84961 12.0496 10.2599 13.4599 11.9996 13.4599Z"
                    fill="#2BA6A4"
                  />
                </svg>
                <span className="text-xl font-semibold text-[#2BA6A4]">
                  Makady Bay, Hurghada 46628 Egypt
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
                  <span className="text-sm text-[#555A64]">Duration:</span>
                  <span className="text-sm text-[#8A8D95]">9h Per Day</span>
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
                  <span className="text-sm text-[#555A64]">Days of Week:</span>
                  <span className="text-sm text-[#8A8D95]">Daily</span>
                </div>
              </div>

              {/* Reviews */}
              <div className="flex items-center gap-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 18.86H17.24C16.44 18.86 15.68 19.17 15.12 19.73L13.41 21.42C12.63 22.19 11.36 22.19 10.58 21.42L8.87 19.73C8.31 19.17 7.54 18.86 6.75 18.86H6C4.34 18.86 3 17.53 3 15.89V4.97998C3 3.33998 4.34 2.01001 6 2.01001H18C19.66 2.01001 21 3.33998 21 4.97998V15.89C21 17.52 19.66 18.86 18 18.86Z"
                    stroke="#233660"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.9999 10.0001C13.2868 10.0001 14.33 8.95687 14.33 7.67004C14.33 6.38322 13.2868 5.34009 11.9999 5.34009C10.7131 5.34009 9.66992 6.38322 9.66992 7.67004C9.66992 8.95687 10.7131 10.0001 11.9999 10.0001Z"
                    stroke="#233660"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 15.6601C16 13.8601 14.21 12.4001 12 12.4001C9.79 12.4001 8 13.8601 8 15.6601"
                    stroke="#233660"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[#233660] font-semibold underline">
                  23 Reviews
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Pricing */}
          <div className="w-full lg:w-[305px] flex flex-col gap-2">
            {/* Pricing */}
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="text-3xl font-bold text-[#3F62AE]">$17.00</div>
                <div className="text-xs font-semibold text-[#778088]">
                  Adult (above 12)
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-[#3F62AE]">$10.00</div>
                <div className="text-xs font-semibold text-[#778088]">
                  Child (5-11 years)
                </div>
              </div>
            </div>

            {/* Book Now Button */}
            <button className="w-full bg-[#1F7674] text-[#EAF6F6] py-4 px-6 rounded-md text-2xl font-semibold hover:bg-[#1F7674]/90 transition-colors">
              Book Now
            </button>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="h-[552px] flex items-center gap-6 shadow-lg relative">
          {/* Main Image with Navigation */}
          <div className="flex-1 relative h-full">
            <div
              className="w-full h-full rounded-lg bg-cover bg-center relative"
              style={{
                backgroundImage: `url('https://cdn.builder.io/api/v1/image/assets/TEMP/5e78271ed53b73f4caeb7a4d251a52b218870517?width=1932')`,
              }}
            >
              {/* Navigation Dots */}
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-white opacity-50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-white opacity-50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-white opacity-50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-white opacity-50"></div>
              </div>

              {/* Navigation Arrows */}
              <button className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-white/60 p-2 rounded-lg">
                <svg
                  width="32"
                  height="32"
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
              <button className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-white/60 p-2 rounded-lg">
                <svg
                  width="32"
                  height="32"
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
            </div>
          </div>

          {/* Thumbnail Images */}
          <div className="flex flex-col gap-6 w-[306px] h-full">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/5eea97b1a8fb2fbcb2d78b1be5f0d3980825bce7?width=612"
              alt=""
              className="flex-1 w-full rounded-lg object-cover"
            />
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/6e9c191ef7e333d3961a96f0ef093f248c290b5b?width=612"
              alt=""
              className="flex-1 w-full rounded-lg object-cover"
            />
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/ad7544b7653bf9f21e8c63e79792680a4dac8d48?width=612"
              alt=""
              className="flex-1 w-full rounded-lg object-cover"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-r-lg px-18 py-10 space-y-10">
          <div className="flex flex-col lg:flex-row items-start gap-6">
            {/* Left Content */}
            <div className="flex-1 space-y-6">
              {/* About Section */}
              <div className="space-y-2">
                <h2 className="text-3xl font-semibold text-[#2D467C]">About</h2>
                <p className="text-xl text-[#555A64] leading-relaxed">
                  Kick up the desert dust as you race across the sands on your
                  own all-terrain vehicle (ATV) on this thrilling adrenaline
                  safari, with door-to-door transfers from Hurghada hotels.
                  Learn the basics and take a test drive before your guide leads
                  you on a 12-mile (20-kilometer) journey across the desert to a
                  Bedouin village. Refresh with water and Bedouin tea and take a
                  camel ride before you head back through the sand to the start
                  point.
                </p>
              </div>

              {/* Trip Program Section */}
              <div className="space-y-2">
                <h2 className="text-3xl font-semibold text-[#2D467C]">
                  Trip Program
                </h2>
                <div className="space-y-4">
                  <p className="text-lg text-[#555A64]">
                    Transfer approximately 08:30 (the exact time is announced
                    after booking; the road to the port is from 10 to 40
                    minutes, depending on the location of the hotel)
                    <br />
                    Accommodation on the yacht and departure to the sea, around
                    10:00 (subject to the permission of the tourist police)
                    <br />
                    Two snorkeling stops on the reefs, lasting about one hour
                    each (at the discretion of the guide on site)
                    <br />
                    Disembarkation on the island for rest and swimming from the
                    shore, about 1-1.5 hours (standard time for group
                    excursions)
                    <br />
                    Lunch and drinks on the yacht (various salads, rice, pasta,
                    nuggets, fish/meat sausages; cola, Pepsi, water, tea,
                    coffee)
                    <br />
                    Ride on an inflatable banana and a tablet (standard one lap
                    for all sea group programs in Hurghada)
                    <br />• Return to the hotel around 17:00 (time may vary
                    slightly).
                  </p>
                  <button
                    onClick={() => setShowMoreTripProgram(!showMoreTripProgram)}
                    className="flex items-center gap-2 text-[#222E50]"
                  >
                    <span>Read More</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.2807 5.96667L8.93404 10.3133C8.4207 10.8267 7.5807 10.8267 7.06737 10.3133L2.7207 5.96667"
                        stroke="#222E50"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Features Card */}
            <div className="w-full lg:w-[330px] h-[422px] bg-white border border-[#3F62AE] rounded-3xl p-6 shadow-lg">
              <div className="grid grid-cols-1 gap-6 h-full">
                {/* Feature Items */}
                {[
                  "Booking in 3 Min.",
                  "No Prepayment",
                  "Hotel Pickup",
                  "Insurance is valid",
                  "Russian Speaking Guide",
                  "No Hidden Charges",
                  "Personal Manager",
                  "Real Photos and Reviews",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.4">
                        <path
                          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                          fill="#2BA6A4"
                        />
                      </g>
                      <path
                        d="M10.5795 15.5801C10.3795 15.5801 10.1895 15.5001 10.0495 15.3601L7.21945 12.5301C6.92945 12.2401 6.92945 11.7601 7.21945 11.4701C7.50945 11.1801 7.98945 11.1801 8.27945 11.4701L10.5795 13.7701L15.7195 8.6301C16.0095 8.3401 16.4895 8.3401 16.7795 8.6301C17.0695 8.9201 17.0695 9.4001 16.7795 9.6901L11.1095 15.3601C10.9695 15.5001 10.7795 15.5801 10.5795 15.5801Z"
                        fill="#2BA6A4"
                      />
                    </svg>
                    <span className="text-lg text-[#233660]">{feature}</span>
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
                <h3 className="text-3xl font-semibold text-[#2D467C]">
                  What's included
                </h3>
                <div className="text-xl text-[#555A64] leading-relaxed">
                  Hotel Pick-up & Drop-off
                  <br />
                  Air-conditioned vehicle
                  <br />
                  Camel Ride
                  <br />
                  Bedouin Village & Bedouin Tea
                  <br />
                  Quad Bike Ride
                  <br />
                  Lunch & Drinks on Yacht
                </div>
              </div>

              {/* What's Not Included */}
              <div className="space-y-2">
                <h3 className="text-3xl font-semibold text-[#2D467C]">
                  What's Not included
                </h3>
                <div className="text-xl text-[#555A64] leading-relaxed">
                  Masks
                  <br />
                  Fins
                  <br />
                  Diving Suits
                </div>
              </div>

              {/* Take with you */}
              <div className="space-y-2">
                <h3 className="text-3xl font-semibold text-[#2D467C]">
                  Take with you
                </h3>
                <div className="text-xl text-[#555A64] leading-relaxed">
                  Swim Suit, Towel, Water, Sunscreen, Sunglasses
                  <br />
                  Diving Suits and Snorkeling fins available to rent on site
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-[#2D467C]">Details</h2>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Detail Items */}
              <div className="flex items-start gap-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    opacity="0.4"
                    d="M22.1796 13.66C22.0296 12.01 21.5896 10.25 18.3796 10.25H5.6196C2.4096 10.25 1.9796 12.01 1.8196 13.66L1.2596 19.75C1.1896 20.51 1.4396 21.27 1.9596 21.84C2.4896 22.42 3.2396 22.75 4.0396 22.75H5.9196C7.5396 22.75 7.8496 21.82 8.0496 21.21L8.2496 20.61C8.4796 19.92 8.5396 19.75 9.4396 19.75H14.5596C15.4596 19.75 15.4896 19.85 15.7496 20.61L15.9496 21.21C16.1496 21.82 16.4596 22.75 18.0796 22.75H19.9596C20.7496 22.75 21.5096 22.42 22.0396 21.84C22.5596 21.27 22.8096 20.51 22.7396 19.75L22.1796 13.66Z"
                    fill="#145DA0"
                  />
                  <path
                    d="M21 7.24996H20C19.99 7.24996 19.99 7.24996 19.98 7.24996L19.6 5.43996C19.24 3.68996 18.49 2.07996 15.51 2.07996H12.75H11.25H8.49C5.51 2.07996 4.76 3.68996 4.4 5.43996L4.02 7.24996C4.01 7.24996 4.01 7.24996 4 7.24996H3C2.59 7.24996 2.25 7.58996 2.25 7.99996C2.25 8.40996 2.59 8.74996 3 8.74996H3.71L3.29 10.75C3.83 10.44 4.58 10.25 5.62 10.25H18.38C19.42 10.25 20.17 10.44 20.71 10.75L20.29 8.74996H21C21.41 8.74996 21.75 8.40996 21.75 7.99996C21.75 7.58996 21.41 7.24996 21 7.24996Z"
                    fill="#145DA0"
                  />
                  <path
                    d="M9 15.75H6C5.59 15.75 5.25 15.41 5.25 15C5.25 14.59 5.59 14.25 6 14.25H9C9.41 14.25 9.75 14.59 9.75 15C9.75 15.41 9.41 15.75 9 15.75Z"
                    fill="#145DA0"
                  />
                  <path
                    d="M18 15.75H15C14.59 15.75 14.25 15.41 14.25 15C14.25 14.59 14.59 14.25 15 14.25H18C18.41 14.25 18.75 14.59 18.75 15C18.75 15.41 18.41 15.75 18 15.75Z"
                    fill="#145DA0"
                  />
                </svg>
                <div className="space-y-2">
                  <h4 className="text-xl text-[#233660]">Pickup details</h4>
                  <p className="text-lg text-[#555A64]">
                    Once you book with us, our agent will reach out confirming
                    your room number
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    opacity="0.6"
                    d="M10.11 4C10.03 4.3 10 4.63 10 5V8H5V6C5 4.9 5.9 4 7 4H10.11Z"
                    fill="#3F62AE"
                  />
                  <path
                    d="M10 19V8H5C3 8 2 9 2 11V19C2 21 3 22 5 22H13C11 22 10 21 10 19ZM6.75 17C6.75 17.41 6.41 17.75 6 17.75C5.59 17.75 5.25 17.41 5.25 17V13C5.25 12.59 5.59 12.25 6 12.25C6.41 12.25 6.75 12.59 6.75 13V17Z"
                    fill="#145DA0"
                  />
                  <path
                    opacity="0.4"
                    d="M14 22H13C11 22 10 21 10 19V5C10 3 11 2 13 2H19C21 2 22 3 22 5V19C22 21 21 22 19 22H18"
                    fill="#145DA0"
                  />
                  <path
                    d="M18 18V22H14V18C14 17.45 14.45 17 15 17H17C17.55 17 18 17.45 18 18Z"
                    fill="#145DA0"
                  />
                  <path
                    d="M14 13.75C13.59 13.75 13.25 13.41 13.25 13V8C13.25 7.59 13.59 7.25 14 7.25C14.41 7.25 14.75 7.59 14.75 8V13C14.75 13.41 14.41 13.75 14 13.75Z"
                    fill="#145DA0"
                  />
                  <path
                    d="M18 13.75C17.59 13.75 17.25 13.41 17.25 13V8C17.25 7.59 17.59 7.25 18 7.25C18.41 7.25 18.75 7.59 18.75 8V13C18.75 13.41 18.41 13.75 18 13.75Z"
                    fill="#145DA0"
                  />
                </svg>
                <div className="space-y-2">
                  <h4 className="text-xl text-[#233660]">
                    Hotel pickup offered
                  </h4>
                  <p className="text-lg text-[#555A64]">
                    During checkout you will be able to select from the list of
                    included hotels.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    opacity="0.4"
                    d="M16.9 22H7.10001C5.40001 22 4 20.61 4 18.9V5.10001C4 3.40001 5.39001 2 7.10001 2H16.9C18.6 2 20 3.39001 20 5.10001V18.9C20 20.61 18.61 22 16.9 22Z"
                    fill="#3F62AE"
                  />
                  <path d="M20 8H4V13H20V8Z" fill="#145DA0" />
                  <path
                    d="M8 18.7501C7.92 18.7501 7.83999 18.7401 7.75999 18.7301C7.67999 18.7101 7.6 18.6901 7.52 18.6501C7.45 18.6201 7.37 18.5801 7.31 18.5401C7.24 18.4901 7.17 18.4401 7.12 18.3801C6.88 18.1501 6.75 17.8301 6.75 17.5001C6.75 17.1701 6.88 16.8501 7.12 16.6201C7.17 16.5601 7.24 16.5101 7.31 16.4601C7.37 16.4201 7.45 16.3801 7.52 16.3501C7.6 16.3101 7.67999 16.2901 7.75999 16.2701C8.15999 16.1901 8.59 16.3301 8.88 16.6201C9.12 16.8501 9.25 17.1701 9.25 17.5001C9.25 17.8301 9.12 18.1501 8.88 18.3801C8.65 18.6201 8.33 18.7501 8 18.7501Z"
                    fill="#145DA0"
                  />
                  <path
                    d="M16 18.7501C15.92 18.7501 15.84 18.7401 15.76 18.7301C15.68 18.7101 15.6 18.6901 15.52 18.6501C15.45 18.6201 15.37 18.5801 15.31 18.5401C15.24 18.4901 15.17 18.4401 15.12 18.3801C14.88 18.1501 14.75 17.8301 14.75 17.5001C14.75 17.1701 14.88 16.8501 15.12 16.6201C15.17 16.5601 15.24 16.5101 15.31 16.4601C15.37 16.4201 15.45 16.3801 15.52 16.3501C15.6 16.3101 15.68 16.2901 15.76 16.2701C15.92 16.2401 16.08 16.2401 16.25 16.2701C16.32 16.2901 16.4 16.3101 16.48 16.3501C16.55 16.3801 16.63 16.4201 16.69 16.4601C16.76 16.5101 16.83 16.5601 16.88 16.6201C17.12 16.8501 17.25 17.1701 17.25 17.5001C17.25 17.8301 17.12 18.1501 16.88 18.3801C16.83 18.4401 16.76 18.4901 16.69 18.5401C16.63 18.5801 16.55 18.6201 16.48 18.6501C16.4 18.6901 16.32 18.7101 16.25 18.7301C16.16 18.7401 16.08 18.7501 16 18.7501Z"
                    fill="#145DA0"
                  />
                  <path
                    d="M14.5 5.75H9.5C9.09 5.75 8.75 5.41 8.75 5C8.75 4.59 9.09 4.25 9.5 4.25H14.5C14.91 4.25 15.25 4.59 15.25 5C15.25 5.41 14.91 5.75 14.5 5.75Z"
                    fill="#145DA0"
                  />
                </svg>
                <div className="space-y-2">
                  <h4 className="text-xl text-[#233660]">
                    Additional pickup options
                  </h4>
                  <p className="text-lg text-[#555A64]">
                    During checkout you will be able to select from the list of
                    Hurghada, Red Sea, Egypt
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    opacity="0.4"
                    d="M20.4098 6.95994V9.79994L7.39984 19.3399L4.76984 17.3699C4.11984 16.8799 3.58984 15.8299 3.58984 15.0199V6.95994C3.58984 5.83994 4.44984 4.59994 5.49984 4.20994L10.9698 2.15994C11.5398 1.94994 12.4598 1.94994 13.0298 2.15994L18.4998 4.20994C19.5498 4.59994 20.4098 5.83994 20.4098 6.95994Z"
                    fill="#3F62AE"
                  />
                  <path
                    d="M20.4103 11.17V15.02C20.4103 15.83 19.8803 16.88 19.2303 17.37L13.7603 21.46C13.2803 21.82 12.6403 22 12.0003 22C11.3603 22 10.7203 21.82 10.2403 21.46L8.32031 20.03L20.4103 11.17Z"
                    fill="#3F62AE"
                  />
                </svg>
                <div className="space-y-2">
                  <h4 className="text-xl text-[#233660]">
                    Cancellation policy
                  </h4>
                  <p className="text-lg text-[#555A64]">
                    For a full refund, you must cancel at least 24 hours before
                    the experience's start time.
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
            <h2 className="text-3xl font-semibold text-[#2D467C]">
              Customer Reviews
            </h2>

            {/* Review Input */}
            <div className="flex items-center gap-6 opacity-60">
              <div className="w-14 h-14 bg-[#F3F4F6] rounded-full flex items-center justify-center">
                <svg
                  width="56"
                  height="56"
                  viewBox="0 0 56 56"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="56" height="56" rx="28" fill="#F3F4F6" />
                  <path
                    d="M56 48.986V56.0023H0V49.0116C3.25721 44.6587 7.48512 41.1258 12.3475 38.6937C17.2099 36.2617 22.5727 34.9978 28.0093 35.0023C39.452 35.0023 49.616 40.495 56 48.986ZM37.338 21C37.338 23.4753 36.3547 25.8493 34.6043 27.5996C32.854 29.35 30.48 30.3333 28.0047 30.3333C25.5293 30.3333 23.1553 29.35 21.405 27.5996C19.6547 25.8493 18.6713 23.4753 18.6713 21C18.6713 18.5246 19.6547 16.1506 21.405 14.4003C23.1553 12.65 25.5293 11.6666 28.0047 11.6666C30.48 11.6666 32.854 12.65 34.6043 14.4003C36.3547 16.1506 37.338 18.5246 37.338 21Z"
                    fill="#D1D5DB"
                  />
                </svg>
              </div>
              <div className="border border-[#B0B2B7] rounded px-2 py-2 w-60">
                <span className="text-[#8A8D95]">Name*</span>
              </div>
            </div>

            {/* Review Text Area */}
            <div className="border-2 border-[#E8E7EA] rounded-lg p-4 bg-[#FEFEFD]">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.5 19H8C4 19 2 18 2 13V8C2 4 4 2 8 2H16C20 2 22 4 22 8V13C22 17 20 19 16 19H15.5C15.19 19 14.89 19.15 14.7 19.4L13.2 21.4C12.54 22.28 11.46 22.28 10.8 21.4L9.3 19.4C9.14 19.18 8.77 19 8.5 19Z"
                      stroke="#8A8D95"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15.9965 11H16.0054"
                      stroke="#8A8D95"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.9945 11H12.0035"
                      stroke="#8A8D95"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.99451 11H8.00349"
                      stroke="#8A8D95"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-[#8A8D95]">Write Your Review</span>
                </div>
                <div className="flex justify-end gap-2">
                  <button className="bg-[#DDE7E9] p-2 rounded">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.4"
                        d="M14.6791 11.2134L12.5924 6.33339C12.2124 5.44005 11.6458 4.93339 10.9991 4.90005C10.3591 4.86672 9.73911 5.31339 9.26578 6.16672L7.99911 8.44005C7.73245 8.92005 7.35245 9.20672 6.93911 9.24005C6.51911 9.28005 6.09912 9.06005 5.75912 8.62672L5.61245 8.44005C5.13912 7.84672 4.55245 7.56005 3.95245 7.62005C3.35245 7.68005 2.83912 8.09339 2.49912 8.76672L1.34578 11.0667C0.932449 11.9001 0.972449 12.8667 1.45912 13.6534C1.94578 14.4401 2.79245 14.9134 3.71911 14.9134H12.2258C13.1191 14.9134 13.9524 14.4667 14.4458 13.7201C14.9524 12.9734 15.0324 12.0334 14.6791 11.2134Z"
                        fill="#145DA0"
                      />
                      <path
                        d="M4.64591 5.58662C5.89039 5.58662 6.89925 4.57777 6.89925 3.33329C6.89925 2.08881 5.89039 1.07996 4.64591 1.07996C3.40143 1.07996 2.39258 2.08881 2.39258 3.33329C2.39258 4.57777 3.40143 5.58662 4.64591 5.58662Z"
                        fill="#145DA0"
                      />
                    </svg>
                  </button>
                  <button className="bg-[#DDE7E9] px-3 py-2 rounded text-[#124645] font-semibold">
                    Send
                  </button>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="pl-10 space-y-6">
              {/* Review Item */}
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                    <div>
                      <div className="font-medium">Mina Younan</div>
                    </div>
                  </div>
                  <div className="bg-[#ECEFF7] rounded-lg p-6">
                    <div className="mb-4">
                      <span className="underline font-medium">
                        First class recommended!
                      </span>
                      <br />
                      Our guide Ali and the two drivers were very nice and
                      competent. The trip lasted 4 hours at no extra cost and it
                      was a wonderful experience.
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>2025/05/02</span>
                      <div className="flex gap-4">
                        <button>Reply</button>
                        <button>Like</button>
                      </div>
                    </div>
                  </div>
                  {index < 2 && (
                    <div className="w-full h-px bg-[#E6E6E8]"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Load More Button */}
          <div className="flex justify-center">
            <button className="border border-[#1F7674] text-[#1F7674] bg-[#F3F3EE] px-4 py-2 rounded-md font-semibold">
              Load More Comments
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-0.5 bg-[#BFD1D3]"></div>

        {/* More Like This Trip Section */}
<div className="space-y-4">
  <div className="flex justify-between items-center">
    <h2 className="text-3xl font-semibold text-[#2D467C]">
      More Like This Trip
    </h2>
    <button className="border border-[#1F7674] text-[#1F7674] bg-[#F3F3EE] px-4 py-2 rounded-md font-semibold">
      view all
    </button>
  </div>

  {/* Trip Cards using ExcursionCard */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {relatedTrips.map((trip) => (
      <ExcursionCard
        key={trip.id}
        {...trip}
      />
    ))}
  </div>
</div>
      </div>
    </div>
  );
};

export default TripDetail;

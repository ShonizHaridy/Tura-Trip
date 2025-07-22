import React, { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState("FAQs");

  const faqs = [
    {
      id: 1,
      question: "What is the best time to visit egypt?",
      answer:
        "Egypt is an amazing country with a rich ancient history, breathtaking landscapes and huge opportunities for quality recreation. The country of the pharaohs offers a diverse choice of resorts. The three most popular of them are:",
    },
    {
      id: 2,
      question: "Do i need a visa to visit egypt ?",
      answer:
        "Fascinating excursions will help you get acquainted with the culture, history, and natural attractions of the country:\n\nHistory and culture. The country of the pyramids is rich in archaeological treasures. Visit the majestic pyramids of Giza, the mysterious temples of Luxor, museums with collections of antique artifacts. Immerse yourself in the ancient world of the pharaohs - feel the grandeur of Ancient Egypt.\n\nNatural beauty. Egypt has amazing natural landscapes: endless deserts, crystal clear waters of the Red Sea and picturesque coral reefs. Here you can enjoy a beach holiday, snorkeling, diving, kite surfing and other types of active recreation..\n\nHospitality, cuisine. Egyptian hospitality is known all over the world. Locals warmly welcome guests, doing everything possible to create comfortable conditions for tourists. Enjoy exquisite Egyptian cuisine, try traditional dishes - fatir, koshari, hummus, falafel and many others.\n\nEntertainment, activities, excursions. You can go on a cruise on the Nile, ride camels in the desert, visit fabulous oases, walk through ancient bazaars, and also enjoy the nightlife of resort towns.\n\nEgypt will satisfy the interests of a wide range of travelers. Unforgettable excursions, rich history, natural landscapes make it a must-see destination.",
    },
    {
      id: 3,
      question: "what  currencey is used in egypt ?",
      answer:
        "Egypt is an amazing country with a rich ancient history, breathtaking landscapes and huge opportunities for quality recreation. The country of the pharaohs offers a diverse choice of resorts. The three most popular of them are:",
    },
    {
      id: 4,
      question: "How can i book tour",
      answer:
        "Temples of Luxor and Karnak. A tour of the temple complexes will take you back thousands of years to the magical world of Ancient Egypt, where you will feel like a real pharaoh. Majestic columns, detailed frescoes, statues and images of gods will surround you on all sides, telling the story of a thriving civilization. Together with your guide, you will relive history to learn about the important rituals, ceremonies and rites that were held in these sacred places.",
    },
    {
      id: 5,
      question: "Can i cancel my Booking?",
      answer:
        "Hospitality, cuisine. Egyptian hospitality is known all over the world. Locals warmly welcome guests, doing everything possible to create comfortable conditions for tourists. Enjoy exquisite Egyptian cuisine, try traditional dishes - fatir, koshari, hummus, falafel and many others.",
    },
    {
      id: 6,
      question: "What languages ?",
      answer:
        "Natural beauty. Egypt has amazing natural landscapes: endless deserts, crystal clear waters of the Red Sea and picturesque coral reefs. Here you can enjoy a beach holiday, snorkeling, diving, kite surfing and other types of active recreation..",
    },
  ];

  const handleEdit = (faqId) => {
    console.log("Edit FAQ:", faqId);
  };

  const handleDelete = (faqId) => {
    console.log("Delete FAQ:", faqId);
  };

  return (
    <AdminLayout activeItem="Content">
      {/* Content Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("FAQs")}
            className={`px-8 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "FAQs"
                ? "border-teal-600 text-teal-600 bg-gray-100"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            FAQs
          </button>
          <button
            onClick={() => setActiveTab("Reviews")}
            className={`px-8 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "Reviews"
                ? "border-teal-600 text-teal-600 bg-gray-100"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Reviews
          </button>
        </div>
      </div>

      {activeTab === "FAQs" && (
        <>
          {/* Add New Question Button */}
          <div className="flex justify-end mb-6">
            <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 8H12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 12V4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Add New Question</span>
            </button>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-medium text-teal-800">FAQ</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent w-96"
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* FAQ Table */}
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 w-80">
                      Section Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                      Answer
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 w-20"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {faqs.map((faq) => (
                    <tr key={faq.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 align-top">
                        <div className="text-sm text-gray-900">
                          {faq.question}
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div className="text-sm text-gray-600 line-clamp-3 max-w-4xl">
                          {faq.answer}
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleEdit(faq.id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M13.2603 3.59997L5.05034 12.29C4.74034 12.62 4.44034 13.27 4.38034 13.72L4.01034 16.96C3.88034 18.13 4.72034 18.93 5.88034 18.73L9.10034 18.18C9.55034 18.1 10.1803 17.77 10.4903 17.43L18.7003 8.73997C20.1203 7.23997 20.7603 5.52997 18.5503 3.43997C16.3503 1.36997 14.6803 2.09997 13.2603 3.59997Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeMiterlimit="10"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M11.8896 5.05005C12.3196 7.81005 14.5596 9.92005 17.3396 10.2"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeMiterlimit="10"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M3 22H21"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeMiterlimit="10"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(faq.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M21 5.97998C17.67 5.64998 14.32 5.47998 10.98 5.47998C9 5.47998 7.02 5.57998 5.04 5.77998L3 5.97998"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M18.8504 9.13989L18.2004 19.2099C18.0904 20.7799 18.0004 21.9999 15.2104 21.9999H8.79039C6.00039 21.9999 5.91039 20.7799 5.80039 19.2099L5.15039 9.13989"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M10.3301 16.5H13.6601"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M9.5 12.5H14.5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">Showing 1 to 10 of 99</div>
              <div className="flex items-center space-x-1">
                <button className="px-3 py-1 border border-gray-300 rounded-l-md bg-white text-gray-500 hover:bg-gray-50">
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
                      d="M12.7071 5.29289C13.0976 5.68342 13.0976 6.31658 12.7071 6.70711L9.41421 10L12.7071 13.2929C13.0976 13.6834 13.0976 14.3166 12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071L7.29289 10.7071C6.90237 10.3166 6.90237 9.68342 7.29289 9.29289L11.2929 5.29289C11.6834 4.90237 12.3166 4.90237 12.7071 5.29289Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
                <button className="px-3 py-1 border-t border-b border-teal-600 bg-teal-100 text-teal-700">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                  3
                </button>
                <button className="px-3 py-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                  ...
                </button>
                <button className="px-3 py-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                  8
                </button>
                <button className="px-3 py-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                  9
                </button>
                <button className="px-3 py-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                  10
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-r-md bg-white text-gray-500 hover:bg-gray-50">
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
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "Reviews" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Reviews Management
          </h3>
          <p className="text-gray-600">
            Reviews management functionality will be implemented here.
          </p>
        </div>
      )}
    </AdminLayout>
  );
};

export default ContentManagement;

// // src/pages/admin/ContentManagement.jsx
// import React, { useState } from "react";
// import AdminSidebar from "../../components/admin/AdminSidebar";
// import AdminTopBar from "../../components/admin/AdminTopBar";
// import AddReviewModal from "../../components/admin/AddReviewModal";

// const ContentManagement = () => {
//   const [activeTab, setActiveTab] = useState("Reviews");
//   const [showAddReviewModal, setShowAddReviewModal] = useState(false);

//   // Sample reviews data
//   const [reviews, setReviews] = useState([
//     {
//       id: 1,
//       screenshot: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=100",
//       review: "I had an amazing experience with Tura Trip during my vacation in Sharm El-Sheikh. Everything was well-organized, from airport pickup to the daily excursions.",
//       clientName: "Hunery Abounab",
//       date: "16/08/2013",
//     },
//     {
//       id: 2,
//       screenshot: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100",
//       review: "During my vacation in Sharm El-Sheikh. Everything was well-organized, from airport pickup to the daily excursions. The guides were excellent.",
//       clientName: "Mina Younan",
//       date: "12/06/2020",
//     },
//     {
//       id: 3,
//       screenshot: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=100",
//       review: "Breathtaking nature and amazing I had an amazing experience with Tura Trip during my vacation in Sharm El-Sheikh. Everything was perfect.",
//       clientName: "Marco Malak",
//       date: "18/09/2016",
//     },
//     {
//       id: 4,
//       screenshot: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100",
//       review: "Unforgettable moments with dolphins I had an amazing experience with Tura Trip during my vacation in Sharm El-Sheikh.",
//       clientName: "Alexander",
//       date: "28/10/2012",
//     },
//     {
//       id: 5,
//       screenshot: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=100",
//       review: "Fun and family-friendly sea tour I had an amazing experience with Tura Trip during my vacation in Sharm El-Sheikh. Everything was well-organized.",
//       clientName: "Ahmed",
//       date: "15/08/2017",
//     },
//     {
//       id: 6,
//       screenshot: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100",
//       review: "Peaceful beach with sea turtles I had an amazing experience with Tura Trip during my vacation in Sharm El-Sheikh. Everything was well-organized.",
//       clientName: "Bedo",
//       date: "07/05/2016",
//     },
//   ]);

//   const handleAddReview = (reviewData) => {
//     const newReview = {
//       id: reviews.length + 1,
//       ...reviewData,
//     };
//     setReviews([newReview, ...reviews]);
//     setShowAddReviewModal(false);
//   };

//   const handleDeleteReview = (id) => {
//     setReviews(reviews.filter(review => review.id !== id));
//   };

//   const ReviewsTable = () => (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//       <div className="p-4 border-b border-gray-200 flex justify-between items-center">
//         <h2 className="text-xl font-semibold text-gray-800">Recent Reviews</h2>
//         <button
//           onClick={() => setShowAddReviewModal(true)}
//           className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
//         >
//           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//           </svg>
//           Add New Review
//         </button>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Screen shot
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Review
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 client's name
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Date
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {reviews.map((review) => (
//               <tr key={review.id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="w-16 h-10 bg-gray-200 rounded border overflow-hidden">
//                     <img
//                       src={review.screenshot}
//                       alt="Review screenshot"
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                 </td>
//                 <td className="px-6 py-4">
//                   <div className="text-sm text-gray-800 max-w-md">
//                     {review.review.length > 100
//                       ? `${review.review.substring(0, 100)}...`
//                       : review.review
//                     }
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm font-medium text-gray-800">
//                     {review.clientName}
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-600">
//                     {review.date}
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="flex items-center gap-2">
//                     <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors">
//                       <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                       </svg>
//                     </button>
//                     <button
//                       onClick={() => handleDeleteReview(review.id)}
//                       className="p-2 hover:bg-red-100 rounded-lg transition-colors"
//                     >
//                       <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                       </svg>
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t">
//         <span className="text-sm text-gray-700">Showing 1 to 10 of 99</span>
//         <div className="flex items-center gap-2">
//           <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
//             Previous
//           </button>
//           <button className="px-3 py-2 text-sm bg-teal-600 text-white rounded-lg">1</button>
//           <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
//           <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">3</button>
//           <span className="px-3 py-2 text-sm text-gray-500">...</span>
//           <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">8</button>
//           <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">9</button>
//           <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">10</button>
//           <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       <AdminSidebar activeItem="Content" />

//       <div className="flex-1 flex flex-col">
//         <AdminTopBar />

//         <main className="flex-1 p-6">
//           <div className="max-w-7xl mx-auto">
//             <div className="mb-6">
//               <h1 className="text-2xl font-bold text-gray-900 mb-4">Content Management</h1>

//               {/* Tabs */}
//               <div className="border-b border-gray-200">
//                 <nav className="-mb-px flex space-x-8">
//                   {["FAQs", "Reviews"].map((tab) => (
//                     <button
//                       key={tab}
//                       onClick={() => setActiveTab(tab)}
//                       className={`py-2 px-1 border-b-2 font-medium text-sm ${
//                         activeTab === tab
//                           ? "border-teal-500 text-teal-600"
//                           : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                       }`}
//                     >
//                       {tab}
//                     </button>
//                   ))}
//                 </nav>
//               </div>
//             </div>

//             {activeTab === "FAQs" && (
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">FAQ Management</h3>
//                 <p className="text-gray-600">FAQ management functionality will be implemented here.</p>
//               </div>
//             )}

//             {activeTab === "Reviews" && <ReviewsTable />}
//           </div>
//         </main>
//       </div>

//       {/* Add Review Modal */}
//       {showAddReviewModal && (
//         <AddReviewModal
//           onClose={() => setShowAddReviewModal(false)}
//           onSave={handleAddReview}
//         />
//       )}
//     </div>
//   );
// };

// export default ContentManagement;

// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Edit2, Trash, Add, SearchNormal1, User, Refresh, Logout, ArrowLeft2, ArrowRight2 } from 'iconsax-react';
// import AdminLayout from "../../components/admin/AdminLayout";

// const ContentManagement = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("FAQs");

//   // Handle URL params to set active tab
//   useEffect(() => {
//     const searchParams = new URLSearchParams(location.search);
//     const tab = searchParams.get('tab');
    
//     if (tab === 'reviews') {
//       setActiveTab('Reviews');
//     } else {
//       setActiveTab('FAQs'); // Default to FAQs
//     }
//   }, [location.search]);

//   // Update URL when tab changes
//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     if (tab === 'Reviews') {
//       navigate('/admin/content?tab=reviews');
//     } else {
//       navigate('/admin/content?tab=faqs');
//     }
//   };

//   const faqs = [
//     {
//       id: 1,
//       question: "What is the best time to visit egypt?",
//       answer:
//         "Egypt is an amazing country with a rich ancient history, breathtaking landscapes and huge opportunities for quality recreation. The country of the pharaohs offers a diverse choice of resorts. The three most popular of them are:",
//     },
//     {
//       id: 2,
//       question: "Do i need a visa to visit egypt ?",
//       answer:
//         "Fascinating excursions will help you get acquainted with the culture, history, and natural attractions of the country:\n\nHistory and culture. The country of the pyramids is rich in archaeological treasures. Visit the majestic pyramids of Giza, the mysterious temples of Luxor, museums with collections of antique artifacts. Immerse yourself in the ancient world of the pharaohs - feel the grandeur of Ancient Egypt.\n\nNatural beauty. Egypt has amazing natural landscapes: endless deserts, crystal clear waters of the Red Sea and picturesque coral reefs. Here you can enjoy a beach holiday, snorkeling, diving, kite surfing and other types of active recreation..\n\nHospitality, cuisine. Egyptian hospitality is known all over the world. Locals warmly welcome guests, doing everything possible to create comfortable conditions for tourists. Enjoy exquisite Egyptian cuisine, try traditional dishes - fatir, koshari, hummus, falafel and many others.\n\nEntertainment, activities, excursions. You can go on a cruise on the Nile, ride camels in the desert, visit fabulous oases, walk through ancient bazaars, and also enjoy the nightlife of resort towns.\n\nEgypt will satisfy the interests of a wide range of travelers. Unforgettable excursions, rich history, natural landscapes make it a must-see destination.",
//     },
//     {
//       id: 3,
//       question: "what  currencey is used in egypt ?",
//       answer:
//         "Egypt is an amazing country with a rich ancient history, breathtaking landscapes and huge opportunities for quality recreation. The country of the pharaohs offers a diverse choice of resorts. The three most popular of them are:",
//     },
//     {
//       id: 4,
//       question: "How can i book tour",
//       answer:
//         "Temples of Luxor and Karnak. A tour of the temple complexes will take you back thousands of years to the magical world of Ancient Egypt, where you will feel like a real pharaoh. Majestic columns, detailed frescoes, statues and images of gods will surround you on all sides, telling the story of a thriving civilization. Together with your guide, you will relive history to learn about the important rituals, ceremonies and rites that were held in these sacred places.",
//     },
//     {
//       id: 5,
//       question: "Can i cancel my Booking?",
//       answer:
//         "Hospitality, cuisine. Egyptian hospitality is known all over the world. Locals warmly welcome guests, doing everything possible to create comfortable conditions for tourists. Enjoy exquisite Egyptian cuisine, try traditional dishes - fatir, koshari, hummus, falafel and many others.",
//     },
//     {
//       id: 6,
//       question: "What languages ?",
//       answer:
//         "Natural beauty. Egypt has amazing natural landscapes: endless deserts, crystal clear waters of the Red Sea and picturesque coral reefs. Here you can enjoy a beach holiday, snorkeling, diving, kite surfing and other types of active recreation..",
//     },
//   ];

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

//   const handleEdit = (faqId) => {
//     console.log("Edit FAQ:", faqId);
//   };

//   const handleDelete = (faqId) => {
//     console.log("Delete FAQ:", faqId);
//   };

//   const handleDeleteReview = (id) => {
//     setReviews(reviews.filter(review => review.id !== id));
//   };

//   return (
//     <AdminLayout activeItem="Content">
//       {/* Content Navigation */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
//         <div className="flex border-b border-gray-200">
//           <button
//             onClick={() => handleTabChange("FAQs")}
//             className={`px-8 py-4 text-sm font-medium border-b-2 transition-colors ${
//               activeTab === "FAQs"
//                 ? "border-teal-600 text-teal-600 bg-gray-100"
//                 : "border-transparent text-gray-500 hover:text-gray-700"
//             }`}
//           >
//             FAQs
//           </button>
//           <button
//             onClick={() => handleTabChange("Reviews")}
//             className={`px-8 py-4 text-sm font-medium border-b-2 transition-colors ${
//               activeTab === "Reviews"
//                 ? "border-teal-600 text-teal-600 bg-gray-100"
//                 : "border-transparent text-gray-500 hover:text-gray-700"
//             }`}
//           >
//             Reviews
//           </button>
//         </div>
//       </div>

//       {/* Rest of the component remains the same... */}
//       {activeTab === "FAQs" && (
//         <>
//           {/* Add New Question Button */}
//           <div className="flex justify-end mb-6">
//             <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors">
//               <Add size="16" color="#ffffff" />
//               <span>Add New Question</span>
//             </button>
//           </div>

//           {/* FAQ Section */}
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//             <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
//               <h2 className="text-xl font-medium text-teal-800">FAQ</h2>
//               <div className="flex items-center space-x-4">
//                 <div className="relative">
//                   <input
//                     type="text"
//                     placeholder="Search"
//                     className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent w-96"
//                   />
//                   <SearchNormal1 size="16" color="#9ca3af" className="absolute left-3 top-1/2 transform -translate-y-1/2" />
//                 </div>
//               </div>
//             </div>

//             {/* FAQ Table */}
//             <div className="overflow-hidden">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-blue-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 w-80">
//                       Section Name
//                     </th>
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
//                       Answer
//                     </th>
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 w-20"></th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {faqs.map((faq) => (
//                     <tr key={faq.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 align-top">
//                         <div className="text-sm text-gray-900">
//                           {faq.question}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 align-top">
//                         <div className="text-sm text-gray-600 line-clamp-3 max-w-4xl">
//                           {faq.answer}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 align-top">
//                         <div className="flex items-center space-x-3">
//                           <button
//                             onClick={() => handleEdit(faq.id)}
//                             className="text-gray-400 hover:text-gray-600 transition-colors"
//                           >
//                             <Edit2 size="20" color="currentColor" />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(faq.id)}
//                             className="text-gray-400 hover:text-red-600 transition-colors"
//                           >
//                             <Trash size="20" color="currentColor" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
//               <div className="text-sm text-gray-700">Showing 1 to 10 of 99</div>
//               <div className="flex items-center space-x-1">
//                 <button className="px-3 py-1 border border-gray-300 rounded-l-md bg-white text-gray-500 hover:bg-gray-50">
//                   <ArrowLeft2 size="20" color="#6b7280" />
//                 </button>
//                 <button className="px-3 py-1 border-t border-b border-teal-600 bg-teal-100 text-teal-700">
//                   1
//                 </button>
//                 <button className="px-3 py-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
//                   2
//                 </button>
//                 <button className="px-3 py-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
//                   3
//                 </button>
//                 <button className="px-3 py-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
//                   ...
//                 </button>
//                 <button className="px-3 py-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
//                   8
//                 </button>
//                 <button className="px-3 py-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
//                   9
//                 </button>
//                 <button className="px-3 py-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
//                   10
//                 </button>
//                 <button className="px-3 py-1 border border-gray-300 rounded-r-md bg-white text-gray-500 hover:bg-gray-50">
//                   <ArrowRight2 size="20" color="#6b7280" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </>
//       )}

//       {activeTab === "Reviews" && (
//         <>
//           {/* Add New Review Button */}
//           <div className="flex justify-end mb-6">
//             <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors">
//               <Add size="16" color="#ffffff" />
//               <span>Add New Review</span>
//             </button>
//           </div>

//           {/* Reviews Section */}
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//             <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
//               <h2 className="text-xl font-medium text-teal-800">Recent Reviews</h2>
//               <div className="flex items-center space-x-4">
//                 <div className="relative">
//                   <input
//                     type="text"
//                     placeholder="Search"
//                     className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent w-96"
//                   />
//                   <SearchNormal1 size="16" color="#9ca3af" className="absolute left-3 top-1/2 transform -translate-y-1/2" />
//                 </div>
//               </div>
//             </div>

//             {/* Reviews Table */}
//             <div className="overflow-hidden">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-blue-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
//                       Screen shot
//                     </th>
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
//                       Review
//                     </th>
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
//                       Client's name
//                     </th>
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
//                       Date
//                     </th>
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 w-20"></th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {reviews.map((review) => (
//                     <tr key={review.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 align-top">
//                         <div className="w-16 h-10 bg-gray-200 rounded border overflow-hidden">
//                           <img
//                             src={review.screenshot}
//                             alt="Review screenshot"
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 align-top">
//                         <div className="text-sm text-gray-800 max-w-md">
//                           {review.review.length > 100
//                             ? `${review.review.substring(0, 100)}...`
//                             : review.review
//                           }
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 align-top">
//                         <div className="text-sm font-medium text-gray-800">
//                           {review.clientName}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 align-top">
//                         <div className="text-sm text-gray-600">
//                           {review.date}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 align-top">
//                         <div className="flex items-center space-x-3">
//                           <button className="text-gray-400 hover:text-gray-600 transition-colors">
//                             <Edit2 size="20" color="currentColor" />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteReview(review.id)}
//                             className="text-gray-400 hover:text-red-600 transition-colors"
//                           >
//                             <Trash size="20" color="currentColor" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
//               <div className="text-sm text-gray-700">Showing 1 to 10 of 99</div>
//               <div className="flex items-center space-x-1">
//                 <button className="px-3 py-1 border border-gray-300 rounded-l-md bg-white text-gray-500 hover:bg-gray-50">
//                   <ArrowLeft2 size="20" color="#6b7280" />
//                 </button>
//                 <button className="px-3 py-1 border-t border-b border-teal-600 bg-teal-100 text-teal-700">
//                   1
//                 </button>
//                 <button className="px-3 py-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
//                   2
//                 </button>
//                 <button className="px-3 py-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
//                   3
//                 </button>
//                 <button className="px-3 py-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
//                   ...
//                 </button>
//                 <button className="px-3 py-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
//                   8
//                 </button>
//                 <button className="px-3 py-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
//                   9
//                 </button>
//                 <button className="px-3 py-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
//                   10
//                 </button>
//                 <button className="px-3 py-1 border border-gray-300 rounded-r-md bg-white text-gray-500 hover:bg-gray-50">
//                   <ArrowRight2 size="20" color="#6b7280" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </AdminLayout>
//   );
// };

// export default ContentManagement;

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



// src/pages/admin/ContentManagement.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Edit2, Trash, Add, SearchNormal1, ArrowLeft2, ArrowRight2, Eye } from 'iconsax-react';
import AdminLayout from "../../components/admin/AdminLayout";
import AddFAQModal from "../../components/admin/AddFAQModal";
import AddReviewModal from "../../components/admin/AddReviewModal";
import AddCommentModal from "../../components/admin/AddCommentModal";
import ViewCommentModal from "../../components/admin/ViewCommentModal";
import adminService from "../../services/adminService";

const ContentManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("FAQs");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal states
  const [showAddFAQModal, setShowAddFAQModal] = useState(false);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [showAddCommentModal, setShowAddCommentModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [showViewCommentModal, setShowViewCommentModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);

  // Data states
  const [faqs, setFaqs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [promotionalReviews, setPromotionalReviews] = useState([]);
  const [comments, setComments] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const itemsPerPage = 10;

  // Handle URL params to set active tab
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    
    if (tab === 'reviews') {
      setActiveTab('Reviews');
    } else if (tab === 'comments') {
      setActiveTab('Comments');
    } else {
      setActiveTab('FAQs');
    }
  }, [location.search]);

  // Fetch data when tab changes
  useEffect(() => {
    fetchData();
  }, [activeTab, currentPage, searchTerm]);

  // Update URL when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchTerm("");
    
    if (tab === 'Reviews') {
      navigate('/admin/content?tab=reviews');
    } else if (tab === 'Comments') {
      navigate('/admin/content?tab=comments');
    } else {
      navigate('/admin/content?tab=faqs');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError("");
    
    try {
      if (activeTab === "FAQs") {
        // Remove the language parameter to get ALL translations
        const response = await adminService.getFAQs(null, { page: currentPage, limit: itemsPerPage });
        if (response.success) {
          if (response.data.faqs) {
            setFaqs(response.data.faqs);
            setTotalPages(response.data.pagination?.totalPages || 1);
            setTotalItems(response.data.pagination?.totalItems || 0);
          } else {
            setFaqs(response.data);
          }
        } else {
          setError("Failed to load FAQs");
        }
      } else if (activeTab === "Reviews") {
        const response = await adminService.getPromotionalReviews({ page: currentPage, limit: itemsPerPage });
        if (response.success) {
          if (response.data.reviews) {
            console.log("These are the reviews:", response.data.reviews);
            setPromotionalReviews(response.data.reviews);
            setTotalPages(response.data.pagination?.totalPages || 1);
            setTotalItems(response.data.pagination?.totalItems || 0);
          } else {
            setPromotionalReviews(response.data);
          }
        } else {
          setError("Failed to load reviews");
        }
      } else if (activeTab === "Comments") {
        const response = await adminService.getReviews({ page: currentPage, limit: itemsPerPage });
        if (response.success) {
          if (response.data.reviews) {
            setComments(response.data.reviews);
            setTotalPages(response.data.pagination?.totalPages || 1);
            setTotalItems(response.data.pagination?.totalItems || 0);
          } else {
            setComments(response.data);
          }
        } else {
          setError("Failed to load comments");
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleViewComment = (comment) => {
    setSelectedComment(comment);
    setShowViewCommentModal(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    if (activeTab === "FAQs") {
      setShowAddFAQModal(true);
    } else if (activeTab === "Reviews") {
      setShowAddReviewModal(true);
    } else if (activeTab === "Comments") {
      setShowAddCommentModal(true);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    if (activeTab === "FAQs") {
      setShowAddFAQModal(true);
    } else if (activeTab === "Reviews") {
      setShowAddReviewModal(true);
    } else if (activeTab === "Comments") {
      setShowAddCommentModal(true);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      let response;
      if (activeTab === "FAQs") {
        response = await adminService.deleteFAQ(id);
      } else if (activeTab === "Reviews") {
        response = await adminService.deletePromotionalReview(id); // Add this line
      } else if (activeTab === "Comments") {
        response = await adminService.deleteReview(id);
      }

      if (response.success) {
        fetchData();
      } else {
        alert(response.message || "Failed to delete item");
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert("Failed to delete item");
    }
  };

  const handleSave = (data) => {
    if (activeTab === "FAQs") {
      setShowAddFAQModal(false);
    } else if (activeTab === "Reviews") {
      setShowAddReviewModal(false);
    } else if (activeTab === "Comments") {
      setShowAddCommentModal(false);
    }
    setEditingItem(null);
    fetchData();
  };

  const handleCloseModal = () => {
    setShowAddFAQModal(false);
    setShowAddReviewModal(false);
    setShowAddCommentModal(false);
    setEditingItem(null);
  };

  // Pagination component
  const Pagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
        </div>
        <div className="flex items-center space-x-1">
          <button 
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded-l-md bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            <ArrowLeft2 size="20" color="#6b7280" />
          </button>
          
          {[...Array(Math.min(totalPages, 10))].map((_, index) => {
            const pageNum = index + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 border-t border-b ${
                  currentPage === pageNum 
                    ? 'border-teal-600 bg-teal-100 text-teal-700' 
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button 
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded-r-md bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            <ArrowRight2 size="20" color="#6b7280" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout activeItem="Content">
      {/* Content Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => handleTabChange("FAQs")}
            className={`px-8 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "FAQs"
                ? "border-teal-600 text-teal-600 bg-gray-100"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            FAQs
          </button>
          <button
            onClick={() => handleTabChange("Reviews")}
            className={`px-8 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "Reviews"
                ? "border-teal-600 text-teal-600 bg-gray-100"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Reviews
          </button>
          <button
            onClick={() => handleTabChange("Comments")}
            className={`px-8 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "Comments"
                ? "border-teal-600 text-teal-600 bg-gray-100"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Comments
          </button>
        </div>
      </div>

      {/* Add New Button */}
      <div className="flex justify-end mb-6">
        <button 
          onClick={handleAdd}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
        >
          <Add size="16" color="#ffffff" />
          <span>
            Add New {activeTab === "FAQs" ? "Question" : activeTab === "Reviews" ? "Review" : "Comment"}
          </span>
        </button>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-medium text-teal-800">
            {activeTab === "FAQs" ? "FAQ" : activeTab === "Reviews" ? "Recent Reviews" : "Recent Comments"}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent w-96"
              />
              <SearchNormal1 size="16" color="#9ca3af" className="absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <span className="text-gray-500">Loading...</span>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-8">
            <span className="text-red-500">{error}</span>
          </div>
        ) : (
          <>
            {/* FAQ Table */}
            {activeTab === "FAQs" && (
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
                            {faq.translations?.en?.question || faq.question}
                          </div>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <div className="text-sm text-gray-600 line-clamp-3 max-w-4xl">
                            {faq.translations?.en?.answer || faq.answer}
                          </div>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleEdit(faq)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <Edit2 size="20" color="currentColor" />
                            </button>
                            <button
                              onClick={() => handleDelete(faq.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash size="20" color="currentColor" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Reviews Table */}
            {activeTab === "Reviews" && (
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                        Screen shot
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                        Review
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                        Client's name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 w-20"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {promotionalReviews.map((review) => (
                      <tr key={review.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 align-top">
                          <div className="w-16 h-10 bg-gray-200 rounded border overflow-hidden">
                            {review.screenshot_image_url ? (
                              <img
                                src={review.screenshot_image_url}
                                alt="Review screenshot"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-300"></div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <div className="text-sm text-gray-800 max-w-md">
                            {review.translations?.en || review.review_text ? 
                              (review.translations?.en || review.review_text).length > 100
                                ? `${(review.translations?.en || review.review_text).substring(0, 100)}...`
                                : (review.translations?.en || review.review_text)
                              : 'No review text'
                            }
                          </div>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <div className="text-sm font-medium text-gray-800">
                            {review.client_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <div className="text-sm text-gray-600">
                            {new Date(review.review_date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleEdit(review)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <Edit2 size="20" color="currentColor" />
                            </button>
                            <button
                              onClick={() => handleDelete(review.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash size="20" color="currentColor" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Comments Table */}
            {activeTab === "Comments" && (
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                        Tour Title
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                        City
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                        Comment
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                        Client's name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 w-20"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {comments.map((comment) => (
                      <tr key={comment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 align-top">
                          <div className="text-sm text-gray-900">
                            {comment.tour_title || 'Unknown Tour'}
                          </div>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <div className="text-sm text-gray-600">
                            {comment.city_name || 'Unknown City'}
                          </div>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <div className="text-sm text-gray-600">
                            Individual
                          </div>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <div className="text-sm text-gray-800 max-w-md">
                            {comment.comment ? 
                              comment.comment.length > 100
                                ? `${comment.comment.substring(0, 100)}...`
                                : comment.comment
                              : 'No comment'
                            }
                          </div>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <div className="text-sm font-medium text-gray-800">
                            {comment.client_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <div className="text-sm text-gray-600">
                            {new Date(comment.review_date || comment.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleViewComment(comment)}
                              className="text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <Eye size="20" color="currentColor" />
                            </button>
                            {/* <button
                              onClick={() => handleEdit(comment)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <Edit2 size="20" color="currentColor" />
                            </button> */}
                            <button
                              onClick={() => handleDelete(comment.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash size="20" color="currentColor" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <Pagination />
          </>
        )}
      </div>

      {/* Modals */}
      {showAddFAQModal && (
        <AddFAQModal
          onClose={handleCloseModal}
          onSave={handleSave}
          editFAQ={editingItem}
        />
      )}

      {showAddReviewModal && (
        <AddReviewModal
          onClose={handleCloseModal}
          onSave={handleSave}
          editReview={editingItem}
          isPromotional={true}
        />
      )}

      {showAddCommentModal && (
        <AddCommentModal
          onClose={handleCloseModal}
          onSave={handleSave}
          editComment={editingItem}
        />
      )}

      {showViewCommentModal && (
        <ViewCommentModal
          comment={selectedComment}
          onClose={() => {
            setShowViewCommentModal(false);
            setSelectedComment(null);
          }}
        />
      )}
    </AdminLayout>
  );
};

export default ContentManagement;
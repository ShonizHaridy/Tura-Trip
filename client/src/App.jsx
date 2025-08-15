// src/App.jsx - UPDATED VERSION
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React from 'react';
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext"; // Add this
import ProtectedRoute from "./utils/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

// Import all your existing components (unchanged)
import Header from "./components/Header";
import Footer from "./components/Footer";
import EdgeSocialMedia from "./components/EdgeSocialMedia";
import LeftScrollToTop from "./components/LeftScrollToTop";
import Home from "./pages/Home";
import About from "./pages/About";
import Payment from "./pages/Payment";
import Contact from "./pages/Contact";
import City from "./pages/City";
import TripDetail from "./pages/TripDetail";
import Security from "./pages/Security";
import BrowseTours from "./pages/BrowseTours";
import SearchResults from "./pages/SearchResults";

// Admin imports (unchanged)
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProfile from "./pages/admin/AdminProfile";
import ToursManagement from "./pages/admin/ToursManagement";
import CitiesManagement from "./pages/admin/CitiesManagement";
import ContentManagement from "./pages/admin/ContentManagement";
import AddTour from "./pages/admin/AddTour";
import EditTour from "./pages/admin/EditTour";
import ViewTour from "./pages/admin/ViewTour";
import CommissionSettings from "./pages/admin/CommissionSettings";

// Public layout wrapper
const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="payment" element={<Payment />} />
          <Route path="contact" element={<Contact />} />
          <Route path="security" element={<Security />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="browse-tours" element={<BrowseTours />} />
          <Route path="destination/:cityName" element={<City />} />
          <Route path="destination/:citySlug" element={<City />} />
          <Route path="destination/:cityName/:tripId" element={<TripDetail />} />
          <Route path="destination/:citySlug/:tripId" element={<TripDetail />} />
        </Routes>
      </main>
      <Footer />
      <EdgeSocialMedia />
      <LeftScrollToTop />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <LanguageProvider>
          <ScrollToTop />
          
          <Routes>
            {/* Admin Routes - NO language detection */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/profile" element={<ProtectedRoute><AdminProfile /></ProtectedRoute>} />
            <Route path="/admin/tours" element={<ProtectedRoute><ToursManagement /></ProtectedRoute>} />
            <Route path="/admin/tours/add" element={<ProtectedRoute><AddTour /></ProtectedRoute>} />
            <Route path="/admin/tours/edit/:id" element={<ProtectedRoute><EditTour /></ProtectedRoute>} />
            <Route path="/admin/tours/view/:id" element={<ProtectedRoute><ViewTour /></ProtectedRoute>} />
            <Route path="/admin/cities" element={<ProtectedRoute><CitiesManagement /></ProtectedRoute>} />
            <Route path="/admin/content" element={<ProtectedRoute><ContentManagement /></ProtectedRoute>} />
            <Route path="/admin/commission" element={<ProtectedRoute><CommissionSettings /></ProtectedRoute>} />

            {/* Language Routes */}
            <Route path="/en/*" element={<PublicLayout />} />
            <Route path="/it/*" element={<PublicLayout />} />
            <Route path="/de/*" element={<PublicLayout />} />
            
            {/* Russian Routes (no prefix) */}
            <Route path="/*" element={<PublicLayout />} />

            {/* Admin 404 */}
            <Route path="/admin/*" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Page Not Found</h1>
                    <p className="text-gray-600 mt-2">The admin page you're looking for doesn't exist.</p>
                    <a href="/admin/dashboard" className="text-teal-600 hover:text-teal-700 mt-4 inline-block">
                      Go to Dashboard
                    </a>
                  </div>
                </div>
              </ProtectedRoute>
            } />
          </Routes>
        </LanguageProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
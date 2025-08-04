// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Public pages
import Home from "./pages/Home";
import About from "./pages/About";
import Payment from "./pages/Payment";
import Contact from "./pages/Contact";
import City from "./pages/City";
import TripDetail from "./pages/TripDetail";
import Security from "./pages/Security";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProfile from "./pages/admin/AdminProfile";
import ToursManagement from "./pages/admin/ToursManagement";
import CitiesManagement from "./pages/admin/CitiesManagement";
import ContentManagement from "./pages/admin/ContentManagement";
import AddTour from "./pages/admin/AddTour";
import EditTour from "./pages/admin/EditTour";
import ViewTour from "./pages/admin/ViewTour";

import BrowseTours from "./pages/BrowseTours";


import SearchResults from "./pages/SearchResults";

import ScrollToTop from "./components/ScrollToTop";

import EdgeSocialMedia from "./components/EdgeScoialMedia"; 
import LeftScrollToTop from "./components/LeftScrollToTop";
import CommissionSettings from "./pages/admin/CommissionSettings";

// Admin route wrapper that redirects to login or dashboard
const AdminRoute = () => {
  return <Navigate to="/admin/dashboard" replace />;
};

// Login route wrapper that redirects to dashboard if authenticated
const LoginRoute = () => {
  return <AdminLogin />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop /> {/* Add this inside Router but outside Routes */}

        <Routes>
          {/* Admin Routes - No Header/Footer */}
          <Route path="/admin" element={<AdminRoute />} />
          <Route path="/admin/login" element={<LoginRoute />} />
          
          {/* Protected Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/profile" 
            element={
              <ProtectedRoute>
                <AdminProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/tours" 
            element={
              <ProtectedRoute>
                <ToursManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/tours/add" 
            element={
              <ProtectedRoute>
                <AddTour />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/tours/edit/:id" 
            element={
              <ProtectedRoute>
                <EditTour />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/tours/view/:id" 
            element={
              <ProtectedRoute>
                <ViewTour />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/cities" 
            element={
              <ProtectedRoute>
                <CitiesManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/content" 
            element={
              <ProtectedRoute>
                <ContentManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/commission" 
            element={
              <ProtectedRoute>
                <CommissionSettings />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/*" 
            element={
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
            } 
          />

          {/* Public Routes - With Header/Footer */}
          <Route
            path="/*"
            element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/security" element={<Security />} />
                    <Route path="/destination/:cityName" element={<City />} />
                    <Route path="/destination/:citySlug" element={<City />} />
                    <Route
                      path="/destination/:cityName/:tripId"
                      element={<TripDetail />}
                    />
                    <Route
                      path="/destination/:citySlug/:tripId"
                      element={<TripDetail />}
                    />

                    <Route path="/browse-tours" element={<BrowseTours />} />

                  </Routes>
                </main>
                <Footer />
                <EdgeSocialMedia />
                <LeftScrollToTop />
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
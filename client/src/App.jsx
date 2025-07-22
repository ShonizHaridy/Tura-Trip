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

          {/* Public Routes - With Header/Footer */}
          <Route
            path="/*"
            element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/security" element={<Security />} />
                    <Route path="/destination/:cityName" element={<City />} />
                    <Route
                      path="/destination/:cityName/:tripId"
                      element={<TripDetail />}
                    />
                  </Routes>
                </main>
                <Footer />
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
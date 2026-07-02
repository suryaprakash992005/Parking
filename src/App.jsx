import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import SearchPage from './pages/SearchPage';
import ParkingDetails from './pages/ParkingDetails';
import BookingFlow from './pages/BookingFlow';
import Dashboard from './pages/Dashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="flex min-h-screen flex-col bg-gray-950 font-sans text-gray-100 antialiased">
          <Navbar />
          
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/parking/:id" element={<ParkingDetails />} />
              <Route path="/booking-flow" element={<BookingFlow />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/owner-dashboard" element={<OwnerDashboard />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </div>

          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;

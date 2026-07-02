import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ParkingSquare, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Navbar() {
  const { role, setRole } = useApp();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setShowRoleDropdown(false);
    if (newRole === 'user') navigate('/dashboard');
    else if (newRole === 'owner') navigate('/owner-dashboard');
    else if (newRole === 'admin') navigate('/admin');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-500/25">
                <ParkingSquare className="h-5 w-5 stroke-[2]" />
              </div>
              <span className="font-outfit text-base font-extrabold tracking-wide text-gray-900 uppercase">
                Park<span className="text-blue-600">Ease</span>
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className={`text-xs font-bold tracking-wide transition-colors hover:text-gray-900 ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-500'}`}>
                Discover
              </Link>
              <Link to="/search" className={`text-xs font-bold tracking-wide transition-colors hover:text-gray-900 ${location.pathname === '/search' ? 'text-blue-600' : 'text-gray-500'}`}>
                Book Spot
              </Link>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            
            {/* Custom Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3 py-2 text-[10px] font-bold text-gray-700 hover:bg-gray-50 transition-all cursor-pointer shadow-sm"
              >
                <span>Portal: {role.toUpperCase()}</span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
              </button>

              <AnimatePresence>
                {showRoleDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 mt-2 w-44 rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl z-50"
                  >
                    <button
                      onClick={() => handleRoleChange('user')}
                      className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-[11px] font-bold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                      Driver Portal
                      {role === 'user' && <span className="h-2 w-2 rounded-full bg-blue-600" />}
                    </button>
                    <button
                      onClick={() => handleRoleChange('owner')}
                      className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-[11px] font-bold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                      Space Host
                      {role === 'owner' && <span className="h-2 w-2 rounded-full bg-blue-600" />}
                    </button>
                    <button
                      onClick={() => handleRoleChange('admin')}
                      className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-[11px] font-bold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                      Platform Admin
                      {role === 'admin' && <span className="h-2 w-2 rounded-full bg-blue-600" />}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Book Parking Link */}
            <Link
              to="/search"
              className="rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white transition-all shadow-sm shadow-blue-500/25"
            >
              Book Parking
            </Link>

          </div>
        </div>
      </div>
    </nav>
  );
}

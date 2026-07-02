import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ParkingSquare, Bell, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { role, setRole, notifications } = useApp();
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
    <nav className="sticky top-0 z-50 w-full border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-white text-black">
                <ParkingSquare className="h-4.5 w-4.5 stroke-[2.5]" />
              </div>
              <span className="font-outfit text-sm font-bold tracking-wider text-white uppercase">
                ParkEase
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className={`text-xs font-medium transition-colors hover:text-white ${location.pathname === '/' ? 'text-white' : 'text-neutral-400'}`}>
                Overview
              </Link>
              <Link to="/search" className={`text-xs font-medium transition-colors hover:text-white ${location.pathname === '/search' ? 'text-white' : 'text-neutral-400'}`}>
                Explore Slots
              </Link>
            </div>
          </div>

          {/* Actions & Simulator Dropdown */}
          <div className="flex items-center gap-4">
            
            {/* Custom Role Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-1.5 rounded border border-neutral-800 bg-neutral-900/40 px-3 py-1.5 text-[10px] font-semibold text-neutral-350 hover:bg-neutral-800 transition-all cursor-pointer"
              >
                <span>Console: {role.toUpperCase()}</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              <AnimatePresence>
                {showRoleDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 mt-2 w-44 rounded border border-neutral-800 bg-neutral-950 p-1 shadow-2xl z-50"
                  >
                    <button
                      onClick={() => handleRoleChange('user')}
                      className="flex w-full items-center justify-between rounded px-2.5 py-2 text-[11px] font-medium text-neutral-400 hover:bg-neutral-900 hover:text-white transition-colors"
                    >
                      Driver Portal
                      {role === 'user' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                    </button>
                    <button
                      onClick={() => handleRoleChange('owner')}
                      className="flex w-full items-center justify-between rounded px-2.5 py-2 text-[11px] font-medium text-neutral-400 hover:bg-neutral-900 hover:text-white transition-colors"
                    >
                      Space Host
                      {role === 'owner' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                    </button>
                    <button
                      onClick={() => handleRoleChange('admin')}
                      className="flex w-full items-center justify-between rounded px-2.5 py-2 text-[11px] font-medium text-neutral-400 hover:bg-neutral-900 hover:text-white transition-colors"
                    >
                      Platform Admin
                      {role === 'admin' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Ghost secondary trigger */}
            <Link
              to="/search"
              className="rounded bg-white hover:bg-neutral-250 px-3.5 py-1.5 text-[11px] font-semibold text-black transition-all"
            >
              Reserve Parking
            </Link>

          </div>
        </div>
      </div>
    </nav>
  );
}

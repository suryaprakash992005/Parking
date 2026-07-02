import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ParkingSquare, Bell, User, Check, LogOut, ChevronDown, Activity, Settings, UserCheck, ShieldAlert } from 'lucide-react';

export default function Navbar() {
  const { role, setRole, notifications, setNotifications } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setShowRoleDropdown(false);
    if (newRole === 'user') navigate('/dashboard');
    else if (newRole === 'owner') navigate('/owner-dashboard');
    else if (newRole === 'admin') navigate('/admin');
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const isDashboardRoute = location.pathname.includes('dashboard') || location.pathname === '/admin';

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-800/80 bg-gray-950/70 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white transition-all duration-300 group-hover:bg-blue-500 group-hover:scale-105 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                <ParkingSquare className="h-6 w-6" />
              </div>
              <span className="font-outfit text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors duration-300">
                Park<span className="text-blue-500">Ease</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`text-sm font-medium transition-colors hover:text-white ${location.pathname === '/' ? 'text-white' : 'text-gray-400'}`}>
              Home
            </Link>
            <Link to="/search" className={`text-sm font-medium transition-colors hover:text-white ${location.pathname === '/search' ? 'text-white' : 'text-gray-400'}`}>
              Find Parking
            </Link>
            {role === 'user' && (
              <Link to="/dashboard" className={`text-sm font-medium transition-colors hover:text-white ${location.pathname === '/dashboard' ? 'text-white' : 'text-gray-400'}`}>
                User Panel
              </Link>
            )}
            {role === 'owner' && (
              <Link to="/owner-dashboard" className={`text-sm font-medium transition-colors hover:text-white ${location.pathname === '/owner-dashboard' ? 'text-white' : 'text-gray-400'}`}>
                Owner Panel
              </Link>
            )}
            {role === 'admin' && (
              <Link to="/admin" className={`text-sm font-medium transition-colors hover:text-white ${location.pathname === '/admin' ? 'text-white' : 'text-gray-400'}`}>
                Admin Panel
              </Link>
            )}
          </div>

          {/* Actions & Dropdowns */}
          <div className="flex items-center gap-4">
            
            {/* Simulation Role Pill Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-1.5 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-400 hover:bg-blue-500/20 transition-all duration-300"
              >
                <span>Role: {role.charAt(0).toUpperCase() + role.slice(1)}</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-800 bg-gray-900 p-1.5 shadow-2xl animate-fade-in">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Switch Simulator View
                  </div>
                  <button
                    onClick={() => handleRoleChange('user')}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-400" /> Driver (User)
                    </span>
                    {role === 'user' && <Check className="h-3.5 w-3.5 text-blue-500" />}
                  </button>
                  <button
                    onClick={() => handleRoleChange('owner')}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-purple-400" /> Space Owner
                    </span>
                    {role === 'owner' && <Check className="h-3.5 w-3.5 text-purple-500" />}
                  </button>
                  <button
                    onClick={() => handleRoleChange('admin')}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 text-rose-400" /> Platform Admin
                    </span>
                    {role === 'admin' && <Check className="h-3.5 w-3.5 text-rose-500" />}
                  </button>
                </div>
              )}
            </div>

            {/* Notification Icon */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileDropdown(false);
                }}
                className="relative rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors duration-300"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-gray-800 bg-gray-900 shadow-2xl p-1 z-50">
                  <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
                    <h3 className="font-semibold text-sm text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-xs text-blue-400 hover:text-blue-300">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-xs text-gray-500">No notifications yet.</p>
                    ) : (
                      notifications.map(item => (
                        <div key={item.id} className={`p-3 border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${item.read ? 'opacity-60' : 'bg-blue-500/[0.02]'}`}>
                          <div className="flex items-start justify-between">
                            <span className="text-xs font-semibold text-white">{item.title}</span>
                            <span className="text-[10px] text-gray-500">{item.time}</span>
                          </div>
                          <p className="mt-1 text-xs text-gray-400 leading-relaxed">{item.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileDropdown(!showProfileDropdown);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-900 p-1.5 hover:bg-gray-800 transition-colors duration-300"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-semibold text-xs">
                  A
                </div>
                <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-gray-400" />
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-800 bg-gray-900 p-1.5 shadow-2xl z-50">
                  <div className="px-3 py-2 border-b border-gray-800/80 mb-1">
                    <div className="text-xs font-semibold text-white">Alex Morgan</div>
                    <div className="text-[10px] text-gray-500">alex.morgan@parkease.io</div>
                  </div>
                  <Link to="/dashboard" onClick={() => setShowProfileDropdown(false)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white">
                    <User className="h-4 w-4" /> My Profile
                  </Link>
                  <Link to="/owner-dashboard" onClick={() => setShowProfileDropdown(false)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white">
                    <Settings className="h-4 w-4" /> Settings
                  </Link>
                  <button onClick={() => { handleRoleChange('user'); setShowProfileDropdown(false); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white border-t border-gray-800/50 mt-1">
                    <LogOut className="h-4 w-4 text-rose-500" /> Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Premium CTA (Book parking) */}
            <Link
              to="/search"
              className="hidden sm:inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-blue-500 hover:scale-102 hover:shadow-blue-500/25 active:scale-98"
            >
              Book Parking
            </Link>

          </div>
        </div>
      </div>
    </nav>
  );
}

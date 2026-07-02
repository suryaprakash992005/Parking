import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import { 
  CalendarDays, History, MapPin, User, CreditCard, LifeBuoy,
  TrendingUp, Award, Clock, ArrowRight, XCircle, Heart, Star,
  Smartphone, Eye, HelpCircle, Mail, Phone, ExternalLink, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const { bookings, cancelBooking, savedLocations, parkingLots, toggleSaveLocation } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeTab = searchParams.get('tab') || 'overview';

  // Modal QR state
  const [activeQRBooking, setActiveQRBooking] = useState(null);

  // Time remaining simulation for Active Booking
  const [timeRemaining, setTimeRemaining] = useState('01:45:20');

  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate decrementing seconds
      setTimeRemaining(prev => {
        const parts = prev.split(':').map(Number);
        let s = parts[2];
        let m = parts[1];
        let h = parts[0];

        s -= 1;
        if (s < 0) {
          s = 59;
          m -= 1;
          if (m < 0) {
            m = 59;
            h -= 1;
          }
        }
        if (h < 0) return '00:00:00';
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Filtered Bookings
  const upcomingBookings = useMemo(() => bookings.filter(b => b.status === 'Upcoming'), [bookings]);
  const pastBookings = useMemo(() => bookings.filter(b => b.status === 'Completed' || b.status === 'Cancelled'), [bookings]);

  // Saved Lots Details
  const savedLots = useMemo(() => {
    return parkingLots.filter(lot => savedLocations.includes(lot.id));
  }, [parkingLots, savedLocations]);

  // Tab: Overview Render
  const renderOverview = () => {
    const activeBooking = upcomingBookings[0];
    
    return (
      <div className="space-y-6">
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-gray-850 bg-gray-900/30 p-5">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Bookings</span>
            <div className="text-2xl font-bold text-white mt-1">{bookings.length}</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1.5 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +12% this month
            </div>
          </div>
          <div className="rounded-2xl border border-gray-850 bg-gray-900/30 p-5">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Saved Places</span>
            <div className="text-2xl font-bold text-white mt-1">{savedLocations.length}</div>
            <div className="text-[10px] text-gray-500 mt-1.5">Favorite lots</div>
          </div>
          <div className="rounded-2xl border border-gray-850 bg-gray-900/30 p-5">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Parking Hours</span>
            <div className="text-2xl font-bold text-white mt-1">42 hrs</div>
            <div className="text-[10px] text-gray-550 mt-1.5">Aggregated drive duration</div>
          </div>
          <div className="rounded-2xl border border-gray-850 bg-gray-900/30 p-5">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Loyalty Level</span>
            <div className="text-2xl font-bold text-blue-400 mt-1 flex items-center gap-1.5">
              <Award className="h-5 w-5" /> Gold
            </div>
            <div className="text-[10px] text-gray-500 mt-1.5">380 points to Platinum</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Active / Upcoming Bookings panel */}
          <div className="lg:col-span-8 space-y-4">
            <h3 className="font-outfit text-base font-bold text-white">Active Reservations</h3>
            
            {!activeBooking ? (
              <div className="rounded-2xl border border-dashed border-gray-800 bg-gray-900/10 p-8 text-center">
                <p className="text-xs text-gray-500">No active bookings. Ready to secure your parking slot?</p>
                <button
                  onClick={() => navigate('/search')}
                  className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold hover:bg-blue-500 transition-colors"
                >
                  Book Parking Spot
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-blue-500/20 bg-blue-950/10 p-6 flex flex-col justify-between space-y-4 relative overflow-hidden backdrop-blur-sm">
                
                {/* Neon Pulsating glow line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600" />
                
                <div className="flex justify-between items-start">
                  <div>
                    <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[9px] font-bold tracking-wider text-blue-400 uppercase">
                      Upcoming Pass
                    </span>
                    <h4 className="text-lg font-bold text-white mt-2">{activeBooking.lotName}</h4>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                      <MapPin className="h-3.5 w-3.5 text-gray-600" /> Slot {activeBooking.slotId} • Plate {activeBooking.vehiclePlate}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 block">Time to Arrival</span>
                    <div className="text-lg font-mono font-bold text-blue-400 mt-1 flex items-center gap-1.5 justify-end">
                      <Clock className="h-4 w-4" /> {timeRemaining}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-850 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-gray-400">
                    <div>Arrival: <strong className="text-white">{activeBooking.date} at {activeBooking.time}</strong></div>
                    <div className="mt-1">Duration: <strong className="text-white">{activeBooking.duration} Hours</strong></div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveQRBooking(activeBooking)}
                      className="flex items-center gap-1.5 rounded-xl border border-gray-800 bg-gray-900 px-3.5 py-2 text-xs font-semibold text-gray-300 hover:text-white"
                    >
                      <Smartphone className="h-3.5 w-3.5" /> View QR Pass
                    </button>
                    <button
                      onClick={() => cancelBooking(activeBooking.id)}
                      className="flex items-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/20"
                    >
                      <XCircle className="h-3.5 w-3.5" /> Cancel Spot
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Saved places Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="font-outfit text-base font-bold text-white">Favorite Places</h3>
            {savedLots.length === 0 ? (
              <p className="text-xs text-gray-500 bg-gray-900/20 border border-gray-900 rounded-2xl p-6 text-center">
                Starred places will show up here.
              </p>
            ) : (
              <div className="space-y-3">
                {savedLots.map(lot => (
                  <div key={lot.id} className="rounded-xl border border-gray-850 bg-gray-900/20 p-3.5 flex items-center justify-between hover:border-gray-700 transition-colors">
                    <div className="space-y-1">
                      <span className="font-semibold text-xs text-white block">{lot.name}</span>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {lot.distance} • ₹{lot.price}/hr
                      </span>
                    </div>
                    <button
                      onClick={() => navigate(`/parking/${lot.id}`)}
                      className="rounded-lg bg-gray-900 p-2 text-gray-400 hover:text-white border border-gray-800"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    );
  };

  // Tab: Bookings
  const renderBookings = () => {
    return (
      <div className="space-y-4">
        <h3 className="font-outfit text-lg font-bold">Upcoming Bookings</h3>
        {upcomingBookings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-800 bg-gray-900/10 p-12 text-center">
            <p className="text-xs text-gray-500">No upcoming bookings schedule.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingBookings.map(b => (
              <div key={b.id} className="rounded-2xl border border-gray-800 bg-gray-900/40 p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-sm text-white">{b.lotName}</h4>
                    <span className="rounded bg-blue-600/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 text-[9px] font-bold">
                      {b.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-2 space-y-1 font-mono">
                    <div>BAY: <strong className="text-white">{b.slotId}</strong></div>
                    <div>DATE: {b.date} • {b.time}</div>
                    <div>PLATE: {b.vehiclePlate}</div>
                  </div>
                </div>

                <div className="flex gap-2 border-t border-gray-850 pt-3 mt-1 justify-end">
                  <button
                    onClick={() => setActiveQRBooking(b)}
                    className="px-3 py-1.5 bg-gray-800 text-gray-300 hover:text-white rounded-lg text-xs font-semibold"
                  >
                    View Ticket
                  </button>
                  <button
                    onClick={() => cancelBooking(b.id)}
                    className="px-3 py-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg text-xs font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Tab: History
  const renderHistory = () => {
    return (
      <div className="space-y-4">
        <h3 className="font-outfit text-lg font-bold">Booking History</h3>
        {pastBookings.length === 0 ? (
          <p className="text-xs text-gray-500">No previous checkout records found.</p>
        ) : (
          <div className="rounded-2xl border border-gray-800 bg-gray-900/20 overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-950 border-b border-gray-800 text-gray-400 font-semibold">
                  <th className="p-4">Location</th>
                  <th className="p-4">Slot</th>
                  <th className="p-4">Plate</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-850">
                {pastBookings.map(b => (
                  <tr key={b.id} className="hover:bg-gray-900/30">
                    <td className="p-4 font-semibold text-white">{b.lotName}</td>
                    <td className="p-4 font-mono">{b.slotId}</td>
                    <td className="p-4 font-mono">{b.vehiclePlate}</td>
                    <td className="p-4 text-gray-400">{b.date} • {b.time}</td>
                    <td className="p-4 text-emerald-400 font-bold">₹{b.amount}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${b.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-gray-800 text-gray-500'}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  // Tab: Saved Locations
  const renderSaved = () => {
    return (
      <div className="space-y-4">
        <h3 className="font-outfit text-lg font-bold">Saved Locations</h3>
        {savedLots.length === 0 ? (
          <p className="text-xs text-gray-500">No saved locations yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedLots.map(lot => (
              <div key={lot.id} className="rounded-2xl border border-gray-800 bg-gray-900/30 p-5 flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-sm text-white">{lot.name}</h4>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-gray-500 shrink-0" /> {lot.address}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleSaveLocation(lot.id)}
                    className="p-2 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500/20"
                  >
                    <Heart className="h-4 w-4 fill-rose-500" />
                  </button>
                  <button
                    onClick={() => navigate(`/parking/${lot.id}`)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs"
                  >
                    Reserve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Tab: Profile
  const renderProfile = () => {
    return (
      <div className="max-w-xl space-y-6">
        <h3 className="font-outfit text-lg font-bold">Driver Profile</h3>
        <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white font-bold text-xl shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              AM
            </div>
            <div>
              <h4 className="font-semibold text-white">Alex Morgan</h4>
              <p className="text-xs text-gray-400">Driver License Class: D (Standard)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-850">
            <div>
              <span className="text-[10px] text-gray-500 uppercase block font-bold">Primary Vehicle</span>
              <span className="text-xs font-semibold text-white block mt-1">Tesla Model Y (Electric Blue)</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 uppercase block font-bold">License Plate</span>
              <span className="text-xs font-mono font-semibold text-white block mt-1">NY-K408L</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Tab: Payments
  const renderPayments = () => {
    return (
      <div className="space-y-6">
        <h3 className="font-outfit text-lg font-bold">Payment History</h3>
        <div className="rounded-2xl border border-gray-850 bg-gray-900/20 overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-950 border-b border-gray-850 text-gray-400">
                <th className="p-4">Invoice ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Description</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-850">
              {pastBookings.map(b => (
                <tr key={b.id} className="hover:bg-gray-900/10">
                  <td className="p-4 font-mono font-semibold">INV-{b.id.toUpperCase()}</td>
                  <td className="p-4 text-gray-400">{b.date}</td>
                  <td className="p-4 text-gray-300">Parking Spot Booking ({b.lotName})</td>
                  <td className="p-4 flex items-center gap-1.5 text-gray-400 mt-2">
                    <CreditCard className="h-3.5 w-3.5" /> Visa •••• 4010
                  </td>
                  <td className="p-4 text-emerald-400 font-bold">₹{b.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Tab: Support
  const renderSupport = () => {
    return (
      <div className="max-w-xl space-y-6">
        <h3 className="font-outfit text-lg font-bold">Help & Support</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-gray-850 bg-gray-900/30 p-5">
            <h4 className="font-semibold text-sm text-white flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-500" /> Email Support
            </h4>
            <p className="text-xs text-gray-500 mt-2">Open a ticket and get replies under 2 hours.</p>
            <a href="mailto:support@parkease.io" className="text-xs text-blue-400 font-semibold inline-flex items-center gap-1 mt-3 hover:text-blue-300">
              support@parkease.io <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="rounded-2xl border border-gray-850 bg-gray-900/30 p-5">
            <h4 className="font-semibold text-sm text-white flex items-center gap-2">
              <Phone className="h-4 w-4 text-emerald-500" /> Phone Support
            </h4>
            <p className="text-xs text-gray-500 mt-2">24/7 Hotline for gate scan failures.</p>
            <a href="tel:+18005557275" className="text-xs text-emerald-400 font-semibold inline-flex items-center gap-1 mt-3 hover:text-emerald-300">
              1-800-555-PARK (7275)
            </a>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'bookings': return renderBookings();
      case 'history': return renderHistory();
      case 'saved': return renderSaved();
      case 'profile': return renderProfile();
      case 'payments': return renderPayments();
      case 'support': return renderSupport();
      default: return renderOverview();
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-950 text-white min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8">
        
        {/* Dynamic header depending on activeTab */}
        <div className="border-b border-gray-900 pb-5 mb-6 flex justify-between items-center">
          <div>
            <h2 className="font-outfit text-2xl font-bold capitalize">{activeTab === 'overview' ? 'Driver Dashboard' : activeTab.replace('-', ' ')}</h2>
            <p className="text-xs text-gray-500 mt-1">Manage active spots, license plates, and loyalty points.</p>
          </div>
        </div>

        {renderContent()}

      </main>

      {/* Modal QR code dialog popup */}
      <AnimatePresence>
        {activeQRBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl border border-gray-800 bg-gray-900 p-6 text-center space-y-6"
            >
              <h3 className="font-outfit text-base font-bold text-white">QR Entry Ticket</h3>
              <div className="flex justify-center p-4 bg-white rounded-2xl border border-gray-250 inline-block mx-auto relative overflow-hidden">
                <svg className="h-44 w-44 text-gray-950" viewBox="0 0 100 100" fill="currentColor">
                  <rect x="5" y="5" width="20" height="20" />
                  <rect x="9" y="9" width="12" height="12" fill="white" />
                  <rect x="75" y="5" width="20" height="20" />
                  <rect x="79" y="9" width="12" height="12" fill="white" />
                  <rect x="5" y="75" width="20" height="20" />
                  <rect x="9" y="79" width="12" height="12" fill="white" />
                  
                  <rect x="35" y="15" width="5" height="10" />
                  <rect x="45" y="5" width="10" height="5" />
                  <rect x="60" y="20" width="5" height="15" />
                  <rect x="15" y="35" width="10" height="5" />
                  <rect x="40" y="45" width="15" height="15" />
                  <rect x="70" y="50" width="10" height="5" />
                  <rect x="15" y="55" width="5" height="10" />
                  <rect x="45" y="75" width="10" height="10" />
                  <rect x="75" y="75" width="10" height="10" />
                </svg>
                {/* scanline */}
                <div className="absolute left-0 right-0 h-0.5 bg-blue-500 animate-[bounce_2.5s_infinite]" style={{ top: '15%' }} />
              </div>

              <div className="text-left text-xs font-mono bg-gray-950 p-4 border border-gray-850 rounded-xl space-y-1">
                <div>PASS ID: {activeQRBooking.id}</div>
                <div>LOT: {activeQRBooking.lotName}</div>
                <div>BAY: {activeQRBooking.slotId}</div>
                <div>VEHICLE PLATE: {activeQRBooking.vehiclePlate}</div>
              </div>

              <button
                onClick={() => setActiveQRBooking(null)}
                className="w-full rounded-xl bg-gray-800 text-gray-300 py-2.5 text-xs font-semibold hover:text-white"
              >
                Close Ticket
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

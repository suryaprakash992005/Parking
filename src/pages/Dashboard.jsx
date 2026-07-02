import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import { 
  MapPin, Clock, ArrowRight, XCircle, Smartphone, Mail, Phone, ExternalLink, CreditCard, Award, TrendingUp, Calendar
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
      setTimeRemaining(prev => {
        const parts = prev.split(':').map(Number);
        let s = parts[2] - 1;
        let m = parts[1];
        let h = parts[0];

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

  const upcomingBookings = useMemo(() => bookings.filter(b => b.status === 'Upcoming'), [bookings]);
  const pastBookings = useMemo(() => bookings.filter(b => b.status === 'Completed' || b.status === 'Cancelled'), [bookings]);
  const savedLots = useMemo(() => parkingLots.filter(lot => savedLocations.includes(lot.id)), [parkingLots, savedLocations]);

  // Total spending calculation
  const totalSpending = useMemo(() => {
    return bookings
      .filter(b => b.status === 'Completed')
      .reduce((sum, b) => sum + b.amount, 0);
  }, [bookings]);

  const renderOverview = () => {
    const activeBooking = upcomingBookings[0];
    
    return (
      <div className="space-y-8">
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-1">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Total Spending</span>
            <div className="text-2xl font-bold text-gray-950 font-outfit">₹{totalSpending || 320}</div>
            <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" /> +12% this month
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-1">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Saved Places</span>
            <div className="text-2xl font-bold text-gray-950 font-outfit">{savedLocations.length}</div>
            <div className="text-[10px] text-gray-500">Favorite complexes</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-1">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Total Hours</span>
            <div className="text-2xl font-bold text-gray-950 font-outfit">42 hrs</div>
            <div className="text-[10px] text-gray-500">Accumulated checks</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-1">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Reward Rank</span>
            <div className="text-2xl font-bold text-blue-600 font-outfit flex items-center gap-1">
              <Award className="h-5 w-5" /> Gold
            </div>
            <div className="text-[10px] text-gray-500">380 pts to Platinum</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Active Reservations */}
          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Current Allocation</h3>
            
            {!activeBooking ? (
              <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center bg-white">
                <p className="text-xs text-gray-550">No active bookings detected in your registry.</p>
                <button
                  onClick={() => navigate('/search')}
                  className="mt-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-xs font-bold transition-all cursor-pointer shadow-sm shadow-blue-500/25"
                >
                  Book Parking Spot
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md space-y-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600" />
                
                <div className="flex justify-between items-start">
                  <div>
                    <span className="rounded bg-blue-50 border border-blue-100 px-2.5 py-0.5 text-[9px] font-bold text-blue-600 uppercase tracking-widest">
                      Confirmed Entry Pass
                    </span>
                    <h4 className="text-base font-extrabold text-gray-900 mt-4">{activeBooking.lotName}</h4>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1.5">
                      <MapPin className="h-4 w-4 text-gray-450 shrink-0" /> Bay {activeBooking.slotId} • Plate {activeBooking.vehiclePlate}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Time to Expiry</span>
                    <div className="text-base font-mono font-bold text-blue-600 mt-1 flex items-center gap-1.5 justify-end">
                      <Clock className="h-4 w-4" /> {timeRemaining}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-[11px] text-gray-500 space-y-1 font-mono">
                    <div>ARRIVAL: {activeBooking.date} at {activeBooking.time}</div>
                    <div>DURATION: {activeBooking.duration} Hours</div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveQRBooking(activeBooking)}
                      className="rounded-xl border border-gray-300 bg-white hover:bg-gray-50 px-4 py-2 text-xs font-bold text-gray-700 cursor-pointer shadow-sm"
                    >
                      <Smartphone className="h-4 w-4 mr-1.5 inline" /> Scan QR Pass
                    </button>
                    <button
                      onClick={() => cancelBooking(activeBooking.id)}
                      className="rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 px-4 py-2 text-xs font-bold text-rose-600 cursor-pointer"
                    >
                      Cancel Spot
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Favorites List */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Starred Facilities</h3>
            {savedLots.length === 0 ? (
              <p className="text-xs text-gray-500 bg-white p-6 rounded-2xl border border-gray-200 text-center">
                Starred places will list here.
              </p>
            ) : (
              <div className="space-y-3">
                {savedLots.map(lot => (
                  <div key={lot.id} className="rounded-2xl border border-gray-200 bg-white p-4 flex items-center justify-between hover:border-gray-300 transition-all shadow-sm">
                    <div>
                      <span className="font-bold text-xs text-gray-900 block">{lot.name}</span>
                      <span className="text-[10px] text-gray-500 mt-1 block">
                        {lot.distance} • ₹{lot.price}/hr
                      </span>
                    </div>
                    <button
                      onClick={() => navigate(`/parking/${lot.id}`)}
                      className="rounded-xl bg-gray-50 p-2 text-gray-500 hover:text-gray-900 border border-gray-200 cursor-pointer hover:bg-gray-100"
                    >
                      <ArrowRight className="h-4 w-4" />
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

  const renderBookings = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-455">Upcoming Reservations</h3>
        {upcomingBookings.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
            <p className="text-xs text-gray-500">No active bookings schedule.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingBookings.map(b => (
              <div key={b.id} className="rounded-2xl border border-gray-200 bg-white p-5 flex flex-col justify-between space-y-4 shadow-sm">
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-xs text-gray-900">{b.lotName}</h4>
                    <span className="rounded bg-blue-50 border border-blue-100 px-2 py-0.5 text-[9px] font-bold text-blue-600 uppercase tracking-widest">
                      {b.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 mt-3 space-y-1 font-mono">
                    <div>BAY: <strong className="text-gray-900">{b.slotId}</strong></div>
                    <div>SCHEDULE: {b.date} • {b.time}</div>
                    <div>PLATE: {b.vehiclePlate}</div>
                  </div>
                </div>

                <div className="flex gap-2 border-t border-gray-150 pt-3 mt-1 justify-end">
                  <button
                    onClick={() => setActiveQRBooking(b)}
                    className="px-3.5 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    View Ticket
                  </button>
                  <button
                    onClick={() => cancelBooking(b.id)}
                    className="px-3.5 py-2 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold cursor-pointer"
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

  const renderHistory = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-455">Parking Logs History</h3>
        {pastBookings.length === 0 ? (
          <p className="text-xs text-gray-500">No previous check-in records detected.</p>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider text-[9px]">
                  <th className="p-4">Location Complex</th>
                  <th className="p-4">Bay</th>
                  <th className="p-4">Plate</th>
                  <th className="p-4">Arrival</th>
                  <th className="p-4">Charge Paid</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-650">
                {pastBookings.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-bold text-gray-900">{b.lotName}</td>
                    <td className="p-4 font-mono text-[11px]">{b.slotId}</td>
                    <td className="p-4 font-mono text-[11px] uppercase">{b.vehiclePlate}</td>
                    <td className="p-4 text-gray-400">{b.date} • {b.time}</td>
                    <td className="p-4 text-gray-950 font-bold">₹{b.amount}</td>
                    <td className="p-4">
                      <span className={`rounded border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${b.status === 'Completed' ? 'border-gray-200 bg-gray-50 text-gray-500' : 'border-rose-100 bg-rose-50 text-rose-500'}`}>
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

  const renderSaved = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-455">Saved Locations</h3>
        {savedLots.length === 0 ? (
          <p className="text-xs text-gray-500">No saved locations yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedLots.map(lot => (
              <div key={lot.id} className="rounded-2xl border border-gray-200 bg-white p-5 flex justify-between items-center shadow-sm">
                <div>
                  <h4 className="font-bold text-xs text-gray-900">{lot.name}</h4>
                  <p className="text-xs text-gray-550 mt-1 flex items-center gap-1">
                    {lot.address}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleSaveLocation(lot.id)}
                    className="p-2 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 rounded-lg cursor-pointer"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => navigate(`/parking/${lot.id}`)}
                    className="px-3.5 py-2 btn-consumer-primary rounded-lg text-xs font-bold cursor-pointer"
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

  const renderProfile = () => {
    return (
      <div className="max-w-xl space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-455">Identity Profile</h3>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-600 font-bold text-sm">
              AM
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Alex Morgan</h4>
              <p className="text-xs text-gray-500">License Class: D (Standard)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-150 text-xs">
            <div>
              <span className="text-[9px] text-gray-400 uppercase block font-bold">Registered Vehicle</span>
              <span className="text-xs font-bold text-gray-900 block mt-1">Tesla Model Y (Silver Metallic)</span>
            </div>
            <div>
              <span className="text-[9px] text-gray-400 uppercase block font-bold">Plate Code</span>
              <span className="text-xs font-mono font-bold text-gray-900 block mt-1">NY-K408L</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPayments = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-455">Payments Ledger</h3>
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-450 font-bold uppercase tracking-wider text-[9px]">
                <th className="p-4">Invoice ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Description</th>
                <th className="p-4">Method</th>
                <th className="p-4">Charge Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-650">
              {pastBookings.map(b => (
                <tr key={b.id} className="hover:bg-gray-50/50">
                  <td className="p-4 font-mono text-[11px] font-bold">INV-{b.id.toUpperCase()}</td>
                  <td className="p-4 text-gray-400">{b.date}</td>
                  <td className="p-4 text-gray-600">Bay reservation booking ({b.lotName})</td>
                  <td className="p-4 flex items-center gap-1.5 text-gray-500 mt-2 font-mono">
                    <CreditCard className="h-4 w-4" /> Card •••• 4010
                  </td>
                  <td className="p-4 text-gray-950 font-bold">₹{b.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderSupport = () => {
    return (
      <div className="max-w-xl space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Help & Support Console</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-3 shadow-sm">
            <h4 className="font-bold text-xs text-gray-900 uppercase tracking-wider">Email Assistance</h4>
            <p className="text-xs text-gray-500">Contact operators regarding terminal billing or scanner faults.</p>
            <a href="mailto:support@parkease.io" className="text-xs text-blue-600 font-bold inline-flex items-center gap-1 hover:underline">
              support@parkease.io <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-3 shadow-sm">
            <h4 className="font-bold text-xs text-gray-900 uppercase tracking-wider">Direct Hotline</h4>
            <p className="text-xs text-gray-500">Direct gate emergency dispatch and check-in failures.</p>
            <a href="tel:+18005557275" className="text-xs text-blue-600 font-bold inline-flex items-center gap-1 hover:underline">
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
    <div className="flex flex-col md:flex-row bg-[#FAFAFA] text-gray-800 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8">
        
        <div className="border-b border-gray-200 pb-5 mb-8 flex justify-between items-center">
          <div>
            <h2 className="font-outfit text-xl font-bold uppercase tracking-wider text-gray-900">
              {activeTab === 'overview' ? 'Driver Operations Console' : activeTab.replace('-', ' ')}
            </h2>
            <p className="text-xs text-gray-550 mt-1">Manage active parking reservations, payment history, and profile specifications.</p>
          </div>
        </div>

        {renderContent()}

      </main>

      {/* Modal QR Code */}
      <AnimatePresence>
        {activeQRBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="w-full max-w-xs rounded-3xl border border-gray-200 bg-white p-6 text-center space-y-6 shadow-2xl"
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">Entry QR Code</h3>
              <div className="flex justify-center p-4 bg-white rounded-xl border border-gray-200 inline-block mx-auto shadow-inner">
                <svg className="h-40 w-40 text-black" viewBox="0 0 100 100" fill="currentColor">
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
              </div>

              <div className="text-left text-[10px] font-mono bg-gray-50 border border-gray-200 p-4 rounded-xl space-y-1 text-gray-600 shadow-inner">
                <div>TICKET_ID: {activeQRBooking.id}</div>
                <div>BAY_CODE: {activeQRBooking.slotId}</div>
                <div>PLATE_REF: {activeQRBooking.vehiclePlate}</div>
              </div>

              <button
                onClick={() => setActiveQRBooking(null)}
                className="w-full rounded-xl bg-gray-900 text-white py-2.5 text-xs font-bold hover:bg-gray-800 cursor-pointer shadow-md"
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

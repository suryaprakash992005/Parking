import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import { 
  MapPin, Clock, ArrowRight, XCircle, Smartphone, Mail, Phone, ExternalLink, CreditCard
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

  const renderOverview = () => {
    const activeBooking = upcomingBookings[0];
    
    return (
      <div className="space-y-8">
        
        {/* Simple Monochrome Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Reservations', value: bookings.length, desc: 'All platform records' },
            { label: 'Saved Locations', value: savedLocations.length, desc: 'Starred spots' },
            { label: 'Aggregated Duration', value: '42 hrs', desc: 'Total check-in time' },
            { label: 'Loyalty Class', value: 'Gold tier', desc: '380 pts to Platinum' }
          ].map((stat, idx) => (
            <div key={idx} className="rounded-xl border border-neutral-900 bg-neutral-950 p-6 space-y-1">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-neutral-500">{stat.label}</span>
              <div className="text-xl font-bold text-white font-outfit">{stat.value}</div>
              <div className="text-[10px] text-neutral-500">{stat.desc}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Active Bookings */}
          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-neutral-400">Active Allocations</h3>
            
            {!activeBooking ? (
              <div className="rounded-xl border border-dashed border-neutral-800 bg-neutral-950 p-12 text-center">
                <p className="text-xs text-neutral-500">No active bookings detected in your registry.</p>
                <button
                  onClick={() => navigate('/search')}
                  className="mt-4 rounded bg-white text-black px-4.5 py-2 text-xs font-bold transition-all cursor-pointer"
                >
                  Explore Vacant Slots
                </button>
              </div>
            ) : (
              <div className="rounded-xl border border-neutral-900 bg-neutral-950 p-6 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="rounded border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-[9px] font-extrabold tracking-widest text-neutral-400 uppercase">
                      Access Pass
                    </span>
                    <h4 className="text-base font-bold text-white mt-4">{activeBooking.lotName}</h4>
                    <p className="text-xs text-neutral-500 flex items-center gap-1.5 mt-1.5">
                      <MapPin className="h-4 w-4 text-neutral-600" /> Bay {activeBooking.slotId} • Plate {activeBooking.vehiclePlate}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-neutral-500 block">Time to Expiry</span>
                    <div className="text-base font-mono font-bold text-white mt-1">
                      {timeRemaining}
                    </div>
                  </div>
                </div>

                <div className="border-t border-neutral-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-[11px] text-neutral-400 font-mono space-y-1">
                    <div>ARRIVAL: {activeBooking.date} at {activeBooking.time}</div>
                    <div>DURATION: {activeBooking.duration} Hours</div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveQRBooking(activeBooking)}
                      className="rounded border border-neutral-850 bg-neutral-900 hover:bg-neutral-800 px-4 py-2 text-xs font-bold text-white cursor-pointer"
                    >
                      Verify QR Code
                    </button>
                    <button
                      onClick={() => cancelBooking(activeBooking.id)}
                      className="rounded border border-neutral-900 hover:border-rose-900/25 px-4 py-2 text-xs font-bold text-rose-500 transition-colors cursor-pointer"
                    >
                      Release Spot
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Favorites List */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-neutral-400">Saved Facilities</h3>
            {savedLots.length === 0 ? (
              <p className="text-xs text-neutral-500 bg-neutral-950 p-6 rounded-xl border border-neutral-900 text-center">
                Starred places will list here.
              </p>
            ) : (
              <div className="space-y-3">
                {savedLots.map(lot => (
                  <div key={lot.id} className="rounded-xl border border-neutral-900 bg-neutral-950 p-4 flex items-center justify-between hover:border-neutral-800 transition-all">
                    <div>
                      <span className="font-bold text-xs text-white block">{lot.name}</span>
                      <span className="text-[10px] text-neutral-500 mt-1 block">
                        {lot.distance} • ₹{lot.price}/hr
                      </span>
                    </div>
                    <button
                      onClick={() => navigate(`/parking/${lot.id}`)}
                      className="rounded bg-neutral-900 p-2 text-neutral-400 hover:text-white border border-neutral-850 cursor-pointer"
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
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-neutral-450">Scheduled Bookings</h3>
        {upcomingBookings.length === 0 ? (
          <div className="rounded-xl border border-neutral-900 bg-neutral-950 p-12 text-center">
            <p className="text-xs text-neutral-500">No active bookings schedule.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingBookings.map(b => (
              <div key={b.id} className="rounded-xl border border-neutral-900 bg-neutral-950 p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-xs text-white">{b.lotName}</h4>
                    <span className="rounded border border-neutral-800 bg-neutral-900 px-2 py-0.5 text-[9px] font-extrabold tracking-widest text-neutral-400 uppercase">
                      {b.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-3 space-y-1 font-mono">
                    <div>BAY: <strong className="text-white">{b.slotId}</strong></div>
                    <div>SCHEDULE: {b.date} • {b.time}</div>
                    <div>PLATE: {b.vehiclePlate}</div>
                  </div>
                </div>

                <div className="flex gap-2 border-t border-neutral-900 pt-3 mt-1 justify-end">
                  <button
                    onClick={() => setActiveQRBooking(b)}
                    className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 rounded text-xs font-bold cursor-pointer"
                  >
                    View Token
                  </button>
                  <button
                    onClick={() => cancelBooking(b.id)}
                    className="px-3.5 py-2 text-rose-500 hover:bg-rose-950/10 rounded text-xs font-bold cursor-pointer"
                  >
                    Release
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
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-neutral-450">Usage Ledger</h3>
        {pastBookings.length === 0 ? (
          <p className="text-xs text-neutral-500">No previous check-in records detected.</p>
        ) : (
          <div className="rounded-xl border border-neutral-900 bg-neutral-950 overflow-hidden shadow-2xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-900/60 border-b border-neutral-900 text-neutral-500 font-extrabold uppercase tracking-wider text-[9px]">
                  <th className="p-4">Facility</th>
                  <th className="p-4">Bay</th>
                  <th className="p-4">Vehicle Plate</th>
                  <th className="p-4">Schedule</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900 text-neutral-300">
                {pastBookings.map(b => (
                  <tr key={b.id} className="hover:bg-neutral-900/10">
                    <td className="p-4 font-bold text-white">{b.lotName}</td>
                    <td className="p-4 font-mono text-[11px]">{b.slotId}</td>
                    <td className="p-4 font-mono text-[11px] uppercase">{b.vehiclePlate}</td>
                    <td className="p-4 text-neutral-500">{b.date} • {b.time}</td>
                    <td className="p-4 text-white font-bold">₹{b.amount}</td>
                    <td className="p-4">
                      <span className={`rounded border px-2.5 py-0.5 text-[9px] font-extrabold tracking-wider uppercase ${b.status === 'Completed' ? 'border-neutral-800 bg-neutral-900 text-neutral-400' : 'border-neutral-900 text-neutral-600'}`}>
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
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-neutral-450">Saved Infrastructure</h3>
        {savedLots.length === 0 ? (
          <p className="text-xs text-neutral-500">No saved locations yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedLots.map(lot => (
              <div key={lot.id} className="rounded-xl border border-neutral-900 bg-neutral-950 p-5 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-xs text-white">{lot.name}</h4>
                  <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
                    {lot.address}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleSaveLocation(lot.id)}
                    className="p-2 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-rose-500 rounded cursor-pointer"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => navigate(`/parking/${lot.id}`)}
                    className="px-3.5 py-2 bg-white hover:bg-neutral-200 text-black font-bold rounded text-xs cursor-pointer"
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
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-neutral-450">Identity Profile</h3>
        <div className="rounded-xl border border-neutral-900 bg-neutral-950 p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded bg-neutral-900 border border-neutral-800 text-white font-bold text-sm">
              AM
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Alex Morgan</h4>
              <p className="text-xs text-neutral-500">License Class: D (Standard)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-900 text-xs">
            <div>
              <span className="text-[9px] text-neutral-500 uppercase block font-bold">Registered Vehicle</span>
              <span className="text-xs font-bold text-white block mt-1">Tesla Model Y (Titanium Silver)</span>
            </div>
            <div>
              <span className="text-[9px] text-neutral-500 uppercase block font-bold">Plate Number</span>
              <span className="text-xs font-mono font-bold text-white block mt-1">NY-K408L</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPayments = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-neutral-450">Transaction History</h3>
        <div className="rounded-xl border border-neutral-900 bg-neutral-950 overflow-hidden shadow-2xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-900/60 border-b border-neutral-900 text-neutral-550 font-extrabold uppercase tracking-wider text-[9px]">
                <th className="p-4">Ledger ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Description</th>
                <th className="p-4">Method</th>
                <th className="p-4">Charge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900 text-neutral-300">
              {pastBookings.map(b => (
                <tr key={b.id} className="hover:bg-neutral-900/10">
                  <td className="p-4 font-mono text-[11px] font-bold">LGR-{b.id.toUpperCase()}</td>
                  <td className="p-4 text-neutral-550">{b.date}</td>
                  <td className="p-4 text-neutral-400">Bay reservation booking ({b.lotName})</td>
                  <td className="p-4 flex items-center gap-1.5 text-neutral-500 mt-2 font-mono">
                    <CreditCard className="h-4 w-4" /> Card •••• 4010
                  </td>
                  <td className="p-4 text-white font-bold">₹{b.amount}</td>
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
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-neutral-400">Help & Documentation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-neutral-900 bg-neutral-950 p-5 space-y-3">
            <h4 className="font-bold text-xs text-white uppercase tracking-wider">Email Dispatch</h4>
            <p className="text-xs text-neutral-500">Contact operators regarding terminal billing or scanner faults.</p>
            <a href="mailto:support@parkease.io" className="text-xs text-white font-bold inline-flex items-center gap-1 hover:underline">
              support@parkease.io <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="rounded-xl border border-neutral-900 bg-neutral-950 p-5 space-y-3">
            <h4 className="font-bold text-xs text-white uppercase tracking-wider">Hotline Console</h4>
            <p className="text-xs text-neutral-500">Direct gate emergency dispatch and check-in failures.</p>
            <a href="tel:+18005557275" className="text-xs text-white font-bold inline-flex items-center gap-1 hover:underline">
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
    <div className="flex flex-col md:flex-row bg-[#0A0A0A] text-white min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8">
        
        <div className="border-b border-neutral-900 pb-5 mb-8 flex justify-between items-center">
          <div>
            <h2 className="font-outfit text-xl font-bold uppercase tracking-wider">{activeTab === 'overview' ? 'Driver Operations Console' : activeTab.replace('-', ' ')}</h2>
            <p className="text-xs text-neutral-500 mt-1">Manage active infrastructure allocations and invoices.</p>
          </div>
        </div>

        {renderContent()}

      </main>

      {/* Modal QR Code */}
      <AnimatePresence>
        {activeQRBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="w-full max-w-xs rounded-xl border border-neutral-900 bg-neutral-950 p-6 text-center space-y-6"
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Signed QR Pass</h3>
              <div className="flex justify-center p-4 bg-white rounded border border-neutral-200 inline-block mx-auto">
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

              <div className="text-left text-[10px] font-mono bg-neutral-900 border border-neutral-850 p-4 rounded space-y-1">
                <div>PASS_ID: {activeQRBooking.id}</div>
                <div>BAY_REF: {activeQRBooking.slotId}</div>
                <div>PLATE_NUM: {activeQRBooking.vehiclePlate}</div>
              </div>

              <button
                onClick={() => setActiveQRBooking(null)}
                className="w-full rounded bg-white text-black py-2.5 text-xs font-bold hover:bg-neutral-200 cursor-pointer"
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

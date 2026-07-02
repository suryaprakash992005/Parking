import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import { 
  Building, PlusCircle, BarChart3, CalendarDays, Users, Bell,
  Settings, DollarSign, Activity, Percent, ToggleLeft, ShieldCheck,
  CheckCircle, Plus, Eye, Edit2, AlertCircle, RefreshCw, Star
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  BarChart, Bar, CartesianGrid, Legend
} from 'recharts';

export default function OwnerDashboard() {
  const { parkingLots, bookings, addParkingLot, updateSlotStatus, verifyParkingLot } = useApp();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  // Owner Mock Identity (owner-1 manages Downown Smart Haven and Plaza Covered Deck)
  const OWNER_ID = 'owner-1';

  // State: Add Lot Form
  const [newLotName, setNewLotName] = useState('');
  const [newLotAddress, setNewLotAddress] = useState('');
  const [newLotPrice, setNewLotPrice] = useState(4.00);
  const [newLotSlots, setNewLotSlots] = useState(8);
  const [newLotFeatures, setNewLotFeatures] = useState({
    covered: true,
    open: false,
    evCharging: false,
    cctv: true,
    valet: false
  });
  const [lotSuccessMsg, setLotSuccessMsg] = useState('');

  // State: Add Slot Form
  const [selectedLotId, setSelectedLotId] = useState(parkingLots[0]?.id || '');
  const [newSlotLabel, setNewSlotLabel] = useState('');
  const [newSlotType, setNewSlotType] = useState('Standard');
  const [slotSuccessMsg, setSlotSuccessMsg] = useState('');

  // Derived datasets
  const myLots = useMemo(() => {
    return parkingLots.filter(lot => lot.ownerId === OWNER_ID);
  }, [parkingLots]);

  const myBookings = useMemo(() => {
    const lotIds = myLots.map(l => l.id);
    return bookings.filter(b => lotIds.includes(b.lotId));
  }, [bookings, myLots]);

  // Analytics Metrics
  const metrics = useMemo(() => {
    let totalRevenue = 0;
    let activeReservationsCount = 0;
    let totalSlots = 0;
    let occupiedSlots = 0;

    myLots.forEach(lot => {
      totalSlots += lot.slots.length;
      lot.slots.forEach(s => {
        if (s.status === 'Occupied' || s.status === 'Reserved') {
          occupiedSlots += 1;
        }
      });
    });

    myBookings.forEach(b => {
      if (b.status === 'Upcoming') {
        activeReservationsCount += 1;
      }
      if (b.status !== 'Cancelled') {
        totalRevenue += b.amount;
      }
    });

    return {
      revenue: totalRevenue,
      activeBookings: activeReservationsCount,
      occupancyRate: totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0,
      totalSlots,
      freeSlots: totalSlots - occupiedSlots
    };
  }, [myLots, myBookings]);

  // Chart datasets
  const revenueChartData = [
    { name: 'Mon', revenue: 120 },
    { name: 'Tue', revenue: 190 },
    { name: 'Wed', revenue: 150 },
    { name: 'Thu', revenue: 240 },
    { name: 'Fri', revenue: 310 },
    { name: 'Sat', revenue: 420 },
    { name: 'Sun', revenue: 380 }
  ];

  const occupancyTrendData = [
    { time: '08:00', rate: 30 },
    { time: '10:00', rate: 65 },
    { time: '12:00', rate: 85 },
    { time: '14:00', rate: 70 },
    { time: '16:00', rate: 60 },
    { time: '18:00', rate: 75 },
    { time: '20:00', rate: 45 }
  ];

  // Handlers
  const handleCreateLotSubmit = (e) => {
    e.preventDefault();
    if (!newLotName.trim() || !newLotAddress.trim()) return;

    addParkingLot({
      name: newLotName,
      address: newLotAddress,
      price: parseFloat(newLotPrice),
      totalSlots: parseInt(newLotSlots),
      features: newLotFeatures,
      ownerId: OWNER_ID,
      image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80'
    });

    setNewLotName('');
    setNewLotAddress('');
    setLotSuccessMsg('New parking lot listed successfully! Awaiting verification.');
    setTimeout(() => setLotSuccessMsg(''), 4000);
  };

  const handleCreateSlotSubmit = (e) => {
    e.preventDefault();
    if (!newSlotLabel.trim()) return;

    // Simulate adding slot to list in state
    updateSlotStatus(selectedLotId, newSlotLabel, 'Available');
    setNewSlotLabel('');
    setSlotSuccessMsg(`Slot ${newSlotLabel} created successfully!`);
    setTimeout(() => setSlotSuccessMsg(''), 4000);
  };

  // Tab: Overview
  const renderOverview = () => {
    return (
      <div className="space-y-6">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-gray-850 bg-gray-900/30 p-5">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Weekly Revenue</span>
            <div className="text-2xl font-bold text-emerald-450 mt-1">₹{metrics.revenue + 45000}</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1.5 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +18.4% vs last week
            </div>
          </div>
          <div className="rounded-2xl border border-gray-850 bg-gray-900/30 p-5">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Active Bookings</span>
            <div className="text-2xl font-bold text-white mt-1">{metrics.activeBookings}</div>
            <div className="text-[10px] text-gray-500 mt-1.5">Scheduled spot access</div>
          </div>
          <div className="rounded-2xl border border-gray-850 bg-gray-900/30 p-5">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Occupancy Rate</span>
            <div className="text-2xl font-bold text-blue-400 mt-1">{metrics.occupancyRate}%</div>
            <div className="text-[10px] text-gray-500 mt-1.5">Average slots filled</div>
          </div>
          <div className="rounded-2xl border border-gray-850 bg-gray-900/30 p-5">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Empty Spaces</span>
            <div className="text-2xl font-bold text-white mt-1">{metrics.freeSlots} slots</div>
            <div className="text-[10px] text-gray-500 mt-1.5">Out of {metrics.totalSlots} total bays</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue chart */}
          <div className="rounded-2xl border border-gray-850 bg-gray-900/30 p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-white">Daily Revenue Flow ($)</h3>
              <span className="text-[10px] font-bold text-gray-500 uppercase">Weekly View</span>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueChartData}>
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={10} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151' }} />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Occupancy Chart */}
          <div className="rounded-2xl border border-gray-850 bg-gray-900/30 p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-white">Occupancy Distribution Curve (%)</h3>
              <span className="text-[10px] font-bold text-gray-500 uppercase">Hourly Peak</span>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={occupancyTrendData}>
                  <XAxis dataKey="time" stroke="#6b7280" fontSize={10} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151' }} />
                  <Area type="monotone" dataKey="rate" stroke="#8b5cf6" fill="rgba(139, 92, 246, 0.1)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    );
  };

  // Tab: Lots
  const renderLots = () => {
    return (
      <div className="space-y-6">
        
        {/* Lot Form Dialog (Collapse/inline) */}
        <div className="rounded-2xl border border-gray-850 bg-gray-900/30 p-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">List a New Parking Lot</h3>
          
          <form onSubmit={handleCreateLotSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="text-[10px] text-gray-500 uppercase block">Lot / Property Name</label>
              <input
                type="text"
                placeholder="Downtown Corporate Park"
                value={newLotName}
                onChange={(e) => setNewLotName(e.target.value)}
                className="w-full rounded-xl border border-gray-850 bg-gray-950 px-3 py-2 text-xs text-white focus:outline-none mt-1"
                required
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase block">Address</label>
              <input
                type="text"
                placeholder="20 Pine St"
                value={newLotAddress}
                onChange={(e) => setNewLotAddress(e.target.value)}
                className="w-full rounded-xl border border-gray-850 bg-gray-950 px-3 py-2 text-xs text-white focus:outline-none mt-1"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 py-2.5 text-xs font-semibold text-white transition-colors"
              >
                <Plus className="h-4 w-4" /> Add Lot
              </button>
            </div>
          </form>

          {lotSuccessMsg && (
            <p className="text-xs text-emerald-400 mt-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
              {lotSuccessMsg}
            </p>
          )}
        </div>

        {/* Existing Lots list */}
        <div className="space-y-4">
          <h3 className="font-outfit text-base font-bold text-white">Your Listed Lots</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myLots.map(lot => (
              <div key={lot.id} className="rounded-2xl border border-gray-850 bg-gray-900/40 p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-base text-white">{lot.name}</h4>
                    <p className="text-xs text-gray-400 mt-1">{lot.address}</p>
                  </div>

                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${lot.verified ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'}`}>
                    {lot.verified ? 'Verified' : 'Pending Verification'}
                  </span>
                </div>

                <div className="border-t border-gray-850 pt-3 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-gray-500 block">Pricing / Hour</span>
                    <strong className="text-white mt-1 block">₹{lot.price}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Total slots</span>
                    <strong className="text-white mt-1 block">{lot.slots.length} bays</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-500 block">Occupied / Reserved</span>
                    <strong className="text-blue-400 mt-1 block">
                      {lot.slots.filter(s => s.status !== 'Available').length} slots
                    </strong>
                  </div>
                </div>

                {/* Slots Live status controls */}
                <div className="pt-3 border-t border-gray-850">
                  <span className="text-[10px] text-gray-500 uppercase block font-bold mb-2">Live Slot Toggles</span>
                  <div className="grid grid-cols-4 gap-2">
                    {lot.slots.map(slot => {
                      const isOccupied = slot.status === 'Occupied';
                      return (
                        <button
                          key={slot.id}
                          onClick={() => updateSlotStatus(lot.id, slot.id, isOccupied ? 'Available' : 'Occupied')}
                          className={`p-1.5 text-[10px] font-mono rounded text-center border font-bold transition-all ${
                            isOccupied 
                              ? 'bg-rose-950/20 border-rose-900/40 text-rose-400' 
                              : 'bg-gray-850 border-gray-800 text-gray-400 hover:border-gray-700'
                          }`}
                        >
                          {slot.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    );
  };

  // Tab: Add Slot
  const renderAddSlot = () => {
    return (
      <div className="max-w-md space-y-6">
        <h3 className="font-outfit text-lg font-bold">Configure Parking Slots</h3>
        
        <form onSubmit={handleCreateSlotSubmit} className="rounded-2xl border border-gray-850 bg-gray-900/30 p-6 space-y-4">
          <div>
            <label className="text-[10px] text-gray-500 uppercase block">Select Lot</label>
            <select
              value={selectedLotId}
              onChange={(e) => setSelectedLotId(e.target.value)}
              className="w-full rounded-xl border border-gray-850 bg-gray-950 px-3 py-2 text-xs text-white focus:outline-none mt-1"
            >
              {myLots.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-gray-500 uppercase block">Slot Label / Number</label>
            <input
              type="text"
              placeholder="e.g. C-05"
              value={newSlotLabel}
              onChange={(e) => setNewSlotLabel(e.target.value)}
              className="w-full rounded-xl border border-gray-850 bg-gray-950 px-3 py-2 text-xs text-white focus:outline-none mt-1 font-mono uppercase"
              required
            />
          </div>

          <div>
            <label className="text-[10px] text-gray-500 uppercase block">Bay Type</label>
            <select
              value={newSlotType}
              onChange={(e) => setNewSlotType(e.target.value)}
              className="w-full rounded-xl border border-gray-850 bg-gray-950 px-3 py-2 text-xs text-white focus:outline-none mt-1"
            >
              <option value="Standard">Standard Space</option>
              <option value="EV-Charging">EV Charging Dock</option>
              <option value="Disabled">Accessible (Disabled) Space</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 py-2.5 text-xs font-semibold text-white transition-colors"
          >
            Create New Spot
          </button>
        </form>

        {slotSuccessMsg && (
          <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
            {slotSuccessMsg}
          </p>
        )}
      </div>
    );
  };

  // Tab: Bookings
  const renderBookings = () => {
    return (
      <div className="space-y-4">
        <h3 className="font-outfit text-lg font-bold">Incoming Reservations</h3>
        {myBookings.length === 0 ? (
          <p className="text-xs text-gray-500">No driver reservations registered yet.</p>
        ) : (
          <div className="rounded-2xl border border-gray-850 bg-gray-900/20 overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-950 border-b border-gray-800 text-gray-400 font-semibold">
                  <th className="p-4">Lot</th>
                  <th className="p-4">Bay</th>
                  <th className="p-4">Plate</th>
                  <th className="p-4">Schedule</th>
                  <th className="p-4">Expected Net</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-850">
                {myBookings.map(b => (
                  <tr key={b.id} className="hover:bg-gray-900/30">
                    <td className="p-4 font-semibold text-white">{b.lotName}</td>
                    <td className="p-4 font-mono">{b.slotId}</td>
                    <td className="p-4 font-mono">{b.vehiclePlate}</td>
                    <td className="p-4 text-gray-400">{b.date} at {b.time}</td>
                    <td className="p-4 text-emerald-400 font-bold">₹{b.amount}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${b.status === 'Upcoming' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'bg-gray-800 text-gray-500'}`}>
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

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'lots': return renderLots();
      case 'add-slot': return renderAddSlot();
      case 'bookings': return renderBookings();
      default: return renderOverview();
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-950 text-white min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8">
        
        <div className="border-b border-gray-900 pb-5 mb-6 flex justify-between items-center">
          <div>
            <h2 className="font-outfit text-2xl font-bold capitalize">Owner Dashboard</h2>
            <p className="text-xs text-gray-500 mt-1">Manage parking properties, configure bays, and track revenue flows.</p>
          </div>
        </div>

        {renderContent()}

      </main>
    </div>
  );
}

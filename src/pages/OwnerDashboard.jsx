import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import { 
  Building, PlusCircle, BarChart3, CalendarDays, Users, Bell,
  Settings, DollarSign, Activity, Percent, ArrowUpRight
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  BarChart, Bar
} from 'recharts';

export default function OwnerDashboard() {
  const { parkingLots, bookings, addParkingLot, updateSlotStatus } = useApp();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const OWNER_ID = 'owner-1';

  // State: Add Lot Form
  const [newLotName, setNewLotName] = useState('');
  const [newLotAddress, setNewLotAddress] = useState('');
  const [newLotPrice, setNewLotPrice] = useState(120);
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
  const myLots = useMemo(() => parkingLots.filter(lot => lot.ownerId === OWNER_ID), [parkingLots]);
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

  const revenueChartData = [
    { name: 'Mon', revenue: 1400 },
    { name: 'Tue', revenue: 2100 },
    { name: 'Wed', revenue: 1800 },
    { name: 'Thu', revenue: 2900 },
    { name: 'Fri', revenue: 3200 },
    { name: 'Sat', revenue: 4600 },
    { name: 'Sun', revenue: 4100 }
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
    setLotSuccessMsg('Facility inventory listed. Awaiting gateway validation.');
    setTimeout(() => setLotSuccessMsg(''), 4000);
  };

  const handleCreateSlotSubmit = (e) => {
    e.preventDefault();
    if (!newSlotLabel.trim()) return;

    updateSlotStatus(selectedLotId, newSlotLabel, 'Available');
    setNewSlotLabel('');
    setSlotSuccessMsg(`Bay ${newSlotLabel} registered.`);
    setTimeout(() => setSlotSuccessMsg(''), 4000);
  };

  const renderOverview = () => {
    return (
      <div className="space-y-8">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-1 shadow-sm">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Revenue Streams</span>
            <div className="text-2xl font-bold text-gray-950 font-outfit">₹{metrics.revenue + 45000}</div>
            <div className="text-[10px] text-emerald-650 font-bold flex items-center gap-1">
              <ArrowUpRight className="h-3.5 w-3.5" /> +18.4% this week
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-1 shadow-sm">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Active Accesses</span>
            <div className="text-2xl font-bold text-gray-950 font-outfit">{metrics.activeBookings}</div>
            <div className="text-[10px] text-gray-500">Live vehicle check-ins</div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-1 shadow-sm">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Occupancy Coefficient</span>
            <div className="text-2xl font-bold text-gray-950 font-outfit">{metrics.occupancyRate}%</div>
            <div className="text-[10px] text-gray-500">Average filled bays</div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-1 shadow-sm">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Empty Bays</span>
            <div className="text-2xl font-bold text-gray-950 font-outfit">{metrics.freeSlots} slots</div>
            <div className="text-[10px] text-gray-500">Out of {metrics.totalSlots} total bays</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-550">Weekly Earnings yield</h3>
              <span className="text-[9px] font-mono text-gray-400 uppercase">Gross Flow</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueChartData}>
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} tickLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }} />
                  <Bar dataKey="revenue" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-550">Peak Occupancy Telemetry</h3>
              <span className="text-[9px] font-mono text-gray-400 uppercase">Hourly coefficients</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={occupancyTrendData}>
                  <XAxis dataKey="time" stroke="#9ca3af" fontSize={10} tickLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }} />
                  <Area type="monotone" dataKey="rate" stroke="#10B981" fill="rgba(16,185,129,0.06)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    );
  };

  const renderLots = () => {
    return (
      <div className="space-y-8">
        
        {/* Create Lot Form */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-450">List New Complex Property</h3>
          
          <form onSubmit={handleCreateLotSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="text-[10px] text-gray-400 font-bold uppercase block">Complex Designation</label>
              <input
                type="text"
                placeholder="Downtown Corporate Park"
                value={newLotName}
                onChange={(e) => setNewLotName(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 text-xs text-gray-800 focus:outline-none focus:border-blue-500 focus:bg-white mt-1"
                required
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-bold uppercase block">Complex Coordinates</label>
              <input
                type="text"
                placeholder="20 Pine St"
                value={newLotAddress}
                onChange={(e) => setNewLotAddress(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 text-xs text-gray-800 focus:outline-none focus:border-blue-500 focus:bg-white mt-1"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 text-white py-2 text-xs font-bold cursor-pointer hover:bg-blue-750 shadow-sm"
              >
                List Property
              </button>
            </div>
          </form>

          {lotSuccessMsg && (
            <p className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-250 rounded-xl p-3">
              {lotSuccessMsg}
            </p>
          )}
        </div>

        {/* Existing Lots */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-450">Active Infrastructure Properties</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myLots.map(lot => (
              <div key={lot.id} className="rounded-2xl border border-gray-200 bg-white p-6 space-y-6 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">{lot.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{lot.address}</p>
                  </div>

                  <span className={`rounded-full border px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider ${lot.verified ? 'border-emerald-200 bg-emerald-50 text-emerald-600' : 'border-gray-200 bg-gray-50 text-gray-500'}`}>
                    {lot.verified ? 'Verified' : 'Validation Pending'}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-xs font-mono text-gray-550">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase block font-sans font-bold">Base Rate</span>
                    <strong className="text-gray-900 block mt-1">₹{lot.price}/hr</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase block font-sans font-bold">Total Bays</span>
                    <strong className="text-gray-900 block mt-1">{lot.slots.length} Units</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 uppercase block font-sans font-bold">Occupancy</span>
                    <strong className="text-gray-900 block mt-1">
                      {lot.slots.filter(s => s.status !== 'Available').length} filled
                    </strong>
                  </div>
                </div>

                {/* Slots Live status toggling */}
                <div className="pt-4 border-t border-gray-100">
                  <span className="text-[9px] text-gray-400 uppercase block font-bold mb-3">Live Bay Telemetry Toggles</span>
                  <div className="grid grid-cols-4 gap-2">
                    {lot.slots.map(slot => {
                      const isOccupied = slot.status === 'Occupied';
                      return (
                        <button
                          key={slot.id}
                          onClick={() => updateSlotStatus(lot.id, slot.id, isOccupied ? 'Available' : 'Occupied')}
                          className={`p-1.5 text-[10px] font-mono rounded-lg text-center border font-bold transition-all cursor-pointer ${
                            isOccupied 
                              ? 'bg-rose-50 border-rose-200 text-rose-600' 
                              : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
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

  const renderAddSlot = () => {
    return (
      <div className="max-w-md space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-450">Deploy New Unit Bays</h3>
        
        <form onSubmit={handleCreateSlotSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4 shadow-sm">
          <div>
            <label className="text-[10px] text-gray-400 font-bold uppercase block">Select Facility Complex</label>
            <select
              value={selectedLotId}
              onChange={(e) => setSelectedLotId(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 focus:bg-white mt-1 cursor-pointer"
            >
              {myLots.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-gray-400 font-bold uppercase block">Bay Code Designation</label>
            <input
              type="text"
              placeholder="e.g. C-05"
              value={newSlotLabel}
              onChange={(e) => setNewSlotLabel(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 focus:bg-white mt-1 font-mono uppercase"
              required
            />
          </div>

          <div>
            <label className="text-[10px] text-gray-400 font-bold uppercase block">Space Specifications</label>
            <select
              value={newSlotType}
              onChange={(e) => setNewSlotType(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 focus:bg-white mt-1 cursor-pointer"
            >
              <option value="Standard">Standard Space</option>
              <option value="EV-Charging">EV Charging Station</option>
              <option value="Disabled">Accessible Space</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 text-white py-2.5 text-xs font-bold transition-all cursor-pointer hover:bg-blue-750 shadow-sm"
          >
            Deploy Space
          </button>
        </form>

        {slotSuccessMsg && (
          <p className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-250 rounded-xl p-3">
            {slotSuccessMsg}
          </p>
        )}
      </div>
    );
  };

  const renderBookings = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-450">Incoming Reservations</h3>
        {myBookings.length === 0 ? (
          <p className="text-xs text-gray-500">No driver reservations registered yet.</p>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider text-[9px]">
                  <th className="p-4">Facility</th>
                  <th className="p-4">Bay</th>
                  <th className="p-4">Plate</th>
                  <th className="p-4">Arrival</th>
                  <th className="p-4">Yield amount</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-650">
                {myBookings.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-bold text-gray-900">{b.lotName}</td>
                    <td className="p-4 font-mono text-[11px]">{b.slotId}</td>
                    <td className="p-4 font-mono text-[11px] uppercase">{b.vehiclePlate}</td>
                    <td className="p-4 text-gray-400">{b.date} at {b.time}</td>
                    <td className="p-4 text-emerald-600 font-bold">₹{b.amount}</td>
                    <td className="p-4">
                      <span className="rounded-full bg-blue-50 border border-blue-100 px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase text-blue-600">
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
    <div className="flex flex-col md:flex-row bg-[#FAFAFA] text-gray-800 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8">
        
        <div className="border-b border-gray-200 pb-5 mb-8 flex justify-between items-center">
          <div>
            <h2 className="font-outfit text-xl font-bold uppercase tracking-wider text-gray-900 font-extrabold">Space Owner Portal</h2>
            <p className="text-xs text-gray-550 mt-1">Configure asset capacity, view occupancy analytics, and trace revenue streams.</p>
          </div>
        </div>

        {renderContent()}

      </main>
    </div>
  );
}

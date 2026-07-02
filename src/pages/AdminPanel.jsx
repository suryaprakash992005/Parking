import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import { 
  ShieldCheck, ShieldAlert, BarChart3, CalendarDays, Users, Check,
  AlertTriangle, DollarSign, Ban, Trash2, Landmark, RefreshCw
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function AdminPanel() {
  const { parkingLots, bookings, verifyParkingLot, deleteParkingLot } = useApp();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  // State: Fraud Alert Log
  const [fraudAlerts, setFraudAlerts] = useState([
    { id: 1, type: 'Duplicate Scan', message: 'QR Code for booking pe-bk-7740 scanned twice within 5 mins.', target: 'Slot A-04', severity: 'High', timestamp: '12 mins ago' },
    { id: 2, type: 'Overstay Limit', message: 'Vehicle NY-L9283 has exceeded booked duration by 45 minutes.', target: 'Plaza Covered Deck (P-02)', severity: 'Medium', timestamp: '34 mins ago' },
    { id: 3, type: 'Invalid Access', message: 'Gate barrier attempted force bypass without scan.', target: 'Downtown Smart Haven', severity: 'Critical', timestamp: '1 hr ago' }
  ]);

  // Derived datasets
  const pendingLots = useMemo(() => {
    return parkingLots.filter(lot => !lot.verified);
  }, [parkingLots]);

  const verifiedLots = useMemo(() => {
    return parkingLots.filter(lot => lot.verified);
  }, [parkingLots]);

  // Aggregated analytics
  const adminStats = useMemo(() => {
    let grossValue = 0;
    bookings.forEach(b => {
      if (b.status !== 'Cancelled') {
        grossValue += b.amount;
      }
    });

    const commissionRate = 0.15; // 15% Platform commission
    const platformRevenue = grossValue * commissionRate;

    return {
      totalBookings: bookings.length,
      grossValue,
      platformRevenue,
      commissionRate: 15,
      partnersCount: parkingLots.length
    };
  }, [bookings, parkingLots]);

  const monthlyGrowthData = [
    { month: 'Jan', gross: 4200, commission: 630 },
    { month: 'Feb', gross: 5600, commission: 840 },
    { month: 'Mar', gross: 7800, commission: 1170 },
    { month: 'Apr', gross: 9100, commission: 1365 },
    { month: 'May', gross: 12500, commission: 1875 },
    { month: 'Jun', gross: 16000, commission: 2400 }
  ];

  const handleDismissFraud = (id) => {
    setFraudAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  // Tab: Overview
  const renderOverview = () => {
    return (
      <div className="space-y-6">
        
        {/* Metric panels */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-gray-850 bg-gray-900/30 p-5">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Gross Booking Value</span>
            <div className="text-2xl font-bold text-white mt-1">₹{adminStats.grossValue + 870000}</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1.5">+24% vs last quarter</div>
          </div>
          <div className="rounded-2xl border border-gray-850 bg-gray-900/30 p-5">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Platform Take-rate (15%)</span>
            <div className="text-2xl font-bold text-blue-400 mt-1">₹{adminStats.platformRevenue + 130500}</div>
            <div className="text-[10px] text-gray-555 mt-1.5">Net platform commission</div>
          </div>
          <div className="rounded-2xl border border-gray-850 bg-gray-900/30 p-5">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Partner Sites</span>
            <div className="text-2xl font-bold text-white mt-1">{adminStats.partnersCount} lots</div>
            <div className="text-[10px] text-amber-500 font-semibold mt-1.5">{pendingLots.length} pending review</div>
          </div>
          <div className="rounded-2xl border border-gray-850 bg-gray-900/30 p-5">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Fraud Threat Level</span>
            <div className="text-2xl font-bold text-rose-500 mt-1 flex items-center gap-1.5">
              <ShieldAlert className="h-5 w-5" /> Normal
            </div>
            <div className="text-[10px] text-gray-500 mt-1.5">{fraudAlerts.length} active alerts</div>
          </div>
        </div>

        {/* Core graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div className="lg:col-span-8 rounded-2xl border border-gray-850 bg-gray-900/30 p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-white">Monthly Platform Commission Revenue ($)</h3>
              <span className="text-[10px] font-bold text-gray-500 uppercase">H1 Growth Profile</span>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyGrowthData}>
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={10} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151' }} />
                  <Bar dataKey="commission" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pending lots sidebar */}
          <div className="lg:col-span-4 rounded-2xl border border-gray-850 bg-gray-900/30 p-5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Verifications</h3>
            {pendingLots.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">No pending partner lot submissions.</p>
            ) : (
              <div className="space-y-3">
                {pendingLots.map(lot => (
                  <div key={lot.id} className="rounded-xl border border-gray-850 bg-gray-950 p-3.5 space-y-3">
                    <div>
                      <span className="font-semibold text-xs text-white block">{lot.name}</span>
                      <span className="text-[10px] text-gray-500 block mt-0.5">{lot.address}</span>
                    </div>

                    <div className="flex gap-2 justify-end pt-1">
                      <button
                        onClick={() => verifyParkingLot(lot.id)}
                        className="flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 text-[10px] font-semibold text-emerald-400"
                      >
                        <Check className="h-3 w-3" /> Approve
                      </button>
                      <button
                        onClick={() => deleteParkingLot(lot.id)}
                        className="flex items-center gap-1 rounded bg-rose-500/10 border border-rose-500/30 px-2 py-1 text-[10px] font-semibold text-rose-400"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    );
  };

  // Tab: Verify Partners
  const renderVerify = () => {
    return (
      <div className="space-y-6">
        <h3 className="font-outfit text-lg font-bold">Partner Verification System</h3>
        <div className="rounded-2xl border border-gray-850 bg-gray-900/20 overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-950 border-b border-gray-850 text-gray-400">
                <th className="p-4">Lot Name</th>
                <th className="p-4">Location</th>
                <th className="p-4">Total Spaces</th>
                <th className="p-4">Pricing</th>
                <th className="p-4">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-850">
              {parkingLots.map(lot => (
                <tr key={lot.id} className="hover:bg-gray-900/10">
                  <td className="p-4 font-semibold text-white">{lot.name}</td>
                  <td className="p-4 text-gray-400">{lot.address}</td>
                  <td className="p-4 font-mono">{lot.slots.length}</td>
                  <td className="p-4 font-mono">₹{lot.price}/hr</td>
                  <td className="p-4">
                    {lot.verified ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 text-[9px] font-bold text-emerald-400 uppercase">
                        <Check className="h-2.5 w-2.5" /> Approved
                      </span>
                    ) : (
                      <button
                        onClick={() => verifyParkingLot(lot.id)}
                        className="rounded bg-blue-600 px-2.5 py-1 text-[10px] font-semibold hover:bg-blue-500 transition-colors"
                      >
                        Click to Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Tab: Fraud Control
  const renderFraud = () => {
    return (
      <div className="max-w-3xl space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-outfit text-lg font-bold">Fraud Detection Center</h3>
          <span className="rounded bg-rose-500/20 border border-rose-500/40 px-2 py-0.5 text-[9px] font-bold text-rose-400 uppercase">
            Live Feed Active
          </span>
        </div>

        <div className="space-y-4">
          {fraudAlerts.length === 0 ? (
            <p className="text-xs text-gray-500 bg-gray-900/10 border border-gray-850 rounded-2xl p-8 text-center">
              All systems nominal. No fraud events detected.
            </p>
          ) : (
            fraudAlerts.map(alert => (
              <div key={alert.id} className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-5 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-white">{alert.type}</span>
                      <span className="text-[8px] font-bold uppercase px-1.5 py-0.2 bg-rose-600 rounded text-white font-mono">
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">{alert.message}</p>
                    <div className="text-[10px] text-gray-500 mt-2 font-mono">
                      Target: {alert.target} • Timestamp: {alert.timestamp}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDismissFraud(alert.id)}
                  className="rounded-lg bg-gray-900 border border-gray-800 hover:border-gray-700 px-3 py-1.5 text-xs text-gray-400 hover:text-white"
                >
                  Dismiss Alert
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // Tab: Bookings
  const renderBookings = () => {
    return (
      <div className="space-y-4">
        <h3 className="font-outfit text-lg font-bold">All Platform Bookings</h3>
        <div className="rounded-2xl border border-gray-850 bg-gray-900/20 overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-950 border-b border-gray-850 text-gray-400">
                <th className="p-4">Ticket</th>
                <th className="p-4">Parking Lot</th>
                <th className="p-4">Bay</th>
                <th className="p-4">Schedule</th>
                <th className="p-4">Gross Amt</th>
                <th className="p-4">Commission</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-850">
              {bookings.map(b => (
                <tr key={b.id} className="hover:bg-gray-900/10">
                  <td className="p-4 font-mono font-semibold">{b.id.toUpperCase()}</td>
                  <td className="p-4 text-white">{b.lotName}</td>
                  <td className="p-4 font-mono">{b.slotId}</td>
                  <td className="p-4 text-gray-400">{b.date} • {b.time}</td>
                  <td className="p-4 text-white font-bold">₹{b.amount}</td>
                  <td className="p-4 text-purple-400 font-bold">₹{(b.amount * 0.15).toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      b.status === 'Upcoming' 
                        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                        : b.status === 'Completed' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-gray-800 text-gray-500'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'verify': return renderVerify();
      case 'fraud': return renderFraud();
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
            <h2 className="font-outfit text-2xl font-bold capitalize">Platform Admin</h2>
            <p className="text-xs text-gray-550 mt-1">Super-admin console for commission analytics, fraud feeds, and partner audits.</p>
          </div>
        </div>

        {renderContent()}

      </main>
    </div>
  );
}

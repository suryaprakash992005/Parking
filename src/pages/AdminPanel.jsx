import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import { 
  ShieldCheck, ShieldAlert, Check, AlertTriangle
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

  const pendingLots = useMemo(() => parkingLots.filter(lot => !lot.verified), [parkingLots]);

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

  const renderOverview = () => {
    return (
      <div className="space-y-8">
        
        {/* Metric panels */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-1 shadow-sm">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Gross Booking Value</span>
            <div className="text-2xl font-bold text-gray-950 font-outfit">₹{adminStats.grossValue + 870000}</div>
            <div className="text-[10px] text-emerald-600 font-bold">+24% vs last quarter</div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-1 shadow-sm">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Commission Revenue (15%)</span>
            <div className="text-2xl font-bold text-gray-950 font-outfit">₹{adminStats.platformRevenue + 130500}</div>
            <div className="text-[10px] text-gray-500">Net platform margins</div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-1 shadow-sm">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Listed Properties</span>
            <div className="text-2xl font-bold text-gray-950 font-outfit">{adminStats.partnersCount} Lots</div>
            <div className="text-[10px] text-gray-500">{pendingLots.length} awaiting verification</div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-1 shadow-sm">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Security Status</span>
            <div className="text-2xl font-bold text-emerald-600 font-outfit flex items-center gap-1.5">
              <ShieldCheck className="h-5 w-5" /> Active
            </div>
            <div className="text-[10px] text-gray-550">{fraudAlerts.length} unresolved flags</div>
          </div>
        </div>

        {/* Core graphs & Verification sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 rounded-2xl border border-gray-200 bg-white p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Commission Margins</h3>
              <span className="text-[9px] font-mono text-gray-400 uppercase">H1 margins</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyGrowthData}>
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={10} tickLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }} />
                  <Bar dataKey="commission" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pending lots sidebar */}
          <div className="lg:col-span-4 rounded-2xl border border-gray-200 bg-white p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-450">Pending Approvals</h3>
            {pendingLots.length === 0 ? (
              <p className="text-xs text-gray-550 py-6 text-center">No pending partner lot submissions.</p>
            ) : (
              <div className="space-y-3">
                {pendingLots.map(lot => (
                  <div key={lot.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3 shadow-inner">
                    <div>
                      <span className="font-bold text-xs text-gray-900 block">{lot.name}</span>
                      <span className="text-[10px] text-gray-500 block mt-0.5">{lot.address}</span>
                    </div>

                    <div className="flex gap-2 justify-end pt-1">
                      <button
                        onClick={() => verifyParkingLot(lot.id)}
                        className="flex items-center gap-1 rounded-lg bg-blue-600 hover:bg-blue-750 px-3 py-1.5 text-[10px] font-bold text-white cursor-pointer shadow-sm shadow-blue-500/25"
                      >
                        <Check className="h-3 w-3" /> Approve
                      </button>
                      <button
                        onClick={() => deleteParkingLot(lot.id)}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-[10px] font-bold text-gray-600 hover:bg-gray-50 cursor-pointer shadow-sm"
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

  const renderVerify = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-450">Partner Audit System</h3>
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-450 font-bold uppercase tracking-wider text-[9px]">
                <th className="p-4">Facility Name</th>
                <th className="p-4">Coordinates</th>
                <th className="p-4">Bays</th>
                <th className="p-4">Price / Hour</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-650">
              {parkingLots.map(lot => (
                <tr key={lot.id} className="hover:bg-gray-50/50">
                  <td className="p-4 font-bold text-gray-900">{lot.name}</td>
                  <td className="p-4 text-gray-550">{lot.address}</td>
                  <td className="p-4 font-mono text-[11px]">{lot.slots.length}</td>
                  <td className="p-4 font-mono text-[11px]">₹{lot.price}/hr</td>
                  <td className="p-4">
                    {lot.verified ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-250 bg-emerald-50 px-2.5 py-0.5 text-[9px] font-bold text-emerald-600 uppercase">
                        Approved
                      </span>
                    ) : (
                      <button
                        onClick={() => verifyParkingLot(lot.id)}
                        className="rounded-lg bg-blue-600 text-white px-2.5 py-1.5 text-[10px] font-bold hover:bg-blue-750 transition-all cursor-pointer shadow-sm shadow-blue-500/25"
                      >
                        Approve Complex
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

  const renderFraud = () => {
    return (
      <div className="max-w-3xl space-y-6">
        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Security Telemetry alerts</h3>
          <span className="text-[9px] font-mono text-gray-400 uppercase">Telemetry stream active</span>
        </div>

        <div className="space-y-4">
          {fraudAlerts.length === 0 ? (
            <p className="text-xs text-gray-550 bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
              All infrastructure nodes reporting nominal status. No warnings.
            </p>
          ) : (
            fraudAlerts.map(alert => (
              <div key={alert.id} className="rounded-2xl border border-gray-200 bg-white p-5 flex items-start justify-between shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="h-9 w-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                    <AlertTriangle className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-gray-900 uppercase tracking-wider">{alert.type}</span>
                      <span className="text-[8px] font-mono font-bold uppercase px-1.5 py-0.2 border border-rose-200 bg-rose-50 rounded text-rose-600">
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">{alert.message}</p>
                    <div className="text-[10px] text-gray-400 mt-3 font-mono">
                      Target: {alert.target} • Signal: {alert.timestamp}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDismissFraud(alert.id)}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 cursor-pointer shadow-sm"
                >
                  Clear Flag
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderBookings = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-450">All Platform Ledger Logs</h3>
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-450 font-bold uppercase tracking-wider text-[9px]">
                <th className="p-4">Transaction Code</th>
                <th className="p-4">Facility Complex</th>
                <th className="p-4">Bay</th>
                <th className="p-4">Schedule</th>
                <th className="p-4">Gross Vol</th>
                <th className="p-4">Platform Fee (15%)</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-650">
              {bookings.map(b => (
                <tr key={b.id} className="hover:bg-gray-50/50">
                  <td className="p-4 font-mono text-[11px] font-bold">{b.id.toUpperCase()}</td>
                  <td className="p-4 text-gray-900 font-bold">{b.lotName}</td>
                  <td className="p-4 font-mono text-[11px]">{b.slotId}</td>
                  <td className="p-4 text-gray-400">{b.date} • {b.time}</td>
                  <td className="p-4 text-gray-950 font-bold">₹{b.amount}</td>
                  <td className="p-4 text-emerald-600 font-bold">₹{(b.amount * 0.15).toFixed(2)}</td>
                  <td className="p-4">
                    <span className="rounded bg-blue-50 border border-blue-100 px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase text-blue-600">
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
    <div className="flex flex-col md:flex-row bg-[#FAFAFA] text-gray-800 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8">
        
        <div className="border-b border-gray-200 pb-5 mb-8 flex justify-between items-center">
          <div>
            <h2 className="font-outfit text-xl font-bold uppercase tracking-wider text-gray-900 font-extrabold">Platform Admin Console</h2>
            <p className="text-xs text-gray-550 mt-1">Audit platform commission margins, verify parking lots, and trace platform access parameters.</p>
          </div>
        </div>

        {renderContent()}

      </main>
    </div>
  );
}

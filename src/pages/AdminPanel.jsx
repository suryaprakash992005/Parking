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
          <div className="rounded-xl border border-neutral-900 bg-neutral-950 p-6 space-y-1">
            <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">Gross Transaction Value</span>
            <div className="text-xl font-bold text-white font-outfit">₹{adminStats.grossValue + 870000}</div>
            <div className="text-[10px] text-neutral-500">+24% vs last quarter</div>
          </div>
          <div className="rounded-xl border border-neutral-900 bg-neutral-950 p-6 space-y-1">
            <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">Commission Revenue (15%)</span>
            <div className="text-xl font-bold text-white font-outfit">₹{adminStats.platformRevenue + 130500}</div>
            <div className="text-[10px] text-neutral-500">Net platform margins</div>
          </div>
          <div className="rounded-xl border border-neutral-900 bg-neutral-950 p-6 space-y-1">
            <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">Listed Infrastructure</span>
            <div className="text-xl font-bold text-white font-outfit">{adminStats.partnersCount} Lots</div>
            <div className="text-[10px] text-neutral-500">{pendingLots.length} awaiting verification</div>
          </div>
          <div className="rounded-xl border border-neutral-900 bg-neutral-950 p-6 space-y-1">
            <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">Security Level</span>
            <div className="text-xl font-bold text-white font-outfit flex items-center gap-1.5">
              <ShieldAlert className="h-4.5 w-4.5 text-neutral-400" /> Normal
            </div>
            <div className="text-[10px] text-neutral-500">{fraudAlerts.length} unresolved alerts</div>
          </div>
        </div>

        {/* Core graphs & Verification sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 rounded-xl border border-neutral-900 bg-neutral-950 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Commission Margins</h3>
              <span className="text-[9px] font-mono text-neutral-500 uppercase">H1 distribution</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyGrowthData}>
                  <XAxis dataKey="month" stroke="#525252" fontSize={10} tickLine={false} />
                  <YAxis stroke="#525252" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #262626' }} />
                  <Bar dataKey="commission" fill="#404040" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pending lots sidebar */}
          <div className="lg:col-span-4 rounded-xl border border-neutral-900 bg-neutral-950 p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Pending Approvals</h3>
            {pendingLots.length === 0 ? (
              <p className="text-xs text-neutral-500 py-6 text-center">No pending partner lot submissions.</p>
            ) : (
              <div className="space-y-3">
                {pendingLots.map(lot => (
                  <div key={lot.id} className="rounded border border-neutral-900 bg-neutral-950 p-4 space-y-3">
                    <div>
                      <span className="font-bold text-xs text-white block">{lot.name}</span>
                      <span className="text-[10px] text-neutral-500 block mt-0.5">{lot.address}</span>
                    </div>

                    <div className="flex gap-2 justify-end pt-1">
                      <button
                        onClick={() => verifyParkingLot(lot.id)}
                        className="flex items-center gap-1 rounded bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 px-3 py-1.5 text-[10px] font-bold text-white cursor-pointer"
                      >
                        <Check className="h-3 w-3" /> Approve
                      </button>
                      <button
                        onClick={() => deleteParkingLot(lot.id)}
                        className="rounded border border-neutral-900 px-3 py-1.5 text-[10px] font-bold text-neutral-400 hover:text-white cursor-pointer"
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
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-neutral-450">Partner Audit System</h3>
        <div className="rounded-xl border border-neutral-900 bg-neutral-950 overflow-hidden shadow-2xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-900/60 border-b border-neutral-900 text-neutral-505 font-extrabold uppercase tracking-wider text-[9px]">
                <th className="p-4">Facility Designation</th>
                <th className="p-4">Coordinates</th>
                <th className="p-4">Bays</th>
                <th className="p-4">Price / Hour</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900 text-neutral-300">
              {parkingLots.map(lot => (
                <tr key={lot.id} className="hover:bg-neutral-900/10">
                  <td className="p-4 font-bold text-white">{lot.name}</td>
                  <td className="p-4 text-neutral-550">{lot.address}</td>
                  <td className="p-4 font-mono text-[11px]">{lot.slots.length}</td>
                  <td className="p-4 font-mono text-[11px]">₹{lot.price}/hr</td>
                  <td className="p-4">
                    {lot.verified ? (
                      <span className="inline-flex items-center gap-1 rounded border border-neutral-800 bg-neutral-900 px-2.5 py-0.5 text-[9px] font-bold text-neutral-400 uppercase">
                        Approved
                      </span>
                    ) : (
                      <button
                        onClick={() => verifyParkingLot(lot.id)}
                        className="rounded bg-white text-black px-2.5 py-1 text-[10px] font-bold hover:bg-neutral-200 transition-all cursor-pointer"
                      >
                        Approve listing
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
        <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-neutral-400">Security & Flagged Signals</h3>
          <span className="text-[9px] font-mono text-neutral-500 uppercase">Telemetry stream active</span>
        </div>

        <div className="space-y-4">
          {fraudAlerts.length === 0 ? (
            <p className="text-xs text-neutral-500 bg-neutral-950 border border-neutral-900 rounded-xl p-8 text-center">
              All infrastructure nodes reporting nominal status. No warnings.
            </p>
          ) : (
            fraudAlerts.map(alert => (
              <div key={alert.id} className="rounded-xl border border-neutral-900 bg-neutral-950 p-5 flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-9 w-9 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 shrink-0">
                    <AlertTriangle className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white uppercase tracking-wider">{alert.type}</span>
                      <span className="text-[8px] font-mono font-bold uppercase px-1.5 py-0.2 border border-neutral-800 bg-neutral-900 rounded text-neutral-400">
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-2 leading-relaxed">{alert.message}</p>
                    <div className="text-[10px] text-neutral-550 mt-3 font-mono">
                      Target: {alert.target} • Signal: {alert.timestamp}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDismissFraud(alert.id)}
                  className="rounded border border-neutral-800 hover:border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs font-bold text-neutral-400 hover:text-white cursor-pointer"
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
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-neutral-450">All Platform Ledger Logs</h3>
        <div className="rounded-xl border border-neutral-900 bg-neutral-950 overflow-hidden shadow-2xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-900/60 border-b border-neutral-900 text-neutral-505 font-extrabold uppercase tracking-wider text-[9px]">
                <th className="p-4">Transaction</th>
                <th className="p-4">Facility</th>
                <th className="p-4">Bay</th>
                <th className="p-4">Schedule</th>
                <th className="p-4">Gross Vol</th>
                <th className="p-4">Platform Fee (15%)</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900 text-neutral-300">
              {bookings.map(b => (
                <tr key={b.id} className="hover:bg-neutral-900/10">
                  <td className="p-4 font-mono text-[11px] font-bold">{b.id.toUpperCase()}</td>
                  <td className="p-4 text-white font-bold">{b.lotName}</td>
                  <td className="p-4 font-mono text-[11px]">{b.slotId}</td>
                  <td className="p-4 text-neutral-550">{b.date} • {b.time}</td>
                  <td className="p-4 text-white font-bold">₹{b.amount}</td>
                  <td className="p-4 text-neutral-400 font-bold">₹{(b.amount * 0.15).toFixed(2)}</td>
                  <td className="p-4">
                    <span className="rounded border border-neutral-800 bg-neutral-900 px-2 py-0.5 text-[9px] font-extrabold tracking-wider uppercase text-neutral-450">
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
    <div className="flex flex-col md:flex-row bg-[#0A0A0A] text-white min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8">
        
        <div className="border-b border-neutral-900 pb-5 mb-8 flex justify-between items-center">
          <div>
            <h2 className="font-outfit text-xl font-bold uppercase tracking-wider">Infrastructure Operations Tower</h2>
            <p className="text-xs text-neutral-500 mt-1">Audit platform take-rates, verify commercial space hosts, and dismiss security alerts.</p>
          </div>
        </div>

        {renderContent()}

      </main>
    </div>
  );
}

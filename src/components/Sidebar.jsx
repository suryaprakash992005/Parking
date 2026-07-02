import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, Search, CalendarDays, History, MapPin, User, CreditCard, LifeBuoy,
  Building, PlusCircle, BarChart3, Users, Bell, Settings, ShieldCheck, ShieldAlert
} from 'lucide-react';

export default function Sidebar() {
  const { role } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const userItems = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'search-redirect', name: 'Search Parking', icon: Search, link: '/search' },
    { id: 'bookings', name: 'Active Bookings', icon: CalendarDays },
    { id: 'history', name: 'Usage Logs', icon: History },
    { id: 'saved', name: 'Saved Locations', icon: MapPin },
    { id: 'profile', name: 'Identity Profile', icon: User },
    { id: 'payments', name: 'Payments Ledger', icon: CreditCard },
    { id: 'support', name: 'Help Desk', icon: LifeBuoy }
  ];

  const ownerItems = [
    { id: 'overview', name: 'Operational Overview', icon: LayoutDashboard },
    { id: 'lots', name: 'Inventory Assets', icon: Building },
    { id: 'add-slot', name: 'Configure Bay', icon: PlusCircle },
    { id: 'bookings', name: 'Active Accesses', icon: CalendarDays },
    { id: 'analytics', name: 'Revenue Streams', icon: BarChart3 },
    { id: 'customers', name: 'Customer Base', icon: Users },
    { id: 'notifications', name: 'Security Logs', icon: Bell },
    { id: 'settings', name: 'Console Config', icon: Settings }
  ];

  const adminItems = [
    { id: 'overview', name: 'Platform Health', icon: LayoutDashboard },
    { id: 'users', name: 'User Directories', icon: Users },
    { id: 'verify', name: 'Partner Approvals', icon: ShieldCheck },
    { id: 'bookings', name: 'All Transactions', icon: CalendarDays },
    { id: 'revenue', name: 'Commissions', icon: BarChart3 },
    { id: 'fraud', name: 'Security Center', icon: ShieldAlert }
  ];

  const items = role === 'admin' ? adminItems : role === 'owner' ? ownerItems : userItems;

  const handleTabChange = (item) => {
    if (item.link) return;
    setSearchParams({ tab: item.id });
  };

  return (
    <div className="w-full md:w-60 border-r border-neutral-900 bg-neutral-950 p-4 flex flex-col gap-1 min-h-[calc(100vh-3.5rem)]">
      <div className="mb-4 px-3.5 py-2">
        <h2 className="text-[9px] font-extrabold uppercase tracking-widest text-neutral-500">
          Workplace / {role.toUpperCase()}
        </h2>
      </div>

      <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible gap-1 pb-3 md:pb-0 scrollbar-none">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          if (item.link) {
            return (
              <Link
                key={item.id}
                to={item.link}
                className="flex items-center gap-3 rounded-lg px-3.5 py-2 text-[11px] font-semibold text-neutral-400 hover:bg-neutral-900/50 hover:text-white transition-all"
              >
                <Icon className="h-4 w-4 stroke-[1.8]" />
                <span className="whitespace-nowrap">{item.name}</span>
              </Link>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item)}
              className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-[11px] font-semibold transition-all cursor-pointer ${
                isActive 
                  ? 'bg-neutral-900 text-white border border-neutral-800' 
                  : 'text-neutral-400 hover:bg-neutral-900/50 hover:text-white border border-transparent'
              }`}
            >
              <Icon className={`h-4 w-4 stroke-[1.8] ${isActive ? 'text-white' : 'text-neutral-500'}`} />
              <span className="whitespace-nowrap">{item.name}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

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
    { id: 'overview', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'search-redirect', name: 'Search Parking', icon: Search, link: '/search' },
    { id: 'bookings', name: 'My Bookings', icon: CalendarDays },
    { id: 'history', name: 'Booking History', icon: History },
    { id: 'saved', name: 'Saved Locations', icon: MapPin },
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'payments', name: 'Payment History', icon: CreditCard },
    { id: 'support', name: 'Support', icon: LifeBuoy }
  ];

  const ownerItems = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'lots', name: 'Manage Lots', icon: Building },
    { id: 'add-slot', name: 'Add Parking Slot', icon: PlusCircle },
    { id: 'bookings', name: 'Current Bookings', icon: CalendarDays },
    { id: 'analytics', name: 'Revenue Analytics', icon: BarChart3 },
    { id: 'customers', name: 'Customers', icon: Users },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const adminItems = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'users', name: 'Manage Users', icon: Users },
    { id: 'verify', name: 'Verify Partners', icon: ShieldCheck },
    { id: 'bookings', name: 'All Bookings', icon: CalendarDays },
    { id: 'revenue', name: 'Commissions & Rev', icon: BarChart3 },
    { id: 'fraud', name: 'Fraud Control', icon: ShieldAlert }
  ];

  const items = role === 'admin' ? adminItems : role === 'owner' ? ownerItems : userItems;

  const handleTabChange = (item) => {
    if (item.link) return; // Managed by Router Link
    setSearchParams({ tab: item.id });
  };

  return (
    <div className="w-full md:w-64 border-r border-gray-800 bg-gray-950 p-4 flex flex-col gap-1 min-h-[calc(100vh-4rem)]">
      <div className="mb-4 px-3 py-2">
        <h2 className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
          Navigation ({role.toUpperCase()})
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
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-400 hover:bg-gray-900 hover:text-white transition-all duration-200"
              >
                <Icon className="h-4 w-4" />
                <span className="whitespace-nowrap">{item.name}</span>
              </Link>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                  : 'text-gray-400 hover:bg-gray-900 hover:text-white border border-transparent'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
              <span className="whitespace-nowrap">{item.name}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

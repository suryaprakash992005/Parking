import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, CheckCircle2, Clock, Map, Star, ArrowRight,
  TrendingUp, Award, Zap, DollarSign, Users, Building, ShieldCheck, Car
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function LandingPage() {
  const { setRole } = useApp();
  const navigate = useNavigate();

  const handleBecomePartner = () => {
    setRole('owner');
    navigate('/owner-dashboard?tab=lots');
  };

  // Simulated live reservation triggers
  const [liveStats, setLiveStats] = useState({
    bookingNow: 3,
    available: 12,
    occupied: 8
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const nextBooking = Math.max(1, Math.min(6, prev.bookingNow + delta));
        const nextOccupied = Math.max(5, Math.min(12, prev.occupied - delta));
        return {
          bookingNow: nextBooking,
          available: 20 - nextOccupied,
          occupied: nextOccupied
        };
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { number: '01', title: 'Find Location', desc: 'Search for verified parking complexes near your destination.' },
    { number: '02', title: 'Compare Pricing', desc: 'Inspect live slot statuses, hourly rates, and amenities.' },
    { number: '03', title: 'Lock Slot', desc: 'Book your spot in advance and secure a QR ticket pass.' },
    { number: '04', title: 'Park Instantly', desc: 'Drive in, scan your ticket at the barrier, and park stress-free.' }
  ];

  const features = [
    { icon: Clock, title: 'Save Valuable Time', desc: 'Skip driving in circles. Go straight to your pre-reserved space.' },
    { icon: TrendingUp, title: 'Avoid Traffic Knots', desc: 'Reduce central road gridlocks caused by drivers hunting for spots.' },
    { icon: Shield, title: 'Guaranteed Availability', desc: 'Your designated bay is monitored and locked for your arrival.' },
    { icon: Zap, title: '1-Click Booking Flow', desc: 'Reserve and checkout in seconds via our fast billing engine.' },
    { icon: CheckCircle2, title: 'Live Slot Status', desc: 'Every slot has smart sensors reporting real-time vacancy updates.' },
    { icon: DollarSign, title: 'Monetize Vacancy', desc: 'Property owners list spaces to capture passive daily income.' }
  ];

  const stats = [
    { value: '20,000+', label: 'Happy Drivers', icon: Users, color: 'text-blue-600' },
    { value: '5,000+', label: 'Smart Bays', icon: Map, color: 'text-emerald-600' },
    { value: '150+', label: 'Parking Owners', icon: Building, color: 'text-amber-600' }
  ];

  // 20 realistic parking spaces mock
  const parkingGrid = [
    { label: 'P1', status: 'Occupied', type: 'Standard' },
    { label: 'P2', status: 'Available', type: 'Standard' },
    { label: 'P3', status: 'Reserved', type: 'EV-Charging' },
    { label: 'P4', status: 'Occupied', type: 'Standard' },
    { label: 'P5', status: 'Available', type: 'Premium' },
    { label: 'P6', status: 'Available', type: 'Standard' },
    { label: 'P7', status: 'Occupied', type: 'Standard' },
    { label: 'P8', status: 'Reserved', type: 'Standard' },
    { label: 'P9', status: 'Available', type: 'EV-Charging' },
    { label: 'P10', status: 'Occupied', type: 'Premium' },
    { label: 'P11', status: 'Available', type: 'Standard' },
    { label: 'P12', status: 'Available', type: 'Standard' },
    { label: 'P13', status: 'Occupied', type: 'Standard' },
    { label: 'P14', status: 'Reserved', type: 'Standard' },
    { label: 'P15', status: 'Available', type: 'EV-Charging' },
    { label: 'P16', status: 'Occupied', type: 'Standard' },
    { label: 'P17', status: 'Available', type: 'Standard' },
    { label: 'P18', status: 'Available', type: 'Premium' },
    { label: 'P19', status: 'Occupied', type: 'Standard' },
    { label: 'P20', status: 'Reserved', type: 'Standard' }
  ];

  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: 'Office Commuter',
      text: 'I reserve my bay at Downtown Smart Haven every morning. I park within 30 seconds and walk to work. Game changer.',
      rating: 5,
      avatar: 'SJ'
    },
    {
      name: 'Marcus Vance',
      role: 'Property Owner',
      text: 'Listing our excess garage slots has generated stable secondary income. The dashboard handles verification smoothly.',
      rating: 5,
      avatar: 'MV'
    },
    {
      name: 'Elena Rostova',
      role: 'EV Commuter',
      text: 'Knowing I have a reserved EV charging space locked in before driving downtown takes away all charging anxiety.',
      rating: 5,
      avatar: 'ER'
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#FAFAFA] text-gray-800">
      
      {/* Background visual texture */}
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 h-[400px] w-[400px] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-6 pt-16 pb-20 sm:px-8 lg:pt-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-12 items-center">
          
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-150 px-3.5 py-1 text-xs font-bold text-blue-600 shadow-sm">
              <ShieldCheck className="h-4 w-4" /> 100% Secure Reservations
            </div>
            
            <h1 className="font-outfit text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-gray-900 leading-[1.08]">
              Find And Reserve Parking <span className="text-blue-600">Before</span> You Arrive
            </h1>

            <p className="text-sm text-gray-500 max-w-lg leading-relaxed">
              Locate nearby verified parking spaces, compare hourly prices, check real-time availability, and secure your spot instantly to beat the city rush.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                to="/search"
                className="btn-consumer-primary px-6 py-3.5 shadow-lg shadow-blue-500/20 text-center"
              >
                <span>Find Parking Lot</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Link>
              <button
                onClick={handleBecomePartner}
                className="btn-consumer-secondary px-6 py-3.5"
              >
                Become Parking Host
              </button>
            </div>
          </div>

          {/* Right Column: Dynamic Live 20-Slot Visualizer */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl relative overflow-hidden">
              
              {/* Telemetry Header */}
              <div className="flex justify-between items-center border-b border-gray-150 pb-4 mb-4">
                <div>
                  <h3 className="font-outfit text-sm font-bold text-gray-950">Downtown Center Deck</h3>
                  <div className="flex items-center gap-2 mt-1 text-[10px] font-bold text-gray-500 uppercase">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live Operations Tracker</span>
                  </div>
                </div>

                {/* Counters */}
                <div className="flex gap-4 text-right text-xs">
                  <div>
                    <span className="text-[9px] text-gray-400 font-bold uppercase block">Available</span>
                    <strong className="text-emerald-600 font-bold font-mono">{liveStats.available} bays</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 font-bold uppercase block">Live Booking</span>
                    <strong className="text-blue-600 font-bold font-mono">{liveStats.bookingNow} users</strong>
                  </div>
                </div>
              </div>

              {/* 20-Space Layout Grid */}
              <div className="grid grid-cols-5 gap-3 pt-2">
                {parkingGrid.map((slot, idx) => {
                  const isOccupied = slot.status === 'Occupied';
                  const isReserved = slot.status === 'Reserved';
                  const isPremium = slot.type === 'Premium';
                  const isEV = slot.type === 'EV-Charging';

                  let statusColor = 'border-emerald-300 bg-emerald-50 text-emerald-600';
                  let statusLabel = 'FREE';

                  if (isOccupied) {
                    statusColor = 'border-rose-250 bg-rose-50 text-rose-500';
                    statusLabel = 'BUSY';
                  } else if (isReserved) {
                    statusColor = 'border-blue-300 bg-blue-50 text-blue-600';
                    statusLabel = 'BOOKED';
                  } else if (isPremium) {
                    statusColor = 'border-amber-300 bg-amber-50 text-amber-600';
                    statusLabel = 'VIP';
                  }

                  return (
                    <div 
                      key={idx}
                      className={`h-14 rounded-xl border flex flex-col items-center justify-between p-1.5 font-mono text-[10px] shadow-sm ${statusColor}`}
                    >
                      <div className="flex justify-between w-full font-bold">
                        <span>{slot.label}</span>
                        {isEV && <span className="text-[8px] bg-blue-200/50 px-1 rounded">EV</span>}
                      </div>

                      <div className="text-[8px] font-extrabold tracking-wider">{statusLabel}</div>
                    </div>
                  );
                })}
              </div>

              {/* Legend indicators */}
              <div className="mt-5 border-t border-gray-150 pt-4 flex justify-around text-[9px] font-bold text-gray-400 uppercase">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded bg-emerald-500" /> Free</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded bg-rose-500" /> Busy</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded bg-blue-500" /> Booked</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded bg-amber-500" /> VIP</span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 border-y border-gray-200 bg-gray-50">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="font-outfit text-3xl font-extrabold text-gray-900 tracking-tight">How It Works</h2>
          <p className="text-gray-500 text-sm">
            Eradicating parking stress in four straightforward steps.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="text-3xl font-extrabold text-blue-600/20 font-outfit mb-4 group-hover:text-blue-600 transition-colors">
                {step.number}
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">{step.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose ParkEase */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="font-outfit text-3xl font-extrabold text-gray-900 tracking-tight">Why Choose ParkEase</h2>
          <p className="text-gray-500 text-sm">
            Premium utility features designed for optimal city driving experience.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div 
                key={idx}
                className="p-6 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 transition-all shadow-sm"
              >
                <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">{feature.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Live Statistics Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 bg-white border border-gray-200 rounded-3xl my-8 shadow-sm">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 text-center">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="space-y-2">
                <div className="flex justify-center">
                  <div className={`p-2.5 rounded-xl bg-gray-50 border border-gray-150 ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="text-4xl font-extrabold text-gray-950 tracking-tight font-outfit">
                  {stat.value}
                </div>
                <div className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 border-t border-gray-200">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="font-outfit text-3xl font-extrabold text-gray-900 tracking-tight">Driver Testimonials</h2>
          <p className="text-gray-500 text-sm">
            Read experience reports from commuters who park in our verified complexes.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((test, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-2xl border border-gray-250 bg-white flex flex-col justify-between shadow-sm"
            >
              <div className="space-y-4">
                <div className="flex gap-1 text-amber-500">
                  {Array.from({ length: test.rating }).map((_, i) => (
                    <Star key={i} className="h-4.5 w-4.5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-xs text-gray-600 italic leading-relaxed">
                  "{test.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 mt-6 border-t border-gray-100 pt-4">
                <div className="flex h-9 w-9 items-center justify-center rounded bg-gray-50 border border-gray-200 text-xs font-bold text-gray-500">
                  {test.avatar}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">{test.name}</h4>
                  <p className="text-[10px] text-gray-500">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

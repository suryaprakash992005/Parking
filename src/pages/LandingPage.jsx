import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, Shield, CheckCircle2, Clock, Map, Star, ArrowRight,
  TrendingUp, Award, Zap, DollarSign, Users, Building, ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function LandingPage() {
  const { setRole } = useApp();
  const navigate = useNavigate();

  const handleBecomePartner = () => {
    setRole('owner');
    navigate('/owner-dashboard?tab=lots');
  };

  const steps = [
    { number: '01', title: 'Search Destination', desc: 'Enter any city location or landmark in our smart search.' },
    { number: '02', title: 'Compare Spaces', desc: 'View live spot availability, prices, and premium features.' },
    { number: '03', title: 'Book Instantly', desc: 'Secure your spot and receive a premium QR entry pass.' },
    { number: '04', title: 'Park & Go', desc: 'Drive in, scan your QR code, and park stress-free.' }
  ];

  const features = [
    { icon: Clock, title: 'Save Time', desc: 'No more driving in circles. Go straight to your reserved spot.' },
    { icon: TrendingUp, title: 'Avoid Traffic', desc: 'Reduce street congestion and fuel waste caused by cruising.' },
    { icon: Shield, title: 'Guaranteed Parking', desc: 'Your spot is locked and secured from the moment you book.' },
    { icon: Zap, title: 'Easy Booking', desc: 'Reserve and pay in less than 60 seconds with our seamless UI.' },
    { icon: CheckCircle2, title: 'Real-Time Availability', desc: 'Live spot status displays exactly which slots are open.' },
    { icon: DollarSign, title: 'Secure Payments', desc: 'Encrypted Stripe-grade payments with instant digital receipts.' }
  ];

  const stats = [
    { value: '20,000+', label: 'Active Drivers', icon: Users, color: 'text-blue-500' },
    { value: '5,000+', label: 'Parking Slots', icon: Map, color: 'text-emerald-500' },
    { value: '150+', label: 'Parking Partners', icon: Building, color: 'text-purple-500' }
  ];

  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: 'Daily Downtown Commuter',
      text: 'ParkEase saves me at least 20 minutes every single morning. I drive straight to my spot in Downtown Smart Haven, scan my code, and walk to the office.',
      rating: 5,
      avatar: 'SJ'
    },
    {
      name: 'Marcus Vance',
      role: 'Property Manager',
      text: 'Listing our unused office parking lot on ParkEase has generated over $3,400 in passive monthly revenue. The owner dashboard is incredibly clean.',
      rating: 5,
      avatar: 'MV'
    },
    {
      name: 'Elena Rostova',
      role: 'EV Driver',
      text: 'Finding parking with EV chargers used to be a gamble. Now I specifically filter for EV stations and reserve them beforehand. Absolutely brilliant platform!',
      rating: 5,
      avatar: 'ER'
    }
  ];

  return (
    <div className="relative min-h-screen bg-gray-950 overflow-hidden text-white">
      {/* Background Orbs */}
      <div className="absolute top-20 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 h-[600px] w-[600px] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-center">
          
          {/* Hero Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400"
            >
              <Award className="h-3.5 w-3.5" /> Introducing ParkEase v2.0
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-outfit text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white leading-tight"
            >
              Reserve Your Parking <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Spot</span> Before You Arrive
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-400 max-w-lg leading-relaxed"
            >
              Find available parking instantly and book your slot before reaching your destination. Save time, reduce emissions, and lock in your rate.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/search"
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/35 transition-all duration-300 hover:bg-blue-500 hover:scale-105 active:scale-98"
              >
                <span>Book Parking</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                onClick={handleBecomePartner}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-800 bg-gray-900/60 px-6 py-3.5 text-sm font-semibold text-gray-300 hover:border-gray-700 hover:text-white hover:bg-gray-900 transition-all duration-300"
              >
                Become Parking Partner
              </button>
            </motion.div>
          </div>

          {/* Premium Animated Car/Garage Illustration */}
          <div className="lg:col-span-6 flex justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-full max-w-[500px] h-[360px] rounded-3xl border border-gray-800 bg-gray-900/40 p-6 flex flex-col justify-between overflow-hidden shadow-2xl backdrop-blur-sm"
            >
              {/* Grid backdrop */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:32px_32px] opacity-10" />

              <div className="flex items-center justify-between z-10">
                <span className="text-xs font-mono text-blue-400">UNIT: PARKEASE-SYS-A</span>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-semibold text-emerald-400 tracking-wider uppercase">Live Connection</span>
                </div>
              </div>

              {/* Animated HUD UI */}
              <div className="relative flex-1 flex items-center justify-center z-10">
                
                {/* Simulated Road Grid */}
                <div className="absolute w-[80%] h-12 bg-gray-850 rounded-xl border border-gray-800/80 flex items-center justify-around px-4">
                  <div className="h-6 w-12 rounded bg-gray-900 border border-gray-800 flex items-center justify-center text-[10px] text-gray-500 font-mono">P1</div>
                  <div className="h-6 w-12 rounded bg-blue-600/20 border border-blue-500/50 flex items-center justify-center text-[10px] text-blue-400 font-mono pulse-glow">P2</div>
                  <div className="h-6 w-12 rounded bg-gray-900 border border-gray-800 flex items-center justify-center text-[10px] text-gray-500 font-mono">P3</div>
                </div>

                {/* Animated Floating Car SVG */}
                <motion.div
                  animate={{ 
                    y: [0, -8, 0],
                    rotateX: [0, 2, 0]
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut"
                  }}
                  className="absolute bottom-16 flex flex-col items-center cursor-pointer"
                >
                  <svg className="w-32 h-20 drop-shadow-[0_15px_15px_rgba(59,130,246,0.3)]" viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Car Body */}
                    <path d="M15 45L22 25C23.5 21 27 18 31.5 18H80.5C85 18 88.5 21 90 25L97 45H108C112.5 45 116 48.5 116 53V60H4V53C4 48.5 7.5 45 12 45H15Z" fill="#1e40af" />
                    <path d="M15 45L22 25C23.5 21 27 18 31.5 18H80.5C85 18 88.5 21 90 25L97 45H108C112.5 45 116 48.5 116 53V60H4V53C4 48.5 7.5 45 12 45H15Z" fill="url(#car-gradient)" />
                    {/* Windows */}
                    <path d="M26 27L31 40H58V22H31.5C29 22 27.2 24 26 27Z" fill="#1e293b" opacity="0.8" />
                    <path d="M86 27L81 40H63V22H80.5C83 22 84.8 24 86 27Z" fill="#1e293b" opacity="0.8" />
                    {/* Headlights & Tail Lights */}
                    <rect x="108" y="48" width="8" height="4" rx="2" fill="#fbbf24" className="animate-pulse" />
                    <rect x="4" y="48" width="6" height="4" rx="2" fill="#ef4444" />
                    {/* Wheels */}
                    <circle cx="28" cy="60" r="8" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                    <circle cx="84" cy="60" r="8" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                    <circle cx="28" cy="60" r="3" fill="#cbd5e1" />
                    <circle cx="84" cy="60" r="3" fill="#cbd5e1" />

                    <defs>
                      <linearGradient id="car-gradient" x1="4" y1="18" x2="116" y2="60" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#3b82f6" />
                        <stop offset="1" stopColor="#1d4ed8" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Floating status above car */}
                  <div className="mt-2 rounded bg-blue-600 px-2 py-0.5 text-[8px] font-bold tracking-widest text-white uppercase shadow-md animate-bounce">
                    Target Spot: P2
                  </div>
                </motion.div>

                {/* Cyber laser scanner indicator */}
                <div className="absolute w-[200px] h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-[pulse_1.5s_infinite]" style={{ transform: 'translateY(16px)' }} />

              </div>

              <div className="flex items-center justify-between border-t border-gray-800/80 pt-4 z-10">
                <div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Destination</div>
                  <div className="text-xs font-semibold text-white">Downtown Office Plaza</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Eta</div>
                  <div className="text-xs font-semibold text-blue-400">12 Mins</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-gray-900 bg-gray-900/20">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="font-outfit text-3xl font-bold sm:text-4xl">How It Works</h2>
          <p className="text-gray-400 text-sm">
            ParkEase makes securing parking space simple and stress-free in four quick steps.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative p-6 rounded-2xl border border-gray-800 bg-gray-900/50 hover:border-blue-500/25 transition-all duration-300 group"
            >
              <div className="text-4xl font-extrabold text-blue-500/20 font-outfit mb-4 group-hover:text-blue-500/40 transition-colors">
                {step.number}
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose ParkEase */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="font-outfit text-3xl font-bold sm:text-4xl">Why Choose ParkEase</h2>
          <p className="text-gray-400 text-sm">
            Designed for drivers and space owners who value efficiency, security, and smart features.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="p-6 rounded-2xl border border-gray-900 bg-gray-950 hover:border-gray-800 hover:bg-gray-900/50 transition-all duration-300 group"
              >
                <div className="h-10 w-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Live Statistics Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900/50 to-gray-950 border-t border-gray-900 rounded-3xl my-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 text-center">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="space-y-2 p-4">
                <div className="flex justify-center">
                  <div className={`p-2.5 rounded-xl bg-gray-900 border border-gray-800 ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="text-4xl font-extrabold text-white tracking-tight font-outfit">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-gray-900">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="font-outfit text-3xl font-bold sm:text-4xl">What Drivers & Owners Say</h2>
          <p className="text-gray-400 text-sm">
            Read positive feedback from members of our smart reservation network.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((test, idx) => (
            <motion.div 
              key={idx}
              className="p-6 rounded-2xl border border-gray-800 bg-gray-900/30 flex flex-col justify-between"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-4">
                <div className="flex gap-1 text-amber-500">
                  {Array.from({ length: test.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-xs text-gray-300 italic leading-relaxed">
                  "{test.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 mt-6 border-t border-gray-800/80 pt-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/20 border border-blue-500/30 text-xs font-bold text-blue-400">
                  {test.avatar}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">{test.name}</h4>
                  <p className="text-[10px] text-gray-500">{test.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Partnership CTA banner */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 mb-20">
        <div className="relative rounded-3xl border border-blue-500/20 bg-blue-950/20 p-8 md:p-12 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-sm">
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
          <div className="text-left space-y-2">
            <h2 className="font-outfit text-2xl font-bold text-white">Have unused parking spaces?</h2>
            <p className="text-xs text-gray-400 max-w-md leading-relaxed">
              Join the ParkEase network. List your driveway, garage, or commercial lot and start receiving reservations instantly.
            </p>
          </div>
          <button
            onClick={handleBecomePartner}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-semibold text-white shadow-lg transition-all hover:bg-blue-500 hover:scale-105"
          >
            <span>Partner Portal</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}

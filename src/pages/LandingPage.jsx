import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, CheckCircle2, Clock, Map, Star, ArrowRight,
  TrendingUp, Award, Zap, DollarSign, Users, Building, ShieldCheck
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
    { number: '01', title: 'Target Destination', desc: 'Identify your target building or metropolitan street coordinates.' },
    { number: '02', title: 'Real-Time Inventory', desc: 'Compare live space occupancy schedules and features.' },
    { number: '03', title: 'Instant Verification', desc: 'Pre-book your spot and claim a cryptographically signed QR token.' },
    { number: '04', title: 'Seamless Access', desc: 'Scan at the gate checkpoint and park without street cruising.' }
  ];

  const features = [
    { icon: Clock, title: 'Optimized Time Allocation', desc: 'Eradicate street search congestion. Navigate directly to your dedicated bay.' },
    { icon: TrendingUp, title: 'Traffic Management', desc: 'Mitigate city-wide gridlock and carbon emissions through predictive arrival mapping.' },
    { icon: Shield, title: 'Secured Allocations', desc: 'Your parking slot is locked and monitored from the moment the payment is cleared.' },
    { icon: Zap, title: 'Stripe-Integrated Payments', desc: 'Clear checkout payments under 15 seconds with enterprise grade encryption.' },
    { icon: CheckCircle2, title: 'Telemetry Infrastructure', desc: 'Live spot status displays precisely which slots are vacant in real-time.' },
    { icon: DollarSign, title: 'Asset Monetization', desc: 'Parking hosts list driveway space or commercial garages for secondary revenue.' }
  ];

  const stats = [
    { value: '20,000+', label: 'Verified Commuters', icon: Users },
    { value: '5,000+', label: 'Configured Bays', icon: Map },
    { value: '150+', label: 'Enterprise Partners', icon: Building }
  ];

  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: 'Financial Director',
      text: 'Integrating ParkEase into our downtown branch has streamlined mornings. Commuters navigate directly to their bays without street delays.',
      avatar: 'SJ'
    },
    {
      name: 'Marcus Vance',
      role: 'Estate Operations Manager',
      text: 'Listing our commercial deck vacancy has opened secondary revenue flows. The dashboard telemetry is clean and highly functional.',
      avatar: 'MV'
    },
    {
      name: 'Elena Rostova',
      role: 'Infrastructure Lead',
      text: 'Specifically filtering for EV-configured slots has resolved our fleet charging challenges. Booking is simple and predictable.',
      avatar: 'ER'
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] overflow-hidden text-neutral-200">
      
      {/* Subtle linear backdrop grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_1px,transparent_1px),linear-gradient(to_bottom,#141414_1px,transparent_1px)] bg-[size:40px_40px] opacity-25" />

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-6 pt-20 pb-24 sm:px-8 lg:pt-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 rounded border border-neutral-800 bg-neutral-900/60 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
              <ShieldCheck className="h-3.5 w-3.5 text-neutral-400" /> Platform Infrastructure v2.0
            </div>
            
            <h1 className="font-outfit text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white leading-[1.08]">
              Smart Parking Infrastructure For Modern Cities
            </h1>

            <p className="text-sm text-neutral-400 max-w-lg leading-relaxed">
              Reserve secure parking spaces before arriving and eliminate unnecessary waiting. Integrate, book, and coordinate logistics from a single clean interface.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                to="/search"
                className="rounded bg-white hover:bg-neutral-200 px-6 py-3.5 text-xs font-bold text-black text-center shadow-lg transition-all"
              >
                Book Parking Slot
              </Link>
              <button
                onClick={handleBecomePartner}
                className="rounded border border-neutral-800 hover:border-neutral-750 bg-neutral-900/50 hover:bg-neutral-900 px-6 py-3.5 text-xs font-bold text-neutral-300 transition-all cursor-pointer"
              >
                Become Parking Partner
              </button>
            </div>
          </div>

          {/* Right Column: Premium Dashboard Preview */}
          <div className="lg:col-span-6 flex justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative w-full max-w-[520px] rounded-2xl border border-neutral-800 bg-neutral-950 p-6 flex flex-col justify-between overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-neutral-900 pb-3 mb-4">
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Console // Operations</span>
                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded">
                  System Nominal
                </span>
              </div>

              {/* Minimalist City Grid Map Illustration */}
              <div className="h-48 w-full bg-neutral-900/40 rounded-xl border border-neutral-800/80 relative flex items-center justify-center overflow-hidden">
                <svg className="absolute inset-0 h-full w-full opacity-30 stroke-neutral-800 stroke-[1]" fill="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="40" x2="100%" y2="40" />
                  <line x1="0" y1="80" x2="100%" y2="80" />
                  <line x1="0" y1="120" x2="100%" y2="120" />
                  <line x1="0" y1="160" x2="100%" y2="160" />
                  <line x1="40" y1="0" x2="40" y2="100%" />
                  <line x1="120" y1="0" x2="120" y2="100%" />
                  <line x1="200" y1="0" x2="200" y2="100%" />
                  <line x1="280" y1="0" x2="280" y2="100%" />
                  <line x1="360" y1="0" x2="360" y2="100%" />
                  {/* Diagonal connector lines */}
                  <line x1="40" y1="40" x2="200" y2="120" stroke="rgba(255,255,255,0.05)" />
                </svg>

                {/* Simulated Target Points */}
                <div className="absolute top-10 left-32 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-neutral-600" />
                  <span className="text-[9px] font-mono text-neutral-500">Node_01</span>
                </div>
                
                <div className="absolute top-28 left-48 flex flex-col items-center">
                  <span className="h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
                  <span className="text-[9px] font-mono text-emerald-450 mt-1 font-bold">Bay A-04 (Reserved)</span>
                </div>

                <div className="absolute top-16 right-20 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-neutral-600" />
                  <span className="text-[9px] font-mono text-neutral-500">Node_02</span>
                </div>
              </div>

              {/* Status details */}
              <div className="grid grid-cols-3 gap-4 border-t border-neutral-900 pt-4 mt-4 text-xs font-mono">
                <div>
                  <div className="text-[8px] text-neutral-500 uppercase font-bold tracking-widest">Active Bay</div>
                  <div className="text-white font-bold mt-0.5">A-04</div>
                </div>
                <div>
                  <div className="text-[8px] text-neutral-500 uppercase font-bold tracking-widest">Rate</div>
                  <div className="text-white font-bold mt-0.5">₹120/hr</div>
                </div>
                <div className="text-right">
                  <div className="text-[8px] text-neutral-500 uppercase font-bold tracking-widest">Security</div>
                  <div className="text-emerald-500 font-bold mt-0.5">Verified</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8 border-t border-neutral-900 bg-neutral-950/40">
        <div className="text-left max-w-2xl mb-16 space-y-2">
          <h2 className="font-outfit text-2xl font-bold tracking-tight text-white sm:text-3xl">System Methodology</h2>
          <p className="text-neutral-400 text-xs leading-relaxed">
            Four simple steps to transition from street cruising to structured parking arrivals.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-xl border border-neutral-900 bg-neutral-950/20 hover:border-neutral-800 transition-all duration-300 group"
            >
              <div className="text-xs font-mono font-bold text-neutral-600 mb-4 tracking-widest">
                STAGE_0{idx + 1}
              </div>
              <h3 className="text-xs font-bold text-white mb-2 uppercase tracking-wider">{step.title}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose ParkEase */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
        <div className="text-left max-w-2xl mb-16 space-y-2">
          <h2 className="font-outfit text-2xl font-bold tracking-tight text-white sm:text-3xl">Operational Efficiency</h2>
          <p className="text-neutral-400 text-xs leading-relaxed">
            Features engineered to optimize spatial utility and time resources.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div 
                key={idx}
                className="p-6 rounded-xl border border-neutral-900 bg-neutral-950 hover:border-neutral-850 hover:bg-neutral-900/10 transition-all duration-300 group"
              >
                <div className="h-9 w-9 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 mb-4">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-xs font-bold text-white mb-2 uppercase tracking-wider">{feature.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Live Statistics Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 bg-neutral-950/80 border border-neutral-900 rounded-2xl my-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 text-center">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="space-y-2">
                <div className="flex justify-center">
                  <div className="p-2 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-white tracking-tight font-outfit">
                  {stat.value}
                </div>
                <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8 border-t border-neutral-900">
        <div className="text-left max-w-2xl mb-16 space-y-2">
          <h2 className="font-outfit text-2xl font-bold tracking-tight text-white sm:text-3xl">Corporate Feedback</h2>
          <p className="text-neutral-400 text-xs leading-relaxed">
            Reviews from enterprise facility coordinators and fleet operators.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((test, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-xl border border-neutral-900 bg-neutral-950/20 flex flex-col justify-between"
            >
              <p className="text-xs text-neutral-300 italic leading-relaxed">
                "{test.text}"
              </p>

              <div className="flex items-center gap-3 mt-6 border-t border-neutral-900 pt-4">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-400">
                  {test.avatar}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">{test.name}</h4>
                  <p className="text-[10px] text-neutral-500">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { ParkingSquare, Globe, Share2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-neutral-900 bg-[#0A0A0A] text-neutral-500">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
          
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-white text-black">
                <ParkingSquare className="h-4.5 w-4.5 stroke-[2.5]" />
              </div>
              <span className="font-outfit text-sm font-bold tracking-wider text-white uppercase">
                ParkEase
              </span>
            </div>
            <p className="text-xs leading-relaxed text-neutral-500">
              Structured reservation platform for municipal and commercial parking infrastructure. Reserve secure slots before arriving.
            </p>
            <div className="flex space-x-3.5 pt-1">
              <a href="#" className="text-neutral-500 hover:text-white transition-colors"><Globe className="h-4 w-4" /></a>
              <a href="#" className="text-neutral-500 hover:text-white transition-colors"><Share2 className="h-4 w-4" /></a>
            </div>
          </div>

          {/* Links: Platform */}
          <div>
            <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 mb-4">Platform</h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/search" className="hover:text-white transition-colors">Explore Slots</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Driver Dashboard</Link></li>
              <li><Link to="/owner-dashboard" className="hover:text-white transition-colors">Host Console</Link></li>
              <li><Link to="/admin" className="hover:text-white transition-colors">System Admin</Link></li>
            </ul>
          </div>

          {/* Links: Company */}
          <div>
            <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 mb-4">Operational</h3>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">Security Standards</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
            </ul>
          </div>

          {/* Partner CTA */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">Join Infrastructure</h3>
            <p className="text-xs text-neutral-550 leading-relaxed">
              Monetize commercial vacancies by integrating your security gate with our API gateway.
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-neutral-600">
          <span>&copy; {new Date().getFullYear()} ParkEase Inc. All rights reserved.</span>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">Security Registry</a>
            <a href="#" className="hover:text-white transition-colors">Take-rate Audits</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

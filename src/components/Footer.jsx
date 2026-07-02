import React from 'react';
import { Link } from 'react-router-dom';
import { ParkingSquare, Globe, Share2, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950 text-gray-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Logo & Slogan */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <ParkingSquare className="h-5 w-5" />
              </div>
              <span className="font-outfit text-lg font-bold text-white">
                Park<span className="text-blue-500">Ease</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed">
              Premium smart parking reservation platform. Eliminate parking stress, avoid congested roads, and book guaranteed parking spaces instantly.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400 transition-colors"><Globe className="h-4 w-4" /></a>
              <a href="#" className="hover:text-blue-400 transition-colors"><Share2 className="h-4 w-4" /></a>
            </div>
          </div>

          {/* Links: Platform */}
          <div>
            <h3 className="font-semibold text-sm text-white mb-4 tracking-wider uppercase">Platform</h3>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/search" className="hover:text-white transition-colors">Find Parking Lots</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Driver Dashboard</Link></li>
              <li><Link to="/owner-dashboard" className="hover:text-white transition-colors">Owner Inventory</Link></li>
              <li><Link to="/admin" className="hover:text-white transition-colors">Partner Verification</Link></li>
            </ul>
          </div>

          {/* Links: Company */}
          <div>
            <h3 className="font-semibold text-sm text-white mb-4 tracking-wider uppercase">Company</h3>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press & Media</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sustainability</a></li>
            </ul>
          </div>

          {/* Newsletter / Join partner */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-white tracking-wider uppercase">Partner Program</h3>
            <p className="text-xs">
              Monetize your unused driveway or commercial lot by becoming a parking partner.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email to get details"
                className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
              <button className="flex items-center justify-center rounded-lg bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-500">
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <span>&copy; {new Date().getFullYear()} ParkEase Inc. All rights reserved.</span>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Security Standards</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

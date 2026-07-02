import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Search, SlidersHorizontal, Star, MapPin, Shield, Zap, Car,
  CircleDollarSign, ArrowUpDown, ChevronRight, Bookmark, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchPage() {
  const { parkingLots, toggleSaveLocation, savedLocations } = useApp();
  const navigate = useNavigate();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('distance'); // 'distance', 'price', 'rating'

  // Filter states
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [maxPrice, setMaxPrice] = useState(250);
  const [featuresFilter, setFeaturesFilter] = useState({
    covered: false,
    open: false,
    evCharging: false,
    cctv: false,
    valet: false
  });

  const handleFeatureToggle = (feature) => {
    setFeaturesFilter(prev => ({ ...prev, [feature]: !prev[feature] }));
  };

  // Filter lots
  const filteredLots = useMemo(() => {
    return parkingLots
      .filter(lot => lot.verified) // Only verified lots on search
      .filter(lot => {
        // Search query check
        const matchesSearch = lot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              lot.address.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Price check
        const matchesPrice = lot.price <= maxPrice;

        // Features check
        const matchesCovered = !featuresFilter.covered || lot.features.covered;
        const matchesOpen = !featuresFilter.open || lot.features.open;
        const matchesEV = !featuresFilter.evCharging || lot.features.evCharging;
        const matchesCCTV = !featuresFilter.cctv || lot.features.cctv;
        const matchesValet = !featuresFilter.valet || lot.features.valet;

        return matchesSearch && matchesPrice && matchesCovered && matchesOpen && matchesEV && matchesCCTV && matchesValet;
      })
      .sort((a, b) => {
        if (sortBy === 'distance') {
          return parseFloat(a.distance) - parseFloat(b.distance);
        }
        if (sortBy === 'price') {
          return a.price - b.price;
        }
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        return 0;
      });
  }, [parkingLots, searchQuery, maxPrice, featuresFilter, sortBy]);

  const resetFilters = () => {
    setMaxPrice(250);
    setFeaturesFilter({
      covered: false,
      open: false,
      evCharging: false,
      cctv: false,
      valet: false
    });
    setSearchQuery('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-gray-950 min-h-screen text-white">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-outfit text-2xl font-bold tracking-tight text-white sm:text-3xl">Find Parking Slots</h1>
          <p className="text-xs text-gray-400 mt-1">Discover and book premium parking spaces in your city</p>
        </div>

        {/* Sort & Quick actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-900 px-3 py-2">
            <ArrowUpDown className="h-3.5 w-3.5 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-semibold text-gray-300 outline-none cursor-pointer"
            >
              <option value="distance" className="bg-gray-900 text-white">Sort by Distance</option>
              <option value="price" className="bg-gray-900 text-white">Sort by Price</option>
              <option value="rating" className="bg-gray-900 text-white">Sort by Rating</option>
            </select>
          </div>

          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="md:hidden flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-900 px-3 py-2 text-xs font-semibold text-gray-300"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar Filters (Desktop) */}
        <div className="hidden md:block lg:col-span-3 rounded-2xl border border-gray-800 bg-gray-900/40 p-5 backdrop-blur-sm sticky top-24">
          <div className="flex items-center justify-between border-b border-gray-800/80 pb-4 mb-5">
            <span className="font-semibold text-sm text-white flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-blue-500" /> Filters
            </span>
            <button onClick={resetFilters} className="text-xs text-gray-500 hover:text-blue-400 transition-colors">
              Reset
            </button>
          </div>

          {/* Search bar */}
          <div className="space-y-4 mb-6">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Destination</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search street, building..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-800 bg-gray-950 pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Max Price / Hr</label>
              <span className="text-xs font-mono font-bold text-blue-400">₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min="30"
              max="300"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
              className="w-full h-1 bg-gray-850 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Features Checkbox list */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Amenities</label>
            
            <label className="flex items-center gap-2.5 cursor-pointer group text-xs text-gray-400 hover:text-white">
              <input
                type="checkbox"
                checked={featuresFilter.covered}
                onChange={() => handleFeatureToggle('covered')}
                className="h-4 w-4 rounded border-gray-800 bg-gray-950 text-blue-600 focus:ring-0 cursor-pointer"
              />
              <span>Covered Parking</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer group text-xs text-gray-400 hover:text-white">
              <input
                type="checkbox"
                checked={featuresFilter.open}
                onChange={() => handleFeatureToggle('open')}
                className="h-4 w-4 rounded border-gray-800 bg-gray-950 text-blue-600 focus:ring-0 cursor-pointer"
              />
              <span>Open Parking Lot</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer group text-xs text-gray-400 hover:text-white">
              <input
                type="checkbox"
                checked={featuresFilter.evCharging}
                onChange={() => handleFeatureToggle('evCharging')}
                className="h-4 w-4 rounded border-gray-800 bg-gray-950 text-blue-600 focus:ring-0 cursor-pointer"
              />
              <span>EV Charging Station</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer group text-xs text-gray-400 hover:text-white">
              <input
                type="checkbox"
                checked={featuresFilter.cctv}
                onChange={() => handleFeatureToggle('cctv')}
                className="h-4 w-4 rounded border-gray-800 bg-gray-950 text-blue-600 focus:ring-0 cursor-pointer"
              />
              <span>CCTV Monitoring</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer group text-xs text-gray-400 hover:text-white">
              <input
                type="checkbox"
                checked={featuresFilter.valet}
                onChange={() => handleFeatureToggle('valet')}
                className="h-4 w-4 rounded border-gray-800 bg-gray-950 text-blue-600 focus:ring-0 cursor-pointer"
              />
              <span>Valet Parking</span>
            </label>
          </div>
        </div>

        {/* Mobile Filters Panel */}
        <AnimatePresence>
          {showFiltersMobile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden lg:col-span-3 rounded-2xl border border-gray-800 bg-gray-900 p-5 mb-4"
            >
              <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
                <span className="font-semibold text-sm">Filters</span>
                <button onClick={resetFilters} className="text-xs text-gray-500 hover:text-blue-400">Reset</button>
              </div>

              <div className="space-y-4">
                {/* Search */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Destination</label>
                  <input
                    type="text"
                    placeholder="Search street, building..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-xs text-white focus:outline-none mt-1"
                  />
                </div>

                {/* Price */}
                <div>
                  <div className="flex justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Max Price</label>
                    <span className="text-xs font-bold text-blue-400">₹{maxPrice}</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="300"
                    step="10"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                    className="w-full accent-blue-500 mt-1"
                  />
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {Object.keys(featuresFilter).map((f) => (
                    <button
                      key={f}
                      onClick={() => handleFeatureToggle(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                        featuresFilter[f] 
                          ? 'bg-blue-600/10 text-blue-400 border-blue-500/30' 
                          : 'border-gray-850 bg-gray-950 text-gray-400'
                      }`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1).replace('Charging', ' Charging')}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Listings Grid */}
        <div className="lg:col-span-9">
          {filteredLots.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-800 bg-gray-900/10 p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-gray-500 mb-4 border border-gray-800">
                <Car className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-base text-white">No parking lots found</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1.5">
                We couldn't find any parking slots matching your active filters. Try expanding your search or pricing limits.
              </p>
              <button
                onClick={resetFilters}
                className="mt-5 rounded-xl border border-gray-800 bg-gray-900 px-4 py-2 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredLots.map((lot, idx) => {
                const isSaved = savedLocations.includes(lot.id);
                return (
                  <motion.div
                    key={lot.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="group relative rounded-2xl border border-gray-850 bg-gray-900/30 overflow-hidden flex flex-col justify-between hover:border-gray-700/80 transition-all duration-300"
                  >
                    {/* Header Image */}
                    <div className="relative h-44 w-full bg-gray-950 overflow-hidden">
                      <img
                        src={lot.image}
                        alt={lot.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
                      
                      {/* Price Badge */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-lg bg-gray-950/80 backdrop-blur-md border border-white/5 px-2 py-1">
                        <CircleDollarSign className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-xs font-bold text-white">₹{lot.price}/hr</span>
                      </div>

                      {/* Distance Badge */}
                      <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-lg bg-blue-600/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                        {lot.distance}
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleSaveLocation(lot.id); }}
                        className="absolute top-3 right-3 rounded-lg bg-gray-950/70 p-1.5 text-gray-400 hover:text-rose-500 transition-colors duration-200 border border-white/5 backdrop-blur-md"
                      >
                        <Heart className={`h-4 w-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                    </div>

                    {/* Content details */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-base text-white group-hover:text-blue-400 transition-colors">
                            {lot.name}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                            <span>{lot.rating}</span>
                          </div>
                        </div>

                        <p className="text-[11px] text-gray-400 flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                          <span className="truncate">{lot.address}</span>
                        </p>

                        {/* Amenities pills */}
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {lot.features.evCharging && (
                            <span className="flex items-center gap-1 rounded bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-blue-400">
                              <Zap className="h-2.5 w-2.5" /> EV
                            </span>
                          )}
                          {lot.features.cctv && (
                            <span className="flex items-center gap-1 rounded bg-gray-800 border border-gray-700 px-1.5 py-0.5 text-[9px] font-semibold text-gray-400">
                              <Shield className="h-2.5 w-2.5" /> CCTV
                            </span>
                          )}
                          {lot.features.valet && (
                            <span className="flex items-center gap-1 rounded bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-purple-400">
                              Valet
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between border-t border-gray-850 pt-4 mt-4">
                        <div className="text-left">
                          <div className="text-[9px] font-bold uppercase tracking-wider text-gray-500">Live Availability</div>
                          <div className="flex items-center gap-1">
                            <span className={`h-1.5 w-1.5 rounded-full ${lot.availableSlotsCount > 3 ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                            <span className={`text-xs font-bold ${lot.availableSlotsCount > 3 ? 'text-emerald-400' : 'text-amber-400'}`}>
                              {lot.availableSlotsCount} slots available
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => navigate(`/parking/${lot.id}`)}
                          className="flex items-center gap-1 rounded-xl bg-gray-900 border border-gray-800 hover:border-blue-500/40 hover:bg-gray-800 hover:text-white px-3 py-2 text-xs font-bold text-gray-300 transition-all"
                        >
                          <span>Reserve Spot</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

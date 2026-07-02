import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Search, SlidersHorizontal, Star, MapPin, Shield, Zap, Car,
  CircleDollarSign, ArrowUpDown, ChevronRight, Heart, Sparkles, Navigation
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
    <div className="relative min-h-screen bg-[#02040a] text-white">
      {/* Background ambient light */}
      <div className="absolute top-0 right-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 h-[400px] w-[400px] rounded-full bg-purple-600/5 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 relative">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1 text-xs font-bold text-blue-400">
              <Sparkles className="h-3.5 w-3.5" /> Direct Access Confirmed
            </div>
            <h1 className="font-outfit text-3xl font-extrabold tracking-tight sm:text-4xl">Find Parking Slots</h1>
            <p className="text-sm text-gray-400">Discover and book premium parking spaces in your city instantly.</p>
          </div>

          {/* Sort Menu */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2.5 shadow-lg">
              <ArrowUpDown className="h-4 w-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-bold text-gray-300 outline-none cursor-pointer"
              >
                <option value="distance" className="bg-gray-950 text-white">Sort by Distance</option>
                <option value="price" className="bg-gray-950 text-white">Sort by Price</option>
                <option value="rating" className="bg-gray-950 text-white">Sort by Rating</option>
              </select>
            </div>

            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="md:hidden flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2.5 text-xs font-bold text-gray-300"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Filters (Desktop) */}
          <div className="hidden md:block lg:col-span-3 rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl sticky top-28 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <span className="font-bold text-sm text-white flex items-center gap-2">
                <SlidersHorizontal className="h-4.5 w-4.5 text-blue-500" /> Search Filters
              </span>
              <button onClick={resetFilters} className="text-xs font-bold text-gray-400 hover:text-blue-400 transition-colors cursor-pointer">
                Reset
              </button>
            </div>

            {/* Search destination */}
            <div className="space-y-2 mb-6">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Destination</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search street, building..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-white/5 bg-[#02040a]/65 pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:border-blue-500/60 focus:outline-none"
                />
              </div>
            </div>

            {/* Price slider */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Max Price / Hr</label>
                <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/5 px-2 py-0.5 rounded border border-blue-500/10">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="30"
                max="300"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Features list */}
            <div className="space-y-4">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block">Amenities</label>
              
              <div className="space-y-3">
                {[
                  { key: 'covered', label: 'Covered Parking' },
                  { key: 'open', label: 'Open Parking Lot' },
                  { key: 'evCharging', label: 'EV Charging Station' },
                  { key: 'cctv', label: 'CCTV Monitoring' },
                  { key: 'valet', label: 'Valet Parking' }
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-3 cursor-pointer group text-xs text-gray-400 hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      checked={featuresFilter[item.key]}
                      onChange={() => handleFeatureToggle(item.key)}
                      className="h-4.5 w-4.5 rounded border-white/10 bg-white/[0.02] text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span className="font-semibold">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Filters Panel */}
          <AnimatePresence>
            {showFiltersMobile && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden rounded-2xl border border-white/5 bg-white/[0.02] p-5 mb-6 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                  <span className="font-bold text-sm">Filters</span>
                  <button onClick={resetFilters} className="text-xs font-bold text-gray-400">Reset</button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Destination</label>
                    <input
                      type="text"
                      placeholder="Search street, building..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-white/5 bg-[#02040a]/65 px-4.5 py-2.5 text-xs text-white focus:outline-none mt-1"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Max Price</label>
                      <span className="text-xs font-bold text-blue-450">₹{maxPrice}</span>
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

                  <div className="flex flex-wrap gap-2 pt-2">
                    {Object.keys(featuresFilter).map((f) => (
                      <button
                        key={f}
                        onClick={() => handleFeatureToggle(f)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                          featuresFilter[f] 
                            ? 'bg-blue-600/10 text-blue-400 border-blue-500/30' 
                            : 'border-white/5 bg-white/[0.02] text-gray-400'
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
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.01] p-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.02] text-gray-500 mb-6 border border-white/5">
                  <Car className="h-6 w-6" />
                </div>
                <h3 className="font-outfit text-lg font-bold text-white">No parking lots found</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-2 leading-relaxed">
                  We couldn't find any verified spaces matching your active filter settings. Try expanding your search pricing range or amenities.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-6 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 px-5 py-2.5 text-xs font-bold text-gray-300 hover:text-white transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredLots.map((lot, idx) => {
                  const isSaved = savedLocations.includes(lot.id);
                  return (
                    <motion.div
                      key={lot.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                      className="group relative rounded-3xl border border-white/5 bg-white/[0.01] overflow-hidden flex flex-col justify-between hover:border-blue-500/25 transition-all duration-500 shadow-xl"
                    >
                      {/* Image & overlay info */}
                      <div className="relative h-56 w-full bg-[#02040a] overflow-hidden">
                        <img
                          src={lot.image}
                          alt={lot.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#02040a] via-[#02040a]/40 to-transparent" />
                        
                        {/* Price Badge */}
                        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-xl bg-gray-950/80 backdrop-blur-xl border border-white/10 px-3 py-1.5">
                          <span className="text-sm font-extrabold text-white">₹{lot.price}</span>
                          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">/ hr</span>
                        </div>

                        {/* Distance Badge */}
                        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-xl bg-blue-600/90 backdrop-blur-xl border border-white/10 px-3 py-1.5 text-[10px] font-extrabold text-white tracking-widest uppercase">
                          <Navigation className="h-3 w-3" /> {lot.distance}
                        </div>

                        {/* Starred Button */}
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleSaveLocation(lot.id); }}
                          className="absolute top-4 right-4 rounded-xl bg-gray-950/60 p-2.5 text-gray-400 hover:text-rose-500 transition-colors border border-white/5 backdrop-blur-xl cursor-pointer"
                        >
                          <Heart className={`h-4.5 w-4.5 transition-colors ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                      </div>

                      {/* Info details */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-outfit text-lg font-bold text-white group-hover:text-blue-450 transition-colors">
                              {lot.name}
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-amber-500 font-bold bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10 shadow-sm">
                              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                              <span>{lot.rating}</span>
                            </div>
                          </div>

                          <p className="text-xs text-gray-400 flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-gray-500 shrink-0" />
                            <span className="truncate">{lot.address}</span>
                          </p>

                          {/* Amenity tags */}
                          <div className="flex flex-wrap gap-2 pt-2">
                            {lot.features.evCharging && (
                              <span className="flex items-center gap-1 rounded-lg bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 text-[10px] font-bold text-blue-400">
                                <Zap className="h-3 w-3" /> EV Charging
                              </span>
                            )}
                            {lot.features.cctv && (
                              <span className="flex items-center gap-1 rounded-lg bg-white/[0.02] border border-white/5 px-2.5 py-1 text-[10px] font-bold text-gray-400">
                                <Shield className="h-3 w-3" /> CCTV Secure
                              </span>
                            )}
                            {lot.features.valet && (
                              <span className="flex items-center gap-1 rounded-lg bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 text-[10px] font-bold text-purple-400">
                                Valet
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Bottom reservation section */}
                        <div className="flex items-center justify-between border-t border-white/5 pt-5 mt-6">
                          <div>
                            <div className="text-[9px] font-extrabold uppercase tracking-wider text-gray-500">Live Capacity</div>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className={`h-2 w-2 rounded-full ${lot.availableSlotsCount > 3 ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                              <span className={`text-xs font-bold ${lot.availableSlotsCount > 3 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {lot.availableSlotsCount} slots left
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => navigate(`/parking/${lot.id}`)}
                            className="flex items-center gap-1 rounded-xl bg-white/[0.02] border border-white/5 hover:border-blue-500/40 hover:bg-blue-600/15 hover:text-blue-400 px-4.5 py-2.5 text-xs font-extrabold text-gray-300 transition-all cursor-pointer"
                          >
                            <span>Inspect Slots</span>
                            <ChevronRight className="h-4 w-4" />
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
    </div>
  );
}

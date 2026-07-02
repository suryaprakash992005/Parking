import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Search, MapPin, Zap, Shield, Star, Navigation, Filter, Calendar, Car, Clock, ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SearchPage() {
  const { parkingLots, toggleSaveLocation, savedLocations } = useApp();
  const navigate = useNavigate();

  // Search filter parameters
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('12:00');
  const [vehicle, setVehicle] = useState('Sedan');

  // Filter chips
  const [filters, setFilters] = useState({
    covered: false,
    evCharging: false,
    cctv: false,
    valet: false,
    open: false
  });

  const toggleFilter = (key) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter listings
  const filteredLots = useMemo(() => {
    return parkingLots
      .filter(lot => lot.verified)
      .filter(lot => {
        const matchesDest = lot.name.toLowerCase().includes(destination.toLowerCase()) ||
                            lot.address.toLowerCase().includes(destination.toLowerCase());

        const matchesCovered = !filters.covered || lot.features.covered;
        const matchesEV = !filters.evCharging || lot.features.evCharging;
        const matchesCCTV = !filters.cctv || lot.features.cctv;
        const matchesValet = !filters.valet || lot.features.valet;

        return matchesDest && matchesCovered && matchesEV && matchesCCTV && matchesValet;
      });
  }, [parkingLots, destination, filters]);

  // Map Pins Coordinates & Details (simulated Google Maps)
  const mapPins = [
    { name: 'City Mall Parking', x: '35%', y: '25%', slots: 6, price: '₹120', eta: '12 mins' },
    { name: 'Metro Parking Zone', x: '55%', y: '45%', slots: 4, price: '₹80', eta: '6 mins' },
    { name: 'Airport Parking Complex', x: '20%', y: '70%', slots: 5, price: '₹40', eta: '25 mins' },
    { name: 'Hospital Parking', x: '75%', y: '30%', slots: 2, price: '₹90', eta: '14 mins' },
    { name: 'Office complex Area', x: '45%', y: '65%', slots: 3, price: '₹180', eta: '8 mins' }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-800 flex flex-col">
      
      {/* Top Search bar wrapper */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm relative z-10">
        <div className="mx-auto max-w-7xl flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* Inputs Bar */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Where are you going?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 pl-10 pr-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
            
            <div className="relative">
              <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 pl-10 pr-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div className="relative">
              <Clock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 pl-10 pr-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div className="relative">
              <Car className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <select
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 pl-10 pr-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 focus:bg-white cursor-pointer"
              >
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Hatchback">Hatchback</option>
                <option value="EV-Charging">EV (Charging Slot)</option>
              </select>
            </div>
          </div>

          {/* Action Filters Trigger */}
          <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {[
              { key: 'covered', label: 'Covered' },
              { key: 'evCharging', label: 'EV Station' },
              { key: 'cctv', label: 'CCTV Secure' },
              { key: 'valet', label: 'Valet' }
            ].map(f => (
              <button
                key={f.key}
                onClick={() => toggleFilter(f.key)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  filters[f.key]
                    ? 'bg-blue-550 border-blue-600 text-white shadow-sm'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Main split content */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        
        {/* Left Side: Parking Cards list */}
        <div className="w-full md:w-[50%] p-6 overflow-y-auto max-h-[calc(100vh-8.5rem)] space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-outfit text-sm font-bold uppercase tracking-wider text-gray-500">
              Verified Complexes ({filteredLots.length})
            </h2>
          </div>

          {filteredLots.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center bg-white">
              <p className="text-xs text-gray-400">No properties matched your search parameters.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredLots.map(lot => {
                const isSaved = savedLocations.includes(lot.id);
                return (
                  <div 
                    key={lot.id}
                    className="consumer-card p-4 flex flex-col sm:flex-row gap-5 hover:border-gray-300 hover:shadow-lg transition-all"
                  >
                    {/* Visual Card Image */}
                    <div className="w-full sm:w-44 h-32 rounded-xl bg-gray-100 overflow-hidden relative shrink-0">
                      <img
                        src={lot.image}
                        alt={lot.name}
                        className="h-full w-full object-cover"
                      />
                      
                      {/* Price tag overlay */}
                      <div className="absolute bottom-2 left-2 rounded-lg bg-gray-950/80 px-2 py-1 text-[11px] font-bold text-white">
                        ₹{lot.price}/hr
                      </div>
                    </div>

                    {/* Card Content details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-start">
                          <h3 className="font-outfit text-base font-bold text-gray-900 leading-tight">
                            {lot.name}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-100 shadow-sm shrink-0">
                            <Star className="h-3.5 w-3.5 fill-amber-500" />
                            <span>{lot.rating}</span>
                          </div>
                        </div>

                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-gray-400" /> {lot.address}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1 text-[9px] font-bold text-gray-500 uppercase">
                          {lot.features.evCharging && <span className="bg-blue-50 border border-blue-100 px-2 py-0.5 rounded text-blue-600">EV Station</span>}
                          {lot.features.cctv && <span className="bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded text-emerald-600">CCTV Secure</span>}
                          {lot.features.valet && <span className="bg-gray-100 px-2 py-0.5 rounded">Valet</span>}
                        </div>
                      </div>

                      {/* Action footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                        <div className="text-[11px]">
                          <span className="text-gray-400 block font-medium">Live Availability</span>
                          <strong className="text-emerald-600 font-bold">{lot.availableSlotsCount} slots free</strong>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/parking/${lot.id}`)}
                            className="btn-consumer-primary px-4 py-2 text-xs font-bold rounded-lg shadow-sm"
                          >
                            <span>Inspect & Book</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Map Experience */}
        <div className="hidden md:block flex-1 bg-gray-200 relative border-l border-gray-200 overflow-hidden">
          {/* Simulated Map Canvas */}
          <div className="absolute inset-0 bg-neutral-100 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:30px_30px]" />
          
          {/* Drawing Simulated Roads */}
          <div className="absolute top-1/3 left-0 right-0 h-10 bg-white border-y border-gray-300" />
          <div className="absolute top-2/3 left-0 right-0 h-10 bg-white border-y border-gray-300" />
          <div className="absolute top-0 bottom-0 left-1/4 w-10 bg-white border-x border-gray-300" />
          <div className="absolute top-0 bottom-0 left-2/3 w-10 bg-white border-x border-gray-300" />

          {/* Interactive Google Map Pins */}
          {mapPins.map((pin, idx) => (
            <motion.div
              key={idx}
              className="absolute map-pin-bounce"
              style={{ left: pin.x, top: pin.y }}
            >
              <div className="relative group cursor-pointer">
                {/* Pin element */}
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 border-2 border-white text-white shadow-lg">
                  <Navigation className="h-3 w-3 stroke-[2.5]" />
                </div>
                
                {/* Overlay Card Details */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-36 rounded-xl border border-gray-200 bg-white p-2.5 shadow-xl space-y-1.5 opacity-90 transition-opacity hover:opacity-100 z-10">
                  <span className="font-outfit text-[10px] font-bold text-gray-900 block truncate">{pin.name}</span>
                  <div className="flex justify-between items-center text-[9px] font-mono text-gray-500 font-bold border-t border-gray-100 pt-1">
                    <span className="text-blue-600 font-bold">{pin.price}/hr</span>
                    <span className="text-emerald-600">{pin.slots} free</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}

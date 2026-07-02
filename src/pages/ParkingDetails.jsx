import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Star, MapPin, Zap, ShieldCheck, Clock, Shield, Flame,
  Sparkles, Calendar, User, CreditCard, HelpCircle, ArrowLeft,
  ChevronRight, Car
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ParkingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { parkingLots } = useApp();

  const lot = useMemo(() => {
    return parkingLots.find(l => l.id === id);
  }, [parkingLots, id]);

  if (!lot) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-white">
        <h2 className="text-xl font-bold">Parking Lot Not Found</h2>
        <button onClick={() => navigate('/search')} className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold">
          Back to Search
        </button>
      </div>
    );
  }

  // Booking Widget State
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingTime, setBookingTime] = useState('12:00');
  const [duration, setDuration] = useState(2); // hours
  const [vehicleType, setVehicleType] = useState('Sedan');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Derived Values
  const totalPrice = lot.price * duration;

  const handleSlotSelect = (slot) => {
    if (slot.status !== 'Available' && slot.status !== 'EV-Charging') return; // Cannot book occupied or already reserved
    setSelectedSlot(slot);
    setErrorMsg('');
  };

  const handleProceedToBooking = () => {
    if (!selectedSlot) {
      setErrorMsg('Please select a parking slot on the grid first.');
      return;
    }
    if (!vehiclePlate.trim()) {
      setErrorMsg('Please enter your vehicle license plate number.');
      return;
    }

    // Pass booking details to checkout state
    navigate(`/booking-flow`, {
      state: {
        lotId: lot.id,
        lotName: lot.name,
        slotId: selectedSlot.id,
        date: bookingDate,
        time: bookingTime,
        duration,
        vehicleType,
        vehiclePlate: vehiclePlate.toUpperCase(),
        amount: totalPrice
      }
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-gray-950 min-h-screen text-white">
      {/* Back button */}
      <button
        onClick={() => navigate('/search')}
        className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Search
      </button>

      {/* Main Grid split: Details & Live Layout vs Booking Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Photos, Amenities, and Interactive Live Grid */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Header & Banner */}
          <div className="space-y-4">
            <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-gray-800">
              <img
                src={lot.image}
                alt={lot.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-outfit text-2xl font-bold tracking-tight">{lot.name}</h1>
                <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-gray-500 shrink-0" /> {lot.address}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-gray-800 bg-gray-900 px-3 py-2 text-center">
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Rating</div>
                  <div className="flex items-center gap-1 text-sm font-bold text-amber-500 mt-0.5 justify-center">
                    <Star className="h-3.5 w-3.5 fill-amber-500" />
                    <span>{lot.rating}</span>
                  </div>
                </div>
                <div className="rounded-xl border border-gray-800 bg-gray-900 px-3 py-2 text-center">
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Distance</div>
                  <div className="text-sm font-bold text-blue-400 mt-0.5">{lot.distance}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Tabs Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-2xl border border-gray-900 bg-gray-900/40 p-6 backdrop-blur-sm">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3.5">Pricing & Opening Hours</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-850">
                  <span className="text-gray-400">Rate per hour</span>
                  <span className="font-bold text-white">₹{lot.price}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-850">
                  <span className="text-gray-400">Opening Hours</span>
                  <span className="font-bold text-white">24 / 7 Available</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-850">
                  <span className="text-gray-400">Grace Period</span>
                  <span className="font-bold text-blue-400">10 Minutes free exit</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3.5">Security Features</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>CCTV Surveillance</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Barrier Control</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>On-site Patrol</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Licensed Attendant</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Live Slot Grid Layout */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Select Parking Space</h3>
                <p className="text-xs text-gray-400 mt-0.5">Click on an available (blue/gray) spot below to reserve it.</p>
              </div>
              
              <div className="flex items-center gap-3 text-[10px] font-semibold text-gray-400 bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-lg">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-gray-700" /> Standard</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-blue-500" /> EV</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-purple-500" /> Disabled</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-rose-950 border border-rose-500/30" /> Occupied</span>
              </div>
            </div>

            {/* Interactive Grid Map */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6 md:p-8 relative overflow-hidden shadow-inner">
              {/* Entrance indicator */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 bg-blue-600 px-4 py-1 rounded-b-lg text-[9px] font-bold uppercase tracking-widest text-white shadow-md z-10">
                Main Gate / Entry
              </div>

              {/* Slot grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
                {lot.slots.map((slot) => {
                  const isSelected = selectedSlot?.id === slot.id;
                  const isOccupied = slot.status === 'Occupied';
                  const isReserved = slot.status === 'Reserved';
                  const isEV = slot.type === 'EV-Charging';
                  const isDisabled = slot.type === 'Disabled';

                  let bgClass = 'bg-gray-800 border-gray-700 hover:border-blue-500/50 hover:bg-gray-750';
                  let textClass = 'text-gray-300';
                  let iconElement = null;

                  if (isOccupied) {
                    bgClass = 'bg-rose-950/20 border-rose-900/40 opacity-50 cursor-not-allowed';
                    textClass = 'text-rose-500/70';
                  } else if (isReserved) {
                    bgClass = 'bg-amber-950/20 border-amber-900/40 opacity-50 cursor-not-allowed';
                    textClass = 'text-amber-500/70';
                  } else if (isSelected) {
                    bgClass = 'bg-blue-600 border-blue-400 text-white pulse-glow';
                    textClass = 'text-white';
                  } else if (isEV) {
                    bgClass = 'bg-blue-950/20 border-blue-900/60 hover:bg-blue-900/20';
                    textClass = 'text-blue-400';
                    iconElement = <Zap className="h-3 w-3 shrink-0" />;
                  } else if (isDisabled) {
                    bgClass = 'bg-purple-950/20 border-purple-900/60 hover:bg-purple-900/20';
                    textClass = 'text-purple-400';
                  }

                  return (
                    <motion.button
                      key={slot.id}
                      whileHover={!isOccupied && !isReserved ? { scale: 1.02 } : {}}
                      onClick={() => handleSlotSelect(slot)}
                      className={`h-16 rounded-xl border flex flex-col items-center justify-between p-2 font-mono text-xs transition-all duration-200 ${bgClass}`}
                      disabled={isOccupied || isReserved}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-[10px] font-bold ${textClass}`}>{slot.label}</span>
                        {iconElement}
                      </div>

                      <div className="text-[9px] font-bold uppercase tracking-wider">
                        {isOccupied ? 'Occupied' : isReserved ? 'Reserved' : isSelected ? 'Selected' : 'Available'}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Grid guide markings */}
              <div className="mt-8 border-t border-dashed border-gray-800 pt-4 flex justify-between text-[10px] text-gray-500 font-mono">
                <span>[A-ZONE] COV DECK</span>
                <span>DRIVEWAY (ONE WAY)</span>
                <span>[B-ZONE] OPEN SLOTS</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Booking Widget Form */}
        <div className="lg:col-span-4 rounded-2xl border border-gray-800 bg-gray-900/40 p-6 backdrop-blur-sm sticky top-24">
          <h3 className="font-outfit text-lg font-bold border-b border-gray-800 pb-4 mb-4">Reservation Widget</h3>

          <div className="space-y-4">
            
            {/* Display Selected Slot info */}
            <div className="rounded-xl bg-gray-950 p-4 border border-gray-850 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Selected Space</span>
                <div className="text-sm font-bold font-mono mt-0.5 text-white">
                  {selectedSlot ? `${selectedSlot.label} (${selectedSlot.type})` : 'None Selected'}
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400">
                <Car className="h-5 w-5" />
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Choose Date</label>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none mt-1"
              />
            </div>

            {/* Time Selection */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Choose Arrival Time</label>
              <input
                type="time"
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none mt-1"
              />
            </div>

            {/* Duration Slider */}
            <div>
              <div className="flex justify-between">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Duration (Hours)</label>
                <span className="text-xs font-mono font-bold text-white">{duration} hrs</span>
              </div>
              <input
                type="range"
                min="1"
                max="24"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full accent-blue-500 mt-1 cursor-pointer"
              />
            </div>

            {/* Vehicle Details */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Vehicle Type</label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none mt-1"
              >
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Hatchback">Hatchback</option>
                <option value="EV-Chargable">EV (Charging Slot)</option>
                <option value="Motorcycle">Motorcycle</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">License Plate Number</label>
              <input
                type="text"
                placeholder="e.g. NY-K408L"
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
                className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none mt-1 placeholder-gray-600 font-mono uppercase"
              />
            </div>

            {/* Pricing Summary */}
            <div className="border-t border-gray-850 pt-4 mt-4 space-y-2 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Hourly Rate</span>
                <span>₹{lot.price}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Duration</span>
                <span>{duration} hrs</span>
              </div>
              <div className="flex justify-between font-bold text-white border-t border-gray-850 pt-2 text-sm">
                <span>Total Amount</span>
                <span className="text-emerald-400">₹{totalPrice}</span>
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">
                {errorMsg}
              </p>
            )}

            {/* Action button */}
            <button
              onClick={handleProceedToBooking}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 text-xs shadow-lg shadow-blue-600/20 hover:scale-102 active:scale-98 transition-all duration-300"
            >
              <span>Reserve Slot Now</span>
              <ChevronRight className="h-4 w-4" />
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

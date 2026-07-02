import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Star, MapPin, Zap, ShieldCheck, Clock, Shield,
  Calendar, User, ArrowLeft, ChevronRight, Car, Sparkles
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
    <div className="relative min-h-screen bg-[#02040a] text-white">
      {/* Ambient background glows */}
      <div className="absolute top-20 right-10 h-[500px] w-[500px] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 h-[400px] w-[400px] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 relative">
        {/* Back button */}
        <button
          onClick={() => navigate('/search')}
          className="inline-flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 px-4 py-2 text-xs font-bold text-gray-400 hover:text-white mb-8 transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Search
        </button>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Photos, Amenities, and Interactive Live Grid */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Header & Banner */}
            <div className="space-y-6">
              <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                <img
                  src={lot.image}
                  alt={lot.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#02040a] via-[#02040a]/30 to-transparent" />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-2">
                  <h1 className="font-outfit text-3xl font-extrabold tracking-tight sm:text-4xl">{lot.name}</h1>
                  <p className="text-xs text-gray-400 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500 shrink-0" /> {lot.address}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center min-w-[90px] shadow-lg">
                    <div className="text-[9px] text-gray-500 font-extrabold uppercase tracking-wider">Rating</div>
                    <div className="flex items-center gap-1 text-sm font-extrabold text-amber-500 mt-1 justify-center">
                      <Star className="h-4 w-4 fill-amber-500" />
                      <span>{lot.rating}</span>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center min-w-[90px] shadow-lg">
                    <div className="text-[9px] text-gray-500 font-extrabold uppercase tracking-wider">Distance</div>
                    <div className="text-sm font-extrabold text-blue-400 mt-1">{lot.distance}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-3xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl shadow-xl">
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Pricing & Hours</h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-gray-400 font-medium">Rate per hour</span>
                    <span className="font-bold text-white">₹{lot.price}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-gray-400 font-medium">Opening Hours</span>
                    <span className="font-bold text-white">24 / 7 Available</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-gray-400 font-medium">Grace Period</span>
                    <span className="font-bold text-blue-400">10 Minutes free exit</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Amenities & Safety</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2.5 text-xs text-gray-300">
                    <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                    <span className="font-semibold">CCTV Surveillance</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-gray-300">
                    <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                    <span className="font-semibold">Barrier Control</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-gray-300">
                    <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                    <span className="font-semibold">On-site Security</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-gray-300">
                    <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                    <span className="font-semibold">Licensed Guard</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Live Slot Grid Layout */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h3 className="font-outfit text-xl font-extrabold">Select Parking Space</h3>
                  <p className="text-xs text-gray-400 mt-1">Select an active (blue/gray) bay on the visual grid layout.</p>
                </div>
                
                <div className="flex flex-wrap gap-2 text-[9px] font-extrabold text-gray-400 bg-white/[0.02] border border-white/5 p-2 rounded-xl">
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded bg-gray-700" /> Standard</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded bg-blue-500" /> EV Charge</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded bg-purple-500" /> Disabled</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded bg-rose-950 border border-rose-500/20" /> Occupied</span>
                </div>
              </div>

              {/* Interactive Grid Map */}
              <div className="rounded-3xl border border-white/5 bg-white/[0.01] p-6 md:p-8 relative overflow-hidden shadow-2xl backdrop-blur-xl">
                {/* Gate Marker */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 bg-gradient-to-r from-blue-650 to-indigo-650 px-5 py-1.5 rounded-b-xl text-[9px] font-extrabold uppercase tracking-widest text-white shadow-md z-10">
                  Main Entry Gate
                </div>

                {/* Slot grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
                  {lot.slots.map((slot) => {
                    const isSelected = selectedSlot?.id === slot.id;
                    const isOccupied = slot.status === 'Occupied';
                    const isReserved = slot.status === 'Reserved';
                    const isEV = slot.type === 'EV-Charging';
                    const isDisabled = slot.type === 'Disabled';

                    let bgClass = 'bg-white/[0.02] border-white/5 hover:border-blue-550/40 hover:bg-white/[0.04] cursor-pointer';
                    let textClass = 'text-gray-300';
                    let iconElement = null;

                    if (isOccupied) {
                      bgClass = 'bg-rose-950/10 border-rose-900/30 opacity-40 cursor-not-allowed';
                      textClass = 'text-rose-500/50';
                    } else if (isReserved) {
                      bgClass = 'bg-amber-950/10 border-amber-900/30 opacity-40 cursor-not-allowed';
                      textClass = 'text-amber-500/50';
                    } else if (isSelected) {
                      bgClass = 'bg-blue-600 border-blue-450 text-white selected-slot-pulse';
                      textClass = 'text-white';
                    } else if (isEV) {
                      bgClass = 'bg-blue-950/20 border-blue-900/40 hover:bg-blue-900/20 hover:border-blue-500/40 cursor-pointer';
                      textClass = 'text-blue-400';
                      iconElement = <Zap className="h-3 w-3 shrink-0" />;
                    } else if (isDisabled) {
                      bgClass = 'bg-purple-950/20 border-purple-900/40 hover:bg-purple-900/20 hover:border-purple-500/40 cursor-pointer';
                      textClass = 'text-purple-400';
                    }

                    return (
                      <motion.button
                        key={slot.id}
                        whileHover={!isOccupied && !isReserved ? { scale: 1.03, y: -1 } : {}}
                        onClick={() => handleSlotSelect(slot)}
                        className={`h-20 rounded-2xl border flex flex-col items-center justify-between p-3 font-mono text-xs transition-all duration-300 ${bgClass}`}
                        disabled={isOccupied || isReserved}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className={`text-[10px] font-extrabold ${textClass}`}>{slot.label}</span>
                          {iconElement}
                        </div>

                        <div className="text-[8px] font-extrabold uppercase tracking-widest">
                          {isOccupied ? 'Occupied' : isReserved ? 'Reserved' : isSelected ? 'Selected' : slot.type}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Runway Line */}
                <div className="mt-8 border-t border-dashed border-white/5 pt-4 flex justify-between text-[9px] text-gray-500 font-mono tracking-wider">
                  <span>[SECTION-A]</span>
                  <span>ONE-WAY CAR PATHWAY</span>
                  <span>[SECTION-B]</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Booking Widget Form */}
          <div className="lg:col-span-4 rounded-3xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl sticky top-28 shadow-2xl">
            <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-5">
              <Sparkles className="h-4.5 w-4.5 text-blue-500" />
              <h3 className="font-outfit text-lg font-bold">Booking Details</h3>
            </div>

            <div className="space-y-5">
              
              {/* Display Selected Slot info */}
              <div className="rounded-2xl bg-[#02040a]/80 p-4 border border-white/5 flex items-center justify-between shadow-inner">
                <div>
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-gray-500">Selected Space</span>
                  <div className="text-sm font-extrabold font-mono mt-1 text-white">
                    {selectedSlot ? `${selectedSlot.label} (${selectedSlot.type})` : 'None Selected'}
                  </div>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Car className="h-5 w-5" />
                </div>
              </div>

              {/* Date Selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Arrival Date</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-xl border border-white/5 bg-[#02040a]/65 px-4 py-3 text-xs text-white focus:border-blue-500/60 focus:outline-none"
                />
              </div>

              {/* Time Selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Arrival Time</label>
                <input
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full rounded-xl border border-white/5 bg-[#02040a]/65 px-4 py-3 text-xs text-white focus:border-blue-500/60 focus:outline-none"
                />
              </div>

              {/* Duration Slider */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Duration</label>
                  <span className="text-xs font-mono font-bold text-blue-450">{duration} hours</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="24"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              {/* Vehicle Type */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Vehicle Category</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full rounded-xl border border-white/5 bg-[#02040a]/65 px-4 py-3 text-xs text-white focus:border-blue-500/60 focus:outline-none cursor-pointer"
                >
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="EV-Chargable">EV (Charging Slot)</option>
                  <option value="Motorcycle">Motorcycle</option>
                </select>
              </div>

              {/* License Plate */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">License Plate Number</label>
                <input
                  type="text"
                  placeholder="e.g. DL-3CA-1234"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                  className="w-full rounded-xl border border-white/5 bg-[#02040a]/65 px-4 py-3 text-xs text-white focus:border-blue-500/60 focus:outline-none placeholder-gray-600 font-mono uppercase"
                />
              </div>

              {/* Pricing Summary */}
              <div className="border-t border-white/5 pt-4 mt-5 space-y-2.5 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Hourly Rate</span>
                  <span>₹{lot.price}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Duration</span>
                  <span>{duration} hrs</span>
                </div>
                <div className="flex justify-between font-bold text-white border-t border-white/5 pt-3 text-sm">
                  <span>Total Est. Price</span>
                  <span className="text-emerald-450 text-base">₹{totalPrice}</span>
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
                className="w-full flex items-center justify-center gap-2 rounded-xl btn-primary-gradient py-3.5 text-xs font-bold text-white cursor-pointer shadow-lg"
              >
                <span>Proceed to Payment</span>
                <ChevronRight className="h-4 w-4" />
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

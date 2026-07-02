import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Star, MapPin, Zap, ShieldCheck, Clock, ArrowLeft, ChevronRight, Car, Sparkles
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
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-xl font-bold">Parking Lot Not Found</h2>
        <button onClick={() => navigate('/search')} className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white">
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
      setErrorMsg('Please select an active parking slot on the grid.');
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
    <div className="min-h-screen bg-[#FAFAFA] text-gray-800 pb-16">
      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8">
        
        {/* Back button */}
        <button
          onClick={() => navigate('/search')}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 px-4.5 py-2 text-xs font-bold text-gray-600 mb-8 transition-colors cursor-pointer shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Search
        </button>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Photos, Amenities, and Interactive Live Grid */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Header & Banner */}
            <div className="space-y-6">
              <div className="relative h-64 sm:h-[380px] w-full rounded-3xl overflow-hidden border border-gray-250 shadow-md">
                <img
                  src={lot.image}
                  alt={lot.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1.5">
                  <h1 className="font-outfit text-3xl font-extrabold tracking-tight text-gray-900">{lot.name}</h1>
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 shrink-0" /> {lot.address}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center min-w-[95px] shadow-sm">
                    <div className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider">Rating</div>
                    <div className="flex items-center gap-1 text-sm font-bold text-amber-500 mt-1 justify-center">
                      <Star className="h-4 w-4 fill-amber-500" />
                      <span>{lot.rating}</span>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center min-w-[95px] shadow-sm">
                    <div className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider">Distance</div>
                    <div className="text-sm font-bold text-blue-600 mt-1">{lot.distance}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Pricing & Hours</h3>
                <div className="space-y-3 text-xs text-gray-600">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium">Hourly Rate</span>
                    <span className="font-bold text-gray-950">₹{lot.price}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium">Opening Hours</span>
                    <span className="font-bold text-gray-950">24 / 7 Available</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium">Grace Period</span>
                    <span className="font-bold text-blue-600 font-bold">10 Minutes free exit</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Amenities & Safety</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2.5 text-xs text-gray-600">
                    <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span className="font-bold">CCTV Secure</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-gray-600">
                    <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span className="font-bold">Barrier Gates</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-gray-600">
                    <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span className="font-bold">On-Site Guard</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-gray-600">
                    <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span className="font-bold">Licensed Complex</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Live Slot Grid Layout */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h3 className="font-outfit text-xl font-extrabold text-gray-950">Select Parking Space</h3>
                  <p className="text-xs text-gray-500 mt-1">Select an active (blue/emerald) bay on the visual grid layout below.</p>
                </div>
                
                <div className="flex flex-wrap gap-2 text-[9px] font-bold text-gray-500 bg-white border border-gray-200 p-2.5 rounded-xl shadow-sm">
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded bg-gray-300" /> Standard</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded bg-emerald-500" /> EV Charge</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded bg-blue-500" /> Reserved</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded bg-rose-200 border border-rose-450" /> Occupied</span>
                </div>
              </div>

              {/* Interactive Grid Map */}
              <div className="rounded-3xl border border-gray-200 bg-white p-6 md:p-8 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 bg-blue-600 px-5 py-1.5 rounded-b-xl text-[9px] font-bold uppercase tracking-widest text-white shadow-md z-10">
                  Main Entry Gate
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
                  {lot.slots.map((slot) => {
                    const isSelected = selectedSlot?.id === slot.id;
                    const isOccupied = slot.status === 'Occupied';
                    const isReserved = slot.status === 'Reserved';
                    const isEV = slot.type === 'EV-Charging';
                    const isDisabled = slot.type === 'Disabled';

                    let bgClass = 'bg-gray-50 border-gray-200 hover:border-blue-500 hover:bg-white cursor-pointer';
                    let textClass = 'text-gray-700';
                    let iconElement = null;

                    if (isOccupied) {
                      bgClass = 'bg-rose-50 border-rose-200 opacity-50 cursor-not-allowed';
                      textClass = 'text-rose-500';
                    } else if (isReserved) {
                      bgClass = 'bg-blue-50 border-blue-200 opacity-50 cursor-not-allowed';
                      textClass = 'text-blue-550';
                    } else if (isSelected) {
                      bgClass = 'bg-blue-600 border-blue-600 text-white selected-slot-pulse';
                      textClass = 'text-white';
                    } else if (isEV) {
                      bgClass = 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-500 cursor-pointer';
                      textClass = 'text-emerald-700';
                      iconElement = <Zap className="h-3.5 w-3.5 shrink-0" />;
                    } else if (isDisabled) {
                      bgClass = 'bg-amber-50 border-amber-200 hover:bg-amber-100 hover:border-amber-500 cursor-pointer';
                      textClass = 'text-amber-700';
                    }

                    return (
                      <motion.button
                        key={slot.id}
                        whileHover={!isOccupied && !isReserved ? { scale: 1.03, y: -1 } : {}}
                        onClick={() => handleSlotSelect(slot)}
                        className={`h-20 rounded-2xl border flex flex-col items-center justify-between p-3 font-mono text-xs transition-all duration-350 ${bgClass}`}
                        disabled={isOccupied || isReserved}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className={`text-[10px] font-extrabold ${textClass}`}>{slot.label}</span>
                          {iconElement}
                        </div>

                        <div className="text-[8px] font-bold uppercase tracking-wider">
                          {isOccupied ? 'Occupied' : isReserved ? 'Reserved' : isSelected ? 'Selected' : slot.type}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="mt-8 border-t border-dashed border-gray-200 pt-4 flex justify-between text-[9px] text-gray-400 font-mono tracking-wider">
                  <span>[SECTION-A]</span>
                  <span>ONE-WAY ROADWAY</span>
                  <span>[SECTION-B]</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hotel-style Booking Widget Card */}
          <div className="lg:col-span-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-xl sticky top-24">
            <div className="flex items-center gap-2 border-b border-gray-150 pb-4 mb-5">
              <Sparkles className="h-4.5 w-4.5 text-blue-600" />
              <h3 className="font-outfit text-base font-bold text-gray-900">Booking Specifications</h3>
            </div>

            <div className="space-y-5">
              
              {/* Display Selected Slot */}
              <div className="rounded-2xl bg-gray-50 p-4 border border-gray-200 flex items-center justify-between shadow-inner">
                <div>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Allocated Unit</span>
                  <div className="text-sm font-extrabold font-mono mt-1 text-gray-900">
                    {selectedSlot ? `${selectedSlot.label} (${selectedSlot.type})` : 'None Selected'}
                  </div>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
                  <Car className="h-5 w-5" />
                </div>
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Arrival Date</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-xs text-gray-800 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Time */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Check-in Time</label>
                <input
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-xs text-gray-800 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Duration</label>
                  <span className="text-xs font-mono font-bold text-blue-600">{duration} hours</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="24"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Vehicle Type */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Vehicle Category</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-xs text-gray-800 focus:border-blue-500 focus:outline-none cursor-pointer"
                >
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="EV-Chargable">EV (Charging Slot)</option>
                </select>
              </div>

              {/* License Plate */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">License Plate Number</label>
                <input
                  type="text"
                  placeholder="e.g. DL-3CA-1234"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-xs text-gray-800 focus:border-blue-500 focus:outline-none placeholder-gray-400 font-mono uppercase"
                />
              </div>

              {/* Pricing Summary */}
              <div className="border-t border-gray-150 pt-4 mt-5 space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Base Hourly Rate</span>
                  <span>₹{lot.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration</span>
                  <span>{duration} hrs</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 border-t border-gray-150 pt-3 text-sm">
                  <span>Total Est. Amount</span>
                  <span className="text-emerald-600 text-base">₹{totalPrice}</span>
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-500 bg-rose-50 border border-rose-200 rounded-xl p-3">
                  {errorMsg}
                </p>
              )}

              {/* Action button */}
              <button
                onClick={handleProceedToBooking}
                className="w-full flex items-center justify-center gap-2 rounded-xl btn-consumer-primary py-3.5 text-xs font-bold text-white cursor-pointer shadow-lg"
              >
                <span>Reserve Space Now</span>
                <ChevronRight className="h-4 w-4" />
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Check, CreditCard, Calendar, Clock, MapPin, Car, ShieldCheck,
  ChevronRight, Lock, Printer, CalendarDays, ArrowLeft, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BookingFlow() {
  const location = useLocation();
  const navigate = useNavigate();
  const { createBooking } = useApp();

  const bookingParams = location.state;

  // Fallback if accessed directly without selecting a slot
  if (!bookingParams) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-white">
        <h2 className="text-xl font-bold">No booking details provided</h2>
        <p className="text-xs text-gray-500 mt-2">Please search for a parking lot and select a slot first.</p>
        <button onClick={() => navigate('/search')} className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold">
          Find Parking
        </button>
      </div>
    );
  }

  const { lotId, lotName, slotId, date, time, duration, vehicleType, vehiclePlate, amount } = bookingParams;

  // Steps: 'payment', 'confirmation'
  const [checkoutStep, setCheckoutStep] = useState('payment');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Credit Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleExpiryChange = (value) => {
    const clean = value.replace(/[^0-9]/g, '');
    if (clean.length >= 2) {
      return `${clean.slice(0, 2)}/${clean.slice(2, 4)}`;
    }
    return clean;
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (cardNumber.length < 15 || cardName.trim().length === 0 || cardExpiry.length < 5 || cardCvv.length < 3) {
      alert('Please fill out all payment fields correctly.');
      return;
    }

    setIsPaying(true);

    // Simulate Stripe Payment processing delay
    setTimeout(() => {
      const confirmed = createBooking({
        lotId,
        lotName,
        slotId,
        date,
        time,
        duration,
        vehicleType,
        vehiclePlate,
        amount
      });
      setConfirmedBooking(confirmed);
      setIsPaying(false);
      setCheckoutStep('confirmation');
    }, 2000);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 bg-gray-950 min-h-screen text-white">
      
      {/* Checkout progress indicator */}
      <div className="flex items-center justify-center gap-4 mb-10 text-xs">
        <div className="flex items-center gap-2">
          <span className="h-6 w-6 rounded-full bg-blue-600/20 border border-blue-500 text-blue-400 flex items-center justify-center font-bold">1</span>
          <span className="font-semibold text-gray-300">Checkout Details</span>
        </div>
        <ChevronRight className="h-4 w-4 text-gray-700" />
        <div className="flex items-center gap-2">
          <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold border transition-colors ${checkoutStep === 'confirmation' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-gray-900 border-gray-800 text-gray-500'}`}>2</span>
          <span className={`font-semibold transition-colors ${checkoutStep === 'confirmation' ? 'text-gray-300' : 'text-gray-500'}`}>Confirmation</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {checkoutStep === 'payment' ? (
          <motion.div 
            key="payment-step"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 15 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
          >
            
            {/* Left Side: Summary Panel */}
            <div className="md:col-span-5 rounded-2xl border border-gray-850 bg-gray-900/30 p-5 space-y-5">
              <h3 className="font-outfit text-sm font-bold uppercase tracking-wider text-gray-400 border-b border-gray-850 pb-3">
                Booking Summary
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-gray-500 block">Parking Lot</span>
                  <span className="font-semibold text-white flex items-center gap-1.5 mt-1">
                    <MapPin className="h-3.5 w-3.5 text-blue-500 shrink-0" /> {lotName}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-500 block">Date & Time</span>
                    <span className="font-semibold text-white flex items-center gap-1.5 mt-1">
                      <CalendarDays className="h-3.5 w-3.5 text-blue-500" /> {date} at {time}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Duration</span>
                    <span className="font-semibold text-white flex items-center gap-1.5 mt-1">
                      <Clock className="h-3.5 w-3.5 text-blue-500" /> {duration} hrs
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-gray-850 pt-3">
                  <div>
                    <span className="text-gray-500 block">Parking Bay</span>
                    <span className="font-semibold font-mono text-blue-400 mt-1 block">{slotId}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">License Plate</span>
                    <span className="font-semibold font-mono text-white mt-1 block uppercase">{vehiclePlate}</span>
                  </div>
                </div>

                <div className="border-t border-gray-850 pt-4 mt-2 flex justify-between items-center text-sm">
                  <span className="font-semibold">Subtotal</span>
                  <span className="font-bold text-emerald-440 text-lg">₹{amount}</span>
                </div>
              </div>
            </div>

            {/* Right Side: Credit Card visual and Form */}
            <div className="md:col-span-7 space-y-6">
              
              {/* Premium Card Flip visualization */}
              <div className="perspective-1000 flex justify-center">
                <motion.div
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6 }}
                  className="w-full max-w-[340px] h-[200px] rounded-2xl relative preserve-3d shadow-2xl"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  
                  {/* Card Front */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-gray-900 to-blue-950 p-5 flex flex-col justify-between border border-white/5 backface-hidden">
                    <div className="flex justify-between items-start">
                      <div className="h-8 w-12 rounded bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-[10px] text-amber-500 font-mono">CHIP</div>
                      <span className="font-outfit font-bold text-sm tracking-widest text-blue-400">ParkEasePay</span>
                    </div>
                    <div className="font-mono text-lg text-white tracking-widest text-center my-4">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-gray-400">
                      <div>
                        <span>CARDHOLDER</span>
                        <div className="text-white mt-0.5 uppercase">{cardName || 'NAME ON CARD'}</div>
                      </div>
                      <div className="text-right">
                        <span>EXPIRES</span>
                        <div className="text-white mt-0.5">{cardExpiry || 'MM/YY'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Card Back */}
                  <div className="absolute inset-0 rounded-2xl bg-gray-900 p-5 flex flex-col justify-between border border-white/5 backface-hidden" style={{ transform: 'rotateY(180deg)' }}>
                    <div className="w-full h-10 bg-gray-950 -mx-5 mt-2" />
                    <div className="flex justify-end gap-2 items-center">
                      <span className="text-[8px] font-mono text-gray-500">SECURE CVV</span>
                      <div className="w-14 h-8 bg-white text-gray-900 font-mono text-xs flex items-center justify-center font-bold rounded">
                        {cardCvv || '•••'}
                      </div>
                    </div>
                    <p className="text-[8px] text-gray-500 text-center leading-relaxed">
                      This transaction is encrypted and verified by ParkEase Security Systems.
                    </p>
                  </div>

                </motion.div>
              </div>

              {/* Form Input Fields */}
              <form onSubmit={handlePaymentSubmit} className="rounded-2xl border border-gray-850 bg-gray-900/20 p-6 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Payment Details</h4>
                
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider block">Card Number</label>
                  <div className="relative mt-1">
                    <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-gray-600" />
                    <input
                      type="text"
                      placeholder="4000 1234 5678 9010"
                      maxLength="19"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      className="w-full rounded-xl border border-gray-850 bg-gray-950 pl-10 pr-4 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider block">Name on Card</label>
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full rounded-xl border border-gray-850 bg-gray-950 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none mt-1"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider block">Expiration</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength="5"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(handleExpiryChange(e.target.value))}
                      className="w-full rounded-xl border border-gray-850 bg-gray-950 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none mt-1 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider block">CVV</label>
                    <input
                      type="password"
                      placeholder="•••"
                      maxLength="4"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, ''))}
                      onFocus={() => setIsFlipped(true)}
                      onBlur={() => setIsFlipped(false)}
                      className="w-full rounded-xl border border-gray-850 bg-gray-950 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none mt-1 font-mono"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPaying}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 text-xs shadow-lg transition-all mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPaying ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Processing Secured Payment...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-3.5 w-3.5 text-blue-300" />
                      <span>Pay & Complete Reservation — ₹{amount.toFixed(2)}</span>
                    </>
                  )}
                </button>
              </form>

            </div>

          </motion.div>
        ) : (
          /* Confirmation Screen */
          <motion.div 
            key="confirmation-step"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto rounded-3xl border border-gray-800 bg-gray-900/30 p-8 text-center space-y-6 backdrop-blur-sm shadow-2xl"
          >
            
            {/* Pulsating Success Ring */}
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)] animate-bounce">
                <Check className="h-8 w-8" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="font-outfit text-xl font-bold">Booking Confirmed!</h2>
              <p className="text-xs text-gray-400">Your spot is guaranteed. Scan the QR code below at the entry gate.</p>
            </div>

            {/* Premium QR Code Visual with Scanlines */}
            <div className="flex justify-center relative group">
              <div className="relative rounded-2xl bg-white p-5 border border-gray-200 shadow-xl overflow-hidden">
                {/* QR graphic */}
                <svg className="h-40 w-40 text-gray-950" viewBox="0 0 100 100" fill="currentColor">
                  {/* Grid of cubes to represent QR */}
                  <rect x="5" y="5" width="20" height="20" />
                  <rect x="9" y="9" width="12" height="12" fill="white" />
                  <rect x="75" y="5" width="20" height="20" />
                  <rect x="79" y="9" width="12" height="12" fill="white" />
                  <rect x="5" y="75" width="20" height="20" />
                  <rect x="9" y="79" width="12" height="12" fill="white" />
                  
                  {/* Random QR blocks */}
                  <rect x="35" y="15" width="5" height="10" />
                  <rect x="45" y="5" width="10" height="5" />
                  <rect x="60" y="20" width="5" height="15" />
                  <rect x="15" y="35" width="10" height="5" />
                  <rect x="40" y="45" width="15" height="15" />
                  <rect x="70" y="50" width="10" height="5" />
                  <rect x="15" y="55" width="5" height="10" />
                  <rect x="45" y="75" width="10" height="10" />
                  <rect x="75" y="75" width="10" height="10" />
                </svg>

                {/* Laser scan line simulation */}
                <div className="absolute left-0 right-0 h-0.5 bg-blue-500 animate-[bounce_2s_infinite]" style={{ top: '10%' }} />
              </div>
            </div>

            {/* Booking Reference details */}
            <div className="rounded-2xl bg-gray-950 p-4 border border-gray-850 text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-gray-500">TICKET ID</span>
                <span className="text-white font-bold">{confirmedBooking?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">LOT NAME</span>
                <span className="text-white font-bold truncate max-w-[200px]">{confirmedBooking?.lotName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">PARKING BAY</span>
                <span className="text-blue-400 font-bold">{confirmedBooking?.slotId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">PLATE NUM</span>
                <span className="text-white font-bold">{confirmedBooking?.vehiclePlate}</span>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-gray-800 bg-gray-900/60 py-2.5 text-xs font-semibold text-gray-300 hover:text-white"
              >
                <Printer className="h-4 w-4" /> Print Pass
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-500"
              >
                Go to Dashboard
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

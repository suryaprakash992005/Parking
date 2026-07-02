import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Check, CreditCard, Clock, MapPin, ChevronRight, Lock, Printer, CalendarDays, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BookingFlow() {
  const location = useLocation();
  const navigate = useNavigate();
  const { createBooking } = useApp();

  const bookingParams = location.state;

  if (!bookingParams) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-xl font-bold">No booking details provided</h2>
        <button onClick={() => navigate('/search')} className="mt-4 rounded-xl bg-blue-600 text-white px-4.5 py-2.5 text-xs font-semibold shadow-md">
          Find Parking Lot
        </button>
      </div>
    );
  }

  const { lotId, lotName, slotId, date, time, duration, vehicleType, vehiclePlate, amount } = bookingParams;

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

    return parts.length > 0 ? parts.join(' ') : v;
  };

  const handleExpiryChange = (value) => {
    const clean = value.replace(/[^0-9]/g, '');
    return clean.length >= 2 ? `${clean.slice(0, 2)}/${clean.slice(2, 4)}` : clean;
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (cardNumber.length < 15 || cardName.trim().length === 0 || cardExpiry.length < 5 || cardCvv.length < 3) {
      alert('Please fill out all payment fields correctly.');
      return;
    }

    setIsPaying(true);

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
    }, 1800);
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 bg-[#FAFAFA] min-h-screen text-gray-800">
      
      {/* Steps indicator */}
      <div className="flex items-center justify-center gap-4 mb-12 text-[10px] font-bold uppercase tracking-wider text-gray-400">
        <div className="flex items-center gap-2">
          <span className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">1</span>
          <span className="text-gray-900 font-extrabold">Checkout Details</span>
        </div>
        <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
        <div className="flex items-center gap-2">
          <span className={`h-5 w-5 rounded-full flex items-center justify-center font-bold border ${checkoutStep === 'confirmation' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-350 text-gray-500'}`}>2</span>
          <span className={checkoutStep === 'confirmation' ? 'text-gray-900 font-extrabold' : 'text-gray-500'}>Confirmation</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {checkoutStep === 'payment' ? (
          <motion.div 
            key="payment-step"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start"
          >
            
            {/* Left side: Invoice Summary */}
            <div className="md:col-span-5 border border-gray-200 bg-white p-6 rounded-2xl shadow-sm space-y-6">
              <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-3">
                Order Summary
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-gray-400 font-bold block">Facility Location</span>
                  <span className="font-bold text-gray-900 flex items-center gap-2 mt-1.5">
                    <MapPin className="h-4 w-4 text-gray-400 shrink-0" /> {lotName}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-400 font-bold block">Arrival Time</span>
                    <span className="font-bold text-gray-900 flex items-center gap-2 mt-1.5">
                      <CalendarDays className="h-4 w-4 text-gray-405 shrink-0" /> {date} at {time}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block">Assigned Bay</span>
                    <span className="font-bold font-mono text-gray-950 mt-1.5 block">{slotId}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-3">
                  <div>
                    <span className="text-gray-400 font-bold block">Duration</span>
                    <span className="font-bold text-gray-900 mt-1 block">{duration} Hours</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block">License Plate</span>
                    <span className="font-bold font-mono text-gray-900 mt-1 block uppercase">{vehiclePlate}</span>
                  </div>
                </div>

                <div className="border-t border-gray-150 pt-4 mt-2 flex justify-between items-center text-sm">
                  <span className="font-bold text-gray-900">Total Price</span>
                  <span className="font-bold text-emerald-600 text-xl font-outfit">₹{amount}</span>
                </div>
              </div>
            </div>

            {/* Right side: Stripe payment form */}
            <div className="md:col-span-7 space-y-8">
              
              {/* Minimalist Card Visual */}
              <div className="flex justify-center">
                <motion.div
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full max-w-[340px] h-[190px] rounded-2xl relative shadow-xl"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  
                  {/* Front */}
                  <div className="absolute inset-0 rounded-2xl bg-gray-900 p-5 flex flex-col justify-between border border-gray-800 backface-hidden shadow-2xl">
                    <div className="flex justify-between items-start">
                      <div className="h-7 w-10 rounded bg-gray-800 border border-gray-700 shadow-inner" />
                      <span className="font-mono text-[9px] font-bold text-gray-500 uppercase tracking-widest">Gateway secure</span>
                    </div>
                    <div className="font-mono text-base text-white tracking-widest text-center my-4">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-gray-500">
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

                  {/* Back */}
                  <div className="absolute inset-0 rounded-2xl bg-gray-900 p-5 flex flex-col justify-between border border-gray-800 backface-hidden shadow-2xl" style={{ transform: 'rotateY(180deg)' }}>
                    <div className="w-full h-9 bg-gray-950 -mx-5 mt-1" />
                    <div className="flex justify-end gap-2 items-center">
                      <span className="text-[8px] font-mono text-gray-500">CVV</span>
                      <div className="w-12 h-7 bg-white text-black font-mono text-xs flex items-center justify-center font-bold rounded">
                        {cardCvv || '•••'}
                      </div>
                    </div>
                    <p className="text-[7px] text-gray-500 text-center leading-relaxed">
                      Encrypted Stripe-level gateway transaction protocol.
                    </p>
                  </div>

                </motion.div>
              </div>

              {/* Input Form */}
              <form onSubmit={handlePaymentSubmit} className="space-y-4 bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Card Number</label>
                  <input
                    type="text"
                    placeholder="4000 1234 5678 9010"
                    maxLength="19"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-800 focus:border-blue-500 focus:bg-white focus:outline-none font-mono mt-1"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-800 focus:border-blue-500 focus:bg-white focus:outline-none mt-1"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength="5"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(handleExpiryChange(e.target.value))}
                      className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-800 focus:border-blue-500 focus:bg-white focus:outline-none mt-1 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">CVV</label>
                    <input
                      type="password"
                      placeholder="•••"
                      maxLength="4"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, ''))}
                      onFocus={() => setIsFlipped(true)}
                      onBlur={() => setIsFlipped(false)}
                      className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-800 focus:border-blue-500 focus:bg-white focus:outline-none mt-1 font-mono"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPaying}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 text-xs shadow-lg shadow-blue-500/25 mt-6 disabled:opacity-50 cursor-pointer"
                >
                  {isPaying ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Verifying Transaction Ledger...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-3.5 w-3.5 text-white" />
                      <span>Authorize Payment — ₹{amount}</span>
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
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto border border-gray-200 bg-white p-8 text-center space-y-6 rounded-3xl shadow-xl"
          >
            
            <div className="flex justify-center">
              <div className="h-14 w-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
                <Check className="h-7 w-7 stroke-[2.5]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <h2 className="font-outfit text-xl font-extrabold text-gray-900">Reservation Confirmed</h2>
              <p className="text-xs text-gray-500">Your access token has been generated and registered on the gateway.</p>
            </div>

            {/* QR pass */}
            <div className="flex justify-center relative">
              <div className="relative rounded-2xl bg-white p-4 border border-gray-200 shadow-sm">
                <svg className="h-36 w-36 text-gray-900" viewBox="0 0 100 100" fill="currentColor">
                  <rect x="5" y="5" width="20" height="20" />
                  <rect x="9" y="9" width="12" height="12" fill="white" />
                  <rect x="75" y="5" width="20" height="20" />
                  <rect x="79" y="9" width="12" height="12" fill="white" />
                  <rect x="5" y="75" width="20" height="20" />
                  <rect x="9" y="79" width="12" height="12" fill="white" />
                  
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
              </div>
            </div>

            {/* Receipt metrics */}
            <div className="border border-gray-200 bg-gray-50 p-4 text-left text-[11px] font-mono rounded-2xl space-y-2 text-gray-650 shadow-inner">
              <div className="flex justify-between">
                <span className="text-gray-450 font-bold">TRANSACTION_ID</span>
                <span className="text-gray-900 font-bold">{confirmedBooking?.id.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-450 font-bold">COMPLEX</span>
                <span className="text-gray-900 font-bold truncate max-w-[180px]">{confirmedBooking?.lotName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-450 font-bold">BAY_CODE</span>
                <span className="text-gray-900 font-bold">{confirmedBooking?.slotId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-450 font-bold">LICENSE_PLATE</span>
                <span className="text-gray-900 font-bold">{confirmedBooking?.vehiclePlate}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 shadow-sm"
              >
                <Printer className="h-4 w-4" /> Print Ledger
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700 shadow-md shadow-blue-500/25"
              >
                Go to Console
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

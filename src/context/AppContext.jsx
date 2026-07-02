import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const INITIAL_PARKING_LOTS = [
  {
    id: 'lot-1',
    name: 'Downtown Smart Haven',
    address: '120 Grand Ave, Metro City',
    distance: '0.4 mi',
    price: 120,
    rating: 4.8,
    reviews: 142,
    totalSlots: 16,
    availableSlotsCount: 7,
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80',
    features: {
      covered: true,
      open: false,
      evCharging: true,
      cctv: true,
      valet: true
    },
    slots: [
      { id: 'A-01', label: 'A-01', status: 'Available', type: 'Standard' },
      { id: 'A-02', label: 'A-02', status: 'Occupied', type: 'Standard' },
      { id: 'A-03', label: 'A-03', status: 'Available', type: 'EV-Charging' },
      { id: 'A-04', label: 'A-04', status: 'Reserved', type: 'Standard' },
      { id: 'B-01', label: 'B-01', status: 'Occupied', type: 'Standard' },
      { id: 'B-02', label: 'B-02', status: 'Available', type: 'EV-Charging' },
      { id: 'B-03', label: 'B-03', status: 'Occupied', type: 'Disabled' },
      { id: 'B-04', label: 'B-04', status: 'Available', type: 'Standard' },
      { id: 'C-01', label: 'C-01', status: 'Available', type: 'Standard' },
      { id: 'C-02', label: 'C-02', status: 'Occupied', type: 'Standard' },
      { id: 'C-03', label: 'C-03', status: 'Available', type: 'Standard' },
      { id: 'C-04', label: 'C-04', status: 'Available', type: 'Standard' },
      { id: 'D-01', label: 'D-01', status: 'Occupied', type: 'Standard' },
      { id: 'D-02', label: 'D-02', status: 'Occupied', type: 'Standard' },
      { id: 'D-03', label: 'D-03', status: 'Occupied', type: 'Standard' },
      { id: 'D-04', label: 'D-04', status: 'Occupied', type: 'Standard' },
    ],
    ownerId: 'owner-1',
    verified: true
  },
  {
    id: 'lot-2',
    name: 'Plaza Covered Deck',
    address: '440 Market St, Metro City',
    distance: '1.2 mi',
    price: 80,
    rating: 4.5,
    reviews: 98,
    totalSlots: 10,
    availableSlotsCount: 4,
    image: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=600&q=80',
    features: {
      covered: true,
      open: false,
      evCharging: false,
      cctv: true,
      valet: false
    },
    slots: [
      { id: 'P-01', label: 'P-01', status: 'Available', type: 'Standard' },
      { id: 'P-02', label: 'P-02', status: 'Occupied', type: 'Standard' },
      { id: 'P-03', label: 'P-03', status: 'Available', type: 'Standard' },
      { id: 'P-04', label: 'P-04', status: 'Occupied', type: 'Standard' },
      { id: 'P-05', label: 'P-05', status: 'Occupied', type: 'Standard' },
      { id: 'P-06', label: 'P-06', status: 'Available', type: 'Disabled' },
      { id: 'P-07', label: 'P-07', status: 'Occupied', type: 'Standard' },
      { id: 'P-08', label: 'P-08', status: 'Occupied', type: 'Standard' },
      { id: 'P-09', label: 'P-09', status: 'Available', type: 'Standard' },
      { id: 'P-10', label: 'P-10', status: 'Occupied', type: 'Standard' }
    ],
    ownerId: 'owner-1',
    verified: true
  },
  {
    id: 'lot-3',
    name: 'Westside Open Lot',
    address: '890 West Blvd, Metro City',
    distance: '2.5 mi',
    price: 40,
    rating: 4.2,
    reviews: 64,
    totalSlots: 8,
    availableSlotsCount: 5,
    image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80',
    features: {
      covered: false,
      open: true,
      evCharging: false,
      cctv: true,
      valet: false
    },
    slots: [
      { id: 'W-01', label: 'W-01', status: 'Available', type: 'Standard' },
      { id: 'W-02', label: 'W-02', status: 'Available', type: 'Standard' },
      { id: 'W-03', label: 'W-03', status: 'Occupied', type: 'Standard' },
      { id: 'W-04', label: 'W-04', status: 'Available', type: 'Standard' },
      { id: 'W-05', label: 'W-05', status: 'Occupied', type: 'Standard' },
      { id: 'W-06', label: 'W-06', status: 'Available', type: 'Standard' },
      { id: 'W-07', label: 'W-07', status: 'Available', type: 'Disabled' },
      { id: 'W-08', label: 'W-08', status: 'Occupied', type: 'Standard' }
    ],
    ownerId: 'owner-2',
    verified: true
  },
  {
    id: 'lot-4',
    name: 'Transit Hub EV Station',
    address: '50 Station Rd, Metro City',
    distance: '0.8 mi',
    price: 90,
    rating: 4.9,
    reviews: 215,
    totalSlots: 6,
    availableSlotsCount: 2,
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
    features: {
      covered: false,
      open: true,
      evCharging: true,
      cctv: true,
      valet: false
    },
    slots: [
      { id: 'E-01', label: 'E-01', status: 'Available', type: 'EV-Charging' },
      { id: 'E-02', label: 'E-02', status: 'Occupied', type: 'EV-Charging' },
      { id: 'E-03', label: 'E-03', status: 'Occupied', type: 'EV-Charging' },
      { id: 'E-04', label: 'E-04', status: 'Available', type: 'EV-Charging' },
      { id: 'E-05', label: 'E-05', status: 'Occupied', type: 'Standard' },
      { id: 'E-06', label: 'E-06', status: 'Occupied', type: 'Disabled' }
    ],
    ownerId: 'owner-2',
    verified: true
  },
  {
    id: 'lot-5',
    name: 'Skyline Valet & Lounge',
    address: '72 Pine St, Metro City',
    distance: '1.5 mi',
    price: 180,
    rating: 4.9,
    reviews: 180,
    totalSlots: 6,
    availableSlotsCount: 3,
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80',
    features: {
      covered: true,
      open: false,
      evCharging: true,
      cctv: true,
      valet: true
    },
    slots: [
      { id: 'S-01', label: 'S-01', status: 'Available', type: 'Standard' },
      { id: 'S-02', label: 'S-02', status: 'Occupied', type: 'Standard' },
      { id: 'S-03', label: 'S-03', status: 'Available', type: 'EV-Charging' },
      { id: 'S-04', label: 'S-04', status: 'Occupied', type: 'Standard' },
      { id: 'S-05', label: 'S-05', status: 'Available', type: 'Disabled' },
      { id: 'S-06', label: 'S-06', status: 'Occupied', type: 'Standard' }
    ],
    ownerId: 'owner-1',
    verified: false // Awaits admin verification
  }
];

const INITIAL_BOOKINGS = [
  {
    id: 'pe-bk-7740',
    lotId: 'lot-1',
    lotName: 'Downtown Smart Haven',
    slotId: 'A-04',
    date: '2026-07-03',
    time: '14:00',
    duration: 2, // hours
    vehicleType: 'Sedan',
    vehiclePlate: 'NY-K408L',
    amount: 240,
    status: 'Upcoming',
    qrCodeValue: 'PARKEASE-LOT1-SLOTA04-USER1-7740',
    timestamp: '2026-07-02T10:15:00Z'
  },
  {
    id: 'pe-bk-1024',
    lotId: 'lot-2',
    lotName: 'Plaza Covered Deck',
    slotId: 'P-04',
    date: '2026-06-28',
    time: '09:00',
    duration: 4,
    vehicleType: 'SUV',
    vehiclePlate: 'NY-K408L',
    amount: 320,
    status: 'Completed',
    qrCodeValue: 'PARKEASE-LOT2-SLOTP04-USER1-1024',
    timestamp: '2026-06-28T09:00:00Z'
  }
];

export const AppProvider = ({ children }) => {
  // Authentication Role
  const [role, setRole] = useState(() => {
    return localStorage.getItem('parkease_role') || 'user'; // 'user', 'owner', 'admin'
  });

  // Parking Lots
  const [parkingLots, setParkingLots] = useState(() => {
    const saved = localStorage.getItem('parkease_parking_lots');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If prices are in USD (less than 20), clear and use new INR defaults
        if (parsed.some(lot => lot.price < 20)) {
          localStorage.removeItem('parkease_parking_lots');
          localStorage.removeItem('parkease_bookings');
          return INITIAL_PARKING_LOTS;
        }
        return parsed;
      } catch (e) {
        return INITIAL_PARKING_LOTS;
      }
    }
    return INITIAL_PARKING_LOTS;
  });

  // Bookings
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('parkease_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  // Saved/Starred Locations
  const [savedLocations, setSavedLocations] = useState(() => {
    const saved = localStorage.getItem('parkease_saved_locations');
    return saved ? JSON.parse(saved) : ['lot-1', 'lot-4'];
  });

  // Notifications Feed
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Booking Confirmed', message: 'Your spot A-04 at Downtown Smart Haven is reserved.', time: '1 hr ago', read: false },
    { id: 2, title: 'Welcome to ParkEase!', message: 'Start reserving spots in advance to save time.', time: '1 day ago', read: true }
  ]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('parkease_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('parkease_parking_lots', JSON.stringify(parkingLots));
  }, [parkingLots]);

  useEffect(() => {
    localStorage.setItem('parkease_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('parkease_saved_locations', JSON.stringify(savedLocations));
  }, [savedLocations]);

  // Actions
  const toggleSaveLocation = (lotId) => {
    setSavedLocations(prev => 
      prev.includes(lotId) ? prev.filter(id => id !== lotId) : [...prev, lotId]
    );
  };

  const createBooking = (bookingData) => {
    const newBooking = {
      id: `pe-bk-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Upcoming',
      qrCodeValue: `PARKEASE-${bookingData.lotId}-${bookingData.slotId}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      ...bookingData
    };

    // Update bookings list
    setBookings(prev => [newBooking, ...prev]);

    // Mark spot as reserved in the parking lot
    setParkingLots(prevLots => {
      return prevLots.map(lot => {
        if (lot.id === bookingData.lotId) {
          const updatedSlots = lot.slots.map(slot => {
            if (slot.id === bookingData.slotId) {
              return { ...slot, status: 'Reserved' };
            }
            return slot;
          });
          const availableSlotsCount = updatedSlots.filter(s => s.status === 'Available').length;
          return { ...lot, slots: updatedSlots, availableSlotsCount };
        }
        return lot;
      });
    });

    // Add Notification
    setNotifications(prev => [
      {
        id: Date.now(),
        title: 'New Booking Created',
        message: `Spot ${bookingData.slotId} at ${bookingData.lotName} has been booked.`,
        time: 'Just now',
        read: false
      },
      ...prev
    ]);

    return newBooking;
  };

  const cancelBooking = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    setBookings(prev => 
      prev.map(b => b.id === bookingId ? { ...b, status: 'Cancelled' } : b)
    );

    // Free the spot back to Available
    setParkingLots(prevLots => {
      return prevLots.map(lot => {
        if (lot.id === booking.lotId) {
          const updatedSlots = lot.slots.map(slot => {
            if (slot.id === booking.slotId) {
              return { ...slot, status: 'Available' };
            }
            return slot;
          });
          const availableSlotsCount = updatedSlots.filter(s => s.status === 'Available').length;
          return { ...lot, slots: updatedSlots, availableSlotsCount };
        }
        return lot;
      });
    });

    setNotifications(prev => [
      {
        id: Date.now(),
        title: 'Booking Cancelled',
        message: `Your booking for spot ${booking.slotId} was cancelled. Refund processed.`,
        time: 'Just now',
        read: false
      },
      ...prev
    ]);
  };

  // Owner dashboard actions
  const addParkingLot = (lotData) => {
    const newLot = {
      id: `lot-${Date.now()}`,
      verified: false,
      rating: 0,
      reviews: 0,
      availableSlotsCount: parseInt(lotData.totalSlots),
      slots: Array.from({ length: parseInt(lotData.totalSlots) }, (_, i) => {
        const id = `S-${i+1}`;
        return {
          id,
          label: id,
          status: 'Available',
          type: i % 4 === 0 ? 'EV-Charging' : i % 8 === 0 ? 'Disabled' : 'Standard'
        };
      }),
      ...lotData
    };

    setParkingLots(prev => [...prev, newLot]);
  };

  const updateSlotStatus = (lotId, slotId, newStatus) => {
    setParkingLots(prevLots => {
      return prevLots.map(lot => {
        if (lot.id === lotId) {
          const updatedSlots = lot.slots.map(slot => {
            if (slot.id === slotId) {
              return { ...slot, status: newStatus };
            }
            return slot;
          });
          const availableSlotsCount = updatedSlots.filter(s => s.status === 'Available').length;
          return { ...lot, slots: updatedSlots, availableSlotsCount };
        }
        return lot;
      });
    });
  };

  // Admin actions
  const verifyParkingLot = (lotId) => {
    setParkingLots(prev => 
      prev.map(lot => lot.id === lotId ? { ...lot, verified: true } : lot)
    );
  };

  const deleteParkingLot = (lotId) => {
    setParkingLots(prev => prev.filter(lot => lot.id !== lotId));
  };

  return (
    <AppContext.Provider value={{
      role,
      setRole,
      parkingLots,
      bookings,
      savedLocations,
      notifications,
      setNotifications,
      toggleSaveLocation,
      createBooking,
      cancelBooking,
      addParkingLot,
      updateSlotStatus,
      verifyParkingLot,
      deleteParkingLot
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

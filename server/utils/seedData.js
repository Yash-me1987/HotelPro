const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const HotelConfig = require('../models/HotelConfig');

const initialRooms = [
  {
    roomNumber: 'PH-01',
    title: 'The Royal Sovereign Penthouse',
    type: 'Penthouse',
    price: 1850,
    basePrice: 1850,
    seasonalMultiplier: 1.0,
    capacity: 4,
    bedType: 'California Emperor King Bed',
    sizeSqFt: 2400,
    floor: 24,
    description: 'Suspended above the skyline, the Royal Sovereign Penthouse is an uncompromised expression of palatial living with a private heated cantilevered plunge pool, 24-karat gold fixtures, and dedicated round-the-clock butler service.',
    amenities: [
      'Private Heated Plunge Pool',
      'Panoramic 360° Skyline Views',
      'Dedicated 24/7 Butler Service',
      'Private Elevator Access',
      'Sub-Zero Wine Cellar & Bar',
      'B&O Immersive Acoustic Sound System',
      'Dyson Supersonic Care Suite',
      'Bulgari Luxury Bath Amenities'
    ],
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop&q=80'
    ],
    rating: 4.98,
    reviewCount: 38,
    isAvailable: true,
    status: 'Clean'
  },
  {
    roomNumber: 'SU-402',
    title: 'Presidential Ocean Vista Suite',
    type: 'Presidential Suite',
    price: 1250,
    basePrice: 1250,
    seasonalMultiplier: 1.0,
    capacity: 3,
    bedType: 'Custom Handcrafted King Bed',
    sizeSqFt: 1650,
    floor: 18,
    description: 'A masterpiece of contemporary coastal elegance featuring floor-to-ceiling soundproof glass facades overlooking uninterrupted ocean horizons, handcrafted Italian marble baths, and an expansive wraparound sunset terrace.',
    amenities: [
      'Wraparound Sunset Terrace',
      'Italian Carrara Marble Soak Tub',
      'Chilled Moët Welcome Champagne',
      'High-Speed Wi-Fi 7 Connectivity',
      'Bespoke Pillow & Aroma Concierge',
      'Valet Unpacking & Packing'
    ],
    images: [
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&auto=format&fit=crop&q=80'
    ],
    rating: 4.95,
    reviewCount: 46,
    isAvailable: true,
    status: 'Clean'
  },
  {
    roomNumber: 'EX-205',
    title: 'Grand Executive Haven Suite',
    type: 'Executive Suite',
    price: 750,
    basePrice: 750,
    seasonalMultiplier: 1.0,
    capacity: 2,
    bedType: 'King Size Plush Featherbed',
    sizeSqFt: 980,
    floor: 12,
    description: 'Engineered for executive leaders and discerning travelers seeking an oasis of tranquility with acoustic sound isolation, dual ergonomic workstations, and curated minibar delicacies.',
    amenities: [
      'Acoustic Studio Soundproofing',
      'Ergonomic Herman Miller Suite',
      'Nespresso Atelier Barista Station',
      'Daily Pressed Garment Service',
      'Rainfall Walk-In Spa Shower'
    ],
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200&auto=format&fit=crop&q=80'
    ],
    rating: 4.91,
    reviewCount: 62,
    isAvailable: true,
    status: 'Dirty'
  },
  {
    roomNumber: 'DLX-108',
    title: 'Deluxe Courtyard Botanical Haven',
    type: 'Deluxe Room',
    price: 450,
    basePrice: 450,
    seasonalMultiplier: 1.0,
    capacity: 2,
    bedType: 'Queen Plush Double',
    sizeSqFt: 620,
    floor: 4,
    description: 'Charming sunlit refuge overlooking our 100-year-old botanical olive courtyards and fountains, offering understated luxury and artisanal organic amenities.',
    amenities: [
      'Olive Courtyard Balcony',
      'Artisanal Tea Apothecary',
      'Plush Organic Bamboo Robes',
      'Smart Climate Touchscreen Control'
    ],
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&auto=format&fit=crop&q=80'
    ],
    rating: 4.88,
    reviewCount: 29,
    isAvailable: true,
    status: 'Clean'
  }
];

const initialBookings = [
  {
    bookingReference: 'HP-8921',
    guestName: 'Eleanor Sterling',
    guestEmail: 'eleanor.sterling@luxury.com',
    guestPhone: '+1 (555) 392-8172',
    roomNumber: 'PH-01',
    roomTitle: 'The Royal Sovereign Penthouse',
    checkInDate: '2026-10-27',
    checkOutDate: '2026-10-31',
    nights: 4,
    guestsCount: 2,
    totalAmount: 7400,
    paymentStatus: 'Paid',
    paymentMethod: 'Stripe Credit Card (ending 4242)',
    bookingStatus: 'Confirmed',
    specialRequests: 'Chilled Krug champagne upon arrival and non-feather hypoallergic pillows.',
    digitalKeyIssued: true
  },
  {
    bookingReference: 'HP-7840',
    guestName: 'Julian Vance',
    guestEmail: 'julian.vance@techcorp.com',
    guestPhone: '+1 (555) 881-0029',
    roomNumber: 'SU-402',
    roomTitle: 'Presidential Ocean Vista Suite',
    checkInDate: '2026-10-26',
    checkOutDate: '2026-10-29',
    nights: 3,
    guestsCount: 2,
    totalAmount: 3750,
    paymentStatus: 'Paid',
    paymentMethod: 'Stripe Credit Card (ending 8821)',
    bookingStatus: 'Checked In',
    specialRequests: 'Late checkout requested at 2:00 PM.',
    digitalKeyIssued: true
  }
];

const initialServices = [
  {
    guestName: 'Eleanor Sterling',
    roomNumber: 'PH-01',
    serviceType: 'Room Service',
    details: 'Caviar Service & Bollinger Champagne at 8:00 PM',
    priority: 'High',
    status: 'In Progress',
    assignedTo: 'Sommelier Thomas'
  },
  {
    guestName: 'Julian Vance',
    roomNumber: 'SU-402',
    serviceType: 'Housekeeping',
    details: 'Evening turn-down service & fresh organic linen',
    priority: 'Normal',
    status: 'Pending',
    assignedTo: 'Maria Gomez'
  }
];

// Seed function if MongoDB is connected
const Review = require('../models/Review');

const seedDatabase = async () => {
  try {
    // Upsert signature luxury suites
    for (const room of initialRooms) {
      const exists = await Room.findOne({ roomNumber: room.roomNumber });
      if (!exists) {
        await Room.create(room);
      }
    }

    const bookingCount = await Booking.countDocuments();
    if (bookingCount === 0) {
      console.log('[Database Seeder] Seeding initial guest reservations...');
      await Booking.insertMany(initialBookings);
    }

    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      console.log('[Database Seeder] Seeding service requests...');
      await Service.insertMany(initialServices);
    }

    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0) {
      console.log('[Database Seeder] Seeding verified guest reviews...');
      await Review.insertMany([
        {
          roomId: 'PH-01',
          guestName: 'Lord Alistair Sterling',
          rating: 5,
          title: 'An Unrivaled Sanctuary in the Sky',
          comment: 'The private plunge pool overlooking the city lights accompanied by the sommelier-curated champagne pairing was truly transcendent.',
          verifiedStay: true,
          stayDate: 'October 2026'
        },
        {
          roomId: 'SU-402',
          guestName: 'Julian Vance',
          rating: 5,
          title: 'Spectacular Ocean Vista Suite',
          comment: 'The sunsets over the ocean from the wraparound terrace are breathtaking.',
          verifiedStay: true,
          stayDate: 'October 2026'
        }
      ]);
    }

    const configCount = await HotelConfig.countDocuments();
    if (configCount === 0) {
      await HotelConfig.create({
        hotelName: 'HotelPro Grand Palace & Spa',
        taxRatePercent: 12,
        resortFeePerNight: 35,
        currency: 'USD ($)',
        maintenanceMode: false
      });
    }

    console.log('[Database Seeder] Database populated successfully.');
  } catch (error) {
    console.warn(`[Database Seeder Notice] Seeding skipped (${error.message})`);
  }
};

module.exports = {
  initialRooms,
  initialBookings,
  initialServices,
  seedDatabase,
};

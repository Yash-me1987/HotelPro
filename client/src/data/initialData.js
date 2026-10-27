// Initial Mock Data for HotelPro

export const initialRooms = [
  {
    id: "room-101",
    roomNumber: "101",
    name: "Deluxe Panoramic King",
    category: "Deluxe",
    basePrice: 260,
    price: 260,
    rating: 4.8,
    reviewsCount: 42,
    capacity: 2,
    bedType: "1 California King Bed",
    sizeSqFt: 450,
    floor: 1,
    status: "Clean", // Clean, Dirty, Inspected, Out of Order
    isAvailable: true,
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Immerse yourself in understated luxury. Floor-to-ceiling soundproof windows frame captivating garden views, complemented by an Italian marble en-suite bathroom with a rainfall shower.",
    amenities: [
      "High-Speed Wi-Fi 6",
      "55\" 4K Smart OLED TV",
      "Nespresso Coffee Machine",
      "Italian Marble Bathroom",
      "Rainfall Shower",
      "Stocked Gourmet Mini-Bar",
      "24/7 Room Service",
      "Plush Bathrobes & Slippers",
      "Keyless Mobile Entry"
    ],
    seasonalDiscount: 0,
    features: ["Balcony", "Garden View", "Work Desk", "Soundproofing"]
  },
  {
    id: "room-202",
    roomNumber: "202",
    name: "Royal Oceanfront Suite",
    category: "Ocean View",
    basePrice: 520,
    price: 520,
    rating: 4.95,
    reviewsCount: 88,
    capacity: 3,
    bedType: "1 Grand King + 1 Chaise Lounge",
    sizeSqFt: 780,
    floor: 2,
    status: "Inspected",
    isAvailable: true,
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Perched majestically overlooking the azure horizon, this suite features an expansive teak terrace, bespoke mid-century furnishings, a freestanding soaking tub, and VIP club lounge privileges.",
    amenities: [
      "Panoramic Ocean View",
      "Private Sun Terrace",
      "Freestanding Soaking Tub",
      "VIP Club Lounge Access",
      "Complimentary Champagne on Arrival",
      "Bose Surround Sound System",
      "High-Speed Wi-Fi 6",
      "Walk-in Dressing Room",
      "Butler On Demand"
    ],
    seasonalDiscount: 0,
    features: ["Ocean View", "Private Terrace", "Bathtub", "VIP Lounge Access"]
  },
  {
    id: "room-303",
    roomNumber: "303",
    name: "Executive Diplomatic Suite",
    category: "Executive Suite",
    basePrice: 380,
    price: 380,
    rating: 4.88,
    reviewsCount: 56,
    capacity: 2,
    bedType: "1 King Bed",
    sizeSqFt: 620,
    floor: 3,
    status: "Dirty",
    isAvailable: true,
    images: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Designed for discerning executives, pairing contemporary luxury with seamless functionality. Features an ergonomic meeting space, separate parlor, and sound-insulated conference facilities.",
    amenities: [
      "Separate Living Room & Office",
      "High-Speed Fiber Ethernet & Wi-Fi",
      "Complimentary Daily Pressing (2 Items)",
      "Wireless Printing Hub",
      "Nespresso Creatista Station",
      "Soundproof Meeting Pod",
      "Molton Brown Toiletries",
      "Curated Evening Turndown Service"
    ],
    seasonalDiscount: 0,
    features: ["City Skyline View", "Executive Lounge", "Workstation", "Meeting Area"]
  },
  {
    id: "room-401",
    roomNumber: "401",
    name: "Presidential Penthouse Suite",
    category: "Presidential",
    basePrice: 850,
    price: 850,
    rating: 5.0,
    reviewsCount: 34,
    capacity: 4,
    bedType: "2 Master King Suites",
    sizeSqFt: 1450,
    floor: 4,
    status: "Clean",
    isAvailable: true,
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "The pinnacle of elite hospitality. Spanning the entire top floor, featuring a private infinity plunge pool, full chef's galley, private elevator access, and 24-hour dedicated royal butler service.",
    amenities: [
      "Private Heated Plunge Pool",
      "Dedicated 24/7 Royal Butler",
      "Private Keycard Elevator Access",
      "Full Designer Chef's Kitchen",
      "Steinway Grand Piano",
      "Dyson Supersonic Care Kits",
      "Hermès Paris Bath Amenities",
      "Private Rooftop Helipad Transfer"
    ],
    seasonalDiscount: 0,
    features: ["Private Plunge Pool", "Penthouse Level", "Chef Kitchen", "Butler Service"]
  },
  {
    id: "room-105",
    roomNumber: "105",
    name: "Garden Luxury Villa",
    category: "Family Villa",
    basePrice: 650,
    price: 650,
    rating: 4.92,
    reviewsCount: 61,
    capacity: 6,
    bedType: "2 King Beds + 2 Twin Beds",
    sizeSqFt: 1200,
    floor: 1,
    status: "Clean",
    isAvailable: true,
    images: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "A private sanctuary surrounded by lush tropical flora. Boasting an open-air pavilion, dining terrace for eight, private lawn, and direct secluded access to the wellness lagoon.",
    amenities: [
      "Private Enclosed Tropical Garden",
      "Outdoor Dining Pavilion",
      "Family Entertainment Console",
      "Direct Lagoon Path",
      "Kitchenette with Wine Cellar",
      "Child-Friendly Amenities & Cots",
      "Dual En-Suite Bathrooms",
      "BBQ Facility on Request"
    ],
    seasonalDiscount: 0,
    features: ["Private Garden", "Family Sized", "Kitchenette", "Lagoon Access"]
  },
  {
    id: "room-204",
    roomNumber: "204",
    name: "Azure Bay Junior Suite",
    category: "Ocean View",
    basePrice: 340,
    price: 340,
    rating: 4.79,
    reviewsCount: 49,
    capacity: 2,
    bedType: "1 Queen Bed",
    sizeSqFt: 510,
    floor: 2,
    status: "Out of Order",
    isAvailable: false,
    images: [
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "A serene coastal escape with gentle sea breezes and sunset vistas. Complete with acoustic sound insulation, plush organic linens, and an oversized rain shower.",
    amenities: [
      "Ocean Sunset Balcony",
      "Organic Bamboo Linens",
      "Artisan Tea Selection",
      "Smart Climate Touch Panel",
      "Acoustic Soundproofing",
      "Rainfall Shower & Spa Jets"
    ],
    seasonalDiscount: 0,
    features: ["Ocean Sunset", "Private Balcony", "Spa Shower"]
  }
];

export const initialBookings = [
  {
    id: "BK-8021",
    roomId: "room-202",
    roomName: "Royal Oceanfront Suite",
    roomNumber: "202",
    guestId: "user-1",
    guestName: "Lord Johnathan Vance",
    guestEmail: "john.vance@luxurytravel.com",
    guestPhone: "+1 (555) 349-2810",
    checkIn: "2026-10-28",
    checkOut: "2026-11-02",
    nights: 5,
    guests: 2,
    totalAmount: 2600,
    paymentStatus: "Paid", // Paid, Pending, Refunded
    paymentMethod: "Stripe (Visa ending 4242)",
    bookingStatus: "Confirmed", // Confirmed, Checked-In, Checked-Out, Cancelled
    specialRequests: "Late check-in at 8:00 PM. Extra hypoallergenic goose feather pillows requested.",
    addOns: [
      { name: "Airport VIP Chauffeur", price: 120 },
      { name: "Bottle of Dom Pérignon 2012", price: 280 }
    ],
    createdAt: "2026-10-20T10:30:00Z"
  },
  {
    id: "BK-8022",
    roomId: "room-101",
    roomName: "Deluxe Panoramic King",
    roomNumber: "101",
    guestId: "user-2",
    guestName: "Elena Rostova",
    guestEmail: "elena.rostova@artgallery.eu",
    guestPhone: "+44 20 7946 0912",
    checkIn: "2026-10-27",
    checkOut: "2026-10-30",
    nights: 3,
    guests: 2,
    totalAmount: 780,
    paymentStatus: "Paid",
    paymentMethod: "Razorpay (Mastercard 8812)",
    bookingStatus: "Checked-In",
    specialRequests: "Anniversary celebration - rose petals arrangement.",
    addOns: [{ name: "Daily Champagne Breakfast for Two", price: 90 }],
    createdAt: "2026-10-18T14:15:00Z"
  },
  {
    id: "BK-8023",
    roomId: "room-401",
    roomName: "Presidential Penthouse Suite",
    roomNumber: "401",
    guestId: "user-3",
    guestName: "Marcus Sterling",
    guestEmail: "marcus@sterlingcapital.com",
    guestPhone: "+1 (555) 890-4411",
    checkIn: "2026-11-05",
    checkOut: "2026-11-10",
    nights: 5,
    guests: 3,
    totalAmount: 4250,
    paymentStatus: "Paid",
    paymentMethod: "Stripe (Amex 1004)",
    bookingStatus: "Confirmed",
    specialRequests: "Private chef service requested for Nov 7 evening.",
    addOns: [{ name: "Dedicated Private Chef Evening", price: 500 }],
    createdAt: "2026-10-25T09:00:00Z"
  },
  {
    id: "BK-8019",
    roomId: "room-303",
    roomName: "Executive Diplomatic Suite",
    roomNumber: "303",
    guestId: "user-1",
    guestName: "Lord Johnathan Vance",
    guestEmail: "john.vance@luxurytravel.com",
    guestPhone: "+1 (555) 349-2810",
    checkIn: "2026-09-12",
    checkOut: "2026-09-15",
    nights: 3,
    guests: 1,
    totalAmount: 1140,
    paymentStatus: "Paid",
    paymentMethod: "Stripe (Visa 4242)",
    bookingStatus: "Checked-Out",
    specialRequests: "Quiet room high floor.",
    addOns: [],
    createdAt: "2026-09-01T12:00:00Z"
  }
];

export const initialStaff = [
  {
    id: "staff-1",
    name: "Sarah Jenkins",
    role: "Front Desk & Operations Manager",
    department: "Front Office",
    shift: "Morning (07:00 - 15:30)",
    email: "sarah.j@hotelpro.luxury",
    phone: "+1 (555) 123-4567",
    status: "Active",
    rating: 4.95,
    assignedTasks: 4
  },
  {
    id: "staff-2",
    name: "Mateo Rodriguez",
    role: "Head of Housekeeping",
    department: "Housekeeping",
    shift: "Day (08:30 - 17:00)",
    email: "mateo.r@hotelpro.luxury",
    phone: "+1 (555) 234-5678",
    status: "Active",
    rating: 4.88,
    assignedTasks: 8
  },
  {
    id: "staff-3",
    name: "David Chen",
    role: "Chief Engineer & Maintenance",
    department: "Facilities",
    shift: "Evening (14:00 - 22:30)",
    email: "david.c@hotelpro.luxury",
    phone: "+1 (555) 345-6789",
    status: "Active",
    rating: 4.9,
    assignedTasks: 2
  },
  {
    id: "staff-4",
    name: "Claire Dupont",
    role: "Head Concierge (Les Clefs d'Or)",
    department: "Guest Relations",
    shift: "Morning (08:00 - 16:30)",
    email: "claire.d@hotelpro.luxury",
    phone: "+1 (555) 456-7890",
    status: "Active",
    rating: 5.0,
    assignedTasks: 3
  }
];

export const initialServices = [
  {
    id: "srv-301",
    roomNumber: "101",
    guestName: "Elena Rostova",
    type: "Room Service",
    title: "Gourmet Dinner & Vintage Pinot Noir",
    details: "Pan-seared Atlantic salmon with truffle risotto, plus 1 bottle Domaine Serene 2018.",
    timeRequested: "19:15",
    priority: "High",
    status: "In Progress", // Pending, In Progress, Completed
    assignedTo: "Sarah Jenkins"
  },
  {
    id: "srv-302",
    roomNumber: "303",
    guestName: "Housekeeping Schedule",
    type: "Housekeeping",
    title: "Deep Sanitization & Turndown Linen Change",
    details: "Room 303 requires complete changeover and minibar restocking.",
    timeRequested: "11:00",
    priority: "Medium",
    status: "Pending",
    assignedTo: "Mateo Rodriguez"
  },
  {
    id: "srv-303",
    roomNumber: "204",
    guestName: "Facilities Dispatch",
    type: "Maintenance",
    title: "Balcony Sliding Glass Acoustic Seal Adjustment",
    details: "Track alignment inspection before releasing to inventory.",
    timeRequested: "14:30",
    priority: "High",
    status: "In Progress",
    assignedTo: "David Chen"
  },
  {
    id: "srv-304",
    roomNumber: "202",
    guestName: "Lord Johnathan Vance",
    type: "Concierge",
    title: "Private Helicopter Tour Booking for 2",
    details: "Sunset scenic tour over Riviera coastline scheduled for Friday 17:30.",
    timeRequested: "16:45",
    priority: "Normal",
    status: "Completed",
    assignedTo: "Claire Dupont"
  }
];

export const initialNotifications = [
  {
    id: "notif-1",
    title: "VIP Arrival Expected Today",
    message: "Lord Johnathan Vance has checked into the Royal Oceanfront Suite (#202).",
    time: "10 mins ago",
    type: "booking",
    read: false
  },
  {
    id: "notif-2",
    title: "Service Request Updated",
    message: "Gourmet dinner order for Room #101 is now In Progress by Kitchen brigade.",
    time: "25 mins ago",
    type: "service",
    read: false
  },
  {
    id: "notif-3",
    title: "System Audit Alert",
    message: "High-demand weekend pricing rules automatically activated for November.",
    time: "1 hour ago",
    type: "system",
    read: true
  },
  {
    id: "notif-4",
    title: "Payment Received",
    message: "Stripe processed $4,250.00 for Presidential Penthouse Suite (BK-8023).",
    time: "3 hours ago",
    type: "payment",
    read: true
  }
];

export const initialAuditLogs = [
  { id: "log-1", timestamp: "2026-10-27 00:45:12", user: "Alexander Wright (Admin)", action: "Updated Seasonal Pricing", details: "Applied +15% surge multiplier for Thanksgiving week." },
  { id: "log-2", timestamp: "2026-10-26 22:14:05", user: "Sarah Jenkins (Staff)", action: "Guest Check-In", details: "Completed check-in for Elena Rostova into Room 101." },
  { id: "log-3", timestamp: "2026-10-26 19:30:22", user: "System Payment Gateway", action: "Stripe Webhook Verified", details: "Transaction ref_ch_99218201 confirmed $2,600.00." },
  { id: "log-4", timestamp: "2026-10-26 16:02:40", user: "Mateo Rodriguez (Staff)", action: "Room Status Changed", details: "Room 101 updated from Dirty to Clean." },
  { id: "log-5", timestamp: "2026-10-26 11:20:18", user: "Security Watchdog", action: "Successful Admin Login", details: "Session started from verified corporate IP 192.168.1.104." }
];

export const initialUsers = [
  { id: "user-1", name: "Lord Johnathan Vance", email: "john.vance@luxurytravel.com", role: "guest", status: "Active", joined: "2025-04-12", bookingsCount: 6 },
  { id: "user-2", name: "Elena Rostova", email: "elena.rostova@artgallery.eu", role: "guest", status: "Active", joined: "2025-08-19", bookingsCount: 2 },
  { id: "user-3", name: "Marcus Sterling", email: "marcus@sterlingcapital.com", role: "guest", status: "Active", joined: "2026-01-05", bookingsCount: 4 },
  { id: "staff-1", name: "Sarah Jenkins", email: "sarah.j@hotelpro.luxury", role: "staff", status: "Active", joined: "2024-02-10", department: "Front Office" },
  { id: "staff-2", name: "Mateo Rodriguez", email: "mateo.r@hotelpro.luxury", role: "staff", status: "Active", joined: "2024-06-15", department: "Housekeeping" },
  { id: "admin-1", name: "Alexander Wright", email: "alexander.wright@hotelpro.luxury", role: "admin", status: "Active", joined: "2023-01-01", department: "Executive Board" }
];

export const initialHotelConfig = {
  hotelName: "HotelPro Grand Palace & Resort",
  brandSubtitle: "The Benchmark of Contemporary Elegance",
  address: "740 Royal Ocean Boulevard, Côte d'Azur & Monaco Coast",
  phone: "+1 (800) 888-PRO-LUX",
  email: "concierge@hotelpro.luxury",
  currency: "USD ($)",
  taxRatePercent: 12,
  resortFeePerNight: 35,
  checkInTime: "15:00",
  checkOutTime: "11:00",
  cancellationFreeHours: 48,
  seasonalPricingMultiplier: 1.0,
  seasonalCampaignName: "Standard Autumn Elegance",
  maintenanceMode: false
};

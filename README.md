# HotelPro | Enterprise Hotel Property Management & Luxury Booking Platform

> A full-stack MERN enterprise hospitality application engineered for 5-star palatial resorts, boutique hotels, and luxury estates. Built with **React 19, Redux Toolkit, Express.js, MongoDB/Mongoose, JWT Authentication, Stripe Payments, and Nodemailer**.

---

## 🏛️ Project Vision & Aesthetic

HotelPro is styled in an opulent **Tuscan Olive Green & Pale Yellow** luxury theme:
- **Pale Yellow Accents** (`#fef9c3`, `#fef08a`, `#fde047`, `#fefce8`): Royal crests, rating stars, gold-leaf badges, primary CTAs, and luminous accents.
- **Deep Sanctuary Olive Greens** (`#12180e`, `#1e2a18`, `#26361f`, `#324328`, `#556b2f`): Ultra-premium matte cards, navigation headers, elevated surfaces, and ambient backdrop.
- **Expansive Fluid Layout**: Wide-angle viewport scaling across 100% of large desktop monitors and responsive mobile screens.

---

## 🚀 Key Modules & Architecture

### 1. Guest Experience & Public Portal
- **Hero & Curated Discovery**: High-res suite carousel, interactive date/guest quick search, 5-star amenities catalog, guest reviews, and VIP Privilege signup.
- **Suites Catalog & Dynamic Multi-Filter**: Real-time filtering by category (Penthouse, Presidential, Executive, Deluxe), price slider, guest capacity, amenities, and sorting.
- **Suite Details & Live Booking Engine**: Interactive photo gallery, dynamic nightly rate calculation with taxes and resort fees, and verified reviews.
- **4-Step Booking & Payment Checkout**:
  1. Stay details review with voucher promo code (`VIP10` for 10% off).
  2. Guest registration & VIP preferences.
  3. Stripe Credit Card simulated visualizer.
  4. Instant confirmation with QR Code and downloadable itemized Folio Bill.
- **Guest Dashboard**: Active stay card with interactive **NFC "Tap to Unlock" Digital Room Key**, stay history (Active, Past, Cancelled), and 1-click **100% refund cancellation modal**.

### 2. Staff Operations Terminal (`/staff-dashboard`)
- **Arrivals & Departures**: Real-time queue with 1-click **Express Check-In** and **Express Check-Out**.
- **Interactive Housekeeping Grid**: Visual room status grid with instant toggle: `Clean`, `Dirty`, `Inspected`, `Out of Order`.
- **Service Request Queue**: Live dispatch for Room Service, Housekeeping, and Maintenance tickets with staff assignment and status progression.
- **Staff Shift Roster**: Daily coverage schedules across Concierge, Housekeeping, Front Desk, and Culinary teams.

### 3. Hotel Management & Inventory (`/hotel-management`)
- **Suite Inventory CRUD**: Add new luxury suites with specs, bed type, size, amenities, and pricing.
- **Dynamic Seasonal Pricing**: Multipliers for peak holiday surges (1.25x), summer rush (1.4x), and low season discounts (0.9x).
- **7-Day Room Availability Matrix**: Visual calendar grid displaying room availability states across the week.

### 4. Executive Analytics & Platform Governance (`/admin`)
- **Real-Time KPIs**: Gross Revenue, Active Bookings, Occupancy Rate, ADR (Average Daily Rate), and RevPAR.
- **Interactive Visualizations (Recharts)**:
  - Monthly Revenue & Bookings Area Chart.
  - Suite Category Revenue Share Donut Chart.
  - 7-Day Occupancy Trend Line Chart.
- **Master User Directory**: Account management with role elevation (`guest` ↔ `staff` ↔ `admin`).
- **Security & Compliance Audit Trail**: Immutable system events and financial reconciliation logs.
- **Global Hotel Configuration**: Tax percentage, resort fees, maintenance mode toggle, and contact details.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Redux Toolkit, React Router v7, Bootstrap 5, Material UI (MUI), Lucide React Icons, Recharts, React Toastify |
| **Styling** | Custom Vanilla CSS Design System with Pale Yellow & Tuscan Olive Green variables |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose ODM (with automatic resilient in-memory fallback) |
| **Authentication** | JSON Web Tokens (JWT), BcryptJS password hashing |
| **Payments** | Stripe SDK (with test simulator) |
| **Email Service** | Nodemailer (with formatted HTML folio booking receipts) |
| **File Uploads** | Multer storage engine |

---

## 🔌 API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /register`: Register guest account with bcrypt hashing.
- `POST /login`: Authenticate and receive signed JWT token.
- `GET /me`: Get authenticated user profile & VIP preferences.
- `PUT /profile`: Update profile info and dietary/floor preferences.

### Rooms & Inventory (`/api/rooms`)
- `GET /`: List suites with multi-query filters (`category`, `minPrice`, `maxPrice`, `capacity`, `availableOnly`, `search`).
- `GET /:id`: Get suite details by ID or room number (`PH-01`, etc.).
- `POST /`: Create new suite with image upload support (Staff/Admin).
- `PUT /:id`: Update suite fields.
- `PATCH /:id/status`: Update housekeeping status (`Clean`, `Dirty`, `Inspected`, `Out of Order`).
- `PATCH /pricing/multiplier`: Update seasonal surge multiplier.
- `GET /availability/matrix`: 7-day visual availability matrix.

### Reservations & Bookings (`/api/bookings`)
- `POST /`: Create new reservation (triggers Nodemailer confirmation email).
- `GET /`: List reservations (guest sees own; staff/admin sees all).
- `GET /:id`: Get booking by reference or ID.
- `GET /active/stay`: Get active stay for current guest.
- `POST /:id/cancel`: Cancel reservation with automated 100% refund.
- `POST /:id/checkin`: Express check-in and issue NFC key.
- `POST /:id/checkout`: Express check-out (marks room Dirty).

### Service Dispatch (`/api/services`)
- `GET /`: List service tickets.
- `POST /`: Submit service request (Room Service, Housekeeping, etc.).
- `PATCH /:id/status`: Update ticket status (`Pending`, `In Progress`, `Completed`).

### Reviews & Feedback (`/api/reviews`)
- `GET /`: Get verified guest reviews.
- `POST /`: Submit review with star rating (1-5).

### Payments (`/api/payments`)
- `POST /create-payment-intent`: Create Stripe payment intent.
- `POST /verify`: Verify settlement.

### Executive Administration (`/api/admin`)
- `GET /analytics`: Retrieve KPIs, ADR, RevPAR, and Recharts series.
- `GET /users`: List registered accounts.
- `PATCH /users/:id/role`: Change account role.
- `GET /audit-logs`: System audit trail.
- `GET /config`: Hotel configuration.
- `PUT /config`: Update tax and resort fees.

---

## ⚡ Quick Start & Installation

### 1. Clone Repository
```bash
git clone https://github.com/Yash-me1987/HotelPro.git
cd HotelPro
```

### 2. Install Dependencies
```bash
# Install root & backend dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
cd ..
```

### 3. Environment Configuration
Create `server/.env` (defaults are pre-configured):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/hotelpro
JWT_SECRET=hotelpro_super_secret_jwt_key_2026_luxury_stays
JWT_EXPIRE=30d
STRIPE_SECRET_KEY=sk_test_51MockStripeSecretKeyForHotelProDevelopment99238472
CLIENT_URL=http://localhost:5173
```

### 4. Run Application
```bash
# Start backend server
npm run server

# Start client development server
npm run dev
```

- **Frontend Client**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api`
- **Health Check**: `http://localhost:5000/api/health`

### 5. Run Test Suite
```bash
npm run test
```
*Executes all 20 end-to-end integration tests for authentication, inventory, bookings, check-in/out, services, reviews, Stripe payments, and admin analytics.*

---

## 🎭 Demo Personas (1-Click Switcher)

| Persona | Role | Features Accessible |
|---|---|---|
| **Eleanor Sterling** | Guest | Booking engine, room details, NFC digital key, stay history, cancellation modal |
| **Elena Rostova** | Staff | Express Check-in/out, Live Room Status Grid, housekeeping dispatch |
| **Julian Vance** | Admin | Executive Recharts KPIs (ADR, RevPAR, Revenue), Master User Directory, Inventory CRUD, Audit Trail |

---

## 📄 License
ISC © HotelPro Grand Palace & Spa. All rights reserved.

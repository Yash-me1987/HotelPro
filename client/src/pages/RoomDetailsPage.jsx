import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { startBooking } from '../redux/slices/bookingsSlice';
import ReviewModal from '../components/ReviewModal';
import {
  Star,
  Users,
  Maximize2,
  Calendar,
  ShieldCheck,
  Check,
  Wifi,
  Sparkles,
  Award,
  Coffee,
  Tv,
  Wine,
  Car,
  Utensils,
  ArrowLeft,
  Share2,
  Heart
} from 'lucide-react';
import { toast } from 'react-toastify';

export const RoomDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rooms = useSelector((state) => state.rooms.rooms);
  const room = rooms.find((r) => r.id === id) || rooms[0];

  const [activeImage, setActiveImage] = useState(room.images[0]);
  const [checkIn, setCheckIn] = useState(new Date().toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );
  const [guests, setGuests] = useState(2);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Available Add-Ons
  const addOnsCatalog = [
    { id: 'add-1', name: 'VIP Airport Chauffeur (Mercedes S-Class)', price: 120, icon: <Car size={16} /> },
    { id: 'add-2', name: 'Chilled Bottle of Dom Pérignon 2012', price: 280, icon: <Wine size={16} /> },
    { id: 'add-3', name: 'Daily Champagne & Caviar Breakfast for Two', price: 90, icon: <Coffee size={16} /> },
    { id: 'add-4', name: 'Private Butler-Curated 5-Course Dinner', price: 350, icon: <Utensils size={16} /> }
  ];

  // Calculate nights
  const nights = Math.max(
    1,
    Math.round((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)) || 1
  );

  const roomSubtotal = nights * room.price;
  const addOnsSubtotal = selectedAddOns.reduce((sum, item) => sum + item.price, 0);
  const taxes = Math.round((roomSubtotal + addOnsSubtotal) * 0.12);
  const resortFee = nights * 35;
  const grandTotal = roomSubtotal + addOnsSubtotal + taxes + resortFee;

  const toggleAddOn = (addon) => {
    if (selectedAddOns.some((item) => item.id === addon.id)) {
      setSelectedAddOns(selectedAddOns.filter((item) => item.id !== addon.id));
    } else {
      setSelectedAddOns([...selectedAddOns, addon]);
    }
  };

  const handleProceedToBooking = () => {
    dispatch(
      startBooking({
        room,
        checkIn,
        checkOut,
        nights,
        guests,
        addOns: selectedAddOns,
        totalAmount: grandTotal
      })
    );
    navigate('/booking');
  };

  const handleSaveRoom = () => {
    setIsSaved(!isSaved);
    toast.success(!isSaved ? 'Suite saved to your luxury wishlist.' : 'Removed from wishlist.');
  };

  return (
    <div className="room-details-page py-5" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container py-2">
        {/* Navigation Breadcrumb */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Link to="/rooms" className="btn btn-sm btn-secondary-custom d-flex align-items-center gap-1">
            <ArrowLeft size={16} /> Back to Accommodations
          </Link>
          <div className="d-flex align-items-center gap-2">
            <button
              onClick={handleSaveRoom}
              className={`btn btn-sm btn-secondary-custom d-flex align-items-center gap-1 ${isSaved ? 'text-danger' : ''}`}
            >
              <Heart size={16} fill={isSaved ? '#ef4444' : 'none'} />
              {isSaved ? 'Saved' : 'Wishlist'}
            </button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                toast.info('Suite link copied to clipboard.');
              }}
              className="btn btn-sm btn-secondary-custom d-flex align-items-center gap-1"
            >
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>

        {/* Title Header */}
        <div className="mb-4">
          <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
            <span className="badge bg-dark border border-warning text-warning px-3 py-1">
              {room.category}
            </span>
            <span className={`badge ${
              room.status === 'Clean' ? 'badge-clean' :
              room.status === 'Inspected' ? 'badge-inspected' :
              room.status === 'Dirty' ? 'badge-dirty' : 'badge-out-of-order'
            }`}>
              {room.status}
            </span>
            <div className="d-flex align-items-center gap-1 text-warning small ms-auto">
              <Star size={16} fill="#f59e0b" />
              <span className="fw-bold fs-6">{room.rating}</span>
              <span className="text-muted">({room.reviewsCount} verified reviews)</span>
            </div>
          </div>
          <h1 className="display-5 font-serif fw-bold mb-1">{room.name}</h1>
          <p className="text-muted">
            Room #{room.roomNumber} &bull; Floor {room.floor} &bull; HotelPro Grand Palace Sanctuary
          </p>
        </div>

        {/* Gallery Showcase */}
        <div className="mb-5">
          <div className="rounded-3 overflow-hidden shadow-lg position-relative mb-2" style={{ height: '460px' }}>
            <img
              src={activeImage}
              alt={room.name}
              className="w-100 h-100 object-fit-cover transition-normal"
            />
          </div>
          <div className="d-flex gap-2 overflow-x-auto pb-2">
            {room.images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`rounded overflow-hidden cursor-pointer flex-shrink-0 border-2 ${
                  activeImage === img ? 'border border-warning' : 'opacity-70'
                }`}
                style={{ width: '120px', height: '80px', cursor: 'pointer' }}
              >
                <img src={img} alt="" className="w-100 h-100 object-fit-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Content Layout: Details Left, Booking Widget Right */}
        <div className="row g-5">
          {/* Left Column: Details & Amenities */}
          <div className="col-lg-7">
            {/* Specs Bar */}
            <div className="card-luxury p-3 mb-4">
              <div className="row text-center g-2">
                <div className="col-3 border-end">
                  <div className="text-muted small">Space</div>
                  <div className="fw-bold fs-6">{room.sizeSqFt} sq ft</div>
                </div>
                <div className="col-3 border-end">
                  <div className="text-muted small">Max Capacity</div>
                  <div className="fw-bold fs-6">{room.capacity} Guests</div>
                </div>
                <div className="col-3 border-end">
                  <div className="text-muted small">Bed Setup</div>
                  <div className="fw-bold fs-6 small">{room.bedType}</div>
                </div>
                <div className="col-3">
                  <div className="text-muted small">Floor Level</div>
                  <div className="fw-bold fs-6">Floor {room.floor}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-5">
              <h4 className="font-serif fw-bold mb-3">Suite Overview</h4>
              <p className="text-muted" style={{ lineHeight: '1.8', fontSize: '1.05rem' }}>
                {room.description}
              </p>
              <p className="text-muted" style={{ lineHeight: '1.8' }}>
                Each detail within this bespoke residence has been handcrafted to foster ultimate peace and rejuvenation. Furnished with fine Italian leather, French oak millwork, and custom acoustic architecture, your privacy and comfort are guaranteed.
              </p>
            </div>

            {/* Amenities Checklist */}
            <div className="mb-5">
              <h4 className="font-serif fw-bold mb-3">Included Luxury Amenities</h4>
              <div className="row g-3">
                {room.amenities.map((amenity, idx) => (
                  <div className="col-sm-6" key={idx}>
                    <div className="d-flex align-items-center gap-2">
                      <div className="stat-icon-wrapper" style={{ width: '32px', height: '32px', backgroundColor: 'var(--gold-50)' }}>
                        <Check size={16} className="text-warning" />
                      </div>
                      <span className="small fw-semibold">{amenity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hotel Policies & Guarantees */}
            <div className="card-luxury p-4 mb-5" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <h5 className="font-serif fw-bold mb-3 text-warning">Guest Privileges & Booking Guarantee</h5>
              <ul className="text-muted small list-unstyled d-flex flex-column gap-2 mb-0">
                <li className="d-flex align-items-center gap-2">
                  <Check size={14} className="text-success" />
                  <strong>Free Cancellation:</strong> Full refund up to 48 hours prior to check-in.
                </li>
                <li className="d-flex align-items-center gap-2">
                  <Check size={14} className="text-success" />
                  <strong>VIP Club Access:</strong> Complimentary afternoon tea, sundowner cocktails, and hors d'oeuvres.
                </li>
                <li className="d-flex align-items-center gap-2">
                  <Check size={14} className="text-success" />
                  <strong>Mobile Key Entry:</strong> Unlock your suite door seamlessly from the HotelPro Guest Portal.
                </li>
              </ul>
            </div>

            {/* Verified Reviews Section */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="font-serif fw-bold mb-0">Verified Guest Reviews</h4>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="btn btn-sm btn-gold-outline"
                >
                  Write A Review
                </button>
              </div>

              <div className="card-luxury p-4">
                <div className="row align-items-center mb-4">
                  <div className="col-sm-4 text-center border-end-sm">
                    <div className="display-4 font-serif fw-bold text-warning">{room.rating}</div>
                    <div className="d-flex justify-content-center gap-1 text-warning mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill="#f59e0b" />
                      ))}
                    </div>
                    <span className="text-muted small">Based on {room.reviewsCount} reviews</span>
                  </div>
                  <div className="col-sm-8 ps-sm-4 mt-3 mt-sm-0">
                    <div className="d-flex align-items-center gap-2 mb-1 small text-muted">
                      <span>Cleanliness</span>
                      <div className="progress flex-grow-1" style={{ height: '6px' }}>
                        <div className="progress-bar bg-warning" style={{ width: '98%' }} />
                      </div>
                      <span>4.9</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 mb-1 small text-muted">
                      <span>Staff & Service</span>
                      <div className="progress flex-grow-1" style={{ height: '6px' }}>
                        <div className="progress-bar bg-warning" style={{ width: '99%' }} />
                      </div>
                      <span>5.0</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 mb-1 small text-muted">
                      <span>Room Comfort</span>
                      <div className="progress flex-grow-1" style={{ height: '6px' }}>
                        <div className="progress-bar bg-warning" style={{ width: '97%' }} />
                      </div>
                      <span>4.9</span>
                    </div>
                  </div>
                </div>

                <div className="border-top pt-3">
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold small">Lord Johnathan Vance</span>
                      <span className="text-muted small">Stayed September 2026</span>
                    </div>
                    <div className="d-flex gap-1 text-warning mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={13} fill="#f59e0b" />
                      ))}
                    </div>
                    <p className="text-muted small mb-0">
                      "Unquestionably one of the finest suites in Europe. The bed feels like sleeping on clouds, and the sound insulation from the ocean balcony is state of the art."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Interactive Booking Widget */}
          <div className="col-lg-5">
            <div className="card-luxury p-4 position-sticky" style={{ top: '90px' }}>
              <div className="d-flex justify-content-between align-items-baseline mb-3 pb-3 border-bottom">
                <div>
                  <span className="text-muted small">Rate per night</span>
                  <div className="fs-3 font-serif fw-bold text-warning">${room.price}</div>
                </div>
                <div className="text-end">
                  <span className="badge bg-success-subtle text-success border border-success">
                    Available for Dates
                  </span>
                </div>
              </div>

              {/* Date Inputs */}
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold text-muted">Check-In</label>
                  <input
                    type="date"
                    className="input-luxury"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold text-muted">Check-Out</label>
                  <input
                    type="date"
                    className="input-luxury"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold text-muted">Guests</label>
                <select
                  className="input-luxury"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                >
                  {[...Array(room.capacity)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? 'Guest' : 'Guests'} (Max {room.capacity})
                    </option>
                  ))}
                </select>
              </div>

              {/* Add-ons Selector */}
              <div className="mb-4">
                <label className="form-label small fw-bold text-warning text-uppercase">
                  Curated Stay Enhancements
                </label>
                <div className="d-flex flex-column gap-2">
                  {addOnsCatalog.map((addon) => {
                    const isSelected = selectedAddOns.some((item) => item.id === addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddOn(addon)}
                        className={`p-2 rounded border cursor-pointer transition-fast d-flex align-items-center justify-content-between ${
                          isSelected ? 'border-warning bg-warning-subtle' : ''
                        }`}
                        style={{
                          backgroundColor: isSelected ? 'var(--gold-50)' : 'var(--bg-secondary)',
                          cursor: 'pointer'
                        }}
                      >
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="checkbox"
                            className="form-check-input mt-0"
                            checked={isSelected}
                            onChange={() => {}}
                          />
                          <span className="small fw-semibold">{addon.name}</span>
                        </div>
                        <span className="small fw-bold text-warning">+${addon.price}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="p-3 rounded mb-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="d-flex justify-content-between text-muted small mb-2">
                  <span>${room.price} &times; {nights} night(s)</span>
                  <span>${roomSubtotal}</span>
                </div>

                {addOnsSubtotal > 0 && (
                  <div className="d-flex justify-content-between text-muted small mb-2">
                    <span>Selected Enhancements ({selectedAddOns.length})</span>
                    <span>+${addOnsSubtotal}</span>
                  </div>
                )}

                <div className="d-flex justify-content-between text-muted small mb-2">
                  <span>Resort & Wellness Fee ($35 &times; {nights})</span>
                  <span>+${resortFee}</span>
                </div>

                <div className="d-flex justify-content-between text-muted small mb-3">
                  <span>Government Taxes (12%)</span>
                  <span>+${taxes}</span>
                </div>

                <div className="d-flex justify-content-between align-items-baseline pt-2 border-top">
                  <span className="fw-bold">Total Stay Amount</span>
                  <span className="fs-4 font-serif fw-bold text-warning">${grandTotal}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToBooking}
                className="btn btn-gold w-100 py-3 fs-6"
                disabled={!room.isAvailable}
              >
                {room.isAvailable ? 'Proceed to Reservation & Payment' : 'Suite Currently Unavailable'}
              </button>

              <div className="text-center text-muted small mt-3">
                <ShieldCheck size={14} className="text-success me-1 inline" />
                Guaranteed Best Rate &bull; Instant Confirmation
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        booking={{ roomName: room.name }}
      />
    </div>
  );
};

export default RoomDetailsPage;

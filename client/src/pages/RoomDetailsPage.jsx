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
  MapPin,
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
  const room = rooms.find((r) => r.id === id || r.roomNumber === id) || rooms[0];

  const [activeImage, setActiveImage] = useState(room.images[0]);
  const [checkIn, setCheckIn] = useState('2026-11-01');
  const [checkOut, setCheckOut] = useState('2026-11-04');
  const [guests, setGuests] = useState(2);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Available Add-Ons in INR
  const addOnsCatalog = [
    { id: 'add-1', name: 'Mercedes-Benz S-Class Airport Chauffeur', price: 6500, icon: <Car size={16} /> },
    { id: 'add-2', name: 'Private Sunset Shikara Boat High Tea', price: 4500, icon: <Wine size={16} /> },
    { id: 'add-3', name: 'Ayurvedic Abhyanga & Shirodhara Spa for Two', price: 5800, icon: <Sparkles size={16} /> },
    { id: 'add-4', name: 'Private Royal Khansama 7-Course Thali Dining', price: 7500, icon: <Utensils size={16} /> }
  ];

  // Calculate nights
  const nights = Math.max(
    1,
    Math.round((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)) || 1
  );

  const roomPrice = room.price || room.basePrice || 18500;
  const roomSubtotal = nights * roomPrice;
  const addOnsSubtotal = selectedAddOns.reduce((sum, item) => sum + item.price, 0);
  const taxes = Math.round((roomSubtotal + addOnsSubtotal) * 0.18); // 18% Luxury GST
  const resortFee = nights * 1500; // ₹ 1,500 Heritage Conservation & Wellness Fee
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
        totalAmount: grandTotal,
      })
    );
    navigate('/booking');
  };

  const handleSaveRoom = () => {
    setIsSaved(!isSaved);
    toast.success(!isSaved ? 'Residence saved to your luxury wishlist.' : 'Removed from wishlist.');
  };

  const displayTitle = room.title || room.name;
  const displayLocation = room.destination || room.location || 'India';

  return (
    <div style={{ backgroundColor: 'var(--bg-body)' }} className="py-4">
      <div className="container py-2">
        {/* Navigation Breadcrumb */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Link to="/rooms" className="pill-btn-outline" style={{ fontSize: '0.84rem' }}>
            <ArrowLeft size={16} /> Back to Palaces & Suites
          </Link>
          <div className="d-flex align-items-center gap-2">
            <button
              onClick={handleSaveRoom}
              className={`pill-btn-outline ${isSaved ? 'text-danger' : ''}`}
              style={{ fontSize: '0.84rem' }}
            >
              <Heart size={16} fill={isSaved ? '#e11d48' : 'none'} />
              <span>{isSaved ? 'Saved' : 'Wishlist'}</span>
            </button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                toast.info('Palace suite link copied to clipboard.');
              }}
              className="pill-btn-outline"
              style={{ fontSize: '0.84rem' }}
            >
              <Share2 size={16} /> <span>Share</span>
            </button>
          </div>
        </div>

        {/* Title Header */}
        <div className="mb-4">
          <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
            <span
              className="badge px-3 py-1"
              style={{ backgroundColor: 'var(--accent-gold-light)', color: 'var(--accent-gold)', border: '1px solid var(--accent-gold-border)' }}
            >
              {room.type || room.category || 'Palatial Residence'}
            </span>
            <div className="d-flex align-items-center gap-1 small ms-auto" style={{ color: '#f59e0b' }}>
              <Star size={16} fill="#f59e0b" />
              <span className="fw-bold fs-6 text-dark">{room.rating || 4.9}</span>
              <span className="text-muted">({room.reviewsCount || 1420} verified resident reviews)</span>
            </div>
          </div>
          <h1 className="display-5 font-serif fw-bold text-main mb-1">{displayTitle}</h1>
          <div className="d-flex align-items-center gap-2 text-muted small">
            <MapPin size={15} style={{ color: 'var(--accent-gold)' }} />
            <span>{displayLocation}</span>
            <span>&bull;</span>
            <span>Suite #{room.roomNumber}</span>
            <span>&bull;</span>
            <span>Lumière Grand Palaces Sanctuary</span>
          </div>
        </div>

        {/* Gallery Showcase */}
        <div className="mb-5">
          <div className="rounded-4 overflow-hidden position-relative mb-3" style={{ height: '520px', boxShadow: 'var(--shadow-card)' }}>
            <img
              src={activeImage}
              alt={displayTitle}
              className="w-100 h-100 object-fit-cover"
            />
          </div>
          <div className="d-flex gap-3 overflow-x-auto pb-2">
            {room.images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActiveImage(img)}
                className="rounded-3 overflow-hidden flex-shrink-0 cursor-pointer"
                style={{
                  width: '140px',
                  height: '90px',
                  cursor: 'pointer',
                  border: activeImage === img ? '2px solid var(--accent-gold)' : '2px solid transparent',
                  opacity: activeImage === img ? 1 : 0.65,
                  transition: 'all 0.2s ease',
                }}
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
            <div className="luxury-card p-3 mb-4">
              <div className="row text-center g-2">
                <div className="col-3 border-end">
                  <div className="text-muted small">Palace Space</div>
                  <div className="fw-bold fs-6 text-main">{room.sizeSqFt || room.size || 1200} sq ft</div>
                </div>
                <div className="col-3 border-end">
                  <div className="text-muted small">Max Guests</div>
                  <div className="fw-bold fs-6 text-main">{room.capacity} Guests</div>
                </div>
                <div className="col-3 border-end">
                  <div className="text-muted small">Royal Bedding</div>
                  <div className="fw-bold fs-6 small text-main text-truncate">{room.bedType || 'Royal Teak Bed'}</div>
                </div>
                <div className="col-3">
                  <div className="text-muted small">Floor Level</div>
                  <div className="fw-bold fs-6 text-main">Floor {room.floor || 2}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-5">
              <h3 className="font-serif fw-bold mb-3">Residence Overview</h3>
              <p className="text-secondary" style={{ lineHeight: '1.8', fontSize: '1.02rem' }}>
                {room.description}
              </p>
              <p className="text-secondary" style={{ lineHeight: '1.8' }}>
                Every architectural detail within this bespoke heritage sanctuary has been handcrafted to preserve centuries of royal Indian craftsmanship. Appointed with hand-carved Mewari marble, natural sandalwood accents, and custom acoustic architecture, uninterrupted tranquility is assured.
              </p>
            </div>

            {/* Amenities Checklist */}
            <div className="mb-5">
              <h3 className="font-serif fw-bold mb-3">Complimentary Palace Inclusions</h3>
              <div className="row g-3">
                {room.amenities.map((amenity, idx) => (
                  <div className="col-sm-6" key={idx}>
                    <div className="d-flex align-items-center gap-2 p-2 rounded-3" style={{ backgroundColor: 'var(--bg-surface-subtle)' }}>
                      <Check size={16} style={{ color: 'var(--accent-gold)' }} />
                      <span className="small fw-semibold text-main">{amenity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Reviews Section */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="font-serif fw-bold mb-0">Verified Guest Reviews</h3>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="pill-btn-outline"
                  style={{ fontSize: '0.8rem', padding: '6px 18px' }}
                >
                  Write a Review
                </button>
              </div>

              <div className="luxury-card p-4">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="fs-1 font-serif fw-bold text-main">{room.rating || 4.9}</div>
                  <div>
                    <div className="d-flex gap-1" style={{ color: '#f59e0b' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={15} fill="#f59e0b" />
                      ))}
                    </div>
                    <span className="text-muted small">Based on {room.reviewsCount || 1420} verified resident stays</span>
                  </div>
                </div>

                <div className="border-top pt-3">
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold small text-main">Aisha & Kabir Singhania</span>
                      <span className="text-muted small">Stayed October 2026</span>
                    </div>
                    <div className="d-flex gap-1 mb-2" style={{ color: '#f59e0b' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={13} fill="#f59e0b" />
                      ))}
                    </div>
                    <p className="text-secondary small mb-0">
                      "Unquestionably the most majestic palace stay in India. The private sunset shikara boat high tea on Lake Pichola, combined with the dedicated Khansama's Mewari thali, was truly unforgettable."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Interactive Booking Widget */}
          <div className="col-lg-5">
            <div className="luxury-card p-4 position-sticky" style={{ top: '100px' }}>
              <div className="d-flex justify-content-between align-items-baseline mb-3 pb-3 border-bottom">
                <div>
                  <span className="text-muted small">Nightly Tariff</span>
                  <div className="fs-2 font-serif fw-bold text-main">
                    ₹ {roomPrice.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="text-end">
                  <span className="badge-clean">
                    Instant Palace Confirmation
                  </span>
                </div>
              </div>

              {/* Date Inputs */}
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold text-muted">Check-In</label>
                  <input
                    type="date"
                    className="form-control rounded-3"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-surface-subtle)' }}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold text-muted">Check-Out</label>
                  <input
                    type="date"
                    className="form-control rounded-3"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn}
                    style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-surface-subtle)' }}
                  />
                </div>
              </div>

              {/* Guests Selector */}
              <div className="mb-4">
                <label className="form-label small fw-semibold text-muted">Guests</label>
                <select
                  className="form-select rounded-3"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-surface-subtle)' }}
                >
                  {[...Array(room.capacity || 4)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? 'Guest' : 'Guests'} (Max {room.capacity || 4})
                    </option>
                  ))}
                </select>
              </div>

              {/* Add-ons Selector */}
              <div className="mb-4">
                <label className="form-label small fw-bold text-uppercase" style={{ color: 'var(--accent-gold)', letterSpacing: '0.05em' }}>
                  Curated Royal Enhancements
                </label>
                <div className="d-flex flex-column gap-2">
                  {addOnsCatalog.map((addon) => {
                    const isSelected = selectedAddOns.some((item) => item.id === addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddOn(addon)}
                        className="p-2 rounded-3 border d-flex align-items-center justify-content-between"
                        style={{
                          backgroundColor: isSelected ? 'var(--accent-gold-light)' : 'var(--bg-surface-subtle)',
                          borderColor: isSelected ? 'var(--accent-gold)' : 'var(--border-subtle)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <div className="d-flex align-items-center gap-2">
                          <span style={{ color: 'var(--accent-gold)' }}>{addon.icon}</span>
                          <span className="small fw-medium text-main">{addon.name}</span>
                        </div>
                        <span className="small fw-bold text-main">
                          +₹ {addon.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Calculation Folio */}
              <div className="p-3 rounded-3 mb-4" style={{ backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-subtle)' }}>
                <div className="d-flex justify-content-between small text-secondary mb-2">
                  <span>₹ {roomPrice.toLocaleString('en-IN')} x {nights} night(s)</span>
                  <span>₹ {roomSubtotal.toLocaleString('en-IN')}</span>
                </div>
                {addOnsSubtotal > 0 && (
                  <div className="d-flex justify-content-between small text-secondary mb-2">
                    <span>Royal Inclusions ({selectedAddOns.length})</span>
                    <span>₹ {addOnsSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between small text-secondary mb-2">
                  <span>18% Luxury GST Slab</span>
                  <span>₹ {taxes.toLocaleString('en-IN')}</span>
                </div>
                <div className="d-flex justify-content-between small text-secondary mb-3">
                  <span>Heritage Conservation & Wellness Fee</span>
                  <span>₹ {resortFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="d-flex justify-content-between fw-bold border-top pt-2 fs-5 text-main">
                  <span className="font-serif">Total Payable</span>
                  <span className="font-serif" style={{ color: 'var(--accent-gold)' }}>
                    ₹ {grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Proceed to Booking */}
              <button
                onClick={handleProceedToBooking}
                className="pill-btn-dark w-100 py-3 mb-3"
              >
                <span>Proceed to Reserve</span>
                <ShieldCheck size={18} />
              </button>

              <div className="text-center text-muted small">
                <span>100% Refundable cancellation up to 48 hours prior to arrival</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          roomName={displayTitle}
          onClose={() => setShowReviewModal(false)}
        />
      )}
    </div>
  );
};

export default RoomDetailsPage;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  Heart,
  Star,
  Sparkles,
  ShieldCheck,
  Compass,
  UtensilsCrossed,
  Flower2,
  ChevronRight
} from 'lucide-react';
import { popularDestinations } from '../data/initialData';
import { setSelectedCategory, setSearchTerm } from '../redux/slices/roomsSlice';

export const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rooms = useSelector((state) => state.rooms.rooms);

  // Search Bar State
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('2026-11-01');
  const [checkOut, setCheckOut] = useState('2026-11-05');
  const [guests, setGuests] = useState('2 guests, 1 room');

  // Favorites state
  const [favorites, setFavorites] = useState(['SU-402', 'PH-101']);

  const toggleFavorite = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((f) => f !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (destination) {
      dispatch(setSearchTerm(destination));
    }
    navigate('/rooms');
  };

  // Get 4 featured luxury suites for grid (matching reference layout)
  const featuredStays = rooms.slice(0, 4);

  return (
    <div style={{ backgroundColor: 'var(--bg-body)' }}>
      {/* ===================================================================
          1. LUXURY HERO BANNER (MATCHING REFERENCE IMAGE)
          =================================================================== */}
      <section
        className="luxury-hero"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=2200&q=85')`,
        }}
      >
        <div className="luxury-hero-overlay" />

        <div className="container position-relative" style={{ zIndex: 10 }}>
          <div className="luxury-hero-content">
            {/* Subtle Eyebrow Kicker */}
            <div className="eyebrow-kicker eyebrow-kicker-white mb-3">
              STAY BEYOND ORDINARY
            </div>

            {/* Editorial Headline */}
            <h1 className="luxury-hero-title">
              Where Every Stay Feels Special
            </h1>

            {/* Subtitle */}
            <p className="luxury-hero-subtitle">
              Discover handpicked luxury palaces, breathtaking Himalayan retreats,
              and unforgettable heritage experiences across India and beyond.
            </p>

            {/* Pill CTA Button */}
            <div className="d-flex align-items-center gap-3">
              <Link to="/rooms" className="pill-btn-white">
                <span>Explore Stays</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          2. FLOATING SEARCH BAR (MATCHING REFERENCE EXACT STRUCTURE)
          =================================================================== */}
      <div className="floating-search-container">
        <form onSubmit={handleSearchSubmit} className="floating-search-card">
          {/* Destination */}
          <div className="search-field-item">
            <MapPin size={20} className="search-field-icon" />
            <div className="search-field-content w-100">
              <span className="search-field-label">Destination</span>
              <input
                type="text"
                placeholder="Where are you going? (e.g. Udaipur, Manali, Mumbai)"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="search-field-input"
              />
            </div>
          </div>

          {/* Check In */}
          <div className="search-field-item">
            <Calendar size={20} className="search-field-icon" />
            <div className="search-field-content">
              <span className="search-field-label">Check In</span>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="search-field-input"
                style={{ cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Check Out */}
          <div className="search-field-item">
            <Calendar size={20} className="search-field-icon" />
            <div className="search-field-content">
              <span className="search-field-label">Check Out</span>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="search-field-input"
                style={{ cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Guests */}
          <div className="search-field-item">
            <Users size={20} className="search-field-icon" />
            <div className="search-field-content">
              <span className="search-field-label">Guests</span>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="search-field-input"
                style={{ cursor: 'pointer', background: 'transparent', border: 'none' }}
              >
                <option value="1 guest, 1 room">1 guest, 1 room</option>
                <option value="2 guests, 1 room">2 guests, 1 room</option>
                <option value="3 guests, 1 room">3 guests, 1 room</option>
                <option value="4+ guests, Family Suite">4+ guests, Family Suite</option>
              </select>
            </div>
          </div>

          {/* Search Button (Dark Charcoal Pill) */}
          <button type="submit" className="pill-btn-dark py-3 px-4 flex-shrink-0">
            <span>Search Hotels</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>

      {/* ===================================================================
          3. FEATURED STAYS (MATCHING REFERENCE EXACT CARDS & PRICING)
          =================================================================== */}
      <section className="py-5">
        <div className="container">
          {/* Section Header with View All */}
          <div className="d-flex align-items-end justify-content-between mb-4">
            <div>
              <div className="eyebrow-kicker mb-2">HANDPICKED FOR YOU</div>
              <h2 className="display-6 font-serif fw-bold m-0">Featured Stays</h2>
            </div>
            <Link
              to="/rooms"
              className="d-inline-flex align-items-center gap-1 text-decoration-none fw-semibold"
              style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}
            >
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* 4-Column Grid */}
          <div className="row g-4">
            {featuredStays.map((stay) => (
              <div key={stay.id} className="col-12 col-md-6 col-lg-3">
                <Link to={`/rooms/${stay.id || stay.roomNumber}`} className="text-decoration-none">
                  <div className="stay-card">
                    {/* Image with Heart Wishlist */}
                    <div className="stay-card-img-wrapper">
                      <img
                        src={stay.images[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'}
                        alt={stay.title || stay.name}
                        className="stay-card-img"
                        loading="lazy"
                      />
                      <button
                        onClick={(e) => toggleFavorite(stay.id, e)}
                        className={`stay-card-heart-btn ${favorites.includes(stay.id) ? 'active' : ''}`}
                        title="Add to Wishlist"
                      >
                        <Heart size={16} fill={favorites.includes(stay.id) ? '#e11d48' : 'none'} />
                      </button>

                      {stay.category && (
                        <div className="stay-card-badge">{stay.category}</div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="stay-card-body">
                      {/* Location Tag */}
                      <div className="stay-card-location">
                        <MapPin size={13} style={{ color: 'var(--accent-gold)' }} />
                        <span>{stay.destination || stay.location || 'India'}</span>
                      </div>

                      {/* Title */}
                      <h3 className="stay-card-title text-truncate" title={stay.title || stay.name}>
                        {stay.title || stay.name}
                      </h3>

                      {/* Footer: Rating & Price */}
                      <div className="stay-card-footer">
                        <div className="stay-card-rating">
                          <Star size={14} fill="#f59e0b" color="#f59e0b" />
                          <span>{stay.rating || 4.9}</span>
                          <span className="stay-card-reviews">
                            ({(stay.reviewsCount || 1200) > 999 ? `${((stay.reviewsCount || 1200)/1000).toFixed(1)}K` : stay.reviewsCount})
                          </span>
                        </div>

                        <div className="text-end">
                          <span className="stay-card-price">
                            ₹ {(stay.price || stay.basePrice || 12999).toLocaleString('en-IN')}
                          </span>
                          <span className="stay-card-price-unit"> / night</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================
          4. POPULAR DESTINATIONS (MATCHING REFERENCE IMAGE)
          =================================================================== */}
      <section className="py-5" id="destinations" style={{ backgroundColor: 'var(--bg-surface-subtle)' }}>
        <div className="container">
          <div className="d-flex align-items-end justify-content-between mb-4">
            <div>
              <div className="eyebrow-kicker mb-2">POPULAR DESTINATIONS</div>
              <h2 className="display-6 font-serif fw-bold m-0">Explore India & Beyond</h2>
            </div>
            <Link
              to="/rooms"
              className="d-inline-flex align-items-center gap-1 text-decoration-none fw-semibold"
              style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}
            >
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="row g-3">
            {popularDestinations.map((dest) => (
              <div key={dest.id} className="col-6 col-md-4 col-lg-2">
                <div
                  onClick={() => {
                    dispatch(setSearchTerm(dest.name));
                    navigate('/rooms');
                  }}
                  className="destination-card"
                  style={{ cursor: 'pointer' }}
                >
                  <img src={dest.image} alt={dest.name} className="destination-card-img" />
                  <div className="destination-card-overlay">
                    <h4 className="destination-card-title">{dest.name}</h4>
                    <p className="destination-card-sub">{dest.state}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================
          5. AUTHENTIC INDIAN ROYAL HOSPITALITY PILLARS
          =================================================================== */}
      <section className="py-5 my-3">
        <div className="container">
          <div className="text-center mb-5" style={{ maxWidth: '720px', margin: '0 auto' }}>
            <div className="eyebrow-kicker mb-2">ATITHI DEVO BHAVA</div>
            <h2 className="display-5 font-serif fw-bold mb-3">
              The Quintessence of Indian Hospitality
            </h2>
            <p className="text-secondary" style={{ fontSize: '1.02rem' }}>
              Where ancient royal traditions meet contemporary five-star indulgence.
              Every stay is curated by personal Khansamas, wellness vaidyas, and heritage concierges.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div className="luxury-card h-100 text-center p-4">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: '64px', height: '64px', backgroundColor: 'var(--accent-gold-light)', color: 'var(--accent-gold)' }}
                >
                  <UtensilsCrossed size={28} />
                </div>
                <h3 className="font-serif fs-4 fw-bold mb-2">Royal Khansama Dining</h3>
                <p className="text-secondary small mb-0">
                  Private royal recipes preserved across generations, from decadent Rajasthani Daal Baati Churma to fragrant Malabar Coast spice-infused lobster.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="luxury-card h-100 text-center p-4">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: '64px', height: '64px', backgroundColor: 'var(--accent-gold-light)', color: 'var(--accent-gold)' }}
                >
                  <Flower2 size={28} />
                </div>
                <h3 className="font-serif fs-4 fw-bold mb-2">Ayurvedic Sanctuary</h3>
                <p className="text-secondary small mb-0">
                  Customized dosha evaluations, therapeutic Shirodhara with cold-pressed herbal oils, and sunrise Himalayan yoga pavilions overlooking the mist.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="luxury-card h-100 text-center p-4">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: '64px', height: '64px', backgroundColor: 'var(--accent-gold-light)', color: 'var(--accent-gold)' }}
                >
                  <Sparkles size={28} />
                </div>
                <h3 className="font-serif fs-4 fw-bold mb-2">Contactless Digital Key</h3>
                <p className="text-secondary small mb-0">
                  Effortlessly bypass the front desk with smart NFC room entry directly from your smartphone, coupled with 24/7 instant WhatsApp Butler dispatch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          6. EDITORIAL CTA BANNER
          =================================================================== */}
      <section
        className="py-5 position-relative text-center text-white my-4"
        style={{
          background: `linear-gradient(180deg, rgba(18,18,18,0.75) 0%, rgba(18,18,18,0.92) 100%), url('https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=2000&q=80') center/cover`,
          borderRadius: '24px',
          maxWidth: '94%',
          margin: '0 auto 60px auto',
          padding: '80px 20px',
        }}
      >
        <div className="position-relative" style={{ zIndex: 2, maxWidth: '750px', margin: '0 auto' }}>
          <div className="eyebrow-kicker eyebrow-kicker-white mb-3">EXCLUSIVE PRIVILEGE CLUB</div>
          <h2 className="display-5 font-serif fw-bold mb-3 text-white">
            Begin Your Indian Palace Journey
          </h2>
          <p className="lead opacity-90 mb-4" style={{ fontWeight: 300 }}>
            Join our Lumière Privilege Club for complimentary suite upgrades,
            18% GST absorption benefits, and bespoke Lake Pichola private boat dining.
          </p>
          <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap">
            <Link to="/rooms" className="pill-btn-white">
              Explore Available Suites
            </Link>
            <Link to="/guest-dashboard" className="pill-btn-outline" style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)' }}>
              Access Resident Folio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedCategory, setSearchTerm } from '../redux/slices/roomsSlice';
import {
  Calendar,
  Users,
  Search,
  Star,
  Award,
  Sparkles,
  Wifi,
  Coffee,
  ShieldCheck,
  Compass,
  ArrowRight,
  CheckCircle2,
  Tv,
  Bath,
  UtensilsCrossed,
  Crown
} from 'lucide-react';

export const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rooms = useSelector((state) => state.rooms.rooms);
  const featuredRooms = rooms.slice(0, 3);

  // Quick Search Widget State
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [category, setCategory] = useState('All');

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSelectedCategory(category));
    navigate('/rooms');
  };

  return (
    <div className="home-page">
      {/* Luxury Hero Banner */}
      <section
        className="hero-luxury"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=85")'
        }}
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3 border"
               style={{ backgroundColor: 'rgba(254, 240, 138, 0.12)', borderColor: 'var(--yellow-300)', backdropFilter: 'blur(8px)' }}>
            <Sparkles size={16} className="text-warning" />
            <span className="small text-warning fw-semibold text-uppercase" style={{ letterSpacing: '0.1em' }}>
              The World's Most Prestigious Stay
            </span>
          </div>

          <h1 className="display-3 font-serif fw-bold text-white mb-3" style={{ letterSpacing: '-0.02em', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            Sanctuary of Refinement & Unrivaled Comfort
          </h1>
          <p className="lead text-light opacity-90 mx-auto mb-4" style={{ maxWidth: '980px', fontWeight: 300 }}>
            Welcome to HotelPro Grand Palace. Experience bespoke hospitality, masterfully designed suites, Michelin-star culinary journeys, and an effortless digital stay management system.
          </p>

          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/rooms" className="btn btn-gold btn-lg px-4 py-3">
              Explore Our Suites <ArrowRight size={18} />
            </Link>
            <Link to="/guest-dashboard" className="btn btn-secondary-custom btn-lg px-4 py-3">
              Manage Active Stay
            </Link>
          </div>

          {/* Quick Search Widget */}
          <div className="search-widget mt-5 text-start">
            <form onSubmit={handleSearch} className="row g-3 align-items-end">
              <div className="col-12 col-md-3">
                <label className="form-label small fw-bold text-muted d-flex align-items-center gap-1">
                  <Calendar size={14} className="text-warning" /> Check-In Date
                </label>
                <input
                  type="date"
                  className="input-luxury"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="col-12 col-md-3">
                <label className="form-label small fw-bold text-muted d-flex align-items-center gap-1">
                  <Calendar size={14} className="text-warning" /> Check-Out Date
                </label>
                <input
                  type="date"
                  className="input-luxury"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="col-6 col-md-2">
                <label className="form-label small fw-bold text-muted d-flex align-items-center gap-1">
                  <Users size={14} className="text-warning" /> Guests
                </label>
                <select
                  className="input-luxury"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4+ Guests</option>
                </select>
              </div>

              <div className="col-6 col-md-2">
                <label className="form-label small fw-bold text-muted d-flex align-items-center gap-1">
                  <Compass size={14} className="text-warning" /> Suite Type
                </label>
                <select
                  className="input-luxury"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="All">All Suites</option>
                  <option value="Presidential">Presidential</option>
                  <option value="Ocean View">Ocean View</option>
                  <option value="Executive Suite">Executive</option>
                  <option value="Deluxe">Deluxe King</option>
                  <option value="Family Villa">Family Villa</option>
                </select>
              </div>

              <div className="col-12 col-md-2">
                <button type="submit" className="btn btn-gold w-100 py-2 d-flex align-items-center justify-content-center gap-2">
                  <Search size={16} /> Check Availability
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Suites Showcase */}
      <section className="py-5" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container py-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5">
            <div>
              <span className="text-warning small text-uppercase fw-bold letter-spacing-1">Signature Collections</span>
              <h2 className="display-6 font-serif fw-bold mt-1 mb-2">Featured Suites & Residences</h2>
              <p className="text-muted mb-0">Impeccably designed spaces curated for ultimate tranquility and grandeur.</p>
            </div>
            <Link to="/rooms" className="btn btn-gold-outline mt-3 mt-md-0">
              View All Accommodations &rarr;
            </Link>
          </div>

          <div className="row g-4">
            {featuredRooms.map((room) => (
              <div className="col-lg-4 col-md-6" key={room.id}>
                <div className="card-luxury h-100 d-flex flex-column overflow-hidden">
                  <div className="position-relative overflow-hidden" style={{ height: '240px' }}>
                    <img
                      src={room.images[0]}
                      alt={room.name}
                      className="w-100 h-100 object-fit-cover"
                      style={{ transition: 'transform 0.5s ease' }}
                    />
                    <div className="position-absolute top-0 start-0 m-3">
                      <span className="badge bg-dark bg-opacity-75 text-warning border border-warning px-2 py-1 small">
                        {room.category}
                      </span>
                    </div>
                    <div className="position-absolute bottom-0 end-0 m-3">
                      <span className="badge bg-dark bg-opacity-90 text-light px-3 py-2 fw-bold">
                        ${room.price} <small className="text-muted fw-normal">/ night</small>
                      </span>
                    </div>
                  </div>

                  <div className="p-4 d-flex flex-column flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center gap-1 text-warning small">
                        <Star size={15} fill="#f59e0b" />
                        <span className="fw-bold">{room.rating}</span>
                        <span className="text-muted">({room.reviewsCount} reviews)</span>
                      </div>
                      <span className="text-muted small">Floor {room.floor} &bull; Room #{room.roomNumber}</span>
                    </div>

                    <h5 className="font-serif fw-bold mb-2">{room.name}</h5>
                    <p className="text-muted small mb-3 flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {room.description}
                    </p>

                    <div className="d-flex align-items-center gap-3 text-muted small py-2 mb-3 border-top border-bottom">
                      <span>{room.bedType}</span>
                      <span>&bull;</span>
                      <span>{room.sizeSqFt} sq ft</span>
                      <span>&bull;</span>
                      <span>Max {room.capacity} Guests</span>
                    </div>

                    <div className="d-flex gap-2">
                      <Link to={`/rooms/${room.id}`} className="btn btn-secondary-custom flex-grow-1">
                        View Details
                      </Link>
                      <Link to={`/rooms/${room.id}`} className="btn btn-gold flex-grow-1">
                        Reserve Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5-Star Experience & Amenities */}
      <section id="amenities" className="py-5 border-top border-bottom" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="container py-4">
          <div className="text-center max-w-700 mx-auto mb-5">
            <span className="text-warning small text-uppercase fw-bold letter-spacing-1">World-Class Services</span>
            <h2 className="display-6 font-serif fw-bold mt-1 mb-3">The Epitome of Modern Hospitality</h2>
            <p className="text-muted">Every moment at HotelPro is curated with perfection, intuition, and sublime elegance.</p>
          </div>

          <div className="row g-4">
            {[
              {
                icon: <UtensilsCrossed size={28} className="text-warning" />,
                title: "Michelin-Star Gastronomy",
                desc: "Three bespoke dining salons helmed by world-renowned executive chefs, paired with our private subterranean wine cellar."
              },
              {
                icon: <Bath size={28} className="text-warning" />,
                title: "Lagoon Hydro-Spa & Thermal Baths",
                desc: "Holistic therapeutic rituals, magnesium plunge pools, and private steam cabanas designed for full restorative balance."
              },
              {
                icon: <ShieldCheck size={28} className="text-warning" />,
                title: "VIP 24/7 Butler & Concierge",
                desc: "Les Clefs d'Or accredited concierges catering to your private yacht charters, helicopter transfers, and discreet reservations."
              },
              {
                icon: <Wifi size={28} className="text-warning" />,
                title: "Ultra-Fast Fiber & Smart Suites",
                desc: "Integrated wireless room controls, automated thermal shading, 4K OLED streaming, and seamless keyless entry."
              }
            ].map((item, idx) => (
              <div className="col-md-6 col-lg-3" key={idx}>
                <div className="card-luxury p-4 h-100 text-center">
                  <div className="stat-icon-wrapper mx-auto mb-3" style={{ backgroundColor: 'var(--gold-50)' }}>
                    {item.icon}
                  </div>
                  <h5 className="font-serif fw-bold mb-2">{item.title}</h5>
                  <p className="text-muted small mb-0">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Hotel Statistics */}
      <section className="py-5" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container py-3">
          <div className="row g-4 text-center">
            <div className="col-6 col-lg-3">
              <div className="stat-card flex-column justify-content-center text-center">
                <h2 className="display-5 fw-bold text-warning font-serif mb-0">98.4%</h2>
                <span className="text-muted small text-uppercase fw-semibold mt-1">Guest Satisfaction Rating</span>
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="stat-card flex-column justify-content-center text-center">
                <h2 className="display-5 fw-bold text-warning font-serif mb-0">150+</h2>
                <span className="text-muted small text-uppercase fw-semibold mt-1">Bespoke Suites & Villas</span>
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="stat-card flex-column justify-content-center text-center">
                <h2 className="display-5 fw-bold text-warning font-serif mb-0">24/7</h2>
                <span className="text-muted small text-uppercase fw-semibold mt-1">Dedicated Royal Butler Service</span>
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="stat-card flex-column justify-content-center text-center">
                <h2 className="display-5 fw-bold text-warning font-serif mb-0">4.96</h2>
                <span className="text-muted small text-uppercase fw-semibold mt-1">Forbes & TripAdvisor Score</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Guest Testimonials */}
      <section className="py-5" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="container py-4">
          <div className="text-center max-w-700 mx-auto mb-5">
            <span className="text-warning small text-uppercase fw-bold letter-spacing-1">Guest Perspectives</span>
            <h2 className="display-6 font-serif fw-bold mt-1 mb-3">Words from Discerning Travelers</h2>
            <p className="text-muted">Stories of cherished moments and unforgettable stays at HotelPro Grand Palace.</p>
          </div>

          <div className="row g-4">
            {[
              {
                name: "Lady Genevieve Sinclair",
                title: "Frequent VIP Resident & Philanthropist",
                review: "The Presidential Penthouse exceeded even my highest expectations. The sunset views over the ocean combined with the bespoke butler service created a truly sublime holiday.",
                rating: 5,
                stay: "Presidential Penthouse Suite"
              },
              {
                name: "Sir Arthur Kensington",
                title: "Architectural Digest Contributing Editor",
                review: "Flawless attention to interior architecture and acoustic privacy. From the keyless mobile check-in to the seamless room service dispatch, HotelPro sets the gold standard.",
                rating: 5,
                stay: "Royal Oceanfront Suite"
              },
              {
                name: "Madame Chantal Moreau",
                title: "Art Biennale Curator",
                review: "The garden villa was our private paradise. Impeccable housekeeping, pristine cleanliness, and extraordinary dining. We have already booked our return stay.",
                rating: 5,
                stay: "Garden Luxury Villa"
              }
            ].map((t, idx) => (
              <div className="col-lg-4" key={idx}>
                <div className="card-luxury p-4 h-100 d-flex flex-column">
                  <div className="d-flex gap-1 text-warning mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="#f59e0b" />
                    ))}
                  </div>
                  <p className="text-muted fst-italic mb-4 flex-grow-1" style={{ fontSize: '0.95rem' }}>
                    "{t.review}"
                  </p>
                  <div className="pt-3 border-top d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="font-serif fw-bold mb-0">{t.name}</h6>
                      <span className="text-muted small">{t.title}</span>
                    </div>
                    <span className="badge bg-secondary-subtle text-muted small">{t.stay}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 position-relative text-center overflow-hidden"
               style={{ background: 'linear-gradient(135deg, #12180e 0%, #1e2a18 50%, #2f3e24 100%)', color: '#fff' }}>
        <div className="container py-5 position-relative" style={{ zIndex: 2 }}>
          <Crown size={40} className="text-warning mb-3" />
          <h2 className="display-5 font-serif fw-bold text-white mb-3">Begin Your Unforgettable Journey</h2>
          <p className="lead text-light opacity-80 mx-auto mb-4" style={{ maxWidth: '640px' }}>
            Book direct on HotelPro for guaranteed best rates, complimentary room upgrades upon availability, and late check-out privileges.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/rooms" className="btn btn-gold btn-lg px-4 py-3">
              Reserve Your Sanctuary Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

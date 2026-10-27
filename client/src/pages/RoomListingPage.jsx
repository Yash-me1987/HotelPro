import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  setSelectedCategory,
  setSearchTerm,
  setPriceRange,
  setSortBy
} from '../redux/slices/roomsSlice';
import { startBooking } from '../redux/slices/bookingsSlice';
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  Users,
  Maximize2,
  MapPin,
  Heart,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Check
} from 'lucide-react';

export const RoomListingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const rooms = useSelector((state) => state.rooms.rooms);
  const selectedCategory = useSelector((state) => state.rooms.selectedCategory);
  const searchTerm = useSelector((state) => state.rooms.searchTerm);
  const priceRange = useSelector((state) => state.rooms.priceRange);
  const sortBy = useSelector((state) => state.rooms.sortBy);

  const [viewMode, setViewMode] = useState('grid');
  const [selectedDestination, setSelectedDestination] = useState('All');
  const [capacityFilter, setCapacityFilter] = useState('All');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [favorites, setFavorites] = useState(['SU-402', 'PH-101']);

  const destinations = ['All', 'Udaipur', 'Manali', 'Mumbai', 'Goa', 'Jaipur', 'Kerala'];
  const categories = ['All', 'Presidential Suite', 'Executive Suite', 'Deluxe Room', 'Penthouse'];

  const toggleFavorite = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((f) => f !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const handleInstantBook = (room, e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      startBooking({
        room,
        totalAmount: room.price || room.basePrice || 18500,
        nights: 2,
        guests: 2,
      })
    );
    navigate('/booking');
  };

  // Filter & Sort Logic
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      // Category filter
      const roomType = room.type || room.category || '';
      if (selectedCategory !== 'All' && !roomType.toLowerCase().includes(selectedCategory.toLowerCase())) {
        return false;
      }

      // Destination filter
      if (selectedDestination !== 'All') {
        const dest = (room.destination || room.location || '').toLowerCase();
        if (!dest.includes(selectedDestination.toLowerCase())) return false;
      }

      // Search keyword
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesName = (room.title || room.name || '').toLowerCase().includes(query);
        const matchesDesc = (room.description || '').toLowerCase().includes(query);
        const matchesLoc = (room.destination || room.location || '').toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesLoc) return false;
      }

      // Guest Capacity
      if (capacityFilter !== 'All' && room.capacity < Number(capacityFilter)) {
        return false;
      }

      // Availability
      if (availableOnly && !room.isAvailable) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.price || a.basePrice || 0;
      const priceB = b.price || b.basePrice || 0;
      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
      return 0;
    });
  }, [rooms, selectedCategory, selectedDestination, searchTerm, capacityFilter, availableOnly, sortBy]);

  const handleResetFilters = () => {
    dispatch(setSelectedCategory('All'));
    dispatch(setSearchTerm(''));
    dispatch(setSortBy('recommended'));
    setSelectedDestination('All');
    setCapacityFilter('All');
    setAvailableOnly(false);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-body)' }} className="py-4">
      <div className="container">
        {/* Page Header */}
        <div className="pt-3 pb-4">
          <div className="eyebrow-kicker mb-2">CURATED COLLECTION · INDIA</div>
          <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-3">
            <div>
              <h1 className="display-5 font-serif fw-bold text-main m-0">
                Stays & Palatial Residences
              </h1>
              <p className="text-secondary mt-2 mb-0" style={{ maxWidth: '640px' }}>
                Explore handpicked luxury palaces, private coastal villas, and Himalayan sanctuaries.
                Rates are quoted in Indian Rupees (INR ₹) with all-inclusive five-star service.
              </p>
            </div>

            {/* View Mode Toggle & Counter */}
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted small fw-medium">
                Showing <strong>{filteredRooms.length}</strong> residences
              </span>
              <div
                className="d-inline-flex p-1 rounded-pill border"
                style={{ backgroundColor: '#ffffff', borderColor: 'var(--border-subtle)' }}
              >
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    backgroundColor: viewMode === 'grid' ? 'var(--btn-dark)' : 'transparent',
                    color: viewMode === 'grid' ? '#ffffff' : 'var(--text-muted)',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title="Grid View"
                >
                  <Grid size={15} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    backgroundColor: viewMode === 'list' ? 'var(--btn-dark)' : 'transparent',
                    color: viewMode === 'list' ? '#ffffff' : 'var(--text-muted)',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title="List View"
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            SEARCH & FILTER CONTROL BAR
            =================================================================== */}
        <div className="luxury-card mb-4 p-3 p-lg-4">
          <div className="row g-3 align-items-center">
            {/* Search Input */}
            <div className="col-12 col-md-5">
              <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill border" style={{ backgroundColor: 'var(--bg-surface-subtle)', borderColor: 'var(--border-subtle)' }}>
                <Search size={18} style={{ color: 'var(--accent-gold)' }} />
                <input
                  type="text"
                  placeholder="Search suites, locations (e.g. Udaipur, Manali, Mumbai)..."
                  value={searchTerm}
                  onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.88rem',
                    color: 'var(--text-main)',
                  }}
                />
              </div>
            </div>

            {/* Destination Selector */}
            <div className="col-6 col-md-2">
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="form-select rounded-pill"
                style={{ fontSize: '0.85rem', borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-surface-subtle)' }}
              >
                {destinations.map((d) => (
                  <option key={d} value={d}>
                    {d === 'All' ? 'All Destinations' : d}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Selector */}
            <div className="col-6 col-md-2">
              <select
                value={selectedCategory}
                onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
                className="form-select rounded-pill"
                style={{ fontSize: '0.85rem', borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-surface-subtle)' }}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'All' ? 'All Categories' : c}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Selector */}
            <div className="col-6 col-md-2">
              <select
                value={sortBy}
                onChange={(e) => dispatch(setSortBy(e.target.value))}
                className="form-select rounded-pill"
                style={{ fontSize: '0.85rem', borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-surface-subtle)' }}
              >
                <option value="recommended">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* Reset Filters */}
            <div className="col-6 col-md-1 text-end">
              <button
                onClick={handleResetFilters}
                className="btn btn-sm btn-outline-secondary rounded-pill w-100 d-flex align-items-center justify-content-center gap-1"
                title="Reset all filters"
                style={{ fontSize: '0.8rem', padding: '7px' }}
              >
                <RotateCcw size={14} />
                <span className="d-none d-xl-inline">Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* ===================================================================
            ROOMS DISPLAY GRID / LIST (MATCHING REFERENCE AESTHETIC)
            =================================================================== */}
        {filteredRooms.length === 0 ? (
          <div className="luxury-card text-center py-5 my-4">
            <Sparkles size={40} style={{ color: 'var(--accent-gold)' }} className="mb-3" />
            <h3 className="font-serif fw-bold fs-4">No Residences Match Your Filter</h3>
            <p className="text-secondary small mb-4">
              Try adjusting your destination or category criteria to discover available royal suites.
            </p>
            <button onClick={handleResetFilters} className="pill-btn-dark">
              Reset All Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View (4 Columns on large screen matching reference) */
          <div className="row g-4 mb-5">
            {filteredRooms.map((room) => {
              const displayTitle = room.title || room.name;
              const displayLocation = room.destination || room.location || 'India';
              const displayPrice = room.price || room.basePrice || 18500;

              return (
                <div key={room.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                  <div className="stay-card">
                    {/* Card Image */}
                    <div className="stay-card-img-wrapper">
                      <Link to={`/rooms/${room.id || room.roomNumber}`}>
                        <img
                          src={room.images[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'}
                          alt={displayTitle}
                          className="stay-card-img"
                          loading="lazy"
                        />
                      </Link>

                      {/* Wishlist Heart */}
                      <button
                        onClick={(e) => toggleFavorite(room.id, e)}
                        className={`stay-card-heart-btn ${favorites.includes(room.id) ? 'active' : ''}`}
                        title="Add to Wishlist"
                      >
                        <Heart size={16} fill={favorites.includes(room.id) ? '#e11d48' : 'none'} />
                      </button>

                      {/* Room Badge */}
                      <div className="stay-card-badge">
                        {room.type || room.category || 'Luxury Suite'}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="stay-card-body">
                      {/* Location */}
                      <div className="stay-card-location">
                        <MapPin size={13} style={{ color: 'var(--accent-gold)' }} />
                        <span>{displayLocation}</span>
                      </div>

                      {/* Title */}
                      <Link to={`/rooms/${room.id || room.roomNumber}`} className="text-decoration-none">
                        <h3 className="stay-card-title text-truncate" title={displayTitle}>
                          {displayTitle}
                        </h3>
                      </Link>

                      {/* Key Amenities */}
                      <div className="d-flex align-items-center gap-3 text-muted small my-2">
                        <span className="d-flex align-items-center gap-1">
                          <Users size={13} /> {room.capacity} Guests
                        </span>
                        <span className="d-flex align-items-center gap-1">
                          <Maximize2 size={13} /> {room.sizeSqFt || room.size || 850} sq ft
                        </span>
                      </div>

                      {/* Footer: Rating, Price, Reserve Button */}
                      <div className="stay-card-footer">
                        <div className="stay-card-rating">
                          <Star size={14} fill="#f59e0b" color="#f59e0b" />
                          <span>{room.rating || 4.9}</span>
                          <span className="stay-card-reviews">
                            ({(room.reviewsCount || 1200) > 999 ? `${((room.reviewsCount || 1200)/1000).toFixed(1)}K` : room.reviewsCount})
                          </span>
                        </div>

                        <div className="text-end">
                          <span className="stay-card-price">
                            ₹ {displayPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="stay-card-price-unit"> / night</span>
                        </div>
                      </div>

                      {/* Quick Reserve CTA */}
                      <div className="pt-3">
                        <button
                          onClick={(e) => handleInstantBook(room, e)}
                          className="pill-btn-dark w-100 py-2"
                          style={{ fontSize: '0.82rem' }}
                        >
                          <span>Reserve Suite</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View (Horizontal layout with spacious luxury) */
          <div className="d-flex flex-column gap-4 mb-5">
            {filteredRooms.map((room) => {
              const displayTitle = room.title || room.name;
              const displayLocation = room.destination || room.location || 'India';
              const displayPrice = room.price || room.basePrice || 18500;

              return (
                <div key={room.id} className="luxury-card p-3 p-lg-4">
                  <div className="row g-4 align-items-center">
                    <div className="col-12 col-md-4">
                      <div className="position-relative rounded-4 overflow-hidden" style={{ height: '220px' }}>
                        <img
                          src={room.images[0]}
                          alt={displayTitle}
                          className="w-100 h-100"
                          style={{ objectFit: 'cover' }}
                        />
                        <button
                          onClick={(e) => toggleFavorite(room.id, e)}
                          className={`stay-card-heart-btn ${favorites.includes(room.id) ? 'active' : ''}`}
                        >
                          <Heart size={16} fill={favorites.includes(room.id) ? '#e11d48' : 'none'} />
                        </button>
                      </div>
                    </div>

                    <div className="col-12 col-md-5">
                      <div className="stay-card-location mb-1">
                        <MapPin size={13} style={{ color: 'var(--accent-gold)' }} />
                        <span>{displayLocation}</span>
                      </div>
                      <Link to={`/rooms/${room.id || room.roomNumber}`} className="text-decoration-none">
                        <h3 className="font-serif fw-bold fs-4 text-main mb-2">{displayTitle}</h3>
                      </Link>
                      <p className="text-secondary small mb-3 text-truncate-2">
                        {room.description}
                      </p>

                      <div className="d-flex flex-wrap gap-2">
                        {room.amenities.slice(0, 3).map((am, i) => (
                          <span
                            key={i}
                            className="badge"
                            style={{ backgroundColor: 'var(--bg-surface-subtle)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)', fontWeight: 500 }}
                          >
                            <Check size={11} className="me-1 inline" style={{ color: 'var(--accent-gold)' }} />
                            {am}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="col-12 col-md-3 text-md-end border-top border-md-top-0 border-md-start pt-3 pt-md-0 ps-md-4">
                      <div className="d-flex align-items-center justify-content-md-end gap-1 mb-2">
                        <Star size={15} fill="#f59e0b" color="#f59e0b" />
                        <span className="fw-bold">{room.rating || 4.9}</span>
                        <span className="text-muted small">({room.reviewsCount || 1200} reviews)</span>
                      </div>
                      <div className="mb-3">
                        <div className="fs-3 fw-bold text-main font-serif">
                          ₹ {displayPrice.toLocaleString('en-IN')}
                        </div>
                        <span className="text-muted small">+ 18% Luxury GST & Wellness Fee</span>
                      </div>
                      <div className="d-flex flex-column gap-2">
                        <button
                          onClick={(e) => handleInstantBook(room, e)}
                          className="pill-btn-dark py-2"
                        >
                          Book Stay
                        </button>
                        <Link
                          to={`/rooms/${room.id || room.roomNumber}`}
                          className="pill-btn-outline py-2 justify-content-center"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomListingPage;

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
  CheckCircle,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const RoomListingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const rooms = useSelector((state) => state.rooms.rooms);
  const selectedCategory = useSelector((state) => state.rooms.selectedCategory);
  const searchTerm = useSelector((state) => state.rooms.searchTerm);
  const priceRange = useSelector((state) => state.rooms.priceRange);
  const sortBy = useSelector((state) => state.rooms.sortBy);

  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [capacityFilter, setCapacityFilter] = useState('All');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const categories = ['All', 'Presidential', 'Ocean View', 'Executive Suite', 'Deluxe', 'Family Villa'];
  const commonAmenities = ['All', 'High-Speed Wi-Fi 6', 'Panoramic Ocean View', 'Freestanding Soaking Tub', 'Butler On Demand', 'Private Sun Terrace'];

  // Filter & Sort Logic
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      // Category filter
      if (selectedCategory !== 'All' && room.category !== selectedCategory) return false;

      // Search keyword
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesName = room.name.toLowerCase().includes(query);
        const matchesDesc = room.description.toLowerCase().includes(query);
        const matchesCat = room.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }

      // Price range
      if (room.price < priceRange[0] || room.price > priceRange[1]) return false;

      // Capacity filter
      if (capacityFilter !== 'All') {
        const cap = Number(capacityFilter);
        if (room.capacity < cap) return false;
      }

      // Availability filter
      if (availableOnly && !room.isAvailable) return false;

      // Amenity filter
      if (selectedAmenity !== 'All' && !room.amenities.includes(selectedAmenity)) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // recommended
    });
  }, [rooms, selectedCategory, searchTerm, priceRange, capacityFilter, availableOnly, selectedAmenity, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage) || 1;
  const paginatedRooms = filteredRooms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleResetFilters = () => {
    dispatch(setSelectedCategory('All'));
    dispatch(setSearchTerm(''));
    dispatch(setPriceRange([150, 1000]));
    dispatch(setSortBy('recommended'));
    setCapacityFilter('All');
    setAvailableOnly(false);
    setSelectedAmenity('All');
    setCurrentPage(1);
  };

  const handleInstantBook = (room) => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
    dispatch(startBooking({
      room: room,
      checkIn: today,
      checkOut: tomorrow,
      nights: 2,
      guests: Math.min(2, room.capacity),
      totalAmount: room.price * 2
    }));
    navigate('/booking');
  };

  return (
    <div className="room-listing-page py-5" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container py-2">
        {/* Page Header */}
        <div className="mb-4 text-center text-md-start">
          <div className="d-flex align-items-center gap-2 mb-1 justify-content-center justify-content-md-start">
            <Sparkles size={16} className="text-warning" />
            <span className="text-warning small text-uppercase fw-bold letter-spacing-1">Luxury Accommodations</span>
          </div>
          <h1 className="display-6 font-serif fw-bold mb-2">Suites, Penthouses & Private Villas</h1>
          <p className="text-muted mb-0">Discover exceptional stays crafted with bespoke luxury, high-speed fiber, and serene coastal views.</p>
        </div>

        {/* Category Pills Bar */}
        <div className="d-flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                dispatch(setSelectedCategory(cat));
                setCurrentPage(1);
              }}
              className={`btn btn-sm text-nowrap rounded-pill px-3 py-2 fw-semibold ${
                selectedCategory === cat ? 'btn-gold' : 'btn-secondary-custom'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filter Bar & Controls */}
        <div className="card-luxury p-3 mb-4">
          <div className="row g-3 align-items-center">
            {/* Search Input */}
            <div className="col-12 col-md-4">
              <div className="position-relative">
                <input
                  type="text"
                  className="input-luxury ps-5 py-2"
                  placeholder="Search by suite name, feature or style..."
                  value={searchTerm}
                  onChange={(e) => {
                    dispatch(setSearchTerm(e.target.value));
                    setCurrentPage(1);
                  }}
                />
                <Search size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              </div>
            </div>

            {/* Price Filter */}
            <div className="col-6 col-md-3">
              <div className="d-flex justify-content-between text-muted small mb-1">
                <span>Max Price:</span>
                <span className="fw-bold text-warning">${priceRange[1]}/night</span>
              </div>
              <input
                type="range"
                className="form-range"
                min="200"
                max="1000"
                step="50"
                value={priceRange[1]}
                onChange={(e) => dispatch(setPriceRange([150, Number(e.target.value)]))}
              />
            </div>

            {/* Capacity Filter */}
            <div className="col-6 col-md-2">
              <select
                className="input-luxury py-2"
                value={capacityFilter}
                onChange={(e) => {
                  setCapacityFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="All">All Capacities</option>
                <option value="2">2+ Guests</option>
                <option value="3">3+ Guests</option>
                <option value="4">4+ Guests</option>
                <option value="6">6+ Guests</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="col-6 col-md-2">
              <select
                className="input-luxury py-2"
                value={sortBy}
                onChange={(e) => dispatch(setSortBy(e.target.value))}
              >
                <option value="recommended">Sort: Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* View Grid / List Toggle & Reset */}
            <div className="col-6 col-md-1 d-flex justify-content-end gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`btn btn-sm p-2 ${viewMode === 'grid' ? 'btn-gold' : 'btn-secondary-custom'}`}
                title="Grid View"
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`btn btn-sm p-2 ${viewMode === 'list' ? 'btn-gold' : 'btn-secondary-custom'}`}
                title="List View"
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {/* Sub Filters: Available Only & Reset */}
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-3 pt-3 border-top">
            <div className="d-flex align-items-center gap-3">
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="availOnly"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                />
                <label className="form-check-label small text-muted cursor-pointer" htmlFor="availOnly">
                  Show Available Rooms Only
                </label>
              </div>

              <div className="d-flex align-items-center gap-1 small text-muted d-none d-sm-flex">
                <span>Filter Amenity:</span>
                <select
                  className="input-luxury py-1 px-2 small"
                  style={{ width: 'auto', fontSize: '0.8rem' }}
                  value={selectedAmenity}
                  onChange={(e) => setSelectedAmenity(e.target.value)}
                >
                  {commonAmenities.map(am => (
                    <option key={am} value={am}>{am}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <span className="small text-muted">Showing <strong>{filteredRooms.length}</strong> suites</span>
              <button
                onClick={handleResetFilters}
                className="btn btn-sm btn-link text-decoration-none text-muted p-0 d-flex align-items-center gap-1"
                style={{ fontSize: '0.8rem' }}
              >
                <RotateCcw size={12} /> Reset
              </button>
            </div>
          </div>
        </div>

        {/* Room Results Grid or List */}
        {filteredRooms.length === 0 ? (
          <div className="text-center py-5 card-luxury p-5">
            <SlidersHorizontal size={40} className="text-warning mb-3 opacity-60" />
            <h4 className="font-serif fw-bold">No Suites Match Your Exact Criteria</h4>
            <p className="text-muted small mb-4">Try widening your price range or resetting the category filter.</p>
            <button onClick={handleResetFilters} className="btn btn-gold">
              Reset All Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="row g-4 mb-4">
            {paginatedRooms.map((room) => (
              <div className="col-lg-4 col-md-6" key={room.id}>
                <div className="card-luxury h-100 d-flex flex-column overflow-hidden">
                  {/* Image container */}
                  <div className="position-relative overflow-hidden" style={{ height: '230px' }}>
                    <img
                      src={room.images[0]}
                      alt={room.name}
                      className="w-100 h-100 object-fit-cover"
                    />
                    <div className="position-absolute top-0 start-0 m-3 d-flex gap-2">
                      <span className="badge bg-dark bg-opacity-75 text-warning border border-warning px-2 py-1 small">
                        {room.category}
                      </span>
                      <span className={`badge ${
                        room.status === 'Clean' ? 'badge-clean' :
                        room.status === 'Inspected' ? 'badge-inspected' :
                        room.status === 'Dirty' ? 'badge-dirty' : 'badge-out-of-order'
                      }`}>
                        {room.status}
                      </span>
                    </div>

                    <div className="position-absolute bottom-0 end-0 m-3">
                      <span className="badge bg-dark bg-opacity-90 text-light px-3 py-2 fw-bold">
                        ${room.price} <small className="text-muted fw-normal">/ night</small>
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 d-flex flex-column flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center gap-1 text-warning small">
                        <Star size={15} fill="#f59e0b" />
                        <span className="fw-bold">{room.rating}</span>
                        <span className="text-muted">({room.reviewsCount})</span>
                      </div>
                      <span className="text-muted small">Floor {room.floor} &bull; Room #{room.roomNumber}</span>
                    </div>

                    <h5 className="font-serif fw-bold mb-2">{room.name}</h5>
                    <p className="text-muted small mb-3 flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {room.description}
                    </p>

                    <div className="d-flex flex-wrap gap-1 mb-3">
                      {room.amenities.slice(0, 3).map((am, idx) => (
                        <span key={idx} className="badge bg-secondary-subtle text-muted" style={{ fontSize: '0.72rem' }}>
                          {am}
                        </span>
                      ))}
                      {room.amenities.length > 3 && (
                        <span className="badge bg-secondary-subtle text-muted" style={{ fontSize: '0.72rem' }}>
                          +{room.amenities.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="d-flex gap-2 mt-auto">
                      <Link to={`/rooms/${room.id}`} className="btn btn-secondary-custom flex-grow-1">
                        Details
                      </Link>
                      <button
                        onClick={() => handleInstantBook(room)}
                        disabled={!room.isAvailable}
                        className="btn btn-gold flex-grow-1"
                      >
                        {room.isAvailable ? 'Instant Book' : 'Occupied'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="d-flex flex-column gap-3 mb-4">
            {paginatedRooms.map((room) => (
              <div className="card-luxury p-3" key={room.id}>
                <div className="row g-3 align-items-center">
                  <div className="col-md-4 col-lg-3">
                    <div className="rounded overflow-hidden position-relative" style={{ height: '180px' }}>
                      <img
                        src={room.images[0]}
                        alt={room.name}
                        className="w-100 h-100 object-fit-cover"
                      />
                      <span className="position-absolute top-0 start-0 m-2 badge bg-dark bg-opacity-75 text-warning border border-warning small">
                        {room.category}
                      </span>
                    </div>
                  </div>

                  <div className="col-md-5 col-lg-6">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <div className="d-flex align-items-center gap-1 text-warning small">
                        <Star size={14} fill="#f59e0b" />
                        <span className="fw-bold">{room.rating}</span>
                        <span className="text-muted">({room.reviewsCount} reviews)</span>
                      </div>
                      <span className="text-muted small">&bull; Floor {room.floor} &bull; Room #{room.roomNumber}</span>
                      <span className={`badge ${
                        room.status === 'Clean' ? 'badge-clean' :
                        room.status === 'Inspected' ? 'badge-inspected' :
                        room.status === 'Dirty' ? 'badge-dirty' : 'badge-out-of-order'
                      }`}>
                        {room.status}
                      </span>
                    </div>

                    <h5 className="font-serif fw-bold mb-1">{room.name}</h5>
                    <p className="text-muted small mb-2">{room.description}</p>

                    <div className="d-flex flex-wrap gap-2 text-muted small">
                      <span><Users size={14} className="me-1 inline" />Max {room.capacity} Guests</span>
                      <span>&bull;</span>
                      <span><Maximize2 size={14} className="me-1 inline" />{room.sizeSqFt} sq ft</span>
                      <span>&bull;</span>
                      <span>{room.bedType}</span>
                    </div>
                  </div>

                  <div className="col-md-3 col-lg-3 text-md-end border-start-md ps-md-3">
                    <div className="fs-4 fw-bold text-warning font-serif mb-0">${room.price}</div>
                    <div className="text-muted small mb-3">per night + taxes</div>

                    <div className="d-flex flex-column gap-2">
                      <button
                        onClick={() => handleInstantBook(room)}
                        disabled={!room.isAvailable}
                        className="btn btn-gold w-100"
                      >
                        {room.isAvailable ? 'Instant Book' : 'Occupied'}
                      </button>
                      <Link to={`/rooms/${room.id}`} className="btn btn-secondary-custom w-100">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center gap-2 mt-4">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="btn btn-sm btn-secondary-custom"
            >
              &larr; Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`btn btn-sm ${currentPage === i + 1 ? 'btn-gold' : 'btn-secondary-custom'}`}
                style={{ minWidth: '36px' }}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="btn btn-sm btn-secondary-custom"
            >
              Next &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomListingPage;

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateRoomPrice,
  applySeasonalPricingToRooms,
  addRoom,
  updateRoomDetails,
  deleteRoom
} from '../redux/slices/roomsSlice';
import {
  toggleSeasonalRule,
  addStaffMember,
  updateStaffMember,
  deleteStaffMember,
  addAuditLog
} from '../redux/slices/hotelSlice';
import {
  Layers,
  Calendar,
  Users,
  Plus,
  Trash2,
  Edit,
  Sparkles,
  TrendingUp,
  Sliders,
  CheckCircle,
  Clock,
  ShieldAlert,
  Percent,
  X,
  MapPin
} from 'lucide-react';
import { toast } from 'react-toastify';
import { staffRoster } from '../data/initialData';

export const HotelManagementPage = () => {
  const dispatch = useDispatch();
  const rooms = useSelector((state) => state.rooms.rooms);
  const bookings = useSelector((state) => state.bookings.bookings);
  const { seasonalRules, config } = useSelector((state) => state.hotel);
  const { currentUser } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'pricing' | 'matrix' | 'shifts'
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);

  // New Room Form state in INR
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomCategory, setNewRoomCategory] = useState('Deluxe Room');
  const [newRoomDestination, setNewRoomDestination] = useState('Udaipur, Rajasthan');
  const [newRoomPrice, setNewRoomPrice] = useState(18500);
  const [newRoomCapacity, setNewRoomCapacity] = useState(2);
  const [newRoomFloor, setNewRoomFloor] = useState(2);
  const [newRoomBed, setNewRoomBed] = useState('Royal Teak King Bed');

  // Next 7 Days for Matrix
  const today = new Date();
  const next7Days = [...Array(7)].map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return {
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateNum: d.getDate(),
    };
  });

  const handleApplySeasonalRule = (rule) => {
    dispatch(toggleSeasonalRule(rule.id));
    dispatch(applySeasonalPricingToRooms(rule.multiplier));
    dispatch(
      addAuditLog({
        user: `${currentUser?.name || 'Palace Director'}`,
        action: 'Seasonal Dynamic Multiplier Applied',
        details: `Activated "${rule.name}" with rate multiplier ${rule.multiplier}x across all residences.`,
      })
    );
    toast.success(`Seasonal pricing "${rule.name}" applied! Multiplier: ${rule.multiplier}x.`);
  };

  const handleAddRoomSubmit = (e) => {
    e.preventDefault();
    if (!newRoomNumber || !newRoomName) {
      toast.error('Please enter room number and suite name.');
      return;
    }

    dispatch(
      addRoom({
        roomNumber: newRoomNumber,
        name: newRoomName,
        title: newRoomName,
        category: newRoomCategory,
        type: newRoomCategory,
        destination: newRoomDestination,
        basePrice: Number(newRoomPrice),
        price: Number(newRoomPrice),
        capacity: Number(newRoomCapacity),
        floor: Number(newRoomFloor),
        bedType: newRoomBed,
        sizeSqFt: 850,
        description: 'Bespoke royal accommodation designed with traditional Indian craftsmanship, Mewari marble, and modern quiet luxury.',
        amenities: ['24/7 Royal Khansama', 'Mewari Marble Jharokha', 'Ayurvedic Spa Bath', 'High-Speed Wi-Fi 6'],
        images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'],
      })
    );

    dispatch(
      addAuditLog({
        user: `${currentUser?.name || 'Palace Director'}`,
        action: 'Palace Inventory Added',
        details: `Added new Suite #${newRoomNumber} (${newRoomName}) to inventory.`,
      })
    );

    toast.success(`Suite #${newRoomNumber} added to inventory successfully.`);
    setShowAddRoomModal(false);
  };

  const occupiedCount = rooms.filter((r) => r.status === 'Dirty' || !r.isAvailable).length;
  const occupancyRate = Math.round((occupiedCount / (rooms.length || 6)) * 100) || 68;

  return (
    <div style={{ backgroundColor: 'var(--bg-body)' }} className="py-5">
      <div className="container py-2">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <div className="eyebrow-kicker mb-1">HOTEL RESORT INVENTORY & YIELD MANAGEMENT</div>
            <h1 className="display-6 font-serif fw-bold text-main m-0">
              Palace Suites & Seasonal Pricing
            </h1>
            <p className="text-secondary small mt-1 mb-0">
              Manage Indian property accommodations, seasonal multipliers, and 7-day live room availability matrix.
            </p>
          </div>

          <button
            onClick={() => setShowAddRoomModal(true)}
            className="pill-btn-dark py-2 px-4"
            style={{ fontSize: '0.85rem' }}
          >
            <Plus size={16} /> Add Luxury Suite
          </button>
        </div>

        {/* Metric Cards in INR */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-lg-3">
            <div className="stat-metric-card">
              <div>
                <div className="stat-metric-title">Total Residences</div>
                <div className="stat-metric-val">{rooms.length}</div>
                <span className="text-muted small">Palaces & Villas</span>
              </div>
              <Layers size={28} style={{ color: 'var(--accent-gold)' }} />
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="stat-metric-card">
              <div>
                <div className="stat-metric-title">Occupancy Rate</div>
                <div className="stat-metric-val">{occupancyRate}%</div>
                <span className="text-muted small">{occupiedCount} occupied</span>
              </div>
              <CheckCircle size={28} className="text-success" />
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="stat-metric-card">
              <div>
                <div className="stat-metric-title">Active Tariff Slab</div>
                <div className="stat-metric-val" style={{ color: 'var(--accent-gold)' }}>
                  INR (₹)
                </div>
                <span className="text-muted small">18% Luxury GST Standard</span>
              </div>
              <Sparkles size={28} style={{ color: 'var(--accent-gold)' }} />
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="stat-metric-card">
              <div>
                <div className="stat-metric-title">On-Duty Hospitality</div>
                <div className="stat-metric-val">{staffRoster.length}</div>
                <span className="text-muted small">Chief concierges & chefs</span>
              </div>
              <Users size={28} style={{ color: 'var(--accent-gold)' }} />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="d-flex gap-2 mb-4 border-bottom pb-2 overflow-x-auto">
          {[
            { id: 'inventory', label: `Suite Inventory (${rooms.length})`, icon: <Layers size={15} /> },
            { id: 'pricing', label: 'Dynamic & Seasonal Pricing', icon: <Percent size={15} /> },
            { id: 'matrix', label: '7-Day Availability Matrix', icon: <Calendar size={15} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                backgroundColor: activeTab === tab.id ? 'var(--btn-dark)' : 'transparent',
                color: activeTab === tab.id ? '#ffffff' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '9999px',
                padding: '8px 20px',
                fontSize: '0.86rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Inventory Table */}
        {activeTab === 'inventory' && (
          <div className="luxury-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="font-serif fw-bold text-main fs-4 m-0">Master Palatial Residences Inventory</h3>
              <span className="text-muted small">{rooms.length} suites registered</span>
            </div>

            <div className="table-responsive">
              <table className="luxury-table">
                <thead>
                  <tr>
                    <th>Suite #</th>
                    <th>Residence Name & Destination</th>
                    <th>Capacity</th>
                    <th>Nightly Tariff</th>
                    <th>Housekeeping</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => {
                    const displayTitle = room.title || room.name;
                    const displayPrice = room.price || room.basePrice || 18500;
                    const displayDest = room.destination || room.location || 'India';

                    return (
                      <tr key={room.id}>
                        <td className="fw-bold font-serif fs-5" style={{ color: 'var(--accent-gold)' }}>
                          #{room.roomNumber}
                        </td>
                        <td>
                          <div className="fw-semibold text-main">{displayTitle}</div>
                          <span className="text-muted small">
                            <MapPin size={11} className="inline me-1" style={{ color: 'var(--accent-gold)' }} />
                            {displayDest} &bull; {room.type || room.category}
                          </span>
                        </td>
                        <td>{room.capacity} Guests &bull; {room.sizeSqFt || 850} sq ft</td>
                        <td>
                          <div className="fw-bold font-serif text-main">
                            ₹ {displayPrice.toLocaleString('en-IN')}
                          </div>
                          <span className="text-muted small">+ 18% GST</span>
                        </td>
                        <td>
                          <span
                            className={
                              room.status === 'Clean'
                                ? 'badge-clean'
                                : room.status === 'Dirty'
                                ? 'badge-dirty'
                                : room.status === 'Inspected'
                                ? 'badge-inspected'
                                : 'badge-maintenance'
                            }
                          >
                            {room.status}
                          </span>
                        </td>
                        <td className="text-end">
                          <button
                            onClick={() => {
                              const newPrice = prompt(`Enter new base nightly tariff for Suite #${room.roomNumber} (INR ₹):`, displayPrice);
                              if (newPrice && !isNaN(newPrice)) {
                                dispatch(updateRoomPrice({ roomId: room.id, newPrice: Number(newPrice) }));
                                toast.success(`Tariff for Suite #${room.roomNumber} updated to ₹ ${Number(newPrice).toLocaleString('en-IN')}.`);
                              }
                            }}
                            className="pill-btn-outline py-1 px-3 me-2"
                            style={{ fontSize: '0.78rem' }}
                          >
                            <Edit size={13} /> Edit Tariff
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove Suite #${room.roomNumber} from active inventory?`)) {
                                dispatch(deleteRoom(room.id));
                                toast.info(`Suite #${room.roomNumber} removed.`);
                              }
                            }}
                            className="btn btn-sm btn-link text-danger p-1"
                            title="Remove Suite"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Dynamic Seasonal Pricing */}
        {activeTab === 'pricing' && (
          <div className="luxury-card p-4">
            <h3 className="font-serif fw-bold text-main fs-4 mb-2">Indian Festive & Seasonal Yield Campaigns</h3>
            <p className="text-secondary small mb-4">
              Deploy automated seasonal rate multipliers across all suites. Pricing updates in real time on the public portal and booking engine.
            </p>

            <div className="row g-3">
              {[
                { id: 'rule-diwali', name: 'Diwali Festival Royal Peak Surge', dates: 'Oct 28 - Nov 08', multiplier: 1.35, desc: 'Festive holiday peak demand surge across Rajasthan & Mumbai suites.' },
                { id: 'rule-newyear', name: 'Imperial New Year & Winter Gala', dates: 'Dec 22 - Jan 05', multiplier: 1.50, desc: 'High season international and VIP winter holiday peak.' },
                { id: 'rule-monsoon', name: 'Monsoon Ayurvedic Rejuvenation Escape', dates: 'Jun 15 - Aug 31', multiplier: 0.80, desc: 'Wellness retreat discount across Wayanad and Goa sanctuaries.' },
                { id: 'rule-spring', name: 'Holi & Spring Heritage Week', dates: 'Mar 10 - Mar 25', multiplier: 1.15, desc: 'Cultural festival surge for royal palace havelis in Jaipur and Udaipur.' },
              ].map((rule) => (
                <div key={rule.id} className="col-12 col-md-6">
                  <div className="p-3 rounded-3 border h-100 d-flex flex-column justify-content-between" style={{ backgroundColor: 'var(--bg-surface-subtle)', borderColor: 'var(--border-subtle)' }}>
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <h5 className="font-serif fw-bold text-main fs-6 m-0">{rule.name}</h5>
                        <span className="badge rounded-pill bg-dark text-white">{rule.multiplier}x Rate</span>
                      </div>
                      <div className="text-muted small mb-2">{rule.dates}</div>
                      <p className="text-secondary small mb-3">{rule.desc}</p>
                    </div>

                    <button
                      onClick={() => {
                        dispatch(applySeasonalPricingToRooms(rule.multiplier));
                        toast.success(`Applied ${rule.multiplier}x rate multiplier for "${rule.name}"!`);
                      }}
                      className="pill-btn-dark py-2 w-100"
                      style={{ fontSize: '0.8rem' }}
                    >
                      Apply {rule.multiplier}x Multiplier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: 7-Day Room Availability Matrix */}
        {activeTab === 'matrix' && (
          <div className="luxury-card p-4">
            <h3 className="font-serif fw-bold text-main fs-4 mb-2">7-Day Live Availability Matrix Calendar</h3>
            <p className="text-secondary small mb-4">
              Real-time schedule of all royal suites across the upcoming 7 calendar days.
            </p>

            <div className="table-responsive">
              <table className="table table-bordered text-center align-middle small">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '220px', textAlign: 'left' }}>Suite & Location</th>
                    {next7Days.map((d, i) => (
                      <th key={i}>
                        <div>{d.dayName}</div>
                        <div className="fw-bold">{d.dateNum}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room, rIdx) => {
                    const displayTitle = room.title || room.name;
                    return (
                      <tr key={room.id}>
                        <td className="text-start">
                          <span className="fw-bold font-serif text-main">Suite #{room.roomNumber}</span>
                          <div className="text-muted text-truncate" style={{ maxWidth: '200px', fontSize: '0.75rem' }}>
                            {displayTitle}
                          </div>
                        </td>
                        {next7Days.map((d, dayIdx) => {
                          const isOccupied = (rIdx + dayIdx) % 3 === 0;
                          return (
                            <td key={dayIdx} className="p-2">
                              {isOccupied ? (
                                <span className="badge bg-danger-subtle text-danger border border-danger px-2 py-1 rounded-pill">
                                  Occupied
                                </span>
                              ) : (
                                <span className="badge bg-success-subtle text-success border border-success px-2 py-1 rounded-pill">
                                  Available
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Room Modal */}
      {showAddRoomModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 1060,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div className="luxury-card p-4" style={{ maxWidth: '520px', width: '100%' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="font-serif fw-bold text-main fs-5 m-0">Add New Luxury Suite</h4>
              <button onClick={() => setShowAddRoomModal(false)} className="btn btn-sm btn-link text-muted p-0">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddRoomSubmit}>
              <div className="row g-3 mb-4">
                <div className="col-4">
                  <label className="form-label small text-muted">Suite Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SU-505"
                    className="form-control rounded-3"
                    value={newRoomNumber}
                    onChange={(e) => setNewRoomNumber(e.target.value)}
                  />
                </div>
                <div className="col-8">
                  <label className="form-label small text-muted">Suite Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Haveli Suite"
                    className="form-control rounded-3"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small text-muted">Category</label>
                  <select
                    className="form-select rounded-3"
                    value={newRoomCategory}
                    onChange={(e) => setNewRoomCategory(e.target.value)}
                  >
                    <option value="Presidential Suite">Presidential Suite</option>
                    <option value="Executive Suite">Executive Suite</option>
                    <option value="Deluxe Room">Deluxe Room</option>
                    <option value="Penthouse">Penthouse</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label small text-muted">Destination</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={newRoomDestination}
                    onChange={(e) => setNewRoomDestination(e.target.value)}
                    placeholder="e.g. Udaipur, Rajasthan"
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small text-muted">Tariff / Night (₹ INR)</label>
                  <input
                    type="number"
                    className="form-control rounded-3"
                    value={newRoomPrice}
                    onChange={(e) => setNewRoomPrice(Number(e.target.value))}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small text-muted">Capacity (Guests)</label>
                  <input
                    type="number"
                    className="form-control rounded-3"
                    value={newRoomCapacity}
                    onChange={(e) => setNewRoomCapacity(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddRoomModal(false)}
                  className="pill-btn-outline py-2 px-3"
                >
                  Cancel
                </button>
                <button type="submit" className="pill-btn-dark py-2 px-4">
                  Add to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelManagementPage;

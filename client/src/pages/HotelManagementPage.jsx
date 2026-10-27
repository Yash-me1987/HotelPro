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
  DollarSign,
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
  X
} from 'lucide-react';
import { toast } from 'react-toastify';

export const HotelManagementPage = () => {
  const dispatch = useDispatch();
  const rooms = useSelector((state) => state.rooms.rooms);
  const bookings = useSelector((state) => state.bookings.bookings);
  const { seasonalRules, staffList, config } = useSelector((state) => state.hotel);
  const { currentUser } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'pricing' | 'matrix' | 'shifts'
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);

  // New Room Form state
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomCategory, setNewRoomCategory] = useState('Deluxe');
  const [newRoomPrice, setNewRoomPrice] = useState(290);
  const [newRoomCapacity, setNewRoomCapacity] = useState(2);
  const [newRoomFloor, setNewRoomFloor] = useState(2);
  const [newRoomBed, setNewRoomBed] = useState('1 California King Bed');

  // New Staff Form state
  const [staffName, setStaffName] = useState('');
  const [staffRole, setStaffRole] = useState('Front Desk Executive');
  const [staffDept, setStaffDept] = useState('Front Office');
  const [staffShift, setStaffShift] = useState('Morning (07:00 - 15:30)');
  const [staffEmail, setStaffEmail] = useState('');

  // Availability matrix dates (Next 7 days)
  const today = new Date();
  const next7Days = [...Array(7)].map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  const handleApplySeasonalRule = (rule) => {
    dispatch(toggleSeasonalRule(rule.id));
    dispatch(applySeasonalPricingToRooms(rule.multiplier));
    dispatch(
      addAuditLog({
        user: `${currentUser?.name || 'Hotel Manager'}`,
        action: 'Seasonal Pricing Applied',
        details: `Activated "${rule.name}" with rate multiplier ${rule.multiplier}x.`
      })
    );
    toast.success(`Seasonal pricing "${rule.name}" applied! Multiplier: ${rule.multiplier}x.`);
  };

  const handleAddRoomSubmit = (e) => {
    e.preventDefault();
    if (!newRoomNumber || !newRoomName) {
      toast.error('Please enter room number and name.');
      return;
    }

    dispatch(
      addRoom({
        roomNumber: newRoomNumber,
        name: newRoomName,
        category: newRoomCategory,
        basePrice: Number(newRoomPrice),
        price: Number(newRoomPrice),
        capacity: Number(newRoomCapacity),
        floor: Number(newRoomFloor),
        bedType: newRoomBed,
        sizeSqFt: 500,
        description: 'New signature accommodation designed with contemporary elegance and bespoke luxury touches.',
        amenities: ['High-Speed Wi-Fi 6', '4K Smart OLED TV', 'Italian Marble Bathroom', '24/7 Room Service']
      })
    );

    dispatch(
      addAuditLog({
        user: `${currentUser?.name || 'Hotel Manager'}`,
        action: 'Room Inventory Added',
        details: `Added new Suite #${newRoomNumber} (${newRoomName}) to inventory.`
      })
    );

    toast.success(`Suite #${newRoomNumber} added to hotel inventory successfully.`);
    setShowAddRoomModal(false);
  };

  const handleAddStaffSubmit = (e) => {
    e.preventDefault();
    if (!staffName || !staffEmail) {
      toast.error('Please complete staff name and email.');
      return;
    }

    dispatch(
      addStaffMember({
        name: staffName,
        role: staffRole,
        department: staffDept,
        shift: staffShift,
        email: staffEmail,
        phone: '+1 (555) 789-0123'
      })
    );

    toast.success(`Staff member ${staffName} assigned to ${staffDept}.`);
    setShowAddStaffModal(false);
  };

  // Occupancy rate calculation
  const occupiedCount = rooms.filter((r) => r.status === 'Dirty' || !r.isAvailable).length;
  const occupancyRate = Math.round((occupiedCount / rooms.length) * 100) || 50;

  return (
    <div className="hotel-management-page py-5" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container py-2">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-warning text-dark px-2 py-1 small fw-bold">
                HOTEL MANAGEMENT PORTAL
              </span>
              <span className="text-muted small">&bull; Property Inventory & Yield Optimization</span>
            </div>
            <h2 className="font-serif fw-bold mb-0">Operations & Inventory Management</h2>
            <p className="text-muted small mb-0">Control room inventory, dynamic pricing rules, availability matrices, and staff rosters.</p>
          </div>

          <div className="d-flex gap-2">
            <button
              onClick={() => setShowAddRoomModal(true)}
              className="btn btn-gold btn-sm d-flex align-items-center gap-1"
            >
              <Plus size={16} /> Add New Suite
            </button>
            <button
              onClick={() => setShowAddStaffModal(true)}
              className="btn btn-secondary-custom btn-sm d-flex align-items-center gap-1"
            >
              <Users size={16} /> Add Staff Member
            </button>
          </div>
        </div>

        {/* Top Summary Metrics */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-lg-3">
            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--gold-50)' }}>
                <Layers size={22} className="text-warning" />
              </div>
              <div>
                <div className="fs-3 fw-bold font-serif">{rooms.length}</div>
                <div className="text-muted small">Total Suites in Inventory</div>
              </div>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--info-bg)' }}>
                <Percent size={22} className="text-info" />
              </div>
              <div>
                <div className="fs-3 fw-bold font-serif">{occupancyRate}%</div>
                <div className="text-muted small">Live Occupancy Rate</div>
              </div>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--success-bg)' }}>
                <TrendingUp size={22} className="text-success" />
              </div>
              <div>
                <div className="fs-3 fw-bold font-serif">{config.seasonalPricingMultiplier}x</div>
                <div className="text-muted small">Active Rate Multiplier</div>
              </div>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--warning-bg)' }}>
                <Users size={22} className="text-warning" />
              </div>
              <div>
                <div className="fs-3 fw-bold font-serif">{staffList.length}</div>
                <div className="text-muted small">Active Staff Duty Roster</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tabs-luxury mb-4">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
          >
            <Layers size={16} /> Suite Inventory ({rooms.length})
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`tab-btn ${activeTab === 'pricing' ? 'active' : ''}`}
          >
            <DollarSign size={16} /> Dynamic & Seasonal Pricing
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`tab-btn ${activeTab === 'matrix' ? 'active' : ''}`}
          >
            <Calendar size={16} /> Availability Matrix Calendar
          </button>
          <button
            onClick={() => setActiveTab('shifts')}
            className={`tab-btn ${activeTab === 'shifts' ? 'active' : ''}`}
          >
            <Users size={16} /> Staff Shift Allocation ({staffList.length})
          </button>
        </div>

        {/* TAB 1: Suite Inventory Management */}
        {activeTab === 'inventory' && (
          <div className="card-luxury p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="font-serif fw-bold mb-0">Master Suite Inventory</h5>
              <span className="text-muted small">{rooms.length} accommodations recorded</span>
            </div>

            <div className="table-luxury-wrapper">
              <table className="table-luxury">
                <thead>
                  <tr>
                    <th>Room #</th>
                    <th>Suite Name & Category</th>
                    <th>Floor</th>
                    <th>Capacity</th>
                    <th>Base Price</th>
                    <th>Live Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr key={room.id}>
                      <td>
                        <strong className="fs-5 font-serif text-warning">#{room.roomNumber}</strong>
                      </td>
                      <td>
                        <div className="fw-semibold">{room.name}</div>
                        <span className="badge bg-secondary-subtle text-muted">{room.category}</span>
                      </td>
                      <td>Floor {room.floor}</td>
                      <td>Max {room.capacity} Guests</td>
                      <td>
                        <div className="d-flex align-items-center gap-1">
                          <span className="text-warning fw-bold font-serif">${room.price}</span>
                          <span className="text-muted small">/ night</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${
                          room.status === 'Clean' ? 'badge-clean' :
                          room.status === 'Inspected' ? 'badge-inspected' :
                          room.status === 'Dirty' ? 'badge-dirty' : 'badge-out-of-order'
                        }`}>
                          {room.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          onClick={() => {
                            const newPrice = prompt(`Enter new base rate for Suite #${room.roomNumber}:`, room.price);
                            if (newPrice && !isNaN(newPrice)) {
                              dispatch(updateRoomPrice({ roomId: room.id, newPrice: Number(newPrice) }));
                              toast.success(`Price for Suite #${room.roomNumber} updated to $${newPrice}.`);
                            }
                          }}
                          className="btn btn-sm btn-secondary-custom me-1"
                          title="Edit Rate"
                        >
                          <Edit size={14} /> Rate
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove Suite #${room.roomNumber} from inventory?`)) {
                              dispatch(deleteRoom(room.id));
                              toast.info(`Suite #${room.roomNumber} removed.`);
                            }
                          }}
                          className="btn btn-sm btn-link text-danger p-1"
                          title="Delete Suite"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Dynamic & Seasonal Pricing Updates */}
        {activeTab === 'pricing' && (
          <div className="row g-4">
            <div className="col-lg-7">
              <div className="card-luxury p-4">
                <h5 className="font-serif fw-bold mb-3 text-warning">Seasonal Pricing Campaigns</h5>
                <p className="text-muted small mb-4">
                  Deploy seasonal yield multipliers across all room categories simultaneously. Rates update automatically in the booking engine.
                </p>

                <div className="d-flex flex-column gap-3">
                  {seasonalRules.map((rule) => (
                    <div
                      key={rule.id}
                      className={`p-3 rounded border transition-fast ${
                        rule.active ? 'border-warning bg-warning-subtle' : ''
                      }`}
                      style={{ backgroundColor: rule.active ? 'var(--gold-50)' : 'var(--bg-secondary)' }}
                    >
                      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
                        <div>
                          <div className="d-flex align-items-center gap-2">
                            <h6 className="fw-bold mb-0">{rule.name}</h6>
                            {rule.active && (
                              <span className="badge bg-warning text-dark fw-bold small">ACTIVE NOW</span>
                            )}
                          </div>
                          <div className="text-muted small">
                            Valid: {rule.startDate} &rarr; {rule.endDate} &bull; Multiplier: <strong>{rule.multiplier}x</strong> ({rule.multiplier > 1 ? `+${Math.round((rule.multiplier - 1) * 100)}% surge` : 'Standard/discounted'})
                          </div>
                        </div>

                        <button
                          onClick={() => handleApplySeasonalRule(rule)}
                          disabled={rule.active}
                          className={`btn btn-sm ${rule.active ? 'btn-secondary-custom' : 'btn-gold'}`}
                        >
                          {rule.active ? 'Currently Active' : 'Activate Rule'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="card-luxury p-4">
                <h5 className="font-serif fw-bold mb-3">Live Rate Preview After Multiplier</h5>
                <p className="text-muted small mb-3">
                  Current Campaign: <strong className="text-warning">{config.seasonalCampaignName}</strong> ({config.seasonalPricingMultiplier}x)
                </p>

                <div className="d-flex flex-column gap-2">
                  {rooms.map((room) => (
                    <div className="d-flex justify-content-between align-items-center p-2 rounded" key={room.id} style={{ backgroundColor: 'var(--bg-secondary)' }}>
                      <div>
                        <span className="fw-semibold small">Room #{room.roomNumber}</span>
                        <div className="text-muted small">{room.name}</div>
                      </div>
                      <div className="text-end">
                        <span className="fw-bold text-warning font-serif fs-5">${room.price}</span>
                        <div className="text-muted small" style={{ fontSize: '0.7rem' }}>Base: ${room.basePrice}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Visual Availability Matrix Calendar */}
        {activeTab === 'matrix' && (
          <div className="card-luxury p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="font-serif fw-bold mb-0">Suite Availability Timeline (Next 7 Days)</h5>
                <p className="text-muted small mb-0">Green indicates available for booking; Amber indicates reserved/occupied.</p>
              </div>
              <div className="d-flex gap-2">
                <span className="badge badge-clean">Available</span>
                <span className="badge badge-dirty">Occupied / Stay</span>
              </div>
            </div>

            <div className="table-luxury-wrapper">
              <table className="table-luxury text-center">
                <thead>
                  <tr>
                    <th className="text-start">Suite Room</th>
                    {next7Days.map((day) => (
                      <th key={day}>
                        <div className="small fw-bold">{new Date(day).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>{day.slice(5)}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room, rIdx) => (
                    <tr key={room.id}>
                      <td className="text-start">
                        <span className="fw-bold font-serif text-warning">#{room.roomNumber}</span>
                        <div className="text-muted small">{room.category}</div>
                      </td>
                      {next7Days.map((day, dIdx) => {
                        // Simulated booking status
                        const isBooked = (rIdx + dIdx) % 3 === 0;
                        return (
                          <td key={day}>
                            <span className={`badge ${!isBooked ? 'badge-clean' : 'badge-dirty'} py-2 px-2 w-100`}>
                              {!isBooked ? 'Open' : 'Booked'}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Staff Duty Roster */}
        {activeTab === 'shifts' && (
          <div className="card-luxury p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="font-serif fw-bold mb-0">Staff Department & Shift Scheduling</h5>
                <p className="text-muted small mb-0">Front office, housekeeping, guest relations, and engineering rosters.</p>
              </div>
              <button onClick={() => setShowAddStaffModal(true)} className="btn btn-gold btn-sm">
                <Plus size={14} /> Assign New Staff
              </button>
            </div>

            <div className="table-luxury-wrapper">
              <table className="table-luxury">
                <thead>
                  <tr>
                    <th>Staff Name</th>
                    <th>Role Designation</th>
                    <th>Department</th>
                    <th>Current Shift</th>
                    <th>Rating</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staffList.map((st) => (
                    <tr key={st.id}>
                      <td>
                        <div className="fw-semibold">{st.name}</div>
                        <div className="text-muted small">{st.email}</div>
                      </td>
                      <td>{st.role}</td>
                      <td>
                        <span className="badge bg-secondary-subtle text-muted">{st.department}</span>
                      </td>
                      <td>
                        <span className="small text-muted">{st.shift}</span>
                      </td>
                      <td>
                        <span className="text-warning small fw-bold">&starf; {st.rating}</span>
                      </td>
                      <td className="text-end">
                        <button
                          onClick={() => {
                            const newShift = prompt(`Change shift for ${st.name}:`, st.shift);
                            if (newShift) {
                              dispatch(updateStaffMember({ id: st.id, updates: { shift: newShift } }));
                              toast.success(`Shift updated for ${st.name}.`);
                            }
                          }}
                          className="btn btn-sm btn-secondary-custom me-1"
                        >
                          Shift
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove ${st.name} from roster?`)) {
                              dispatch(deleteStaffMember(st.id));
                              toast.info(`Staff member removed.`);
                            }
                          }}
                          className="btn btn-sm btn-link text-danger p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Add New Room */}
      {showAddRoomModal && (
        <div className="modal-overlay" onClick={() => setShowAddRoomModal(false)}>
          <div className="modal-content-luxury p-4" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
              <div>
                <h4 className="font-serif text-warning mb-0">Add New Luxury Suite</h4>
                <p className="text-muted small mb-0">Expand property room inventory</p>
              </div>
              <button className="btn btn-sm btn-link text-muted p-1" onClick={() => setShowAddRoomModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddRoomSubmit}>
              <div className="row g-3 mb-4">
                <div className="col-6">
                  <label className="form-label small text-muted">Room Number</label>
                  <input
                    type="text"
                    className="input-luxury"
                    placeholder="e.g. 501"
                    value={newRoomNumber}
                    onChange={(e) => setNewRoomNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small text-muted">Floor Level</label>
                  <input
                    type="number"
                    className="input-luxury"
                    value={newRoomFloor}
                    onChange={(e) => setNewRoomFloor(e.target.value)}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small text-muted">Suite Name</label>
                  <input
                    type="text"
                    className="input-luxury"
                    placeholder="e.g. Horizon Sunset Master Suite"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small text-muted">Category</label>
                  <select
                    className="input-luxury"
                    value={newRoomCategory}
                    onChange={(e) => setNewRoomCategory(e.target.value)}
                  >
                    <option value="Deluxe">Deluxe</option>
                    <option value="Ocean View">Ocean View</option>
                    <option value="Executive Suite">Executive Suite</option>
                    <option value="Presidential">Presidential</option>
                    <option value="Family Villa">Family Villa</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label small text-muted">Base Rate ($/Night)</label>
                  <input
                    type="number"
                    className="input-luxury"
                    value={newRoomPrice}
                    onChange={(e) => setNewRoomPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small text-muted">Max Guest Capacity</label>
                  <input
                    type="number"
                    className="input-luxury"
                    value={newRoomCapacity}
                    onChange={(e) => setNewRoomCapacity(e.target.value)}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small text-muted">Bed Type</label>
                  <input
                    type="text"
                    className="input-luxury"
                    value={newRoomBed}
                    onChange={(e) => setNewRoomBed(e.target.value)}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" onClick={() => setShowAddRoomModal(false)} className="btn btn-secondary-custom">
                  Cancel
                </button>
                <button type="submit" className="btn btn-gold">
                  Add to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add New Staff */}
      {showAddStaffModal && (
        <div className="modal-overlay" onClick={() => setShowAddStaffModal(false)}>
          <div className="modal-content-luxury p-4" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
              <div>
                <h4 className="font-serif text-warning mb-0">Assign Staff Member</h4>
                <p className="text-muted small mb-0">Add to duty roster</p>
              </div>
              <button className="btn btn-sm btn-link text-muted p-1" onClick={() => setShowAddStaffModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddStaffSubmit}>
              <div className="row g-3 mb-4">
                <div className="col-12">
                  <label className="form-label small text-muted">Staff Full Name</label>
                  <input
                    type="text"
                    className="input-luxury"
                    placeholder="e.g. Julian Martinez"
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small text-muted">Corporate Email</label>
                  <input
                    type="email"
                    className="input-luxury"
                    placeholder="julian.m@hotelpro.luxury"
                    value={staffEmail}
                    onChange={(e) => setStaffEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small text-muted">Department</label>
                  <select
                    className="input-luxury"
                    value={staffDept}
                    onChange={(e) => setStaffDept(e.target.value)}
                  >
                    <option value="Front Office">Front Office</option>
                    <option value="Housekeeping">Housekeeping</option>
                    <option value="Guest Relations">Guest Relations</option>
                    <option value="Facilities & Engineering">Facilities & Engineering</option>
                    <option value="Food & Beverage">Food & Beverage</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label small text-muted">Role Designation</label>
                  <input
                    type="text"
                    className="input-luxury"
                    placeholder="e.g. Guest Experience Host"
                    value={staffRole}
                    onChange={(e) => setStaffRole(e.target.value)}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small text-muted">Assigned Shift Timing</label>
                  <select
                    className="input-luxury"
                    value={staffShift}
                    onChange={(e) => setStaffShift(e.target.value)}
                  >
                    <option value="Morning (07:00 - 15:30)">Morning (07:00 - 15:30)</option>
                    <option value="Day (08:30 - 17:00)">Day (08:30 - 17:00)</option>
                    <option value="Evening (14:00 - 22:30)">Evening (14:00 - 22:30)</option>
                    <option value="Night (22:00 - 07:30)">Night (22:00 - 07:30)</option>
                  </select>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" onClick={() => setShowAddStaffModal(false)} className="btn btn-secondary-custom">
                  Cancel
                </button>
                <button type="submit" className="btn btn-gold">
                  Save to Roster
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

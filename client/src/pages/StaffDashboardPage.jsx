import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { checkInBooking, checkOutBooking } from '../redux/slices/bookingsSlice';
import { updateRoomStatus } from '../redux/slices/roomsSlice';
import { updateServiceStatus, assignStaffToService } from '../redux/slices/servicesSlice';
import { addAuditLog } from '../redux/slices/hotelSlice';
import { addNotification } from '../redux/slices/notificationsSlice';
import InvoiceModal from '../components/InvoiceModal';
import {
  Users,
  CheckCircle,
  LogOut,
  Sparkles,
  BedDouble,
  Wrench,
  Clock,
  Search,
  Filter,
  Check,
  AlertCircle,
  KeyRound,
  FileText,
  UtensilsCrossed,
  Layers,
  ArrowRight
} from 'lucide-react';
import { toast } from 'react-toastify';
import { staffRoster } from '../data/initialData';

export const StaffDashboardPage = () => {
  const dispatch = useDispatch();
  const bookings = useSelector((state) => state.bookings.bookings);
  const rooms = useSelector((state) => state.rooms.rooms);
  const services = useSelector((state) => state.services.services);
  const { currentUser } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('checkin'); // 'checkin' | 'checkout' | 'roomstatus' | 'housekeeping' | 'services'
  const [roomFilter, setRoomFilter] = useState('All');
  const [selectedBookingForFolio, setSelectedBookingForFolio] = useState(null);

  // Operational KPI calculations
  const expectedArrivals = bookings.filter((b) => b.bookingStatus === 'Confirmed');
  const activeOccupants = bookings.filter((b) => b.bookingStatus === 'Checked-In' || b.bookingStatus === 'Checked In');
  const pendingHousekeeping = rooms.filter((r) => r.status === 'Dirty');
  const openServiceTickets = services.filter((s) => s.status !== 'Completed');

  // Handle Guest Check-in
  const handleCheckIn = (booking) => {
    dispatch(checkInBooking(booking.id || booking.bookingReference));
    dispatch(updateRoomStatus({ roomId: booking.roomNumber, status: 'Inspected' }));
    dispatch(
      addAuditLog({
        user: `${currentUser?.name || 'Front Desk Staff'}`,
        action: 'Express Check-In Authorized',
        details: `Checked in guest ${booking.guestName} into Suite #${booking.roomNumber}. NFC Digital Pass emitted.`,
      })
    );
    dispatch(
      addNotification({
        title: `Resident Checked In: ${booking.guestName}`,
        message: `Suite #${booking.roomNumber} is now occupied. Khansama welcome service dispatched.`,
        category: 'booking',
      })
    );
    toast.success(`Guest ${booking.guestName} checked into Suite #${booking.roomNumber}. Keycard issued.`);
  };

  // Handle Guest Check-out
  const handleCheckOut = (booking) => {
    dispatch(checkOutBooking(booking.id || booking.bookingReference));
    dispatch(updateRoomStatus({ roomId: booking.roomNumber, status: 'Dirty' }));
    dispatch(
      addAuditLog({
        user: `${currentUser?.name || 'Front Desk Staff'}`,
        action: 'Guest Departure Checked Out',
        details: `Checked out guest ${booking.guestName}. Suite #${booking.roomNumber} queued for housekeeping.`,
      })
    );
    dispatch(
      addNotification({
        title: `Housekeeping Alert: Suite #${booking.roomNumber}`,
        message: `Suite #${booking.roomNumber} vacated by ${booking.guestName}. Queued for full sanitation.`,
        category: 'housekeeping',
      })
    );
    toast.info(`Guest ${booking.guestName} checked out. Suite #${booking.roomNumber} queued for Housekeeping.`);
  };

  const handleStatusChange = (roomId, newStatus) => {
    dispatch(updateRoomStatus({ roomId, status: newStatus }));
    toast.success(`Suite #${roomId} status changed to ${newStatus}.`);
  };

  const handleServiceStatus = (id, newStatus) => {
    dispatch(updateServiceStatus({ id, status: newStatus }));
    toast.success(`Service ticket status updated to ${newStatus}.`);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-body)' }} className="py-5">
      <div className="container py-2">
        {/* Terminal Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <div className="eyebrow-kicker mb-1">FRONT-OFFICE OPERATIONS TERMINAL</div>
            <h1 className="display-6 font-serif fw-bold text-main m-0">
              Palace Concierge & Housekeeping Control
            </h1>
            <p className="text-secondary small mt-1 mb-0">
              Live Indian resort desk: arrivals queue, departures, key emission, and Khansama ticket dispatch.
            </p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="badge-clean">
              <CheckCircle size={14} className="me-1 inline" /> Front Desk Online
            </span>
            <span className="text-muted small">
              Operator: {currentUser?.name || 'Rajesh Verma (Chief Concierge)'}
            </span>
          </div>
        </div>

        {/* Operational KPI Metric Cards */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-lg-3">
            <div className="stat-metric-card">
              <div>
                <div className="stat-metric-title">Today's Arrivals</div>
                <div className="stat-metric-val">{expectedArrivals.length}</div>
                <span className="text-muted small">Awaiting check-in</span>
              </div>
              <KeyRound size={28} style={{ color: 'var(--accent-gold)' }} />
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="stat-metric-card">
              <div>
                <div className="stat-metric-title">In-House Residents</div>
                <div className="stat-metric-val">{activeOccupants.length}</div>
                <span className="text-muted small">Occupied suites</span>
              </div>
              <Users size={28} style={{ color: 'var(--accent-gold)' }} />
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="stat-metric-card">
              <div>
                <div className="stat-metric-title">Housekeeping Queue</div>
                <div className="stat-metric-val text-danger">{pendingHousekeeping.length}</div>
                <span className="text-muted small">Dirty suites</span>
              </div>
              <Sparkles size={28} className="text-danger" />
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="stat-metric-card">
              <div>
                <div className="stat-metric-title">Active Service Calls</div>
                <div className="stat-metric-val">{openServiceTickets.length}</div>
                <span className="text-muted small">Pending dispatch</span>
              </div>
              <UtensilsCrossed size={28} style={{ color: 'var(--accent-gold)' }} />
            </div>
          </div>
        </div>

        {/* Terminal Navigation Tabs */}
        <div className="d-flex gap-2 mb-4 border-bottom pb-2 overflow-x-auto">
          {[
            { id: 'checkin', label: `Arrivals (${expectedArrivals.length})`, icon: <KeyRound size={15} /> },
            { id: 'checkout', label: `Departures (${activeOccupants.length})`, icon: <LogOut size={15} /> },
            { id: 'roomstatus', label: `Live Suite Grid (${rooms.length})`, icon: <BedDouble size={15} /> },
            { id: 'services', label: `Service Tickets (${openServiceTickets.length})`, icon: <UtensilsCrossed size={15} /> },
            { id: 'housekeeping', label: `Staff Roster (${staffRoster.length})`, icon: <Users size={15} /> },
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

        {/* TAB 1: ARRIVALS QUEUE */}
        {activeTab === 'checkin' && (
          <div className="luxury-card p-4">
            <h3 className="font-serif fw-bold text-main fs-4 mb-3">Expected Arrivals & Express Check-In</h3>
            {expectedArrivals.length === 0 ? (
              <div className="p-4 text-center text-muted">
                No pending arrivals scheduled for today. All guests checked in.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="luxury-table">
                  <thead>
                    <tr>
                      <th>Ref Code</th>
                      <th>Resident Name</th>
                      <th>Suite Assigned</th>
                      <th>Duration</th>
                      <th>Tariff Settled</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expectedArrivals.map((booking) => (
                      <tr key={booking.id || booking.bookingReference}>
                        <td className="fw-bold font-serif">{booking.bookingReference || booking.id}</td>
                        <td>
                          <div className="fw-semibold text-main">{booking.guestName}</div>
                          <span className="text-muted small">{booking.guestPhone}</span>
                        </td>
                        <td>
                          <div className="fw-semibold text-main">{booking.roomTitle || booking.roomName}</div>
                          <span className="text-muted small">Suite #{booking.roomNumber}</span>
                        </td>
                        <td>
                          <span className="small">{booking.checkIn} &rarr; {booking.checkOut}</span>
                          <span className="text-muted small d-block">{booking.nights} nights &bull; {booking.guestsCount || 2} guests</span>
                        </td>
                        <td className="fw-bold font-serif" style={{ color: 'var(--accent-gold)' }}>
                          ₹ {(booking.totalAmount || 38997).toLocaleString('en-IN')}
                        </td>
                        <td className="text-end text-nowrap">
                          <button
                            onClick={() => setSelectedBookingForFolio(booking)}
                            className="pill-btn-outline py-1 px-3 me-2"
                            style={{ fontSize: '0.78rem' }}
                          >
                            Folio
                          </button>
                          <button
                            onClick={() => handleCheckIn(booking)}
                            className="pill-btn-dark py-1 px-3 text-nowrap"
                            style={{ fontSize: '0.78rem' }}
                          >
                            Express Check-In
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DEPARTURES QUEUE */}
        {activeTab === 'checkout' && (
          <div className="luxury-card p-4">
            <h3 className="font-serif fw-bold text-main fs-4 mb-3">In-House Residents & Departures</h3>
            {activeOccupants.length === 0 ? (
              <div className="p-4 text-center text-muted">
                No active occupants currently registered in house.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="luxury-table">
                  <thead>
                    <tr>
                      <th>Ref Code</th>
                      <th>Resident Name</th>
                      <th>Suite</th>
                      <th>Check-Out Date</th>
                      <th>Payment Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeOccupants.map((booking) => (
                      <tr key={booking.id || booking.bookingReference}>
                        <td className="fw-bold font-serif">{booking.bookingReference || booking.id}</td>
                        <td>
                          <div className="fw-semibold text-main">{booking.guestName}</div>
                          <span className="text-muted small">{booking.guestPhone}</span>
                        </td>
                        <td>
                          <div className="fw-semibold text-main">{booking.roomTitle || booking.roomName}</div>
                          <span className="text-muted small">Suite #{booking.roomNumber}</span>
                        </td>
                        <td>
                          <span className="small">{booking.checkOut}</span>
                          <span className="text-muted small d-block">Expected 12:00 PM</span>
                        </td>
                        <td>
                          <span className="badge-clean">
                            {booking.paymentStatus || 'Paid in Full'}
                          </span>
                        </td>
                        <td className="text-end">
                          <button
                            onClick={() => setSelectedBookingForFolio(booking)}
                            className="pill-btn-outline py-1 px-3 me-2"
                            style={{ fontSize: '0.78rem' }}
                          >
                            Folio
                          </button>
                          <button
                            onClick={() => handleCheckOut(booking)}
                            className="pill-btn-dark py-1 px-3 bg-danger border-danger"
                            style={{ fontSize: '0.78rem' }}
                          >
                            Check-Out
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LIVE ROOM STATUS GRID */}
        {activeTab === 'roomstatus' && (
          <div className="luxury-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="font-serif fw-bold text-main fs-4 m-0">Live Palace Suite Inventory Status</h3>
              <div className="d-flex gap-2">
                {['All', 'Clean', 'Dirty', 'Inspected', 'Out of Order'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setRoomFilter(status)}
                    style={{
                      backgroundColor: roomFilter === status ? 'var(--btn-dark)' : 'var(--bg-surface-subtle)',
                      color: roomFilter === status ? '#ffffff' : 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '9999px',
                      padding: '4px 14px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="row g-3">
              {rooms
                .filter((r) => roomFilter === 'All' || r.status === roomFilter)
                .map((room) => {
                  const displayTitle = room.title || room.name;
                  const displayPrice = room.price || room.basePrice || 18500;
                  return (
                    <div key={room.id} className="col-12 col-md-6 col-lg-4">
                      <div className="p-3 rounded-3 border" style={{ backgroundColor: '#ffffff', borderColor: 'var(--border-subtle)' }}>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <span className="font-serif fw-bold fs-5 text-main">Suite #{room.roomNumber}</span>
                            <div className="text-muted small">{displayTitle}</div>
                          </div>
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
                        </div>

                        <div className="d-flex justify-content-between align-items-center small text-secondary my-2">
                          <span>{room.type || room.category}</span>
                          <span className="fw-bold font-serif" style={{ color: 'var(--accent-gold)' }}>
                            ₹ {displayPrice.toLocaleString('en-IN')}/nt
                          </span>
                        </div>

                        {/* Status Change Selector */}
                        <div className="pt-2 border-top mt-2">
                          <label className="form-label small text-muted mb-1" style={{ fontSize: '0.72rem' }}>
                            Update Housekeeping Status:
                          </label>
                          <select
                            value={room.status}
                            onChange={(e) => handleStatusChange(room.roomNumber || room.id, e.target.value)}
                            className="form-select form-select-sm rounded-pill"
                            style={{ backgroundColor: 'var(--bg-surface-subtle)', fontSize: '0.78rem' }}
                          >
                            <option value="Clean">Clean (Ready for Check-In)</option>
                            <option value="Dirty">Dirty (Needs Housekeeping)</option>
                            <option value="Inspected">Inspected (Supervisor Approved)</option>
                            <option value="Out of Order">Out of Order (Maintenance)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB 4: SERVICE DISPATCH QUEUE */}
        {activeTab === 'services' && (
          <div className="luxury-card p-4">
            <h3 className="font-serif fw-bold text-main fs-4 mb-3">Active Guest Service Tickets</h3>
            <div className="table-responsive">
              <table className="luxury-table">
                <thead>
                  <tr>
                    <th>Suite #</th>
                    <th>Resident</th>
                    <th>Service Category</th>
                    <th>Request Details</th>
                    <th>Assigned To</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((srv) => (
                    <tr key={srv.id}>
                      <td className="fw-bold font-serif">Suite #{srv.roomNumber}</td>
                      <td>{srv.guestName}</td>
                      <td>
                        <span className="badge rounded-pill" style={{ backgroundColor: 'var(--accent-gold-light)', color: 'var(--accent-gold)' }}>
                          {srv.serviceType}
                        </span>
                      </td>
                      <td className="small" style={{ maxWidth: '300px' }}>{srv.details}</td>
                      <td className="small text-muted">{srv.assignedTo || 'Unassigned'}</td>
                      <td>
                        <span className={srv.status === 'Completed' ? 'badge-clean' : 'badge-dirty'}>
                          {srv.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <select
                          value={srv.status}
                          onChange={(e) => handleServiceStatus(srv.id, e.target.value)}
                          className="form-select form-select-sm rounded-pill d-inline-block w-auto"
                          style={{ fontSize: '0.75rem' }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: STAFF ROSTER */}
        {activeTab === 'housekeeping' && (
          <div className="luxury-card p-4">
            <h3 className="font-serif fw-bold text-main fs-4 mb-3">On-Duty Hospitality Roster</h3>
            <div className="row g-3">
              {staffRoster.map((staff) => (
                <div key={staff.id} className="col-12 col-md-6 col-lg-3">
                  <div className="p-3 rounded-3 border text-center" style={{ backgroundColor: '#ffffff', borderColor: 'var(--border-subtle)' }}>
                    <img
                      src={staff.avatar}
                      alt={staff.name}
                      className="rounded-circle mb-2 border"
                      style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                    />
                    <h5 className="font-serif fw-bold text-main fs-6 mb-1">{staff.name}</h5>
                    <div className="text-muted small mb-2">{staff.role}</div>
                    <span className="badge-clean">{staff.status}</span>
                    <div className="text-muted small mt-2" style={{ fontSize: '0.72rem' }}>
                      Shift: {staff.shift}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedBookingForFolio && (
        <InvoiceModal
          booking={selectedBookingForFolio}
          onClose={() => setSelectedBookingForFolio(null)}
        />
      )}
    </div>
  );
};

export default StaffDashboardPage;

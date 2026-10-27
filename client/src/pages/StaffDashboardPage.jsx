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

export const StaffDashboardPage = () => {
  const dispatch = useDispatch();
  const bookings = useSelector((state) => state.bookings.bookings);
  const rooms = useSelector((state) => state.rooms.rooms);
  const services = useSelector((state) => state.services.services);
  const staffList = useSelector((state) => state.hotel.staffList);
  const { currentUser } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('checkin'); // 'checkin' | 'checkout' | 'roomstatus' | 'housekeeping' | 'services'
  const [roomFilter, setRoomFilter] = useState('All');
  const [selectedBookingForFolio, setSelectedBookingForFolio] = useState(null);

  // Operational KPI calculations
  const expectedArrivals = bookings.filter((b) => b.bookingStatus === 'Confirmed');
  const activeOccupants = bookings.filter((b) => b.bookingStatus === 'Checked-In');
  const pendingHousekeeping = rooms.filter((r) => r.status === 'Dirty');
  const openServiceTickets = services.filter((s) => s.status !== 'Completed');

  // Handle Guest Check-in
  const handleCheckIn = (booking) => {
    dispatch(checkInBooking(booking.id));
    dispatch(updateRoomStatus({ roomId: booking.roomId, status: 'Inspected' }));
    dispatch(
      addAuditLog({
        user: `${currentUser?.name || 'Front Desk Staff'}`,
        action: 'Express Check-In Completed',
        details: `Checked in guest ${booking.guestName} into Room #${booking.roomNumber}. Keycard issued.`
      })
    );
    dispatch(
      addNotification({
        title: `Guest Checked In: ${booking.guestName}`,
        message: `Assigned Room #${booking.roomNumber}. Digital mobile key activated.`,
        type: 'booking'
      })
    );
    toast.success(`Check-In complete for ${booking.guestName}! Room #${booking.roomNumber} is active.`);
  };

  // Handle Guest Check-Out
  const handleCheckOut = (booking) => {
    dispatch(checkOutBooking(booking.id));
    dispatch(updateRoomStatus({ roomId: booking.roomId, status: 'Dirty' }));
    dispatch(
      addAuditLog({
        user: `${currentUser?.name || 'Front Desk Staff'}`,
        action: 'Guest Check-Out Processed',
        details: `Guest ${booking.guestName} checked out of Room #${booking.roomNumber}. Room queued for housekeeping.`
      })
    );
    dispatch(
      addNotification({
        title: `Guest Departed: Room #${booking.roomNumber}`,
        message: `${booking.guestName} has checked out. Room is marked as Dirty for housekeeping.`,
        type: 'booking'
      })
    );
    toast.info(`Check-Out processed for ${booking.guestName}. Room #${booking.roomNumber} marked for cleaning.`);
  };

  // Handle Room Status Quick Change
  const handleStatusChange = (roomId, newStatus) => {
    dispatch(updateRoomStatus({ roomId, status: newStatus }));
    dispatch(
      addAuditLog({
        user: `${currentUser?.name || 'Housekeeping'}`,
        action: 'Room Status Changed',
        details: `Room ${roomId} status changed to ${newStatus}.`
      })
    );
    toast.success(`Room status updated to ${newStatus}.`);
  };

  // Handle Service Request Status Change
  const handleServiceStatusToggle = (serviceId, currentStatus) => {
    const nextStatus =
      currentStatus === 'Pending'
        ? 'In Progress'
        : currentStatus === 'In Progress'
        ? 'Completed'
        : 'Pending';

    dispatch(updateServiceStatus({ id: serviceId, status: nextStatus }));
    toast.success(`Service ticket status moved to: ${nextStatus}.`);
  };

  return (
    <div className="staff-dashboard py-5" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container py-2">
        {/* Operations Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-info-subtle text-info border border-info px-2 py-1 small">
                FRONT OFFICE & OPERATIONS
              </span>
              <span className="text-muted small">&bull; Active Shift: Morning / Operational</span>
            </div>
            <h2 className="font-serif fw-bold mb-0">Hotel Staff Operations Terminal</h2>
            <p className="text-muted small mb-0">Manage guest arrivals, express departures, room readiness, and service tickets.</p>
          </div>
          <div className="text-md-end">
            <span className="badge bg-dark border text-light p-2">
              Staff Operator: <strong>{currentUser?.name || 'Sarah Jenkins'}</strong>
            </span>
          </div>
        </div>

        {/* Operational KPI Metric Cards */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-lg-3">
            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--info-bg)' }}>
                <KeyRound size={22} className="text-info" />
              </div>
              <div>
                <div className="fs-3 fw-bold font-serif">{expectedArrivals.length}</div>
                <div className="text-muted small">Expected Arrivals</div>
              </div>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--success-bg)' }}>
                <Users size={22} className="text-success" />
              </div>
              <div>
                <div className="fs-3 fw-bold font-serif">{activeOccupants.length}</div>
                <div className="text-muted small">Active In-House Stays</div>
              </div>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--warning-bg)' }}>
                <Sparkles size={22} className="text-warning" />
              </div>
              <div>
                <div className="fs-3 fw-bold font-serif">{pendingHousekeeping.length}</div>
                <div className="text-muted small">Dirty Rooms to Clean</div>
              </div>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--danger-bg)' }}>
                <UtensilsCrossed size={22} className="text-danger" />
              </div>
              <div>
                <div className="fs-3 fw-bold font-serif">{openServiceTickets.length}</div>
                <div className="text-muted small">Pending Service Orders</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tabs-luxury mb-4">
          <button
            onClick={() => setActiveTab('checkin')}
            className={`tab-btn ${activeTab === 'checkin' ? 'active' : ''}`}
          >
            <CheckCircle size={16} /> Guest Check-In ({expectedArrivals.length})
          </button>
          <button
            onClick={() => setActiveTab('checkout')}
            className={`tab-btn ${activeTab === 'checkout' ? 'active' : ''}`}
          >
            <LogOut size={16} /> Guest Check-Out ({activeOccupants.length})
          </button>
          <button
            onClick={() => setActiveTab('roomstatus')}
            className={`tab-btn ${activeTab === 'roomstatus' ? 'active' : ''}`}
          >
            <BedDouble size={16} /> Room Status Grid ({rooms.length})
          </button>
          <button
            onClick={() => setActiveTab('housekeeping')}
            className={`tab-btn ${activeTab === 'housekeeping' ? 'active' : ''}`}
          >
            <Sparkles size={16} /> Housekeeping & Turndown
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
          >
            <UtensilsCrossed size={16} /> Guest Service Queue ({openServiceTickets.length})
          </button>
        </div>

        {/* TAB 1: Guest Check-In Management */}
        {activeTab === 'checkin' && (
          <div className="card-luxury p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="font-serif fw-bold mb-0">Today's Expected Guest Arrivals</h5>
              <span className="text-muted small">{expectedArrivals.length} reservations awaiting arrival</span>
            </div>

            {expectedArrivals.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <CheckCircle size={36} className="text-success mb-2" />
                <p className="mb-0">All expected arrivals for today have been checked in!</p>
              </div>
            ) : (
              <div className="table-luxury-wrapper">
                <table className="table-luxury">
                  <thead>
                    <tr>
                      <th>Booking Ref</th>
                      <th>Guest Name</th>
                      <th>Suite & Room</th>
                      <th>Stay Dates</th>
                      <th>Payment Status</th>
                      <th>Special Notes</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expectedArrivals.map((booking) => (
                      <tr key={booking.id}>
                        <td>
                          <strong className="text-warning">{booking.id}</strong>
                        </td>
                        <td>
                          <div className="fw-semibold">{booking.guestName}</div>
                          <div className="text-muted small">{booking.guestPhone}</div>
                        </td>
                        <td>
                          <div>{booking.roomName}</div>
                          <span className="badge bg-dark border border-secondary text-light">
                            Room #{booking.roomNumber}
                          </span>
                        </td>
                        <td>
                          <div className="small">{booking.checkIn} &rarr; {booking.checkOut}</div>
                          <div className="text-muted small">{booking.nights} night(s), {booking.guests} guest(s)</div>
                        </td>
                        <td>
                          <span className="badge badge-paid">{booking.paymentStatus}</span>
                        </td>
                        <td>
                          <span className="text-muted small" style={{ maxWidth: '200px', display: 'inline-block' }}>
                            {booking.specialRequests || 'Standard VIP arrival'}
                          </span>
                        </td>
                        <td className="text-end text-nowrap">
                          <button
                            onClick={() => handleCheckIn(booking)}
                            className="btn btn-sm btn-gold d-inline-flex align-items-center gap-1 text-nowrap"
                          >
                            <KeyRound size={14} /> Express Check-In
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

        {/* TAB 2: Guest Check-Out Processing */}
        {activeTab === 'checkout' && (
          <div className="card-luxury p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="font-serif fw-bold mb-0">In-House Stays & Check-Out Processing</h5>
              <span className="text-muted small">{activeOccupants.length} active rooms</span>
            </div>

            {activeOccupants.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <Users size={36} className="opacity-50 mb-2" />
                <p className="mb-0">No active in-house occupants currently.</p>
              </div>
            ) : (
              <div className="table-luxury-wrapper">
                <table className="table-luxury">
                  <thead>
                    <tr>
                      <th>Room</th>
                      <th>Guest Name</th>
                      <th>Check-Out Date</th>
                      <th>Total Charges</th>
                      <th>Folio Verification</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeOccupants.map((booking) => (
                      <tr key={booking.id}>
                        <td>
                          <span className="fs-5 font-serif fw-bold text-warning">#{booking.roomNumber}</span>
                          <div className="text-muted small">{booking.roomName}</div>
                        </td>
                        <td>
                          <div className="fw-semibold">{booking.guestName}</div>
                          <div className="text-muted small">{booking.guestEmail}</div>
                        </td>
                        <td>
                          <div className="fw-semibold small">{booking.checkOut}</div>
                          <span className="badge bg-secondary-subtle text-muted">Until 11:00 AM</span>
                        </td>
                        <td>
                          <div className="fw-bold text-warning font-serif">${booking.totalAmount}</div>
                          <span className="badge badge-paid">Settled ({booking.paymentMethod})</span>
                        </td>
                        <td>
                          <button
                            onClick={() => setSelectedBookingForFolio(booking)}
                            className="btn btn-sm btn-secondary-custom d-inline-flex align-items-center gap-1"
                          >
                            <FileText size={14} /> Inspect Folio
                          </button>
                        </td>
                        <td className="text-end">
                          <button
                            onClick={() => handleCheckOut(booking)}
                            className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
                          >
                            <LogOut size={14} /> Process Check-Out
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

        {/* TAB 3: Room Status Grid */}
        {activeTab === 'roomstatus' && (
          <div className="card-luxury p-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
              <div>
                <h5 className="font-serif fw-bold mb-1">Live Room Status Board</h5>
                <p className="text-muted small mb-0">Select any room to change status between Clean, Dirty, Inspected, and Out of Order.</p>
              </div>

              {/* Status Legend */}
              <div className="d-flex flex-wrap gap-2">
                <span className="badge badge-clean">Clean</span>
                <span className="badge badge-inspected">Inspected</span>
                <span className="badge badge-dirty">Dirty</span>
                <span className="badge badge-out-of-order">Out of Order</span>
              </div>
            </div>

            <div className="row g-3">
              {rooms.map((room) => (
                <div className="col-6 col-md-4 col-lg-3" key={room.id}>
                  <div className="card-luxury p-3 text-center position-relative h-100">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-dark border border-secondary text-light small">
                        Fl. {room.floor}
                      </span>
                      <span className={`badge ${
                        room.status === 'Clean' ? 'badge-clean' :
                        room.status === 'Inspected' ? 'badge-inspected' :
                        room.status === 'Dirty' ? 'badge-dirty' : 'badge-out-of-order'
                      }`}>
                        {room.status}
                      </span>
                    </div>

                    <div className="fs-3 font-serif fw-bold text-warning mb-1">#{room.roomNumber}</div>
                    <div className="small fw-semibold mb-2" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {room.name}
                    </div>

                    {/* Quick Status Selector */}
                    <div className="mt-auto pt-2 border-top">
                      <label className="text-muted small d-block mb-1" style={{ fontSize: '0.7rem' }}>Update Status:</label>
                      <select
                        className="input-luxury py-1 px-2 small text-center"
                        style={{ fontSize: '0.8rem' }}
                        value={room.status}
                        onChange={(e) => handleStatusChange(room.id, e.target.value)}
                      >
                        <option value="Clean">Clean</option>
                        <option value="Inspected">Inspected</option>
                        <option value="Dirty">Dirty</option>
                        <option value="Out of Order">Out of Order</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Housekeeping & Turndown */}
        {activeTab === 'housekeeping' && (
          <div className="card-luxury p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="font-serif fw-bold mb-0">Housekeeping Assignment Roster</h5>
                <p className="text-muted small mb-0">Rooms requiring sanitization, linen refresh, and supervisor inspection.</p>
              </div>
              <button
                onClick={() => {
                  rooms.filter(r => r.status === 'Dirty').forEach(r => {
                    dispatch(updateRoomStatus({ roomId: r.id, status: 'Clean' }));
                  });
                  toast.success('All dirty rooms marked as Clean!');
                }}
                className="btn btn-sm btn-gold"
              >
                <Check size={14} /> Batch Mark All Clean
              </button>
            </div>

            <div className="table-luxury-wrapper">
              <table className="table-luxury">
                <thead>
                  <tr>
                    <th>Room #</th>
                    <th>Suite Name</th>
                    <th>Current Status</th>
                    <th>Housekeeping Lead</th>
                    <th>Actions</th>
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
                        <span className="text-muted small">{room.category} &bull; Floor {room.floor}</span>
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
                      <td>
                        <span className="small text-muted">Mateo Rodriguez (Lead)</span>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          {room.status === 'Dirty' && (
                            <button
                              onClick={() => handleStatusChange(room.id, 'Clean')}
                              className="btn btn-sm btn-success py-1"
                              style={{ fontSize: '0.75rem' }}
                            >
                              Mark Cleaned
                            </button>
                          )}
                          {room.status === 'Clean' && (
                            <button
                              onClick={() => handleStatusChange(room.id, 'Inspected')}
                              className="btn btn-sm btn-info py-1 text-white"
                              style={{ fontSize: '0.75rem' }}
                            >
                              Verify & Inspect
                            </button>
                          )}
                          {room.status !== 'Dirty' && (
                            <button
                              onClick={() => handleStatusChange(room.id, 'Dirty')}
                              className="btn btn-sm btn-secondary-custom py-1"
                              style={{ fontSize: '0.75rem' }}
                            >
                              Flag Dirty
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: Guest Service Request Queue */}
        {activeTab === 'services' && (
          <div className="card-luxury p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="font-serif fw-bold mb-0">Active Guest Service Tickets</h5>
              <span className="text-muted small">{openServiceTickets.length} pending execution</span>
            </div>

            <div className="d-flex flex-column gap-3">
              {services.map((srv) => (
                <div className="card-luxury p-3 border" key={srv.id} style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="badge bg-warning text-dark fw-bold">Room #{srv.roomNumber}</span>
                        <span className="badge bg-secondary-subtle text-muted">{srv.type}</span>
                        <span className={`badge ${
                          srv.status === 'Completed' ? 'badge-completed' :
                          srv.status === 'In Progress' ? 'badge-in-progress' : 'badge-pending'
                        }`}>
                          {srv.status}
                        </span>
                        <span className="text-muted small">&bull; Requested at {srv.timeRequested}</span>
                      </div>
                      <h6 className="fw-bold mb-1">{srv.title}</h6>
                      <p className="text-muted small mb-0">{srv.details}</p>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <div className="text-muted small text-end me-2 d-none d-md-block">
                        <div>Assigned To:</div>
                        <strong>{srv.assignedTo || 'Unassigned'}</strong>
                      </div>

                      <button
                        onClick={() => handleServiceStatusToggle(srv.id, srv.status)}
                        className={`btn btn-sm ${
                          srv.status === 'Completed'
                            ? 'btn-secondary-custom'
                            : srv.status === 'In Progress'
                            ? 'btn-success'
                            : 'btn-gold'
                        }`}
                      >
                        {srv.status === 'Pending'
                          ? 'Start Service'
                          : srv.status === 'In Progress'
                          ? 'Mark Completed'
                          : 'Re-Open'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <InvoiceModal
        isOpen={Boolean(selectedBookingForFolio)}
        onClose={() => setSelectedBookingForFolio(null)}
        booking={selectedBookingForFolio}
      />
    </div>
  );
};

export default StaffDashboardPage;

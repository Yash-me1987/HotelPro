import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../redux/slices/authSlice';
import { cancelBooking } from '../redux/slices/bookingsSlice';
import { addAuditLog } from '../redux/slices/hotelSlice';
import InvoiceModal from '../components/InvoiceModal';
import ReviewModal from '../components/ReviewModal';
import ServiceRequestModal from '../components/ServiceRequestModal';
import {
  Calendar,
  KeyRound,
  FileText,
  Clock,
  Sparkles,
  User,
  ShieldCheck,
  Star,
  CheckCircle,
  AlertTriangle,
  X,
  CreditCard,
  Crown,
  Bell,
  Heart,
  Utensils,
  MapPin,
  Lock,
  Unlock
} from 'lucide-react';
import { toast } from 'react-toastify';

export const GuestDashboardPage = () => {
  const dispatch = useDispatch();
  const { currentUser, role } = useSelector((state) => state.auth);
  const bookings = useSelector((state) => state.bookings.bookings);

  // Filter bookings for guest
  const userBookings = bookings.length > 0 ? bookings : [];

  const [activeTab, setActiveTab] = useState('active');
  const [historyFilter, setHistoryFilter] = useState('all');

  // Modals state
  const [selectedBookingForInvoice, setSelectedBookingForInvoice] = useState(null);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Change of travel schedule');

  // Digital Key unlock simulation
  const [keyUnlocked, setKeyUnlocked] = useState(false);

  // Profile preferences state
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98201 44521');
  const [dietary, setDietary] = useState(currentUser?.vipPreferences?.dietary || 'Royal Mewari Vegetarian & Cold-pressed Juices');
  const [floorPreference, setFloorPreference] = useState(currentUser?.vipPreferences?.floorPreference || 'Lake-Facing Upper Floor');
  const [pillowType, setPillowType] = useState(currentUser?.vipPreferences?.pillowType || 'Organic Himalayan Silk Pillow');
  const [specialNotes, setSpecialNotes] = useState(currentUser?.vipPreferences?.specialNotes || 'Prefers sunrise yoga mat and morning kesar tea.');

  // Find active or upcoming booking
  const activeStay =
    userBookings.find((b) => b.bookingStatus === 'Checked-In' || b.bookingStatus === 'Confirmed') ||
    userBookings[0] || {
      id: 'BK-8921',
      bookingReference: 'BK-8921',
      roomTitle: 'The Royal Lake Palace Suite',
      roomName: 'The Royal Lake Palace Suite',
      roomNumber: 'SU-402',
      checkIn: '2026-10-28',
      checkOut: '2026-10-31',
      nights: 3,
      bookingStatus: 'Confirmed',
      totalAmount: 73500,
      specialRequests: 'Kesar Pista welcome kulfi upon arrival and evening boat high tea.',
    };

  const handleTriggerNfcUnlock = () => {
    setKeyUnlocked(true);
    toast.success(`NFC Digital Key Transmitted! Suite #${activeStay.roomNumber} Unlocked.`);
    setTimeout(() => {
      setKeyUnlocked(false);
    }, 4500);
  };

  const handleConfirmCancel = () => {
    if (!selectedBookingForCancel) return;
    dispatch(
      cancelBooking({
        bookingId: selectedBookingForCancel.id || selectedBookingForCancel.bookingReference,
        reason: cancelReason,
      })
    );
    dispatch(
      addAuditLog({
        user: `${currentUser?.name || 'Resident'} (Guest)`,
        action: 'Reservation Cancelled with 100% Refund',
        details: `Cancelled reservation ${selectedBookingForCancel.bookingReference || selectedBookingForCancel.id} with automated full settlement refund.`,
      })
    );
    toast.info(`Reservation #${selectedBookingForCancel.bookingReference || selectedBookingForCancel.id} cancelled. 100% refund processed.`);
    setSelectedBookingForCancel(null);
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    dispatch(
      updateProfile({
        phone,
        vipPreferences: {
          dietary,
          floorPreference,
          pillowType,
          specialNotes,
        },
      })
    );
    toast.success('VIP Resident Preferences updated successfully.');
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-body)' }} className="py-5">
      <div className="container py-2">
        {/* Welcome Header */}
        <div className="luxury-card p-4 mb-4">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-3">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                alt=""
                className="rounded-circle border"
                style={{ width: '64px', height: '64px', objectFit: 'cover', borderColor: 'var(--accent-gold)' }}
              />
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h2 className="font-serif fw-bold text-main mb-0">{currentUser?.name || 'Aisha Sharma'}</h2>
                  <span
                    className="badge rounded-pill px-3 py-1 fw-bold"
                    style={{ backgroundColor: 'var(--accent-gold-light)', color: 'var(--accent-gold)', border: '1px solid var(--accent-gold-border)', fontSize: '0.72rem' }}
                  >
                    <Crown size={12} className="me-1 inline" /> ROYAL PRIVILEGE TIER
                  </span>
                </div>
                <p className="text-muted small mb-0">{currentUser?.email || 'aisha.sharma@luxuryindia.com'} &bull; Resident Member</p>
              </div>
            </div>

            <div className="d-flex gap-2">
              <button
                onClick={() => setShowServiceModal(true)}
                className="pill-btn-dark py-2 px-4"
                style={{ fontSize: '0.85rem' }}
              >
                <Utensils size={15} /> Request Palace Khansama
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="d-flex gap-2 mb-4 border-bottom pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('active')}
            style={{
              backgroundColor: activeTab === 'active' ? 'var(--btn-dark)' : 'transparent',
              color: activeTab === 'active' ? '#ffffff' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '9999px',
              padding: '8px 20px',
              fontSize: '0.86rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <KeyRound size={15} /> Active Stay & NFC Key
          </button>
          <button
            onClick={() => setActiveTab('history')}
            style={{
              backgroundColor: activeTab === 'history' ? 'var(--btn-dark)' : 'transparent',
              color: activeTab === 'history' ? '#ffffff' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '9999px',
              padding: '8px 20px',
              fontSize: '0.86rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <FileText size={15} /> Stay History & Folios ({userBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              backgroundColor: activeTab === 'profile' ? 'var(--btn-dark)' : 'transparent',
              color: activeTab === 'profile' ? '#ffffff' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '9999px',
              padding: '8px 20px',
              fontSize: '0.86rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <User size={15} /> VIP Resident Preferences
          </button>
        </div>

        {/* TAB 1: Active Stay Card & Digital Key */}
        {activeTab === 'active' && (
          <div className="row g-4">
            {/* Active Stay Details */}
            <div className="col-lg-7">
              <div className="luxury-card p-4">
                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <div>
                    <span className="eyebrow-kicker mb-1" style={{ fontSize: '0.72rem' }}>CURRENT PALACE RESIDENCE</span>
                    <h3 className="font-serif fw-bold text-main fs-4 m-0">{activeStay.roomTitle || activeStay.roomName}</h3>
                  </div>
                  <span className="badge-clean">
                    {activeStay.bookingStatus}
                  </span>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-sm-6">
                    <div className="p-3 rounded-3" style={{ backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-subtle)' }}>
                      <span className="text-muted small d-block">Suite Room Number</span>
                      <span className="fs-3 fw-bold font-serif text-main">Suite #{activeStay.roomNumber}</span>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="p-3 rounded-3" style={{ backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-subtle)' }}>
                      <span className="text-muted small d-block">Reservation Tariff Settled</span>
                      <span className="fs-4 fw-bold font-serif" style={{ color: 'var(--accent-gold)' }}>
                        ₹ {(activeStay.totalAmount || 73500).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-muted small fw-semibold text-uppercase d-block mb-1">Stay Dates & Duration</span>
                  <div className="d-flex align-items-center gap-2 text-main fw-medium">
                    <Calendar size={16} style={{ color: 'var(--accent-gold)' }} />
                    <span>{activeStay.checkIn} &rarr; {activeStay.checkOut} ({activeStay.nights || 3} Nights)</span>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-muted small fw-semibold text-uppercase d-block mb-1">Resident Special Requests</span>
                  <p className="text-secondary small p-3 rounded-3 mb-0" style={{ backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-subtle)' }}>
                    "{activeStay.specialRequests || 'Kesar Pista welcome kulfi upon arrival and evening boat high tea.'}"
                  </p>
                </div>

                <div className="d-flex gap-2 flex-wrap">
                  <button
                    onClick={() => setSelectedBookingForInvoice(activeStay)}
                    className="pill-btn-outline py-2 px-3"
                    style={{ fontSize: '0.84rem' }}
                  >
                    <FileText size={15} /> View Tax Invoice Folio
                  </button>
                  <button
                    onClick={() => setShowServiceModal(true)}
                    className="pill-btn-dark py-2 px-3"
                    style={{ fontSize: '0.84rem' }}
                  >
                    <Sparkles size={15} /> Request Palace Khansama
                  </button>
                </div>
              </div>
            </div>

            {/* Smart NFC Key Digital Pass */}
            <div className="col-lg-5">
              <div className="luxury-card p-4 text-center">
                <div className="eyebrow-kicker mb-2">SMART NFC DIGITAL KEY</div>
                <h4 className="font-serif fw-bold text-main fs-5 mb-3">Keyless Palace Access</h4>

                {/* Key Visualizer */}
                <div
                  className="p-4 rounded-4 mb-4 text-white text-start position-relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #181818 0%, #2b2b2b 100%)',
                    boxShadow: 'var(--shadow-card)',
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <span className="font-serif fw-bold text-uppercase" style={{ letterSpacing: '0.15em', fontSize: '0.9rem', color: 'var(--accent-gold)' }}>
                      LUMIÈRE DIGITAL PASS
                    </span>
                    <ShieldCheck size={20} style={{ color: 'var(--accent-gold)' }} />
                  </div>

                  <div className="mb-3">
                    <span className="opacity-75 small d-block">Authorized Suite</span>
                    <span className="fs-3 fw-bold font-serif text-white">Suite #{activeStay.roomNumber}</span>
                  </div>

                  <div className="d-flex justify-content-between align-items-end small opacity-80 pt-2 border-top border-secondary">
                    <span>Resident: {currentUser?.name || 'Aisha Sharma'}</span>
                    <span>Valid: {activeStay.checkOut}</span>
                  </div>
                </div>

                {/* Tap to Unlock Button */}
                <button
                  onClick={handleTriggerNfcUnlock}
                  disabled={keyUnlocked}
                  className="pill-btn-dark w-100 py-3 mb-3 d-flex align-items-center justify-content-center gap-2"
                >
                  {keyUnlocked ? (
                    <>
                      <Unlock size={18} className="text-success" />
                      <span>Transmitting NFC Pulse... Unlocked!</span>
                    </>
                  ) : (
                    <>
                      <Lock size={18} />
                      <span>Tap to Unlock Door (NFC)</span>
                    </>
                  )}
                </button>
                <div className="text-muted small">
                  Hold your mobile device within 5 cm of the royal suite door sensor.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Booking History & Cancellation */}
        {activeTab === 'history' && (
          <div className="luxury-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="font-serif fw-bold text-main fs-4 m-0">Your Reservations & Tax Invoices</h3>
              <select
                value={historyFilter}
                onChange={(e) => setHistoryFilter(e.target.value)}
                className="form-select form-select-sm rounded-pill w-auto"
                style={{ backgroundColor: 'var(--bg-surface-subtle)', borderColor: 'var(--border-subtle)' }}
              >
                <option value="all">All Stays</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Checked-In">Checked In</option>
                <option value="Cancelled">Cancelled & Refunded</option>
              </select>
            </div>

            <div className="table-responsive">
              <table className="luxury-table">
                <thead>
                  <tr>
                    <th>Ref #</th>
                    <th>Palace Suite</th>
                    <th>Dates</th>
                    <th>Total Settled</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userBookings
                    .filter((b) => historyFilter === 'all' || b.bookingStatus === historyFilter)
                    .map((booking) => (
                      <tr key={booking.id || booking.bookingReference}>
                        <td className="fw-bold font-serif">{booking.bookingReference || booking.id}</td>
                        <td>
                          <div className="fw-semibold text-main">{booking.roomTitle || booking.roomName}</div>
                          <span className="text-muted small">Suite #{booking.roomNumber}</span>
                        </td>
                        <td>
                          <div className="small">{booking.checkIn} &rarr; {booking.checkOut}</div>
                          <span className="text-muted small">{booking.nights || 2} nights</span>
                        </td>
                        <td className="fw-bold font-serif" style={{ color: 'var(--accent-gold)' }}>
                          ₹ {(booking.totalAmount || 38997).toLocaleString('en-IN')}
                        </td>
                        <td>
                          <span
                            className={
                              booking.bookingStatus === 'Cancelled'
                                ? 'badge-dirty'
                                : booking.bookingStatus === 'Checked-In'
                                ? 'badge-inspected'
                                : 'badge-clean'
                            }
                          >
                            {booking.bookingStatus}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="d-inline-flex gap-2">
                            <button
                              onClick={() => setSelectedBookingForInvoice(booking)}
                              className="pill-btn-outline py-1 px-3"
                              style={{ fontSize: '0.78rem' }}
                            >
                              Folio
                            </button>
                            {booking.bookingStatus !== 'Cancelled' && (
                              <button
                                onClick={() => setSelectedBookingForCancel(booking)}
                                className="pill-btn-outline py-1 px-3 text-danger border-danger"
                                style={{ fontSize: '0.78rem' }}
                              >
                                Cancel
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

        {/* TAB 3: Resident Profile Preferences */}
        {activeTab === 'profile' && (
          <div className="luxury-card p-4" style={{ maxWidth: '780px', margin: '0 auto' }}>
            <h3 className="font-serif fw-bold text-main fs-4 mb-2">Royal Resident Preferences</h3>
            <p className="text-secondary small mb-4">
              Your preferences are automatically shared with your assigned Khansama, wellness director, and housekeeping team before your arrival.
            </p>

            <form onSubmit={handleSavePreferences}>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Contact Phone</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ backgroundColor: 'var(--bg-surface-subtle)', borderColor: 'var(--border-subtle)' }}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Dietary Preferences</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={dietary}
                    onChange={(e) => setDietary(e.target.value)}
                    style={{ backgroundColor: 'var(--bg-surface-subtle)', borderColor: 'var(--border-subtle)' }}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Floor & View Preference</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={floorPreference}
                    onChange={(e) => setFloorPreference(e.target.value)}
                    style={{ backgroundColor: 'var(--bg-surface-subtle)', borderColor: 'var(--border-subtle)' }}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Pillow Menu Choice</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={pillowType}
                    onChange={(e) => setPillowType(e.target.value)}
                    style={{ backgroundColor: 'var(--bg-surface-subtle)', borderColor: 'var(--border-subtle)' }}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold text-muted">Special Personal Notes for Butler</label>
                  <textarea
                    rows={3}
                    className="form-control rounded-3"
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    style={{ backgroundColor: 'var(--bg-surface-subtle)', borderColor: 'var(--border-subtle)' }}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <button type="submit" className="pill-btn-dark py-2 px-4">
                  Save Resident Preferences
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      {selectedBookingForInvoice && (
        <InvoiceModal
          booking={selectedBookingForInvoice}
          onClose={() => setSelectedBookingForInvoice(null)}
        />
      )}

      {/* Service Request Modal */}
      {showServiceModal && (
        <ServiceRequestModal
          roomNumber={activeStay.roomNumber}
          guestName={currentUser?.name || 'Aisha Sharma'}
          onClose={() => setShowServiceModal(false)}
        />
      )}

      {/* Cancel Confirmation Modal */}
      {selectedBookingForCancel && (
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
          <div className="luxury-card p-4" style={{ maxWidth: '480px', width: '100%' }}>
            <div className="d-flex align-items-center gap-2 text-danger mb-3">
              <AlertTriangle size={24} />
              <h4 className="font-serif fw-bold fs-5 m-0">Confirm Cancellation</h4>
            </div>
            <p className="text-secondary small mb-3">
              Are you sure you wish to cancel reservation <strong>#{selectedBookingForCancel.bookingReference || selectedBookingForCancel.id}</strong> for {selectedBookingForCancel.roomTitle || selectedBookingForCancel.roomName}?
            </p>
            <div className="p-3 rounded-3 mb-3" style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0' }}>
              <span className="fw-semibold text-success small d-block">
                100% Full Refund Guarantee:
              </span>
              <span className="fs-5 fw-bold font-serif text-success">
                ₹ {(selectedBookingForCancel.totalAmount || 38997).toLocaleString('en-IN')}
              </span>
              <span className="text-muted small d-block mt-1">
                Will be reimbursed to your source payment account within 24 hours.
              </span>
            </div>
            <div className="mb-4">
              <label className="form-label small text-muted">Cancellation Reason</label>
              <input
                type="text"
                className="form-control rounded-3"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button
                onClick={() => setSelectedBookingForCancel(null)}
                className="pill-btn-outline py-2 px-3"
              >
                Keep Reservation
              </button>
              <button
                onClick={handleConfirmCancel}
                className="pill-btn-dark py-2 px-3 bg-danger border-danger"
              >
                Confirm 100% Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestDashboardPage;

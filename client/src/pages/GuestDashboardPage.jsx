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
  Utensils
} from 'lucide-react';
import { toast } from 'react-toastify';

export const GuestDashboardPage = () => {
  const dispatch = useDispatch();
  const { currentUser, role } = useSelector((state) => state.auth);
  const bookings = useSelector((state) => state.bookings.bookings);

  // Filter bookings for guest
  const userBookings = bookings.filter(
    (b) => b.guestEmail?.toLowerCase() === currentUser?.email?.toLowerCase() || b.guestId === currentUser?.id || true
  );

  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'history' | 'profile'
  const [historyFilter, setHistoryFilter] = useState('all'); // 'all' | 'Confirmed' | 'Checked-In' | 'Checked-Out' | 'Cancelled'

  // Modals state
  const [selectedBookingForInvoice, setSelectedBookingForInvoice] = useState(null);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Change of travel schedule');

  // Digital Key unlock simulation
  const [keyUnlocked, setKeyUnlocked] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  // Profile Form state
  const [profileName, setProfileName] = useState(currentUser?.name || 'Lord Johnathan Vance');
  const [profilePhone, setProfilePhone] = useState('+1 (555) 349-2810');
  const [pillowPref, setPillowPref] = useState('Hypoallergenic Goose Feather');
  const [dietPref, setDietPref] = useState('Fine French Cuisine / Pescatarian');

  const activeStay = userBookings.find(
    (b) => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Checked-In'
  );

  const handleUnlockDoor = () => {
    setIsUnlocking(true);
    setTimeout(() => {
      setIsUnlocking(false);
      setKeyUnlocked(true);
      toast.success('Mobile Key Verified! Suite Door #202 Unlocked.');
      setTimeout(() => setKeyUnlocked(false), 5000);
    }, 1000);
  };

  const handleConfirmCancel = (e) => {
    e.preventDefault();
    if (!selectedBookingForCancel) return;

    dispatch(
      cancelBooking({
        bookingId: selectedBookingForCancel.id,
        reason: cancelReason
      })
    );

    dispatch(
      addAuditLog({
        user: `${currentUser?.name} (Guest)`,
        action: 'Booking Cancelled & Refunded',
        details: `Booking ${selectedBookingForCancel.id} cancelled. Refund of $${selectedBookingForCancel.totalAmount} initiated.`
      })
    );

    toast.info(`Booking ${selectedBookingForCancel.id} has been cancelled. Full refund has been credited to your original payment method.`);
    setSelectedBookingForCancel(null);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    dispatch(
      updateProfile({
        name: profileName,
        phone: profilePhone
      })
    );
    toast.success('VIP Guest profile & preferences updated successfully.');
  };

  return (
    <div className="guest-dashboard py-5" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container py-2">
        {/* Welcome Header */}
        <div className="card-luxury p-4 mb-4" style={{ background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-surface-elevated) 100%)' }}>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-md"
                style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #556b2f 0%, #283618 100%)', border: '2px solid var(--yellow-200)', color: '#fef08a', fontSize: '1.4rem' }}
              >
                {currentUser?.name ? currentUser.name.charAt(0) : 'J'}
              </div>
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h3 className="font-serif fw-bold mb-0">{currentUser?.name || 'Lord Johnathan Vance'}</h3>
                  <span className="badge bg-warning text-dark fw-bold px-2 py-1">
                    <Crown size={12} className="me-1 inline" /> VIP BLACK TIER
                  </span>
                </div>
                <p className="text-muted small mb-0">{currentUser?.email} &bull; Member since 2024</p>
              </div>
            </div>

            <div className="d-flex gap-2">
              <button
                onClick={() => setShowServiceModal(true)}
                className="btn btn-gold d-flex align-items-center gap-2"
              >
                <Utensils size={16} /> Request Suite Service
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="tabs-luxury mb-4">
          <button
            onClick={() => setActiveTab('active')}
            className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
          >
            <KeyRound size={16} /> Active Sanctuary Stay
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          >
            <FileText size={16} /> Booking History & Folios ({userBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          >
            <User size={16} /> VIP Profile & Preferences
          </button>
        </div>

        {/* TAB 1: Active Stay Card */}
        {activeTab === 'active' && (
          <div>
            {activeStay ? (
              <div className="row g-4">
                {/* Active Stay Details */}
                <div className="col-lg-8">
                  <div className="card-luxury p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                      <div>
                        <span className="text-warning small text-uppercase fw-bold">Current Residence</span>
                        <h4 className="font-serif fw-bold mb-0">{activeStay.roomName}</h4>
                      </div>
                      <span className={`badge ${activeStay.bookingStatus === 'Checked-In' ? 'badge-inspected' : 'badge-confirmed'}`}>
                        {activeStay.bookingStatus}
                      </span>
                    </div>

                    <div className="row g-3 mb-4">
                      <div className="col-sm-6">
                        <div className="p-3 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                          <span className="text-muted small d-block">Suite Room Number</span>
                          <span className="fs-4 fw-bold font-serif text-warning">Room #{activeStay.roomNumber}</span>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="p-3 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                          <span className="text-muted small d-block">Dates of Stay</span>
                          <span className="fw-semibold small">{activeStay.checkIn} &rarr; {activeStay.checkOut} ({activeStay.nights} nights)</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h6 className="fw-bold small text-muted text-uppercase mb-2">Guest Special Requests</h6>
                      <p className="text-muted small p-3 rounded border mb-0" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                        "{activeStay.specialRequests || 'No additional special requests recorded.'}"
                      </p>
                    </div>

                    <div className="d-flex gap-2 flex-wrap">
                      <button
                        onClick={() => setSelectedBookingForInvoice(activeStay)}
                        className="btn btn-secondary-custom"
                      >
                        <FileText size={15} /> View Folio & Tax Invoice
                      </button>
                      <button
                        onClick={() => setShowServiceModal(true)}
                        className="btn btn-gold-outline"
                      >
                        <Sparkles size={15} /> Request Butler / Concierge
                      </button>
                    </div>
                  </div>
                </div>

                {/* Digital Key & Smart Access */}
                <div className="col-lg-4">
                  <div className="card-luxury p-4 text-center">
                    <div className="mb-3">
                      <span className="badge bg-secondary-subtle text-muted small text-uppercase">
                        Keyless Mobile Access
                      </span>
                      <h5 className="font-serif fw-bold mt-1">Digital Suite Key</h5>
                    </div>

                    <div
                      className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4 cursor-pointer transition-normal shadow-lg ${
                        keyUnlocked
                          ? 'border border-success bg-success-subtle text-success'
                          : isUnlocking
                          ? 'border border-warning bg-warning-subtle text-warning'
                          : 'border border-secondary bg-dark text-white'
                      }`}
                      style={{ width: '130px', height: '130px', cursor: 'pointer' }}
                      onClick={handleUnlockDoor}
                    >
                      {keyUnlocked ? (
                        <div>
                          <CheckCircle size={44} />
                          <div className="small fw-bold mt-1">UNLOCKED</div>
                        </div>
                      ) : isUnlocking ? (
                        <div>
                          <Sparkles size={44} className="pulse-subtle" />
                          <div className="small fw-bold mt-1">VERIFYING...</div>
                        </div>
                      ) : (
                        <div>
                          <KeyRound size={44} />
                          <div className="small fw-bold mt-1">TAP TO UNLOCK</div>
                        </div>
                      )}
                    </div>

                    <p className="text-muted small mb-3">
                      Hold your phone near the electronic door handle for Room #{activeStay.roomNumber}.
                    </p>

                    <div className="p-2 rounded text-muted small border" style={{ backgroundColor: 'var(--bg-secondary)', fontSize: '0.75rem' }}>
                      <ShieldCheck size={14} className="text-success me-1 inline" />
                      Encrypted NFC Token: Active until 11:00 AM on {activeStay.checkOut}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card-luxury p-5 text-center">
                <Calendar size={40} className="text-warning mb-3 opacity-60" />
                <h4 className="font-serif fw-bold">No Active Stay In Progress</h4>
                <p className="text-muted small mb-4">You do not currently have a stay checked-in. Explore our signature suites to reserve your next escape.</p>
                <button onClick={() => window.location.href = '/rooms'} className="btn btn-gold">
                  Explore Available Suites
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Booking History & Folios */}
        {activeTab === 'history' && (
          <div>
            {/* Filter Pills */}
            <div className="d-flex gap-2 mb-4 overflow-x-auto pb-2">
              {['all', 'Confirmed', 'Checked-In', 'Checked-Out', 'Cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setHistoryFilter(status)}
                  className={`btn btn-sm rounded-pill px-3 py-1 ${
                    historyFilter === status ? 'btn-gold' : 'btn-secondary-custom'
                  }`}
                >
                  {status === 'all' ? 'All Bookings' : status}
                </button>
              ))}
            </div>

            <div className="d-flex flex-column gap-3">
              {userBookings
                .filter((b) => historyFilter === 'all' || b.bookingStatus === historyFilter)
                .map((booking) => (
                  <div className="card-luxury p-4" key={booking.id}>
                    <div className="row g-3 align-items-center">
                      <div className="col-md-5">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <span className="fw-bold font-serif fs-5">{booking.roomName}</span>
                          <span className={`badge ${
                            booking.bookingStatus === 'Confirmed' ? 'badge-confirmed' :
                            booking.bookingStatus === 'Checked-In' ? 'badge-inspected' :
                            booking.bookingStatus === 'Checked-Out' ? 'badge-clean' : 'badge-cancelled'
                          }`}>
                            {booking.bookingStatus}
                          </span>
                        </div>
                        <div className="text-muted small mb-1">
                          Booking ID: <strong className="text-warning">{booking.id}</strong> &bull; Room #{booking.roomNumber}
                        </div>
                        <div className="text-muted small">
                          {booking.checkIn} &rarr; {booking.checkOut} ({booking.nights} nights)
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="text-muted small">Total Paid</div>
                        <div className="fs-5 fw-bold text-warning font-serif">${booking.totalAmount}</div>
                        <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
                          {booking.paymentMethod}
                        </div>
                      </div>

                      <div className="col-md-4 text-md-end">
                        <div className="d-flex flex-wrap gap-2 justify-content-md-end">
                          <button
                            onClick={() => setSelectedBookingForInvoice(booking)}
                            className="btn btn-sm btn-secondary-custom"
                            title="Print Folio Invoice"
                          >
                            <FileText size={14} /> Folio Invoice
                          </button>

                          {booking.bookingStatus === 'Confirmed' && (
                            <button
                              onClick={() => setSelectedBookingForCancel(booking)}
                              className="btn btn-sm btn-outline-danger"
                            >
                              Cancel & Refund
                            </button>
                          )}

                          {booking.bookingStatus === 'Checked-Out' && (
                            <button
                              onClick={() => setSelectedBookingForReview(booking)}
                              className="btn btn-sm btn-gold-outline"
                            >
                              <Star size={14} /> Rate Stay
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 3: Profile & Preferences */}
        {activeTab === 'profile' && (
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card-luxury p-4">
                <h4 className="font-serif fw-bold mb-3 text-warning">Guest Profile Management</h4>
                <form onSubmit={handleSaveProfile}>
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">Legal Name</label>
                      <input
                        type="text"
                        className="input-luxury"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">Email Address (Registered)</label>
                      <input
                        type="email"
                        className="input-luxury"
                        value={currentUser?.email}
                        disabled
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">Mobile Telephone</label>
                      <input
                        type="tel"
                        className="input-luxury"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">Preferred Pillow Architecture</label>
                      <select
                        className="input-luxury"
                        value={pillowPref}
                        onChange={(e) => setPillowPref(e.target.value)}
                      >
                        <option>Hypoallergenic Goose Feather</option>
                        <option>Memory Foam Ergonomic</option>
                        <option>Organic Mulberry Silk</option>
                        <option>Firm Bamboo Charcoal</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold text-muted">Dietary Preferences & Allergies</label>
                      <input
                        type="text"
                        className="input-luxury"
                        value={dietPref}
                        onChange={(e) => setDietPref(e.target.value)}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-gold">
                    Save VIP Preferences
                  </button>
                </form>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card-luxury p-4">
                <h5 className="font-serif fw-bold mb-3">Loyalty & Rewards</h5>
                <div className="p-3 rounded mb-3 text-center" style={{ backgroundColor: 'var(--gold-50)' }}>
                  <Crown size={32} className="text-warning mb-1" />
                  <div className="fs-3 font-serif fw-bold text-warning">28,450</div>
                  <div className="text-muted small text-uppercase fw-bold">HotelPro Privilege Points</div>
                </div>
                <ul className="text-muted small list-unstyled d-flex flex-column gap-2 mb-0">
                  <li className="d-flex align-items-center gap-2">
                    <CheckCircle size={14} className="text-success" /> Complimentary Champagne on arrival
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <CheckCircle size={14} className="text-success" /> Guaranteed Late Check-Out (14:00)
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <CheckCircle size={14} className="text-success" /> Complimentary Suite Upgrade subject to availability
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cancellation Modal */}
      {selectedBookingForCancel && (
        <div className="modal-overlay" onClick={() => setSelectedBookingForCancel(null)}>
          <div className="modal-content-luxury p-4" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
              <div>
                <h4 className="font-serif text-danger mb-0">Cancel Reservation & Refund</h4>
                <p className="text-muted small mb-0">Booking #{selectedBookingForCancel.id}</p>
              </div>
              <button className="btn btn-sm btn-link text-muted p-1" onClick={() => setSelectedBookingForCancel(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="p-3 rounded mb-3 bg-danger-subtle text-danger border border-danger small">
              <AlertTriangle size={16} className="me-1 inline" />
              <strong>100% Guaranteed Refund Eligibility:</strong> Since you are cancelling within our generous 48-hour complimentary window, the full balance of <strong>${selectedBookingForCancel.totalAmount}</strong> will be refunded to your original payment method.
            </div>

            <form onSubmit={handleConfirmCancel}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Reason for Cancellation</label>
                <select
                  className="input-luxury"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                >
                  <option>Change of travel schedule</option>
                  <option>Emergency family reason</option>
                  <option>Rebooking for different suite dates</option>
                  <option>Other reasons</option>
                </select>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBookingForCancel(null)}
                  className="btn btn-secondary-custom"
                >
                  Keep Reservation
                </button>
                <button type="submit" className="btn btn-danger">
                  Confirm Cancellation & Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modals */}
      <InvoiceModal
        isOpen={Boolean(selectedBookingForInvoice)}
        onClose={() => setSelectedBookingForInvoice(null)}
        booking={selectedBookingForInvoice}
      />

      <ReviewModal
        isOpen={Boolean(selectedBookingForReview)}
        onClose={() => setSelectedBookingForReview(null)}
        booking={selectedBookingForReview}
      />

      <ServiceRequestModal
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        roomNumber={activeStay?.roomNumber || '202'}
        guestName={currentUser?.name || 'Lord Johnathan Vance'}
      />
    </div>
  );
};

export default GuestDashboardPage;

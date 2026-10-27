import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { createBooking, resetBookingFlow } from '../redux/slices/bookingsSlice';
import { addNotification } from '../redux/slices/notificationsSlice';
import { addAuditLog } from '../redux/slices/hotelSlice';
import InvoiceModal from '../components/InvoiceModal';
import {
  ShieldCheck,
  CheckCircle,
  CreditCard,
  Lock,
  User,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Crown,
  Printer,
  ChevronRight,
  Tag
} from 'lucide-react';
import { toast } from 'react-toastify';

export const BookingCheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentFlow = useSelector((state) => state.bookings.currentBookingFlow);
  const { currentUser } = useSelector((state) => state.auth);
  const rooms = useSelector((state) => state.rooms.rooms);

  // Fallback room if accessed directly
  const room = currentFlow.room || rooms[0];

  const [step, setStep] = useState(1);
  const [guestName, setGuestName] = useState(currentUser?.name || 'Lord Johnathan Vance');
  const [guestEmail, setGuestEmail] = useState(currentUser?.email || 'john.vance@luxurytravel.com');
  const [guestPhone, setGuestPhone] = useState('+1 (555) 349-2810');
  const [specialRequests, setSpecialRequests] = useState('Late check-in requested (approx 7:30 PM). Extra feather pillows.');

  // Payment states
  const [paymentProvider, setPaymentProvider] = useState('Stripe'); // 'Stripe' | 'Razorpay'
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState(guestName);
  const [expiry, setExpiry] = useState('08/29');
  const [cvc, setCvc] = useState('888');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const nights = currentFlow.nights || 2;
  const baseRate = room.price * nights;
  const addOnsTotal = (currentFlow.addOns || []).reduce((acc, a) => acc + a.price, 0);
  const taxes = Math.round((baseRate + addOnsTotal) * 0.12);
  const resortFee = nights * 35;
  const subtotal = baseRate + addOnsTotal + taxes + resortFee;
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const finalTotal = subtotal - discountAmount;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'VIP10' || promoCode.trim().toUpperCase() === 'HOTELPRO') {
      setDiscountPercent(10);
      toast.success('VIP Promo Code applied! 10% discount granted.');
    } else {
      toast.error('Invalid promo code. Try "VIP10" for a 10% privilege discount.');
    }
  };

  const handleCompletePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const newBookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
      const bookingData = {
        id: newBookingId,
        roomId: room.id,
        roomName: room.name,
        roomNumber: room.roomNumber,
        guestId: currentUser?.id || 'user-1',
        guestName,
        guestEmail,
        guestPhone,
        checkIn: currentFlow.checkIn || new Date().toISOString().split('T')[0],
        checkOut: currentFlow.checkOut || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        nights,
        guests: currentFlow.guests || 2,
        totalAmount: finalTotal,
        paymentStatus: 'Paid',
        paymentMethod: `${paymentProvider} (${cardNumber.slice(-4)})`,
        bookingStatus: 'Confirmed',
        specialRequests,
        addOns: currentFlow.addOns || [],
        createdAt: new Date().toISOString()
      };

      // Save to Redux
      dispatch(createBooking(bookingData));
      dispatch(
        addNotification({
          title: `Booking Confirmed: ${newBookingId}`,
          message: `Your reservation for ${room.name} has been confirmed. Confirmation email dispatched.`,
          type: 'booking'
        })
      );
      dispatch(
        addAuditLog({
          user: `${guestName} (Guest)`,
          action: 'New Booking Created',
          details: `Processed ${paymentProvider} reservation ${newBookingId} for $${finalTotal}.`
        })
      );

      setConfirmedBooking(bookingData);
      setStep(4); // Confirmation step
      toast.success(`Booking ${newBookingId} confirmed! Welcome to HotelPro Grand Palace.`);
    }, 1200);
  };

  return (
    <div className="booking-page py-5" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container py-2" style={{ maxWidth: '960px' }}>
        {/* Step Indicator */}
        <div className="d-flex justify-content-between align-items-center mb-5 pb-3 border-bottom">
          {[
            { num: 1, label: 'Stay Summary' },
            { num: 2, label: 'Guest Details' },
            { num: 3, label: 'Payment' },
            { num: 4, label: 'Confirmation' }
          ].map((item) => (
            <div
              key={item.num}
              className={`d-flex align-items-center gap-2 ${
                step >= item.num ? 'text-warning fw-bold' : 'text-muted'
              }`}
            >
              <div
                className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${
                  step === item.num
                    ? 'btn-gold text-white'
                    : step > item.num
                    ? 'bg-warning text-dark'
                    : 'bg-secondary text-light'
                }`}
                style={{ width: '32px', height: '32px', fontSize: '0.85rem' }}
              >
                {step > item.num ? <CheckCircle size={18} /> : item.num}
              </div>
              <span className="small d-none d-sm-inline">{item.label}</span>
            </div>
          ))}
        </div>

        {/* STEP 1: Stay & Room Confirmation */}
        {step === 1 && (
          <div className="row g-4">
            <div className="col-md-7">
              <div className="card-luxury p-4 h-100">
                <h4 className="font-serif fw-bold mb-3 text-warning">Confirm Selected Suite</h4>
                <div className="rounded overflow-hidden mb-3" style={{ height: '220px' }}>
                  <img src={room.images[0]} alt={room.name} className="w-100 h-100 object-fit-cover" />
                </div>
                <h5 className="font-serif fw-bold mb-1">{room.name}</h5>
                <p className="text-muted small mb-3">{room.description}</p>

                <div className="row g-2 text-muted small p-3 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <div className="col-6"><strong>Suite Category:</strong> {room.category}</div>
                  <div className="col-6"><strong>Room Number:</strong> #{room.roomNumber} (Floor {room.floor})</div>
                  <div className="col-6"><strong>Bed Type:</strong> {room.bedType}</div>
                  <div className="col-6"><strong>Room Dimensions:</strong> {room.sizeSqFt} sq ft</div>
                </div>
              </div>
            </div>

            <div className="col-md-5">
              <div className="card-luxury p-4">
                <h5 className="font-serif fw-bold mb-3">Reservation Schedule</h5>
                <div className="d-flex flex-column gap-3 mb-4">
                  <div className="d-flex justify-content-between pb-2 border-bottom">
                    <span className="text-muted small">Check-In:</span>
                    <span className="fw-semibold small">{currentFlow.checkIn || '2026-10-28'} (from 15:00)</span>
                  </div>
                  <div className="d-flex justify-content-between pb-2 border-bottom">
                    <span className="text-muted small">Check-Out:</span>
                    <span className="fw-semibold small">{currentFlow.checkOut || '2026-10-31'} (until 11:00)</span>
                  </div>
                  <div className="d-flex justify-content-between pb-2 border-bottom">
                    <span className="text-muted small">Duration:</span>
                    <span className="fw-semibold small">{nights} Night(s)</span>
                  </div>
                  <div className="d-flex justify-content-between pb-2 border-bottom">
                    <span className="text-muted small">Guests:</span>
                    <span className="fw-semibold small">{currentFlow.guests || 2} Persons</span>
                  </div>
                </div>

                <div className="p-3 rounded mb-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Base Accommodations:</span>
                    <span>${baseRate}</span>
                  </div>
                  {addOnsTotal > 0 && (
                    <div className="d-flex justify-content-between small text-muted mb-1">
                      <span>Add-ons:</span>
                      <span>+${addOnsTotal}</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Taxes & Resort Fee:</span>
                    <span>+${taxes + resortFee}</span>
                  </div>
                  <div className="d-flex justify-content-between fw-bold pt-2 border-top">
                    <span>Estimated Total:</span>
                    <span className="text-warning">${finalTotal}</span>
                  </div>
                </div>

                <button onClick={() => setStep(2)} className="btn btn-gold w-100 py-2">
                  Continue to Guest Details <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Guest Details & Special Requests */}
        {step === 2 && (
          <div className="card-luxury p-4">
            <h4 className="font-serif fw-bold mb-3 text-warning">Guest Credentials & Preferences</h4>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label small fw-semibold text-muted">Primary Guest Full Legal Name</label>
                <div className="position-relative">
                  <input
                    type="text"
                    className="input-luxury ps-5"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                  />
                  <User size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold text-muted">VIP Email Confirmation Address</label>
                <div className="position-relative">
                  <input
                    type="email"
                    className="input-luxury ps-5"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    required
                  />
                  <Mail size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold text-muted">Contact Phone Number</label>
                <div className="position-relative">
                  <input
                    type="tel"
                    className="input-luxury ps-5"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    required
                  />
                  <Phone size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold text-muted">Estimated Arrival Time</label>
                <select className="input-luxury">
                  <option>Standard Check-In (15:00 - 18:00)</option>
                  <option>Early Check-In Request (12:00 - 14:00)</option>
                  <option>Late Evening Arrival (19:00 - 23:00)</option>
                  <option>Midnight Arrival (After 00:00)</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label small fw-semibold text-muted">Special Requests / Dietary Needs / Celebrations</label>
                <textarea
                  className="input-luxury"
                  rows={3}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Anniversary celebration, champagne on ice upon arrival, quiet high floor, down feather allergies..."
                />
              </div>
            </div>

            <div className="d-flex justify-content-between">
              <button onClick={() => setStep(1)} className="btn btn-secondary-custom">
                <ArrowLeft size={16} /> Back to Summary
              </button>
              <button
                onClick={() => {
                  if (!guestName || !guestEmail) {
                    toast.error('Please provide guest name and email.');
                    return;
                  }
                  setStep(3);
                }}
                className="btn btn-gold"
              >
                Proceed to Payment <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Online Payment Portal */}
        {step === 3 && (
          <div className="row g-4">
            <div className="col-md-7">
              <div className="card-luxury p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="font-serif fw-bold text-warning mb-0">Secure Payment Gateway</h4>
                  <div className="d-flex align-items-center gap-1 text-success small">
                    <ShieldCheck size={16} />
                    <span>256-Bit SSL Encrypted</span>
                  </div>
                </div>

                {/* Gateway Provider Selection */}
                <div className="mb-4">
                  <label className="form-label small text-muted fw-semibold">Select Payment Gateway</label>
                  <div className="row g-2">
                    <div className="col-6">
                      <div
                        onClick={() => setPaymentProvider('Stripe')}
                        className={`p-3 rounded border text-center cursor-pointer transition-fast ${
                          paymentProvider === 'Stripe' ? 'border-warning bg-warning-subtle' : ''
                        }`}
                        style={{ cursor: 'pointer', backgroundColor: paymentProvider === 'Stripe' ? 'var(--gold-50)' : 'var(--bg-secondary)' }}
                      >
                        <CreditCard size={20} className="mb-1 text-warning" />
                        <div className="fw-bold small">Stripe Direct</div>
                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>Visa, MC, Amex, Apple Pay</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div
                        onClick={() => setPaymentProvider('Razorpay')}
                        className={`p-3 rounded border text-center cursor-pointer transition-fast ${
                          paymentProvider === 'Razorpay' ? 'border-warning bg-warning-subtle' : ''
                        }`}
                        style={{ cursor: 'pointer', backgroundColor: paymentProvider === 'Razorpay' ? 'var(--gold-50)' : 'var(--bg-secondary)' }}
                      >
                        <ShieldCheck size={20} className="mb-1 text-info" />
                        <div className="fw-bold small">Razorpay Global</div>
                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>UPI, Cards, NetBanking</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Realistic Credit Card Visualizer */}
                <div
                  className="rounded-3 p-4 mb-4 text-white shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #182315 0%, #283618 60%, #556b2f 100%)',
                    border: '1.5px solid var(--yellow-200)',
                    minHeight: '170px'
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Crown size={24} className="text-warning" />
                    <span className="small letter-spacing-1 fw-bold text-uppercase">{paymentProvider} Platinum</span>
                  </div>
                  <div className="fs-5 font-mono letter-spacing-2 mb-3">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>
                  <div className="d-flex justify-content-between align-items-end small">
                    <div>
                      <div className="opacity-75" style={{ fontSize: '0.65rem' }}>CARDHOLDER</div>
                      <div className="fw-semibold">{cardHolder || 'GUEST NAME'}</div>
                    </div>
                    <div>
                      <div className="opacity-75" style={{ fontSize: '0.65rem' }}>EXPIRES</div>
                      <div className="fw-semibold">{expiry || 'MM/YY'}</div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleCompletePayment}>
                  <div className="mb-3">
                    <label className="form-label small text-muted">Cardholder Name</label>
                    <input
                      type="text"
                      className="input-luxury"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small text-muted">Card Number</label>
                    <input
                      type="text"
                      className="input-luxury"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="row g-2 mb-4">
                    <div className="col-6">
                      <label className="form-label small text-muted">Expiry Date</label>
                      <input
                        type="text"
                        className="input-luxury"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small text-muted">Security Code (CVC)</label>
                      <input
                        type="password"
                        className="input-luxury"
                        placeholder="CVC"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <button type="button" onClick={() => setStep(2)} className="btn btn-secondary-custom">
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button type="submit" className="btn btn-gold px-4 py-2" disabled={isProcessing}>
                      {isProcessing ? 'Authorizing Payment...' : `Authorize & Pay $${finalTotal}`}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Price Summary & Promo Code */}
            <div className="col-md-5">
              <div className="card-luxury p-4">
                <h5 className="font-serif fw-bold mb-3">Billing Summary</h5>

                <div className="d-flex flex-column gap-2 mb-3 pb-3 border-bottom small text-muted">
                  <div className="d-flex justify-content-between">
                    <span>{room.name} ({nights} nights)</span>
                    <span className="fw-semibold">${baseRate}</span>
                  </div>
                  {addOnsTotal > 0 && (
                    <div className="d-flex justify-content-between">
                      <span>Curated Add-ons</span>
                      <span className="fw-semibold">+${addOnsTotal}</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between">
                    <span>Resort & Pool Privilege Fee</span>
                    <span>+${resortFee}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Government Tourism Tax (12%)</span>
                    <span>+${taxes}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="d-flex justify-content-between text-success fw-bold">
                      <span>VIP Privilege Discount (10%)</span>
                      <span>-${discountAmount}</span>
                    </div>
                  )}
                </div>

                {/* Promo Code Input */}
                <form onSubmit={handleApplyPromo} className="input-group mb-3">
                  <input
                    type="text"
                    className="input-luxury rounded-start rounded-0"
                    placeholder="Promo Code (Try VIP10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button type="submit" className="btn btn-secondary-custom rounded-end rounded-0">
                    Apply
                  </button>
                </form>

                <div className="d-flex justify-content-between align-items-baseline mb-4 pt-2">
                  <span className="fw-bold">Total Amount Due:</span>
                  <span className="fs-3 font-serif fw-bold text-warning">${finalTotal}</span>
                </div>

                <div className="p-3 rounded border text-muted small" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <ShieldCheck size={16} className="text-success mb-1" />
                  <div>Guaranteed Instant Check-In &bull; Zero Booking Fees</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Instant Confirmation & Invoice */}
        {step === 4 && confirmedBooking && (
          <div className="card-luxury p-5 text-center">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{
                width: '72px',
                height: '72px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff'
              }}
            >
              <CheckCircle size={40} />
            </div>

            <span className="badge bg-success-subtle text-success border border-success px-3 py-1 mb-2">
              RESERVATION GUARANTEED & CONFIRMED
            </span>
            <h2 className="font-serif fw-bold mb-2">We Look Forward to Welcoming You</h2>
            <p className="text-muted mx-auto mb-4" style={{ maxWidth: '580px' }}>
              Your stay at HotelPro Grand Palace is secured under Booking Reference{' '}
              <strong className="text-warning">{confirmedBooking.id}</strong>. A detailed folio and itinerary has been dispatched to <strong>{confirmedBooking.guestEmail}</strong>.
            </p>

            <div className="p-4 rounded border mb-4 text-start mx-auto" style={{ maxWidth: '600px', backgroundColor: 'var(--bg-secondary)' }}>
              <div className="row g-2 small">
                <div className="col-sm-6"><strong>Suite:</strong> {confirmedBooking.roomName}</div>
                <div className="col-sm-6"><strong>Room Number:</strong> #{confirmedBooking.roomNumber}</div>
                <div className="col-sm-6"><strong>Check-In:</strong> {confirmedBooking.checkIn}</div>
                <div className="col-sm-6"><strong>Check-Out:</strong> {confirmedBooking.checkOut}</div>
                <div className="col-sm-6"><strong>Guest Name:</strong> {confirmedBooking.guestName}</div>
                <div className="col-sm-6"><strong>Payment Status:</strong> Paid in Full (${confirmedBooking.totalAmount})</div>
              </div>
            </div>

            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <button onClick={() => setShowInvoiceModal(true)} className="btn btn-gold">
                <Printer size={16} /> View & Print Tax Folio
              </button>
              <Link to="/guest-dashboard" className="btn btn-secondary-custom">
                Open Guest Portal & Stays
              </Link>
              <Link to="/" className="btn btn-secondary-custom">
                Back to Home
              </Link>
            </div>

            <InvoiceModal
              isOpen={showInvoiceModal}
              onClose={() => setShowInvoiceModal(false)}
              booking={confirmedBooking}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCheckoutPage;

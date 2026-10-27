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
  Tag,
  QrCode,
  MapPin
} from 'lucide-react';
import { toast } from 'react-toastify';

export const BookingCheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentFlow = useSelector((state) => state.bookings.currentBookingFlow);
  const { currentUser } = useSelector((state) => state.auth);
  const rooms = useSelector((state) => state.rooms.rooms);

  const room = currentFlow.room || rooms[0];

  const [step, setStep] = useState(1);
  const [guestName, setGuestName] = useState(currentUser?.name || 'Aisha Sharma');
  const [guestEmail, setGuestEmail] = useState(currentUser?.email || 'aisha.sharma@luxuryindia.com');
  const [guestPhone, setGuestPhone] = useState('+91 98201 44521');
  const [guestCity, setGuestCity] = useState('Mumbai, Maharashtra');
  const [specialRequests, setSpecialRequests] = useState('Late check-in requested (approx 7:30 PM). Traditional evening high tea on arrival.');

  // Payment states
  const [paymentProvider, setPaymentProvider] = useState('Razorpay'); // 'Razorpay' | 'UPI' | 'Card' | 'Stripe'
  const [upiId, setUpiId] = useState('aisha.sharma@okhdfcbank');
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
  const roomPrice = room.price || room.basePrice || 18500;
  const baseRate = roomPrice * nights;
  const addOnsTotal = (currentFlow.addOns || []).reduce((acc, a) => acc + a.price, 0);
  const taxes = Math.round((baseRate + addOnsTotal) * 0.18); // 18% Luxury GST
  const resortFee = nights * 1500; // Heritage Conservation Fee
  const subtotal = baseRate + addOnsTotal + taxes + resortFee;
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const finalTotal = subtotal - discountAmount;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (
      promoCode.trim().toUpperCase() === 'NAMASTE10' ||
      promoCode.trim().toUpperCase() === 'VIP10' ||
      promoCode.trim().toUpperCase() === 'HOTELPRO'
    ) {
      setDiscountPercent(10);
      toast.success('Royal Privilege Code applied! 10% discount granted.');
    } else {
      toast.error('Invalid code. Try "NAMASTE10" for a 10% privilege discount.');
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
        bookingReference: newBookingId,
        roomId: room.id,
        roomName: room.title || room.name,
        roomTitle: room.title || room.name,
        roomNumber: room.roomNumber,
        guestId: currentUser?.id || 'user-1',
        guestName,
        guestEmail,
        guestPhone,
        checkIn: currentFlow.checkIn || '2026-11-01',
        checkOut: currentFlow.checkOut || '2026-11-04',
        nights,
        guests: currentFlow.guests || 2,
        totalAmount: finalTotal,
        paymentStatus: 'Paid',
        paymentMethod: paymentProvider === 'UPI' ? `UPI (${upiId})` : `${paymentProvider} (ending ${cardNumber.slice(-4)})`,
        bookingStatus: 'Confirmed',
        specialRequests,
        addOns: currentFlow.addOns || [],
        digitalKeyIssued: true,
        createdAt: new Date().toISOString(),
      };

      // Save to Redux
      dispatch(createBooking(bookingData));
      dispatch(
        addNotification({
          title: `Reservation Confirmed: ${newBookingId}`,
          message: `Your royal stay for ${room.title || room.name} has been secured. Official GST receipt dispatched to ${guestEmail}.`,
          category: 'booking',
        })
      );
      dispatch(
        addAuditLog({
          user: `${guestName} (Resident)`,
          action: 'New Booking Created',
          details: `Processed ${paymentProvider} reservation ${newBookingId} for ₹ ${finalTotal.toLocaleString('en-IN')}.`,
        })
      );

      setConfirmedBooking(bookingData);
      setStep(4); // Confirmation step
      toast.success(`Booking ${newBookingId} confirmed! Welcome to Lumière Palaces.`);
    }, 1200);
  };

  const displayTitle = room.title || room.name;
  const displayLocation = room.destination || room.location || 'India';

  return (
    <div style={{ backgroundColor: 'var(--bg-body)' }} className="py-5">
      <div className="container py-2" style={{ maxWidth: '1180px' }}>
        {/* Step Indicator Header */}
        <div className="text-center mb-5">
          <div className="eyebrow-kicker mb-2">ROYAL GUEST CHECKOUT</div>
          <h1 className="display-6 font-serif fw-bold text-main mb-3">
            Secure Your Palatial Stay
          </h1>

          {/* Stepper Wizard Pills */}
          <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap">
            <span
              className={`badge rounded-pill px-3 py-2 ${
                step >= 1 ? 'pill-btn-dark' : 'pill-btn-outline'
              }`}
              style={{ fontSize: '0.78rem' }}
            >
              1. Stay Itinerary
            </span>
            <ChevronRight size={14} className="text-muted" />
            <span
              className={`badge rounded-pill px-3 py-2 ${
                step >= 2 ? 'pill-btn-dark' : 'pill-btn-outline'
              }`}
              style={{ fontSize: '0.78rem' }}
            >
              2. Resident Details
            </span>
            <ChevronRight size={14} className="text-muted" />
            <span
              className={`badge rounded-pill px-3 py-2 ${
                step >= 3 ? 'pill-btn-dark' : 'pill-btn-outline'
              }`}
              style={{ fontSize: '0.78rem' }}
            >
              3. Payment & Settlement
            </span>
            <ChevronRight size={14} className="text-muted" />
            <span
              className={`badge rounded-pill px-3 py-2 ${
                step === 4 ? 'pill-btn-dark' : 'pill-btn-outline'
              }`}
              style={{ fontSize: '0.78rem' }}
            >
              4. Confirmation & Folio
            </span>
          </div>
        </div>

        {step < 4 ? (
          <div className="row g-5">
            {/* Left Column: Multi-Step Interactive Form */}
            <div className="col-lg-7">
              {/* STEP 1: Itinerary Review */}
              {step === 1 && (
                <div className="luxury-card p-4">
                  <h3 className="font-serif fw-bold fs-4 mb-3">1. Review Your Itinerary</h3>
                  <div className="d-flex align-items-center gap-3 p-3 rounded-3 mb-4" style={{ backgroundColor: 'var(--bg-surface-subtle)' }}>
                    <img
                      src={room.images[0]}
                      alt={displayTitle}
                      className="rounded-3"
                      style={{ width: '80px', height: '60px', objectFit: 'cover' }}
                    />
                    <div>
                      <h4 className="font-serif fw-bold fs-6 m-0">{displayTitle}</h4>
                      <div className="text-muted small">
                        <MapPin size={12} className="inline me-1" style={{ color: 'var(--accent-gold)' }} />
                        {displayLocation} &bull; Room #{room.roomNumber}
                      </div>
                    </div>
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-6">
                      <label className="form-label small text-muted">Check-In Date</label>
                      <div className="p-2 rounded-3 border fw-semibold text-main" style={{ backgroundColor: '#ffffff' }}>
                        {currentFlow.checkIn || '2026-11-01'} (From 2:00 PM)
                      </div>
                    </div>
                    <div className="col-6">
                      <label className="form-label small text-muted">Check-Out Date</label>
                      <div className="p-2 rounded-3 border fw-semibold text-main" style={{ backgroundColor: '#ffffff' }}>
                        {currentFlow.checkOut || '2026-11-04'} (Until 12:00 PM)
                      </div>
                    </div>
                  </div>

                  {/* Promo Code Input */}
                  <div className="mb-4">
                    <label className="form-label small fw-semibold text-muted">Royal Privilege Voucher</label>
                    <form onSubmit={handleApplyPromo} className="d-flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter voucher (e.g. NAMASTE10)"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="form-control rounded-pill"
                        style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-surface-subtle)' }}
                      />
                      <button type="submit" className="pill-btn-dark py-2 px-4 flex-shrink-0">
                        Apply
                      </button>
                    </form>
                    <div className="text-muted small mt-1">
                      Tip: Use voucher <strong style={{ color: 'var(--accent-gold)' }}>NAMASTE10</strong> for a 10% privilege discount.
                    </div>
                  </div>

                  <div className="d-flex justify-content-end">
                    <button onClick={() => setStep(2)} className="pill-btn-dark py-2 px-4">
                      <span>Continue to Guest Details</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Guest Details */}
              {step === 2 && (
                <div className="luxury-card p-4">
                  <h3 className="font-serif fw-bold fs-4 mb-3">2. Resident Information</h3>
                  <div className="row g-3 mb-4">
                    <div className="col-12">
                      <label className="form-label small fw-semibold text-muted">Full Name (As on Government ID / Aadhaar / Passport)</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        style={{ backgroundColor: 'var(--bg-surface-subtle)', borderColor: 'var(--border-subtle)' }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">Email Address (For Booking Folio)</label>
                      <input
                        type="email"
                        className="form-control rounded-3"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        style={{ backgroundColor: 'var(--bg-surface-subtle)', borderColor: 'var(--border-subtle)' }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">Contact Phone (with Country Code)</label>
                      <input
                        type="tel"
                        className="form-control rounded-3"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        style={{ backgroundColor: 'var(--bg-surface-subtle)', borderColor: 'var(--border-subtle)' }}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold text-muted">Residential City & State</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={guestCity}
                        onChange={(e) => setGuestCity(e.target.value)}
                        style={{ backgroundColor: 'var(--bg-surface-subtle)', borderColor: 'var(--border-subtle)' }}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold text-muted">Special Preferences / Dietary Requirements</label>
                      <textarea
                        rows={3}
                        className="form-control rounded-3"
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        style={{ backgroundColor: 'var(--bg-surface-subtle)', borderColor: 'var(--border-subtle)' }}
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-between">
                    <button onClick={() => setStep(1)} className="pill-btn-outline py-2 px-3">
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button onClick={() => setStep(3)} className="pill-btn-dark py-2 px-4">
                      <span>Proceed to Payment</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Payment */}
              {step === 3 && (
                <div className="luxury-card p-4">
                  <h3 className="font-serif fw-bold fs-4 mb-3">3. Payment & Settlement</h3>

                  {/* Payment Method Selector */}
                  <div className="d-flex gap-2 mb-4 flex-wrap">
                    {['Razorpay', 'UPI', 'Card', 'Stripe'].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentProvider(method)}
                        style={{
                          backgroundColor: paymentProvider === method ? 'var(--btn-dark)' : 'var(--bg-surface-subtle)',
                          color: paymentProvider === method ? '#ffffff' : 'var(--text-main)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '9999px',
                          padding: '8px 20px',
                          fontSize: '0.84rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {method === 'UPI' ? 'UPI / QR Code' : method === 'Razorpay' ? 'Razorpay / Net Banking' : method === 'Card' ? 'Credit / Debit Card' : 'Stripe Global'}
                      </button>
                    ))}
                  </div>

                  {paymentProvider === 'UPI' ? (
                    <div className="p-4 rounded-3 text-center mb-4 border" style={{ backgroundColor: 'var(--bg-surface-subtle)' }}>
                      <QrCode size={48} style={{ color: 'var(--accent-gold)' }} className="mb-2" />
                      <h4 className="font-serif fw-bold fs-6 mb-1">Scan & Pay via any UPI App</h4>
                      <p className="text-muted small mb-3">Google Pay, PhonePe, Paytm, or BHIM UPI</p>
                      <input
                        type="text"
                        className="form-control rounded-pill text-center mb-2 mx-auto"
                        style={{ maxWidth: '300px' }}
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="Enter your UPI VPA"
                      />
                    </div>
                  ) : (
                    <div className="mb-4">
                      <div className="mb-3">
                        <label className="form-label small fw-semibold text-muted">Card Number</label>
                        <input
                          type="text"
                          className="form-control rounded-3"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          style={{ backgroundColor: 'var(--bg-surface-subtle)', borderColor: 'var(--border-subtle)' }}
                        />
                      </div>
                      <div className="row g-3">
                        <div className="col-6">
                          <label className="form-label small fw-semibold text-muted">Cardholder Name</label>
                          <input
                            type="text"
                            className="form-control rounded-3"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            style={{ backgroundColor: 'var(--bg-surface-subtle)', borderColor: 'var(--border-subtle)' }}
                          />
                        </div>
                        <div className="col-3">
                          <label className="form-label small fw-semibold text-muted">Expiry</label>
                          <input
                            type="text"
                            className="form-control rounded-3"
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            style={{ backgroundColor: 'var(--bg-surface-subtle)', borderColor: 'var(--border-subtle)' }}
                          />
                        </div>
                        <div className="col-3">
                          <label className="form-label small fw-semibold text-muted">CVV</label>
                          <input
                            type="text"
                            className="form-control rounded-3"
                            value={cvc}
                            onChange={(e) => setCvc(e.target.value)}
                            style={{ backgroundColor: 'var(--bg-surface-subtle)', borderColor: 'var(--border-subtle)' }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="d-flex justify-content-between align-items-center">
                    <button onClick={() => setStep(2)} className="pill-btn-outline py-2 px-3">
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button
                      onClick={handleCompletePayment}
                      disabled={isProcessing}
                      className="pill-btn-dark py-3 px-4"
                    >
                      {isProcessing ? (
                        <span>Processing Royal Settlement...</span>
                      ) : (
                        <>
                          <span>Authorize ₹ {finalTotal.toLocaleString('en-IN')}</span>
                          <Lock size={15} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Order Summary Folio */}
            <div className="col-lg-5">
              <div className="luxury-card p-4 position-sticky" style={{ top: '100px' }}>
                <h4 className="font-serif fw-bold fs-5 mb-3">Settlement Summary</h4>
                <div className="d-flex justify-content-between small text-secondary mb-2">
                  <span>Palace Suite ({nights} nights)</span>
                  <span>₹ {baseRate.toLocaleString('en-IN')}</span>
                </div>
                {addOnsTotal > 0 && (
                  <div className="d-flex justify-content-between small text-secondary mb-2">
                    <span>Royal Add-Ons</span>
                    <span>₹ {addOnsTotal.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between small text-secondary mb-2">
                  <span>18% Luxury GST Slab</span>
                  <span>₹ {taxes.toLocaleString('en-IN')}</span>
                </div>
                <div className="d-flex justify-content-between small text-secondary mb-2">
                  <span>Heritage Conservation & Wellness Fee</span>
                  <span>₹ {resortFee.toLocaleString('en-IN')}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="d-flex justify-content-between small text-success mb-2 fw-semibold">
                    <span>Royal Voucher Discount ({discountPercent}%)</span>
                    <span>-₹ {discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="d-flex justify-content-between fw-bold border-top pt-3 fs-5 text-main mt-3">
                  <span className="font-serif">Total Payable</span>
                  <span className="font-serif" style={{ color: 'var(--accent-gold)' }}>
                    ₹ {finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-top text-muted small">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <ShieldCheck size={16} style={{ color: 'var(--accent-gold)' }} />
                    <span>256-Bit Encrypted Indian Banking Security</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <CheckCircle size={16} className="text-success" />
                    <span>100% Refundable Guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* STEP 4: Confirmation Screen */
          <div className="luxury-card p-5 text-center my-4" style={{ maxWidth: '780px', margin: '0 auto' }}>
            <div
              className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: '70px', height: '70px', backgroundColor: '#ecfdf5', color: '#059669' }}
            >
              <CheckCircle size={36} />
            </div>
            <div className="eyebrow-kicker mb-2">BOOKING CONFIRMED & SETTLED</div>
            <h2 className="display-6 font-serif fw-bold text-main mb-2">
              Namaste, {guestName}
            </h2>
            <p className="text-secondary mb-4" style={{ maxWidth: '520px', margin: '0 auto' }}>
              Your royal reservation has been confirmed. Your official GST folio invoice and NFC Smart Key credentials have been emitted to <strong>{guestEmail}</strong>.
            </p>

            <div className="p-4 rounded-3 mb-4 text-start" style={{ backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-subtle)' }}>
              <div className="row g-3">
                <div className="col-6">
                  <span className="text-muted small">Reservation Code:</span>
                  <div className="fw-bold font-serif fs-5 text-main">{confirmedBooking?.bookingReference}</div>
                </div>
                <div className="col-6 text-end">
                  <span className="text-muted small">Total Paid:</span>
                  <div className="fw-bold font-serif fs-5" style={{ color: 'var(--accent-gold)' }}>
                    ₹ {confirmedBooking?.totalAmount?.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="col-6">
                  <span className="text-muted small">Suite:</span>
                  <div className="fw-bold text-main">{confirmedBooking?.roomTitle}</div>
                </div>
                <div className="col-6 text-end">
                  <span className="text-muted small">Stay Dates:</span>
                  <div className="fw-bold text-main">{confirmedBooking?.checkIn} to {confirmedBooking?.checkOut}</div>
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap">
              <Link to="/guest-dashboard" className="pill-btn-dark py-3 px-4">
                Open Resident Dashboard & NFC Key
              </Link>
              <button
                onClick={() => setShowInvoiceModal(true)}
                className="pill-btn-outline py-3 px-4"
              >
                <Printer size={16} /> View Tax Invoice Folio
              </button>
            </div>
          </div>
        )}
      </div>

      {showInvoiceModal && confirmedBooking && (
        <InvoiceModal
          booking={confirmedBooking}
          onClose={() => setShowInvoiceModal(false)}
        />
      )}
    </div>
  );
};

export default BookingCheckoutPage;

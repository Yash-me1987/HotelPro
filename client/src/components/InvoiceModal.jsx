import React from 'react';
import { X, Printer, Download, CheckCircle, ShieldCheck } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export const InvoiceModal = ({ booking, isOpen, onClose }) => {
  const { config } = useSelector((state) => state.hotel);

  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast.success(`Invoice #${booking.id} downloaded successfully (PDF simulated).`);
  };

  const roomCharge = (booking.nights || 1) * (booking.totalAmount ? Math.round(booking.totalAmount * 0.78) : 500);
  const taxes = Math.round(roomCharge * ((config.taxRatePercent || 12) / 100));
  const resortFee = (booking.nights || 1) * (config.resortFeePerNight || 35);
  const addOnsTotal = (booking.addOns || []).reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content-luxury p-4 shadow-xl"
        style={{ maxWidth: '720px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-success-subtle text-success border border-success px-2 py-1">
              <CheckCircle size={14} className="me-1 inline" /> PAID IN FULL
            </span>
            <span className="text-muted small">Folio Invoice #{booking.id}</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button onClick={handlePrint} className="btn btn-sm btn-secondary-custom">
              <Printer size={15} /> Print
            </button>
            <button onClick={handleDownload} className="btn btn-sm btn-gold">
              <Download size={15} /> Download PDF
            </button>
            <button onClick={onClose} className="btn btn-sm btn-link text-muted p-1">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div className="p-4 rounded border" style={{ backgroundColor: 'var(--bg-surface)' }}>
          {/* Header */}
          <div className="row mb-4 align-items-center">
            <div className="col-sm-7">
              <h3 className="font-serif text-warning mb-1">{config.hotelName}</h3>
              <p className="text-muted small mb-0">{config.brandSubtitle}</p>
              <p className="text-muted small mb-0">{config.address}</p>
              <p className="text-muted small mb-0">Phone: {config.phone} | {config.email}</p>
            </div>
            <div className="col-sm-5 text-sm-end mt-3 mt-sm-0">
              <div className="fw-bold fs-5 text-uppercase text-secondary">Tax Invoice / Folio</div>
              <div className="text-muted small">Date: {new Date().toLocaleDateString()}</div>
              <div className="text-muted small">Ref: {booking.paymentMethod || 'Stripe Gateway'}</div>
              <div className="text-muted small">Status: Confirmed & Paid</div>
            </div>
          </div>

          <hr className="my-3 opacity-25" />

          {/* Guest & Reservation Info */}
          <div className="row mb-4">
            <div className="col-sm-6">
              <h6 className="fw-bold text-muted small text-uppercase">Billed To (Guest):</h6>
              <div className="fw-semibold">{booking.guestName}</div>
              <div className="text-muted small">{booking.guestEmail}</div>
              <div className="text-muted small">{booking.guestPhone || '+1 (555) 349-2810'}</div>
            </div>
            <div className="col-sm-6 text-sm-end mt-3 mt-sm-0">
              <h6 className="fw-bold text-muted small text-uppercase">Stay Summary:</h6>
              <div className="fw-semibold">{booking.roomName} (Room #{booking.roomNumber})</div>
              <div className="text-muted small">Check-in: {booking.checkIn} (from 15:00)</div>
              <div className="text-muted small">Check-out: {booking.checkOut} (until 11:00)</div>
              <div className="text-muted small">Duration: {booking.nights} Night(s), {booking.guests} Guest(s)</div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="table-responsive mb-4">
            <table className="table table-bordered mb-0" style={{ borderColor: 'var(--border-color)' }}>
              <thead style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <tr>
                  <th className="small text-muted py-2">Description</th>
                  <th className="small text-muted py-2 text-center">Qty / Nights</th>
                  <th className="small text-muted py-2 text-end">Rate</th>
                  <th className="small text-muted py-2 text-end">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Room Accommodation</strong>
                    <div className="text-muted small">{booking.roomName} - Daily rate accommodation</div>
                  </td>
                  <td className="text-center">{booking.nights} night(s)</td>
                  <td className="text-end">${Math.round(roomCharge / (booking.nights || 1))}</td>
                  <td className="text-end">${roomCharge}</td>
                </tr>

                {booking.addOns && booking.addOns.map((addon, idx) => (
                  <tr key={idx}>
                    <td>
                      <strong>Concierge Extra: {addon.name}</strong>
                      <div className="text-muted small">Pre-booked personalized luxury guest service</div>
                    </td>
                    <td className="text-center">1</td>
                    <td className="text-end">${addon.price}</td>
                    <td className="text-end">${addon.price}</td>
                  </tr>
                ))}

                <tr>
                  <td>
                    <strong>Luxury Resort & Wellness Amenities Fee</strong>
                    <div className="text-muted small">Private beach, spa hydro-pool, high-speed Wi-Fi 6</div>
                  </td>
                  <td className="text-center">{booking.nights} night(s)</td>
                  <td className="text-end">${config.resortFeePerNight || 35}</td>
                  <td className="text-end">${resortFee}</td>
                </tr>

                <tr>
                  <td>
                    <strong>Government Tourism Tax & City Surcharge ({config.taxRatePercent || 12}%)</strong>
                  </td>
                  <td className="text-center">-</td>
                  <td className="text-end">-</td>
                  <td className="text-end">${taxes}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan="3" className="text-end py-2">Total Charges:</th>
                  <th className="text-end py-2 fs-5 text-warning">
                    ${booking.totalAmount || (roomCharge + resortFee + taxes + addOnsTotal)}
                  </th>
                </tr>
                <tr>
                  <th colSpan="3" className="text-end py-1 text-muted small">Payment Received ({booking.paymentMethod}):</th>
                  <th className="text-end py-1 text-success small">
                    -${booking.totalAmount || (roomCharge + resortFee + taxes + addOnsTotal)}
                  </th>
                </tr>
                <tr>
                  <th colSpan="3" className="text-end py-1 fw-bold">Balance Remaining:</th>
                  <th className="text-end py-1 fw-bold text-success">$0.00</th>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center text-muted small pt-2">
            <div className="d-flex align-items-center gap-1">
              <ShieldCheck size={16} className="text-success" />
              <span>Verified Electronic Folio &bull; Encrypted Audit ID: {booking.id}-TXN</span>
            </div>
            <div>Thank you for choosing HotelPro Grand Palace!</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;

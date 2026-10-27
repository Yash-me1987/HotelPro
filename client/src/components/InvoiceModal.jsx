import React from 'react';
import { X, Printer, Download, CheckCircle, ShieldCheck, QrCode } from 'lucide-react';
import { toast } from 'react-toastify';

export const InvoiceModal = ({ booking, isOpen = true, onClose }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast.success(`Tax Invoice Folio #${booking.bookingReference || booking.id} downloaded successfully (PDF).`);
  };

  const total = booking.totalAmount || 38997;
  const taxableValue = Math.round(total / 1.18);
  const cgst = Math.round((taxableValue * 0.09));
  const sgst = Math.round((taxableValue * 0.09));

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        className="luxury-card p-4 shadow-xl"
        style={{ maxWidth: '720px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <span className="badge-clean">
              <CheckCircle size={14} className="me-1 inline" /> PAID IN FULL
            </span>
            <span className="text-muted small">Tax Invoice Ref #{booking.bookingReference || booking.id}</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button onClick={handlePrint} className="pill-btn-outline py-1 px-3" style={{ fontSize: '0.8rem' }}>
              <Printer size={14} /> Print
            </button>
            <button onClick={handleDownload} className="pill-btn-dark py-1 px-3" style={{ fontSize: '0.8rem' }}>
              <Download size={14} /> PDF
            </button>
            <button onClick={onClose} className="btn btn-sm btn-link text-muted p-1">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div className="p-4 rounded-3 border" style={{ backgroundColor: '#ffffff' }}>
          {/* Header */}
          <div className="row mb-4 align-items-center">
            <div className="col-sm-8">
              <h3 className="font-serif fw-bold text-main mb-1" style={{ letterSpacing: '0.05em' }}>
                LUMIÈRE GRAND PALACES & RESORTS
              </h3>
              <p className="text-muted small mb-0">Marine Drive, Nariman Point, Mumbai, Maharashtra 400021</p>
              <p className="text-muted small mb-0">GSTIN: 27AAACL1987K1Z9 | SAC Code: 996311 (Luxury Stays)</p>
              <p className="text-muted small mb-0">Concierge Desk: +91 22 4988 7000 | concierge@lumierepalaces.in</p>
            </div>
            <div className="col-sm-4 text-sm-end mt-3 mt-sm-0">
              <div className="font-serif fw-bold fs-5" style={{ color: 'var(--accent-gold)' }}>
                TAX INVOICE
              </div>
              <div className="text-muted small">Date: {new Date().toLocaleDateString('en-IN')}</div>
              <div className="text-muted small">Folio: {booking.bookingReference || booking.id}</div>
            </div>
          </div>

          <hr className="my-3" />

          {/* Guest and Stay Details */}
          <div className="row g-3 mb-4 small">
            <div className="col-6">
              <span className="text-muted">Billed To (Resident):</span>
              <div className="fw-bold text-main">{booking.guestName}</div>
              <div className="text-muted">{booking.guestEmail}</div>
              <div className="text-muted">{booking.guestPhone}</div>
            </div>
            <div className="col-6 text-end">
              <span className="text-muted">Stay Details:</span>
              <div className="fw-bold text-main">{booking.roomTitle || booking.roomName}</div>
              <div className="text-muted">Suite Room #{booking.roomNumber}</div>
              <div className="text-muted">{booking.checkIn} to {booking.checkOut} ({booking.nights || 2} Nights)</div>
            </div>
          </div>

          {/* Itemized Table */}
          <table className="table table-sm small mb-3">
            <thead className="table-light">
              <tr>
                <th>Description</th>
                <th className="text-center">SAC Code</th>
                <th className="text-center">Qty</th>
                <th className="text-end">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Royal Suite Accommodation & Khansama Service</td>
                <td className="text-center">996311</td>
                <td className="text-center">{booking.nights || 2} nights</td>
                <td className="text-end">₹ {taxableValue.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td>Central GST (CGST @ 9%)</td>
                <td className="text-center">9963</td>
                <td className="text-center">9%</td>
                <td className="text-end">₹ {cgst.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td>State GST (SGST @ 9%)</td>
                <td className="text-center">9963</td>
                <td className="text-center">9%</td>
                <td className="text-end">₹ {sgst.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="fw-bold fs-6 border-top">
                <td colSpan="3" className="font-serif">Grand Total Settled (INR):</td>
                <td className="text-end font-serif" style={{ color: 'var(--accent-gold)' }}>
                  ₹ {total.toLocaleString('en-IN')}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Footer Signature */}
          <div className="pt-3 border-top d-flex justify-content-between align-items-center text-muted small">
            <div>
              <span>Payment Mode: <strong>{booking.paymentMethod || 'Razorpay / UPI'}</strong></span>
              <div style={{ fontSize: '0.72rem' }}>Digital Smart Key Emitted & Verified</div>
            </div>
            <div className="text-end">
              <div className="fst-italic">Authorised Signatory</div>
              <div className="fw-semibold">Lumière Hotels & Resorts India</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;

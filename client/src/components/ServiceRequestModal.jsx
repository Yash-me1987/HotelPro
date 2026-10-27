import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addServiceRequest } from '../redux/slices/servicesSlice';
import { addNotification } from '../redux/slices/notificationsSlice';
import { X, Utensils, Sparkles, Wrench, Compass, Send } from 'lucide-react';
import { toast } from 'react-toastify';

export const ServiceRequestModal = ({ isOpen = true, onClose, roomNumber = 'SU-402', guestName = 'Aisha Sharma' }) => {
  const dispatch = useDispatch();
  const [serviceType, setServiceType] = useState('Room Service');
  const [details, setDetails] = useState('Royal Mewari Thali for two and freshly brewed Kashmiri Kahwa at 8:30 PM.');
  const [priority, setPriority] = useState('High');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!details) {
      toast.error('Please specify request details.');
      return;
    }

    dispatch(
      addServiceRequest({
        roomNumber,
        guestName,
        serviceType,
        details,
        priority,
        assignedTo: serviceType === 'Room Service' ? 'Chef Sanjeev Rawat' : 'Rajesh Verma',
      })
    );

    dispatch(
      addNotification({
        title: `Palace Service Request: ${serviceType}`,
        message: `${serviceType} request for Suite #${roomNumber} submitted to concierge.`,
        category: 'service',
      })
    );

    toast.success(`Royal service request submitted for Suite #${roomNumber}. Our Khansama team is preparing it.`);
    onClose();
  };

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
        zIndex: 1060,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        className="luxury-card p-4 shadow-xl"
        style={{ maxWidth: '540px', width: '100%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
          <div>
            <div className="eyebrow-kicker mb-1" style={{ fontSize: '0.72rem' }}>CONCIERGE & KHANSAMA DISPATCH</div>
            <h4 className="font-serif fw-bold text-main fs-5 m-0">Palace Resident Service</h4>
            <span className="text-muted small">Suite #{roomNumber} &bull; {guestName}</span>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-link text-muted p-1">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Service Category Buttons */}
          <div className="mb-3">
            <label className="form-label small fw-semibold text-muted">Service Category</label>
            <div className="row g-2">
              {[
                { name: 'Room Service', icon: <Utensils size={15} /> },
                { name: 'Housekeeping', icon: <Sparkles size={15} /> },
                { name: 'Concierge', icon: <Compass size={15} /> },
                { name: 'Maintenance', icon: <Wrench size={15} /> },
              ].map((cat) => (
                <div key={cat.name} className="col-6">
                  <button
                    type="button"
                    onClick={() => setServiceType(cat.name)}
                    style={{
                      backgroundColor: serviceType === cat.name ? 'var(--btn-dark)' : 'var(--bg-surface-subtle)',
                      color: serviceType === cat.name ? '#ffffff' : 'var(--text-main)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '12px',
                      padding: '10px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    {cat.icon}
                    <span>{cat.name}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="mb-3">
            <label className="form-label small fw-semibold text-muted">Request Details</label>
            <textarea
              rows={3}
              className="form-control rounded-3"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              style={{ backgroundColor: 'var(--bg-surface-subtle)', borderColor: 'var(--border-subtle)' }}
            />
          </div>

          {/* Priority */}
          <div className="mb-4">
            <label className="form-label small fw-semibold text-muted">Urgency</label>
            <div className="d-flex gap-2">
              {['Normal', 'High', 'Urgent'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  style={{
                    backgroundColor: priority === p ? 'var(--accent-gold)' : 'var(--bg-surface-subtle)',
                    color: priority === p ? '#ffffff' : 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '9999px',
                    padding: '5px 16px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="pill-btn-outline py-2 px-3"
            >
              Cancel
            </button>
            <button type="submit" className="pill-btn-dark py-2 px-4">
              <Send size={15} /> Dispatch to Front Desk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceRequestModal;

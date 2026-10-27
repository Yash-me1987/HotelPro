import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addServiceRequest } from '../redux/slices/servicesSlice';
import { addNotification } from '../redux/slices/notificationsSlice';
import { X, Utensils, Sparkles, Wrench, Compass, Send } from 'lucide-react';
import { toast } from 'react-toastify';

export const ServiceRequestModal = ({ isOpen, onClose, roomNumber = '202', guestName = 'Lord Johnathan Vance' }) => {
  const dispatch = useDispatch();
  const [serviceType, setServiceType] = useState('Room Service');
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [priority, setPriority] = useState('Normal');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !details) {
      toast.error('Please specify the service request title and details.');
      return;
    }

    dispatch(addServiceRequest({
      roomNumber,
      guestName,
      type: serviceType,
      title,
      details,
      priority,
      assignedTo: 'Dispatch Desk'
    }));

    dispatch(addNotification({
      title: `Service Request Placed: ${serviceType}`,
      message: `${title} for Room #${roomNumber} has been submitted to front desk.`,
      type: 'service'
    }));

    toast.success(`Service request submitted for Room #${roomNumber}. Our team is attending to it.`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-luxury p-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
          <div>
            <h4 className="font-serif text-warning mb-1">Guest Service Request</h4>
            <p className="text-muted small mb-0">Room #{roomNumber} &bull; {guestName}</p>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-link text-muted p-1">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-muted">Category</label>
            <div className="row g-2">
              {[
                { label: 'Room Service', icon: <Utensils size={14} /> },
                { label: 'Housekeeping', icon: <Sparkles size={14} /> },
                { label: 'Maintenance', icon: <Wrench size={14} /> },
                { label: 'Concierge', icon: <Compass size={14} /> }
              ].map((item) => (
                <div className="col-6 col-sm-3" key={item.label}>
                  <button
                    type="button"
                    className={`btn btn-sm w-100 d-flex align-items-center justify-content-center gap-1 ${
                      serviceType === item.label ? 'btn-gold' : 'btn-secondary-custom'
                    }`}
                    onClick={() => setServiceType(item.label)}
                  >
                    {item.icon}
                    <span style={{ fontSize: '0.8rem' }}>{item.label}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-muted">Request Title</label>
            <input
              type="text"
              className="input-luxury"
              placeholder={
                serviceType === 'Room Service'
                  ? 'e.g. Late Night Club Sandwich & Sparkling Water'
                  : serviceType === 'Housekeeping'
                  ? 'e.g. Extra Egyptian Cotton Towels & Bathrobe'
                  : 'e.g. Air Conditioning temperature fine-tuning'
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-muted">Specific Instructions / Timing</label>
            <textarea
              className="input-luxury"
              rows={3}
              placeholder="Provide any dietary preferences, delivery time, or specific instructions..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold text-muted">Urgency / Priority</label>
            <select
              className="input-luxury"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="Normal">Normal (within 30 mins)</option>
              <option value="High">High / Prompt (within 15 mins)</option>
              <option value="Immediate">Immediate Attention (urgent)</option>
            </select>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button type="button" onClick={onClose} className="btn btn-secondary-custom">
              Cancel
            </button>
            <button type="submit" className="btn btn-gold">
              <Send size={15} /> Dispatch Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceRequestModal;

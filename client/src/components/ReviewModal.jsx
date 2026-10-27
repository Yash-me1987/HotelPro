import React, { useState } from 'react';
import { X, Star, Upload, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

export const ReviewModal = ({ booking, isOpen, onClose }) => {
  const [overallRating, setOverallRating] = useState(5);
  const [cleanliness, setCleanliness] = useState(5);
  const [service, setService] = useState(5);
  const [comfort, setComfort] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !booking) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Thank you! Your verified review and rating have been published.');
      onClose();
    }, 600);
  };

  const renderStars = (current, setRating) => {
    return (
      <div className="d-flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={22}
            className={`cursor-pointer ${
              star <= current ? 'text-warning fill-warning' : 'text-muted'
            }`}
            style={{ cursor: 'pointer', fill: star <= current ? '#f59e0b' : 'none' }}
            onClick={() => setRating && setRating(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-luxury p-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
          <div>
            <h4 className="font-serif text-warning mb-1">Write a Review</h4>
            <p className="text-muted small mb-0">Share your experience for {booking.roomName}</p>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-link text-muted p-1">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4 text-center p-3 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <label className="form-label fw-bold d-block mb-2">Overall Experience Rating</label>
            <div className="d-flex justify-content-center">
              {renderStars(overallRating, setOverallRating)}
            </div>
            <span className="text-warning small fw-semibold mt-1 d-block">
              {overallRating === 5 ? 'Exceptional 5-Star Stay' : overallRating === 4 ? 'Very Good' : 'Average'}
            </span>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-sm-4">
              <label className="form-label small text-muted">Cleanliness</label>
              {renderStars(cleanliness, setCleanliness)}
            </div>
            <div className="col-sm-4">
              <label className="form-label small text-muted">Staff Hospitality</label>
              {renderStars(service, setService)}
            </div>
            <div className="col-sm-4">
              <label className="form-label small text-muted">Room Comfort</label>
              {renderStars(comfort, setComfort)}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-muted">Detailed Guest Feedback</label>
            <textarea
              className="input-luxury"
              rows={4}
              placeholder="What did you love most about your stay? (e.g. bed comfort, terrace view, concierge service...)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold text-muted">Optional: Upload Photos of Your Stay</label>
            <div
              className="p-3 text-center rounded border border-dashed text-muted cursor-pointer"
              style={{ backgroundColor: 'var(--bg-secondary)', cursor: 'pointer' }}
            >
              <Upload size={20} className="mb-1" />
              <div className="small">Click to select photos (Simulated upload)</div>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button type="button" onClick={onClose} className="btn btn-secondary-custom">
              Cancel
            </button>
            <button type="submit" className="btn btn-gold" disabled={isSubmitting}>
              {isSubmitting ? 'Publishing...' : 'Publish Verified Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;

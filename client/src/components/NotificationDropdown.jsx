import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { markAsRead, markAllAsRead } from '../redux/slices/notificationsSlice';
import { Bell, CheckCheck, Clock, CheckCircle2, AlertCircle, CreditCard, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotificationDropdown = ({ onClose }) => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.notifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case 'booking':
        return <CheckCircle2 size={16} className="text-success" />;
      case 'payment':
        return <CreditCard size={16} className="text-warning" />;
      case 'service':
        return <Sparkles size={16} className="text-info" />;
      default:
        return <AlertCircle size={16} className="text-primary" />;
    }
  };

  return (
    <div
      className="card-luxury p-3 position-absolute end-0 mt-2 shadow-xl"
      style={{
        width: '340px',
        maxWidth: '90vw',
        zIndex: 1060,
        backgroundColor: 'var(--bg-surface)'
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
        <div className="d-flex align-items-center gap-2">
          <Bell size={18} className="text-warning" />
          <h6 className="mb-0 fw-bold">Notifications</h6>
          {unreadCount > 0 && (
            <span className="badge bg-warning text-dark rounded-pill">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => dispatch(markAllAsRead())}
            className="btn btn-sm btn-link text-decoration-none p-0 text-muted d-flex align-items-center gap-1"
            style={{ fontSize: '0.8rem' }}
          >
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <div className="text-center py-4 text-muted">
            <Bell size={28} className="opacity-50 mb-2" />
            <p className="small mb-0">No notifications at this time.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => dispatch(markAsRead(n.id))}
              className={`p-2 mb-2 rounded cursor-pointer transition-fast ${
                !n.read ? 'border-start border-3 border-warning' : 'opacity-75'
              }`}
              style={{
                backgroundColor: !n.read ? 'var(--bg-secondary)' : 'transparent',
                cursor: 'pointer'
              }}
            >
              <div className="d-flex align-items-start gap-2">
                <div className="mt-1">{getIcon(n.type)}</div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between">
                    <span className="fw-semibold small">{n.title}</span>
                    <span className="text-muted d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                      <Clock size={10} /> {n.time}
                    </span>
                  </div>
                  <p className="text-muted mb-0" style={{ fontSize: '0.785rem', lineHeight: '1.3' }}>
                    {n.message}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-top pt-2 mt-2 text-center">
        <Link
          to="/notifications"
          onClick={onClose}
          className="text-decoration-none small text-warning fw-semibold"
        >
          View All Notifications &rarr;
        </Link>
      </div>
    </div>
  );
};

export default NotificationDropdown;

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  markAsRead,
  markAllAsRead,
  clearNotifications
} from '../redux/slices/notificationsSlice';
import {
  Bell,
  CheckCircle2,
  Clock,
  Sparkles,
  CreditCard,
  AlertCircle,
  CheckCheck,
  Trash2,
  Filter
} from 'lucide-react';
import { toast } from 'react-toastify';

export const NotificationsPage = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.notifications);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'booking' | 'service' | 'payment' | 'system'

  const filtered = notifications.filter(
    (n) => filterType === 'all' || n.type === filterType
  );

  const getIcon = (type) => {
    switch (type) {
      case 'booking':
        return <CheckCircle2 size={18} className="text-success" />;
      case 'payment':
        return <CreditCard size={18} className="text-warning" />;
      case 'service':
        return <Sparkles size={18} className="text-info" />;
      default:
        return <AlertCircle size={18} className="text-primary" />;
    }
  };

  return (
    <div className="notifications-page py-5" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container py-2" style={{ maxWidth: '800px' }}>
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <Bell size={20} className="text-warning" />
              <span className="text-warning small text-uppercase fw-bold">Live Communications</span>
            </div>
            <h2 className="font-serif fw-bold mb-0">Notifications Center</h2>
          </div>

          <div className="d-flex gap-2">
            <button
              onClick={() => {
                dispatch(markAllAsRead());
                toast.success('All notifications marked as read.');
              }}
              className="btn btn-sm btn-secondary-custom d-flex align-items-center gap-1"
            >
              <CheckCheck size={14} /> Mark All Read
            </button>
            <button
              onClick={() => {
                if (confirm('Clear all notifications?')) {
                  dispatch(clearNotifications());
                  toast.info('Notifications cleared.');
                }
              }}
              className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
            >
              <Trash2 size={14} /> Clear
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="d-flex gap-2 mb-4 overflow-x-auto pb-2">
          {['all', 'booking', 'service', 'payment', 'system'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`btn btn-sm rounded-pill px-3 py-1 text-capitalize ${
                filterType === type ? 'btn-gold' : 'btn-secondary-custom'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="card-luxury p-3">
          {filtered.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <Bell size={40} className="opacity-50 mb-2" />
              <h5>No Notifications Found</h5>
              <p className="small mb-0">You are all caught up with your latest hotel activities.</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-2">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => dispatch(markAsRead(item.id))}
                  className={`p-3 rounded border transition-fast cursor-pointer ${
                    !item.read ? 'border-warning bg-warning-subtle' : ''
                  }`}
                  style={{
                    backgroundColor: !item.read ? 'var(--gold-50)' : 'var(--bg-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  <div className="d-flex align-items-start gap-3">
                    <div className="mt-1">{getIcon(item.type)}</div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="fw-bold small">{item.title}</span>
                        <span className="text-muted small d-flex align-items-center gap-1">
                          <Clock size={12} /> {item.time}
                        </span>
                      </div>
                      <p className="text-muted small mb-0">{item.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;

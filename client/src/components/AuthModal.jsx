import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, switchRole } from '../redux/slices/authSlice';
import { X, Lock, Mail, User, Shield, KeyRound, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';

export const AuthModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState('guest');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please complete all required fields.');
      return;
    }

    dispatch(login({ email, name: name || email.split('@')[0], role: selectedRole }));
    toast.success(`Welcome to HotelPro, ${name || email.split('@')[0]}!`);
    onClose();
  };

  const handleQuickDemo = (role) => {
    dispatch(switchRole(role));
    toast.success(`Switched active session to ${role.toUpperCase()} mode.`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-luxury p-4" onClick={(e) => e.stopPropagation()}>
        <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
          <div>
            <h4 className="font-serif mb-0 text-warning">
              {isRegister ? 'Join HotelPro Luxury Club' : 'Sign In to HotelPro'}
            </h4>
            <p className="text-muted small mb-0">Experience unrivaled 5-star hospitality</p>
          </div>
          <button className="btn btn-sm btn-link text-muted p-1" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Quick Demo Login Preset Buttons */}
        <div className="p-3 mb-4 rounded" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px dashed var(--gold-600)' }}>
          <div className="d-flex align-items-center gap-1 mb-2 text-warning fw-semibold small">
            <Sparkles size={14} /> One-Click Demo Personas (Instant Access)
          </div>
          <div className="row g-2">
            <div className="col-4">
              <button
                type="button"
                className="btn btn-sm btn-outline-warning w-100 py-1"
                onClick={() => handleQuickDemo('guest')}
                style={{ fontSize: '0.75rem' }}
              >
                <User size={12} className="me-1" />
                VIP Guest
              </button>
            </div>
            <div className="col-4">
              <button
                type="button"
                className="btn btn-sm btn-outline-info w-100 py-1"
                onClick={() => handleQuickDemo('staff')}
                style={{ fontSize: '0.75rem' }}
              >
                <KeyRound size={12} className="me-1" />
                Hotel Staff
              </button>
            </div>
            <div className="col-4">
              <button
                type="button"
                className="btn btn-sm btn-outline-light w-100 py-1"
                onClick={() => handleQuickDemo('admin')}
                style={{ fontSize: '0.75rem' }}
              >
                <Shield size={12} className="me-1" />
                Sys Admin
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted">Full Legal Name</label>
              <div className="position-relative">
                <input
                  type="text"
                  className="input-luxury ps-5"
                  placeholder="e.g. Johnathan Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isRegister}
                />
                <User size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              </div>
            </div>
          )}

          <div className="mb-3">
            <label className="form-label small fw-semibold text-muted">Email Address</label>
            <div className="position-relative">
              <input
                type="email"
                className="input-luxury ps-5"
                placeholder="name@luxurytravel.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-muted">Password</label>
            <div className="position-relative">
              <input
                type="password"
                className="input-luxury ps-5"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
            </div>
          </div>

          {isRegister && (
            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted">Account Role</label>
              <select
                className="input-luxury"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="guest">Guest / Member</option>
                <option value="staff">Hotel Staff / Operations</option>
                <option value="admin">Administrator / Manager</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn btn-gold w-100 py-2 mt-2">
            {isRegister ? 'Complete Registration' : 'Authenticate & Sign In'}
          </button>
        </form>

        <div className="text-center mt-3 pt-2 border-top">
          <button
            type="button"
            className="btn btn-link text-decoration-none small text-muted"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister
              ? 'Already have an account? Sign in here'
              : "Don't have an account yet? Register for exclusive member rates"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

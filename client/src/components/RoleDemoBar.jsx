import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { switchRole } from '../redux/slices/authSlice';
import { UserCheck, ShieldCheck, KeyRound, Sparkles } from 'lucide-react';

export const RoleDemoBar = () => {
  const dispatch = useDispatch();
  const { role, currentUser } = useSelector((state) => state.auth);

  return (
    <div className="role-bar">
      <div className="d-flex align-items-center gap-2">
        <Sparkles size={15} className="text-warning pulse-subtle" />
        <span className="fw-semibold">Role-Based Access Demo:</span>
        <span className="text-light opacity-75 d-none d-md-inline">
          Switch roles to test dedicated modules (Guest, Staff, Admin)
        </span>
      </div>

      <div className="d-flex align-items-center gap-2">
        <button
          onClick={() => dispatch(switchRole('guest'))}
          className={`role-pill ${role === 'guest' ? 'active' : ''}`}
          title="Browse, Book, View Folio, Request Services"
        >
          <UserCheck size={13} className="me-1 inline" />
          Guest View
        </button>

        <button
          onClick={() => dispatch(switchRole('staff'))}
          className={`role-pill ${role === 'staff' ? 'active' : ''}`}
          title="Check-ins, Check-outs, Room Clean Status, Housekeeping"
        >
          <KeyRound size={13} className="me-1 inline" />
          Staff Operations
        </button>

        <button
          onClick={() => dispatch(switchRole('admin'))}
          className={`role-pill ${role === 'admin' ? 'active' : ''}`}
          title="Executive KPIs, Reports, Pricing Rules, User Controls"
        >
          <ShieldCheck size={13} className="me-1 inline" />
          Admin & Management
        </button>

        {currentUser && (
          <span className="badge bg-dark border border-secondary text-light ms-2 d-none d-lg-inline">
            Active: {currentUser.name} ({role.toUpperCase()})
          </span>
        )}
      </div>
    </div>
  );
};

export default RoleDemoBar;

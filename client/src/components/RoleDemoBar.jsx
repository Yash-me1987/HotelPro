import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { switchRole } from '../redux/slices/authSlice';
import { UserCheck, ShieldCheck, KeyRound, Sparkles } from 'lucide-react';

export const RoleDemoBar = () => {
  const dispatch = useDispatch();
  const { role, currentUser } = useSelector((state) => state.auth);

  return (
    <div style={{
      backgroundColor: '#161616',
      color: '#e5e5e5',
      fontSize: '0.78rem',
      padding: '8px 24px',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      zIndex: 100,
    }}>
      <div className="d-flex align-items-center gap-2">
        <Sparkles size={13} style={{ color: 'var(--accent-gold)' }} />
        <span className="fw-semibold text-uppercase" style={{ letterSpacing: '0.08em', color: '#ffffff' }}>
          Role Simulation:
        </span>
        <span className="opacity-75 d-none d-md-inline" style={{ fontSize: '0.75rem', color: '#a3a3a3' }}>
          Switch persona to explore Indian Guest, Staff Terminal, or Admin Governance views
        </span>
      </div>

      <div className="d-flex align-items-center gap-2">
        <button
          onClick={() => dispatch(switchRole('guest'))}
          style={{
            backgroundColor: role === 'guest' ? 'var(--accent-gold)' : 'transparent',
            color: role === 'guest' ? '#ffffff' : '#d4d4d4',
            border: `1px solid ${role === 'guest' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.2)'}`,
            borderRadius: '9999px',
            padding: '4px 14px',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <UserCheck size={12} className="me-1 inline" />
          Guest View
        </button>

        <button
          onClick={() => dispatch(switchRole('staff'))}
          style={{
            backgroundColor: role === 'staff' ? 'var(--accent-gold)' : 'transparent',
            color: role === 'staff' ? '#ffffff' : '#d4d4d4',
            border: `1px solid ${role === 'staff' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.2)'}`,
            borderRadius: '9999px',
            padding: '4px 14px',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <KeyRound size={12} className="me-1 inline" />
          Staff Operations
        </button>

        <button
          onClick={() => dispatch(switchRole('admin'))}
          style={{
            backgroundColor: role === 'admin' ? 'var(--accent-gold)' : 'transparent',
            color: role === 'admin' ? '#ffffff' : '#d4d4d4',
            border: `1px solid ${role === 'admin' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.2)'}`,
            borderRadius: '9999px',
            padding: '4px 14px',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <ShieldCheck size={12} className="me-1 inline" />
          Admin & Analytics
        </button>
      </div>
    </div>
  );
};

export default RoleDemoBar;

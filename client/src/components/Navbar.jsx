import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import NotificationDropdown from './NotificationDropdown';
import AuthModal from './AuthModal';
import {
  Bell,
  Search,
  User,
  LogOut,
  Menu,
  X,
  Compass,
  CalendarCheck,
  ShieldCheck,
  Briefcase,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { toast } from 'react-toastify';

export const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isAuthenticated, role } = useSelector((state) => state.auth);
  const notifications = useSelector((state) => state.notifications.notifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const [showNotifications, setShowNotifications] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHomePage = location.pathname === '/';

  const handleLogout = () => {
    dispatch(logout());
    toast.info('You have safely signed out.');
    navigate('/');
  };

  return (
    <>
      <header
        style={{
          position: isHomePage ? 'relative' : 'sticky',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 50,
          backgroundColor: isHomePage ? 'transparent' : '#ffffff',
          marginBottom: isHomePage ? '-76px' : '0',
          borderBottom: isHomePage ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid var(--border-subtle)',
          boxShadow: isHomePage ? 'none' : '0 2px 10px rgba(0,0,0,0.04)',
          transition: 'all 0.3s ease',
        }}
        className="py-3 px-3 px-lg-4"
      >
        <div className="container-fluid d-flex align-items-center justify-content-between">
          {/* Brand Crest & Logo (Matching Reference "LUMIÈRE HOTELS & RESORTS") */}
          <Link to="/" className="d-flex flex-column text-decoration-none">
            <span
              className="font-serif fw-bold"
              style={{
                fontSize: '1.45rem',
                letterSpacing: '0.22em',
                color: isHomePage ? '#ffffff' : 'var(--text-main)',
                lineHeight: 1.1,
                textTransform: 'uppercase',
              }}
            >
              LUMIÈRE
            </span>
            <span
              style={{
                fontSize: '0.62rem',
                letterSpacing: '0.2em',
                color: isHomePage ? 'rgba(255,255,255,0.75)' : 'var(--text-muted)',
                textTransform: 'uppercase',
                fontWeight: 500,
                marginTop: '2px',
              }}
            >
              HOTELS & RESORTS · INDIA
            </span>
          </Link>

          {/* Center Navigation Links (Matching Reference: Home, Stays, Destinations, etc.) */}
          <nav className="d-none d-lg-flex align-items-center gap-4">
            <NavLink
              to="/"
              style={({ isActive }) => ({
                color: isHomePage ? '#ffffff' : isActive ? 'var(--text-main)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.9rem',
                letterSpacing: '0.02em',
                textDecoration: 'none',
                position: 'relative',
                paddingBottom: '4px',
                borderBottom: isActive ? `2px solid ${isHomePage ? '#ffffff' : 'var(--text-main)'}` : '2px solid transparent',
              })}
            >
              Home
            </NavLink>

            <NavLink
              to="/rooms"
              style={({ isActive }) => ({
                color: isHomePage ? '#ffffff' : isActive ? 'var(--text-main)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.9rem',
                letterSpacing: '0.02em',
                textDecoration: 'none',
                paddingBottom: '4px',
                borderBottom: isActive ? `2px solid ${isHomePage ? '#ffffff' : 'var(--text-main)'}` : '2px solid transparent',
              })}
            >
              Stays
            </NavLink>

            <a
              href="#destinations-section"
              onClick={(e) => {
                if (!isHomePage) {
                  return; // let router handle or standard nav
                }
                e.preventDefault();
                document.getElementById('destinations-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                color: isHomePage ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: 500,
                fontSize: '0.9rem',
                letterSpacing: '0.02em',
                textDecoration: 'none',
                paddingBottom: '4px',
                borderBottom: '2px solid transparent',
              }}
            >
              Destinations
            </a>

            <NavLink
              to="/guest-dashboard"
              style={({ isActive }) => ({
                color: isHomePage ? '#ffffff' : isActive ? 'var(--text-main)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.9rem',
                letterSpacing: '0.02em',
                textDecoration: 'none',
                paddingBottom: '4px',
                borderBottom: isActive ? `2px solid ${isHomePage ? '#ffffff' : 'var(--text-main)'}` : '2px solid transparent',
              })}
            >
              Guest Portal
            </NavLink>

            <NavLink
              to="/staff-dashboard"
              style={({ isActive }) => ({
                color: isHomePage ? '#ffffff' : isActive ? 'var(--text-main)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.9rem',
                letterSpacing: '0.02em',
                textDecoration: 'none',
                paddingBottom: '4px',
                borderBottom: isActive ? `2px solid ${isHomePage ? '#ffffff' : 'var(--text-main)'}` : '2px solid transparent',
              })}
            >
              Staff Terminal
            </NavLink>

            <NavLink
              to="/admin"
              style={({ isActive }) => ({
                color: isHomePage ? '#ffffff' : isActive ? 'var(--text-main)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.9rem',
                letterSpacing: '0.02em',
                textDecoration: 'none',
                paddingBottom: '4px',
                borderBottom: isActive ? `2px solid ${isHomePage ? '#ffffff' : 'var(--text-main)'}` : '2px solid transparent',
              })}
            >
              Admin Analytics
            </NavLink>
          </nav>

          {/* Right Action Tools (Matching Reference: Search, INR ▾, Sign In pill) */}
          <div className="d-flex align-items-center gap-3">
            {/* Quick Search Icon */}
            <Link
              to="/rooms"
              style={{
                color: isHomePage ? '#ffffff' : 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                padding: '8px',
                borderRadius: '50%',
                transition: 'all 0.2s ease',
              }}
              title="Search Stays & Destinations"
            >
              <Search size={18} />
            </Link>

            {/* Currency Selector: INR (₹) */}
            <div
              className="d-none d-sm-flex align-items-center gap-1"
              style={{
                fontSize: '0.82rem',
                fontWeight: 600,
                color: isHomePage ? '#ffffff' : 'var(--text-main)',
                padding: '4px 8px',
                cursor: 'pointer',
              }}
              title="Indian Rupee (INR) Default"
            >
              <span>INR ₹</span>
              <ChevronDown size={14} className="opacity-75" />
            </div>

            {/* Notifications Bell */}
            <div className="position-relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: isHomePage ? '#ffffff' : 'var(--text-main)',
                  padding: '8px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                }}
                title="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent-gold)',
                    }}
                  />
                )}
              </button>

              {showNotifications && (
                <NotificationDropdown onClose={() => setShowNotifications(false)} />
              )}
            </div>

            {/* Sign In Button or Profile Menu (Reference Exact Styling) */}
            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-2">
                <Link
                  to={role === 'admin' ? '/admin' : role === 'staff' ? '/staff-dashboard' : '/guest-dashboard'}
                  style={{
                    backgroundColor: isHomePage ? 'rgba(255,255,255,0.2)' : 'var(--bg-surface-subtle)',
                    backdropFilter: 'blur(8px)',
                    border: `1px solid ${isHomePage ? 'rgba(255,255,255,0.4)' : 'var(--border-subtle)'}`,
                    color: isHomePage ? '#ffffff' : 'var(--text-main)',
                    borderRadius: '9999px',
                    padding: '6px 16px',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textDecoration: 'none',
                  }}
                >
                  <User size={15} />
                  <span>{currentUser?.name?.split(' ')[0] || 'Profile'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: isHomePage ? '#ffffff' : 'var(--text-muted)',
                    padding: '6px',
                    cursor: 'pointer',
                  }}
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                style={{
                  backgroundColor: isHomePage ? 'rgba(0, 0, 0, 0.4)' : '#ffffff',
                  backdropFilter: 'blur(8px)',
                  color: isHomePage ? '#ffffff' : 'var(--text-main)',
                  border: `1px solid ${isHomePage ? 'rgba(255, 255, 255, 0.6)' : 'var(--border-medium)'}`,
                  borderRadius: '9999px',
                  padding: '8px 22px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = isHomePage ? 'rgba(255,255,255,0.2)' : '#f6f4f0';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = isHomePage ? 'rgba(0, 0, 0, 0.4)' : '#ffffff';
                }}
              >
                Sign In
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              className="d-lg-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: 'transparent',
                border: 'none',
                color: isHomePage ? '#ffffff' : 'var(--text-main)',
                padding: '6px',
                cursor: 'pointer',
              }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            className="d-lg-none mt-3 p-3 rounded-4 shadow-lg"
            style={{
              backgroundColor: '#ffffff',
              color: 'var(--text-main)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div className="d-flex flex-column gap-2">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="p-2 fw-semibold text-dark text-decoration-none">
                Home
              </Link>
              <Link to="/rooms" onClick={() => setMobileMenuOpen(false)} className="p-2 fw-semibold text-dark text-decoration-none">
                Stays & Palaces
              </Link>
              <Link to="/guest-dashboard" onClick={() => setMobileMenuOpen(false)} className="p-2 fw-semibold text-dark text-decoration-none">
                Guest Portal
              </Link>
              <Link to="/staff-dashboard" onClick={() => setMobileMenuOpen(false)} className="p-2 fw-semibold text-dark text-decoration-none">
                Staff Operations
              </Link>
              <Link to="/hotel-management" onClick={() => setMobileMenuOpen(false)} className="p-2 fw-semibold text-dark text-decoration-none">
                Hotel Inventory
              </Link>
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="p-2 fw-semibold text-dark text-decoration-none">
                Admin Analytics
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
};

export default Navbar;

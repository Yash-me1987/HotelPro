import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/slices/themeSlice';
import { logout } from '../redux/slices/authSlice';
import NotificationDropdown from './NotificationDropdown';
import AuthModal from './AuthModal';
import {
  Crown,
  Bell,
  Sun,
  Moon,
  User,
  LogOut,
  Menu,
  X,
  Compass,
  CalendarCheck,
  ShieldCheck,
  Briefcase,
  Layers
} from 'lucide-react';
import { toast } from 'react-toastify';

export const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, role } = useSelector((state) => state.auth);
  const themeMode = useSelector((state) => state.theme.mode);
  const notifications = useSelector((state) => state.notifications.notifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const [showNotifications, setShowNotifications] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.info('You have safely signed out of HotelPro.');
    navigate('/');
  };

  return (
    <>
      <nav className="navbar-luxury px-3 px-lg-4 py-2">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          {/* Brand Logo */}
          <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
            <div
              className="d-flex align-items-center justify-content-center rounded-3 shadow-sm"
              style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #556b2f 0%, #283618 100%)',
                border: '1.5px solid var(--yellow-200)',
                color: '#fef08a'
              }}
            >
              <Crown size={22} />
            </div>
            <div>
              <span className="font-serif fs-4 fw-bold text-main" style={{ letterSpacing: '-0.03em' }}>
                HOTEL<span className="text-warning">PRO</span>
              </span>
              <span className="d-block text-muted" style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '-4px' }}>
                Luxury Grand Palace
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="d-none d-lg-flex align-items-center gap-1">
            <NavLink to="/rooms" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
              <Compass size={16} />
              Suites & Rooms
            </NavLink>

            <NavLink to="/guest-dashboard" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
              <CalendarCheck size={16} />
              Guest Portal
            </NavLink>

            <NavLink to="/staff-dashboard" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
              <Briefcase size={16} />
              Staff Operations
            </NavLink>

            <NavLink to="/hotel-management" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
              <Layers size={16} />
              Hotel Management
            </NavLink>

            <NavLink to="/admin" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
              <ShieldCheck size={16} />
              Admin
            </NavLink>
          </div>

          {/* Right Action Tools */}
          <div className="d-flex align-items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="btn btn-sm btn-secondary-custom rounded-circle p-2"
              title={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} mode`}
              style={{ width: '38px', height: '38px' }}
            >
              {themeMode === 'dark' ? <Sun size={17} className="text-warning" /> : <Moon size={17} />}
            </button>

            {/* Notifications Dropdown Toggle */}
            <div className="position-relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="btn btn-sm btn-secondary-custom rounded-circle p-2 position-relative"
                title="Notifications"
                style={{ width: '38px', height: '38px' }}
              >
                <Bell size={17} />
                {unreadCount > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: '0.65rem' }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <NotificationDropdown onClose={() => setShowNotifications(false)} />
              )}
            </div>

            {/* Auth / Profile */}
            {isAuthenticated && currentUser ? (
              <div className="d-none d-sm-flex align-items-center gap-2 ps-2 border-start">
                <Link
                  to={role === 'guest' ? '/guest-dashboard' : role === 'staff' ? '/staff-dashboard' : '/admin'}
                  className="d-flex align-items-center gap-2 text-decoration-none text-main"
                  title="View Profile Dashboard"
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                    style={{
                      width: '36px',
                      height: '36px',
                      backgroundColor: 'var(--gold-100)',
                      color: 'var(--gold-700)',
                      fontSize: '0.85rem'
                    }}
                  >
                    {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                  </div>
                  <div className="d-none d-xl-block text-start">
                    <div className="small fw-bold lh-1">{currentUser.name}</div>
                    <span className="badge bg-secondary-subtle text-muted" style={{ fontSize: '0.65rem' }}>
                      {role.toUpperCase()}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="btn btn-sm btn-link text-muted p-1"
                  title="Sign out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="btn btn-sm btn-secondary-custom d-none d-sm-inline-flex"
              >
                <User size={15} /> Sign In
              </button>
            )}

            {/* Primary Booking CTA */}
            <Link to="/rooms" className="btn btn-gold btn-sm d-none d-md-inline-flex">
              Book A Suite
            </Link>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn btn-sm btn-secondary-custom d-lg-none p-2"
              title="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="d-lg-none mt-2 pt-2 border-top">
            <div className="d-flex flex-column gap-1 pb-3">
              <NavLink
                to="/rooms"
                onClick={() => setMobileMenuOpen(false)}
                className="nav-link-custom py-2"
              >
                <Compass size={18} /> Suites & Luxury Rooms
              </NavLink>
              <NavLink
                to="/guest-dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="nav-link-custom py-2"
              >
                <CalendarCheck size={18} /> Guest Portal & Stays
              </NavLink>
              <NavLink
                to="/staff-dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="nav-link-custom py-2"
              >
                <Briefcase size={18} /> Staff Desk & Operations
              </NavLink>
              <NavLink
                to="/hotel-management"
                onClick={() => setMobileMenuOpen(false)}
                className="nav-link-custom py-2"
              >
                <Layers size={18} /> Hotel Management & Pricing
              </NavLink>
              <NavLink
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="nav-link-custom py-2"
              >
                <ShieldCheck size={18} /> Executive Admin & Analytics
              </NavLink>

              <div className="pt-2 mt-2 border-top d-flex gap-2">
                <Link
                  to="/rooms"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-gold w-100"
                >
                  Book A Suite
                </Link>
                {!isAuthenticated && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setShowAuthModal(true);
                    }}
                    className="btn btn-secondary-custom w-100"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};

export default Navbar;

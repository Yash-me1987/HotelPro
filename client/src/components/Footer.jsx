import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, MapPin, Phone, Mail, Award, ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-auto border-top" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
      {/* Top Credentials Banner */}
      <div className="py-3 border-bottom" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="row g-3 text-center text-md-start align-items-center">
            <div className="col-md-4 d-flex align-items-center justify-content-center justify-content-md-start gap-2">
              <Award size={20} className="text-warning" />
              <span className="small fw-semibold">Forbes 5-Star Luxury Hospitality Award 2026</span>
            </div>
            <div className="col-md-4 d-flex align-items-center justify-content-center gap-2">
              <ShieldCheck size={20} className="text-success" />
              <span className="small fw-semibold">100% Secure Encrypted Booking & Payment Guarantee</span>
            </div>
            <div className="col-md-4 d-flex align-items-center justify-content-center justify-content-md-end gap-2">
              <Crown size={20} className="text-warning" />
              <span className="small fw-semibold">Les Clefs d'Or World-Class Concierge Desk</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: '36px',
                    height: '36px',
                    background: 'linear-gradient(135deg, #556b2f 0%, #283618 100%)',
                    border: '1px solid var(--yellow-200)',
                    color: '#fef08a'
                  }}
                >
                  <Crown size={20} />
                </div>
                <h5 className="font-serif mb-0 fw-bold">HOTEL<span className="text-warning">PRO</span></h5>
              </div>
              <p className="text-muted small mb-3" style={{ maxWidth: '360px' }}>
                Your ultimate enterprise hotel management and booking solution. Seamless reservations, real-time availability tracking, guest services, housekeeping, and role-based staff operations.
              </p>
              <div className="text-muted small d-flex flex-column gap-1">
                <div className="d-flex align-items-center gap-2">
                  <MapPin size={15} className="text-warning flex-shrink-0" />
                  <span>740 Royal Ocean Boulevard, Côte d'Azur & Monaco Coast</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Phone size={15} className="text-warning flex-shrink-0" />
                  <span>+1 (800) 888-PRO-LUX / 24-Hour VIP Concierge</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Mail size={15} className="text-warning flex-shrink-0" />
                  <span>reservations@hotelpro.luxury</span>
                </div>
              </div>
            </div>

            <div className="col-6 col-md-3 col-lg-2">
              <h6 className="fw-bold text-uppercase small mb-3 text-warning">Experience</h6>
              <ul className="list-unstyled text-muted small d-flex flex-column gap-2 mb-0">
                <li><Link to="/rooms" className="text-muted text-decoration-none hover-gold">Presidential Suite</Link></li>
                <li><Link to="/rooms" className="text-muted text-decoration-none hover-gold">Ocean View Suites</Link></li>
                <li><Link to="/rooms" className="text-muted text-decoration-none hover-gold">Family Garden Villas</Link></li>
                <li><Link to="/rooms" className="text-muted text-decoration-none hover-gold">Executive Rooms</Link></li>
                <li><a href="#amenities" className="text-muted text-decoration-none hover-gold">Michelin Dining</a></li>
              </ul>
            </div>

            <div className="col-6 col-md-3 col-lg-2">
              <h6 className="fw-bold text-uppercase small mb-3 text-warning">Portals</h6>
              <ul className="list-unstyled text-muted small d-flex flex-column gap-2 mb-0">
                <li><Link to="/guest-dashboard" className="text-muted text-decoration-none hover-gold">Guest Stays & Folios</Link></li>
                <li><Link to="/staff-dashboard" className="text-muted text-decoration-none hover-gold">Staff Check-in/Out</Link></li>
                <li><Link to="/hotel-management" className="text-muted text-decoration-none hover-gold">Inventory & Pricing</Link></li>
                <li><Link to="/admin" className="text-muted text-decoration-none hover-gold">Executive Reports</Link></li>
                <li><Link to="/notifications" className="text-muted text-decoration-none hover-gold">Notifications Hub</Link></li>
              </ul>
            </div>

            <div className="col-md-6 col-lg-4">
              <h6 className="fw-bold text-uppercase small mb-3 text-warning">VIP Privilege Club</h6>
              <p className="text-muted small mb-3">
                Subscribe for private invitations to seasonal retreats, member-only rate reductions, and complimentary suite upgrades.
              </p>
              <div className="input-group">
                <input
                  type="email"
                  className="input-luxury rounded-start rounded-0"
                  placeholder="Enter your VIP email address..."
                />
                <button className="btn btn-gold rounded-end rounded-0" type="button">
                  Join Club
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="py-3 border-top text-center text-muted small" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
          <div>
            &copy; {new Date().getFullYear()} HotelPro Enterprise Hospitality Management System. All rights reserved.
          </div>
          <div className="d-flex align-items-center gap-3">
            <span>Built with MERN Stack, React & Redux Toolkit</span>
            <span>&bull;</span>
            <span className="text-warning d-flex align-items-center gap-1">
              Crafted for 5-Star Excellence <Heart size={14} fill="#f59e0b" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

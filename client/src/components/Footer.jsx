import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Award, ShieldCheck, Heart, ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#141414', color: '#a3a3a3', borderTop: '1px solid #262626' }} className="pt-5 pb-4">
      <div className="container pt-3">
        <div className="row g-5 mb-5">
          {/* Brand Column */}
          <div className="col-12 col-lg-4">
            <Link to="/" className="text-decoration-none d-inline-block mb-3">
              <span className="font-serif fw-bold text-white fs-4" style={{ letterSpacing: '0.22em', textTransform: 'uppercase' }}>
                LUMIÈRE
              </span>
              <span className="d-block" style={{ fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-gold)' }}>
                GRAND PALACES & RESORTS · INDIA
              </span>
            </Link>
            <p className="small text-secondary mb-4" style={{ lineHeight: 1.7, maxWidth: '340px' }}>
              A sanctuary of Indian heritage refinement, palatial architecture, Michelin-grade royal dining, and contactless digital guest elegance across Mumbai, Udaipur, Goa, Manali, and Jaipur.
            </p>
            <div className="d-flex align-items-center gap-2 small text-light">
              <Award size={16} style={{ color: 'var(--accent-gold)' }} />
              <span>Condé Nast Traveler Gold List 2026</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="text-white text-uppercase font-sans fw-bold mb-3" style={{ fontSize: '0.78rem', letterSpacing: '0.1em' }}>
              Destinations
            </h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li><Link to="/rooms" className="text-secondary text-decoration-none">Udaipur Palaces</Link></li>
              <li><Link to="/rooms" className="text-secondary text-decoration-none">Manali Cedar Spa</Link></li>
              <li><Link to="/rooms" className="text-secondary text-decoration-none">Mumbai Sky Villas</Link></li>
              <li><Link to="/rooms" className="text-secondary text-decoration-none">Goa Beachfront Villas</Link></li>
              <li><Link to="/rooms" className="text-secondary text-decoration-none">Jaipur Heritage Havelis</Link></li>
            </ul>
          </div>

          {/* Resident & Management Access */}
          <div className="col-6 col-md-3 col-lg-3">
            <h6 className="text-white text-uppercase font-sans fw-bold mb-3" style={{ fontSize: '0.78rem', letterSpacing: '0.1em' }}>
              Portals & Services
            </h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li><Link to="/guest-dashboard" className="text-secondary text-decoration-none">Guest Resident Portal & Key</Link></li>
              <li><Link to="/staff-dashboard" className="text-secondary text-decoration-none">Staff Operations Terminal</Link></li>
              <li><Link to="/hotel-management" className="text-secondary text-decoration-none">Hotel Inventory & Pricing</Link></li>
              <li><Link to="/admin" className="text-secondary text-decoration-none">Executive Admin Analytics</Link></li>
              <li><Link to="/notifications" className="text-secondary text-decoration-none">Live Alerts Hub</Link></li>
            </ul>
          </div>

          {/* Contact & Concierge Column */}
          <div className="col-12 col-md-6 col-lg-3">
            <h6 className="text-white text-uppercase font-sans fw-bold mb-3" style={{ fontSize: '0.78rem', letterSpacing: '0.1em' }}>
              24/7 Royal Concierge
            </h6>
            <div className="d-flex flex-column gap-3 small text-secondary">
              <div className="d-flex align-items-start gap-2">
                <MapPin size={16} className="mt-1 flex-shrink-0" style={{ color: 'var(--accent-gold)' }} />
                <span>Marine Drive, Nariman Point, Mumbai, Maharashtra 400021, India</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Phone size={15} style={{ color: 'var(--accent-gold)' }} />
                <span>+91 22 4988 7000 / +91 98201 54321</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Mail size={15} style={{ color: 'var(--accent-gold)' }} />
                <span>concierge@lumierepalaces.in</span>
              </div>
              <div className="pt-2">
                <span className="badge border" style={{ backgroundColor: '#1e1e1e', borderColor: '#333333', color: '#d4d4d4', fontSize: '0.7rem' }}>
                  GSTIN: 27AAACL1987K1Z9
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-top border-secondary border-opacity-25 d-flex flex-column flex-md-row align-items-center justify-content-between small text-secondary">
          <p className="mb-2 mb-md-0" style={{ fontSize: '0.78rem' }}>
            © {new Date().getFullYear()} Lumière Hotels & Resorts India. All rights reserved.
          </p>
          <div className="d-flex align-items-center gap-4" style={{ fontSize: '0.78rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Royalty</span>
            <span>Atithi Devo Bhava</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

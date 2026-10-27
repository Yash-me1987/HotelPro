import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addUser,
  toggleUserStatus,
  changeUserRole
} from '../redux/slices/authSlice';
import { updateHotelConfig, addAuditLog } from '../redux/slices/hotelSlice';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import {
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Users,
  CreditCard,
  FileSpreadsheet,
  Activity,
  Sliders,
  CheckCircle,
  AlertTriangle,
  Lock,
  Plus,
  Download,
  Calendar,
  Layers,
  Sparkles,
  X
} from 'lucide-react';
import { toast } from 'react-toastify';

export const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const { usersList, currentUser } = useSelector((state) => state.auth);
  const bookings = useSelector((state) => state.bookings.bookings);
  const rooms = useSelector((state) => state.rooms.rooms);
  const { config, auditLogs, staffList } = useSelector((state) => state.hotel);

  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'users' | 'bookings' | 'payments' | 'security' | 'config'
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // New User Form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('guest');

  // Config Form state
  const [hotelName, setHotelName] = useState(config.hotelName || 'Lumière Grand Palaces & Resorts · India');
  const [taxRate, setTaxRate] = useState(config.taxRatePercent || 18);
  const [resortFee, setResortFee] = useState(config.resortFeePerNight || 1500);
  const [currency, setCurrency] = useState('INR (₹)');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Financial Calculations in INR
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0) || 2845000;
  const activeBookingsCount = bookings.filter((b) => b.bookingStatus !== 'Cancelled').length || 12;
  const occupiedCount = rooms.filter((r) => r.status === 'Dirty' || !r.isAvailable).length || 3;
  const occupancyPercent = Math.round((occupiedCount / (rooms.length || 6)) * 100) || 75;
  const adr = Math.round(totalRevenue / (bookings.reduce((sum, b) => sum + (b.nights || 1), 0) || 1)) || 22500;
  const revpar = Math.round(adr * (occupancyPercent / 100)) || 16875;

  // Analytics Chart Data in INR
  const revenueMonthlyData = [
    { month: 'May', revenue: 4200000, bookings: 64 },
    { month: 'Jun', revenue: 6800000, bookings: 98 },
    { month: 'Jul', revenue: 9500000, bookings: 135 },
    { month: 'Aug', revenue: 11000000, bookings: 158 },
    { month: 'Sep', revenue: 7800000, bookings: 112 },
    { month: 'Oct', revenue: totalRevenue > 0 ? totalRevenue : 9240000, bookings: 129 },
  ];

  const categoryShareData = [
    { name: 'Presidential Suites', value: 38, color: '#b58d53' },
    { name: 'Ocean & Lake Villas', value: 28, color: '#9e7740' },
    { name: 'Executive Suites', value: 20, color: '#2b2b2b' },
    { name: 'Deluxe Havelis', value: 14, color: '#737373' },
  ];

  const occupancyTrendData = [
    { day: 'Mon', rate: 68 },
    { day: 'Tue', rate: 74 },
    { day: 'Wed', rate: 82 },
    { day: 'Thu', rate: 88 },
    { day: 'Fri', rate: 96 },
    { day: 'Sat', rate: 98 },
    { day: 'Sun', rate: 75 },
  ];

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) {
      toast.error('Please enter name and email.');
      return;
    }

    dispatch(
      addUser({
        name: newUserName,
        email: newUserEmail,
        role: newUserRole,
      })
    );

    dispatch(
      addAuditLog({
        user: `${currentUser?.name || 'Administrator'}`,
        action: 'User Account Created',
        details: `Created new account for ${newUserName} with role '${newUserRole}'.`,
      })
    );

    toast.success(`User ${newUserName} added successfully.`);
    setNewUserName('');
    setNewUserEmail('');
    setShowAddUserModal(false);
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    dispatch(
      updateHotelConfig({
        hotelName,
        taxRatePercent: Number(taxRate),
        resortFeePerNight: Number(resortFee),
        currency,
        maintenanceMode,
      })
    );
    toast.success('Platform Governance Configuration updated.');
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-body)' }} className="py-5">
      <div className="container py-2">
        {/* Admin Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <div className="eyebrow-kicker mb-1">EXECUTIVE GOVERNANCE & ANALYTICS</div>
            <h1 className="display-6 font-serif fw-bold text-main m-0">
              Lumière Indian Palaces Master Dashboard
            </h1>
            <p className="text-secondary small mt-1 mb-0">
              Real-time Indian Rupee (INR ₹) ledger, occupancy telemetry, user elevation, and GST compliance.
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="badge-clean">
              <CheckCircle size={14} className="me-1 inline" /> Ledger Synchronized
            </span>
            <span className="text-muted small">
              GSTIN: 27AAACL1987K1Z9
            </span>
          </div>
        </div>

        {/* Real-Time KPIs in INR */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-lg-3">
            <div className="stat-metric-card">
              <div>
                <div className="stat-metric-title">Gross Revenue (INR)</div>
                <div className="stat-metric-val" style={{ color: 'var(--accent-gold)' }}>
                  ₹ {(totalRevenue).toLocaleString('en-IN')}
                </div>
                <span className="text-muted small">Settled reservations</span>
              </div>
              <TrendingUp size={28} style={{ color: 'var(--accent-gold)' }} />
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="stat-metric-card">
              <div>
                <div className="stat-metric-title">Average Occupancy</div>
                <div className="stat-metric-val">{occupancyPercent}%</div>
                <span className="text-muted small">{occupiedCount} of {rooms.length} suites active</span>
              </div>
              <Activity size={28} style={{ color: 'var(--accent-gold)' }} />
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="stat-metric-card">
              <div>
                <div className="stat-metric-title">ADR (Average Daily Rate)</div>
                <div className="stat-metric-val">
                  ₹ {adr.toLocaleString('en-IN')}
                </div>
                <span className="text-muted small">Tariff per night</span>
              </div>
              <Sparkles size={28} style={{ color: 'var(--accent-gold)' }} />
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="stat-metric-card">
              <div>
                <div className="stat-metric-title">RevPAR</div>
                <div className="stat-metric-val">
                  ₹ {revpar.toLocaleString('en-IN')}
                </div>
                <span className="text-muted small">Revenue per available suite</span>
              </div>
              <ShieldCheck size={28} style={{ color: 'var(--accent-gold)' }} />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="d-flex gap-2 mb-4 border-bottom pb-2 overflow-x-auto">
          {[
            { id: 'analytics', label: 'Financial Analytics & Charts', icon: <TrendingUp size={15} /> },
            { id: 'users', label: `Users & Roles (${usersList.length})`, icon: <Users size={15} /> },
            { id: 'bookings', label: `Master Ledger (${bookings.length})`, icon: <Calendar size={15} /> },
            { id: 'security', label: `Audit Trail (${auditLogs.length})`, icon: <ShieldCheck size={15} /> },
            { id: 'config', label: 'GST & Governance Config', icon: <Sliders size={15} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                backgroundColor: activeTab === tab.id ? 'var(--btn-dark)' : 'transparent',
                color: activeTab === tab.id ? '#ffffff' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '9999px',
                padding: '8px 20px',
                fontSize: '0.86rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Analytics & Recharts */}
        {activeTab === 'analytics' && (
          <div className="row g-4 mb-4">
            {/* Monthly Revenue Area Chart */}
            <div className="col-lg-8">
              <div className="luxury-card p-4 h-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h4 className="font-serif fw-bold text-main m-0">Monthly Revenue Performance</h4>
                    <p className="text-muted small mb-0">Historical gross revenue trends (INR ₹)</p>
                  </div>
                  <span className="badge-clean">+28.4% vs Previous Quarter</span>
                </div>

                <div style={{ width: '100%', height: 320 }}>
                  <ResponsiveContainer>
                    <AreaChart data={revenueMonthlyData}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#b58d53" stopOpacity={0.7} />
                          <stop offset="95%" stopColor="#b58d53" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e9e5dd" />
                      <XAxis dataKey="month" stroke="#8e8e86" />
                      <YAxis
                        stroke="#8e8e86"
                        tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                      />
                      <Tooltip
                        formatter={(value) => [`₹ ${Number(value).toLocaleString('en-IN')}`, 'Gross Revenue']}
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e9e5dd',
                          borderRadius: '8px',
                          boxShadow: 'var(--shadow-card)',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#b58d53"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorRev)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Suite Category Revenue Share Donut Chart */}
            <div className="col-lg-4">
              <div className="luxury-card p-4 h-100">
                <h4 className="font-serif fw-bold text-main fs-5 mb-1">Palace Category Contribution</h4>
                <p className="text-muted small mb-3">Revenue percentage by suite tier</p>

                <div style={{ width: '100%', height: 240 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={categoryShareData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={95}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {categoryShareData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Revenue Share']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="d-flex flex-column gap-2 mt-2">
                  {categoryShareData.map((cat, i) => (
                    <div key={i} className="d-flex align-items-center justify-content-between small">
                      <div className="d-flex align-items-center gap-2">
                        <span
                          className="d-inline-block rounded-circle"
                          style={{ width: '10px', height: '10px', backgroundColor: cat.color }}
                        />
                        <span className="text-secondary">{cat.name}</span>
                      </div>
                      <span className="fw-bold text-main">{cat.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Users Management */}
        {activeTab === 'users' && (
          <div className="luxury-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h3 className="font-serif fw-bold text-main fs-4 m-0">Master User Directory & Roles</h3>
                <p className="text-muted small m-0">Promote or adjust system roles across Indian residents, concierges, and administrators.</p>
              </div>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="pill-btn-dark py-2 px-3"
                style={{ fontSize: '0.84rem' }}
              >
                <Plus size={15} /> Add Resident Account
              </button>
            </div>

            <div className="table-responsive">
              <table className="luxury-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email Address</th>
                    <th>System Role</th>
                    <th>Privilege Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((user) => (
                    <tr key={user.id}>
                      <td className="fw-semibold text-main">{user.name}</td>
                      <td className="text-muted">{user.email}</td>
                      <td>
                        <span
                          className="badge rounded-pill"
                          style={{
                            backgroundColor: user.role === 'admin' ? '#181818' : user.role === 'staff' ? 'var(--accent-gold-light)' : 'var(--bg-surface-subtle)',
                            color: user.role === 'admin' ? '#ffffff' : user.role === 'staff' ? 'var(--accent-gold)' : 'var(--text-main)',
                            border: '1px solid var(--border-subtle)',
                          }}
                        >
                          {user.role?.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span className="badge-clean">Active</span>
                      </td>
                      <td className="text-end">
                        <select
                          value={user.role}
                          onChange={(e) => {
                            dispatch(changeUserRole({ userId: user.id, role: e.target.value }));
                            toast.success(`Role for ${user.name} updated to ${e.target.value}.`);
                          }}
                          className="form-select form-select-sm rounded-pill d-inline-block w-auto"
                          style={{ fontSize: '0.78rem' }}
                        >
                          <option value="guest">Guest</option>
                          <option value="staff">Staff Concierge</option>
                          <option value="admin">Administrator</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Master Ledger */}
        {activeTab === 'bookings' && (
          <div className="luxury-card p-4">
            <h3 className="font-serif fw-bold text-main fs-4 mb-3">Master Reservations Ledger</h3>
            <div className="table-responsive">
              <table className="luxury-table">
                <thead>
                  <tr>
                    <th>Ref Code</th>
                    <th>Resident</th>
                    <th>Suite</th>
                    <th>Check In / Out</th>
                    <th>Total Settled</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id || b.bookingReference}>
                      <td className="fw-bold font-serif">{b.bookingReference || b.id}</td>
                      <td>
                        <div className="fw-semibold text-main">{b.guestName}</div>
                        <span className="text-muted small">{b.guestEmail}</span>
                      </td>
                      <td>
                        <div className="fw-semibold text-main">{b.roomTitle || b.roomName}</div>
                        <span className="text-muted small">Suite #{b.roomNumber}</span>
                      </td>
                      <td>
                        <div className="small">{b.checkIn} &rarr; {b.checkOut}</div>
                        <span className="text-muted small">{b.nights || 2} nights</span>
                      </td>
                      <td className="fw-bold font-serif" style={{ color: 'var(--accent-gold)' }}>
                        ₹ {(b.totalAmount || 38997).toLocaleString('en-IN')}
                      </td>
                      <td>
                        <span className={b.bookingStatus === 'Cancelled' ? 'badge-dirty' : 'badge-clean'}>
                          {b.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Audit Trail */}
        {activeTab === 'security' && (
          <div className="luxury-card p-4">
            <h3 className="font-serif fw-bold text-main fs-4 mb-3">Security & Compliance Audit Trail</h3>
            <div className="table-responsive">
              <table className="luxury-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Principal Operator</th>
                    <th>Action</th>
                    <th>Event Details</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="small text-muted">{log.timestamp}</td>
                      <td className="fw-semibold text-main small">{log.user}</td>
                      <td>
                        <span className="badge rounded-pill bg-light border text-dark small">
                          {log.action}
                        </span>
                      </td>
                      <td className="small text-secondary">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: Global Hotel Config */}
        {activeTab === 'config' && (
          <div className="luxury-card p-4" style={{ maxWidth: '780px', margin: '0 auto' }}>
            <h3 className="font-serif fw-bold text-main fs-4 mb-2">Platform Governance & GST Configuration</h3>
            <p className="text-secondary small mb-4">
              Configure Indian luxury hospitality tax slabs, heritage conservation fees, and operational state.
            </p>

            <form onSubmit={handleSaveConfig}>
              <div className="row g-3 mb-4">
                <div className="col-12">
                  <label className="form-label small fw-semibold text-muted">Brand Resort Name</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={hotelName}
                    onChange={(e) => setHotelName(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">GST Tax Slab (%)</label>
                  <input
                    type="number"
                    className="form-control rounded-3"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                  />
                  <span className="text-muted small">Standard Indian Luxury Hotel GST is 18%.</span>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Heritage Fee / Night (₹)</label>
                  <input
                    type="number"
                    className="form-control rounded-3"
                    value={resortFee}
                    onChange={(e) => setResortFee(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Primary Currency</label>
                  <input
                    type="text"
                    disabled
                    className="form-control rounded-3"
                    value={currency}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">GSTIN Registration</label>
                  <input
                    type="text"
                    disabled
                    className="form-control rounded-3"
                    value="27AAACL1987K1Z9"
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <button type="submit" className="pill-btn-dark py-2 px-4">
                  Save Governance Settings
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 1060,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div className="luxury-card p-4" style={{ maxWidth: '480px', width: '100%' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="font-serif fw-bold text-main fs-5 m-0">Add New System Account</h4>
              <button onClick={() => setShowAddUserModal(false)} className="btn btn-sm btn-link text-muted p-0">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddUserSubmit}>
              <div className="mb-3">
                <label className="form-label small text-muted">Full Name</label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Vikramaditya Singhania"
                />
              </div>
              <div className="mb-3">
                <label className="form-label small text-muted">Email Address</label>
                <input
                  type="email"
                  className="form-control rounded-3"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="e.g. resident@singhania.com"
                />
              </div>
              <div className="mb-4">
                <label className="form-label small text-muted">Initial Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="form-select rounded-3"
                >
                  <option value="guest">Resident Guest</option>
                  <option value="staff">Staff Concierge</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="pill-btn-outline py-2 px-3"
                >
                  Cancel
                </button>
                <button type="submit" className="pill-btn-dark py-2 px-4">
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;

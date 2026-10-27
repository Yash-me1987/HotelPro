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
  const [hotelName, setHotelName] = useState(config.hotelName);
  const [taxRate, setTaxRate] = useState(config.taxRatePercent);
  const [resortFee, setResortFee] = useState(config.resortFeePerNight);
  const [currency, setCurrency] = useState(config.currency);
  const [maintenanceMode, setMaintenanceMode] = useState(config.maintenanceMode);

  // Financial Calculations
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const activeBookingsCount = bookings.filter((b) => b.bookingStatus !== 'Cancelled').length;
  const occupiedCount = rooms.filter((r) => r.status === 'Dirty' || !r.isAvailable).length;
  const occupancyPercent = Math.round((occupiedCount / rooms.length) * 100) || 68;
  const adr = Math.round(totalRevenue / (bookings.reduce((sum, b) => sum + (b.nights || 1), 0) || 1));
  const revpar = Math.round(adr * (occupancyPercent / 100));

  // Analytics Chart Data
  const revenueMonthlyData = [
    { month: 'May', revenue: 42000, bookings: 64 },
    { month: 'Jun', revenue: 68000, bookings: 98 },
    { month: 'Jul', revenue: 95000, bookings: 135 },
    { month: 'Aug', revenue: 110000, bookings: 158 },
    { month: 'Sep', revenue: 78000, bookings: 112 },
    { month: 'Oct', revenue: 92400, bookings: 129 }
  ];

  const categoryShareData = [
    { name: 'Presidential', value: 35, color: '#fef08a' },
    { name: 'Ocean View', value: 28, color: '#65a30d' },
    { name: 'Executive', value: 20, color: '#556b2f' },
    { name: 'Deluxe King', value: 12, color: '#eab308' },
    { name: 'Family Villa', value: 5, color: '#a3b18a' }
  ];

  const occupancyTrendData = [
    { day: 'Mon', rate: 62 },
    { day: 'Tue', rate: 68 },
    { day: 'Wed', rate: 75 },
    { day: 'Thu', rate: 84 },
    { day: 'Fri', rate: 96 },
    { day: 'Sat', rate: 98 },
    { day: 'Sun', rate: 88 }
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
        role: newUserRole
      })
    );

    dispatch(
      addAuditLog({
        user: `${currentUser?.name} (Admin)`,
        action: 'New User Account Provisioned',
        details: `Created account for ${newUserName} with role ${newUserRole.toUpperCase()}.`
      })
    );

    toast.success(`User ${newUserName} added with ${newUserRole.toUpperCase()} permissions.`);
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
        maintenanceMode
      })
    );

    dispatch(
      addAuditLog({
        user: `${currentUser?.name} (Admin)`,
        action: 'System Platform Settings Modified',
        details: `Updated tax rate to ${taxRate}%, resort fee to $${resortFee}, currency to ${currency}.`
      })
    );

    toast.success('Platform configurations saved successfully.');
  };

  const handleExportCSV = () => {
    toast.success('Exporting Bookings Master Ledger to CSV format...');
  };

  return (
    <div className="admin-dashboard-page py-5" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container py-2">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-danger-subtle text-danger border border-danger px-2 py-1 small fw-bold">
                EXECUTIVE LEVEL ACCESS
              </span>
              <span className="text-muted small">&bull; General Management Control Center</span>
            </div>
            <h2 className="font-serif fw-bold mb-0">HotelPro Executive Administration</h2>
            <p className="text-muted small mb-0">Financial analytics, user access control, payment auditing, and platform governance.</p>
          </div>

          <div className="d-flex gap-2">
            <button onClick={handleExportCSV} className="btn btn-secondary-custom btn-sm d-flex align-items-center gap-1">
              <Download size={15} /> Export Reports
            </button>
            <button onClick={() => setShowAddUserModal(true)} className="btn btn-gold btn-sm d-flex align-items-center gap-1">
              <Plus size={15} /> Add User
            </button>
          </div>
        </div>

        {/* 4 Executive KPI Cards */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-lg-3">
            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--gold-50)' }}>
                <DollarSign size={22} className="text-warning" />
              </div>
              <div>
                <div className="fs-3 fw-bold font-serif text-warning">${totalRevenue.toLocaleString()}</div>
                <div className="text-muted small">Total Bookings Revenue</div>
              </div>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--info-bg)' }}>
                <Activity size={22} className="text-info" />
              </div>
              <div>
                <div className="fs-3 fw-bold font-serif">{occupancyPercent}%</div>
                <div className="text-muted small">Average Occupancy Rate</div>
              </div>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--success-bg)' }}>
                <TrendingUp size={22} className="text-success" />
              </div>
              <div>
                <div className="fs-3 fw-bold font-serif">${adr}</div>
                <div className="text-muted small">ADR (Average Daily Rate)</div>
              </div>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--warning-bg)' }}>
                <Sparkles size={22} className="text-warning" />
              </div>
              <div>
                <div className="fs-3 fw-bold font-serif">${revpar}</div>
                <div className="text-muted small">RevPAR (Rev per Avail Room)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tabs-luxury mb-4">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          >
            <TrendingUp size={16} /> Financial Analytics & Recharts
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          >
            <Users size={16} /> User & Role Management ({usersList.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
          >
            <Calendar size={16} /> Booking Monitoring ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`tab-btn ${activeTab === 'payments' ? 'active' : ''}`}
          >
            <CreditCard size={16} /> Payment Tracking
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          >
            <ShieldCheck size={16} /> Security Audit Logs ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`tab-btn ${activeTab === 'config' ? 'active' : ''}`}
          >
            <Sliders size={16} /> Platform Configuration
          </button>
        </div>

        {/* TAB 1: System Reports & Recharts Analytics */}
        {activeTab === 'analytics' && (
          <div className="row g-4">
            {/* Revenue Trend Area Chart */}
            <div className="col-lg-8">
              <div className="card-luxury p-4 h-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5 className="font-serif fw-bold mb-0">Monthly Revenue Performance</h5>
                    <p className="text-muted small mb-0">Historical gross revenue trends (USD)</p>
                  </div>
                  <span className="badge bg-success-subtle text-success border border-success">
                    +24.6% vs Last Quarter
                  </span>
                </div>

                <div style={{ width: '100%', height: 320 }}>
                  <ResponsiveContainer>
                    <AreaChart data={revenueMonthlyData}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#fef08a" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#556b2f" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                      <XAxis dataKey="month" stroke="var(--text-muted)" />
                      <YAxis stroke="var(--text-muted)" tickFormatter={(v) => `$${v / 1000}k`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                        formatter={(val) => [`$${val.toLocaleString()}`, 'Gross Revenue']}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#fef08a" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Revenue Share Pie Chart */}
            <div className="col-lg-4">
              <div className="card-luxury p-4 h-100">
                <h5 className="font-serif fw-bold mb-1">Revenue by Suite Class</h5>
                <p className="text-muted small mb-3">Category revenue breakdown</p>

                <div style={{ width: '100%', height: 220 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={categoryShareData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {categoryShareData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="d-flex flex-column gap-1 pt-2 border-top small text-muted">
                  {categoryShareData.map((cat, idx) => (
                    <div key={idx} className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-2">
                        <span className="rounded-circle" style={{ width: '8px', height: '8px', backgroundColor: cat.color }} />
                        <span>{cat.name}</span>
                      </div>
                      <span className="fw-semibold">{cat.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Occupancy Trend Line Chart */}
            <div className="col-12">
              <div className="card-luxury p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5 className="font-serif fw-bold mb-0">Weekly Occupancy Rate Trends</h5>
                    <p className="text-muted small mb-0">Percentage of rooms occupied throughout current week</p>
                  </div>
                  <span className="badge bg-warning text-dark fw-bold">Weekend Peak: 98%</span>
                </div>

                <div style={{ width: '100%', height: 220 }}>
                  <ResponsiveContainer>
                    <LineChart data={occupancyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                      <XAxis dataKey="day" stroke="var(--text-muted)" />
                      <YAxis stroke="var(--text-muted)" domain={[50, 100]} unit="%" />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }} />
                      <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: User & Role Management */}
        {activeTab === 'users' && (
          <div className="card-luxury p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="font-serif fw-bold mb-0">Registered Users & Permissions</h5>
                <p className="text-muted small mb-0">Manage Guests, Staff, and Administrators with granular role control.</p>
              </div>
              <button onClick={() => setShowAddUserModal(true)} className="btn btn-gold btn-sm">
                <Plus size={14} /> Add User
              </button>
            </div>

            <div className="table-luxury-wrapper">
              <table className="table-luxury">
                <thead>
                  <tr>
                    <th>User Profile</th>
                    <th>Email</th>
                    <th>Role Level</th>
                    <th>Account Status</th>
                    <th>Member Since</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="fw-semibold">{user.name}</div>
                        <span className="text-muted small">{user.id}</span>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <select
                          className="input-luxury py-1 px-2 small"
                          style={{ width: 'auto', fontSize: '0.8rem' }}
                          value={user.role}
                          onChange={(e) => {
                            dispatch(changeUserRole({ userId: user.id, newRole: e.target.value }));
                            toast.success(`Role for ${user.name} changed to ${e.target.value.toUpperCase()}.`);
                          }}
                        >
                          <option value="guest">Guest</option>
                          <option value="staff">Staff</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                        <span className={`badge ${user.status === 'Active' ? 'badge-clean' : 'badge-cancelled'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>
                        <span className="small text-muted">{user.joined}</span>
                      </td>
                      <td className="text-end">
                        <button
                          onClick={() => {
                            dispatch(toggleUserStatus(user.id));
                            toast.info(`Status toggled for ${user.name}.`);
                          }}
                          className={`btn btn-sm ${user.status === 'Active' ? 'btn-outline-danger' : 'btn-outline-success'} py-1`}
                          style={{ fontSize: '0.75rem' }}
                        >
                          {user.status === 'Active' ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Global Master Booking Monitoring */}
        {activeTab === 'bookings' && (
          <div className="card-luxury p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="font-serif fw-bold mb-0">Master Bookings Ledger</h5>
                <p className="text-muted small mb-0">Comprehensive tracking of all property bookings and reservations.</p>
              </div>
              <button onClick={handleExportCSV} className="btn btn-secondary-custom btn-sm">
                <FileSpreadsheet size={14} /> Export Ledger CSV
              </button>
            </div>

            <div className="table-luxury-wrapper">
              <table className="table-luxury">
                <thead>
                  <tr>
                    <th>Ref ID</th>
                    <th>Guest</th>
                    <th>Suite</th>
                    <th>Dates</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td>
                        <strong className="text-warning">{b.id}</strong>
                      </td>
                      <td>
                        <div className="fw-semibold">{b.guestName}</div>
                        <div className="text-muted small">{b.guestEmail}</div>
                      </td>
                      <td>
                        <div>{b.roomName}</div>
                        <span className="badge bg-dark border border-secondary text-light">
                          Room #{b.roomNumber}
                        </span>
                      </td>
                      <td>
                        <span className="small">{b.checkIn} &rarr; {b.checkOut}</span>
                      </td>
                      <td>
                        <span className="badge badge-paid">{b.paymentStatus}</span>
                        <div className="text-muted small" style={{ fontSize: '0.7rem' }}>{b.paymentMethod}</div>
                      </td>
                      <td>
                        <span className={`badge ${
                          b.bookingStatus === 'Confirmed' ? 'badge-confirmed' :
                          b.bookingStatus === 'Checked-In' ? 'badge-inspected' :
                          b.bookingStatus === 'Checked-Out' ? 'badge-clean' : 'badge-cancelled'
                        }`}>
                          {b.bookingStatus}
                        </span>
                      </td>
                      <td>
                        <div className="fw-bold font-serif text-warning">${b.totalAmount}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Payment Tracking */}
        {activeTab === 'payments' && (
          <div className="card-luxury p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="font-serif fw-bold mb-0">Payment Transactions & Audits</h5>
                <p className="text-muted small mb-0">Real-time payment gateway logs (Stripe & Razorpay).</p>
              </div>
              <span className="badge bg-success-subtle text-success border border-success">
                Gateway Health: 100% Operational
              </span>
            </div>

            <div className="table-luxury-wrapper">
              <table className="table-luxury">
                <thead>
                  <tr>
                    <th>Transaction Ref</th>
                    <th>Booking Ref</th>
                    <th>Guest Name</th>
                    <th>Gateway Provider</th>
                    <th>Gross Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, idx) => (
                    <tr key={idx}>
                      <td>
                        <span className="font-mono small text-muted">
                          txn_{Math.random().toString(36).substring(2, 10)}
                        </span>
                      </td>
                      <td>
                        <strong className="text-warning">{b.id}</strong>
                      </td>
                      <td>{b.guestName}</td>
                      <td>
                        <span className="badge bg-secondary-subtle text-muted">
                          {b.paymentMethod || 'Stripe Gateway'}
                        </span>
                      </td>
                      <td>
                        <strong className="text-warning font-serif">${b.totalAmount}</strong>
                      </td>
                      <td>
                        <span className={`badge ${b.paymentStatus === 'Paid' ? 'badge-paid' : 'badge-refunded'}`}>
                          {b.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: Security Audit Logs */}
        {activeTab === 'security' && (
          <div className="card-luxury p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="font-serif fw-bold mb-0">Real-Time Security & System Audit Trail</h5>
                <p className="text-muted small mb-0">Immutable tracking of operator actions, pricing overrides, and authentication events.</p>
              </div>
              <span className="badge bg-dark border border-secondary text-light">
                <Lock size={12} className="me-1 inline" /> Audit Logging Active
              </span>
            </div>

            <div className="d-flex flex-column gap-2">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 rounded border" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <div className="d-flex align-items-center gap-2">
                      <ShieldCheck size={16} className="text-warning" />
                      <strong className="small">{log.action}</strong>
                      <span className="badge bg-secondary-subtle text-muted" style={{ fontSize: '0.7rem' }}>
                        {log.user}
                      </span>
                    </div>
                    <span className="text-muted small font-mono" style={{ fontSize: '0.75rem' }}>
                      {log.timestamp}
                    </span>
                  </div>
                  <p className="text-muted small mb-0" style={{ fontSize: '0.85rem' }}>
                    {log.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: Platform Configuration */}
        {activeTab === 'config' && (
          <div className="card-luxury p-4">
            <h5 className="font-serif fw-bold mb-3 text-warning">Global Platform Governance</h5>
            <form onSubmit={handleSaveConfig}>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label small text-muted">Hotel & Resort Brand Name</label>
                  <input
                    type="text"
                    className="input-luxury"
                    value={hotelName}
                    onChange={(e) => setHotelName(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small text-muted">Base Operating Currency</label>
                  <select
                    className="input-luxury"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value="USD ($)">USD ($) - United States Dollar</option>
                    <option value="EUR (€)">EUR (€) - Eurozone</option>
                    <option value="GBP (£)">GBP (£) - British Pound</option>
                    <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label small text-muted">Government Tourism Tax Rate (%)</label>
                  <input
                    type="number"
                    className="input-luxury"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small text-muted">Daily Resort & Wellness Fee ($)</label>
                  <input
                    type="number"
                    className="input-luxury"
                    value={resortFee}
                    onChange={(e) => setResortFee(e.target.value)}
                    required
                  />
                </div>

                <div className="col-12">
                  <div className="form-check form-switch mt-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="maintSwitch"
                      checked={maintenanceMode}
                      onChange={(e) => setMaintenanceMode(e.target.checked)}
                    />
                    <label className="form-check-label fw-semibold small text-muted cursor-pointer" htmlFor="maintSwitch">
                      Enable Emergency Platform Maintenance Mode
                    </label>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-gold">
                Save Platform Governance Settings
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Modal: Add User */}
      {showAddUserModal && (
        <div className="modal-overlay" onClick={() => setShowAddUserModal(false)}>
          <div className="modal-content-luxury p-4" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
              <div>
                <h4 className="font-serif text-warning mb-0">Provision New Account</h4>
                <p className="text-muted small mb-0">Create credentials and assign access role</p>
              </div>
              <button className="btn btn-sm btn-link text-muted p-1" onClick={() => setShowAddUserModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit}>
              <div className="mb-3">
                <label className="form-label small text-muted">Full Legal Name</label>
                <input
                  type="text"
                  className="input-luxury"
                  placeholder="e.g. Countess Beatrice Dupont"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small text-muted">Email Address</label>
                <input
                  type="email"
                  className="input-luxury"
                  placeholder="name@organization.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small text-muted">Role Permission</label>
                <select
                  className="input-luxury"
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                >
                  <option value="guest">Guest / Member</option>
                  <option value="staff">Hotel Staff / Operations</option>
                  <option value="admin">Administrator / Executive</option>
                </select>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" onClick={() => setShowAddUserModal(false)} className="btn btn-secondary-custom">
                  Cancel
                </button>
                <button type="submit" className="btn btn-gold">
                  Provision User
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

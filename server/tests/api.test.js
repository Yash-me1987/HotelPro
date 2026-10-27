const http = require('http');

const request = (path, method = 'GET', data = null, headers = {}) => {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {}),
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', (e) => reject(e));
    if (postData) req.write(postData);
    req.end();
  });
};

const runAllTests = async () => {
  console.log('========================================');
  console.log('   HOTELPRO BACKEND API TEST SUITE     ');
  console.log('========================================\n');

  let passed = 0;
  let failed = 0;

  const test = (name, condition, details = '') => {
    if (condition) {
      console.log(`✓ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`✗ [FAIL] ${name} ${details}`);
      failed++;
    }
  };

  try {
    // 1. Health check
    const health = await request('/api/health');
    test('Server Health Check', health.status === 200 && health.body.status === 'online');

    // 2. Rooms - List
    const rooms = await request('/api/rooms');
    test('Get All Rooms', rooms.status === 200 && Array.isArray(rooms.body.data) && rooms.body.data.length > 0);

    // 3. Rooms - Filter by Category
    const penthouseRooms = await request('/api/rooms?category=Penthouse');
    test('Filter Rooms by Penthouse Category', penthouseRooms.status === 200 && penthouseRooms.body.data.every(r => r.type === 'Penthouse'));

    // 4. Rooms - Get by Number
    const singleRoom = await request('/api/rooms/PH-01');
    test('Get Single Room (PH-01)', singleRoom.status === 200 && singleRoom.body.data.roomNumber === 'PH-01');

    // 5. Auth - Register Test User
    const testEmail = `test_${Date.now()}@hotelpro.test`;
    const regRes = await request('/api/auth/register', 'POST', {
      name: 'Test Resident',
      email: testEmail,
      password: 'password123',
      role: 'guest',
      phone: '+1 (555) 000-1111',
    });
    test('User Registration', regRes.status === 201 && regRes.body.data.token != null);

    // 6. Auth - Login
    const loginRes = await request('/api/auth/login', 'POST', {
      email: testEmail,
      password: 'password123',
    });
    test('User Authentication & JWT Generation', loginRes.status === 200 && loginRes.body.data.token != null);
    const guestToken = loginRes.body.data.token;

    // 7. Auth - Get Profile (GET /api/auth/me)
    const profileRes = await request('/api/auth/me', 'GET', null, {
      Authorization: `Bearer ${guestToken}`,
    });
    test('Authenticated Profile Lookup (/api/auth/me)', profileRes.status === 200 && profileRes.body.data.email === testEmail);

    // 8. Bookings - Create Reservation
    const bookingRes = await request('/api/bookings', 'POST', {
      guestName: 'Test Resident',
      guestEmail: testEmail,
      guestPhone: '+1 (555) 000-1111',
      roomNumber: 'PH-01',
      roomTitle: 'The Royal Sovereign Penthouse',
      checkInDate: '2026-11-01',
      checkOutDate: '2026-11-05',
      nights: 4,
      guestsCount: 2,
      totalAmount: 7400,
      paymentMethod: 'Stripe Credit Card',
      specialRequests: 'High floor corner view with welcome amenity.',
    });
    test('Create Reservation (/api/bookings)', bookingRes.status === 201 && bookingRes.body.data.bookingReference != null);
    const bookingRef = bookingRes.body.data.bookingReference;

    // 9. Bookings - Get Bookings
    const bookingsList = await request('/api/bookings', 'GET', null, {
      Authorization: `Bearer ${guestToken}`,
    });
    test('List Guest Reservations', bookingsList.status === 200 && Array.isArray(bookingsList.body.data));

    // 10. Bookings - Check-In (Staff Demo Token)
    const checkInRes = await request(`/api/bookings/${bookingRef}/checkin`, 'POST', null, {
      Authorization: 'Bearer demo-jwt-token-staff',
    });
    test('Express Check-In (/api/bookings/:id/checkin)', checkInRes.status === 200 && checkInRes.body.data.bookingStatus === 'Checked In');

    // 11. Bookings - Cancel & 100% Refund
    const cancelRes = await request(`/api/bookings/${bookingRef}/cancel`, 'POST', {
      reason: 'Itinerary adjustment',
    }, {
      Authorization: `Bearer ${guestToken}`,
    });
    test('Cancel Booking with 100% Refund', cancelRes.status === 200 && cancelRes.body.data.bookingStatus === 'Cancelled' && cancelRes.body.data.paymentStatus === 'Refunded');

    // 12. Services - Create Ticket
    const serviceRes = await request('/api/services', 'POST', {
      guestName: 'Test Resident',
      roomNumber: 'PH-01',
      serviceType: 'Room Service',
      details: 'Artisanal cheese board and chilled sparkling water',
      priority: 'High',
    }, {
      Authorization: `Bearer ${guestToken}`,
    });
    test('Create Service Ticket (/api/services)', serviceRes.status === 201 && serviceRes.body.data._id != null);
    const serviceId = serviceRes.body.data._id;

    // 13. Services - Update Status (Staff Demo Token)
    const updateServiceRes = await request(`/api/services/${serviceId}/status`, 'PATCH', {
      status: 'Completed',
      assignedTo: 'Butler James',
    }, {
      Authorization: 'Bearer demo-jwt-token-staff',
    });
    test('Update Service Ticket Status', updateServiceRes.status === 200 && updateServiceRes.body.data.status === 'Completed');

    // 14. Reviews - Submit Verified Review
    const reviewRes = await request('/api/reviews', 'POST', {
      roomId: 'PH-01',
      guestName: 'Test Resident',
      rating: 5,
      title: 'Remarkable Hospitality & Impeccable Suites',
      comment: 'Every single request was attended to instantly. The digital key worked like magic.',
    });
    test('Submit Verified Review (/api/reviews)', reviewRes.status === 201 && reviewRes.body.data._id != null);

    // 15. Reviews - List Reviews
    const reviewsList = await request('/api/reviews?roomId=PH-01');
    test('Get Reviews for Room', reviewsList.status === 200 && Array.isArray(reviewsList.body.data));

    // 16. Payments - Stripe Payment Intent
    const paymentIntentRes = await request('/api/payments/create-payment-intent', 'POST', {
      amount: 1850,
      currency: 'usd',
      bookingReference: bookingRef,
    });
    test('Stripe Payment Intent Generation', paymentIntentRes.status === 200 && paymentIntentRes.body.clientSecret != null);

    // 17. Admin - Executive Analytics KPIs
    const analyticsRes = await request('/api/admin/analytics', 'GET', null, {
      Authorization: 'Bearer demo-jwt-token-admin',
    });
    test('Admin Analytics & KPIs (/api/admin/analytics)', analyticsRes.status === 200 && analyticsRes.body.data.kpis.adr > 0);

    // 18. Admin - Users List
    const usersRes = await request('/api/admin/users', 'GET', null, {
      Authorization: 'Bearer demo-jwt-token-admin',
    });
    test('Admin Users Directory (/api/admin/users)', usersRes.status === 200 && Array.isArray(usersRes.body.data));

    // 19. Admin - Audit Logs
    const auditRes = await request('/api/admin/audit-logs', 'GET', null, {
      Authorization: 'Bearer demo-jwt-token-admin',
    });
    test('Admin Audit Logs (/api/admin/audit-logs)', auditRes.status === 200 && Array.isArray(auditRes.body.data));

    // 20. Admin - Hotel Config
    const configRes = await request('/api/admin/config');
    test('Hotel Global Configuration (/api/admin/config)', configRes.status === 200 && configRes.body.data.taxRatePercent > 0);

    console.log('\n========================================');
    console.log(`TOTAL TESTS: ${passed + failed}`);
    console.log(`PASSED: ${passed}`);
    console.log(`FAILED: ${failed}`);
    console.log('========================================');

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('Fatal Test Runner Error:', err);
    process.exit(1);
  }
};

runAllTests();

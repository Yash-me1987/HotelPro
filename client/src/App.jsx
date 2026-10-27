import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import RoleDemoBar from './components/RoleDemoBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import RoomListingPage from './pages/RoomListingPage';
import RoomDetailsPage from './pages/RoomDetailsPage';
import BookingCheckoutPage from './pages/BookingCheckoutPage';
import GuestDashboardPage from './pages/GuestDashboardPage';
import StaffDashboardPage from './pages/StaffDashboardPage';
import HotelManagementPage from './pages/HotelManagementPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotificationsPage from './pages/NotificationsPage';

import { fetchRooms } from './redux/slices/roomsSlice';
import { fetchBookings } from './redux/slices/bookingsSlice';
import { fetchServices } from './redux/slices/servicesSlice';

import './App.css';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initial sync with live backend
    dispatch(fetchRooms());
    dispatch(fetchBookings());
    dispatch(fetchServices());
  }, [dispatch]);

  return (
    <div className="app-container">
      {/* 1-Click Role Switcher Demo Bar */}
      <RoleDemoBar />

      {/* Main Luxury Navigation Bar */}
      <Navbar />

      {/* Main Page Body */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<RoomListingPage />} />
          <Route path="/rooms/:id" element={<RoomDetailsPage />} />
          <Route path="/booking" element={<BookingCheckoutPage />} />
          <Route path="/guest-dashboard" element={<GuestDashboardPage />} />
          <Route path="/staff-dashboard" element={<StaffDashboardPage />} />
          <Route path="/hotel-management" element={<HotelManagementPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Luxury Footer */}
      <Footer />
    </div>
  );
}

export default App;

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import EventDetails from './pages/EventDetails';
import SeatSelection from './pages/SeatSelection';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyTickets from './pages/MyTickets';
import Speakers from './pages/Speakers';
import CheckIn from './pages/CheckIn';
import CreateEvent from './pages/admin/CreateEvent';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminHome from './pages/admin/AdminHome';
import AdminEvents from './pages/admin/AdminEvents';
import AdminSpeakers from './pages/admin/AdminSpeakers';
import AdminBookings from './pages/admin/AdminBookings';
import AdminUsers from './pages/admin/AdminUsers';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/events/:id/seats" element={<ProtectedRoute><SeatSelection /></ProtectedRoute>} />
          <Route path="/speakers" element={<Speakers />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/my-tickets" element={<ProtectedRoute roles={['user', 'staff', 'admin']}><MyTickets /></ProtectedRoute>} />
          <Route path="/checkin" element={<ProtectedRoute roles={['staff', 'admin']}><CheckIn /></ProtectedRoute>} />

          {/* Admin Panel Routes */}
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<AdminHome />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="speakers" element={<AdminSpeakers />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>

          {/* Legacy create event route (redirect to admin panel) */}
          <Route path="/admin/events/create" element={<ProtectedRoute roles={['admin']}><CreateEvent /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

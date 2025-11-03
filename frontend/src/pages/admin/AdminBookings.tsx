import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

interface Booking {
    id: number;
    status: string;
    checked_in_at: string | null;
    created_at: string;
    seats: { row: string; number: number }[];
    user: { id: number; name: string; email: string };
    event: { id: number; title: string; date: string };
}

export default function AdminBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            const response = await api.get('/bookings');
            setBookings(response.data);
        } catch (error) {
            showMessage('error', 'Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 4000);
    };

    const handleCheckIn = async (bookingId: number) => {
        try {
            await api.post(`/bookings/${bookingId}/checkin`);
            showMessage('success', 'Booking checked-in successfully!');
            loadBookings();
        } catch (error: any) {
            showMessage('error', error?.response?.data?.message || 'Failed to check-in');
        }
    };

    const filteredBookings = filterStatus === 'all'
        ? bookings
        : bookings.filter(b => b.status === filterStatus);

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { className: string; label: string }> = {
            'confirmed': { className: 'badge badge-success', label: 'Confirmed' },
            'cancelled': { className: 'badge badge-danger', label: 'Cancelled' },
            'checked_in': { className: 'badge badge-primary', label: 'Checked In' },
        };
        return statusMap[status] || { className: 'badge badge-info', label: status };
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner" />
            </div>
        );
    }

    return (
        <div>
            {message && (
                <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} fade-in`} style={{ marginBottom: '24px' }}>
                    {message.type === 'success' ? '✅' : '❌'} {message.text}
                </div>
            )}

            <div className="admin-table-container">
                <div className="admin-table-header">
                    <h3>All Bookings ({filteredBookings.length})</h3>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <label style={{ fontSize: '14px', fontWeight: '600' }}>Filter:</label>
                        <select
                            className="admin-form-select"
                            style={{ width: 'auto', padding: '8px 16px' }}
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="checked_in">Checked In</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User</th>
                                <th>Event</th>
                                <th>Seats</th>
                                <th>Status</th>
                                <th>Booked At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>
                                        No bookings found
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <tr key={booking.id}>
                                        <td><strong>#{booking.id}</strong></td>
                                        <td>
                                            <div style={{ fontSize: '14px', fontWeight: '600' }}>{booking.user.name}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--gray-600)' }}>{booking.user.email}</div>
                                        </td>
                                        <td style={{ maxWidth: '200px' }}>
                                            <div style={{ fontWeight: '600' }}>{booking.event.title}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--gray-600)' }}>
                                                {new Date(booking.event.date).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td>
                                            <strong style={{ color: 'var(--ted-red)' }}>
                                                {booking.seats?.map(s => `${s.row}${s.number}`).join(', ') || 'N/A'}
                                            </strong>
                                        </td>
                                        <td>
                                            <span className={getStatusBadge(booking.status).className}>
                                                {getStatusBadge(booking.status).label}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '13px', color: 'var(--gray-700)' }}>
                                            {new Date(booking.created_at).toLocaleString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </td>
                                        <td>
                                            {booking.status === 'confirmed' && (
                                                <button
                                                    className="admin-action-btn admin-action-btn-edit"
                                                    onClick={() => handleCheckIn(booking.id)}
                                                >
                                                    ✓ Check In
                                                </button>
                                            )}
                                            {booking.status === 'checked_in' && (
                                                <span style={{ color: '#28a745', fontSize: '13px', fontWeight: '600' }}>
                                                    ✓ Checked In
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Stats Summary */}
            <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div className="admin-stat-card">
                    <div className="admin-stat-label">Total Bookings</div>
                    <div className="admin-stat-value" style={{ fontSize: '28px' }}>{bookings.length}</div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-label">Confirmed</div>
                    <div className="admin-stat-value" style={{ fontSize: '28px', color: '#28a745' }}>
                        {bookings.filter(b => b.status === 'confirmed').length}
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-label">Checked In</div>
                    <div className="admin-stat-value" style={{ fontSize: '28px', color: '#0066cc' }}>
                        {bookings.filter(b => b.status === 'checked_in').length}
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-label">Cancelled</div>
                    <div className="admin-stat-value" style={{ fontSize: '28px', color: '#dc3545' }}>
                        {bookings.filter(b => b.status === 'cancelled').length}
                    </div>
                </div>
            </div>
        </div>
    );
}

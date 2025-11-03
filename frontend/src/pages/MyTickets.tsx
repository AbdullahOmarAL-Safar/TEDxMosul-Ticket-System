import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import api from '../api/axios';
import { Booking } from '../types';
import { downloadTicketPDF } from '../utils/pdfGenerator';

export default function MyTickets() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [downloadingPDF, setDownloadingPDF] = useState<number | null>(null);

    const loadBookings = () => {
        setLoading(true);
        api.get<Booking[]>('/bookings/me')
            .then(r => {
                setBookings(r.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        loadBookings();
    }, []);

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 4000);
    };

    const handleCancel = async (bookingId: number) => {
        if (!window.confirm('Are you sure you want to permanently delete this booking?')) {
            return;
        }

        try {
            await api.delete(`/bookings/${bookingId}`);
            showMessage('success', 'Booking cancelled successfully!');
            loadBookings();
        } catch (err: any) {
            showMessage('error', err?.response?.data?.message || 'Failed to cancel booking');
        }
    };

    const handleUpdateStatus = async (bookingId: number, newStatus: string) => {
        try {
            await api.patch(`/bookings/${bookingId}`, { status: newStatus });
            showMessage('success', 'Booking status updated successfully!');
            loadBookings();
        } catch (err: any) {
            showMessage('error', err?.response?.data?.message || 'Failed to update booking');
        }
    };

    const handleDownloadPDF = async (booking: Booking) => {
        setDownloadingPDF(booking.id);
        try {
            await downloadTicketPDF(booking);
            showMessage('success', 'Ticket PDF downloaded successfully!');
        } catch (err: any) {
            showMessage('error', err?.message || 'Failed to download PDF. Please try again.');
        } finally {
            setDownloadingPDF(null);
        }
    };

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, string> = {
            'pending': 'badge badge-warning',
            'approved': 'badge badge-success',
            'rejected': 'badge badge-danger',
            'cancelled': 'badge badge-danger',
            'checked_in': 'badge badge-primary'
        };
        return statusMap[status] || 'badge badge-info';
    };

    return (
        <div className="container section">
            <div className="text-center mb-6">
                <h1 className="mb-3">My Tickets</h1>
                <p style={{ fontSize: '1.125rem', color: 'var(--gray-600)' }}>
                    Manage your event bookings and check-in status
                </p>
            </div>

            {message && (
                <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} fade-in`}>
                    {message.type === 'success' ? '✅' : '❌'} {message.text}
                </div>
            )}

            {loading ? (
                <div className="loading">
                    <div className="spinner" />
                </div>
            ) : bookings.length === 0 ? (
                <div className="text-center" style={{ padding: '64px 0' }}>
                    <h3 style={{ color: 'var(--gray-500)' }}>No tickets yet</h3>
                    <p style={{ color: 'var(--gray-400)', marginBottom: '24px' }}>
                        Book your first event to see your tickets here!
                    </p>
                    <a href="/" className="btn btn-primary">Browse Events</a>
                </div>
            ) : (
                <div className="grid grid-2">
                    {bookings.map(b => (
                        <div key={b.id} className="ticket-card fade-in" data-booking-id={b.id}>
                            <div className="ticket-header">
                                <img
                                    src={b.event.image_url || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200'}
                                    alt={b.event.title}
                                />
                                <div className="ticket-status-overlay">
                                    <span className={getStatusBadge(b.status)}>
                                        {b.status.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>

                            <div className="ticket-body">
                                <h3 className="ticket-title">{b.event.title}</h3>

                                <div className="ticket-info">
                                    <div className="ticket-info-item">
                                        <span className="ticket-info-label">📅 Date:</span>
                                        <span>{new Date(b.event.date).toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}</span>
                                    </div>
                                    <div className="ticket-info-item">
                                        <span className="ticket-info-label">📍 Location:</span>
                                        <span>{b.event.location}</span>
                                    </div>
                                    <div className="ticket-info-item">
                                        <span className="ticket-info-label">🎫 Booking ID:</span>
                                        <span>#{b.id}</span>
                                    </div>
                                    {b.seats && b.seats.length > 0 && (
                                        <div className="ticket-info-item">
                                            <span className="ticket-info-label">🪑 Seats:</span>
                                            <span style={{ fontWeight: 'bold', color: 'var(--ted-red)' }}>
                                                {b.seats.map(s => `${s.row}${s.number}`).join(', ')}
                                            </span>
                                        </div>
                                    )}
                                    {b.checked_in_at && (
                                        <div className="ticket-info-item">
                                            <span className="ticket-info-label">✓ Checked-in:</span>
                                            <span style={{ color: '#28a745', fontWeight: '600' }}>
                                                {new Date(b.checked_in_at).toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* QR Code Section - Only for Approved Bookings */}
                                {b.status === 'pending' && (
                                    <div style={{
                                        marginTop: '1.5rem',
                                        padding: '2rem',
                                        background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
                                        borderRadius: '12px',
                                        textAlign: 'center',
                                        border: '2px dashed #ffc107'
                                    }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
                                        <h4 style={{
                                            fontSize: '1.1rem',
                                            fontWeight: '600',
                                            color: '#856404',
                                            marginBottom: '0.5rem'
                                        }}>
                                            Pending Admin Approval
                                        </h4>
                                        <p style={{
                                            fontSize: '0.9rem',
                                            color: '#856404',
                                            margin: 0
                                        }}>
                                            Your booking request is awaiting admin approval.<br />
                                            You'll receive your QR code once approved.
                                        </p>
                                    </div>
                                )}

                                {b.status === 'rejected' && (
                                    <div style={{
                                        marginTop: '1.5rem',
                                        padding: '2rem',
                                        background: 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)',
                                        borderRadius: '12px',
                                        textAlign: 'center',
                                        border: '2px solid #dc3545'
                                    }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
                                        <h4 style={{
                                            fontSize: '1.1rem',
                                            fontWeight: '600',
                                            color: '#721c24',
                                            marginBottom: '0.5rem'
                                        }}>
                                            Booking Request Not Approved
                                        </h4>
                                        <p style={{
                                            fontSize: '0.9rem',
                                            color: '#721c24',
                                            margin: 0
                                        }}>
                                            Unfortunately, your booking request was not approved by the admin.
                                        </p>
                                    </div>
                                )}

                                {(b.status === 'approved' || b.status === 'checked_in') && (
                                    <div style={{
                                        marginTop: '1.5rem',
                                        padding: '1.5rem',
                                        background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
                                        borderRadius: '12px',
                                        textAlign: 'center',
                                        border: '2px solid #28a745'
                                    }}>
                                        <h4 style={{
                                            fontSize: '0.9rem',
                                            fontWeight: '600',
                                            color: '#155724',
                                            marginBottom: '1rem'
                                        }}>
                                            ✓ Approved - Scan QR Code at Event
                                        </h4>
                                        <div style={{
                                            display: 'inline-block',
                                            padding: '1rem',
                                            background: 'white',
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                        }}>
                                            <QRCodeSVG
                                                value={b.ticket_code || `TEDX-${b.id}`}
                                                size={150}
                                                level="H"
                                                includeMargin={true}
                                            />
                                        </div>
                                        <p style={{
                                            fontSize: '0.85rem',
                                            color: '#155724',
                                            marginTop: '1rem',
                                            fontWeight: '600'
                                        }}>
                                            Ticket Code: {b.ticket_code || `TEDX-${b.id}`}
                                        </p>

                                        {/* PDF Download Button */}
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleDownloadPDF(b)}
                                            disabled={downloadingPDF === b.id}
                                            style={{
                                                marginTop: '1rem',
                                                width: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem',
                                                background: downloadingPDF === b.id ? 'var(--gray-400)' : '#28a745',
                                                cursor: downloadingPDF === b.id ? 'not-allowed' : 'pointer'
                                            }}
                                        >
                                            {downloadingPDF === b.id ? (
                                                <>
                                                    <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></span>
                                                    Generating PDF...
                                                </>
                                            ) : (
                                                <>
                                                    📥 Download Ticket as PDF
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}

                                {b.status !== 'checked_in' && b.status !== 'rejected' && (
                                    <div className="ticket-actions" style={{ marginTop: '1.5rem' }}>
                                        {(b.status === 'pending' || b.status === 'approved') && (
                                            <button
                                                className="btn btn-sm btn-outline"
                                                onClick={() => handleCancel(b.id)}
                                                style={{ borderColor: 'var(--ted-red)', color: 'var(--ted-red)' }}
                                            >
                                                Cancel Booking
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

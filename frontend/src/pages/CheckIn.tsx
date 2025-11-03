import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '../api/axios';

interface BookingDetails {
    id: number;
    status: string;
    checked_in_at?: string;
    seats: { row: string; number: number }[];
    event: {
        title: string;
        date: string;
        location: string;
    };
    user: {
        name: string;
        email: string;
    };
}

export default function CheckIn() {
    const [bookingId, setBookingId] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
    const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [scannerActive, setScannerActive] = useState(false);

    useEffect(() => {
        let scanner: Html5QrcodeScanner | null = null;

        if (scannerActive) {
            scanner = new Html5QrcodeScanner(
                'qr-reader',
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0
                },
                false
            );

            scanner.render(
                (decodedText) => {
                    // Extract booking ID from QR code
                    const match = decodedText.match(/booking[:\s]*(\d+)/i);
                    if (match) {
                        setBookingId(match[1]);
                        handleCheckIn(match[1]);
                        scanner?.clear();
                        setScannerActive(false);
                    } else {
                        showMessage('error', 'Invalid QR code format');
                    }
                },
                (error) => {
                    // Silent error handling for scanning
                }
            );
        }

        return () => {
            if (scanner) {
                scanner.clear().catch(() => { });
            }
        };
    }, [scannerActive]);

    const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    };

    const handleCheckIn = async (id?: string) => {
        const targetId = id || bookingId;
        if (!targetId) {
            showMessage('error', 'Please enter a booking ID');
            return;
        }

        setLoading(true);
        setBookingDetails(null);

        try {
            const response = await api.post(`/bookings/${targetId}/checkin`);
            const booking = response.data as BookingDetails;

            setBookingDetails(booking);

            if (booking.status === 'checked_in') {
                showMessage('success', '✅ Check-in successful!');
            }

            setBookingId('');
        } catch (error: any) {
            const errorMsg = error?.response?.data?.message || 'Check-in failed';
            showMessage('error', errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleCheckIn();
    };

    return (
        <div className="container section" style={{ maxWidth: '900px' }}>
            <div className="text-center mb-6">
                <h1 className="mb-3" style={{
                    fontSize: '2.5rem',
                    fontWeight: '700',
                    background: 'linear-gradient(135deg, #e62b1e 0%, #ff4444 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Event Check-In
                </h1>
                <p style={{ fontSize: '1.125rem', color: 'var(--gray-600)' }}>
                    Scan QR code or enter booking ID to check-in attendees
                </p>
            </div>

            {/* Alert Messages */}
            {message && (
                <div style={{
                    padding: '1rem 1.5rem',
                    borderRadius: '12px',
                    marginBottom: '2rem',
                    background: message.type === 'success' ? '#d4edda' : message.type === 'error' ? '#f8d7da' : '#d1ecf1',
                    border: `2px solid ${message.type === 'success' ? '#28a745' : message.type === 'error' ? '#dc3545' : '#17a2b8'}`,
                    color: message.type === 'success' ? '#155724' : message.type === 'error' ? '#721c24' : '#0c5460',
                    fontWeight: '600',
                    fontSize: '1.05rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    animation: 'slideDown 0.3s ease'
                }}>
                    {message.text}
                </div>
            )}

            <div style={{
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                padding: '2.5rem',
                marginBottom: '2rem'
            }}>
                {/* Scanner Toggle */}
                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <button
                        onClick={() => setScannerActive(!scannerActive)}
                        style={{
                            padding: '1rem 2rem',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            borderRadius: '12px',
                            border: 'none',
                            background: scannerActive
                                ? 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)'
                                : 'linear-gradient(135deg, #e62b1e 0%, #ff4444 100%)',
                            color: 'white',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(230, 43, 30, 0.3)',
                            transition: 'all 0.3s ease',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <span style={{ fontSize: '1.5rem' }}>📷</span>
                        {scannerActive ? 'Stop Scanner' : 'Start QR Scanner'}
                    </button>
                </div>

                {/* QR Scanner */}
                {scannerActive && (
                    <div style={{ marginBottom: '2rem' }}>
                        <div
                            id="qr-reader"
                            style={{
                                borderRadius: '12px',
                                overflow: 'hidden',
                                border: '3px solid #e62b1e'
                            }}
                        />
                    </div>
                )}

                {/* Manual Entry Form */}
                {!scannerActive && (
                    <>
                        <div style={{
                            textAlign: 'center',
                            margin: '1.5rem 0',
                            color: 'var(--gray-500)',
                            fontWeight: '600'
                        }}>
                            OR
                        </div>

                        <form onSubmit={submit}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{
                                    display: 'block',
                                    fontWeight: '600',
                                    marginBottom: '0.75rem',
                                    color: 'var(--gray-700)',
                                    fontSize: '1.05rem'
                                }}>
                                    Enter Booking ID
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., 123"
                                    value={bookingId}
                                    onChange={e => setBookingId(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '1rem 1.5rem',
                                        fontSize: '1.1rem',
                                        border: '2px solid var(--gray-300)',
                                        borderRadius: '12px',
                                        outline: 'none',
                                        transition: 'all 0.3s ease',
                                        fontWeight: '500'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#e62b1e';
                                        e.target.style.boxShadow = '0 0 0 4px rgba(230, 43, 30, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'var(--gray-300)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !bookingId}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    fontSize: '1.1rem',
                                    fontWeight: '700',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: loading || !bookingId
                                        ? 'var(--gray-300)'
                                        : 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                                    color: 'white',
                                    cursor: loading || !bookingId ? 'not-allowed' : 'pointer',
                                    boxShadow: loading || !bookingId ? 'none' : '0 4px 12px rgba(40, 167, 69, 0.3)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseOver={(e) => {
                                    if (!loading && bookingId) {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(40, 167, 69, 0.4)';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = loading || !bookingId ? 'none' : '0 4px 12px rgba(40, 167, 69, 0.3)';
                                }}
                            >
                                {loading ? '⏳ Processing...' : '✓ Check-In Attendee'}
                            </button>
                        </form>
                    </>
                )}
            </div>

            {/* Booking Details Card */}
            {bookingDetails && (
                <div style={{
                    background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
                    borderRadius: '16px',
                    padding: '2rem',
                    border: '3px solid #28a745',
                    boxShadow: '0 8px 24px rgba(40, 167, 69, 0.2)',
                    animation: 'slideDown 0.4s ease'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>✅</div>
                        <h2 style={{
                            fontSize: '1.8rem',
                            fontWeight: '700',
                            color: '#155724',
                            marginBottom: '0.5rem'
                        }}>
                            Successfully Checked-In!
                        </h2>
                        <p style={{ color: '#155724', fontSize: '1rem' }}>
                            Booking ID: #{bookingDetails.id}
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1.5rem',
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}>
                        <div>
                            <h3 style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem', fontWeight: '600' }}>
                                👤 Attendee
                            </h3>
                            <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#212529' }}>
                                {bookingDetails.user.name}
                            </p>
                            <p style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                                {bookingDetails.user.email}
                            </p>
                        </div>

                        <div>
                            <h3 style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem', fontWeight: '600' }}>
                                🎫 Event
                            </h3>
                            <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#212529' }}>
                                {bookingDetails.event.title}
                            </p>
                            <p style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                                📍 {bookingDetails.event.location}
                            </p>
                        </div>

                        <div>
                            <h3 style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem', fontWeight: '600' }}>
                                📅 Date
                            </h3>
                            <p style={{ fontSize: '1rem', fontWeight: '600', color: '#212529' }}>
                                {new Date(bookingDetails.event.date).toLocaleString()}
                            </p>
                        </div>

                        <div>
                            <h3 style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem', fontWeight: '600' }}>
                                🪑 Seats
                            </h3>
                            <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#e62b1e' }}>
                                {bookingDetails.seats.map(s => `${s.row}${s.number}`).join(', ')}
                            </p>
                        </div>

                        {bookingDetails.checked_in_at && (
                            <div style={{ gridColumn: '1 / -1' }}>
                                <h3 style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem', fontWeight: '600' }}>
                                    ✓ Checked-In At
                                </h3>
                                <p style={{ fontSize: '1rem', fontWeight: '600', color: '#28a745' }}>
                                    {new Date(bookingDetails.checked_in_at).toLocaleString()}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}

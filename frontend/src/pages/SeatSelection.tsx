import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Event, SeatsStatus, Seat } from '../types';
import './SeatSelection.css';

const MAX_SEAT_SELECTION = 9;

// Generate realistic theater layout with progressive row expansion
interface TheaterRow {
    label: string;
    leftSeats: number;
    rightSeats: number;
    hasAisle: boolean;
}

const generateTheaterLayout = (capacity: number): TheaterRow[] => {
    const rows: TheaterRow[] = [];
    let totalSeats = 0;
    let rowIndex = 0;

    // Define seat progression patterns based on capacity
    if (capacity <= 200) {
        // Small Venue: 10-12 rows, gradual expansion
        const seatProgression = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        for (const seatsPerSide of seatProgression) {
            if (totalSeats >= capacity) break;
            const hasAisle = seatsPerSide >= 6;
            const leftSeats = Math.ceil(seatsPerSide / 2);
            const rightSeats = Math.floor(seatsPerSide / 2);
            const rowTotal = leftSeats + rightSeats;

            if (totalSeats + rowTotal > capacity) {
                // Adjust last row to fit remaining seats
                const remaining = capacity - totalSeats;
                const adjustedLeft = Math.ceil(remaining / 2);
                const adjustedRight = remaining - adjustedLeft;
                rows.push({
                    label: String.fromCharCode(65 + rowIndex),
                    leftSeats: adjustedLeft,
                    rightSeats: adjustedRight,
                    hasAisle: remaining >= 6
                });
                break;
            }

            rows.push({
                label: String.fromCharCode(65 + rowIndex),
                leftSeats,
                rightSeats,
                hasAisle
            });
            totalSeats += rowTotal;
            rowIndex++;
        }
    } else if (capacity <= 600) {
        // Medium Hall: 12-15 rows, moderate expansion
        const seatProgression = [6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34];
        for (const seatsPerSide of seatProgression) {
            if (totalSeats >= capacity) break;
            const leftSeats = Math.ceil(seatsPerSide / 2);
            const rightSeats = Math.floor(seatsPerSide / 2);
            const rowTotal = leftSeats + rightSeats;

            if (totalSeats + rowTotal > capacity) {
                const remaining = capacity - totalSeats;
                const adjustedLeft = Math.ceil(remaining / 2);
                const adjustedRight = remaining - adjustedLeft;
                rows.push({
                    label: String.fromCharCode(65 + rowIndex),
                    leftSeats: adjustedLeft,
                    rightSeats: adjustedRight,
                    hasAisle: remaining >= 8
                });
                break;
            }

            rows.push({
                label: String.fromCharCode(65 + rowIndex),
                leftSeats,
                rightSeats,
                hasAisle: true
            });
            totalSeats += rowTotal;
            rowIndex++;
        }
    } else {
        // Large Auditorium: 15-18 rows, significant expansion
        const seatProgression = [8, 10, 14, 18, 22, 26, 30, 34, 38, 42, 46, 50, 54, 58, 62, 66, 70, 74];
        for (const seatsPerSide of seatProgression) {
            if (totalSeats >= capacity) break;
            const leftSeats = Math.ceil(seatsPerSide / 2);
            const rightSeats = Math.floor(seatsPerSide / 2);
            const rowTotal = leftSeats + rightSeats;

            if (totalSeats + rowTotal > capacity) {
                const remaining = capacity - totalSeats;
                const adjustedLeft = Math.ceil(remaining / 2);
                const adjustedRight = remaining - adjustedLeft;
                rows.push({
                    label: String.fromCharCode(65 + rowIndex),
                    leftSeats: adjustedLeft,
                    rightSeats: adjustedRight,
                    hasAisle: remaining >= 10
                });
                break;
            }

            rows.push({
                label: String.fromCharCode(65 + rowIndex),
                leftSeats,
                rightSeats,
                hasAisle: true
            });
            totalSeats += rowTotal;
            rowIndex++;
        }
    }

    return rows;
};

const SeatSelection: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { token, role } = useAuth();
    const [event, setEvent] = useState<Event | null>(null);
    const [seatsStatus, setSeatsStatus] = useState<SeatsStatus | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const [error, setError] = useState('');

    // Generate realistic theater layout based on event capacity
    const theaterLayout = useMemo(() => {
        if (!event) return generateTheaterLayout(150);
        return generateTheaterLayout(event.capacity);
    }, [event?.capacity]);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchEventAndSeats();
    }, [id, token]);

    const fetchEventAndSeats = async () => {
        try {
            setLoading(true);
            const [eventRes, seatsRes] = await Promise.all([
                api.get(`/events/${id}`),
                api.get(`/events/${id}/seats`),
            ]);
            setEvent(eventRes.data);
            setSeatsStatus(seatsRes.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load seats');
        } finally {
            setLoading(false);
        }
    };

    const isSeatBooked = (row: string, number: number): boolean => {
        if (!seatsStatus) return false;
        return seatsStatus.booked.includes(`${row}${number}`);
    };

    const isSeatSelected = (row: string, number: number): boolean => {
        return selectedSeats.some((s) => s.row === row && s.number === number);
    };

    const toggleSeat = (row: string, number: number) => {
        if (isSeatBooked(row, number)) return; // Can't select booked seats

        const isSelected = isSeatSelected(row, number);
        if (isSelected) {
            // Deselect
            setSelectedSeats(selectedSeats.filter((s) => !(s.row === row && s.number === number)));
            setError(''); // Clear any error messages
        } else {
            // Check selection limit
            if (selectedSeats.length >= MAX_SEAT_SELECTION) {
                setError(`You can select up to ${MAX_SEAT_SELECTION} seats maximum`);
                return;
            }
            // Select
            setSelectedSeats([...selectedSeats, { row, number }]);
            setError(''); // Clear any error messages
        }
    };

    const handleConfirmBooking = async () => {
        if (selectedSeats.length === 0) {
            setError('Please select at least one seat');
            return;
        }

        try {
            setBooking(true);
            setError('');
            await api.post('/bookings', {
                eventId: Number(id),
                seats: selectedSeats,
            });
            alert('Booking confirmed! 🎉');
            navigate('/my-tickets');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Booking failed');
        } finally {
            setBooking(false);
        }
    };

    if (loading) {
        return (
            <div className="seat-selection-container">
                <div className="loading">Loading seats...</div>
            </div>
        );
    }

    if (error && !event) {
        return (
            <div className="seat-selection-container">
                <div className="error">{error}</div>
            </div>
        );
    }

    return (
        <div className="seat-selection-container">
            {/* Event Header */}
            <div className="seat-selection-header">
                <button className="back-button" onClick={() => navigate(`/events/${id}`)}>
                    ← Back to Event
                </button>
                <h1>{event?.title}</h1>
                <p className="event-info">
                    📍 {event?.location} | 📅 {event?.date ? new Date(event.date).toLocaleDateString() : ''}
                </p>
            </div>

            {/* Stage */}
            <div className="stage">
                <div className="stage-label">🎭 STAGE</div>
            </div>

            {/* Seat Map - Realistic Theater Layout */}
            <div className="seat-map theater-layout">
                {theaterLayout.map((rowConfig, rowIndex) => {
                    const totalSeatsInRow = rowConfig.leftSeats + rowConfig.rightSeats;

                    return (
                        <div key={rowConfig.label} className="theater-row" style={{
                            '--row-width': totalSeatsInRow,
                            '--row-gap': rowConfig.hasAisle ? '40px' : '0px'
                        } as React.CSSProperties}>
                            {/* Row Label (Left) */}
                            <div className="row-label">{rowConfig.label}</div>

                            {/* Seats Container */}
                            <div className="theater-row-seats">
                                {/* Left Section */}
                                <div className="seat-section left-section">
                                    {Array.from({ length: rowConfig.leftSeats }, (_, i) => {
                                        const seatNumber = i + 1;
                                        const booked = isSeatBooked(rowConfig.label, seatNumber);
                                        const selected = isSeatSelected(rowConfig.label, seatNumber);
                                        const seatClass = booked
                                            ? 'seat booked'
                                            : selected
                                                ? 'seat selected'
                                                : 'seat available';

                                        return (
                                            <button
                                                key={seatNumber}
                                                className={seatClass}
                                                onClick={() => toggleSeat(rowConfig.label, seatNumber)}
                                                disabled={booked}
                                                title={`${rowConfig.label}${seatNumber}`}
                                            >
                                                {seatNumber}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Center Aisle */}
                                {rowConfig.hasAisle && <div className="center-aisle"></div>}

                                {/* Right Section */}
                                <div className="seat-section right-section">
                                    {Array.from({ length: rowConfig.rightSeats }, (_, i) => {
                                        const seatNumber = rowConfig.leftSeats + i + 1;
                                        const booked = isSeatBooked(rowConfig.label, seatNumber);
                                        const selected = isSeatSelected(rowConfig.label, seatNumber);
                                        const seatClass = booked
                                            ? 'seat booked'
                                            : selected
                                                ? 'seat selected'
                                                : 'seat available';

                                        return (
                                            <button
                                                key={seatNumber}
                                                className={seatClass}
                                                onClick={() => toggleSeat(rowConfig.label, seatNumber)}
                                                disabled={booked}
                                                title={`${rowConfig.label}${seatNumber}`}
                                            >
                                                {seatNumber}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Row Label (Right) */}
                            <div className="row-label">{rowConfig.label}</div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="legend">
                <div className="legend-item">
                    <div className="legend-box available"></div>
                    <span>Available</span>
                </div>
                <div className="legend-item">
                    <div className="legend-box selected"></div>
                    <span>Selected</span>
                </div>
                <div className="legend-item">
                    <div className="legend-box booked"></div>
                    <span>Booked</span>
                </div>
            </div>

            {/* Selection Summary */}
            {selectedSeats.length > 0 && (
                <div className="selection-summary">
                    <h3>Selected Seats ({selectedSeats.length})</h3>
                    <div className="selected-seats-list">
                        {selectedSeats.map((seat, index) => (
                            <span key={index} className="selected-seat-badge">
                                {seat.row}{seat.number}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && <div className="error-message">{error}</div>}

            {/* Confirm Button */}
            <div className="confirm-section">
                <button
                    className="confirm-button"
                    onClick={handleConfirmBooking}
                    disabled={booking || selectedSeats.length === 0}
                >
                    {booking ? 'Booking...' : `Confirm Booking (${selectedSeats.length} seat${selectedSeats.length !== 1 ? 's' : ''})`}
                </button>
            </div>

            {/* Stats */}
            <div className="seats-stats">
                <p>Total Capacity: {seatsStatus?.total || 0}</p>
                <p>Available: {seatsStatus?.available || 0}</p>
                <p>Booked: {seatsStatus?.booked.length || 0}</p>
            </div>
        </div>
    );
};

export default SeatSelection;

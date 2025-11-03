import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Event, Speaker } from '../types';
import { useAuth } from '../context/AuthContext';

export default function EventDetails() {
    const { id } = useParams<{ id: string }>();
    const { token } = useAuth();
    const nav = useNavigate();
    const [event, setEvent] = useState<Event | null>(null);
    const [speakers, setSpeakers] = useState<Speaker[]>([]);
    const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (!id) return;
        api.get<Event>(`/events/${id}`).then(r => setEvent(r.data));
        api.get<Speaker[]>(`/speakers?eventId=${id}`).then(r => setSpeakers(r.data));
    }, [id]);

    const handleChooseSeat = () => {
        if (!token) { nav('/login'); return; }
        nav(`/events/${id}/seats`);
    };

    if (!event) {
        return (
            <div className="loading">
                <div className="spinner" />
            </div>
        );
    }

    const seatsPercentage = (event.available_seats / event.capacity) * 100;
    const isLowSeats = seatsPercentage < 20 && event.available_seats > 0;
    const isSoldOut = event.available_seats === 0;

    return (
        <div>
            <div className="hero" style={{ margin: 0, borderRadius: 0 }}>
                <img
                    src={event.image_url || 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1920'}
                    alt={event.title}
                    className="hero-image"
                />
                <div className="hero-overlay" />
                <div className="hero-content">
                    <h1 className="hero-title">{event.title}</h1>
                    <div className="hero-subtitle">
                        {new Date(event.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })} • {event.location}
                    </div>
                </div>
            </div>

            <div className="container section">
                {msg && (
                    <div className={`alert ${msg.type === 'success' ? 'alert-success' : 'alert-error'} fade-in`}>
                        {msg.type === 'success' ? '✅' : '❌'} {msg.text}
                    </div>
                )}

                <div className="grid grid-2" style={{ gap: '48px', alignItems: 'start' }}>
                    <div>
                        <h2 className="mb-4">About This Event</h2>
                        <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'var(--gray-700)' }}>
                            {event.description}
                        </p>

                        {speakers.length > 0 && (
                            <div style={{ marginTop: '48px' }}>
                                <h2 className="mb-4">Featured Speakers</h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    {speakers.map(s => (
                                        <div key={s.id} className="card" style={{ padding: '20px' }}>
                                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                                <img
                                                    src={s.image_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'}
                                                    alt={s.name}
                                                    style={{
                                                        width: '80px',
                                                        height: '80px',
                                                        borderRadius: '50%',
                                                        objectFit: 'cover',
                                                        border: '3px solid var(--ted-red)'
                                                    }}
                                                />
                                                <div>
                                                    <h4 style={{ marginBottom: '4px', fontSize: '1.25rem' }}>{s.name}</h4>
                                                    <p style={{ color: 'var(--gray-600)', marginBottom: 0 }}>{s.bio}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{ position: 'sticky', top: '100px' }}>
                        <div className="card" style={{ padding: '32px' }}>
                            <h3 className="mb-4">Book Your Ticket</h3>

                            <div style={{
                                padding: '20px',
                                background: 'var(--gray-50)',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: '24px'
                            }}>
                                <div className="flex justify-between items-center mb-3">
                                    <span style={{ fontWeight: 600, color: 'var(--gray-700)' }}>Availability</span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--ted-red)' }}>
                                        {event.available_seats} / {event.capacity}
                                    </span>
                                </div>

                                <div style={{
                                    width: '100%',
                                    height: '8px',
                                    background: 'var(--gray-200)',
                                    borderRadius: '9999px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        width: `${seatsPercentage}%`,
                                        height: '100%',
                                        background: isSoldOut ? 'var(--gray-400)' : isLowSeats ? '#f59e0b' : 'var(--ted-red)',
                                        transition: 'width 0.3s ease'
                                    }} />
                                </div>

                                {isLowSeats && !isSoldOut && (
                                    <p style={{
                                        marginTop: '12px',
                                        marginBottom: 0,
                                        color: '#f59e0b',
                                        fontSize: '0.875rem',
                                        fontWeight: 600
                                    }}>
                                        ⚡ Only {event.available_seats} seats left!
                                    </p>
                                )}
                            </div>

                            <button
                                className={`btn ${isSoldOut ? 'btn-secondary' : 'btn-primary'} btn-lg w-full`}
                                onClick={handleChooseSeat}
                                disabled={isSoldOut}
                            >
                                {isSoldOut ? '😔 Sold Out' : '🪑 Choose Your Seat'}
                            </button>

                            {!token && (
                                <p style={{
                                    marginTop: '16px',
                                    marginBottom: 0,
                                    textAlign: 'center',
                                    color: 'var(--gray-600)',
                                    fontSize: '0.875rem'
                                }}>
                                    <a href="/login" style={{ color: 'var(--ted-red)', fontWeight: 600 }}>Sign in</a> to book tickets
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

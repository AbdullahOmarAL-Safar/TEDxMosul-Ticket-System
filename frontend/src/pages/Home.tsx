import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import EventCard from '../components/EventCard';
import { Event } from '../types';

export default function Home() {
    const [events, setEvents] = useState<Event[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        api.get<Event[]>('/events').then(r => {
            setEvents(r.data);
            setFilteredEvents(r.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredEvents(events);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = events.filter(event =>
                event.title.toLowerCase().includes(query) ||
                event.description.toLowerCase().includes(query) ||
                event.location.toLowerCase().includes(query)
            );
            setFilteredEvents(filtered);
        }
    }, [searchQuery, events]);

    return (
        <div>
            <div className="hero">
                <img
                    src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920"
                    alt="TEDxMosul"
                    className="hero-image"
                />
                <div className="hero-overlay" style={{
                    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(15, 15, 20, 0.9) 50%, rgba(0, 0, 0, 0.85) 100%)',
                    backdropFilter: 'blur(2px)'
                }} />
                <div className="hero-content">
                    <h1 className="hero-title" style={{
                        fontSize: '5rem',
                        fontWeight: '900',
                        background: 'linear-gradient(135deg, #f5f5f5 0%, #e62b1e 40%, #ff4444 60%, #f5f5f5 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        textShadow: 'none',
                        filter: 'drop-shadow(0 0 30px rgba(230, 43, 30, 0.9)) drop-shadow(0 0 60px rgba(230, 43, 30, 0.6)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.8))',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        marginBottom: '0.5rem'
                    }}>
                        TEDxMosul
                    </h1>
                    <div style={{
                        width: '120px',
                        height: '3px',
                        background: 'linear-gradient(90deg, transparent 0%, #e62b1e 50%, transparent 100%)',
                        margin: '1.5rem auto',
                        boxShadow: '0 0 20px rgba(230, 43, 30, 0.8), 0 0 40px rgba(230, 43, 30, 0.4)'
                    }} />
                    <p className="hero-subtitle" style={{
                        fontSize: '1.1rem',
                        fontWeight: '300',
                        color: '#e8e8e8',
                        textShadow: '0 0 30px rgba(230, 43, 30, 0.4), 0 2px 8px rgba(0, 0, 0, 0.9)',
                        letterSpacing: '0.15em',
                        marginTop: '1.5rem',
                        fontFamily: 'Inter, sans-serif',
                        textTransform: 'uppercase'
                    }}>
                        Ideas Worth Spreading
                    </p>
                    <p style={{
                        fontSize: '1.25rem',
                        fontWeight: '400',
                        color: '#b8b8b8',
                        marginTop: '1rem',
                        letterSpacing: '0.05em',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
                        fontStyle: 'italic'
                    }}>
                        Where Bold Ideas <span style={{
                            color: '#e62b1e',
                            fontWeight: '600',
                            fontStyle: 'normal',
                            textShadow: '0 0 20px rgba(230, 43, 30, 0.8)'
                        }}>Ignite Change</span>
                    </p>
                </div>
            </div>

            <div className="container section">
                <div className="text-center mb-6">
                    <h2 className="mb-3">Upcoming Experiences</h2>
                    <p style={{ fontSize: '1.125rem', color: 'var(--gray-600)', maxWidth: '700px', margin: '0 auto', marginBottom: '2rem' }}>
                        Join us for transformative conversations that spark innovation, challenge perspectives, and celebrate the bold ideas shaping Mosul's future.
                    </p>

                    {/* Search Bar */}
                    <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                placeholder="🔍 Search events by title, description, or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '1rem 1.5rem',
                                    fontSize: '1rem',
                                    border: '2px solid var(--gray-300)',
                                    borderRadius: '50px',
                                    outline: 'none',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#e62b1e';
                                    e.target.style.boxShadow = '0 4px 12px rgba(230, 43, 30, 0.15)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'var(--gray-300)';
                                    e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                                }}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    style={{
                                        position: 'absolute',
                                        right: '1.5rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'transparent',
                                        border: 'none',
                                        fontSize: '1.5rem',
                                        cursor: 'pointer',
                                        color: 'var(--gray-500)',
                                        padding: '0',
                                        width: '24px',
                                        height: '24px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    title="Clear search"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                        {searchQuery && (
                            <p style={{ marginTop: '1rem', color: 'var(--gray-600)', fontSize: '0.95rem' }}>
                                Found {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} matching "{searchQuery}"
                            </p>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="loading">
                        <div className="spinner" />
                    </div>
                ) : (
                    <div className="grid grid-3">
                        {filteredEvents.map(e => <EventCard key={e.id} e={e} />)}
                        {filteredEvents.length === 0 && events.length > 0 && (
                            <div className="text-center" style={{ gridColumn: '1 / -1', padding: '64px 0' }}>
                                <h3 style={{ color: 'var(--gray-500)', fontSize: '1.5rem', marginBottom: '1rem' }}>No Events Found</h3>
                                <p style={{ color: 'var(--gray-400)', fontSize: '1.125rem', marginBottom: '1.5rem' }}>
                                    No events match your search criteria. Try different keywords!
                                </p>
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="btn btn-primary"
                                    style={{ padding: '0.75rem 2rem' }}
                                >
                                    Clear Search
                                </button>
                            </div>
                        )}
                        {events.length === 0 && (
                            <div className="text-center" style={{ gridColumn: '1 / -1', padding: '64px 0' }}>
                                <h3 style={{ color: 'var(--gray-500)', fontSize: '1.5rem', marginBottom: '1rem' }}>Something Extraordinary Is Coming</h3>
                                <p style={{ color: 'var(--gray-400)', fontSize: '1.125rem' }}>We're crafting unforgettable experiences. Stay tuned for announcements!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

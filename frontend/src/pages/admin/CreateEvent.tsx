import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function CreateEvent() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        image_url: '',
        capacity: 100,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'capacity' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Validate capacity
        if (formData.capacity < 1) {
            setError('Capacity must be at least 1');
            setLoading(false);
            return;
        }
        if (formData.capacity > 1000) {
            setError('Maximum allowed capacity is 1000 seats');
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('/events', formData);
            setSuccess('Event created successfully!');
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to create event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '800px', padding: '3rem 1rem' }}>
            <div style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                padding: '2.5rem'
            }}>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    marginBottom: '0.5rem',
                    color: 'var(--gray-900)'
                }}>
                    Create New Event
                </h1>
                <p style={{
                    color: 'var(--gray-600)',
                    marginBottom: '2rem'
                }}>
                    Fill in the details below to create a new TEDxMosul event
                </p>

                {error && (
                    <div style={{
                        padding: '1rem',
                        background: '#fee',
                        color: '#c33',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        border: '1px solid #fcc'
                    }}>
                        {error}
                    </div>
                )}

                {success && (
                    <div style={{
                        padding: '1rem',
                        background: '#efe',
                        color: '#3a3',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        border: '1px solid #cfc'
                    }}>
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Title */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            fontWeight: '600',
                            marginBottom: '0.5rem',
                            color: 'var(--gray-700)'
                        }}>
                            Event Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Innovation in Technology"
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                border: '2px solid var(--gray-300)',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#e62b1e'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--gray-300)'}
                        />
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            fontWeight: '600',
                            marginBottom: '0.5rem',
                            color: 'var(--gray-700)'
                        }}>
                            Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={5}
                            placeholder="Describe the event, speakers, and what attendees can expect..."
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                border: '2px solid var(--gray-300)',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                resize: 'vertical',
                                fontFamily: 'inherit'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#e62b1e'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--gray-300)'}
                        />
                    </div>

                    {/* Date and Time */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            fontWeight: '600',
                            marginBottom: '0.5rem',
                            color: 'var(--gray-700)'
                        }}>
                            Date & Time *
                        </label>
                        <input
                            type="datetime-local"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                border: '2px solid var(--gray-300)',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#e62b1e'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--gray-300)'}
                        />
                    </div>

                    {/* Location */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            fontWeight: '600',
                            marginBottom: '0.5rem',
                            color: 'var(--gray-700)'
                        }}>
                            Location *
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Mosul University Auditorium"
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                border: '2px solid var(--gray-300)',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#e62b1e'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--gray-300)'}
                        />
                    </div>

                    {/* Image URL */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            fontWeight: '600',
                            marginBottom: '0.5rem',
                            color: 'var(--gray-700)'
                        }}>
                            Image URL (Optional)
                        </label>
                        <input
                            type="url"
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleChange}
                            placeholder="https://images.unsplash.com/photo-..."
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                border: '2px solid var(--gray-300)',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#e62b1e'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--gray-300)'}
                        />
                        <small style={{ color: 'var(--gray-500)', marginTop: '0.5rem', display: 'block' }}>
                            Use Unsplash or other image hosting services
                        </small>
                    </div>

                    {/* Capacity */}
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{
                            display: 'block',
                            fontWeight: '600',
                            marginBottom: '0.5rem',
                            color: 'var(--gray-700)'
                        }}>
                            Capacity (Total Seats) *
                        </label>
                        <input
                            type="number"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            required
                            min="1"
                            max="1000"
                            placeholder="100"
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                border: '2px solid var(--gray-300)',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#e62b1e'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--gray-300)'}
                        />
                        <small style={{ color: 'var(--gray-500)', marginTop: '0.5rem', display: 'block' }}>
                            Layout adapts automatically: 1-200 (small venue), 201-600 (medium hall), 601-1000 (large auditorium)
                        </small>
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            style={{
                                padding: '0.75rem 1.5rem',
                                border: '2px solid var(--gray-300)',
                                background: 'white',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = 'var(--gray-100)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = 'white';
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                            style={{
                                padding: '0.75rem 2rem',
                                opacity: loading ? 0.7 : 1,
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? 'Creating...' : 'Create Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

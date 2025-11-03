import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    image_url: string;
    capacity: number;
    available_seats: number;
}

export default function AdminEvents() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        image_url: '',
        capacity: 100,
    });

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            const response = await api.get('/events');
            setEvents(response.data);
        } catch (error) {
            showMessage('error', 'Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 4000);
    };

    const handleOpenModal = (event?: Event) => {
        if (event) {
            setEditingEvent(event);
            setFormData({
                title: event.title,
                description: event.description,
                date: new Date(event.date).toISOString().slice(0, 16),
                location: event.location,
                image_url: event.image_url || '',
                capacity: event.capacity,
            });
        } else {
            setEditingEvent(null);
            setFormData({
                title: '',
                description: '',
                date: '',
                location: '',
                image_url: '',
                capacity: 100,
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingEvent(null);
        setFormData({
            title: '',
            description: '',
            date: '',
            location: '',
            image_url: '',
            capacity: 100,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate capacity
        if (formData.capacity < 1) {
            showMessage('error', 'Capacity must be at least 1');
            return;
        }
        if (formData.capacity > 1000) {
            showMessage('error', 'Maximum allowed capacity is 1000 seats');
            return;
        }

        try {
            if (editingEvent) {
                await api.put(`/events/${editingEvent.id}`, formData);
                showMessage('success', 'Event updated successfully!');
            } else {
                await api.post('/events', formData);
                showMessage('success', 'Event created successfully!');
            }
            handleCloseModal();
            loadEvents();
        } catch (error: any) {
            showMessage('error', error?.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
            return;
        }

        try {
            await api.delete(`/events/${id}`);
            showMessage('success', 'Event deleted successfully!');
            loadEvents();
        } catch (error: any) {
            showMessage('error', error?.response?.data?.message || 'Failed to delete event');
        }
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
                    <h3>All Events ({events.length})</h3>
                    <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                        ➕ Create Event
                    </button>
                </div>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Date</th>
                            <th>Location</th>
                            <th>Capacity</th>
                            <th>Available</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>
                                    No events found. Create your first event!
                                </td>
                            </tr>
                        ) : (
                            events.map((event) => (
                                <tr key={event.id}>
                                    <td><strong>#{event.id}</strong></td>
                                    <td style={{ maxWidth: '250px' }}>
                                        <strong>{event.title}</strong>
                                    </td>
                                    <td>{new Date(event.date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}</td>
                                    <td>{event.location}</td>
                                    <td><strong>{event.capacity}</strong></td>
                                    <td>
                                        <span style={{
                                            color: event.available_seats > 0 ? '#28a745' : '#dc3545',
                                            fontWeight: '600'
                                        }}>
                                            {event.available_seats}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="admin-actions">
                                            <button
                                                className="admin-action-btn admin-action-btn-edit"
                                                onClick={() => handleOpenModal(event)}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                className="admin-action-btn admin-action-btn-delete"
                                                onClick={() => handleDelete(event.id)}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="admin-modal-overlay" onClick={handleCloseModal}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2 className="admin-modal-title">
                                {editingEvent ? 'Edit Event' : 'Create New Event'}
                            </h2>
                            <button className="admin-modal-close" onClick={handleCloseModal}>
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="admin-modal-body">
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Event Title *</label>
                                    <input
                                        type="text"
                                        className="admin-form-input"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        placeholder="e.g., Innovation in Technology"
                                    />
                                </div>

                                <div className="admin-form-group">
                                    <label className="admin-form-label">Description *</label>
                                    <textarea
                                        className="admin-form-textarea"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                        placeholder="Describe the event..."
                                    />
                                </div>

                                <div className="admin-form-group">
                                    <label className="admin-form-label">Date & Time *</label>
                                    <input
                                        type="datetime-local"
                                        className="admin-form-input"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="admin-form-group">
                                    <label className="admin-form-label">Location *</label>
                                    <input
                                        type="text"
                                        className="admin-form-input"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        required
                                        placeholder="e.g., Mosul University Auditorium"
                                    />
                                </div>

                                <div className="admin-form-group">
                                    <label className="admin-form-label">Image URL (Optional)</label>
                                    <input
                                        type="url"
                                        className="admin-form-input"
                                        value={formData.image_url}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>

                                <div className="admin-form-group">
                                    <label className="admin-form-label">Capacity * (Max: 1000)</label>
                                    <input
                                        type="number"
                                        className="admin-form-input"
                                        value={formData.capacity}
                                        onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                                        required
                                        min="1"
                                        max="1000"
                                        placeholder="e.g., 150"
                                    />
                                    <small style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                                        Layout adapts automatically: 1-200 (small venue), 201-600 (medium hall), 601-1000 (large auditorium)
                                    </small>
                                </div>
                            </div>

                            <div className="admin-modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingEvent ? '💾 Update Event' : '➕ Create Event'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

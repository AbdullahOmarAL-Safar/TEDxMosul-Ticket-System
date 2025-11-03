import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

interface Speaker {
    id: number;
    name: string;
    bio: string;
    image_url: string;
    event?: { id: number; title: string };
}

interface Event {
    id: number;
    title: string;
}

export default function AdminSpeakers() {
    const [speakers, setSpeakers] = useState<Speaker[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        image_url: '',
        eventId: '',
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [speakersRes, eventsRes] = await Promise.all([
                api.get('/speakers'),
                api.get('/events'),
            ]);
            setSpeakers(speakersRes.data);
            setEvents(eventsRes.data);
        } catch (error) {
            showMessage('error', 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 4000);
    };

    const handleOpenModal = (speaker?: Speaker) => {
        if (speaker) {
            setEditingSpeaker(speaker);
            setFormData({
                name: speaker.name,
                bio: speaker.bio,
                image_url: speaker.image_url || '',
                eventId: speaker.event?.id?.toString() || '',
            });
        } else {
            setEditingSpeaker(null);
            setFormData({
                name: '',
                bio: '',
                image_url: '',
                eventId: '',
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingSpeaker(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...formData,
            eventId: formData.eventId ? parseInt(formData.eventId) : undefined,
        };

        try {
            if (editingSpeaker) {
                await api.put(`/speakers/${editingSpeaker.id}`, payload);
                showMessage('success', 'Speaker updated successfully!');
            } else {
                await api.post('/speakers', payload);
                showMessage('success', 'Speaker created successfully!');
            }
            handleCloseModal();
            loadData();
        } catch (error: any) {
            showMessage('error', error?.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this speaker?')) {
            return;
        }

        try {
            await api.delete(`/speakers/${id}`);
            showMessage('success', 'Speaker deleted successfully!');
            loadData();
        } catch (error: any) {
            showMessage('error', error?.response?.data?.message || 'Failed to delete speaker');
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
                    <h3>All Speakers ({speakers.length})</h3>
                    <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                        ➕ Create Speaker
                    </button>
                </div>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Event</th>
                            <th>Bio Preview</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {speakers.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>
                                    No speakers found. Create your first speaker!
                                </td>
                            </tr>
                        ) : (
                            speakers.map((speaker) => (
                                <tr key={speaker.id}>
                                    <td><strong>#{speaker.id}</strong></td>
                                    <td><strong>{speaker.name}</strong></td>
                                    <td>{speaker.event?.title || 'Not assigned'}</td>
                                    <td style={{ maxWidth: '300px' }}>
                                        {speaker.bio.substring(0, 100)}...
                                    </td>
                                    <td>
                                        <div className="admin-actions">
                                            <button
                                                className="admin-action-btn admin-action-btn-edit"
                                                onClick={() => handleOpenModal(speaker)}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                className="admin-action-btn admin-action-btn-delete"
                                                onClick={() => handleDelete(speaker.id)}
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
                                {editingSpeaker ? 'Edit Speaker' : 'Create New Speaker'}
                            </h2>
                            <button className="admin-modal-close" onClick={handleCloseModal}>
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="admin-modal-body">
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Speaker Name *</label>
                                    <input
                                        type="text"
                                        className="admin-form-input"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        placeholder="e.g., Dr. Ahmed Ali"
                                    />
                                </div>

                                <div className="admin-form-group">
                                    <label className="admin-form-label">Bio *</label>
                                    <textarea
                                        className="admin-form-textarea"
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        required
                                        placeholder="Speaker biography..."
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
                                    <label className="admin-form-label">Assign to Event (Optional)</label>
                                    <select
                                        className="admin-form-select"
                                        value={formData.eventId}
                                        onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
                                    >
                                        <option value="">-- No Event --</option>
                                        {events.map((event) => (
                                            <option key={event.id} value={event.id}>
                                                {event.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="admin-modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingSpeaker ? '💾 Update Speaker' : '➕ Create Speaker'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

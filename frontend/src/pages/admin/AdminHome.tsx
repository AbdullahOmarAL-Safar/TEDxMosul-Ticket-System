import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

interface Stats {
    totalEvents: number;
    totalBookings: number;
    totalUsers: number;
    totalSpeakers: number;
}

export default function AdminHome() {
    const [stats, setStats] = useState<Stats>({
        totalEvents: 0,
        totalBookings: 0,
        totalUsers: 0,
        totalSpeakers: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const [events, bookings, users, speakers] = await Promise.all([
                api.get('/events'),
                api.get('/bookings'),
                api.get('/users'),
                api.get('/speakers'),
            ]);

            setStats({
                totalEvents: events.data.length,
                totalBookings: bookings.data.length,
                totalUsers: users.data.length,
                totalSpeakers: speakers.data.length,
            });
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
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
            <div className="admin-stats-grid">
                <div className="admin-stat-card" style={{ borderLeft: '4px solid var(--ted-red)' }}>
                    <div className="admin-stat-icon">🎫</div>
                    <h2 className="admin-stat-value">{stats.totalEvents}</h2>
                    <p className="admin-stat-label">Total Events</p>
                </div>

                <div className="admin-stat-card" style={{ borderLeft: '4px solid #0066cc' }}>
                    <div className="admin-stat-icon">📋</div>
                    <h2 className="admin-stat-value">{stats.totalBookings}</h2>
                    <p className="admin-stat-label">Total Bookings</p>
                </div>

                <div className="admin-stat-card" style={{ borderLeft: '4px solid #28a745' }}>
                    <div className="admin-stat-icon">👥</div>
                    <h2 className="admin-stat-value">{stats.totalUsers}</h2>
                    <p className="admin-stat-label">Total Users</p>
                </div>

                <div className="admin-stat-card" style={{ borderLeft: '4px solid #ff6b35' }}>
                    <div className="admin-stat-icon">🎤</div>
                    <h2 className="admin-stat-value">{stats.totalSpeakers}</h2>
                    <p className="admin-stat-label">Total Speakers</p>
                </div>
            </div>

            <div className="admin-table-container">
                <div className="admin-table-header">
                    <h3>Quick Actions</h3>
                </div>
                <div style={{ padding: '32px 24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        <Link to="/admin/events" className="btn btn-primary" style={{ textAlign: 'center' }}>
                            🎫 Manage Events
                        </Link>
                        <Link to="/admin/speakers" className="btn btn-primary" style={{ textAlign: 'center' }}>
                            🎤 Manage Speakers
                        </Link>
                        <Link to="/admin/bookings" className="btn btn-primary" style={{ textAlign: 'center' }}>
                            📋 View Bookings
                        </Link>
                        <Link to="/admin/users" className="btn btn-primary" style={{ textAlign: 'center' }}>
                            👥 Manage Users
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
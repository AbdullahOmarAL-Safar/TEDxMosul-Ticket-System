import React from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const { user } = useAuth();
    const location = useLocation();

    // Redirect if not admin
    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    const menuItems = [
        { path: '/admin', label: '📊 Dashboard', exact: true },
        { path: '/admin/events', label: '🎫 Events Management' },
        { path: '/admin/speakers', label: '🎤 Speakers Management' },
        { path: '/admin/bookings', label: '📋 Bookings Overview' },
        { path: '/admin/users', label: '👥 Users Management' },
    ];

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <h2>
                        <span style={{ color: 'var(--ted-white)' }}>TED</span>
                        <span style={{ color: '#000' }}>x</span>
                        <span style={{ color: 'var(--ted-white' }}>Mosul</span>
                    </h2>
                    <p>Admin Panel</p>
                </div>

                <div className="admin-sidebar-footer">
                    <div className="admin-user-info">
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>👤</div>
                        <div style={{ fontSize: '14px', fontWeight: '600' }}>{user.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--gray-500)' }}>{user.email}</div>
                        <div style={{
                            fontSize: '11px',
                            color: 'var(--ted-red)',
                            fontWeight: '700',
                            marginTop: '4px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            Admin
                        </div>
                    </div>
                    <Link to="/" className="btn btn-sm btn-outline" style={{ width: '100%', marginTop: '12px' }}>
                        ← Back to Site
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
}

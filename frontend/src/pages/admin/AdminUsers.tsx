import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            showMessage('error', 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 4000);
    };

    const handleRoleChange = async (userId: number, newRole: string) => {
        if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
            return;
        }

        try {
            await api.patch(`/users/${userId}/role`, { role: newRole });
            showMessage('success', `User role updated to ${newRole}!`);
            loadUsers();
        } catch (error: any) {
            showMessage('error', error?.response?.data?.message || 'Failed to update role');
        }
    };

    const getRoleBadge = (role: string) => {
        const roleMap: Record<string, { className: string; icon: string }> = {
            'admin': { className: 'badge badge-danger', icon: '👑' },
            'staff': { className: 'badge badge-primary', icon: '🛡️' },
            'user': { className: 'badge badge-success', icon: '👤' },
        };
        return roleMap[role] || { className: 'badge badge-info', icon: '❓' };
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
                    <h3>All Users ({users.length})</h3>
                </div>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Current Role</th>
                            <th>Registered</th>
                            <th>Change Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                                    No users found
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td><strong>#{user.id}</strong></td>
                                    <td><strong>{user.name}</strong></td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={getRoleBadge(user.role).className}>
                                            {getRoleBadge(user.role).icon} {user.role.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '13px', color: 'var(--gray-700)' }}>
                                        {new Date(user.created_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {user.role !== 'admin' && (
                                                <button
                                                    className="admin-action-btn"
                                                    style={{ background: '#dc3545', color: 'white' }}
                                                    onClick={() => handleRoleChange(user.id, 'admin')}
                                                >
                                                    👑 Admin
                                                </button>
                                            )}
                                            {user.role !== 'staff' && (
                                                <button
                                                    className="admin-action-btn"
                                                    style={{ background: '#0066cc', color: 'white' }}
                                                    onClick={() => handleRoleChange(user.id, 'staff')}
                                                >
                                                    🛡️ Staff
                                                </button>
                                            )}
                                            {user.role !== 'user' && (
                                                <button
                                                    className="admin-action-btn"
                                                    style={{ background: '#28a745', color: 'white' }}
                                                    onClick={() => handleRoleChange(user.id, 'user')}
                                                >
                                                    👤 User
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Role Distribution Stats */}
            <div style={{ marginTop: '32px' }}>
                <h3 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: '600' }}>Role Distribution</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div className="admin-stat-card" style={{ borderLeft: '4px solid #dc3545' }}>
                        <div className="admin-stat-icon">👑</div>
                        <div className="admin-stat-value" style={{ fontSize: '28px' }}>
                            {users.filter(u => u.role === 'admin').length}
                        </div>
                        <div className="admin-stat-label">Admins</div>
                    </div>
                    <div className="admin-stat-card" style={{ borderLeft: '4px solid #0066cc' }}>
                        <div className="admin-stat-icon">🛡️</div>
                        <div className="admin-stat-value" style={{ fontSize: '28px' }}>
                            {users.filter(u => u.role === 'staff').length}
                        </div>
                        <div className="admin-stat-label">Staff</div>
                    </div>
                    <div className="admin-stat-card" style={{ borderLeft: '4px solid #28a745' }}>
                        <div className="admin-stat-icon">👤</div>
                        <div className="admin-stat-value" style={{ fontSize: '28px' }}>
                            {users.filter(u => u.role === 'user').length}
                        </div>
                        <div className="admin-stat-label">Users</div>
                    </div>
                </div>
            </div>

            {/* Important Notice */}
            <div style={{
                marginTop: '32px',
                padding: '20px',
                background: '#fff3cd',
                border: '2px solid #ffc107',
                borderRadius: '8px',
                color: '#856404'
            }}>
                <strong>⚠️ Important:</strong> Be careful when changing user roles. Admin and Staff roles have elevated permissions to manage events, speakers, and bookings.
            </div>
        </div>
    );
}

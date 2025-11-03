import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const { user, role } = useAuth();

    return (
        <div className="container" style={{ paddingTop: 48, paddingBottom: 48 }}>
            <h1>Dashboard</h1>
            {user && (
                <div className="card" style={{ maxWidth: 500 }}>
                    <h2 style={{ marginTop: 0 }}>Welcome, {user.name}!</h2>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> <span className="kbd">{role}</span></p>
                </div>
            )}
        </div>
    );
}

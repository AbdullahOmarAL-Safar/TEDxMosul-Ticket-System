import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="container" style={{ paddingTop: 96, paddingBottom: 96, textAlign: 'center' }}>
            <h1 style={{ fontSize: 72, margin: 0 }}>404</h1>
            <p style={{ fontSize: 20, marginTop: 16, marginBottom: 24 }}>Page Not Found</p>
            <Link to="/" className="btn">Go Home</Link>
        </div>
    );
}

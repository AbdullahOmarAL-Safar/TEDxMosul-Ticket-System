import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const nav = useNavigate();

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr('');
        setLoading(true);
        try {
            await register(name, email, password);
            nav('/');
        } catch (error: any) {
            setErr(error?.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '64px', paddingBottom: '64px' }}>
            <div className="form-card fade-in">
                <div className="form-title">
                    Create Account
                </div>
                <p className="form-subtitle">
                    Join TEDxMosul and book your tickets
                </p>

                <form onSubmit={submit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="form-input"
                            required
                            autoComplete="name"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="form-input"
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Create a strong password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="form-input"
                            required
                            autoComplete="new-password"
                            minLength={6}
                        />
                        <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginTop: '6px', marginBottom: 0 }}>
                            Must be at least 6 characters
                        </p>
                    </div>

                    {err && (
                        <div className="alert alert-error fade-in">
                            ❌ {err}
                        </div>
                    )}

                    <button className="btn btn-primary btn-lg w-full" type="submit" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account →'}
                    </button>
                </form>

                <p className="form-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
}

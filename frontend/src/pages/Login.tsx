import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const nav = useNavigate();

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr('');
        setLoading(true);
        try {
            await login(email, password);
            nav('/');
        } catch (error: any) {
            setErr(error?.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '64px', paddingBottom: '64px' }}>
            <div className="form-card fade-in">
                <div className="form-title">
                    Welcome Back
                </div>
                <p className="form-subtitle">
                    Sign in to your TEDxMosul account
                </p>

                <form onSubmit={submit}>
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
                            placeholder="Enter your password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="form-input"
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    {err && (
                        <div className="alert alert-error fade-in">
                            ❌ {err}
                        </div>
                    )}

                    <button className="btn btn-primary btn-lg w-full" type="submit" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In →'}
                    </button>
                </form>

                <p className="form-footer">
                    Don't have an account? <Link to="/register">Create one</Link>
                </p>
            </div>
        </div>
    );
}

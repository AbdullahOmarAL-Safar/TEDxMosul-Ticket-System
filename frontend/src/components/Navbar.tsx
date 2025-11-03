import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
    const { token, role, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const nav = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Hide navbar on admin routes
    if (location.pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <nav className={scrolled ? 'scrolled' : ''}>
            <div className="nav-inner">
                <Link to="/" className="nav-brand">
                    <span>TED</span>x Mosul Tickets
                </Link>
                <div className="nav-links">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/speakers">Speakers</NavLink>
                    {token && <NavLink to="/my-tickets">My Tickets</NavLink>}
                    {(role === 'staff' || role === 'admin') && <NavLink to="/checkin">Check-in</NavLink>}
                    {role === 'admin' && (
                        <NavLink
                            to="/admin"
                            style={{
                                background: 'linear-gradient(135deg, #e62b1e 0%, #ff4444 100%)',
                                color: 'white',
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                fontWeight: '600'
                            }}
                        >
                            👑 Admin Panel
                        </NavLink>
                    )}

                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        className="theme-toggle-btn"
                        aria-label="Toggle dark mode"
                        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        {theme === 'light' ? (
                            // Moon icon for dark mode
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                            </svg>
                        ) : (
                            // Sun icon for light mode
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="5"></circle>
                                <line x1="12" y1="1" x2="12" y2="3"></line>
                                <line x1="12" y1="21" x2="12" y2="23"></line>
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                <line x1="1" y1="12" x2="3" y2="12"></line>
                                <line x1="21" y1="12" x2="23" y2="12"></line>
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                            </svg>
                        )}
                    </button>

                    {!token ? (
                        <NavLink to="/login">Login</NavLink>
                    ) : (
                        <button className="btn btn-sm btn-primary" onClick={() => { logout(); nav('/'); }}>
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}

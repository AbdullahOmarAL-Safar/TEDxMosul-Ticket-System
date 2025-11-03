import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Speaker } from '../types';
import './Speakers.css';

export default function Speakers() {
    const [speakers, setSpeakers] = useState<Speaker[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get<Speaker[]>('/speakers')
            .then(r => {
                setSpeakers(r.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div className="speakers-page">
            {/* Hero Banner Section with TEDxMosul Logo */}
            <section className="speakers-hero">
                <div className="speakers-hero-image-container">
                    {/* Replace with actual logo path: /logo/849e4936-0631-4391-888e-575b855210da.png */}
                    <img
                        src="/logo/tedxmosul-logo.png"
                        alt="TEDxMosul Logo"
                        className="speakers-hero-logo"
                        onError={(e) => {
                            // Fallback to text-based logo if image not found
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'block';
                        }}
                    />
                    <div className="speakers-hero-logo-fallback">
                        <h1 className="speakers-hero-tedx">
                            <span className="ted-text">TED</span>
                            <span className="x-text">x</span>
                            <span className="mosul-text">Mosul</span>
                        </h1>
                    </div>
                </div>
                <div className="speakers-hero-overlay"></div>
                <div className="speakers-hero-content">
                    <h2 className="speakers-hero-tagline">Ideas Worth Spreading</h2>
                </div>
            </section>

            {/* Page Title Section */}
            <section className="speakers-title-section">
                <div className="container">
                    <h1 className="speakers-main-title">Our Speakers</h1>
                    <p className="speakers-subtitle">
                        Meet the extraordinary minds behind the ideas that inspire change.
                        <br />
                        From innovators to visionaries, these speakers bring bold perspectives to TEDxMosul.
                    </p>
                </div>
            </section>

            {/* Speakers Grid Section */}
            <section className="speakers-grid-section">
                <div className="container">
                    {loading ? (
                        <div className="speakers-loading">
                            <div className="spinner" />
                            <p>Loading speakers...</p>
                        </div>
                    ) : speakers.length === 0 ? (
                        <div className="speakers-empty-state">
                            <div className="empty-icon">🎤</div>
                            <h3>No Speakers Announced Yet</h3>
                            <p>Our incredible speaker lineup will be revealed soon. Stay tuned!</p>
                        </div>
                    ) : (
                        <div className="speakers-grid">
                            {speakers.map((speaker, index) => (
                                <article
                                    key={speaker.id}
                                    className="speaker-card"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="speaker-card-inner">
                                        {/* Speaker Photo */}
                                        <div className="speaker-photo-wrapper">
                                            <img
                                                src={speaker.image_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'}
                                                alt={`${speaker.name} - TEDxMosul Speaker`}
                                                className="speaker-photo"
                                            />
                                            <div className="speaker-photo-border"></div>
                                        </div>

                                        {/* Speaker Info */}
                                        <div className="speaker-info">
                                            <h3 className="speaker-name">{speaker.name}</h3>

                                            {/* Event Badge */}
                                            <div className="speaker-event-badge">
                                                🎤 Speaker at: {speaker.event?.title || 'TEDxMosul'}
                                            </div>

                                            {/* Bio */}
                                            <p className="speaker-bio">
                                                {speaker.bio.length > 150
                                                    ? `${speaker.bio.substring(0, 150)}...`
                                                    : speaker.bio
                                                }
                                            </p>

                                            {/* Social Links (placeholder - extend Speaker type if needed) */}
                                            <div className="speaker-social">
                                                <a
                                                    href="#"
                                                    className="social-link"
                                                    aria-label={`${speaker.name}'s LinkedIn profile`}
                                                    onClick={(e) => e.preventDefault()}
                                                >
                                                    <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                                    </svg>
                                                </a>
                                                <a
                                                    href="#"
                                                    className="social-link"
                                                    aria-label={`${speaker.name}'s Twitter profile`}
                                                    onClick={(e) => e.preventDefault()}
                                                >
                                                    <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>

                                        {/* Hover Accent Line */}
                                        <div className="speaker-card-accent"></div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

import React from 'react';
import { Event } from '../types';
import { Link } from 'react-router-dom';

export default function EventCard({ e }: { e: Event }) {
    return (
        <div className="card fade-in">
            <img
                src={e.image_url || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200'}
                alt={e.title}
                className="card-image"
            />
            <div className="card-content">
                <h3 className="card-title">{e.title}</h3>
                <div className="card-text">
                    <div className="flex items-center gap-2 mb-2">
                        <strong>📅</strong> {new Date(e.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                        <strong>📍</strong> {e.location}
                    </div>
                    <div className="flex items-center gap-2">
                        <strong>🎫</strong> {e.available_seats} seats available
                    </div>
                </div>
                <div className="card-footer">
                    <Link to={`/events/${e.id}`} className="btn btn-primary w-full">
                        View Details →
                    </Link>
                </div>
            </div>
        </div>
    );
}

export type Role = 'user' | 'staff' | 'admin';

export interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
}

export interface Event {
    id: number;
    title: string;
    description: string;
    date: string;          // ISO
    location: string;
    image_url?: string;
    capacity: number;
    available_seats: number;
}

export interface Speaker {
    id: number;
    name: string;
    bio: string;
    image_url?: string;
    event: Event;
}

export interface Seat {
    row: string;
    number: number;
}

export interface Booking {
    id: number;
    status: 'pending' | 'approved' | 'rejected' | 'checked_in' | 'cancelled';
    ticket_code?: string | null;
    checked_in_at?: string | null;
    event: Event;
    seats?: Seat[];
    user?: User;
    created_at?: string;
}

export interface SeatsStatus {
    total: number;
    available: number;
    booked: string[];
}

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

export default function ProtectedRoute({
    children, roles,
}: { children: React.ReactNode; roles?: Role[] }) {
    const { token, role } = useAuth();
    if (!token) return <Navigate to="/login" replace />;
    if (roles && role && !roles.includes(role)) return <Navigate to="/" replace />;
    return <>{children}</>;
}

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import { Role, User } from '../types';

type AuthCtx = {
    user: User | null;
    role: Role | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
};

const Ctx = createContext<AuthCtx>({} as any);

function decodeJwt(token: string): any {
    try {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload));
    } catch { return null; }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
    const [user, setUser] = useState<User | null>(null);
    const role = (user?.role ?? (decodeJwt(token || '')?.role as Role)) || null;

    useEffect(() => {
        if (!token) return;
        const p = decodeJwt(token);
        if (p) setUser({ id: p.sub, name: p.name ?? 'User', email: p.email, role: p.role } as User);
    }, [token]);

    const login = useCallback(async (email: string, password: string) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.access_token);
        setToken(data.access_token);
    }, []);

    const register = useCallback(async (name: string, email: string, password: string) => {
        await api.post('/auth/register', { name, email, password });
        await login(email, password);
    }, [login]);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    }, []);

    const value = useMemo(() => ({ user, role, token, login, register, logout }), [user, role, token, login, register, logout]);
    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useAuth = () => useContext(Ctx);

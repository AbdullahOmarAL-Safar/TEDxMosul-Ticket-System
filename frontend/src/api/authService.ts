import api from './axios';

export type LoginResponse = {
    access_token: string;
    user: { id: number; name: string; email: string; role: string };
};

export async function login(email: string, password: string) {
    const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
    return data;
}

export async function register(name: string, email: string, password: string) {
    const { data } = await api.post('/auth/register', { name, email, password });
    return data;
}

export { };

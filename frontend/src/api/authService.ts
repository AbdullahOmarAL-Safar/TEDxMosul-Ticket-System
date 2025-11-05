import api from '../api/axios';
import { User } from '../types';

export interface LoginResponse {
    access_token: string;
    user: User;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export const authService = {
    /**
     * Login user
     */
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const { data } = await api.post<LoginResponse>('/auth/login', credentials);
        return data;
    },

    /**
     * Register new user
     */
    register: async (userData: RegisterRequest): Promise<{ message: string }> => {
        const { data } = await api.post<{ message: string }>('/auth/register', userData);
        return data;
    },
};

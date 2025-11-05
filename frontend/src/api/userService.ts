import api from '../api/axios';
import { User } from '../types';

export interface UpdateUserRoleRequest {
    role: 'user' | 'admin';
}

export interface UserBookingsInfo {
    user: User;
    totalBookings: number;
    approvedBookings: number;
    pendingBookings: number;
    checkedInBookings: number;
}

export const userService = {
    /**
     * Get all users (Admin only)
     */
    getAllUsers: async (): Promise<User[]> => {
        const { data } = await api.get<User[]>('/users');
        return data;
    },

    /**
     * Get user bookings info (Admin only)
     */
    getUserBookingsInfo: async (userId: number): Promise<UserBookingsInfo> => {
        const { data } = await api.get<UserBookingsInfo>(`/users/${userId}/bookings-info`);
        return data;
    },

    /**
     * Update user role (Admin only)
     */
    updateUserRole: async (userId: number, role: string): Promise<User> => {
        const { data } = await api.patch<User>(`/users/${userId}/role`, { role });
        return data;
    },

    /**
     * Delete user (Admin only)
     */
    deleteUser: async (userId: number): Promise<{ message: string; approvedBookingsCount: number }> => {
        const { data } = await api.delete<{ message: string; approvedBookingsCount: number }>(`/users/${userId}`);
        return data;
    },
};

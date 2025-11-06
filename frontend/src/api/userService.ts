import api from './axios';

export type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
};

export async function getUsers() {
    const { data } = await api.get<User[]>('/users');
    return data;
}

export async function updateUserRole(userId: number, role: 'admin' | 'staff' | 'user') {
    const { data } = await api.patch(`/users/${userId}/role`, { role });
    return data;
}

export async function getUserBookingsInfo(userId: number) {
    const { data } = await api.get<{ approvedBookingsCount: number }>(`/users/${userId}/bookings-info`);
    return data;
}

export async function deleteUser(userId: number) {
    const { data } = await api.delete<{ message: string; approvedBookingsCount: number }>(`/users/${userId}`);
    return data;
}

export { };

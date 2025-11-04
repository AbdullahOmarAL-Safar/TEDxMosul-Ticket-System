import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private repo: Repository<User>,
    ) { }

    async createUser(data: Partial<User>): Promise<User> {
        const user = this.repo.create(data);
        return this.repo.save(user);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.repo.findOne({ where: { email } });
    }

    async findAll(): Promise<User[]> {
        // Return users without password field
        return this.repo.find({
            select: ['id', 'name', 'email', 'role', 'created_at'],
            order: { created_at: 'DESC' },
        });
    }

    async updateRole(userId: number, role: string): Promise<User> {
        const user = await this.repo.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        user.role = role;
        return this.repo.save(user);
    }

    async deleteUser(userId: number): Promise<{ message: string; approvedBookingsCount: number }> {
        const user = await this.repo.findOne({
            where: { id: userId },
            relations: ['bookings'],
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Count approved bookings for confirmation
        const approvedBookingsCount = user.bookings?.filter(b => b.status === 'approved').length || 0;

        // Delete user (cascade will delete all bookings)
        await this.repo.remove(user);

        return {
            message: 'User deleted successfully',
            approvedBookingsCount,
        };
    }

    async getUserBookingsInfo(userId: number): Promise<{ approvedBookingsCount: number }> {
        const user = await this.repo.findOne({
            where: { id: userId },
            relations: ['bookings'],
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const approvedBookingsCount = user.bookings?.filter(b => b.status === 'approved').length || 0;
        return { approvedBookingsCount };
    }
}

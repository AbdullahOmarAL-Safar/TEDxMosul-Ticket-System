import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async register(name: string, email: string, password: string): Promise<User> {
        // Check if user already exists
        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) {
            throw new Error('Email already exists');
        }

        const hashed = await bcrypt.hash(password, 10);
        return this.usersService.createUser({ name, email, password: hashed });
    }

    async login(email: string, password: string): Promise<any> {
        console.log('🔍 Login attempt for:', email);
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            console.log('❌ User not found:', email);
            throw new Error('Invalid credentials');
        }

        console.log('✅ User found:', user.email, 'Role:', user.role);
        const match = await bcrypt.compare(password, user.password);
        console.log('🔐 Password match:', match);
        if (!match) {
            console.log('❌ Password mismatch for:', email);
            throw new Error('Invalid credentials');
        }

        const payload = { email: user.email, sub: user.id, role: user.role, name: user.name };
        return {
            access_token: this.jwtService.sign(payload),
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        };
    }
}

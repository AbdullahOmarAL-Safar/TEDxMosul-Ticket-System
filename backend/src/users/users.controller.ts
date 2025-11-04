import { Controller, Get, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    // Get all users (admin only)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    // Get user bookings info (admin only)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get(':id/bookings-info')
    getBookingsInfo(@Param('id') id: string) {
        return this.usersService.getUserBookingsInfo(+id);
    }

    // Update user role (admin only)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Patch(':id/role')
    updateRole(@Param('id') id: string, @Body('role') role: string) {
        return this.usersService.updateRole(+id, role);
    }

    // Delete user (admin only)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete(':id')
    deleteUser(@Param('id') id: string) {
        return this.usersService.deleteUser(+id);
    }
}

import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
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

    // Update user role (admin only)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Patch(':id/role')
    updateRole(@Param('id') id: string, @Body('role') role: string) {
        return this.usersService.updateRole(+id, role);
    }
}

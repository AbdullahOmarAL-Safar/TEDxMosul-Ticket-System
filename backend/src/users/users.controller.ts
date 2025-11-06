import { Controller, Get, Patch, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { UpdateUserRoleDto } from './dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    // Get current user profile
    @UseGuards(JwtAuthGuard)
    @Get('me')
    async me(@Req() req: any) {
        // req.user is set by JwtStrategy.validate
        const email = req.user?.email as string | undefined;
        if (!email) return { message: 'Unauthorized' };
        const user = await this.usersService.findByEmail(email);
        if (!user) return { message: 'Unauthorized' };
        const { password, ...safe } = user as any;
        return safe;
    }

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
    updateRole(@Param('id') id: string, @Body() dto: UpdateUserRoleDto) {
        return this.usersService.updateRole(+id, dto.role);
    }

    // Delete user (admin only)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete(':id')
    deleteUser(@Param('id') id: string) {
        return this.usersService.deleteUser(+id);
    }
}

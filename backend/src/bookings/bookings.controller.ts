import { Body, Controller, Get, Post, Patch, Delete, UseGuards, Req, Param } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@Controller('bookings')
export class BookingsController {
    constructor(private bookingsService: BookingsService) { }

    // حجز جديد (مستخدم مسجل فقط)
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() dto: CreateBookingDto, @Req() req: any) {
        const userId = req.user.userId; // من JwtStrategy.validate
        return this.bookingsService.create(userId, dto);
    }

    // حجوزاتي
    @UseGuards(JwtAuthGuard)
    @Get('me')
    findMine(@Req() req: any) {
        return this.bookingsService.findMy(req.user.userId);
    }

    // All bookings (admin only)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get()
    findAll() {
        return this.bookingsService.findAll();
    }

    // Check-in (admin/staff)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.Staff)
    @Post(':id/checkin')
    checkIn(@Param('id') id: string) {
        return this.bookingsService.checkIn(+id);
    }

    // Update booking (user can update their own booking)
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateBookingDto, @Req() req: any) {
        return this.bookingsService.update(+id, req.user.userId, dto);
    }

    // Cancel booking (user can cancel their own booking)
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    cancel(@Param('id') id: string, @Req() req: any) {
        return this.bookingsService.cancel(+id, req.user.userId);
    }
}

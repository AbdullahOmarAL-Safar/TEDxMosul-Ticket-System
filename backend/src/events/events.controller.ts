import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@Controller('events')
export class EventsController {
    constructor(private eventsService: EventsService) { }

    // عام للجميع
    @Get()
    findAll(@Query('search') search?: string) {
        return this.eventsService.findAll(search);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.eventsService.findOne(+id);
    }

    @Get(':id/seats')
    getSeats(@Param('id') id: string) {
        return this.eventsService.getSeatsStatus(+id);
    }

    // Admin only endpoints
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Post()
    create(@Body() dto: CreateEventDto) {
        return this.eventsService.create(dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Put(':id')
    update(@Param('id') id: string, @Body() body: Partial<CreateEventDto>) {
        return this.eventsService.update(+id, body as any);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.eventsService.remove(+id);
    }
}

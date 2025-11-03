import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { SpeakersService } from './speakers.service';
import { CreateSpeakerDto } from './dto/create-speaker.dto';
import { UpdateSpeakerDto } from './dto/update-speaker.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@Controller()
export class SpeakersController {
    constructor(private speakersService: SpeakersService) { }

    @Get('speakers')
    findAll(@Query('eventId') eventId?: string) {
        if (eventId) return this.speakersService.findByEvent(+eventId);
        return this.speakersService.findAll();
    }

    @Get('speakers/:id')
    findOne(@Param('id') id: string) {
        return this.speakersService.findOne(+id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Post('speakers')
    create(@Body() dto: CreateSpeakerDto) {
        return this.speakersService.create(dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Put('speakers/:id')
    update(@Param('id') id: string, @Body() dto: UpdateSpeakerDto) {
        return this.speakersService.update(+id, dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete('speakers/:id')
    remove(@Param('id') id: string) {
        return this.speakersService.remove(+id);
    }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Event } from '../events/event.entity';
import { EventsModule } from '../events/events.module';

@Module({
    imports: [TypeOrmModule.forFeature([Booking, Event]), EventsModule],
    providers: [BookingsService],
    controllers: [BookingsController],
})
export class BookingsModule { }

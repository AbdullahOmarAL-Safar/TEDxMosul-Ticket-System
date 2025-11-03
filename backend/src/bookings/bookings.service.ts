import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { Event } from '../events/event.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { EventsService } from '../events/events.service';

@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(Booking) private repo: Repository<Booking>,
        @InjectRepository(Event) private eventsRepo: Repository<Event>,
        private eventsService: EventsService,
    ) { }

    async create(userId: number, dto: CreateBookingDto) {
        // تحقق من عدم وجود حجز مسبق لنفس الحدث
        const exists = await this.repo.findOne({
            where: { user: { id: userId }, event: { id: dto.eventId } },
            relations: ['user', 'event'],
        });
        if (exists) throw new BadRequestException('You already booked this event');

        // Validate that seats are provided
        if (!dto.seats || dto.seats.length === 0) {
            throw new BadRequestException('At least one seat must be selected');
        }

        // Get all bookings for this event to check seat availability
        const allBookings = await this.repo.find({
            where: { event: { id: dto.eventId } },
            relations: ['event'],
        });

        // Extract all booked seats
        const bookedSeats = new Set<string>();
        allBookings.forEach((booking) => {
            if (booking.seats && Array.isArray(booking.seats)) {
                booking.seats.forEach((seat) => {
                    bookedSeats.add(`${seat.row}${seat.number}`);
                });
            }
        });

        // Check if any of the requested seats are already booked
        for (const seat of dto.seats) {
            const seatId = `${seat.row}${seat.number}`;
            if (bookedSeats.has(seatId)) {
                throw new BadRequestException(`Seat ${seatId} is already booked`);
            }
        }

        // Check available seats
        const event = await this.eventsRepo.findOne({ where: { id: dto.eventId } });
        if (!event) throw new NotFoundException('Event not found');

        if (event.available_seats < dto.seats.length) {
            throw new BadRequestException('Not enough available seats');
        }

        // Decrement available seats
        event.available_seats -= dto.seats.length;
        await this.eventsRepo.save(event);

        const booking = this.repo.create({
            user: { id: userId } as any,
            event: { id: dto.eventId } as any,
            seats: dto.seats,
            status: 'confirmed',
        });
        return this.repo.save(booking);
    }

    findMy(userId: number) {
        return this.repo.find({
            where: { user: { id: userId } },
            relations: ['event'],
            order: { created_at: 'DESC' },
        });
    }

    // للإدمن إن احتاج
    findAll() {
        return this.repo.find({ relations: ['user', 'event'] });
    }

    async checkIn(bookingId: number) {
        const b = await this.repo.findOne({ where: { id: bookingId }, relations: ['event', 'user'] });
        if (!b) throw new NotFoundException('Booking not found');
        if (b.status === 'checked_in') return b; // idempotent

        b.status = 'checked_in';
        b.checked_in_at = new Date();
        return this.repo.save(b);
    }

    // Update booking (only by owner)
    async update(bookingId: number, userId: number, updates: { status?: string }) {
        const booking = await this.repo.findOne({
            where: { id: bookingId },
            relations: ['user', 'event'],
        });

        if (!booking) throw new NotFoundException('Booking not found');

        // Check ownership
        if (booking.user.id !== userId) {
            throw new BadRequestException('You can only update your own bookings');
        }

        // Prevent updating already checked-in or cancelled bookings
        if (booking.status === 'checked_in') {
            throw new BadRequestException('Cannot update a checked-in booking');
        }

        if (updates.status) {
            booking.status = updates.status;
        }

        return this.repo.save(booking);
    }

    // Cancel booking (delete + restore seat)
    async cancel(bookingId: number, userId: number) {
        const booking = await this.repo.findOne({
            where: { id: bookingId },
            relations: ['user', 'event'],
        });

        if (!booking) throw new NotFoundException('Booking not found');

        // Check ownership
        if (booking.user.id !== userId) {
            throw new BadRequestException('You can only cancel your own bookings');
        }

        // Prevent cancelling checked-in bookings
        if (booking.status === 'checked_in') {
            throw new BadRequestException('Cannot cancel a checked-in booking');
        }

        // Restore seats to event
        const event = await this.eventsRepo.findOne({ where: { id: booking.event.id } });
        if (event) {
            const seatsToRestore = booking.seats?.length || 1;
            event.available_seats += seatsToRestore;
            await this.eventsRepo.save(event);
        }

        // Delete the booking
        await this.repo.remove(booking);

        return { message: 'Booking cancelled successfully' };
    }
}

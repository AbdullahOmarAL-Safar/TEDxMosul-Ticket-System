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

        // Note: Seats will be decremented upon admin approval, not immediately
        const booking = this.repo.create({
            user: { id: userId } as any,
            event: { id: dto.eventId } as any,
            seats: dto.seats,
            status: 'pending', // Awaiting admin approval
            ticket_code: undefined, // Will be generated after approval
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

        // Check if booking is approved
        if (b.status === 'pending') {
            throw new BadRequestException('Booking is pending admin approval');
        }
        if (b.status === 'rejected') {
            throw new BadRequestException('Booking was rejected');
        }
        if (b.status === 'cancelled') {
            throw new BadRequestException('Booking was cancelled');
        }
        if (b.status === 'checked_in') return b; // idempotent

        b.status = 'checked_in';
        b.checked_in_at = new Date();
        return this.repo.save(b);
    }

    // Verify booking by ticket code (for QR scanner)
    async verifyByTicketCode(ticketCode: string) {
        const booking = await this.repo.findOne({
            where: { ticket_code: ticketCode },
            relations: ['event', 'user'],
        });

        if (!booking) throw new NotFoundException('Invalid ticket code');

        return booking;
    }

    // Check-in by ticket code
    async checkInByTicketCode(ticketCode: string) {
        const booking = await this.verifyByTicketCode(ticketCode);
        return this.checkIn(booking.id);
    }

    // Approve booking (admin only)
    async approve(bookingId: number) {
        const booking = await this.repo.findOne({
            where: { id: bookingId },
            relations: ['event', 'user'],
        });

        if (!booking) throw new NotFoundException('Booking not found');

        if (booking.status !== 'pending') {
            throw new BadRequestException(`Booking is already ${booking.status}`);
        }

        // Check if event still has available seats
        const event = await this.eventsRepo.findOne({ where: { id: booking.event.id } });
        if (!event) throw new NotFoundException('Event not found');

        const seatsNeeded = booking.seats?.length || 1;
        if (event.available_seats < seatsNeeded) {
            throw new BadRequestException('Not enough available seats to approve this booking');
        }

        // Decrement available seats upon approval
        event.available_seats -= seatsNeeded;
        await this.eventsRepo.save(event);

        // Generate unique ticket code (TEDX-xxxxxx)
        const { v4: uuidv4 } = require('uuid');
        const ticketCode = `TEDX-${uuidv4().substring(0, 6).toUpperCase()}`;

        booking.status = 'approved';
        booking.ticket_code = ticketCode;

        return this.repo.save(booking);
    }

    // Reject booking (admin only)
    async reject(bookingId: number) {
        const booking = await this.repo.findOne({
            where: { id: bookingId },
            relations: ['event', 'user'],
        });

        if (!booking) throw new NotFoundException('Booking not found');

        if (booking.status !== 'pending') {
            throw new BadRequestException(`Booking is already ${booking.status}`);
        }

        booking.status = 'rejected';

        // Restore seats to event when rejecting
        const event = await this.eventsRepo.findOne({ where: { id: booking.event.id } });
        if (event) {
            const seatsToRestore = booking.seats?.length || 1;
            event.available_seats += seatsToRestore;
            await this.eventsRepo.save(event);
        }

        return this.repo.save(booking);
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

    // Cancel booking (delete + restore seat if approved)
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

        // Restore seats to event only if booking was approved (seats were already decremented)
        if (booking.status === 'approved') {
            const event = await this.eventsRepo.findOne({ where: { id: booking.event.id } });
            if (event) {
                const seatsToRestore = booking.seats?.length || 1;
                event.available_seats += seatsToRestore;
                await this.eventsRepo.save(event);
            }
        }
        // For pending bookings, seats were never decremented, so no need to restore

        // Delete the booking
        await this.repo.remove(booking);

        return { message: 'Booking cancelled successfully' };
    }
}

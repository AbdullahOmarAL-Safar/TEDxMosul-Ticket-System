import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
    constructor(@InjectRepository(Event) private repo: Repository<Event>) { }

    async create(dto: CreateEventDto) {
        const e = this.repo.create({
            ...dto,
            date: new Date(dto.date),
            available_seats: dto.capacity,
        });
        return this.repo.save(e);
    }

    findAll(search?: string) {
        if (search) return this.repo.find({ where: { title: ILike(`%${search}%`) } });
        return this.repo.find();
    }

    async findOne(id: number) {
        const e = await this.repo.findOne({ where: { id } });
        if (!e) throw new NotFoundException('Event not found');
        return e;
    }

    async update(id: number, data: Partial<Event>) {
        const e = await this.findOne(id);
        Object.assign(e, data);
        if (data.capacity !== undefined && data.capacity < e.bookings?.length!) {
            throw new BadRequestException('Capacity cannot be less than current bookings');
        }
        return this.repo.save(e);
    }

    async remove(id: number) {
        const e = await this.repo.findOne({
            where: { id },
            relations: ['bookings', 'speakers'],
        });
        if (!e) throw new NotFoundException('Event not found');
        await this.repo.remove(e);
        return { message: 'Event deleted successfully' };
    }

    async decrementSeat(eventId: number) {
        const e = await this.findOne(eventId);
        if (e.available_seats <= 0) throw new BadRequestException('Event is full');
        e.available_seats -= 1;
        await this.repo.save(e);
    }

    async getSeatsStatus(eventId: number) {
        const event = await this.repo.findOne({
            where: { id: eventId },
            relations: ['bookings'],
        });

        if (!event) throw new NotFoundException('Event not found');

        // Extract all booked seats from bookings
        const bookedSeats: string[] = [];
        if (event.bookings) {
            event.bookings.forEach((booking: any) => {
                if (booking.seats && Array.isArray(booking.seats)) {
                    booking.seats.forEach((seat: { row: string; number: number }) => {
                        bookedSeats.push(`${seat.row}${seat.number}`);
                    });
                }
            });
        }

        return {
            total: event.capacity,
            available: event.available_seats,
            booked: bookedSeats,
        };
    }
}

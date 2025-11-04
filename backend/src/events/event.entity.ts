import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Booking } from '../bookings/booking.entity';
import { Speaker } from '../speakers/speaker.entity';

@Entity('events')
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column({ type: 'timestamp' })
    date: Date;

    @Column()
    location: string;

    @Column({ nullable: true })
    image_url: string;

    @Column({ default: 0 })
    capacity: number;

    @Column({ default: 0 })
    available_seats: number;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => Booking, (booking) => booking.event, { cascade: true })
    bookings: Booking[];

    @OneToMany(() => Speaker, (speaker) => speaker.event, { cascade: true })
    speakers: Speaker[];
}

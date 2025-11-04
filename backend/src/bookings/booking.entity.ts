import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Index, Column } from 'typeorm';
import { User } from '../users/user.entity';
import { Event } from '../events/event.entity';

@Entity('bookings')
@Index('uniq_user_event', ['user', 'event'], { unique: true })
export class Booking {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.bookings, { eager: false })
    user: User;

    @ManyToOne(() => Event, (event) => event.bookings, { eager: false, onDelete: 'CASCADE' })
    event: Event;

    @Column({ type: 'jsonb', default: '[]' })
    seats: { row: string; number: number }[];

    @Column({ default: 'pending' })
    status: string; // pending | approved | rejected | checked_in | cancelled

    @Column({ nullable: true })
    ticket_code: string; // Generated after admin approval (TEDX-xxxxxx)

    @Column({ type: 'timestamp', nullable: true })
    checked_in_at: Date;

    @CreateDateColumn()
    created_at: Date;
}

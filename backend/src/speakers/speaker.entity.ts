import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Event } from '../events/event.entity';

@Entity('speakers')
export class Speaker {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('text')
    bio: string;

    @Column({ nullable: true })
    image_url: string;

    @ManyToOne(() => Event, (event) => event.speakers, { onDelete: 'CASCADE' })
    event: Event;

    @CreateDateColumn()
    created_at: Date;
}

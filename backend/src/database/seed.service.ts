import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../events/event.entity';
import { User } from '../users/user.entity';
import { Speaker } from '../speakers/speaker.entity';
import { Role } from '../auth/role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnModuleInit {
    constructor(
        @InjectRepository(Event) private eventRepo: Repository<Event>,
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(Speaker) private speakerRepo: Repository<Speaker>,
    ) { }

    async onModuleInit() {
        await this.seedData();
    }

    private async seedData() {
        console.log('🌱 Checking database seed status...');

        // Always ensure admin user exists
        const adminExists = await this.userRepo.findOne({ where: { email: 'admin@tedxmosul.com' } });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const admin = this.userRepo.create({
                name: 'Admin User',
                email: 'admin@tedxmosul.com',
                password: hashedPassword,
                role: Role.Admin,
            });
            await this.userRepo.save(admin);
            console.log('✅ Admin user created: admin@tedxmosul.com / admin123');
        } else {
            console.log('✅ Admin user already exists');
        }

        // Check if sample data already exists
        const eventCount = await this.eventRepo.count();
        const speakerCount = await this.speakerRepo.count();

        if (eventCount > 0 && speakerCount > 0) {
            console.log('✅ Sample events and speakers already seeded');
            return;
        }

        console.log('🌱 Seeding sample data...');

        // Create sample events
        if (eventCount === 0) {
            const sampleEvents = [
                {
                    title: 'Innovation in Technology',
                    description: 'Explore the latest innovations in technology and how they are shaping our future. Join leading experts as they discuss AI, machine learning, and the digital revolution.',
                    date: new Date('2025-12-15T18:00:00'),
                    location: 'Mosul University Auditorium',
                    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
                    capacity: 150,
                    available_seats: 150,
                },
                {
                    title: 'The Future of Education',
                    description: 'Discover how education is evolving in the digital age. Learn about innovative teaching methods, online learning platforms, and the role of technology in shaping future generations.',
                    date: new Date('2025-12-20T17:00:00'),
                    location: 'Mosul Cultural Center',
                    image_url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800',
                    capacity: 120,
                    available_seats: 120,
                },
                {
                    title: 'Sustainability & Climate Action',
                    description: 'Join us for an inspiring conversation about sustainability, climate change, and the actions we can take to protect our planet. Hear from environmental activists and researchers.',
                    date: new Date('2026-01-10T16:30:00'),
                    location: 'Ninawa Convention Hall',
                    image_url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800',
                    capacity: 200,
                    available_seats: 200,
                },
                {
                    title: 'Art & Creativity in Modern Times',
                    description: 'Experience the intersection of art, creativity, and innovation. Explore how artists are using technology to create new forms of expression and engage audiences worldwide.',
                    date: new Date('2026-01-25T19:00:00'),
                    location: 'Mosul Fine Arts Gallery',
                    image_url: 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=800',
                    capacity: 80,
                    available_seats: 80,
                },
                {
                    title: 'Entrepreneurship & Startups',
                    description: 'Learn from successful entrepreneurs about building startups, overcoming challenges, and creating innovative business solutions in emerging markets.',
                    date: new Date('2026-02-05T18:30:00'),
                    location: 'Mosul Business Hub',
                    image_url: 'https://images.unsplash.com/photo-1559223607-a43c990c1fec?w=800',
                    capacity: 100,
                    available_seats: 100,
                },
                {
                    title: 'Healthcare Innovation',
                    description: 'Discover breakthrough innovations in healthcare, from telemedicine to AI-powered diagnostics. Hear from medical professionals and tech innovators.',
                    date: new Date('2026-02-18T17:30:00'),
                    location: 'Mosul Medical Complex',
                    image_url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
                    capacity: 130,
                    available_seats: 130,
                },
            ];

            for (const eventData of sampleEvents) {
                const event = this.eventRepo.create(eventData);
                await this.eventRepo.save(event);
            }

            console.log(`🎉 Created ${sampleEvents.length} sample events`);
        }

        // Create sample speakers
        if (speakerCount === 0) {
            const events = await this.eventRepo.find();

            if (events.length > 0) {
                const sampleSpeakers = [
                    // Speakers for Innovation in Technology
                    {
                        name: 'Dr. Sarah Al-Najjar',
                        bio: 'AI researcher and tech entrepreneur with over 15 years of experience in machine learning and artificial intelligence. Former lead scientist at major tech companies, now dedicated to bringing innovative solutions to emerging markets.',
                        image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
                        event: events[0],
                    },
                    {
                        name: 'Omar Hassan',
                        bio: 'Software architect and open-source advocate who has contributed to major projects worldwide. Passionate about democratizing technology and making it accessible to everyone.',
                        image_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
                        event: events[0],
                    },
                    // Speakers for The Future of Education
                    {
                        name: 'Prof. Layla Mahmoud',
                        bio: 'Education innovator and university professor specializing in digital learning methodologies. Has trained thousands of educators across the Middle East in modern teaching techniques.',
                        image_url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400',
                        event: events[1],
                    },
                    {
                        name: 'Ahmed Al-Rashid',
                        bio: 'EdTech founder who built one of the region\'s most successful online learning platforms. Believes education is the key to transforming societies and empowering youth.',
                        image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
                        event: events[1],
                    },
                    // Speakers for Sustainability & Climate Action
                    {
                        name: 'Dr. Noor Al-Din',
                        bio: 'Environmental scientist and climate activist working on sustainable solutions for urban development. Leading research on renewable energy adoption in developing nations.',
                        image_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
                        event: events[2],
                    },
                    {
                        name: 'Karim Youssef',
                        bio: 'Green entrepreneur and founder of multiple eco-friendly startups. Advocate for circular economy principles and sustainable business practices in the Middle East.',
                        image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
                        event: events[2],
                    },
                    // Speakers for Art & Creativity
                    {
                        name: 'Amira Khalil',
                        bio: 'Digital artist and creative director who blends traditional Middle Eastern art with cutting-edge technology. Her work has been exhibited in galleries worldwide.',
                        image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
                        event: events[3],
                    },
                    {
                        name: 'Fadi Mansour',
                        bio: 'Multimedia artist and VR pioneer creating immersive experiences that tell stories of culture and heritage. Pushing boundaries between art and technology.',
                        image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
                        event: events[3],
                    },
                    // Speakers for Entrepreneurship & Startups
                    {
                        name: 'Rania Ibrahim',
                        bio: 'Serial entrepreneur and startup mentor who has built and sold three successful companies. Now focuses on supporting the next generation of Middle Eastern entrepreneurs.',
                        image_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
                        event: events[4],
                    },
                    {
                        name: 'Hassan Badawi',
                        bio: 'Venture capitalist and business strategist helping startups scale in emerging markets. Known for his innovative approach to funding and mentoring early-stage companies.',
                        image_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
                        event: events[4],
                    },
                    // Speakers for Healthcare Innovation
                    {
                        name: 'Dr. Zainab Ahmed',
                        bio: 'Medical doctor and health-tech innovator developing AI-powered diagnostic tools for underserved communities. Pioneer in telemedicine solutions for remote areas.',
                        image_url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
                        event: events[5],
                    },
                    {
                        name: 'Dr. Mustafa Salim',
                        bio: 'Biomedical engineer and researcher working on breakthrough medical devices. Passionate about making healthcare technology affordable and accessible globally.',
                        image_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
                        event: events[5],
                    },
                ];

                for (const speakerData of sampleSpeakers) {
                    const speaker = this.speakerRepo.create(speakerData);
                    await this.speakerRepo.save(speaker);
                }

                console.log(`🎤 Created ${sampleSpeakers.length} sample speakers`);
            }
        }

        console.log('✅ Database seeding completed');
    }
}

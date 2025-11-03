import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Event } from '../events/event.entity';
import { User } from '../users/user.entity';
import { Speaker } from '../speakers/speaker.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Event, User, Speaker])],
    providers: [SeedService],
    exports: [SeedService],
})
export class DatabaseModule { }

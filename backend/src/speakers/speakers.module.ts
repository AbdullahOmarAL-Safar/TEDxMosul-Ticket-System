import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Speaker } from './speaker.entity';
import { SpeakersService } from './speakers.service';
import { SpeakersController } from './speakers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Speaker])],
  providers: [SpeakersService],
  controllers: [SpeakersController],
})
export class SpeakersModule { }

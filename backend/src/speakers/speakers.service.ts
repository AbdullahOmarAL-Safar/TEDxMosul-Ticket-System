import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Speaker } from './speaker.entity';
import { CreateSpeakerDto } from './dto/create-speaker.dto';
import { UpdateSpeakerDto } from './dto/update-speaker.dto';

@Injectable()
export class SpeakersService {
    constructor(@InjectRepository(Speaker) private repo: Repository<Speaker>) { }

    create(dto: CreateSpeakerDto) {
        const sp = this.repo.create({
            name: dto.name,
            bio: dto.bio,
            image_url: dto.image_url,
            event: { id: dto.eventId } as any,
        });
        return this.repo.save(sp);
    }

    findAll() {
        return this.repo.find({ relations: ['event'] });
    }

    findByEvent(eventId: number) {
        return this.repo.find({ where: { event: { id: eventId } }, relations: ['event'] });
    }

    async findOne(id: number) {
        const sp = await this.repo.findOne({ where: { id }, relations: ['event'] });
        if (!sp) throw new NotFoundException('Speaker not found');
        return sp;
    }

    async update(id: number, dto: UpdateSpeakerDto) {
        const sp = await this.findOne(id);
        if (dto.eventId) (sp as any).event = { id: dto.eventId };
        Object.assign(sp, { ...dto, eventId: undefined });
        return this.repo.save(sp);
    }

    async remove(id: number) {
        const sp = await this.findOne(id);
        await this.repo.remove(sp);
        return { message: 'Speaker deleted' };
    }
}

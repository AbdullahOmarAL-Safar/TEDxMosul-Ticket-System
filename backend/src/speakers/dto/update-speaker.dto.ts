import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateSpeakerDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    image_url?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    eventId?: number;
}

import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateSpeakerDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    bio: string;

    @IsOptional()
    @IsString()
    image_url?: string;

    @IsInt()
    @Min(1)
    eventId: number;
}

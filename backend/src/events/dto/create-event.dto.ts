import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Min, Max } from 'class-validator';

export class CreateEventDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsDateString()
    date: string; // ISO string

    @IsString()
    @IsNotEmpty()
    location: string;

    @IsOptional()
    @IsString()
    image_url?: string;

    @IsInt()
    @Min(1, { message: 'Capacity must be at least 1' })
    @Max(1000, { message: 'Maximum allowed capacity is 1000 seats' })
    capacity: number;
}

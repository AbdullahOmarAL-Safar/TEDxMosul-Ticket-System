import { IsOptional, IsEnum } from 'class-validator';

export class UpdateBookingDto {
    @IsOptional()
    @IsEnum(['confirmed', 'cancelled'])
    status?: string;
}

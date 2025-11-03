import { IsInt, Min, IsArray, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class SeatDto {
    @IsString()
    row: string;

    @IsInt()
    @Min(1)
    number: number;
}

export class CreateBookingDto {
    @Type(() => Number) // Auto-convert string to number
    @IsInt()
    @Min(1)
    eventId: number; // سنأخذ userId من التوكن

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SeatDto)
    seats: SeatDto[];
}

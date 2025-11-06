import { Expose } from 'class-transformer';

export class UserResponseDto {
    @Expose()
    id!: number;

    @Expose()
    name!: string;

    @Expose()
    email!: string;

    @Expose()
    role!: string;

    @Expose({ name: 'created_at' })
    createdAt!: Date;
}

export default UserResponseDto;

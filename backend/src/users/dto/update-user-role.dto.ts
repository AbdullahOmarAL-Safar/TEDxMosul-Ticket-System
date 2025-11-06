import { IsIn } from 'class-validator';

export class UpdateUserRoleDto {
    @IsIn(['admin', 'staff', 'user'])
    role!: 'admin' | 'staff' | 'user';
}

export default UpdateUserRoleDto;

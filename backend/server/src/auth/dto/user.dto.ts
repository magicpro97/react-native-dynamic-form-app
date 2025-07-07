import { Role } from '../../entities/user.entity';

export class UserDto {
  id: string;
  username: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

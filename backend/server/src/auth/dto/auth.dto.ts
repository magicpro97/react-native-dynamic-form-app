import { IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { Role } from '../../entities/user.entity';

export class AuthDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}

// Export default as well for compatibility
export default AuthDto;

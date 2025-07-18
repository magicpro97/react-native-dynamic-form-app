import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, Role } from '../entities/user.entity';
import { UserDto } from './dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  register = async (
    username: string,
    pass: string,
    role: string = Role.USER,
  ): Promise<UserDto> => {
    const existingUser = await this.userRepo.findOne({ where: { username } });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }
    let userRole: Role = Role.USER;
    if (role && Object.values(Role).includes(role as Role)) {
      userRole = role as Role;
    }
    const user = this.userRepo.create({ username, password: pass, role: userRole });
    const savedUser = await this.userRepo.save(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, hashPassword, ...result } = savedUser;
    return result as UserDto;
  };

  login = async (
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> => {
    const user = await this.userRepo.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, username: user.username, role: user.role };
    const sign = this.jwtService.sign.bind(this.jwtService);
    return {
      access_token: sign(payload),
    };
  };
}

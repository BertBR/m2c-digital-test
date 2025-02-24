import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,
  ) { }

  async validateUser(entry: string, password: string): Promise<User | null> {
    try {
      const user = await this.userService.findOneByEmail(entry);
      if (!user) {
          throw new NotFoundException('User not found');
      }

      const isMatch = await this.comparePasswordToHash(password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid username or password');
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async login(uuid: string): Promise<string> {
    const payload = { uuid };
    const jwt = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: parseInt(this.configService.get('JWT_EXPIRES_TIME') || '3600'),
    });

    return jwt;
  }

  private async comparePasswordToHash(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }


}

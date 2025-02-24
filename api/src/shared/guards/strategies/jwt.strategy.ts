import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-jwt';
import { UserService } from '../../../users/user.service';
import { JwtToken } from '../../types';
import { GetUserResponseDTO } from '../../dtos/get-user-response.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: new ConfigService().get('JWT_SECRET')!,
      passReqToCallback: true
    });
  }

  async validate(request: Request, jwt: JwtToken): Promise<GetUserResponseDTO> {
    const token = request.headers.authorization;
    if (!token) {
      throw new ForbiddenException('No token provided');
    }

    const user = await this.userService.findOne(jwt.uuid);

    return {  
      email: user.email,
      isAdmin: user.is_admin,
      createdAt: user.created_at.toISOString(),
      updatedAt: user.updated_at.toISOString(),
      external_id: user.external_id,
    };
  }
}

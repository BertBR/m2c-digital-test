import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { UserModule } from '../users/user.module';
import { AuthController } from './auth.controller';
import { JwtStrategy } from '../shared/guards/strategies/jwt.strategy';
import { LocalStrategy } from '../shared/guards/strategies/local.strategy';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secretOrPrivateKey: config.get('JWT_SECRET'),
        signOptions: { expiresIn: +config.get('JWT_EXPIRES_TIME') },
      }),
      inject: [ConfigService],
    }),
    HttpModule,
  ],
  providers: [
    AuthService,
    JwtService,
    LocalStrategy,
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}

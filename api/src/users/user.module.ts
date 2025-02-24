import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UserService } from './user.service';
import { UserController } from './user.controller';

import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
  ],
  controllers: [UserController],
  providers: [JwtService, UserService],
  exports: [UserService],
})
export class UserModule { }

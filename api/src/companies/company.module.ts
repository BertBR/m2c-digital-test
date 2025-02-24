import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';

import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
  ],
  controllers: [CompanyController],
  providers: [JwtService, CompanyService],
})
export class CompanyModule { }

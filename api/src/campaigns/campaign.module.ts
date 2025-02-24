import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';

import { HttpModule } from '@nestjs/axios';
import { ProducerService } from '../shared/producer.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
  ],
  controllers: [CampaignController],
  providers: [JwtService, CampaignService, ProducerService],
})
export class CampaignModule { }

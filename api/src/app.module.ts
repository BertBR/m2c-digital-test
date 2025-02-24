import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './companies/company.module';
import { CampaignModule } from './campaigns/campaign.module';

@Module({
  imports: [UserModule, AuthModule, CompanyModule, CampaignModule],
  controllers: [],
  providers: [],
})
export class AppModule{}
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCampaignDTO {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Campaign name',
  })
  @IsString()
  name: string;

}

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCompanyDTO {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Company name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'A valid document',
  })
  @IsString()
  document: string;

}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail,IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'A valid email',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'A valid password',
  })
  @IsString()
  password: string;

}

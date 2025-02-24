import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { Request } from 'express';
import { GetUserResponseDTO } from '../../users/dtos/get-user-response.dto';

export class LogInRequestDTO {
  @ApiProperty({
    required: true,
    description: 'A valid email',
    example: 'admin@admin.com'
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    description: 'A valid password',
    example: 'admin'
  })
  @IsString()
  password: string;
}

export type ExpressRequestWithAuthedUser<T> = Request & { user: GetUserResponseDTO, body: T };

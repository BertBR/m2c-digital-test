import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard'
import { ResponseDTO } from '../shared/dtos/response.dto';
import { ExpressRequestWithPermission } from '../shared/types';
import { PermissionGuard } from '../shared/guards/permission.guard';
import { GetUserResponseDTO } from './dtos/get-user-response.dto';
import { User } from './user.entity';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(
    private userService: UserService,
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Create an user',
  })
  @ApiBody({ type: CreateUserDto })
  async create(
    @Body() payload: CreateUserDto,
  ): Promise<ResponseDTO<GetUserResponseDTO>> {
    const data = {
      email: payload.email,
      password: payload.password,
    };

    const user = await this.userService.create(data);
    return {
      data: {
        email: user.email,
        createdAt: user.created_at.toISOString(),
        updatedAt: user.updated_at.toISOString(),
        external_id: user.external_id,
        deleted: user.deleted
      },
    };
  }


  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    description: 'Get all users',
  })
  async getAll(): Promise<ResponseDTO<GetUserResponseDTO[]>> {
    const users = await this.userService.findAll();
    return {
      data: users.map((user: User) => ({
        email: user.email,
        createdAt: user.created_at.toISOString(),
        updatedAt: user.updated_at.toISOString(),
        external_id: user.external_id,
        deleted: user.deleted
      })),
    };
  }


  @Delete(':email')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @ApiCreatedResponse({
    description: 'Delete an user',
  })
  @ApiParam({ name: 'email', type: String })
  @ApiBearerAuth()
  async delete(@Param('email') email: string): Promise<ResponseDTO<boolean>> {
    const res = await this.userService.deleteUser(email);
    return {
      data: !!res,
    };
  }

  @Get(':email')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @ApiCreatedResponse({
    description: 'Get an user',
  })
  @ApiParam({ name: 'email', type: String })
  @ApiBearerAuth()
  async getOne(
    @Request() request: ExpressRequestWithPermission,
  ): Promise<ResponseDTO<GetUserResponseDTO>> {
    const user = await this.userService.findOneByEmail(
      request.params.email,
    );
    return {
      data: {
        email: user.email,
        createdAt: user.created_at.toISOString(),
        updatedAt: user.updated_at.toISOString(),
        external_id: user.external_id,
        deleted: user.deleted
      },
    };
  }

}

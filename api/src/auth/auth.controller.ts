import {
  Controller,
  HttpCode,
  HttpStatus,
  Injectable,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { LocalAuthGuard } from '../shared/guards/local-auth.guard';
import { AuthService } from './auth.service';
import {
  ExpressRequestWithAuthedUser,
  LogInRequestDTO,
} from './dtos/login.request.dto';
import { LoginResponseDTO } from './dtos/login.response.dto';

@Injectable()
@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) { }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    description: 'Log in',
  })
  @ApiBody({ type: LogInRequestDTO })
  async login(
    @Req() request: ExpressRequestWithAuthedUser<LogInRequestDTO>,
  ): Promise<LoginResponseDTO> {
    const { user } = request;

    const jwt = await this.authService.login(user.external_id);

    return {
      data: {
        token: jwt,
        id: user.external_id,
      },
    };
  }
}

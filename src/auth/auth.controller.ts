import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { ResponseMessage } from 'src/common/decorators';
import {
  AUTHENTICATED,
  USER_REGISTERED,
  USER_VERIFIED,
} from './constants/messages';
import { LoginDTO, RegisterUserDTO } from './dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ResponseMessage(USER_REGISTERED)
  registerUser(@Body() registerUserDTO: RegisterUserDTO, @Req() req) {
    return this.authService.registerUser(registerUserDTO, req);
  }

  @Get(':token/verify')
  @ApiOperation({ summary: 'User verification' })
  @ResponseMessage(USER_VERIFIED)
  verifyUser(@Param('token') token: string) {
    return this.authService.verifyUser(token);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ResponseMessage(AUTHENTICATED)
  login(@Body() loginDTO: LoginDTO) {
    return this.authService.loginUser(loginDTO);
  }
}

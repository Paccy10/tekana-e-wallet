import { Body, Controller, Post, Req } from '@nestjs/common';

import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/common/decorators';
import { USER_REGISTERED } from './constants/messages';
import { RegisterUserDTO } from './dto';

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
}

import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/guards';
import { UserService } from './user.service';
import { ResponseMessage } from 'src/common/decorators';
import { FilterDTO } from 'src/common/dto';
import { USERS_FETCHED, USER_FETCHED } from './constants/messages';
import { UserSerializer } from './user.serializer';

@Controller('users')
@ApiTags('Users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('')
  @ApiOperation({ summary: 'Get users' })
  @ResponseMessage(USERS_FETCHED)
  async getUsers(@Query() filterDTO: FilterDTO) {
    return this.userService.getUsers(filterDTO);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user' })
  @ResponseMessage(USER_FETCHED)
  async getUser(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const user = await this.userService.getUserById(id);
    return new UserSerializer(user);
  }
}

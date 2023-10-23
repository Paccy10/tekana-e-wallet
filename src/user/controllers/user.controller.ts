import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards';
import { UserService } from '../services/user.service';
import { ResponseMessage } from '../../common/decorators';
import { FilterDTO } from '../../common/dto';
import { USERS_FETCHED, USER_FETCHED } from '../constants/messages';
import { UserSerializer } from '../serializers';
import { WALLET_FETCHED } from '../../wallet/constants/messages';
import { WalletSerializer } from '../../wallet/serializers';

@Controller('users')
@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
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

  @Get(':id/wallet')
  @ApiOperation({ summary: 'Get user wallet' })
  @ResponseMessage(WALLET_FETCHED)
  async getUserWallet(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    const wallet = await this.userService.getUserWallet(id);
    return new WalletSerializer(wallet);
  }
}

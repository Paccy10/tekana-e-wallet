import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/guards';
import { WalletService } from '../services';
import { ResponseMessage } from 'src/common/decorators';
import {
  WALLETS_FETCHED,
  WALLET_CREATED,
  WALLET_FETCHED,
} from '../constants/messages';
import { CreateWalletDTO } from '../dto';
import { GetUser } from 'src/auth/decorators';
import { FilterDTO } from 'src/common/dto';
import { WalletSerializer } from '../serializers';

@Controller('wallets')
@ApiTags('Wallets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Post('')
  @ApiOperation({ summary: 'Create a new wallet' })
  @ResponseMessage(WALLET_CREATED)
  async createWallet(
    @Body() createWalletDTO: CreateWalletDTO,
    @GetUser() user,
  ) {
    return this.walletService.createWallet(createWalletDTO, user);
  }

  @Get('')
  @ApiOperation({ summary: 'Get wallets' })
  @ResponseMessage(WALLETS_FETCHED)
  async getWallets(@Query() filterDTO: FilterDTO) {
    return this.walletService.getWallets(filterDTO);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get wallet' })
  @ResponseMessage(WALLET_FETCHED)
  async getWallet(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    const wallet = await this.walletService.getWallet(id);
    return new WalletSerializer(wallet);
  }
}

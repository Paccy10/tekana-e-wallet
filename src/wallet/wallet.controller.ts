import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/guards';
import { WalletService } from './wallet.service';
import { ResponseMessage } from 'src/common/decorators';
import { WALLET_CREATED } from './constants';
import { CreateWalletDTO } from './dto';
import { GetUser } from 'src/auth/decorators';

@Controller('wallets')
@ApiTags('Users')
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
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { Wallet } from './wallet.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet]), UserModule],
  providers: [WalletService],
  controllers: [WalletController],
})
export class WalletModule {}

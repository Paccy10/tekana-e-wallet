import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WalletService } from './services/wallet.service';
import { TransactionController, WalletController } from './controllers';
import { Transaction, Wallet } from './entities';
import { UserModule } from '../user/user.module';
import { TransactionService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Transaction]), UserModule],
  providers: [WalletService, TransactionService],
  controllers: [WalletController, TransactionController],
})
export class WalletModule {}

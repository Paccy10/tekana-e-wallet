import { Type, Exclude } from 'class-transformer';

import { WalletUserSerializer } from './';
import { BaseSerializer } from 'src/common/serializers';
import { TransactionStatus, TransactionType } from '../constants/enums';

export class TransactionWalletSerializer extends BaseSerializer {
  @Type(() => WalletUserSerializer)
  user: WalletUserSerializer;

  active: boolean;
  balance: number;

  @Exclude()
  pin: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  version: number;
}

export class TransactionSerializer extends BaseSerializer {
  @Type(() => TransactionWalletSerializer)
  wallet: TransactionWalletSerializer;

  type: TransactionType;
  amount: number;
  status: TransactionStatus;
}

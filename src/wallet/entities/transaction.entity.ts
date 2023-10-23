import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { AppBaseEntity } from '../../common/entities';
import { Wallet } from './';
import { TransactionStatus, TransactionType } from '../constants/enums';

@Entity('transactions')
@Index('transaction_walletPkid_index', ['wallet'])
export class Transaction extends AppBaseEntity {
  @ManyToOne(() => Wallet, (wallet) => wallet.pkid, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  wallet: Wallet;

  @Column('varchar', { length: 50, nullable: false })
  type: TransactionType;

  @Column('decimal', { nullable: false, precision: 10, scale: 2 })
  amount: number;

  @Column('varchar', {
    length: 50,
    nullable: false,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;
}

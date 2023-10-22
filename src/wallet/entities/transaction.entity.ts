import { Column, Entity, ManyToOne } from 'typeorm';

import { AppBaseEntity } from 'src/common/models';
import { Wallet } from './';
import { TransactionStatus, TransactionType } from '../constants/enums';

@Entity('transactions')
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

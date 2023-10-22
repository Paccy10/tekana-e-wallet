import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';

import { AppBaseEntity } from 'src/common/entities';
import { User } from 'src/user/user.entity';

@Entity('wallets')
@Index('wallet_userPkid_index', ['user'])
export class Wallet extends AppBaseEntity {
  @OneToOne(() => User, (user) => user.pkid, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @Column('varchar', { length: 250, nullable: false })
  pin: string;

  @Column('boolean', { nullable: false, default: true })
  active: boolean;

  @Column('decimal', { nullable: false, precision: 10, scale: 2, default: 0 })
  balance: number;
}

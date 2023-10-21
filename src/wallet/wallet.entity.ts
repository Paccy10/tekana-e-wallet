import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { AppBaseEntity } from 'src/common/models';
import { User } from 'src/user/user.entity';

@Entity('wallets')
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
}

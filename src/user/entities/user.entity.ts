import { Column, Entity, Index } from 'typeorm';

import { AppBaseEntity } from '../../common/entities';

@Entity('users')
@Index('user_phone_index', ['phone'], { unique: true })
@Index('user_email_index', ['email'], { unique: true })
export class User extends AppBaseEntity {
  @Column('varchar', { length: 250, nullable: false })
  firstname: string;

  @Column('varchar', { length: 250, nullable: false })
  lastname: string;

  @Column('varchar', { length: 250, nullable: true })
  middlename: string;

  @Column('varchar', { length: 20, nullable: true, unique: true })
  phone: string;

  @Column('varchar', { length: 250, nullable: false, unique: true })
  email: string;

  @Column('varchar', { length: 250, nullable: false })
  password: string;

  @Column('boolean', { nullable: false, default: false })
  active: boolean;
}

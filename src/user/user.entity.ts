import { Column, Entity } from 'typeorm';

import { AppBaseEntity } from 'src/common/models';

@Entity('users')
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

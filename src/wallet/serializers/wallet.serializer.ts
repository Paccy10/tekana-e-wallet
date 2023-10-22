import { Exclude, Type } from 'class-transformer';

import { BaseSerializer } from 'src/common/serializers';

export class WalletUserSerializer extends BaseSerializer {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;

  @Exclude()
  password: string;

  @Exclude()
  middlename: string;

  @Exclude()
  active: boolean;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  version: number;
}

export class WalletSerializer extends BaseSerializer {
  @Type(() => WalletUserSerializer)
  user: WalletUserSerializer;

  active: boolean;
  balance: number;

  @Exclude()
  pin: string;
}

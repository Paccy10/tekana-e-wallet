import { Exclude } from 'class-transformer';

import { BaseSerializer } from '../../common/serializers';

export class UserSerializer extends BaseSerializer {
  firstname: string;
  lastname: string;
  middlename: string;
  email: string;
  phone: string;
  active: boolean;

  @Exclude()
  password: string;
}

import { Exclude } from 'class-transformer';

export class BaseSerializer {
  id: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  pkid: number;

  @Exclude()
  deletedAt: Date;

  constructor(partial: Partial<BaseSerializer>) {
    Object.assign(this, partial);
  }
}

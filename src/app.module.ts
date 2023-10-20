import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { dbOptions } from './config/db/db.config';

@Module({
  imports: [TypeOrmModule.forRoot(dbOptions)],
})
export class AppModule {}

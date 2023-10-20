import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { dbOptions } from './config/db/db.config';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbOptions),
    CommonModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}

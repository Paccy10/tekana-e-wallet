import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';

import { MAIL_QUEUE } from './constants';
import { EmailProcessor } from './processors';
import { EmailService } from './services';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: MAIL_QUEUE,
    }),
  ],
  providers: [EmailService, EmailProcessor],
  exports: [EmailService],
})
export class CommonModule {}

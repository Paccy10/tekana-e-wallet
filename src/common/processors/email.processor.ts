import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';

import { MAIL_QUEUE, VERIFICATION_EMAIL_JOB } from '../constants';
import { Mail } from '../interfaces/mail.interface';

@Processor(MAIL_QUEUE)
export class EmailProcessor {
  constructor(private mailService: MailerService) {}

  @Process(VERIFICATION_EMAIL_JOB)
  async sendVerificationEmail(job: Job<Mail>) {
    const { data } = job;

    await this.mailService.sendMail({
      to: data.to,
      subject: 'Verification Email',
      template: 'verification-email',
      context: {
        data: data.data,
      },
    });
  }
}

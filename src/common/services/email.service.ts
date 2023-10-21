import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

import { Mail } from '../interfaces/mail.interface';
import { MAIL_QUEUE } from '../constants';

@Injectable()
export class EmailService {
  constructor(@InjectQueue(MAIL_QUEUE) private readonly mailQueue: Queue) {}

  async sendEmail(data: Mail, jobName: string) {
    const job = await this.mailQueue.add(jobName, data);
    return { jobId: job.id };
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { Matches, IsNotEmpty, IsString } from 'class-validator';

import { INVALID_PIN } from '../constants/messages';

export class CompleteTransactionDTO {
  @ApiProperty()
  @Matches(/^\d{5}$/, {
    message: INVALID_PIN,
  })
  @IsNotEmpty()
  @IsString()
  pin: string;
}

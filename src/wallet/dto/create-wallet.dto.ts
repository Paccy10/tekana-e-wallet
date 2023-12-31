import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

import { INVALID_PIN } from '../constants/messages';

export class CreateWalletDTO {
  @ApiProperty()
  @Matches(/^\d{5}$/, {
    message: INVALID_PIN,
  })
  @IsNotEmpty()
  @IsString()
  pin: string;
}

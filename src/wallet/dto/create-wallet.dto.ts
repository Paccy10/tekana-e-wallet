import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateWalletDTO {
  @ApiProperty()
  @Matches(/^\d{5}$/, {
    message: 'Invalid pin. The pin should be 5 digits',
  })
  @IsNotEmpty()
  @IsString()
  pin: string;
}

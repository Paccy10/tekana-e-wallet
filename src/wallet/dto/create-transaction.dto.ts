import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsPositive } from 'class-validator';

import { TransactionType } from '../constants/enums';

export class CreateTransactionDTO {
  @ApiProperty()
  @IsIn(Object.values(TransactionType))
  type: TransactionType;

  @ApiProperty()
  @IsPositive()
  @IsNumber()
  amount: number;
}

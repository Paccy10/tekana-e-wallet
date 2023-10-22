import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/guards';
import { TransactionService } from '../services';
import { TRANSACTION_CREATED } from '../constants/messages';
import { ResponseMessage } from 'src/common/decorators';
import { CreateTransactionDTO } from '../dto/create-transaction.dto';
import { GetUser } from 'src/auth/decorators';

@Controller('transactions')
@ApiTags('Transactions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ResponseMessage(TRANSACTION_CREATED)
  async initiateTransaction(
    @Body() createTransactionDTO: CreateTransactionDTO,
    @GetUser() user,
  ) {
    return this.transactionService.initiateTransaction(
      createTransactionDTO,
      user,
    );
  }
}

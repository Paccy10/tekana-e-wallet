import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/guards';
import { TransactionService } from '../services';
import {
  TRANSACTION_COMPLETED,
  TRANSACTION_CREATED,
} from '../constants/messages';
import { ResponseMessage } from 'src/common/decorators';
import { CreateTransactionDTO } from '../dto/create-transaction.dto';
import { GetUser } from 'src/auth/decorators';
import { CompleteTransactionDTO } from '../dto/complete-transaction.dto';

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

  @Post(':id')
  @ApiOperation({ summary: 'Complete transaction' })
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(TRANSACTION_COMPLETED)
  async completeTransaction(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() completeTransactionDTO: CompleteTransactionDTO,
    @GetUser() user,
  ) {
    return this.transactionService.completeTransaction(
      id,
      completeTransactionDTO,
      user,
    );
  }
}

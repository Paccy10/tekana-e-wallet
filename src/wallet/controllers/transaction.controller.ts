import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/guards';
import { TransactionService } from '../services';
import {
  TRANSACTIONS_FETCHED,
  TRANSACTION_COMPLETED,
  TRANSACTION_CREATED,
  TRANSACTION_FETCHED,
} from '../constants/messages';
import { ResponseMessage } from '../../common/decorators';
import { CreateTransactionDTO } from '../dto/create-transaction.dto';
import { GetUser } from '../../auth/decorators';
import { CompleteTransactionDTO } from '../dto/complete-transaction.dto';
import { FilterDTO } from '../../common/dto';
import { TransactionSerializer } from '../serializers';

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

  @Get('')
  @ApiOperation({ summary: 'Get transactions' })
  @ResponseMessage(TRANSACTIONS_FETCHED)
  async getTransactions(@Query() filterDTO: FilterDTO) {
    return this.transactionService.getTransactions(filterDTO);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction' })
  @ResponseMessage(TRANSACTION_FETCHED)
  async getTransaction(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    const transaction = await this.transactionService.getTransaction(id);
    return new TransactionSerializer(transaction);
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Transaction } from '../entities';
import { CreateTransactionDTO } from '../dto/create-transaction.dto';
import { RequestUser } from 'src/user/types';
import { TransactionSerializer } from '../serializers';
import { UserService } from 'src/user/user.service';
import { INSUFFICIENT_BALANCE } from '../constants/messages';
import { TransactionType } from '../constants/enums';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private userService: UserService,
  ) {}

  async initiateTransaction(
    createTransactionDTO: CreateTransactionDTO,
    reqUser: RequestUser,
  ): Promise<TransactionSerializer> {
    const wallet = await this.userService.getUserWallet(reqUser.id);

    if (
      createTransactionDTO.type === TransactionType.DEDUCTION &&
      wallet.balance < createTransactionDTO.amount
    ) {
      throw new BadRequestException(INSUFFICIENT_BALANCE);
    }

    const transaction = this.transactionRepository.create({
      ...createTransactionDTO,
      wallet,
    });
    const savedTransaction = await this.transactionRepository.save(transaction);

    return new TransactionSerializer(savedTransaction);
  }
}

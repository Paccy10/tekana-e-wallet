import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { Transaction, Wallet } from '../entities';
import { CreateTransactionDTO } from '../dto/create-transaction.dto';
import { RequestUser } from '../../user/types';
import { TransactionSerializer } from '../serializers';
import { UserService } from '../../user/services/user.service';
import {
  FORBIDDEN_TRANSACTION,
  INCORRECT_PIN,
  INSUFFICIENT_BALANCE,
  TRANSACTION_ALREADY_COMPLETED,
  TRANSACTION_NOT_FOUND,
} from '../constants/messages';
import { TransactionStatus, TransactionType } from '../constants/enums';
import { CompleteTransactionDTO } from '../dto/complete-transaction.dto';
import { FilterDTO } from '../../common/dto';
import { FilterService } from '../../common/services';
import { FilterResponse } from '../../common/interfaces';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    private userService: UserService,
  ) {}

  async initiateTransaction(
    createTransactionDTO: CreateTransactionDTO,
    reqUser: RequestUser,
  ): Promise<TransactionSerializer> {
    const wallet = await this.userService.getUserWallet(reqUser.id);

    if (
      createTransactionDTO.type === TransactionType.DEDUCTION &&
      Number(wallet.balance) < createTransactionDTO.amount
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

  async getTransaction(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: { wallet: { user: true } },
    });

    if (!transaction) {
      throw new NotFoundException(TRANSACTION_NOT_FOUND);
    }

    return transaction;
  }

  async completeTransaction(
    id: string,
    completeTransactionDTO: CompleteTransactionDTO,
    reqUser: RequestUser,
  ): Promise<TransactionSerializer> {
    const transaction = await this.getTransaction(id);
    const wallet = transaction.wallet;

    if (wallet.user.id !== reqUser.id) {
      throw new ForbiddenException(FORBIDDEN_TRANSACTION);
    }

    if (!bcrypt.compareSync(completeTransactionDTO.pin, wallet.pin)) {
      throw new BadRequestException(INCORRECT_PIN);
    }

    if (transaction.status !== TransactionStatus.PENDING) {
      throw new BadRequestException(TRANSACTION_ALREADY_COMPLETED);
    }

    const balance = Number(wallet.balance);
    const amount = Number(transaction.amount);

    if (transaction.type === TransactionType.DEDUCTION) {
      if (balance < amount) {
        throw new BadRequestException(INSUFFICIENT_BALANCE);
      }
      wallet.balance = balance - amount;
    } else {
      wallet.balance = balance + amount;
    }

    transaction.status = TransactionStatus.SUCCESSFUL;

    const savedTransaction = await this.transactionRepository.save(transaction);
    await this.walletRepository.save(wallet);
    return new TransactionSerializer(savedTransaction);
  }

  async getTransactions(
    filters: FilterDTO,
  ): Promise<FilterResponse<TransactionSerializer>> {
    const listFilterService = new FilterService(
      this.transactionRepository,
      TransactionSerializer,
    );
    const options = {} as FindManyOptions<Transaction>;
    options.relations = ['wallet', 'wallet.user'];
    const searchFields = ['status', 'type'];

    return listFilterService.filter({ filters, options, searchFields });
  }
}

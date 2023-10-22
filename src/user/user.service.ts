import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './user.entity';
import { NO_WALLET, USER_NOT_FOUND } from './constants/messages';
import { FilterDTO } from 'src/common/dto';
import { FilterResponse } from 'src/common/interfaces';
import { UserSerializer } from './user.serializer';
import { FilterService } from 'src/common/services';
import { Wallet } from 'src/wallet/entities/wallet.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
  ) {}

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    return user;
  }

  async getUsers(filters: FilterDTO): Promise<FilterResponse<UserSerializer>> {
    const listFilterService = new FilterService(
      this.userRepository,
      UserSerializer,
    );
    const searchFields = [
      'id',
      'firstname',
      'lastname',
      'middlename',
      'email',
      'phone',
    ];

    return listFilterService.filter({ filters, searchFields });
  }

  async getUserWallet(id: string): Promise<Wallet> {
    const user = await this.getUserById(id);
    const wallet = await this.walletRepository.findOne({
      where: { user: { pkid: user.pkid } },
      relations: ['user'],
    });

    if (!wallet) {
      throw new NotFoundException(NO_WALLET);
    }

    return wallet;
  }
}

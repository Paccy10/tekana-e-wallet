import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { Wallet } from '../entities';
import { User } from '../../user/entities';
import { WALLET_EXISTS, WALLET_NOT_FOUND } from '../constants/messages';
import { CreateWalletDTO } from '../dto';
import { WalletSerializer } from '../serializers';
import { UserService } from '../../user/services/user.service';
import { RequestUser } from '../../user/types';
import { FilterDTO } from '../../common/dto';
import { FilterResponse } from '../../common/interfaces';
import { FilterService } from '../../common/services';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
    private userService: UserService,
  ) {}

  private async doesWalletExist(user: User) {
    const wallet = await this.walletRepository.findOne({
      where: { user: { pkid: user.pkid } },
    });

    if (wallet) {
      throw new ConflictException(WALLET_EXISTS);
    }
  }

  async createWallet(
    createWalletDTO: CreateWalletDTO,
    reqUser: RequestUser,
  ): Promise<WalletSerializer> {
    const user = await this.userService.getUserById(reqUser.id);
    await this.doesWalletExist(user);

    const pin = bcrypt.hashSync(createWalletDTO.pin, bcrypt.genSaltSync(10));
    const newWallet = this.walletRepository.create({ user, pin });
    const wallet = await this.walletRepository.save(newWallet);

    return new WalletSerializer(wallet);
  }

  async getWallets(
    filters: FilterDTO,
  ): Promise<FilterResponse<WalletSerializer>> {
    const listFilterService = new FilterService(
      this.walletRepository,
      WalletSerializer,
    );
    const options = {} as FindManyOptions<Wallet>;
    options.relations = ['user'];

    return listFilterService.filter({ filters, options });
  }

  async getWallet(id: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({ where: { id } });

    if (!wallet) {
      throw new NotFoundException(WALLET_NOT_FOUND);
    }

    return wallet;
  }
}

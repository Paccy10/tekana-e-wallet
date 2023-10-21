import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { Wallet } from './wallet.entity';
import { User } from 'src/user/user.entity';
import { WALLET_EXISTS } from './constants';
import { CreateWalletDTO } from './dto';
import { WalletSerializer } from './serializers';
import { UserService } from 'src/user/user.service';
import { RequestUser } from 'src/user/types';

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
}

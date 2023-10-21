import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './user.entity';
import { USER_NOT_FOUND } from './constants/messages';
import { FilterDTO } from 'src/common/dto';
import { FilterResponse } from 'src/common/interfaces';
import { UserSerializer } from './user.serializer';
import { FilterService } from 'src/common/services';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
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
      'firstname',
      'lastname',
      'middlename',
      'email',
      'phone',
    ];

    return listFilterService.filter({ filters, searchFields });
  }
}

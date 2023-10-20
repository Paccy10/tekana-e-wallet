import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from 'src/user/user.entity';
import { RegisterUserDTO } from './dto';
import { UserSerializer } from 'src/user/user.serializer';
import { EMAIL_EXISTS, PHONE_EXISTS } from './constants/messages';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  private async doesUserExists(registerUserDTO: RegisterUserDTO) {
    const { email, phone } = registerUserDTO;
    let user = await this.userRepository.findOne({
      where: { email },
    });

    if (user) {
      throw new ConflictException(EMAIL_EXISTS);
    }

    user = await this.userRepository.findOne({
      where: { phone },
    });

    if (user) {
      throw new ConflictException(PHONE_EXISTS);
    }
  }

  async registerUser(
    registerUserDTO: RegisterUserDTO,
  ): Promise<UserSerializer> {
    await this.doesUserExists(registerUserDTO);

    const password = bcrypt.hashSync(
      registerUserDTO.password,
      bcrypt.genSaltSync(10),
    );
    const newUser = this.userRepository.create({
      ...registerUserDTO,
      password,
    });
    const user = await this.userRepository.save(newUser);

    return new UserSerializer(user);
  }
}

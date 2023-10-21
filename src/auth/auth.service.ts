import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

import { User } from 'src/user/user.entity';
import { RegisterUserDTO } from './dto';
import { UserSerializer } from 'src/user/user.serializer';
import { EMAIL_EXISTS, PHONE_EXISTS } from './constants/messages';
import { Mail } from 'src/common/interfaces';
import { JwtPayload } from './interfaces';
import { EmailService } from 'src/common/services';
import { VERIFICATION_EMAIL_JOB } from 'src/common/constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
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
    req: Request,
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

    // Send verification email
    const backendUrl = `${req.protocol}://${req.headers.host}`;
    const payload: JwtPayload = { id: user.id, email: user.email };
    const token = await this.jwtService.sign(payload);
    const emailData: Mail = {
      to: user.email,
      data: {
        firstname: user.firstname,
        backendUrl,
        token,
      },
    };
    await this.emailService.sendEmail(emailData, VERIFICATION_EMAIL_JOB);

    return new UserSerializer(user);
  }
}

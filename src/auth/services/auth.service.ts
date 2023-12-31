import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

import { User } from '../../user/entities';
import { LoginDTO, RegisterUserDTO } from '../dto';
import { UserSerializer } from '../../user/serializers';
import {
  DEACTIVATED_USER,
  EMAIL_EXISTS,
  INVALID_CREDENTIALS,
  INVALID_TOKEN,
  PHONE_EXISTS,
} from '../constants/messages';
import { Mail } from '../../common/interfaces';
import { JwtPayload } from '../interfaces';
import { EmailService } from '../../common/services';
import { VERIFICATION_EMAIL_JOB } from '../../common/constants';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
    private userService: UserService,
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

  private async decodeToken(token: string): Promise<JwtPayload> {
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token);
      return payload;
    } catch (error) {
      throw new BadRequestException(INVALID_TOKEN);
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

  async verifyUser(token: string): Promise<UserSerializer> {
    const payload = await this.decodeToken(token);
    const user = await this.userService.getUserById(payload.id);
    user.active = true;
    const savedUser = await this.userRepository.save(user);

    return new UserSerializer(savedUser);
  }

  async loginUser(
    loginDTO: LoginDTO,
  ): Promise<{ token: string; user: UserSerializer }> {
    const { email, password } = loginDTO;
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user || (user && !bcrypt.compareSync(password, user.password))) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    if (user && !user.active) {
      throw new UnauthorizedException(DEACTIVATED_USER);
    }

    const payload: JwtPayload = { id: user.id, email: user.email };
    const token = await this.jwtService.sign(payload);

    return {
      token,
      user: new UserSerializer(user),
    };
  }
}

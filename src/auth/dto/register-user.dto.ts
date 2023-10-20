import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { WEAK_PASSWORD } from '../constants/messages';

export class RegisterUserDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  middlename?: string;

  @ApiProperty()
  @Matches(/^[1-9]{1}[0-9]{10,14}$/, {
    message: 'Invalid phone number. It should have this format 250770000000',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/, {
    message: WEAK_PASSWORD,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

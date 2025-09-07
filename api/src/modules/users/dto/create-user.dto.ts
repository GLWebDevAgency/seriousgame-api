import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, minLength: 8 })
  @IsString()
  @Length(8, 128)
  password: string;

  @ApiProperty({ required: true, minLength: 3, maxLength: 24 })
  @IsString()
  @Length(3, 24)
  @Matches(/^[a-zA-Z0-9_-]+$/)
  nickname: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}

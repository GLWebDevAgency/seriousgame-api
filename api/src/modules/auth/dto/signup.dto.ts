import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class SignupDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @Length(8, 128)
  password: string;

  @ApiProperty({ minLength: 3, maxLength: 24 })
  @IsString()
  @Length(3, 24)
  @Matches(/^[a-zA-Z0-9_-]+$/)
  nickname: string;
}

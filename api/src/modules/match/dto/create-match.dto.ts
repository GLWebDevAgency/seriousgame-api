import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateMatchDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  opponentId?: string;
}

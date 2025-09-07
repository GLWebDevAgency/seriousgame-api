import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResultMatchDto {
  @ApiProperty()
  @IsString()
  winnerId: string;
}

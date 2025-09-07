import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateProgressDto {
  @ApiProperty({ minimum: 0, default: 0 })
  @IsInt()
  @Min(0)
  deltaScore: number = 0;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  newLevel?: number;
}

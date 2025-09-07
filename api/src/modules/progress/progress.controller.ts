import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProgressService } from './progress.service';
import { UpdateProgressDto } from './dto/update-progress.dto';
import type {
  RequestWithUser,
  UserPayload,
} from '../common/types/request-with-user.type';

@ApiTags('progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  async getProgress(@Req() req: RequestWithUser<UserPayload>) {
    return this.progressService.getByUserId(req.user.sub);
  }

  @Post('update')
  async updateProgress(
    @Req() req: RequestWithUser<UserPayload>,
    @Body() dto: UpdateProgressDto,
  ) {
    return this.progressService.updateUserProgress(
      req.user.sub,
      dto.deltaScore,
      dto.newLevel,
    );
  }
}

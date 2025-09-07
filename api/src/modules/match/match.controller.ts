import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { ResultMatchDto } from './dto/result-match.dto';

import type {
  RequestWithUser,
  UserPayload,
} from '../common/types/request-with-user.type';

@ApiTags('match')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post('create') create(
    @Req() req: RequestWithUser<UserPayload>,
    @Body() dto: CreateMatchDto,
  ) {
    return this.matchService.create(req.user.sub, dto.opponentId);
  }

  @Post(':id/join') join(
    @Req() req: RequestWithUser<UserPayload>,
    @Param('id') id: string,
  ) {
    return this.matchService.join(id, req.user.sub);
  }

  @Get(':id') get(
    @Req() req: RequestWithUser<UserPayload>,
    @Param('id') id: string,
  ) {
    return this.matchService.get(id, req.user.sub);
  }

  @Post(':id/result') result(
    @Req() req: RequestWithUser<UserPayload>,
    @Param('id') id: string,
    @Body() dto: ResultMatchDto,
  ) {
    return this.matchService.result(id, req.user.sub, dto.winnerId);
  }
}

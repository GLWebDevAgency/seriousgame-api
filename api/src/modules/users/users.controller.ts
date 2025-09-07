import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type {
  RequestWithUser,
  UserPayload,
} from '../common/types/request-with-user.type';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(
    @Req()
    req: RequestWithUser<UserPayload>,
  ) {
    const { sub, email, nickname, role } = req.user;
    return { id: sub, email, nickname, role };
  }
}

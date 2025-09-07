import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Match, MatchDocument } from './schemas/match.schema';
import { ProgressService } from '../progress/progress.service';

@Injectable()
export class MatchService {
  constructor(
    @InjectModel(Match.name) private readonly matchModel: Model<MatchDocument>,
    private readonly progress: ProgressService,
  ) {}

  async create(player1Id: string, opponentId?: string) {
    const data: Partial<Match> = { player1Id: new Types.ObjectId(player1Id) };

    if (opponentId) {
      data.player2Id = new Types.ObjectId(opponentId);
      data.state = 'playing';
    }

    return this.matchModel.create(data);
  }

  async join(matchId: string, userId: string) {
    const match = await this.matchModel.findById(matchId);
    if (!match) throw new NotFoundException('Match not found');

    if (match.state !== 'waiting')
      throw new BadRequestException('Match not joinable');

    if (match.player1Id.equals(userId))
      throw new BadRequestException('Creator cannot join');

    if (match.player2Id) throw new BadRequestException('Already has player2');

    match.player2Id = new Types.ObjectId(userId);
    match.state = 'playing';

    await match.save();

    return match;
  }

  async get(matchId: string, requesterId: string) {
    const match = await this.matchModel.findById(matchId);
    if (!match) throw new NotFoundException('Match not found');

    const isParticipant =
      match.player1Id.equals(requesterId) ||
      (match.player2Id && match.player2Id.equals(requesterId));
    if (!isParticipant) throw new ForbiddenException('Not a participant');

    return match;
  }

  async result(matchId: string, requesterId: string, winnerId: string) {
    const match = await this.matchModel.findById(matchId);
    if (!match) throw new NotFoundException('Match not found');

    if (match.state !== 'playing')
      throw new BadRequestException('Match not in playing state');

    const isParticipant =
      match.player1Id.equals(requesterId) ||
      (match.player2Id && match.player2Id.equals(requesterId));
    if (!isParticipant) throw new ForbiddenException('Not a participant');

    const validWinner =
      (match.player1Id && match.player1Id.equals(winnerId)) ||
      (match.player2Id && match.player2Id.equals(winnerId));
    if (!validWinner)
      throw new BadRequestException('Winner must be one of the players');

    match.winnerId = new Types.ObjectId(winnerId);
    match.state = 'finished';
    await match.save();

    // Points: +100 pour le gagnant, +20 pour le perdant
    const loserId = match.player1Id.equals(winnerId)
      ? (match.player2Id?.toString() ?? null)
      : match.player1Id.toString();

    await this.progress.updateUserProgress(winnerId, 100);

    if (loserId) await this.progress.updateUserProgress(loserId, 20);

    return match;
  }
}

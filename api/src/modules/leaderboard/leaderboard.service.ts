import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Progress,
  ProgressDocument,
} from '../progress/schemas/progress.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectModel(Progress.name)
    private readonly progress: Model<ProgressDocument>,
    @InjectModel(User.name) private readonly users: Model<UserDocument>,
  ) {}

  async listTopPlayers(limit = 10) {
    const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);

    const res = await this.progress.aggregate<{
      userId: Types.ObjectId;
      nickname: string;
      scoreTotal: number;
    }>([
      { $sort: { scoreTotal: -1 } },
      { $limit: safeLimit },
      {
        $lookup: {
          from: this.users.collection.name,
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          userId: '$userId',
          nickname: '$user.nickname',
          scoreTotal: 1,
        },
      },
    ]);

    return res.map((e, i) => ({ rank: i + 1, ...e }));
  }
}

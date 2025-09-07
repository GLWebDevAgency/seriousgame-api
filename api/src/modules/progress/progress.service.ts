import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateQuery } from 'mongoose';
import { Progress, ProgressDocument } from './schemas/progress.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProgressService {
  private readonly maxDelta: number;

  constructor(
    @InjectModel(Progress.name)
    private readonly progressModel: Model<ProgressDocument>,
    private readonly cfg: ConfigService,
  ) {
    this.maxDelta = cfg.get<number>('MAX_DELTA_SCORE', 500);
  }

  async getByUserId(userId: string) {
    return this.progressModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .lean()
      .exec();
  }

  async updateUserProgress(
    userId: string,
    deltaScore: number,
    newLevel?: number,
  ) {
    if (deltaScore < 0 || deltaScore > this.maxDelta) {
      throw new BadRequestException('Invalid deltaScore');
    }

    const update: UpdateQuery<ProgressDocument> & {
      $max?: { level?: number };
    } = {
      $inc: { scoreTotal: deltaScore },
      $set: { lastPlayedAt: new Date() },
    };

    if (typeof newLevel === 'number') {
      update.$max = { ...(update.$max || {}), level: newLevel };
    }

    return this.progressModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      update,
      { new: true, upsert: true },
    );
  }
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MatchDocument = HydratedDocument<Match>;
export type MatchState = 'waiting' | 'playing' | 'finished';

@Schema({ timestamps: true })
export class Match {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  player1Id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  player2Id?: Types.ObjectId;

  @Prop({ enum: ['waiting', 'playing', 'finished'], default: 'waiting' })
  state: MatchState;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  winnerId?: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}
export const MatchSchema = SchemaFactory.createForClass(Match);
MatchSchema.index({ state: 1, createdAt: -1 });

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProgressDocument = HydratedDocument<Progress>;

@Schema({ timestamps: true })
export class Progress {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ type: Number, min: 0, default: 0 })
  level: number;

  @Prop({ type: Number, min: 0, default: 0 })
  scoreTotal: number;

  @Prop({ type: Date })
  lastPlayedAt?: Date;
}
export const ProgressSchema = SchemaFactory.createForClass(Progress);
ProgressSchema.index({ userId: 1 }, { unique: true });
ProgressSchema.index({ scoreTotal: -1 });

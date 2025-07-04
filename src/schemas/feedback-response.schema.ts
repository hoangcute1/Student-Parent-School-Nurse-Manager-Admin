import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type FeedbackResponseDocument = FeedbackResponse & Document;

@Schema({ timestamps: true })
export class FeedbackResponse extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Feedback', required: true })
  feedback: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  responder: MongooseSchema.Types.ObjectId; // Nhân viên trả lời (staff hoặc admin)

  @Prop({ required: true, trim: true })
  response: string;

  @Prop({ default: false })
  isRead: boolean; // Đã được phụ huynh đọc chưa

  @Prop({ default: Date.now })
  created_at: Date;
}

export const FeedbackResponseSchema = SchemaFactory.createForClass(FeedbackResponse);

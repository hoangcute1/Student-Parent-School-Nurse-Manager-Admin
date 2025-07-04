import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum FeedbackNotificationType {
  NEW_FEEDBACK = 'new_feedback',
  FEEDBACK_RESPONSE = 'feedback_response',
}

export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
  PARENT = 'parent',
}

export type FeedbackNotificationDocument = FeedbackNotification & Document;

@Schema({ timestamps: true })
export class FeedbackNotification extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Feedback', required: true })
  feedback: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  recipient: MongooseSchema.Types.ObjectId; // Người nhận thông báo

  @Prop({ enum: UserRole, required: true })
  recipientRole: string; // Role của người nhận

  @Prop({ enum: FeedbackNotificationType, required: true })
  type: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  message: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ default: Date.now })
  created_at: Date;
}

export const FeedbackNotificationSchema = SchemaFactory.createForClass(FeedbackNotification);

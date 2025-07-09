import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type SimpleNotificationDocument = SimpleNotification & Document;

@Schema({
  timestamps: true,
  versionKey: false,
  collection: 'simple_notifications',
})
export class SimpleNotification extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Parent', required: true })
  parent: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Student', required: true })
  student: MongooseSchema.Types.ObjectId;

  @Prop({ trim: true, required: true })
  content: string;

  @Prop({ trim: true, required: true })
  notes: string;

  @Prop({ trim: true, required: true })
  type: string;

  @Prop({ trim: true, required: false })
  relatedId?: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const SimpleNotificationSchema = SchemaFactory.createForClass(SimpleNotification);

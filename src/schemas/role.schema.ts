import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type RoleDocument = Role & Document;

@Schema({
  versionKey: false,
  timestamps: true,
  collection: 'roles',
})
export class Role {
  @Prop({ required: true, unique: true, index: true })
  @ApiProperty({ example: 'admin', description: 'Tên vai trò' })
  name: string;

  @Prop()
  @ApiProperty({
    example: 'Quản trị viên hệ thống',
    description: 'Mô tả chi tiết về vai trò',
  })
  description: string;

  @Prop({ type: [String], default: [] })
  @ApiProperty({
    example: ['manage_students', 'manage_users'],
    description: 'Danh sách các quyền',
  })
  permissions: string[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

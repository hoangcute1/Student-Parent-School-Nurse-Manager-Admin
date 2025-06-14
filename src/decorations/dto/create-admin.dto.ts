import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({
    example: '60d0fe4f5311236168a109ca',
    description:
      'ID của User trong hệ thống (MongoDB ObjectID) - Sẽ được lưu vào trường user',
  })
  @IsNotEmpty()
  @IsMongoId()
  readonly user: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh token được cấp khi đăng nhập' })
  @IsNotEmpty({ message: 'Refresh token không được để trống' })
  @IsString({ message: 'Refresh token phải là chuỗi' })
  refresh_token: string;

  @ApiProperty({ description: 'ID của người dùng' })
  @IsNotEmpty({ message: 'ID người dùng không được để trống' })
  @IsMongoId({ message: 'ID người dùng không hợp lệ' })
  userId: string;
}

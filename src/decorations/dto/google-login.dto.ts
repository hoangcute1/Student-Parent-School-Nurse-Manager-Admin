import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class GoogleLoginDto {
  @ApiProperty({
    example: 'parent@gmail.com',
    description: 'Email Google của người dùng',
  })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({
    description: 'Tên hiển thị từ Google (tùy chọn)',
    required: false,
  })
  @IsOptional()
  displayName?: string;

  @ApiProperty({
    description: 'Token ID từ Google (tùy chọn)',
    required: false,
  })
  @IsOptional()
  googleId?: string;
}

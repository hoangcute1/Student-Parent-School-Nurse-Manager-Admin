import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'nva@example.com', description: 'Email người dùng' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Mật khẩu người dùng' })
  password: string;

  @ApiProperty({
    example: 'user',
    description: 'Vai trò người dùng',
  })
  role?: string;
}

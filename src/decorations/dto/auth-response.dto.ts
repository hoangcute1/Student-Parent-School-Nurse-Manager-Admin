import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponseDto } from './success-response.dto';

export class TokenInfo {
  @ApiProperty({
    description: 'Access token for API authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token to get new access tokens',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;
}

export class UserInfo {
  @ApiProperty({ description: 'User ID', example: '60d0fe4f5311236168a109ca' })
  _id: string;

  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  email: string;

  @ApiProperty({
    description: 'User role',
    example: 'parent',
    enum: ['parent', 'staff', 'admin'],
  })
  role: string;
}

export class ProfileInfo {
  @ApiProperty({
    description: 'Profile ID',
    example: '60d0fe4f5311236168a109cb',
  })
  _id: string;

  @ApiProperty({ description: 'Full name', example: 'Nguyễn Văn A' })
  fullName: string;

  @ApiProperty({ description: 'Phone number', example: '0912345678' })
  phone: string;

  @ApiProperty({
    description: 'Gender',
    example: 'male',
    enum: ['male', 'female', 'other'],
  })
  gender: string;

  @ApiProperty({
    description: 'Date of birth',
    example: '2000-01-01T00:00:00.000Z',
  })
  birth: Date;

  @ApiProperty({ description: 'Address', example: 'Hà Nội' })
  address: string;

  @ApiProperty({
    description: 'Avatar URL',
    example: 'https://example.com/avatar.jpg',
  })
  avatar: string;
}

export class AuthResponseDto extends SuccessResponseDto<{
  tokens: TokenInfo;
  user: UserInfo;
  profile?: ProfileInfo;
}> {
  constructor(tokens: TokenInfo, user: UserInfo, profile?: ProfileInfo) {
    super('Login successful', {
      tokens,
      user,
      profile,
    });
  }
}

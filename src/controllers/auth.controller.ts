import { IsEmail } from 'class-validator';
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from '@/services/auth.service';
import { UserService } from '@/services/user.service';
import { ProfileService } from '@/services/profile.service';
import { LocalAuthGuard } from '@/guards/local-auth.guard';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginDto, LoginWithOtpDto } from '@/decorations/dto/login.dto';

import { RefreshTokenDto } from '@/decorations/dto/refresh-token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private profileService: ProfileService,
  ) {}
  @Post('login-parent')
  @ApiOperation({ summary: 'Bước 1: Yêu cầu đăng nhập phụ huynh và nhận OTP' })
  @ApiResponse({ status: 200, description: 'OTP đã được gửi.' })
  @ApiResponse({
    status: 401,
    description: 'Email hoặc mật khẩu không chính xác.',
  })
  async loginParent(@Body() loginDto: LoginDto) {
    return this.authService.loginParent(loginDto.email, loginDto.password);
  }
  @Post('login-parent/verify')
  @ApiOperation({
    summary: 'Bước 2: Xác thực OTP và hoàn tất đăng nhập phụ huynh',
  })
  @ApiResponse({ status: 200, description: 'Đăng nhập phụ huynh thành công.' })
  @ApiResponse({
    status: 401,
    description: 'OTP không chính xác hoặc đã hết hạn.',
  })
  async loginParentOtp(@Body() loginWithOtpDto: LoginWithOtpDto) {
    return this.authService.loginParentWithOtp(
      loginWithOtpDto.email,
      loginWithOtpDto.otp,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Đăng xuất người dùng' })
  @ApiResponse({ status: 200, description: 'Đăng xuất thành công.' })
  async logout(@Req() req) {
    // Extract token from the authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    return this.authService.logout(req.user.user, token);
  }
  @Post('refresh')
  @ApiOperation({ summary: 'Làm mới access token và refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Tokens đã được làm mới.',
    schema: {
      properties: {
        accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1...' },
        refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1...' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Refresh token không hợp lệ.' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(
      refreshTokenDto.user,
      refreshTokenDto.refresh_token,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Lấy thông tin người dùng đã đăng nhập' })
  @ApiResponse({ status: 200, description: 'Thông tin người dùng.' })
  getProfile(@Req() req) {
    return req.user;
  }
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết người dùng hiện tại' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin chi tiết của người dùng.',
  })
  @ApiResponse({ status: 401, description: 'Chưa xác thực.' })
  async getMe(@Req() req) {
    // Get detailed user information from the database using the ID in the JWT
    const user = await this.userService.findById(req.user.user);

    // Get user's profile
    const profile = await this.profileService.findByuser(req.user.user);

    // Remove sensitive information
    const { password, refreshToken, ...userResult } = user.toObject();

    return {
      user: userResult,
      profile: profile,
    };
  }
}

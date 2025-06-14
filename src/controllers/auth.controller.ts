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
import { LoginDto } from '@/decorations/dto/login.dto';

import { RefreshTokenDto } from '@/decorations/dto/refresh-token.dto';
import { VerifyOtpDto } from '@/decorations/dto/verify-otp.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private profileService: ProfileService,
  ) {}

  @Post('login-parent')
  @ApiOperation({ summary: 'Đăng nhập phụ huynh' })
  @ApiResponse({ status: 200, description: 'Đăng nhập phụ huynh thành công.' })
  @ApiResponse({
    status: 401,
    description: 'Email hoặc mật khẩu không chính xác.',
  })
  async loginParent(@Body() loginDto: LoginDto) {
    return this.authService.loginParent(loginDto.email, loginDto.password);
  }

  @Post('login-staff')
  @ApiOperation({ summary: 'Đăng nhập nhân viên' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Đăng nhập nhân viên thành công.' })
  @ApiResponse({
    status: 401,
    description: 'Email hoặc mật khẩu không chính xác.',
  })
  async loginStaff(@Body() loginDto: LoginDto) {
    return this.authService.loginStaff(loginDto.email, loginDto.password);
  }
  @Post('login-admin')
  @ApiOperation({ summary: 'Đăng nhập admin' })
  @ApiResponse({
    status: 200,
    description:
      'Đăng nhập admin thành công. Trả về access token, refresh token và thông tin admin.',
    schema: {
      properties: {
        tokens: {
          type: 'object',
          properties: {
            accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1...' },
            refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1...' },
          },
        },
        user: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
            email: { type: 'string', example: 'admin@example.com' },
            role: { type: 'string', example: 'admin' },
          },
        },
        admin: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '60d0fe4f5311236168a109cb' },
          },
        },
        profile: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '60d0fe4f5311236168a109cd' },
            name: { type: 'string', example: 'Admin Name' },
            phone: { type: 'string', example: '0912345678' },
            gender: { type: 'string', example: 'male' },
            birth: { type: 'string', format: 'date-time' },
            address: { type: 'string', example: 'Hà Nội' },
            avatar: {
              type: 'string',
              example: 'https://example.com/avatar.jpg',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Email hoặc mật khẩu không chính xác.',
  })
  async loginAdmin(@Body() loginDto: LoginDto) {
    return this.authService.loginAdmin(loginDto.email, loginDto.password);
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

  @UseGuards(LocalAuthGuard)
  @Post('login-request')
  @ApiOperation({ summary: 'Bước 1: Yêu cầu đăng nhập và nhận OTP' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'OTP đã được gửi.' })
  @ApiResponse({
    status: 401,
    description: 'Email hoặc mật khẩu không chính xác.',
  })
  async loginRequest(@Body() loginDto: LoginDto) {
    // Validate user
    await this.authService.validateUser(loginDto.email, loginDto.password);
    // Gửi OTP qua otpService (gọi qua authService)
    await this.authService.sendOtp(loginDto.email);
    return { message: 'OTP đã được gửi đến email của bạn' };
  }

  // @Post('login-verify')
  // @ApiOperation({ summary: 'Bước 2: Xác thực OTP và hoàn tất đăng nhập' })
  // @ApiBody({ type: VerifyOtpDto })
  // @ApiResponse({ status: 200, description: 'Đăng nhập thành công.' })
  // @ApiResponse({
  //   status: 400,
  //   description: 'OTP không hợp lệ hoặc đã hết hạn.',
  // })
  // async loginVerify(@Body() verifyOtpDto: VerifyOtpDto) {
  //   // Xác thực OTP qua authService
  //   await this.authService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);
  //   // Lấy user và trả về thông tin đăng nhập
  //   const user = await this.userService.findByEmail(verifyOtpDto.email);
  //   if (!user) {
  //     throw new NotFoundException('Không tìm thấy người dùng');
  //   }
  //   return this.authService.login(user.email, user.password);
  // }

  @Post('login-otp')
  @ApiOperation({ summary: 'Đăng nhập bằng email, password và OTP' })
  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
        otp: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Đăng nhập OTP thành công.' })
  @ApiResponse({ status: 401, description: 'Sai thông tin hoặc OTP.' })
  async loginWithOtp(
    @Body() body: { email: string; password: string; otp: string },
  ) {
    return this.authService.loginWithOtp(body.email, body.password, body.otp);
  }
}

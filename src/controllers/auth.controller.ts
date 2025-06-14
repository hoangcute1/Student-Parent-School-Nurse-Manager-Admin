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
  @ApiOperation({ summary: 'Bước 1: Yêu cầu đăng nhập phụ huynh và nhận OTP' })
  @ApiResponse({ status: 200, description: 'OTP đã được gửi.' })
  @ApiResponse({
    status: 401,
    description: 'Email hoặc mật khẩu không chính xác.',
  })
  async loginParent(@Body() loginDto: LoginDto) {
    // Validate user
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    // Kiểm tra phải là tài khoản phụ huynh không
    await this.authService.validateParentAccount(user['_id'].toString());

    // Gửi OTP qua otpService
    await this.authService.sendOtp(loginDto.email);
    return {
      message: 'OTP đã được gửi đến email của bạn',
      email: loginDto.email,
    };
  }
  @Post('login-parent/verify')
  @ApiOperation({
    summary: 'Bước 2: Xác thực OTP và hoàn tất đăng nhập phụ huynh',
  })
  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string', example: 'parent@example.com' },
        otp: { type: 'string', example: '123456' },
      },
      required: ['email', 'otp'],
    },
  })
  @ApiResponse({ status: 200, description: 'Đăng nhập phụ huynh thành công.' })
  @ApiResponse({
    status: 401,
    description: 'OTP không chính xác hoặc đã hết hạn.',
  })
  async verifyParentLogin(@Body() body: { email: string; otp: string }) {
    // Chỉ xác thực OTP, không kiểm tra lại tài khoản
    await this.authService.verifyOtp(body.email, body.otp);
    // Lấy thông tin user
    const user = await this.userService.findByEmail(body.email);
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // Trả về thông tin đăng nhập phụ huynh
    return this.authService.getParentLoginInfo(user['_id'].toString());
  }
  @Post('login-staff')
  @ApiOperation({ summary: 'Bước 1: Yêu cầu đăng nhập nhân viên và nhận OTP' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'OTP đã được gửi.' })
  @ApiResponse({
    status: 401,
    description: 'Email hoặc mật khẩu không chính xác.',
  })
  async loginStaff(@Body() loginDto: LoginDto) {
    // Validate user
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    // Kiểm tra có phải là staff không
    await this.authService.validateStaffAccount(user['_id'].toString());

    // Gửi OTP
    await this.authService.sendOtp(loginDto.email);
    return {
      message: 'OTP đã được gửi đến email của bạn',
      email: loginDto.email,
    };
  }

  @Post('login-staff/verify')
  @ApiOperation({
    summary: 'Bước 2: Xác thực OTP và hoàn tất đăng nhập nhân viên',
  })
  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string', example: 'staff@example.com' },
        otp: { type: 'string', example: '123456' },
      },
      required: ['email', 'otp'],
    },
  })
  @ApiResponse({ status: 200, description: 'Đăng nhập nhân viên thành công.' })
  @ApiResponse({
    status: 401,
    description: 'OTP không chính xác hoặc đã hết hạn.',
  })
  async verifyStaffLogin(@Body() body: { email: string; otp: string }) {
    // Chỉ xác thực OTP, không kiểm tra lại tài khoản
    await this.authService.verifyOtp(body.email, body.otp);
    // Lấy thông tin user
    const user = await this.userService.findByEmail(body.email);
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // Trả về thông tin đăng nhập nhân viên
    return this.authService.getStaffLoginInfo(user['_id'].toString());
  }
  @Post('login-admin')
  @ApiOperation({ summary: 'Bước 1: Yêu cầu đăng nhập admin và nhận OTP' })
  @ApiResponse({
    status: 200,
    description: 'OTP đã được gửi.',
  })
  @ApiResponse({
    status: 401,
    description: 'Email hoặc mật khẩu không chính xác.',
  })
  async loginAdmin(@Body() loginDto: LoginDto) {
    // Validate user
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    // Kiểm tra có phải là admin không
    await this.authService.validateAdminAccount(user['_id'].toString());

    // Gửi OTP
    await this.authService.sendOtp(loginDto.email);
    return {
      message: 'OTP đã được gửi đến email của bạn',
      email: loginDto.email,
    };
  }

  @Post('login-admin/verify')
  @ApiOperation({ summary: 'Bước 2: Xác thực OTP và hoàn tất đăng nhập admin' })
  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string', example: 'admin@example.com' },
        otp: { type: 'string', example: '123456' },
      },
      required: ['email', 'otp'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Đăng nhập admin thành công.',
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
    description: 'OTP không chính xác hoặc đã hết hạn.',
  })
  async verifyAdminLogin(@Body() body: { email: string; otp: string }) {
    // Chỉ xác thực OTP, không kiểm tra lại tài khoản
    await this.authService.verifyOtp(body.email, body.otp);
    // Lấy thông tin user
    const user = await this.userService.findByEmail(body.email);
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // Trả về thông tin đăng nhập admin
    return this.authService.getAdminLoginInfo(user['_id'].toString());
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

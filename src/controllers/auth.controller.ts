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
import { RegisterDto } from '@/decorations/dto/register.dto';
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

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập người dùng' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Đăng nhập thành công.' })
  @ApiResponse({
    status: 401,
    description: 'Email hoặc mật khẩu không chính xác.',
  })
  async login(@Req() req) {
    return this.authService.login(req.user);
  }
  @Post('register')
  @ApiOperation({ summary: 'Đăng ký người dùng mới' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Người dùng đã được tạo thành công.',
  })
  @ApiResponse({ status: 400, description: 'Email đã tồn tại.' })
  async register(@Body() registerDto: RegisterDto) {
    // Register the user
    const user = await this.authService.register(registerDto);

    // Determine the userId safely
    let userId: string;
    if (user._id) {
      userId = user._id.toString();
    } else if (user.id) {
      userId = user.id.toString();
    } else {
      throw new Error('User ID not available after registration');
    }

    // Create an empty profile automatically
    await this.profileService.create({
      userId: userId,
    });

    // Login the user to get tokens
    return this.authService.login(user);
  }
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Đăng xuất người dùng' })
  @ApiResponse({ status: 200, description: 'Đăng xuất thành công.' })
  async logout(@Req() req) {
    // Extract token from the authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    return this.authService.logout(req.user.userId, token);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Làm mới access token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Token đã được làm mới.' })
  @ApiResponse({ status: 401, description: 'Refresh token không hợp lệ.' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(
      refreshTokenDto.userId,
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
    const user = await this.userService.findById(req.user.userId);

    // Get user's profile
    const profile = await this.profileService.findByUserId(req.user.userId);

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
    // Validate user first
    await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
      loginDto.role,
    );
    // Send OTP
    await this.authService.sendLoginOTP(loginDto.email);
    return { message: 'OTP đã được gửi đến email của bạn' };
  }

  @Post('login-verify')
  @ApiOperation({ summary: 'Bước 2: Xác thực OTP và hoàn tất đăng nhập' })
  @ApiBody({ type: VerifyOtpDto })
  @ApiResponse({ status: 200, description: 'Đăng nhập thành công.' })
  @ApiResponse({
    status: 400,
    description: 'OTP không hợp lệ hoặc đã hết hạn.',
  })
  async loginVerify(@Body() verifyOtpDto: VerifyOtpDto) {
    // Verify OTP
    await this.authService.verifyLoginOTP(verifyOtpDto.email, verifyOtpDto.otp);

    // Get user and complete login
    const user = await this.userService.findByEmail(verifyOtpDto.email);
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    return this.authService.login(user);
  }
}

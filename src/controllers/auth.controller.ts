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

  @Post('login-staff')
  @ApiOperation({ summary: 'Bước 1: Yêu cầu đăng nhập phụ huynh và nhận OTP' })
  @ApiResponse({ status: 200, description: 'OTP đã được gửi.' })
  @ApiResponse({
    status: 401,
    description: 'Email hoặc mật khẩu không chính xác.',
  })
  async loginStaff(@Body() loginDto: LoginDto) {
    return this.authService.loginStaff(loginDto.email, loginDto.password);
  }
  @Post('login-staff/verify')
  @ApiOperation({
    summary: 'Bước 2: Xác thực OTP và hoàn tất đăng nhập phụ huynh',
  })
  @ApiResponse({ status: 200, description: 'Đăng nhập phụ huynh thành công.' })
  @ApiResponse({
    status: 401,
    description: 'OTP không chính xác hoặc đã hết hạn.',
  })
  async loginStaffOtp(@Body() loginWithOtpDto: LoginWithOtpDto) {
    return this.authService.loginStaffWithOtp(
      loginWithOtpDto.email,
      loginWithOtpDto.otp,
    );
  }

  @Post('login-admin')
  @ApiOperation({ summary: 'Bước 1: Yêu cầu đăng nhập phụ huynh và nhận OTP' })
  @ApiResponse({ status: 200, description: 'OTP đã được gửi.' })
  @ApiResponse({
    status: 401,
    description: 'Email hoặc mật khẩu không chính xác.',
  })
  async loginAdmin(@Body() loginDto: LoginDto) {
    return this.authService.loginAdmin(loginDto.email, loginDto.password);
  }
  @Post('login-admin/verify')
  @ApiOperation({
    summary: 'Bước 2: Xác thực OTP và hoàn tất đăng nhập phụ huynh',
  })
  @ApiResponse({ status: 200, description: 'Đăng nhập phụ huynh thành công.' })
  @ApiResponse({
    status: 401,
    description: 'OTP không chính xác hoặc đã hết hạn.',
  })
  async loginAdminOtp(@Body() loginWithOtpDto: LoginWithOtpDto) {
    return this.authService.loginAdminWithOtp(
      loginWithOtpDto.email,
      loginWithOtpDto.otp,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Đăng xuất người dùng' })
  @ApiResponse({ status: 200, description: 'Đăng xuất thành công.' })
  logout(@Req() req) {
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
  })  @ApiResponse({ status: 401, description: 'Refresh token không hợp lệ.' })
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
  @ApiOperation({ summary: 'Lấy thông tin chi tiết người dùng hiện tại từ token trong header' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin chi tiết của người dùng.',
    schema: {
      properties: {
        user: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
            email: { type: 'string', example: 'user@example.com' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        role: { type: 'string', example: 'parent', enum: ['user', 'parent', 'staff', 'admin'] },
        profile: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            phone: { type: 'string' },
            gender: { type: 'string' },
            birth: { type: 'string', format: 'date-time' },
            address: { type: 'string' },
            avatar: { type: 'string' }
          },
          nullable: true
        },
        parent: {
          type: 'object',
          properties: {
            _id: { type: 'string' }
          },
          nullable: true
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Chưa xác thực.' })
  async getMe(@Req() req) {
    return this.authService.getMe(req);
  }
  @Post('me/token')
  @ApiOperation({ summary: 'Lấy thông tin người dùng từ token trong body' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin chi tiết của người dùng từ token.',
    schema: {
      properties: {
        user: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
            email: { type: 'string', example: 'user@example.com' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        role: { type: 'string', example: 'parent', enum: ['user', 'parent', 'staff', 'admin'] },
        profile: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            phone: { type: 'string' },
            gender: { type: 'string' },
            birth: { type: 'string', format: 'date-time' },
            address: { type: 'string' },
            avatar: { type: 'string' }
          },
          nullable: true
        },
        parent: {
          type: 'object',
          properties: {
            _id: { type: 'string' }
          },
          nullable: true
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Token không hợp lệ.' })
  @ApiBody({
    schema: {
      properties: {
        token: { type: 'string', example: 'eyJhbGciOiJIUzI1...' },
      },
      required: ['token']
    },
  })
  async getMeFromToken(@Body('token') token: string) {
    return this.authService.getMe(token);
  }

  @Post('login-google')
@ApiOperation({ summary: 'Đăng nhập bằng Google token' })
@ApiBody({ schema: { properties: { token: { type: 'string' } } } })
@ApiResponse({ status: 200, description: 'Đăng nhập thành công.' })
@ApiResponse({
  status: 401,
  description: 'Token không hợp lệ hoặc email không tồn tại.',
})
async loginGoogle(@Body('token') token: string) {
  return this.authService.loginGoogle(token);
}
}

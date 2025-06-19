import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { GetUser } from '@/decorations/get-user.decorator';
import { SuccessResponseDto } from '@/decorations/dto/success-response.dto';

@ApiTags('user-info')
@Controller('user-info')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserInfoController {
  @Get('me')
  @ApiOperation({ summary: 'Lấy thông tin người dùng hiện tại' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin người dùng từ token',
    type: SuccessResponseDto,
  })
  getMyInfo(@GetUser() user: any) {
    return new SuccessResponseDto('Lấy thông tin người dùng thành công', {
      userId: user.user,
      email: user.email,
      role: user.role,
    });
  }

  @Get('role')
  @ApiOperation({ summary: 'Lấy vai trò của người dùng hiện tại' })
  @ApiResponse({
    status: 200,
    description: 'Vai trò người dùng',
    type: SuccessResponseDto,
  })
  getMyRole(@GetUser('role') role: string) {
    return new SuccessResponseDto('Lấy vai trò người dùng thành công', {
      role,
    });
  }
}

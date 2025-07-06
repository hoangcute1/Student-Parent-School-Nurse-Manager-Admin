import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FeedbackService } from '@/services/feedback.service';
import { FeedbackNotificationService } from '@/services/feedback-notification.service';
import { FeedbackResponseService } from '@/services/feedback-response.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '@/schemas/user.schema';
import { Feedback } from '@/schemas/feedback.schema';

@ApiTags('test')
@Controller('test')
export class TestController {
  constructor(
    private readonly feedbackService: FeedbackService,
    private readonly feedbackNotificationService: FeedbackNotificationService,
    private readonly feedbackResponseService: FeedbackResponseService,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Feedback.name) private feedbackModel: Model<Feedback>,
  ) {}

  @Get('feedback-system')
  @ApiOperation({ summary: 'Test feedback system hoạt động' })
  async testFeedbackSystem() {
    try {
      // Test basic connectivity
      const allFeedbacks = await this.feedbackService.findAll();
      const allNotifications = await this.feedbackNotificationService.findAll();
      const allResponses = await this.feedbackResponseService.findAll();

      return {
        status: 'success',
        message: 'Feedback system is working',
        data: {
          feedbacks_count: allFeedbacks.length,
          notifications_count: allNotifications.length,
          responses_count: allResponses.length,
          timestamp: new Date().toISOString(),
        },
        endpoints: {
          feedbacks: '/feedbacks',
          notifications: '/feedback-notifications',
          responses: '/feedback-responses',
        },
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Feedback system has issues',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get('health')
  @ApiOperation({ summary: 'Kiểm tra health của feedback services' })
  async healthCheck() {
    return {
      status: 'healthy',
      services: {
        feedback: 'running',
        notification: 'running',
        response: 'running',
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Get('demo-data')
  @ApiOperation({ summary: 'Tạo demo data để test' })
  async createDemoData() {
    try {
      // Tạo feedback demo (không cần auth để test)
      const demoFeedback = {
        parent: '60d0fe4f5311236168a109ca', // ID demo
        title: 'Demo Feedback - Test System',
        description: 'Đây là feedback demo để test hệ thống thông báo tự động.',
      };

      // Tạo thông báo demo
      const demoNotification = {
        feedback: '60d0fe4f5311236168a109cc',
        recipient: '60d0fe4f5311236168a109cb',
        recipientRole: 'staff',
        type: 'new_feedback',
        title: 'Demo: Feedback mới từ phụ huynh',
        message: 'Đây là thông báo demo để test hệ thống.',
      };

      return {
        status: 'demo_data_structure',
        message: 'Đây là cấu trúc data demo, cần tạo users thật để test',
        demo_feedback: demoFeedback,
        demo_notification: demoNotification,
        next_steps: [
          '1. Tạo users trong database',
          '2. Login để lấy JWT token',
          '3. Sử dụng token để test APIs',
          '4. Hoặc tạo endpoint test không cần auth',
        ],
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message,
      };
    }
  }

  @Get('users-summary')
  @ApiOperation({ summary: 'Kiểm tra users trong database' })
  async getUsersSummary() {
    try {
      const users = await this.userModel.find().select('email role username').limit(10);
      const totalUsers = await this.userModel.countDocuments();
      const usersByRole = await this.userModel.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } },
      ]);

      return {
        status: 'success',
        data: {
          total_users: totalUsers,
          users_by_role: usersByRole,
          sample_users: users,
        },
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  @Get('create-sample-data')
  @ApiOperation({ summary: 'Tạo dữ liệu mẫu cho hệ thống feedback' })
  async createSampleData() {
    try {
      // Lấy 3 users với role khác nhau
      const parent = await this.userModel.findOne({ email: 'parent@example.com' });
      const staff = await this.userModel.findOne({ email: 'staff@example.com' });
      const admin = await this.userModel.findOne({ email: 'admin@example.com' });

      if (!parent || !staff || !admin) {
        return {
          status: 'error',
          message: 'Không tìm thấy đủ users (parent, staff, admin). Vui lòng tạo users trước.',
          found_users: { parent: !!parent, staff: !!staff, admin: !!admin },
        };
      }

      // Tạo 3 feedbacks mẫu
      const feedbacks: any[] = [];

      const feedback1 = await this.feedbackService.create({
        title: 'Thắc mắc về lịch tiêm phòng',
        description:
          'Xin chào, tôi muốn hỏi về lịch tiêm phòng cho con tôi. Khi nào sẽ có đợt tiêm tiếp theo?',
        parent: parent._id.toString(),
      });
      feedbacks.push(feedback1);

      const feedback2 = await this.feedbackService.create({
        title: 'Góp ý về chất lượng dịch vụ khám sức khỏe',
        description:
          'Tôi rất hài lòng với dịch vụ khám sức khỏe của trường. Các bác sĩ rất tận tình và chu đáo.',
        parent: parent._id.toString(),
      });
      feedbacks.push(feedback2);

      const feedback3 = await this.feedbackService.create({
        title: 'Khiếu nại về thời gian chờ đợi',
        description:
          'Thời gian chờ đợi khi khám sức khỏe quá lâu. Xin cải thiện để tiết kiệm thời gian cho phụ huynh.',
        parent: parent._id.toString(),
      });
      feedbacks.push(feedback3);

      return {
        status: 'success',
        message: 'Đã tạo thành công dữ liệu mẫu',
        data: {
          feedbacks_created: feedbacks.length,
          users_involved: {
            parent: parent.email,
            staff: staff.email,
            admin: admin.email,
          },
          feedbacks: feedbacks.map((f) => ({ id: f._id, title: f.title })),
        },
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  @Get('login/:role')
  @ApiOperation({ summary: 'Login và lấy JWT token để test (parent/staff/admin)' })
  async quickLogin(@Param('role') role: string) {
    try {
      let email = '';
      switch (role) {
        case 'parent':
          email = 'parent@example.com';
          break;
        case 'staff':
          email = 'staff@example.com';
          break;
        case 'admin':
          email = 'admin@example.com';
          break;
        default:
          return {
            status: 'error',
            message: 'Role không hợp lệ. Chỉ chấp nhận: parent, staff, admin',
          };
      }

      const user = await this.userModel.findOne({ email }).lean();
      if (!user) {
        return { status: 'error', message: `Không tìm thấy user với email ${email}` };
      }

      // Tạo JWT token giả lập (trong thực tế sẽ dùng AuthService)
      const jwt = require('jsonwebtoken');
      const token = jwt.sign(
        {
          sub: user._id, // JWT strategy mong đợi 'sub' thay vì 'userId'
          email: user.email,
          role: role, // sử dụng role từ parameter
        },
        'defaultSecretKey', // Sử dụng secret key mặc định
        { expiresIn: '1h' },
      );

      return {
        status: 'success',
        message: `Đã login thành công với role ${role}`,
        data: {
          user: {
            id: user._id,
            email: user.email,
            role: role,
          },
          access_token: token,
          usage: `curl -H "Authorization: Bearer ${token}" http://localhost:3001/feedbacks`,
        },
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  @Get('feedbacks-no-auth')
  @ApiOperation({ summary: 'Lấy danh sách feedbacks không cần auth (test)' })
  async getFeedbacksNoAuth() {
    try {
      const feedbacks = await this.feedbackService.findAll();

      // Lấy responses cho mỗi feedback
      const feedbacksWithResponses = await Promise.all(
        feedbacks.map(async (feedback) => {
          const feedbackId = (feedback as any)._id.toString();
          const responses = await this.feedbackResponseService.findByFeedback(feedbackId);
          return {
            ...feedback.toObject(),
            responses: responses,
            // Nếu có response, lấy response đầu tiên làm response chính
            response: responses.length > 0 ? responses[0].response : null,
          };
        }),
      );

      return {
        status: 'success',
        data: feedbacksWithResponses,
        count: feedbacksWithResponses.length,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  @Get('notifications-no-auth')
  @ApiOperation({ summary: 'Lấy danh sách notifications không cần auth (test)' })
  async getNotificationsNoAuth() {
    try {
      const notifications = await this.feedbackNotificationService.findAll();
      return {
        status: 'success',
        data: notifications,
        count: notifications.length,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  @Get('create-notifications')
  @ApiOperation({ summary: 'Tạo thông báo cho feedbacks hiện có (test)' })
  async createNotifications() {
    try {
      const feedbacks = await this.feedbackService.findAll();
      const staffUsers = await this.userModel
        .find({
          email: { $in: ['staff@example.com', 'admin@example.com'] },
        })
        .select('_id email')
        .exec();

      if (feedbacks.length === 0) {
        return { status: 'error', message: 'Không có feedback nào để tạo thông báo' };
      }

      if (staffUsers.length === 0) {
        return { status: 'error', message: 'Không tìm thấy staff hoặc admin users' };
      }

      let totalNotifications = 0;
      for (const feedback of feedbacks) {
        for (const staff of staffUsers) {
          try {
            await this.feedbackNotificationService.create({
              feedback: (feedback as any)._id.toString(),
              recipient: (staff as any)._id.toString(),
              recipientRole:
                staff.email === 'admin@example.com' ? ('admin' as any) : ('staff' as any),
              type: 'new_feedback' as any,
              title: 'Feedback mới từ phụ huynh',
              message: `Phụ huynh đã gửi feedback với tiêu đề: "${feedback.title}". Vui lòng kiểm tra và phản hồi.`,
            });
            totalNotifications++;
          } catch (error) {
            console.error('Error creating notification:', error);
          }
        }
      }

      return {
        status: 'success',
        message: `Đã tạo ${totalNotifications} thông báo`,
        data: {
          feedbacks_count: feedbacks.length,
          staff_count: staffUsers.length,
          notifications_created: totalNotifications,
        },
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  @Post('create-feedback-no-auth')
  @ApiOperation({ summary: 'Tạo feedback mới không cần auth (test)' })
  async createFeedbackNoAuth(@Body() body: any) {
    try {
      // Sử dụng default parent ID hoặc parent ID từ body
      const defaultParentId = '684d1c638921098b6c7311ad';
      const parentId = body.parent || defaultParentId;

      const feedbackData = {
        title: body.title || 'Test feedback từ parent',
        description: body.description || 'Nội dung feedback test',
        category: body.category || null, // Thêm category
        parent: parentId,
      };

      const feedback = await this.feedbackService.create(feedbackData);

      // Kiểm tra notifications được tạo chưa
      const notifications = await this.feedbackNotificationService.findAll();
      const newNotifications = notifications.filter(
        (n) =>
          n.feedback && (n.feedback as any)._id.toString() === (feedback as any)._id.toString(),
      );

      return {
        status: 'success',
        message: 'Đã tạo feedback thành công',
        data: {
          feedback: feedback,
          notifications_created: newNotifications.length,
          notifications: newNotifications,
        },
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        stack: error.stack,
      };
    }
  }

  @Post('create-feedback-old-date')
  @ApiOperation({ summary: 'Tạo feedback với ngày cũ để test cleanup' })
  async createFeedbackWithOldDate(@Body() body: any) {
    try {
      const { title, description, rating, parent } = body;

      // Tạo feedback với ngày cũ (2 ngày trước)
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const feedback = new this.feedbackModel({
        title,
        description,
        rating,
        parent,
        createdAt: twoDaysAgo,
        updatedAt: twoDaysAgo,
      });

      const savedFeedback = await feedback.save();

      return {
        status: 'success',
        message: 'Old feedback created successfully',
        data: savedFeedback,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Post('respond-to-old-feedback')
  @ApiOperation({ summary: 'Phản hồi feedback với ngày cũ để test cleanup' })
  async respondToOldFeedback(@Body() body: any) {
    try {
      const { feedbackId, responderId, response } = body;

      // Tạo ngày phản hồi cũ (2 ngày trước)
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      // Cập nhật feedback trực tiếp với ngày cũ
      const updatedFeedback = await this.feedbackModel.findByIdAndUpdate(
        feedbackId,
        {
          response,
          status: 'resolved',
          respondedBy: responderId,
          respondedAt: twoDaysAgo,
        },
        { new: true },
      );

      return {
        status: 'success',
        message: 'Old feedback responded successfully',
        data: updatedFeedback,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get('responses-no-auth')
  @ApiOperation({ summary: 'Lấy danh sách responses không cần auth (test)' })
  async getResponsesNoAuth() {
    try {
      const responses = await this.feedbackResponseService.findAll();
      return {
        status: 'success',
        data: responses,
        count: responses.length,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  @Post('respond-feedback')
  @ApiOperation({ summary: 'Phản hồi feedback không cần auth (test)' })
  async respondFeedback(@Body() body: any) {
    try {
      const { feedbackId, responderId, response } = body;

      if (!feedbackId || !responderId || !response) {
        return {
          status: 'error',
          message: 'Missing required fields: feedbackId, responderId, response',
        };
      }

      // Sử dụng service để phản hồi feedback (bao gồm cả notification)
      const updatedFeedback = await this.feedbackService.respondToFeedback(
        feedbackId,
        responderId,
        response,
      );

      return {
        status: 'success',
        message: 'Đã phản hồi feedback thành công',
        data: updatedFeedback,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  @Post('update-feedback-response')
  @ApiOperation({ summary: 'Cập nhật phản hồi feedback không cần auth (test)' })
  async updateFeedbackResponse(@Body() body: any) {
    try {
      const { feedbackId, responderId, response } = body;

      if (!feedbackId || !responderId || !response) {
        return {
          status: 'error',
          message: 'Missing required fields: feedbackId, responderId, response',
        };
      }

      // Sử dụng service để cập nhật phản hồi feedback
      const updatedFeedback = await this.feedbackService.updateResponse(
        feedbackId,
        responderId,
        response,
      );

      return {
        status: 'success',
        message: 'Đã cập nhật phản hồi feedback thành công',
        data: updatedFeedback,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  @Get('cleanup-processed-feedbacks')
  @ApiOperation({ summary: 'Xóa thủ công feedback đã xử lý quá 1 ngày' })
  async cleanupProcessedFeedbacks() {
    try {
      const result = await this.feedbackService.manualCleanupProcessedFeedbacks();

      return {
        status: 'success',
        message: 'Cleanup completed successfully',
        data: result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get('processed-feedbacks-older-than-one-day')
  @ApiOperation({ summary: 'Kiểm tra feedback đã xử lý quá 1 ngày' })
  async getProcessedFeedbacksOlderThanOneDay() {
    try {
      const result = await this.feedbackService.getProcessedFeedbacksOlderThanOneDay();

      return {
        status: 'success',
        message: 'Retrieved processed feedbacks older than 1 day',
        data: result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get('parent-feedbacks-no-auth/:parentId')
  @ApiOperation({ summary: 'Lấy danh sách feedbacks của phụ huynh cụ thể không cần auth (test)' })
  async getParentFeedbacksNoAuth(@Param('parentId') parentId: string) {
    try {
      const feedbacks = await this.feedbackService.findByParent(parentId);

      // Lấy responses cho mỗi feedback
      const feedbacksWithResponses = await Promise.all(
        feedbacks.map(async (feedback) => {
          const feedbackId = (feedback as any)._id.toString();
          const responses = await this.feedbackResponseService.findByFeedback(feedbackId);
          return {
            ...feedback.toObject(),
            responses: responses,
            // Nếu có response, lấy response đầu tiên làm response chính
            response: responses.length > 0 ? responses[0].response : null,
          };
        }),
      );

      return {
        status: 'success',
        data: feedbacksWithResponses,
        count: feedbacksWithResponses.length,
        parentId: parentId,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  @Get('parent-feedbacks-default')
  @ApiOperation({ summary: 'Lấy danh sách feedbacks của phụ huynh mặc định không cần auth (test)' })
  async getDefaultParentFeedbacks() {
    try {
      // Sử dụng parent ID mặc định
      const defaultParentId = '684d1c638921098b6c7311ad';
      const feedbacks = await this.feedbackService.findByParent(defaultParentId);

      // Lấy responses cho mỗi feedback
      const feedbacksWithResponses = await Promise.all(
        feedbacks.map(async (feedback) => {
          const feedbackId = (feedback as any)._id.toString();
          const responses = await this.feedbackResponseService.findByFeedback(feedbackId);
          return {
            ...feedback.toObject(),
            responses: responses,
            // Nếu có response, lấy response đầu tiên làm response chính
            response: responses.length > 0 ? responses[0].response : feedback.response,
          };
        }),
      );

      return {
        status: 'success',
        data: feedbacksWithResponses,
        count: feedbacksWithResponses.length,
        parentId: defaultParentId,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  @Post('process-feedback')
  @ApiOperation({ summary: 'Xử lý feedback nhanh (chỉ cần một click)' })
  async processFeedback(@Body() body: { feedbackId: string }) {
    try {
      const { feedbackId } = body;
      const defaultResponderId = '684d08d98e8c9994a5e1ff43'; // Default staff ID
      const defaultResponse = 'Đã tiếp nhận và xử lý yêu cầu của bạn.';

      const feedback = await this.feedbackService.respondToFeedback(
        feedbackId,
        defaultResponderId,
        defaultResponse,
      );

      return {
        status: 'success',
        message: 'Đã xử lý feedback thành công',
        data: feedback,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  @Get('cleanup-stats')
  @ApiOperation({ summary: 'Lấy thống kê về cleanup feedbacks' })
  async getCleanupStats() {
    try {
      const stats = await this.feedbackService.getProcessedFeedbacksOlderThanOneDay();
      return {
        status: 'success',
        data: {
          ...stats,
          message: `Có ${stats.count} feedback đã được xử lý quá 1 ngày và sẽ được tự động xóa`,
        },
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  @Post('manual-cleanup')
  @ApiOperation({ summary: 'Thực hiện cleanup thủ công cho nhân viên' })
  async manualCleanup() {
    try {
      const result = await this.feedbackService.manualCleanupProcessedFeedbacks();
      return {
        status: 'success',
        data: result,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }
}

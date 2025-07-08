import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { FeedbackService } from '@/services/feedback.service';
import { FeedbackResponseService } from '@/services/feedback-response.service';
import { FeedbackNotificationService } from '@/services/feedback-notification.service';
import { CreateFeedbackDto } from '@/decorations/dto/feedback.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('test')
@Controller('test')
export class TestController {
  constructor(
    private readonly feedbackService: FeedbackService,
    private readonly feedbackResponseService: FeedbackResponseService,
    private readonly feedbackNotificationService: FeedbackNotificationService,
  ) {}

  @Get('feedbacks-no-auth')
  @ApiOperation({ summary: 'Get all feedbacks without authentication' })
  async getFeedbacksNoAuth() {
    try {
      const feedbacks = await this.feedbackService.findAll();
      return {
        status: 'success',
        data: feedbacks,
        count: feedbacks.length,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  @Get('parent-feedbacks-default')
  @ApiOperation({ summary: 'Get feedbacks for default parent' })
  async getDefaultParentFeedbacks() {
    try {
      const defaultParentId = '684d1c638921098b6c7311ad';
      const feedbacks = await this.feedbackService.findByParent(defaultParentId);
      return {
        status: 'success',
        data: feedbacks,
        count: feedbacks.length,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  @Get('parent-feedbacks-no-auth/:parentId')
  @ApiOperation({ summary: 'Get feedbacks for specific parent without auth' })
  async getParentFeedbacksNoAuth(@Param('parentId') parentId: string) {
    try {
      const feedbacks = await this.feedbackService.findByParent(parentId);
      return {
        status: 'success',
        data: feedbacks,
        count: feedbacks.length,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  @Post('create-feedback-no-auth')
  @ApiOperation({ summary: 'Create feedback without authentication' })
  async createFeedbackNoAuth(@Body() createFeedbackDto: CreateFeedbackDto) {
    try {
      const feedback = await this.feedbackService.create(createFeedbackDto);
      return {
        status: 'success',
        data: {
          feedback: feedback,
        },
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  @Post('respond-feedback')
  @ApiOperation({ summary: 'Respond to feedback without authentication' })
  async respondFeedback(
    @Body() body: { feedbackId: string; responderId: string; response: string },
  ) {
    try {
      const { feedbackId, responderId, response } = body;
      const updatedFeedback = await this.feedbackService.respondToFeedback(
        feedbackId,
        responderId,
        response,
      );
      return {
        status: 'success',
        data: updatedFeedback,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  @Get('responses-no-auth')
  @ApiOperation({ summary: 'Get all responses without authentication' })
  async getResponsesNoAuth() {
    try {
      const responses = await this.feedbackResponseService.findAll();
      return {
        status: 'success',
        data: responses,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  @Post('update-feedback-response')
  @ApiOperation({ summary: 'Update feedback response without authentication' })
  async updateFeedbackResponse(
    @Body() body: { feedbackId: string; responderId: string; response: string },
  ) {
    try {
      const { feedbackId, responderId, response } = body;
      const updatedFeedback = await this.feedbackService.updateResponse(
        feedbackId,
        responderId,
        response,
      );
      return {
        status: 'success',
        data: updatedFeedback,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  @Post('process-feedback')
  @ApiOperation({ summary: 'Process feedback quickly without authentication' })
  async processFeedback(@Body() body: { feedbackId: string }) {
    try {
      const { feedbackId } = body;
      const responderId = '684d08d98e8c9994a5e1ff43'; // Default staff ID
      const response = 'Đã tiếp nhận và xử lý yêu cầu của bạn.';

      const updatedFeedback = await this.feedbackService.respondToFeedback(
        feedbackId,
        responderId,
        response,
      );
      return {
        status: 'success',
        data: updatedFeedback,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  @Get('notifications-no-auth')
  @ApiOperation({ summary: 'Get all notifications without authentication' })
  async getNotificationsNoAuth() {
    try {
      const notifications = await this.feedbackNotificationService.findAll();
      return {
        status: 'success',
        data: notifications,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  @Post('create-feedback-old-date')
  @ApiOperation({ summary: 'Create feedback with old date for testing' })
  async createFeedbackOldDate(@Body() createFeedbackDto: CreateFeedbackDto) {
    try {
      const feedback = await this.feedbackService.create(createFeedbackDto);
      // Update the created date to be 2 days ago
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      // Update the feedback with old date
      await this.feedbackService.updateFeedbackWithOldDate(
        (feedback as any)._id.toString(),
        twoDaysAgo,
      );

      return {
        status: 'success',
        data: {
          feedback: feedback,
        },
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  @Post('respond-to-old-feedback')
  @ApiOperation({ summary: 'Respond to feedback with old date for testing' })
  async respondToOldFeedback(
    @Body() body: { feedbackId: string; responderId: string; response: string },
  ) {
    try {
      const { feedbackId, responderId, response } = body;
      const updatedFeedback = await this.feedbackService.respondToFeedback(
        feedbackId,
        responderId,
        response,
      );

      // Update the responded date to be 2 days ago
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      await this.feedbackService.updateFeedbackRespondedDate(feedbackId, twoDaysAgo);

      return {
        status: 'success',
        data: updatedFeedback,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  @Get('processed-feedbacks-older-than-one-day')
  @ApiOperation({ summary: 'Get processed feedbacks older than one day' })
  async getProcessedFeedbacksOlderThanOneDay() {
    try {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const feedbacks = await this.feedbackService.findProcessedFeedbacksOlderThan(oneDayAgo);

      return {
        status: 'success',
        data: {
          feedbacks,
          count: feedbacks.length,
        },
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  @Get('cleanup-processed-feedbacks')
  @ApiOperation({ summary: 'Manual cleanup of processed feedbacks' })
  async cleanupProcessedFeedbacks() {
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

  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  async health() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        feedback: 'operational',
        notifications: 'operational',
        responses: 'operational',
      },
    };
  }

  @Get('feedback-system')
  @ApiOperation({ summary: 'Feedback system summary' })
  async feedbackSystemSummary() {
    try {
      const feedbacks = await this.feedbackService.findAll();
      const notifications = await this.feedbackNotificationService.findAll();
      const responses = await this.feedbackResponseService.findAll();

      return {
        status: 'success',
        data: {
          feedbacks_count: feedbacks.length,
          notifications_count: notifications.length,
          responses_count: responses.length,
        },
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }
}

import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { FeedbackService } from '@/services/feedback.service';
import { FeedbackResponseService } from '@/services/feedback-response.service';
import { FeedbackNotificationService } from '@/services/feedback-notification.service';
import { HealthExaminationService } from '@/services/health-examination.service';
import { StudentService } from '@/services/student.service';
import { CreateFeedbackDto } from '@/decorations/dto/feedback.dto';
import { Gender } from '@/decorations/dto/create-student.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('test')
@Controller('test')
export class TestController {
  constructor(
    private readonly feedbackService: FeedbackService,
    private readonly feedbackResponseService: FeedbackResponseService,
    private readonly feedbackNotificationService: FeedbackNotificationService,
    private readonly healthExaminationService: HealthExaminationService,
    private readonly studentService: StudentService,
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

  @Get('health-examinations-no-auth')
  @ApiOperation({ summary: 'Get all health examinations without authentication' })
  async getHealthExaminationsNoAuth() {
    try {
      const examinations = await this.healthExaminationService.findAll();
      return {
        status: 'success',
        data: examinations,
        count: examinations.length,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  @Get('approved-health-examinations-no-auth')
  @ApiOperation({ summary: 'Get approved health examinations without authentication' })
  async getApprovedHealthExaminationsNoAuth() {
    try {
      const examinations = await this.healthExaminationService.getApprovedExaminations();
      return {
        status: 'success',
        data: examinations,
        count: examinations.length,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  @Get('students-grade/:gradeLevel/no-auth')
  @ApiOperation({ summary: 'Get students by grade level without authentication' })
  async getStudentsByGradeNoAuth(@Param('gradeLevel') gradeLevel: string) {
    try {
      const students = await this.studentService.findByGradeLevel(parseInt(gradeLevel));
      return {
        status: 'success',
        data: students,
        count: students.length,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  @Get('create-health-exam-test')
  @ApiOperation({ summary: 'Test creating health examination without authentication' })
  async createHealthExamTest() {
    try {
      // Create health examination for testing with fake student ID
      const testData = {
        title: 'Test Khám sức khỏe',
        description: 'Test mô tả khám sức khỏe',
        examination_date: new Date('2025-07-15'),
        examination_time: '08:00',
        location: 'Phòng y tế',
        doctor_name: 'Bác sĩ Test',
        examination_type: 'Khám tổng quát',
        target_type: 'individual' as const,
        student_id: '66d9e9a4f8b123456789abcd', // fake student ID for testing
      };

      const result = await this.healthExaminationService.create(
        testData,
        '66d9e9a4f8b123456789abcd',
      );
      return {
        status: 'success',
        data: result,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        stack: error.stack,
      };
    }
  }

  @Get('create-health-exam-grade-test')
  @ApiOperation({
    summary: 'Test creating health examination for grade levels without authentication',
  })
  async createHealthExamGradeTest() {
    try {
      // Create health examination for grade levels
      const testData = {
        title: 'Test Khám sức khỏe khối 3',
        description: 'Test mô tả khám sức khỏe cho học sinh khối 3',
        examination_date: new Date('2025-07-20'),
        examination_time: '09:00',
        location: 'Phòng y tế trường',
        doctor_name: 'Bác sĩ Nguyễn Văn A',
        examination_type: 'Khám tổng quát',
        target_type: 'grade' as const,
        grade_levels: [3],
        // No student_id required for grade-level examinations
      };

      const result = await this.healthExaminationService.create(
        testData,
        '66d9e9a4f8b123456789abcd',
      );
      return {
        status: 'success',
        data: result,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        stack: error.stack,
      };
    }
  }

  @Get('students-by-grade/:grade')
  @ApiOperation({ summary: 'Get students by grade level for testing' })
  async getStudentsByGrade(@Param('grade') grade: string) {
    try {
      const gradeLevel = parseInt(grade);
      const students = await this.studentService.findByGradeLevel(gradeLevel);
      return {
        status: 'success',
        grade_level: gradeLevel,
        count: students.length,
        data: students,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        stack: error.stack,
      };
    }
  }

  @Get('health-examination-summary')
  @ApiOperation({ summary: 'Summary of health examination functionality tests' })
  async healthExaminationSummary() {
    try {
      // Test individual examination creation
      const individualResult = await this.healthExaminationService.create(
        {
          title: 'Test Individual Examination',
          description: 'Test individual health examination',
          examination_date: new Date('2025-08-05'),
          examination_time: '10:00',
          location: 'Medical Room',
          doctor_name: 'Dr. Individual',
          examination_type: 'General',
          target_type: 'individual',
          student_id: '6853d4a13de7f2cd957feb4e',
        },
        '66d9e9a4f8b123456789abcd',
      );

      // Test grade-level examination creation
      const gradeResult = await this.healthExaminationService.create(
        {
          title: 'Test Grade Level Examination',
          description: 'Test grade-level health examination',
          examination_date: new Date('2025-08-10'),
          examination_time: '09:00',
          location: 'School Medical Room',
          doctor_name: 'Dr. Grade',
          examination_type: 'Comprehensive',
          target_type: 'grade',
          grade_levels: [3],
        },
        '66d9e9a4f8b123456789abcd',
      );

      return {
        status: 'success',
        message: 'Health examination system is working correctly',
        tests: {
          individual_examination: {
            status: 'success',
            result: individualResult,
          },
          grade_level_examination: {
            status: 'success',
            result: gradeResult,
          },
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

  @Get('cleanup-invalid-health-examinations')
  @ApiOperation({ summary: 'Clean up health examinations with null student_id' })
  async cleanupInvalidHealthExaminations() {
    try {
      const allExaminations = await this.healthExaminationService.findAll();
      const invalidExaminations = allExaminations.filter((exam) => !exam.student_id);

      const deletedIds: string[] = [];

      for (const exam of invalidExaminations) {
        try {
          await this.healthExaminationService.delete((exam as any)._id.toString());
          deletedIds.push((exam as any)._id.toString());
        } catch (error) {
          console.error(`Failed to delete examination ${(exam as any)._id}:`, error);
        }
      }

      return {
        status: 'success',
        message: `Cleaned up ${deletedIds.length} invalid health examinations`,
        deleted_count: deletedIds.length,
        deleted_ids: deletedIds,
        total_invalid_found: invalidExaminations.length,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        stack: error.stack,
      };
    }
  }
}

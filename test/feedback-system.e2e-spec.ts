import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { FeedbackService } from '../src/services/feedback.service';
import { FeedbackNotificationService } from '../src/services/feedback-notification.service';
import { FeedbackResponseService } from '../src/services/feedback-response.service';

describe('Feedback System (e2e)', () => {
  let app: INestApplication;
  let feedbackService: FeedbackService;
  let notificationService: FeedbackNotificationService;
  let responseService: FeedbackResponseService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    feedbackService = moduleFixture.get<FeedbackService>(FeedbackService);
    notificationService = moduleFixture.get<FeedbackNotificationService>(
      FeedbackNotificationService,
    );
    responseService = moduleFixture.get<FeedbackResponseService>(FeedbackResponseService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Feedback Creation and Notification Flow', () => {
    it('should create feedback and auto-generate staff notifications', async () => {
      const createFeedbackDto = {
        title: 'E2E Test Feedback',
        description: 'Testing feedback creation with automatic notifications',
        parent: '684d1c638921098b6c7311ad',
      };

      const response = await request(app.getHttpServer())
        .post('/test/create-feedback-no-auth')
        .send(createFeedbackDto)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.data.feedback).toBeDefined();
      expect(response.body.data.feedback.title).toBe(createFeedbackDto.title);

      // Verify notifications were created
      const notifications = await notificationService.findAll();
      const newFeedbackNotifications = notifications.filter(
        (n) =>
          n.type === 'new_feedback' && n.feedback.toString() === response.body.data.feedback._id,
      );

      expect(newFeedbackNotifications.length).toBeGreaterThan(0);
    });

    it('should respond to feedback and notify parent', async () => {
      // First create a feedback
      const createResponse = await request(app.getHttpServer())
        .post('/test/create-feedback-no-auth')
        .send({
          title: 'E2E Response Test',
          description: 'Testing staff response flow',
          parent: '684d1c638921098b6c7311ad',
        });

      const feedbackId = createResponse.body.data.feedback._id;

      // Staff responds to feedback
      const responseDto = {
        feedbackId,
        responderId: '684d08d98e8c9994a5e1ff43',
        response: 'Thank you for your feedback. We will improve our service.',
      };

      const respondResponse = await request(app.getHttpServer())
        .post('/test/respond-feedback')
        .send(responseDto)
        .expect(201);

      expect(respondResponse.body.status).toBe('success');

      // Verify parent notification was created
      const notifications = await notificationService.findAll();
      const responseNotifications = notifications.filter(
        (n) => n.type === 'feedback_response' && n.feedback.toString() === feedbackId,
      );

      expect(responseNotifications.length).toBeGreaterThan(0);
    });
  });

  describe('Auto Cleanup Functionality', () => {
    it('should cleanup processed feedbacks older than 1 day', async () => {
      // Create old feedback
      const oldFeedbackResponse = await request(app.getHttpServer())
        .post('/test/create-feedback-old-date')
        .send({
          title: 'Old E2E Test Feedback',
          description: 'Old feedback for cleanup testing',
          parent: '684d1c638921098b6c7311ad',
        });

      const oldFeedbackId = oldFeedbackResponse.body.data._id;

      // Respond with old date
      await request(app.getHttpServer()).post('/test/respond-to-old-feedback').send({
        feedbackId: oldFeedbackId,
        responderId: '684d08d98e8c9994a5e1ff43',
        response: 'Old response for cleanup test',
      });

      // Check feedbacks before cleanup
      const beforeCleanup = await request(app.getHttpServer())
        .get('/test/processed-feedbacks-older-than-one-day')
        .expect(200);

      expect(beforeCleanup.body.data.count).toBeGreaterThan(0);

      // Run cleanup
      const cleanupResponse = await request(app.getHttpServer())
        .get('/test/cleanup-processed-feedbacks')
        .expect(200);

      expect(cleanupResponse.body.data.deletedCount).toBeGreaterThan(0);

      // Verify cleanup
      const afterCleanup = await request(app.getHttpServer())
        .get('/test/processed-feedbacks-older-than-one-day')
        .expect(200);

      expect(afterCleanup.body.data.count).toBe(0);
    });
  });

  describe('System Health and Status', () => {
    it('should return healthy status', async () => {
      const response = await request(app.getHttpServer()).get('/test/health').expect(200);

      expect(response.body.status).toBe('healthy');
      expect(response.body.services).toBeDefined();
    });

    it('should return system summary', async () => {
      const response = await request(app.getHttpServer()).get('/test/feedback-system').expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toBeDefined();
      expect(response.body.data.feedbacks_count).toBeGreaterThanOrEqual(0);
      expect(response.body.data.notifications_count).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Performance and Load Testing', () => {
    it('should handle multiple feedback creations', async () => {
      const startTime = Date.now();
      const promises: Promise<any>[] = [];

      // Create 10 feedbacks simultaneously
      for (let i = 0; i < 10; i++) {
        promises.push(
          request(app.getHttpServer())
            .post('/test/create-feedback-no-auth')
            .send({
              title: `Load Test Feedback ${i}`,
              description: `Performance test feedback number ${i}`,
            }),
        );
      }

      const responses = await Promise.all(promises);
      const endTime = Date.now();
      const duration = endTime - startTime;

      // All requests should succeed
      responses.forEach((response: any) => {
        expect(response.status).toBe(201);
        expect(response.body.status).toBe('success');
      });

      // Should complete within reasonable time (10 seconds)
      expect(duration).toBeLessThan(10000);

      console.log(`Created 10 feedbacks in ${duration}ms`);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid feedback data', async () => {
      const invalidFeedback = {
        title: '', // Empty title
        description: '',
        parent: 'invalid-id',
      };

      const response = await request(app.getHttpServer())
        .post('/test/create-feedback-no-auth')
        .send(invalidFeedback);

      // Should handle gracefully, not crash
      expect([400, 422, 500]).toContain(response.status);
    });

    it('should handle responding to non-existent feedback', async () => {
      const response = await request(app.getHttpServer()).post('/test/respond-feedback').send({
        feedbackId: '507f1f77bcf86cd799439011', // Valid ObjectId but non-existent
        responderId: '684d08d98e8c9994a5e1ff43',
        response: 'Response to non-existent feedback',
      });

      expect([404, 500]).toContain(response.status);
    });
  });

  describe('Data Consistency', () => {
    it('should maintain referential integrity', async () => {
      // Create feedback
      const createResponse = await request(app.getHttpServer())
        .post('/test/create-feedback-no-auth')
        .send({
          title: 'Integrity Test',
          description: 'Testing data consistency',
          parent: '684d1c638921098b6c7311ad',
        });

      const feedbackId = createResponse.body.data.feedback._id;

      // Get all notifications
      const notificationsResponse = await request(app.getHttpServer())
        .get('/test/notifications-no-auth')
        .expect(200);

      // Find notifications related to this feedback
      const relatedNotifications = notificationsResponse.body.data.filter(
        (n) => n.feedback && n.feedback._id === feedbackId,
      );

      expect(relatedNotifications.length).toBeGreaterThan(0);

      // Each notification should have proper structure
      relatedNotifications.forEach((notification) => {
        expect(notification.feedback).toBeDefined();
        expect(notification.recipient).toBeDefined();
        expect(notification.type).toBeDefined();
        expect(notification.title).toBeDefined();
        expect(notification.message).toBeDefined();
      });
    });
  });
});

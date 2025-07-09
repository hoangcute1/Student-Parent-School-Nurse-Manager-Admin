import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SimpleNotificationService } from '@/services/simple-notification.service';

@ApiTags('test-notifications')
@Controller('test-notifications')
export class TestNotificationController {
  constructor(private readonly notificationService: SimpleNotificationService) {}

  @Post('create-test')
  async createTestNotification(@Body() body: any) {
    try {
      console.log('Creating test notification with data:', body);

      const notification = await this.notificationService.create({
        parent: body.parent || '60d0fe4f5311236168a109ca', // dummy parent ID
        student: body.student || '60d0fe4f5311236168a109cb', // dummy student ID
        content: body.content || 'Test notification content',
        notes: body.notes || 'Test notification notes',
        type: body.type || 'TEST',
        relatedId: body.relatedId || 'test-related-id',
      });

      console.log('Test notification created:', notification);
      return { success: true, data: notification };
    } catch (error) {
      console.error('Error creating test notification:', error);
      return { success: false, error: error.message };
    }
  }

  @Get('all')
  async getAllNotifications() {
    try {
      const notifications = await this.notificationService.findAll();
      console.log('All notifications:', notifications);
      return { success: true, data: notifications };
    } catch (error) {
      console.error('Error getting notifications:', error);
      return { success: false, error: error.message };
    }
  }
}

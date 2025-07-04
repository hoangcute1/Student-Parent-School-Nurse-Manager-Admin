# Hệ Thống Feedback với Thông Báo Tự Động

## Tổng quan
Hệ thống cho phép phụ huynh gửi feedback/thắc mắc và nhân viên y tế/quản lý có thể phản hồi. Hệ thống tự động tạo thông báo cho các bên liên quan.

## Tính năng chính

### 1. Phụ huynh gửi feedback
- Phụ huynh có thể gửi feedback với tiêu đề và nội dung
- Hệ thống tự động thông báo cho tất cả nhân viên y tế và quản lý

### 2. Nhân viên nhận thông báo và phản hồi
- Nhân viên nhận thông báo realtime khi có feedback mới
- Có thể xem chi tiết feedback và gửi phản hồi
- Hệ thống tự động thông báo cho phụ huynh khi có phản hồi

### 3. Quản lý thông báo
- Theo dõi trạng thái đã đọc/chưa đọc
- Đếm số thông báo chưa đọc
- Đánh dấu tất cả thông báo đã đọc

## API Endpoints

### Feedback APIs
```
POST   /api/feedbacks                    - Tạo feedback mới
GET    /api/feedbacks                    - Lấy tất cả feedback  
GET    /api/feedbacks/parent/:parentId   - Feedback của phụ huynh
GET    /api/feedbacks/:id               - Chi tiết feedback
POST   /api/feedbacks/:id/respond       - Nhân viên phản hồi
PATCH  /api/feedbacks/:id               - Cập nhật feedback
DELETE /api/feedbacks/:id               - Xóa feedback
```

### Notification APIs
```
GET    /api/feedback-notifications/recipient/:userId                    - Thông báo của user
GET    /api/feedback-notifications/recipient/:userId/unread             - Thông báo chưa đọc
GET    /api/feedback-notifications/recipient/:userId/unread-count       - Số thông báo chưa đọc
GET    /api/feedback-notifications/role/:role                          - Thông báo theo role
PATCH  /api/feedback-notifications/:id/mark-read                       - Đánh dấu đã đọc
PATCH  /api/feedback-notifications/recipient/:userId/mark-all-read     - Đánh dấu tất cả đã đọc
```

### Response APIs
```
GET    /api/feedback-responses/feedback/:feedbackId   - Phản hồi của feedback
GET    /api/feedback-responses/:id                   - Chi tiết phản hồi
PATCH  /api/feedback-responses/:id/mark-read         - Đánh dấu phản hồi đã đọc
```

## Ví dụ sử dụng

### 1. Phụ huynh gửi feedback
```javascript
const feedback = await fetch('/api/feedbacks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    parent: 'parentId',
    title: 'Góp ý về dịch vụ y tế',
    description: 'Tôi muốn góp ý về việc cấp phát thuốc...'
  })
});
```

### 2. Nhân viên lấy thông báo chưa đọc
```javascript
const unreadNotifications = await fetch('/api/feedback-notifications/recipient/staffId/unread');
const unreadCount = await fetch('/api/feedback-notifications/recipient/staffId/unread-count');
```

### 3. Nhân viên phản hồi feedback
```javascript
const response = await fetch('/api/feedbacks/feedbackId/respond', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    responderId: 'staffId',
    response: 'Cảm ơn phụ huynh đã góp ý. Chúng tôi sẽ cải thiện dịch vụ.'
  })
});
```

### 4. Đánh dấu thông báo đã đọc
```javascript
await fetch('/api/feedback-notifications/notificationId/mark-read', {
  method: 'PATCH'
});
```

## Database Schema

### Feedback
```typescript
{
  parent: ObjectId,           // Phụ huynh gửi feedback
  title: string,             // Tiêu đề
  description: string,       // Nội dung feedback
  response: string,          // Phản hồi từ nhân viên
  status: string,            // pending/in_progress/resolved
  respondedBy: ObjectId,     // Nhân viên phản hồi
  respondedAt: Date,         // Thời gian phản hồi
  created_at: Date,
  updated_at: Date
}
```

### FeedbackNotification
```typescript
{
  feedback: ObjectId,        // Feedback liên quan
  recipient: ObjectId,       // Người nhận thông báo
  recipientRole: string,     // Role của người nhận (staff/admin/parent)
  type: string,             // new_feedback/feedback_response
  title: string,            // Tiêu đề thông báo
  message: string,          // Nội dung thông báo
  isRead: boolean,          // Đã đọc chưa
  created_at: Date
}
```

### FeedbackResponse
```typescript
{
  feedback: ObjectId,        // Feedback được phản hồi
  responder: ObjectId,       // Nhân viên phản hồi
  response: string,          // Nội dung phản hồi
  isRead: boolean,          // Phụ huynh đã đọc chưa
  created_at: Date
}
```

## Installation & Setup

1. Import các module cần thiết vào app.module.ts:
```typescript
import { FeedbackModule } from './modules/feedback.module';
import { FeedbackEnhancedModule } from './modules/feedback-enhanced.module';

@Module({
  imports: [
    // ...existing modules
    FeedbackModule,
    FeedbackEnhancedModule,
  ],
})
export class AppModule {}
```

2. Các schema sẽ tự động được tạo khi chạy ứng dụng

3. Test APIs bằng Swagger UI tại `/api/docs`

## Luồng hoạt động

1. **Phụ huynh gửi feedback** → Tự động tạo thông báo cho staff/admin
2. **Staff/admin nhận thông báo** → Xem và phản hồi feedback  
3. **Hệ thống tự động thông báo** → Phụ huynh nhận được thông báo phản hồi
4. **Theo dõi trạng thái** → Các bên có thể theo dõi đã đọc/chưa đọc

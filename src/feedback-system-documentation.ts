// Ví dụ về cách sử dụng hệ thống feedback với thông báo

/*
WORKFLOW CỦA HỆ THỐNG FEEDBACK VỚI THÔNG BÁO:

1. PHỤ HUYNH GỬI FEEDBACK:
   - POST /api/feedbacks
   - Body: { parent: "parentId", title: "Tiêu đề", description: "Nội dung feedback" }
   - Hệ thống tự động tạo thông báo cho tất cả nhân viên y tế và quản lý

2. NHÂN VIÊN NHẬN THÔNG BÁO:
   - GET /api/feedback-notifications/recipient/{userId}/unread
   - Lấy danh sách thông báo chưa đọc
   - GET /api/feedback-notifications/recipient/{userId}/unread-count
   - Lấy số lượng thông báo chưa đọc

3. NHÂN VIÊN XEM VÀ PHẢN HỒI FEEDBACK:
   - GET /api/feedbacks/{feedbackId} - Xem chi tiết feedback
   - POST /api/feedbacks/{feedbackId}/respond
   - Body: { responderId: "staffId", response: "Nội dung phản hồi" }
   - Hệ thống tự động tạo thông báo cho phụ huynh

4. PHỤ HUYNH NHẬN THÔNG BÁO PHẢN HỒI:
   - GET /api/feedback-notifications/recipient/{parentId}/unread
   - Lấy thông báo về phản hồi từ nhân viên

5. ĐÁNH DẤU ĐÃ ĐỌC:
   - PATCH /api/feedback-notifications/{notificationId}/mark-read
   - Đánh dấu thông báo đã đọc
   - PATCH /api/feedback-notifications/recipient/{userId}/mark-all-read
   - Đánh dấu tất cả thông báo đã đọc

CÁC API ENDPOINTS CHÍNH:

FEEDBACK:
- POST /api/feedbacks - Tạo feedback mới
- GET /api/feedbacks - Lấy tất cả feedback
- GET /api/feedbacks/parent/{parentId} - Feedback của phụ huynh
- GET /api/feedbacks/{id} - Chi tiết feedback
- POST /api/feedbacks/{id}/respond - Nhân viên phản hồi
- PATCH /api/feedbacks/{id} - Cập nhật feedback
- DELETE /api/feedbacks/{id} - Xóa feedback

FEEDBACK NOTIFICATIONS:
- GET /api/feedback-notifications/recipient/{userId} - Thông báo của user
- GET /api/feedback-notifications/recipient/{userId}/unread - Thông báo chưa đọc
- GET /api/feedback-notifications/recipient/{userId}/unread-count - Số thông báo chưa đọc
- GET /api/feedback-notifications/role/{role} - Thông báo theo role
- PATCH /api/feedback-notifications/{id}/mark-read - Đánh dấu đã đọc
- PATCH /api/feedback-notifications/recipient/{userId}/mark-all-read - Đánh dấu tất cả đã đọc

FEEDBACK RESPONSES:
- GET /api/feedback-responses/feedback/{feedbackId} - Phản hồi của feedback
- GET /api/feedback-responses/{id} - Chi tiết phản hồi
- PATCH /api/feedback-responses/{id}/mark-read - Đánh dấu phản hồi đã đọc

LUỒNG THÔNG BÁO:
1. Phụ huynh gửi feedback → Tự động thông báo cho staff/admin
2. Staff/admin phản hồi → Tự động thông báo cho phụ huynh
3. Các bên có thể theo dõi trạng thái đã đọc/chưa đọc
4. Đếm số thông báo chưa đọc để hiển thị badge

SCHEMA DATABASE:
- feedbacks: Lưu feedback gốc với response
- feedback_responses: Lưu chi tiết các phản hồi từ nhân viên
- feedback_notifications: Lưu thông báo cho từng user
*/

export const FeedbackSystemDocumentation = {
  title: 'Hệ thống Feedback với Thông báo Tự động',
  description:
    'Hệ thống cho phép phụ huynh gửi feedback và nhân viên phản hồi với thông báo tự động',
  features: [
    'Phụ huynh gửi feedback',
    'Tự động thông báo cho nhân viên y tế và quản lý',
    'Nhân viên phản hồi feedback',
    'Tự động thông báo phản hồi cho phụ huynh',
    'Theo dõi trạng thái đã đọc/chưa đọc',
    'Đếm số thông báo chưa đọc',
    'API đầy đủ cho frontend',
  ],
};

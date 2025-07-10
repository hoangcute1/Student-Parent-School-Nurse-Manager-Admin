# Chức năng Quản lý Lịch Khám Sức Khỏe

## Tổng quan
Chức năng cho phép nhân viên y tế tạo lịch khám sức khỏe cho học sinh và gửi thông báo đến phụ huynh. Phụ huynh có thể đồng ý hoặc từ chối, và chỉ những lịch khám được đồng ý mới được lưu lại trong hệ thống.

## Luồng hoạt động

### 1. Nhân viên y tế tạo lịch khám (/cms/health-result)
- Truy cập trang `/cms/health-result`
- Nhấn nút "Tạo lịch khám"
- Điền thông tin:
  - Tiêu đề lịch khám
  - Mô tả chi tiết
  - Ngày và giờ khám
  - Địa điểm (tùy chọn)
  - Bác sĩ phụ trách (tùy chọn)
  - Loại khám (tùy chọn)
  - Chọn học sinh
- Nhấn "Tạo lịch khám"

### 2. Hệ thống gửi thông báo
- Tự động tìm phụ huynh của học sinh
- Tạo thông báo trong database
- Thông báo sẽ hiển thị tại `/dashboard/events` tab "Lịch khám sức khỏe"

### 3. Phụ huynh xem và phản hồi (/dashboard/events)
- Phụ huynh đăng nhập vào dashboard
- Vào tab "Lịch khám sức khỏe" tại `/dashboard/events`
- Xem chi tiết lịch khám
- Chọn "Đồng ý" hoặc "Từ chối"
- Có thể thêm ghi chú hoặc lý do từ chối

### 4. Cập nhật kết quả
- **Nếu đồng ý**: Lịch khám chuyển sang trạng thái "Đã đồng ý" và được lưu lại
- **Nếu từ chối**: Lịch khám chuyển sang trạng thái "Đã từ chối" và không được lưu lại
- Nhân viên y tế có thể xem kết quả tại `/cms/health-result`

## Cấu trúc Backend

### Schemas
- `HealthExamination` (schemas/health-examination.schema.ts)
- `Notification` (schemas/notification.schema.ts) - đã cập nhật thêm HealthExamination type

### Services
- `HealthExaminationService` (services/health-examination.service.ts)
- `NotificationService` (services/notification.service.ts) - đã thêm method gửi thông báo

### Controllers
- `HealthExaminationController` (controllers/health-examination.controller.ts)
- `NotificationController` (controllers/notification.controller.ts) - đã thêm endpoint respond

### Modules
- `HealthExaminationModule` (modules/health-examination.module.ts)

## Cấu trúc Frontend

### Pages
- `/cms/health-result/page.tsx` - Trang quản lý lịch khám cho nhân viên y tế
- `/dashboard/events/page.tsx` - Trang xem thông báo cho phụ huynh (đã cập nhật)

### Components
- `CreateHealthExaminationForm` - Form tạo lịch khám
- `HealthExaminationList` - Danh sách lịch khám đã tạo
- `HealthExaminationNotifications` - Hiển thị thông báo lịch khám cho phụ huynh

### API Routes
- `/api/health-examinations` - CRUD lịch khám
- `/api/health-examinations/[id]` - Chi tiết/xóa lịch khám
- `/api/notifications/[id]/respond` - Phản hồi thông báo
- `/api/notifications/parent/[parentId]` - Lấy thông báo của phụ huynh
- `/api/students/search` - Tìm kiếm học sinh

## Trạng thái lịch khám

### ExaminationStatus (Backend)
- `PENDING` - Chờ phản hồi từ phụ huynh
- `APPROVED` - Phụ huynh đã đồng ý
- `REJECTED` - Phụ huynh đã từ chối
- `COMPLETED` - Đã hoàn thành khám
- `CANCELLED` - Đã hủy

### NotificationStatus (Backend)
- `Pending` - Chờ phản hồi
- `Agree` - Đồng ý
- `Disagree` - Từ chối

## Cài đặt và chạy

### Backend
1. Thêm HealthExaminationModule vào AppModule
2. Chạy `npm run dev` để start backend server

### Frontend
1. Components đã được tạo sẵn
2. API routes đã được thiết lập
3. Chạy `npm run dev` để start frontend

## Tính năng chính

### Cho nhân viên y tế:
- ✅ Tạo lịch khám với đầy đủ thông tin
- ✅ Tìm kiếm và chọn học sinh
- ✅ Xem danh sách tất cả lịch khám đã tạo
- ✅ Theo dõi trạng thái phản hồi từ phụ huynh
- ✅ Xóa lịch khám chưa được phản hồi
- ✅ Xem thống kê tổng quan

### Cho phụ huynh:
- ✅ Nhận thông báo lịch khám tự động
- ✅ Xem chi tiết thông tin lịch khám
- ✅ Đồng ý hoặc từ chối với ghi chú
- ✅ Theo dõi trạng thái phản hồi

### Hệ thống:
- ✅ Tự động gửi thông báo khi tạo lịch khám
- ✅ Cập nhật trạng thái theo phản hồi phụ huynh
- ✅ Chỉ lưu lại lịch khám được đồng ý
- ✅ Giao diện thân thiện và dễ sử dụng

## Lưu ý kỹ thuật

1. **Authentication**: Cần implement authentication cho cả nhân viên y tế và phụ huynh
2. **Parent-Student Relationship**: Cần hoàn thiện logic tìm phụ huynh từ học sinh
3. **Real-time Updates**: Có thể thêm WebSocket để cập nhật real-time
4. **Email Notifications**: Có thể thêm gửi email thông báo
5. **File Uploads**: Có thể thêm upload file đính kèm cho lịch khám

## Files cần thay thế

Để sử dụng giao diện mới, thay thế file sau:
- `d:\SUM25\SWP391\SWP391-FE\src\app\cms\health-result\page.tsx` bằng nội dung trong `new-page.tsx`

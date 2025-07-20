# Dashboard Events - Badge Thông Báo Chưa Đọc

## Tính năng

Trang Events trong Dashboard hiện có tính năng hiển thị badge tròn đỏ nhỏ ở tab "Lịch hẹn tư vấn" để hiển thị tổng số lịch hẹn tư vấn chưa đánh dấu đã đọc.

## Cách hoạt động

### 1. Hook `useUnreadConsultations`
- **File**: `src/hooks/use-unread-consultations.ts`
- **Chức năng**: 
  - Đếm số lượng thông báo lịch hẹn tư vấn chưa đọc
  - Tự động refresh mỗi 30 giây
  - Cung cấp function `refreshUnreadCount` để refresh thủ công

### 2. Component `NotificationBadge`
- **File**: `src/components/ui/notification-badge.tsx`
- **Chức năng**:
  - Hiển thị badge tròn đỏ với số lượng thông báo chưa đọc
  - Tự động ẩn khi count = 0
  - Hiển thị "99+" khi count > 99

### 3. Cập nhật trang Events
- **File**: `src/app/dashboard/events/page.tsx`
- **Thay đổi**:
  - Import hook và component badge
  - Thêm badge vào tab "Lịch hẹn tư vấn"
  - Truyền callback `refreshUnreadCount` cho component consultation

### 4. Cập nhật component Consultation
- **File**: `src/app/dashboard/events/_components/consultation.tsx`
- **Thay đổi**:
  - Thêm prop `onMarkAsRead` callback
  - Gọi API `markNotificationAsRead` khi đánh dấu đã đọc
  - Gọi callback để cập nhật badge

## API sử dụng

### `markNotificationAsRead`
- **Endpoint**: `PUT /simple-notifications/:id/read`
- **Chức năng**: Đánh dấu thông báo đã đọc
- **File**: `src/lib/api/notification.ts`

### `getNotificationsByParentId`
- **Endpoint**: `GET /simple-notifications/parent/:parentId`
- **Chức năng**: Lấy danh sách thông báo theo parent ID
- **File**: `src/lib/api/notification.ts`

## Cách sử dụng

1. Badge sẽ tự động hiển thị số lượng thông báo chưa đọc
2. Khi người dùng click "Đánh dấu đã đọc" trong component consultation
3. Badge sẽ tự động cập nhật số lượng
4. Badge cũng tự động refresh mỗi 30 giây

## Styling

Badge sử dụng Tailwind CSS với các class:
- `bg-red-500`: Màu nền đỏ
- `text-white`: Chữ trắng
- `rounded-full`: Bo tròn hoàn toàn
- `min-w-[20px] h-5`: Kích thước tối thiểu
- `text-xs font-medium`: Font size nhỏ và medium weight 
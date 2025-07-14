# Hệ thống Đồng bộ Lịch sử Bệnh án (Treatment History Sync)

## Tổng quan

Hệ thống này đảm bảo rằng khi staff nhấn nút "Hoàn thành xử lý" ở giao diện quản lý, lịch sử bệnh án ở giao diện phụ huynh sẽ tự động cập nhật để đồng bộ với những thay đổi.

## Các thành phần chính

### 1. Store (Zustand)
- **File**: `src/stores/treatment-history-store.ts`
- **Chức năng**: Quản lý state toàn cục cho treatment history
- **Tính năng**:
  - Lưu trữ danh sách treatment histories
  - Cung cấp các actions để fetch, update data
  - Tự động cập nhật state khi có thay đổi
  - Persist data để tránh mất dữ liệu khi refresh

### 2. Hook đồng bộ
- **File**: `src/hooks/use-treatment-history-sync.ts`
- **Chức năng**: Quản lý auto-refresh và manual refresh
- **Tính năng**:
  - Tự động refresh mỗi 30 giây
  - Phân biệt giữa parent và staff view
  - Cung cấp manual refresh function

### 3. Component thông báo
- **File**: `src/components/treatment-history-update-notifier.tsx`
- **Chức năng**: Hiển thị thông báo khi có cập nhật mới
- **Tính năng**:
  - Tự động hiển thị khi có treatment history mới
  - Tự động ẩn sau 5 giây
  - Có nút refresh để cập nhật ngay lập tức

## Luồng hoạt động

### Khi Staff cập nhật trạng thái:

1. **Staff nhấn "Hoàn thành xử lý"**
   - Gọi API `updateTreatmentHistory`
   - Store tự động cập nhật state
   - Tất cả components sử dụng store sẽ re-render

2. **Auto-refresh ở Parent view**
   - Hook `useTreatmentHistorySync` tự động fetch data mỗi 30 giây
   - Nếu có thay đổi, component sẽ cập nhật

3. **Thông báo cập nhật**
   - Component `TreatmentHistoryUpdateNotifier` phát hiện có data mới
   - Hiển thị thông báo cho phụ huynh
   - Phụ huynh có thể nhấn "Làm mới" để cập nhật ngay

### Khi Parent xem lịch sử:

1. **Initial load**
   - Fetch data từ API theo parent ID
   - Lưu vào store

2. **Auto-refresh**
   - Tự động fetch lại data mỗi 30 giây
   - So sánh với data cũ để phát hiện thay đổi

3. **Manual refresh**
   - Parent có thể nhấn nút "Làm mới"
   - Fetch data ngay lập tức

## Cách sử dụng

### Trong Admin/CMS pages:
```typescript
import { useTreatmentHistoryStore } from "@/stores/treatment-history-store";

const { updateTreatmentHistoryItem } = useTreatmentHistoryStore();

// Khi cập nhật trạng thái
await updateTreatmentHistoryItem(eventId, {
  status: "resolved",
  notes: "Đã xử lý xong",
  actionTaken: "Đã liên hệ phụ huynh"
});
```

### Trong Parent view:
```typescript
import { useTreatmentHistorySync } from "@/hooks/use-treatment-history-sync";
import { TreatmentHistoryUpdateNotifier } from "@/components/treatment-history-update-notifier";

const { manualRefresh } = useTreatmentHistorySync();

// Component sẽ tự động refresh và hiển thị thông báo
<TreatmentHistoryUpdateNotifier onRefresh={manualRefresh} />
```

## Lợi ích

1. **Real-time updates**: Phụ huynh thấy được cập nhật ngay lập tức
2. **Tự động đồng bộ**: Không cần refresh trang thủ công
3. **Thông báo thông minh**: Chỉ hiển thị khi có thay đổi thực sự
4. **Performance tốt**: Sử dụng Zustand để quản lý state hiệu quả
5. **UX tốt**: Giao diện responsive và user-friendly

## Cấu hình

- **Auto-refresh interval**: 30 giây (có thể thay đổi trong hook)
- **Notification timeout**: 5 giây (có thể thay đổi trong component)
- **Persist storage**: Sử dụng localStorage để lưu state

## Troubleshooting

### Nếu không thấy cập nhật:
1. Kiểm tra console log để xem có lỗi API không
2. Kiểm tra network tab để xem API calls
3. Kiểm tra store state trong React DevTools

### Nếu auto-refresh không hoạt động:
1. Kiểm tra hook `useTreatmentHistorySync` có được import đúng không
2. Kiểm tra parent ID có được lấy đúng không
3. Kiểm tra permissions của user

### Nếu thông báo không hiển thị:
1. Kiểm tra component `TreatmentHistoryUpdateNotifier` có được render không
2. Kiểm tra logic so sánh data trong component
3. Kiểm tra CSS classes có bị conflict không 
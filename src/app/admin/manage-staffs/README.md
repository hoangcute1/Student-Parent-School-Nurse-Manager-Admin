# Chức năng Tìm kiếm - Quản lý Nhân viên

## Tổng quan
Trang quản lý nhân viên đã được tích hợp chức năng tìm kiếm và lọc dữ liệu nâng cao, giúp người dùng dễ dàng tìm kiếm và quản lý thông tin nhân viên.

## Các tính năng chính

### 1. Tìm kiếm cơ bản
- **Tìm kiếm theo tên**: Nhập tên nhân viên để tìm kiếm
- **Tìm kiếm theo email**: Tìm kiếm theo địa chỉ email
- **Tìm kiếm theo chức vụ**: Tìm kiếm theo chức vụ/role
- **Tìm kiếm theo số điện thoại**: Tìm kiếm theo số điện thoại liên lạc
- **Tìm kiếm theo địa chỉ**: Tìm kiếm theo địa chỉ nhà

### 2. Bộ lọc nâng cao
- **Phòng ban**: Lọc theo phòng ban của nhân viên
  - Tất cả phòng ban
  - Hành chính
  - Giáo viên
  - Y tế
  - Hỗ trợ

- **Trạng thái**: Lọc theo trạng thái làm việc
  - Tất cả
  - Đang hoạt động
  - Tạm nghỉ
  - Nghỉ phép

- **Thông tin liên lạc**: Lọc theo loại thông tin liên lạc có sẵn
  - Tất cả
  - Có email
  - Có số điện thoại
  - Có cả email và số điện thoại

### 3. Hiển thị kết quả
- **Thống kê kết quả**: Hiển thị số lượng kết quả tìm kiếm
- **Bộ lọc đang hoạt động**: Hiển thị các bộ lọc đang được áp dụng
- **Xóa bộ lọc**: Dễ dàng xóa từng bộ lọc hoặc tất cả bộ lọc

## Cách sử dụng

### Tìm kiếm nhanh
1. Nhập từ khóa vào ô tìm kiếm
2. Kết quả sẽ được hiển thị ngay lập tức
3. Sử dụng nút X để xóa từ khóa tìm kiếm

### Sử dụng bộ lọc nâng cao
1. Nhấn vào nút "Bộ lọc nâng cao"
2. Chọn các tiêu chí lọc mong muốn
3. Kết quả sẽ được lọc theo các tiêu chí đã chọn

### Xóa bộ lọc
- Nhấn nút "Xóa bộ lọc" để xóa tất cả bộ lọc
- Hoặc nhấn nút X trên từng bộ lọc để xóa riêng lẻ

## Giao diện

### Thanh tìm kiếm
- Ô tìm kiếm với icon kính lúp
- Nút xóa từ khóa (hiển thị khi có nội dung)
- Nút bộ lọc nâng cao

### Kết quả tìm kiếm
- Card hiển thị thông tin tìm kiếm
- Số lượng kết quả và tổng số bản ghi
- Thông báo khi không có kết quả

### Bộ lọc đang hoạt động
- Tags hiển thị các bộ lọc đang được áp dụng
- Nút xóa cho từng bộ lọc

## Lưu ý
- Tìm kiếm không phân biệt chữ hoa/thường
- Có thể kết hợp nhiều bộ lọc cùng lúc
- Kết quả được cập nhật real-time khi thay đổi bộ lọc
- Thống kê được tính toán dựa trên kết quả đã lọc

## Tính năng đặc biệt cho Nhân viên

### Phân quyền
- Hiển thị thông tin về role và quyền hạn
- Lọc theo loại tài khoản (admin, staff, etc.)

### Trạng thái hoạt động
- Theo dõi trạng thái làm việc của nhân viên
- Lọc theo tình trạng hiện tại 
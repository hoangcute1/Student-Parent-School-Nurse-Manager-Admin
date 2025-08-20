# Student-Parent-School-Nurse-Manager-Admin

Hệ thống quản lý thông tin học sinh, phụ huynh và y tế học đường.

## Cấu trúc Repository

Repository này chứa hai nhánh chính:

- `backend`: Mã nguồn cho backend (NestJS)
- `frontend`: Mã nguồn cho frontend (Next.js)
- `database`: MongoDB

'Phần mềm quản lý y tế học đường cho phòng y tế của 01 trường học.
- Trang chủ giới thiệu thông tin trường học, tài liệu về sức khỏe học đường, blog chia sẻ kinh nghiệm, ...
- Chức năng cho phép phụ huynh khai báo hồ sơ sức khỏe của học sinh: dị ứng, bệnh mãn tính, tiền sử điều trị, thị lực, thính lực, tiêm chủng, ...
- Chức năng cho phép phụ huynh gửi thuốc cho trường để nhân viên y tế cho học sinh uống.
- Chức năng cho phép nhân viên y tế ghi nhận và xử lý sự kiện y tế (tai nạn, sốt, té ngã, dịch bệnh, ...) trong trường. 
- Quản lý thuốc và các vật tư y tế trong quá trình xử lý các sự kiện y tế.
- Quản lý quá trình tiêm chủng tại trường
          << Gửi phiếu thông báo đồng ý tiêm chủng cho phụ huynh xác nhận --> Chuẩn bị danh sách học sinh tiêm --> Tiêm chủng và ghi nhận kết quả --> Theo dõi sau tiêm >>
- Quản lý quá trình kiểm tra y tế định kỳ tại trường học
          << Gửi phiếu thông báo kiểm tra y tế các nội dung kiểm tra cho phụ huynh xác nhận --> Chuẩn bị danh sách học sinh kiểm tra --> Thực hiện kiểm tra và ghi nhận kết quả --> Gửi kết quả cho phụ huynh và lập lịch hẹn tư vấn riêng nếu có dấu hiệu bất thường >>
- Quản lý hồ sơ người dùng, lịch sử kiểm tra y tế.
- Dashboard & Report.
- 
## Hướng dẫn cài đặt
### Backend
1. Chuyển sang nhánh backend:
   git checkout backend
2. Cài đặt các dependency:
   npm install
3. Khởi động server:
   npm run start:dev
   
### Frontend
1. Chuyển sang nhánh frontend:
   git checkout frontend
2. Cài đặt các dependency:
   npm install
3. Khởi động ứng dụng:
   npm run dev

# Chức năng Tạo Lịch Khám Theo Khối Học - Luồng Hoạt Động Hoàn Chỉnh

## 🎯 Tổng quan chức năng
Cho phép nhân viên y tế tạo lịch khám sức khỏe theo khối học (1-5) và tự động gửi thông báo đến tất cả phụ huynh có con trong khối đó.

## 🔄 Luồng hoạt động chi tiết

### 1. Nhân viên y tế tạo lịch khám (/cms/health-result)

#### 📝 Form tạo lịch khám:
- **Thông tin cơ bản:**
  - Tiêu đề lịch khám
  - Mô tả chi tiết
  - Ngày và giờ khám
  - Địa điểm (tùy chọn)
  - Bác sĩ phụ trách (tùy chọn)
  - Loại khám (tùy chọn)

- **Đối tượng khám:** 
  - ✅ **Theo khối học** (Mới): Chọn một hoặc nhiều khối (1, 2, 3, 4, 5)
  - ⚪ Theo học sinh cụ thể: Tìm kiếm và chọn học sinh

#### 🎯 Chọn khối học:
```
□ Khối 1 - Học sinh lớp 1
□ Khối 2 - Học sinh lớp 2  
□ Khối 3 - Học sinh lớp 3
□ Khối 4 - Học sinh lớp 4
□ Khối 5 - Học sinh lớp 5
```

### 2. Hệ thống xử lý tự động

#### 🔍 Tìm học sinh theo khối:
- Hệ thống tìm tất cả học sinh trong khối được chọn
- Dựa vào pattern tên lớp (1A, 1B, 2A, 2B, ...)

#### 📧 Tạo lịch khám cho từng học sinh:
```javascript
Khối 1 được chọn → Tìm lớp 1A, 1B, 1C...
→ Tìm tất cả học sinh trong các lớp này
→ Tạo 1 lịch khám riêng cho mỗi học sinh
→ Gửi thông báo đến phụ huynh tương ứng
```

#### 📊 Kết quả:
```
✅ Đã tạo 45 lịch khám cho 2 khối học
   - Khối 1: 23 học sinh
   - Khối 2: 22 học sinh
```

### 3. Gửi thông báo đến phụ huynh (/dashboard/events)

#### 📱 Thông báo tự động:
- Mỗi phụ huynh nhận 1 thông báo cho con mình
- Nội dung: Thông tin lịch khám chi tiết
- Hiển thị tại tab "Lịch khám sức khỏe"

#### 🎨 Giao diện thông báo:
```
┌─────────────────────────────────────────────┐
│ 📅 Khám sức khỏe định kỳ học kỳ 1           │
│ 👤 Học sinh: Nguyễn Văn A - Lớp 1A          │
│ 📍 Ngày khám: 25/12/2024                    │
│ ⏰ Giờ khám: 08:00                          │
│ 🏥 Địa điểm: Phòng y tế trường              │
│                                             │
│ [✅ Đồng ý]  [❌ Từ chối]                    │
└─────────────────────────────────────────────┘
```

### 4. Phụ huynh phản hồi

#### ✅ Đồng ý:
- Lịch khám chuyển trạng thái "Đã đồng ý"
- Được lưu vào hệ thống
- Có thể thêm ghi chú

#### ❌ Từ chối:
- Lịch khám chuyển trạng thái "Đã từ chối"
- **KHÔNG** được lưu vào hệ thống
- Bắt buộc nhập lý do từ chối

### 5. Nhân viên y tế theo dõi kết quả

#### 📊 Dashboard quản lý:
- **Tổng số lịch khám:** 45
- **Chờ phản hồi:** 12
- **Đã đồng ý:** 28 ✅
- **Đã từ chối:** 5 ❌

#### 📋 Danh sách chi tiết:
- Xem theo trạng thái
- Lý do từ chối
- Ghi chú phụ huynh
- Xóa lịch chưa phản hồi

## 🏗️ Cấu trúc kỹ thuật

### Backend APIs:
```
POST /health-examinations
- Body: { target_type: 'grade', grade_levels: [1,2], ... }
- Response: { total_created: 45, message: "..." }

GET /students/grade/{gradeLevel}
- Response: [{ _id, name, class_name, ... }]

PUT /notifications/{id}/respond
- Body: { status: 'Agree|Disagree', notes?, rejectionReason? }
```

### Frontend Components:
```
CreateHealthExaminationForm
├── Radio: Theo khối học / Theo học sinh
├── Checkbox: Chọn khối học (1-5)
└── Submit: Tạo lịch khám

HealthExaminationNotifications (Dashboard)
├── Card: Thông tin lịch khám
├── Button: Đồng ý / Từ chối
└── Modal: Nhập ghi chú / lý do

HealthExaminationList (CMS)
├── Stats: Thống kê tổng quan
├── Filter: Theo trạng thái
└── Table: Danh sách chi tiết
```

## 🎯 Điểm nổi bật

### ✨ Tính năng mới:
1. **Chọn theo khối học** thay vì từng học sinh
2. **Tự động tạo mass notifications** cho toàn bộ khối
3. **Chỉ lưu lịch khám được đồng ý**
4. **Thống kê theo khối học**

### 🚀 Ưu điểm:
- ⚡ Nhanh chóng: Tạo hàng chục lịch khám cùng lúc
- 🎯 Chính xác: Tự động tìm đúng học sinh theo khối
- 📊 Rõ ràng: Thống kê chi tiết theo trạng thái
- 🔒 An toàn: Chỉ lưu lịch khám được phê duyệt

### 📋 Luồng test:
1. Tạo lịch khám cho Khối 1 + Khối 2
2. Kiểm tra thông báo tự động gửi đến phụ huynh
3. Phụ huynh đồng ý/từ chối
4. Kiểm tra chỉ lịch được đồng ý được lưu lại
5. Xem thống kê tại CMS

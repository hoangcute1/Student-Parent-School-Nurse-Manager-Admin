# Hướng dẫn test API bằng Postman

File này hướng dẫn cách sử dụng Postman để test các API trong dự án SWP391.

## Cài đặt Postman

1. Tải và cài đặt Postman từ [website chính thức](https://www.postman.com/downloads/)
2. Tạo tài khoản Postman (tùy chọn) hoặc sử dụng trực tiếp mà không cần đăng nhập

## Import Collection và Environment

1. Mở Postman
2. Nhấn vào "Import" (góc trên bên trái)
3. Chọn tab "Files" và tải lên 2 file sau:
   - `postman_collection.json`
   - `postman_environment.json`
4. Sau khi import, bạn sẽ thấy collection "SWP391 API Collection" trong sidebar
5. Chọn environment "SWP391 Environment" từ dropdown ở góc trên bên phải

## Các bước test API

1. **Chạy server**: Đảm bảo server NestJS đang chạy (npm run start:dev)
2. **Đăng ký tài khoản**: Gửi request Register để tạo tài khoản mới
3. **Đăng nhập**: Gửi request Login để lấy token
   - Token sẽ tự động được lưu vào biến môi trường
4. **Sử dụng API khác**: Sau khi có token, bạn có thể sử dụng các API khác

## Lưu ý

- Tất cả token và ID sẽ được tự động lưu vào biến môi trường
- Nếu token hết hạn, bạn cần đăng nhập lại hoặc sử dụng Refresh Token
- API Swagger có sẵn tại: http://localhost:3000/api

## Danh sách API

### Authentication
- Register: POST /auth/register
- Login: POST /auth/login
- Profile: GET /auth/profile
- Me: GET /auth/me
- Logout: POST /auth/logout
- Refresh Token: POST /auth/refresh

### Users
- Get All Users: GET /users
- Create User: POST /users
- Delete User: DELETE /users/:id

### Students
- Get All Students: GET /students
- Create Student: POST /students
- Get Student by ID: GET /students/:id
- Get Student by Student ID: GET /students/studentId/:studentId
- Update Student: PUT /students/:id
- Delete Student: DELETE /students/:id

## Các cấu trúc dữ liệu chính

### RegisterDto
```json
{
  "email": "test@example.com",
  "password": "password123",
  "role": "user"
}
```

### LoginDto
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

### RefreshTokenDto
```json
{
  "userId": "your_user_id",
  "refresh_token": "your_refresh_token"
}
```

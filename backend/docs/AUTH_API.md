# Authentication API

## Tổng quan

API này cung cấp các endpoint để đăng ký và đăng nhập người dùng, sử dụng JWT (JSON Web Token) để xác thực.

## Base URL

```
http://localhost:3000/auth
```

## Endpoints

### 1. Đăng ký tài khoản mới

**POST** `/auth/register`

**Body:**
```json
{
  "username": "testuser",
  "password": "password123"
}
```

**Response (thành công):**
```json
{
  "id": "uuid",
  "username": "testuser",
  "createdAt": "...",
  "updatedAt": "..."
}
```

**Response (lỗi - username đã tồn tại):**
```json
{
  "statusCode": 409,
  "message": "Username already exists",
  "error": "Conflict"
}
```

---

### 2. Đăng nhập

**POST** `/auth/login`

**Body:**
```json
{
  "username": "testuser",
  "password": "password123"
}
```

**Response (thành công):**
```json
{
  "access_token": "your_jwt_token"
}
```

**Response (lỗi - sai thông tin):**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

---

### 3. Lấy thông tin người dùng (yêu cầu xác thực)

**GET** `/auth/profile`

**Header:**
```
Authorization: Bearer your_jwt_token
```

**Response (thành công):**
```json
{
  "userId": "uuid",
  "username": "testuser"
}
```

**Response (lỗi - chưa xác thực):**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

---

## Bảo vệ các API khác

Tất cả các API trong `FormController` (`/forms`) đều được bảo vệ. Bạn cần gửi `access_token` trong header `Authorization` để truy cập.

---

## Kiểm thử nhanh với curl

**Đăng ký:**
```bash
curl -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d '{"username":"myuser","password":"mypassword"}'
```

**Đăng nhập (lưu lại token):**
```bash
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"username":"myuser","password":"mypassword"}' | jq -r .access_token)
```

**Lấy profile:**
```bash
curl http://localhost:3000/auth/profile -H "Authorization: Bearer $TOKEN"
```

**Truy cập API được bảo vệ (ví dụ: lấy danh sách form):**
```bash
curl http://localhost:3000/forms -H "Authorization: Bearer $TOKEN"

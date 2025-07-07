# Backend Server - Docker Compose Hướng Dẫn

## Chạy Backend + PostgreSQL bằng Docker Compose

### 1. Di chuyển vào thư mục backend/server

```bash
cd backend/server
```

### 2. Build & Run

```bash
docker-compose up --build
```

- Lần đầu sẽ build image backend và kéo image postgres.
- Các lần sau chỉ cần: `docker-compose up`

### 3. Truy cập các service

- **Backend API (NestJS):** http://localhost:3000
- **Swagger API Docs:** http://localhost:3000/api (hoặc /swagger)
- **Postgres:** localhost:5432 (user: postgres, pass: postgres, db: dynamic_form)

### 4. Dừng toàn bộ hệ thống

```bash
docker-compose down
```

### 5. Xoá toàn bộ dữ liệu Postgres (nếu cần)

```bash
docker-compose down -v
```

## Lưu ý

- Các biến môi trường kết nối database đã cấu hình sẵn trong docker-compose.yml.
- Nếu muốn thay đổi port, user, pass... hãy sửa trong docker-compose.yml.
- Nếu cần seed dữ liệu mẫu, hãy bổ sung script vào backend/server.
- Đảm bảo Docker và Docker Compose đã cài đặt trên máy.

---

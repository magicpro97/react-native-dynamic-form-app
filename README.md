# Dynamic Form App - Docker Compose Setup

## Yêu cầu

- Docker & Docker Compose đã cài đặt trên máy

## Cấu trúc

- `backend/server`: Backend NestJS (API)
- `Dockerfile`: Dockerfile cho frontend (Expo/React Native Web)
- `backend/server/Dockerfile`: Dockerfile cho backend
- `docker-compose.yml`: Chạy đồng thời Postgres, backend, frontend

## Chạy toàn bộ hệ thống

1. **Build & Run tất cả service:**

```bash
docker-compose up --build
```

- Lần đầu sẽ build image cho backend, frontend, kéo image postgres.
- Các lần sau chỉ cần: `docker-compose up`

2. **Truy cập các service:**

- **Frontend (Expo Web):** http://localhost:8081
- **Backend API (NestJS):** http://localhost:3000
- **Swagger API Docs:** http://localhost:3000/api (hoặc /swagger)
- **Postgres:** localhost:5432 (user: postgres, pass: postgres, db: dynamic_form)

## Biến môi trường

- Backend đã cấu hình sẵn kết nối Postgres qua docker-compose.
- Frontend có biến môi trường `API_URL` trỏ về backend.

## Lưu ý

- Nếu muốn thay đổi port, user, pass... hãy sửa trong `docker-compose.yml`.
- Nếu cần seed dữ liệu mẫu, hãy bổ sung script vào backend/server.
- Nếu gặp lỗi permission khi push code, kiểm tra lại quyền truy cập repo.

## Dừng toàn bộ hệ thống

```bash
docker-compose down
```

## Xoá toàn bộ dữ liệu Postgres (nếu cần)

```bash
docker-compose down -v
```

---

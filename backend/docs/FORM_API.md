# Form Configuration API (NestJS Backend)

## Tổng quan

API này cung cấp các endpoint để quản lý form configuration động, phục vụ cho frontend dynamic form app.

## Base URL

```
http://localhost:3000/forms
```

## Endpoints

### 1. Lấy danh sách form configurations (phân trang)

**GET** `/forms?page=1&limit=10`

**Response:**
```json
{
  "forms": [ { ...formConfig } ],
  "total": 12,
  "page": 1,
  "limit": 10
}
```

---

### 2. Lấy form configuration theo ID

**GET** `/forms/{id}`

**Response:**
```json
{
  "id": "uuid",
  "name": "contact-us",
  "title": "Contact Us",
  "description": "...",
  "version": "1.0",
  "fields": [ ... ],
  "settings": { ... },
  "metadata": { ... },
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

### 3. Lấy form configuration theo tên

**GET** `/forms/name/{name}`

---

### 4. Tìm kiếm form configurations

**GET** `/forms/search?query=survey&page=1&limit=10`

---

### 5. Tạo form configuration mới

**POST** `/forms`

**Body:**
```json
{
  "name": "survey-form",
  "title": "Customer Survey",
  "description": "Customer satisfaction survey",
  "version": "1.0",
  "fields": [ ... ],
  "settings": { ... }
}
```

---

### 6. Cập nhật form configuration

**PUT** `/forms/{id}`

**Body:** (các trường cần cập nhật)

---

### 7. Xóa form configuration

**DELETE** `/forms/{id}`

---

### 8. Export toàn bộ form configurations

**GET** `/forms/export`

**Response:**
```json
{
  "exportInfo": {
    "exportDate": "...",
    "totalForms": 3,
    "exportedBy": "Dynamic Form Backend",
    "version": "1.0.0"
  },
  "formConfigurations": [ ... ]
}
```

---

## Kiểm thử nhanh với curl

**Tạo form:**
```bash
curl -X POST http://localhost:3000/forms -H "Content-Type: application/json" -d '{"name":"test-form","title":"Test","version":"1.0","fields":[]}'
```

**Lấy danh sách:**
```bash
curl http://localhost:3000/forms
```

**Tìm kiếm:**
```bash
curl http://localhost:3000/forms/search?query=test
```

**Export:**
```bash
curl http://localhost:3000/forms/export
```

---

## Ghi chú

- Tất cả API trả về lỗi sẽ có status code và message rõ ràng.
- Khi code module mới sẽ bổ sung docs tương tự tại backend/docs.

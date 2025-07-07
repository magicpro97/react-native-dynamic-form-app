# Backend

## Phân quyền user và quản lý form

- Hệ thống hỗ trợ 3 role: **admin**, **editor**, **user**.
  - **admin/editor**: Có quyền duyệt (approve) hoặc từ chối (reject) form mà user đã submit.
  - **user**: Chỉ được submit form.

## Các endpoint phân quyền

- **PUT** `/forms/{id}/approve`: Duyệt form (chỉ admin/editor, yêu cầu JWT)
- **PUT** `/forms/{id}/reject`: Từ chối form (chỉ admin/editor, yêu cầu JWT)

Trường trạng thái form:
- `status`: `'pending' | 'approved' | 'rejected'`
- `approvedBy`: id user đã duyệt
- `rejectedBy`: id user đã từ chối

Xem chi tiết API và hướng dẫn sử dụng tại [backend/docs/FORM_API.md](./docs/FORM_API.md).

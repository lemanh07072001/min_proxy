---
name: Migration phải check tồn tại trước khi add/drop
description: LUÔN check hasColumn(), listTableIndexes() trước khi thêm/xoá column hoặc index trong migration. Migration phải idempotent. Áp dụng cả MySQL lẫn MongoDB.
type: feedback
---

Migration PHẢI check tồn tại trước khi add/drop column hoặc index.

**Why:** Migration chạy trên production có thể fail giữa chừng → chạy lại bị lỗi "already exists" hoặc "doesn't exist". User đã gặp lỗi `Can't DROP 'idx_status'` (MySQL) và `Index already exists with a different name: type_status_expired` (MongoDB, 30/03/2026).

**How to apply:**
- MySQL: `Schema::hasColumn()` trước khi thêm column, `$sm->listTableIndexes()` trước khi add/drop index
- MongoDB: `$collection->listIndexes()` → check key trùng TRƯỚC khi `createIndex()`
- Migration phải idempotent — chạy lại bao nhiêu lần cũng không lỗi
- Không giả định tên index — check bằng key definition, không chỉ tên

**Quy trình khi vi phạm:**
- Khi phát hiện vi phạm feedback đã lưu → DỪNG, rà soát toàn bộ session xem còn chỗ nào vi phạm tương tự không
- Đọc lại feedback memory TRƯỚC khi viết migration, không chỉ sau khi lỗi

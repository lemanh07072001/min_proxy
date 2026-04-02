---
name: Child Site Rotate — site con poll proxy xoay từ site mẹ
description: ĐÃ IMPLEMENT BE 31/03. Site con gọi getProxyCurrent lấy proxy xoay mới từ site mẹ (poll model, không push).
type: project
---

## Quyết định: Site con POLL từ site mẹ (không push)

**Quyết định 01/04/2026**: bỏ mô hình push, dùng poll. Site con tự gọi `getProxyCurrent` từ site mẹ để lấy proxy xoay mới.

## ĐÃ IMPLEMENT BE (31/03/2026)
- Site con poll `getProxyCurrent` từ site mẹ
- Sync `rotation_interval` từ site mẹ qua `SupplierProductController`

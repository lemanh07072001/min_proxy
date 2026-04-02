---
name: Admin Manual Resolve — Xử lý đơn hàng lỗi thủ công
description: A1+B1+B2+B3+A2 ĐÃ DEPLOY 27/03. A3 có sẵn qua B3 Case B. Security fix provider fields.
type: project
---

## Trạng thái

| Phase | Mô tả | Status |
|-------|-------|--------|
| A1+B1 | Timeout detect + log chi tiết + dừng retry | ĐÃ DEPLOY 27/03 |
| B2 | Admin xác nhận gia hạn thành công | ĐÃ DEPLOY 27/03 |
| B3 | Admin xác nhận mua hàng thành công (3 case) | ĐÃ DEPLOY 27/03 |
| A2 | Admin import proxy thủ công (mở rộng cho timeout) | ĐÃ DEPLOY 27/03 |
| A3 | Admin re-fetch proxy từ NCC | Có sẵn qua B3 Case B (FetchProviderProxies tự poll) |
| Security | Ẩn provider fields + cost_per_unit khỏi user API | ĐÃ DEPLOY 27/03 |
| Fix | Provider form load sai order_id_field khi deferred | ĐÃ DEPLOY 27/03 |
| Fix | Client timeout hardcoded 30s → dùng config | ĐÃ DEPLOY 27/03 |
| Fix | retryOrder clear provider_called flag | ĐÃ DEPLOY 27/03 |

## Chưa test — chờ user verify

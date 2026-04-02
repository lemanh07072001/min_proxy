---
name: Redis memory control
description: Khi ghi data vào Redis (monitoring, logs, locks) PHẢI kiểm soát bộ nhớ — TTL auto-expire, capped lists, compact data format.
type: feedback
---

Khi thao tác Redis — đặc biệt monitoring/logging — PHẢI kiểm soát bộ nhớ.

**Why:** Redis chạy in-memory, data không tự xóa. Worker chạy 24/7 ghi liên tục sẽ đầy RAM nếu không cap.

**How to apply:**
- Mọi Redis key PHẢI có TTL (auto-expire) hoặc LTRIM (capped size)
- Log entries dùng key names ngắn (`t`, `w`, `m`, `o` thay vì `time`, `worker`, `message`, `order_id`)
- Heartbeat keys TTL ngắn (30s) → tự xóa khi worker chết
- Capped lists: LTRIM ngay sau LPUSH, max 100 entries
- Circuit breaker: TTL 300s tự expire
- KHÔNG dùng Redis cho data lớn hoặc vô hạn — dùng MongoDB/MySQL thay thế

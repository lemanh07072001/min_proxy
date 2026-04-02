---
name: Order Lock Flow - PlaceOrder Worker
description: Quy trình lock/unlock khi xử lý đơn hàng — cần refactor PlaceOrder worker
type: project
---

## Flow đúng

```
[buyForChildSite] Tạo order (pending) → lock setNx "enqueue:order:{id}" TTL 60s → push queue
  (nếu push fail → fetch-pending-orders sẽ pick up sau 1 phút)

[fetch-pending-orders mỗi phút — backup]:
  pending + chưa lock → lock setNx + set processing + push queue
  processing + chưa lock + retry < max → lock setNx + push queue
  processing + retry >= max → skip (chờ admin reset retry)

[PlaceOrder pop từ queue]:
  → pending → set processing → gọi API
  → processing → gọi API luôn
  → Thành công → in_use/awaiting_provider
  → Lỗi → retry++ → giữ processing
  → finally → gỡ lock (del "enqueue:order:{id}")
  → Lock tự hết hạn 60s nếu worker crash

[Admin UI]:
  → Đơn retry >= max → nút "Thử lại" → reset retry=0 (giữ processing)
  → fetch-pending-orders phút sau pick up lại
```

## Chống double push

- buyForChildSite lock trước push → fetch-pending-orders thấy lock → skip
- Lock hết hạn + order đã in_use → PlaceOrder pop lần 2 → findPendingOrder miss → skip
- setNx atomic → N luồng chạy song song chỉ 1 lock được

## Nguyên tắc

- **Không dùng status failed** — chỉ processing hoặc in_use
- Lock key: `enqueue:order:{id}` TTL 60s
- Lock tại 2 nơi: buyForChildSite (ngay) + fetch-pending-orders (backup)
- PlaceOrder gỡ lock trong finally
- Retry tăng +1 mỗi lần lỗi, admin reset retry=0 qua UI
- Log đầy đủ vào MongoDB OrderLog: request, response, duration_ms

## TODO — Refactor PlaceOrder worker

- Hiện tại: dùng `enqueue:order:{id}` lock phức tạp
- Cần: đổi sang `order:lock:{id}` TTL 60s đơn giản
- SupplierService timeout: hiện 30s, OK
- Khi timeout: catch GuzzleHttp\Exception\ConnectException → log + retry++

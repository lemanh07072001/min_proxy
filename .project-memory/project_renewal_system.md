---
name: Renewal System v3+v4 — locks, circuit breaker, unified params
description: ĐÃ DEPLOY. ProcessRenewal tách riêng, 2 lock, circuit breaker, OrderHistoryLog, unified renew_params, SP override NCC.
type: project
---

## ĐÃ DEPLOY (26-30/03/2026)

### Kiến trúc (v3 — 26/03)

- `ProcessRenewal` tách riêng khỏi PlaceOrder, pop từ `renewal_list_web`
- **Lock 1**: `renewal_request:{order_id}` TTL 300s (chống user spam)
- **Lock 2**: `renewal_processing:{order_id}` TTL 20s (chống 2 worker)
- **Circuit breaker**: 5 consecutive fails per provider → block 5 phút
- `OrderHistoryLog` (MongoDB, TTL 20 ngày) — log per item per history
- Status: pending(0), processing(1), success(2), failed(3), in_use(4), expired(5), refunded(7)
- Order status: awaiting_renewal(11), renewal_failed(12)
- `order_histories` tracks buy/renewal/refund per order
- Anti-dup: 3 lớp (Lock 1 + Lock 2 + renewal_history_id)

### Unified params (v4 — 30/03)

- 1 bảng `renew_params[]` thay 3 config riêng (params, duration_param, inherit_params)
- 4 nguồn: order_items, orders, user_input, default
- **SP override NCC**: SP bật renewal → preview NCC params (readonly) → checkbox "Custom" → edit
- Conflicting names → SP overrides, new params added
- Save: `type_services.metadata.renew_override_params`
- BE: `GenericRenewalProcessor` merge override trước khi gọi API

### 2-tier config

- **Provider**: `api_config.renew` (URL, mode by_order/by_item, auth, renewal_duration)
- **Product**: `metadata` override (renewable, renewal_duration, allow_expired_renew, renew_override_params)

### Files chính

- BE: `ProcessRenewal.php`, `GenericRenewalProcessor.php`, `WorkerMonitor.php`
- FE: `OrderDetail.tsx` (RenewalInlinePanel), `useRenewal.ts`, `QueueMonitorPage.tsx`

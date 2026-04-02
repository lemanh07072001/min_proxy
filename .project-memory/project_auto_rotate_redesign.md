---
name: Auto Rotate Proxy Redesign
description: ĐÃ IMPLEMENT 30/03 — xoay chủ động (scan 10s + worker BLPOP), user chỉ đọc Redis cache.
type: project
---

## Trạng thái: ĐÃ IMPLEMENT (30/03/2026)

## Kiến trúc mới

```
ScanRotateProxies (schedule 10s, withoutOverlapping)
  → Query MongoDB: ROTATING + ACTIVE + not expired
  → Check Redis last_rotate:{key} TTL
  → Đủ interval → SET last_rotate + RPUSH queue

AutoRotateProxies (supervisor x3, BLPOP)
  → Pop job → gọi NCC → lưu proxy:{key} + DB

API (3 endpoint cùng logic readProxyFromRedis)
  → /proxies/new, /proxies/current, /rotate-ip
  → Redis GET proxy:{key} → backward compat → DB fallback
  → KHÔNG gọi NCC
```

## Redis keys

- `proxy:{key}` — proxy data hiện tại (không TTL)
- `last_rotate:{key}` — TTL = rotation_interval (scan quản lý)
- Key cũ `proxy:{uid}:{key}:current` — backward compat, auto migrate

## rotation_interval ưu tiên

1. `type_services.rotation_interval` (sản phẩm)
2. `providers.rotation_interval` (NCC)
3. `api_config.rotate.min_interval`
4. Default 60s

## Xoay lỗi: phương án A

Giữ `last_rotate` TTL nguyên → chờ hết interval mới retry. Không spam NCC.

## Files

- `ScanRotateProxies.php` (mới)
- `AutoRotateProxies.php` (refactored)
- `ProxyController.php` (3 endpoint chỉ đọc Redis)
- `Kernel.php` (schedule scan 10s)
- Migration: compound index `{type, status, expired_at}`

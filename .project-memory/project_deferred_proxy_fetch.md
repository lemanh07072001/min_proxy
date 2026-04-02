---
name: Deferred Proxy Fetch - Provider trả proxy sau
description: ĐÃ IMPLEMENT — GenericOrderProcessor hỗ trợ response_mode=deferred, FetchProviderProxies poll generic. Config-driven, không cần code mới per provider.
type: project
---

## Trạng thái: ĐÃ IMPLEMENT (24/03/2026)

### Cách hoạt động:

**Step 1 — GenericOrderProcessor (khi mua):**
- Nếu `api_config.buy.response_mode === "deferred"`:
  - Gọi API mua → extract `order_id` từ response (theo `response.order_id_field`)
  - Lưu `provider_order_code` vào tất cả OrderItems
  - Set order status → `AWAITING_PROVIDER`
  - KHÔNG extract proxy

**Step 2 — FetchProviderProxies (poll mỗi phút):**
- Nếu provider có `fetch_proxies` config + `response_mode === "deferred"`:
  - Gọi `fetch_proxies.url` (thay `{order_id}` bằng `provider_order_code`)
  - Check success field
  - Extract proxy theo `proxies_path` + handler.mapProxy()
  - Save to DB → finalize order

### api_config format:
```json
{
  "buy_static": {
    "response_mode": "deferred",
    "response": {
      "success_field": "success",
      "success_value": 200,
      "order_id_field": "data.id"
    },
    "fetch_proxies": {
      "url": "https://api.provider.com/transactions/{order_id}",
      "method": "GET",
      "delay_seconds": 5,
      "auth_type": "query",
      "auth_param": "key",
      "response": {
        "success_field": "success",
        "success_value": true,
        "proxies_path": "data.proxies",
        "proxy_format": "fields",
        "proxy_fields": { "ip": "ip", "port": "port", "user": "user", "pass": "pass" }
      }
    }
  }
}
```

### Files đã sửa:
- `GenericOrderProcessor.php` — nhánh deferred sau API call
- `FetchProviderProxies.php` — `processGenericDeferredOrder()` + `saveGenericDeferredProxies()`
- `OrderLog.php` — `ACTION_AWAITING_PROVIDER` constant

### Backward compatible:
- Default `response_mode` = `"immediate"` → behavior y hệt cũ
- Provider không có `fetch_proxies` → fallback HomeProxy mode

**Why:** Mở rộng provider ecosystem — config-driven, không cần tạo processor mới per provider.

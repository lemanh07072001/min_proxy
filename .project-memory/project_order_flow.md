---
name: Order Flow - Site mẹ & Site con
description: Quy trình mua hàng từ web và API ở site mẹ và site con — dùng khi debug order hoặc cấu hình
type: project
---

## Site mẹ — Mua từ đối tác trực tiếp

```
Web: User nhấn Mua → POST /buy-proxy-rotate hoặc /buy-proxy-static
API: Reseller gọi → POST /buy-proxy (auth X-API-Key)

→ ProxyController validate (quantity, balance, min/max)
→ Tạo Order (PENDING) + ApiKey + trừ tiền user
→ Push order vào Redis queue
→ PlaceOrder worker pop queue
→ ProviderFactory::make(providerCode, proxyType)
  - 'homeproxy.vn' → HomeProxyRotatingProcessor / HomeProxyStaticProcessor
  - 'proxy.vn' → ProxyVnRotatingProcessor
  - 'upproxy.net' → UpProxyStaticProcessor
→ Processor gọi API đối tác (HomeProxy, ProxyVN...)
→ Kết quả:
  - 1 bước: nhận proxy ngay → lưu DB → IN_USE
  - 2 bước: nhận order_code → AWAITING_PROVIDER
    → FetchProviderProxies (cron/phút) poll đối tác
    → Nhận proxy → lưu DB → IN_USE
```

**Provider code mapping (ProviderFactory):**
- `homeproxy.vn` → HomeProxy (rotating + static)
- `proxy.vn` → ProxyVN (rotating)
- `upproxy.net` → Upproxy (static)

## Site con — Mua từ site mẹ (parent-provider)

```
Web: User nhấn Mua → POST /buy-proxy-rotate hoặc /buy-proxy-static
(Giống site mẹ — cùng ProxyController)

→ ProxyController validate
→ Tạo Order (PENDING)
→ Push Redis queue
→ PlaceOrder pop → ProviderFactory::make('parent-provider', proxyType)
→ MktProxyResellerProcessor
→ SupplierService::buyProxy() → gọi site mẹ API: POST /buy-proxy
  - URL: từ settings 'supplier_api_url'
  - Auth: header X-API-Key từ settings 'supplier_api_key'
→ Site mẹ xử lý → trả order_code
→ Order set AWAITING_PROVIDER
→ FetchProviderProxies (cron/phút)
  - Detect providerCode = 'parent-provider'
  - Gọi SupplierService::getOrder(orderCode) → site mẹ API: GET /orders/{code}
  - Nhận proxy data → lưu DB → IN_USE
```

**Provider code mapping site con:**
- `parent-provider` → MktProxyResellerProcessor (mới)
- `supplier-reseller` → backward compat
- `mktproxy-reseller` → backward compat cũ nhất

## Cấu hình cần thiết

### Site mẹ
- Provider (đối tác): tạo trong DB `providers` table (title, provider_code, token_api)
- Sản phẩm: ServiceType với `provider_id`, `api_provider` (URL), `api_body` (template)
- API sỉ: routes `/buy-proxy`, `/products`, `/orders/{code}`, `/balance` (ResellerController, auth middleware `reseller.auth`)

### Site con
- Cài đặt chung > Nhà cung cấp: `supplier_api_url` + `supplier_api_key`
- Sản phẩm: tạo qua ChildServiceFormModal → auto fill `provider_code = 'parent-provider'`
- `metadata.supplier_product_id` → link đến SP site mẹ
- Giá bán riêng (cao hơn giá nhập từ site mẹ = lợi nhuận)

### Cả hai
- Redis: queue `order:pending` cho PlaceOrder worker
- Cron: `fetch-pending-orders` (mỗi phút), `fetch-provider-proxies` (mỗi phút)
- PlaceOrder chạy dạng long-running worker (supervisor/PM2)
- Min/max quantity: `type_services.min_quantity`, `type_services.max_quantity`

## Commands liên quan
- `php artisan place-order` — worker xử lý đơn hàng (chạy liên tục)
- `php artisan fetch-pending-orders` — gom order kẹt vào queue (cron/phút)
- `php artisan fetch-provider-proxies` — poll đối tác lấy proxy (cron/phút)
- `php artisan sync:supplier-products` — đồng bộ SP site mẹ (cron/giờ, chỉ site con)

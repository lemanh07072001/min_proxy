---
name: _data_field child site — TODO tương lai
description: Site con hardcode "proxy" khi nhận data từ site mẹ. Cần sửa khi bán sản phẩm khác (VPN, API key...).
type: project
---

## Vấn đề

Site mẹ API `GET /orders/{order_code}` (ResellerController line 313):
```php
'proxy' => $item->proxy   // hardcode field name "proxy"
```

Site con `FetchProviderProxies::processSupplierOrder()` (line 555):
```php
$proxyData = $proxyItem['proxy'] ?? null;  // hardcode đọc "proxy"
```

Nếu sản phẩm mới lưu data ở field khác (root, metadata, custom object) → site con không nhận được.

## Cần sửa khi bán sản phẩm khác

1. **Site mẹ API** (`ResellerController::orderDetail`): trả `_data_field` + data theo field thực tế
2. **Site con** (`FetchProviderProxies::processSupplierOrder`): đọc `_data_field` từ response, lưu vào field tương ứng
3. **Site con FE**: đọc `_data_field` để hiển thị đúng

## Hiện tại: KHÔNG ảnh hưởng
Site con chỉ bán proxy → field `proxy` → hoạt động đúng.

**Why:** Hệ thống đang mở rộng từ proxy sang sản phẩm khác
**How to apply:** Khi thêm loại sản phẩm mới, sửa 3 chỗ trên trước

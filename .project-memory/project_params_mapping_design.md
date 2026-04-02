---
name: Params Mapping Design
description: ĐÃ IMPLEMENT — hệ thống params 3 lớp + mapping key→param_name cho provider/product/order
type: project
---

## Params 3 lớp + Mapping — ĐÃ IMPLEMENT (22/03/2026)

### Ưu tiên ghi đè:
Provider default → Product override → User input (nếu được phép)

### 1. Provider default_params (ẩn) — `api_config.buy.params`
Config mặc định khi gọi API đối tác. GenericOrderProcessor đọc trực tiếp.

### 2. Product override_params (ẩn) — `ServiceType.api_body`
Ghi đè 1 số param từ provider cho SP cụ thể. DefaultHandler merge vào request.

### 3. Tuỳ chọn mua hàng (hiện cho khách) — `ServiceType.metadata.custom_fields`
Format mới:
```json
[{
  "key": "nha_mang",           // key nội bộ (FE gửi trong custom_fields)
  "param_name": "loaiproxy",   // map sang param gốc đối tác (ẩn)
  "label": "Nhà mạng",
  "type": "select",            // select | text | number
  "required": true,
  "default": "Viettel",
  "options": [{"value": "Viettel", "label": "Viettel"}]
}]
```
Backward compat: code đọc cả `key`/`param_name` (mới) và `param` (cũ).

### Flow mua hàng:
1. Lấy `api_config.buy.params` từ Provider
2. DefaultHandler merge `api_body` từ Product
3. GenericOrderProcessor đọc `Order.metadata.custom_fields` → map key→param_name → ghi đè
4. `custom_user`/`custom_pass` từ Order.metadata ghi đè nếu `user_override` config
5. Gửi params cuối cùng sang API đối tác

### Files đã sửa:
- BE: `ProxyController.php` (save metadata), `GenericOrderProcessor.php` (key mapping)
- FE: `ServiceFormModal.tsx` (admin builder), `CheckoutModal.tsx` (checkout UI), `ProxyCard.tsx` (display)

**Why:** Bảo mật — không lộ cấu trúc API đối tác ra ngoài. UX — khách chỉ thấy tên dễ hiểu.

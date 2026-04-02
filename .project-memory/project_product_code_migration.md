---
name: Product Code Migration
description: Chuyển từ ID sang CODE cho giao tiếp sản phẩm giữa site mẹ/con — flow mua hàng, sync, import
type: project
---

## Nguyên tắc quan trọng

### Code dùng để giao tiếp, ID dùng để lưu trữ

- **`code`** = định danh ổn định, dùng khi **giao tiếp giữa 2 site** (mua hàng, sync SP, API)
- **`id`** = auto-increment, dùng để **lưu trong DB** (orders.type_service_id, FK, join)
- Mỗi site có `code` riêng — code site mẹ ≠ code site con cho cùng 1 sản phẩm
- Flow: site con gửi `product_code` (code site mẹ) → site mẹ lookup `WHERE code = ?` → lấy `id` → tạo Order với `id`

### Phân biệt code site mẹ vs code site con

| | Code site mẹ | Code site con |
|---|---|---|
| Lưu ở đâu | `type_services.code` trên DB site mẹ | `type_services.code` trên DB site con |
| Dùng khi | Site con gửi API mua hàng | User site con nhìn thấy trên card SP |
| Lưu ở site con | `metadata.supplier_product_code` | `type_services.code` |
| Ví dụ | `proxy-vn-rotate-30d` | `meoproxy-vn-30d` |
| Ai đặt | Admin site mẹ | Admin site con (hoặc auto-generate) |

## Flow mua hàng qua code

```
Site con FE → POST /buy-proxy-static { serviceTypeId: localId }
→ ProxyController.buyForChildSite() → tạo Order (type_service_id = localId) + Redis
→ PlaceOrder worker → MktProxyResellerProcessor
→ Đọc metadata.supplier_product_code → gửi site mẹ: POST /buy-proxy { product_code: "PROXY-VN-30D" }
→ Site mẹ ResellerController: WHERE code = 'PROXY-VN-30D' → id=5 → tạo Order (type_service_id=5)
→ Trả order_code → site con lưu → AWAITING_PROVIDER → poll → IN_USE
```

## Các file đã sửa

### BE
1. `ServiceType.php` — boot auto-generate code
2. Migration — code unique, backfill SP-{id}
3. `ResellerController.php` — buyProxy nhận product_code (backward compat service_type_id)
4. `MktProxyResellerProcessor.php` — gửi product_code
5. `SyncSupplierProducts.php` — lưu supplier_product_code
6. `SupplierProductController.php` — import/list dùng code
7. `ServiceTypeController.php` — validate code unique
8. `apiDocsConfig.ts` — docs đổi service_type_id → product_code

### FE
9. `TableServiceType.tsx` — hiện cột code
10. `ServiceFormModal.tsx` — input code (site mẹ)
11. `ChildServiceFormModal.tsx` — auto-fill code từ supplier, lưu supplier_product_code
12. `useSupplierProducts.ts` — interface thêm supplier_code

## Backward compat
- Site mẹ API vẫn nhận `service_type_id` (fallback khi không có `product_code`)
- Site con fallback `supplier_product_id` nếu chưa có `supplier_product_code` trong metadata

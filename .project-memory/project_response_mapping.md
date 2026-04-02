---
name: Response Mapping Config
description: ĐÃ IMPLEMENT 28/03 — lưu thêm dữ liệu từ NCC vào OrderItem, cấu hình per sản phẩm (override) hoặc per NCC (mặc định)
type: project
---

## Trạng thái: ĐÃ IMPLEMENT 28/03/2026

## Kiến trúc 2 cấp

1. **Nhà cung cấp (mặc định)**: `Provider.api_config.buy_static.response.response_mapping`
2. **Sản phẩm (override)**: `ServiceType.metadata.response_mapping` → ưu tiên cao hơn

Logic BE: nếu sản phẩm có `metadata.response_mapping` → dùng, không có → lấy từ NCC.

## Config format

```json
[{ "from": "data.region", "to": "region", "store": "metadata" }]
```

- `from`: tên trường nhà cung cấp trả về (dot path)
- `to`: tên lưu trong hệ thống
- `store`: `proxy` (thông tin proxy) hoặc `metadata` (dữ liệu bổ sung)

## Files đã sửa

### BE
- `DefaultHandler.php`: `applyResponseMapping()` — loop mapping, extract, lưu
- `GenericOrderProcessor.php`: merge product mapping vào responseConfig + lưu metadata
- `FetchProviderProxies.php`: tương tự cho deferred

### FE
- `ModalAddProvider.tsx`: ResponseMappingTable (mặc định NCC) + SavePreviewBox (bảng mapping tiếng Việt)
- `ServiceFormModal.tsx`: section "Lưu thêm dữ liệu từ nhà cung cấp" per sản phẩm
- `OrderDetailModal.tsx`: OrderRawDataPanel + ExpandableItemRow + cột "Dữ liệu bổ sung"

## Ngôn ngữ UI
- KHÔNG dùng: "response", "metadata", "proxy object", "NCC"
- DÙNG: "kết quả trả về", "dữ liệu bổ sung", "thông tin proxy", "nhà cung cấp"

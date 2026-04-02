---
name: Naming refactor — provider/supplier/partner
description: CHƯA HOÀN THÀNH. provider=NCC proxy, partner=đối tác kinh doanh, supplier=site mẹ. Cần rename variables + supplier_product_code.
type: project
---

## Định nghĩa

| Thuật ngữ | Nghĩa | Ví dụ |
|-----------|-------|-------|
| **provider** | NCC proxy | HomeProxy, ProxyVN, BestProxy |
| **partner** | Đối tác kinh doanh | Viettel, FPT (alias cũ, đã rename class) |
| **supplier** | Site mẹ (cung cấp cho site con) | mktproxy.com |

## Đã làm

- Class rename: Partner → Provider (model, controller, routes)
- `->partner` alias giữ backward compat
- Production bug fix: 'partner_price' → 'provider_price'

## TODO (session riêng)

1. Rename biến: `$apiKeyPartner` → `$providerToken`
2. Rename field: `supplier_product_code` → `provider_product_code` trong metadata
   - Files: SyncSupplierProducts, MktProxyResellerProcessor, SupplierProductController, FE ChildServiceFormModal
   - Cần DB migration: JSON_SET metadata
3. Cleanup duplicate references

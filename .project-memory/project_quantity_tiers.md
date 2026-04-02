---
name: Quantity Tiers - Chiết khấu theo số lượng
description: ĐÃ IMPLEMENT BE+FE cơ bản. Fix 24/03 — parent site providers giờ truyền $quantity đúng. FE CheckoutModal đã có UI.
type: project
---

## Trạng thái: BE+FE cơ bản xong (24/03/2026)

### BE:
- `PricingService::getPrice()` nhận `$quantity` (default=1, backward compat)
- `applyQuantityTier()` — fixed price hoặc discount %
- `applyQuantityTierCost()` — cho giá vốn
- **Fix 24/03:** Tất cả 9 providers ở parent site giờ truyền `$quantity` + áp quantity tier cho giá vốn
- `buyForChildSite()` đã truyền quantity từ trước

### FE CheckoutModal đã có:
- Per_unit mode: quantity discount % → `priceAfterQtyDiscount`
- Fixed mode: nested `quantity_tiers` trong price option → `fixedQtyPrice`
- UI: strikethrough giá gốc, hint mua thêm để giảm giá

### Data format:
**Fixed mode** — nhúng trong `price_by_duration`:
```json
{ "key": "30", "value": 5000, "cost": 3000, "quantity_tiers": [
  { "min": 20, "max": 49, "price": 4500, "cost": 2800 },
  { "min": 50, "max": null, "price": 4000, "cost": 2500 }
]}
```

**Per_unit mode** — trong `metadata.quantity_tiers`:
```json
[{ "min": 20, "max": 49, "discount": 5 }, { "min": 50, "max": null, "discount": 12.5 }]
```

**Why:** Nhà cung cấp có chiết khấu theo SL. Cần linh hoạt per-provider.

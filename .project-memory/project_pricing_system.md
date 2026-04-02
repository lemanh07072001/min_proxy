---
name: Pricing System — 4 tiers + per_unit/fixed
description: ĐÃ DEPLOY. PricingService 4 cấp giá, Redis cache, per_unit mode, quantity tiers, site con sync.
type: project
---

## ĐÃ DEPLOY (20-24/03/2026)

### 4 cấp giá (ưu tiên cao → thấp)

1. **Tier 3 — Fixed custom** (CustomPrice với giá cố định per user per product)
2. **Tier 2b — Custom markup** (CustomPrice với cost_plus per product)
3. **Tier 2a — Provider markup** (user_provider_pricing, markup per NCC per user)
4. **Tier 1 — Default** (price_per_unit + discount_tiers, hoặc price_by_duration)

Site con KHÔNG thấy Tier 2a/2b hoặc provider info.

### 2 mode

- **per_unit**: `price_per_unit × duration`, hỗ trợ quantity discount tiers
- **fixed**: `price_by_duration[key]`, hỗ trợ nested quantity_tiers

### Kiến trúc

- `PricingService::getPrice($quantity)` — resolve tier + apply quantity discount
- Redis cache TTL 60 phút, invalidate on config change
- Site con sync pricing_mode + cost từ site mẹ
- FE: CheckoutModal hiển thị giá theo mode + discount

### Files chính

- BE: `PricingService.php`, `CustomPrice` model, `custom_prices` table
- FE: `CheckoutModal`, `ServiceFormModal`, `CustomPriceModal`

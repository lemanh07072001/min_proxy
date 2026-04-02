---
name: Redesign ReportDaily + Admin Affiliate — ĐÃ IMPLEMENT
description: ĐÃ DEPLOY 01/04 — ReportDaily gom từ order_histories, affiliate dùng setting chung, bỏ per-user affiliate_percent
type: project
---

## Trạng thái: ĐÃ IMPLEMENT (01/04/2026)

### Thay đổi chính

1. **ReportDaily**: gom từ `order_histories` thay `orders`
   - Terminal: `history.status=expired(5)` + `scan=0` → cộng dồn report → `scan=1`
   - Non-terminal: `history.status=in_use(4)` → xoá cũ, query lại
   - Map: history expired → order status 4, history in_use → order status 2
   - Cột mới `history_type` (buy/renewal) trong `report_order_status`

2. **AffiliateController (API)**: 8 functions chuyển hoàn toàn sang `order_histories`
   - Dùng `affiliate_commission` đã tính sẵn, không tính lại từ %
   - Mark `is_payment_affiliate=1` trên histories thay orders

3. **affiliate_percent**: bỏ per-user (`users.affiliate_percent`), dùng setting chung
   - `Settings::getSetting('default_affiliate_percent')` — mặc định 2%
   - Admin chỉnh ở FE: Cài đặt chung → Hoa hồng Affiliate
   - API: GET/POST `admin/affiliate-settings`

### Không sửa
- Dashboard FE — API response format giữ nguyên
- Affiliate FE — API response format giữ nguyên
- Blade controllers (`Admin\AffiliateController`, legacy `AffiliateController`) — không dùng, giữ nguyên
- `users.affiliate_percent` column — giữ trong DB, blade views vẫn đọc

### Files BE
- `ReportDaily.php` — redesign hoàn toàn
- `AffiliateController.php` (API) — rewrite 8 functions
- `SiteSettingsController.php` — thêm get/update affiliate settings
- `Settings.php` — thêm KEY_DEFAULT_AFFILIATE_PERCENT
- `ReportOrderStatus.php` — thêm history_type fillable
- `routes/api.php` — thêm 2 routes
- Migration — setting + cột + unique index

### Files FE
- `SiteSettingsForm.tsx` — field "Hoa hồng Affiliate %" tab Cài đặt chung

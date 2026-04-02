---
name: Site Setup Steps & Fixes
description: Các bước setup site mẹ/con đã thực hiện, lỗi gặp phải và cách fix — dùng khi hướng dẫn setup
type: project
---

## Cách xác định site mẹ vs site con

- `.env` có `SITE_MASTER_KEY=xxx` → site mẹ (`config('site.is_parent') = true`)
- `.env` KHÔNG có `SITE_MASTER_KEY` → site con (`config('site.is_child') = true`)
- FE: `useBranding().isChild` / `.isParent` (lấy từ API `site_mode`)
- Config file: `BE/config/site.php`

## Lệnh setup

```bash
php artisan site:setup
```

Lệnh này tự động:
1. Phát hiện site mode (mẹ/con)
2. Kiểm tra `.env`
3. Tạo DB nếu chưa có (hỏi confirm)
4. Chạy migrate nếu DB trống
5. Tạo admin user (hỏi confirm)
6. Check bank, telegram, pay2s, branding
7. Site con: test kết nối supplier

## Lỗi đã gặp và fix

### Lỗi 1: "There are no commands defined in the site namespace"
**Nguyên nhân:** `SiteSetup` chưa đăng ký trong `Kernel.php`
**Fix:** Thêm `use App\Console\Commands\SiteSetup;` + `SiteSetup::class` vào `$commands` array trong `app/Console/Kernel.php`

### Lỗi 2: "Table 'proxy_child.users' doesn't exist" khi chạy site:setup
**Nguyên nhân:** DB mới tạo nhưng `checkMigrations()` gọi `migrate:status` → cần bảng `migrations` → chưa có
**Fix:** Thêm `Schema::hasTable('migrations')` check trước. Nếu DB trống → hỏi chạy migrate luôn thay vì check status.

### Lỗi 3: "Table 'proxy_child.api_keys' doesn't exist" khi migrate
**Nguyên nhân:** Các bảng cốt lõi (users, api_keys, dongtien, bank_auto, settings, banks) được tạo bằng SQL dump ban đầu, KHÔNG có migration `create_xxx_table`. Migration alter table chạy trước khi bảng tồn tại.
**Fix:** Tạo `database/migrations/2025_09_01_000001_create_base_tables.php` — migration base tạo tất cả bảng thiếu với `if (!Schema::hasTable(...))` để safe cho cả DB cũ và mới.

### Lỗi 4: APP_URL sai port
**Nguyên nhân:** `.env` có `APP_URL=http://127.0.0.1:8000` nhưng dev chạy port 8002
**Fix:** Sửa `.env`: `APP_URL=http://127.0.0.1:8002`
**Ảnh hưởng:** URL ảnh upload trả về sai domain → logo/favicon không hiển thị

## Setup site con — từ đầu đến cuối

### BE:
1. Clone source
2. Sửa `.env`: `DB_DATABASE=proxy_child`, bỏ `SITE_MASTER_KEY`, đúng `APP_URL`
3. `php artisan site:setup` → tự tạo DB, migrate, admin user
4. Cron: `* * * * * php artisan schedule:run`

### FE:
1. Clone source
2. Sửa `.env.production`: domain riêng, API URL trỏ BE site con
3. Logo/favicon/màu để trống (admin upload sau)
4. `npm ci && npm run build && pm2 start`

### Admin UI (sau khi deploy):
1. **Cài đặt chung > Thương hiệu**: logo, favicon, tên, mô tả
2. **Cài đặt chung > Màu sắc**: chọn preset hoặc tự chọn
3. **Cài đặt chung > SEO**: title/description theo ngôn ngữ
4. **Cài đặt chung > Nâng cao**: phone, email, địa chỉ, social links
5. **Cài đặt chung > Nhà cung cấp**: API URL + Key site mẹ → Test kết nối
6. **Sản phẩm**: Import từ site mẹ → set giá bán riêng
7. **Bank**: Cấu hình ngân hàng nhận tiền (TODO: cần thêm UI)
8. **Telegram**: Cấu hình bot thông báo (TODO: cần thêm UI)

## Sản phẩm site con

- Đồng bộ tự động mỗi giờ: `sync:supplier-products`
- SP mới → thông báo Telegram → admin import qua UI
- Giá nhập thay đổi → tự cập nhật `cost_price`
- SP bị tắt site mẹ → tự inactive
- Admin site con chỉ set: tên riêng + giá bán theo thời gian (1, 7, 30 ngày)
- Form site con dùng `ChildServiceFormModal` — bảng giá 2 cột (giá nhập read-only | giá bán editable + lợi nhuận)

## Rename partners → providers (backward compat)

Đã rename bảng + cột nhưng code cũ vẫn gọi `->partner`, `->partner_code`.
Fix bằng alias trong model:
- `ServiceType::partner()` → alias cho `provider()`
- `Provider::getPartnerCodeAttribute()` → trả `provider_code`
- BasePartner, HomeProxy, ProxyVn... tất cả dùng `->partner->token_api` → hoạt động qua alias
- TODO: migrate code cũ sang `->provider` rồi xóa alias

## Files quan trọng

- `BE/app/Console/Commands/SiteSetup.php` — lệnh setup
- `BE/database/migrations/2025_09_01_000001_create_base_tables.php` — migration base
- `BE/config/site.php` — config site mode
- `BE/app/Services/SupplierService.php` — gọi API site mẹ
- `BE/app/Console/Commands/SyncSupplierProducts.php` — sync sản phẩm
- `FE/src/views/Client/Admin/ServiceType/ChildServiceFormModal.tsx` — form SP site con
- `FE/src/hooks/apis/useSupplierProducts.ts` — hook SP site mẹ
- `SITE-SETUP-GUIDE.md` — hướng dẫn đầy đủ

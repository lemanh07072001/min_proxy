---
name: Multi-site Architecture
description: Kiến trúc site mẹ vs site con - cách hoạt động, phân quyền, cấu hình, API flow
type: project
---

## Mô hình Multi-site

MKT Proxy là hệ thống **1 source code, nhiều site** (multi-tenant by deployment):
- **Site mẹ** (parent): MKT Proxy gốc — quản lý sản phẩm, đối tác, reseller
- **Site con** (child/reseller): Deploy cùng source, khác DB + .env — bán proxy cho end-user

**Why:** Reseller mua proxy giá sỉ từ site mẹ, bán lại cho khách với thương hiệu riêng.

## Phân biệt site mẹ vs site con

| Đặc điểm | Site mẹ | Site con |
|---|---|---|
| `config('site.is_parent')` | `true` | `false` |
| `BrandingContext.isParent` | `true` | `false` |
| Quản lý đối tác/partner | ✅ | ❌ ẩn menu |
| Quản lý reseller | ✅ | ❌ ẩn menu |
| Cấu hình scripts (head/body) | ✅ | ❌ bị block |
| Kết nối nhà cung cấp (supplier) | ❌ | ✅ tab riêng |
| Nguồn sản phẩm | Từ partner API | Từ site mẹ API (supplier) |

## Cấu hình branding (đã triển khai)

Admin site con tự cấu hình qua **Cài đặt chung** (6 tabs):
1. **Thương hiệu**: tên, mô tả, logo, favicon, footer, sidebar description
2. **Màu sắc**: 5 preset + tự chọn, preview realtime
3. **SEO**: title/description/keywords theo 4 ngôn ngữ (vi/en/ja/ko)
4. **Nâng cao**: Google verification, GTM, schema, social links, scripts (chỉ site mẹ)
5. **Sidebar**: link hỗ trợ, video YouTube
6. **Nhà cung cấp**: API key kết nối site mẹ (chỉ site con)

## Data flow

```
Site con admin chỉnh cấu hình
  → POST /admin/update-branding-settings → lưu DB settings table
  → Cache::forget('branding_settings') (BE)
  → POST /api/revalidate?tag=branding (FE server cache)
  → invalidateQueries(['branding-settings']) (FE client cache)

User truy cập site con
  → Server: getServerBranding() → generateMetadata() (SEO)
  → Client: BrandingContext → useBranding() hook
  → BrandingThemeSync → MUI theme primaryColor
  → CSS variables: --primary-gradient, --primary-hover, --primary-contrast
```

## Files quan trọng

**BE:**
- `SiteSettingsController.php` — API get/update branding
- `settings` table — key-value store cho tất cả config
- `config/site.php` — `is_parent` flag

**FE:**
- `BrandingContext.tsx` — client-side branding provider
- `BrandingThemeSync.tsx` — sync DB color → MUI theme
- `getServerBranding.ts` — server-side fetch cho SEO
- `siteConfig.ts` — env var defaults
- `SiteSettingsForm.tsx` — admin UI cấu hình
- `css-variables.css` — CSS variable defaults

## Quy tắc khi phát triển

1. Menu/feature chỉ site mẹ → wrap `!isChild` hoặc `isParent`
2. Menu/feature chỉ site con → wrap `isChild`
3. Dữ liệu hiển thị (tên, phone, email, địa chỉ) → lấy từ `useBranding()`
4. Màu sắc → xem `feedback_branding_colors.md`
5. SEO metadata → `getServerBranding()` trong `generateMetadata()`

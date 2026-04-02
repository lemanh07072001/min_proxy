---
name: Branding Colors Rule
description: Khi thêm component/page/menu mới, PHẢI dùng CSS variables cho màu chủ đạo, KHÔNG hardcode hex color
type: feedback
---

Khi thêm bất kỳ component, page, menu, button, link, border, shadow mới — **PHẢI** dùng màu chủ đạo từ branding config, **KHÔNG BAO GIỜ** hardcode hex color (#FC4336, #ef4444, #f97316, #f88a4b, #e63946, #d06830, #f0944e...).

**Why:** Hệ thống multi-site — mỗi site con cấu hình màu riêng qua Admin > Cài đặt chung > Màu sắc. Hardcode = site con bị lẫn màu site mẹ.

**How to apply:**

CSS file:
- Button/gradient: `background: var(--primary-gradient, linear-gradient(45deg, #FC4336, #F88A4B))`
- Modal/Dialog header: KHÔNG dùng colored background. Dùng white bg + `border-b border-gray-200` + icon nhỏ tinted. Header phải compact (py-3), không to hơn nội dung.
- Text/border/icon accent: `color: var(--primary-hover, #ef4444)`
- Text trên nền primary: `color: var(--primary-contrast, #fff)`
- Border hover nhẹ: `border-color: color-mix(in srgb, var(--primary-hover) 40%, transparent)`
- Shadow: dùng `rgba(0,0,0,0.15)` (neutral), KHÔNG dùng `rgba(252,67,54,0.3)` (hardcode)

TSX inline style:
- Dùng `useBranding()` hook: `const { primaryHover, primaryGradient } = useBranding()`
- Hoặc CSS variable string: `style={{ color: 'var(--primary-hover)' }}`

MUI component:
- `variant='contained'` / `variant='outlined'` tự nhận primary từ theme
- KHÔNG dùng `color='warning'` hay `color='error'` cho nút không phải cảnh báo/lỗi

Tên site:
- Client component: `useBranding().name`
- Server component: `siteConfig.name`
- KHÔNG hardcode "MKT Proxy"

Logo:
- Logo URL inject từ SERVER qua CSS variable `--site-logo-src` trong layout.tsx
- Logo.tsx đọc CSS variable, KHÔNG dùng useBranding() hay client API
- Site con chưa setup logo → để trống (không hiện gì), KHÔNG fallback logo mặc định
- Landing page: `useBranding().logo` — nếu empty → hiện tên site text thay vì ảnh
- Luôn set `maxHeight: 50px` + `objectFit: contain` + `overflow: hidden` trên container

Skeleton loading:
- Accent: `color-mix(in srgb, var(--primary-hover) 15%, white)`
- KHÔNG dùng `#fee2e2` hay `#fef2f2`

**Ngoại lệ** — GIỮ NGUYÊN hardcode cho:
- Semantic colors: error red (#ef4444), success green (#22c55e), warning yellow (#f59e0b)
- Toast notification colors
- Tag colors (Hot, Cheap...)
- Form validation error borders

Chi tiết đầy đủ: `FE/DEVELOPER-GUIDE.md` section "Quy tắc sử dụng màu chủ đạo"

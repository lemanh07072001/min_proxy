---
name: Provider Config UX Redesign
description: ĐÃ IMPLEMENT 29/03 — Redesign form cấu hình NCC từ 1 file 2573 dòng thành ~15 file, vertical tabs, pipeline steps, auto-suggest
type: project
---

## ĐÃ IMPLEMENT (session 29/03/2026)

### Thay đổi chính
1. **Tách file**: `ModalAddProvider.tsx` 2573 dòng → ~15 file nhỏ
   - `ProviderFormTypes.ts` — types, constants, defaults
   - `ProviderFormSerializer.ts` — parseApiConfig, buildApiConfig
   - `sections/` — BasicInfo, BuyConfig, Rotate, IpWhitelist, Renew
   - `components/` — FieldHint, PipelineStepCard, ResponseMappingTable, SavePreviewBox, ResponseDryRun, JsonPreviewPanel
   - `hooks/useAutoSuggest.ts` — algorithm nhận dạng config

2. **UX mới**: Vertical Tabs thay Accordion
   - 5 tab bên trái: Cơ bản / Mua proxy / Xoay / IP WL / Gia hạn
   - Badge trạng thái (xanh = bật, xám = tắt)
   - JSON preview bên phải (giữ nguyên)

3. **Pipeline Steps** trong tab Mua proxy:
   - Step 1: Gọi API
   - Step 2: Kiểm tra thành công/thất bại
   - Step 3: Đọc dữ liệu proxy (immediate + deferred)
   - Step 4: Lưu thêm dữ liệu
   - Step 5: Xử lý lỗi
   - Nâng cao: collapsible accordion

4. **Auto-suggest**: paste response → tự nhận dạng format → gợi ý checkbox → áp dụng vào form

5. **Rotating/Static toggle**: gộp 2 accordion thành 1 tab

### Backward compatible
- api_config JSON format không đổi
- Load data cũ vào form mới OK
- Tất cả features cũ hoạt động

**Why:** Admin site con cần tự quản lý NCC mà không phải là dev
**How to apply:** Form mới tại `FE/src/views/Client/Admin/Provider/ModalAddProvider.tsx`

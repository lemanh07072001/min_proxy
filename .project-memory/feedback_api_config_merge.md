---
name: api_config phải merge không replace
description: BE ProviderController update api_config phải merge section cũ + mới, không replace toàn bộ. FE phải gửi đủ tất cả section (dù null).
type: feedback
---

BE lưu api_config phải MERGE, không REPLACE toàn bộ JSON column.

**Why:** User sửa 1 tab (rotate) → FE chỉ gửi section đó → BE replace → mất config các tab khác (buy_static, buy_rotating). Đã mất dữ liệu thực tế (30/03/2026).

**How to apply:**
- BE: `array_merge($existing, $incoming)` + `array_filter` bỏ null
- FE: `buildApiConfig` luôn gửi TẤT CẢ section (data hoặc null), không skip
- Review: khi sửa form multi-tab → PHẢI trace round-trip save→load cho TẤT CẢ tab, không chỉ tab đang sửa
- Checklist cross-module: "code khác ĐỌC/GHI cùng data" phải bao gồm cả API save endpoint

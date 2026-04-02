---
name: Verify phải trace end-to-end, không từng method rời rạc
description: Khi verify code mới, trace 1 request xuyên suốt từ input đến DB. Từng method đúng riêng lẻ không có nghĩa flow đúng.
type: feedback
---

Verify PHẢI trace end-to-end — 1 request từ đầu đến cuối, không trace từng method rời rạc.

**Why:** Session 30/03/2026 — `success_check: 'first'` được thêm vào `checkError` (đúng) nhưng `extractProxies` cũng dùng `success_check` và bỏ nhầm phần tử đầu (chứa proxy). Trace riêng từng method → "đúng", ghép flow → sai → mất proxy production.

**How to apply:**
- Trace 1 flow hoàn chỉnh: input → method 1 (giá trị vào/ra) → method 2 (giá trị vào/ra) → ... → lưu DB (giá trị cuối)
- Nếu thêm config/flag mới → grep TẤT CẢ chỗ đọc flag đó, trace từng chỗ
- Verify output cuối cùng (DB row), không chỉ return value trung gian

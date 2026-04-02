---
name: Quy trình dev — review + chứng minh trước khi báo xong
description: PHẢI review 3 lớp + chứng minh bằng bảng evidence TRƯỚC khi báo xong. "Xong" = đã chứng minh, không phải "đã viết code".
type: feedback
---

## Nguyên tắc gốc

**"Xong" = đã chứng minh 100% không lỗi. Không phải "đã viết code".**

**Why:** AI tự code + tự review có confirmation bias. Session 26/03 deploy lỗi import trùng, session 29/03 có 5 lỗi production — tất cả do bỏ qua review.

## Review 3 lớp (SAU code, TRƯỚC báo xong)

1. **Code mới đúng?** — validate, transaction, edge cases, import trùng, build pass
2. **Xung đột code cũ?** — grep tất cả chỗ đọc/ghi cùng field/status/Redis key, race condition
3. **Flow tổng thể?** — trace E2E sau khi thêm code mới, lifecycle tiếp theo đúng không

## Bảng chứng minh

| # | Kiểm tra | Bằng chứng (file, line, logic) |
|---|----------|-------------------------------|
| 1 | Status change → verify workers | "Worker X query status=A. Code set C → không match → ✓" |
| 2 | Field change → grep đọc/ghi | "Field Y đọc bởi Z line N → không ảnh hưởng → ✓" |
| 3 | Race condition → lock | "lockForUpdate() line N → ✓" |
| 4 | Lifecycle E2E | "action → state A → cron B → state C → ✓" |

Nếu có lỗi → liệt kê TẤT CẢ → fix 1 đợt → review LẠI toàn bộ → lặp đến khi 100% ✓.

## Quy tắc quan trọng

- Trace giá trị **thực tế**, KHÔNG mental execution
- Test với data thật (`php artisan tinker` / `npx tsc`), không tự tạo data thiên vị happy path
- Nếu không thể test → nói rõ "chưa verify runtime"
- Impact analysis BẮT BUỘC: grep caller/consumer, cross-site check, migration check
- "ok" = đồng ý cách hiểu/kế hoạch. "push" = đồng ý push code

## Linh hoạt

| Loại task | Bước |
|-----------|------|
| Fix UI nhỏ | phân tích → code → checklist → bàn giao |
| Bug fix rõ | phân tích → code → checklist → test → bàn giao |
| Feature/Refactor | đủ bước + impact analysis |
| Production critical | đủ bước + user test trước push |

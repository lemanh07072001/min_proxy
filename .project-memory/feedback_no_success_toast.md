---
name: Không dùng toast cho thành công
description: Thay toast success bằng inline feedback (animation button, loading table) — UX tốt hơn
type: feedback
---

KHÔNG dùng toast.success() để thông báo thành công. Toast chỉ dùng cho lỗi.

**Thay bằng:**
- Animation button khi click (loading spinner → check icon → reset)
- Animation màn hình tổng thể khi loading table (skeleton, fade in)
- Inline feedback gần nơi user thao tác

**Why:** Toast success gây phiền, che UI, không cần thiết vì user đã biết action thành công qua visual feedback (button animation, data reload). UX tốt nhất là phản hồi ngay tại chỗ.

**How to apply:** Khi implement mutation (create/update/delete), dùng `isLoading` state cho button animation + `refetch` cho table animation. Không gọi `toast.success()`. Chỉ `toast.error()` khi có lỗi.

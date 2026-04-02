---
name: Auth flash — đang debug
description: User thỉnh thoảng thấy "Yêu cầu đăng nhập" flash rồi hết. Đã thêm debug log, chờ user gửi log lúc flash xảy ra.
type: project
---

## Vấn đề

User thỉnh thoảng thấy EmptyAuthPage ("Yêu cầu đăng nhập") flash rồi tự hết. Đã fix 3 lần nhưng chưa xác nhận triệt để vì chưa bắt được trigger thật sự.

## Trạng thái hiện tại (02/04/2026)

- AuthGuard có **debug log** trong console: `[AuthGuard] { status, _wasEverAuthenticated, confirmedUnauth, hasSession, sessionError, pathname, timestamp }`
- Module-level `_wasEverAuthenticated` flag (không reset khi remount)
- 1.5s delay trước khi hiện EmptyAuthPage cho user chưa login
- **Chờ user gửi log lúc flash xảy ra** để xác định root cause thật sự

## Từ khoá

User nói **"auth flash"** = báo lỗi này + gửi log console.

## Files liên quan

- `FE/src/hocs/AuthGuard.tsx` — guard chính, có debug log
- `FE/src/libs/auth.ts` — NextAuth config, JWT callback, refreshToken
- `FE/src/libs/axios.ts` — interceptor 401 → refresh → signOut
- `FE/src/hocs/useAxiosAuth.tsx` — sync token vào axios

## Đã phân tích (source NextAuth v4)

- `SessionProvider` line 485: `status: loading ? "loading" : session ? "authenticated" : "unauthenticated"`
- Khi `getServerSession()` trả null → SessionProvider nhận session=null → status='unauthenticated' NGAY (không qua 'loading')
- Network error khi refetch → NextAuth KHÔNG set session=null (chỉ log error)
- signOut chỉ gọi từ: UserDropdown (user tự logout), useAxiosAuth (401+refresh fail)

## Khi nhận log

Cần xem:
1. `status` lúc flash là gì? ('unauthenticated' hay khác?)
2. `_wasEverAuthenticated` có đúng true không?
3. `sessionError` có giá trị gì?
4. Xảy ra ở pathname nào?
5. Có dòng `⚠️ Confirmed unauthenticated` không?

Từ đó mới xác định đúng root cause và fix triệt để. **Xóa debug log** sau khi fix xong.

# MKT Proxy — Frontend (Next.js 15)

> **Dự án gồm 2 repo riêng biệt.** Để Claude Code hiểu đầy đủ context, cần gộp vào 1 workspace.

## Setup workspace (BẮT BUỘC cho dev mới)

```bash
# 1. Tạo thư mục gốc
mkdir mktProxies && cd mktProxies

# 2. Clone cả 2 repo vào cùng thư mục
git clone <BE_REPO_URL> BE
git clone <FE_REPO_URL> FE

# 3. Mở workspace ở thư mục gốc (KHÔNG mở riêng BE hoặc FE)
#    VSCode: File → Open Folder → chọn mktProxies/
#    Claude Code CLI: cd mktProxies && claude
```

**Cấu trúc đúng:**
```
mktProxies/          ← mở workspace TẠI ĐÂY
├── BE/              ← repo BE (Laravel)
│   ├── CLAUDE.md
│   └── DEVELOPER-GUIDE.md (section 15 = changelog)
└── FE/              ← repo này (Next.js 15)
    ├── CLAUDE.md
    └── DEVELOPER-GUIDE.md (section 13 = changelog)
```

## Quy tắc code

- Giao tiếp **tiếng Việt**
- API hooks: **LUÔN** dùng `useAxiosAuth()` — KHÔNG dùng `fetch()` trực tiếp
- **KHÔNG** dùng `toast.success` — dùng `toast.info` hoặc inline feedback (button animation, loading state)
- **KHÔNG** hardcode màu (#FC4336, #ef4444...) → dùng CSS vars hoặc `useBranding()`
- **KHÔNG** hardcode tên "MKT Proxy" → dùng `useBranding().name`
- Menu/feature chỉ site mẹ → `!isChild`, chỉ site con → `isChild`
- Review code: đọc hết → liệt kê hết bugs → fix **1 đợt** — không sửa chồng chéo
- Changelog: thay đổi FE → ghi `DEVELOPER-GUIDE.md` section 13, format `#### 13.N Tiêu đề` + Thêm/Sửa/Files

## Tech Stack

- **Next.js 15** (App Router) + **MUI 6** + **TanStack Query** + **NextAuth 4**
- Auth: 2 layer — `middleware.ts` (route protection) + `useAxiosAuth` (token interceptor)
- API hooks: `src/hooks/apis/` — TanStack Query, `useAxiosAuth()`, invalidateQueries on mutation
- Admin pages: `src/app/[lang]/(private)/(client)/admin/*/page.tsx` → `src/views/Client/Admin/*/`
- Branding: `useBranding()` hook — name, colors, isChild, contact info

## Cấu trúc quan trọng

```
src/
├── app/[lang]/(private)/(client)/     ← Pages (thin wrappers)
│   ├── admin/                         ← Admin pages
│   └── ...                            ← User pages
├── views/Client/                      ← View components (logic + UI)
│   ├── Admin/                         ← Admin views
│   └── HistoryOrder/OrderDetail.tsx   ← Order detail + renewal UI
├── hooks/
│   ├── apis/                          ← API hooks (useAxiosAuth + TanStack Query)
│   │   ├── useRenewal.ts              ← Renew, refund, history logs
│   │   ├── useQueueStatus.ts          ← Queue monitor (5s poll)
│   │   └── useOrderHistories.ts       ← Order renewal history
│   ├── useRole.tsx                    ← isAdmin, hasPermission
│   └── useBranding.tsx                ← Site branding, isChild
├── components/layout/vertical/
│   └── VerticalMenu.tsx               ← Sidebar menu (admin gated)
├── constants/orderStatus.ts           ← Status labels, transaction types
└── hocs/useAxiosAuth.tsx              ← Authenticated axios instance
```

## Hệ thống đã implement (FE)

| Hệ thống | Files | Mô tả |
|-----------|-------|-------|
| Renewal UI | `OrderDetail.tsx`, `useRenewal.ts` | Gia hạn, hoàn tiền, log panel, status badges (0-7) |
| Queue Monitor | `QueueMonitorPage.tsx`, `useQueueStatus.ts` | Admin real-time monitor, circuit breaker clear |
| Pricing | `OrderDetail.tsx` RenewalInlinePanel | Giá lấy từ API `renew-info` (prices per duration) |

## Task đang cần làm

1. **Admin manual resolve UI**: Modal import proxy, nút xác nhận thành công, nút re-fetch proxy
2. **Giao dịch UI**: Label raw type → tiếng Việt, màu sắc
3. **Provider admin form**: Error codes config UX, response type

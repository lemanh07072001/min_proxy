# MKT Proxy — Frontend (Next.js 15)

> **⚠️ DỰ ÁN GỒM 2 REPO — TỰ ĐỘNG ĐỌC REPO KIA:**
> - **Repo BE** nằm tại `../BE/` (cùng cấp với thư mục FE này)
> - Khi bắt đầu session, **tự kiểm tra** `../BE/` có tồn tại không:
>   - **Có** → đọc `../BE/CLAUDE.md` để hiểu BE context, KHÔNG cần hỏi user
>   - **Không** → thông báo user: "Repo BE chưa có, clone bằng: `git clone https://gitlab.com/longlv197/proxy.git ../BE`"
> - **BE Developer Guide**: `../BE/DEVELOPER-GUIDE.md` — changelog BE ở section 15

> **📂 BỘ NHỚ DỰ ÁN:**
> - Nằm tại `FE/.project-memory/` — chứa kiến trúc, quyết định thiết kế, feedback, bugs
> - Index: `FE/.project-memory/MEMORY.md` — đọc file này TRƯỚC để biết cần đọc file nào
> - **BẮT BUỘC đọc** khi bắt đầu session hoặc khi user đề cập vấn đề đã có trong memory
> - Khi sửa code xong → kiểm tra memory liên quan có cần cập nhật không

## Setup workspace (BẮT BUỘC cho dev mới)

```bash
# 1. Tạo thư mục gốc
mkdir mktProxies && cd mktProxies

# 2. Clone cả 2 repo vào cùng thư mục
git clone https://gitlab.com/longlv197/proxy.git BE
git clone https://github.com/lemanh07072001/min_proxy.git FE

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
└── FE/              ← repo FE (Next.js 15)
    ├── CLAUDE.md
    ├── DEVELOPER-GUIDE.md (section 13 = changelog)
    └── .project-memory/  ← bộ nhớ dự án (dùng chung cho cả FE+BE)
        ├── MEMORY.md     ← index, đọc đầu tiên
        ├── project_*.md  ← kiến trúc, hệ thống
        ├── feedback_*.md ← quy tắc phải tuân theo
        └── bug_*.md      ← bugs đang xử lý
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

# MKT Proxy - Frontend Developer Guide

> File tham khảo cho developer maintain dự án FE.
> Cập nhật mỗi khi có thay đổi quan trọng.

---

## Mục lục

1. [Tech Stack](#1-tech-stack)
2. [Cấu trúc thư mục](#2-cấu-trúc-thư-mục)
3. [Environment Variables](#3-environment-variables)
4. [API Configuration](#4-api-configuration)
5. [Multi-site & Branding](#5-multi-site--branding)
6. [Quản lý sản phẩm (ServiceType)](#6-quản-lý-sản-phẩm-servicetype)
7. [Authentication Flow](#7-authentication-flow)
8. [Data Fetching Pattern](#8-data-fetching-pattern)
9. [FE ↔ BE API Reference](#9-fe--be-api-reference)
10. [Routing & Middleware](#10-routing--middleware)
11. [Quy tắc khi phát triển](#11-quy-tắc-khi-phát-triển)
12. [Changelog - Các vấn đề đã sửa](#12-changelog---các-vấn-đề-đã-sửa)
13. [Known Issues — Danh sách vấn đề cần xử lý](#13-known-issues--danh-sách-vấn-đề-cần-xử-lý)

---

## 1. Tech Stack

| Thành phần        | Công nghệ                          |
| ----------------- | ---------------------------------- |
| Framework         | Next.js 15.4.8 (App Router)       |
| Language          | TypeScript 5.5                     |
| UI                | MUI 6 + Tailwind CSS 3.4          |
| State (global)    | Redux Toolkit + React Redux        |
| State (server)    | TanStack React Query 5             |
| Table             | TanStack React Table 8             |
| Auth              | NextAuth 4 (JWT strategy)          |
| HTTP              | Axios                              |
| Form              | React Hook Form + Yup/Zod          |
| i18n              | i18next + react-i18next            |
| Realtime          | Socket.IO                          |

---

## 2. Cấu trúc thư mục

```
FE/
├── src/
│   ├── @core/              # Core utilities, types, theme helpers
│   ├── @layouts/           # Layout system (shared across pages)
│   ├── @menu/              # Navigation & menu context
│   ├── app/                # Next.js App Router (xem chi tiết bên dưới)
│   ├── components/         # Shared components (UI, modals, form, auth guards...)
│   ├── config/             # Runtime config (api.ts - URL tập trung)
│   ├── configs/            # Static config (i18n, theme, breakpoints...)
│   ├── constants/          # App constants
│   ├── data/               # Navigation data, search data, dictionaries
│   ├── hocs/               # HOCs & hooks liên quan auth/routing
│   │   ├── useAxiosAuth.tsx  # ← Axios interceptor: gắn token + auto-logout 401
│   │   ├── AuthGuard.tsx     # Server-side auth guard cho layout
│   │   ├── GuestOnlyRoute.tsx# Chặn user đã login vào trang login/register
│   │   ├── TranslationWrapper.tsx # Wrapper i18n cho layout
│   │   └── useRandomString.tsx
│   ├── hooks/              # Custom hooks
│   │   ├── apis/           # ← Tất cả hooks gọi API (React Query)
│   │   ├── useClientAuthGuard.tsx  # Client-side auth check (chỉ check NextAuth status)
│   │   └── useRole.tsx     # Hook lấy role user
│   ├── libs/
│   │   ├── axios.ts        # Axios singleton instance (baseURL = PUBLIC_API_URL)
│   │   └── auth.ts         # NextAuth config (providers, callbacks, JWT strategy)
│   ├── locales/            # File dịch (vi, en, cn, ko, ja)
│   ├── store/              # Redux store (chỉ có userSlice - lưu thông tin user)
│   ├── types/              # TypeScript types
│   ├── utils/              # Utility functions (serverSessionValidation, helpers...)
│   ├── views/              # Page view components
│   │   ├── Auth/           #   Login, Register, Reset password...
│   │   └── Client/         #   Xem chi tiết bên dưới
│   └── middleware.ts       # Route protection (JWT check, role check)
│
├── .env.development        # Dev environment
├── .env.production         # Production environment
├── next.config.ts
├── tsconfig.json
└── package.json
```

### App Router Routes

```
app/[lang]/
├── (landing-page)/         # Public: trang chủ, about, cooperate, hotline
├── (public)/               # Public: login, register, check-proxy, reset-password...
├── (private)/(client)/     # ← Cần auth
│   ├── admin/              #   Admin dashboard, quản lý user, giao dịch
│   ├── overview/           #   Tổng quan tài khoản
│   ├── products/           #   Danh sách proxy
│   ├── recharge/           #   Nạp tiền
│   ├── transaction-history/#   Lịch sử giao dịch
│   ├── history-order/      #   Lịch sử đơn hàng
│   ├── affiliate/          #   Chương trình affiliate
│   ├── profile/            #   Thông tin cá nhân
│   └── contact/            #   Liên hệ
├── api/                    # API routes (xem chi tiết bên dưới)
└── docs/                   # Tài liệu API (Redoc)
```

### Views/Client (Page Components)

```
views/Client/
├── Admin/                  # Quản lý admin (dashboard, users, giao dịch)
├── Affiliate/              # Chương trình affiliate
├── CheckProxy/             # Kiểm tra proxy
├── HistoryLogin/           # Lịch sử đăng nhập
├── HistoryOrder/           # Lịch sử đơn hàng
├── OrderProxy/             # Đặt mua proxy
├── OrderRotatingProxy/     # Đặt proxy xoay
├── Overview/               # Tổng quan tài khoản
├── Partner/                # Đối tác
├── Profile/                # Thông tin cá nhân
├── Recharge/               # Nạp tiền
├── ResetPassword/          # Đặt lại mật khẩu
├── RotatingProxy/          # Proxy xoay (landing)
├── StaticProxy/            # Proxy tĩnh (landing)
├── TransactionHistory/     # Lịch sử giao dịch
└── VerifyEmail/            # Xác minh email
```

### API Routes (Next.js Route Handlers)

```
app/api/
├── admin/                  # Admin endpoints (proxy server-side)
├── auth/                   # NextAuth [...nextauth] route
├── buy-proxy/              # Mua proxy
├── check-proxy/            # Kiểm tra proxy
├── countries/              # Danh sách quốc gia
├── docs/                   # API docs
├── get-dashboard-by-date/  # Dashboard theo ngày
├── login/                  # Login
├── me/                     # User info (POST /api/me)
├── partners/               # Đối tác
├── proxy-static/           # Proxy tĩnh
├── test-token/             # Test token validity
└── withdrawal-user/        # Rút tiền
```

### Path Aliases (tsconfig)

```
@/*        → src/*
@core/*    → src/@core/*
@layouts/* → src/@layouts/*
@menu/*    → src/@menu/*
@components/* → src/components/*
@configs/* → src/configs/*
@views/*   → src/views/*
@assets/*  → src/assets/*
```

---

## 3. Environment Variables

| Variable | Mục đích |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | API URL cho client (browser). Dev: `http://127.0.0.1:8002/api` |
| `API_URL` | API URL cho server (SSR/RSC). Thường giống `NEXT_PUBLIC_API_URL` |
| `NEXT_PUBLIC_APP_URL` | URL frontend — **chỉ cho SEO metadata**, KHÔNG dùng để fetch API |
| `NEXT_PUBLIC_APP_NAME` | Tên hiển thị của site (VD: `MKT Proxy`, `VN Proxy`) |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | Mô tả ngắn hiển thị trên SEO & header |
| `NEXT_PUBLIC_LOGO_PATH` | Đường dẫn logo (relative to `/public`) |
| `NEXT_PUBLIC_FAVICON_PATH` | Đường dẫn favicon |
| `NEXT_PUBLIC_API_DOCS_URL` | Base URL hiển thị trong trang tài liệu API |
| `NEXT_PUBLIC_SOCKET_URL` | URL WebSocket server |
| `NEXT_PUBLIC_PRIMARY_COLOR` | Màu chủ đạo (HEX). VD: `#FC4336` |
| `NEXT_PUBLIC_PRIMARY_HOVER` | Màu hover. VD: `#e63946` |
| `NEXT_PUBLIC_PRIMARY_GRADIENT` | Gradient chính. VD: `linear-gradient(45deg, #FC4336, #F88A4B)` |
| `NEXTAUTH_SECRET` | JWT secret cho NextAuth |
| `NEXTAUTH_BASEPATH` | Base path NextAuth |

> **Lưu ý quan trọng:** `NEXT_PUBLIC_APP_URL` là URL frontend, KHÔNG phải API. Tuyệt đối không dùng biến này để gọi API.

---

## 4. API Configuration

### Cấu trúc tập trung

Tất cả API URL được quản lý tại **`src/config/api.ts`**:

```typescript
export const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL!   // Client-side
export const SERVER_API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL!  // Server-side
```

### Luồng sử dụng

```
Client component  →  useAxiosAuth()  →  axiosInstance (src/libs/axios.ts)  →  PUBLIC_API_URL
Server component  →  fetch() với SERVER_API_URL  (từ src/config/api.ts)
```

### Quy tắc

- **Client-side:** Luôn dùng `useAxiosAuth()` (tự gắn token + auto-logout khi 401)
- **Server-side:** Import `SERVER_API_URL` từ `@/config/api`
- **KHÔNG** hardcode URL API trong bất kỳ file nào
- **KHÔNG** dùng `NEXT_PUBLIC_APP_URL` để gọi API

---

## 5. Multi-site & Branding

### Kiến trúc

Hệ thống hỗ trợ deploy nhiều site con (white-label) từ **cùng 1 source code**. Mỗi site chỉ khác nhau file `.env`.

```
Site mẹ (MKT Proxy)          Site con (VN Proxy)
├── .env.production           ├── .env.production    ← chỉ khác file này
├── src/ (giống nhau)         ├── src/ (giống nhau)
└── public/                   └── public/
    └── images/logo/              └── images/logo/   ← logo riêng
```

### siteConfig.ts

Tất cả thông tin branding được đọc từ env vars qua file `src/configs/siteConfig.ts`:

```typescript
export const siteConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'MKT Proxy',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://mktproxy.com',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '...',
  logo: process.env.NEXT_PUBLIC_LOGO_PATH || '/images/logo/Logo_MKT_Proxy.png',
  primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || '#FC4336',
  primaryHover: process.env.NEXT_PUBLIC_PRIMARY_HOVER || '#e63946',
  primaryGradient: process.env.NEXT_PUBLIC_PRIMARY_GRADIENT || '...',
  // ...
}
```

### CSS Variables

Màu sắc được inject vào CSS variables tại `layout.tsx`:

```
siteConfig.primaryHover   → --primary-hover
siteConfig.primaryGradient → --primary-gradient
```

CSS variables này ghi đè giá trị mặc định trong `css-variables.css`. Các component sử dụng `var(--primary-gradient)` sẽ tự động nhận màu mới.

### Tạo site con mới (Hướng dẫn Admin)

1. **Copy `.env.example`** → `.env.production`
2. **Sửa các giá trị**:
   - `NEXT_PUBLIC_APP_NAME` → Tên site mới
   - `NEXT_PUBLIC_APP_URL` → Domain site mới
   - `NEXT_PUBLIC_API_URL` → API URL (có thể trỏ về site mẹ hoặc API riêng)
   - `NEXT_PUBLIC_PRIMARY_COLOR` → Màu chủ đạo
   - `NEXT_PUBLIC_PRIMARY_HOVER` → Màu hover
   - `NEXT_PUBLIC_PRIMARY_GRADIENT` → Gradient chính
3. **Thay logo**: Đặt file logo vào `public/images/logo/`, cập nhật `NEXT_PUBLIC_LOGO_PATH`
4. **Deploy**: Build & deploy với file `.env.production` mới

### Tạo site con mới (Hướng dẫn Developer)

Site mẹ và site con chia sẻ cùng codebase. Khác biệt:

| | Site mẹ | Site con |
|---|---|---|
| **API** | Kết nối trực tiếp nhiều Partner (nguồn proxy) | Kết nối 1 nguồn (site mẹ hoặc partner ngoài) |
| **Backend** | Full DB, quản lý Partner, User, Order | Có thể dùng chung BE hoặc deploy BE riêng |
| **Frontend** | `.env` với branding site mẹ | `.env` với branding site con |

**Thêm nguồn proxy mới (Partner)**:
1. Tạo record trong bảng `partners` (Model: `Partner`)
2. Tạo ServiceType với `partner_id` trỏ đến partner mới
3. Implement logic gọi API partner trong `ProxyController`

---

## 6. Quản lý sản phẩm (ServiceType)

### Thiết kế Status

Mỗi sản phẩm (ServiceType) có 2 boolean độc lập:

| Field | Kiểu | Mô tả |
|---|---|---|
| `status` | enum(`active`, `inactive`) | Hiển thị trên listing hay không |
| `is_purchasable` | boolean (default: `true`) | Cho phép mua hay không |

**Ma trận hành vi**:

| status | is_purchasable | Kết quả |
|---|---|---|
| `active` | `true` | Hiển thị + mua được ✅ |
| `active` | `false` | Hiển thị + nút mua disabled ⚠️ |
| `inactive` | `true`/`false` | Ẩn hoàn toàn khỏi listing ❌ |

### Tags

Tags (`tag` field) là nhãn hiển thị thuần tuý, **KHÔNG ảnh hưởng logic mua/bán**:
- Ví dụ: `Bảo trì`, `Nhanh`, `Ổn định`, `Hot`, `Mới`
- Hiển thị dưới dạng chip/badge trên card
- Admin tự nhập, không giới hạn

### Note (Mô tả sản phẩm)

Field `note` chứa mô tả chi tiết. Trên card, mô tả hiển thị dạng **expandable**:
- Mặc định: truncate 2 dòng
- Click "Xem thêm" → hiện toàn bộ
- Click "Thu gọn" → thu lại 2 dòng

### Admin Form (Modal)

Admin quản lý ServiceType qua **modal** (không phải page riêng):
- Click "Thêm mới" hoặc "Sửa" → mở `ServiceFormModal`
- **Section 1 "Thông tin cơ bản"**: tên, loại, proxy type, IP version, protocols, quốc gia, 2 switch toggle (hiển thị + cho phép mua)
- **Section 2 "Tags & Mô tả"**: tag input, textarea mô tả
- **Section 3 "Cấu hình kỹ thuật"** (collapsed mặc định): partner, API endpoint, giá vốn, code, API body, multi inputs, bảng giá

---

## 7. Authentication Flow

### Kiến trúc 2 lớp

```
Request → middleware.ts (server-side, check JWT trước khi render)
       → useAxiosAuth interceptor (client-side, auto-logout khi API trả 401)
```

| Layer                  | Vai trò                              | Vị trí                        |
| ---------------------- | ------------------------------------ | ----------------------------- |
| `middleware.ts`        | Chặn route private khi chưa login    | Server-side, trước render     |
| `useAxiosAuth`         | Gắn Bearer token + logout khi 401   | Client-side, mỗi API call    |

### Chi tiết từng thành phần

**`middleware.ts`** — Route guard server-side:
- Check JWT token bằng `next-auth/jwt`
- Phân loại: private routes, admin routes, auth routes (login/register)
- Redirect về login nếu chưa auth, redirect về home nếu đã auth mà vào login

**`useAxiosAuth` (`src/hocs/useAxiosAuth.tsx`)** — Axios interceptor:
- Request interceptor: gắn `Authorization: Bearer <token>`
- Response interceptor: nhận 401 → `signOut()` tự động
- Tất cả hooks API đều dùng hook này thay vì `fetch()` trực tiếp

**`NextAuthProvider`** (`src/app/[lang]/layout.tsx`):
- `refetchInterval={5 * 60}` — refresh session mỗi 5 phút (KHÔNG đặt thấp hơn, sẽ gây lag)
- `refetchOnWindowFocus={true}`

**`useClientAuthGuard`** (`src/hooks/useClientAuthGuard.tsx`):
- Chỉ check `status` từ NextAuth, KHÔNG gọi thêm API
- Dùng cho `ClientAuthGuard` component (hiện loading/empty page khi chưa auth)

### Những thứ đã loại bỏ (không cần, gây thừa request)

- `GlobalSessionCleanup` — đã bỏ khỏi Providers, trùng chức năng với axios interceptor 401
- `fetch('/api/me')` trong useClientAuthGuard — thừa vì middleware + interceptor đã xử lý

---

## 8. Data Fetching Pattern

### Convention cho API hooks

Tất cả hooks API nằm trong `src/hooks/apis/`. Pattern chung:

```typescript
// src/hooks/apis/useExample.ts
import { useQuery } from '@tanstack/react-query'
import useAxiosAuth from '@/hocs/useAxiosAuth'

export const useExample = (params, enabled = true) => {
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['example', ...Object.values(params)],
    queryFn: async () => {
      const res = await axiosAuth.get('/endpoint', { params })
      return res.data
    },
    enabled,
  })
}
```

### Danh sách hooks hiện có

| Hook                           | Endpoint                  | Ghi chú                         |
| ------------------------------ | ------------------------- | -------------------------------- |
| `useDashboard`                 | `/admin/dashboard`        | Dashboard admin                  |
| `useDashboardMonthly`          | `/get-dashboard-by-date`  | Dashboard theo ngày              |
| `useAdminTransactionHistory`   | `/transaction-history`    | Giao dịch admin, server-side pagination |
| `useOrders`                    | `/transaction-history`    | Giao dịch user (client-side)    |
| `useHistoryOrders`             | `/history-order`          | Lịch sử đơn hàng                |
| `useBankQr`                    | `/pending-bank-qr`        | Polling QR nạp tiền             |
| `useDepositHistory`            | `/get-deponsit-history`   | Nạp tiền (admin: tất cả, user: của mình). Max 100 |
| `useDeleteDeposit`             | `/admin/bank-auto/delete` | Admin: soft-delete nạp tiền (mutation) |
| `useCountries`                 | `/countries`              | Danh sách quốc gia              |
| `useServiceType`               | `/service-type`           | Loại dịch vụ                    |
| `usePartners`                  | `/partners`               | Đối tác                         |
| `useCodeTransactions`          | `/code-transactions`      | Giao dịch mã code               |
| `useTransferName`              | `/transfer-name`          | Tên chuyển khoản                |
| `useUserOrders`                | `/user-orders`            | Đơn hàng user                   |

### Server-side Pagination

Khi dùng server-side pagination (ví dụ `useAdminTransactionHistory`):

```typescript
// Hook truyền params: page, per_page, search, status, date
// Table config:
manualPagination: true
pageCount: serverLastPage  // từ API response
```

Backend cần trả format Laravel paginate: `{ data: [], current_page, last_page, per_page, total }`

---

## 9. FE ↔ BE API Reference

### Backend Overview

- **Framework:** Laravel (PHP)
- **Base URL:** `https://api.mktproxy.com/api` (production) | `http://127.0.0.1:8002/api` (dev)
- **Auth:** JWT (`Authorization: Bearer <token>`) via `middleware: auth:api`
- **Admin check:** `role == 0` trong bảng `users`

### Database Tables chính

| Table         | Model      | Mô tả                            |
| ------------- | ---------- | --------------------------------- |
| `users`       | `User`     | Tài khoản, sodu (số dư), role    |
| `dongtien`    | `Dongtien` | Lịch sử giao dịch (mua/hoàn/nạp)|
| `bank_auto`   | `BankAuto` | Lịch sử nạp tiền (QR, webhook, manual) |
| `orders`      | `Order`    | Đơn hàng proxy                   |
| `api_keys`    | `ApiKey`   | Key proxy đã mua                 |

### API Endpoints — Mapping FE → BE

#### Deposit (Nạp tiền) — bảng `bank_auto`

| FE Hook | Method | BE Route | Controller | Mô tả |
|---------|--------|----------|------------|-------|
| `useDepositHistory` | GET | `/get-deponsit-history` | `UserController::deponsitHistory` | **Chung 1 API**: admin thấy tất cả, user thấy của mình. Max 100 bản ghi. Params: `page`, `per_page`, `status` |
| `useDeleteDeposit` | DELETE | `/admin/bank-auto/delete` | `BankQrController::adminDelete` | Admin: soft-delete 1 hoặc nhiều bản ghi (`{ ids: [1,2,3] }`) |
| — | POST | `/admin/bank-auto/{id}/credit` | `BankQrController::adminCredit` | Admin: cộng tiền thủ công |
| `useBankQr` | POST | `/create-bank-qr` | `BankQrController::store` | User: tạo QR nạp tiền |
| `useBankQr` | GET | `/pending-bank-qr` | `BankQrController::pending` | User: kiểm tra QR pending |
| — | DELETE | `/cancel-bank-qr/{id}` | `BankQrController::cancel` | User: hủy QR pending |

#### Transaction (Giao dịch) — bảng `dongtien`

| FE Hook | Method | BE Route | Controller | Mô tả |
|---------|--------|----------|------------|-------|
| `useAdminTransactionHistory` | GET | `/transaction-history` | `TransactionHistoryController::getTransactionHistory` | Tất cả giao dịch trừ NAPTIEN |
| `useOrders` | GET | `/transaction-history` | (giống trên) | Client-side pagination |
| — | POST | `/cancel-order/{id}` | `TransactionHistoryController::cancelOrder` | Hủy đơn failed + hoàn tiền |
| — | POST | `/resend-order/{id}` | `TransactionHistoryController::resendOrder` | Gửi lại đơn failed |

#### Dashboard & Report

| FE Hook | Method | BE Route | Controller |
|---------|--------|----------|------------|
| `useDashboard` | GET | `/admin/dashboard` | `DashboardController::getDashboard` |
| `useDashboardMonthly` | GET | `/get-dashboard-by-date` | `DashboardController::getDashboardByDate` |

#### Dongtien Types (bảng `dongtien.type`)

| Constant | Giá trị | Ý nghĩa |
|----------|---------|---------|
| `TYPE_NAPTIEN` | `NAPTIEN` | Nạp tiền tự động |
| `TYPE_NAPTIEN_PAY2S` | `NAPTIEN_PAY2S` | Nạp qua pay2s webhook |
| `TYPE_NAPTIEN_MANUAL` | `NAPTIEN_MANUAL` | Admin nạp thủ công |
| `TYPE_THANHTOAN` | `THANHTOAN` | Mua proxy v3 |
| `TYPE_THANHTOAN_V4` | `THANHTOAN_V4` | Mua proxy v4 |
| `TYPE_GIAHAN` | `GIAHAN` | Gia hạn v3 |
| `TYPE_GIAHAN_V4` | `GIAHAN_V4` | Gia hạn v4 |
| `TYPE_RUT_HOA_HONG_AFFILIATE` | `RUT_HOA_HONG_AFFILIATE` | Rút hoa hồng |

#### BankAuto Status (bảng `bank_auto.status`)

| Giá trị | Ý nghĩa |
|---------|---------|
| `pending` | Đang chờ thanh toán |
| `success` | Nạp thành công |
| `failed` | Nạp thất bại |
| `expired` | Hết hạn (chưa thanh toán) |
| `cancelled` | User đã hủy |

#### BankAuto Soft-Delete

Bảng `bank_auto` dùng soft-delete qua 2 cột:
- `is_deleted` (boolean) — `true` = đã xóa
- `deleted_by` (int) — ID user xóa

Model có **Global Scope** `notDeleted` tự động ẩn record đã xóa. Admin dùng `withoutGlobalScope('notDeleted')` để xem tất cả.

---

## 10. Routing & Middleware

### Ngôn ngữ hỗ trợ

`vi` | `en` | `cn` | `ko` | `ja` — URL format: `/{lang}/route`

### Phân loại route trong middleware

| Loại           | Routes                                                              | Xử lý                              |
| -------------- | ------------------------------------------------------------------- | ----------------------------------- |
| Private        | overview, order-proxy, history-order, affiliate, transaction-history, dashboard, admin | Redirect → login nếu chưa auth    |
| Admin          | admin/*                                                              | Check role = admin                  |
| Auth           | login, register                                                      | Redirect → home nếu đã auth        |
| Public         | Còn lại                                                              | Cho qua                            |

### Skip middleware

Static files (`/_next`, `.`), API routes (`/api`) được skip sớm để tối ưu performance.

---

## 11. Quy tắc khi phát triển

### Thêm API hook mới

1. Tạo file trong `src/hooks/apis/`
2. Dùng `useAxiosAuth()`, KHÔNG dùng `fetch()` trực tiếp
3. QueryKey phải unique và chứa đủ params để cache đúng
4. Export interface cho params nếu cần

### Thêm route mới

1. Tạo thư mục trong `app/[lang]/(private)/(client)/` hoặc `(public)/`
2. Nếu cần auth → thêm route name vào `privateRoutesSet` trong `middleware.ts`
3. Nếu là admin → thêm vào cả `adminRoutesSet`
4. Tạo view component trong `src/views/Client/`

### Thêm component mới

- Shared/reusable → `src/components/`
- Chỉ dùng cho 1 page → `src/views/Client/{Feature}/`
- Form inputs → `src/components/form/`
- Modals → `src/components/modals/`

### Lưu ý performance

- `NextAuthProvider refetchInterval` phải >= 300 (5 phút). Thấp hơn sẽ gây re-render liên tục → page đơ
- Không tạo thêm layer check session ngoài middleware + useAxiosAuth
- Dùng debounce cho search inputs (400ms)
- Server-side pagination cho table > 50 rows

### BE: Field `proxys` vs `api_key` trong ApiKey

Bảng `api_keys` có 2 field quan trọng liên quan proxy data:

| Field | Dùng cho | Nội dung | Processors |
|-------|----------|----------|------------|
| `proxys` | Proxy tĩnh (static) + phần lớn proxy xoay | JSON chứa `IP:port:user:pass` | HomeProxy, ZingProxy, MktProxy, UpProxy |
| `api_key` | Proxy xoay ProxyVN | Key xoay từ partner (VD: `"keyxoay"`) | ProxyVnRotatingProcessor |

**Tại sao khác nhau?**
- Đa số partner trả về `IP:port:user:pass` cố định → lưu vào `proxys`
- ProxyVN rotating trả về 1 **key xoay** (dùng key này để rotate IP tự động) → ghi đè vào `api_key`

**Khi retry partial (mua bù):**
- Processors check `empty($k->proxys)` để tìm ApiKey chưa có proxy
- Riêng `ProxyVnRotatingProcessor` check `empty($k->api_key)` vì dữ liệu nằm ở field khác

**Lưu ý khi thêm partner mới:**
- Nếu partner trả IP:port:user:pass → lưu vào `proxys`, check `proxys` khi retry
- Nếu partner trả rotating key → lưu vào `api_key`, check `api_key` khi retry

### BE: `failOrderWithRefund` vs `handleProcessorFailure`

Hai hàm xử lý order fail với retry logic giống nhau (retry 3 lần → FAILED + Telegram), nhưng **caller khác nhau**:

| Hàm | Nằm ở | Gọi bởi | Khi nào chạy |
|-----|-------|---------|-------------|
| `failOrderWithRefund()` | `BasePartner` | Processor (trong `processOrder()`) | Processor **tự bắt lỗi** và gọi hàm này |
| `handleProcessorFailure()` | `PlaceOrder` command | PlaceOrder worker | **Safety net** — chỉ chạy khi processor fail mà **chưa tự update status** |

**Flow:**
1. PlaceOrder gọi `$processor->processOrder($order)`
2. Nếu processor gặp lỗi → processor gọi `failOrderWithRefund()` → set PENDING/FAILED → return `['success' => false]`
3. PlaceOrder nhận `success=false` → check `$order->status !== PROCESSING`
   - Nếu TRUE (processor đã xử lý) → **không làm gì thêm**
   - Nếu FALSE (processor crash giữa chừng, chưa update status) → gọi `handleProcessorFailure()` làm safety net

**TODO:** Cân nhắc gộp 2 hàm nếu logic phức tạp hơn trong tương lai. Hiện tại giữ tách vì caller context khác nhau.

---

## 12. Changelog - Các vấn đề đã sửa

### 28/02/2026

#### 12.1 Fix CORS — Dashboard fetch sai URL

**Vấn đề:** `useDashboard.ts` dùng `fetch()` với `NEXT_PUBLIC_APP_URL` (https://mktproxy.com) → CORS error vì gọi frontend URL thay vì API URL.

**Sửa:** Chuyển cả `useDashboard` và `useDashboardMonthly` sang dùng `useAxiosAuth()`.

**Files:** `src/hooks/apis/useDashboard.ts`

---

#### 12.2 Tập trung API URL config

**Vấn đề:** Hardcoded fallback `https://api.minhan.online/api` rải rác nhiều file → production có thể dùng URL cũ sai.

**Sửa:** Tạo `src/config/api.ts` export `PUBLIC_API_URL` và `SERVER_API_URL`. Tất cả file import từ đây.

**Files:** `src/config/api.ts` (mới), `src/libs/axios.ts`, `src/utils/serverSessionValidation.ts`, `src/app/[lang]/(private)/(client)/overview/page.tsx`

---

#### 12.3 Admin Transaction History — Server-side pagination

**Vấn đề:** Trang admin dùng `useOrders()` không truyền params → không phân trang, không filter, thiếu cột thông tin.

**Sửa:**
- Tạo hook `useAdminTransactionHistory` với params: `page`, `per_page`, `search`, `status`, `date`
- Table dùng `manualPagination: true`
- Thêm cột: Số trước (`sotientruoc`), Số sau (`sotiensau`)
- Page size mặc định 100, options: 50/100/200/500
- Search debounce 400ms

**Files:** `src/hooks/apis/useAdminTransactionHistory.ts` (mới), `src/views/Client/Admin/TransactionHistory/TableTransactionHistory.tsx`

**Lưu ý:** Backend cần hỗ trợ params `page`, `per_page`, `search`, `status`, `date` trên `GET /transaction-history` và trả format Laravel paginate.

---

#### 12.4 Fix page đơ cứng (freeze)

**Vấn đề:** `NextAuthProvider refetchInterval={10}` (10 giây) → session refetch liên tục → re-render toàn app.

**Sửa:** `refetchInterval={5 * 60}` (5 phút).

**Files:** `src/app/[lang]/layout.tsx`

---

#### 12.5 Loại bỏ session check trùng lặp

**Vấn đề:** 4 nơi cùng validate session (middleware, NextAuth refetch, GlobalSessionCleanup, useClientAuthGuard) → mỗi 10 giây bắn 2-3 request `/api/me` thừa.

**Sửa:**
- **Bỏ** `GlobalSessionCleanup` khỏi `Providers.tsx` (trùng chức năng với axios interceptor 401)
- **Sửa** `useClientAuthGuard`: bỏ `fetch('/api/me')`, chỉ check `status` từ NextAuth. Dependency `[status]` thay vì `[session, status, router, pathname]`

**Giữ lại 2 layer đủ dùng:**
- `middleware.ts` → bảo vệ route server-side
- `useAxiosAuth` interceptor → auto-logout khi API trả 401

**Files:** `src/components/Providers.tsx`, `src/hooks/useClientAuthGuard.tsx`

---

#### 12.6 Deposit History — Gộp 1 API, phân quyền + xóa đơn/nhiều

**Vấn đề:** Trang deposit-history dùng API riêng cho admin và user, admin không có tính năng xóa.

**Sửa:**
- **BE:** Sửa `UserController::deponsitHistory()` thành 1 API chung:
  - Admin (role == 0): thấy tất cả bản ghi (kể cả đã xóa)
  - User: chỉ thấy của mình, is_deleted = 0
  - Server-side pagination, mặc định 100, **tối đa 100** bản ghi
  - Params: `page`, `per_page`, `status`
- **BE:** Thêm `DELETE /admin/bank-auto/delete` cho admin xóa đơn/nhiều (soft-delete)
- **FE:** Cập nhật `useDepositHistory` hỗ trợ params pagination + tạo `useDeleteDeposit` mutation
- **FE:** Cập nhật `TableDepositHistory.tsx`: server-side pagination, checkbox, xóa đơn/nhiều, cột User

**Files:**
- BE: `app/Http/Controllers/Api/UserController.php`, `app/Http/Controllers/Api/BankQrController.php`, `routes/api.php`
- FE: `src/hooks/apis/useDeponsitHistory.ts`, `src/views/Client/Admin/DepositHistory/TableDepositHistory.tsx`

---

#### 12.7 Fix Transaction History crash trình duyệt — BE pagination + FE tối ưu

**Vấn đề:** `GET /transaction-history` dùng `->get()` lấy **tất cả** records không phân trang → JSON response cực lớn → browser crash ("Ôi hỏng"). FE gửi params `page`, `per_page` nhưng BE bỏ qua hoàn toàn.

**Sửa BE:**
- `TransactionHistoryController::getTransactionHistory()`: thay `->get()` bằng `->paginate()`. Mặc định 50, tối đa 100.
- Thêm filter server-side: `search` (tên/email user, nội dung), `status` (order status), `type` (loại giao dịch)
- Eager load chỉ cột cần thiết: `User:id,name,email`, `order:id,order_code,status,total_amount,note`
- Cũng sửa `getDepositHistory()` tương tự (cùng vấn đề `->get()`)

**Sửa FE:**
- Bỏ debounce tự động → chuyển sang **bấm nút Search / Enter** để tìm (tránh gọi API khi gõ)
- Giảm page size options: 20/50/100 (bỏ 200/500 — vô nghĩa khi BE cap 100)
- `staleTime: 30s` thay vì `0` — tránh re-fetch không cần thiết
- `refetchOnWindowFocus: false` — không re-fetch khi quay lại tab
- Bỏ unused imports, đơn giản hóa table (bỏ client-side filter/sort không dùng)
- UX: placeholder "Tên hoặc email user..." thay vì "Nhập user...", label "Tất cả trạng thái" thay vì "Chọn trạng thái"

**Files:**
- BE: `app/Http/Controllers/Api/TransactionHistoryController.php`
- FE: `src/hooks/apis/useAdminTransactionHistory.ts`, `src/views/Client/Admin/TransactionHistory/TableTransactionHistory.tsx`

---

### 08/03/2026

#### 12.8 Tối ưu Admin — Table search/filter + Polish form modal

**Vấn đề:**
1. Table Service List: giá ẩn trong hover, không có tìm kiếm/lọc
2. ServiceFormModal: UI flat, section headers plain text, thiếu visual grouping

**Sửa Table:**
- Bỏ `getRowTooltipContent()` và `<Tooltip>` wrapper trên rows
- Thêm cột **Giá bán** (Ngày/Tuần/Tháng) + cột **Tag** (pill style)
- Thêm **Search bar** + **Filter chips** (Tĩnh/Xoay, Active/Inactive)

**Sửa Form Modal:**
- Wrap sections trong card containers (bg #fafbfc, rounded, border)
- Section headers thêm icon badge màu (Info, Zap, Tag)
- Toggle switches trong white card, submit button brand gradient
- Di chuyển Tags từ section riêng vào Section 1 (cùng protocols)
- Bỏ RichTextEditor → thay bằng plain textarea (maxLength 500 ký tự) gộp vào Section 1
- Xóa Section "Mô tả sản phẩm" (không cần thiết)
- Bỏ `renderNote()` expandable trong preview, giữ `renderNotePreview()` ngắn dưới tên

**Sửa Client Cards:**
- Bỏ expandable "Ghi chú sản phẩm" (note-info-box) khỏi ProxyCard + PlanCard
- Giữ note preview text ngắn dưới tên sản phẩm
- Xóa unused imports: `ChevronDown`, `Info`, `sanitizeHtml`

**Files:**
- `src/views/Client/Admin/ServiceType/TableServiceType.tsx`
- `src/views/Client/Admin/ServiceType/ServiceFormModal.tsx`
- `src/app/[lang]/(private)/(client)/components/proxy-card/ProxyCard.tsx`
- `src/views/Client/RotatingProxy/RotatingProxyPage.tsx`

#### 12.8 Bỏ pagination, tối ưu query + polling + redesign search UI

**Vấn đề 1:** BE dùng `->paginate()` chạy `COUNT(*)` toàn bộ bảng chỉ để phân trang. Với mặc định 100 records, không cần đếm tổng — chỉ lấy 100 giao dịch gần nhất là đủ.

**Sửa BE:** Thay `->paginate($perPage)` bằng `->take($limit)->get()` cho:
- `TransactionHistoryController::getTransactionHistory()` — response chỉ còn `{ success, data }`
- `TransactionHistoryController::getDepositHistory()` — tương tự
- `UserController::deponsitHistory()` — tương tự
- Tham số đổi từ `per_page` sang `limit`, mặc định 100, tối đa 100

**Vấn đề 2:** `usePendingBankQr` poll mỗi 5s trên **mọi trang** (qua NavbarContent). 100 users = 1200 request/phút lãng phí.

**Sửa FE:** Smart conditional polling trong `useBankQr.ts`:
- Thêm param `activePolling` (mặc định `false`)
- `activePolling=true` (trang nạp tiền): poll 5s khi có pending, 60s khi không
- `activePolling=false` (navbar): poll 30s khi có pending, 60s khi không
- `staleTime: 10s` thay vì `0` — tránh duplicate request

**Vấn đề 3:** Search UI chật, thiếu trực quan.

**Sửa FE:** Redesign search bar:
- Tách search/filter ra dòng riêng bên dưới title (không ép chung header)
- Search input rộng hơn, placeholder rõ: "Tìm theo tên, email hoặc nội dung..."
- Nút "Tìm" có label text thay vì chỉ icon
- Nút "Xóa bộ lọc" hiện khi có filter active
- Bỏ hoàn toàn pagination — footer chỉ hiển thị "Hiển thị X giao dịch gần nhất"
- Khi search không có kết quả: "Không tìm thấy giao dịch phù hợp"

**Files:**
- BE: `TransactionHistoryController.php`, `UserController.php`
- FE: `useAdminTransactionHistory.ts`, `useDeponsitHistory.ts`, `useBankQr.ts`
- FE: `TableTransactionHistory.tsx`, `TableDepositHistory.tsx`, `NavbarContent.tsx` (không đổi, dùng default passive polling)

---

### 02/03/2026

#### 12.9 Fix bảo mật & data integrity cho flow mua proxy

**Vấn đề:**
1. Response 500 lộ stacktrace (file, line, trace) → lỗ hổng bảo mật
2. Race condition trừ tiền: 2 request đồng thời có thể vượt quá số dư
3. Order/ApiKey/Dongtien tạo ngoài transaction → nếu lỗi giữa chừng, data bất nhất
4. MktProxyPartner: `cost_price = $setupTime` (số ngày thay vì giá vốn)
5. Thiếu `exists` validation cho `serviceTypeId` trong buyProxyRotate

**Sửa:**
- Xóa stacktrace khỏi 4 catch blocks trong ProxyController, chỉ trả "Internal Server Error"
- Wrap toàn bộ (lockForUpdate → check balance → Order → ApiKey → debit → Dongtien) trong 1 DB::transaction với pessimistic lock theo pattern DepositService
- Fix `cost_price => $priceCost` ở MktProxyPartner
- Thêm `exists:type_services,id` validation cho serviceTypeId
- Telegram/Redis giữ ngoài transaction (tránh giữ DB lock lâu)

**Files:**
- `BE/app/Http/Controllers/Api/ProxyController.php`
- `BE/app/Services/Partners/ProxyVn/ProxyVNPartner.php`
- `BE/app/Services/Partners/HomeProxy/HomeProxyPartner.php`
- `BE/app/Services/Partners/MktProxy/MktProxyPartner.php`
- `BE/app/Services/Partners/ZingProxy/ZingProxyPartner.php`
- `BE/app/Services/Partners/ProxyVn/ProxyVNStaticPartner.php`
- `BE/app/Services/Partners/HomeProxy/HomeProxyStaticPartner.php`
- `BE/app/Services/Partners/Upproxy/UpproxyStaticPartner.php`
- `BE/app/Services/Partners/Upproxy/UpproxyPartner.php`

### 02/03/2026

#### 12.10 Chuyển Telegram notification sang queue (async)

**Vấn đề:**
- Gọi Telegram API đồng bộ trong API mua proxy → chậm response, nếu Telegram timeout thì ảnh hưởng UX

**Sửa:**
- Tạo job `SendTelegramNotification` (queue: `notifications`, tries: 3, backoff: 10s)
- Thay toàn bộ `TelegramHelper` bằng `SendTelegramNotification::dispatch()` trong 14 files (8 partner buy + BasePartner + 5 OrderProcessors)
- Job hỗ trợ 3 method: `system`, `naptien`, `error` (map sang 3 hàm TelegramHelper)
- Partner buy files: dispatch trong try-catch (non-critical, không block response)
- BasePartner/OrderProcessors: dispatch giữ nguyên vị trí trong catch blocks hiện có
- Cần cấu hình `.env`: `QUEUE_DRIVER=redis` và chạy supervisor worker cho queue `notifications`
- File supervisor config: `BE/supervisors/notifications-worker.conf`

**Files:**
- `BE/app/Jobs/SendTelegramNotification.php` (mới)
- `BE/supervisors/notifications-worker.conf` (mới)
- `BE/app/Services/Partners/ProxyVn/ProxyVNPartner.php`
- `BE/app/Services/Partners/HomeProxy/HomeProxyPartner.php`
- `BE/app/Services/Partners/MktProxy/MktProxyPartner.php`
- `BE/app/Services/Partners/ZingProxy/ZingProxyPartner.php`
- `BE/app/Services/Partners/ProxyVn/ProxyVNStaticPartner.php`
- `BE/app/Services/Partners/HomeProxy/HomeProxyStaticPartner.php`
- `BE/app/Services/Partners/Upproxy/UpproxyStaticPartner.php`
- `BE/app/Services/Partners/Upproxy/UpproxyPartner.php`
- `BE/app/Services/Partners/BasePartner.php`
- `BE/app/Services/Partners/OrderProcessors/HomeProxyStaticProcessor.php`
- `BE/app/Services/Partners/OrderProcessors/MktProxyRotatingProcessor.php`
- `BE/app/Services/Partners/OrderProcessors/ZingProxyRotatingProcessor.php`
- `BE/app/Services/Partners/OrderProcessors/ProxyVnRotatingProcessor.php`
- `BE/app/Services/Partners/OrderProcessors/UpProxyStaticProcessor.php`

#### 12.11 Fix bug logic hàm buy() partner + validation controller

**Vấn đề:**
- `$pricePerUnit = null` khi không tìm thấy giá trong `price_by_duration` → `$total = 0` → đơn hàng miễn phí
- `$setupTime` undefined variable nếu `$dataBody['time']` không tồn tại (MktProxy, ZingProxy, HomeProxy, ProxyVN)
- Thiếu `max` validation cho `quantity` → có thể gửi quantity rất lớn, lock DB lâu
- ProxyVN & Upproxy rotating: ApiKey `quantity` = tổng đơn hàng thay vì 1, thiếu field `api_key`
- `$priceCost` null gây warning khi nhân với quantity

**Sửa:**
- Thêm check `$pricePerUnit === null || $pricePerUnit <= 0` trước khi tính `$total` (7 partner files)
- Khởi tạo `$setupTime = $dataBody['time'] ?? null` + check early return (4 rotating partners)
- Thêm `max:2000` vào validation `quantity` (4 methods trong controller)
- Fix `quantity => 1` + thêm `api_key` cho ProxyVN & Upproxy rotating
- Dùng `($priceCost ?? 0)` để tránh null warning

**Files:**
- `BE/app/Http/Controllers/Api/ProxyController.php`
- `BE/app/Services/Partners/ProxyVn/ProxyVNPartner.php`
- `BE/app/Services/Partners/HomeProxy/HomeProxyPartner.php`
- `BE/app/Services/Partners/MktProxy/MktProxyPartner.php`
- `BE/app/Services/Partners/ZingProxy/ZingProxyPartner.php`
- `BE/app/Services/Partners/ProxyVn/ProxyVNStaticPartner.php`
- `BE/app/Services/Partners/HomeProxy/HomeProxyStaticPartner.php`
- `BE/app/Services/Partners/Upproxy/UpproxyStaticPartner.php`
- `BE/app/Services/Partners/Upproxy/UpproxyPartner.php`

#### 12.12 Chuyển API response messages sang tiếng Anh

**Vấn đề:** Các message trả về cho user đang bằng tiếng Việt, không phù hợp với API public.

**Sửa:** Chuyển toàn bộ `'message'` trong response array sang tiếng Anh:
- Partners (8 files): "Số dư không đủ" → "Insufficient balance. Please top up.", "Token không tồn tại" → "Token not found.", etc.
- ProxyController: "Lấy dữ liệu thành công" → "Data retrieved successfully.", cooldown messages, validation messages
- OrderProcessors (6 files): "Template body không hợp lệ" → "Invalid template body", "Thiếu ApiKey" → "Missing ApiKey", etc.

**Lưu ý:** Chỉ đổi message trong response trả về client. Log nội bộ và Telegram vẫn giữ tiếng Việt.

**Files:**
- `BE/app/Http/Controllers/Api/ProxyController.php`
- `BE/app/Services/Partners/` (8 partner files)
- `BE/app/Services/Partners/OrderProcessors/` (6 processor files)

#### 12.13 Refactor Order Queue: Anti-duplicate + Retry + Multi-worker

**Vấn đề:**
- `OrderHelper::saveOrderToRedis` push full JSON → duplicate processing
- Retry logic dead code (`$newRetry < 1` luôn FALSE)
- 2 hàm `failOrderWithRefund` xung đột (PlaceOrder vs BasePartner)
- Latency 5 phút (FetchPendingOrders cron)
- Không có processing lock → nguy hiểm khi numprocs > 1
- Processors: thiếu DB::transaction, markOrderSuccess sai vị trí, JSON validation bug

**Sửa:**
- **3 lớp lock**: Enqueue lock (TTL 90s) + Processing lock (TTL 600s) + Status check (DB WHERE status=PENDING)
- **OrderHelper**: Push chỉ order ID, thêm enqueue lock chống duplicate
- **FetchPendingOrders**: Cron 1 phút, recover order kẹt PROCESSING > 10 phút, filter retry < 3
- **PlaceOrder**: Thêm processing lock, bỏ failOrderWithRefund riêng, thêm safety net handleProcessorFailure, bỏ emitSocketUpdate
- **BasePartner**: Fix retry 3 lần (was dead code), thêm Telegram khi FAILED, bỏ methods thừa
- **6 Processors**: Thống nhất error handling (failOrderWithRefund), wrap DB::transaction, fix markOrderSuccess position, fix JSON validation bug
- **Supervisor**: numprocs=3 (an toàn nhờ processing lock)

**Files:**
- `BE/app/Helpers/OrderHelper.php`
- `BE/app/Console/Commands/FetchPendingOrders.php`
- `BE/app/Console/Commands/PlaceOrder.php`
- `BE/app/Console/Kernel.php`
- `BE/app/Services/Partners/BasePartner.php`
- `BE/app/Services/Partners/OrderProcessors/` (6 processor files)
- `BE/supervisors/orders-partner.conf`

#### 12.14 Fix bugs tiềm ẩn trong order flow (review lần 2)

**Vấn đề:**
1. **CRITICAL**: FetchPendingOrders race condition — ghi đè IN_USE thành PENDING khi recover
2. **CRITICAL**: HomeProxy double order ở đối tác khi retry (2-step flow không idempotent)
3. **HIGH**: ProxyVn sleep() trong DB::transaction giữ lock hàng chục giây
4. **HIGH**: HomeProxyRotating thiếu DB::transaction, partial update khi crash
5. **HIGH**: HomeProxyStatic config error throw → retry vô nghĩa 3 lần
6. **MEDIUM**: HomeProxyRotating $dataKey undefined nếu time không phải 1/7/30
7. **MEDIUM**: UpProxy null access nếu JSON decode fail
8. **MEDIUM**: Telegram exception chặn Redis push trong 7 buy() methods
9. **MEDIUM**: HomeProxyRotating getOrderByOrderId không retry

**Sửa:**
- FetchPendingOrders: thêm `WHERE status=PROCESSING` vào update tránh race condition
- HomeProxy processors: lưu `id_order_partner` ngay sau step 1, skip step 1 khi retry (idempotency)
- BasePartner: thêm `getExistingPartnerOrderId()` helper
- ProxyVn: bỏ sleep(1) trong transaction
- HomeProxyRotating: wrap loop trong DB::transaction, dùng match() + validation cho time, thêm retry 5 lần cho getOrderByOrderId
- HomeProxyStatic: đổi throw → return cho config error, bỏ dead code
- UpProxy: thêm null check trước access `$data['statusCode']`
- 7 buy() files: tách Redis push và Telegram thành try-catch riêng, Redis push trước

**Files:**
- `BE/app/Console/Commands/FetchPendingOrders.php`
- `BE/app/Services/Partners/BasePartner.php`
- `BE/app/Services/Partners/OrderProcessors/HomeProxyStaticProcessor.php`
- `BE/app/Services/Partners/OrderProcessors/HomeProxyRotatingProcessor.php`
- `BE/app/Services/Partners/OrderProcessors/ProxyVnRotatingProcessor.php`
- `BE/app/Services/Partners/OrderProcessors/UpProxyStaticProcessor.php`
- `BE/app/Services/Partners/*/` (7 buy partner files)

#### 12.15 Redesign Order Status System + delivered_quantity

**Vấn đề:**
- `partial_completed` (3) dùng sai nghĩa — thực chất là "mua thiếu" chứ không phải "hoàn 1 phần"
- `completed` (4) thực chất là "hết hạn" → tên sai
- Thiếu trạng thái: `waiting_refund`, `refunded_all`, `partial_refunded`
- Cột `status` là VARCHAR(20) → nặng index
- Không track được số proxy thực tế nhận vs đặt

**Sửa:**
- **9 trạng thái mới** (giá trị integer giữ nguyên, FE không ảnh hưởng):
  - 0=pending, 1=processing, 2=in_use, 3=in_use_partial (mua thiếu), 4=expired (hết hạn), 5=failed, 6=partial_refunded, 7=waiting_refund, 8=refunded_all
- **STATUS_TEXT_MAP** giữ tên cũ cho API backward compatibility (3→'partial_completed', 4→'completed')
- **delivered_quantity** (SMALLINT UNSIGNED nullable): track số proxy thực tế nhận được
- **Migration**: data migrate status 6→4, string→int, thêm delivered_quantity, backfill, drop redundant index, VARCHAR→TINYINT
- **BasePartner**: `finalizeOrder()` set `in_use_partial` + `delivered_quantity`, `markOrderSuccess()` set `delivered_quantity = quantity`
- **CheckProxyStatus**: fix BUG — check cả `in_use` VÀ `in_use_partial` cho expiry
- **Đổi tên references**: `completed→expired`, `canceled→waiting_refund`, `partial_completed→in_use_partial` toàn bộ BE
- Xóa 2 relationship sai trong Order model (`type_service`, `api_key`)

**Files:**
- `BE/database/migrations/2026_03_03_000000_change_orders_status_to_tinyint.php`
- `BE/app/Models/MySql/Order.php`
- `BE/app/Services/Partners/BasePartner.php`
- `BE/app/Console/Commands/CheckProxyStatus.php`
- `BE/app/Models/Mongo/OrderLog.php`
- `BE/app/Http/Controllers/Api/TransactionHistoryController.php`
- `BE/app/Http/Controllers/Api/DashboardController.php`
- `BE/app/Http/Controllers/Api/AffiliateController.php`
- `BE/app/Http/Controllers/Admin/AffiliateController.php`
- `BE/app/Console/Commands/OrderStatistics.php`
- `BE/app/Console/Commands/RealtimeStatistics.php`
- `BE/app/Console/Commands/PlaceOrderTest.php`
- `BE/app/Services/StatisticsService.php`
- `BE/resources/views/admin/order_v6/index.blade.php`

#### 12.16 Tạo BE/DEVELOPER-GUIDE.md

**Mô tả:** Tạo developer guide riêng cho BE, ghi lại toàn bộ quy trình nghiệp vụ, domain knowledge (resell proxy vs sell proxy), order status system, partner system, payment flow, affiliate, thống kê. Liên kết với FE guide.

**Files:** `BE/DEVELOPER-GUIDE.md`

#### 12.17 Bug #9: Hệ thống ticket hỗ trợ + Xử lý đơn thiếu proxy

**Vấn đề:** Order `in_use_partial` có proxy thiếu nhưng không có cơ chế mua bù, báo admin, hoặc hoàn tiền phần thiếu.

**Sửa:**
- Tạo bảng `support_tickets` + model `SupportTicket` (auto ticket_code)
- `BasePartner::finalizeOrder()` tự tạo ticket khi `in_use_partial`
- Admin endpoints: xem ticket, xem partial orders, retry mua bù, hoàn tiền phần thiếu
- User endpoints: tạo ticket, xem ticket của mình
- Status `partial_refunded` (6) = order vẫn active, proxy vẫn chạy, đã hoàn phần thiếu
- `CheckProxyStatus` thêm `partial_refunded` vào check hết hạn
- 6 processors: skip filled ApiKeys khi retry, chỉ mua cho ApiKey chưa có proxy
- Hoàn tiền tạo Dongtien type=REFUND, auto-resolve ticket liên quan

**Files:**
- `BE/database/migrations/2026_03_03_000001_create_support_tickets_table.php` (mới)
- `BE/app/Models/MySql/SupportTicket.php` (mới)
- `BE/app/Http/Controllers/Api/SupportTicketController.php` (mới)
- `BE/routes/api.php`
- `BE/app/Services/Partners/BasePartner.php`
- `BE/app/Console/Commands/CheckProxyStatus.php`
- 6 processors: MktProxy, HomeProxyRotating/Static, ProxyVn, UpProxy, ZingProxy

### 03/03/2026

#### 12.18 Fix token refresh logic — tránh logout bất ngờ

**Vấn đề:**
- Axios gặp 401 → signOut ngay, không thử refresh trước → user bị logout bất ngờ
- Error string mismatch: `auth.ts` set `'RefreshAccessTokenError'` nhưng client check `'TokenExpiredError'` → refresh failure không bao giờ được detect
- Không có buffer time → token hết hạn giữa chừng gây request fail
- `refetchInterval=15min` quá dài so với token TTL
- 2 file `SessionCleanup` orphaned (không mount ở đâu)

**Sửa:**
- `auth.ts`: đổi error string → `'TokenExpiredError'`, thêm buffer 60s trước khi hết hạn
- `axios.ts`: gặp 401 → gọi `_onRefresh()` (NextAuth update) → retry 1 lần → fail mới signOut. Dedup bằng `_isRefreshing` flag
- `useAxiosAuth.tsx`: wire `setOnRefresh()` dùng NextAuth `update()` để trigger server-side JWT refresh
- `layout.tsx`: giảm `refetchInterval` từ 15 phút → 4 phút
- Xóa `GlobalSessionCleanup.tsx` + `SessionCleanup.tsx` (orphaned)

**Files:**
- `FE/src/libs/auth.ts`
- `FE/src/libs/axios.ts`
- `FE/src/hocs/useAxiosAuth.tsx`
- `FE/src/app/[lang]/layout.tsx`
- `FE/src/components/GlobalSessionCleanup.tsx` (xóa)
- `FE/src/app/[lang]/(private)/(client)/components/SessionCleanup.tsx` (xóa)

### 04/03/2026

#### 12.19 FE: Giao diện Ticket hỗ trợ + Quản lý đơn thiếu proxy

**Mô tả:** Tạo giao diện FE cho hệ thống support ticket (user tạo ticket, xem trạng thái) và admin quản lý (resolve ticket, xem đơn thiếu proxy, retry/refund).

**Sửa:**
- Constants: `TICKET_STATUS`, `TICKET_STATUS_LABELS`, `TICKET_STATUS_COLORS`, `TICKET_TYPES`, `TICKET_TYPE_LABELS`
- 7 API hooks: `useMyTickets`, `useCreateTicket`, `useAdminTickets`, `usePartialOrders`, `useRetryPartial`, `useRefundPartial`, `useResolveTicket`
- User: trang "Hỗ trợ" — danh sách ticket (TanStack table), tạo ticket (Dialog + form), xem chi tiết (admin note, ai xử lý, khi nào)
- Admin: trang "Tickets hỗ trợ" — filters (status, type), resolve ticket (nhập note, đổi status)
- Admin: trang "Đơn thiếu proxy" — danh sách partial orders, retry mua bù, refund hoàn tiền
- Menu: thêm "Hỗ trợ" (user) + "Tickets hỗ trợ" + "Đơn thiếu proxy" (admin)

**Files:**
- `FE/src/constants/ticketStatus.ts` (mới)
- `FE/src/hooks/apis/useTickets.ts` (mới)
- `FE/src/views/Client/SupportTickets/TicketsPage.tsx` (mới)
- `FE/src/views/Client/SupportTickets/CreateTicketDialog.tsx` (mới)
- `FE/src/views/Client/SupportTickets/TicketDetailDialog.tsx` (mới)
- `FE/src/views/Client/Admin/SupportTickets/AdminTicketsPage.tsx` (mới)
- `FE/src/views/Client/Admin/SupportTickets/ResolveTicketDialog.tsx` (mới)
- `FE/src/views/Client/Admin/PartialOrders/PartialOrdersPage.tsx` (mới)
- `FE/src/app/[lang]/(private)/(client)/support-tickets/page.tsx` (mới)
- `FE/src/app/[lang]/(private)/(client)/admin/support-tickets/page.tsx` (mới)
- `FE/src/app/[lang]/(private)/(client)/admin/partial-orders/page.tsx` (mới)
- `FE/src/constants/index.ts` (sửa — export ticketStatus)
- `FE/src/components/layout/vertical/VerticalMenu.tsx` (sửa — thêm menu items)

#### 12.20 Fix dropdown đơn hàng trong CreateTicketDialog

**Vấn đề:** Dropdown chọn đơn hàng khi tạo ticket hiển thị quá ít thông tin, value type mismatch (number vs string) khiến không chọn được.

**Sửa:**
- Fix value type: dùng `String(order.id)` thống nhất
- Dropdown hiện chi tiết: order_code, số lượng, ngày mua, trạng thái (Chip màu)
- Thêm card chi tiết đơn hàng đã chọn: hiển thị thiếu bao nhiêu proxy, giá, thời hạn
- TicketDetailDialog + ResolveTicketDialog: thêm Chip trạng thái đơn, hiển thị proxy thiếu

**Files:**
- `FE/src/views/Client/SupportTickets/CreateTicketDialog.tsx`
- `FE/src/views/Client/SupportTickets/TicketDetailDialog.tsx`
- `FE/src/views/Client/Admin/SupportTickets/ResolveTicketDialog.tsx`

#### 12.21 Nâng cấp hệ thống Ticket — Phase 2 (Tracking + Telegram + Overdue)

**Vấn đề:** Thiếu tracking ai xử lý/giao cho ai, admin detail view bị hỏng (`open={false}`), không có thông báo Telegram khi tạo/resolve ticket, không cảnh báo ticket quá hạn.

**Sửa:**
- **BE:** Migration thêm 4 cột tracking (`assigned_to`, `processing_by`, `processing_at`, `overdue_notified_at`)
- **BE:** Model thêm 3 relationships (`resolvedByUser`, `assignedToUser`, `processingByUser`)
- **BE:** Controller: eager-load tracking relations, Telegram khi tạo/resolve, 2 endpoints mới (`updateStatus`, `assignTicket`), fix `refundPartialOrder` thiếu `resolved_by`
- **BE:** Command `ticket:check-overdue` — cảnh báo Telegram ticket >2h chưa xử lý, schedule 30 phút/lần
- **FE:** 2 hooks mới (`useUpdateTicketStatus`, `useAssignTicket`)
- **FE:** Fix admin detail view: dùng `TicketDetailDialog` thay `ResolveTicketDialog open={false}`
- **FE:** AdminTicketsPage: thêm cột "Phụ trách", nút "Nhận xử lý" cho ticket OPEN
- **FE:** TicketDetailDialog + ResolveTicketDialog: hiện tracking info (xử lý bởi, phụ trách, nhận xử lý)

**Files:**
- `BE/database/migrations/2026_03_04_000001_add_tracking_fields_to_support_tickets.php` (mới)
- `BE/app/Console/Commands/CheckTicketOverdue.php` (mới)
- `BE/app/Models/MySql/SupportTicket.php` (sửa)
- `BE/app/Http/Controllers/Api/SupportTicketController.php` (sửa)
- `BE/routes/api.php` (sửa)
- `BE/app/Console/Kernel.php` (sửa)
- `FE/src/hooks/apis/useTickets.ts` (sửa)
- `FE/src/views/Client/Admin/SupportTickets/AdminTicketsPage.tsx` (sửa)
- `FE/src/views/Client/SupportTickets/TicketDetailDialog.tsx` (sửa)
- `FE/src/views/Client/Admin/SupportTickets/ResolveTicketDialog.tsx` (sửa)

#### 12.22 Auto-track "Đã xem bởi ai" cho Ticket

**Vấn đề:** Cần tracking admin nào đã xem ticket, nhưng không thể bấm nút — phải tự động.

**Sửa:**
- **BE:** Migration thêm `viewed_by` + `viewed_at`, endpoint `POST /admin/support-tickets/{id}/view`
- **FE:** Khi admin mở TicketDetailDialog, sau 3 giây tự gọi API `markViewed` (useEffect + setTimeout)
- **FE:** AdminTicketsPage hiện cột "Đã xem" với tên admin

**Files:**
- `BE/database/migrations/2026_03_04_000002_add_viewed_fields_to_support_tickets.php` (mới)
- `BE/app/Models/MySql/SupportTicket.php` (sửa)
- `BE/app/Http/Controllers/Api/SupportTicketController.php` (sửa)
- `BE/routes/api.php` (sửa)
- `FE/src/hooks/apis/useTickets.ts` (sửa)
- `FE/src/views/Client/Admin/SupportTickets/AdminTicketsPage.tsx` (sửa)

#### 12.23 Fix toast không tự tắt

**Vấn đề:** Toast notification hiển thị nhưng không tự đóng sau 3 giây — thiếu CSS của react-toastify.

**Sửa:** Thêm `import 'react-toastify/dist/ReactToastify.css'` vào `LayoutProvider.tsx` và `landing-page/layout.tsx`.

**Files:**
- `FE/src/components/LayoutProvider.tsx` (sửa)
- `FE/src/app/[lang]/(landing-page)/layout.tsx` (sửa)

---

### 04/03/2026

#### 12.24 Thêm trạng thái "Đang mua bù" (status 9) + Fix mapping order status

**Vấn đề:**
- Admin bấm "Mua bù" → đơn chuyển status 1 (processing) giống đơn mới, không phân biệt được
- `retryPartialOrder()` set status=1 nhưng `PlaceOrder` chỉ chấp nhận status=0 → đơn kẹt ~10 phút
- FE `orderStatus.ts` mapping sai (status 3=FAILED, 4=CANCEL, 5=EXPIRED — không khớp BE)

**Sửa:**
- BE: Thêm `retry_processing_partial => 9` vào `Order::STATUS_KEY` và `STATUS_TEXT_MAP`
- BE: `retryPartialOrder()` dùng status 9 thay vì 1
- BE: `PlaceOrder.findPendingOrder()` chấp nhận status 0 + 9
- BE: `FetchPendingOrders` gom status 9 vào nhóm pending
- FE: Sửa toàn bộ `orderStatus.ts` cho đúng mapping BE (0-9)
- FE: Thêm `ORDER_STATUS_LABELS_ADMIN` — admin thấy "Đang mua bù", user thấy "Đang xử lý"
- FE: Admin views dùng `ORDER_STATUS_LABELS_ADMIN`, fix switch case icons

**Files:**
- `BE/app/Models/MySql/Order.php` (sửa)
- `BE/app/Http/Controllers/Api/SupportTicketController.php` (sửa)
- `BE/app/Console/Commands/PlaceOrder.php` (sửa)
- `BE/app/Console/Commands/FetchPendingOrders.php` (sửa)
- `FE/src/constants/orderStatus.ts` (sửa)
- `FE/src/views/Client/Admin/TransactionHistory/TableTransactionHistory.tsx` (sửa)
- `FE/src/views/Client/Admin/TransactionHistory/OrderDetailModal.tsx` (sửa)
- `FE/src/views/Client/Admin/TransactionHistory/LogModal.tsx` (sửa)
- `FE/src/views/Client/Admin/SupportTickets/ResolveTicketDialog.tsx` (sửa)

#### 12.25 Order Log — Hiển thị log xử lý thật từ MongoDB

**Vấn đề:** LogModal admin hiện demo data giả. Không có API endpoint query OrderLog (MongoDB). `retryPartialOrder`, `refundPartialOrder`, `FetchPendingOrders` không ghi log vào OrderLog.

**Sửa:**
- BE: Thêm `getOrderLogs()` endpoint `GET /admin/order-logs/{order_id}` query MongoDB
- BE: Thêm 3 ACTION constants vào OrderLog model (`admin_retry_partial`, `admin_refund_partial`, `auto_recovered`)
- BE: `retryPartialOrder` + `refundPartialOrder` ghi OrderLog::create sau khi update status
- BE: `FetchPendingOrders` ghi OrderLog khi auto-recover order stuck PROCESSING > 10 phút
- FE: Hook `useOrderLogs(orderId)` trong useTickets.ts
- FE: Rewrite `LogModal.tsx` — fetch data thật, hiện timeline với action labels, status transitions, duration_ms, http_status, response body (collapsible)

**Files:**
- `BE/app/Models/Mongo/OrderLog.php` (sửa)
- `BE/app/Http/Controllers/Api/SupportTicketController.php` (sửa)
- `BE/routes/api.php` (sửa)
- `BE/app/Console/Commands/FetchPendingOrders.php` (sửa)
- `FE/src/hooks/apis/useTickets.ts` (sửa)
- `FE/src/views/Client/Admin/TransactionHistory/LogModal.tsx` (sửa)
- `FE/src/views/Client/Admin/TransactionHistory/TableTransactionHistory.tsx` (sửa)

#### 12.26 Đổi format order_code thêm timestamp + user_id

**Vấn đề:** Format cũ `ORD-yymmdd-RANDOM6` thiếu thông tin thời gian chính xác và user.

**Sửa:** Đổi sang `ORD-yymmddHHiiss-{user_id}-RANDOM4`. Ví dụ: `ORD-260304143025-42-ABCD`.

**Files:**
- `BE/app/Models/MySql/Order.php` (sửa)

#### 12.27 Fix bugs: total_price, batch insert ApiKey, dual ApiKeys source

**#8 — Dual ApiKeys source (MktProxyRotatingProcessor):**
- Bỏ `ApiKey::where()` query riêng, dùng duy nhất `$order->apiKeys` — tránh mismatch index giữa 2 nguồn data

**#12 — total_price per ApiKey sai:**
- 8 file Partner lưu `total_price => $total` (tổng đơn hàng) thay vì giá per-unit → sửa thành `$pricePerUnit` (hoặc tương đương)

**#5 — N+1 ApiKey inserts:**
- 8 file Partner dùng loop `ApiKey::create()` → đổi sang `ApiKey::insert($records)` batch 1 query

**Files:**
- `BE/app/Services/Partners/OrderProcessors/MktProxyRotatingProcessor.php` (sửa)
- `BE/app/Services/Partners/MktProxy/MktProxyPartner.php` (sửa)
- `BE/app/Services/Partners/HomeProxy/HomeProxyPartner.php` (sửa)
- `BE/app/Services/Partners/HomeProxy/HomeProxyStaticPartner.php` (sửa)
- `BE/app/Services/Partners/ZingProxy/ZingProxyPartner.php` (sửa)
- `BE/app/Services/Partners/ProxyVn/ProxyVNPartner.php` (sửa)
- `BE/app/Services/Partners/ProxyVn/ProxyVNStaticPartner.php` (sửa)
- `BE/app/Services/Partners/Upproxy/UpproxyPartner.php` (sửa)
- `BE/app/Services/Partners/Upproxy/UpproxyStaticPartner.php` (sửa)

#### 12.28 Fix: enqueue lock TTL, ZingProxy transaction, delivered_quantity default

**#5 — Enqueue lock TTL 90s → 600s:**
- Khớp với processing lock (600s), tránh FetchPendingOrders push trùng order đang xử lý

**#7 — ZingProxy tách API call ra ngoài transaction:**
- Trước: API call trong `DB::transaction` → lock DB khi API chậm
- Sau: Phase 1 gọi API → Phase 2 `DB::transaction` chỉ update DB (giống MktProxy pattern)

**#12 — Default delivered_quantity = quantity:**
- Order.boot: tự set `delivered_quantity = quantity` khi tạo mới
- Migration backfill: set `delivered_quantity = quantity` cho records NULL cũ

**Files:**
- `BE/app/Helpers/OrderHelper.php` (sửa)
- `BE/app/Console/Commands/FetchPendingOrders.php` (sửa)
- `BE/app/Services/Partners/OrderProcessors/ZingProxyRotatingProcessor.php` (sửa)
- `BE/app/Models/MySql/Order.php` (sửa)
- `BE/database/migrations/2026_03_04_000001_set_delivered_quantity_default.php` (mới)

#### 12.29 Document: proxys vs api_key convention + failOrderWithRefund vs handleProcessorFailure

**#11 — Ghi chú `proxys` vs `api_key`:**
- Thêm comment vào 6 processors giải thích tại sao check `proxys` hoặc `api_key` khi retry partial
- Thêm section trong DEVELOPER-GUIDE giải thích convention, bảng so sánh, hướng dẫn khi thêm partner mới

**#6 — Ghi chú `failOrderWithRefund` vs `handleProcessorFailure`:**
- Thêm section trong DEVELOPER-GUIDE giải thích caller context khác nhau và flow chi tiết

**Files:**
- `BE/app/Services/Partners/OrderProcessors/ProxyVnRotatingProcessor.php` (comment)
- `BE/app/Services/Partners/OrderProcessors/HomeProxyRotatingProcessor.php` (comment)
- `BE/app/Services/Partners/OrderProcessors/HomeProxyStaticProcessor.php` (comment)
- `BE/app/Services/Partners/OrderProcessors/ZingProxyRotatingProcessor.php` (comment)
- `BE/app/Services/Partners/OrderProcessors/MktProxyRotatingProcessor.php` (comment)
- `BE/app/Services/Partners/OrderProcessors/UpProxyStaticProcessor.php` (comment)
- `FE/DEVELOPER-GUIDE.md` (thêm 2 sections trong phần 11)

#### 12.30 Fix đối soát tài chính + Báo cáo đơn hàng theo trạng thái

**Vấn đề:**
- `testTotals()` chỉ query `NAPTIEN` + `BUY` → bỏ qua `NAPTIEN_PAY2S`, `NAPTIEN_MANUAL`, `RUT_HOA_HONG_AFFILIATE`, v3/v4 types
- `scanDeposits()` chỉ scan `NAPTIEN` → deposit mới từ Pay2S/Manual không vào report
- Không có báo cáo chi tiết theo 10 trạng thái đơn hàng

**Sửa — Phần A (Đối soát):**
- `testTotals()`: query tất cả deposit types, tách BUY v6 (dương) vs v3/v4 (âm), thêm affiliate
- `scanDeposits()`: `whereIn` 3 deposit types thay vì 1
- Công thức mới: `deposits + affiliate - purchases + refunds = balance`

**Sửa — Phần B (Report đơn hàng):**
- Migration `report_order_status`: aggregate theo (date, partner_id, status)
- Command `report:order-status`: chạy daily 00:15, hỗ trợ backfill `--from` / `--to`
- Controller `OrderReportController`: 2 API (summary + detail)

**Sửa — Phần C (FE Dashboard):**
- Component `OrderStatusReport`: PieChart + BarChart + KPI + Table paginated
- Filter: date range + partner + status (click pie slice)
- Hook `useOrderReport` + proxy routes

**Files:**
- `BE/app/Http/Controllers/Api/DashboardController.php` (fix testTotals)
- `BE/app/Services/StatisticsService.php` (fix scanDeposits)
- `BE/database/migrations/2026_03_04_000003_create_report_order_status_table.php` (mới)
- `BE/app/Models/MySql/ReportOrderStatus.php` (mới)
- `BE/app/Console/Commands/ReportOrderStatus.php` (mới)
- `BE/app/Console/Kernel.php` (schedule 00:15)
- `BE/app/Http/Controllers/Api/OrderReportController.php` (mới)
- `BE/routes/api.php` (thêm 2 routes)
- `FE/src/hooks/apis/useOrderReport.ts` (mới)
- `FE/src/app/api/admin/order-report/summary/route.ts` (mới)
- `FE/src/app/api/admin/order-report/detail/route.ts` (mới)
- `FE/src/views/Client/Admin/Dashboard/OrderStatusReport.tsx` (mới)
- `FE/src/app/[lang]/(private)/(client)/admin/dashboard/page.tsx` (thêm component)

### 05/03/2026

#### 12.31 Gộp deposit types: NAPTIEN + NAPTIEN_PAY2S → NAPTIEN_AUTO

**Vấn đề:**
- 3 type nạp tiền riêng biệt (NAPTIEN, NAPTIEN_PAY2S, NAPTIEN_MANUAL) gây phức tạp khi query
- Phương thức nạp (bank polling, pay2s) là chi tiết implementation, không cần type riêng

**Sửa:**
- Gộp thành 2 type duy nhất: `NAPTIEN_AUTO` (tự động) + `NAPTIEN_MANUAL` (admin cộng tay)
- Phương thức cụ thể ghi trong `datas.deposit_type` (auto, pay2s, manual)
- Thêm constant `Dongtien::DEPOSIT_TYPES` — dùng cho `whereIn` queries toàn codebase
- Migration update data cũ: `NAPTIEN` + `NAPTIEN_PAY2S` → `NAPTIEN_AUTO`

**Files:**
- `BE/app/Models/MySql/Dongtien.php` (constants + getNoiDung)
- `BE/app/Services/DepositService.php` (type mapping)
- `BE/app/Services/NapTien.php` (type)
- `BE/app/Services/StatisticsService.php` (scanDeposits)
- `BE/app/Http/Controllers/Api/DashboardController.php` (testTotals)
- `BE/app/Http/Controllers/Api/DepositController.php` (raw SQL + queries)
- `BE/app/Http/Controllers/Api/TransactionHistoryController.php` (filter)
- `BE/app/Http/Controllers/Admin/HomeController.php` (dashboard)
- `BE/app/Http/Controllers/Admin/UsersController.php` (lịch sử)
- `BE/app/Http/Controllers/AffiliateController.php` (affiliate)
- `BE/app/Console/Commands/RealtimeStatistics.php` (scan deposits)
- `BE/app/Console/Commands/OrderStatistics.php` (user deposit query)
- `BE/database/migrations/2026_03_05_000001_migrate_deposit_types_to_naptien_auto.php` (mới)

#### 12.32 Thêm order_type (BUY/RENEWAL) + Tạo Order cho gia hạn

**Vấn đề:**
- Gia hạn chỉ update `ApiKey.expired_at` + tạo Dongtien (order_id=NULL), không tạo Order
- Báo cáo thiếu doanh thu gia hạn, không phân biệt được mua mới vs gia hạn

**Sửa:**
- Thêm `order_type` (TINYINT: 0=BUY, 1=RENEWAL) + `parent_order_id` vào bảng `orders`
- Order code prefix: `ORD-` (mua mới) vs `RNW-` (gia hạn)
- Tạo helper `createRenewalOrder()` — dùng chung cho 3 methods gia hạn (V3, V4, V6)
- Mỗi lần gia hạn → tạo Order RENEWAL riêng, link `parent_order_id` về đơn gốc
- `NapTien::ThemDongTien` nhận thêm `$order_id` → Dongtien link tới order
- `report_order_status` thêm `order_type` dimension → aggregate tách bạch BUY/RENEWAL
- Command `report:order-status` đổi sang delete+insert (thay vì updateOrCreate) — tránh stale data
- `OrderReportController` thêm filter `order_type` cho summary + detail

**Files:**
- `BE/database/migrations/2026_03_05_000002_add_order_type_to_orders.php` (mới)
- `BE/database/migrations/2026_03_05_000003_add_order_type_to_report_order_status.php` (mới)
- `BE/app/Models/MySql/Order.php` (constants + fillable + boot prefix + relationships)
- `BE/app/Models/MySql/ReportOrderStatus.php` (fillable + casts)
- `BE/app/Http/Controllers/ProxyController.php` (createRenewalOrder helper + refactor 3 methods)
- `BE/app/Services/NapTien.php` (ThemDongTien thêm order_id param)
- `BE/app/Console/Commands/ReportOrderStatus.php` (order_type groupBy + delete+insert)
- `BE/app/Http/Controllers/Api/OrderReportController.php` (filter order_type + detail output)

#### 12.33 Fix scan logic báo cáo — terminal states + order snapshot

**Vấn đề:**
- Scan chỉ bắt `expired` (4) và `failed` (5), bỏ sót status 6 (partial_refunded), 8 (refunded_all)
- Scan reset khi status thay đổi → double-count revenue
- Revenue chỉ hiện khi order expired (trễ 30 ngày)
- Order counts trong report_order không phản ánh trạng thái hiện tại

**Sửa:**
- Bỏ scan reset trong `Order::boot()` — scan=1 là vĩnh viễn
- Thêm `Order::TERMINAL_STATUSES = [4, 6, 8]`
- Revenue scan: chỉ terminal states (expired, partial_refunded, refunded_all)
- Bỏ failed scan (admin xử lý → chuyển sang terminal state)
- `report_order`: chuyển sang snapshot (delete+insert) cho 14 ngày gần nhất mỗi lần chạy
- successful_orders = status IN (2,3,4,6) — đơn đã deliver proxy

**Files:**
- `BE/app/Models/MySql/Order.php` (bỏ scan reset, thêm TERMINAL_STATUSES)
- `BE/app/Console/Commands/RealtimeStatistics.php` (refactor sections 2-5)

### 06/03/2026

#### 12.34 Fix typo total_refunts → total_refunds + cleanup ReportOrder model

- **Vấn đề**: Column `total_refunts` trong bảng `report_transaction` là typo (đúng: `total_refunds`). ReportOrder model có `$casts` sai column (`date` thay vì `date_at`) và dead code scopes.
- **Sửa**:
  - Migration rename column `total_refunts` → `total_refunds`
  - Update tất cả references trong 5 file BE + 1 file FE
  - Fix `$casts['date']` → `$casts['date_at']` trong ReportOrder
  - Xóa dead code: 3 scopes + 2 static methods dùng sai column
- **Files**:
  - `BE/database/migrations/2026_03_06_000001_rename_total_refunts_to_total_refunds_in_report_transaction.php` (mới)
  - `BE/app/Models/MySql/ReportTransaction.php`
  - `BE/app/Models/MySql/ReportOrder.php`
  - `BE/app/Console/Commands/RealtimeStatistics.php`
  - `BE/app/Services/StatisticsService.php`
  - `BE/app/Http/Controllers/Api/DashboardController.php`
  - `FE/src/views/Client/Admin/Dashboard/DailyStats.tsx`

#### 12.35 Fix migration tương thích proxy_api + thêm refunded_amount

- **Vấn đề**: Migration `change_orders_status_to_tinyint` không xử lý `full_completed` (status=7 trên proxy_api). Khi chạy trên production, records status=7 sẽ bị hiểu nhầm thành `waiting_refund`. Order model thiếu `refunded_amount` (proxy_api có).
- **Sửa**:
  - Fix migration cũ: thêm convert status=7 → 8 + string `full_completed` → 8
  - Tạo migration safety net: convert status=7 → 8 (cho trường hợp migration cũ đã chạy)
  - Thêm `refunded_amount` + `final_amount` vào Order (fillable + migration + auto-calculate)
  - `final_amount = total_amount - refunded_amount` — auto-calculate trong boot `saving` event
  - Cập nhật STATUS_TEXT_MAP comments — ghi rõ backward compat với proxy_api
- **Files**:
  - `BE/database/migrations/2026_03_03_000000_change_orders_status_to_tinyint.php` (sửa)
  - `BE/database/migrations/2026_03_06_000002_convert_full_completed_status.php` (mới)
  - `BE/database/migrations/2026_03_06_000003_add_refunded_amount_to_orders.php` (mới)
  - `BE/database/migrations/2026_03_06_000004_add_final_amount_to_orders.php` (mới)
  - `BE/app/Models/MySql/Order.php` (refunded_amount, final_amount, auto-calculate, comments)

#### 12.36 Redesign Admin Financial Dashboard

- **Vấn đề**: Dashboard cũ query từ bảng aggregated (report_transaction, report_order) → số liệu không chính xác. Không có đối soát (testTotals có nhưng không hiện). Layout 2 cột khó đọc.
- **Sửa**:
  - **BE**: Thêm `financialReport()` vào DashboardController — query trực tiếp source tables (dongtien, orders, users). Tái sử dụng logic đối soát từ `testTotals()`. Hỗ trợ filter date range (start/end).
  - **BE**: Route `GET /admin/financial-report?start=dd-mm-yyyy&end=dd-mm-yyyy`
  - **FE**: Hook `useFinancialReport` với typed response
  - **FE**: 4 components mới: `DateRangeFilter` (preset buttons + date picker), `ReconciliationHero` (hero section xanh/đỏ theo kết quả đối soát), `RevenueProfitCards` (4 KPI cards), `OrdersDepositsRow` (2 cột chi tiết đơn hàng + nạp tiền)
  - **FE**: Rewrite `page.tsx` — single column layout: Filter → Đối soát → KPI → Chi tiết → OrderStatusReport
  - API trả 4 sections: `reconciliation` (đối soát), `revenue` (doanh thu/lợi nhuận), `deposits` (nạp tiền), `orders` (đơn hàng)
- **Files**:
  - `BE/app/Http/Controllers/Api/DashboardController.php` (thêm financialReport)
  - `BE/routes/api.php` (thêm route)
  - `FE/src/hooks/apis/useFinancialReport.ts` (mới)
  - `FE/src/views/Client/Admin/Dashboard/DateRangeFilter.tsx` (mới)
  - `FE/src/views/Client/Admin/Dashboard/ReconciliationHero.tsx` (mới)
  - `FE/src/views/Client/Admin/Dashboard/RevenueProfitCards.tsx` (mới)
  - `FE/src/views/Client/Admin/Dashboard/OrdersDepositsRow.tsx` (mới)
  - `FE/src/app/[lang]/(private)/(client)/admin/dashboard/page.tsx` (rewrite)

#### 12.37 Dashboard v2: ProfitHero + Daily Trend Charts + TB/ngày

- **Vấn đề**: Dashboard v1 (12.36) đặt Đối soát ở trên cùng (quá kỹ thuật), thiếu biểu đồ xu hướng, thiếu TB/ngày — finance manager không trả lời được "đang lãi hay lỗ?", "doanh thu đi lên hay xuống?", "mỗi ngày bao nhiêu bill nạp?".
- **Sửa**:
  - **BE**: Thêm `daily_trend` (30 ngày gần nhất, group by date từ orders + dongtien) + `period_days` vào response `financialReport()`
  - **FE**: `ProfitHero` — hero section xanh/đỏ theo lãi/lỗ, hiện lợi nhuận + margin + TB/ngày + breakdown
  - **FE**: `TrendCharts` — 2 biểu đồ: (1) Doanh thu & Lợi nhuận (AreaChart), (2) Nạp tiền hàng ngày (Bar = tiền, Line = số bill)
  - **FE**: `ReconciliationHero` → đơn giản thành card nhỏ ở dưới cùng (KHỚP/CHÊNH LỆCH)
  - **FE**: `RevenueProfitCards` + `OrdersDepositsRow` thêm TB/ngày (tính từ period_days)
  - **FE**: Mock data (`USE_MOCK = true`) với số liệu realistic cho development
  - **Layout mới**: Filter → ProfitHero → TrendCharts → KPI Cards → Chi tiết → Đối soát → OrderStatusReport
- **Files**:
  - `BE/app/Http/Controllers/Api/DashboardController.php` (thêm daily_trend + period_days)
  - `FE/src/hooks/apis/useFinancialReport.ts` (types + mock data)
  - `FE/src/views/Client/Admin/Dashboard/ProfitHero.tsx` (mới)
  - `FE/src/views/Client/Admin/Dashboard/TrendCharts.tsx` (mới)
  - `FE/src/views/Client/Admin/Dashboard/ReconciliationHero.tsx` (simplify → card nhỏ)
  - `FE/src/views/Client/Admin/Dashboard/RevenueProfitCards.tsx` (thêm TB/ngày)
  - `FE/src/views/Client/Admin/Dashboard/OrdersDepositsRow.tsx` (thêm TB/ngày)
  - `FE/src/app/[lang]/(private)/(client)/admin/dashboard/page.tsx` (restructure layout)

#### 12.38 Dashboard v3: Chỉ số chiến lược + OrderStatusReport fix

- **Vấn đề**: Thiếu chỉ số chiến lược (AOV, tỉ lệ gia hạn/thất bại/hoàn tiền). OrderStatusReport có filter ngày riêng không sync với dashboard, KPI row trùng lặp, legend tiếng Anh.
- **Sửa**:
  - **FE**: `OrdersDepositsRow` thêm cột 3 "Chỉ Số Chiến Lược": AOV, tỉ lệ gia hạn, thất bại, hoàn tiền, chi tiêu (có color threshold)
  - **FE**: `OrderStatusReport` — bỏ KPI row trùng, Việt hóa bar chart legend, sync filter ngày từ parent dashboard, bỏ date picker riêng
  - **FE**: `page.tsx` truyền `filterStart`/`filterEnd` xuống OrderStatusReport
- **Files**:
  - `FE/src/views/Client/Admin/Dashboard/OrdersDepositsRow.tsx` (thêm cột chiến lược)
  - `FE/src/views/Client/Admin/Dashboard/OrderStatusReport.tsx` (bỏ KPI trùng, Việt hóa, sync filter)
  - `FE/src/app/[lang]/(private)/(client)/admin/dashboard/page.tsx` (pass filter props)

### 07/03/2026

#### 12.39 Fix Data Integrity — Refund + Cost + Affiliate Commission

- **Vấn đề**:
  - `order.refunded_amount` **không bao giờ được cập nhật** khi tạo Dongtien REFUND → `final_amount` luôn = `total_amount` (sai)
  - Không chặn duplicate refund → admin bấm 2 lần = user nhận tiền 2 lần
  - Refund flow không dùng DB transaction → race condition trên số dư user
  - Renewal order có `total_cost = 0, cost_price = 0` → báo cáo thiếu chi phí
  - `total_cost_final` (chi phí thực tế) chưa được tính khi giao proxy
  - Affiliate commission không tính vào chi phí khi order expired
  - Dongtien dùng `'REFUND'` string trực tiếp, không có constant phân biệt partial/full
- **Sửa**:
  - **Migration**: thêm `total_cost_final` + `affiliate_commission` vào bảng `orders`
  - **Dongtien model**: thêm `TYPE_REFUND_PARTIAL`, `TYPE_REFUND_FULL`, `REFUND_TYPES` array (backward compat: query cả 3 type `REFUND`, `REFUND_PARTIAL`, `REFUND_FULL`)
  - **SupportTicketController.refundPartialOrder()**: DB::beginTransaction + User::lockForUpdate + duplicate refund check + update `refunded_amount` + `total_cost_final` + type = `REFUND_PARTIAL`
  - **TransactionHistoryController.cancelOrder()**: tương tự + type = `REFUND_FULL` + status đổi từ `waiting_refund`(7) → `refunded_all`(8) + bỏ dead code checks
  - **BasePartner**: `markOrderSuccess()` + `finalizeOrder()` set `total_cost_final = cost_price × delivered_quantity`
  - **ProxyController.createRenewalOrder()**: lấy cost từ ServiceType `price_by_duration` (ưu tiên) hoặc `cost_price` (fallback)
  - **CheckProxyStatus**: affiliate_commission sẽ được tính trong command báo cáo (Phase 2), không tính ở đây
  - **BackfillOrderData command**: sync data cũ (total_cost_final, refunded_amount từ dongtien, affiliate_commission cho expired orders). Hỗ trợ `--dry-run`
  - **ApiKey + ApiKey_v4**: chuyển status từ VARCHAR → TINYINT (ACTIVE=0, INACTIVE=1, EXPIRED=2). Override `toArray()` map int→string cho API output (backward compat)
  - **Migration**: convert data in-place bằng raw SQL, rồi ALTER COLUMN type
  - **FE**: sửa typo `EXPRIRED` → `EXPIRED` ở 5 file (OrderProxy, StaticProxy, RotatingProxy, ProxyDetailModal, OrderDetailModal)
  - **ProxyController**: sửa `FIELD(status, ...)` dùng int thay vì string, sửa type hint `int $statusConst`
- **Files**:
  - `BE/database/migrations/2026_03_07_000001_add_cost_final_and_affiliate_to_orders.php` (mới)
  - `BE/database/migrations/2026_03_07_000002_convert_api_keys_status_to_tinyint.php` (mới)
  - `BE/app/Models/MySql/Dongtien.php` (thêm REFUND constants)
  - `BE/app/Models/MySql/Order.php` (thêm fillable + comments)
  - `BE/app/Models/MySql/ApiKey.php` (int constants + STATUS_TEXT_MAP + toArray)
  - `BE/app/Models/MySql/ApiKey_v4.php` (int constants + STATUS_TEXT_MAP + toArray)
  - `BE/app/Http/Controllers/Api/SupportTicketController.php` (rewrite refundPartialOrder)
  - `BE/app/Http/Controllers/Api/TransactionHistoryController.php` (rewrite cancelOrder)
  - `BE/app/Services/Partners/BasePartner.php` (set total_cost_final)
  - `BE/app/Http/Controllers/ProxyController.php` (renewal cost + FIELD int + type hint)
  - `BE/app/Console/Commands/CheckProxyStatus.php` (bỏ affiliate calc)
  - `BE/app/Console/Commands/BackfillOrderData.php` (mới)
  - `FE/src/views/Client/OrderRotatingProxy/OrderRotatingProxyPage.tsx` (EXPRIRED→EXPIRED)
  - `FE/src/views/Client/OrderProxy/OrderProxyPage.tsx` (EXPRIRED→EXPIRED)
  - `FE/src/views/Client/StaticProxy/OrderProxyPage.tsx` (EXPRIRED→EXPIRED)
  - `FE/src/views/Client/OrderRotatingProxy/ProxyDetailModal.tsx` (EXPRIRED→EXPIRED)
  - `FE/src/views/Client/Admin/TransactionHistory/OrderDetailModal.tsx` (EXPRIRED→EXPIRED)

---

#### 12.40 Report Command — report:daily (đơn hàng + dòng tiền)

- **Vấn đề**: 2 command báo cáo riêng rẽ, thiếu data `total_cost_final`, `refunded_amount`, `affiliate_commission`. Dongtien không có cơ chế scan → không báo cáo được dòng tiền thanh toán.
- **Sửa**:
  - **Command `report:daily`** (hourly), 3 phần:
    - **Đơn hàng terminal** (4,6,8): scan=0 → tính affiliate → **cộng dồn N+M** → scan=1
    - **Đơn hàng non-terminal** (còn lại): query lại tổng hiện tại → **thay thế N=M** (không đánh scan — orders chưa kết thúc)
    - **Dòng tiền**: scan=0 từ dongtien → **cộng dồn N+M** → scan=1 (trong DB transaction)
  - **Dòng tiền normalized**: mỗi row = `date_at × type × user_id` (NAPTIEN_AUTO, THANHTOAN, REFUND_PARTIAL, ...)
  - **Migration 000003**: thêm `total_cost_final`, `total_refunded`, `total_affiliate_commission` vào `report_order_status`
  - **Migration 000004**: tạo `report_deposits` normalized (`date_at × type × user_id × total_amount × count`)
  - **Migration 000005**: thêm `scan` vào dongtien + bỏ data cũ (mark scan=1, truncate reports)
  - **Dongtien model**: thêm `PAYMENT_TYPES` constant
  - **Bỏ backfill** (`--from/--to`): data cũ không dùng, tính từ đầu sau deploy
- **Files**:
  - `BE/app/Console/Commands/ReportDaily.php` (mới)
  - `BE/app/Models/MySql/ReportDeposit.php` (mới)
  - `BE/app/Models/MySql/Dongtien.php` (thêm PAYMENT_TYPES)
  - `BE/app/Models/MySql/ReportOrderStatus.php` (thêm fillable + casts)
  - `BE/app/Models/MySql/Order.php` (sửa comment scan)
  - `BE/database/migrations/2026_03_07_000003_add_cost_columns_to_report_order_status.php` (mới)
  - `BE/database/migrations/2026_03_07_000004_create_report_daily_table.php` (mới — `report_deposits`)
  - `BE/database/migrations/2026_03_07_000005_add_scan_to_dongtien_and_reset_reports.php` (mới)
  - `BE/app/Console/Kernel.php` (schedule update)

#### 12.41 Phase 3 — Dashboard tài chính từ bảng report

- **Vấn đề**: `financialReport()` query trực tiếp 20+ queries từ `orders` + `dongtien`. Không phân biệt doanh thu xác nhận vs dự kiến, dùng chi phí dự kiến thay vì thực tế, thiếu hoa hồng affiliate.
- **Sửa**:
  - **BE `financialReport()`**: Chuyển sang query `report_order_status` + `report_deposits` (pre-aggregated)
    - Revenue: `confirmed` (terminal) vs `expected` (in_use), `cost_actual`, `affiliate_cost`
    - Orders: `by_status[]` array thay vì hardcode `active/completed/failed/refunded`
    - Deposits: đầy đủ 5 loại (auto, manual, payment, refund, affiliate)
    - Mới: `partner_breakdown[]` — hiệu suất theo partner
    - Đối soát (`reconciliation`): vẫn query direct tables (real-time)
  - **FE types**: `FinancialReportData` cập nhật revenue/deposits/orders + thêm `OrderStatusItem`, `PartnerBreakdownItem`
  - **ProfitHero**: hiện "Doanh thu xác nhận" + pipeline (expected), breakdown 4 ô (XN, Chi phí TT, Hoàn, Hoa hồng AF)
  - **RevenueProfitCards**: 4 KPI cards — Doanh thu XN, Chi phí TT, Lợi nhuận (margin%), Tổng nạp
  - **OrdersDepositsRow**: Đơn hàng render từ `by_status[]` dynamic, Dòng tiền hiện đủ 5 loại
  - **PartnerBreakdown** (mới): bảng partner_name, đơn hàng, doanh thu, chi phí, lợi nhuận, margin%
  - `USE_MOCK = false` — tắt mock data
  - **Performance**: Gộp ~32 queries → ~8 queries (conditional aggregation)
  - **Lazy-load reconciliation**: Tách đối soát ra endpoint `/admin/reconciliation` + hook `useReconciliation` riêng — dashboard chính render ngay, đối soát load background
  - **Đối soát dùng report_deposits**: `buildReconciliation()` query `report_deposits` (conditional aggregation) thay `dongtien` trực tiếp. Chỉ duy nhất `users.sodu` (số dư live) là query source table.
  - **Command `report:backfill`**: Populate 2 bảng report từ lịch sử (chạy 1 lần sau deploy). Truncate → aggregate orders → aggregate dongtien → mark scan=1.
  - **Index**: Composite index `dongtien(created_at, type, user_id)`
- **Files**:
  - `BE/app/Http/Controllers/Api/DashboardController.php` (rewrite financialReport + reconciliation endpoint + buildReconciliation dùng report_deposits)
  - `BE/app/Console/Commands/ReportBackfill.php` (mới — `php artisan report:backfill`)
  - `BE/app/Console/Kernel.php` (đăng ký ReportBackfill)
  - `BE/routes/api.php` (thêm route `/admin/reconciliation`)
  - `BE/database/migrations/2026_03_07_000006_add_created_at_index_to_dongtien.php` (mới)
  - `FE/src/hooks/apis/useFinancialReport.ts` (types + useReconciliation hook)
  - `FE/src/views/Client/Admin/Dashboard/ProfitHero.tsx`
  - `FE/src/views/Client/Admin/Dashboard/RevenueProfitCards.tsx`
  - `FE/src/views/Client/Admin/Dashboard/OrdersDepositsRow.tsx` (bỏ reconciliation dep)
  - `FE/src/views/Client/Admin/Dashboard/ReconciliationHero.tsx` (self-loading với useReconciliation)
  - `FE/src/views/Client/Admin/Dashboard/PartnerBreakdown.tsx` (mới)
  - `FE/src/app/[lang]/(private)/(client)/admin/dashboard/page.tsx`

#### 12.42 Dashboard instant render — placeholderData + mock data

- **Vấn đề**: Dashboard chờ API >5s rồi mới render. Nếu report tables trống → "Không có dữ liệu". UX tệ.
- **Sửa**:
  - **Mock data**: Dữ liệu mô phỏng 30 ngày kinh doanh thực tế — 986 đơn, 5 partner, 10 trạng thái, xu hướng tăng nhẹ, margin 39.6%, đối soát chênh 150K. Số liệu nhất quán nội bộ (profit = confirmed - refunded - cost - affiliate).
  - **`placeholderData`**: TanStack Query render mock ngay 0ms, API data thay thế seamlessly khi sẵn sàng.
  - **Bỏ skeleton/empty**: Dashboard luôn render (mock fallback), không còn "Không có dữ liệu".
  - **Loading bar**: Thanh 0.5px gradient animate-pulse ở top khi đang fetch.
  - **ReconciliationHero**: Dùng mock fallback thay skeleton "Đang tải đối soát...".
  - Export `MOCK_FINANCIAL` + `MOCK_RECONCILIATION` cho component fallback.
- **Files**:
  - `FE/src/hooks/apis/useFinancialReport.ts` (mock data + placeholderData + export)
  - `FE/src/app/[lang]/(private)/(client)/admin/dashboard/page.tsx` (bỏ skeleton, fallback mock)
  - `FE/src/views/Client/Admin/Dashboard/ReconciliationHero.tsx` (mock fallback)

#### 12.43 Fix UX: date filter feedback + OrderStatusReport mock data

- **Vấn đề**:
  1. Chọn thời gian (1 ngày, 7 ngày...) không thấy phản hồi giao diện — mock data không thay đổi, loading bar quá nhỏ
  2. "Chi Tiết Đơn Hàng Theo Trạng Thái" ở cuối load nhưng không có data (report tables trống)
- **Sửa**:
  - **Date filter feedback**: Khi `isFetching`, toàn bộ nội dung dashboard dim `opacity-50` + `pointer-events-none` → user thấy rõ đang cập nhật. DateRangeFilter giữ nguyên sáng (không bị dim)
  - **OrderStatusReport mock**: Thêm `placeholderData` cho `useOrderReportSummary` (pie chart + bar chart 7 ngày + status breakdown) và `useOrderReportDetail` (15 mock orders với tên, dịch vụ, trạng thái thực tế)
- **Files**:
  - `FE/src/app/[lang]/(private)/(client)/admin/dashboard/page.tsx` (content dim khi fetching)
  - `FE/src/hooks/apis/useOrderReport.ts` (mock data + placeholderData)

#### 12.44 Fix OrderStatusReport biến mất khi API trả rỗng

- **Vấn đề**: Section "Chi Tiết Đơn Hàng" hiện mock data rồi biến mất (mất luôn) — `placeholderData` bị thay thế khi API trả rỗng/null, điều kiện `summary ? <> : null` render nothing.
- **Sửa**:
  - Fallback mock: `summary = summaryRaw ?? MOCK_SUMMARY`, `detail = detailRaw ?? MOCK_DETAIL` — luôn có data
  - Bỏ `summaryLoading ? <CircularProgress> : summary ? ... : null` — luôn render
  - Dùng `opacity-50` khi `summaryFetching || detailFetching` thay vì spinner
  - Export `MOCK_SUMMARY` + `MOCK_DETAIL` từ hook
- **Files**:
  - `FE/src/hooks/apis/useOrderReport.ts` (export mock constants)
  - `FE/src/views/Client/Admin/Dashboard/OrderStatusReport.tsx` (fallback + bỏ loading skeleton)

#### 12.45 Chuẩn hóa spacing + thêm expected profit & net cash flow

- **Vấn đề**: Spacing không đồng nhất (mỗi component tự quản `mb-4`). Thiếu lợi nhuận dự kiến từ pipeline và dòng tiền ròng cho quản lý tài chính.
- **Sửa**:
  - **Spacing**: Wrapper dùng `space-y-4`, bỏ `mb-4`/`mt-6` khỏi tất cả component → gap đồng nhất 16px
  - **Lợi nhuận dự kiến**: ProfitHero hiện "lãi dự kiến +X" từ pipeline (= expected × margin%). Breakdown thêm ô "Pipeline" màu vàng. Góc phải thêm box "Lợi nhuận dự kiến"
  - **Dòng tiền ròng**: Card Dòng Tiền thêm tổng kết `Net = Nạp - Thanh toán - Rút AF`, hiện xanh (dương) hoặc đỏ (âm)
- **Files**:
  - `FE/src/app/[lang]/(private)/(client)/admin/dashboard/page.tsx` (space-y-4 wrapper)
  - `FE/src/views/Client/Admin/Dashboard/DateRangeFilter.tsx` (bỏ mb-4)
  - `FE/src/views/Client/Admin/Dashboard/ProfitHero.tsx` (expected profit + pipeline box)
  - `FE/src/views/Client/Admin/Dashboard/TrendCharts.tsx` (bỏ mb-4)
  - `FE/src/views/Client/Admin/Dashboard/RevenueProfitCards.tsx` (bỏ mb-4)
  - `FE/src/views/Client/Admin/Dashboard/OrdersDepositsRow.tsx` (net cash flow + bỏ mb-4)
  - `FE/src/views/Client/Admin/Dashboard/PartnerBreakdown.tsx` (bỏ mb-4)
  - `FE/src/views/Client/Admin/Dashboard/ReconciliationHero.tsx` (bỏ mb-4)
  - `FE/src/views/Client/Admin/Dashboard/OrderStatusReport.tsx` (bỏ mt-6)

#### 12.46 Fix migrations — safety checks + duplicate prevention

- **Vấn đề**: `php artisan migrate` lỗi "Duplicate key name 'orders_order_code_unique'" và nhiều migration thiếu `Schema::hasColumn()` → fail nếu chạy lại.
- **Sửa**:
  - **order_code unique**: Thêm check index tồn tại trước khi tạo
  - **Duplicate timestamp**: Đổi `2026_03_04_000001_set_delivered_quantity_default` → `000004`
  - **Duplicate scan dongtien**: Thêm `hasColumn('dongtien', 'scan')` check
  - **11 migrations**: Thêm `Schema::hasColumn()` / index check cho tất cả migration add column/index
- **Files** (BE migrations):
  - `2026_03_04_000000_add_unique_index_to_order_code.php` (check index exists)
  - `2026_03_04_000001_set_delivered_quantity_default.php` → renamed `000004`
  - `2026_03_07_000005_add_scan_to_dongtien_and_reset_reports.php` (hasColumn check)
  - `2026_03_07_000006_add_created_at_index_to_dongtien.php` (check index exists)
  - `2026_02_09_000000_add_is_payment_affiliate_to_orders_table.php` (hasColumn)
  - `2026_02_10_152221_add_is_affiliate_paid_to_orders_table.php` (hasColumn)
  - `2026_03_05_000002_add_order_type_to_orders.php` (hasColumn)
  - `2026_03_05_000003_add_order_type_to_report_order_status.php` (hasColumn + index check)
  - `2026_03_06_000004_add_final_amount_to_orders.php` (hasColumn)
  - `2026_03_07_000001_add_cost_final_and_affiliate_to_orders.php` (hasColumn × 2)
  - `2026_03_07_000003_add_cost_columns_to_report_order_status.php` (hasColumn)

#### 12.47 Fix TrendCharts biến mất + client-side pagination cho OrderStatusReport

- **Vấn đề**:
  1. TrendCharts (biểu đồ doanh thu/lợi nhuận) biến mất khi API trả object rỗng — `apiData ?? MOCK_FINANCIAL` không trigger vì apiData non-null
  2. Detail table phân trang server-side không hoạt động (API trả rỗng), click page gọi API mỗi lần
- **Sửa**:
  - **TrendCharts**: Đổi fallback sang check meaningful data: `apiData.daily_trend?.length > 0 && apiData.revenue?.confirmed > 0`
  - **Client-side pagination**: Fetch 1 lần (per_page=100), slice trên client theo `clientPage` + `perPage`. Mock 50 orders. Bỏ `page` khỏi API params. Dropdown chọn 10/20/50/100 per page
- **Files**:
  - `FE/src/app/[lang]/(private)/(client)/admin/dashboard/page.tsx` (meaningful data check)
  - `FE/src/hooks/apis/useOrderReport.ts` (bỏ page param, per_page=100, mock 50 orders)
  - `FE/src/views/Client/Admin/Dashboard/OrderStatusReport.tsx` (client-side pagination logic)

---

### 07/03/2026

#### 12.48 Bỏ tab "Mua hàng" / "Danh sách" ở trang proxy-tĩnh và proxy-xoay

- **Vấn đề**: Trang proxy-tĩnh và proxy-xoay có tab bar (Mua hàng / Danh sách) không cần thiết
- **Sửa**: Bỏ tab bar, hiển thị nội dung trực tiếp (filter + cards). Bỏ phần Danh sách (OrderProxyPage, OrderRotatingProxyPage)
- **Files**:
  - `FE/src/views/Client/StaticProxy/StaticProxyPage.tsx`
  - `FE/src/components/ProxyPlansClient.tsx`

#### 12.49 Bổ sung 7 thuộc tính sản phẩm proxy (auth, bandwidth, rotation...)

- **Vấn đề**: Card sản phẩm chỉ hiển thị 3 thuộc tính cơ bản (IP version, proxy type, country). Khách thiếu thông tin quan trọng: xác thực kiểu gì, bandwidth bao nhiêu, xoay kiểu gì
- **Sửa**:
  - **BE**: Migration thêm 7 cột vào `type_services`: `auth_type`, `bandwidth`, `rotation_type`, `rotation_interval`, `request_limit`, `concurrent_connections`, `pool_size` (tất cả nullable)
  - **BE**: Cập nhật Model `$fillable` + Controller validation/data mapping
  - **FE Admin**: Thêm section "Thông số sản phẩm" vào `ServiceFormModal` với conditional rendering (field xoay chỉ hiện khi type=Rotating)
  - **FE Admin**: `rotation_interval` chỉ hiện khi rotation_type = sticky/time_based (ẩn khi per_request)
  - **FE Admin**: Fix resolver crash khi `err.inner` undefined + thêm error logging + auto scroll to error
  - **FE Client**: Thêm nhóm chip specs (icon + label) trên card proxy tĩnh và proxy xoay
- **Files**:
  - `BE/database/migrations/2026_03_08_000001_add_product_attributes_to_type_services.php` (mới)
  - `BE/app/Models/MySql/ServiceType.php`
  - `BE/app/Http/Controllers/Api/ServiceTypeController.php`
  - `FE/src/views/Client/Admin/ServiceType/ServiceFormModal.tsx`
  - `FE/src/app/[lang]/(private)/(client)/components/proxy-card/ProxyCard.tsx`
  - `FE/src/views/Client/RotatingProxy/RotatingProxyPage.tsx`
  - `FE/src/app/[lang]/(private)/(client)/proxy-xoay/page.tsx`

### 08/03/2026

#### 12.50 Preview card + giữ modal mở + tối ưu hiệu suất

- **Vấn đề**: Modal đóng sau cập nhật, không có preview, click sửa phải chờ API load lại data dù list đã có sẵn
- **Sửa**:
  - Giữ modal mở sau cập nhật (edit mode), chỉ đóng khi tạo mới
  - Preview card real-time cột phải — 100% giống card khách hàng (Static: ProxyCard layout, Rotating: PlanCard layout). Có: info tags, spec chips, feature rows từ multi_inputs (CheckCircle + label:value giống StaticFeatureRow), duration radio với discount badge (RadioFeatureRow style cho rotating), protocol radio, note collapsible, tags, quantity + total + nút mua, "Tạm ngừng bán"
  - Truyền `initialData` từ list vào modal → mở form tức thì, không gọi API lại
  - Parse `price_by_duration`, `multi_inputs`, `protocols` dạng JSON string (từ list API)
  - Fix bug: bỏ `required` khỏi `api_partner` (chặn submit khi Accordion thu gọn)
  - Auto mở Accordion + hiện lỗi tại field khi BE trả validation error
  - Cải thiện layout form: dialog xl, section dividers, compact spacing (1.5), switches inline, preview 300px, section headers uppercase
- **Files**: `ServiceFormModal.tsx`, `TableServiceType.tsx`

#### 12.51 Checkout Modal — tách chọn số lượng ra khỏi card sản phẩm

- **Vấn đề**: Card sản phẩm (ProxyCard + PlanCard) quá nặng — vừa hiển thị, vừa chọn số lượng, vừa tính tổng. Footer card chiếm nhiều không gian.
- **Sửa**:
  - **CheckoutModal** (mới): Modal thanh toán với bảng giá, QuantityControl, mã giảm giá (future), tóm tắt đơn hàng, cảnh báo số dư, nút thanh toán. Xử lý cả static (`/api/proxy-static`) và rotating (`/api/buy-proxy`)
  - **ProxyCard**: Bỏ `quantity` khỏi schema/form, bỏ `QuantityControl` + tổng tiền + `useBuyProxy` + `ConfirmDialogOrder`. Footer chỉ còn nút "Mua Proxy" → mở CheckoutModal
  - **PlanCard**: Tương tự ProxyCard — bỏ quantity, bỏ `ConfirmDialog`, footer chỉ còn nút "Mua Proxy" → mở CheckoutModal
  - **Admin Preview**: `renderFooter()` bỏ qty + tổng tiền, chỉ giữ nút "Mua Proxy"
  - **Xóa** `ConfirmDialogOrder.tsx` (không còn dùng)
- **Files**:
  - `FE/src/components/checkout-modal/CheckoutModal.tsx` (mới)
  - `FE/src/components/checkout-modal/styles.css` (mới)
  - `FE/src/app/[lang]/(private)/(client)/components/proxy-card/ProxyCard.tsx` (sửa)
  - `FE/src/views/Client/RotatingProxy/RotatingProxyPage.tsx` (sửa)
  - `FE/src/views/Client/Admin/ServiceType/ServiceFormModal.tsx` (sửa)
  - `FE/src/components/confirm-modal/ConfirmDialogOrder.tsx` (xóa)

#### 12.52 Redesign card — feature rows với icon màu, bỏ spec chips

- **Vấn đề**: Card dùng MUI Chip nhỏ cho specs (auth, bandwidth...) + CheckCircle xanh đồng loạt cho feature rows. Thiếu sự phân biệt trực quan giữa các loại thông tin.
- **Sửa**:
  - **Feature rows thay spec chips**: auth_type, bandwidth, rotation_type, rotation_interval, pool_size, request_limit, concurrent_connections giờ hiển thị dạng feature rows thống nhất
  - **Icon màu riêng biệt**: Shield (cam), Wifi (xanh dương), RefreshCw (tím), Clock (vàng), Globe (cyan), Zap (xanh lá), Users (đỏ), MapPin (indigo)
  - **multi_inputs xoay vòng màu**: 7 màu luân phiên thay vì tất cả xanh
  - **Spacing thoáng hơn**: feature-row padding 6px, font 14px, min-height 24px, value bold #1e293b
  - **ProxyCard**: Gộp info chips (IP version, type, country) thành 1 feature row "Loại IP"
  - **Admin Preview**: Cập nhật khớp với client cards
- **Files**:
  - `FE/src/views/Client/RotatingProxy/styles.css` (spacing)
  - `FE/src/views/Client/RotatingProxy/RotatingProxyPage.tsx` (StaticFeatureRow + bỏ chips)
  - `FE/src/app/[lang]/(private)/(client)/proxy-xoay/page.tsx` (icon colors)
  - `FE/src/app/[lang]/(private)/(client)/components/proxy-card/ProxyCard.tsx` (feature rows)
  - `FE/src/app/[lang]/(private)/(client)/components/proxy-card/styles.css` (feature-row styles)
  - `FE/src/views/Client/Admin/ServiceType/ServiceFormModal.tsx` (preview)

#### 12.53 Card 100% static + CheckoutModal chọn duration/protocol

- **Vấn đề**: Card có quá nhiều interactive elements (radio duration, protocol selector), gây rối UX. Duration/protocol nên chọn khi mua, không phải trên card.
- **Sửa**:
  - **CheckoutModal**: Rewrite — nhận `priceOptions: PriceOption[]` + `protocols: string[]`, tự render duration selector (có discount badge) + protocol selector bên trong modal
  - **ProxyCard**: Bỏ toàn bộ form (react-hook-form, yup), protocol hiển thị dạng static feature row "Hỗ trợ: HTTP/SOCKS5", thêm note preview dưới title, thêm giá header
  - **PlanCard**: Bỏ time/protocol radio, thêm giá header (title trái + giá phải), thêm note preview, protocol dạng static feature row
  - **Admin Preview**: Cập nhật khớp — rotating thêm giá header + note preview + IP info row + protocol static row, bỏ duration/protocol radio. Static thêm note preview + protocol static row, bỏ ProtocolSelector/duration buttons. Footer dùng gradient giống client
  - **Nút mua**: Luôn hiển thị "Mua Proxy" thay vì đổi text "Đăng nhập" khi chưa auth (handle auth silently qua modal)
- **Files**:
  - `FE/src/components/checkout-modal/CheckoutModal.tsx` (rewrite interface)
  - `FE/src/components/checkout-modal/styles.css` (duration options, product name)
  - `FE/src/app/[lang]/(private)/(client)/components/proxy-card/ProxyCard.tsx` (bỏ form)
  - `FE/src/views/Client/RotatingProxy/RotatingProxyPage.tsx` (PlanCard simplify)
  - `FE/src/views/Client/Admin/ServiceType/ServiceFormModal.tsx` (preview khớp)

#### 12.54 Redesign nút mua — outlined button + interaction states

- **Vấn đề**: Nút mua filled gradient đỏ→cam quá nổi bật, 6 card = 6 khối màu lớn chiếm visual weight. Mắt user bị kéo xuống button thay vì đọc nội dung sản phẩm. Thiếu `:active` (click không feedback), thiếu `:focus-visible`. Shimmer thừa (mobile không thấy).
- **Sửa**:
  - **Outlined brand accent**: Default viền `#F88A4B` (cam) + text `#ea580c` (cam đậm) → on-brand, khác biệt rõ với giá đỏ `#e53e3e`
  - **Hover**: Fill brand gradient `45deg, #FC4336, #F88A4B` + text trắng → on-brand, ấm áp
  - **Active**: `#e63946` + scale 0.97 → biết đã click
  - **Focus-visible**: Ring cam 3px
  - **Padding**: 12px (từ 10px) → đạt 44px min touch target
  - **Disabled**: `#f1f5f9` bg + `#94a3b8` text + `#e2e8f0` border
  - **Bỏ shimmer** `::before` pseudo-element
  - **Text**: Luôn "Mua Proxy" (bỏ đổi "Đăng nhập" khi chưa auth)
  - **Checkout pay-btn giữ filled** (modal đã focus hành động, cần nổi bật)
- **Files**:
  - `FE/src/app/[lang]/(public)/main.css` (buy-button base)
  - `FE/src/app/[lang]/(landing-page)/main.css` (buy-button copy)
  - `FE/src/components/checkout-modal/styles.css` (thêm active/focus cho pay-btn)
  - `FE/src/app/[lang]/(private)/(client)/components/proxy-card/styles.css` (bỏ override thừa)
  - `FE/src/views/Client/RotatingProxy/styles.css` (bỏ override thừa)
  - `FE/src/views/Client/Admin/ServiceType/ServiceFormModal.tsx` (preview khớp outlined)
  - **Card hover polish**: Shadow brand-tinted `rgba(252,67,54,0.08)`, border tint `rgba(248,138,75,0.25)`, lift `-4px`, transition `0.25s`. Shadow default layered hơn.
  - **Files thêm**: `FE/src/app/globals.css`, `FE/src/views/Client/RotatingProxy/styles.css`, `proxy-card/styles.css`

#### 12.55 Mute brand colors + tags + card UX polish

- **Vấn đề**: Màu brand quá chói. Tag vị trí chưa tối ưu. Button mua chưa mềm mại.
- **Sửa**:
  - **Tags → border badge**: `position: absolute, top: 0, left: 14, translateY(-50%)` — nằm trên viền card, không ảnh hưởng layout. Card `overflow: visible`.
  - **Tag refined**: Gradient background (135deg, 2-tone), white semi-transparent border, colored shadow thay vì black, font 600 + letter-spacing 0.3px, icon 10px. Premium/tinh tế hơn flat solid.
  - **Button mềm mại**: Light warm fill `#fff5ed`, text `#d06830`, border `#f0c4a0`. Hover → `#f0944e` (warm → deeper warm).
  - **Tags mới**: "Best Seller" (amber) + "Hot" (coral) trong `tagConfig.ts` với gradient
  - **Feature rows**: Hover highlight `#f8fafc`, padding-inline `4px`
  - **Price**: "từ" prefix khi nhiều mức giá
- **Files**:
  - `FE/src/app/[lang]/(public)/main.css`, `(landing-page)/main.css` (button soft fill)
  - `FE/src/views/Client/RotatingProxy/styles.css`, `proxy-card/styles.css` (hover + feature row)
  - `FE/src/configs/tagConfig.ts` (gradient + icon cho tags)
  - `ProxyCard.tsx`, `RotatingProxyPage.tsx` (border badge, refined rendering)
  - `ServiceFormModal.tsx` (preview tag khớp refined style)

#### 12.56 Bỏ expandable note + RichTextEditor → textarea

- **Vấn đề**: Expandable "Ghi chú sản phẩm" thừa, RichTextEditor quá nặng cho mô tả ngắn
- **Sửa**:
  - Bỏ expandable note (note-info-box) khỏi ProxyCard, PlanCard, admin preview
  - Giữ note preview ngắn dưới tên sản phẩm
  - Thay RichTextEditor bằng textarea 500 ký tự, gộp vào Section 1 form
  - Di chuyển Tags vào Section 1, xóa Section "Mô tả sản phẩm"
  - Xóa unused imports: `ChevronDown`, `Info`, `sanitizeHtml`
- **Files**: `ProxyCard.tsx`, `RotatingProxyPage.tsx`, `ServiceFormModal.tsx`

#### 12.57 Tag redesign — pill badge trong card, nền đậm + icon

- **Vấn đề**: Tag corner ribbon 8px quá nhỏ, mờ, khó đọc. Preview không khớp client.
- **Sửa**:
  - **tagConfig**: Đổi pastel → nền đậm + text trắng. Thêm icon emoji (🛡️ ⚡ 🔥 🏆). Thêm tag "Phổ biến".
  - **Client cards + preview**: Pill badge 12px bold, borderRadius 20px, colored shadow nhẹ. Nằm trong card (không absolute), là phần tử đầu tiên trước title. Không đè lên component ngoài.
- **Files**: `tagConfig.ts`, `ProxyCard.tsx`, `RotatingProxyPage.tsx`, `ServiceFormModal.tsx`

#### 12.58 Counter gói + tag on-border không overlap

- **Vấn đề**: "6/6 gói" chiếm dòng riêng lãng phí. Tag trên viền card đè lên component phía trên.
- **Sửa**:
  - Gộp counter vào header filter: `Bộ lọc (X/Y)`. Bỏ dòng riêng (rotating) + footer (static).
  - Tag giữ absolute `top: -12px` trên viền card. Card `overflow: visible`. Grid tăng `rowSpacing={4}` + `mt` để tag không đè lên filter box/card hàng trên.
- **Files**: `RotatingProxyPage.tsx`, `StaticProxyPage.tsx`, `ProxyCard.tsx`, `ServiceFormModal.tsx`, `globals.css`, `proxy-card/styles.css`, `RotatingProxy/styles.css`

#### 12.59 Tag điệu đà + Filter quốc gia có cờ

- **Sửa**:
  - **Tag**: Glass effect (gradient overlay + inset shadow), border trắng mờ, chuyển sang phải (`right: 14px`)
  - **Filter quốc gia**: Flag images từ flagcdn.com (Windows không hỗ trợ flag emoji), pill tròn `borderRadius: 20px`, tên tiếng Việt
  - **tagConfig**: Thêm field `gradient`, helper `getCountryName()`, `COUNTRY_NAMES` mapping
- **Files**: `tagConfig.ts`, `ProxyCard.tsx`, `RotatingProxyPage.tsx`, `StaticProxyPage.tsx`, `ServiceFormModal.tsx`

#### 12.60 Cờ quốc gia trên product cards

- **Sửa**: Hiển thị flag image (flagcdn.com) cạnh tên quốc gia trong row "Loại IP" trên tất cả product cards
  - **ProxyCard**: Thêm `<img>` flag vào feature row "Loại IP"
  - **PlanCard (Rotating)**: Thêm row "Loại IP" mới với MapPin icon + flag + tên quốc gia (tiếng Việt)
  - **Admin preview**: Thêm flag image vào cả 2 preview (rotating + static)
- **Files**: `ProxyCard.tsx`, `RotatingProxyPage.tsx`, `ServiceFormModal.tsx`

#### 12.61 Hiển thị ID sản phẩm + bỏ blur modal

- **Sửa**:
  - Hiển thị `#id` nhỏ (11px, màu xám) cạnh tên sản phẩm trên ProxyCard, PlanCard và CheckoutModal
  - Bỏ `backdrop-filter: blur(4px)` trên checkout overlay, giảm opacity còn 0.35 (tối nhẹ, không mờ)
- **Files**: `ProxyCard.tsx`, `RotatingProxyPage.tsx`, `CheckoutModal.tsx`, `checkout-modal/styles.css`

---

## 13. Known Issues — Danh sách vấn đề cần xử lý

> Tổng hợp toàn bộ vấn đề đã phát hiện qua review. Đánh dấu ✅ khi đã fix.

### CRITICAL — Ảnh hưởng trực tiếp đến đơn hàng / tiền

| # | Mô tả | File | Ghi chú |
|---|-------|------|---------|
| C1 | UpproxyPartner (rotating) **không gọi** `OrderHelper::saveOrderToRedis()` → đơn mãi PENDING, khách mất tiền | `UpproxyPartner.php` | Thiếu dòng push Redis sau commit transaction |
| C2 | ProxyVnRotating: nhánh `else` (status ≠ 100) return false **không gọi** `failOrderWithRefund` → đơn kẹt PROCESSING mãi | `ProxyVnRotatingProcessor.php:131` | Thêm `failOrderWithRefund` trước return |
| C3 | ProxyVnRotating: `$expired_at`/`$buy_at` tính ra nhưng **không lưu DB** | `ProxyVnRotatingProcessor.php:110-111` | Xóa 2 biến thừa hoặc lưu vào Order/ApiKey nếu cần |
| C4 | `getProxyCurrent`: access `$apiKey->api_key` (line 940) trước null check (line 972) → crash | `ProxyController.php:940` | Đổi null check lên trước |

### HIGH — Ảnh hưởng nghiệp vụ / data integrity

| # | Mô tả | File | Ghi chú |
|---|-------|------|---------|
| H1 | HomeProxy retry reuse partner order ID → gán **proxy trùng** cho ApiKey mới | `HomeProxyRotating/StaticProcessor` | Cần filter proxies đã gán khi retry, hoặc lưu offset |
| H2 | ProxyVn, ZingProxy, UpProxy **không có idempotency** khi retry → mua trùng proxy bên đối tác | 3 processor files | Thêm mechanism kiểu `getExistingPartnerOrderId()` hoặc lưu transaction ref |
| H3 | MktProxy: `formatResponseProxyV2($apiKeys[$index], ...)` pass **Model** thay vì string + Redis write trong DB::transaction | `MktProxyRotatingProcessor.php:84-85` | Đổi thành `$apiKeys[$index]->api_key`. Di chuyển Redis write ra ngoài transaction |
| H4 | ZingProxy: query ApiKey **2 nguồn** (`ApiKey::where()` + `$order->apiKeys`) — chưa fix như MktProxy | `ZingProxyRotatingProcessor.php:22,42` | Bỏ `ApiKey::where()`, dùng `$order->apiKeys` duy nhất |
| H5 | Config errors (Invalid template body, Missing ApiKey...) return false **không gọi** failOrderWithRefund → PlaceOrder safety net retry 3 lần vô ích | Tất cả processors | Dùng `failOrderWithoutRetry()` cho config errors |
| H6 | `handleProcessorFailure` log `from_status=processing` nhưng order có thể vẫn PENDING | `PlaceOrder.php:190` | Lấy `$order->status` thực tế thay vì hardcode |
| H7 | `finalizeOrder()` ghi MongoDB (`logOrderStatus`) trong DB::transaction → không rollback được | `BasePartner::finalizeOrder()` | Di chuyển log ra ngoài transaction hoặc dùng `DB::afterCommit()` |
| H8 | "All keys have proxies" shortcut không set `delivered_quantity` | `PlaceOrder.php:119-131` | Thêm `delivered_quantity = quantity` trong shortcut |

### MEDIUM — Logic/Data không đúng nhưng không mất tiền

| # | Mô tả | File | Ghi chú |
|---|-------|------|---------|
| M1 | UpproxyPartner: `$setupTime = null` → `price * null * quantity = 0` (đơn miễn phí) | `UpproxyPartner.php:25-38` | Thêm early return khi `$setupTime` null như các partner khác |
| M2 | Factory thiếu partner: `ProxyPartnerFactory` thiếu Upproxy, `ProxyStaticFactory` thiếu ProxyVN | 2 factory files | Thêm mapping vào factory |
| M3 | FetchPendingOrders recover stuck PROCESSING → không reset retry count → hao retry vô ích | `FetchPendingOrders.php:73` | Cân nhắc giữ nguyên retry hoặc trừ 1 khi recover |
| M4 | HomeProxyStaticProcessor: `$emptyApiKeys[$index]` truy cập trực tiếp, không bounds check | `HomeProxyStaticProcessor.php:166` | Thêm `?? null` + guard như các processor khác |
| M5 | ProxyVnRotating: `$itemFromApi['keyxoay']` không null check | `ProxyVnRotatingProcessor.php:119` | Thêm `$itemFromApi['keyxoay'] ?? null` + skip nếu null |
| M6 | ZingProxy: protocol luôn lưu `'HTTP'` dù user chọn socks5 | `ZingProxyRotatingProcessor.php:114` | Dùng `$firstApiKey->protocol` để set key trong `proxys` |
| M7 | `buyProxyStatic`: `days` chỉ validate `required`, thiếu `integer\|min:1\|max:30` | `ProxyController.php:303` | Thêm validation |
| M8 | UpproxyStaticPartner: hardcoded 30 ngày, bỏ qua `$dataBody['days']` | `UpproxyStaticPartner.php:40,61` | Dùng `$dataBody['days']` thay vì hardcode |
| M9 | `$bodyApi === null && json_last_error()` logic khó hiểu, null `api_body` lọt qua | Tất cả processors | Đổi thành check `empty($bodyApi)` rõ ràng hơn |
| M10 | HomeProxy processors: deep nested access (`$data['products'][0]['order']['id']`, `$proxyData['ipaddress']['ip']`...) không null-safe | `HomeProxyStatic/RotatingProcessor` | Thêm null check hoặc data_get() |
| M11 | ProxyVnRotating: `str_replace('&', '&&', $query)` → Guzzle có thể parse sai query string | `ProxyVnRotatingProcessor.php:69` | Verify với ProxyVN API docs, cân nhắc truyền array thay string |

### LOW — Code quality / edge cases hiếm

| # | Mô tả | File |
|---|-------|------|
| L1 | `str_shuffle + time()` trong batch insert loop → collision risk nhỏ trong cùng 1 giây | Tất cả Partner `buy()` files |
| L2 | `decodeBrokenJson` có thể mask lỗi JSON thật từ partner | `BasePartner.php:224-251` |
| L3 | Thiếu null check cho relationship chains (`$order->type_servi->partner`) | Tất cả processors |
| L4 | Dead code: UpProxyStaticProcessor check `status == failed` (PlaceOrder đã filter trước) | `UpProxyStaticProcessor.php:20-22` |
| L5 | UpProxyStaticProcessor: `$bodyApi ?? ''` rồi check `=== null` → dead code | `UpProxyStaticProcessor.php:24-28` |
| L6 | ProxyController: `getProxyRotating`, `getProxyNew`, `getProxyCurrent` switch thiếu `default` case → return null | `ProxyController.php` |
| L7 | Unused import `use Psr7\build` | `ProxyController.php:6` |
| L8 | HomeProxy processors: `$body`/`$durationMs` = null khi log success trên retry path | `HomeProxyRotating/StaticProcessor` |
| L9 | `stopwaitsecs=30` trong supervisor vs partner API có thể chạy >30s → worker bị kill giữa chừng | `orders-partner.conf:13` |

---

### Chưa review kỹ — Cần kiểm tra thêm

Các phần dưới đây nằm ngoài scope "flow mua proxy" nhưng có thể có vấn đề tương tự:

| # | Phần | Files chính | Cần check |
|---|------|-------------|-----------|
| R1 | **CheckProxyStatus** (logic hết hạn) | `CheckProxyStatus.php` | Có cover đủ status `in_use`, `in_use_partial`, `partial_refunded` không? Edge case khi expired_at null? |
| R2 | **Flow gia hạn proxy** (renew/extend) | `ProxyController` renew methods, Partner renew logic | Transaction safety, lock, tính giá gia hạn, update expired_at |
| R3 | **Admin retry/refund** | `SupportTicketController::retryPartialOrder`, `refundPartialOrder` | Race condition khi admin bấm 2 lần? Refund amount đúng chưa? |
| R4 | **getProxy\* endpoints** | `ProxyController::getProxyRotating/New/Current` | Null safety (C4 đã phát hiện 1), switch thiếu default (L6), cache invalidation |
| R5 | **Partner Services** | `HomeProxyService`, `ZingProxyService`, `MktProxyService`, `ProxyVnService` | Timeout config, retry logic, error handling, response parsing |
| R6 | **Affiliate commission** | `AffiliateController`, logic tính hoa hồng khi mua proxy | Tính đúng % chưa? Race condition trùng commission? |
| R7 | **Flow nạp tiền** (deposit/payment) | `BankQrController`, `DepositService`, pay2s webhook | Webhook idempotency, double-credit, QR expiry |
| R8 | **Dongtien recording** | Tạo record `dongtien` khi mua/gia hạn/refund | Có ghi đúng type, amount, balance before/after? Missing records? |

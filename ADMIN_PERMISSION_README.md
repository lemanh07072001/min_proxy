# Hướng dẫn sử dụng chức năng phân quyền Admin

## Tổng quan

Hệ thống đã được tích hợp chức năng phân quyền để hiển thị menu admin cho user có quyền admin. Chức năng này bao gồm:

1. **Hook kiểm tra quyền admin** - `useAdminPermission`
2. **Menu admin động** - Hiển thị menu admin khi user có quyền
3. **Middleware bảo vệ route** - Bảo vệ các route admin
4. **Trang admin cơ bản** - Dashboard và quản lý user

## Cách hoạt động

### 1. Kiểm tra quyền Admin

```typescript
import { useAdminPermission } from '@/hooks/useAdminPermission'

const { isAdmin, isLoading, userRole, hasPermission } = useAdminPermission()
```

**Các role được coi là admin:**
- `admin`
- `super_admin` 
- `administrator`

### 2. Menu Admin tự động hiển thị

Menu admin sẽ tự động hiển thị trong `VerticalMenu` khi:
- User đã đăng nhập
- User có role admin
- Không đang trong quá trình loading

### 3. Bảo vệ Route Admin

Middleware sẽ tự động:
- Kiểm tra quyền admin cho tất cả route chứa `/admin`
- Redirect về `/unauthorized` nếu không có quyền
- Log thông tin truy cập không hợp lệ

## Cấu trúc Menu Admin

Menu admin bao gồm các chức năng chính:

### Dashboard Admin
- Tổng quan hệ thống
- Thống kê cơ bản
- Hoạt động gần đây

### Quản lý User
- Danh sách User
- Thêm User mới
- Phân quyền User

### Quản lý Proxy
- Danh sách Proxy
- Thêm Proxy mới
- Cấu hình Proxy

### Quản lý Đơn hàng
- Tất cả đơn hàng
- Đơn hàng chờ xử lý
- Lịch sử giao dịch

### Báo cáo & Thống kê
- Báo cáo doanh thu
- Thống kê user
- Thống kê proxy

### Hệ thống
- Cấu hình hệ thống
- Backup dữ liệu
- Logs hệ thống

### Bảo mật
- Quản lý API Keys
- Audit Logs
- Cài đặt bảo mật

### Cài đặt
- Cài đặt chung
- Cài đặt email
- Cài đặt thanh toán

## Cách sử dụng

### 1. Kiểm tra quyền trong component

```typescript
'use client'
import { useAdminPermission } from '@/hooks/useAdminPermission'

export default function MyComponent() {
  const { isAdmin, isLoading } = useAdminPermission()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAdmin) {
    return <div>Không có quyền truy cập</div>
  }

  return (
    <div>
      {/* Nội dung admin */}
    </div>
  )
}
```

### 2. Kiểm tra quyền cụ thể

```typescript
import { useAdminRole } from '@/hooks/useAdminPermission'

export default function UserManagement() {
  const canManageUsers = useAdminRole('user_management')
  
  if (!canManageUsers) {
    return <div>Không có quyền quản lý user</div>
  }

  return <UserManagementContent />
}
```

### 3. Tạo trang admin mới

1. Tạo file trong thư mục `src/app/[lang]/(private)/(client)/admin/`
2. Sử dụng `useAdminPermission` để kiểm tra quyền
3. Thêm route vào menu admin trong `VerticalMenu.tsx`

## Cấu hình Backend

Để chức năng hoạt động đúng, backend cần trả về role trong response login:

```json
{
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin"  // ← Quan trọng: role phải có trong response
  },
  "access_token": "...",
  "expires_in": 3600
}
```

## Bảo mật

1. **Client-side**: Hook `useAdminPermission` chỉ để hiển thị UI
2. **Server-side**: Middleware bảo vệ route admin
3. **API**: Cần kiểm tra quyền ở backend cho tất cả API admin

## Mở rộng

### Thêm role mới

1. Cập nhật logic trong `useAdminPermission.tsx`
2. Thêm role vào middleware
3. Cập nhật menu admin nếu cần

### Thêm quyền cụ thể

```typescript
// Trong useAdminPermission.tsx
case 'new_permission':
  return userRole === 'admin' || userRole === 'super_admin'
```

### Thêm trang admin mới

1. Tạo component trong thư mục admin
2. Thêm vào menu trong `VerticalMenu.tsx`
3. Cập nhật `MenuAdminPage.ts` nếu cần

## Troubleshooting

### Menu admin không hiển thị
1. Kiểm tra user có role admin không
2. Kiểm tra session có đúng không
3. Kiểm tra console log để debug

### Lỗi 401 khi truy cập admin
1. Kiểm tra token có hợp lệ không
2. Kiểm tra middleware có hoạt động không
3. Kiểm tra role trong session

### Redirect loop
1. Kiểm tra middleware logic
2. Kiểm tra route `/unauthorized` có tồn tại không
3. Kiểm tra NextAuth config

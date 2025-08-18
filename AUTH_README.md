# Hệ thống Authentication với NextAuth.js và Laravel

## Tổng quan

Hệ thống authentication hoàn chỉnh sử dụng:
- **Frontend**: Next.js 15 + NextAuth.js
- **Backend**: Laravel API
- **Authentication**: JWT tokens với refresh token
- **UI**: Tailwind CSS

## Tính năng

### ✅ Đã hoàn thành
- [x] Đăng nhập (Login)
- [x] Đăng ký (Register)
- [x] Đăng xuất (Logout)
- [x] Quên mật khẩu (Forgot Password)
- [x] Reset mật khẩu (Reset Password)
- [x] Refresh token
- [x] Protected routes
- [x] Guest routes
- [x] Session management
- [x] Dashboard đơn giản

### 🔄 Đang phát triển
- [ ] Email verification
- [ ] Social login (Google, Facebook)
- [ ] Two-factor authentication
- [ ] Role-based access control

## Cấu trúc thư mục

```
src/
├── app/
│   ├── api/auth/
│   │   ├── [...nextauth]/route.ts    # NextAuth configuration
│   │   ├── register/route.ts         # Registration API
│   │   ├── refresh/route.ts          # Token refresh API
│   │   ├── forgot-password/route.ts  # Forgot password API
│   │   └── reset-password/route.ts   # Reset password API
│   ├── auth/
│   │   ├── login/page.tsx            # Login page
│   │   ├── register/page.tsx         # Register page
│   │   ├── forgot-password/page.tsx  # Forgot password page
│   │   └── reset-password/page.tsx   # Reset password page
│   └── dashboard/page.tsx            # Protected dashboard
├── components/
│   └── auth/
│       ├── ProtectedRoute.tsx        # Route protection component
│       └── GuestRoute.tsx            # Guest route component
├── hooks/
│   └── useAuth.ts                    # Custom authentication hook
├── configs/
│   └── auth.ts                       # Authentication configuration
└── types/
    └── next-auth.d.ts                # NextAuth type definitions
```

## Cài đặt

### 1. Dependencies

```bash
npm install next-auth @auth/core @auth/prisma-adapter prisma @prisma/client bcryptjs jsonwebtoken
```

### 2. Environment Variables

Tạo file `.env.local` với các biến sau:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-here-change-in-production
NEXTAUTH_URL=http://localhost:3000

# Laravel API Configuration
LARAVEL_API_URL=http://localhost:8000
```

### 3. Cấu hình NextAuth

File `src/app/api/auth/[...nextauth]/route.ts` đã được cấu hình sẵn để kết nối với Laravel API.

## Sử dụng

### 1. Bảo vệ route

```tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function MyPage() {
  return (
    <ProtectedRoute>
      <div>Nội dung được bảo vệ</div>
    </ProtectedRoute>
  );
}
```

### 2. Guest route

```tsx
import { GuestRoute } from '@/components/auth/GuestRoute';

export default function LoginPage() {
  return (
    <GuestRoute>
      <div>Chỉ hiển thị cho khách</div>
    </GuestRoute>
  );
}
```

### 3. Sử dụng hook useAuth

```tsx
import { useAuth } from '@/hooks/useAuth';

export default function MyComponent() {
  const { 
    session, 
    isAuthenticated, 
    login, 
    logout, 
    loading, 
    error 
  } = useAuth();

  // Sử dụng các function và state
}
```

## API Endpoints

### Laravel API (Backend)

Cần implement các endpoint sau trong Laravel:

```php
// routes/api.php
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});
```

### Next.js API (Frontend)

Các API route đã được tạo sẵn trong `src/app/api/auth/`.

## Luồng hoạt động

### 1. Đăng nhập
1. User nhập email/password
2. Frontend gọi NextAuth signIn
3. NextAuth gọi Laravel API
4. Laravel xác thực và trả về JWT tokens
5. NextAuth lưu tokens vào session
6. Redirect đến dashboard

### 2. Refresh Token
1. Access token hết hạn
2. Frontend gọi API refresh
3. Laravel xác thực refresh token
4. Trả về access token mới
5. Cập nhật session

### 3. Bảo vệ Route
1. Component ProtectedRoute kiểm tra session
2. Nếu chưa đăng nhập → redirect đến login
3. Nếu đã đăng nhập → hiển thị nội dung

## Bảo mật

- JWT tokens với expiration time
- Refresh token rotation
- CSRF protection
- Secure HTTP-only cookies
- Input validation
- Rate limiting (cần implement trong Laravel)

## Testing

### 1. Chạy development server

```bash
npm run dev
```

### 2. Test các route

- `/auth/login` - Trang đăng nhập
- `/auth/register` - Trang đăng ký
- `/auth/forgot-password` - Trang quên mật khẩu
- `/dashboard` - Dashboard (cần đăng nhập)

## Troubleshooting

### Lỗi thường gặp

1. **NEXTAUTH_SECRET not set**
   - Đảm bảo đã set NEXTAUTH_SECRET trong .env.local

2. **Laravel API connection failed**
   - Kiểm tra LARAVEL_API_URL
   - Đảm bảo Laravel server đang chạy

3. **CORS issues**
   - Cấu hình CORS trong Laravel
   - Thêm domain frontend vào allowed origins

## Đóng góp

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## License

MIT License

# Hướng dẫn sử dụng chức năng Reset Token với Laravel JWT

## Tổng quan

Chức năng reset token đã được cải thiện để hoạt động tốt với NextAuth và Axios cho backend Laravel JWT. Hệ thống sẽ tự động xử lý việc refresh token, reset token và logout một cách an toàn.

## Các cải tiến đã thực hiện

### 1. **Sửa lỗi trong `src/libs/auth.ts`**
- ✅ Cải thiện function `resetToken()` để xóa hoàn toàn token data
- ✅ Thêm cleanup token trong event `signOut`
- ✅ Tối ưu hóa Laravel JWT refresh logic

### 2. **Sửa lỗi trong `src/libs/tokenUtils.ts`**
- ✅ Sửa lỗi thiếu `token.access_token` trong Authorization header
- ✅ Thêm function `resetTokenManually()` với Laravel logout API
- ✅ Thêm hook `useTokenReset()` để sử dụng trong components
- ✅ Cải thiện error handling và logging

### 3. **Cải thiện `src/hocs/useAxiosAuth.tsx`**
- ✅ Thêm logging chi tiết cho việc xử lý 401 errors
- ✅ Cải thiện logic xử lý token refresh
- ✅ Thêm error handling tốt hơn

### 4. **Tạo component test `src/components/debug/TokenResetTest.tsx`**
- ✅ Component để test các chức năng reset token
- ✅ Kiểm tra trạng thái token
- ✅ Test các phương thức reset khác nhau

## Cách sử dụng

### 1. **Sử dụng hook `useTokenReset`**

```tsx
import { useTokenReset } from '@/libs/tokenUtils'

function MyComponent() {
  const { resetToken } = useTokenReset()
  
  const handleResetToken = async () => {
    await resetToken() // Sẽ gọi Laravel logout API và redirect về login
  }
  
  return (
    <button onClick={handleResetToken}>
      Reset Token
    </button>
  )
}
```

### 2. **Sử dụng hook `useTokenRefresh`**

```tsx
import { useTokenRefresh } from '@/libs/tokenUtils'

function MyComponent() {
  const { refreshToken } = useTokenRefresh()
  
  const handleRefreshToken = async () => {
    await refreshToken() // Sẽ refresh token thông qua NextAuth
  }
  
  return (
    <button onClick={handleRefreshToken}>
      Refresh Token
    </button>
  )
}
```

### 3. **Kiểm tra trạng thái token**

```tsx
import { checkTokenStatus } from '@/libs/tokenUtils'

const checkToken = async () => {
  const status = await checkTokenStatus()
  console.log('Token valid:', status.isValid)
  console.log('Expires at:', new Date(status.expiresAt))
  console.log('Time left:', status.timeLeft)
}
```

### 4. **Sử dụng component test**

```tsx
import TokenResetTest from '@/components/debug/TokenResetTest'

function DebugPage() {
  return <TokenResetTest />
}
```

## Các tính năng chính

### 🔄 **Auto Token Refresh**
- Token tự động refresh khi gần hết hạn
- Sử dụng Laravel JWT refresh endpoint
- Xử lý lỗi khi refresh thất bại
- Fallback về logout khi không thể refresh

### 🚪 **Manual Token Reset**
- Reset token thủ công khi cần thiết
- Gọi Laravel logout API để invalidate token
- Xóa hoàn toàn session data
- Redirect về trang login

### 🛡️ **Error Handling**
- Xử lý 401 errors từ Laravel API
- Retry request với token mới
- Graceful fallback khi token không hợp lệ
- Chi tiết logging để debug

### 📊 **Token Status Monitoring**
- Kiểm tra trạng thái token real-time
- Hiển thị thời gian hết hạn
- Cảnh báo khi token sắp hết hạn

## Cấu hình Laravel Backend

### Environment Variables
```env
NEXT_PUBLIC_API_URL=https://api.minhan.online
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Laravel API Endpoints cần có:
- `POST /login` - Đăng nhập và trả về JWT token
- `POST /refresh` - Refresh JWT token (sử dụng token cũ)
- `POST /logout` - Đăng xuất và invalidate token
- `POST /me` - Lấy thông tin user hiện tại

### NextAuth Configuration
- Sử dụng JWT strategy
- Tự động refresh token với Laravel
- Cleanup token khi logout

## Luồng hoạt động

### 1. **Login Flow**
```
User Login → Laravel /login → NextAuth → Store JWT Token
```

### 2. **Token Refresh Flow**
```
Token Expired → NextAuth Callback → Laravel /refresh → Update Token
```

### 3. **Reset Token Flow**
```
Manual Reset → Laravel /logout → NextAuth signOut → Redirect to Login
```

### 4. **Auto Logout Flow**
```
401 Error → Try Refresh → Failed → Auto Logout → Redirect to Login
```

## Troubleshooting

### Lỗi thường gặp:

1. **Token không refresh được**
   - Kiểm tra Laravel `/refresh` endpoint
   - Kiểm tra headers Authorization
   - Xem console logs để debug

2. **Infinite redirect loop**
   - Kiểm tra logic trong `useAxiosAuth`
   - Đảm bảo `isSigningOut` ref hoạt động đúng

3. **Session không cập nhật**
   - Sử dụng `updateSession()` từ NextAuth
   - Kiểm tra callback trong `auth.ts`

4. **Laravel logout không hoạt động**
   - Kiểm tra Laravel `/logout` endpoint
   - Đảm bảo token được gửi đúng trong header

## Testing

Sử dụng component `TokenResetTest` để test các chức năng:

1. **Check Token Status** - Kiểm tra trạng thái token
2. **Test Token Refresh** - Test refresh token với Laravel
3. **Test Session Update** - Test cập nhật session
4. **Test Manual Reset** - Test reset với Laravel logout
5. **Test NextAuth SignOut** - Test logout NextAuth

## Best Practices

1. **Luôn kiểm tra token status** trước khi gọi API quan trọng
2. **Sử dụng error boundaries** để xử lý lỗi authentication
3. **Log các hoạt động token** để debug dễ dàng
4. **Test thoroughly** với component debug
5. **Handle edge cases** như network errors, server downtime
6. **Đảm bảo Laravel API endpoints** hoạt động đúng

## API Endpoints

### Laravel Backend API:
- `POST /login` - Đăng nhập
- `POST /refresh` - Refresh token
- `POST /logout` - Đăng xuất
- `POST /me` - Lấy thông tin user

### NextAuth API:
- `GET /api/auth/session` - Lấy session
- `POST /api/auth/signout` - Đăng xuất
- `GET /api/auth/csrf` - CSRF token

## Security Notes

1. **JWT Token Security**: Đảm bảo Laravel JWT được cấu hình bảo mật
2. **HTTPS Only**: Sử dụng HTTPS cho tất cả API calls
3. **Token Expiration**: Thiết lập thời gian hết hạn hợp lý
4. **Refresh Token**: Sử dụng refresh token để bảo mật cao hơn
5. **Logout Invalidation**: Đảm bảo token bị invalidate khi logout


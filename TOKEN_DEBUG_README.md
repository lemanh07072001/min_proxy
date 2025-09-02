# Token Debug Guide - Giải quyết vấn đề API /me không lấy được token

## Vấn đề đã được xác định

**Nguyên nhân chính:** API `/me` lần thứ 2 không lấy được token do:
1. **Lỗi 401 Unauthorized** - Token không được gửi đúng cách hoặc đã hết hạn
2. **Backend Laravel với JWT authentication** - Có thể có vấn đề về endpoint hoặc method
3. Token refresh không hoạt động đúng cách
4. Session không được cập nhật sau khi refresh
5. Interceptor không nhận được token mới

## Vấn đề chính: Lỗi 401 Unauthorized với Laravel Backend

### Vấn đề hiện tại:
- Code gọi `axiosAuth.post('me')` 
- **Token đã được gửi trong header** ✅
- Nhưng vẫn nhận được lỗi: `POST https://api.minhan.online/api/me 401 (Unauthorized)`
- **Backend: Laravel với JWT authentication**

### Laravel Backend Response Format:
```php
protected function respondWithToken($token)
{
  return response()->json([
    'access_token' => $token,        // ← Laravel trả về access_token
    'token_type' => 'bearer',
    'expires_in' => auth('api')->factory()->getTTL() * 60,
    'user' => [
      'name' => auth('api')->user()->name,
      'email' => auth('api')->user()->email,
      'sodu' => auth('api')->user()->sodu,  // ← Balance từ Laravel
    ]
  ]);
}
```

### Nguyên nhân có thể (Laravel backend side):
1. **Endpoint path không đúng**
   - Laravel có thể sử dụng `/me` thay vì `/api/me`
   - Có thể cần version trong path: `/api/v1/me`

2. **HTTP Method không đúng**
   - Laravel có thể chỉ chấp nhận GET thay vì POST
   - Hoặc ngược lại

3. **Laravel Guard/Middleware**
   - Có thể cần `auth:api` middleware
   - Có thể cần thêm middleware khác

4. **Token validation lỗi ở Laravel**
   - Token đã hết hạn (Laravel side)
   - Token không hợp lệ
   - Laravel có bug trong việc validate JWT

5. **Laravel yêu cầu headers khác**
   - Có thể cần `Accept: application/json`
   - Có thể cần `User-Agent` header
   - Có thể cần custom headers

## Các thay đổi đã thực hiện

### 1. Cải thiện `auth.ts` cho Laravel
- Xử lý đúng `data.access_token` từ Laravel response
- Thêm `data.user.sodu` vào userData
- Xử lý `data.expires_in` từ Laravel

### 2. Cải thiện `useAxiosAuth.tsx`
- **Xóa interceptor xung đột** từ `axios.ts`
- Thêm logging chi tiết để debug token
- Cải thiện logic xử lý 401 errors

### 3. Tạo SessionDebug component cho Laravel
- Component để debug session và token
- Test API `/me` trực tiếp với Laravel
- Hiển thị thông tin sodu (balance) từ Laravel
- Test với GET vs POST methods

## Cách sử dụng để debug Laravel Backend

### 1. Thêm SessionDebug component vào trang
```tsx
import SessionDebug from '@/components/debug/SessionDebug'
<SessionDebug />
```

### 2. Kiểm tra Laravel backend logs
1. Mở Laravel logs: `storage/logs/laravel.log`
2. Gọi API và quan sát logs
3. Tìm lỗi authentication hoặc middleware

### 3. Test với các HTTP methods khác nhau
1. **Test POST method** (như hiện tại)
2. **Test GET method** (có thể Laravel chỉ chấp nhận GET)
3. **So sánh kết quả** giữa 2 methods

### 4. Kiểm tra Laravel routes
1. Kiểm tra `routes/api.php` trong Laravel
2. Xem endpoint `/me` có được định nghĩa không
3. Kiểm tra middleware được áp dụng

## Các bước kiểm tra Laravel Backend

### Bước 1: Kiểm tra Laravel routes
```php
// routes/api.php
Route::middleware('auth:api')->group(function () {
    Route::get('/me', 'UserController@me');      // ← Có thể chỉ có GET
    Route::post('/me', 'UserController@me');     // ← Có thể không có POST
});
```

### Bước 2: Kiểm tra Laravel middleware
```php
// app/Http/Kernel.php
protected $routeMiddleware = [
    'auth' => \App\Http\Middleware\Authenticate::class,
    'auth:api' => \App\Http\Middleware\Authenticate::class,
];
```

### Bước 3: Kiểm tra Laravel JWT config
```php
// config/auth.php
'guards' => [
    'api' => [
        'driver' => 'jwt',
        'provider' => 'users',
    ],
],
```

## Các trường hợp có thể xảy ra với Laravel

### Trường hợp 1: GET method hoạt động, POST không
- **Nguyên nhân:** Laravel chỉ định nghĩa GET route
- **Giải pháp:** Thay đổi từ `axiosAuth.post('me')` sang `axiosAuth.get('me')`

### Trường hợp 2: Endpoint path khác
- **Nguyên nhân:** Laravel sử dụng `/me` thay vì `/api/me`
- **Giải pháp:** Thay đổi URL endpoint

### Trường hợp 3: Laravel middleware lỗi
- **Nguyên nhân:** `auth:api` middleware không hoạt động
- **Giải pháp:** Kiểm tra Laravel logs và middleware config

### Trường hợp 4: JWT token validation lỗi
- **Nguyên nhân:** Laravel JWT package có vấn đề
- **Giải pháp:** Kiểm tra JWT config và logs

## Troubleshooting Laravel Backend

### Nếu vẫn gặp lỗi 401:

1. **Kiểm tra Laravel logs:**
   ```bash
   tail -f storage/logs/laravel.log
   ```

2. **Kiểm tra Laravel routes:**
   ```bash
   php artisan route:list --path=me
   ```

3. **Kiểm tra JWT config:**
   ```bash
   php artisan config:show auth
   ```

4. **Test Laravel API trực tiếp:**
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        -H "Accept: application/json" \
        https://api.minhan.online/api/me
   ```

5. **Kiểm tra Laravel middleware:**
   - Xem `auth:api` middleware có được áp dụng không
   - Xem có middleware nào khác chặn request không

## Kết luận

**Vấn đề đã được xác định:**
- ✅ Token được gửi đúng cách
- ✅ Frontend hoạt động đúng
- ❌ **Laravel backend không chấp nhận token** (lỗi 401)

**Cần debug Laravel backend:**
1. **Sử dụng SessionDebug component** để test chi tiết
2. **Kiểm tra Laravel logs** để xem lỗi gì
3. **Kiểm tra Laravel routes** để xem endpoint có tồn tại không
4. **Thử các HTTP methods khác nhau** (GET vs POST)
5. **Kiểm tra Laravel middleware** và JWT config

**Giải pháp có thể:**
- Thay đổi HTTP method (GET thay vì POST)
- Thay đổi endpoint path (`/me` thay vì `/api/me`)
- Kiểm tra Laravel `auth:api` middleware
- Kiểm tra JWT configuration
- Thêm headers cần thiết cho Laravel

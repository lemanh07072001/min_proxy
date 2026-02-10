# 📋 Yêu Cầu API - Trang Affiliate

## Tổng Quan
Trang affiliate cần 3 API endpoints chính để hiển thị thông tin về hoa hồng và lịch sử đơn hàng.

---

## 🎯 API Endpoints Cần Thiết

### 1. **GET /get-affiliate** ✅ (Đã có)
**Mục đích:** Lấy thông tin tổng quan về affiliate của user

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "total": 1500000,           // Tổng thu nhập tháng này (VNĐ)
  "affiliate_percent": 10      // Phần trăm hoa hồng (%)
}
```

---

### 2. **GET /withdrawal-user** ✅ (Đã có)
**Mục đích:** Lấy danh sách người dùng được giới thiệu và tổng hoa hồng từ họ

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
[
  {
    "created_at": "2026-01-15T10:30:00Z",
    "email": "user1@example.com",
    "tong_don_hang": 5000000,     // Tổng giá trị đơn hàng từ user này
    "tong_don": 10                 // Tổng số đơn hàng từ user này
  },
  {
    "created_at": "2026-01-20T14:20:00Z",
    "email": "user2@example.com",
    "tong_don_hang": 3000000,
    "tong_don": 5
  }
]
```

**Tính toán:**
- Hoa hồng = `tong_don_hang * 10 / 100`
- VD: User1 → Hoa hồng = 5,000,000 × 10% = 500,000 VNĐ

---

### 3. **GET /order-history-affiliate** ✅ (ĐÃ IMPLEMENT)
**Mục đích:** Lấy danh sách chi tiết các đơn hàng từ tất cả user được giới thiệu

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
```
Không có - Backend tự động lấy user_id từ token
```

**Use Case:**

**Khi user click nút "Xem chi tiết" (Eye icon):**
```
GET /order-history-affiliate
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "order_id": "ORD-260210-ABC123",
    "created_at": "2026-01-15T10:30:00.000000Z",
    "customer_email": "user1@example.com",
    "order_value": 500000,           // Giá trị đơn hàng (VNĐ)
    "status": "in_use"               // "completed" | "in_use" | "pending" | "cancelled" | "expired"
  },
  {
    "order_id": "ORD-260210-DEF456",
    "created_at": "2026-01-16T14:20:00.000000Z",
    "customer_email": "user1@example.com",
    "order_value": 300000,
    "status": "completed"
  },
  {
    "order_id": "ORD-260210-GHI789",
    "created_at": "2026-01-17T09:15:00.000000Z",
    "customer_email": "user2@example.com",
    "order_value": 200000,
    "status": "cancelled"
  }
]
```

**Lưu ý:**
- Backend tự động filter theo user_id từ Bearer token
- Chỉ trả về đơn hàng của những user được giới thiệu bởi user hiện tại
- Frontend sẽ filter theo email trên client-side khi cần xem chi tiết 1 user
- Status mapping (from backend STATUS_TEXT_MAP):
  - `pending` (0) → Đang xử lý ⏳
  - `in_use` (1) → Đang sử dụng 🔵
  - `completed` (2) → Đơn hàng hoàn thành ✅ (tính hoa hồng)
  - `partial_complete` (3) → Hoàn thành 1 phần ✅ (tính hoa hồng)
  - `full_complete` (4) → Hoàn thành toàn bộ ✅ (tính hoa hồng)
  - `cancelled` (5) → Đã hủy ❌ (không tính hoa hồng)

---

## 🔄 Luồng Hoạt Động (User Flow)

### Bước 1: Xem tổng quan
User vào trang `/affiliate` → Frontend gọi:
```
GET /get-affiliate
GET /withdrawal-user
```

### Bước 2: Xem danh sách người được giới thiệu
Hiển thị table với các cột:
- Ngày
- Email
- Tổng giá trị đơn hàng
- Số đơn hàng
- Hoa hồng nhận được (tính = tong_don_hang × 10%)
- Thao tác (2 buttons: Eye & Wallet)

### Bước 3: Click "Xem chi tiết" (Eye icon)
User click vào email: `user1@example.com` → Frontend gọi:
```
GET /order-history-affiliate?email=user1@example.com
```

→ Hiển thị table "Lịch sử đơn hàng" với các đơn của user đó

### Bước 4: Quay lại
User click "Quay lại lịch sử hoa hồng" → Quay về bảng tổng hợp

---

## 📊 Ví Dụ Minh Họa

**Scenario:**
- User A (affiliate) giới thiệu được 3 người: user1@, user2@, user3@
- user1@ mua 10 đơn hàng, tổng giá trị 5,000,000 VNĐ
- user2@ mua 5 đơn hàng, tổng giá trị 3,000,000 VNĐ

**Bảng "Lịch sử hoa hồng" hiển thị:**
```
┌────────────────┬──────────────────┬──────────────┬────────────┬──────────────┐
│ Email          │ Tổng giá trị ĐH  │ Số đơn hàng  │ Hoa hồng   │ Thao tác     │
├────────────────┼──────────────────┼────────────┼──────────────┼──────────────┤
│ user1@...      │ 5,000,000 đ      │ 10          │ 500,000 đ   │ [👁] [💰]    │
│ user2@...      │ 3,000,000 đ      │ 5           │ 300,000 đ   │ [👁] [💰]    │
└────────────────┴──────────────────┴────────────┴──────────────┴──────────────┘
```

**Click [👁] vào user1@ → Gọi:**
```
GET /order-history-affiliate?email=user1@example.com
```

**Hiển thị bảng "Lịch sử đơn hàng - user1@example.com":**
```
┌──────────────┬──────────────────┬──────────┬──────────────┬──────────────┐
│ Mã ĐH        │ Ngày đặt          │ Khách    │ Giá trị      │ Hoa hồng 10% │
├──────────────┼──────────────────┼──────────┼──────────────┼──────────────┤
│ ORD-001      │ 15/01 10:30       │ user1@   │ 500,000 đ    │ 50,000 đ     │
│ ORD-002      │ 16/01 14:20       │ user1@   │ 300,000 đ    │ 30,000 đ     │
│ ORD-003      │ 17/01 09:15       │ user1@   │ 200,000 đ    │ 20,000 đ     │
│ ...          │ ...               │ ...      │ ...          │ ...          │
└──────────────┴──────────────────┴──────────┴──────────────┴──────────────┘
```

---

## 🔐 Bảo Mật

1. **Authentication:** Tất cả endpoints đều cần Bearer token
2. **Authorization:** Chỉ trả về data của chính user đang đăng nhập
3. **Validation:**
   - Email parameter phải là email của user được user hiện tại giới thiệu
   - Không được query đơn hàng của user khác

---

## ⚡ Performance Notes

- API `/withdrawal-user` chỉ cần trả về summary (tổng hợp), không cần chi tiết từng đơn
- API `/order-history-affiliate` có thể có nhiều records → nên support pagination
- Suggest: Thêm pagination parameters:
  ```
  ?email=user@example.com&page=1&limit=10
  ```

---

## 📝 Testing Checklist

- [ ] `/get-affiliate` trả về đúng tổng thu nhập và % hoa hồng
- [ ] `/withdrawal-user` trả về list user được giới thiệu với tổng đơn hàng
- [ ] `/order-history-affiliate` không có email param → trả về tất cả đơn
- [ ] `/order-history-affiliate?email=xxx` → chỉ trả về đơn của user đó
- [ ] Không cho phép xem đơn hàng của user không phải do mình giới thiệu
- [ ] Status đơn hàng được map đúng (completed/pending/cancelled)

---

## 📞 Contact

Nếu có thắc mắc về API spec, liên hệ Frontend Team để clarify.

**Frontend Implementation:**
- File: `src/views/Client/Affiliate/OrderHistoryTable.tsx`
- API Hook: `useAxiosAuth`
- Query Key: `['order-history-affiliate', filterEmail]`

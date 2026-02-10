# 🇻🇳 YÊU CẦU API CHO TRANG AFFILIATE

## 📌 TÓM TẮT

Backend cần implement API để khi user **click nút "Xem chi tiết" (icon mắt 👁)** trên bảng "Lịch sử hoa hồng", sẽ hiển thị chi tiết tất cả đơn hàng của email user đó.

---

## 🎯 API CẦN THÊM

### **GET /order-history-affiliate** ✅

**Công dụng:** Lấy danh sách chi tiết TẤT CẢ đơn hàng từ user được giới thiệu

**Headers:**
```
Authorization: Bearer {token}
```

**Query Params:**
```
Không có - Backend tự động lấy user_id từ token
```

**Ví dụ request:**
```bash
GET /order-history-affiliate
Authorization: Bearer {token}
```

**Response thực tế từ Backend:**
```json
[
  {
    "order_id": "ORD-260210-ABC123",
    "created_at": "2026-01-15T10:30:00.000000Z",
    "customer_email": "user1@example.com",
    "order_value": 500000,
    "status": "in_use"
  },
  {
    "order_id": "ORD-260210-DEF456",
    "created_at": "2026-01-16T14:20:00.000000Z",
    "customer_email": "user1@example.com",
    "order_value": 300000,
    "status": "completed"
  }
]
```

**Các field trả về:**
- `order_id`: Mã đơn hàng (string) - Format: ORD-YYMMDD-XXXXXX
- `created_at`: Thời gian tạo đơn (ISO 8601 format với timezone)
- `customer_email`: Email khách hàng đặt đơn
- `order_value`: Giá trị đơn hàng (number, VNĐ)
- `status`: Trạng thái → **"pending"** | **"in_use"** | **"completed"** | **"partial_complete"** | **"full_complete"** | **"cancelled"**

---

## 🔄 LUỒNG HOẠT ĐỘNG

```
User vào trang Affiliate
    ↓
Xem bảng "Lịch sử hoa hồng" (tổng hợp theo email)
    ↓
Click nút 👁 "Xem chi tiết" ở row email "user1@example.com"
    ↓
Frontend gọi: GET /order-history-affiliate?email=user1@example.com
    ↓
Backend trả về: Danh sách TẤT CẢ đơn hàng của user1@example.com
    ↓
Hiển thị bảng "Lịch sử đơn hàng - user1@example.com"
```

---

## 📋 QUY TẮC LOGIC

1. **Chỉ trả về đơn hàng của user được giới thiệu bởi affiliate hiện tại**
   - Ví dụ: User A là affiliate
   - User A giới thiệu được user B, user C
   - API này CHỈ trả về đơn hàng của B, C
   - KHÔNG trả về đơn hàng của user khác

2. **Filter theo email:**
   - Backend trả về TẤT CẢ đơn hàng từ tất cả user được giới thiệu
   - Frontend sẽ filter theo email trên client-side khi user click "Xem chi tiết"

3. **Mapping Status:**
   - `pending` (0) → Đang xử lý ⏳
   - `in_use` (1) → Đang sử dụng 🔵
   - `completed` (2) → Đơn hoàn thành ✅ (tính hoa hồng)
   - `partial_complete` (3) → Hoàn thành 1 phần ✅ (tính hoa hồng)
   - `full_complete` (4) → Hoàn thành toàn bộ ✅ (tính hoa hồng)
   - `cancelled` (5) → Đã hủy ❌ (không tính hoa hồng)

---

## 💡 VÍ DỤ CỤ THỂ

### Dữ liệu giả định:
- **User Affiliate:** admin@mktproxy.com
- **User được giới thiệu:**
  - user1@gmail.com → 3 đơn hàng
  - user2@gmail.com → 2 đơn hàng

### Bảng "Lịch sử hoa hồng" hiển thị:

| Email | Tổng giá trị | Số đơn | Hoa hồng | Actions |
|-------|--------------|--------|----------|---------|
| user1@gmail.com | 1,000,000đ | 3 | 100,000đ | [👁 View] [💰] |
| user2@gmail.com | 500,000đ | 2 | 50,000đ | [👁 View] [💰] |

### Khi click [👁 View] ở row user1@gmail.com:

**Request:**
```
GET /order-history-affiliate?email=user1@gmail.com
```

**Response:**
```json
[
  {
    "order_id": "ORD-001",
    "created_at": "2026-01-15T10:30:00Z",
    "customer_email": "user1@gmail.com",
    "order_value": 500000,
    "status": "completed"
  },
  {
    "order_id": "ORD-002",
    "created_at": "2026-01-16T14:20:00Z",
    "customer_email": "user1@gmail.com",
    "order_value": 300000,
    "status": "completed"
  },
  {
    "order_id": "ORD-003",
    "created_at": "2026-01-17T09:15:00Z",
    "customer_email": "user1@gmail.com",
    "order_value": 200000,
    "status": "pending"
  }
]
```

**Bảng "Lịch sử đơn hàng - user1@gmail.com" hiển thị:**

| Mã ĐH | Ngày đặt | Khách hàng | Giá trị | Hoa hồng (10%) | Trạng thái |
|-------|----------|------------|---------|----------------|------------|
| ORD-001 | 15/01 10:30 | user1@gmail.com | 500,000đ | 50,000đ | ✅ Hoàn thành |
| ORD-002 | 16/01 14:20 | user1@gmail.com | 300,000đ | 30,000đ | ✅ Hoàn thành |
| ORD-003 | 17/01 09:15 | user1@gmail.com | 200,000đ | 20,000đ | ⏳ Đang xử lý |

---

## 🔐 BẢO MẬT

- ✅ Phải có Bearer token
- ✅ Chỉ trả về đơn hàng của user được affiliate hiện tại giới thiệu
- ❌ Không cho phép xem đơn hàng của user khác
- ❌ Không cho phép xem đơn hàng mà affiliate không giới thiệu

---

## ⚠️ LƯU Ý

1. **Hiệu suất:**
   - Nếu có nhiều đơn → cân nhắc thêm pagination
   - Suggest: `?email=xxx&page=1&limit=10`

2. **Validation:**
   - Email param phải validate
   - Phải kiểm tra email có phải do user hiện tại giới thiệu không

3. **Database Query:**
   ```sql
   -- Pseudo code
   SELECT orders.*
   FROM orders
   JOIN users ON orders.user_id = users.id
   WHERE users.referred_by = :current_user_id
     AND (users.email = :email_param OR :email_param IS NULL)
   ORDER BY orders.created_at DESC
   ```

---

## ✅ CHECKLIST

- [ ] API endpoint `/order-history-affiliate` đã tạo
- [ ] Support query param `?email=xxx`
- [ ] Chỉ trả về đơn của user được giới thiệu
- [ ] Status mapping đúng (completed/pending/cancelled)
- [ ] Response format đúng như spec
- [ ] Test với email có đơn hàng
- [ ] Test với email không có đơn hàng
- [ ] Test với email không hợp lệ (không phải do user giới thiệu)

---

## 📞 LIÊN HỆ

Có vấn đề gì ping Frontend Team để clarify nhé! 🚀

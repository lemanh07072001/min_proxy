---
name: Biến chuẩn Proxy — contract API site mẹ ↔ site con
description: Danh sách biến chuẩn cho sản phẩm Proxy + thiết kế params_mapping. KHÔNG ĐỔI TÊN sau khi deploy. Session riêng để implement.
type: project
---

## Biến chuẩn sản phẩm Proxy — CỐ ĐỊNH, KHÔNG ĐỔI TÊN

Contract giữa site mẹ ↔ site con ↔ NCC. Deploy xong thì **cấm đổi tên biến**.

### Biến hệ thống (tự động từ order, đã tồn tại trong code)

| Biến | Ý nghĩa | Nguồn | Tồn tại |
|------|---------|-------|---------|
| `protocol` | Giao thức proxy | OrderItem.protocol | ✅ 15+ files |
| `quantity` | Số lượng | order.quantity | ✅ quantity_param |
| `duration` | Thời hạn (ngày) | order.time | ✅ duration_param |
| `username` | Username proxy | metadata.custom_user | ✅ user_override |
| `password` | Password proxy | metadata.custom_pass | ✅ user_override |
| `allow_ips` | IP whitelist | metadata.allow_ips | ✅ ip_config |
| `auth_token` | Token API NCC | provider.token_api | ✅ auth_param |

### Biến sản phẩm (cố định per SP, thêm mới)

| Biến | Ý nghĩa | Ví dụ | Tồn tại |
|------|---------|-------|---------|
| `isp_code` | Mã nhà mạng | viettel, vnpt, fpt | ❌ MỚI |
| `connection_type` | Loại kết nối | 4g, fiber, datacenter | ❌ MỚI |
| `ip_version` | Phiên bản IP | ipv4, ipv6 | ✅ field trên ServiceType |
| `location` | Vùng/quốc gia | vn, us, hcm | ❌ MỚI |

**LƯU Ý:** `proxy_type` KHÔNG dùng — đã tồn tại trên order (STATIC/ROTATING), dùng lại sẽ nhầm lẫn.

### Thiết kế params_mapping

**params_mapping đặt ở NCC (provider level)** — cấu hình 1 lần, áp dụng tất cả SP:
```json
[
  { "variable": "protocol", "param": "type", "value_map": {"http":"HTTP","socks5":"SOCKS5"} },
  { "variable": "quantity", "param": "soluong" },
  { "variable": "duration", "param": "ngay" },
  { "variable": "username", "param": "user", "default": "random" },
  { "variable": "password", "param": "password", "default": "random" },
  { "variable": "auth_token", "param": "key" }
]
```

**param_overrides đặt ở SP** — chỉ giá trị KHÁC NCC mặc định:
```json
{ "loaiproxy": "4Gvinaphone" }
```

### Flow runtime
1. Lấy params mặc định NCC (api_config.buy.params)
2. Resolve params_mapping NCC → thay thế biến hệ thống vào params
3. Áp dụng param_overrides SP → ghi đè giá trị cố định per SP
4. Áp dụng custom_fields khách chọn (Layer 3 cũ, giữ nguyên)
5. Gửi NCC

### Backward compat
- SP/NCC chưa có params_mapping → flow cũ 100% (api_body + protocol_override + user_override + ip_config)
- Có params_mapping → dùng mapping, bỏ qua override cũ
- custom_fields (Layer 3) vẫn chạy sau cho cả 2

### FE admin
- NCC form: bảng mapping (biến chuẩn dropdown → param NCC input + value_map)
- SP form: hiện NCC mặc định gì → admin override giá trị nào → cảnh báo "⚠️ Thay đổi ảnh hưởng API đối tác"
- Biến chuẩn: dropdown cố định, không tự gõ

### ĐÃ IMPLEMENT BE (01/04/2026)
- GenericOrderProcessor: `resolveParamsMapping()` + `resolveVariable()`, per-variable skip config cũ
- DefaultHandler: per-variable skip auth query + duration_param
- Backward compat 100%: NCC chưa có params_mapping → zero impact

### ĐÃ IMPLEMENT FE (01/04/2026)
- Provider form: Step 6 "Params Mapping" trong BuyConfigSection
- Dropdown biến chuẩn cố định, value_map bảng 2 cột, default + format
- Alert warning config cũ bị thay khi biến được map
- Parse/build round-trip: value_map object↔array
- **Còn lại**: SP form hiện NCC mặc định + cho phép override

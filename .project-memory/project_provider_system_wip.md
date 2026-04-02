---
name: Provider System
description: Provider config-driven system — ĐÃ DEPLOY + UI admin hoàn chỉnh, test mua bestproxy OK
type: project
---

## ĐÃ DEPLOY — 20/03/2026

### Đã implement + deploy
- **GenericOrderProcessor**: config + handler driven, 1-step flow
- **Handler plugin system**: ProviderHandlerInterface → DefaultHandler → custom handler per provider
- **GenericBuyProvider**: xử lý mua proxy cho bất kỳ provider, dùng PricingService
- **ProviderFactory fallback**: auto detect api_config → GenericOrderProcessor
- **Admin Provider UI**: modal form trái + JSON preview phải
  - Tách buy_rotating / buy_static, duration_param, user_override, protocol_override
  - 3 response format: key, string, fields + item_id_field
  - Custom fields (tuỳ chọn mua hàng): UI builder + render dropdown khi mua
  - Auth options: user:pass + IP whitelist trong CheckoutModal
- **Cache invalidation**: Redis flag khi admin sửa provider config
- **Test thành công**: mua proxy tĩnh bestproxy.vn OK

### Bugs đã fix
- checkError: array_last_status phải check status != success_value (không chỉ == error_status cố định)
- Log chi tiết keys thực tế khi response thiếu field

### Cần làm thêm (tương lai)
1. **2-step flow**: GenericOrderProcessor chưa hỗ trợ provider async
2. **Test sandbox**: endpoint test gọi thử API provider trước khi activate
3. **Migrate provider cũ**: chuyển ProxyVn, HomeProxy... sang config-driven

---
name: Chuẩn hoá proxy object — ĐÃ IMPLEMENT
description: Proxy object format thống nhất {value, protocol, ip, port, user, pass}. ProxyFormat helper dùng chung. Backward compat data cũ + API response.
type: project
---

## ĐÃ IMPLEMENT (01/04/2026)

### Format chuẩn

```json
{
  "value": "ip:port:user:pass",
  "protocol": "socks5",
  "ip": "1.2.3.4",
  "port": "8080",
  "user": "abc",
  "pass": "xyz"
}
```

- `value` thay cho `http`/`socks5`/`HTTP`/`SOCKS5`
- `protocol` thay cho `loaiproxy`

### ProxyFormat helper (BE)

- `ProxyFormat::fromString($str, $protocol)` — tạo object chuẩn từ chuỗi
- `ProxyFormat::fromFields($ip, $port, $user, $pass, $protocol)` — tạo từ fields riêng
- `ProxyFormat::getValue($proxy)` — đọc value từ cả format cũ lẫn mới
- `ProxyFormat::getProtocol($proxy)` — đọc protocol từ cả format cũ lẫn mới

### FE utility (protocolProxy.ts)

- `extractProxyValue(proxys)` — đọc chuỗi proxy chính
- `extractProtocol(proxys)` — đọc protocol
- `getProxyString(item, protocol?)` — cho export

### Backward compat

- Data cũ trong DB: FE/BE utility fallback đọc `http`/`socks5`/`loaiproxy`
- API response (`proxyOk`): tự thêm key cũ `http`/`socks5`/`username`/`password`
- `ResponseJson.php`: KHÔNG sửa (public API legacy)

### Files đã sửa

**BE:** ProxyFormat.php (mới), DefaultHandler.php, AutoRotateProxies.php, FetchProviderItems.php, ProxyController.php, ProxyVnService.php, HomeProxyService.php, FillProxiesController.php, UpProxyStaticProcessor.php, ZingProxyService.php, ZingProxyRotatingProcessor.php

**FE:** protocolProxy.ts, OrderProxyPage.tsx (2), ProxyDetailModal.tsx, OrderRotatingProxyPage.tsx, OrderDetail.tsx, OrderDetailModal.tsx, ProviderFormTypes.ts, BuyConfigSection.tsx, RenewSection.tsx, ServiceFormModal.tsx

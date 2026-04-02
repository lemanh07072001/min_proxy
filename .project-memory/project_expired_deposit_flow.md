---
name: Expired Deposit Manual Credit Flow
description: Luồng admin cộng tiền thủ công cho lệnh nạp tiền hết hạn — flow, audit, files liên quan
type: project
---

## Vấn đề

Khách tạo lệnh nạp tiền (QR), lệnh hết hạn (10 phút), nhưng tiền thực tế đã chuyển (webhook trả muộn hoặc chuyển khoản thủ công). Admin cần cộng tiền cho khách minh bạch.

## Flow

```
Admin > Quản lý nạp tiền > Tab "Lệnh nạp tiền"
→ Thấy lệnh status=expired → nhấn nút $ (Cộng tiền thủ công)
→ Dialog hiện: tên khách, email, số tiền, mã GD, trạng thái, thời gian tạo
→ Note mặc định: "Admin nạp tiền thủ công do lệnh hết hạn" (có thể sửa)
→ Nhấn "Xác nhận cộng tiền"
→ POST /api/admin/bank-auto/{id}/credit { admin_note }
→ DepositService::creditUser():
  - bank_auto: status → success, deposit_type → manual, processed_by → admin ID, processed_at → now
  - user: sodu += amount
  - dongtien: ghi lịch sử "Nạp tiền thủ công bởi admin"
  - transaction_bank liên quan: is_processed → true
→ Toast: "Đã cộng 50,000đ cho Nguyễn Văn A"
```

## Audit / Minh bạch

- `bank_auto.deposit_type = 'manual'` → phân biệt với auto/pay2s
- `bank_auto.processed_by` → admin user ID
- `bank_auto.processed_at` → timestamp
- `bank_auto.admin_note` → lý do cụ thể
- `dongtien.type = 'NAPTIEN_MANUAL'` → hiện trong lịch sử GD
- `transaction_bank.is_processed = true` → không hiện lại trong chưa đối soát

## Files liên quan

### BE
- `BankQrController::adminCredit()` — API xử lý
- `DepositService::creditUser()` — logic cộng tiền + audit
- Route: `POST /api/admin/bank-auto/{id}/credit`

### FE
- `TabDepositRequests.tsx` — nút $, confirm dialog
- `useDepositManagement.ts` → `useAdminCreditDeposit` hook

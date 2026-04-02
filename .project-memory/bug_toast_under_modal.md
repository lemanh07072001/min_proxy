---
name: Bug Toast Under Modal
description: Toast notification hiển thị dưới MUI Dialog — z-index chưa đúng dù đã set 99999
type: project
---

## Bug: Toast nằm dưới Modal

**Hiện trạng:** Đã thử set z-index 99999 cả trong CSS (`globals.css`) lẫn inline style (`LayoutProvider.tsx`) nhưng toast vẫn bị Modal đè.

**Nguyên nhân có thể:**
- MUI Dialog dùng Portal → tạo stacking context mới, z-index relative bên trong
- CSS `!important` bị override bởi inline style hoặc MUI theme
- Có thể cần thay đổi MUI theme `zIndex.modal` thay vì CSS hack

**Files liên quan:**
- `FE/src/app/globals.css` — line 36-48: Toastify z-index rules
- `FE/src/components/LayoutProvider.tsx` — ToastContainer inline style
- `FE/src/app/globals.css` — line 21-34: MUI Modal/Dialog z-index overrides

**Cần làm:**
- Kiểm tra MUI theme zIndex config
- Hoặc dùng `createTheme({ zIndex: { modal: 1200 } })` để hạ Dialog xuống
- Hoặc render ToastContainer trong Portal riêng với z-index cao hơn

---
name: Nguyên tắc thiết kế UI cấu hình API
description: BẮT BUỘC áp dụng khi tạo/sửa form cấu hình API (NCC, sản phẩm, gia hạn...). Admin không phải dev, phải tự hiểu và cấu hình được.
type: feedback
---

Khi thiết kế UI cấu hình API (NCC, sản phẩm, gia hạn...), **BẮT BUỘC** tuân theo:

## 1. Trực quan — admin không phải dev
- Label phải rõ nghĩa, không dùng thuật ngữ code thuần (VD: "Param gửi đi" thay vì "params_json")
- Mỗi field phải có ví dụ thực tế (placeholder hoặc helperText)
- Mỗi section phải giải thích: **đang làm gì**, **tại sao cần**, **sai thì hậu quả gì**

## 2. Màu đặc trưng — phân biệt rõ ràng
- Mỗi nhóm cấu hình có màu viền + nền header riêng
- Dùng PipelineStepCard hoặc Box có borderTop màu
- Admin nhìn vào phân biệt ngay đây là phần nào

## 3. Data flow rõ ràng
- Giải thích: field đọc từ **đâu** (bảng nào, field nào trong DB)
- Giá trị **lưu ở đâu** (orders, order_items, metadata...)
- Khi call API → **gửi đi thế nào** (tên param, giá trị thực tế)
- Minh hoạ bằng bảng hoặc ví dụ request thực tế

## 4. Config-driven — không phụ thuộc model
- Dropdown field lấy từ **cấu hình API trước đó** (response_mapping, proxy_fields...)
- Không hardcode danh sách fields model
- Thêm field mới ở cấu hình mua → tự động có ở cấu hình gia hạn

## 5. Ghi đè có ngữ cảnh
- Khi SP ghi đè config NCC → **hiện rõ config NCC đang dùng** trước
- Admin thấy "đang dùng chung gì" → mới quyết định ghi đè hay không
- Checkbox "Cấu hình riêng" — bỏ tick = dùng chung NCC

## 6. Backward compatible
- Format mới lưu song song format cũ
- BE không cần sửa khi FE đổi UI
- Config cũ load vào form mới phải hiện đúng

**Why:** Admin site con không phải dev. UI phải tự giải thích được, không cần đọc doc.
**How to apply:** Áp dụng cho MỌI form cấu hình API — NCC, sản phẩm, gia hạn, site con.

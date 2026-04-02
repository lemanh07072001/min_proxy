---
name: Câu hỏi trừu tượng = kiểm tra logic mới ảnh hưởng production
description: Dự án đã chạy production. Khi user hỏi tổng quát ("đánh giá", "có vấn đề không") → tự hiểu = "logic mới có ảnh hưởng hệ thống đang chạy không?". Đọc lại design doc + trace mạch lạc logic mới chạm logic cũ ở đâu.
type: feedback
---

Tất cả dự án trên máy user đều đã chạy production. Câu hỏi trừu tượng = "logic mới có ảnh hưởng gì đến hệ thống đang chạy không?"

**Why:** Session 01/04/2026 — user hỏi "đánh giá logic có đáp ứng yêu cầu hiện tại và tương lai không". Tôi chỉ đọc code vừa sửa rồi tự suy ra risk, KHÔNG đọc lại design doc → flag hành vi đúng design thành bug. Gốc lỗi: không hiểu ngữ cảnh câu hỏi (production safety) và không đọc lại nguồn chân lý.

**How to apply:**
1. Nhận câu hỏi trừu tượng → TỰ HIỂU ngữ cảnh: dự án production → user muốn biết logic mới có an toàn không
2. **DỪNG, đọc lại** trước khi suy luận:
   - Design doc / requirements gốc
   - Feedback memories liên quan
   - Ghi chú thiết kế đã thống nhất trong session
3. **Trace mạch lạc**: logic mới → chạm logic cũ ở đâu → logic cũ có bị thay đổi hành vi không → nếu có thì khớp design không
4. Mọi vấn đề đều quan trọng — nhỏ hay lớn đều phải trace, không bỏ qua
5. Chỉ flag khi code **mâu thuẫn** design doc, KHÔNG flag khi code đúng design mà thấy "rủi ro"
6. **KHÔNG** nhầm "có thể xảy ra" với "không nên xảy ra"
7. **KHÔNG** chỉ trace logic code rồi rút kết luận — thiếu ngữ cảnh thiết kế sẽ suy diễn sai
8. **KHÔNG** hỏi lại scope — tự hiểu từ ngữ cảnh dự án (production, đã chạy, không được có lỗ hổng)

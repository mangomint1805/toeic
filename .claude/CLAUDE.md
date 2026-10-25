# Hướng dẫn cho Claude

- Giao tiếp: xưng **em**, gọi người dùng là **anh**, giọng tsundere vui vẻ; viết tiếng Việt.
- **Sau mỗi thay đổi học viên thấy được** (tính năng, sửa lỗi, nội dung, giao diện, tốc độ), thêm một mục vào ĐẦU danh sách trong `cap-nhat.js` (trang "Có gì mới"):
  - `id` là ngày `YYYY-MM-DD`; cùng ngày đã có mục thì thêm hậu tố `b`, `c`…; `date` dạng `DD/MM/YYYY`.
  - `title` ngắn gọn, `items` viết cho học viên: dễ hiểu, nói lợi ích, không dùng thuật ngữ kỹ thuật.
  - Thay đổi chỉ trong README, code nội bộ hay Apps Script (học viên không thấy) thì không cần thêm.
  - Nếu cùng thay đổi áp dụng cho nhiều web (cam, toeic, summary-old, summary-new), cập nhật patch notes ở tất cả các web đó.
- Firebase Realtime Database (`online/`, `who/`, `log/`) chỉ nhận các trường đã khai báo trong Rules (`"$other": {".validate": false}`). Muốn gửi thêm trường mới thì nhờ thầy thêm vào Rules trước, nếu không Firebase từ chối cả lần ghi. Firestore: luật đang chạy (21/10/2026) đã an toàn, đừng Publish đè bằng `firestore.rules` trong repo mangomint1805.github.io.
- Mỗi lần đẩy code, GitHub Actions (`.github/workflows/kiem-tra.yml`) tự mở mọi trang tìm lỗi JavaScript, file thiếu, lỗi cú pháp. Đẩy xong nhớ xem kết quả: `gh run list -L 1` (xanh = ổn).
- `ui.js` là MỘT file giống hệt ở 4 web (toeic/assets, cam/shared, summary-new/docs/assets, summary-old/docs/assets). Sửa ở một web thì chép y nguyên sang cả 4. GitHub Actions có bước `check-ui.js` tự so 4 bản, lệch là báo đỏ.

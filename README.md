# ETS 2026 · Luyện đề TOEIC

Trang luyện đề TOEIC Listening & Reading tự chấm cho học viên: 10 đề ETS 2026 và 10 đề ETS 2024, mỗi đề 200 câu.

**Link cho học viên:** https://mangomint1805.github.io/toeic/

## Tính năng
- Thi thử Full test (120 phút), chỉ Listening, chỉ Reading (75 phút) hoặc luyện từng Part.
- Khi thi thử, audio phát liền một mạch như thi thật; có nút "Phát tiếp từ chỗ dừng" nếu audio bị dừng.
- Luyện từng Part: mỗi câu / mỗi đoạn hội thoại có nút nghe riêng.
- Chấm điểm ngay, quy đổi điểm TOEIC ước tính, thống kê đúng/sai theo Part.
- Xem lại: lời thoại kèm dịch tiếng Việt, dịch bài đọc, giải thích từng câu; lọc chỉ xem câu sai.
- Bấm vào từ tiếng Anh để tra nghĩa, nghe phát âm, lưu flashcard (`flashcards.html`, dùng chung với web IELTS).
- Chỉnh tốc độ audio 0.75x / 1x / 1.25x khi luyện tập.
- `chinh-ta.html`: chép chính tả ~1.200 câu Part 1–2 cắt từ audio.
- `phan-tich.html`: điểm yếu theo Part và dạng câu hỏi, biểu đồ điểm qua các lần làm.
- Bài làm tự lưu trên máy; kết quả gửi về Google Sheet của thầy.

## Cấu trúc
- `index.html` — trang chủ chọn đề
- `test.html?t=N` — trang làm bài (một trang dùng chung cho mọi đề)
- `data/tN.js` — nội dung đề N
- `audio/tN/`, `img/tN/` — audio và hình của đề N

## Lịch sử cập nhật

Xem đầy đủ: [Có gì mới](https://mangomint1805.github.io/toeic/cap-nhat.html) (`cap-nhat.html`, dữ liệu trong `cap-nhat.js`).

- **22/10/2026** — Thêm 10 đề ETS 2024 (Test 11–20); tô sáng + ghi chú khi làm Listening & Reading trên máy tính và điện thoại; giao diện Băng hoại dễ đọc hơn.
- **21/10/2026** — Đăng nhập Google và đồng bộ tiến độ, xem lại bài đã nộp, Hồ sơ, Bảng xếp hạng tuần; Gõ từ rơi, Phản xạ Part 2, đánh dấu ★ + ghi chú câu hỏi, kiểm tra xếp lớp; flashcard ôn lặp ngắt quãng, sao lưu/khôi phục; linh vật bé Xoài và 3 phong cách giao diện.
- **20/10/2026** — Ra mắt: 10 đề ETS 2026, đề mini mỗi ngày, tra từ + flashcard, chép chính tả Part 1–2, phân tích điểm yếu, cài như app.

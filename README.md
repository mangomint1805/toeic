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
- `chinh-ta.html`: chép chính tả ~5.800 câu Part 1–4 (20 đề ETS 2026 + ETS 2024) cắt từ audio.
- `phan-tich.html`: điểm yếu theo Part và dạng câu hỏi, biểu đồ điểm qua các lần làm.
- Bài làm tự lưu trên máy; kết quả gửi về Google Sheet của thầy (link Apps Script trong `config.js`; mã Apps Script dùng chung với web IELTS, ở repo [cam](https://github.com/mangomint1805/cam/blob/main/apps-script/Code.gs)).

## Cấu trúc
- `index.html` — trang chủ chọn đề
- `test.html?t=N` — trang làm bài (một trang dùng chung cho mọi đề)
- `data/tN.js` — nội dung đề N
- `audio/tN/`, `img/tN/` — audio và hình của đề N

# ETS 2026 · Luyện đề TOEIC

Trang luyện đề TOEIC Listening & Reading tự chấm cho học viên: 10 đề ETS 2026 và 10 đề ETS 2024 (mỗi đề 200 câu), cùng 10 đề TOEIC 1000 Listening/Reading (`t=21`–`30`: Test 1–6 mới có Reading vì chưa có audio, Test 7–10 đủ 200 câu).

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
- `data/tN.js` — nội dung đề N (1–10 ETS 2026, 11–20 ETS 2024; đề chưa có audio để `lc: null`, trang làm bài tự ẩn Listening). Đề 21–30 (TOEIC 1000 Listening/Reading) và 31–60 (YBM Vol 1–3: 31–40 Vol 1, 41–50 Vol 2, 51–60 Vol 3) **không có file data/**: nằm ở Firestore, cần đăng nhập (xem mục *Đề cần đăng nhập*).
- `test.html?t=101`…`112` — **Starter TOEIC** Unit 1–12 (bài tập sách Starter TOEIC: Part 5/6/7), nội dung ở Firestore `starter/u01…u12`, cần đăng nhập.
- `assets/gate.js` — tải đề cần đăng nhập từ Firestore; `assets/gate-home.js` — danh sách Starter + dòng nhắc 🔒 đăng nhập ở trang chủ.
- `audio/tN/`, `img/tN/` — audio và hình của đề N

## Đề cần đăng nhập (Firestore `de/{t}`)

Đề có bản quyền không để trong repo (GitHub công khai). Nội dung nằm ở Firestore, chỉ **tài khoản Google đã đăng nhập (email đã xác minh)** đọc được; chỉ thầy ghi (luật: `firebase/them-luat-starter.txt` ở repo trang chủ). Audio `audio/tN/` và hình `img/tN/` vẫn để trong repo như cũ.

Thêm một đề mới vào hệ thống này (ví dụ đề YBM, `t=31`):
1. Soạn dữ liệu đúng cấu trúc `window.ETSDATA[t]` như các file `data/tN.js` (`{ lc: { p1, p2, p3, p4 } | null, rc: { p5, p6, p7 } }`, câu có `n, q, opts, ans, xp…`, đoạn văn Part 6/7 là HTML có `<span class="blank" data-n="131">-------</span>`). **Không** commit file đó vào repo.
2. Ghi ra file JSON tải lên, mỗi đề một file:
   ```json
   { "kind": "de", "v": 1, "t": 31, "name": "YBM · Test 1", "data": { "lc": { … } , "rc": { … } } }
   ```
   (nhiều đề trong một file: `{ "kind": "de", "v": 1, "tests": [ {…}, {…} ] }`).
3. Thêm số đề vào `window.MT_GATED` trong `config.js`, và tên hiển thị (`NAME` trong `assets/test.js`, danh sách ở `index.html`).
4. Thầy mở `https://mangomint1805.github.io/tai-de-gv.html`, chọn file → **Tải lên**. Trang chia dữ liệu thành chuỗi JSON từng khúc ≤ 250.000 ký tự: `de/{t}` = `{ t, name, n, size, at, v, j }` (khúc 0) và `de/{t}_1`, `de/{t}_2`… = `{ t, k, j }`; mục lục ở `de/_index`. `assets/gate.js` ghép các khúc lại thành `ETSDATA[t]`, nên chấm điểm, giải thích, Sổ lỗi sai, phân tích dùng như đề thường.

Bài tập Starter (`starter/uNN`) dùng định dạng riêng (`{ u, title, p5: [{n,q,o,a,x}], p6: [{ns, head, text, qs}], p7: [{ns, head, texts, qs}] }`, đoạn văn chữ thường, chỗ trống `[[131]]`).

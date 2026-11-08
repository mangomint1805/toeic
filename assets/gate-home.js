/* Trang chủ: danh sách Starter TOEIC Unit 1–12 (test.html?t=101…112) + dòng nhắc "🔒 Đăng nhập bằng Google để xem đề"
   ở các mục đề cần đăng nhập (phần tử [data-gate-note]). Đề nằm trong Firestore, không có trong repo. */
(function () {
  'use strict';
  var U = [
    ['Trợ động từ', 'Sức khoẻ'], ['Các thì', 'Trường học'], ['To V / V-ing', 'Nhà cửa'], ['Phân từ -ing / -ed', 'Giải trí'],
    ['Phủ định, cấu trúc song song', 'Công việc'], ['So sánh', 'Du lịch'], ['Hoà hợp chủ ngữ – động từ', 'Nghệ thuật'], ['Mệnh đề quan hệ', 'Âm nhạc'],
    ['Tính từ / trạng từ, trật tự từ', 'Thể thao'], ['Đại từ bất định', 'Ăn uống'], ['Câu bị động', 'Khoa học'], ['Liên từ, giới từ', 'Sở thích']
  ];
  function paintNotes() {
    var on = false; try { on = !!localStorage.getItem('mt.acc'); } catch (e) {}
    [].forEach.call(document.querySelectorAll('[data-gate-note]'), function (p) { p.hidden = on; });
  }
  paintNotes(); setInterval(paintNotes, 1500); window.addEventListener('storage', paintNotes);
  var box = document.getElementById('testsST'); if (!box) return;
  var hist = []; try { hist = JSON.parse(localStorage.getItem('ets26.hist')) || []; } catch (e) {}
  var C = 2 * Math.PI * 26, h = '';
  U.forEach(function (x, i) {
    var t = 101 + i, mine = hist.filter(function (r) { return r.test === t; });
    var best = mine.reduce(function (b, r) { return r.total ? Math.max(b, r.got / r.total) : b; }, 0);
    var badge = mine.length ? '<span class="badge ' + (best >= 0.8 ? 'ok' : 'mid') + '">Cao nhất ' + Math.round(best * 100) + '%</span>' : '<span class="badge">Chưa làm</span>';
    h += '<li><a class="test" href="test.html?t=' + t + '"><span class="ring" aria-hidden="true"><svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="26" fill="none" stroke="#f0eadf" stroke-width="5"/><circle cx="30" cy="30" r="26" fill="none" stroke="' + (best >= 0.8 ? '#1f8f6c' : '#a8691a') + '" stroke-width="5" stroke-linecap="round" stroke-dasharray="' + (C * best).toFixed(1) + ' ' + C.toFixed(1) + '"/></svg><span class="n"><small>UNIT</small><b>' + (i + 1) + '</b></span></span>' +
      '<span class="tinfo"><b>Starter · Unit ' + (i + 1) + '</b><span>' + x[0] + ' · ' + x[1] + '</span>' + badge + '</span></a></li>';
  });
  box.innerHTML = h;
})();

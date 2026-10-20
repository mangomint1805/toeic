/* Điện thoại: nút nhảy giữa bài đọc và câu hỏi ở Part 6–7. */
(function () {
  'use strict';
  if (window.innerWidth > 900) return;
  var css = document.createElement('style');
  css.textContent = '.jumpq{position:fixed;left:12px;bottom:14px;z-index:55;font:700 13.5px/1 "IBM Plex Sans",sans-serif;background:#6b4410;color:#fff;border:0;border-radius:999px;padding:11px 14px;box-shadow:0 6px 18px rgba(0,0,0,.25);cursor:pointer}' +
    '@media (max-width:600px){.bar h1 small{display:none}.bar{padding:8px 12px;gap:6px 10px}main{padding:12px}.card{padding:13px 12px}.psg{padding:12px;font-size:16px}}';
  document.head.appendChild(css);
  var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'jumpq'; btn.hidden = true; document.body.appendChild(btn);
  function upd() {
    var best = null;
    [].forEach.call(document.querySelectorAll('.card .split'), function (s) { var r = s.getBoundingClientRect(); if (r.top < window.innerHeight * 0.6 && r.bottom > 120) best = s; });
    if (!best) { btn.hidden = true; return; }
    var t = best.querySelector('.ptext'), q = best.children[1]; if (!t || !q || t.offsetHeight < window.innerHeight * 0.7) { btn.hidden = true; return; }
    var inQ = q.getBoundingClientRect().top < window.innerHeight * 0.5;
    btn.hidden = false; btn.textContent = inQ ? '📄 Về bài đọc' : '❓ Tới câu hỏi';
    btn.onclick = function () { var el = inQ ? best.closest('.card') : q; window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 150, behavior: 'smooth' }); setTimeout(upd, 600); };
  }
  window.addEventListener('scroll', function () { clearTimeout(upd.t); upd.t = setTimeout(upd, 120); }, { passive: true });
  document.addEventListener('click', function () { setTimeout(upd, 300); });
})();

/* Đào vàng — game tự luyện Part 5 / Part 6 (câu lấy từ 20 đề ETS).
   Đúng: +10 vàng × hệ số chuỗi (x1, x1.5 từ 3 câu liền, x2 từ 5, x3 từ 10). Sai: mất chuỗi, đọc giải thích (đồng hồ dừng), câu sai vào Sổ lỗi sai.
   Không có rương ngẫu nhiên hay nhân vật sưu tầm. Lưu trên máy: mt.game.gold (kỷ lục), mt.game.gold.mode, mt.game.gold.seen. */
(function () {
  'use strict';
  var main = document.getElementById('main');
  var KEY = 'mt.game.gold', ROUND = 180, TESTS = 20, L4 = ['A', 'B', 'C', 'D'];
  function get(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function put(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  var mode = get(KEY + '.mode', 'both'); if (['p5', 'p6', 'both'].indexOf(mode) < 0) mode = 'both';
  var MODES = { p5: ['📝 Part 5', 'điền câu'], p6: ['📄 Part 6', 'điền đoạn văn'], both: ['🎲 Cả hai', 'trộn Part 5 và 6'] };

  // ---------- nạp đề: mỗi lần chỉ tải vài đề (mỗi đề ~200 KB), tải thêm dần khi đang chơi ----------
  var loaded = {}, POOL = [], order = shuffle(Array.from({ length: TESTS }, function (_, i) { return i + 1; }));
  function loadTest(t) {
    if (loaded[t]) return loaded[t];
    return (loaded[t] = new Promise(function (ok) {
      var s = document.createElement('script'); s.src = 'data/t' + t + '.js';
      s.onload = function () { addItems(t); ok(true); }; s.onerror = function () { ok(false); };
      document.head.appendChild(s);
    }));
  }
  function addItems(t) {
    var D = window.ETSDATA && window.ETSDATA[t]; if (!D || !D.rc) return;
    (D.rc.p5 || []).forEach(function (q) { if (q.opts && q.ans) POOL.push({ t: t, n: q.n, p: 5, q: q.q, o: q.opts, a: q.ans, xp: q.xp || '' }); });
    (D.rc.p6 || []).forEach(function (s) { (s.qs || []).forEach(function (q) { if (q.opts && q.ans) POOL.push({ t: t, n: q.n, p: 6, psg: s.passage, head: s.head, o: q.opts, a: q.ans, xp: q.xp || '' }); }); });
  }
  var nextLoad = 0;
  function loadMore(k) { var ps = []; for (var i = 0; i < k && nextLoad < order.length; i++) ps.push(loadTest(order[nextLoad++])); return Promise.all(ps); }

  function menu() {
    var B = get(KEY, {});
    main.innerHTML = '<div class="card"><div class="lbl">Chọn câu hỏi</div><div class="row">' +
      Object.keys(MODES).map(function (m) { return '<button class="chip" type="button" data-m="' + m + '" aria-pressed="' + (mode === m) + '">' + MODES[m][0] + ' <small>' + MODES[m][1] + '</small></button>'; }).join('') + '</div>' +
      '<div class="best"><div><b>' + (B.best || 0) + '</b><span>vàng nhiều nhất 1 ván</span></div><div><b>' + (B.streak || 0) + '</b><span>chuỗi đúng dài nhất</span></div><div><b>' + (B.games || 0) + '</b><span>ván đã chơi</span></div></div>' +
      '<p style="margin:16px 0 0"><button class="btn" id="go" type="button">⛏️ Bắt đầu đào</button></p>' +
      '<ul class="rules"><li>Mỗi ván <b>3 phút</b>. Đúng 1 câu: <b>+10 vàng</b>.</li><li>Đúng liên tiếp thì vàng nhân lên: 3 câu ×1.5 · 5 câu ×2 · 10 câu ×3 🔥</li>' +
      '<li>Sai thì mất chuỗi và hiện giải thích tiếng Việt, đồng hồ <b>dừng</b> trong lúc bạn đọc. Câu sai tự vào <a href="so-loi.html">Sổ lỗi sai</a>.</li></ul></div>';
    [].forEach.call(main.querySelectorAll('[data-m]'), function (b) { b.onclick = function () { mode = b.dataset.m; put(KEY + '.mode', mode); menu(); }; });
    document.getElementById('go').onclick = start;
  }

  function start() {
    main.innerHTML = '<div class="card load">⛏️ Đang chuẩn bị mỏ vàng…</div>';
    loadMore(3).then(function () {
      if (!POOL.length) { main.innerHTML = '<div class="card">Không tải được câu hỏi. Kiểm tra mạng rồi thử lại nhé. <p><button class="btn" id="back" type="button">Quay lại</button></p></div>'; document.getElementById('back').onclick = menu; return; }
      play(); loadMore(3);
    });
  }

  function mult(st) { return st >= 10 ? 3 : st >= 5 ? 2 : st >= 3 ? 1.5 : 1; }

  function play() {
    var gold = 0, streak = 0, bestStreak = 0, right = 0, total = 0, left = ROUND, running = true, paused = false, last = 0, raf = 0, used = {}, cur = null, lock = false;
    var seen = get(KEY + '.seen', {});
    main.innerHTML = '<div class="hud"><span class="pill">🪙 <span class="gold" id="gd">0</span></span><span class="pill"><span class="flame" id="fl">🔥</span> <span id="st">0</span> <span class="x" id="mx">×1</span></span>' +
      '<span class="pill">✓ <span id="ok">0</span>/<span id="tt">0</span></span><span class="pill tm" id="tmb">⏱ <span id="tm">3:00</span></span></div>' +
      '<div class="bar"><i id="bar"></i></div><div class="stage" id="stg"><span class="dig" id="dig" aria-hidden="true">⛏️</span><div id="q"></div><div class="ops" id="ops"></div><div id="xp"></div></div>' +
      '<p style="margin:12px 0 0;text-align:right"><button class="btn alt" id="quit" type="button">Kết thúc</button></p>';
    var $ = function (id) { return document.getElementById(id); };
    $('quit').onclick = function () { end(); };
    function fmt(s) { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); }
    function hud() {
      $('gd').textContent = Math.round(gold); $('st').textContent = streak; $('mx').textContent = '×' + mult(streak);
      $('ok').textContent = right; $('tt').textContent = total; $('fl').classList.toggle('hot', streak >= 3);
    }
    function tick(now) {
      if (!running) return;
      if (!paused && last) left -= (now - last) / 1000;
      last = now;
      $('tm').textContent = fmt(left); $('bar').style.width = Math.max(0, left / ROUND * 100) + '%'; $('tmb').classList.toggle('low', left < 30);
      if (left <= 0) return end();
      raf = requestAnimationFrame(tick);
    }
    function pickItem() {
      var cand = POOL.filter(function (x) { return (mode === 'both' || x.p === +mode.slice(1)) && !used[x.t + '.' + x.n]; });
      var fresh = cand.filter(function (x) { return !seen[x.t + '.' + x.n]; });
      if (!fresh.length && cand.length) { seen = {}; fresh = cand; } // đã gặp hết thì làm lại từ đầu
      if (fresh.length < 8) loadMore(2);
      return fresh.length ? fresh[Math.floor(Math.random() * fresh.length)] : null;
    }
    function show() {
      if (!running) return;
      cur = pickItem(); lock = false; $('xp').innerHTML = '';
      if (!cur) { $('q').innerHTML = '<p class="load">Đang đào thêm câu hỏi…</p>'; $('ops').innerHTML = ''; setTimeout(show, 600); return; }
      var name = cur.t > 10 ? 'ETS 2024 · Test ' + (cur.t - 10) : 'ETS 2026 · Test ' + cur.t, tag = '<span class="tag">Part ' + cur.p + ' · ' + name + ' · câu ' + cur.n + '</span>';
      if (cur.p === 5) $('q').innerHTML = tag + '<div class="q5">' + esc(cur.q).replace(/-{3,}/, '<span class="bk">_____</span>') + '</div>';
      else {
        $('q').innerHTML = tag + '<div class="psg" id="psg">' + cur.psg + '</div>';
        var b = $('psg').querySelector('.blank[data-n="' + cur.n + '"]');
        if (b) { b.classList.add('cur'); b.textContent = '(' + cur.n + ') _____'; setTimeout(function () { try { b.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) {} }, 30); }
      }
      var shortOpts = cur.o.every(function (o) { return String(o).length <= 28; });
      $('ops').className = 'ops' + (shortOpts ? ' short' : '');
      $('ops').innerHTML = cur.o.map(function (o, i) { return '<button class="op" type="button" data-l="' + L4[i] + '"><span class="L">' + L4[i] + '</span><span>' + esc(o) + '</span></button>'; }).join('');
      [].forEach.call($('ops').querySelectorAll('.op'), function (b) { b.onclick = function () { answer(b.dataset.l, b); }; });
    }
    function coin(txt, el) {
      var stg = $('stg'), r = stg.getBoundingClientRect(), e = el.getBoundingClientRect(), c = document.createElement('span');
      c.className = 'coin'; c.textContent = txt; c.style.left = (e.left - r.left + e.width / 2 - 20) + 'px'; c.style.top = (e.top - r.top - 6) + 'px';
      stg.appendChild(c); setTimeout(function () { c.remove(); }, 1000);
      var d = $('dig'); d.classList.remove('on'); void d.offsetWidth; d.classList.add('on');
    }
    function answer(l, btn) {
      if (lock || !running) return; lock = true;
      var it = cur, ok = l === it.a, id = it.t + '.' + it.n; total++; used[id] = 1; seen[id] = 1; put(KEY + '.seen', seen);
      [].forEach.call($('ops').querySelectorAll('.op'), function (b) { b.disabled = true; if (b.dataset.l === it.a) b.classList.add('right'); else if (b.dataset.l === l) b.classList.add('wrong'); });
      var MW = get('ets26.miniwrong', {}) || {};
      if (ok) { delete MW[id]; } else MW[id] = [Date.now(), it.p];
      put('ets26.miniwrong', MW);
      if (window.MCOMBO) try { window.MCOMBO(ok, $('ops')); } catch (e) {}
      if (ok) {
        right++; streak++; bestStreak = Math.max(bestStreak, streak);
        var g = 10 * mult(streak); gold += g; coin('+' + (g % 1 ? g.toFixed(1) : g) + ' 🪙', btn); hud();
        setTimeout(show, 650);
      } else {
        streak = 0; hud(); paused = true;
        $('xp').innerHTML = '<div class="xp"><div>Đáp án đúng: <b class="k">(' + it.a + ') ' + esc(it.o[L4.indexOf(it.a)]) + '</b></div>' +
          (it.xp ? '<div style="margin-top:6px">' + esc(it.xp).replace(/\n/g, '<br>') + '</div>' : '') +
          '<div class="row"><button class="btn" id="gotit" type="button" disabled>Hiểu rồi →</button></div></div>';
        var gb = $('gotit'), n = 3;
        gb.textContent = 'Đọc giải thích… ' + n;
        var iv = setInterval(function () { n--; if (n > 0) gb.textContent = 'Đọc giải thích… ' + n; else { clearInterval(iv); gb.disabled = false; gb.textContent = 'Hiểu rồi →'; gb.focus(); } }, 1000);
        gb.onclick = function () { clearInterval(iv); paused = false; last = 0; show(); };
        try { $('xp').scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) {}
      }
    }
    function end() {
      if (!running) return; running = false; cancelAnimationFrame(raf);
      var B = get(KEY, {}), g = Math.round(gold), rec = g > (B.best || 0);
      if (rec) B.best = g; B.streak = Math.max(B.streak || 0, bestStreak); B.games = (B.games || 0) + 1; B.right = (B.right || 0) + right; B.total = (B.total || 0) + total; B.last = Date.now();
      // kỷ lục trong tuần (Thứ Hai đầu tuần), để lên Bảng vàng tuần ở trang Xếp hạng
      var d0 = new Date(), mon = new Date(d0.getFullYear(), d0.getMonth(), d0.getDate() - (d0.getDay() + 6) % 7), wk = mon.getFullYear() + '-' + ('0' + (mon.getMonth() + 1)).slice(-2) + '-' + ('0' + mon.getDate()).slice(-2);
      if (B.gw !== wk) { B.gw = wk; B.gwb = 0; } if (g > (B.gwb || 0)) B.gwb = g;
      put(KEY, B);
      try { if (window.MACC && MACC.board && localStorage.getItem('mt.board.on') === '1') MACC.board.push(); } catch (e) {}
      if (rec && g > 0 && window.MCONFETTI) try { window.MCONFETTI(); } catch (e) {}
      var wrong = total - right;
      main.innerHTML = '<div class="card res"><div style="font-size:40px">🪙</div><div class="sc">' + g + '</div><p>' + (rec && g ? '🏆 Kỷ lục mới!' : 'Kỷ lục: ' + (B.best || 0) + ' vàng') + '</p>' +
        '<p>Đúng <b>' + right + '/' + total + '</b> câu · chuỗi dài nhất <b>' + bestStreak + '</b></p>' +
        (wrong ? '<p><a href="so-loi.html">📕 Xem ' + wrong + ' câu sai trong Sổ lỗi sai →</a></p>' : (total ? '<p>Không sai câu nào, giỏi quá! ✨</p>' : '')) +
        '<p><a href="/xep-hang.html#dao-vang">🏆 Bảng vàng tuần của cả lớp →</a>' + (localStorage.getItem('mt.board.on') === '1' ? '' : ' <small style="color:var(--dim)">(đăng nhập Google và bật "Hiện tôi trên bảng xếp hạng" để có tên)</small>') + '</p>' +
        '<div class="row"><button class="btn" id="again" type="button">↻ Chơi lại</button><button class="btn alt" id="menu" type="button">Đổi loại câu</button></div></div>';
      document.getElementById('again').onclick = start; document.getElementById('menu').onclick = menu;
    }
    window.__gold = { state: function () { return { gold: gold, streak: streak, right: right, total: total, left: left, paused: paused, cur: cur && { t: cur.t, n: cur.n, p: cur.p, a: cur.a } }; }, end: end };
    hud(); show(); raf = requestAnimationFrame(tick);
  }
  menu();
})();

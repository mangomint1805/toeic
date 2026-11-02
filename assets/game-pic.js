/* Nghe chọn tranh — game nghe cho bạn mới học (bước đệm vào Part 1).
   Nghe 1 câu/cụm từ tiếng Anh → chọn 1 trong 4 tranh. Mỗi ván 10 câu, 3 cấp.
   Lưu trên máy (khoá mt.* nên acc.js tự đồng bộ theo tài khoản):
   mt.game.pic = { games, right, total, gold, streak, last, lv: { '1': { best, stars, gold } } }
   mt.game.pic.rev = { id câu: { d: 'YYYY-MM-DD' ngày đến hạn, s: lần ôn 0–2 } } — câu sai ôn lại sau 1, 3, 7 ngày (giống Sổ lỗi sai). */
(function () {
  var main = document.getElementById('main'); if (!main) return;
  var ITEMS = window.NT_ITEMS || [], ART = window.PICART, KEY = 'mt.game.pic', RKEY = KEY + '.rev', ROUND = 10, L4 = ['A', 'B', 'C', 'D'];
  var LV = { 1: ['Cấp 1', 'Từ & cụm từ'], 2: ['Cấp 2', 'Câu ngắn'], 3: ['Cấp 3', 'Kiểu Part 1'] };
  function get(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function put(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function dkey(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function plus(n) { var d = new Date(); d.setDate(d.getDate() + n); return dkey(d); }
  var BY = {}; ITEMS.forEach(function (x) { BY[x.id] = x; });
  var lv = +get(KEY + '.lvl', 1) || 1;

  // ---------- âm thanh: mp3 tạo sẵn (audio/pic), lỗi thì dùng giọng đọc của trình duyệt ----------
  var au = null, ttsWarned = false;
  function speak(t, slow) {
    try {
      if (!window.speechSynthesis) throw 0;
      speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(t); u.lang = 'en-US'; u.rate = slow ? 0.6 : 0.9;
      var vs = speechSynthesis.getVoices().filter(function (v) { return /^en[-_]US/i.test(v.lang); }); if (vs[0]) u.voice = vs[0];
      speechSynthesis.speak(u);
    } catch (e) { if (!ttsWarned) { ttsWarned = true; note('Máy này không phát được âm thanh 😢 Hãy thử mở bằng Chrome hoặc bật loa nhé.'); } }
  }
  function play(it, slow) {
    if (!it) return;
    try { if (au) { au.pause(); au.onerror = null; } } catch (e) {}
    var a = new Audio('audio/pic/' + it.id + '.mp3'); au = a;
    try { a.preservesPitch = true; a.playbackRate = slow ? 0.7 : 1; } catch (e) {}
    var fell = false; function fb() { if (fell || au !== a) return; fell = true; speak(it.en, slow); }
    a.onerror = fb;
    var p = a.play(); if (p && p.catch) p.catch(function (e) { if (!e || e.name !== 'NotAllowedError') fb(); });
  }
  function note(t) { var n = document.getElementById('note'); if (n) { n.textContent = t; n.hidden = false; } }

  // ---------- ôn câu sai ----------
  function rev() { var r = get(RKEY, {}); return r && typeof r === 'object' ? r : {}; }
  function markRev(id, ok) {
    var R = rev(), x = R[id], td = dkey(new Date());
    if (!ok) R[id] = { d: plus(1), s: 0 };
    else if (x && x.d <= td) { if ((x.s || 0) >= 2) delete R[id]; else { x.s = (x.s || 0) + 1; x.d = plus(x.s === 1 ? 3 : 7); } }
    put(RKEY, R);
  }
  function revList() { var R = rev(), td = dkey(new Date()); return Object.keys(R).filter(function (k) { return BY[k]; }).map(function (k) { return { id: k, due: R[k].d <= td, d: R[k].d }; }); }

  // ---------- menu ----------
  function stars(n) { var s = ''; for (var i = 0; i < 3; i++) s += i < n ? '★' : '☆'; return s; }
  function menu() {
    var B = get(KEY, {}) || {}, L = B.lv || {}, rl = revList(), due = rl.filter(function (x) { return x.due; }).length;
    main.innerHTML = '<div class="card"><div class="lbl">Chọn cấp độ</div><div class="lvs">' +
      [1, 2, 3].map(function (l) { var b = L[l] || {}; return '<button class="lvb" type="button" data-l="' + l + '" aria-pressed="' + (lv === l) + '"><b>' + LV[l][0] + '</b><span>' + LV[l][1] + '</span><i class="st" aria-label="' + (b.stars || 0) + ' sao">' + stars(b.stars || 0) + '</i></button>'; }).join('') + '</div>' +
      '<ul class="rules"><li>Bấm <b>Bắt đầu</b>, nghe câu tiếng Anh rồi chọn <b>tranh đúng</b> trong 4 tranh.</li><li>Nghe chưa rõ? Bấm <b>🔊 Nghe lại</b> hoặc <b>🐢 Nghe chậm</b>, bao nhiêu lần cũng được.</li><li>Mỗi ván 10 câu. Đúng 1 câu được 10 vàng 🪙, đúng liên tiếp thì vàng nhân lên. Đúng 8 câu được 2 sao, 10 câu được 3 sao.</li></ul>' +
      '<div class="row" style="margin-top:14px"><button class="btn" id="go" type="button">▶ Bắt đầu ' + LV[lv][0] + '</button>' +
      (rl.length ? '<button class="btn alt" id="rv" type="button">📕 Ôn câu sai (' + (due ? due + ' đến hạn' : rl.length) + ')</button>' : '') + '</div>' +
      '<div class="best"><div><b>' + (B.gold || 0) + '</b><span>vàng đã nhặt</span></div><div><b>' + (B.games || 0) + '</b><span>ván đã chơi</span></div><div><b>' + (B.streak || 0) + '</b><span>chuỗi đúng dài nhất</span></div></div>' +
      '<p class="hint" id="note" hidden></p></div>';
    [].forEach.call(main.querySelectorAll('[data-l]'), function (b) { b.onclick = function () { lv = +b.dataset.l; put(KEY + '.lvl', lv); menu(); }; });
    document.getElementById('go').onclick = function () { start(false); };
    var rb = document.getElementById('rv'); if (rb) rb.onclick = function () { start(true); };
  }

  // ---------- 1 ván ----------
  function makeQ(it) {
    var ds = it.d ? it.d.slice() : shuffle(ITEMS.filter(function (x) { return x.lv === 1 && x.g === it.g && x.id !== it.id; }).map(function (x) { return x.a; })).slice(0, 3);
    var ops = shuffle([it.a].concat(ds));
    return { it: it, ops: ops, ans: ops.indexOf(it.a) };
  }
  function start(review) {
    var pool;
    if (review) { var rl = revList().sort(function (a, b) { return (b.due - a.due) || (a.d < b.d ? -1 : 1); }); pool = rl.slice(0, ROUND).map(function (x) { return BY[x.id]; }); }
    else {
      var last = get(KEY + '.lastRound', []) || [], all = shuffle(ITEMS.filter(function (x) { return x.lv === lv; }));
      pool = all.filter(function (x) { return last.indexOf(x.id) < 0; }).concat(all.filter(function (x) { return last.indexOf(x.id) >= 0; })).slice(0, ROUND);
      put(KEY + '.lastRound', pool.map(function (x) { return x.id; }));
    }
    if (!pool.length) return menu();
    var Q = pool.map(makeQ), i = 0, right = 0, streak = 0, bestStreak = 0, gold = 0, wrong = [], lock = false;
    main.innerHTML = '<div class="hud"><span class="pill">' + (review ? '📕 Ôn câu sai' : LV[lv][0]) + '</span><span class="pill" id="qn"></span><span class="pill"><span class="flame" id="fl">🔥</span><span id="sk">0</span></span><span class="pill gp">🪙 <span class="gold" id="gd">0</span></span></div>' +
      '<div class="bar"><i id="br"></i></div>' +
      '<div class="stage"><div class="lis"><button class="btn big" id="pl" type="button">🔊 Nghe lại</button><button class="btn alt" id="sl" type="button">🐢 Nghe chậm</button></div>' +
      '<p class="ask">Nghe và chọn tranh đúng</p><div class="pics" id="pics"></div><div id="fb"></div><p class="hint" id="note" hidden></p></div>' +
      '<div class="row" style="justify-content:center;margin-top:10px"><button class="btn alt sm" id="quit" type="button">Dừng ván</button></div>';
    var $ = function (id) { return document.getElementById(id); };
    $('pl').onclick = function () { play(Q[i] && Q[i].it, false); };
    $('sl').onclick = function () { play(Q[i] && Q[i].it, true); };
    $('quit').onclick = function () { end(true); };
    if (window.MCOMBO && window.MCOMBO.reset) try { window.MCOMBO.reset(); } catch (e) {}
    function mult(st) { return st >= 5 ? 2 : st >= 3 ? 1.5 : 1; }
    function hud() {
      $('qn').textContent = 'Câu ' + Math.min(i + 1, Q.length) + '/' + Q.length; $('sk').textContent = streak; $('gd').textContent = gold;
      $('fl').className = 'flame' + (streak >= 3 ? ' hot' : ''); $('br').style.width = (i / Q.length * 100) + '%';
    }
    function show() {
      lock = false; hud(); var q = Q[i];
      $('fb').innerHTML = '';
      $('pics').innerHTML = q.ops.map(function (k, j) { return '<button class="pic" type="button" data-j="' + j + '" aria-label="Tranh ' + L4[j] + '"><span class="L">' + L4[j] + '</span>' + ART.svg(k) + '</button>'; }).join('');
      [].forEach.call($('pics').querySelectorAll('.pic'), function (b) { b.onclick = function () { answer(+b.dataset.j, b); }; });
      setTimeout(function () { play(q.it, false); }, 250);
    }
    function answer(j, btn) {
      if (lock) return; lock = true;
      var q = Q[i], ok = j === q.ans;
      [].forEach.call($('pics').querySelectorAll('.pic'), function (b) { var k = +b.dataset.j; b.disabled = true; if (k === q.ans) b.classList.add('right'); else if (k === j) b.classList.add('wrong'); else b.classList.add('dim'); });
      markRev(q.it.id, ok);
      if (window.MCOMBO) try { window.MCOMBO(ok, $('pics')); } catch (e) {}
      var g = 0;
      if (ok) { right++; streak++; bestStreak = Math.max(bestStreak, streak); g = 10 * mult(streak); gold += g; coin('+' + g + ' 🪙', btn); }
      else { streak = 0; wrong.push(q.it); }
      hud();
      var it = q.it;
      $('fb').innerHTML = '<div class="fb ' + (ok ? 'ok' : 'no') + '"><div class="v">' + (ok ? (streak >= 3 ? '🔥 Đúng rồi! Chuỗi ' + streak + ' câu' : '✅ Đúng rồi!') : '❌ Chưa đúng. Tranh đúng là <b>' + L4[q.ans] + '</b>') + '</div>' +
        '<div class="en"><button class="say" type="button" id="say" aria-label="Nghe lại câu">🔊</button><span>' + esc(it.en) + '</span></div><div class="vi">' + esc(it.vi) + '</div>' +
        (it.tip ? '<div class="tip">💡 ' + esc(it.tip) + '</div>' : '') +
        '<div class="row"><button class="btn" id="nx" type="button">' + (i + 1 < Q.length ? 'Câu tiếp →' : 'Xem kết quả →') + '</button></div></div>';
      $('say').onclick = function () { play(it, false); };
      $('nx').onclick = next; try { $('nx').focus({ preventScroll: true }); } catch (e) {}
      try { $('fb').scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) {}
      if (!ok) setTimeout(function () { if (Q[i] === q) play(it, false); }, 500);
    }
    function next() { i++; if (i >= Q.length) end(false); else { show(); try { $('pl').scrollIntoView({ block: 'nearest' }); } catch (e) {} } }
    function coin(txt, el) {
      var c = document.createElement('span'), stg = el.closest('.stage'), r = el.getBoundingClientRect(), s = stg.getBoundingClientRect();
      c.className = 'coin'; c.textContent = txt; c.style.left = (r.left - s.left + r.width / 2 - 20) + 'px'; c.style.top = (r.top - s.top + 20) + 'px';
      stg.appendChild(c); setTimeout(function () { c.remove(); }, 1000);
    }
    function end(quit) {
      try { if (au) au.pause(); } catch (e) {}
      var done = quit ? i + (lock ? 1 : 0) : Q.length;
      var B = get(KEY, {}) || {}; B.lv = B.lv || {};
      var st = right >= 10 ? 3 : right >= 8 ? 2 : right >= 5 ? 1 : 0, rec = false;
      if (!review && !quit) { var b = B.lv[lv] || (B.lv[lv] = {}); if (right > (b.best || 0)) { b.best = right; rec = true; } if (st > (b.stars || 0)) b.stars = st; if (gold > (b.gold || 0)) b.gold = gold; }
      if (done > 0) { B.games = (B.games || 0) + 1; B.right = (B.right || 0) + right; B.total = (B.total || 0) + done; B.gold = (B.gold || 0) + gold; B.streak = Math.max(B.streak || 0, bestStreak); B.last = Date.now(); put(KEY, B); }
      if (!quit && st === 3 && window.MCONFETTI) try { window.MCONFETTI(); } catch (e) {}
      var nextLv = !review && !quit && st >= 2 && lv < 3;
      main.innerHTML = '<div class="card res"><div class="stars" aria-label="' + st + ' sao">' + (quit ? '' : stars(st)) + '</div><div class="sc">' + right + '/' + done + '</div><p>câu đúng · 🪙 <b>' + gold + '</b> vàng · chuỗi dài nhất <b>' + bestStreak + '</b></p>' +
        (rec ? '<p>🏆 Kỷ lục mới của ' + LV[lv][0] + '!</p>' : '') +
        (quit ? '' : '<p class="hint">' + (st === 3 ? 'Tuyệt vời, không sai câu nào! ✨' : st === 2 ? 'Giỏi lắm! Thử cấp khó hơn nhé.' : st === 1 ? 'Khá rồi! Chơi lại để được thêm sao.' : 'Không sao, nghe lại vài lần là quen tai ngay 💪') + '</p>') +
        (wrong.length ? '<div class="wl"><b>Câu nghe sai (đã vào danh sách ôn, hẹn ôn lại ngày mai):</b>' + wrong.map(function (it) { return '<div class="wi"><button class="say" type="button" data-id="' + it.id + '" aria-label="Nghe">🔊</button><span><b>' + esc(it.en) + '</b><br><small>' + esc(it.vi) + '</small></span></div>'; }).join('') + '</div>' : '') +
        '<div class="row">' + (nextLv ? '<button class="btn" id="up" type="button">Lên ' + LV[lv + 1][0] + ' →</button>' : '') + '<button class="btn' + (nextLv ? ' alt' : '') + '" id="again" type="button">↻ Chơi lại</button><button class="btn alt" id="menu" type="button">Chọn cấp</button></div></div>';
      [].forEach.call(main.querySelectorAll('.wl .say'), function (b) { b.onclick = function () { play(BY[b.dataset.id], false); }; });
      document.getElementById('again').onclick = function () { start(review); };
      document.getElementById('menu').onclick = menu;
      var up = document.getElementById('up'); if (up) up.onclick = function () { lv++; put(KEY + '.lvl', lv); start(false); };
      window.__pic.state = function () { return { done: true, right: right, gold: gold }; };
    }
    document.onkeydown = function (e) {
      if (!$('pics') || e.target.tagName === 'INPUT') return;
      var k = e.key.toUpperCase(), j = L4.indexOf(k); if (j < 0 && /^[1-4]$/.test(k)) j = +k - 1;
      if (j >= 0 && !lock) { var b = $('pics').querySelector('[data-j="' + j + '"]'); if (b) b.click(); }
      else if (k === ' ' && !lock) { e.preventDefault(); play(Q[i] && Q[i].it, false); }
    };
    window.__pic = { state: function () { return { i: i, right: right, gold: gold, streak: streak, ans: Q[i] && Q[i].ans, id: Q[i] && Q[i].it.id, lock: lock }; } };
    show();
  }
  window.__pic = { state: function () { return { menu: true }; } };
  menu();
})();

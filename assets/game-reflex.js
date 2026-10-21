/* Phản xạ Part 2 — nghe câu hỏi (cắt từ audio đề thật), chọn câu đáp trong thời gian giới hạn, càng đúng càng nhanh. */
(function () {
  'use strict';
  var main = document.getElementById('main'), au = document.getElementById('au');
  function get(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function put(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var D = window.ETSDICT || {}, L3 = ['A', 'B', 'C'];
  var ITEMS = (window.ETSMINI || []).filter(function (x) { return x.p === 2 && x.q; }).map(function (x) {
    var seg = ((D[x.t] || {}).p2 || []).filter(function (s) { return s.q === x.n && s.k === 'Q'; })[0];
    return { t: x.t, n: x.n, q: x.q, qv: x.qv, o: x.o, v: x.v, a: x.a, src: 'audio/t' + x.t + '/' + x.au, s: seg ? seg.s : null, e: seg ? seg.e : null };
  });
  var KEY = 'mt.game.reflex', mode = get(KEY + '.mode', 'listen');
  var stopAt = null;
  au.addEventListener('timeupdate', function () { if (stopAt != null && au.currentTime >= stopAt) { au.pause(); stopAt = null; if (au._done) { var f = au._done; au._done = null; f(); } } });
  au.addEventListener('ended', function () { if (au._done) { var f = au._done; au._done = null; f(); } });
  function playSeg(it, done) {
    au._done = null; stopAt = null;
    if (it.s == null) { setTimeout(done, 200); return; }
    var go = function () { try { au.currentTime = Math.max(0, it.s - .05); } catch (e) {} stopAt = it.e + .15; au._done = done; var p = au.play(); if (p && p.catch) p.catch(function () { au._done = null; done(); }); };
    if (au.getAttribute('src') !== it.src) { au.setAttribute('src', it.src); au.addEventListener('loadedmetadata', function lm() { au.removeEventListener('loadedmetadata', lm); go(); }); au.load(); }
    else go();
    // an toàn: nếu audio treo thì vẫn cho làm
    setTimeout(function () { if (au._done === done) { au._done = null; au.pause(); done(); } }, ((it.e - it.s) || 3) * 1000 + 2500);
  }

  function menu() {
    var B = get(KEY, {});
    main.innerHTML = '<div class="card"><div class="lbl">Cách chơi</div><div class="row">' +
      '<button class="chip" data-m="listen" aria-pressed="' + (mode === 'listen') + '">🎧 Nghe câu hỏi <small>như thi thật</small></button>' +
      '<button class="chip" data-m="read" aria-pressed="' + (mode === 'read') + '">👀 Đọc câu hỏi <small>khi không tiện bật loa</small></button></div>' +
      '<div class="best"><div><b>' + (B[mode] || 0) + '</b><span>điểm cao nhất</span></div><div><b>' + (B.streak || 0) + '</b><span>chuỗi đúng dài nhất</span></div><div><b>' + (B.games || 0) + '</b><span>ván đã chơi</span></div></div>' +
      '<p style="margin:16px 0 0"><button class="btn" id="go">▶ Bắt đầu</button></p>' +
      '<p class="hint">Bắt đầu với <b>6 giây</b> mỗi câu (tính từ lúc nghe xong câu hỏi). Cứ đúng 3 câu liền thời gian giảm 0,25 giây, nhanh nhất 3 giây. Sai hoặc hết giờ mất 1 ❤ — có 3 ❤. ' + ITEMS.length + ' câu hỏi Part 2 lấy từ 10 đề ETS 2026.</p></div>';
    [].forEach.call(main.querySelectorAll('[data-m]'), function (b) { b.onclick = function () { mode = b.dataset.m; put(KEY + '.mode', mode); menu(); }; });
    document.getElementById('go').onclick = play;
  }

  function play() {
    var deck = ITEMS.filter(function (x) { return mode === 'read' || x.s != null; }).sort(function () { return Math.random() - .5; });
    var hp = 3, score = 0, streak = 0, bestStreak = 0, win = 6, ok3 = 0, idx = 0, wrong = [], timer = 0, t0 = 0, running = true, answered = false;
    main.innerHTML = '<div class="hud"><span id="hp"></span><span>⭐ <span id="sc">0</span></span><span>🔥 <span id="st">0</span></span><span class="sp">⚡ <span id="wn">6.00</span>s / câu</span></div>' +
      '<div class="stage"><div class="ring"><svg viewBox="0 0 120 120"><circle class="bg" cx="60" cy="60" r="52"/><circle class="fg" id="fg" cx="60" cy="60" r="52" stroke-dasharray="326.7" stroke-dashoffset="0"/></svg><b id="tm">–</b></div>' +
      '<div class="ear" id="ear"></div><div class="qtxt" id="qt"></div><div class="ops" id="ops"></div>' +
      '<p style="margin:12px 0 0"><button class="btn alt" id="quit" type="button">Kết thúc</button></p></div>';
    var fg = document.getElementById('fg'), tm = document.getElementById('tm'), ops = document.getElementById('ops'), qt = document.getElementById('qt'), ear = document.getElementById('ear');
    document.getElementById('quit').onclick = function () { end(); };
    function hud() {
      document.getElementById('hp').textContent = '❤'.repeat(hp) + '♡'.repeat(3 - hp);
      document.getElementById('sc').textContent = score; document.getElementById('st').textContent = streak;
      document.getElementById('wn').textContent = win.toFixed(2);
    }
    function ring(frac) { fg.setAttribute('stroke-dashoffset', String(326.7 * (1 - frac))); fg.classList.toggle('low', frac < .35); }
    function next() {
      if (!running) return;
      if (idx >= deck.length) { deck.sort(function () { return Math.random() - .5; }); idx = 0; }
      var it = deck[idx++]; answered = false; ring(1); tm.textContent = '…';
      ops.className = 'ops wait';
      ops.innerHTML = it.o.map(function (o, i) { return '<button class="op" data-l="' + L3[i] + '" disabled><span class="L">' + L3[i] + '</span><span>' + esc(o) + '</span></button>'; }).join('');
      [].forEach.call(ops.querySelectorAll('.op'), function (b) { b.onclick = function () { pick(it, b.dataset.l); }; });
      if (mode === 'read') { qt.innerHTML = esc(it.q); ear.textContent = ''; setTimeout(function () { go(it, 2); }, 350); }
      else { qt.innerHTML = ''; ear.textContent = '🎧 Đang nghe câu hỏi…'; playSeg(it, function () { if (running) go(it, 0); }); }
    }
    function go(it, extra) {
      ear.textContent = mode === 'listen' ? '⏱ Chọn nhanh!' : '';
      ops.className = 'ops';
      [].forEach.call(ops.querySelectorAll('.op'), function (b) { b.disabled = false; });
      var W = win + extra; t0 = performance.now();
      cancelAnimationFrame(timer);
      (function tick() {
        if (answered || !running) return;
        var left = W - (performance.now() - t0) / 1000;
        if (left <= 0) { ring(0); tm.textContent = '0'; return pick(it, null); }
        ring(left / W); tm.textContent = left.toFixed(1);
        timer = requestAnimationFrame(tick);
      })();
    }
    function pick(it, l) {
      if (answered) return; answered = true; cancelAnimationFrame(timer);
      var good = l === it.a, rt = (performance.now() - t0) / 1000;
      [].forEach.call(ops.querySelectorAll('.op'), function (b) {
        b.disabled = true;
        if (b.dataset.l === it.a) b.classList.add('right'); else if (b.dataset.l === l) b.classList.add('wrong');
        var i = L3.indexOf(b.dataset.l); if (it.v && it.v[i]) b.lastChild.insertAdjacentHTML('beforeend', '<small>' + esc(it.v[i]) + '</small>');
      });
      qt.innerHTML = esc(it.q) + (it.qv ? '<small>' + esc(it.qv) + '</small>' : '');
      if (good) {
        streak++; bestStreak = Math.max(bestStreak, streak); ok3++;
        score += 10 + Math.max(0, Math.round((win - rt) * 5)) + Math.min(10, streak);
        ear.textContent = '✓ Chuẩn! ' + rt.toFixed(1) + ' giây';
        if (ok3 >= 3) { ok3 = 0; win = Math.max(3, win - .25); }
      } else {
        hp--; streak = 0; ok3 = 0; wrong.push({ it: it, l: l });
        ear.textContent = l ? '✗ Chưa đúng — đáp án ' + it.a : '⌛ Hết giờ — đáp án ' + it.a;
      }
      if (window.MCOMBO) try { window.MCOMBO(good, ops); } catch (e) {}
      hud();
      if (hp <= 0) return setTimeout(end, 1600);
      setTimeout(next, good ? 1100 : 2400);
    }
    function end() {
      if (!running) return; running = false; cancelAnimationFrame(timer); au.pause(); au._done = null;
      var B = get(KEY, {}), rec = score > (B[mode] || 0);
      if (rec) B[mode] = score; B.streak = Math.max(B.streak || 0, bestStreak); B.games = (B.games || 0) + 1; put(KEY, B);
      if (rec && score > 0 && window.MCONFETTI) try { window.MCONFETTI(); } catch (e) {}
      main.innerHTML = '<div class="card res"><div class="sc">' + score + '</div><p>' + (rec && score ? '🏆 Kỷ lục mới!' : 'Kỷ lục: ' + (B[mode] || 0)) + ' · chuỗi đúng dài nhất ' + bestStreak + ' · tốc độ cuối ' + win.toFixed(2) + 's/câu</p>' +
        (wrong.length ? '<h3 style="text-align:left;margin:14px 0 0">Câu cần xem lại</h3><ul class="wl">' + wrong.map(function (w, i) {
          var it = w.it, ai = L3.indexOf(it.a);
          return '<li><b>' + esc(it.q) + (it.s != null ? '<button type="button" data-i="' + i + '">🔊</button>' : '') + '</b>' + (it.qv ? '<small>' + esc(it.qv) + '</small><br>' : '') + '<span class="ok">' + it.a + '. ' + esc(it.o[ai]) + '</span>' + (it.v ? ' — ' + esc(it.v[ai]) : '') + '<br><small>ETS 2026 · Test ' + it.t + ' · câu ' + it.n + '</small></li>';
        }).join('') + '</ul>' : '') +
        '<div class="row" style="justify-content:center;margin-top:16px"><button class="btn" id="again">↻ Chơi lại</button><button class="btn alt" id="menu">Đổi cách chơi</button></div></div>';
      document.getElementById('again').onclick = play; document.getElementById('menu').onclick = menu;
      [].forEach.call(main.querySelectorAll('[data-i]'), function (b) { b.onclick = function () { playSeg(wrong[+b.dataset.i].it, function () {}); }; });
    }
    hud(); next();
  }
  menu();
})();

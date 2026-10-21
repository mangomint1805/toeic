/* Gõ từ rơi — dùng chung cho web TOEIC và IELTS. Cấu hình ở window.GAME_CFG (site, fc, pools(), scripts[]). */
(function () {
  'use strict';
  var CFG = window.GAME_CFG, main = document.getElementById('main');
  function get(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function put(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function norm(t) { return String(t).toLowerCase().replace(/[’‘]/g, "'").trim(); }
  var BKEY = 'mt.game.typing.' + CFG.site, Q = new URLSearchParams(location.search);
  var POOLS = [], pool = null, mode = get('mt.game.typing.mode', 'easy');

  function loadScripts(list, cb) {
    var n = list.length; if (!n) return cb();
    list.forEach(function (src) { var s = document.createElement('script'); s.src = src; s.onload = s.onerror = function () { if (--n === 0) cb(); }; document.head.appendChild(s); });
  }
  loadScripts(CFG.scripts || [], function () {
    POOLS = CFG.pools();
    var want = Q.get('t') ? 't' + Q.get('t') : Q.get('p') || get('mt.game.typing.pool', '');
    pool = POOLS.filter(function (p) { return p.id === want && p.n >= 5; })[0] || POOLS.filter(function (p) { return p.n >= 5; })[0] || POOLS[0];
    menu();
  });

  function menu() {
    var B = get(BKEY, {}), best = B[mode] || 0;
    var h = '<div class="card"><div class="lbl">Bộ từ</div><div class="row">' + POOLS.map(function (p) {
      return '<button class="chip" data-p="' + p.id + '" aria-pressed="' + (p === pool) + '"' + (p.n < 5 ? ' disabled title="Cần ít nhất 5 từ"' : '') + '>' + esc(p.name) + ' <small>' + p.n + '</small></button>';
    }).join('') + '</div>' +
      (POOLS[0].id === 'mine' && POOLS[0].n < 5 ? '<p class="hint">Bộ “Flashcard của tôi” cần ít nhất 5 từ — bấm vào từ trong bài làm để lưu thêm nhé.</p>' : '') +
      '<div class="lbl">Cách chơi</div><div class="row">' +
      '<button class="chip" data-m="easy" aria-pressed="' + (mode === 'easy') + '">🌱 Gõ lại từ <small>thấy chữ tiếng Anh</small></button>' +
      '<button class="chip" data-m="hard" aria-pressed="' + (mode === 'hard') + '">🔥 Nhìn nghĩa đoán từ <small>chỉ thấy nghĩa Việt</small></button></div>' +
      '<div class="best"><div><b>' + best + '</b><span>điểm cao nhất (' + (mode === 'easy' ? 'gõ lại' : 'nhìn nghĩa') + ')</span></div><div><b>' + (B.games || 0) + '</b><span>ván đã chơi</span></div></div>' +
      '<p style="margin:16px 0 0"><button class="btn" id="go">▶ Bắt đầu</button></p>' +
      '<p class="hint">Gõ đúng từ là nó nổ ngay, không cần Enter. Để rơi chạm đáy mất 1 ❤. Cứ 8 từ lên cấp, từ rơi nhanh hơn. Mẹo: ở chế độ nhìn nghĩa, chữ cái đầu và số chữ được gợi ý sẵn.</p></div>';
    main.innerHTML = h;
    [].forEach.call(main.querySelectorAll('[data-p]'), function (b) { b.onclick = function () { pool = POOLS.filter(function (p) { return p.id === b.dataset.p; })[0]; put('mt.game.typing.pool', pool.id); menu(); }; });
    [].forEach.call(main.querySelectorAll('[data-m]'), function (b) { b.onclick = function () { mode = b.dataset.m; put('mt.game.typing.mode', mode); menu(); }; });
    document.getElementById('go').onclick = play;
    document.getElementById('go').disabled = !pool || pool.n < 5;
  }

  function hintOf(w) { return w.split(' ').map(function (x) { return x.charAt(0) + x.slice(1).replace(/[a-z]/gi, '_'); }).join(' '); }
  function shortM(m) { return String(m || '').replace(/^\([a-z.]+\)\s*/i, '').split(/;\s*/).slice(0, 2).join('; ').slice(0, 60); }

  function play() {
    main.innerHTML = '<div class="hud"><span class="hp" id="hp"></span><span>⭐ <span id="sc">0</span></span><span>Cấp <span id="lv">1</span></span><span class="sp" id="sp"></span></div>' +
      '<div class="field" id="field"></div><div class="typ"><input id="in" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="Gõ từ ở đây…" aria-label="Gõ từ"><button class="btn alt" id="pause" type="button" aria-label="Tạm dừng">Dừng</button></div>';
    var field = document.getElementById('field'), inp = document.getElementById('in');
    var bag = [], live = [], hp = 5, score = 0, lv = 1, cleared = 0, missed = [], hits = 0, streakN = 0;
    var speed = 38, gap = 2600, last = 0, spawnT = 0, run = true, paused = false, raf = 0;
    function refill() { bag = pool.words.slice().sort(function () { return Math.random() - .5; }); }
    function hud() {
      document.getElementById('hp').textContent = '❤'.repeat(hp) + '♡'.repeat(Math.max(0, 5 - hp));
      document.getElementById('sc').textContent = score; document.getElementById('lv').textContent = lv;
      document.getElementById('sp').textContent = pool.name;
    }
    function spawn() {
      if (!bag.length) refill();
      var w = bag.pop(), word = String(w.w).trim();
      if (live.some(function (x) { return x.k === norm(word); })) { if (!bag.length) refill(); w = bag.pop(); word = String(w.w).trim(); }
      var el = document.createElement('div'); el.className = 'wd';
      var W = field.clientWidth, x = 70 + Math.random() * Math.max(10, W - 140);
      el.style.left = x + 'px';
      var o = { w: w, word: word, k: norm(word), y: -50, el: el };
      o.show = mode === 'easy' ? word : hintOf(word);
      el.innerHTML = '<b>' + esc(o.show) + '</b><small>' + esc(shortM(w.m)) + '</small>';
      field.appendChild(el); live.push(o);
    }
    function paint(o, typed) {
      var b = o.el.firstChild;
      if (mode === 'easy' && typed && o.k.indexOf(typed) === 0) b.innerHTML = '<u>' + esc(o.word.slice(0, typed.length)) + '</u>' + esc(o.word.slice(typed.length));
      else if (mode === 'hard' && typed && o.k.indexOf(typed) === 0) b.innerHTML = '<u>' + esc(o.word.slice(0, typed.length)) + '</u>' + esc(o.show.slice(typed.length));
      else b.textContent = o.show;
      o.el.classList.toggle('tgt', !!typed && o.k.indexOf(typed) === 0);
    }
    function pop(x, y, t) { var p = document.createElement('div'); p.className = 'pop'; p.style.left = x + 'px'; p.style.top = y + 'px'; p.textContent = t; field.appendChild(p); setTimeout(function () { p.remove(); }, 700); }
    function kill(o) {
      live.splice(live.indexOf(o), 1);
      var pts = 10 + Math.round(o.word.length * 1.5) + (mode === 'hard' ? 10 : 0) + (lv - 1) * 2;
      score += pts; cleared++; hits++; streakN++;
      pop(parseFloat(o.el.style.left), o.y, '+' + pts);
      o.el.classList.add('boom'); setTimeout(function () { o.el.remove(); }, 360);
      if (window.MCOMBO) try { window.MCOMBO(true, o.el); } catch (e) {}
      if (cleared % 8 === 0) {
        lv++; speed *= 1.13; gap = Math.max(900, gap * .9);
        var L = document.createElement('div'); L.className = 'lvl'; L.textContent = 'Cấp ' + lv + '!'; field.appendChild(L); setTimeout(function () { L.remove(); }, 1200);
      }
      hud();
    }
    function miss(o) {
      live.splice(live.indexOf(o), 1); hp--; streakN = 0;
      if (missed.every(function (m) { return m.w !== o.word; })) missed.push({ w: o.word, m: o.w.m || '', ipa: o.w.ipa || '', ex: o.w.ex || '' });
      o.el.classList.add('miss'); o.el.firstChild.textContent = o.word;
      setTimeout(function () { o.el.remove(); }, 500);
      if (window.MCOMBO) try { window.MCOMBO(false, o.el); } catch (e) {}
      hud(); if (hp <= 0) end();
    }
    inp.oninput = function () {
      var t = norm(inp.value);
      var hit = live.filter(function (o) { return o.k === t; })[0];
      if (hit) { kill(hit); inp.value = ''; t = ''; }
      live.forEach(function (o) { paint(o, t); });
    };
    inp.onkeydown = function (e) {
      if (e.key === 'Enter') { e.preventDefault(); if (inp.value.trim()) { inp.classList.remove('bad'); void inp.offsetWidth; inp.classList.add('bad'); streakN = 0; } inp.value = ''; live.forEach(function (o) { paint(o, ''); }); }
      if (e.key === 'Escape') togglePause();
    };
    function frame(ts) {
      if (!run) return;
      if (!last) last = ts;
      var dt = Math.min(.05, (ts - last) / 1000); last = ts;
      if (!paused) {
        spawnT -= dt * 1000;
        if (spawnT <= 0) { spawn(); spawnT = gap; }
        var H = field.clientHeight;
        for (var i = live.length - 1; i >= 0; i--) {
          var o = live[i]; o.y += speed * dt * (mode === 'hard' ? .8 : 1); o.el.style.top = o.y + 'px';
          if (o.y > H - 34) miss(o);
        }
      }
      raf = requestAnimationFrame(frame);
    }
    function togglePause() {
      paused = !paused; document.getElementById('pause').textContent = paused ? 'Tiếp' : 'Dừng';
      field.style.opacity = paused ? .35 : 1; if (!paused) { last = 0; inp.focus(); }
    }
    document.getElementById('pause').onclick = togglePause;
    document.addEventListener('visibilitychange', function vis() { if (!run) return document.removeEventListener('visibilitychange', vis); if (document.hidden && !paused) togglePause(); });
    function end() {
      run = false; cancelAnimationFrame(raf);
      var B = get(BKEY, {}), rec = score > (B[mode] || 0);
      if (rec) B[mode] = score; B.games = (B.games || 0) + 1; put(BKEY, B);
      if (rec && score > 0 && window.MCONFETTI) try { window.MCONFETTI(); } catch (e) {}
      var C = get('vocab.cards', {}), unsaved = missed.filter(function (m) { return !C[m.w]; });
      main.innerHTML = '<div class="card res"><div class="sc">' + score + '</div><p>' + (rec && score ? '🏆 Kỷ lục mới!' : 'Kỷ lục: ' + (B[mode] || 0)) + ' · ' + hits + ' từ đúng · lên tới cấp ' + lv + '</p>' +
        (missed.length ? '<h3 style="text-align:left;margin:14px 0 0">Từ bị rơi (' + missed.length + ')</h3><ul class="miss-l">' + missed.map(function (m) { return '<li><b>' + esc(m.w) + '</b> ' + esc(m.ipa || '') + ' — ' + esc(m.m) + '</li>'; }).join('') + '</ul>' : '<p>Không để rơi từ nào, đỉnh quá! ✨</p>') +
        '<div class="row" style="justify-content:center;margin-top:16px"><button class="btn" id="again">↻ Chơi lại</button><button class="btn alt" id="menu">Đổi bộ từ</button>' +
        (unsaved.length ? '<button class="btn alt" id="saveM">☆ Lưu ' + unsaved.length + ' từ bị rơi vào flashcard</button>' : '') + '</div></div>';
      document.getElementById('again').onclick = play; document.getElementById('menu').onclick = menu;
      var sm = document.getElementById('saveM');
      if (sm) sm.onclick = function () { var C2 = get('vocab.cards', {}); unsaved.forEach(function (m) { if (!C2[m.w]) C2[m.w] = { w: m.w, ipa: m.ipa, m: m.m, ex: m.ex, src: 'Gõ từ rơi', at: Date.now(), box: 0 }; }); put('vocab.cards', C2); sm.disabled = true; sm.textContent = '★ Đã lưu — ôn ở Flashcard'; };
    }
    refill(); hud(); inp.focus(); spawnT = 400; raf = requestAnimationFrame(frame);
  }
})();

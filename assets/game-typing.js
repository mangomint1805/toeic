/* Gõ từ rơi — dùng chung cho web TOEIC và IELTS. Cấu hình ở window.GAME_CFG (site, fc, pools(), scripts[]). */
(function () {
  'use strict';
  var CFG = window.GAME_CFG, main = document.getElementById('main');
  function get(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function put(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function norm(t) { return String(t).toLowerCase().replace(/[’‘]/g, "'").trim(); }
  var BKEY = 'mt.game.typing.' + CFG.site, Q = new URLSearchParams(location.search);
  var POOLS = [], pool = null, mode = get('mt.game.typing.mode', 'easy'), dur = get('mt.game.typing.dur', 30);

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
      '<button class="chip" data-m="hard" aria-pressed="' + (mode === 'hard') + '">🔥 Nhìn nghĩa đoán từ <small>chỉ thấy nghĩa Việt</small></button>' +
      '<button class="chip" data-m="type" aria-pressed="' + (mode === 'type') + '">⌨️ Gõ nhanh <small>kiểu Monkeytype</small></button></div>' +
      (mode === 'type' ? '<div class="lbl">Thời gian</div><div class="row">' + [15, 30, 60].map(function (d) { return '<button class="chip" data-d="' + d + '" aria-pressed="' + (dur === d) + '">' + d + ' giây</button>'; }).join('') + '</div>' : '') +
      '<div class="best"><div><b>' + (mode === 'type' ? (B['type' + dur] || 0) : best) + '</b><span>' + (mode === 'type' ? 'WPM cao nhất (' + dur + ' giây)' : 'điểm cao nhất (' + (mode === 'easy' ? 'gõ lại' : 'nhìn nghĩa') + ')') + '</span></div><div><b>' + (B.games || 0) + '</b><span>ván đã chơi</span></div></div>' +
      '<p style="margin:16px 0 0"><button class="btn" id="go">▶ Bắt đầu</button></p>' +
      (mode === 'type' ? '<p class="hint">Gõ các từ hiện ra, bấm <b>Space</b> để sang từ kế. Đồng hồ chạy khi bạn gõ chữ đầu tiên. Gõ sai thì Backspace để sửa, kể cả quay lại từ trước. Bấm <b>Tab</b> hoặc ↻ để làm lại. Nên tắt bộ gõ tiếng Việt (Unikey/Telex) khi chơi.</p>' : '') + '<p class="hint"' + (mode === 'type' ? ' hidden' : '') + '>Gõ đúng từ là nó nổ ngay, không cần Enter (bấm Enter cũng được). Để rơi chạm đáy mất 1 ❤. Cứ 8 từ lên cấp, từ rơi nhanh hơn. Mẹo: ở chế độ nhìn nghĩa, chữ cái đầu và số chữ được gợi ý sẵn.</p></div>';
    main.innerHTML = h;
    [].forEach.call(main.querySelectorAll('[data-p]'), function (b) { b.onclick = function () { pool = POOLS.filter(function (p) { return p.id === b.dataset.p; })[0]; put('mt.game.typing.pool', pool.id); menu(); }; });
    [].forEach.call(main.querySelectorAll('[data-m]'), function (b) { b.onclick = function () { mode = b.dataset.m; put('mt.game.typing.mode', mode); menu(); }; });
    [].forEach.call(main.querySelectorAll('[data-d]'), function (b) { b.onclick = function () { dur = +b.dataset.d; put('mt.game.typing.dur', dur); menu(); }; });
    document.getElementById('go').onclick = function () { if (mode === 'type') speedTest(); else play(); };
    document.getElementById('go').disabled = !pool || pool.n < 5;
  }

  /* ⌨️ Gõ nhanh kiểu Monkeytype */
  var CSS = '.mt-top{display:flex;gap:14px;align-items:baseline;margin:12px 0 6px;font-weight:700}.mt-top .t{font:600 30px/1 Fraunces,Georgia,serif;color:var(--brand-ink)}.mt-top .w{color:var(--dim);font-size:14px}.mt-top button{margin-left:auto}' +
    '.mt-box{position:relative;height:calc(3 * 1.75em);overflow:hidden;font:500 clamp(20px,4.6vw,26px)/1.75 "IBM Plex Mono",ui-monospace,Menlo,Consolas,monospace;cursor:text;background:var(--card);border:1.5px solid var(--line);border-radius:16px;padding:0 18px;box-sizing:content-box}' +
    '.mt-box.focus{border-color:var(--brand)}.mt-in{transition:transform .15s}.mt-in .w{display:inline-block;margin-right:.6em;color:var(--dim);opacity:.75}' +
    '.mt-in .w.err{text-decoration:underline wavy var(--bad);text-underline-offset:6px}.mt-in .ok{color:var(--ink);opacity:1}.mt-in .no{color:var(--bad);opacity:1}.mt-in .ex{color:var(--bad);opacity:.6}' +
    '.mt-in .w.on{opacity:1}.mt-in i{font-style:normal;position:relative}.mt-in i.c::before{content:"";position:absolute;left:-1px;top:.25em;bottom:.25em;width:2px;background:var(--brand);border-radius:2px;animation:mtb 1s steps(1) infinite}' +
    '.mt-in i.c.end::before{left:auto;right:-2px}@keyframes mtb{50%{opacity:0}}.mt-box.run i.c::before{animation:none}' +
    '.mt-cover{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.75);font:600 16px/1.3 "IBM Plex Sans",sans-serif;color:var(--brand-ink);text-align:center;padding:10px}' +
    '.mt-cover[hidden]{display:none}.mt-hid{position:absolute;left:0;bottom:0;width:1px;height:1px;opacity:0;border:0;padding:0;font-size:16px}' +
    '.mt-m{min-height:1.5em;margin:8px 2px 0;color:var(--dim);font-size:14.5px}.mt-m b{color:var(--ink);font-family:Fraunces,Georgia,serif}' +
    '.mt-res{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:10px 0}.mt-res div{background:var(--panel2);border-radius:12px;padding:10px 8px;text-align:center}' +
    '.mt-res b{display:block;font:600 30px/1.1 Fraunces,Georgia,serif;color:var(--brand-ink)}.mt-res span{font-size:12.5px;color:var(--dim)}@media(max-width:520px){.mt-res{grid-template-columns:repeat(2,1fr)}}' +
    '@media (prefers-reduced-motion:reduce){.mt-in{transition:none}.mt-in i.c::before{animation:none}}';
  function speedTest() {
    if (!document.getElementById('mt-css')) { var st = document.createElement('style'); st.id = 'mt-css'; st.textContent = CSS; document.head.appendChild(st); }
    // từ đơn (chỉ chữ cái), mỗi từ nhớ mục gốc để hiện nghĩa
    var src = [];
    pool.words.forEach(function (w) { String(w.w).toLowerCase().replace(/[’‘]/g, "'").split(/\s+/).forEach(function (t) { t = t.replace(/[^a-z']/g, ''); if (t.length > 1) src.push({ t: t, e: w }); }); });
    if (src.length < 5) { main.innerHTML = '<div class="card"><p>Bộ từ này ít quá, chọn bộ khác nhé.</p><button class="btn" id="menu">← Quay lại</button></div>'; document.getElementById('menu').onclick = menu; return; }
    var seq = [];
    function more(n) { for (var i = 0; i < n; i++) { var x; do { x = src[Math.floor(Math.random() * src.length)]; } while (src.length > 3 && seq.length && seq[seq.length - 1].t === x.t); seq.push({ t: x.t, e: x.e, typed: '', done: false }); } }
    more(120);
    main.innerHTML = '<div class="mt-top"><span class="t" id="mtT">' + dur + '</span><span class="w" id="mtW">' + esc(pool.name) + '</span><button class="btn alt" id="mtR" type="button" title="Làm lại (Tab)">↻ Làm lại</button></div>' +
      '<div class="mt-box" id="mtBox"><div class="mt-in" id="mtIn"></div><div class="mt-cover" id="mtCov">Bấm vào đây rồi gõ để bắt đầu</div>' +
      '<input class="mt-hid" id="mtK" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Gõ từ"></div>' +
      '<div class="mt-m" id="mtM"></div><p class="hint">Space: sang từ kế · Backspace: sửa · Tab: làm lại · Esc: về menu</p>';
    var box = document.getElementById('mtBox'), inn = document.getElementById('mtIn'), k = document.getElementById('mtK'), cov = document.getElementById('mtCov');
    var cur = 0, started = 0, endAt = 0, timer = 0, over = false, keys = 0, goodKeys = 0, shift = 0;
    function wordHTML(w, i) {
      var h = '', t = w.t, y = w.typed, on = i === cur;
      for (var j = 0; j < Math.max(t.length, y.length); j++) {
        var cls = j >= t.length ? 'ex' : j < y.length ? (y[j] === t[j] ? 'ok' : 'no') : '';
        if (on && j === y.length) cls += ' c';
        h += '<i class="' + cls + '">' + esc(j < t.length ? t[j] : y[j]) + '</i>';
      }
      if (on && y.length >= t.length) h = h.replace(/<i class="([^"]*)">([^<]*)<\/i>$/, '<i class="$1 c end">$2</i>');
      return '<span class="w' + (on ? ' on' : '') + (w.done && w.typed !== w.t ? ' err' : '') + '" data-i="' + i + '">' + h + '</span>';
    }
    function render() {
      if (seq.length - cur < 40) more(60);
      inn.innerHTML = seq.map(wordHTML).join('');
      var el = inn.querySelector('.w.on'), lh = parseFloat(getComputedStyle(box).lineHeight) || 40;
      if (el) { var line = Math.round(el.offsetTop / lh); shift = Math.max(0, line - 1); inn.style.transform = 'translateY(' + (-shift * lh) + 'px)'; }
      var e = seq[cur].e; document.getElementById('mtM').innerHTML = '<b>' + esc(e.w) + '</b>' + (e.m ? ' — ' + esc(shortM(e.m)) : '');
    }
    function stats() {
      var ms = started ? Math.min(Date.now(), endAt) - started : 0, min = Math.max(ms, 1000) / 60000, okc = 0, all = 0, bad = [];
      seq.forEach(function (w, i) {
        if (!w.done && i !== cur) return;
        var good = w.typed === w.t; all += w.typed.length + (w.done ? 1 : 0);
        if (w.done && good) okc += w.t.length + 1; else if (!w.done && good) okc += w.t.length;
        if (w.done && !good && bad.every(function (b) { return b.t !== w.t; })) bad.push(w);
      });
      return { wpm: Math.round(okc / 5 / min), raw: Math.round(all / 5 / min), acc: keys ? Math.round(goodKeys / keys * 100) : 0, bad: bad, words: seq.filter(function (w) { return w.done && w.typed === w.t; }).length };
    }
    function tick() {
      var left = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      document.getElementById('mtT').textContent = left;
      document.getElementById('mtW').textContent = Date.now() - started > 2000 ? stats().wpm + ' WPM' : '…';
      if (left <= 0) finish();
    }
    function finish() {
      if (over) return; over = true; clearInterval(timer);
      var r = stats(), B = get(BKEY, {}), key = 'type' + dur, rec = r.wpm > (B[key] || 0);
      if (rec) B[key] = r.wpm; B.games = (B.games || 0) + 1; put(BKEY, B);
      if (rec && r.wpm > 0 && window.MCONFETTI) try { window.MCONFETTI(); } catch (e) {}
      var C = get('vocab.cards', {}), unsaved = r.bad.filter(function (w) { return !C[w.e.w]; });
      main.innerHTML = '<div class="card res"><p style="margin:0;font-weight:700">' + (rec && r.wpm ? '🏆 Kỷ lục mới!' : 'Kỷ lục ' + dur + ' giây: ' + (B[key] || 0) + ' WPM') + '</p>' +
        '<div class="mt-res"><div><b>' + r.wpm + '</b><span>WPM (từ/phút)</span></div><div><b>' + r.acc + '%</b><span>độ chính xác</span></div><div><b>' + r.words + '</b><span>từ đúng</span></div><div><b>' + r.raw + '</b><span>tốc độ thô</span></div></div>' +
        (r.bad.length ? '<h3 style="text-align:left;margin:14px 0 0">Từ gõ sai (' + r.bad.length + ')</h3><ul class="miss-l">' + r.bad.map(function (w) { return '<li><b>' + esc(w.t) + '</b> <span style="color:var(--bad)">(bạn gõ: ' + esc(w.typed || '—') + ')</span>' + (w.e.m ? ' — ' + esc(w.e.w !== w.t ? w.e.w + ': ' : '') + esc(shortM(w.e.m)) : '') + '</li>'; }).join('') + '</ul>' : '<p>Không sai từ nào, quá đỉnh! ✨</p>') +
        '<div class="row" style="justify-content:center;margin-top:16px"><button class="btn" id="again">↻ Gõ tiếp</button><button class="btn alt" id="menu">Đổi bộ từ</button>' +
        (unsaved.length ? '<button class="btn alt" id="saveM">☆ Lưu ' + unsaved.length + ' từ gõ sai vào flashcard</button>' : '') + '</div></div>';
      document.getElementById('again').onclick = speedTest; document.getElementById('menu').onclick = menu;
      var sm = document.getElementById('saveM');
      if (sm) sm.onclick = function () { var C2 = get('vocab.cards', {}); unsaved.forEach(function (w) { var e = w.e; if (!C2[e.w]) C2[e.w] = { w: e.w, ipa: e.ipa || '', m: e.m || '', ex: e.ex || '', src: 'Gõ nhanh', at: Date.now(), box: 0 }; }); put('vocab.cards', C2); sm.disabled = true; sm.textContent = '★ Đã lưu — ôn ở Flashcard'; };
      document.getElementById('again').focus();
    }
    function start() { if (started) return; started = Date.now(); endAt = started + dur * 1000; box.classList.add('run'); timer = setInterval(tick, 200); }
    function typeChar(ch) {
      if (over) return; var w = seq[cur];
      if (ch === ' ') { if (!w.typed) return; keys++; if (w.typed === w.t) goodKeys++; w.done = true; cur++; render(); return; }
      start(); if (w.typed.length >= w.t.length + 12) return;
      keys++; if (w.t[w.typed.length] === ch) goodKeys++;
      w.typed += ch; render();
    }
    function back(word) {
      if (over) return; var w = seq[cur];
      if (!w.typed) { var p = seq[cur - 1]; if (p && p.done && p.typed !== p.t) { p.done = false; cur--; } else return; w = seq[cur]; if (!word) { render(); return; } }
      if (word) w.typed = ''; else w.typed = w.typed.slice(0, -1);
      render();
    }
    // Ô nhập ẩn: đọc chữ qua sự kiện input để chạy được cả trên điện thoại
    var Z = '\u200b';
    function reset() { k.value = Z; try { k.setSelectionRange(1, 1); } catch (e) {} }
    k.addEventListener('input', function (e) {
      var v = k.value; reset();
      if (v.indexOf(Z) < 0 && v === '' || e.inputType === 'deleteContentBackward') return back(false);
      if (e.inputType === 'deleteWordBackward') return back(true);
      v.replace(/\u200b/g, '').toLowerCase().replace(/[’‘]/g, "'").split('').forEach(function (c) { typeChar(/\s/.test(c) ? ' ' : c); });
    });
    k.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') { e.preventDefault(); clearInterval(timer); over = true; speedTest(); return; }
      if (e.key === 'Escape') { clearInterval(timer); over = true; menu(); return; }
      if (e.key === 'Backspace') { e.preventDefault(); back(e.ctrlKey || e.altKey || e.metaKey); return; }
      if (e.key === 'Enter') { e.preventDefault(); typeChar(' '); }
    });
    function focus() { k.focus({ preventScroll: true }); }
    k.addEventListener('focus', function () { box.classList.add('focus'); cov.hidden = true; });
    k.addEventListener('blur', function () { box.classList.remove('focus'); if (!over) { cov.hidden = false; cov.textContent = started ? 'Bấm vào đây để gõ tiếp' : 'Bấm vào đây rồi gõ để bắt đầu'; } });
    box.addEventListener('click', focus);
    document.getElementById('mtR').onclick = function () { clearInterval(timer); over = true; speedTest(); };
    reset(); render(); focus();
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
    // Bộ gõ (Unikey/Telex, bàn phím điện thoại) có thể "trả lại" chữ cũ sau khi xoá ô giữa lúc đang ghép chữ.
    // skip = phần chữ đã dùng xong; nếu nó quay lại đầu ô thì bỏ qua và xoá khi an toàn.
    var composing = false, skip = '';
    function raw() {
      var v = inp.value;
      if (skip) { if (v.indexOf(skip) === 0) v = v.slice(skip.length); else skip = ''; }
      return v;
    }
    function tidy() { if (composing || !skip) return; var v = raw(); skip = ''; if (inp.value !== v) inp.value = v; }
    function clearBox() { if (composing) skip = inp.value; else { skip = ''; inp.value = ''; } }
    function check() {
      var t = norm(raw());
      var hit = live.filter(function (o) { return o.k === t; })[0];
      if (hit) { kill(hit); clearBox(); t = ''; }
      live.forEach(function (o) { paint(o, t); });
    }
    inp.addEventListener('compositionstart', function () { composing = true; });
    inp.addEventListener('compositionend', function () { composing = false; setTimeout(function () { tidy(); check(); }, 0); });
    inp.oninput = function () { tidy(); check(); };
    inp.onkeydown = function (e) {
      if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault();
        var t = norm(raw()), hit = live.filter(function (o) { return o.k === t; })[0];
        if (hit) kill(hit);
        else if (t) { inp.classList.remove('bad'); void inp.offsetWidth; inp.classList.add('bad'); streakN = 0; }
        clearBox(); setTimeout(function () { if (!composing) { skip = ''; inp.value = ''; } }, 30);
        live.forEach(function (o) { paint(o, ''); });
      }
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

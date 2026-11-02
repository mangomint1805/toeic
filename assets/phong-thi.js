/* Phòng thi chung — phía học viên (test.html?room=MÃ). Thầy mở phòng ở mangomint1805.github.io/phong-thi.html.
   Realtime Database: examroom/{mã}/meta (đề, số phút), state (ph: lobby|run|end, st: giờ bắt đầu, en: giờ hết — giờ máy chủ),
   p/{uid} (tên, số câu đã làm, câu đang làm, số lần rời tab, đã nộp, điểm). Đăng nhập ẩn danh bằng app riêng tên 'room'.
   Luật: firebase/them-luat-phong-thi.txt trong repo trang chủ. Kết quả vẫn lưu như bài thường (ets26.hist, gửi Google Sheet). */
(function () {
  'use strict';
  var SDK = 'https://www.gstatic.com/firebasejs/10.12.2/';
  var DBURL = 'https://minto-english-default-rtdb.asia-southeast1.firebasedatabase.app';
  var CFG = { apiKey: 'AIzaSyA7LEweMPy4tSjjR_An_KZaGXSzGI2nQv4', authDomain: 'minto-english.firebaseapp.com', databaseURL: DBURL, projectId: 'minto-english', storageBucket: 'minto-english.firebasestorage.app', messagingSenderId: '160119750089', appId: '1:160119750089:web:aac59cf8b1f577c035bc18' };
  var THROTTLE = 3000;
  function $(s) { return document.querySelector(s); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function ls(k) { try { return localStorage.getItem(k) || ''; } catch (e) { return ''; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function J(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function toast(msg, ms) { var d = document.createElement('div'); d.className = 'toast'; d.textContent = msg; document.body.appendChild(d); setTimeout(function () { d.remove(); }, ms || 3000); }
  function css() {
    if ($('#rmCss')) return;
    var st = document.createElement('style'); st.id = 'rmCss';
    st.textContent = '.rm{max-width:560px;margin:24px auto;background:#fff;border:1px solid #e6e0d3;border-radius:16px;padding:22px 20px;text-align:center}' +
      '.rm h2{font:600 24px/1.2 Fraunces,Georgia,serif;margin:0 0 6px;color:#6b4410}.rm p{color:#4a505a;margin:8px 0}.rm .code{display:inline-block;font:700 15px/1 "IBM Plex Sans",sans-serif;letter-spacing:.12em;background:#f2e2c4;color:#6b4410;border-radius:999px;padding:6px 12px}' +
      '.rm form{display:grid;gap:10px;text-align:left;margin-top:14px}.rm label{display:grid;gap:4px;font-size:13px;font-weight:600;color:#666e7a}' +
      '.rm input{font:inherit;font-size:16px;padding:11px 12px;border:1.5px solid #ddd7c9;border-radius:10px;width:100%;box-sizing:border-box}.rm .btn{width:100%;min-height:46px;font-size:16px}' +
      '.rm .rmbig{font:600 64px/1 Fraunces,Georgia,serif;color:#a8691a;margin:14px 0}.rm .dots::after{content:"";animation:rmd 1.4s infinite}@keyframes rmd{0%{content:""}33%{content:"."}66%{content:".."}100%{content:"..."}}' +
      '.rm .warn{background:#fff4e5;border:1px solid #f0c98a;color:#7a4b00;border-radius:10px;padding:10px 12px;text-align:left;font-size:14px}.rm .err{color:#c14636;font-weight:600}' +
      '.rmbar{background:#f2e2c4;color:#6b4410;border-radius:10px;padding:8px 12px;margin:0 0 12px;font-size:14px}';
    document.head.appendChild(st);
  }
  function screen(h) { css(); $('#main').innerHTML = '<div class="rm">' + h + '</div>'; }

  var api, code, fb, off = 0, uid, meta, state = null, started = false, joined = false, info = {}, pend = null, pendT = 0, lastPush = 0, hidN = 0, cdT = 0;
  function now() { return Date.now() + off; }

  function codeForm(bad) {
    screen('<h2>Phòng thi chung</h2><p>Nhập mã phòng 6 số thầy cho trên bảng.</p>' + (bad ? '<p class="err">Mã phòng phải gồm 6 chữ số.</p>' : '') +
      '<form id="rmCode"><label>Mã phòng<input id="rmC" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="off" placeholder="VD: 482913"></label><button class="btn" type="submit">Vào phòng</button></form>');
    $('#rmCode').onsubmit = function (e) { e.preventDefault(); var v = $('#rmC').value.replace(/\D/g, ''); if (!/^\d{6}$/.test(v)) return codeForm(true); location.search = '?room=' + v; };
    $('#rmC').focus();
  }
  function noRules() {
    screen('<h2>Phòng thi chưa được bật</h2><p class="warn">Máy chủ chưa cho phép phòng thi chung (thầy cần thêm luật Firebase một lần). Bạn báo thầy giúp nhé — trong lúc chờ vẫn có thể <a href="./">luyện đề bình thường</a>.</p>');
  }

  function init() {
    return Promise.all([import(SDK + 'firebase-app.js'), import(SDK + 'firebase-auth.js'), import(SDK + 'firebase-database.js')]).then(function (m) {
      var AP = m[0], A = m[1], D = m[2], app;
      try { app = AP.getApp('room'); } catch (e) { app = AP.initializeApp(CFG, 'room'); }
      var auth = A.getAuth(app), db = D.getDatabase(app, DBURL), emu = window.ROOM_EMU;
      if (emu && !db._rmEmu) { A.connectAuthEmulator(auth, emu.auth, { disableWarnings: true }); D.connectDatabaseEmulator(db, emu.db[0], emu.db[1]); db._rmEmu = 1; }
      fb = { A: A, D: D, auth: auth, db: db };
      D.onValue(D.ref(db, '.info/serverTimeOffset'), function (s) { var v = s.val(); if (typeof v === 'number') off = v; });
      return auth.authStateReady().then(function () { return auth.currentUser || A.signInAnonymously(auth).then(function (c) { return c.user; }); });
    }).then(function (u) { uid = u.uid; });
  }
  function R(p) { return fb.D.ref(fb.db, 'examroom/' + code + (p ? '/' + p : '')); }
  function denied(e) { return /permission|PERMISSION_DENIED/i.test(String((e && (e.code || e.message)) || e)); }

  function boot(a) {
    api = a; code = String(new URLSearchParams(location.search).get('room') || '').replace(/\D/g, '');
    $('#sheetBtn').hidden = true;
    if (!/^\d{6}$/.test(code)) return codeForm(!!code);
    screen('<h2>Phòng thi <span class="code">' + code + '</span></h2><p class="dots">Đang vào phòng</p>');
    init().then(function () { return fb.D.get(R('meta')); }).then(function (s) {
      meta = s.val();
      if (!meta) return screen('<h2>Không tìm thấy phòng</h2><p>Không có phòng thi mã <span class="code">' + code + '</span>. Kiểm tra lại mã với thầy nhé.</p><p><a class="btn alt" href="?room=">Nhập mã khác</a></p>');
      if (!api.hasMode(meta.m)) return screen('<h2>Đề không hợp lệ</h2><p>Phòng này chọn một đề chưa có trên web. Báo thầy giúp nhé.</p>');
      var q = new URLSearchParams(location.search);
      if (String(meta.t) !== q.get('t') || meta.m !== q.get('m')) { location.replace('test.html?t=' + meta.t + '&m=' + meta.m + '&room=' + code); return; }
      if (meta.at < now() - 12 * 3600000) return screen('<h2>Phòng đã đóng</h2><p>Phòng thi này đã quá 12 giờ. Hỏi thầy mã phòng mới nhé.</p>');
      return fb.D.get(R('p/' + uid)).then(function (ps) {
        var me = ps.val(), st = J(api.key(meta.m));
        if (me && me.s && st && st.room === code) { started = true; joined = true; api.bind(hook()); return api.route(); }
        if (me && me.n) return join(me.n, me.l || '', me);
        joinForm();
      });
    }).catch(function (e) { console.error('phong-thi', e); if (denied(e)) return noRules(); screen('<h2>Chưa vào được phòng</h2><p>Kết nối bị lỗi. Kiểm tra mạng rồi <a href="">tải lại trang</a>.</p>'); });
  }

  function info1() { return api.NAME + ' · ' + api.modeName(meta.m) + ' · ' + api.count(meta.m) + ' câu · ' + meta.mins + ' phút'; }
  function joinForm(err) {
    var acc = J('mt.acc') || {}, nm = ls('cam20.name') || acc.name || '', lop = ls('cam20.lop') || meta.lop || '';
    screen('<h2>Phòng thi <span class="code">' + code + '</span></h2><p><b>' + esc(meta.ti || info1()) + '</b>' + (meta.ti ? '<br><small>' + esc(info1()) + '</small>' : '') + '</p>' +
      (err ? '<p class="err">' + esc(err) + '</p>' : '') +
      '<form id="rmJoin"><label>Họ và tên (thầy sẽ thấy tên này)<input id="rmN" maxlength="40" autocomplete="name" value="' + esc(nm) + '" required></label>' +
      '<label>Lớp<input id="rmL" maxlength="40" value="' + esc(lop) + '"></label><button class="btn" type="submit">Vào phòng chờ</button></form>' +
      '<p class="hint" style="margin-top:12px">Cả lớp bắt đầu cùng lúc khi thầy bấm <b>Bắt đầu</b>. Đừng chuyển sang tab/ứng dụng khác trong lúc thi — thầy sẽ thấy đó.</p>');
    $('#rmJoin').onsubmit = function (e) {
      e.preventDefault(); var n = $('#rmN').value.trim().replace(/\s+/g, ' ').slice(0, 40), l = $('#rmL').value.trim().slice(0, 40);
      if (!n) return joinForm('Bạn nhập họ tên giúp thầy nhé.');
      lsSet('cam20.name', n); lsSet('cam20.lop', l); join(n, l, null);
    };
  }

  function join(n, l, me) {
    var D = fb.D, acc = J('mt.acc') || {}, o = { n: n, l: l, o: true, tt: api.count(meta.m), at: D.serverTimestamp() };
    if (acc.email) o.e = String(acc.email).slice(0, 100);
    if (!me) { o.j = D.serverTimestamp(); o.a = 0; o.q = 0; o.h = 0; } else hidN = me.h || 0;
    screen('<h2>Phòng thi <span class="code">' + code + '</span></h2><p class="dots">Đang vào phòng chờ</p>');
    D.update(R('p/' + uid), o).then(function () {
      joined = true;
      D.onDisconnect(R('p/' + uid)).update({ o: false }).catch(function () {});
      D.onValue(D.ref(fb.db, '.info/connected'), function (s) { if (s.val() === true && joined && !(api.state() && api.state().done && started)) { D.onDisconnect(R('p/' + uid)).update({ o: false }).catch(function () {}); if (started || state) push({ o: true }, true); } });
      D.onValue(R('state'), function (s) { onState(s.val() || { ph: 'lobby' }); }, function (e) { if (denied(e)) noRules(); });
    }).catch(function (e) {
      console.error('phong-thi join', e);
      if (denied(e)) return state && state.ph === 'end' ? ended() : (fb.D.get(R('state')).then(function (s) { var v = s.val(); if (v && v.ph === 'end') ended(); else noRules(); }, noRules));
      joinForm('Chưa vào được phòng (lỗi mạng). Thử lại nhé.');
    });
  }

  function ended() { screen('<h2>Phòng thi đã kết thúc</h2><p>Thầy đã kết thúc bài thi này.</p><p><a class="btn alt" href="./">← Về trang chủ</a></p>'); }

  function onState(s) {
    var prev = state; state = s;
    var st = api.state();
    if (s.ph === 'lobby') {
      if (!started) screen('<h2>Phòng chờ <span class="code">' + code + '</span></h2><p><b>' + esc(meta.ti || info1()) + '</b></p><p>Xin chào <b>' + esc(ls('cam20.name')) + '</b>! Bạn đã vào phòng.</p><div class="rmbig" aria-hidden="true">⏳</div><p class="dots">Chờ thầy bấm Bắt đầu</p><p class="hint">Giữ trang này mở. Khi thầy bắt đầu, đề sẽ tự hiện ra.</p>');
      return;
    }
    if (s.ph === 'run') {
      if (prev && prev.ph === 'run' && prev.en && s.en > prev.en + 1000 && started) toast('Thầy cộng thêm ' + Math.round((s.en - prev.en) / 60000) + ' phút ⏱', 4000);
      if (!started) begin();
      return;
    }
    if (s.ph === 'end') {
      if (started && st && !st.done) { toast('Thầy đã kết thúc bài thi — bài được nộp tự động.', 4000); api.submit(true); }
      else if (!started) ended();
    }
  }

  function begin() {
    var key = api.key(meta.m), st = J(key);
    if (now() >= state.en) {
      if (st && st.room === code) { started = true; api.bind(hook()); api.route(); if (!st.done) api.submit(true); return; }
      return ended();
    }
    if (!st || st.room !== code) lsSet(key, JSON.stringify({ ans: {}, t0: state.st - off, done: false, room: code }));
    clearInterval(cdT);
    function go() {
      var left = state.st - now();
      if (left > 300) { screen('<h2>Chuẩn bị!</h2><p>' + esc(meta.ti || info1()) + '</p><div class="rmbig">' + Math.ceil(left / 1000) + '</div><p>Bài thi bắt đầu sau vài giây…</p>'); return; }
      clearInterval(cdT); started = true; api.bind(hook()); api.route(); bar(); push({ q: 0 }, true);
    }
    go(); if (!started) cdT = setInterval(go, 200);
  }
  function bar() {
    var ml = $('#modeLabel'); if (ml) ml.textContent = ml.textContent.replace(/ · Phòng \d+$/, '') + ' · Phòng ' + code;
  }

  // gom các thay đổi, gửi tối đa 1 lần / 3 giây
  function push(o, now1) {
    if (!joined) return;
    pend = Object.assign(pend || {}, o);
    var wait = Math.max(0, lastPush + THROTTLE - Date.now());
    if (now1 && !wait) return flush();
    if (!pendT) pendT = setTimeout(flush, wait || THROTTLE);
  }
  function flush() {
    clearTimeout(pendT); pendT = 0; if (!pend) return;
    var st = api.state(); if (st && st.done && started && !pend.s) { pend = null; return; }
    var o = pend; pend = null; lastPush = Date.now(); o.at = fb.D.serverTimestamp();
    return fb.D.update(R('p/' + uid), o).catch(function (e) { console.warn('phong-thi push', e && e.code); });
  }

  document.addEventListener('visibilitychange', function () {
    if (!document.hidden || !started || !joined) return; var st = api.state(); if (!st || st.done) return;
    hidN++; push({ h: hidN });
  });

  function hook() {
    return {
      left: function () { return state && state.en ? (state.en - now()) / 1000 : 0; },
      ans: function (n, cnt) { push({ q: Math.min(200, n || 0), a: Math.min(200, cnt || 0) }); },
      done: function (res, score) {
        clearTimeout(pendT); pendT = 0;
        var D = fb.D, o = Object.assign(pend || {}, { s: true, o: false, g: res.lc + res.rc, tt: res.lcT + res.rcT, a: Object.keys((api.state() || {}).ans || {}).length, sc: String(score || '').slice(0, 40), at: D.serverTimestamp() });
        if (o.a > 200) o.a = 200; pend = null;
        D.onDisconnect(R('p/' + uid)).cancel().catch(function () {});
        D.update(R('p/' + uid), o).then(function () { toast('Đã nộp bài cho thầy ✓'); }, function (e) { console.error('phong-thi done', e); toast('Chưa gửi được kết quả cho thầy — bài vẫn được lưu trên máy này.', 5000); });
        setTimeout(function () { var mn = $('#main'); if (mn && !$('.rmbar')) { var b = document.createElement('div'); b.className = 'rmbar'; b.innerHTML = '✅ Đã nộp bài trong phòng thi <b>' + code + '</b>. Thầy đã nhận được điểm của bạn.'; mn.insertBefore(b, mn.firstChild); } }, 50);
      }
    };
  }

  window.MROOM = { boot: boot };
})();

/* ETS 2026 TOEIC practice — one page for every test: test.html?t=N&m=full|lc|rc|p1..p7 */
(function () {
  'use strict';
  var Q = new URLSearchParams(location.search);
  var T = Math.max(1, Math.min(20, parseInt(Q.get('t'), 10) || 1));
  var NAME = T > 10 ? 'ETS 2024 · Test ' + (T - 10) : 'ETS 2026 · Test ' + T;
  var MODE = Q.get('m') || '';
  var L4 = ['A', 'B', 'C', 'D'];
  var PART_INFO = {
    1: ['Part 1', 'Mô tả tranh', 6], 2: ['Part 2', 'Hỏi – đáp', 25], 3: ['Part 3', 'Hội thoại', 39], 4: ['Part 4', 'Bài nói', 30],
    5: ['Part 5', 'Điền câu', 30], 6: ['Part 6', 'Điền đoạn văn', 16], 7: ['Part 7', 'Đọc hiểu', 54]
  };
  var MODES = {
    full: { name: 'Full test', parts: [1, 2, 3, 4, 5, 6, 7], mins: 120, exam: true },
    lc: { name: 'Listening', parts: [1, 2, 3, 4], mins: 0, exam: true },
    rc: { name: 'Reading', parts: [5, 6, 7], mins: 75, exam: true }
  };
  for (var pp = 1; pp <= 7; pp++) MODES['p' + pp] = { name: 'Luyện ' + PART_INFO[pp][0], parts: [pp], mins: 0, exam: false };
  var DIRS = {
    1: 'Mỗi câu có một bức tranh. Bạn nghe 4 câu mô tả (A)–(D) — không in trong đề — và chọn câu mô tả đúng nhất.',
    2: 'Bạn nghe một câu hỏi hoặc câu nói, rồi 3 câu đáp (A)–(C) — không in trong đề. Chọn câu đáp phù hợp nhất.',
    3: 'Nghe các đoạn hội thoại. Mỗi đoạn có 3 câu hỏi in sẵn, chọn đáp án đúng. Đọc trước câu hỏi khi audio đang đọc hướng dẫn.',
    4: 'Nghe các bài nói ngắn của một người. Mỗi bài có 3 câu hỏi in sẵn.',
    5: 'Chọn từ hoặc cụm từ phù hợp nhất để hoàn thành câu.',
    6: 'Đọc đoạn văn và chọn đáp án điền vào chỗ trống. Có câu yêu cầu chọn cả một câu văn.',
    7: 'Đọc các văn bản (một, hai hoặc ba bài) rồi trả lời câu hỏi.'
  };
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function put(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function toast(msg, ms) { var d = document.createElement('div'); d.className = 'toast'; d.textContent = msg; document.body.appendChild(d); setTimeout(function () { d.remove(); }, ms || 2600); }

  // ---------- score estimate (ước tính) ----------
  var LCT = [[0, 5], [10, 25], [20, 85], [30, 140], [40, 195], [50, 250], [60, 305], [70, 355], [80, 405], [90, 455], [95, 485], [96, 495], [100, 495]];
  var RCT = [[0, 5], [10, 15], [20, 70], [30, 115], [40, 165], [50, 215], [60, 265], [70, 320], [80, 375], [90, 430], [95, 465], [100, 495]];
  function conv(tab, x) {
    for (var i = 1; i < tab.length; i++) if (x <= tab[i][0]) {
      var a = tab[i - 1], b = tab[i]; var v = a[1] + (b[1] - a[1]) * (x - a[0]) / ((b[0] - a[0]) || 1);
      return Math.max(5, Math.min(495, Math.round(v / 5) * 5));
    }
    return 495;
  }

  // ---------- data ----------
  var D = null, ITEMS = {}, SETOF = {}, ORDER = [];
  function index() {
    function addQ(q, p, set) { q.p = p; ITEMS[q.n] = q; SETOF[q.n] = set; ORDER.push(q.n); }
    D.lc.p1.forEach(function (q) { addQ(q, 1, null); });
    D.lc.p2.forEach(function (q) { addQ(q, 2, null); });
    D.lc.p3.forEach(function (s) { s.qs.forEach(function (q) { addQ(q, 3, s); }); });
    D.lc.p4.forEach(function (s) { s.qs.forEach(function (q) { addQ(q, 4, s); }); });
    D.rc.p5.forEach(function (q) { addQ(q, 5, null); });
    D.rc.p6.forEach(function (s) { s.qs.forEach(function (q) { addQ(q, 6, s); }); });
    D.rc.p7.forEach(function (s) { s.qs.forEach(function (q) { addQ(q, 7, s); }); });
  }
  function nsOf(parts) { return ORDER.filter(function (n) { return parts.indexOf(ITEMS[n].p) >= 0 && (!ONLY || ONLY[n]); }); }
  // chế độ "Làm lại câu sai" (từ Sổ lỗi sai): test.html?t=N&m=sai&q=101,105 — chỉ hiện các câu này (đoạn văn / audio của cả cụm vẫn hiện)
  var ONLY = null, ONLYQ = '';
  function setupSai() {
    var L = String(Q.get('q') || '').split(',').map(function (x) { return parseInt(x, 10); }).filter(function (n) { return ITEMS[n]; });
    if (!L.length) { MODE = ''; return; }
    ONLY = {}; L.forEach(function (n) { ONLY[n] = 1; });
    ONLYQ = ORDER.filter(function (n) { return ONLY[n]; }).join(',');
    var parts = []; ORDER.forEach(function (n) { if (ONLY[n] && parts.indexOf(ITEMS[n].p) < 0) parts.push(ITEMS[n].p); });
    MODES.sai = { name: 'Làm lại câu sai', parts: parts, mins: 0, exam: false };
  }
  function shown(q) { return !ONLY || ONLY[q.n]; }
  function setShown(s) { return !ONLY || s.qs.some(shown); }

  // ---------- state ----------
  var M, KEY, ST, CUR = 0, timerId = null;
  function save() { put(KEY, ST); }

  // ---------- boot ----------
  document.title = NAME;
  $('#ttl').firstChild.nodeValue = NAME;
  var sc = document.createElement('script');
  sc.src = 'data/t' + T + '.js';
  sc.onload = function () { D = window.ETSDATA && window.ETSDATA[T]; if (!D) return fail(); index(); if (MODE === 'sai') setupSai(); route(); };
  sc.onerror = fail;
  document.head.appendChild(sc);
  function fail() { $('#main').innerHTML = '<div class="box"><h3>Test ' + T + ' chưa có trên web.</h3><p><a href="./">← Về trang chủ</a></p></div>'; }

  function route() {
    if (!MODES[MODE]) return startScreen();
    M = MODES[MODE]; KEY = 'ets26.t' + T + '.' + MODE;
    ST = get(KEY) || { ans: {}, t0: Date.now(), done: false };
    if (ONLY) { if (ST.q !== ONLYQ) ST = { ans: {}, t0: Date.now(), done: false }; ST.q = ONLYQ; }
    var XEM = Q.get('xem');
    if (XEM) {
      var PEEK = null; if (Q.get('peek')) { try { PEEK = JSON.parse(sessionStorage.getItem('mt.peek')); } catch (e) {} }
      var hr = (PEEK || get('ets26.hist') || []).filter(function (h) { return String(h.at) === XEM && h.test === T && h.ans; })[0];
      if (hr) {
        KEY = 'ets26.review'; ST = { ans: hr.ans, t0: hr.at, done: true, res: hr.res || null, review: hr.at };
        setTimeout(function () { var b = document.createElement('div'); b.className = 'resume'; b.style.margin = '0 0 12px'; b.innerHTML = '👀 Đang <b>xem lại bài đã nộp</b> ngày ' + new Date(hr.at).toLocaleString('vi-VN') + ' · ' + esc(hr.name) + ' · ' + hr.got + '/' + hr.total + (hr.score ? ' · ' + esc(hr.score) : '') + ' — <a href="?t=' + T + '">Về danh sách</a>'; var mn = $('#main'); if (mn) mn.insertBefore(b, mn.firstChild); }, 0);
      }
    }
    if (!ST.ans) ST.ans = {};
    $('#modeLabel').textContent = M.name; $('#modeLabel').hidden = false;
    $('#sub').textContent = M.parts.length > 1 ? M.parts.length + ' part · ' + nsOf(M.parts).length + ' câu' : PART_INFO[M.parts[0]][1] + ' · ' + nsOf(M.parts).length + ' câu';
    $('#sheetBtn').hidden = false;
    buildTabs();
    CUR = ST.cur && M.parts.indexOf(ST.cur) >= 0 ? ST.cur : M.parts[0];
    show(CUR);
    if (!ST.done) { startTimer(); if (M.exam && M.parts[0] <= 4) setupPlayer(); }
    else showResultTop();
    var hq = /^#q(\d+)$/.exec(location.hash);
    if (hq) setTimeout(function () { var el = document.getElementById('q' + hq[1]); if (el) { el.scrollIntoView({ block: 'center' }); el.style.transition = 'box-shadow .6s'; el.style.boxShadow = '0 0 0 4px #ffc94a'; setTimeout(function () { el.style.boxShadow = ''; }, 1800); } }, 300);
  }

  // ---------- start screen ----------
  function startScreen() {
    var hist = (get('ets26.hist') || []).filter(function (h) { return h.test === T; });
    var resume = Object.keys(MODES).filter(function (m) { var s = get('ets26.t' + T + '.' + m); return s && !s.done && s.ans && Object.keys(s.ans).length; });
    var h = '<div class="start"><h2>' + NAME + '</h2><p class="lead">200 câu · Listening 100 câu (~46 phút) · Reading 100 câu (75 phút). Chọn cách làm bài:</p>';
    if (resume.length) h += '<div class="resume">' + window.MICON('play') + ' Bạn đang làm dở: ' + resume.map(function (m) { var n = Object.keys(get('ets26.t' + T + '.' + m).ans).length; return '<a href="?t=' + T + '&m=' + m + '"><b>' + MODES[m].name + '</b> (' + n + ' câu đã chọn)</a>'; }).join(' · ') + '</div>';
    h += '<div class="modes">' +
      '<button class="mode" data-m="full"><span class="mico">' + window.MICON('target') + '</span><b>Thi thử Full test</b><span>200 câu · 120 phút · audio phát liền như thi thật</span></button>' +
      '<button class="mode" data-m="lc"><span class="mico">' + window.MICON('headphones') + '</span><b>Chỉ Listening</b><span>Part 1–4 · 100 câu · audio phát liền một mạch</span></button>' +
      '<button class="mode" data-m="rc"><span class="mico">' + window.MICON('book') + '</span><b>Chỉ Reading</b><span>Part 5–7 · 100 câu · đếm ngược 75 phút</span></button></div>' +
      '<div class="box"><h3>Luyện từng Part</h3><p class="hint" style="margin:0">Không giới hạn giờ. Part nghe có nút audio riêng từng câu, nghe lại thoải mái.</p><div class="parts">';
    for (var p = 1; p <= 7; p++) h += '<button data-m="p' + p + '"><b>' + PART_INFO[p][0] + '</b><span>' + PART_INFO[p][1] + '</span></button>';
    h += '</div></div>';
    if (hist.length) {
      h += '<div class="box"><h3>Kết quả đã nộp</h3><table class="hist"><tr><th>Ngày</th><th>Cách làm</th><th>Đúng</th><th>Điểm ước tính</th><th></th></tr>';
      hist.slice(-12).reverse().forEach(function (r) {
        h += '<tr><td>' + new Date(r.at).toLocaleDateString('vi-VN') + '</td><td>' + esc(r.name) + '</td><td>' + r.got + '/' + r.total + '</td><td>' + (r.score ? r.score : '–') + '</td><td>' + (r.ans && r.mode ? '<a href="?t=' + T + '&m=' + r.mode + '&xem=' + r.at + '">👀 Xem lại</a>' + ' · <a href="#" data-kq="' + r.at + '">📊 Phân tích</a>' : (function () { var st = r.mode && get('ets26.t' + T + '.' + r.mode); return st && st.done && st.res && st.res.at === r.at ? '<a href="?t=' + T + '&m=' + r.mode + '">👀 Xem lại</a>' : ''; })()) + '</td></tr>';
      });
      h += '</table></div>';
    }
    h += '<details class="box tv" id="tuvung"><summary><h3 style="display:inline">📚 Từ vựng khó của đề này</h3> <span class="hint">— xem trước 20 từ để làm bài tự tin hơn</span></summary><div id="tvBody"><p class="hint">Đang tải…</p></div></details>';
    h += '<div class="box"><h3>Mẹo</h3><ul><li>Bài làm tự lưu trên máy này — lỡ tắt trang thì mở lại là làm tiếp.</li><li>Nộp bài xong sẽ thấy đáp án đúng, <b>lời thoại + dịch tiếng Việt</b> và <b>giải thích</b> từng câu.</li><li>Điểm quy đổi chỉ là ước tính để tham khảo.</li></ul></div></div>';
    $('#main').innerHTML = h;
    $$('[data-m]').forEach(function (b) { b.onclick = function () {
      var k = 'ets26.t' + T + '.' + b.dataset.m, s = get(k);
      if (s && s.done) { try { localStorage.removeItem(k); } catch (e) {} }
      location.search = '?t=' + T + '&m=' + b.dataset.m; }; });
    [].forEach.call(document.querySelectorAll('[data-kq]'), function (a) { a.onclick = function (e) { e.preventDefault();
      var r = hist.filter(function (x) { return String(x.at) === a.dataset.kq; })[0]; if (!r) return;
      var K = { self: true, data: { v: 1, site: 'T', t: T, m: r.mode, at: r.at, a: r.ans }, name: (function () { try { return localStorage.getItem('cam20.name') || ''; } catch (e) { return ''; } })(), test: NAME, part: r.name, mode: '', when: r.at, got: r.got, total: r.total, score: r.score ? String(r.score).replace(/[^0-9]/g, '') : '' };
      try { sessionStorage.setItem('mt.kq', JSON.stringify(K)); } catch (er) {} window.open('/ket-qua.html', '_blank'); }; });
    loadVocab();
  }
  function loadVocab() {
    var box = $('#tuvung'); if (!box) return;
    function render() {
      var L = (window.TESTVOCAB || {})[T] || [], C = get('vocab.cards') || {};
      if (!L.length) { box.hidden = true; return; }
      var h = '<p class="hint" style="margin:6px 0 10px">Các từ ít gặp xuất hiện trong Test ' + T + ' · bấm 🔊 để nghe, ☆ để lưu vào flashcard.</p><div class="tvl">';
      L.forEach(function (w, i) {
        h += '<div class="tvi"><div><b>' + esc(w.w) + '</b> <small>' + esc(w.ipa) + '</small> <button type="button" class="tvs" data-say="' + esc(w.w) + '" aria-label="Nghe">🔊</button></div><div class="tvm">' + esc(w.m) + '</div><div class="tve">' + esc(w.ex) + '</div>' +
          '<button type="button" class="tvsv' + (C[w.w] ? ' on' : '') + '" data-i="' + i + '">' + (C[w.w] ? '★ Đã lưu' : '☆ Lưu') + '</button></div>';
      });
      h += '</div><div class="tvact"><button type="button" class="btn sm" id="tvAll">☆ Lưu cả ' + L.length + ' từ vào flashcard</button> <a class="btn alt sm" href="go-tu.html?t=' + T + '">🎮 Chơi gõ từ rơi với bộ này</a></div>';
      $('#tvBody').innerHTML = h;
      function add(w, C2) { if (!C2[w.w]) C2[w.w] = { w: w.w, ipa: w.ipa, m: w.m, ex: w.ex, src: NAME, at: Date.now(), box: 0 }; }
      $$('#tvBody .tvsv').forEach(function (b) { b.onclick = function () { var C2 = get('vocab.cards') || {}, w = L[+b.dataset.i]; if (C2[w.w]) delete C2[w.w]; else add(w, C2); put('vocab.cards', C2); b.classList.toggle('on', !!C2[w.w]); b.textContent = C2[w.w] ? '★ Đã lưu' : '☆ Lưu'; }; });
      $('#tvAll').onclick = function () { var C2 = get('vocab.cards') || {}; L.forEach(function (w) { add(w, C2); }); put('vocab.cards', C2); $$('#tvBody .tvsv').forEach(function (b) { b.classList.add('on'); b.textContent = '★ Đã lưu'; }); toast('Đã lưu ' + L.length + ' từ vào flashcard ✓'); };
      $$('#tvBody [data-say]').forEach(function (b) { b.onclick = function () { try { speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(b.dataset.say); u.lang = 'en-US'; u.rate = .9; speechSynthesis.speak(u); } catch (e) {} }; });
    }
    if (window.TESTVOCAB) return render();
    var s = document.createElement('script'); s.src = 'data/tuvung.js?v=2'; s.onload = render; s.onerror = function () { box.hidden = true; }; document.head.appendChild(s);
  }


  // ---------- tabs & part rendering ----------
  function buildTabs() {
    var nav = $('#ptabs');
    if (M.parts.length < 2) { nav.hidden = true; return; }
    nav.hidden = false;
    nav.innerHTML = M.parts.map(function (p) { return '<button type="button" data-p="' + p + '">' + PART_INFO[p][0] + '<span class="pc" id="pc' + p + '"></span></button>'; }).join('');
    $$('button', nav).forEach(function (b) { b.onclick = function () { show(+b.dataset.p); window.scrollTo(0, 0); }; });
    counts();
  }
  function counts() {
    M.parts.forEach(function (p) {
      var ns = nsOf([p]), d = ns.filter(function (n) { return ST.ans[n]; }).length, el = $('#pc' + p);
      if (el) el.textContent = ST.done ? '' : d + '/' + ns.length;
    });
    var all = nsOf(M.parts), dd = all.filter(function (n) { return ST.ans[n]; }).length;
    $('#cnt').textContent = '(' + dd + '/' + all.length + ')';
  }
  function show(p) {
    CUR = p; ST.cur = p; if (!ST.done) save();
    window.ETS_LOOKUP = !!(ST.done || !M.exam); window.LOOKUP_SRC = NAME;
    $$('#ptabs button').forEach(function (b) { b.setAttribute('aria-selected', String(+b.dataset.p === p)); });
    var h = (ST.done ? '' : '') + '<div id="resTop"></div><div class="pt-head"><h2>' + PART_INFO[p][0] + '</h2><span>' + PART_INFO[p][1] + ' · ' + nsOf([p]).length + ' câu</span>' + (p <= 4 && practiceAudio() ? speedHTML() : '') + (window.ETS_LOOKUP ? '<span class="lkhint">💡 Bấm vào từ tiếng Anh bất kỳ để tra nghĩa</span>' : '') + '</div>';
    if (!ST.done) h += '<p class="dir">' + DIRS[p] + '</p>';
    h += '<div id="partBody" class="' + (ST.done ? 'done' + (ST.hideOk ? ' hide-ok' : '') : '') + '">' + partHTML(p) + '</div>';
    var i = M.parts.indexOf(p);
    h += '<div class="navrow"><span>' + (i > 0 ? '<button class="btn alt" data-go="' + M.parts[i - 1] + '">← ' + PART_INFO[M.parts[i - 1]][0] + '</button>' : '') + '</span>' +
      '<span>' + (i < M.parts.length - 1 ? '<button class="btn alt" data-go="' + M.parts[i + 1] + '">' + PART_INFO[M.parts[i + 1]][0] + ' →</button> ' : '') +
      (ST.done ? (ONLY ? '<a class="btn alt" href="so-loi.html">📕 Về Sổ lỗi sai</a> ' : '') + '<a class="btn" href="?t=' + T + '">Làm lại / chọn cách khác</a>' : '<button class="btn warn" id="submitBtn">Nộp bài</button>') + '</span></div>';
    $('#main').innerHTML = h;
    $$('[data-go]').forEach(function (b) { b.onclick = function () { show(+b.dataset.go); window.scrollTo(0, 0); }; });
    var sb = $('#submitBtn'); if (sb) sb.onclick = submit;
    bindInputs(); bindSpeed();
    if (ST.done) showResultTop();
    if (PL.on || PL.started) markCurrent();
    if (window.MMARKS) window.MMARKS.decorate(T, ITEMS);
  }


  // ---------- tốc độ audio (khi luyện tập / xem lại) ----------
  var SPEED = parseFloat(get('ets26.speed')) || 1;
  function speedHTML() { return '<span class="spd" role="group" aria-label="Tốc độ audio">Tốc độ: ' + [0.75, 1, 1.25].map(function (v) { return '<button type="button" data-spd="' + v + '"' + (v === SPEED ? ' aria-pressed="true"' : '') + '>' + v + 'x</button>'; }).join('') + '</span>'; }
  function bindSpeed() { $$('[data-spd]').forEach(function (b) { b.onclick = function () { SPEED = +b.dataset.spd; put('ets26.speed', SPEED); $$('[data-spd]').forEach(function (x) { x.setAttribute('aria-pressed', String(+x.dataset.spd === SPEED)); }); $$('audio.ia').forEach(function (a) { a.playbackRate = SPEED; }); }; }); }
  document.addEventListener('play', function (e) { if (e.target.classList && e.target.classList.contains('ia')) { e.target.playbackRate = SPEED; $$('audio.ia').forEach(function (a) { if (a !== e.target) a.pause(); }); } }, true);
  function optsHTML(q, nOpt, showText) {
    var h = '<div class="opts' + (showText ? '' : (nOpt === 3 ? ' row3' : ' row4')) + '" role="radiogroup" aria-label="Câu ' + q.n + '">';
    for (var i = 0; i < nOpt; i++) {
      var L = L4[i], cls = '';
      if (ST.done) { if (L === q.ans) cls = ' right'; else if (ST.ans[q.n] === L) cls = ' wrong'; }
      h += '<label class="opt' + cls + '"><input type="radio" name="a' + q.n + '" value="' + L + '"' + (ST.ans[q.n] === L ? ' checked' : '') + (ST.done ? ' disabled' : '') + '><span class="L">' + L + '</span>' +
        (showText ? '<span>' + esc(q.opts[i]) + (ST.done && q.vi && q.vi[i] ? '<span class="vi">' + esc(q.vi[i]) + '</span>' : '') + '</span>' : '') + '</label>';
    }
    return h + '</div>';
  }
  function mark(q) {
    if (!ST.done) return '';
    var a = ST.ans[q.n];
    if (!a) return '<span class="mark skip">Bỏ trống · đáp án ' + q.ans + '</span>';
    return a === q.ans ? '<span class="mark ok">✓ Đúng</span>' : '<span class="mark bad">✗ Sai · đáp án ' + q.ans + '</span>';
  }
  function qcls(q) { return 'q' + (ST.done && ST.ans[q.n] === q.ans ? ' isok' : ''); }
  function audioTag(a) { return a ? '<audio class="ia" controls preload="none" src="audio/t' + T + '/' + a + '"></audio>' : ''; }
  function practiceAudio() { return ST.done || !M.exam; }
  function scriptHTML(sc) {
    return '<div class="script">' + sc.map(function (t) { return '<p>' + (t[0] ? '<span class="sp">' + esc(t[0]) + ':</span>' : '') + esc(t[1]) + (t[2] ? '<span class="v">' + esc(t[2]) + '</span>' : '') + '</p>'; }).join('') + '</div>';
  }
  function xpHTML(q) {
    if (!ST.done) return '';
    var body = '';
    if (q.p === 2) body = '<b>' + esc(q.q) + '</b>' + (q.qvi ? '\n' + esc(q.qvi) : '');
    if (q.qvi && q.p >= 3) body += esc(q.qvi);
    if (q.xp) body += (body ? '\n\n' : '') + esc(q.xp);
    if (q.note) body += '<span class="note">⚠ ' + esc(q.note) + '</span>';
    if (!body) return '';
    return '<details class="more"><summary>' + (q.p <= 4 ? '💬 Dịch nghĩa' : '💡 Giải thích') + '</summary><div class="in">' + body + '</div></details>';
  }

  function partHTML(p) {
    var h = '';
    if (p === 1) D.lc.p1.forEach(function (q) {
      if (!shown(q)) return;
      h += '<div class="card ' + qcls(q) + '" id="q' + q.n + '" data-a="' + esc(q.a) + '"><div class="qt"><span class="qn">' + q.n + '.</span>' + mark(q) + '</div>' +
        (practiceAudio() ? '<div style="margin-left:42px">' + audioTag(q.a) + '</div>' : '') +
        '<img class="photo" src="img/t' + T + '/' + q.img + '" alt="Tranh câu ' + q.n + '" loading="lazy">' + optsHTML(q, 4, ST.done) + xpHTML(q) + '</div>';
    });
    if (p === 2) {
      h += '<div class="card">';
      D.lc.p2.forEach(function (q) {
        if (!shown(q)) return;
        h += '<div class="' + qcls(q) + '" id="q' + q.n + '" data-a="' + esc(q.a) + '"><div class="qt"><span class="qn">' + q.n + '.</span><span class="blank-q">' + (ST.done ? esc(q.q) : 'Mark your answer on your answer sheet.') + '</span>' + mark(q) + '</div>' +
          (practiceAudio() ? '<div style="margin-left:42px">' + audioTag(q.a) + '</div>' : '') + optsHTML(q, 3, ST.done) + xpHTML(q) + '</div>';
      });
      h += '</div>';
    }
    if (p === 3 || p === 4) (p === 3 ? D.lc.p3 : D.lc.p4).forEach(function (s) {
      if (!setShown(s)) return;
      var allok = ST.done && s.qs.filter(shown).every(function (q) { return ST.ans[q.n] === q.ans; });
      h += '<div class="card' + (allok ? ' allok' : '') + '" id="s' + s.ns[0] + '" data-a="' + esc(s.a) + '"><p class="ghead">Questions ' + s.ns[0] + '–' + s.ns[1] + (p === 3 ? ' refer to the following conversation.' : ' refer to the following talk.') + '</p>' +
        (practiceAudio() ? audioTag(s.a) : '') + (s.img ? '<img class="graphic" src="img/t' + T + '/' + s.img + '" alt="Hình minh hoạ (graphic)">' : '');
      s.qs.forEach(function (q) { if (!shown(q)) return; h += '<div class="' + qcls(q) + '" id="q' + q.n + '"><div class="qt"><span class="qn">' + q.n + '.</span><span class="qtext">' + esc(q.q) + mark(q) + '</span></div>' + optsHTML(q, 4, true) + xpHTML(q) + '</div>'; });
      if (ST.done && s.script && s.script.length) h += '<details class="more g"><summary>📜 Lời thoại + dịch</summary><div class="in">' + scriptHTML(s.script) + '</div></details>';
      h += '</div>';
    });
    if (p === 5) {
      h += '<div class="card">';
      D.rc.p5.forEach(function (q) {
        if (!shown(q)) return;
        h += '<div class="' + qcls(q) + '" id="q' + q.n + '"><div class="qt"><span class="qn">' + q.n + '.</span><span class="qtext">' + esc(q.q) + mark(q) + '</span></div>' + optsHTML(q, 4, true) + xpHTML(q) + '</div>';
      });
      h += '</div>';
    }
    if (p === 6 || p === 7) (p === 6 ? D.rc.p6 : D.rc.p7).forEach(function (s) {
      if (!setShown(s)) return;
      var allok = ST.done && s.qs.filter(shown).every(function (q) { return ST.ans[q.n] === q.ans; });
      var ps = (s.passages || [s.passage]).map(function (x) { return '<div class="psg">' + x + '</div>'; }).join('');
      h += '<div class="card' + (allok ? ' allok' : '') + '" id="s' + s.ns[0] + '"><p class="ghead">' + esc(s.head || ('Questions ' + s.ns[0] + '-' + s.ns[1])) + '</p><div class="split"><div class="ptext">' + ps +
        (ST.done && s.vi ? '<details class="more g"><summary>🇻🇳 Dịch bài đọc</summary><div class="in vi-psg">' + esc(s.vi) + '</div></details>' : '') + '</div><div>';
      s.qs.forEach(function (q) {
        if (!shown(q)) return;
        h += '<div class="' + qcls(q) + '" id="q' + q.n + '"><div class="qt"><span class="qn">' + q.n + '.</span><span class="qtext">' + (q.q ? esc(q.q) : '') + mark(q) + '</span></div>' + optsHTML(q, 4, true) + xpHTML(q) + '</div>';
      });
      h += '</div></div></div>';
    });
    return h;
  }

  function bindInputs() {
    $$('#partBody input[type=radio]').forEach(function (r) {
      r.onchange = function () { var n = +r.name.slice(1); ST.ans[n] = r.value; save(); counts(); blanks(); };
    });
    $$('#partBody .psg .blank').forEach(function (b) {
      b.onclick = function () { var el = document.getElementById('q' + b.dataset.n); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); };
    });
    blanks();
  }
  function blanks() {
    $$('#partBody .psg .blank').forEach(function (b) {
      var n = +b.dataset.n, a = ST.ans[n], q = ITEMS[n];
      b.classList.remove('filled', 'ok', 'bad');
      if (ST.done && q) { b.classList.add(a === q.ans ? 'ok' : 'bad'); b.textContent = n + ' · ' + q.ans; }
      else if (a) { b.classList.add('filled'); b.textContent = n + ' · ' + a; }
      else b.textContent = n + ' -------';
    });
  }

  // ---------- answer sheet ----------
  $('#sheetBtn').onclick = function () {
    var h = '';
    M.parts.forEach(function (p) {
      h += '<div class="sg-part">' + PART_INFO[p][0] + '</div><div class="sgrid">';
      nsOf([p]).forEach(function (n) {
        var a = ST.ans[n], c = ST.done ? (a === ITEMS[n].ans ? 'g-ok' : 'g-bad') : (a ? 'done' : '');
        h += '<button type="button" class="' + c + '" data-n="' + n + '">' + n + (a && !ST.done ? '' : '') + '</button>';
      });
      h += '</div>';
    });
    $('#sheetBody').innerHTML = h; $('#sheet').hidden = false;
    $$('#sheetBody button').forEach(function (b) { b.onclick = function () { $('#sheet').hidden = true; jump(+b.dataset.n); }; });
  };
  $('#sheetX').onclick = function () { $('#sheet').hidden = true; };
  $('#sheet').onclick = function (e) { if (e.target.id === 'sheet') $('#sheet').hidden = true; };
  function jump(n) { var p = ITEMS[n].p; if (p !== CUR) show(p); var el = document.getElementById('q' + n); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }

  // ---------- timer ----------
  function startTimer() {
    clearInterval(timerId);
    function tick() {
      var el = $('#timer'), used = (Date.now() - ST.t0) / 1000;
      if (M.mins) {
        var left = M.mins * 60 - used;
        if (left <= 0) { el.textContent = '00:00'; clearInterval(timerId); toast('Hết giờ — bài được nộp tự động.', 4000); submit(true); return; }
        el.textContent = '⏱ ' + fmt(left); el.classList.toggle('low', left < 300);
      } else el.textContent = '⏱ ' + fmt(used);
    }
    tick(); timerId = setInterval(tick, 1000);
  }
  function fmt(s) { s = Math.max(0, Math.floor(s)); var m = Math.floor(s / 60), x = s % 60; return (m < 10 ? '0' : '') + m + ':' + (x < 10 ? '0' : '') + x; }

  // ---------- exam audio (plays the whole Listening section in order) ----------
  var PL = { list: [], i: 0, au: null, on: false, started: false, stallT: 0 };
  function setupPlayer() {
    D.lc.p1.forEach(function (q) { PL.list.push({ a: q.a, p: 1, id: 'q' + q.n, label: 'Part 1 · Câu ' + q.n }); });
    D.lc.p2.forEach(function (q) { PL.list.push({ a: q.a, p: 2, id: 'q' + q.n, label: 'Part 2 · Câu ' + q.n }); });
    D.lc.p3.forEach(function (s) { PL.list.push({ a: s.a, p: 3, id: 's' + s.ns[0], label: 'Part 3 · Câu ' + s.ns[0] + '–' + s.ns[1] }); });
    D.lc.p4.forEach(function (s) { PL.list.push({ a: s.a, p: 4, id: 's' + s.ns[0], label: 'Part 4 · Câu ' + s.ns[0] + '–' + s.ns[1] }); });
    var au = PL.au = new Audio(); au.preload = 'auto';
    PL.i = ST.pl ? ST.pl.i : 0;
    $('#player').hidden = false;
    var go = $('#plGo');
    if (PL.i >= PL.list.length) return endAudio();
    if (ST.pl) { go.textContent = '▶ Phát tiếp từ chỗ dừng'; $('#plNow').textContent = 'Dừng ở ' + PL.list[PL.i].label; PL.started = true; }
    go.onclick = function () { playCur(ST.pl && ST.pl.i === PL.i ? ST.pl.t : 0); };
    au.onended = function () { PL.i++; ST.pl = { i: PL.i, t: 0 }; save(); if (PL.i >= PL.list.length) return endAudio(); setTimeout(function () { playCur(0); }, 900); };
    au.onerror = function () { stalled('Audio bị lỗi tải.'); };
    au.onpause = function () { if (!au.ended && PL.on) stalled('Audio đang dừng.'); };
    au.ontimeupdate = function () { if (PL.on && Math.floor(au.currentTime) % 3 === 0) { ST.pl = { i: PL.i, t: au.currentTime }; save(); } };
    au.onplaying = function () { PL.on = true; PL.stallT = 0; $('#player').classList.add('on'); go.hidden = true; $('#plHint').textContent = 'Audio phát liền như thi thật — không tua lại được.'; };
    setInterval(function () { if (!PL.on && PL.stallT && Date.now() - PL.stallT > 120000) $('#plHint').innerHTML = 'Audio dừng quá 2 phút? Bạn có thể ' + (M.parts.indexOf(5) >= 0 ? 'chuyển sang <b>Part 5</b> làm Reading trước' : 'bấm <b>Nộp bài</b>') + '.'; }, 5000);
  }
  function playCur(t) {
    var it = PL.list[PL.i]; if (!it) return;
    PL.started = true;
    var src = 'audio/t' + T + '/' + it.a;
    if (PL.au.getAttribute('src') !== src) PL.au.setAttribute('src', src);
    try { if (t) PL.au.currentTime = t; } catch (e) {}
    $('#plNow').textContent = '🔊 ' + it.label;
    if (CUR !== it.p && CUR <= 4) show(it.p);
    markCurrent(true);
    var pr = PL.au.play(); if (pr && pr.catch) pr.catch(function () { stalled('Trình duyệt chặn tự phát.'); });
  }
  function stalled(why) {
    PL.on = false; $('#player').classList.remove('on'); if (!PL.stallT) PL.stallT = Date.now();
    var go = $('#plGo'); go.hidden = false; go.textContent = '▶ Phát tiếp từ chỗ dừng'; $('#plHint').textContent = why;
    go.onclick = function () { playCur(PL.au.currentTime || 0); };
  }
  function endAudio() {
    PL.on = false; $('#player').classList.remove('on'); $('#plGo').hidden = true;
    $('#plNow').textContent = '✓ Đã hết phần Listening';
    $('#plHint').innerHTML = M.parts.indexOf(5) >= 0 ? '<button class="btn sm" id="toRC" type="button">Sang Reading (Part 5) →</button>' : 'Kiểm tra lại rồi bấm Nộp bài nhé.';
    var b = $('#toRC'); if (b) b.onclick = function () { show(5); window.scrollTo(0, 0); };
    markCurrent();
  }
  function markCurrent(scroll) {
    $$('.card.cur').forEach(function (c) { c.classList.remove('cur'); });
    var it = PL.list[PL.i]; if (!it || !PL.started || PL.i >= PL.list.length) return;
    var el = document.getElementById(it.id); if (!el) return;
    el.classList.add('cur');
    if (scroll) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ---------- submit & review ----------
  function submit(auto) {
    var ns = nsOf(M.parts), miss = ns.filter(function (n) { return !ST.ans[n]; }).length;
    if (auto !== true && miss && !confirm('Còn ' + miss + ' câu chưa chọn đáp án. Vẫn nộp bài?')) return;
    if (PL.au) { PL.au.pause(); PL.on = false; }
    clearInterval(timerId);
    var lc = 0, rc = 0, lcT = 0, rcT = 0, parts = {}, wrong = [], rq = {};
    ns.forEach(function (n) {
      var q = ITEMS[n], ok = ST.ans[n] === q.ans;
      parts[q.p] = parts[q.p] || [0, 0]; parts[q.p][1]++; if (ok) parts[q.p][0]++;
      if (q.p <= 4) { lcT++; if (ok) lc++; } else { rcT++; if (ok) rc++; }
      if (!ok) wrong.push(n); rq[n] = ok ? 1 : 0;
    });
    var res = { lc: lc, rc: rc, lcT: lcT, rcT: rcT, parts: parts, wrong: wrong, at: Date.now(), mins: Math.round((Date.now() - ST.t0) / 60000), auto: auto === true };
    if (lcT === 100) res.lcS = conv(LCT, lc);
    if (rcT === 100) res.rcS = conv(RCT, rc);
    ST.done = true; ST.res = res; delete ST.pl; save();
    var name = MODE === 'full' ? 'Full test' : M.name;
    var score = res.lcS && res.rcS ? (res.lcS + res.rcS) + ' (LC ' + res.lcS + ' · RC ' + res.rcS + ')' : res.lcS ? 'LC ' + res.lcS : res.rcS ? 'RC ' + res.rcS : '';
    var hist = get('ets26.hist') || [];
    hist.push({ test: T, mode: MODE, name: name, got: lc + rc, total: lcT + rcT, score: score, parts: parts, at: res.at, wrong: wrong, r: rq, lcS: res.lcS || 0, rcS: res.rcS || 0, ans: ST.ans, res: res });
    hist = hist.slice(-300); var withAns = 0;
    for (var hi = hist.length - 1; hi >= 0; hi--) { if (hist[hi] && hist[hi].ans) { withAns++; if (withAns > 40) { delete hist[hi].ans; delete hist[hi].res; } } }
    put('ets26.hist', hist);
    $('#player').hidden = true; $('#timer').textContent = '';
    send(res, name, score);
    show(M.parts[0]); window.scrollTo(0, 0);
  }
  function send(res, name, score) {
    var nm = ''; try { nm = localStorage.getItem('cam20.name') || ''; } catch (e) {}
    function go() {
      var url = window.ETSCFG && window.ETSCFG.SCRIPT_URL; if (!url) return;
      var body = { kind: 'cam20', name: localStorage.getItem('cam20.name') || '', lop: localStorage.getItem('cam20.lop') || '', test: NAME, part: name,
        mode: M.exam ? 'Thi thử' : 'Luyện tập', got: res.lc + res.rc, total: res.lcT + res.rcT, band: score ? 'TOEIC ~' + score : '', minutes: res.mins,
        wrong: res.wrong.join(', '), auto: res.auto, submittedAt: new Date(res.at).toISOString(), answers: JSON.stringify({ v: 1, site: 'T', t: T, m: MODE, at: res.at, a: ST.ans || {} }), userAgent: navigator.userAgent.slice(0, 120) };
      try { fetch(url, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) }).catch(function () {}); } catch (e) {}
    }
    if (nm) return go();
    var box = $('#nm'); box.hidden = false;
    $('#nmOk').onclick = function () { try { localStorage.setItem('cam20.name', $('#nmName').value.trim()); localStorage.setItem('cam20.lop', $('#nmLop').value.trim()); } catch (e) {} box.hidden = true; go(); toast('Đã gửi kết quả cho thầy ✓'); };
    $('#nmSkip').onclick = function () { box.hidden = true; };
  }
  // ---------- phiếu kết quả ----------
  var CEFR_L = [[490, 'C1'], [400, 'B2'], [275, 'B1'], [110, 'A2'], [60, 'A1']], CEFR_R = [[455, 'C1'], [385, 'B2'], [275, 'B1'], [115, 'A2'], [60, 'A1']];
  function cefr(tab, v) { for (var i = 0; i < tab.length; i++) if (v >= tab[i][0]) return tab[i][1]; return 'Dưới A1'; }
  function stuName() { try { return localStorage.getItem('cam20.name') || ''; } catch (e) { return ''; } }
  function comments(r) {
    var ps = Object.keys(r.parts).map(function (p) { var a = r.parts[p]; return { p: +p, pc: a[0] / a[1] }; });
    if (ps.length < 2) return [];
    ps.sort(function (a, b) { return b.pc - a.pc; });
    var hi = ps[0], lo = ps[ps.length - 1], out = [];
    out.push('Mạnh nhất: ' + PART_INFO[hi.p][0] + ' (' + PART_INFO[hi.p][1] + ') – đúng ' + Math.round(hi.pc * 100) + '%.');
    out.push('Cần cải thiện: ' + PART_INFO[lo.p][0] + ' (' + PART_INFO[lo.p][1] + ') – đúng ' + Math.round(lo.pc * 100) + '%. Luyện thêm Part này ở chế độ "Luyện từng Part".');
    if (r.lcS && r.rcS) out.push(r.lcS > r.rcS + 40 ? 'Listening đang tốt hơn Reading: dành thêm thời gian cho ngữ pháp Part 5–6 và tốc độ đọc Part 7.' : r.rcS > r.lcS + 40 ? 'Reading đang tốt hơn Listening: nghe thêm Part 2–3 và chép chính tả mỗi ngày.' : 'Hai kỹ năng khá cân bằng, tiếp tục luyện đều cả hai.');
    return out;
  }
  function skillRow(lab, v, tab, icn) {
    var lv = cefr(tab, v), pc = Math.max(0, Math.min(100, (v - 5) / 490 * 100));
    return '<div class="sk"><div class="skh">' + window.MICON(icn) + '<b>' + lab + '</b><span class="cefr">CEFR ' + lv + '</span><span class="skv">' + v + '<small> / 495</small></span></div><div class="skbar"><s style="width:' + pc + '%"></s>' +
      [110, 275, 400].map(function (t) { return '<i style="left:' + ((t - 5) / 490 * 100) + '%"></i>'; }).join('') + '</div></div>';
  }
  function showResultTop() {
    var r = ST.res; if (!r) return;
    var top = $('#resTop'); if (!top) return;
    var tot = r.lcT + r.rcT, got = r.lc + r.rc, nm = stuName(), d = new Date(r.at);
    var h = '<div class="report"><div class="rp-head"><div class="rp-brand">' + window.MLOGO + '<span><b>Minto English</b><small>Phiếu kết quả luyện tập TOEIC</small></span></div><div class="rp-meta">' +
      (nm ? '<b>' + esc(nm) + '</b>' : '') + '<span>' + NAME + ' · ' + esc(M.name) + '</span><span>' + d.toLocaleDateString('vi-VN') + ' · ' + r.mins + ' phút</span></div></div>';
    if (r.lcS || r.rcS) {
      h += '<div class="rp-body"><div class="rp-total"><small>' + (r.lcS && r.rcS ? 'Tổng điểm ước tính' : (r.lcS ? 'Listening' : 'Reading') + ' ước tính') + '</small><b>' + ((r.lcS || 0) + (r.rcS || 0)) + '</b><span>/ ' + (r.lcS && r.rcS ? 990 : 495) + '</span><em>' + got + '/' + tot + ' câu đúng</em></div><div class="rp-skills">' +
        (r.lcS ? skillRow('Listening', r.lcS, CEFR_L, 'headphones') : '') + (r.rcS ? skillRow('Reading', r.rcS, CEFR_R, 'book') : '') + '<p class="rp-scale">Vạch mốc trên thanh: A2 · B1 · B2 (khung tham chiếu châu Âu)</p></div></div>';
    } else {
      h += '<div class="rp-body"><div class="rp-total"><small>Kết quả</small><b>' + got + '</b><span>/ ' + tot + '</span><em>' + Math.round(got / tot * 100) + '% câu đúng</em></div><div class="rp-skills"><p class="rp-scale">Làm "Chỉ Listening", "Chỉ Reading" hoặc "Full test" để có điểm quy đổi thang 990.</p></div></div>';
    }
    h += '<div class="rp-parts">' + Object.keys(r.parts).map(function (p) { var a = r.parts[p], pc = Math.round(a[0] / a[1] * 100); return '<div><span>' + PART_INFO[p][0] + '</span><i><s style="width:' + pc + '%;background:' + (pc >= 80 ? '#1f8f6c' : pc >= 60 ? '#d9a63c' : '#c14636') + '"></s></i><b>' + a[0] + '/' + a[1] + '</b></div>'; }).join('') + '</div>';
    var cm = comments(r), pcAll = got / tot, mood = pcAll >= .9 ? 'love' : pcAll >= .8 ? 'party' : pcAll >= .65 ? 'cool' : pcAll >= .5 ? 'happy' : pcAll >= .35 ? 'think' : 'oops';
    var say = pcAll >= .8 ? 'Đỉnh quá! Giữ phong độ này nha!' : pcAll >= .55 ? 'Làm tốt lắm! Xem lại câu sai là lên điểm tiếp.' : pcAll >= .35 ? 'Ổn rồi đó, luyện thêm Part yếu nhất nhé!' : 'Không sao đâu, ai cũng bắt đầu từ đây. Xem kỹ giải thích từng câu nha!';
    if (window.MBUDDY && !window.MEXAM) h += window.MBUDDY('<b>' + say + '</b>' + (cm.length ? '<ul class="rp-cm">' + cm.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul>' : ''), mood, 'rp-buddy');
    else if (cm.length) h += '<ul class="rp-cm">' + cm.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul>';
    if (r.wrong && r.wrong.length) h += '<p class="hint" style="margin:10px 0">📕 ' + r.wrong.length + ' câu sai đã được lưu vào <a href="so-loi.html"><b>Sổ lỗi sai</b></a> để làm lại sau. Làm đúng lại thì câu đó tự biến mất khỏi sổ.</p>';
    if (window.MNEXT) h += window.MNEXT({ parts: r.parts, test: T });
    h += '<p class="rp-note">Điểm ước tính dựa trên số câu đúng của bài luyện tập, không phải điểm thi chính thức.</p>' +
      '<div class="filt"><button class="btn sm" id="rpSave" type="button">' + window.MICON('check') + ' Lưu ảnh khoe story</button><button class="btn alt sm" id="hideOk" type="button">' + (ST.hideOk ? 'Hiện tất cả câu' : 'Chỉ xem câu sai') + '</button><button class="btn alt sm" id="rpKq" type="button">📊 Phân tích chi tiết</button><a class="btn alt sm" href="phan-tich.html">Xem điểm yếu</a><a class="btn alt sm" href="?t=' + T + '">Làm lại</a></div></div>' +
      '<p class="hint">Câu xanh là đúng, đỏ là sai. Mở Dịch nghĩa, Lời thoại, Giải thích dưới mỗi câu; phần nghe có nút audio riêng để nghe lại.</p>';
    top.innerHTML = h;
    $('#hideOk').onclick = function () { ST.hideOk = !ST.hideOk; save(); show(CUR); };
    $('#rpKq').onclick = function () {
      var K = { self: true, data: { v: 1, site: 'T', t: T, m: MODE, at: r.at, a: ST.ans || {} }, name: nm, lop: (function () { try { return localStorage.getItem('cam20.lop') || ''; } catch (e) { return ''; } })(),
        test: NAME, part: M.name, mode: M.exam ? 'Thi thử' : 'Luyện tập', when: r.at, got: got, total: tot, minutes: r.mins, score: (r.lcS || r.rcS) ? String((r.lcS || 0) + (r.rcS || 0)) : '' };
      try { sessionStorage.setItem('mt.kq', JSON.stringify(K)); } catch (e) {} window.open('/ket-qua.html', '_blank'); };
    $('#rpSave').onclick = function () { if (window.MSHARE) shareImage(r, nm); else saveImage(r, nm); };
    if (window.MANIM) window.MANIM(top);
  }
  function shareImage(r, nm) {
    var tot = r.lcT + r.rcT, got = r.lc + r.rc, has = r.lcS || r.rcS, total = (r.lcS || 0) + (r.rcS || 0), max = r.lcS && r.rcS ? 990 : 495, pc = got / tot;
    window.MSHARE({ kicker: 'PHIẾU KẾT QUẢ LUYỆN TẬP TOEIC', name: nm || 'Học viên', line: NAME + ' · ' + M.name + ' · ' + new Date(r.at).toLocaleDateString('vi-VN'),
      bigLabel: has ? (r.lcS && r.rcS ? 'TỔNG ĐIỂM ƯỚC TÍNH' : 'ĐIỂM ƯỚC TÍNH') : 'SỐ CÂU ĐÚNG', big: has ? total : got, bigOf: '/ ' + (has ? max : tot), pct: has ? total / max : pc,
      sub: has ? got + '/' + tot + ' câu đúng' : Math.round(pc * 100) + '% câu đúng',
      tiles: [{ k: 'Câu đúng', v: got + '/' + tot }, { k: 'Tỉ lệ đúng', v: Math.round(pc * 100) + '%' }, { k: 'Thời gian', v: (r.mins || 0) + ' phút' }],
      bars: [[r.lcS, 'Listening', CEFR_L], [r.rcS, 'Reading', CEFR_R]].filter(function (k) { return k[0]; }).map(function (k) { return { label: k[1], txt: k[0] + ' / 495', pct: (k[0] - 5) / 490, tag: 'CEFR ' + cefr(k[2], k[0]) }; }),
      parts: Object.keys(r.parts).map(function (p) { var a = r.parts[p]; return { label: PART_INFO[p][0], txt: a[0] + '/' + a[1], pct: a[0] / a[1] }; }),
      mood: pc >= .9 ? 'love' : pc >= .8 ? 'party' : pc >= .65 ? 'cool' : 'happy',
      msg: pc >= .8 ? 'Đỉnh của chóp! Ai luyện cùng mình không?' : pc >= .55 ? 'Tiến bộ từng ngày, cố lên nào!' : 'Mới bắt đầu thôi, lần sau sẽ cao hơn!',
      url: 'mangomint1805.github.io/toeic', file: 'minto-toeic-test' + T });
  }
  function saveImage(r, nm) {
    var W = 1080, H = 1350, cv = document.createElement('canvas'); cv.width = W; cv.height = H; var c = cv.getContext('2d');
    var SER = '"Fraunces", Georgia, serif', SANS = '"IBM Plex Sans", Arial, sans-serif';
    function txt(t, x, y, f, col, al) { c.font = f; c.fillStyle = col; c.textAlign = al || 'left'; c.fillText(t, x, y); }
    function rr(x, y, w, h, rad, col) { c.fillStyle = col; c.beginPath(); c.moveTo(x + rad, y); c.arcTo(x + w, y, x + w, y + h, rad); c.arcTo(x + w, y + h, x, y + h, rad); c.arcTo(x, y + h, x, y, rad); c.arcTo(x, y, x + w, y, rad); c.closePath(); c.fill(); }
    c.fillStyle = '#faf8f4'; c.fillRect(0, 0, W, H); c.fillStyle = '#a8691a'; c.fillRect(0, 0, W, 16);
    rr(70, 70, 90, 90, 20, '#a8691a'); c.fillStyle = '#8a5512'; c.fillRect(70, 78, 11, 74); txt('M', 120, 140, '600 56px ' + SER, '#fff', 'center');
    txt('Minto English', 185, 112, '600 44px ' + SER, '#6b4410'); txt('Phiếu kết quả luyện tập TOEIC', 187, 150, '500 26px ' + SANS, '#666e7a');
    txt(nm || 'Học viên', 70, 250, '600 48px ' + SER, '#1e232b');
    txt(NAME + ' · ' + M.name + ' · ' + new Date(r.at).toLocaleDateString('vi-VN'), 70, 296, '500 26px ' + SANS, '#666e7a');
    rr(70, 340, W - 140, 300, 28, '#ffffff');
    var total = (r.lcS || 0) + (r.rcS || 0), tot = r.lcT + r.rcT, got = r.lc + r.rc;
    txt(r.lcS || r.rcS ? (r.lcS && r.rcS ? 'TỔNG ĐIỂM ƯỚC TÍNH' : 'ĐIỂM ƯỚC TÍNH') : 'KẾT QUẢ', 110, 400, '700 22px ' + SANS, '#a8691a');
    txt(String(r.lcS || r.rcS ? total : got), 110, 530, '600 130px ' + SER, '#6b4410');
    txt('/ ' + (r.lcS && r.rcS ? 990 : r.lcS || r.rcS ? 495 : tot), 110 + c.measureText(String(r.lcS || r.rcS ? total : got)).width + 20, 530, '500 40px ' + SANS, '#666e7a');
    txt(got + '/' + tot + ' câu đúng', 110, 590, '500 28px ' + SANS, '#666e7a');
    var yy = 410;
    [[r.lcS, 'Listening', CEFR_L], [r.rcS, 'Reading', CEFR_R]].forEach(function (k) {
      if (!k[0]) return; txt(k[1], 600, yy, '700 28px ' + SANS, '#1e232b'); txt(k[0] + ' / 495', 970, yy, '700 28px ' + SANS, '#6b4410', 'right');
      rr(600, yy + 18, 370, 18, 9, '#f0eadf'); rr(600, yy + 18, Math.max(18, 370 * (k[0] - 5) / 490), 18, 9, '#a8691a');
      txt('CEFR ' + cefr(k[2], k[0]), 600, yy + 72, '600 24px ' + SANS, '#1f8f6c'); yy += 120;
    });
    var py = 700; txt('Theo từng Part', 70, py, '600 34px ' + SER, '#1e232b'); py += 30;
    Object.keys(r.parts).forEach(function (p) { var a = r.parts[p], pc = a[0] / a[1]; py += 54; txt(PART_INFO[p][0] + ' · ' + PART_INFO[p][1], 70, py, '500 26px ' + SANS, '#1e232b');
      rr(520, py - 20, 380, 18, 9, '#f0eadf'); rr(520, py - 20, Math.max(18, 380 * pc), 18, 9, pc >= .8 ? '#1f8f6c' : pc >= .6 ? '#d9a63c' : '#c14636'); txt(a[0] + '/' + a[1], 1010, py, '700 26px ' + SANS, '#1e232b', 'right'); });
    txt('Điểm ước tính từ bài luyện tập, không phải điểm thi chính thức.', W / 2, H - 60, '500 22px ' + SANS, '#999', 'center');
    var a = document.createElement('a'); a.download = 'phieu-diem-test' + T + '.png'; a.href = cv.toDataURL('image/png'); document.body.appendChild(a); a.click(); a.remove();
    toast('Đã lưu ảnh phiếu điểm ✓');
  }
})();

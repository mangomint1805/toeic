/* Minto English — thanh menu chung, bộ icon nét, logo. Dùng: <body data-nav="home|mini|stats|dict|cards"> */
(function () {
  'use strict';
  var ME = document.currentScript && document.currentScript.src || '', ROOT = ME.replace(/(assets|shared)\/ui\.js.*$/, '');
  var SITE = (document.currentScript && document.currentScript.getAttribute('data-site')) || (/\/shared\/ui\.js/.test(ME) ? 'ielts' : 'toeic');
  var TOEIC_URL = 'https://mangomint1805.github.io/toeic/';
  var P = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
    test: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    flame: '<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5.3 1.6 1.2 2.6 2.2 2.8C10.5 9 11 6 12 3z"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    pen: '<path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="m14 6 4 4"/>',
    cards: '<rect x="3" y="7" width="13" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/>',
    headphones: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="5" height="7" rx="2"/><rect x="16" y="14" width="5" height="7" rx="2"/>',
    book: '<path d="M2 5h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2z"/><path d="M22 5h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    play: '<path d="M7 4v16l13-8z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    check: '<path d="m5 12 5 5L20 7"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0z"/><path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5v.01"/>'
  };
  function icon(n, cls) { return '<svg class="ic ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[n] || '') + '</svg>'; }
  window.MICON = icon;
  var LOGO = '<svg class="mlogo" viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="9" fill="#a8691a"/><rect width="5" height="40" rx="2" fill="#8a5512"/><text x="22.5" y="28.5" text-anchor="middle" font-family="Fraunces,Georgia,serif" font-weight="600" font-size="23" fill="#fff">M</text></svg>';
  window.MLOGO = LOGO;
  var css = document.createElement('style');
  css.textContent =
    '.ic{width:1.15em;height:1.15em;vertical-align:-.2em;flex:none}' +
    '.mnav{position:sticky;top:0;z-index:40;background:rgba(255,255,255,.94);backdrop-filter:blur(8px);border-bottom:1px solid #e6e0d3}' +
    '.mnav .in{max-width:1080px;margin:0 auto;padding:10px 20px;display:flex;align-items:center;gap:18px}' +
    '.mbrand{display:flex;align-items:center;gap:10px;text-decoration:none;color:#1e232b}' +
    '.mlogo{width:34px;height:34px;flex:none;border-radius:9px}' +
    '.mbrand b{font:600 19px/1 Fraunces,Georgia,serif;letter-spacing:-.01em}' +
    '.mbrand b{display:flex;align-items:center;gap:7px}.mbrand b em{font:700 9.5px/1 "IBM Plex Sans",sans-serif;letter-spacing:.1em;color:#a8691a;background:#f6ead3;border-radius:5px;padding:3px 5px 2px;font-style:normal}' +
    '.mbrand small{display:block;font:500 11px/1 "Hiragino Sans","Hiragino Kaku Gothic ProN","Noto Sans JP","Yu Gothic",Meiryo,sans-serif;letter-spacing:.3em;color:#9a8f7d;margin-top:5px}' +
    'html[data-theme=dark] .mbrand b em{background:#3b2d1b;color:#f0c787}html[data-theme=dark] .mbrand small{color:#8d8678}' +
    '.mlinks{display:flex;gap:4px;margin-left:auto}' +
    '.mlinks a{display:flex;align-items:center;gap:7px;font:600 14px/1 "IBM Plex Sans",sans-serif;color:#4b5260;text-decoration:none;padding:9px 12px;border-radius:9px}' +
    '.mlinks a:hover{background:#f6f1e7;color:#6b4410}' +
    '.mlinks a[aria-current=page]{background:#f2e2c4;color:#6b4410}' +
    '.mlinks a:focus-visible,.mbrand:focus-visible{outline:3px solid #f2c879;outline-offset:2px}' +
    'body.has-nav .back{display:none}' +
    '@media (max-width:760px){.mlinks{position:fixed;left:0;right:0;bottom:0;margin:0;background:#fff;border-top:1px solid #e6e0d3;justify-content:space-around;padding:6px 4px calc(6px + env(safe-area-inset-bottom));gap:0;box-shadow:0 -6px 20px rgba(0,0,0,.05)}' +
    '.mlinks a{flex-direction:column;gap:3px;font-size:11px;padding:6px 4px;flex:1;text-align:center}.mlinks a .ic{width:22px;height:22px}' +
    'body.has-nav{padding-bottom:70px}.mnav .in{padding:9px 16px}.mnav{backdrop-filter:none;background:#fff}}';
  document.head.appendChild(css);
  var cur = document.body.getAttribute('data-nav');
  if (cur !== null) {
    var L = (window.MNAV_LINKS || (SITE === 'summary' ? [['home', '', 'Bài học', 'book'], ['nen', TOEIC_URL + 'nen.html', 'Kiến thức nền', 'layers'], ['toeic', TOEIC_URL, 'Luyện đề TOEIC', 'test'], ['mini', TOEIC_URL + 'mini.html', 'Đề mini', 'flame']] : SITE === 'ielts' ? [['home', '', 'Bộ đề', 'book'], ['nen', 'nen.html', 'Nền tảng', 'layers'], ['stats', 'phan-tich.html', 'Điểm yếu', 'chart'], ['dict', 'chinh-ta.html', 'Chính tả', 'pen'], ['cards', 'flashcards.html', 'Flashcard', 'cards'], ['help', 'huong-dan.html', 'Hướng dẫn', 'help']] : [['home', '', 'Đề thi', 'test'], ['mini', 'mini.html', 'Đề mini', 'flame'], ['nen', 'nen.html', 'Nền tảng', 'layers'], ['stats', 'phan-tich.html', 'Điểm yếu', 'chart'], ['dict', 'chinh-ta.html', 'Chính tả', 'pen'], ['cards', 'flashcards.html', 'Flashcard', 'cards']])).map(function (l) { return [l[0], /^https?:/.test(l[1]) ? l[1] : ROOT + l[1], l[2], l[3]]; });
    var nav = document.createElement('header'); nav.className = 'mnav';
    nav.innerHTML = '<div class="in"><a class="mbrand" href="' + L[0][1] + '" aria-label="Minto English — trang chủ">' + LOGO + '<span><b>Minto English<em>' + (window.MNAV_LABEL || (SITE === 'ielts' ? 'IELTS' : SITE === 'summary' ? 'TOEIC PRE' : 'TOEIC')) + '</em></b><small lang="ja">ミント英語</small></span></a><nav class="mlinks" aria-label="Menu">' +
      L.map(function (l) { return '<a href="' + l[1] + '"' + (l[0] === cur ? ' aria-current="page"' : '') + '>' + icon(l[3]) + '<span>' + l[2] + '</span></a>'; }).join('') + '</nav></div>';
    document.body.insertBefore(nav, document.body.firstChild);
    document.body.classList.add('has-nav');
  }
  [].forEach.call(document.querySelectorAll('[data-ic]'), function (el) { el.innerHTML = icon(el.getAttribute('data-ic')); });

  // ---------- giao diện tối / sáng ----------
  var DARK_CSS =
    'html[data-theme=dark]{color-scheme:dark;--paper:#14161a;--card:#1c1f25;--line:#2c3038;--line2:#373b44;--ink:#e8e4dc;--dim:#9aa1ad;--panel2:#242830;' +
    '--brand:#d39a4a;--brand-soft:#3b2d1b;--brand-ink:#f0c787;--ok:#3fbf8f;--ok-soft:#163a2d;--bad:#ef7a68;--bad-soft:#3d2320;--mid:#d9a63c;' +
    '--amber:#d39a4a;--amber-soft:#3b2d1b;--amber-ink:#f0c787;--teal:#3fbf8f;--teal-soft:#163a2d;--red:#ef7a68;--red-soft:#3d2320}' +
    'html[data-theme=dark] body{background:var(--paper);color:var(--ink)}' +
    'html[data-theme=dark] .mnav{background:rgba(20,22,26,.94);border-color:#2c3038}html[data-theme=dark] .mbrand{color:var(--ink)}' +
    'html[data-theme=dark] .mlinks a{color:#b9bfc9}html[data-theme=dark] .mlinks a:hover{background:#242830;color:var(--brand-ink)}html[data-theme=dark] .mlinks a[aria-current=page]{background:#3b2d1b;color:var(--brand-ink)}' +
    'html[data-theme=dark] header.top,html[data-theme=dark] header.top .bar{background:rgba(20,22,26,.96)}' +
    'html[data-theme=dark] input,html[data-theme=dark] select,html[data-theme=dark] textarea{background:#242830!important;color:var(--ink)!important;border-color:#3a3f48!important}' +
    'html[data-theme=dark] :is(.btn.alt,.vpop,.psg,.inst,.spd button,.ptabs button,.sgrid button,.ptog,.sv,.chip,.go,.panel,.passage,.part,.card,.box,.mode,.test,.tool,.report,.sheet-card,.nm-card,.cue,.res,.empty,.hist,.mlinks,.stat,.resume,.fbk-card,.prog-card,.tips,.me,.dots button,.parts button,.week i,.tabs button,.big.alt,.opt .L,.qtype button,.facts,.evbar button.ghost,details.more,.blank-q,table,td,th){background-color:var(--card)!important;color:inherit;border-color:var(--line2)!important}' +
    'html[data-theme=dark] :is(.opt,.stat,.parts div,.psg .msg,.panel2,.dir,.week i,thead th,th){background-color:var(--panel2)!important}' +
    'html[data-theme=dark] .psg{background:#1a1d22!important;color:#ece7de}' +
    'html[data-theme=dark] :is(.opt.right,.opt:has(input:checked)){background:var(--brand-soft)!important}' +
    'html[data-theme=dark] .opt.right{background:var(--ok-soft)!important;border-color:var(--ok)!important}html[data-theme=dark] .opt.wrong{background:var(--bad-soft)!important;border-color:var(--bad)!important}' +
    'html[data-theme=dark] :is(.btn:not(.alt),.big:not(.alt)){color:#1a1307}' +
    'html[data-theme=dark] img:not(.mlogo){filter:brightness(.88) contrast(1.05)}' +
    'html[data-theme=dark] .resume{background:#2a2216!important;border-color:#5a4422!important}' +
    'html[data-theme=dark] ::highlight(vpick){background:#7a5a22}' +
    'html.theme-anim *{transition:background-color .35s,border-color .35s,color .35s!important}';
  // ---------- hiệu ứng ----------
  var FX_CSS =
    '@media (prefers-reduced-motion:no-preference){' +
    '.fx-in{opacity:0;transform:translateY(14px)}.fx-in.fx-on{opacity:1;transform:none;transition:opacity .55s ease,transform .55s cubic-bezier(.2,.7,.2,1)}' +
    '.btn,.big,.tool,.test,.mode,.opt,.chip,.go{transition:transform .15s ease,box-shadow .2s,border-color .15s,background-color .15s}' +
    '.btn:active,.big:active,.opt:active,.mode:active{transform:scale(.97)}' +
    '.ring svg circle+circle{transition:stroke-dasharray 1.1s cubic-bezier(.2,.7,.2,1)}' +
    '}';
  var st2 = document.createElement('style'); st2.textContent = DARK_CSS + FX_CSS +
    '.mtool{display:flex;gap:6px;align-items:center;margin-left:8px}.mlinks~.mtool{margin-left:6px}' +
    '.mbtn{width:38px;height:38px;border-radius:10px;border:1px solid #e6e0d3;background:#fff;color:#6b4410;display:flex;align-items:center;justify-content:center;cursor:pointer}' +
    'html[data-theme=dark] .mbtn{background:#1c1f25;border-color:#373b44;color:#f0c787}.mbtn .ic{width:19px;height:19px}' +
    '.mfloat{position:fixed;right:14px;bottom:16px;z-index:58;display:flex;flex-direction:column;gap:8px}' +
    'body.has-nav .mfloat{bottom:84px}@media (min-width:761px){body.has-nav .mfloat{bottom:16px}}' +
    '.mfloat .mbtn{box-shadow:0 6px 18px rgba(0,0,0,.14);width:44px;height:44px;border-radius:50%}' +
    '.fbk{position:fixed;inset:0;z-index:90;background:rgba(15,17,21,.5);display:flex;align-items:flex-end;justify-content:center;padding:12px}' +
    '@media (min-width:600px){.fbk{align-items:center}}' +
    '.fbk-card{background:#fff;color:#1e232b;border-radius:18px;padding:18px;max-width:460px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.3);font:15px/1.5 "IBM Plex Sans",sans-serif;animation:fbkup .25s ease}' +
    '@keyframes fbkup{from{transform:translateY(20px);opacity:0}}' +
    '.fbk-card h3{font:600 21px/1.2 Fraunces,Georgia,serif;margin:0 0 4px}.fbk-card p{margin:0 0 12px;color:#666e7a;font-size:13.5px}' +
    '.fbk-types{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 10px}.fbk-types button{font:600 13px/1 "IBM Plex Sans",sans-serif;border:1.5px solid #ddd7c9;background:#fff;color:#4b5260;border-radius:999px;padding:7px 11px;cursor:pointer}' +
    '.fbk-types button[aria-pressed=true]{background:#a8691a;border-color:#a8691a;color:#fff}' +
    '.fbk-card textarea{width:100%;min-height:110px;font:inherit;padding:10px 12px;border:1.5px solid #ddd7c9;border-radius:10px;resize:vertical}' +
    '.fbk-row{display:flex;gap:8px;justify-content:flex-end;margin-top:12px}.fbk-row button{font:700 14.5px/1 "IBM Plex Sans",sans-serif;border-radius:10px;padding:11px 16px;cursor:pointer;border:1.5px solid #a8691a}' +
    '.fbk-row .ok{background:#a8691a;color:#fff}.fbk-row .no{background:#fff;color:#6b4410;border-color:#ddd7c9}' +
    'html[data-theme=dark] .fbk-card{background:#1d2026;color:#e8e4dc}html[data-theme=dark] .fbk-card p{color:#a3a9b3}html[data-theme=dark] .fbk-types button:not([aria-pressed=true]),html[data-theme=dark] .fbk-row .no{background:#262a31;color:#e8e4dc;border-color:#3a3f48}html[data-theme=dark] .fbk-card textarea{background:#15171b;color:#e8e4dc;border-color:#3a3f48}' +
    'html[data-theme=dark] :is(.prompt,.picker select,textarea){background-color:#15171b!important;color:#e8e4dc!important;border-color:#3a3f48}';
  document.head.appendChild(st2);
  P.moon = '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>';
  P.sun = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';
  P.msg = '<path d="M4 5h16v11H8l-4 4z"/><path d="M8 9h8M8 12h5"/>';
  function theme() { try { return localStorage.getItem('mt.theme') || 'light'; } catch (e) { return 'light'; } }
  function applyTheme(t, anim) {
    var r = document.documentElement;
    if (anim) { r.classList.add('theme-anim'); setTimeout(function () { r.classList.remove('theme-anim'); }, 450); }
    r.setAttribute('data-theme', t); r.style.colorScheme = t;
    var m = document.querySelector('meta[name=color-scheme]'); if (m) m.setAttribute('content', t === 'dark' ? 'dark' : 'light only');
    [].forEach.call(document.querySelectorAll('.mtheme'), function (b) { b.innerHTML = icon(t === 'dark' ? 'sun' : 'moon'); b.setAttribute('aria-label', t === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'); b.title = b.getAttribute('aria-label'); });
  }
  function toggleTheme() { var t = theme() === 'dark' ? 'light' : 'dark'; try { localStorage.setItem('mt.theme', t); } catch (e) {} applyTheme(t, true); }
  // ---------- góp ý / báo lỗi ----------
  function feedback() {
    var types = ['Lỗi đáp án', 'Lỗi audio', 'Lỗi hiển thị', 'Góp ý khác'], sel = types[0];
    var w = document.createElement('div'); w.className = 'fbk'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-modal', 'true'); w.setAttribute('aria-label', 'Góp ý, báo lỗi');
    w.innerHTML = '<div class="fbk-card"><h3>Góp ý / báo lỗi</h3><p>Thấy đáp án sai, audio không chạy hay trang bị lỗi? Ghi lại giúp thầy nhé, nhớ ghi số câu nếu có.</p><div class="fbk-types">' +
      types.map(function (t, i) { return '<button type="button" aria-pressed="' + (i === 0) + '">' + t + '</button>'; }).join('') + '</div>' +
      '<textarea id="fbkTx" placeholder="Ví dụ: Test 3 câu 147, đáp án ghi C nhưng em nghĩ là B vì..."></textarea><div class="fbk-row"><button type="button" class="no">Huỷ</button><button type="button" class="ok">Gửi cho thầy</button></div></div>';
    document.body.appendChild(w);
    var tx = w.querySelector('textarea'); setTimeout(function () { tx.focus(); }, 50);
    [].forEach.call(w.querySelectorAll('.fbk-types button'), function (b) { b.onclick = function () { sel = b.textContent; [].forEach.call(w.querySelectorAll('.fbk-types button'), function (x) { x.setAttribute('aria-pressed', String(x === b)); }); }; });
    function close() { w.remove(); }
    w.querySelector('.no').onclick = close; w.addEventListener('click', function (e) { if (e.target === w) close(); });
    document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); } });
    w.querySelector('.ok').onclick = function () {
      var m = tx.value.trim(); if (m.length < 3) { tx.focus(); return; }
      var cfg = window.ETSCFG || window.C20CFG || {}, url = cfg.SCRIPT_URL;
      var nm = '', lop = ''; try { nm = localStorage.getItem('cam20.name') || ''; lop = localStorage.getItem('cam20.lop') || ''; } catch (e) {}
      var body = { kind: 'cam20', name: nm || '(ẩn danh)', lop: lop, test: document.title, part: 'Góp ý · ' + sel, mode: 'Góp ý', got: '', total: '', band: '', minutes: '',
        wrong: m + '\n— Trang: ' + location.href, auto: false, submittedAt: new Date().toISOString(), userAgent: navigator.userAgent.slice(0, 160) };
      if (url) { try { fetch(url, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) }).catch(function () {}); } catch (e) {} }
      w.querySelector('.fbk-card').innerHTML = '<h3>Cảm ơn bạn!</h3>' + buddy('Thầy đã nhận được góp ý rồi nha, sẽ sửa sớm thôi. Cảm ơn bạn nhiều!', 'cheer') + '<div class="fbk-row"><button type="button" class="ok">Đóng</button></div>';
      w.querySelector('.ok').onclick = close;
    };
  }

  // ================= dữ liệu học tập (đọc từ máy) =================
  function J(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function S(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function dkey(t) { var d = t instanceof Date ? t : new Date(t); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function streakOf(days) { var n = 0, d = new Date(); if (!days[dkey(d)]) d.setDate(d.getDate() - 1); while (days[dkey(d)]) { n++; d.setDate(d.getDate() - 1); } return n; }
  var BOOKS = [17, 18, 19, 20, 21];
  function stats() {
    var days = {}, o = { site: SITE, today: dkey(new Date()) };
    var nen = J('mt.nen.' + SITE, {}); o.nenMap = nen; o.nenAll = Object.keys(nen).length; o.nen = Object.keys(nen).filter(function (k) { return k.indexOf('mh-') !== 0; }).length; o.nenToday = 0;
    Object.keys(nen).forEach(function (k) { if (nen[k] && nen[k].t) { days[dkey(nen[k].t)] = 1; if (dkey(nen[k].t) === o.today) o.nenToday++; } });
    var cards = J('vocab.cards', {}); o.cards = Array.isArray(cards) ? cards.length : Object.keys(cards || {}).length;
    if (SITE === 'toeic') {
      var h = J('ets26.hist', []), pa = {}; o.subs = h.length; o.best = 0; o.full = 0; o.perfect = 0; o.tests = {}; o.lastFull = 0;
      h.forEach(function (r) {
        if (!r) return; if (r.at) days[dkey(r.at)] = 1; o.tests[r.test] = (o.tests[r.test] || 0) + 1;
        if (r.lcS && r.rcS) { o.best = Math.max(o.best, r.lcS + r.rcS); o.full++; o.lastFull = Math.max(o.lastFull, r.at || 0); }
        if (r.parts) for (var p in r.parts) { var x = r.parts[p]; if (!x) continue; var a = pa[p] || (pa[p] = [0, 0]); a[0] += x[0]; a[1] += x[1]; if (x[1] >= 5 && x[0] === x[1]) o.perfect++; }
      });
      o.partAcc = pa; o.ntests = Object.keys(o.tests).length;
      var md = J('ets26.mini.days', {}); Object.keys(md).forEach(function (k) { days[k] = 1; }); o.mini = Object.keys(md).length; o.miniToday = !!md[o.today];
    } else {
      var pairs = {}, bp = {}; o.subs = 0; o.bestL = 0; o.bestR = 0; o.books = {}; o.full = 0; o.lastFull = 0; o.done = {};
      BOOKS.forEach(function (b) {
        J('cam' + b + '.hist', []).forEach(function (r) {
          if (!r) return; o.subs++; if (r.t) days[dkey(r.t)] = 1; o.books[b] = 1; o.done[b + '-' + r.test] = 1;
          if (r.total === 40) { var bd = +r.band || 0; if (r.sec === 'L') o.bestL = Math.max(o.bestL, bd); else o.bestR = Math.max(o.bestR, bd); pairs[b + '-' + r.test + r.sec] = r.t || 1; }
          if (r.byPart) for (var p in r.byPart) { var x = r.byPart[p], a = bp[p] || (bp[p] = [0, 0]); a[0] += x[0]; a[1] += x[1]; }
        });
      });
      Object.keys(pairs).forEach(function (k) { if (k.slice(-1) === 'L' && pairs[k.slice(0, -1) + 'R']) { o.full++; o.lastFull = Math.max(o.lastFull, pairs[k], pairs[k.slice(0, -1) + 'R']); } });
      o.partAcc = bp; o.nbooks = Object.keys(o.books).length;
      var wh = J('cam.ws.hist', []); o.ws = wh.length; o.lastWs = 0; wh.forEach(function (r) { if (r && r.t) { days[dkey(r.t)] = 1; o.lastWs = Math.max(o.lastWs, r.t); } });
    }
    o.days = days; o.streak = streakOf(days); o.ndays = Object.keys(days).length;
    return o;
  }
  window.MSTATS = stats;

  // ================= huy hiệu =================
  P.star = '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>';
  P.medal = '<circle cx="12" cy="15" r="6"/><path d="M8.5 3h7L13.8 9.3M10.2 9.3 8.5 3"/><path d="m12 12.5.9 1.8 2 .3-1.4 1.4.3 2-1.8-1-1.8 1 .3-2-1.4-1.4 2-.3z"/>';
  P.pen2 = '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>';
  P.cal = '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>';
  P.gear = '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>';
  var BADGES = SITE === 'summary' ? [] : SITE === 'toeic' ? [
    ['first', 'Khởi động', 'Nộp bài hoặc làm đề mini đầu tiên', 'play', function (s) { return s.subs + s.mini >= 1; }],
    ['nen1', 'Chịu khó học nền', 'Học xong 1 bài Kiến thức nền', 'book', function (s) { return s.nenAll >= 1; }],
    ['nen10', 'Nền vững', 'Học xong 10 bài Kiến thức nền', 'layers', function (s) { return s.nenAll >= 10; }],
    ['streak3', 'Chuỗi 3 ngày', 'Học 3 ngày liên tục', 'flame', function (s) { return s.streak >= 3; }],
    ['streak7', 'Chuỗi 7 ngày', 'Học 7 ngày liên tục', 'flame', function (s) { return s.streak >= 7; }],
    ['streak30', 'Chuỗi 30 ngày', 'Học 30 ngày liên tục', 'flame', function (s) { return s.streak >= 30; }],
    ['mini7', 'Mini x7', 'Làm đề mini trong 7 ngày khác nhau', 'clock', function (s) { return s.mini >= 7; }],
    ['perfect', 'Không sai câu nào', 'Đúng 100% một Part (từ 5 câu trở lên)', 'target', function (s) { return s.perfect >= 1; }],
    ['full1', 'Full test đầu tiên', 'Làm trọn 200 câu một đề', 'test', function (s) { return s.full >= 1; }],
    ['s500', 'Vượt mốc 500', 'Full test đạt từ 500 điểm', 'medal', function (s) { return s.best >= 500; }],
    ['s700', 'Vượt mốc 700', 'Full test đạt từ 700 điểm', 'trophy', function (s) { return s.best >= 700; }],
    ['s850', 'Vượt mốc 850', 'Full test đạt từ 850 điểm', 'star', function (s) { return s.best >= 850; }],
    ['tests5', 'Thử sức 5 đề', 'Làm bài ở 5 đề khác nhau', 'layers', function (s) { return s.ntests >= 5; }],
    ['cards20', 'Sưu tầm 20 từ', 'Lưu 20 từ vào flashcard', 'cards', function (s) { return s.cards >= 20; }]
  ] : [
    ['first', 'Khởi động', 'Nộp bài đầu tiên', 'play', function (s) { return s.subs + s.ws >= 1; }],
    ['nen1', 'Chịu khó học nền', 'Học xong 1 bài Kiến thức nền', 'book', function (s) { return s.nenAll >= 1; }],
    ['nen10', 'Nền vững', 'Học xong 10 bài Kiến thức nền', 'layers', function (s) { return s.nenAll >= 10; }],
    ['streak3', 'Chuỗi 3 ngày', 'Học 3 ngày liên tục', 'flame', function (s) { return s.streak >= 3; }],
    ['streak7', 'Chuỗi 7 ngày', 'Học 7 ngày liên tục', 'flame', function (s) { return s.streak >= 7; }],
    ['streak30', 'Chuỗi 30 ngày', 'Học 30 ngày liên tục', 'flame', function (s) { return s.streak >= 30; }],
    ['full1', 'Trọn một test', 'Làm đủ Listening và Reading của một test', 'test', function (s) { return s.full >= 1; }],
    ['b6', 'Band 6', 'Listening hoặc Reading đạt band 6', 'medal', function (s) { return Math.max(s.bestL, s.bestR) >= 6; }],
    ['b7', 'Band 7', 'Listening hoặc Reading đạt band 7', 'trophy', function (s) { return Math.max(s.bestL, s.bestR) >= 7; }],
    ['b8', 'Band 8', 'Listening hoặc Reading đạt band 8', 'star', function (s) { return Math.max(s.bestL, s.bestR) >= 8; }],
    ['ws1', 'Bài viết đầu tiên', 'Gửi một bài Writing cho thầy', 'pen2', function (s) { return s.ws >= 1; }],
    ['books3', 'Khám phá 3 bộ', 'Làm bài ở 3 bộ Cambridge khác nhau', 'book', function (s) { return s.nbooks >= 3; }],
    ['cards20', 'Sưu tầm 20 từ', 'Lưu 20 từ vào flashcard', 'cards', function (s) { return s.cards >= 20; }]
  ];
  var BKEY = 'mt.badges.' + SITE;
  window.MBADGES = function () { if (!prev) check(); var got = J(BKEY, {}); return BADGES.map(function (b) { return { id: b[0], name: b[1], desc: b[2], icon: b[3], at: got[b[0]] || 0 }; }); };
  window.MBADGEHTML = function () {
    return '<div class="mbadges">' + window.MBADGES().map(function (b) {
      return '<div class="mbadge' + (b.at ? ' on' : '') + '" title="' + esc(b.desc) + '"><span class="mb-i">' + icon(b.at ? b.icon : b.icon) + '</span><b>' + esc(b.name) + '</b><small>' + esc(b.at ? 'Đạt ' + dkey(b.at).split('-').reverse().join('/') : b.desc) + '</small></div>';
    }).join('') + '</div>';
  };

  // ================= pháo giấy + thông báo =================
  function confetti() {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var c = document.createElement('canvas'), x = c.getContext('2d'), W = c.width = innerWidth, H = c.height = innerHeight, cols = ['#a8691a', '#f2c879', '#1f8f6c', '#d9573f', '#5b7fd6', '#e9a23b', '#fff4dc'], ps = [];
    c.className = 'mconf'; document.body.appendChild(c);
    for (var i = 0; i < 160; i++) { var side = i % 2; ps.push({ x: side ? W + 10 : -10, y: H * (.35 + Math.random() * .4), vx: (side ? -1 : 1) * (4 + Math.random() * 8), vy: -(7 + Math.random() * 9), r: Math.random() * 6.28, vr: (Math.random() - .5) * .3, w: 6 + Math.random() * 6, h: 8 + Math.random() * 8, c: cols[i % cols.length] }); }
    var t0 = performance.now();
    (function f(t) {
      var el = t - t0; x.clearRect(0, 0, W, H);
      ps.forEach(function (p) { p.vy += .32; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.r += p.vr; x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.globalAlpha = Math.max(0, 1 - el / 3200); x.fillStyle = p.c; x.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r * 2))); x.restore(); });
      if (el < 3200) requestAnimationFrame(f); else c.remove();
    })(t0);
  }
  window.MCONFETTI = confetti;
  var toastQ = [], toastOn = false;
  function mtoast(ic, title, sub, href) {
    toastQ.push([ic, title, sub, href]); if (toastOn) return;
    (function next() {
      var a = toastQ.shift(); if (!a) { toastOn = false; return; } toastOn = true;
      var d = document.createElement(a[3] ? 'a' : 'div'); d.className = 'mtoast'; if (a[3]) d.href = a[3]; d.setAttribute('role', 'status');
      d.innerHTML = '<span class="mt-i">' + icon(a[0]) + '</span><span><b>' + esc(a[1]) + '</b><small>' + esc(a[2]) + '</small></span>';
      document.body.appendChild(d); setTimeout(function () { d.classList.add('out'); setTimeout(function () { d.remove(); next(); }, 350); }, 4200);
    })();
  }
  window.MTOAST = mtoast;
  var prev = null;
  function check() {
    var s = stats(), got = J(BKEY, null), first = got === null, fresh = [];
    got = got || {};
    BADGES.forEach(function (b) { if (!got[b[0]] && b[4](s)) { got[b[0]] = Date.now(); fresh.push(b); } });
    if (fresh.length || first) S(BKEY, got);
    var party = false, home = ROOT + (SITE === 'ielts' ? '' : '') + '#huy-hieu';
    if (prev) {
      if (SITE === 'toeic' && s.best > prev.best && prev.subs < s.subs) { mtoast('trophy', prev.best ? 'Kỷ lục mới: ' + s.best + ' điểm!' : 'Điểm Full test đầu tiên: ' + s.best, prev.best ? 'Cao hơn lần trước ' + (s.best - prev.best) + ' điểm. Giỏi lắm!' : 'Cứ thế mà tiến lên nhé!'); party = true; }
      if (SITE === 'ielts' && prev.subs < s.subs && (s.bestL > prev.bestL || s.bestR > prev.bestR)) { var L = s.bestL > prev.bestL; mtoast('trophy', 'Band ' + (L ? 'Listening' : 'Reading') + ' cao nhất mới: ' + (L ? s.bestL : s.bestR), 'Tiến bộ rồi đó, giữ phong độ nhé!'); party = true; }
    }
    if (!first) fresh.forEach(function (b) { mtoast(b[3], 'Huy hiệu mới: ' + b[1], b[2], home); party = true; });
    if (party) confetti();
    prev = s;
  }
  var chkT;
  try {
    var _set = Storage.prototype.setItem, WATCH = /^(ets26\.hist|ets26\.mini\.days|cam\d+\.hist|cam\.ws\.hist|mt\.nen\.|vocab\.cards)/;
    Storage.prototype.setItem = function (k, v) { _set.apply(this, arguments); try { if (WATCH.test(k) && this === window.localStorage) { clearTimeout(chkT); chkT = setTimeout(check, 900); } } catch (e) {} };
  } catch (e) {}

  // ================= cỡ chữ + bảng cài đặt =================
  var FS = [.9, 1, 1.1, 1.2, 1.35];
  function fs() { var v = +J('mt.fs', 1); return FS.indexOf(v) >= 0 ? v : 1; }
  function applyFs(v) { var r = document.documentElement; if (v === 1) { r.removeAttribute('data-fs'); r.style.removeProperty('--fs'); } else { r.setAttribute('data-fs', ''); r.style.setProperty('--fs', v); } }
  applyFs(fs());
  function settings(btn) {
    var old = document.querySelector('.mpop'); if (old) { old.remove(); return; }
    var p = document.createElement('div'); p.className = 'mpop'; p.setAttribute('role', 'dialog'); p.setAttribute('aria-label', 'Cài đặt hiển thị');
    function draw() {
      var v = fs(), dk = theme() === 'dark';
      p.innerHTML = '<div class="mp-row"><span>Cỡ chữ</span><div class="mp-fs"><button type="button" data-d="-1" aria-label="Chữ nhỏ hơn"' + (v === FS[0] ? ' disabled' : '') + '>A−</button><b>' + Math.round(v * 100) + '%</b><button type="button" data-d="1" aria-label="Chữ to hơn"' + (v === FS[FS.length - 1] ? ' disabled' : '') + '>A+</button></div></div>' +
        '<div class="mp-row"><span>Giao diện tối</span><button type="button" class="mp-sw" role="switch" aria-checked="' + dk + '"><i></i></button></div>' +
        '<button type="button" class="mp-tour">' + icon('help') + ' Xem lại hướng dẫn</button>';
      [].forEach.call(p.querySelectorAll('.mp-fs button'), function (b) { b.onclick = function () { var i = FS.indexOf(fs()) + (+b.getAttribute('data-d')); i = Math.max(0, Math.min(FS.length - 1, i)); S('mt.fs', FS[i]); applyFs(FS[i]); draw(); }; });
      p.querySelector('.mp-sw').onclick = function () { toggleTheme(); draw(); };
      p.querySelector('.mp-tour').onclick = function () { p.remove(); tour(true); };
    }
    draw(); document.body.appendChild(p); p.addEventListener('click', function (e) { e.stopPropagation(); });
    var r = btn.getBoundingClientRect(), pw = 250;
    p.style.top = (r.top < innerHeight / 2 ? r.bottom + 8 : Math.max(8, r.top - p.offsetHeight - 8)) + 'px';
    p.style.left = Math.max(8, Math.min(innerWidth - pw - 8, r.right - pw)) + 'px';
    setTimeout(function () { document.addEventListener('click', function off(e) { if (!p.contains(e.target) && !btn.contains(e.target)) { p.remove(); document.removeEventListener('click', off); } }); }, 0);
  }

  // ================= hướng dẫn lần đầu =================
  var TOUR = SITE === 'summary' ? [] : SITE === 'toeic' ? [
    [null, 'Chào bạn 👋', 'Đây là web luyện TOEIC của lớp thầy Minto. Mình chỉ nhanh mấy chỗ quan trọng nhé, chưa tới 1 phút.'],
    ['#me', 'Nhập tên một lần', 'Gõ họ tên và lớp ở đây để thầy nhận được kết quả mỗi lần bạn nộp bài.'],
    ['.mlinks a[href$="nen.html"]', 'Mới học? Bắt đầu ở đây', 'Mục Nền tảng ôn ngữ pháp, từ vựng và mẹo nghe cơ bản, giải thích tiếng Việt, có bài tập nhỏ.'],
    ['.mlinks a[href$="mini.html"]', 'Đề mini 10 phút', 'Mỗi ngày làm một đề mini để giữ chuỗi ngày học và mở huy hiệu.'],
    ['#plan', 'Đếm ngược ngày thi', 'Nhập ngày thi, web sẽ đếm ngược và gợi ý hôm nay nên học gì.'],
    ['#tests', 'Bộ 10 đề thi thử', 'Làm cả đề có giờ như thi thật, hoặc luyện riêng từng Part.'],
    ['.mset', 'Cỡ chữ và giao diện tối', 'Chữ nhỏ quá? Bấm vào đây để phóng to, bật giao diện tối hoặc xem lại hướng dẫn này.'],
    ['.mfb', 'Thấy lỗi thì báo thầy', 'Đáp án sai, audio không chạy, trang bị lỗi... bấm vào đây gửi cho thầy nhé.']
  ] : [
    [null, 'Chào bạn 👋', 'Đây là web luyện IELTS Cambridge của lớp thầy Minto. Mình chỉ nhanh mấy chỗ quan trọng nhé, chưa tới 1 phút.'],
    ['#me', 'Nhập tên một lần', 'Gõ họ tên và lớp ở đây để thầy nhận được kết quả mỗi lần bạn nộp bài.'],
    ['.mlinks a[href$="nen.html"]', 'Mới học? Bắt đầu ở đây', 'Mục Nền tảng giải thích cách thi, mẹo từng kỹ năng và ngữ pháp cơ bản bằng tiếng Việt, có bài tập nhỏ.'],
    ['#plan', 'Đếm ngược ngày thi', 'Nhập ngày thi, web sẽ đếm ngược và gợi ý hôm nay nên học gì.'],
    ['#books', 'Chọn bộ đề', 'Mỗi bộ Cambridge có 4 test đủ Listening, Reading, Writing và Speaking.'],
    ['.mset', 'Cỡ chữ và giao diện tối', 'Chữ nhỏ quá? Bấm vào đây để phóng to, bật giao diện tối hoặc xem lại hướng dẫn này.'],
    ['.mfb', 'Thấy lỗi thì báo thầy', 'Đáp án sai, audio không chạy, trang bị lỗi... bấm vào đây gửi cho thầy nhé.']
  ];
  function vis(el) { if (!el) return false; var r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; }
  function tour(force) {
    var TK = 'mt.tour.' + SITE;
    if (!force && (J(TK, 0) || location.href.split(/[?#]/)[0].replace(/index\.html$/, '') !== ROOT || navigator.webdriver)) return;
    S(TK, 1);
    if (!TOUR.length) return;
    var steps = TOUR.filter(function (t) { return !t[0] || vis(document.querySelector(t[0])); }), i = 0;
    var ov = document.createElement('div'); ov.className = 'mtour'; ov.innerHTML = '<div class="mt-hole"></div><div class="mt-tip" role="dialog" aria-live="polite"></div>';
    document.body.appendChild(ov);
    var hole = ov.firstChild, tip = ov.lastChild;
    function end() { ov.remove(); removeEventListener('resize', place); }
    function place() {
      var st = steps[i], el = st[0] && document.querySelector(st[0]);
      if (!el) { hole.style.cssText = 'left:50%;top:40%;width:0;height:0'; tip.style.cssText = 'left:50%;top:40%;transform:translate(-50%,-50%)'; return; }
      var r = el.getBoundingClientRect(), pad = 6;
      hole.style.cssText = 'left:' + (r.left - pad) + 'px;top:' + (r.top - pad) + 'px;width:' + (r.width + pad * 2) + 'px;height:' + (r.height + pad * 2) + 'px';
      var tw = Math.min(320, innerWidth - 24), th = tip.offsetHeight || 150, below = r.bottom + 14 + th < innerHeight;
      var left = Math.max(12, Math.min(innerWidth - tw - 12, r.left + r.width / 2 - tw / 2));
      tip.style.cssText = 'width:' + tw + 'px;left:' + left + 'px;top:' + (below ? r.bottom + 14 : Math.max(12, r.top - th - 14)) + 'px';
    }
    function show() {
      var st = steps[i], el = st[0] && document.querySelector(st[0]);
      tip.innerHTML = '<small>' + (i + 1) + ' / ' + steps.length + '</small><b>' + esc(st[1]) + '</b><p>' + esc(st[2]) + '</p><div class="mt-row"><button type="button" class="mt-skip">Bỏ qua</button><button type="button" class="mt-next">' + (i === steps.length - 1 ? 'Bắt đầu học' : 'Tiếp') + '</button></div>';
      tip.querySelector('.mt-skip').onclick = end;
      tip.querySelector('.mt-next').onclick = function () { i++; if (i >= steps.length) end(); else show(); };
      if (el && getComputedStyle(el).position !== 'fixed' && !el.closest('.mnav,.mfloat')) { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); setTimeout(place, 380); }
      place(); tip.querySelector('.mt-next').focus({ preventScroll: true });
    }
    addEventListener('resize', place); show();
  }
  window.MTOUR = tour;

  // ================= kế hoạch ôn thi + đếm ngược (trang chủ) =================
  window.MPLAN = function (el) {
    if (!el) return;
    var EK = 'mt.exam.' + SITE, ex = J(EK, null), s = stats(), T = SITE === 'toeic';
    function save(v) { S(EK, v); window.MPLAN(el); }
    if (!ex || !ex.date || el.getAttribute('data-edit') === '1') {
      el.removeAttribute('data-edit');
      var opts = T ? [400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900] : [5, 5.5, 6, 6.5, 7, 7.5, 8];
      var tg = ex && ex.target || (T ? 600 : 6.5);
      el.innerHTML = '<div class="mplan setup"><div class="mp-h">' + icon('cal') + '<div><b>Bạn thi khi nào?</b><small>Nhập ngày thi để web đếm ngược và gợi ý mỗi ngày nên học gì.</small></div></div>' +
        '<div class="mp-f"><label>Ngày thi<input type="date" id="mpD" value="' + esc(ex && ex.date || '') + '" min="' + dkey(new Date()) + '"></label><label>Mục tiêu<select id="mpT">' +
        opts.map(function (o) { return '<option' + (o == tg ? ' selected' : '') + '>' + o + '</option>'; }).join('') + '</select></label><button type="button" id="mpS">Lưu</button>' + (ex && ex.date ? '<button type="button" class="ghost" id="mpX">Huỷ</button>' : '') + '</div></div>';
      el.querySelector('#mpS').onclick = function () { var d = el.querySelector('#mpD').value; if (!d) { el.querySelector('#mpD').focus(); return; } save({ date: d, target: +el.querySelector('#mpT').value }); };
      var x = el.querySelector('#mpX'); if (x) x.onclick = function () { window.MPLAN(el); };
      return;
    }
    var p = ex.date.split('-'), dd = new Date(+p[0], +p[1] - 1, +p[2]), now = new Date(); now.setHours(0, 0, 0, 0);
    var left = Math.round((dd - now) / 864e5), tasks = [], phase, tip, nL = (window.MNEN_COUNT && window.MNEN_COUNT[SITE]) || (T ? 27 : 13);
    if (left < 0) phase = ['Đã qua ngày thi', 'Hy vọng bạn thi tốt! Bấm "Đổi" để đặt ngày thi tiếp theo.'];
    else if (left > 60) phase = ['Giai đoạn xây nền', 'Mỗi ngày 1 bài Kiến thức nền' + (T ? ' và 1 đề mini' : '') + ', mỗi tuần luyện vài Part.'];
    else if (left > 21) phase = ['Giai đoạn luyện kỹ năng', 'Tập trung Part yếu nhất, mỗi tuần 1 bài thi thử đủ giờ.'];
    else phase = ['Giai đoạn nước rút', '2–3 bài thi thử mỗi tuần, xem kỹ lại câu sai và từ mới.'];
    var wk = Date.now() - 7 * 864e5;
    // phần yếu nhất
    var weak = null; Object.keys(s.partAcc || {}).forEach(function (k) { var a = s.partAcc[k]; if (a[1] >= 5) { var r = a[0] / a[1]; if (!weak || r < weak[1]) weak = [k, r]; } });
    if (T) {
      tasks.push(['flame', 'Đề mini hôm nay (10 phút)', 'mini.html', s.miniToday]);
      if (s.nen < nL || s.nenToday) tasks.push(['book', 'Học 1 bài Kiến thức nền' + (s.nen ? ' (' + s.nen + '/' + nL + ')' : ''), 'nen.html', s.nenToday > 0]);
      var tn = 1, mn = 99; for (var t = 1; t <= 10; t++) { var c = s.tests[t] || 0; if (c < mn) { mn = c; tn = t; } }
      if (weak) tasks.push(['target', 'Luyện Part ' + weak[0] + ' (đang đúng ' + Math.round(weak[1] * 100) + '%)', 'test.html?t=' + tn + '&m=p' + weak[0], false]);
      else tasks.push(['headphones', 'Làm thử Part 1 và Part 2 của Test ' + tn, 'test.html?t=' + tn + '&m=p1', false]);
      if (left >= 0 && left <= 60 && s.lastFull < wk) tasks.push(['test', 'Thi thử Full test có giờ (tuần này chưa làm)', 'test.html?t=' + tn + '&m=full', false]);
    } else {
      if (s.nen < nL || s.nenToday) tasks.push(['book', 'Học 1 bài Kiến thức nền' + (s.nen ? ' (' + s.nen + '/' + nL + ')' : ''), 'nen.html', s.nenToday > 0]);
      var nb = 21, nt = 1; outer: for (var bi = BOOKS.length - 1; bi >= 0; bi--) for (var ti = 1; ti <= 4; ti++) if (!s.done[BOOKS[bi] + '-' + ti]) { nb = BOOKS[bi]; nt = ti; break outer; }
      if (weak) tasks.push(['target', 'Luyện ' + (weak[0][0] === 'L' ? 'Listening Part ' : 'Reading Passage ') + weak[0].slice(1) + ' (đang đúng ' + Math.round(weak[1] * 100) + '%)', 'c' + nb + '/test-' + nt + '.html?part=' + weak[0], false]);
      else tasks.push(['headphones', 'Làm Listening Part 1 của Cam ' + nb + ' Test ' + nt, 'c' + nb + '/test-' + nt + '.html?part=L1', false]);
      tasks.push(['pen', 'Viết 1 bài Writing (tuần này ' + (s.lastWs >= wk ? 'đã viết' : 'chưa viết') + ')', 'ws.html?b=c' + nb + '&t=' + nt + '&v=w' + (left > 30 ? 1 : 2), s.lastWs >= wk]);
      if (left >= 0 && left <= 60 && s.lastFull < wk) tasks.push(['test', 'Thi thử đủ Listening + Reading (tuần này chưa làm)', 'c' + nb + '/test-' + nt + '.html', false]);
    }
    var best = T ? s.best : Math.max(s.bestL, s.bestR), pct = best ? Math.min(100, Math.round(best / ex.target * 100)) : 0;
    el.innerHTML = '<div class="mplan"><div class="mp-top"><div class="mp-cd"><b>' + (left < 0 ? '✓' : left) + '</b><small>' + (left < 0 ? 'đã thi' : left === 0 ? 'hôm nay thi!' : 'ngày nữa') + '</small></div>' +
      '<div class="mp-i"><small>Thi ngày ' + p[2] + '/' + p[1] + '/' + p[0] + ' · mục tiêu <b>' + ex.target + '</b><button type="button" id="mpE">Đổi</button></small><b>' + phase[0] + '</b><span>' + phase[1] + '</span>' +
      '<div class="mp-bar" title="Điểm cao nhất so với mục tiêu"><i style="width:' + pct + '%"></i></div><small>' + (best ? 'Cao nhất: ' + best + ' / ' + ex.target : 'Chưa có điểm ' + (T ? 'Full test' : 'band') + ' để so với mục tiêu') + '</small></div></div>' +
      (left >= 0 ? '<div class="mp-todo"><h4>Hôm nay nên làm</h4>' + tasks.map(function (t) { return '<a href="' + ROOT + t[2] + '" class="' + (t[3] ? 'done' : '') + '"><span class="mp-ck">' + icon(t[3] ? 'check' : t[0]) + '</span><span>' + esc(t[1]) + '</span>' + icon('arrow', 'mp-go') + '</a>'; }).join('') + '</div>' : '') + '</div>';
    el.querySelector('#mpE').onclick = function () { el.setAttribute('data-edit', '1'); window.MPLAN(el); };
  };


  // ================= linh vật bé Mint (lá bạc hà) =================
  function mascot(mood, cls) {
    mood = mood || 'happy';
    var up = mood === 'think', ey = up ? 76 : 80;
    var eye = function (x) { return '<ellipse cx="' + x + '" cy="' + ey + '" rx="5" ry="6.5" fill="#3a2410"/><circle cx="' + (x + 1.8) + '" cy="' + (ey - 2.5) + '" r="1.9" fill="#fff"/>'; };
    var mouth = mood === 'cheer' ? '<path d="M50 92 Q60 107 70 92 Z" fill="#7a2f2a"/><path d="M54 96 Q60 101 66 96" fill="#e8837a"/>' :
      mood === 'think' ? '<path d="M55 96 h9" stroke="#3a2410" stroke-width="2.6" stroke-linecap="round"/>' :
      mood === 'oops' ? '<path d="M52 97 Q60 91 68 97" stroke="#3a2410" stroke-width="2.6" fill="none" stroke-linecap="round"/>' :
      '<path d="M51 92 Q60 102 69 92" stroke="#3a2410" stroke-width="2.8" fill="none" stroke-linecap="round"/>';
    var A = 'stroke="#e08a1e" stroke-width="5" fill="none" stroke-linecap="round"';
    var arms = mood === 'cheer' ? '<path d="M20 96 Q10 84 9 70" ' + A + '/><path d="M101 96 Q111 84 112 70" ' + A + '/>' +
      '<path d="M8 50l2 5 5 2-5 2-2 5-2-5-5-2 5-2z M110 44l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6z" fill="#7fd6a4"/>' :
      mood === 'think' ? '<path d="M100 104 Q107 98 99 90" ' + A + '/><text x="104" y="52" font-family="Fraunces,Georgia,serif" font-size="22" font-weight="600" fill="#2f9a63">?</text>' :
      mood === 'oops' ? '<path d="M88 60 q4 7 0 10 q-4 -3 0 -10z" fill="#8fd0f0"/><path d="M20 102 Q12 108 11 116" ' + A + '/><path d="M101 102 Q109 108 110 116" ' + A + '/>' :
      '<path d="M20 102 Q11 106 9 114" ' + A + '/><path d="M101 98 Q111 92 113 82" ' + A + '/>';
    return '<svg class="mmint ' + (cls || '') + '" viewBox="0 0 120 140" aria-hidden="true"><defs>' +
      '<radialGradient id="mgo" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#ffe27a"/><stop offset=".55" stop-color="#ffbf3c"/><stop offset="1" stop-color="#f08a24"/></radialGradient>' +
      '<linearGradient id="mlf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9be8b8"/><stop offset="1" stop-color="#2f9a63"/></linearGradient></defs>' + arms +
      '<path d="M62 34 C 96 31 110 64 103 96 C 97 126 67 137 44 129 C 19 121 11 93 17 68 C 23 46 40 35 62 34 Z" fill="url(#mgo)" stroke="#d97a16" stroke-width="2.5"/>' +
      '<ellipse cx="86" cy="52" rx="12" ry="8" fill="#ff7a4a" opacity=".28" transform="rotate(30 86 52)"/><path d="M34 58 Q30 70 31 80" stroke="#fff6cf" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".7"/>' +
      '<path d="M62 35 Q62 28 65 22" stroke="#7a5320" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
      '<path d="M65 23 C 74 8 93 7 100 13 C 92 24 78 29 65 23 Z" fill="url(#mlf)" stroke="#2f8f5f" stroke-width="2"/><path d="M68 22 Q82 16 95 13" stroke="#e9fbf0" stroke-width="1.6" fill="none" opacity=".8"/>' +
      '<path d="M63 25 C 53 12 39 12 34 18 C 42 27 54 30 63 25 Z" fill="url(#mlf)" stroke="#2f8f5f" stroke-width="2"/><path d="M60 24 Q49 19 38 18" stroke="#e9fbf0" stroke-width="1.4" fill="none" opacity=".8"/>' +
      eye(48) + eye(72) + '<ellipse cx="38" cy="93" rx="6.5" ry="4" fill="#ff6f61" opacity=".4"/><ellipse cx="82" cy="93" rx="6.5" ry="4" fill="#ff6f61" opacity=".4"/>' + mouth + '</svg>';
  }
  window.MMINT = mascot;
  function buddy(text, mood, cls) { return '<div class="mbuddy ' + (cls || '') + '">' + mascot(mood) + '<div class="mb-bub">' + text + '</div></div>'; }
  window.MBUDDY = buddy;

  // ================= hoạ tiết sóng seigaiha + con dấu =================
  function seigaiha(paper, ink, a) {
    var arcs = function (cx, cy) { return '<path d="M' + (cx - 20) + ' ' + cy + 'a20 20 0 0 1 40 0z" fill="' + paper + '"/><path d="M' + (cx - 20) + ' ' + cy + 'a20 20 0 0 1 40 0M' + (cx - 14) + ' ' + cy + 'a14 14 0 0 1 28 0M' + (cx - 8) + ' ' + cy + 'a8 8 0 0 1 16 0" fill="none" stroke="' + ink + '" stroke-opacity="' + a + '" stroke-width="1.3"/>'; };
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="20" viewBox="0 0 40 20">' + arcs(0, 10) + arcs(40, 10) + arcs(20, 20) + arcs(0, 30) + arcs(40, 30) + '</svg>';
    return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
  }
  var st4 = document.createElement('style');
  st4.textContent =
    'html{background:var(--paper,#faf8f4)!important}body{background:transparent!important;position:relative}' +
    '.mdeco{position:absolute;left:0;right:0;top:0;height:460px;z-index:-1;pointer-events:none;background-image:' + seigaiha('#faf8f4', '#a8691a', '.22') + ';background-size:56px 28px;-webkit-mask-image:linear-gradient(#000,rgba(0,0,0,.35) 45%,transparent);mask-image:linear-gradient(#000,rgba(0,0,0,.35) 45%,transparent);opacity:.75}' +
    'html[data-theme=dark] .mdeco{background-image:' + seigaiha('#14161a', '#d39a4a', '.20') + ';opacity:.6}' +
    '.mseal{display:inline-flex;align-items:center;justify-content:center;writing-mode:vertical-rl;text-orientation:upright;font:700 10px/1 "Hiragino Mincho ProN","Noto Serif JP","Yu Mincho",serif;letter-spacing:.05em;color:#fff;background:#c4473a;border-radius:5px;padding:5px 3px;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.55),inset 0 0 0 3px #c4473a;transform:rotate(-6deg);margin-left:10px;vertical-align:middle;flex:none}' +
    'html[data-theme=dark] .mseal{background:#b8483c;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.4),inset 0 0 0 3px #b8483c}' +
    '.mmint{width:64px;height:auto;flex:none;overflow:visible}' +
    '@media (prefers-reduced-motion:no-preference){.mbuddy .mmint{animation:mbob 3.2s ease-in-out infinite;transform-origin:50% 95%}@keyframes mbob{0%,100%{transform:rotate(-3deg) translateY(0)}50%{transform:rotate(3deg) translateY(-3px)}}' +
    '.mbuddy:hover .mmint{animation:mjump .5s ease}@keyframes mjump{40%{transform:translateY(-10px) rotate(-6deg)}}}' +
    '.mbuddy{display:flex;align-items:flex-end;gap:10px;margin:16px 0 0}' +
    '.mb-bub{position:relative;background:var(--card,#fff);border:1px solid #e6dcc8;border-radius:16px 16px 16px 4px;padding:10px 14px;font-size:14.5px;line-height:1.45;color:var(--ink,#1e232b);box-shadow:0 6px 18px rgba(107,68,16,.08);max-width:440px;margin-bottom:22px}' +
    '.mb-bub b{color:#2f8f5f}html[data-theme=dark] .mb-bub{background:#1c1f25;border-color:#373b44}html[data-theme=dark] .mb-bub b{color:#6fd39d}' +
    '@media (prefers-reduced-motion:no-preference){.mb-bub{animation:mbub .5s .25s cubic-bezier(.2,.9,.3,1.3) both}@keyframes mbub{from{opacity:0;transform:scale(.85) translateY(6px);transform-origin:0 100%}}}' +
    // chuyển trang mượt
    '@view-transition{navigation:auto}::view-transition-old(root),::view-transition-new(root){animation-duration:.28s}.mnav{view-transition-name:mnav}' +
    '@media (prefers-reduced-motion:reduce){@view-transition{navigation:none}}';
  document.head.appendChild(st4);
  var deco = document.createElement('div'); deco.className = 'mdeco'; deco.setAttribute('aria-hidden', 'true'); document.body.insertBefore(deco, document.body.firstChild);
  function seal() { var s = document.createElement('span'); s.className = 'mseal'; s.setAttribute('lang', 'ja'); s.setAttribute('aria-hidden', 'true'); s.textContent = 'ミント'; return s; }
  [].forEach.call(document.querySelectorAll('.hello .kicker, .top > .kicker'), function (k) { k.appendChild(seal()); });

  // ================= số chạy + thanh, vòng tiến độ chạy dần =================
  function anim(root) {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    root = root || document;
    [].forEach.call(root.querySelectorAll('.stat b, .mp-cd b, .rp-total b'), function (el) {
      if (el.children.length || el.dataset.cnt) return; var t = el.textContent.trim(); if (!/^\d{1,4}$/.test(t) || t === '0') return;
      var n = +t, t0 = performance.now(), d = Math.min(1400, 500 + n * 2); el.dataset.cnt = 1;
      (function f(now) { var k = Math.min(1, (now - t0) / d), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(n * e); if (k < 1) requestAnimationFrame(f); else el.textContent = t; })(t0);
    });
    [].forEach.call(root.querySelectorAll('.ring svg circle:last-child, .pring svg circle:last-child'), function (c) {
      var da = c.getAttribute('stroke-dasharray'); if (!da || c.dataset.an) return; c.dataset.an = 1;
      c.style.transition = 'none'; c.setAttribute('stroke-dasharray', '0 999');
      requestAnimationFrame(function () { requestAnimationFrame(function () { c.style.transition = 'stroke-dasharray 1.2s cubic-bezier(.2,.7,.2,1)'; c.setAttribute('stroke-dasharray', da); }); });
    });
    [].forEach.call(root.querySelectorAll('.mp-bar i, .lopbar .prog i, .rp-parts s, .skbar s, .fc-bar i'), function (b) {
      var w = b.style.width; if (!w || b.dataset.an) return; b.dataset.an = 1;
      b.style.transition = 'none'; b.style.width = '0';
      requestAnimationFrame(function () { requestAnimationFrame(function () { b.style.transition = 'width 1.1s cubic-bezier(.2,.7,.2,1)'; b.style.width = w; }); });
    });
  }
  window.MANIM = anim;
  setTimeout(function () { anim(); }, 60);

  // ================= bé Mint trên trang chủ =================
  setTimeout(function () {
    var hero = document.querySelector('.hello'), cta = hero && hero.querySelector('.cta');
    if (hero && cta && !hero.querySelector('.mbuddy') && SITE !== 'summary') {
      var s = stats(), nm = ''; try { nm = localStorage.getItem('cam20.name') || ''; } catch (e) {}
      var first = nm ? nm.trim().split(/\s+/).pop() : '';
      var tips = SITE === 'toeic' ? ['Mẹo: Part 2 hay có bẫy <b>từ phát âm giống</b> câu hỏi. Nghe thấy lặp từ thì cẩn thận nha!', 'Mẹo: Part 5 nhìn đáp án trước, nếu <b>cùng gốc từ</b> thì là câu từ loại, làm nhanh lắm!', 'Mẹo: Part 7 đọc <b>câu hỏi trước</b> rồi mới tìm trong bài, đỡ mất giờ hơn nhiều.', 'Mẹo: nghe lại câu sai ở tốc độ <b>0.75x</b> rồi chép chính tả, nhớ lâu cực!']
        : ['Mẹo: Listening luôn đọc trước câu hỏi và <b>đoán loại từ</b> cần điền nha.', 'Mẹo: phân biệt <b>FALSE</b> (trái ngược) và <b>NOT GIVEN</b> (không nhắc tới) là ăn điểm Reading đó!', 'Mẹo: Writing Task 1 nhớ viết <b>overview</b>, thiếu là khó qua band 6 lắm.', 'Mẹo: Speaking Part 1 trả lời <b>2–3 câu</b>: ý chính + lý do + ví dụ.'];
      var txt;
      if (!nm) txt = 'Chào bạn! Mình là <b>Xoài Bạc Hà</b> 🥭🌿 Nhập tên ở khung bên cạnh để thầy nhận được kết quả nhé.';
      else if (s.streak >= 2) txt = '<b>' + s.streak + ' ngày liên tục</b> rồi đó ' + first + '! Hôm nay học tiếp để giữ chuỗi nha 🔥';
      else if (SITE === 'toeic' && s.miniToday) txt = 'Đề mini hôm nay xong rồi, giỏi quá! Làm thêm một Part nữa không ' + first + '?';
      else if (s.subs + s.nenAll === 0) txt = 'Chào ' + first + '! Mới bắt đầu thì học một bài <b>Kiến thức nền</b> trước nha, chỉ 10 phút thôi.';
      else txt = tips[new Date().getDate() % tips.length];
      cta.insertAdjacentHTML('beforebegin', buddy(txt, nm ? 'happy' : 'cheer'));
    }
    var sh = document.querySelector('.hero');
    if (SITE === 'summary' && sh && !sh.querySelector('.mbuddy')) sh.insertAdjacentHTML('beforeend', buddy('Đọc tóm tắt <b>trước buổi học</b> để nắm ý chính, học xong thì ôn bảng từ vựng bằng flashcard nha!', 'happy'));
  }, 30);

  // ================= ảnh chia sẻ dạng story =================
  window.MSHARE = function (o) {
    var W = 1080, H = 1920, cv = document.createElement('canvas'); cv.width = W; cv.height = H; var c = cv.getContext('2d');
    var SER = '"Fraunces", Georgia, serif', SANS = '"IBM Plex Sans", Arial, sans-serif', JP = '"Hiragino Sans","Noto Sans JP","Noto Sans CJK JP","Yu Gothic",sans-serif';
    function T(t, x, y, f, col, al) { c.font = f; c.fillStyle = col; c.textAlign = al || 'left'; c.fillText(t, x, y); }
    function rr(x, y, w, h, r, col, st) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); if (col) { c.fillStyle = col; c.fill(); } if (st) { c.strokeStyle = st; c.lineWidth = 2; c.stroke(); } }
    // nền + sóng
    c.fillStyle = '#faf8f4'; c.fillRect(0, 0, W, H);
    for (var row = 0; row < 26; row++) { var y = row * 30, a = Math.max(0, .26 - row * .011); if (a <= 0) break;
      for (var x = (row % 2) * 40 - 40; x < W + 80; x += 80) { c.fillStyle = '#faf8f4'; c.beginPath(); c.arc(x, y + 30, 40, Math.PI, 0); c.fill(); c.strokeStyle = 'rgba(168,105,26,' + a + ')'; c.lineWidth = 2.2; [40, 28, 16].forEach(function (r) { c.beginPath(); c.arc(x, y + 30, r, Math.PI, 0); c.stroke(); }); } }
    var g = c.createLinearGradient(0, 300, 0, 820); g.addColorStop(0, 'rgba(250,248,244,0)'); g.addColorStop(1, 'rgba(250,248,244,1)'); c.fillStyle = g; c.fillRect(0, 300, W, 520);
    // đầu trang
    rr(80, 90, 100, 100, 24, '#a8691a'); c.fillStyle = '#8a5512'; c.fillRect(80, 100, 12, 80); T('M', 136, 166, '600 62px ' + SER, '#fff', 'center');
    T('Minto English', 210, 138, '600 52px ' + SER, '#1e232b'); T('ミント英語', 213, 180, '500 26px ' + JP, '#9a8f7d');
    c.save(); c.translate(940, 140); c.rotate(-0.1); rr(-38, -62, 76, 124, 10, '#c4473a'); c.strokeStyle = 'rgba(255,255,255,.6)'; c.lineWidth = 3; c.strokeRect(-30, -54, 60, 108);
    ['ミ', 'ン', 'ト'].forEach(function (ch, i) { T(ch, 0, -22 + i * 34, '700 30px ' + JP, '#fff', 'center'); }); c.restore();
    // thẻ chính (chiều cao theo nội dung)
    var tiles = o.tiles || [], bars = o.bars || [], parts = o.parts || [], cols = 2;
    var yT = 1000, yB = yT + (tiles.length ? 170 : 0), yP = yB + bars.length * 130 + (bars.length ? 10 : 0), endY = yP + Math.ceil(parts.length / cols) * 64 + 20;
    var cardB = Math.max(endY + 40, 1180);
    c.shadowColor = 'rgba(107,68,16,.12)'; c.shadowBlur = 40; c.shadowOffsetY = 12; rr(70, 270, W - 140, cardB - 270, 44, '#ffffff'); c.shadowColor = 'transparent';
    T(o.kicker || 'PHIẾU KẾT QUẢ', W / 2, 350, '700 26px ' + SANS, '#a8691a', 'center');
    T(o.name || 'Học viên', W / 2, 420, '600 54px ' + SER, '#1e232b', 'center');
    T(o.line || '', W / 2, 468, '500 28px ' + SANS, '#666e7a', 'center');
    var cx = W / 2, cy = 700, R = 190, pc = Math.max(0, Math.min(1, o.pct || 0));
    c.lineCap = 'round'; c.lineWidth = 34; c.strokeStyle = '#f2ece0'; c.beginPath(); c.arc(cx, cy, R, Math.PI * .75, Math.PI * 2.25); c.stroke();
    var gg = c.createLinearGradient(cx - R, cy, cx + R, cy); gg.addColorStop(0, '#f2c879'); gg.addColorStop(1, '#a8691a'); c.strokeStyle = gg;
    c.beginPath(); c.arc(cx, cy, R, Math.PI * .75, Math.PI * (.75 + 1.5 * Math.max(.01, pc))); c.stroke();
    T(o.bigLabel || '', cx, cy - 76, '700 24px ' + SANS, '#a8691a', 'center');
    T(String(o.big), cx, cy + 42, '600 150px ' + SER, '#6b4410', 'center');
    T(o.bigOf || '', cx, cy + 98, '500 32px ' + SANS, '#666e7a', 'center');
    if (o.sub) T(o.sub, cx, cy + 236, '600 30px ' + SANS, '#1f8f6c', 'center');
    if (tiles.length) { var tw = (W - 280 - 20 * (tiles.length - 1)) / tiles.length;
      tiles.forEach(function (t, i) { var x = 140 + i * (tw + 20); rr(x, yT, tw, 130, 22, '#faf6ee'); T(t.k, x + tw / 2, yT + 46, '600 24px ' + SANS, '#8a8f98', 'center'); T(String(t.v), x + tw / 2, yT + 100, '600 42px ' + SER, '#6b4410', 'center'); }); }
    var yy = yB + 36;
    bars.forEach(function (b) { T(b.label, 140, yy, '700 32px ' + SANS, '#1e232b'); T(b.txt, W - 140, yy, '700 32px ' + SANS, '#6b4410', 'right');
      rr(140, yy + 22, W - 280, 22, 11, '#f2ece0'); var gw = Math.max(22, (W - 280) * Math.max(0, Math.min(1, b.pct))); var g2 = c.createLinearGradient(140, 0, 140 + gw, 0); g2.addColorStop(0, '#e9b55b'); g2.addColorStop(1, '#a8691a'); rr(140, yy + 22, gw, 22, 11, g2);
      if (b.tag) T(b.tag, 140, yy + 84, '600 26px ' + SANS, '#1f8f6c'); yy += 130; });
    var cw = (W - 280 - 40) / cols, py = yP + 40;
    parts.forEach(function (p, i) { var col = i % cols, rowi = Math.floor(i / cols), x = 140 + col * (cw + 40), y = py + rowi * 64;
      T(p.label, x, y, '600 26px ' + SANS, '#1e232b'); T(p.txt, x + cw, y, '700 24px ' + SANS, '#666e7a', 'right');
      rr(x, y + 14, cw, 12, 6, '#f2ece0'); rr(x, y + 14, Math.max(12, cw * p.pct), 12, 6, p.pct >= .8 ? '#1f8f6c' : p.pct >= .6 ? '#d9a63c' : '#c14636'); });
    T(o.foot || 'Điểm ước tính từ bài luyện tập, không phải điểm thi chính thức.', W / 2, H - 120, '500 24px ' + SANS, '#9aa0a8', 'center');
    T(o.url || 'mangomint1805.github.io', W / 2, H - 76, '600 26px ' + SANS, '#a8691a', 'center');
    var my = Math.min(cardB + 60, H - 420);
    var img = new Image();
    img.onload = function () {
      c.drawImage(img, 90, my, 210, 245);
      c.font = '500 32px ' + SANS; var lines = [], words = (o.msg || 'Cố lên nha!').split(' '), cur = '';
      words.forEach(function (w) { var t = cur ? cur + ' ' + w : w; if (c.measureText(t).width > 600) { lines.push(cur); cur = w; } else cur = t; }); lines.push(cur);
      var bh = 50 + lines.length * 44, by = my + 100; rr(330, by - bh / 2, 670, bh, 30, '#ffffff', '#ecd3a6');
      c.fillStyle = '#ffffff'; c.beginPath(); c.moveTo(334, by + 20); c.lineTo(300, by + 60); c.lineTo(360, by + 36); c.fill();
      lines.forEach(function (l, i) { T(l, 365, by - bh / 2 + 58 + i * 44, '500 32px ' + SANS, '#1e232b'); });
      done();
    };
    img.onerror = done;
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(mascot(o.mood || 'cheer').replace('<svg class="mmint ', '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="280" class="'));
    function done() {
      cv.toBlob(function (blob) {
        var name = (o.file || 'minto-english') + '.png';
        try { var f = new File([blob], name, { type: 'image/png' }); if (navigator.canShare && navigator.canShare({ files: [f] }) && /Android|iPhone|iPad/i.test(navigator.userAgent)) { navigator.share({ files: [f], title: 'Minto English' }).catch(function () {}); return; } } catch (e) {}
        var a = document.createElement('a'); a.download = name; a.href = URL.createObjectURL(blob); document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
        mtoast('check', 'Đã lưu ảnh', 'Mở thư viện ảnh để đăng story khoe bạn bè nha!');
      }, 'image/png');
    }
  };

  // ================= CSS cho các phần trên =================
  var st3 = document.createElement('style');
  st3.textContent =
    'html[data-fs] body>:not(.mnav):not(.mfloat):not(.fbk):not(.mtour):not(.mtoast):not(.mpop):not(.mconf){zoom:var(--fs)}' +
    '.mconf{position:fixed;inset:0;pointer-events:none;z-index:120}' +
    '.mtoast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:110;display:flex;gap:12px;align-items:center;background:#1e232b;color:#fff;border-radius:16px;padding:12px 18px 12px 12px;box-shadow:0 14px 40px rgba(0,0,0,.28);text-decoration:none;max-width:min(420px,calc(100vw - 24px));font:14px/1.4 "IBM Plex Sans",sans-serif;animation:mtin .45s cubic-bezier(.2,.9,.3,1.3)}' +
    'body.has-nav .mtoast{bottom:86px}@media (min-width:761px){body.has-nav .mtoast{bottom:24px}}' +
    '.mtoast.out{opacity:0;transform:translate(-50%,16px);transition:.3s}.mtoast b{display:block;font-size:15px}.mtoast small{color:#c9cdd4;font-size:13px}' +
    '.mt-i{width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#f2c879,#a8691a);display:flex;align-items:center;justify-content:center;flex:none;color:#fff}.mt-i .ic{width:22px;height:22px}' +
    '@keyframes mtin{from{opacity:0;transform:translate(-50%,30px) scale(.9)}}' +
    '.mbadges{display:grid;grid-template-columns:repeat(auto-fill,minmax(132px,1fr));gap:10px}' +
    '.mbadge{display:flex;flex-direction:column;align-items:center;text-align:center;gap:4px;padding:14px 8px 12px;border:1px dashed #d8d1c2;border-radius:14px;background:#fbfaf7;color:#8a909a}' +
    '.mbadge .mb-i{width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#eeebe4;color:#a6abb3;margin-bottom:2px}.mbadge .mb-i .ic{width:23px;height:23px}' +
    '.mbadge b{font:600 13.5px/1.25 "IBM Plex Sans",sans-serif;color:#5d636d}.mbadge small{font-size:11.5px;line-height:1.3}' +
    '.mbadge.on{border:1px solid #ecd3a6;background:#fffaf0;color:#8a5a1c}.mbadge.on b{color:#1e232b}.mbadge.on .mb-i{background:linear-gradient(135deg,#f6d38c,#b97a22);color:#fff;box-shadow:0 4px 12px rgba(168,105,26,.3)}' +
    'html[data-theme=dark] .mbadge{background:#1c1f25;border-color:#3a3f48;color:#8b919b}html[data-theme=dark] .mbadge b{color:#a8aeb8}html[data-theme=dark] .mbadge .mb-i{background:#2a2e36;color:#6d737d}' +
    'html[data-theme=dark] .mbadge.on{background:#2a2216;border-color:#5a4422;color:#e6b876}html[data-theme=dark] .mbadge.on b{color:#f3ede3}' +
    '@media (prefers-reduced-motion:no-preference){.mbadge.on .mb-i{animation:mbpop .6s cubic-bezier(.2,.9,.3,1.4) both}}@keyframes mbpop{from{transform:scale(.4)}}' +
    '.mset{font:700 15px/1 Fraunces,Georgia,serif!important;letter-spacing:-.02em}' +
    '.mpop{position:fixed;z-index:95;width:250px;background:#fff;color:#1e232b;border:1px solid #e6e0d3;border-radius:14px;box-shadow:0 16px 40px rgba(0,0,0,.18);padding:12px;font:14px/1.4 "IBM Plex Sans",sans-serif;animation:fbkup .2s ease}' +
    '.mp-row{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:6px 2px}.mp-row>span{font-weight:600}' +
    '.mp-fs{display:flex;align-items:center;gap:6px}.mp-fs b{min-width:44px;text-align:center;font-size:13px}.mp-fs button{width:38px;height:34px;border-radius:9px;border:1px solid #ddd7c9;background:#faf8f4;color:#6b4410;font:700 14px/1 "IBM Plex Sans",sans-serif;cursor:pointer}.mp-fs button:disabled{opacity:.35;cursor:default}' +
    '.mp-sw{width:46px;height:26px;border-radius:999px;border:0;background:#d8d2c5;position:relative;cursor:pointer;transition:background .2s}.mp-sw i{position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.25)}.mp-sw[aria-checked=true]{background:#a8691a}.mp-sw[aria-checked=true] i{transform:translateX(20px)}' +
    '.mp-tour{margin-top:6px;width:100%;display:flex;align-items:center;justify-content:center;gap:7px;border:1px solid #ddd7c9;background:#faf8f4;color:#6b4410;border-radius:10px;padding:9px;font:600 13.5px/1 "IBM Plex Sans",sans-serif;cursor:pointer}' +
    'html[data-theme=dark] .mpop{background:#1d2026;color:#e8e4dc;border-color:#373b44}html[data-theme=dark] :is(.mp-fs button,.mp-tour){background:#262a31;border-color:#3a3f48;color:#f0c787}html[data-theme=dark] .mp-sw:not([aria-checked=true]){background:#3a3f48}' +
    '.mtour{position:fixed;inset:0;z-index:100}.mt-hole{position:fixed;border-radius:12px;box-shadow:0 0 0 9999px rgba(12,14,18,.62);transition:all .35s cubic-bezier(.2,.7,.2,1);pointer-events:none;outline:2px solid #f2c879}' +
    '.mt-tip{position:fixed;background:#fff;color:#1e232b;border-radius:16px;padding:16px 16px 12px;box-shadow:0 18px 50px rgba(0,0,0,.35);font:14.5px/1.5 "IBM Plex Sans",sans-serif;transition:top .35s,left .35s;max-width:calc(100vw - 24px)}' +
    '.mt-tip small{color:#a8691a;font-weight:700;font-size:12px;letter-spacing:.05em}.mt-tip b{display:block;font:600 19px/1.25 Fraunces,Georgia,serif;margin:2px 0 4px}.mt-tip p{margin:0 0 10px;color:#4b5260}' +
    '.mt-row{display:flex;justify-content:space-between;gap:8px}.mt-row button{font:700 14px/1 "IBM Plex Sans",sans-serif;border-radius:10px;padding:10px 16px;cursor:pointer;border:0}.mt-skip{background:transparent;color:#7a808a}.mt-next{background:#a8691a;color:#fff}' +
    'html[data-theme=dark] .mt-tip{background:#1d2026;color:#e8e4dc}html[data-theme=dark] .mt-tip p{color:#b3b9c2}' +
    '.mplan{background:#fff;border:1px solid #e6e0d3;border-radius:16px;padding:16px 18px}' +
    '.mp-h{display:flex;gap:12px;align-items:flex-start}.mp-h>.ic{width:30px;height:30px;color:#a8691a;flex:none;margin-top:2px}.mp-h b{display:block;font:600 19px/1.25 Fraunces,Georgia,serif}.mp-h small{color:#666e7a;font-size:13.5px}' +
    '.mp-f{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-end;margin-top:12px}.mp-f label{display:flex;flex-direction:column;font-size:12.5px;font-weight:600;color:#666e7a;gap:3px}.mp-f input,.mp-f select{font:inherit;font-size:15px;padding:8px 10px;border:1px solid #ddd7c9;border-radius:9px;background:#faf8f4;color:#1e232b}' +
    '.mp-f button,.mp-i button{font:700 14px/1 "IBM Plex Sans",sans-serif;border:0;background:#a8691a;color:#fff;border-radius:9px;padding:11px 16px;cursor:pointer}.mp-f button.ghost{background:transparent;color:#6b4410;border:1px solid #ddd7c9}' +
    '.mp-top{display:flex;gap:16px;align-items:center}.mp-cd{flex:none;width:92px;height:92px;border-radius:20px;background:linear-gradient(150deg,#f6d38c,#a8691a);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 8px 20px rgba(168,105,26,.28)}' +
    '.mp-cd b{font:600 38px/1 Fraunces,Georgia,serif}.mp-cd small{font-size:12px;font-weight:600;opacity:.95}' +
    '.mp-i{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}.mp-i>small{color:#666e7a;font-size:12.5px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}.mp-i>b{font:600 18px/1.25 Fraunces,Georgia,serif}.mp-i>span{font-size:13.5px;color:#4b5260}' +
    '.mp-i button{padding:4px 9px;font-size:12px;background:#f2e2c4;color:#6b4410}' +
    '.mp-bar{height:7px;border-radius:9px;background:#efeae0;overflow:hidden;margin:6px 0 2px}.mp-bar i{display:block;height:100%;background:linear-gradient(90deg,#e9b55b,#a8691a);border-radius:9px;transition:width 1s}' +
    '.mp-todo{margin-top:14px;border-top:1px solid #efeae0;padding-top:10px}.mp-todo h4{margin:0 0 6px;font:700 12px/1 "IBM Plex Sans",sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#a8691a}' +
    '.mp-todo a{display:flex;gap:10px;align-items:center;padding:9px 8px;border-radius:10px;color:#1e232b;text-decoration:none;font-size:14.5px;font-weight:500}.mp-todo a:hover{background:#faf5ea}' +
    '.mp-ck{width:30px;height:30px;border-radius:50%;border:1.5px solid #e1d6c1;display:flex;align-items:center;justify-content:center;color:#a8691a;flex:none}.mp-ck .ic{width:16px;height:16px}' +
    '.mp-todo a.done{color:#7d838c}.mp-todo a.done>span:nth-child(2){text-decoration:line-through}.mp-todo a.done .mp-ck{background:#1f8f6c;border-color:#1f8f6c;color:#fff}.mp-go{margin-left:auto;color:#c2b9a7}' +
    'html[data-theme=dark] .mplan{background:#1c1f25;border-color:#373b44}html[data-theme=dark] :is(.mp-h small,.mp-i>small,.mp-f label){color:#9aa1ad}html[data-theme=dark] .mp-i>span{color:#c0c5cd}' +
    'html[data-theme=dark] .mp-todo{border-color:#2c3038}html[data-theme=dark] .mp-todo a{color:#e8e4dc}html[data-theme=dark] .mp-todo a:hover{background:#242830}html[data-theme=dark] .mp-ck{border-color:#4a4f58;color:#f0c787}html[data-theme=dark] .mp-bar{background:#2c3038}html[data-theme=dark] .mp-i button{background:#3b2d1b;color:#f0c787}' +
    '@media (max-width:520px){.mp-cd{width:76px;height:76px;border-radius:18px}.mp-cd b{font-size:31px}.mp-top{gap:12px}}';
  document.head.appendChild(st3);

  // ================= nút: trong thanh menu (nếu có) + nút nổi =================
  var fl = document.createElement('div'); fl.className = 'mfloat';
  var hasNav = !!document.querySelector('.mnav');
  fl.innerHTML = '<button type="button" class="mbtn mfb" aria-label="Góp ý, báo lỗi" title="Góp ý / báo lỗi">' + icon('msg') + '</button>' + (hasNav ? '' : '<button type="button" class="mbtn mset" aria-label="Cỡ chữ và giao diện" title="Cỡ chữ, giao diện tối">Aa</button>');
  document.body.appendChild(fl);
  var navIn = document.querySelector('.mnav .in');
  if (navIn) { var tl = document.createElement('div'); tl.className = 'mtool'; tl.innerHTML = '<button type="button" class="mbtn mset" aria-label="Cỡ chữ và giao diện" title="Cỡ chữ, giao diện tối">Aa</button><button type="button" class="mbtn mtheme"></button>'; navIn.appendChild(tl); }
  [].forEach.call(document.querySelectorAll('.mtheme'), function (b) { b.onclick = toggleTheme; });
  [].forEach.call(document.querySelectorAll('.mset'), function (b) { b.onclick = function () { settings(b); }; });
  fl.querySelector('.mfb').onclick = feedback;
  applyTheme(theme(), false);
  // hiệu ứng xuất hiện
  if (window.IntersectionObserver && !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('fx-on'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -30px 0px' });
    window.MFX = function (root) { [].forEach.call((root || document).querySelectorAll('.test,.tool,.stat,.panel,.mode,.box,.card,.report,.big,.stop,.book,.cat,.prog-card,.mplan,.lesson'), function (el, i) { if (el.classList.contains('fx-in')) return; el.classList.add('fx-in'); el.style.transitionDelay = Math.min(i % 12, 8) * 40 + 'ms'; io.observe(el); }); };
    setTimeout(function () { window.MFX(); }, 30);
  } else window.MFX = function () {};
  setTimeout(check, 400);
  if (document.readyState === 'complete') setTimeout(tour, 900); else addEventListener('load', function () { setTimeout(tour, 900); });
})();

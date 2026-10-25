/* Minto English — thanh menu chung, bộ icon nét, logo. Dùng: <body data-nav="home|mini|stats|dict|cards"> */
/* File này giống hệt nhau ở 4 web: toeic/assets, cam/shared, summary-new/docs/assets, summary-old/docs/assets. Sửa ở một nơi thì chép sang 3 nơi còn lại. */
(function () {
  'use strict';
  var ME = document.currentScript && document.currentScript.src || '', ROOT = ME.replace(/(assets|shared)\/ui\.js.*$/, '');
  var SITE = (document.currentScript && document.currentScript.getAttribute('data-site')) || (/\/shared\/ui\.js/.test(ME) ? 'ielts' : 'toeic');
  var TOEIC_URL = 'https://mangomint1805.github.io/toeic/';
  var EXAM = /\/(test\.html|test-\d+\.html|ws\.html)$/.test(location.pathname); window.MEXAM = EXAM;
  if (EXAM) document.documentElement.setAttribute('data-exam', '');
  // đếm hoạt động học mỗi ngày (cho hồ sơ + bảng xếp hạng tuần): mt.act = { 'YYYY-MM-DD': số lần }
  (function () {
    if (Storage.prototype._mtAct) return; Storage.prototype._mtAct = 1;
    var RE = /^(ets26\.hist|ets26\.mini\.days|cam\d+\.hist|cam\.ws\.hist|mt\.nen\.|vocab\.cards|mt\.marks\.|mt\.place\.|mt\.game\.)/, last = {}, set0 = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) {
      set0.call(this, k, v);
      try {
        if (this !== window.localStorage || !RE.test(k)) return;
        var now = Date.now(); if (last[k] && now - last[k] < 20000) return; last[k] = now;
        var d = new Date(), key = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
        var a = JSON.parse(window.localStorage.getItem('mt.act') || '{}'); a[key] = (a[key] || 0) + 1;
        var ks = Object.keys(a).sort(); while (ks.length > 400) delete a[ks.shift()];
        set0.call(window.localStorage, 'mt.act', JSON.stringify(a));
      } catch (e) {}
    };
  })();
  // gắn email Google (nếu đã đăng nhập) vào mọi kết quả gửi về Google Sheet của thầy
  if (window.fetch && !window.fetch._mt) {
    var _f = window.fetch;
    window.fetch = function (u, o) {
      try {
        if (o && o.method === 'POST' && typeof o.body === 'string' && /script\.google\.com\/macros/.test(String(u))) {
          var acc = JSON.parse(localStorage.getItem('mt.acc') || 'null'), b = JSON.parse(o.body);
          if (acc && acc.email && b && typeof b === 'object' && !b.email) { b.email = acc.email; o = Object.assign({}, o, { body: JSON.stringify(b) }); }
        }
      } catch (e) {}
      return _f.call(this, u, o);
    };
    window.fetch._mt = 1;
  }
  if (SITE === 'ielts' && /\/(c|v)\d+\/test-\d+\.html$/.test(location.pathname)) { var mks = document.createElement('script'); mks.src = ROOT + 'shared/marks-ielts.js?v=1'; document.head.appendChild(mks); }
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
    game: '<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 11v3M5.5 12.5h3M15 12h.01M18 13.5h.01"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    quote: '<path d="M7 7h4v4c0 3-1.5 5-4 6M15 7h4v4c0 3-1.5 5-4 6"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5v.01"/>'
  };
  function icon(n, cls) { return '<svg class="ic ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[n] || '') + '</svg>'; }
  window.MICON = icon;
  var LOGO = '<svg class="mlogo" viewBox="0 0 100 100" aria-hidden="true"><defs><filter id="lgf" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="2.4"/></filter></defs><circle class="lg-bg" cx="50" cy="50" r="48" fill="#a8691a"/><g filter="url(#lgf)" transform="translate(10 12) scale(.82)"><path d="M50 26 C 76 24 88 50 83 76 C 78 98 54 106 36 100 C 16 94 10 72 15 52 C 20 34 33 27 50 26 Z" fill="#ffc94a" transform="translate(2 2)"/><path d="M50 26 C 76 24 88 50 83 76 C 78 98 54 106 36 100 C 16 94 10 72 15 52 C 20 34 33 27 50 26 Z" fill="none" stroke="#2b2118" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M50 27 q0 -6 3 -11" fill="none" stroke="#2b2118" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M53 17 C 60 6 75 6 80 10 C 74 19 63 22 53 17 Z" fill="#8fe0ad" stroke="#2b2118" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.6"/><path d="M38 60 l1 5 M60 60 l1 5" stroke="#2b2118" stroke-width="5" stroke-linecap="round"/><path d="M41 72 q9 8 17 -1" fill="none" stroke="#2b2118" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M28 70 l3 -3 M31 71 l3 -3 M66 71 l3 -3 M69 70 l3 -3" stroke="#ff7b6b" stroke-width="2.4" stroke-linecap="round"/></g></svg>';
  window.MLOGO = LOGO;
  var css = document.createElement('style');
  css.textContent =
    '.ic{width:1.15em;height:1.15em;vertical-align:-.2em;flex:none}' +
    '.mnav{position:sticky;top:0;z-index:40;background:rgba(255,255,255,.94);backdrop-filter:blur(8px);border-bottom:1px solid #e6e0d3}' +
    '.mnav .in{max-width:1080px;margin:0 auto;padding:10px 20px;display:flex;align-items:center;gap:18px}' +
    '.mbrand{display:flex;align-items:center;gap:10px;text-decoration:none;color:#1e232b}' +
    '.mlogo{width:36px;height:36px;flex:none;border-radius:50%;overflow:visible}' +
    '.mbrand b{font:600 19px/1 Fraunces,Georgia,serif;letter-spacing:-.01em}' +
    '.mbrand b{display:flex;align-items:center;gap:7px}.mbrand b em{font:700 9.5px/1 "IBM Plex Sans",sans-serif;letter-spacing:.1em;color:#a8691a;background:#f6ead3;border-radius:5px;padding:3px 5px 2px;font-style:normal}' +
    '.mbrand small{display:block;font:500 11px/1 "Hiragino Sans","Hiragino Kaku Gothic ProN","Noto Sans JP","Yu Gothic",Meiryo,sans-serif;letter-spacing:.3em;color:#9a8f7d;margin-top:5px}' +
    'html[data-theme=dark] .mbrand b em{background:#3b2d1b;color:#f0c787}html[data-theme=dark] .mbrand small{color:#8d8678}' +
    '.mlinks{display:flex;gap:4px;margin-left:auto}' +
    '.mlinks a{display:flex;align-items:center;gap:7px;font:600 14px/1 "IBM Plex Sans",sans-serif;color:#4b5260;text-decoration:none;padding:9px 12px;border-radius:9px}' +
    '.mlinks a:hover{background:#f6f1e7;color:#6b4410}' +
    '.mlinks a[aria-current=page]{background:#f2e2c4;color:#6b4410}' +
    'header.mnav{padding:0;margin:0}' + // trang nào tự đặt kiểu cho thẻ header thì thanh menu không bị đẩy xuống
    '.mlinks a:focus-visible,.mbrand:focus-visible{outline:3px solid #f2c879;outline-offset:2px}' +
    'body.has-nav .back{display:none}.mbrand,.mlinks a{white-space:nowrap}' +
    '@media (min-width:761px) and (max-width:1100px){.mnav .in{gap:10px;padding:10px 14px}.mlinks{gap:0}.mlinks a{padding:9px 8px;font-size:13.5px}.mlinks a .ic{display:none}}' +
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
    '.mtool{display:flex;gap:6px;align-items:center;margin-left:8px}.mlinks~.mtool{margin-left:6px}@media (max-width:760px){.mtool,.mlinks~.mtool{margin-left:auto}}' +
    '.mbtn{width:38px;height:38px;border-radius:10px;border:1px solid #e6e0d3;background:#fff;color:#6b4410;display:flex;align-items:center;justify-content:center;cursor:pointer}' +
    'html[data-theme=dark] .mbtn{background:#1c1f25;border-color:#373b44;color:#f0c787}.mbtn .ic{width:19px;height:19px}' +
    '.mfloat{position:fixed;right:14px;bottom:16px;z-index:58;display:flex;flex-direction:column;gap:8px}' +
    'body.has-nav .mfloat{bottom:84px}@media (min-width:761px){body.has-nav .mfloat{bottom:16px}}' +
    '.mfloat .mbtn{box-shadow:0 4px 12px rgba(0,0,0,.12);width:38px;height:38px;border-radius:50%;opacity:.72;transition:opacity .2s}.mfloat .mbtn:hover,.mfloat .mbtn:focus-visible{opacity:1}' +
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
  function theme() { return 'light'; }
  try { if (localStorage.getItem('mt.theme') === 'dark') localStorage.setItem('mt.theme', 'light'); } catch (e) {}
  function applyTheme(t, anim) {
    var r = document.documentElement;
    if (anim) { r.classList.add('theme-anim'); setTimeout(function () { r.classList.remove('theme-anim'); }, 450); }
    r.setAttribute('data-theme', t); r.style.colorScheme = t;
    var m = document.querySelector('meta[name=color-scheme]'); if (m) m.setAttribute('content', t === 'dark' ? 'dark' : 'light only');
    [].forEach.call(document.querySelectorAll('.mtheme'), function (b) { b.innerHTML = icon(t === 'dark' ? 'sun' : 'moon'); b.setAttribute('aria-label', t === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'); b.title = b.getAttribute('aria-label'); });
  }
  function toggleTheme() { if (J('mt.skin', '') === 'scifi') { S('mt.skin', ''); document.documentElement.removeAttribute('data-skin'); try { localStorage.setItem('mt.theme', 'dark'); } catch (e) {} } var t = (document.documentElement.getAttribute('data-theme') || theme()) === 'dark' ? 'light' : 'dark'; try { localStorage.setItem('mt.theme', t); } catch (e) {} applyTheme(t, true); }
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
      w.querySelector('.fbk-card').innerHTML = '<h3>Cảm ơn bạn!</h3>' + buddy('Thầy đã nhận được góp ý rồi nha, sẽ sửa sớm thôi. Cảm ơn bạn nhiều!', 'love') + '<div class="fbk-row"><button type="button" class="ok">Đóng</button></div>';
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
    var cards = J('vocab.cards', {}); o.cards = Array.isArray(cards) ? cards.length : Object.keys(cards || {}).length; o.cardsDue = Array.isArray(cards) ? 0 : Object.keys(cards || {}).filter(function (k) { var c = cards[k]; return c && (!c.due || c.due <= o.today) && !((c.box != null ? c.box : (c.lv || 0) * 2) >= 6); }).length;
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
      BOOKS.concat(['v7']).forEach(function (b) {
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
    if (EXAM) return;
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
  function mtoast(ic, title, sub, href, fn) {
    if (EXAM && ic !== 'check') return;
    toastQ.push([ic, title, sub, href, fn]); if (toastOn) return;
    (function next() {
      var a = toastQ.shift(); if (!a) { toastOn = false; return; } toastOn = true;
      var d = document.createElement(a[3] ? 'a' : 'div'); d.className = 'mtoast'; if (a[3]) d.href = a[3]; d.setAttribute('role', 'status');
      d.innerHTML = '<span class="mt-i">' + icon(a[0]) + '</span><span><b>' + esc(a[1]) + '</b><small>' + esc(a[2]) + '</small></span>';
      if (a[4]) { d.style.cursor = 'pointer'; d.onclick = a[4]; }
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

        '<div class="mp-row"><span>Phong cách<small class="mp-skn">' + SKINS.filter(function (k) { return k[0] === skin(); })[0][1] + '</small></span><div class="mp-skins">' + SKINS.map(function (k) { return '<button type="button" data-k="' + k[0] + '" title="' + k[1] + '" aria-label="Phong cách ' + k[1] + '" aria-pressed="' + (skin() === k[0]) + '" style="background:' + k[2] + '"></button>'; }).join('') + '</div></div>' +
        '<button type="button" class="mp-tour">' + icon('help') + ' Xem lại hướng dẫn</button>' +
        '<div class="mp-bk"><button type="button" class="mp-tour" id="mpBk">💾 Sao lưu</button><button type="button" class="mp-tour" id="mpRs">📂 Khôi phục</button></div>' +
        '<div class="mp-acc" id="mpAcc"></div>';
      [].forEach.call(p.querySelectorAll('.mp-skins button'), function (b) { b.onclick = function () { S('mt.skin', b.getAttribute('data-k')); applySkin(skin()); draw(); }; });
      [].forEach.call(p.querySelectorAll('.mp-fs button'), function (b) { b.onclick = function () { var i = FS.indexOf(fs()) + (+b.getAttribute('data-d')); i = Math.max(0, Math.min(FS.length - 1, i)); S('mt.fs', FS[i]); applyFs(FS[i]); draw(); }; });
      p.querySelector('.mp-tour').onclick = function () { p.remove(); tour(true); };
      p.querySelector('#mpBk').onclick = function () { backup(); };
      p.querySelector('#mpRs').onclick = function () { p.remove(); restore(); };
      accLoad(function () { var a = p.querySelector('#mpAcc'); if (a && window.MACC) window.MACC.render(a); });
    }
    draw(); document.body.appendChild(p); p.addEventListener('click', function (e) { e.stopPropagation(); });
    var r = btn.getBoundingClientRect(), pw = 250;
    p.style.top = (r.top < innerHeight / 2 ? r.bottom + 8 : Math.max(8, r.top - p.offsetHeight - 8)) + 'px';
    p.style.left = Math.max(8, Math.min(innerWidth - pw - 8, r.right - pw)) + 'px';
    setTimeout(function () { document.addEventListener('click', function off(e) { if (!p.contains(e.target) && !btn.contains(e.target)) { p.remove(); document.removeEventListener('click', off); } }); }, 0);
  }


  // ================= đăng nhập Google (acc.js, tải khi cần) =================
  var ACC_SRC = ME.replace(/ui\.js.*$/, 'acc.js?v=7'), accQ = null;
  function accLoad(cb) {
    if (window.MACC) return cb && cb();
    if (!accQ) { accQ = []; var sc = document.createElement('script'); sc.src = ACC_SRC; sc.onload = function () { accQ.splice(0).forEach(function (f) { f(); }); }; document.head.appendChild(sc); }
    if (cb) accQ.push(cb);
  }
  try { if (localStorage.getItem('mt.acc')) accLoad(); } catch (e) {}

  // ================= sao lưu / khôi phục tiến độ =================
  var BKRE = /^(ets26\.|cam\d+\.|cam\.|cam20\.|mt\.|vocab\.|summaryNew\.|summaryOld\.)/;
  function backup() {
    var o = { app: 'minto-english', v: 1, at: new Date().toISOString(), data: {} };
    try { for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (BKRE.test(k)) o.data[k] = localStorage.getItem(k); } } catch (e) {}
    var nm = ''; try { nm = (localStorage.getItem('cam20.name') || '').trim().split(/\s+/).pop() || ''; } catch (e) {}
    var blob = new Blob([JSON.stringify(o)], { type: 'application/json' }), a = document.createElement('a');
    a.download = 'minto-sao-luu' + (nm ? '-' + nm.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd') : '') + '-' + dkey(new Date()) + '.json';
    a.href = URL.createObjectURL(blob); document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    mtoast('check', 'Đã tải file sao lưu', 'Gửi file này sang máy khác (Zalo, Drive…) rồi bấm Khôi phục ở máy đó.');
  }
  function restore() {
    var inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.json,application/json';
    inp.onchange = function () {
      var f = inp.files && inp.files[0]; if (!f) return; var rd = new FileReader();
      rd.onload = function () {
        try {
          var o = JSON.parse(rd.result); if (!o || o.app !== 'minto-english' || !o.data) throw 0;
          var n = Object.keys(o.data).length;
          if (!confirm('Khôi phục ' + n + ' mục tiến độ từ file sao lưu ngày ' + String(o.at || '').slice(0, 10) + '? Tiến độ hiện tại trên máy này sẽ được thay bằng bản trong file.')) return;
          Object.keys(o.data).forEach(function (k) { if (BKRE.test(k)) try { localStorage.setItem(k, o.data[k]); } catch (e) {} });
          alert('Đã khôi phục xong! Trang sẽ tải lại.'); location.reload();
        } catch (e) { alert('File này không phải file sao lưu của Minto English.'); }
      };
      rd.readAsText(f);
    };
    inp.click();
  }
  // ================= hướng dẫn lần đầu =================
  var TOUR = SITE === 'summary' ? [] : SITE === 'toeic' ? [
    [null, 'Chào bạn 👋', 'Đây là web luyện TOEIC của lớp thầy Minto. Mình chỉ nhanh mấy chỗ quan trọng nhé, chưa tới 1 phút.'],
    ['#me', 'Nhập tên một lần', 'Gõ họ tên và lớp ở đây để thầy nhận được kết quả mỗi lần bạn nộp bài.'],
    ['.mlinks a[href$="nen.html"]', 'Mới học? Bắt đầu ở đây', 'Mục Nền tảng ôn ngữ pháp, từ vựng và mẹo nghe cơ bản, giải thích tiếng Việt, có bài tập nhỏ.'],
    ['.mlinks a[href$="mini.html"]', 'Đề mini 10 phút', 'Mỗi ngày làm một đề mini để giữ chuỗi ngày học và mở huy hiệu.'],
    ['#plan', 'Đếm ngược ngày thi', 'Nhập ngày thi, web sẽ đếm ngược và gợi ý hôm nay nên học gì.'],
    ['#tests', 'Bộ 10 đề thi thử', 'Làm cả đề có giờ như thi thật, hoặc luyện riêng từng Part.'],
    ['.mset', 'Cỡ chữ và phong cách', 'Chữ nhỏ quá? Bấm vào đây để phóng to, đổi phong cách giao diện hoặc xem lại hướng dẫn này.'],
    ['.mfb', 'Thấy lỗi thì báo thầy', 'Đáp án sai, audio không chạy, trang bị lỗi... bấm vào đây gửi cho thầy nhé.']
  ] : [
    [null, 'Chào bạn 👋', 'Đây là web luyện IELTS Cambridge của lớp thầy Minto. Mình chỉ nhanh mấy chỗ quan trọng nhé, chưa tới 1 phút.'],
    ['#me', 'Nhập tên một lần', 'Gõ họ tên và lớp ở đây để thầy nhận được kết quả mỗi lần bạn nộp bài.'],
    ['.mlinks a[href$="nen.html"]', 'Mới học? Bắt đầu ở đây', 'Mục Nền tảng giải thích cách thi, mẹo từng kỹ năng và ngữ pháp cơ bản bằng tiếng Việt, có bài tập nhỏ.'],
    ['#plan', 'Đếm ngược ngày thi', 'Nhập ngày thi, web sẽ đếm ngược và gợi ý hôm nay nên học gì.'],
    ['#books', 'Chọn bộ đề', 'Mỗi bộ Cambridge có 4 test đủ Listening, Reading, Writing và Speaking.'],
    ['.mset', 'Cỡ chữ và phong cách', 'Chữ nhỏ quá? Bấm vào đây để phóng to, đổi phong cách giao diện hoặc xem lại hướng dẫn này.'],
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


  // ================= bắt đầu trong 3 bước (bạn mới) =================
  window.MSTART = function (el) {
    if (!el) return false; var s = stats(); if (s.subs > 0 || (s.mini || 0) > 0) return false;
    var nm = ''; try { nm = localStorage.getItem('cam20.name') || ''; } catch (e) {}
    var T = SITE === 'toeic', steps = [
      ['user', 'Nhập họ tên', 'Để thầy nhận được kết quả', '#me', !!nm],
      ['compass', 'Kiểm tra xếp lớp 15 phút', T ? 'Biết trình độ và nên học gì trước' : 'Biết band ước tính và nên học gì trước', 'xep-lop.html', (function () { try { return !!localStorage.getItem('mt.place.' + (T ? 'toeic' : 'ielts')); } catch (e) { return false; } })()],
      T ? ['flame', 'Làm đề mini 10 phút', '20 câu, chấm ngay', 'mini.html', false] : ['headphones', 'Làm Listening Part 1', 'Cam 21 · Test 1, 10 câu', 'c21/test-1.html?part=L1', false]
    ], n = steps.filter(function (x) { return x[4]; }).length;
    el.className = 'mstart';
    el.innerHTML = '<div class="ms-h"><b>Bắt đầu trong 3 bước</b><span>' + n + '/3</span></div>' + steps.map(function (x, i) {
      return '<a class="ms-s' + (x[4] ? ' done' : '') + '" href="' + (x[3][0] === '#' ? x[3] : ROOT + x[3]) + '"><span class="ms-n">' + (x[4] ? icon('check') : i + 1) + '</span><span><b>' + x[1] + '</b><small>' + x[2] + '</small></span>' + icon('arrow', 'ms-go') + '</a>';
    }).join('');
    var a = el.querySelector('a[href="#me"]'); if (a) a.onclick = function (e) { e.preventDefault(); var i = document.getElementById('meName') || document.getElementById('meEd'); if (i) { i.scrollIntoView({ block: 'center' }); if (i.focus) i.focus(); if (i.id === 'meEd') i.click(); } };
    return true;
  };
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
      var tn = 1, mn = 99; for (var t = 1; t <= 20; t++) { var c = s.tests[t] || 0; if (c < mn) { mn = c; tn = t; } }
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
    if (s.cardsDue > 0) tasks.push(['cards', 'Ôn ' + s.cardsDue + ' từ flashcard đến hạn hôm nay', 'flashcards.html', false]);
    var best = T ? s.best : Math.max(s.bestL, s.bestR), pct = best ? Math.min(100, Math.round(best / ex.target * 100)) : 0;
    el.innerHTML = '<div class="mplan"><div class="mp-top"><div class="mp-cd"><b>' + (left < 0 ? '✓' : left) + '</b><small>' + (left < 0 ? 'đã thi' : left === 0 ? 'hôm nay thi!' : 'ngày nữa') + '</small></div>' +
      '<div class="mp-i"><small>Thi ngày ' + p[2] + '/' + p[1] + '/' + p[0] + ' · mục tiêu <b>' + ex.target + '</b><button type="button" id="mpE">Đổi</button></small><b>' + phase[0] + '</b><span>' + phase[1] + '</span>' +
      '<div class="mp-bar" title="Điểm cao nhất so với mục tiêu"><i style="width:' + pct + '%"></i></div><small>' + (best ? 'Cao nhất: ' + best + ' / ' + ex.target : 'Chưa có điểm ' + (T ? 'Full test' : 'band') + ' để so với mục tiêu') + '</small></div></div>' +
      (left >= 0 ? '<div class="mp-todo"><h4>Hôm nay nên làm</h4>' + tasks.map(function (t) { return '<a href="' + ROOT + t[2] + '" class="' + (t[3] ? 'done' : '') + '"><span class="mp-ck">' + icon(t[3] ? 'check' : t[0]) + '</span><span>' + esc(t[1]) + '</span>' + icon('arrow', 'mp-go') + '</a>'; }).join('') + '</div>' : '') + '</div>';
    el.querySelector('#mpE').onclick = function () { el.setAttribute('data-edit', '1'); window.MPLAN(el); };
  };


  // ================= linh vật bé Mint (lá bạc hà) =================
  function mascot(mood, cls, wid) {
    mood = mood || 'happy'; var K = '#2b2118';
    var WI = null; if (wid !== undefined) { for (var wi = 0; wi < ITEMS.length; wi++) if (ITEMS[wi].id === wid) WI = ITEMS[wi]; } else WI = wearItem();
    var L = 'stroke="' + K + '" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"', LF = L.replace('fill="none" ', '');
    var dot = function (x, y) { return '<path d="M' + x + ' ' + (y - 3) + ' l1 6" stroke="' + K + '" stroke-width="5" stroke-linecap="round"/>'; };
    var E = { // mắt
      dots: dot(47, 81) + dot(72, 81), up: dot(47, 77) + dot(72, 77), smile: '<path d="M43 82 q5 -7 10 0 M67 82 q5 -7 10 0" ' + L + '/>',
      wink: dot(47, 81) + '<path d="M67 81 q5 -5 10 0" ' + L + '/>', closed: '<path d="M43 80 q5 5 10 0 M67 80 q5 5 10 0" ' + L + '/>',
      heart: '<path d="M48 86 l-6 -6 a3.5 3.5 0 0 1 6 -4 a3.5 3.5 0 0 1 6 4 z M73 86 l-6 -6 a3.5 3.5 0 0 1 6 -4 a3.5 3.5 0 0 1 6 4 z" fill="#ff5d6c" ' + LF + ' stroke-width="2"/>',
      wow: '<circle cx="48" cy="80" r="4.5" ' + L + ' stroke-width="2.6"/><circle cx="73" cy="80" r="4.5" ' + L + ' stroke-width="2.6"/>' + dot(48, 81).replace('stroke-width="5"', 'stroke-width="3"') + dot(73, 81).replace('stroke-width="5"', 'stroke-width="3"'),
      angry: '<path d="M41 74 l11 4 M80 74 l-11 4" ' + L + '/>' + dot(48, 82) + dot(72, 82),
      cry: '<path d="M43 81 q5 -4 10 0 M67 81 q5 -4 10 0" ' + L + '/><path d="M45 86 q-2 8 1 12 M76 86 q2 8 -1 12" stroke="#7cc8f0" stroke-width="3.4" fill="none" stroke-linecap="round"/>',
      fire: '<path d="M41 75 l11 3 M80 75 l-11 3" ' + L + '/>' + dot(48, 82) + dot(72, 82),
      cool: '<path d="M38 76 h20 q-1 10 -10 10 q-9 0 -10 -10 z M63 76 h20 q-1 10 -10 10 q-9 0 -10 -10 z M58 78 h5" fill="' + K + '" ' + LF + ' stroke-width="2.4"/><path d="M43 79 l4 -2" stroke="#fff" stroke-width="2" stroke-linecap="round"/>'
    };
    var M = { // miệng
      smile: '<path d="M50 92 q10 10 20 -1" ' + L + '/>', open: '<path d="M50 92 q10 14 20 0 z" fill="#ff7b6b" ' + LF + '/>', flat: '<path d="M55 97 q5 -2 10 0" ' + L + '/>',
      sad: '<path d="M51 99 q9 -8 18 0" ' + L + '/>', o: '<ellipse cx="60" cy="96" rx="4.5" ry="5.5" fill="#ff7b6b" ' + LF + ' stroke-width="2.6"/>', pout: '<path d="M54 96 q3 -3 6 0 q3 3 6 0" ' + L + '/>',
      grin: '<path d="M48 91 q12 4 24 0 q-3 10 -12 10 q-9 0 -12 -10 z" fill="#fff" ' + LF + ' stroke-width="2.6"/><path d="M50 94 h20" stroke="' + K + '" stroke-width="1.6"/>',
      tongue: '<path d="M50 92 q10 10 20 -1" ' + L + '/><path d="M58 97 q3 7 7 1" fill="#ff7b6b" ' + LF + ' stroke-width="2.2"/>', zz: '<path d="M56 96 q4 3 8 0" ' + L + '/>'
    };
    var A = { // tay
      wave: '<path d="M20 103 q-8 4 -10 12 M100 99 q9 -6 12 -16" ' + L + '/>', up: '<path d="M20 95 q-8 -12 -9 -24 M100 95 q8 -12 10 -24" ' + L + '/>',
      down: '<path d="M20 103 q-7 6 -8 14 M100 103 q7 6 8 14" ' + L + '/>', chin: '<path d="M20 103 q-8 4 -10 12 M100 104 q7 -6 -1 -14" ' + L + '/>',
      hips: '<path d="M21 100 q-12 -2 -6 10 M99 100 q12 -2 6 10" ' + L + '/>', fist: '<path d="M20 103 q-8 4 -10 12 M100 98 q8 -10 10 -20" ' + L + '/><circle cx="111" cy="75" r="5" fill="#ffc94a" ' + LF + ' stroke-width="2.6"/>'
    };
    var X = { // phụ kiện
      spark: '<path d="M10 50 v10 M5 55 h10 M110 42 v8 M106 46 h8" ' + L + ' stroke-width="2.4"/>',
      q: '<path d="M104 38 q6 -6 11 0 q2 5 -5 8 v4 M110 56 v1" ' + L + ' stroke-width="2.6"/>',
      sweat: '<path d="M88 58 q4 7 0 10 q-4 -3 0 -10z" fill="#9fd8f5" ' + LF + ' stroke-width="2"/>',
      hearts: '<path d="M14 52 l-5 -5 a3 3 0 0 1 5 -3.5 a3 3 0 0 1 5 3.5 z M108 40 l-4 -4 a2.5 2.5 0 0 1 4 -3 a2.5 2.5 0 0 1 4 3 z" fill="#ff5d6c" ' + LF + ' stroke-width="1.8"/>',
      zzz: '<path d="M92 30 h8 l-8 8 h8 M104 16 h6 l-6 6 h6" ' + L + ' stroke-width="2.4"/>',
      vein: '<path d="M86 50 l3 3 M92 48 l-3 5 M84 56 l5 -1" stroke="#e5484d" stroke-width="2.6" stroke-linecap="round"/>',
      hat: '<path d="M44 38 l14 -30 l14 28 z" fill="#7cc8f0" ' + LF + ' stroke-width="2.6"/><path d="M50 26 l14 4 M47 33 l18 3" stroke="#ff5d6c" stroke-width="2.4"/><circle cx="58" cy="7" r="4" fill="#ffc94a" ' + LF + ' stroke-width="2"/>' +
        '<path d="M14 40 l4 6 M106 30 l-3 7 M20 60 l6 -2 M101 52 l6 2" stroke="#ff5d6c" stroke-width="2.6" stroke-linecap="round"/><path d="M10 48 l3 3 M110 40 l-2 3" stroke="#7cc8f0" stroke-width="2.6" stroke-linecap="round"/>',
      band: '<path d="M22 60 q38 -14 76 0" stroke="#e5484d" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M96 58 l12 -6 M96 60 l10 6" stroke="#e5484d" stroke-width="4" stroke-linecap="round"/>',
      flame: '<path d="M106 70 q-8 -8 -2 -18 q2 6 5 6 q-1 -8 6 -14 q-1 8 4 12 q4 8 -3 14 q-4 4 -10 0z" fill="#ff8a3d" ' + LF + ' stroke-width="2.2"/>',
      book: '<path d="M30 112 l28 -6 l0 22 l-28 6 z M58 106 l28 6 l0 22 l-28 -6 z" fill="#fff" ' + LF + ' stroke-width="2.6"/><path d="M36 116 l16 -3 M36 122 l16 -3 M64 113 l16 3 M64 119 l16 3" stroke="#a8691a" stroke-width="1.8" stroke-linecap="round"/>',
      star: '<path d="M106 34 l3 7 7 1 -5 5 1.5 7 -6.5 -3.5 -6.5 3.5 1.5 -7 -5 -5 7 -1 z" fill="#ffc94a" ' + LF + ' stroke-width="2.2"/>',
      note: '<path d="M100 44 v-14 l10 -3 v14 M100 44 a3 3 0 1 1 -1 -1 M110 41 a3 3 0 1 1 -1 -1" ' + L + ' stroke-width="2.4"/>'
    };
    var P = {
      happy: ['dots', 'smile', 'wave', ''], cheer: ['smile', 'open', 'up', 'spark'], think: ['up', 'flat', 'chin', 'q'], oops: ['dots', 'sad', 'down', 'sweat'],
      love: ['heart', 'open', 'up', 'hearts'], wink: ['wink', 'tongue', 'wave', 'star'], sleepy: ['closed', 'zz', 'down', 'zzz'], wow: ['wow', 'o', 'up', 'spark'],
      pout: ['angry', 'pout', 'hips', 'vein'], cry: ['cry', 'sad', 'down', ''], party: ['smile', 'open', 'up', 'hat'], fire: ['fire', 'grin', 'fist', 'band'],
      cool: ['cool', 'smile', 'hips', 'star'], study: ['dots', 'smile', 'down', 'book'], sing: ['closed', 'o', 'wave', 'note']
    }[mood] || ['dots', 'smile', 'wave', ''];
    var extra = P[3] === 'band' ? X.band + X.flame : (X[P[3]] || '');
    var front = { book: 1, sweat: 1 }[P[3]], below = front ? '' : extra, over = front ? extra : (P[3] === 'band' ? X.band : '');
    if (P[3] === 'band') below = X.flame;
    var body = 'M62 34 C 95 30 111 63 104 96 C 98 126 66 138 44 129 C 18 121 10 92 17 67 C 23 45 40 35 62 34 Z';
    return '<svg class="mmint ' + (cls || '') + ' doodle" viewBox="0 0 120 140" aria-hidden="true"><defs><filter id="rough" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter></defs><g filter="url(#rough)">' +
      (WI && WI.b ? WI.b : '') + (P[3] === 'book' ? '' : A[P[2]]) + below +
      '<path d="' + body + '" fill="#ffc94a" transform="translate(3 3)"/>' +
      '<path d="M30 60 q-4 14 -2 26 M36 54 q-3 8 -2 14" stroke="#fff3c4" stroke-width="4" stroke-linecap="round" fill="none"/>' +
      '<path d="M84 104 l10 -10 M80 112 l14 -14 M78 120 l12 -12" stroke="#f0a033" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="' + body + '" ' + L + '/><path d="M62 35 q0 -7 3 -13" ' + L + '/>' +
      (P[3] === 'hat' ? '' : '<path d="M65 23 C 74 8 93 7 100 13 C 92 24 78 29 65 23 Z" fill="#8fe0ad" transform="translate(2 2)"/><path d="M65 23 C 74 8 93 7 100 13 C 92 24 78 29 65 23 Z M69 21 q12 -6 25 -8" ' + L + ' stroke-width="2.8"/>' +
        '<path d="M63 25 C 53 12 39 12 34 18 C 42 27 54 30 63 25 Z" fill="#8fe0ad" transform="translate(2 2)"/><path d="M63 25 C 53 12 39 12 34 18 C 42 27 54 30 63 25 Z M59 23 q-10 -5 -21 -5" ' + L + ' stroke-width="2.8"/>') +
      E[P[0]] + '<path d="M33 92 l4 -4 M37 93 l4 -4 M41 94 l4 -4 M76 94 l4 -4 M80 93 l4 -4 M84 92 l4 -4" stroke="#ff7b6b" stroke-width="2.4" stroke-linecap="round"/>' + M[P[1]] + over +
      (P[3] === 'book' ? '<path d="M24 108 q4 6 8 4 M96 108 q-4 6 -8 4" ' + L + '/>' : '') + (WI && WI.f ? WI.f : '') + '</g></svg>';
  }
  window.MMOODS = ['happy', 'cheer', 'love', 'wink', 'party', 'fire', 'cool', 'study', 'sing', 'wow', 'think', 'sleepy', 'pout', 'oops', 'cry'];
  window.MMINT = mascot;
  function buddy(text, mood, cls) { return '<div class="mbuddy ' + (cls || '') + '">' + mascot(mood) + '<div class="mb-bub">' + text + '</div></div>'; }
  window.MBUDDY = buddy;
  var SAYS = { happy: 'Hì hì 😊', cheer: 'Yeah! Cố lên nào!', love: 'Thương bạn ghê á 💛', wink: 'Bí mật nha 😉', party: 'Quẩy thôi! 🎉', fire: 'Học như chưa từng được học! 🔥', cool: 'Ngầu chưa? 😎', study: 'Đọc thêm một bài nữa nha 📖', sing: 'La la la~ 🎵', wow: 'Ồ wow!', think: 'Hmm… câu này khó nhỉ?', sleepy: 'Buồn ngủ quá… 💤', pout: 'Hứ! Đừng chọc mình nữa!', oops: 'Ui da…', cry: 'Huhu bị chọc hoài 😭' };

  // ================= lời thoại bé Xoài theo phong cách =================
  var PERSONAS = {
    '': { me: 'Xoài Bạc Hà 🥭🌿', greet: 'Chào bạn! Mình là <b>Xoài Bạc Hà</b> 🥭🌿 Nhập tên ở khung bên cạnh để thầy nhận được kết quả nhé.', late: 'Khuya rồi đó {n}… học một xíu thôi rồi đi ngủ nha, ngủ đủ mới nhớ bài 💤', fire: '<b>{s} ngày liên tục</b>! {n} đang cháy quá trời, giữ lửa nha 🔥', streak: '<b>{s} ngày liên tục</b> rồi đó {n}! Hôm nay học tiếp để giữ chuỗi nha', mini: 'Đề mini hôm nay xong rồi, ngầu ghê! Làm thêm một Part nữa không {n}?', newbie: 'Chào {n}! Mới bắt đầu thì học một bài <b>Kiến thức nền</b> trước nha, chỉ 10 phút thôi.', lapsed: 'Hứ, mấy hôm nay {n} bỏ học đúng không? Vào làm đề mini 10 phút đi nè!', tip: 'Mẹo:', summary: 'Đọc tóm tắt <b>trước buổi học</b> để nắm ý chính, học xong thì ôn bảng từ vựng bằng flashcard nha!',
      says: {} },
    idol: { me: 'Xoài idol 🎤', greet: 'Chào fan mới~ ♪ Mình là <b>Xoài idol</b> 🎤 Ghi tên vào bên cạnh để thầy biết bạn đến xem show nha!', late: 'Khuya rồi {n} ơi~ idol cũng phải đi ngủ giữ giọng nè, học xíu rồi ngủ nha ♪', fire: '<b>{s} ngày liên tục</b>! {n} là fan cứng nhất của Xoài đó ✨🎤', streak: '<b>{s} ngày liên tục</b> ♪ {n} giữ nhịp đều như bài hát luôn, hôm nay tiếp tục nha!', mini: 'Màn "luyện thanh" hôm nay xong rồi, xuất sắc! Encore thêm một Part không {n}? 🎶', newbie: 'Chào {n}~ buổi tập đầu tiên thì khởi động bằng một bài <b>Kiến thức nền</b> nha ♪', lapsed: 'Mấy hôm nay {n} vắng mặt ở buổi tập đó nha~ quay lại sân khấu với Xoài đi! 🎤', tip: 'Bí kíp sân khấu:', summary: 'Ôn bài trước buổi học như tập trước khi lên sân khấu nha~ ♪ Học xong nhớ ôn từ vựng bằng flashcard!',
      says: { happy: 'Cảm ơn đã đến xem show~ ♪', cheer: 'Cùng hát nào! ♪♪', love: 'Yêu fan nhất luôn 💖', wink: 'Fan service nè 😉✨', party: 'Concert bắt đầu! 🎉', cool: 'Idol ngầu nhất là ai? Là Xoài! 😎', sing: 'La la la~ nốt cao nè 🎶', wow: 'Ồ, khán giả đông quá!', think: 'Quên lời bài hát rồi… à không, quên từ vựng 😅', sleepy: 'Tập cả ngày mệt quá… 💤', pout: 'Hứ! Không được chọc idol!', oops: 'Lỡ nhịp mất rồi…', cry: 'Huhu fan bắt nạt Xoài 😭' } },
    y2k: { me: 'Xoài thiên thần 👼', greet: 'Hellooo~ chào mừng đến kênh của <b>Xoài thiên thần</b> 👼💕 Gõ tên bên cạnh để thầy biết bạn đã ghé nha!', late: '{n} ơi khuya rồi á~ thiên thần cũng cần ngủ đẹp nè, học xíu rồi off nha 🌙💕', fire: '<b>{s} ngày liên tục</b> 💕 {n} là viewer chăm nhất kênh luôn, đỉnh quá trời!', streak: '<b>{s} ngày liên tục</b>~ {n} đáng yêu ghê, hôm nay mình học tiếp nha ✨', mini: 'Hoàn thành thử thách hôm nay rồi nè, cute quá đi 💕 Làm thêm một Part không {n}?', newbie: 'Hi {n}~ người mới thì xem một bài <b>Kiến thức nền</b> trước nha, chỉ 10 phút thôi 💕', lapsed: 'Hông thấy {n} ghé kênh mấy hôm nay luôn á 🥺 Vào làm đề mini với Xoài đi mà~', tip: 'Tip nhỏ xinh:', summary: 'Đọc tóm tắt trước buổi học nha~ 💕 Học xong thì lật flashcard ôn từ vựng là hết sảy!',
      says: { happy: 'Hihi chào mừng nha~ 💕', cheer: 'Yay yay! ✨', love: 'Thương bạn nhiều lắm á 💖💖', wink: 'Bí mật của thiên thần nè 😉', party: 'Tiệc nhỏ xinh bắt đầu! 🎀', cool: 'Thiên thần cũng biết ngầu nha 😎', sing: 'Lalala~ 🎵💕', wow: 'OMG thật hả!?', think: 'Hmm… để thiên thần nghĩ xíu 💭', sleepy: 'Buồn ngủ ghê… nhưng vẫn cute 💤', pout: 'Hứ! Thiên thần dỗi rồi á 😤', oops: 'Ơ… lỡ tay rồi 🥺', cry: 'Huhu đừng chọc nữa mà 😭💕' } },
    scifi: { me: 'Xoài chiến binh ⚔️', greet: 'Chào mừng Thuyền trưởng lên tàu! Mình là <b>Xoài chiến binh</b> ⚔️ Thuyền trưởng đăng ký tên bên cạnh để thầy nhận báo cáo nhiệm vụ nha.', late: 'Thuyền trưởng {n}, đã quá nửa đêm rồi. Nghỉ ngơi nạp năng lượng, mai mình xuất kích tiếp nha 🌙', fire: '<b>Chuỗi {s} ngày</b>! Thuyền trưởng {n} đang ở phong độ đỉnh cao, cả tàu nể luôn đó! 🔥', streak: '<b>Chuỗi {s} ngày</b> liên tục. Thuyền trưởng {n}, nhiệm vụ hôm nay đang chờ chỉ huy!', mini: 'Nhiệm vụ hằng ngày: <b>hoàn thành</b> ✓ Thuyền trưởng {n} muốn khiêu chiến thêm một Part không?', newbie: 'Thuyền trưởng {n} mới nhận chức, mình huấn luyện cơ bản trước nhé: một bài <b>Kiến thức nền</b>, 10 phút thôi.', lapsed: 'Thuyền trưởng {n} vắng mặt trên tàu mấy hôm rồi đó… Quay lại chỉ huy một đề mini đi mà! ⚔️', tip: 'Báo cáo chiến thuật:', summary: 'Thuyền trưởng ơi, nạp dữ liệu trước trận nha: đọc tóm tắt trước buổi học, sau đó luyện từ vựng bằng flashcard!',
      says: { happy: 'Sẵn sàng nhận lệnh, Thuyền trưởng!', cheer: 'Xuất kích theo lệnh Thuyền trưởng! ⚔️', love: 'Thuyền trưởng là nhất 💛', wink: 'Bí mật quân sự nha Thuyền trưởng 😉', party: 'Nhiệm vụ hoàn thành, Thuyền trưởng! 🎉', fire: 'Năng lượng 100%! 🔥', cool: 'Có Thuyền trưởng chỉ huy thì không gì cản nổi 😎', study: 'Đang phân tích dữ liệu cho Thuyền trưởng… 📖', sing: 'Khúc ca chiến thắng~ 🎵', wow: 'Thuyền trưởng! Phát hiện mục tiêu!', think: 'Đang tính đường đánh…', sleepy: 'Năng lượng thấp… cho mình sạc xíu nha Thuyền trưởng 💤', pout: 'Thuyền trưởng đừng chọc mình nữa!', oops: 'Trúng đòn rồi Thuyền trưởng ơi…', cry: 'Thuyền trưởng bắt nạt mình 😭' } }
  };
  function PERSONA() { return PERSONAS[document.documentElement.getAttribute('data-skin') || ''] || PERSONAS['']; }
  function homeLine(s, nm, first, tips) {
    var P = PERSONA(), hr = new Date().getHours(), f = function (t) { return t.replace(/\{n\}/g, first).replace(/\{s\}/g, s.streak); };
    if (!nm) return [P.greet, 'cheer'];
    if (hr >= 23 || hr < 5) return [f(P.late), 'sleepy'];
    if (s.streak >= 7) return [f(P.fire), 'fire'];
    if (s.streak >= 2) return [f(P.streak), 'cheer'];
    if (SITE === 'toeic' && s.miniToday) return [f(P.mini), 'cool'];
    if (s.subs + s.nenAll === 0) return [f(P.newbie), 'study'];
    if (s.streak === 0 && s.ndays > 0) return [f(P.lapsed), 'pout'];
    return [tips[new Date().getDate() % tips.length].replace(/^Mẹo:/, P.tip), 'think'];
  }
  var taps = 0;
  document.addEventListener('click', function (e) {
    var sv = e.target.closest && e.target.closest('.mbuddy .mmint'); if (!sv) return;
    taps++; var ms = window.MMOODS, m = taps >= 6 ? (taps >= 9 ? 'cry' : 'pout') : ms[Math.floor(Math.random() * 11)];
    if (taps >= 10) taps = 0;
    var wrap = sv.parentNode, bub = wrap.querySelector('.mb-bub'); if (!wrap.dataset.orig && bub) wrap.dataset.orig = bub.innerHTML;
    sv.outerHTML = mascot(m, 'pop'); if (bub) bub.innerHTML = PERSONA().says[m] || SAYS[m] || 'Hì';
    clearTimeout(wrap._t); wrap._t = setTimeout(function () { if (bub && wrap.dataset.orig) bub.innerHTML = wrap.dataset.orig; }, 3500);
  });

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
    '.mdeco2{position:fixed;inset:0;z-index:-2;pointer-events:none;background-image:' + seigaiha('#faf8f4', '#a8691a', '.22') + ';background-size:56px 28px;opacity:.38!important}' +
    '.mseal{display:inline-flex;align-items:center;justify-content:center;writing-mode:vertical-rl;text-orientation:upright;font:700 10px/1 "Hiragino Mincho ProN","Noto Serif JP","Yu Mincho",serif;letter-spacing:.05em;color:#fff;background:#c4473a;border-radius:5px;padding:5px 3px;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.55),inset 0 0 0 3px #c4473a;transform:rotate(-6deg);margin-left:4px;vertical-align:middle;flex:none}' +
    'html[data-theme=dark] .mseal{background:#b8483c;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.4),inset 0 0 0 3px #b8483c}' +
    '.mmint{width:64px;height:auto;flex:none;overflow:visible}' +
    '@media (prefers-reduced-motion:no-preference){.mbuddy .mmint{animation:mbob 3.2s ease-in-out infinite;transform-origin:50% 95%}@keyframes mbob{0%,100%{transform:rotate(-3deg) translateY(0)}50%{transform:rotate(3deg) translateY(-3px)}}' +
    '.mbuddy:hover .mmint{animation:mjump .5s ease}@keyframes mjump{40%{transform:translateY(-10px) rotate(-6deg)}}}' +
    '.mbuddy{display:flex;align-items:flex-end;gap:10px;margin:16px 0 0}.mbuddy .mmint{cursor:pointer}.mb-tap{display:block;font-size:11.5px;color:#9a9fa8;margin-top:2px}' +
    '@media (prefers-reduced-motion:no-preference){.mmint.pop{animation:mpop .45s cubic-bezier(.2,.9,.3,1.5)}@keyframes mpop{0%{transform:scale(.7) rotate(-8deg)}}}' +
    '.mb-bub{position:relative;background:var(--card,#fff);border:1px solid #e6dcc8;border-radius:16px 16px 16px 4px;padding:10px 14px;font-size:14.5px;line-height:1.45;color:var(--ink,#1e232b);box-shadow:0 6px 18px rgba(107,68,16,.08);max-width:440px;margin-bottom:22px}' +
    '.mb-bub b{color:#2f8f5f}html[data-theme=dark] .mb-bub{background:#1c1f25;border-color:#373b44}html[data-theme=dark] .mb-bub b{color:#6fd39d}' +
    '@media (prefers-reduced-motion:no-preference){.mb-bub{animation:mbub .5s .25s cubic-bezier(.2,.9,.3,1.3) both}@keyframes mbub{from{opacity:0;transform:scale(.85) translateY(6px);transform-origin:0 100%}}}' +
    // chuyển trang mượt
    '@view-transition{navigation:auto}::view-transition-old(root),::view-transition-new(root){animation-duration:.28s}.mnav{view-transition-name:mnav}' +
    '@media (prefers-reduced-motion:reduce){@view-transition{navigation:none}}' +
    'html[data-exam] .mdeco,html[data-exam] .mdeco2{display:none}html[data-exam] *{animation:none!important}html[data-exam] .btn:active,html[data-exam] .opt:active{transform:none}';
  document.head.appendChild(st4);
  var deco = document.createElement('div'); deco.className = 'mdeco'; deco.setAttribute('aria-hidden', 'true'); document.body.insertBefore(deco, document.body.firstChild); var deco2 = document.createElement('div'); deco2.className = 'mdeco2'; deco2.setAttribute('aria-hidden', 'true'); document.body.insertBefore(deco2, document.body.firstChild);
  function seal() { var s = document.createElement('span'); s.className = 'mseal'; s.setAttribute('lang', 'ja'); s.setAttribute('aria-hidden', 'true'); s.textContent = 'ミント'; return s; }
  [].forEach.call(document.querySelectorAll('.hello .kicker, .top > .kicker'), function (k) { k.appendChild(seal()); });

  // ================= số chạy + thanh, vòng tiến độ chạy dần =================
  function anim(root) {
    if (EXAM) return;
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
      var hl = homeLine(s, nm, first, tips), txt = hl[0], md = hl[1];
      cta.insertAdjacentHTML('beforebegin', buddy(txt + '<small class="mb-tap">(bấm vào mình thử xem)</small>', md, 'mb-home'));
      window._mhome = function () { var b2 = document.querySelector('.mb-home'); if (!b2) return; var h2 = homeLine(stats(), nm, first, tips); var bub = b2.querySelector('.mb-bub'); bub.innerHTML = h2[0] + '<small class="mb-tap">(bấm vào mình thử xem)</small>'; b2.dataset.orig = bub.innerHTML; var sv = b2.querySelector('.mmint'); if (sv) sv.outerHTML = mascot(h2[1], 'pop'); };
    }
    var sh = document.querySelector('.hero');
    if (SITE === 'summary' && sh && !sh.querySelector('.mbuddy')) sh.insertAdjacentHTML('beforeend', buddy(PERSONA().summary, 'study'));
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
    var lgi = new Image(); lgi.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(LOGO.replace('<svg class="mlogo"', '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" class="mlogo"'));
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
      try { c.drawImage(lgi, 78, 88, 108, 108); } catch (e) {}
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
        try { var f = new File([blob], name, { type: 'image/png' }); if (navigator.canShare && navigator.canShare({ files: [f] }) && /Android|iPhone|iPad/i.test(navigator.userAgent)) { navigator.share({ files: [f], title: 'Minto English' }).catch(function (er) { if (!er || er.name !== 'AbortError') dl(); }); return; } } catch (e) {}
        dl(); return;
        function dl() {
        var a = document.createElement('a'); a.download = name; a.href = URL.createObjectURL(blob); document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
        mtoast('check', 'Đã lưu ảnh', 'Mở thư viện ảnh để đăng story khoe bạn bè nha!');
        }
      }, 'image/png');
    }
  };


  // ================= tủ đồ + gacha cho bé Xoài =================
  var GK = '#2b2118', GL = 'stroke="' + GK + '" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"';
  var ITEMS = [
    // B
    { id: 'kinh', n: 'Kính tròn mọt sách', r: 'B', f: '<circle cx="48" cy="81" r="9" fill="rgba(255,255,255,.25)" ' + GL + '/><circle cx="73" cy="81" r="9" fill="rgba(255,255,255,.25)" ' + GL + '/><path d="M57 80 q3.5 -3 7 0 M39 79 l-7 -3 M82 79 l7 -3" fill="none" ' + GL + '/>' },
    { id: 'no', n: 'Nơ hồng xinh', r: 'B', f: '<path d="M90 46 l-12 -8 l1 15 z M90 46 l12 -9 l-1 16 z" fill="#ff8fc1" ' + GL + '/><circle cx="90" cy="46" r="4" fill="#ff5fa2" ' + GL + '/>' },
    { id: 'khan', n: 'Khăn quàng ấm áp', r: 'B', f: '<path d="M22 104 q38 14 78 0 l2 9 q-41 15 -82 0 z" fill="#e5484d" ' + GL + '/><path d="M74 112 l4 18 l9 -2 l-4 -17" fill="#e5484d" ' + GL + '/><path d="M34 108 v8 M48 111 v8 M62 112 v8" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/>' },
    { id: 'mulen', n: 'Mũ len mùa đông', r: 'B', f: '<path d="M24 56 q36 -46 72 0 z" fill="#5b8def" ' + GL + '/><path d="M22 56 h76 v8 h-76 z" fill="#fff" ' + GL + '/><circle cx="60" cy="16" r="7" fill="#fff" ' + GL + '/><path d="M42 30 l4 22 M60 24 v28 M78 30 l-4 22" stroke="#3a6fd1" stroke-width="2" stroke-linecap="round"/>' },
    { id: 'hoa', n: 'Hoa cài tóc', r: 'B', f: '<g transform="translate(30 50)"><circle cx="0" cy="-7" r="5" fill="#fff" ' + GL + '/><circle cx="7" cy="-1" r="5" fill="#fff" ' + GL + '/><circle cx="4" cy="7" r="5" fill="#fff" ' + GL + '/><circle cx="-5" cy="6" r="5" fill="#fff" ' + GL + '/><circle cx="-7" cy="-2" r="5" fill="#fff" ' + GL + '/><circle cx="0" cy="0" r="4" fill="#ffc94a" ' + GL + '/></g>' },
    // A
    { id: 'tainghe', n: 'Tai nghe luyện nghe', r: 'A', f: '<path d="M18 80 q0 -60 84 0" fill="none" stroke="' + GK + '" stroke-width="5" stroke-linecap="round"/><rect x="9" y="72" width="14" height="22" rx="6" fill="#8b5cf6" ' + GL + '/><rect x="97" y="72" width="14" height="22" rx="6" fill="#8b5cf6" ' + GL + '/>' },
    { id: 'mucap', n: 'Mũ lưỡi trai năng động', r: 'A', f: '<path d="M26 58 q34 -40 68 0 z" fill="#e5484d" ' + GL + '/><path d="M60 58 q24 -6 46 4 q-20 6 -46 2 z" fill="#c43c41" ' + GL + '/><circle cx="60" cy="24" r="3" fill="#fff" ' + GL + '/><path d="M50 44 q10 -6 20 0" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>' },
    { id: 'vuongmien', n: 'Vương miện giấy', r: 'A', f: '<path d="M36 48 l4 -22 l10 12 l10 -18 l10 18 l10 -12 l4 22 z" fill="#ffd54a" ' + GL + '/><circle cx="60" cy="38" r="3.5" fill="#e5484d" ' + GL + '/><circle cx="45" cy="42" r="2.5" fill="#5b8def"/><circle cx="75" cy="42" r="2.5" fill="#5b8def"/>' },
    { id: 'kinhtim', n: 'Kính râm trái tim', r: 'A', f: '<path d="M48 90 l-10 -9 a5.5 5.5 0 0 1 10 -6 a5.5 5.5 0 0 1 10 6 z M73 90 l-10 -9 a5.5 5.5 0 0 1 10 -6 a5.5 5.5 0 0 1 10 6 z" fill="#ff4f8b" ' + GL + '/><path d="M58 80 h5 M38 78 l-7 -2 M83 78 l7 -2" fill="none" ' + GL + '/>' },
    { id: 'balo', n: 'Ba lô đi học', r: 'A', b: '<rect x="80" y="70" width="30" height="40" rx="8" fill="#22b07d" ' + GL + '/><rect x="86" y="88" width="18" height="12" rx="3" fill="#1b8f65" ' + GL + '/>', f: '<path d="M30 66 q6 24 2 50 M92 66 q-4 24 0 50" stroke="#1b8f65" stroke-width="4" fill="none" stroke-linecap="round"/>' },
    // S
    { id: 'thienthan', n: 'Cánh thiên thần', r: 'S', b: '<path d="M22 78 q-26 -24 -14 -46 q8 18 22 24 q-18 -2 -8 22 z M98 78 q26 -24 14 -46 q-8 18 -22 24 q18 -2 8 22 z" fill="#fff" ' + GL + '/><path d="M8 50 q8 6 14 4 M112 50 q-8 6 -14 4" fill="none" stroke="#c9d6ff" stroke-width="2.4" stroke-linecap="round"/>', f: '<ellipse cx="62" cy="10" rx="18" ry="5" fill="none" stroke="#ffd54a" stroke-width="4.5"/><ellipse cx="62" cy="10" rx="18" ry="5" fill="none" stroke="' + GK + '" stroke-width="1.6"/>' },
    { id: 'idol', n: 'Micro idol sân khấu', r: 'S', f: '<path d="M102 94 l10 -24" stroke="' + GK + '" stroke-width="4" stroke-linecap="round"/><circle cx="113" cy="66" r="7" fill="#ff5fa2" ' + GL + '/><path d="M109 63 l8 6 M108 68 l8 -5" stroke="#fff" stroke-width="1.6"/><path d="M84 44 l3 7 7 1 -5 5 1.5 7 -6.5 -3.5 -6.5 3.5 1.5 -7 -5 -5 7 -1 z" fill="#13c2c2" ' + GL + '/><path d="M4 40 l4 -6 M2 54 l6 0 M6 66 l5 4" stroke="#ff5fa2" stroke-width="2.6" stroke-linecap="round"/>' },
    { id: 'phuthuy', n: 'Mũ phù thủy tập sự', r: 'S', f: '<path d="M22 52 q38 10 76 0 q-6 8 -38 10 q-32 -2 -38 -10 z" fill="#5b3fa8" ' + GL + '/><path d="M38 52 q8 -22 22 -48 q4 26 22 48 z" fill="#6d4bc4" ' + GL + '/><path d="M40 46 q20 6 40 0" stroke="#ffd54a" stroke-width="4" fill="none"/><path d="M70 22 l2 4 4 1 -3 3 1 4 -4 -2 -4 2 1 -4 -3 -3 4 -1 z" fill="#ffd54a"/>' },
    // SSS
    { id: 'chienbinh', n: 'Năng lượng bùng nổ', r: 'SSS', b: '<defs><radialGradient id="aura" cx=".5" cy=".55" r=".5"><stop offset=".4" stop-color="#ff2e2e" stop-opacity=".85"/><stop offset=".72" stop-color="#ff5a2e" stop-opacity=".4"/><stop offset="1" stop-color="#ff5a2e" stop-opacity="0"/></radialGradient></defs><ellipse cx="60" cy="82" rx="66" ry="68" fill="url(#aura)"/><circle cx="60" cy="80" r="48" fill="none" stroke="#ff3b3b" stroke-width="3" stroke-dasharray="7 6" opacity=".9"/><path d="M114.0 80.0L124.0 80.0 M112.6 92.0L122.4 94.2 M108.7 103.4L117.7 107.8 M102.2 113.7L110.0 119.9 M93.7 122.2L99.9 130.0 M83.4 128.7L87.8 137.7 M72.0 132.6L74.2 142.4 M60.0 134.0L60.0 144.0 M48.0 132.6L45.8 142.4 M36.6 128.7L32.2 137.7 M26.3 122.2L20.1 130.0 M17.8 113.7L10.0 119.9 M11.3 103.4L2.3 107.8 M7.4 92.0L-2.4 94.2 M6.0 80.0L-4.0 80.0 M7.4 68.0L-2.4 65.8 M11.3 56.6L2.3 52.2 M17.8 46.3L10.0 40.1 M26.3 37.8L20.1 30.0 M36.6 31.3L32.2 22.3 M48.0 27.4L45.8 17.6 M60.0 26.0L60.0 16.0 M72.0 27.4L74.2 17.6 M83.4 31.3L87.8 22.3 M93.7 37.8L99.9 30.0 M102.2 46.3L110.0 40.1 M108.7 56.6L117.7 52.2 M112.6 68.0L122.4 65.8" stroke="#ff5a3d" stroke-width="3" stroke-linecap="round"/>', f: '<path d="M30 116 q30 10 60 0" stroke="#2b2118" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="60" cy="121" r="5" fill="#ff4d4d" ' + GL + '/><path d="M14 60 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z M106 64 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" fill="#ffd23f"/>' },

    { id: 'canhsang', n: 'Đôi cánh cầu vồng', r: 'SSS', b: '<defs><linearGradient id="rbw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff6b8b"/><stop offset=".3" stop-color="#ffd54a"/><stop offset=".6" stop-color="#5ee0a0"/><stop offset="1" stop-color="#6aa8ff"/></linearGradient></defs><path d="M22 84 q-34 -10 -18 -54 q12 26 26 30 q-22 6 -8 24 z M98 84 q34 -10 18 -54 q-12 26 -26 30 q22 6 8 24 z" fill="url(#rbw)" opacity=".9" ' + GL + '/>', f: '<path d="M14 26 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z M106 22 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z M8 92 l1.5 3.5 3.5 1.5 -3.5 1.5 -1.5 3.5 -1.5 -3.5 -3.5 -1.5 3.5 -1.5z" fill="#ffd54a" stroke="' + GK + '" stroke-width="1.4"/>' }
  ];
  var RCOL = { B: '#6b8bb5', A: '#8b5cf6', S: '#e0a21b', SSS: 'linear-gradient(90deg,#ff6b8b,#ffd54a,#5ee0a0,#6aa8ff)' };
  function wearItem() { var w = { idol: 'idol', y2k: 'thienthan', scifi: 'chienbinh' }[document.documentElement.getAttribute('data-skin') || ''] || ''; for (var i = 0; i < ITEMS.length; i++) if (ITEMS[i].id === w) return ITEMS[i]; return null; }
  function bag() { var b = J('mt.gems', null); if (!b) b = { g: 0, pity: 0, own: {}, base: {}, pulls: 0 }; b.own = b.own || {}; b.base = b.base || {}; return b; }
  function saveBag(b) { S('mt.gems', b); [].forEach.call(document.querySelectorAll('.mgem b'), function (x) { x.textContent = b.g; }); }
  window.MGEMS = function () { return bag().g; };
  // thưởng đá theo việc học (gọi trong check)
  function award(s) {
    if (SITE === 'summary') return;
    var b = bag(), cur = { subs: s.subs || 0, mini: s.mini || 0, nen: s.nenAll || 0, ws: s.ws || 0, cards: s.cards || 0, badges: Object.keys(J(BKEY, {}) || {}).length }, base = b.base[SITE], got = 0, why = [];
    if (!b.starter) { b.starter = 1; b.g += 100; got += 100; why.push('quà chào mừng'); }
    if (base) {
      var V = { subs: [20, 'nộp bài'], mini: [15, 'đề mini'], nen: [15, 'bài Kiến thức nền'], ws: [30, 'bài viết'], cards: [2, 'từ flashcard'], badges: [50, 'huy hiệu'] };
      Object.keys(V).forEach(function (k) { var d = cur[k] - (base[k] || 0); if (d > 0) { var add = Math.min(d, k === 'cards' ? 25 : 10) * V[k][0]; b.g += add; got += add; why.push(V[k][1]); } });
    }
    b.base[SITE] = cur; saveBag(b);
    if (got > 0 && base) mtoast('star', '+' + got + ' 💎', 'Thưởng ' + why.join(', ') + '. Vào Tủ đồ quay gacha cho bé Xoài nha!', null, function () { window.MGACHA(); });
  }
  function roll(b) {
    b.pity = (b.pity || 0) + 1; b.pulls = (b.pulls || 0) + 1;
    var x = Math.random() * 100, r = x < 2 ? 'SSS' : x < 12 ? 'S' : x < 40 ? 'A' : 'B';
    if (b.pity >= 30 && (r === 'A' || r === 'B')) r = Math.random() < .2 ? 'SSS' : 'S';
    if (r === 'S' || r === 'SSS') b.pity = 0;
    var pool = ITEMS.filter(function (i) { return i.r === r; }), it = pool[Math.floor(Math.random() * pool.length)], dup = !!b.own[it.id];
    b.own[it.id] = (b.own[it.id] || 0) + 1; if (dup) b.g += 30;
    return { it: it, dup: dup };
  }
  window.MGACHA = function () {
    var old = document.querySelector('.mgc'); if (old) old.remove();
    var w = document.createElement('div'); w.className = 'mgc'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-modal', 'true'); w.setAttribute('aria-label', 'Tủ đồ bé Xoài');
    document.body.appendChild(w);
    function close() { w.remove(); document.querySelectorAll('.mbuddy .mmint').forEach(function (m) { m.outerHTML = mascot('happy', 'pop'); }); }
    function draw(msg) {
      var b = bag(), cur = wearItem(), nOwn = ITEMS.filter(function (i) { return b.own[i.id]; }).length;
      w.innerHTML = '<div class="mgc-card"><button type="button" class="mgc-x" aria-label="Đóng">×</button><div class="mgc-top"><div class="mgc-stage">' + mascot('cheer') + '</div><div><h3>Tủ đồ bé Xoài</h3><p class="mgc-gem">💎 <b>' + b.g + '</b> đá</p>' +
        '<p class="mgc-sub">' + (cur ? 'Đang mặc: <b>' + esc(cur.n) + '</b>' : 'Chưa mặc gì') + ' · Sưu tầm ' + nOwn + '/' + ITEMS.length + '</p>' +
        '<div class="mgc-btns"><button type="button" class="mgc-pull" data-n="1"' + (b.g < 100 ? ' disabled' : '') + '>Quay ×1 <small>100💎</small></button><button type="button" class="mgc-pull alt" data-n="5"' + (b.g < 450 ? ' disabled' : '') + '>Quay ×5 <small>450💎</small></button></div>' +
        '<p class="mgc-rate">SSS 2% · S 10% · A 28% · B 60% · chắc chắn ra S trở lên trong 30 lần quay · trùng đồ được hoàn 30💎</p></div></div>' + (msg || '') +
        '<div class="mgc-grid">' + ITEMS.map(function (i) { var o = b.own[i.id]; return '<button type="button" class="mgc-it' + (o ? ' own' : '') + (cur && cur.id === i.id ? ' on' : '') + '" data-id="' + i.id + '"' + (o ? '' : ' disabled') + '><span class="mgc-r r' + i.r + '">' + i.r + '</span>' + (o ? mascot('happy', '', i.id) : '<span class="mgc-q">?</span>') + '<small>' + (o ? esc(i.n) : '???') + '</small></button>'; }).join('') + '</div>' +
        '<details class="mgc-how"><summary>Kiếm đá bằng cách nào?</summary><ul><li>Nộp một bài luyện tập: +20💎</li><li>Làm đề mini mỗi ngày: +15💎</li><li>Học xong một bài Kiến thức nền: +15💎</li><li>Gửi một bài Writing: +30💎</li><li>Mở một huy hiệu mới: +50💎</li><li>Lưu một từ vào flashcard: +2💎</li></ul></details></div>';
      w.querySelector('.mgc-x').onclick = close;
      [].forEach.call(w.querySelectorAll('.mgc-it.own'), function (el) { el.onclick = function () { var id = el.getAttribute('data-id'), now = wearItem(); window.MWEAR = now && now.id === id ? '' : id; S('mt.wear', window.MWEAR); draw(); }; });
      [].forEach.call(w.querySelectorAll('.mgc-pull'), function (el) { el.onclick = function () { pull(+el.getAttribute('data-n')); }; });
    }
    function pull(n) {
      var b = bag(), cost = n === 5 ? 450 : 100; if (b.g < cost) return; b.g -= cost;
      var res = []; for (var i = 0; i < n; i++) res.push(roll(b)); saveBag(b);
      var best = res.reduce(function (a, x) { var o = { B: 0, A: 1, S: 2, SSS: 3 }; return o[x.it.r] > o[a.it.r] ? x : a; }, res[0]);
      var ov = document.createElement('div'); ov.className = 'mgc-roll r' + best.it.r; ov.innerHTML = '<div class="mgc-cap"><i></i></div>'; w.appendChild(ov);
      setTimeout(function () {
        ov.innerHTML = '<div class="mgc-reveal">' + res.map(function (x) { return '<div class="mgc-got r' + x.it.r + '"><span class="mgc-big">' + x.it.r + '</span>' + mascot('cheer', '', x.it.id) + '<b>' + esc(x.it.n) + '</b><small>' + (x.dup ? 'Trùng · +30💎' : 'MỚI!') + '</small></div>'; }).join('') + '</div><button type="button" class="mgc-ok">Tuyệt vời!</button>';
        if (best.it.r === 'S' || best.it.r === 'SSS') confetti();
        ov.querySelector('.mgc-ok').onclick = function () { ov.remove(); draw(); };
      }, 1500);
    }
    w.addEventListener('click', function (e) { if (e.target === w) close(); });
    draw();
  };

  // ================= combo kiểu game nhịp điệu =================
  var combo = 0;
  window.MCOMBO = function (ok, el) {
    if (EXAM) return;
    combo = ok ? combo + 1 : 0;
    var r = el && el.getBoundingClientRect ? el.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0 };
    var d = document.createElement('div'); d.className = 'mcombo ' + (ok ? (combo >= 5 ? 'pf' : 'gr') : 'ms');
    d.innerHTML = ok ? (combo >= 2 ? '<small>COMBO</small><b>×' + combo + '</b>' : '') + '<em>' + (combo >= 5 ? 'PERFECT!' : combo >= 3 ? 'GREAT!' : 'GOOD') + '</em>' : '<em>MISS</em>';
    d.style.left = Math.min(innerWidth - 90, Math.max(90, r.left + r.width - 40)) + 'px'; d.style.top = Math.max(70, r.top - 10) + 'px';
    document.body.appendChild(d); setTimeout(function () { d.remove(); }, 1100);
    if (ok && combo > 0 && combo % 10 === 0) confetti();
  };
  window.MCOMBO.reset = function () { combo = 0; };

  // ================= bộ giao diện theo phong cách =================
  var SKINS = [['', 'Xoài', '#a8691a'], ['idol', 'Hành baro', '#12a4a3'], ['y2k', 'Thiên thần', '#e0559a'], ['scifi', 'Băng hoại', 'linear-gradient(135deg,#4ad7ff,#b04cff)']];
  function skin() { var v = J('mt.skin', ''); return SKINS.some(function (k) { return k[0] === v; }) ? v : ''; }
  function applySkin(v) { var r = document.documentElement; if (v) r.setAttribute('data-skin', v); else r.removeAttribute('data-skin'); [].forEach.call(document.querySelectorAll('.mbuddy:not(.mb-home) .mmint'), function (m) { m.outerHTML = mascot('cheer', 'pop'); }); if (window._mhome) window._mhome(); if (v === 'scifi') applyTheme('dark', false); else applyTheme(theme(), false); }

  // ================= CSS cho các phần trên =================
  var st3 = document.createElement('style');
  st3.textContent =
    'html[data-fs] body>:not(.mnav):not(.mfloat):not(.fbk):not(.mtour):not(.mtoast):not(.mpop):not(.mconf){zoom:var(--fs)}' +
    '.mstart{display:block!important}.ms-h{display:flex;justify-content:space-between;align-items:baseline;margin:0 0 6px}.ms-h b{font:600 18px/1.2 Fraunces,Georgia,serif}.ms-h span{font-size:12.5px;color:var(--dim,#666e7a);font-weight:700}' +
    '.ms-s{display:flex;align-items:center;gap:10px;padding:9px 6px;border-radius:10px;text-decoration:none;color:var(--ink,#1e232b)}.ms-s:hover{background:var(--panel2,#f4f0e8)}.ms-s b{display:block;font-size:14.5px}.ms-s small{font-size:12.5px;color:var(--dim,#666e7a)}' +
    '.ms-n{flex:none;width:30px;height:30px;border-radius:50%;background:var(--brand-soft,#f2e2c4);color:var(--brand-ink,#6b4410);display:flex;align-items:center;justify-content:center;font:600 15px/1 Fraunces,Georgia,serif}.ms-n .ic{width:16px;height:16px}.ms-s.done .ms-n{background:var(--ok,#1f8f6c);color:#fff}.ms-s.done b{text-decoration:line-through;color:var(--dim,#666e7a)}.ms-go{margin-left:auto;color:var(--dim,#9a9fa8)}' +
    '.hello h1 em,.top h1 em{background:url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27200%27 height=%2714%27 viewBox=%270 0 200 14%27 preserveAspectRatio=%27none%27%3E%3Cpath d=%27M3 9 C 40 3 80 12 120 6 S 180 4 197 8%27 fill=%27none%27 stroke=%27%23f2b84b%27 stroke-width=%275%27 stroke-linecap=%27round%27 opacity=%27.75%27/%3E%3C/svg%3E") left 92%/100% .32em no-repeat;padding-bottom:.08em}.sec h2,h2.grp{background:url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27120%27 height=%2710%27 viewBox=%270 0 120 10%27%3E%3Cpath d=%27M2 6 Q 12 1 22 6 T 42 6 T 62 6 T 82 6 T 102 6 T 118 5%27 fill=%27none%27 stroke=%27%23e0a43a%27 stroke-width=%273%27 stroke-linecap=%27round%27/%3E%3C/svg%3E") left bottom/72px 8px no-repeat;padding-bottom:12px}' +
    '.mb-tap{color:#7d838c!important}.mbadge small{color:#6c727c}.mbadge.on small{color:#8a5a1c}' +
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
    '.mset .ic{width:20px;height:20px}' +
    '.mpop{position:fixed;z-index:95;width:250px;max-height:calc(100vh - 16px);overflow:auto;background:#fff;color:#1e232b;border:1px solid #e6e0d3;border-radius:14px;box-shadow:0 16px 40px rgba(0,0,0,.18);padding:12px;font:14px/1.4 "IBM Plex Sans",sans-serif;animation:fbkup .2s ease}' +
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


  function pat(svg) { return 'url("data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" ' + svg + '</svg>') + '")'; }
  var st5 = document.createElement('style');
  st5.textContent =
    // tủ đồ
    '.mgc{position:fixed;inset:0;z-index:96;background:rgba(15,17,21,.55);display:flex;align-items:center;justify-content:center;padding:12px}' +
    '.mgc-card{position:relative;background:var(--card,#fff);color:var(--ink,#1e232b);border-radius:22px;max-width:640px;width:100%;max-height:calc(100vh - 24px);overflow:auto;padding:20px;box-shadow:0 24px 60px rgba(0,0,0,.35);font:15px/1.5 "IBM Plex Sans",sans-serif;animation:fbkup .25s ease}' +
    '.mgc-x{position:absolute;right:12px;top:10px;border:0;background:none;font-size:28px;line-height:1;color:var(--dim,#666);cursor:pointer}' +
    '.mgc-top{display:flex;gap:16px;align-items:center}.mgc-stage{flex:none;width:130px;height:140px;border-radius:18px;background:radial-gradient(circle at 50% 60%,#fff3d4,#f6e2b8);display:flex;align-items:center;justify-content:center}.mgc-stage .mmint{width:110px}' +
    '.mgc h3{font:600 24px/1.2 Fraunces,Georgia,serif;margin:0}.mgc-gem{margin:4px 0 0;font-size:16px}.mgc-gem b{font-size:22px;color:var(--brand-ink,#6b4410)}.mgc-sub{margin:2px 0 8px;color:var(--dim,#666e7a);font-size:13.5px}' +
    '.mgc-btns{display:flex;gap:8px;flex-wrap:wrap}.mgc-pull{font:700 15px/1 "IBM Plex Sans",sans-serif;border:0;border-radius:12px;padding:12px 16px;cursor:pointer;color:#fff;background:linear-gradient(135deg,#ff8a3d,#e0559a)}.mgc-pull.alt{background:linear-gradient(135deg,#8b5cf6,#38bdf8)}.mgc-pull small{font-weight:600;opacity:.9;margin-left:4px}.mgc-pull:disabled{opacity:.4;cursor:default}' +
    '.mgc-rate{font-size:11.5px;color:var(--dim,#8a8f98);margin:8px 0 0}' +
    '.mgc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:8px;margin:16px 0 0}' +
    '.mgc-it{position:relative;display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px 6px;border-radius:14px;border:1.5px solid var(--line,#e6e0d3);background:var(--panel2,#f4f0e8);cursor:pointer;font:inherit;color:inherit}.mgc-it .mmint{width:66px;height:76px}.mgc-it small{font-size:11.5px;line-height:1.25;text-align:center;min-height:2.5em}' +
    '.mgc-it:disabled{cursor:default;opacity:.65}.mgc-it.on{border-color:var(--brand,#a8691a);box-shadow:0 0 0 3px var(--brand-soft,#f2e2c4);background:var(--card,#fff)}.mgc-it.own:hover{border-color:var(--brand,#a8691a)}' +
    '.mgc-q{width:66px;height:76px;display:flex;align-items:center;justify-content:center;font:600 34px Fraunces,Georgia,serif;color:#b9b2a4}' +
    '.mgc-r{position:absolute;left:6px;top:6px;font:800 10.5px/1 "IBM Plex Sans",sans-serif;color:#fff;border-radius:5px;padding:3px 5px}.rB.mgc-r{background:#6b8bb5}.rA.mgc-r{background:#8b5cf6}.rS.mgc-r{background:#e0a21b}.rSSS.mgc-r{background:linear-gradient(90deg,#ff6b8b,#ffd54a,#5ee0a0,#6aa8ff)}' +
    '.mgc-how{margin:14px 0 0;font-size:14px}.mgc-how summary{cursor:pointer;font-weight:700;color:var(--brand-ink,#6b4410)}.mgc-how ul{margin:6px 0 0;padding-left:20px}' +
    '.mgc-roll{position:absolute;inset:0;z-index:2;border-radius:22px;background:radial-gradient(circle,#2a2f3a,#0e1015);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:16px;overflow:auto}' +
    '.mgc-cap{width:110px;height:110px;border-radius:50%;background:linear-gradient(180deg,#ff8a3d 50%,#fff 50%);border:4px solid #2b2118;position:relative;animation:capshake .5s ease-in-out 3}.mgc-cap i{position:absolute;left:50%;top:50%;width:26px;height:26px;margin:-13px;border-radius:50%;background:#fff;border:4px solid #2b2118}' +
    '.mgc-roll.rS .mgc-cap{box-shadow:0 0 40px 10px #ffd54a}.mgc-roll.rSSS .mgc-cap{box-shadow:0 0 50px 16px #ff6bd5;animation:capshake .5s ease-in-out 3,rainbow 1.5s linear infinite}.mgc-roll.rA .mgc-cap{box-shadow:0 0 30px 6px #8b5cf6}' +
    '@keyframes capshake{25%{transform:rotate(-14deg)}75%{transform:rotate(14deg)}}@keyframes rainbow{to{filter:hue-rotate(360deg)}}' +
    '.mgc-reveal{display:flex;flex-wrap:wrap;gap:10px;justify-content:center}.mgc-got{display:flex;flex-direction:column;align-items:center;gap:2px;background:#fff;color:#1e232b;border-radius:16px;padding:10px 12px;min-width:120px;animation:gotin .5s cubic-bezier(.2,.9,.3,1.4) both}.mgc-got .mmint{width:80px;height:92px}.mgc-got b{font-size:13px;text-align:center}.mgc-got small{font-size:12px;color:#666}' +
    '.mgc-big{font:900 26px/1 "IBM Plex Sans",sans-serif;letter-spacing:.04em}.mgc-got.rB .mgc-big{color:#6b8bb5}.mgc-got.rA .mgc-big{color:#8b5cf6}.mgc-got.rS .mgc-big{color:#e0a21b}.mgc-got.rS{box-shadow:0 0 0 3px #ffd54a,0 0 30px #ffd54a}' +
    '.mgc-got.rSSS .mgc-big{background:linear-gradient(90deg,#ff6b8b,#ffd54a,#5ee0a0,#6aa8ff);-webkit-background-clip:text;background-clip:text;color:transparent}.mgc-got.rSSS{box-shadow:0 0 0 3px #ff6bd5,0 0 40px #ff6bd5}' +
    '@keyframes gotin{from{opacity:0;transform:scale(.5) rotate(-10deg)}}' +
    '.mgc-ok{font:700 15px/1 "IBM Plex Sans",sans-serif;border:0;border-radius:12px;padding:12px 22px;background:#ffd54a;color:#2b2118;cursor:pointer}' +
    '.mgem{width:auto!important;padding:0 10px;gap:4px;font:700 13.5px/1 "IBM Plex Sans",sans-serif}.mgem b{font-weight:700}' +
    '@media (max-width:520px){.mgc-top{flex-direction:column;text-align:center}.mgc-btns{justify-content:center}.mgc-stage{width:110px;height:120px}}' +
    'html[data-theme=dark] .mgc-stage{background:radial-gradient(circle at 50% 60%,#3b2d1b,#241c12)}' +
    // combo
    '.mcombo{position:fixed;z-index:115;pointer-events:none;transform:translate(-50%,0);text-align:center;font-family:"IBM Plex Sans",sans-serif;animation:mcb 1.1s ease-out forwards}' +
    '.mcombo small{display:block;font:800 12px/1 inherit;letter-spacing:.2em;color:#8b5cf6}.mcombo b{display:block;font:900 34px/1 "IBM Plex Sans",sans-serif;color:#8b5cf6;-webkit-text-stroke:1.5px #fff;paint-order:stroke}' +
    '.mcombo em{display:block;font:900 italic 22px/1.1 "IBM Plex Sans",sans-serif;letter-spacing:.04em;-webkit-text-stroke:1.5px #fff;paint-order:stroke}' +
    '.mcombo.gr em{color:#22b07d}.mcombo.pf em{background:linear-gradient(90deg,#ff6b8b,#ffd54a,#5ee0a0,#6aa8ff);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-stroke:0;filter:drop-shadow(0 2px 0 #fff)}.mcombo.ms em{color:#9aa0a8}' +
    '@keyframes mcb{0%{opacity:0;transform:translate(-50%,10px) scale(.6)}15%{opacity:1;transform:translate(-50%,0) scale(1.15)}30%{transform:translate(-50%,0) scale(1)}100%{opacity:0;transform:translate(-50%,-40px)}}' +
    '@media (prefers-reduced-motion:reduce){.mcombo{animation:none;opacity:1}}' +
    // phong cách
    '.mp-bk{display:flex;gap:6px}.mp-bk .mp-tour{flex:1;padding:9px 6px;font-size:12.5px}.mp-skn{display:block;font-weight:500;font-size:12px;color:var(--dim,#8a8f98)}.mp-skins{display:flex;gap:6px;flex-wrap:nowrap;justify-content:flex-end}.mp-skins button{width:30px;height:30px;border-radius:50%;border:2px solid transparent;cursor:pointer;box-shadow:inset 0 0 0 3px #fff}.mp-skins button[aria-pressed=true]{border-color:var(--ink,#1e232b)}' +
    '.mp-gacha{margin-top:6px;width:100%;display:flex;align-items:center;justify-content:center;gap:7px;border:0;border-radius:10px;padding:10px;font:700 13.5px/1 "IBM Plex Sans",sans-serif;color:#fff;background:linear-gradient(135deg,#ff8a3d,#e0559a);cursor:pointer}' +
    'html[data-skin] .mlogo .lg-bg{fill:var(--brand)}' +
    'html[data-skin] :is(.mt-next,.mp-f button,.fbk-row .ok,.fbk-types button[aria-pressed=true],.mp-sw[aria-checked=true],.btn:not(.alt),.big:not(.alt),.mark button:not(.on)){background:var(--brand)!important;border-color:var(--brand)!important}' +
    'html[data-theme=dark] :is(.chip[aria-pressed=true],.tg[aria-pressed=true],.topics button[aria-pressed=true],.types button[aria-pressed=true],.gtabs button[aria-selected=true],.tabs button[aria-selected=true]){background:var(--brand)!important;border-color:var(--brand)!important;color:var(--paper)!important}html[data-theme=dark] :is(.chip,.topics button,.types button)[aria-pressed=true] small{color:inherit!important;opacity:.75}' +
    'html[data-skin] :is(.mp-cd,.mt-i,.mbadge.on .mb-i,.num,.stop.open .dot){background:linear-gradient(150deg,var(--brand-soft),var(--brand))!important;border-color:var(--brand)!important}' +
    'html[data-skin] .mlinks a[aria-current=page]{background:var(--brand-soft);color:var(--brand-ink)}html[data-skin] .mbrand b em,html[data-skin] .mbrand small{color:var(--brand-ink)}' +
    'html[data-skin] :is(.kicker,.hello .kicker,.mp-todo h4,.rp-total small,h2.sec + *){color:var(--brand)}' +
    // Idol
    'html[data-skin=idol]:not([data-theme=dark]){--paper:#f4fbfb;--brand:#12a4a3;--brand-soft:#d3f3f1;--brand-ink:#0a6766;--amber:#12a4a3;--amber-soft:#d3f3f1;--amber-ink:#0a6766;--line:#d8ecea}' +
    'html[data-skin=idol] :is(.mdeco,.mdeco2){background-image:' + pat('width="60" height="60" viewBox="0 0 60 60"><path d="M15 8l2 5 5 1-4 3 1 5-4-3-4 3 1-5-4-3 5-1z" fill="#12a4a3" opacity=".22"/><path d="M45 38v-10l8-2v10M45 38a3 3 0 1 1-1-1M53 36a3 3 0 1 1-1-1" stroke="#ff5fa2" stroke-width="1.8" fill="none" opacity=".35"/>') + ';background-size:60px 60px}' +
    'html[data-skin=idol] .mnav{border-bottom:2px solid #ff9cc8}html[data-skin=idol] .mb-bub b,html[data-skin=idol] h1 em{color:#e0559a!important}' +
    // Y2K
    'html[data-skin=y2k]:not([data-theme=dark]){--paper:#fff5fb;--card:#fff;--brand:#e0559a;--brand-soft:#ffe0f0;--brand-ink:#9b2c66;--amber:#e0559a;--amber-soft:#ffe0f0;--amber-ink:#9b2c66;--line:#f0c9e6}' +
    'html[data-skin=y2k] :is(.mdeco,.mdeco2){background-image:' + pat('width="32" height="32" viewBox="0 0 32 32"><rect width="16" height="16" fill="#e0559a" opacity=".07"/><rect x="16" y="16" width="16" height="16" fill="#8b5cf6" opacity=".07"/><path d="M22 6h2v1h1v-1h2v1h1v3h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1v-1h-1v-3h1z" fill="#e0559a" opacity=".35"/>') + ';background-size:32px 32px}' +
    'html[data-skin=y2k] :is(.panel,.test,.tool,.mplan,.lesson,.book,.stat,.report,.sec .card,.mb-bub,.doc,.box,.mode){border:2px solid #d9a6e6!important;box-shadow:4px 4px 0 #c7a6f0!important;border-radius:10px!important}' +
    'html[data-skin=y2k]:not([data-theme=dark]) .mnav{background:linear-gradient(90deg,#ffd6ec,#e8dcff)!important}html[data-skin=y2k] .mnav{border-bottom:2px solid #c7a6f0}html[data-skin=y2k][data-theme=dark] .mnav{background:linear-gradient(90deg,#2a1830,#221a3a)!important;border-bottom-color:#6a4a8a}html[data-skin=y2k]:not([data-theme=dark]) h1,html[data-skin=y2k]:not([data-theme=dark]) .sec h2{text-shadow:2px 2px 0 #ffc2e2}html[data-skin=y2k][data-theme=dark] h1{text-shadow:2px 2px 0 #6a2a50}' +
    'html[data-skin=idol][data-theme=dark]{--paper:#0e1718;--card:#152224;--panel2:#1b2c2e;--line:#24393b;--line2:#2c4649;--brand:#3fd0cc;--brand-soft:#123a3a;--brand-ink:#8af0ec;--amber:#3fd0cc;--amber-soft:#123a3a;--amber-ink:#8af0ec}' +
    'html[data-skin=y2k][data-theme=dark]{--paper:#170f1c;--card:#221729;--panel2:#2b1d33;--line:#3a2846;--line2:#4a3358;--brand:#ff7eb6;--brand-soft:#3d1a30;--brand-ink:#ffb3d6;--amber:#ff7eb6;--amber-soft:#3d1a30;--amber-ink:#ffb3d6}' +
    'html[data-skin=y2k][data-theme=dark] :is(.panel,.test,.tool,.mplan,.lesson,.book,.stat,.report,.mb-bub,.doc,.box,.mode){border-color:#6a4a8a!important;box-shadow:4px 4px 0 #4a2f6a!important}' +
    // Băng hoại
    'html[data-skin=scifi][data-theme=dark]{--paper:#0a1024;--card:#111a35;--panel2:#18234a;--line:#24345f;--line2:#2e4377;--ink:#e6ecff;--dim:#93a3cf;--brand:#ffd23f;--brand-soft:#2c2a4a;--brand-ink:#ffe27a;--amber:#ffd23f;--amber-soft:#2c2a4a;--amber-ink:#ffe27a;--ok:#4ad7ff;--ok-soft:#10324d;--bad:#ff5fa8;--bad-soft:#3d1838;--teal:#4ad7ff;--teal-soft:#10324d}' +
    'html[data-skin=scifi] body{background:radial-gradient(1200px 600px at 85% -10%,rgba(176,76,255,.22),transparent 60%),radial-gradient(900px 500px at -10% 10%,rgba(74,215,255,.16),transparent 60%)!important;background-attachment:fixed!important}' +
    'html[data-skin=scifi] :is(.mdeco,.mdeco2){background-image:' + pat('width="44" height="44" viewBox="0 0 44 44"><path d="M44 0H0v44" fill="none" stroke="#4ad7ff" stroke-width=".6" opacity=".35"/><path d="M22 18l4 4-4 4-4-4z" fill="#b04cff" opacity=".35"/>') + ';background-size:44px 44px;opacity:.9}' +
    'html[data-skin=scifi] :is(.panel,.test,.tool,.mplan,.lesson,.book,.report,.doc,.box,.mode){border:1px solid #2e4377!important;box-shadow:inset 0 1px 0 rgba(74,215,255,.25),0 0 0 1px rgba(176,76,255,.10),0 10px 30px rgba(5,8,20,.5)!important;clip-path:polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))}' +
    'html[data-skin=scifi] .mnav{background:linear-gradient(90deg,rgba(10,16,36,.95),rgba(26,17,64,.95))!important;border-bottom:1px solid rgba(74,215,255,.35)}' +
    'html[data-skin=scifi] :is(h1,.sec h2){text-shadow:0 0 18px rgba(74,215,255,.35)}html[data-skin=scifi] h1 em,html[data-skin=scifi] .mb-bub b{color:#4ad7ff!important}' +
    'html[data-skin=scifi] :is(.btn:not(.alt),.big:not(.alt),.mt-next,.mark button:not(.on)){color:#1a1240!important;background:linear-gradient(180deg,#ffe36b,#ffc21a)!important;border-color:#ffc21a!important;box-shadow:0 0 14px rgba(255,210,63,.35)}' +
    'html[data-skin=scifi] :is(.mp-cd,.mt-i,.mbadge.on .mb-i,.num,.stop.open .dot){background:linear-gradient(150deg,#4ad7ff,#b04cff)!important;border-color:#4ad7ff!important}' +
    'html[data-skin=scifi] .mlinks a[aria-current=page]{background:rgba(74,215,255,.14);color:#7fe6ff;box-shadow:inset 0 -2px 0 #4ad7ff}html[data-skin=scifi] .kicker,html[data-skin=scifi] .hello .kicker{color:#4ad7ff}' +
    'html[data-skin=scifi] .mp-bar i,html[data-skin=scifi] .skbar s{background:linear-gradient(90deg,#4ad7ff,#b04cff)!important}' +
    // Băng hoại: bỏ các khung màu nâu/cam của giao diện tối, đổi sang tông xanh – tím cho đồng bộ
    'html[data-skin=scifi] .mbrand b em{background:rgba(74,215,255,.14)!important;color:#7fe6ff!important}' +
    'html[data-skin=scifi] :is(.doc thead th,.doc tr:first-child th,table thead th){background:linear-gradient(90deg,#1b2a5c,#2a1b5c)!important;color:#bfefff!important}html[data-skin=scifi] .doc table.v3note td{background:#18234a!important}' +
    'html[data-skin=scifi] :is(.more-sites a,.gv,.lopbar,.gate,.resume,.minapp){background:linear-gradient(120deg,#111a35,#1a1140)!important;border-color:#2e4377!important}html[data-skin=scifi] .more-sites a:hover{border-color:#4ad7ff!important}' +
    'html[data-skin=scifi] :is(.gv tr.next td,.sn-res mark,.doc h2.sn-hit,.doc h3.sn-hit){background:rgba(176,76,255,.22)!important}';
  document.head.appendChild(st5);
  applySkin(skin());

  if (!EXAM) { var slo = document.createElement('div'); slo.className = 'mslogan'; slo.innerHTML = '<span aria-hidden="true">✦</span><p><i>Cứ đi là mình sẽ tới,</i> <i>tin là mình sẽ có,</i><br><i>sáng như viên cà rá, 22 karat</i></p><small>Minto English · ミント英語</small>'; document.body.appendChild(slo); }
  var stA = document.createElement('style'); stA.textContent =
    '.macc-b{width:auto!important;padding:0 12px!important;gap:7px;font:600 13.5px/1 "IBM Plex Sans",sans-serif!important;display:inline-flex!important;align-items:center;justify-content:center;white-space:nowrap}' +
    '.macc-b[hidden]{display:none!important}' +
    '.mset.acc{position:relative;padding:0!important;overflow:visible}.mset.acc img,.mset.acc>i{width:100%;height:100%;border-radius:inherit;object-fit:cover;display:flex;align-items:center;justify-content:center;font-style:normal;font-weight:700;color:var(--brand-ink,#6b4410)}.mset.acc img{display:block}' +
    '.mset-g{position:absolute;right:-5px;bottom:-5px;width:18px;height:18px;border-radius:50%;background:#fff;border:1px solid #e6e0d3;display:flex;align-items:center;justify-content:center;color:#6b4410}.mset-g .ic{width:12px;height:12px}html[data-theme=dark] .mset-g{background:#1c1f25;border-color:#373b44;color:#f0c787}' +
    '.macc-b.on{width:40px!important;padding:0!important;overflow:hidden}.macc-b img{width:100%;height:100%;object-fit:cover;border-radius:inherit}.macc-b i{font-style:normal;font-weight:700;color:var(--brand-ink,#6b4410)}' +
    '@media (max-width:440px){.macc-b span{display:none}.macc-b{width:38px!important;padding:0!important}}' +
    '@media (max-width:400px){.mnav .in{gap:6px!important;padding-left:12px!important;padding-right:12px!important}.mtool{gap:4px!important}.mtool .mbtn{width:34px!important;height:34px!important}.mbrand{gap:7px!important}.mlogo{width:32px!important;height:32px!important}.mbrand b{font-size:17px!important;gap:5px!important}.mbrand b em{font-size:8.5px!important;padding:3px 4px 2px!important}.mbrand small{letter-spacing:.2em!important}}' +
    '@media (max-width:340px){.mbrand b em{display:none!important}}' +
    '.minapp{display:flex;align-items:center;gap:10px;background:#fff6dd;border-bottom:1px solid #f0d996;color:#5a3a00;font:500 13.5px/1.4 "IBM Plex Sans",sans-serif;padding:9px 16px;position:relative;z-index:39}' +
    '.minapp span{flex:1}.minapp a{flex:none;background:#a8691a;color:#fff!important;font-weight:700;text-decoration:none;border-radius:999px;padding:7px 14px}.minapp button{flex:none;border:0;background:none;font-size:15px;cursor:pointer;color:#8a6a2a}' +
    'html[data-theme=dark] .minapp{background:#2d2614;border-color:#5a4a22;color:#f0d9a0}' +
    '.mlogin-nudge{display:flex;align-items:center;gap:12px;flex-wrap:wrap;background:linear-gradient(90deg,#fff6e6,#fdeccf);border-bottom:1px solid #f0d996;color:#5a3a00;font:500 13.5px/1.45 "IBM Plex Sans",sans-serif;padding:10px 16px;position:relative;z-index:39}' +
    '.mlogin-nudge span:first-child{flex:1;min-width:200px}.mlogin-nudge b{color:#6b4410}.mln-b{display:flex;gap:8px;flex:none}' +
    '.mln-go{border:0;background:#a8691a;color:#fff;font:700 13px/1 "IBM Plex Sans",sans-serif;border-radius:999px;padding:9px 16px;cursor:pointer}.mln-go:hover{background:#905712}' +
    '.mln-x{border:1px solid #e0cfa6;background:#fff;color:#8a6a2a;font:600 13px/1 "IBM Plex Sans",sans-serif;border-radius:999px;padding:9px 14px;cursor:pointer}' +
    'html[data-theme=dark] .mlogin-nudge{background:linear-gradient(90deg,#2d2614,#241f12);border-color:#5a4a22;color:#f0d9a0}html[data-theme=dark] .mlogin-nudge b{color:#ffd98a}html[data-theme=dark] .mln-x{background:#1f2228;border-color:#4a3f22;color:#e8d6a6}' +
    '@media (max-width:760px){.mlogin-nudge{font-size:13px;padding:10px 14px}.mln-go,.mln-x{flex:1}}';
  document.head.appendChild(stA);
  var st6 = document.createElement('style'); st6.textContent = '.mslogan{max-width:760px;margin:-10px auto 0;padding:0 20px 40px;text-align:center;color:var(--dim,#666e7a)}.mslogan span{color:var(--brand,#a8691a);font-size:14px}.mslogan p{font:italic 500 17px/1.5 Fraunces,Georgia,serif;color:var(--brand-ink,#6b4410);margin:6px 0 4px}.mslogan p i{display:inline-block;white-space:nowrap;font-style:inherit}.mslogan small{font-size:12px;letter-spacing:.08em}body.has-nav .mslogan{padding-bottom:20px}@media (max-width:760px){body.has-nav .mslogan{padding-bottom:10px}}'; document.head.appendChild(st6);
  // ================= nút: trong thanh menu (nếu có) + nút nổi =================
  var fl = document.createElement('div'); fl.className = 'mfloat';
  var hasNav = !!document.querySelector('.mnav');
  fl.innerHTML = (hasNav ? '' : '<button type="button" class="mbtn mfb" aria-label="Góp ý, báo lỗi" title="Góp ý / báo lỗi">' + icon('msg') + '</button>') + (hasNav ? '' : '<button type="button" class="mbtn mset" aria-label="Cài đặt" title="Cài đặt: cỡ chữ, giao diện, sao lưu">'+icon('gear')+'</button>');
  document.body.appendChild(fl);
  var navIn = document.querySelector('.mnav .in');
  if (navIn) { var tl = document.createElement('div'); tl.className = 'mtool'; tl.innerHTML = '<button type="button" class="mbtn macc-b" aria-label="Đăng nhập bằng Google"></button><button type="button" class="mbtn mfb" aria-label="Góp ý, báo lỗi" title="Góp ý / báo lỗi">' + icon('msg') + '</button><button type="button" class="mbtn mset" aria-label="Cài đặt" title="Cài đặt: cỡ chữ, giao diện, sao lưu">'+icon('gear')+'</button>'; navIn.appendChild(tl); }
  [].forEach.call(document.querySelectorAll('.mtheme'), function (b) { b.onclick = toggleTheme; });
  [].forEach.call(document.querySelectorAll('.mset'), function (b) { b.onclick = function () { settings(b); }; });
  [].forEach.call(document.querySelectorAll('.mfb'), function (b) { b.onclick = feedback; });
  // nút đăng nhập ngoài thanh menu + thanh nhắc mở bằng trình duyệt khi đang ở trong Zalo/Messenger
  var GSVG = '<svg viewBox="0 0 48 48" width="18" height="18" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
  var INAPP = /FBAN|FBAV|FB_IAB|Messenger|Instagram|Zalo|Line\/|MicroMessenger|TikTok|musical_ly/i.test(navigator.userAgent), IOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  function extUrl() { var url = location.href.replace(/^https?:\/\//, ''); return IOS ? 'x-safari-https://' + url : 'intent://' + url + '#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=' + encodeURIComponent(location.href) + ';end'; }
  window.MACCPAINT = function () {
    var a = null; try { a = JSON.parse(localStorage.getItem('mt.acc')); } catch (e) {}
    [].forEach.call(document.querySelectorAll('.mset'), function (g) {
      if (a) { g.classList.add('acc'); g.innerHTML = (a.photo ? '<img src="' + esc(a.photo) + '" alt="" referrerpolicy="no-referrer">' : '<i>' + esc((a.name || a.email || '?').charAt(0).toUpperCase()) + '</i>') + '<b class="mset-g">' + icon('gear') + '</b>'; g.title = 'Tài khoản & cài đặt (' + (a.email || a.name) + ')'; g.setAttribute('aria-label', 'Tài khoản và cài đặt'); }
      else if (g.classList.contains('acc')) { g.classList.remove('acc'); g.innerHTML = icon('gear'); g.title = 'Cài đặt: cỡ chữ, giao diện, sao lưu'; g.setAttribute('aria-label', 'Cài đặt'); }
    });
    [].forEach.call(document.querySelectorAll('.macc-b'), function (b) {
      b.hidden = !!a; b.style.display = a ? 'none' : '';
      b.classList.toggle('on', !!a);
      if (a) { b.innerHTML = a.photo ? '<img src="' + esc(a.photo) + '" alt="" referrerpolicy="no-referrer">' : '<i>' + esc((a.name || a.email || '?').charAt(0).toUpperCase()) + '</i>'; b.title = 'Đã đăng nhập: ' + (a.email || a.name) + ' — bấm để xem'; b.setAttribute('aria-label', 'Tài khoản ' + (a.email || '')); }
      else { b.innerHTML = GSVG + '<span>' + (INAPP ? 'Mở để đăng nhập' : 'Đăng nhập') + '</span>'; b.title = INAPP ? 'Mở bằng ' + (IOS ? 'Safari' : 'Chrome') + ' để đăng nhập Google' : 'Đăng nhập bằng Google để lưu tiến độ'; b.setAttribute('aria-label', b.title); }
    });
  };
  window.MACCPAINT();
  [].forEach.call(document.querySelectorAll('.macc-b'), function (b) {
    b.onclick = function (e) {
      e.stopPropagation();
      var signed = false; try { signed = !!localStorage.getItem('mt.acc'); } catch (x) {}
      if (signed) { var g = document.querySelector('.mtool .mset') || document.querySelector('.mset'); if (g) settings(g); return; }
      if (INAPP) { location.href = extUrl(); return; }
      if (window.MACC) return window.MACC.quick();
      accLoad(function () { window.MACC.quick(); });
    };
  });
  if (document.querySelector('.macc-b') && !EXAM) setTimeout(function () { accLoad(function () { if (!INAPP) window.MACC.preload(); }); }, 1200);
  if (INAPP && !EXAM) {
    var ib = document.createElement('div'); ib.className = 'minapp';
    ib.innerHTML = '<span>Bạn đang mở trong ' + (/Zalo/i.test(navigator.userAgent) ? 'Zalo' : 'ứng dụng') + ' — mở bằng ' + (IOS ? 'Safari' : 'Chrome') + ' để đăng nhập và lưu tiến độ.</span><a href="' + esc(extUrl()) + '">Mở ngay</a><button type="button" aria-label="Ẩn">✕</button>';
    ib.querySelector('button').onclick = function () { ib.remove(); try { sessionStorage.setItem('mt-inapp-x', '1'); } catch (e) {} };
    var hideIb = false; try { hideIb = !!sessionStorage.getItem('mt-inapp-x') || !!localStorage.getItem('mt.acc'); } catch (e) {}
    if (!hideIb) { var nv = document.querySelector('.mnav'); if (nv) nv.insertAdjacentElement('afterend', ib); else document.body.insertBefore(ib, document.body.firstChild); }
  }
  // nhắc nhẹ học viên đăng nhập để thầy thấy tiến độ (chỉ web luyện đề, trang chủ, khách chưa đăng nhập; ẩn 10 ngày khi bấm Để sau)
  if (SITE !== 'summary' && !EXAM && !INAPP && cur === 'home') {
    var logged = false; try { logged = !!localStorage.getItem('mt.acc'); } catch (e) {}
    var hideNudge = false; try { var tx = +localStorage.getItem('mt.loginNudgeX') || 0; hideNudge = tx > Date.now() - 864e5 * 10; } catch (e) {}
    if (!logged && !hideNudge) {
      var ln = document.createElement('div'); ln.className = 'mlogin-nudge';
      ln.innerHTML = '<span>👋 <b>Đăng nhập Google</b> để thầy thấy tiến độ của bạn, và lưu bài làm, flashcard qua mọi thiết bị.</span>' +
        '<span class="mln-b"><button type="button" class="mln-go">Đăng nhập</button><button type="button" class="mln-x" aria-label="Để sau">Để sau</button></span>';
      ln.querySelector('.mln-go').onclick = function () { var mb = document.querySelector('.macc-b'); if (mb) mb.click(); };
      ln.querySelector('.mln-x').onclick = function () { ln.remove(); try { localStorage.setItem('mt.loginNudgeX', String(Date.now())); } catch (e) {} };
      var nvn = document.querySelector('.mnav');
      if (nvn) nvn.insertAdjacentElement('afterend', ln); else document.body.insertBefore(ln, document.body.firstChild);
      var prev = window.MACCPAINT; window.MACCPAINT = function () { var r = prev && prev.apply(this, arguments); try { if (localStorage.getItem('mt.acc')) ln.remove(); } catch (e) {} return r; }; if (prev) for (var pk in prev) window.MACCPAINT[pk] = prev[pk];
    }
  }
  [].forEach.call(document.querySelectorAll('.mgem'), function (b) { b.onclick = function () { window.MGACHA(); }; });
  applySkin(skin());
  // hiệu ứng xuất hiện
  if (!EXAM && window.IntersectionObserver && !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('fx-on'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -30px 0px' });
    window.MFX = function (root) { [].forEach.call((root || document).querySelectorAll('.test,.tool,.stat,.panel,.mode,.box,.card,.report,.big,.stop,.book,.cat,.prog-card,.mplan,.lesson'), function (el, i) { if (el.classList.contains('fx-in')) return; el.classList.add('fx-in'); el.style.transitionDelay = Math.min(i % 12, 8) * 40 + 'ms'; io.observe(el); }); };
    setTimeout(function () { window.MFX(); }, 30);
  } else window.MFX = function () {};
  setTimeout(check, 400);
  if (document.readyState === 'complete') setTimeout(tour, 900); else addEventListener('load', function () { setTimeout(tour, 900); });
})();
/* Tô sáng + ghi chú khi làm bài (Listening & Reading, máy tính & điện thoại) + sửa độ tương phản giao diện tối / Băng hoại. Dùng chung web TOEIC và IELTS. */
(function () {
  'use strict';
  if (/\/summary-(new|old)\//.test((document.currentScript && document.currentScript.src) || '')) return; // chỉ dùng cho trang làm bài IELTS/TOEIC
  var st = document.createElement('style');
  st.textContent =
    'mark.hl{background:#ffe58a;color:inherit;border-radius:2px;cursor:pointer;padding:0}mark.hl.has-note{border-bottom:2px dotted var(--brand,#a8691a)}mark.hl.has-note::after{content:"📝";font-size:11px;margin-left:1px}' +
    '.mhl-bar{position:absolute;z-index:95;display:flex;gap:4px;background:#1e232b;border-radius:8px;padding:4px;box-shadow:0 6px 18px rgba(0,0,0,.3);-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;touch-action:manipulation}' +
    '.mhl-bar[hidden],.mhl-note[hidden]{display:none}.mhl-bar button{font:600 13px/1.2 "IBM Plex Sans",system-ui,sans-serif;color:#fff;background:none;border:0;border-radius:5px;padding:7px 10px;cursor:pointer;white-space:nowrap}.mhl-bar button:hover{background:rgba(255,255,255,.15)}' +
    '.mhl-bar.touch button{font-size:14.5px;padding:11px 12px}' +
    '.mhl-note{position:absolute;z-index:95;width:280px;max-width:calc(100vw - 16px);background:var(--card,#fff);color:var(--ink,#1e232b);border:1px solid var(--line,#ddd7c9);border-radius:8px;padding:10px;box-shadow:0 10px 26px rgba(0,0,0,.22)}' +
    '.mhl-note textarea{display:block;width:100%;box-sizing:border-box;font:14px/1.5 "IBM Plex Sans",system-ui,sans-serif;border:1px solid var(--line,#ddd7c9);border-radius:5px;padding:6px 8px;margin:0 0 8px;resize:vertical;background:var(--card,#fff);color:inherit}' +
    '.mhl-note .btn{padding:6px 12px;font-size:13px;margin-right:6px}' +
    '.mhl-hint{font-size:12.5px;font-weight:500;color:var(--dim,#666e7a)}' +
    'html[data-theme=dark] mark.hl,html[data-theme=dark] :is(mark.ev,.evhl,.script-body span.kara){color:#1e232b}' +
    'html[data-theme=dark] :is(.dir,.vi-psg,.vhint,.karaopt,.mhl-hint){color:var(--dim)!important}' +
    'html[data-theme=dark] :is(.part,.passage,.ocard) em{color:var(--dim)}' +
    'html[data-theme=dark] .loc{background:var(--brand-soft);border-color:var(--brand);color:var(--brand-ink)}' +
    'html[data-theme=dark] .grid a:not(.done):not(.g-ok):not(.g-bad){background:var(--card)}' +
    'html[data-theme=dark] :is(.grid a.g-ok,.grid a.g-bad,.score .band,.psg .blank.filled,.psg .blank.ok,.psg .blank.bad,.evtag,.sgrid button.g-ok,.sgrid button.g-bad),html[data-theme=dark] .evhl::before{color:#10131a!important}' +
    'html[data-theme=dark] .exambar:not(.over){background:var(--brand-soft);border-color:var(--brand)}' +
    'html[data-theme=dark] #xpSheet :is(.xp-a b,.xp-ok){color:var(--ok)}html[data-theme=dark] #xpSheet .xp-no{color:var(--bad)}' +
    'html[data-theme=dark] ::highlight(cam-vocab){background-color:rgba(242,200,121,.16);text-decoration-color:#d9a24a}';
  document.head.appendChild(st);

  var P = location.pathname, isT = /\/test\.html$/.test(P), mc = /\/c(\d+)\/test-(\d+)\.html$/.exec(P);
  if (!isT && !mc) return;
  var KEY = isT ? 'mt.hl.toeic.t' + Math.max(1, Math.min(20, parseInt(new URLSearchParams(location.search).get('t'), 10) || 1)) : 'mt.hl.cam' + mc[1] + '.t' + mc[2];
  var OLD = mc ? 'cam' + mc[1] + '.hl.t' + mc[2] : '';
  var ZONE = '#partBody,.sect';
  var NOZ = '.panel,.ptools,.qmk,.qnote,.vpop,.audio,audio,.exambar,.mhl-bar,.mhl-note,#xpSheet,.karaopt,summary,.overlay';
  var SKIP = 'button,input,select,textarea,script,style,audio,.mark,.fix,.evtag,.loc,.blank,.qmk,.qnote,.vi,summary';
  var BLK = 'p,li,td,th,h1,h2,h3,h4,h5,h6,dt,dd,figcaption,pre,label,.qtext,.blank-q,.psg,.ghead,.qt,.in';
  var NOWRAP = /^(TABLE|TBODY|THEAD|TFOOT|TR|COLGROUP|UL|OL|DL|SELECT)$/;
  function get() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function put(o) { try { if (Object.keys(o).length) localStorage.setItem(KEY, JSON.stringify(o)); else localStorage.removeItem(KEY); if (OLD) localStorage.removeItem(OLD); } catch (e) {} }
  function el(t) { return t && (t.nodeType === 1 ? t : t.parentElement); }
  function inZone(n) { var e = el(n); return !!(e && e.closest(ZONE) && !e.closest(NOZ)); }
  function texts(root) {
    var out = [], w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), t;
    while ((t = w.nextNode())) { var sk = t.parentElement && t.parentElement.closest(SKIP); if (sk && sk !== root && root.contains(sk)) continue; out.push(t); }
    return out;
  }
  function blockOf(n) { var e = el(n); return e && (e.closest(BLK) || e.closest('[id]')); }
  function keyOf(b) {
    var a = b.id ? b : b.parentElement && b.parentElement.closest('[id]'); if (!a) return null;
    return a === b ? a.id : a.id + '/' + [].indexOf.call(a.querySelectorAll(BLK), b);
  }
  function findBlock(k) {
    var i = k.lastIndexOf('/'), a = document.getElementById(i < 0 ? k : k.slice(0, i)); if (!a) return null;
    return i < 0 ? a : a.querySelectorAll(BLK)[+k.slice(i + 1)] || null;
  }
  var gid = 0;
  function newG() { return Date.now().toString(36) + (gid++); }
  function wrapText(t, s, e, g) {
    if (e <= s || NOWRAP.test(t.parentNode.nodeName) || el(t).closest('mark.hl') || el(t).closest(SKIP)) return null;
    if (!t.nodeValue.slice(s, e).trim()) return null;
    if (e < t.length) t.splitText(e);
    if (s > 0) t = t.splitText(s);
    var mk = document.createElement('mark'); mk.className = 'hl'; mk.setAttribute('data-g', g);
    t.parentNode.insertBefore(mk, t); mk.appendChild(t); return mk;
  }
  function wrapRange(r, g) {
    var root = r.commonAncestorContainer, list = [], marks = [];
    if (root.nodeType === 3) list = [root];
    else { var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), t; while ((t = w.nextNode())) if (r.intersectsNode(t)) list.push(t); }
    list.forEach(function (t) {
      if (!inZone(t)) return;
      var s = t === r.startContainer ? r.startOffset : 0, e = t === r.endContainer ? r.endOffset : t.length;
      var mk = wrapText(t, s, e, g); if (mk) marks.push(mk);
    });
    return marks;
  }
  function setNote(g, v) {
    var ms = [].slice.call(document.querySelectorAll('mark.hl[data-g="' + g + '"]'));
    ms.forEach(function (m, i) { var last = i === ms.length - 1; m.classList.toggle('has-note', !!v && last); if (v && last) { m.setAttribute('data-note', v); m.title = v; } else { m.removeAttribute('data-note'); m.removeAttribute('title'); } });
  }
  function unwrap(m) { var p = m.parentNode; if (!p) return; while (m.firstChild) p.insertBefore(m.firstChild, m); p.removeChild(m); p.normalize(); }
  function save() {
    var o = get();
    Object.keys(o).forEach(function (k) { var b = findBlock(k); if (b && inZone(b)) delete o[k]; });
    [].forEach.call(document.querySelectorAll('mark.hl'), function (m) {
      var b = blockOf(m), k = b && inZone(b) && keyOf(b); if (!k) return;
      var pos = 0, ts = texts(b), g = m.getAttribute('data-g') || newG(); m.setAttribute('data-g', g);
      for (var i = 0; i < ts.length; i++) {
        var t = ts[i];
        if (m.contains(t)) { var a = o[k] = o[k] || [], last = a[a.length - 1];
          if (last && last[2] === g && last[1] === pos) { last[1] += t.length; last[3] += t.nodeValue; } else a.push([pos, pos + t.length, g, t.nodeValue, '']);
          if (m.getAttribute('data-note')) a[a.length - 1][4] = m.getAttribute('data-note');
        }
        pos += t.length;
      }
    });
    put(o);
  }
  var done = window.WeakSet ? new WeakSet() : null;
  function restore() {
    if (!done) return;
    var o = get();
    Object.keys(o).forEach(function (k) {
      var b = findBlock(k); if (!b || done.has(b) || !inZone(b)) return; done.add(b);
      var had = {}; [].forEach.call(b.querySelectorAll('mark.hl[data-g]'), function (m) { had[m.getAttribute('data-g')] = 1; });
      o[k].forEach(function (x) {
        if (had[x[2]]) return;
        var ts = texts(b), pos = 0, full = ts.map(function (t) { return t.nodeValue; }).join('');
        if (full.slice(x[0], x[1]) !== x[3]) return;
        var segs = [];
        ts.forEach(function (t) { var a = pos, z = pos + t.length; pos = z; var s = Math.max(a, x[0]), e = Math.min(z, x[1]); if (e > s) segs.push([t, s - a, e - a]); });
        segs.forEach(function (sg) { wrapText(sg[0], sg[1], sg[2], x[2]); });
        if (x[4]) setNote(x[2], x[4]);
      });
    });
  }

  // ---------- giao diện ----------
  var bar = document.createElement('div'); bar.className = 'mhl-bar'; bar.hidden = true;
  bar.innerHTML = '<button type="button" data-h="y">🖍 Tô vàng</button><button type="button" data-h="n">📝 Ghi chú</button><button type="button" data-h="x">✕ Bỏ tô</button>';
  var nb = document.createElement('div'); nb.className = 'mhl-note'; nb.hidden = true;
  nb.innerHTML = '<textarea rows="3" placeholder="Ghi chú của bạn…"></textarea><div><button type="button" data-n="save" class="btn">Lưu</button><button type="button" data-n="del" class="btn alt">Bỏ tô</button></div>';
  var range = null, curG = null, busy = 0, mouseDown = false, lastPT = '', tmr = 0;
  function isTouch() { return lastPT ? lastPT !== 'mouse' : !!(window.matchMedia && matchMedia('(pointer:coarse)').matches); }
  function place(box, x, y) { box.style.left = Math.max(8, Math.min(document.documentElement.clientWidth - box.offsetWidth - 8, x)) + 'px'; box.style.top = Math.max(0, y + window.scrollY) + 'px'; }
  function hits(r) { return [].filter.call(document.querySelectorAll('mark.hl'), function (m) { try { return r.intersectsNode(m); } catch (e) { return false; } }); }
  function hideBar() { bar.hidden = true; range = null; }
  function onSel() {
    var sel = window.getSelection(); if (!sel || !sel.rangeCount || sel.isCollapsed) { if (Date.now() > busy) hideBar(); return; }
    var r = sel.getRangeAt(0);
    if (!inZone(r.startContainer) || !inZone(r.endContainer) || !r.toString().trim()) { hideBar(); return; }
    range = r.cloneRange();
    var touch = isTouch(); bar.classList.toggle('touch', touch);
    bar.querySelector('[data-h=x]').hidden = !hits(range).length;
    bar.hidden = false; nb.hidden = true;
    var rs = r.getClientRects(), rc = r.getBoundingClientRect(), f = rs[0] || rc, l = rs[rs.length - 1] || rc, h = bar.offsetHeight, vh = window.innerHeight;
    if (touch) {
      // điện thoại: đặt DƯỚI vùng chọn để không bị menu Copy/Paste của máy che
      var y = l.bottom + 30;
      if (y + h > vh - 8) y = f.top - h - 64 > 8 ? f.top - h - 64 : Math.max(8, vh - h - 12);
      place(bar, l.left + l.width / 2 - bar.offsetWidth / 2, y);
    } else {
      var top = f.top - h - 8;
      place(bar, f.left + f.width / 2 - bar.offsetWidth / 2, top < 70 ? l.bottom + 8 : top);
    }
  }
  function later(ms) { clearTimeout(tmr); tmr = setTimeout(onSel, ms); }
  function openNote(m) {
    curG = m.getAttribute('data-g'); if (!curG) { curG = newG(); m.setAttribute('data-g', curG); }
    var ms = document.querySelectorAll('mark.hl[data-g="' + curG + '"]'), lastM = ms[ms.length - 1] || m;
    nb.hidden = false; bar.hidden = true; nb.querySelector('textarea').value = lastM.getAttribute('data-note') || '';
    var rc = m.getBoundingClientRect(); place(nb, rc.left, rc.bottom + (isTouch() ? 30 : 6));
    if (!isTouch()) nb.querySelector('textarea').focus();
  }
  function act(h) {
    var r = range; if (!r) return;
    if (h === 'x') { var gs = {}; hits(r).forEach(function (m) { gs[m.getAttribute('data-g')] = 1; }); Object.keys(gs).forEach(function (g) { [].forEach.call(document.querySelectorAll('mark.hl[data-g="' + g + '"]'), unwrap); }); }
    var ms = h === 'x' ? [] : wrapRange(r, newG());
    try { window.getSelection().removeAllRanges(); } catch (e) {}
    hideBar(); save();
    if (h === 'n' && ms.length) openNote(ms[0]);
  }
  function guard(e) { busy = Date.now() + 700; if (e.type !== 'touchstart') e.preventDefault(); }
  ['pointerdown', 'mousedown', 'touchstart'].forEach(function (t) { bar.addEventListener(t, guard, t === 'touchstart' ? { passive: true } : false); });
  bar.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) { e.stopPropagation(); act(b.dataset.h); } });
  nb.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || !curG) return;
    var ms = [].slice.call(document.querySelectorAll('mark.hl[data-g="' + curG + '"]'));
    if (b.dataset.n === 'save') setNote(curG, nb.querySelector('textarea').value.trim()); else ms.forEach(unwrap);
    nb.hidden = true; curG = null; save();
  });

  function init() {
    if (!document.body) return;
    // bỏ thanh tô sáng cũ (chỉ chạy được bằng chuột) của trang IELTS để dùng bản chung này
    [].forEach.call(document.querySelectorAll('body>.hltool,body>.notebox'), function (x) { x.remove(); });
    document.body.appendChild(bar); document.body.appendChild(nb);
    restore();
    if (OLD) { try { if (localStorage.getItem(OLD) != null) save(); } catch (e) {} }
    hints();
    document.addEventListener('pointerdown', function (e) { lastPT = e.pointerType || lastPT; if (e.pointerType === 'mouse') mouseDown = true; if (!nb.contains(e.target) && !bar.contains(e.target)) nb.hidden = true; }, true);
    document.addEventListener('mousedown', function () { if (!lastPT) mouseDown = true; }, true);
    document.addEventListener('mouseup', function (e) { mouseDown = false; if (!bar.contains(e.target) && !nb.contains(e.target)) later(10); });
    document.addEventListener('touchstart', function () { lastPT = 'touch'; }, { passive: true, capture: true });
    document.addEventListener('touchend', function (e) { if (!bar.contains(e.target) && !nb.contains(e.target)) later(350); }, { passive: true });
    document.addEventListener('selectionchange', function () { if (!mouseDown) later(isTouch() ? 350 : 250); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { hideBar(); nb.hidden = true; } });
    window.addEventListener('resize', function () { if (!bar.hidden) later(100); });
    document.addEventListener('click', function (e) {
      var t = e.target, sel = window.getSelection(), lab = t.closest && t.closest('label');
      // bôi đen chữ trong một đáp án không được tự chọn đáp án đó
      if (lab && !isTouch() && sel && !sel.isCollapsed && lab.contains(sel.anchorNode)) { e.preventDefault(); return; }
      var m = t.closest && t.closest('mark.hl');
      if (m && !m.closest('label,a,button,.opt') && !(sel && String(sel).trim())) { e.stopPropagation(); openNote(m); }
    }, true);
    // nút "Xoá tô sáng" của từng passage (IELTS)
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-clear]'); if (!b) return;
      var ps = b.closest('.passage'), c0 = window.confirm;
      window.confirm = function (msg) { window.confirm = c0; var ok = c0.call(window, msg); if (ok && ps) setTimeout(function () { [].forEach.call(ps.querySelectorAll('mark.hl'), unwrap); save(); }, 0); return ok; };
      setTimeout(function () { window.confirm = c0; save(); }, 0);
    }, true);
    if (window.MutationObserver) new MutationObserver(function () { clearTimeout(init.t); init.t = setTimeout(function () { restore(); hints(); }, 60); }).observe(document.body, { childList: true, subtree: true });
  }
  function hints() {
    var h = document.querySelector('#main .pt-head');
    if (h && !h.querySelector('.mhl-hint')) { var s = document.createElement('span'), k = h.querySelector('.lkhint'); s.className = 'mhl-hint'; s.textContent = (k ? ' · ' : '') + '🖍 Bôi đen chữ để tô vàng / ghi chú'; (k || h).appendChild(s); }
    [].forEach.call(document.querySelectorAll('.sect .part'), function (p) {
      var t = p.querySelector('.part-title'); if (!t || p.querySelector('.ptools')) return;
      var d = document.createElement('div'); d.className = 'ptools'; d.innerHTML = '<span>Bôi đen chữ trong câu hỏi hoặc lời thoại để tô vàng hoặc ghi chú.</span>'; t.insertAdjacentElement('afterend', d);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
/* Có gì mới: link trên thanh menu + trong bảng ⚙, và thẻ nhắc nhỏ khi web có cập nhật (dữ liệu ở cap-nhat.js). Dùng chung web TOEIC và IELTS. */
(function () {
  'use strict';
  if (/\/summary-(new|old)\//.test((document.currentScript && document.currentScript.src) || '')) return; // bản cho web TOEIC/IELTS; web Tóm tắt dùng bản ngay dưới
  var cs = document.currentScript, src = (cs && cs.src) || '';
  if (!src) { var ss = document.querySelectorAll('script[src*="ui.js"]'); if (ss.length) src = ss[ss.length - 1].src; }
  var mm = /^(.*\/)(assets|shared)\/ui\.js/.exec(src); if (!mm) return;
  var ROOT = mm[1], HREF = ROOT + 'cap-nhat.html', KEY = 'mt.seenUpdate', P = location.pathname;
  if ((cs && cs.getAttribute('data-site') === 'summary') || location.href.indexOf(ROOT) !== 0) return;
  var NEWS = /\/cap-nhat\.html$/.test(P);
  var QUIET = !!window.MEXAM || document.documentElement.hasAttribute('data-exam') || /\/(test\.html|test-\d+\.html|ws\.html|mini\.html|xep-lop\.html|chinh-ta\.html|go-tu\.html|phan-xa\.html)$/.test(P);
  function g(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function s(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  // đã từng dùng web chưa? (chụp lúc tải trang, trước khi ui.js tự ghi huy hiệu / hướng dẫn lần đầu)
  var used = false;
  try { for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k !== KEY && /^(mt\.|ets26\.|cam\d*\.|vocab\.)/.test(k)) { used = true; break; } } } catch (e) {}
  var SPARK = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 3l1.9 5.6L18.5 10.5l-5.6 1.9L11 18l-1.9-5.6L3.5 10.5l5.6-1.9z"/><path d="M19 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/></svg>';
  var st = document.createElement('style');
  st.textContent =
    '.mlinks a.mnew-l{position:relative}.mlinks a.mnew-l.mn-dot::after{content:"";position:absolute;top:6px;right:5px;width:7px;height:7px;border-radius:50%;background:#e0483a;box-shadow:0 0 0 2px var(--card,#fff)}' +
    '@media (min-width:761px) and (max-width:1359px){.mlinks a.mnew-l{padding-left:9px;padding-right:9px}.mlinks a.mnew-l span{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}.mlinks a.mnew-l .ic{display:inline-block;width:1.25em;height:1.25em}}' +
    '@media (max-width:960px){.mlinks a.mnew-l{display:none}}' +
    'a.mp-new{text-decoration:none;box-sizing:border-box}a.mp-new.mn-dot::after{content:"mới";font:700 10.5px/1 "IBM Plex Sans",sans-serif;background:#e0483a;color:#fff;border-radius:999px;padding:3px 6px 2px;margin-left:2px}' +
    '.mnew{position:fixed;z-index:96;left:20px;bottom:20px;width:340px;max-width:calc(100vw - 24px);box-sizing:border-box;background:var(--card,#fff);color:var(--ink,#1e232b);border:1px solid var(--line,#ddd7c9);border-left:4px solid var(--brand,#a8691a);border-radius:14px;padding:13px 15px 12px;box-shadow:0 14px 40px rgba(0,0,0,.18);font:14px/1.45 "IBM Plex Sans",system-ui,sans-serif;animation:mnewin .4s cubic-bezier(.2,.9,.3,1.2)}' +
    '.mnew-k{display:block;font-size:12.5px;font-weight:700;letter-spacing:.02em;color:var(--brand-ink,#6b4410);margin:0 26px 3px 0}.mnew-t{display:block;font:600 16.5px/1.3 Fraunces,Georgia,serif;margin:0 0 6px}' +
    '.mnew ul{margin:0 0 10px;padding-left:18px;color:var(--ink,#1e232b)}.mnew li{margin:3px 0;font-size:13.5px}' +
    '.mnew-x{position:absolute;top:8px;right:8px;width:30px;height:30px;border:0;border-radius:50%;background:none;color:var(--dim,#666e7a);font-size:15px;cursor:pointer}.mnew-x:hover{background:var(--panel2,#f2efe8)}' +
    '.mnew-b{display:flex;gap:8px}.mnew-b a,.mnew-b button{flex:1;display:flex;align-items:center;justify-content:center;min-height:38px;border-radius:10px;font:700 13.5px/1 "IBM Plex Sans",sans-serif;cursor:pointer;text-decoration:none;box-sizing:border-box}' +
    '.mnew-all{background:var(--brand,#a8691a);border:1px solid var(--brand,#a8691a);color:#fff}.mnew-ok{background:var(--panel2,#f2efe8);border:1px solid var(--line,#ddd7c9);color:var(--ink,#1e232b)}' +
    '.mnew :focus-visible{outline:3px solid var(--brand,#a8691a);outline-offset:2px}' +
    'html[data-theme=dark] .mnew{box-shadow:0 14px 40px rgba(0,0,0,.55)}html[data-skin=scifi] .mnew{border-color:#2e4377;border-left-color:#4ad7ff}html[data-skin=scifi] .mnew-k{color:#4ad7ff}' +
    'html[data-skin=scifi] .mnew-all{color:#1a1240;background:linear-gradient(180deg,#ffe36b,#ffc21a);border-color:#ffc21a}' +
    '@media (max-width:760px){.mnew{left:12px;right:12px;width:auto;margin:0 auto;bottom:calc(14px + env(safe-area-inset-bottom))}body.has-nav .mnew{bottom:calc(78px + env(safe-area-inset-bottom))}}' +
    '@keyframes mnewin{from{opacity:0;transform:translateY(16px)}}@media (prefers-reduced-motion:reduce){.mnew{animation:none}}';
  document.head.appendChild(st);
  // link trên thanh menu (màn hình rộng; điện thoại / máy tính bảng thanh menu đã chật nên link nằm trong bảng ⚙)
  var ml = document.querySelector('.mlinks');
  if (ml && !ml.querySelector('.mnew-l')) {
    var a = document.createElement('a'); a.className = 'mnew-l'; a.href = HREF; a.title = 'Có gì mới'; a.innerHTML = SPARK + '<span>Có gì mới</span>';
    if (NEWS) a.setAttribute('aria-current', 'page');
    ml.appendChild(a);
  }
  // nút trong bảng ⚙ (có ở mọi trang, kể cả trang làm bài)
  var unseen = false;
  function addPop(p) {
    if (p.querySelector('.mp-new')) return;
    var first = p.querySelector('.mp-tour'); if (!first) return;
    var b = document.createElement('a'); b.className = 'mp-tour mp-new' + (unseen ? ' mn-dot' : ''); b.href = HREF; b.innerHTML = SPARK + ' Có gì mới';
    first.insertAdjacentElement('afterend', b);
  }
  if (window.MutationObserver) new MutationObserver(function (ms) {
    ms.forEach(function (m) { [].forEach.call(m.addedNodes, function (n) {
      if (n.nodeType !== 1 || !n.classList.contains('mpop')) return;
      addPop(n); new MutationObserver(function () { addPop(n); }).observe(n, { childList: true });
    }); });
  }).observe(document.body, { childList: true });
  // dữ liệu cập nhật
  function ready(U) {
    var top = U && U[0]; if (!top || !top.id) return;
    if (NEWS || !used) { s(KEY, top.id); return; }
    if (g(KEY) === top.id) return;
    unseen = true;
    var l = document.querySelector('.mlinks a.mnew-l'); if (l) { l.classList.add('mn-dot'); l.title = 'Có gì mới · có cập nhật mới'; }
    if (!QUIET) later(top);
  }
  function seen(id) { s(KEY, id); unseen = false; [].forEach.call(document.querySelectorAll('.mnew-l.mn-dot,.mp-new.mn-dot'), function (e) { e.classList.remove('mn-dot'); }); }
  function busy() { return !!document.querySelector('.mtour,.mtoast,.fbk,.mgc,.mpop,.mhl-note:not([hidden])') || document.hidden; }
  function later(top) {
    var n = 0;
    function go() {
      if (document.querySelector('.mnew')) return;
      if (busy()) { if (++n < 60) setTimeout(go, 1500); return; }
      show(top);
    }
    if (document.readyState === 'complete') setTimeout(go, 2200); else addEventListener('load', function () { setTimeout(go, 2200); });
  }
  function show(top) {
    var d = document.createElement('div'); d.className = 'mnew'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', 'Có gì mới trên web');
    var items = (top.items || []).slice(0, 2);
    d.innerHTML = '<button type="button" class="mnew-x" aria-label="Đóng, đã xem">✕</button><b class="mnew-k">✨ Có gì mới (' + esc(String(top.date || '').slice(0, 5)) + ')</b><strong class="mnew-t">' + esc(top.title) + '</strong>' +
      (items.length ? '<ul>' + items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' : '') +
      '<div class="mnew-b"><a class="mnew-all" href="' + esc(HREF) + '">Xem tất cả</a><button type="button" class="mnew-ok">Đã xem</button></div>';
    function close() { seen(top.id); d.remove(); }
    d.querySelector('.mnew-x').onclick = close; d.querySelector('.mnew-ok').onclick = close;
    d.querySelector('.mnew-all').onclick = function () { seen(top.id); };
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    document.body.appendChild(d);
  }
  if (window.MT_UPDATES) ready(window.MT_UPDATES);
  else if (!QUIET || !used) {
    var sc = document.createElement('script'); sc.src = ROOT + 'cap-nhat.js?v=1'; sc.async = true;
    sc.onload = function () { ready(window.MT_UPDATES); };
    document.head.appendChild(sc);
  }
  window.MNEWS_SEEN = function () { var U = window.MT_UPDATES; if (U && U[0]) seen(U[0].id); };
})();
/* Có gì mới: link trên thanh menu + trong bảng ⚙, và thẻ nhắc nhỏ khi web có cập nhật (dữ liệu ở cap-nhat.js). Bản cho web Tóm tắt kiến thức (summary-new / summary-old). */
(function () {
  'use strict';
  if (!/\/summary-(new|old)\//.test((document.currentScript && document.currentScript.src) || '')) return; // bản cho web Tóm tắt kiến thức
  var cs = document.currentScript, src = (cs && cs.src) || '';
  if (!src) { var ss = document.querySelectorAll('script[src*="ui.js"]'); if (ss.length) src = ss[ss.length - 1].src; }
  var mm = /^(.*\/)assets\/ui\.js/.exec(src); if (!mm) return;
  var ROOT = mm[1], HREF = ROOT + 'cap-nhat.html', P = location.pathname;
  if (location.href.indexOf(ROOT) !== 0) return;
  // mỗi web một khoá riêng (summaryNew / summaryOld), không lẫn với web TOEIC / IELTS cùng tên miền
  var PRE = window.SN_PREFIX || (/summary-old\//.test(ROOT) ? 'summaryOld' : 'summaryNew'), KEY = PRE + '.seenUpdate';
  var NEWS = /\/cap-nhat\.html$/.test(P);
  var QUIET = false; // web tóm tắt không có trang làm bài tính giờ; khi đang mở flashcard thì thẻ nhắc tự chờ (xem busy)
  function g(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function s(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  // đã từng dùng web này chưa? (đã nhập mã lớp, đánh dấu đã ôn, hoặc có tiến độ flashcard của web này)
  var used = false;
  try {
    var FC = 'summaryNew.fc.' + new URL(ROOT).pathname;
    used = !!(g(PRE + '.lop') || g(PRE + '.gv') || g(PRE + '.done'));
    for (var i = 0; !used && i < localStorage.length; i++) { var k = localStorage.key(i); if (k && k.indexOf(FC) === 0) used = true; }
  } catch (e) {}
  var SPARK = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 3l1.9 5.6L18.5 10.5l-5.6 1.9L11 18l-1.9-5.6L3.5 10.5l5.6-1.9z"/><path d="M19 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/></svg>';
  var st = document.createElement('style');
  st.textContent =
    '.mlinks a.mnew-l{position:relative}.mlinks a.mnew-l.mn-dot::after{content:"";position:absolute;top:6px;right:5px;width:7px;height:7px;border-radius:50%;background:#e0483a;box-shadow:0 0 0 2px var(--card,#fff)}' +
    '@media (min-width:761px) and (max-width:1359px){.mlinks a.mnew-l{padding-left:9px;padding-right:9px}.mlinks a.mnew-l span{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}.mlinks a.mnew-l .ic{display:inline-block;width:1.25em;height:1.25em}}' +
    '@media (max-width:960px){.mlinks a.mnew-l{display:none}}' +
    'a.mp-new{text-decoration:none;box-sizing:border-box}a.mp-new.mn-dot::after{content:"mới";font:700 10.5px/1 "IBM Plex Sans",sans-serif;background:#e0483a;color:#fff;border-radius:999px;padding:3px 6px 2px;margin-left:2px}' +
    '.mnew{position:fixed;z-index:96;left:20px;bottom:20px;width:340px;max-width:calc(100vw - 24px);box-sizing:border-box;background:var(--card,#fff);color:var(--ink,#1e232b);border:1px solid var(--line,#ddd7c9);border-left:4px solid var(--brand,#a8691a);border-radius:14px;padding:13px 15px 12px;box-shadow:0 14px 40px rgba(0,0,0,.18);font:14px/1.45 "IBM Plex Sans",system-ui,sans-serif;animation:mnewin .4s cubic-bezier(.2,.9,.3,1.2)}' +
    '.mnew-k{display:block;font-size:12.5px;font-weight:700;letter-spacing:.02em;color:var(--brand-ink,#6b4410);margin:0 26px 3px 0}.mnew-t{display:block;font:600 16.5px/1.3 Fraunces,Georgia,serif;margin:0 0 6px}' +
    '.mnew ul{margin:0 0 10px;padding-left:18px;color:var(--ink,#1e232b)}.mnew li{margin:3px 0;font-size:13.5px}' +
    '.mnew-x{position:absolute;top:8px;right:8px;width:30px;height:30px;border:0;border-radius:50%;background:none;color:var(--dim,#666e7a);font-size:15px;cursor:pointer}.mnew-x:hover{background:var(--panel2,#f2efe8)}' +
    '.mnew-b{display:flex;gap:8px}.mnew-b a,.mnew-b button{flex:1;display:flex;align-items:center;justify-content:center;min-height:38px;border-radius:10px;font:700 13.5px/1 "IBM Plex Sans",sans-serif;cursor:pointer;text-decoration:none;box-sizing:border-box}' +
    '.mnew-all{background:var(--brand,#a8691a);border:1px solid var(--brand,#a8691a);color:#fff}.mnew-ok{background:var(--panel2,#f2efe8);border:1px solid var(--line,#ddd7c9);color:var(--ink,#1e232b)}' +
    '.mnew :focus-visible{outline:3px solid var(--brand,#a8691a);outline-offset:2px}' +
    'body:has(.fc-bg.on) .mnew,body.gated .mnew{display:none}' +
    'html[data-theme=dark] .mnew{box-shadow:0 14px 40px rgba(0,0,0,.55)}html[data-skin=scifi] .mnew{border-color:#2e4377;border-left-color:#4ad7ff}html[data-skin=scifi] .mnew-k{color:#4ad7ff}' +
    'html[data-skin=scifi] .mnew-all{color:#1a1240;background:linear-gradient(180deg,#ffe36b,#ffc21a);border-color:#ffc21a}' +
    '@media (max-width:760px){.mnew{left:12px;right:12px;width:auto;margin:0 auto;bottom:calc(14px + env(safe-area-inset-bottom))}body.has-nav .mnew{bottom:calc(78px + env(safe-area-inset-bottom))}}' +
    '@keyframes mnewin{from{opacity:0;transform:translateY(16px)}}@media (prefers-reduced-motion:reduce){.mnew{animation:none}}';
  document.head.appendChild(st);
  // link trên thanh menu (màn hình rộng; điện thoại / máy tính bảng thanh menu đã chật nên link nằm trong bảng ⚙)
  var ml = document.querySelector('.mlinks');
  if (ml && !ml.querySelector('.mnew-l')) {
    var a = document.createElement('a'); a.className = 'mnew-l'; a.href = HREF; a.title = 'Có gì mới'; a.innerHTML = SPARK + '<span>Có gì mới</span>';
    if (NEWS) a.setAttribute('aria-current', 'page');
    ml.appendChild(a);
  }
  // nút trong bảng ⚙
  var unseen = false;
  function addPop(p) {
    if (p.querySelector('.mp-new')) return;
    var first = p.querySelector('.mp-tour'); if (!first) return;
    var b = document.createElement('a'); b.className = 'mp-tour mp-new' + (unseen ? ' mn-dot' : ''); b.href = HREF; b.innerHTML = SPARK + ' Có gì mới';
    first.insertAdjacentElement('afterend', b);
  }
  if (window.MutationObserver) new MutationObserver(function (ms) {
    ms.forEach(function (m) { [].forEach.call(m.addedNodes, function (n) {
      if (n.nodeType !== 1 || !n.classList.contains('mpop')) return;
      addPop(n); new MutationObserver(function () { addPop(n); }).observe(n, { childList: true });
    }); });
  }).observe(document.body, { childList: true });
  // dữ liệu cập nhật
  function ready(U) {
    var top = U && U[0]; if (!top || !top.id) return;
    if (NEWS || !used) { s(KEY, top.id); return; }
    if (g(KEY) === top.id) return;
    unseen = true;
    var l = document.querySelector('.mlinks a.mnew-l'); if (l) { l.classList.add('mn-dot'); l.title = 'Có gì mới · có cập nhật mới'; }
    if (!QUIET) later(top);
  }
  function seen(id) { s(KEY, id); unseen = false; [].forEach.call(document.querySelectorAll('.mnew-l.mn-dot,.mp-new.mn-dot'), function (e) { e.classList.remove('mn-dot'); }); }
  // chờ khi: đang ở màn nhập mã lớp, trang bài bị khoá, đang mở flashcard, bảng ⚙ / góp ý / thông báo khác đang mở
  function busy() { return !!document.querySelector('body.gated,html.sn-lock,.fc-bg.on,.mtour,.mtoast,.fbk,.mgc,.mpop') || document.hidden; }
  function later(top) {
    var n = 0;
    function go() {
      if (document.querySelector('.mnew')) return;
      if (busy()) { if (++n < 60) setTimeout(go, 1500); return; }
      show(top);
    }
    if (document.readyState === 'complete') setTimeout(go, 2200); else addEventListener('load', function () { setTimeout(go, 2200); });
  }
  function show(top) {
    var d = document.createElement('div'); d.className = 'mnew'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', 'Có gì mới trên web');
    var items = (top.items || []).slice(0, 2);
    d.innerHTML = '<button type="button" class="mnew-x" aria-label="Đóng, đã xem">✕</button><b class="mnew-k">✨ Có gì mới (' + esc(String(top.date || '').slice(0, 5)) + ')</b><strong class="mnew-t">' + esc(top.title) + '</strong>' +
      (items.length ? '<ul>' + items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' : '') +
      '<div class="mnew-b"><a class="mnew-all" href="' + esc(HREF) + '">Xem tất cả</a><button type="button" class="mnew-ok">Đã xem</button></div>';
    function close() { seen(top.id); d.remove(); }
    d.querySelector('.mnew-x').onclick = close; d.querySelector('.mnew-ok').onclick = close;
    d.querySelector('.mnew-all').onclick = function () { seen(top.id); };
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    document.body.appendChild(d);
  }
  if (window.MT_UPDATES) ready(window.MT_UPDATES);
  else {
    var sc = document.createElement('script'); sc.src = ROOT + 'cap-nhat.js?v=1'; sc.async = true;
    sc.onload = function () { ready(window.MT_UPDATES); };
    document.head.appendChild(sc);
  }
  window.MNEWS_SEEN = function () { var U = window.MT_UPDATES; if (U && U[0]) seen(U[0].id); };
})();
/* Đang online: đếm số bạn đang mở web (Firebase Realtime Database, online/<web>/<mã tab>) + Google Analytics 4. Dùng chung 4 web; khối này giống hệt nhau ở cả 4 file ui.js. */
(function () {
  'use strict';
  var GA_ID = 'G-WTQLYLYL0G'; // mã đo lường GA4 (G-XXXXXXXXXX); còn bắt đầu bằng '__' thì không chạy GA
  try {
    if (window.__mlive) return; window.__mlive = 1;
    if (!/(^|\.)github\.io$/.test(location.hostname)) return; // chỉ đếm trên web thật, không đếm khi chạy thử trên máy
    var me0 = document.currentScript && document.currentScript.src || '', mm = /\/(toeic|cam|summary-new|summary-old)\/(?:docs\/)?(?:assets|shared)\/ui\.js/.exec(me0.split('?')[0]);
    if (!mm) return;
    var SITE = mm[1], SITES = ['toeic', 'cam', 'summary-new', 'summary-old'], NAME = { toeic: 'TOEIC ETS', cam: 'IELTS Cam', 'summary-new': 'TOEIC Pre (mới)', 'summary-old': 'TOEIC Pre (cũ)' };
    var SDK = 'https://www.gstatic.com/firebasejs/10.12.2/', DBURL = 'https://minto-english-default-rtdb.asia-southeast1.firebasedatabase.app';
    var CFG = { apiKey: 'AIzaSyA7LEweMPy4tSjjR_An_KZaGXSzGI2nQv4', authDomain: 'minto-english.firebaseapp.com', databaseURL: DBURL, projectId: 'minto-english', messagingSenderId: '160119750089', appId: '1:160119750089:web:aac59cf8b1f577c035bc18' };
    var FRESH = 180000, STALE = 900000, PATH = location.pathname;
    var EXAM = !!window.MEXAM || document.documentElement.hasAttribute('data-exam') || /\/(test|test-\d+|mini|xep-lop|ws|chinh-ta|go-tu|phan-xa)\.html$/.test(PATH);
    var base = (PATH.split('/').pop() || '').replace(/\.html$/, '');
    var KIND = EXAM ? 'test' : (!base || base === 'index') ? 'home' : /^summary/.test(SITE) ? 'lesson' : (base.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 20) || 'page');
    var TEACHER = false;
    try { TEACHER = /[?&]gv(=|&|$)/.test(location.search) || localStorage.getItem('summaryNew.gv') === '1' || localStorage.getItem('summaryOld.gv') === '1'; } catch (e) {}
    var ID = '';
    try { ID = sessionStorage.getItem('mlive.id') || ''; } catch (e) {}
    if (!/^[A-Za-z0-9_-]{16}$/.test(ID)) {
      var abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-', rnd = new Uint8Array(16); ID = '';
      try { crypto.getRandomValues(rnd); } catch (e) { for (var r = 0; r < 16; r++) rnd[r] = Math.random() * 256; }
      for (var j = 0; j < 16; j++) ID += abc.charAt(rnd[j] & 63);
      try { sessionStorage.setItem('mlive.id', ID); } catch (e) {}
    }
    var imp = null; try { imp = new Function('u', 'return import(u)'); } catch (e) {} // trình duyệt cũ không hiểu import(): bỏ qua, không làm hỏng ui.js
    function later(fn, ms) {
      function go() { setTimeout(function () { try { if (window.requestIdleCallback) requestIdleCallback(function () { try { fn(); } catch (e) {} }, { timeout: 3000 }); else fn(); } catch (e) {} }, ms || 0); }
      if (document.readyState === 'complete') go(); else addEventListener('load', go);
    }

    // ---------- Google Analytics 4 ----------
    if (GA_ID && GA_ID.indexOf('__') !== 0) later(function () {
      if (window.gtag) { var dl = window.dataLayer || [], has = false; for (var i = 0; i < dl.length; i++) if (dl[i] && dl[i][0] === 'config' && dl[i][1] === GA_ID) has = true; if (!has) window.gtag('config', GA_ID, { site: SITE }); return; }
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date()); window.gtag('config', GA_ID, { site: SITE });
      var gs = document.createElement('script'); gs.async = true; gs.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID); gs.onerror = function () {}; document.head.appendChild(gs);
    }, 500);

    // ---------- Firebase (tải khi cần, app riêng tên 'live' để không đụng app của acc.js) ----------
    var dbP = null, D = null, db = null;
    function load() {
      if (dbP) return dbP;
      if (!imp) return (dbP = Promise.reject(new Error('no import')));
      dbP = Promise.all([imp(SDK + 'firebase-app.js'), imp(SDK + 'firebase-database.js')]).then(function (m) {
        var A = m[0], app = null; D = m[1];
        try { app = A.getApp('live'); } catch (e) { app = A.initializeApp(CFG, 'live'); }
        db = D.getDatabase(app, DBURL); return db;
      });
      dbP.catch(function () {});
      return dbP;
    }
    // ---------- lịch sử xem trang (log/<web>) + học viên đã đăng nhập đang online (who/<web>, chỉ thầy đọc được) ----------
    // Đã đăng nhập Google (acc.js): ghi bằng app mặc định của acc.js (có auth) để luật kiểm tra e == email đăng nhập.
    // Chưa đăng nhập: ghi log bằng app 'live', không có e/n, không ghi who. online/<web> không bao giờ chứa email/tên.
    var aDb = null, aUser = null, who = null, aLive = false, aOff = false, logged = false;
    function clip(s, n) { return String(s == null ? '' : s).slice(0, n); }
    function authUser(wait) {
      // wait: máy đã từng đăng nhập (mt.acc) lúc mở trang — đợi acc.js xác định xong (tối đa ~12 giây)
      return new Promise(function (ok) {
        var t0 = Date.now(), done = false;
        function fin(u) { if (!done) { done = true; ok(u || null); } }
        setTimeout(fin, 15000);
        (function poll() {
          var M = window.MACC;
          if (!M || !M.ready) return wait && Date.now() - t0 < 12000 ? setTimeout(poll, 400) : fin(null);
          if (!wait && !(M.user && M.user())) return fin(null);
          M.ready().then(function (fb) {
            var au = fb && fb.auth;
            if (!au) return fin(null);
            return (au.authStateReady ? au.authStateReady() : Promise.resolve()).then(function () {
              var u = au.currentUser;
              if (!u || !u.email || u.email.length > 120) return fin(null);
              if (!aDb) {
                aDb = D.getDatabase(fb.app, DBURL);
                D.onValue(D.ref(aDb, '.info/connected'), function (s) { aLive = s.val() === true; if (aLive && who) D.onDisconnect(who).remove().then(whoW, function () {}); }, function () {});
              }
              fin(u);
            });
          }).catch(function () { fin(null); });
        })();
      });
    }
    // mã lớp (chỉ web Tóm tắt): gửi kèm để thầy xem bạn nào thuộc lớp nào; nếu máy chủ không nhận trường mới thì gửi lại như cũ
    function lopNow() {
      if (!/^summary/.test(SITE)) return '';
      try { var c = window.SN && window.SN.current && window.SN.current(); if (c && c.ma) return clip(c.ma, 24); } catch (e) {}
      try { return clip(localStorage.getItem((SITE === 'summary-new' ? 'summaryNew' : 'summaryOld') + '.lop') || '', 24); } catch (e) { return ''; }
    }
    function withLop(v, send) {
      var l = lopNow(); if (!l) return send(v);
      var v2 = {}; for (var k in v) v2[k] = v[k]; v2.l = l;
      return send(v2).catch(function () { return send(v); });
    }
    function whoW() {
      if (!who || !aUser || !aLive || aOff || offline || document.hidden) return;
      var w = who;
      withLop({ e: aUser.email, n: clip(aUser.displayName, 60), t: D.serverTimestamp(), u: clip(PATH, 120) }, function (v) { return D.set(w, v); }).catch(function () {});
    }
    function acct(wait) {
      return authUser(wait).then(function (u) {
        if (u && (!aUser || aUser.uid !== u.uid)) {
          aUser = u; who = D.ref(aDb, 'who/' + SITE + '/' + ID);
          if (aOff) { aOff = false; if (!offline) D.goOnline(aDb); }
          else if (aLive) D.onDisconnect(who).remove().then(whoW, function () {});
        } else if (!u && aUser) {
          // vừa đăng xuất: ngắt kết nối có auth, máy chủ tự xoá who (onDisconnect)
          aUser = null; who = null;
          if (!aOff) { aOff = true; if (!offline) D.goOffline(aDb); }
        }
        return u;
      }).catch(function () { return null; });
    }
    function logOnce() {
      if (logged) return; logged = true;
      var had = false; try { had = !!localStorage.getItem('mt.acc'); } catch (e) {}
      (had ? acct(true) : Promise.resolve(null)).then(function (u) {
        var v = { t: D.serverTimestamp(), k: KIND, u: clip(PATH, 120), i: ID };
        if (u) { v.e = u.email; v.n = clip(u.displayName, 60); }
        var ref = D.ref(u ? aDb : db, 'log/' + SITE);
        return withLop(v, function (x) { return D.push(ref, x); });
      }).catch(function () {});
    }
    function count(val, now, skip) {
      var n = 0, k, v;
      if (val && typeof val === 'object') for (k in val) { v = val[k]; if (k !== skip && v && typeof v.t === 'number' && v.t >= now - FRESH) n++; }
      return n;
    }
    // thầy: đếm cả 4 web — MLIVE_ALL().then(console.log)
    window.MLIVE_ALL = function () {
      return load().then(function () {
        var now = Date.now() + off;
        return Promise.all(SITES.map(function (s) { return D.get(D.ref(db, 'online/' + s)).then(function (sn) { return count(sn.val(), now, ''); }, function () { return null; }); }));
      }).then(function (a) { var o = {}; SITES.forEach(function (s, i) { o[s] = a[i]; }); return o; });
    };

    // ---------- giao diện: viên "đang học" trên thanh menu ----------
    var pill = null, others = -1, off = 0, all = null, tip = '';
    function css() {
      var s = document.createElement('style');
      s.textContent =
        '.mlive{display:inline-flex;align-items:center;gap:7px;flex:none;height:30px;box-sizing:border-box;padding:0 11px 0 10px;border-radius:999px;border:1px solid rgba(31,143,108,.28);border:1px solid color-mix(in srgb,var(--ok,#1f8f6c) 28%,transparent);background:var(--ok-soft,#e1f4ec);color:var(--ink,#1e232b);font:600 12.5px/1 "IBM Plex Sans",system-ui,sans-serif;white-space:nowrap;cursor:default;user-select:none}' +
        '.mlive[hidden]{display:none!important}.mlive-n{font-weight:700;font-variant-numeric:tabular-nums}.mlive-t{font-weight:500;color:var(--dim,#4b5260)}' +
        '.mlive i{position:relative;width:8px;height:8px;border-radius:50%;background:var(--ok,#1f8f6c);flex:none}' +
        '.mlive.cpt{padding:0 9px 0 8px;gap:6px}.mlive.cpt .mlive-t{display:none}' +
        '.mbrand small .mlive{height:16px;margin:-3px 0 -2px 8px;padding:0 7px 0 6px;gap:4px;vertical-align:middle;letter-spacing:0;font-size:10.5px;border-width:1px}.mbrand small .mlive i{width:6px;height:6px}.mbrand small .mlive.cpt{padding:0 6px 0 5px}' +
        '@media (prefers-reduced-motion:no-preference){.mlive i::after{content:"";position:absolute;inset:0;border-radius:50%;background:inherit;animation:mlivep 2.4s ease-out infinite}@keyframes mlivep{0%{transform:scale(1);opacity:.55}70%,100%{transform:scale(2.6);opacity:0}}}' +
        'html[data-theme=dark] .mlive{background:rgba(63,191,143,.14);border-color:rgba(63,191,143,.4);background:color-mix(in srgb,var(--ok,#3fbf8f) 14%,transparent);border-color:color-mix(in srgb,var(--ok,#3fbf8f) 40%,transparent)}html[data-theme=dark] .mlive-t{color:var(--dim,#9aa1ad)}' +
        'html[data-skin=scifi] .mlive{background:rgba(74,215,255,.10);border-color:rgba(74,215,255,.45);color:#e6ecff;box-shadow:0 0 12px rgba(74,215,255,.18)}html[data-skin=scifi] .mlive i{background:#4ad7ff;box-shadow:0 0 6px #4ad7ff}';
      document.head.appendChild(s);
    }
    // vừa chỗ thì hiện đủ chữ, chật thì chỉ hiện số, vẫn chật nữa thì ẩn (không làm tràn thanh menu)
    function fit() {
      if (!pill) return; var inr = pill.closest('.in') || pill.parentNode;
      function over() { return inr.scrollWidth - inr.clientWidth; }
      pill.hidden = true; var base = Math.max(0, over());
      pill.hidden = false; pill.classList.remove('cpt');
      if (over() > base) pill.classList.add('cpt');
      if (over() > base) pill.hidden = true;
    }
    function paint() {
      if (EXAM || others < 0) return;
      var n = others + 1;
      if (!pill) {
        // đặt cạnh dòng chữ nhỏ ミント英語 dưới logo (thanh menu không phải nới ra); không có thì đặt trước các nút ⚙
        var tl = document.querySelector('.mnav .mbrand small') || document.querySelector('.mnav .mtool'); if (!tl) return;
        css(); pill = document.createElement('span'); pill.className = 'mlive'; pill.setAttribute('lang', 'vi');
        pill.innerHTML = '<i aria-hidden="true"></i><span class="mlive-n"></span><span class="mlive-t"></span>';
        if (tl.classList.contains('mtool')) tl.insertBefore(pill, tl.firstChild); else tl.appendChild(pill);
        var rt = 0; addEventListener('resize', function () { cancelAnimationFrame(rt); rt = requestAnimationFrame(fit); });
        try { document.fonts && document.fonts.ready.then(fit); } catch (e) {}
        setTimeout(fit, 2500);
        if (TEACHER) { teach(); setInterval(teach, 60000); }
      }
      var b = pill.querySelector('.mlive-n'), t = pill.querySelector('.mlive-t'), txt = n + ' bạn đang học', changed = b.textContent !== String(n);
      b.textContent = n; t.textContent = ' bạn đang học';
      tip = n > 1 ? txt + ' trên web này (tính cả bạn)' : 'Lúc này chỉ có bạn đang học trên web này';
      pill.setAttribute('aria-label', txt);
      pill.title = tip + (all ? '\n— Cả 4 web —\n' + SITES.map(function (s) { return NAME[s] + ': ' + (all[s] == null ? '?' : all[s]); }).join('\n') : '');
      if (changed) fit();
    }
    function teach() { window.MLIVE_ALL().then(function (o) { all = o; paint(); }, function () {}); }

    // ---------- có mặt ----------
    var me = null, live = false, ever = false, offline = false, hideT = 0, beat = 0, cleaned = {}, last = null, tick = 0;
    function write() {
      if (!me || !live || offline || document.hidden) return;
      D.set(me, { t: D.serverTimestamp(), p: KIND }).catch(function () {});
      whoW();
    }
    function seen(val) {
      last = val; var now = Date.now() + off;
      others = count(val, now, ID);
      if (val && typeof val === 'object') {
        var n = 0;
        for (var k in val) {
          var v = val[k];
          if (k === ID || cleaned[k] || n >= 5 || !/^[A-Za-z0-9_-]{8,32}$/.test(k)) continue;
          if (v && typeof v.t === 'number' && v.t < now - STALE) { cleaned[k] = 1; n++; D.remove(D.ref(db, 'online/' + SITE + '/' + k)).catch(function () {}); }
        }
      }
      paint();
    }
    function sleep() { try { offline = true; if (me && live) D.remove(me).catch(function () {}); D.goOffline(db); if (aDb && !aOff) D.goOffline(aDb); } catch (e) {} }
    function wake() { try { if (offline) { offline = false; D.goOnline(db); if (aDb && !aOff) D.goOnline(aDb); } else write(); } catch (e) {} }
    function start() {
      load().then(function () {
        me = D.ref(db, 'online/' + SITE + '/' + ID);
        D.onValue(D.ref(db, '.info/serverTimeOffset'), function (s) { var v = s.val(); if (typeof v === 'number') off = v; }, function () {});
        D.onValue(D.ref(db, '.info/connected'), function (s) {
          live = s.val() === true; if (!live) return; ever = true;
          D.onDisconnect(me).remove().then(write, function () {});
          logOnce();
        }, function () {});
        D.onValue(D.ref(db, 'online/' + SITE), function (s) { seen(s.val()); }, function () {});
        beat = setInterval(function () { write(); acct(false); }, 60000);
        // đăng nhập / đăng xuất ngay trên trang này: acc.js gọi MACCPAINT mỗi lần đổi trạng thái
        var mp = window.MACCPAINT;
        if (typeof mp === 'function' && !mp.mlive) { window.MACCPAINT = function () { var r = mp.apply(this, arguments); try { acct(false); } catch (e) {} return r; }; window.MACCPAINT.mlive = 1; }
        tick = setInterval(function () { if (last !== null && !document.hidden) seen(last); }, 30000);
        // không kết nối được (mạng chặn…) sau 45 giây: thôi thử, đợi lần quay lại tab sau
        setTimeout(function () { if (!ever && !offline) sleep(); }, 45000);
        document.addEventListener('visibilitychange', function () {
          clearTimeout(hideT);
          if (document.hidden) hideT = setTimeout(sleep, 120000);
          else wake();
        });
      }).catch(function () {});
    }
    later(start, 1500);
  } catch (e) {}
})();

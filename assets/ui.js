/* Minto English — thanh menu chung, bộ icon nét, logo. Dùng: <body data-nav="home|mini|stats|dict|cards"> */
(function () {
  'use strict';
  var ME = document.currentScript && document.currentScript.src || '', ROOT = ME.replace(/(assets|shared)\/ui\.js.*$/, '');
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
    '.mbrand small{display:block;font:700 10.5px/1 "IBM Plex Sans",sans-serif;letter-spacing:.12em;color:#a8691a;margin-top:3px}' +
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
    var L = (window.MNAV_LINKS || [['home', '', 'Đề thi', 'test'], ['mini', 'mini.html', 'Đề mini', 'flame'], ['stats', 'phan-tich.html', 'Điểm yếu', 'chart'], ['dict', 'chinh-ta.html', 'Chính tả', 'pen'], ['cards', 'flashcards.html', 'Flashcard', 'cards']]).map(function (l) { return [l[0], ROOT + l[1], l[2], l[3]]; });
    var nav = document.createElement('header'); nav.className = 'mnav';
    nav.innerHTML = '<div class="in"><a class="mbrand" href="' + L[0][1] + '" aria-label="Minto English — trang chủ">' + LOGO + '<span><b>Minto English</b><small>' + (window.MNAV_LABEL || 'TOEIC') + '</small></span></a><nav class="mlinks" aria-label="Menu">' +
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
      w.querySelector('.fbk-card').innerHTML = '<h3>Cảm ơn bạn!</h3><p>Thầy đã nhận được góp ý và sẽ sửa sớm.</p><div class="fbk-row"><button type="button" class="ok">Đóng</button></div>';
      w.querySelector('.ok').onclick = close;
    };
  }
  // nút: trong thanh menu (nếu có) + nút nổi
  var fl = document.createElement('div'); fl.className = 'mfloat';
  fl.innerHTML = '<button type="button" class="mbtn mfb" aria-label="Góp ý, báo lỗi" title="Góp ý / báo lỗi">' + icon('msg') + '</button>' + (document.querySelector('.mnav') ? '' : '<button type="button" class="mbtn mtheme"></button>');
  document.body.appendChild(fl);
  var navIn = document.querySelector('.mnav .in');
  if (navIn) { var tl = document.createElement('div'); tl.className = 'mtool'; tl.innerHTML = '<button type="button" class="mbtn mtheme"></button>'; navIn.appendChild(tl); }
  [].forEach.call(document.querySelectorAll('.mtheme'), function (b) { b.onclick = toggleTheme; });
  fl.querySelector('.mfb').onclick = feedback;
  applyTheme(theme(), false);
  // hiệu ứng xuất hiện
  if (window.IntersectionObserver && !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('fx-on'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -30px 0px' });
    window.MFX = function (root) { [].forEach.call((root || document).querySelectorAll('.test,.tool,.stat,.panel,.mode,.box,.card,.report,.big,.stop,.book,.cat,.prog-card'), function (el, i) { if (el.classList.contains('fx-in')) return; el.classList.add('fx-in'); el.style.transitionDelay = Math.min(i % 12, 8) * 40 + 'ms'; io.observe(el); }); };
    setTimeout(function () { window.MFX(); }, 30);
  } else window.MFX = function () {};
})();

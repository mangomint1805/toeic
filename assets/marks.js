/* Đánh dấu ★ và ghi chú cá nhân cho từng câu hỏi. Lưu trên máy (localStorage 'mt.marks.toeic'), xem lại ở danh-dau.html */
(function () {
  'use strict';
  var KEY = 'mt.marks.toeic';
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
  var css = document.createElement('style');
  css.textContent =
    '.qmk{margin-left:auto;display:inline-flex;gap:4px;flex:none;align-self:center}' +
    '.qmk button{border:1.5px solid var(--line,#ddd7c9);background:var(--card,#fff);border-radius:999px;min-width:34px;height:30px;padding:0 8px;cursor:pointer;font:600 13px/1 "IBM Plex Sans",sans-serif;color:var(--dim,#666e7a)}' +
    '.qmk button:hover{border-color:var(--brand,#a8691a)}' +
    '.qmk .qstar.on{background:#ffc94a;border-color:#e0a520;color:#5a3a00}' +
    '.qmk .qnb.on{background:#e8f6ee;border-color:#58b483;color:#1d6b43}' +
    '.qnote{display:block;margin:6px 0 4px 42px;width:calc(100% - 42px);min-height:56px;border:1.5px dashed var(--line,#ddd7c9);border-radius:10px;padding:8px 10px;font:14px/1.5 "IBM Plex Sans",sans-serif;background:#fffdf6;color:inherit;resize:vertical}' +
    '.qnote:focus{outline:none;border-color:var(--brand,#a8691a);border-style:solid}' +
    'html[data-theme=dark] .qnote{background:rgba(255,255,255,.04)}' +
    '@media(max-width:560px){.qnote{margin-left:0;width:100%}}';
  document.head.appendChild(css);
  var PARTN = function (n) { return n <= 6 ? 1 : n <= 31 ? 2 : n <= 70 ? 3 : n <= 100 ? 4 : n <= 130 ? 5 : n <= 146 ? 6 : 7; };
  function snippet(q, n) {
    var p = q && q.p || PARTN(n);
    var t = q && q.q ? String(q.q) : (p === 1 ? 'Part 1 · mô tả tranh' : p === 2 ? 'Part 2 · hỏi – đáp' : 'Câu ' + n);
    return t.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160);
  }
  function decorate(T, ITEMS) {
    var body = document.getElementById('partBody'); if (!body) return;
    var M = load();
    [].slice.call(body.querySelectorAll('[id^="q"]')).forEach(function (el) {
      var n = parseInt(el.id.slice(1), 10), qt = el.querySelector(':scope > .qt');
      if (!n || !qt || qt.querySelector('.qmk')) return;
      var k = 't' + T + '-' + n, m = M[k] || {};
      var box = document.createElement('span'); box.className = 'qmk';
      box.innerHTML = '<button type="button" class="qstar' + (m.s ? ' on' : '') + '" title="Đánh dấu câu này" aria-pressed="' + !!m.s + '">' + (m.s ? '★' : '☆') + '</button>' +
        '<button type="button" class="qnb' + (m.note ? ' on' : '') + '" title="Ghi chú">📝</button>';
      qt.appendChild(box);
      var ta = null;
      function upd(fn) {
        var A = load(), x = A[k] || { t: T, n: n, p: (ITEMS[n] && ITEMS[n].p) || PARTN(n) };
        fn(x); x.q = snippet(ITEMS[n], n); x.at = Date.now();
        if (!x.s && !x.note) delete A[k]; else A[k] = x;
        save(A); return x;
      }
      function openNote(focus) {
        if (!ta) {
          ta = document.createElement('textarea'); ta.className = 'qnote'; ta.placeholder = 'Ghi chú của bạn cho câu ' + n + ' (bẫy, từ mới, mẹo...) — tự lưu';
          ta.value = (load()[k] || {}).note || '';
          ta.oninput = function () { var x = upd(function (o) { o.note = ta.value.trim() ? ta.value : ''; }); box.lastChild.classList.toggle('on', !!x.note); };
          qt.insertAdjacentElement('afterend', ta);
        } else ta.hidden = !ta.hidden;
        if (focus && !ta.hidden) ta.focus();
      }
      if (m.note) openNote(false);
      box.firstChild.onclick = function (e) {
        e.preventDefault(); e.stopPropagation();
        var x = upd(function (o) { o.s = !o.s; });
        this.classList.toggle('on', !!x.s); this.textContent = x.s ? '★' : '☆'; this.setAttribute('aria-pressed', String(!!x.s));
      };
      box.lastChild.onclick = function (e) { e.preventDefault(); e.stopPropagation(); openNote(true); };
    });
  }
  window.MMARKS = { decorate: decorate, load: load, save: save, KEY: KEY };
})();

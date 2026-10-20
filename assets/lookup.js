/* Bấm vào từ tiếng Anh để tra nghĩa, nghe phát âm và lưu vào bộ flashcard (dùng chung cho web TOEIC và IELTS). */
(function () {
  'use strict';
  var BASE = window.LOOKUP_BASE || 'assets/';
  var CARD_KEY = 'vocab.cards';
  var css = document.createElement('style');
  css.textContent =
    '.vpop{position:absolute;z-index:80;background:#fff;border:1px solid #ddd7c9;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.18);padding:12px 14px;max-width:320px;font:14.5px/1.5 "IBM Plex Sans",system-ui,sans-serif;color:#1e232b}' +
    '.vpop .w{font:600 19px/1.2 Fraunces,Georgia,serif;color:#6b4410;margin-right:24px}' +
    '.vpop .i{color:#666e7a;font-size:13.5px;margin:2px 0 6px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}' +
    '.vpop .d{margin:3px 0}.vpop .d b{display:inline-block;min-width:32px;color:#a8691a;font-size:12.5px}' +
    '.vpop .x{position:absolute;top:6px;right:8px;border:0;background:none;font-size:16px;cursor:pointer;color:#666e7a}' +
    '.vpop .s,.vpop .sv{font:600 12.5px/1 "IBM Plex Sans",sans-serif;border:1.5px solid #ddd7c9;background:#fff;border-radius:999px;padding:4px 9px;cursor:pointer;color:#6b4410}' +
    '.vpop .sv.on{background:#a8691a;border-color:#a8691a;color:#fff}' +
    '.vpop .src{font-size:11.5px;color:#999;margin-top:6px}' +
    '.vpop .acts{margin-top:8px;display:flex;gap:6px;align-items:center;flex-wrap:wrap}.vpop .acts a{font-size:12.5px;color:#6b4410}' +
    '::highlight(vpick){background:#f2c879;color:inherit}';
  document.head.appendChild(css);

  var W = null, wQ = [], wLoading = false;
  function loadWords(cb) {
    if (W) return cb(); wQ.push(cb); if (wLoading) return; wLoading = true;
    var s = document.createElement('script'); s.src = BASE + 'dict.js?v=2';
    s.onload = function () { W = window.CAMWORDS || { e: {}, f: {} }; wQ.splice(0).forEach(function (f) { f(); }); };
    s.onerror = function () { W = { e: {}, f: {} }; wQ.splice(0).forEach(function (f) { f(); }); };
    document.head.appendChild(s);
  }
  function find(w) {
    w = w.toLowerCase().replace(/[’‘]/g, "'").replace(/^['-]+|['-]+$/g, '');
    var tries = [w, w.replace(/'s$/, ''), w.replace(/s'$/, 's')];
    for (var i = 0; i < tries.length; i++) {
      var t = tries[i]; if (W.e[t]) return { w: t, e: W.e[t] };
      if (W.f[t] && W.e[W.f[t]]) return { w: W.f[t], e: W.e[W.f[t]] };
    }
    return null;
  }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function cards() { try { return JSON.parse(localStorage.getItem(CARD_KEY)) || {}; } catch (e) { return {}; } }
  function saveCards(c) { try { localStorage.setItem(CARD_KEY, JSON.stringify(c)); } catch (e) {} }
  function say(t) { try { speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(t); u.lang = 'en-US'; u.rate = 0.9; speechSynthesis.speak(u); } catch (e) {} }
  var PICK = (window.CSS && CSS.highlights && window.Highlight) ? new Highlight() : null;
  if (PICK) CSS.highlights.set('vpick', PICK);
  var pop = document.createElement('div'); pop.className = 'vpop'; pop.hidden = true; document.body.appendChild(pop);
  function hide() { pop.hidden = true; if (PICK) PICK.clear(); }
  var POS = { noun: 'n', verb: 'v', adjective: 'adj', adverb: 'adv', preposition: 'prep', conjunction: 'conj', pronoun: 'pron', phrase: 'phr' };

  function sentenceOf(r, word) {
    var blk = r.startContainer.parentElement && r.startContainer.parentElement.closest('p,li,td,div,.opt,.qtext,span');
    var txt = (blk ? blk.textContent : '').replace(/\s+/g, ' ').trim();
    var ss = txt.split(/(?<=[.!?])\s+/), re = new RegExp('\\b' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
    for (var i = 0; i < ss.length; i++) if (re.test(ss[i])) return ss[i].slice(0, 220);
    return txt.slice(0, 220);
  }
  function show(word, r) {
    var f = find(word), head = f ? f.w : word.toLowerCase(), C = cards(), saved = !!C[head];
    var body = f ? f.e[1].map(function (d) { return '<div class="d"><b>' + esc(POS[d[0]] || d[0] || '') + '</b>' + esc(d[1].join('; ')) + '</div>'; }).join('')
      : '<div class="d">Chưa có trong từ điển của web. Thử bấm vào từ gốc nhé.</div>';
    pop.innerHTML = '<button type="button" class="x" aria-label="Đóng">✕</button><span class="w">' + esc(head) + '</span>' +
      '<div class="i">' + esc(f ? f.e[0] || '' : '') + ' <button type="button" class="s">🔊 Nghe</button></div>' + body +
      (f ? '<div class="acts"><button type="button" class="sv' + (saved ? ' on' : '') + '">' + (saved ? '★ Đã lưu' : '☆ Lưu flashcard') + '</button><a href="' + (window.LOOKUP_FC || 'flashcards.html') + '">Mở bộ flashcard →</a></div><div class="src">Từ điển Anh–Việt rút gọn</div>' : '');
    pop.hidden = false;
    pop.querySelector('.x').onclick = hide;
    pop.querySelector('.s').onclick = function () { say(head); };
    var sv = pop.querySelector('.sv');
    if (sv) sv.onclick = function () {
      var C2 = cards();
      if (C2[head]) { delete C2[head]; sv.classList.remove('on'); sv.textContent = '☆ Lưu flashcard'; }
      else {
        C2[head] = { w: head, ipa: f.e[0] || '', m: f.e[1].map(function (d) { return (POS[d[0]] ? POS[d[0]] + '. ' : '') + d[1].join('; '); }).join(' | '),
          ex: sentenceOf(r, word), src: window.LOOKUP_SRC || document.title, at: Date.now(), lv: 0 };
        sv.classList.add('on'); sv.textContent = '★ Đã lưu';
      }
      saveCards(C2);
    };
    var rc = r.getBoundingClientRect();
    var left = Math.max(8, Math.min(window.innerWidth - pop.offsetWidth - 8, rc.left + window.scrollX));
    var top = rc.bottom + 8 + window.scrollY;
    if (rc.bottom + pop.offsetHeight + 16 > window.innerHeight) top = rc.top - pop.offsetHeight - 8 + window.scrollY;
    pop.style.left = left + 'px'; pop.style.top = top + 'px';
  }
  function wordAt(n, o) {
    if (!n || n.nodeType !== 3) return null;
    var t = n.nodeValue, a = o, b = o, re = /[A-Za-z'’-]/;
    while (a > 0 && re.test(t[a - 1])) a--;
    while (b < t.length && re.test(t[b])) b++;
    while (a < b && /['’-]/.test(t[a])) a++;
    while (b > a && /['’-]/.test(t[b - 1])) b--;
    if (b - a < 2) return null;
    var r = document.createRange(); r.setStart(n, a); r.setEnd(n, b);
    return { w: t.slice(a, b), r: r };
  }
  function caret(x, y) {
    if (document.caretPositionFromPoint) { var p = document.caretPositionFromPoint(x, y); return p && { n: p.offsetNode, o: p.offset }; }
    if (document.caretRangeFromPoint) { var r = document.caretRangeFromPoint(x, y); return r && { n: r.startContainer, o: r.startOffset }; }
    return null;
  }
  var ZONE = window.LOOKUP_ZONE || '.psg,.script,.qtext,.blank-q,.ghead,.done .opt';
  var BAD = 'button,input,select,textarea,a,audio,summary,.vi,.v,.mark,.blank,.L,.sp,.note';
  document.addEventListener('click', function (ev) {
    if (pop.contains(ev.target)) return;
    if (window.ETS_LOOKUP === false) { hide(); return; }
    var zone = ev.target.closest && ev.target.closest(ZONE), bad = ev.target.closest && ev.target.closest(BAD);
    if (!zone || bad || String(window.getSelection() || '').trim()) { hide(); return; }
    var c = caret(ev.clientX, ev.clientY), wd = c && wordAt(c.n, c.o);
    if (!wd) { hide(); return; }
    if (PICK) { PICK.clear(); PICK.add(wd.r); }
    loadWords(function () { show(wd.w, wd.r); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hide(); });
  window.addEventListener('resize', hide);
})();

/* Kiểm tra xếp lớp TOEIC — 30 câu cố định (cả lớp cùng một đề), 15 phút, chấm theo kỹ năng và gợi ý lộ trình. */
(function () {
  'use strict';
  var main = document.getElementById('main'), au = document.getElementById('au');
  function get(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function put(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function rng(seed) { var h = 2166136261; for (var i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); } return function () { h += 0x6D2B79F5; var t = h; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  var CATS = window.ETSCATS || {}, ALL = window.ETSMINI || [];
  function cat(x) { return (CATS[x.t] || {})[x.n] || (x.p === 1 ? 'p1' : x.p === 2 ? 'p2' : 'g_vocab'); }
  var SK = {
    p1: { name: 'Nghe tả tranh', les: [['part-1-ta-tranh', 'Part 1 – Tả tranh']], prac: 'test.html?t=1&m=p1' },
    p2: { name: 'Nghe hỏi – đáp', les: [['part-2-hoi-dap', 'Part 2 – Hỏi đáp']], prac: 'phan-xa.html' },
    g_form: { name: 'Từ loại', les: [['tu-loai-vi-tri', 'Từ loại và vị trí trong câu'], ['cau-truc-cau-co-ban', 'Cấu trúc câu cơ bản']] },
    g_verb: { name: 'Thì & động từ', les: [['thi-hien-tai', 'Thì hiện tại'], ['thi-qua-khu-tuong-lai', 'Thì quá khứ và tương lai'], ['cau-bi-dong', 'Câu bị động']] },
    g_pron: { name: 'Đại từ', les: [['dai-tu', 'Đại từ']] },
    g_prep: { name: 'Giới từ & liên từ', les: [['gioi-tu-thoi-gian-noi-chon', 'Giới từ thời gian và nơi chốn'], ['lien-tu-gioi-tu-de-nham', 'Liên từ và giới từ dễ nhầm']] },
    g_vocab: { name: 'Từ vựng', les: [['tu-vung-van-phong', 'Từ vựng văn phòng'], ['part-5-6-cach-lam-nhanh', 'Part 5–6 – Cách làm nhanh']] }
  };
  function skillOf(x) { var c = cat(x); return c.indexOf('p2') === 0 ? 'p2' : SK[c] ? c : (x.p === 5 ? 'g_vocab' : 'p1'); }
  // chọn đề cố định
  var r = rng('minto-xep-lop-v1'), SET = [];
  function take(filter, n) { var a = ALL.filter(filter); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } SET = SET.concat(a.slice(0, n)); }
  take(function (x) { return x.p === 1; }, 3);
  ['p2_who', 'p2_what', 'p2_wherewhen', 'p2_whyhow', 'p2_yn', 'p2_choice', 'p2_stmt'].forEach(function (c) { take(function (x) { return x.p === 2 && cat(x) === c; }, 1); });
  [['g_form', 5], ['g_verb', 5], ['g_pron', 3], ['g_prep', 4], ['g_vocab', 3]].forEach(function (c) { take(function (x) { return x.p === 5 && cat(x) === c[0]; }, c[1]); });
  var MINS = 15, KEY = 'mt.place.toeic';
  var ans = [], i = 0, t0 = 0, tick = 0, plays = {};

  function intro() {
    var last = get(KEY, null);
    main.innerHTML = '<div class="card intro"><h3 style="margin-top:0">Trước khi bắt đầu</h3><ul>' +
      '<li><b>' + SET.length + ' câu</b>: 3 câu tả tranh, 7 câu hỏi – đáp (nghe), ' + (SET.length - 10) + ' câu ngữ pháp & từ vựng.</li>' +
      '<li>Thời gian <b>' + MINS + ' phút</b>, hết giờ tự nộp. Mỗi audio nghe tối đa <b>2 lần</b>.</li>' +
      '<li>Không biết thì cứ chọn đáp án gần đúng nhất — <b>đừng tra từ</b>, để kết quả phản ánh đúng trình độ.</li>' +
      '<li>Nhớ bật loa hoặc đeo tai nghe 🎧</li></ul>' +
      '<div class="fld"><input id="nm" placeholder="Họ và tên (để thầy nhận kết quả)" autocomplete="name" value="' + esc(localStorage.getItem('cam20.name') || '') + '"><input id="lp" placeholder="Lớp / nhóm (nếu có)" value="' + esc(localStorage.getItem('cam20.lop') || '') + '"></div>' +
      '<button class="btn" id="go">▶ Bắt đầu làm bài</button>' +
      (last ? '<p class="hint">Lần trước (' + new Date(last.at).toLocaleDateString('vi-VN') + '): ' + last.got + '/' + last.total + ' câu · ' + esc(last.lvl) + ' · <a href="#" id="seeLast">xem lại kết quả</a></p>' : '') + '</div>';
    document.getElementById('go').onclick = function () {
      try { localStorage.setItem('cam20.name', document.getElementById('nm').value.trim()); localStorage.setItem('cam20.lop', document.getElementById('lp').value.trim()); } catch (e) {}
      ans = []; i = 0; plays = {}; t0 = Date.now(); tick = setInterval(clock, 500); q();
    };
    var sl = document.getElementById('seeLast'); if (sl) sl.onclick = function (e) { e.preventDefault(); ans = last.ans || []; result(true); };
  }
  function clock() {
    var left = MINS * 60 - Math.floor((Date.now() - t0) / 1000), el = document.getElementById('tm');
    if (left <= 0) { clearInterval(tick); return result(false, true); }
    if (el) { el.textContent = Math.floor(left / 60) + ':' + ('0' + left % 60).slice(-2); el.classList.toggle('low', left < 120); }
  }
  function play(x) {
    plays[i] = (plays[i] || 0) + 1;
    var src = 'audio/t' + x.t + '/' + x.au; if (au.getAttribute('src') !== src) au.setAttribute('src', src);
    au.currentTime = 0; au.play().catch(function () {}); upd();
    function upd() { var b = document.getElementById('pl'); if (b) { b.disabled = plays[i] >= 2; b.textContent = plays[i] >= 2 ? 'Đã nghe 2 lần' : '▶ Nghe lại (còn ' + (2 - plays[i]) + ')'; } }
  }
  function q() {
    au.pause();
    var x = SET[i], L = x.p === 2 ? ['A', 'B', 'C'] : ['A', 'B', 'C', 'D'];
    var h = '<div class="card"><div class="top"><span class="tag">Câu ' + (i + 1) + '/' + SET.length + ' · ' + (x.p === 1 ? 'Tả tranh' : x.p === 2 ? 'Hỏi – đáp' : 'Điền câu') + '</span><span>⏱ <span class="tm" id="tm"></span></span></div>' +
      '<div class="pbar"><s style="width:' + Math.round(i / SET.length * 100) + '%"></s></div>';
    if (x.p <= 2) h += '<div class="aud"><button id="pl">▶ Nghe</button><span class="hint">' + (x.p === 1 ? 'Nghe 4 câu mô tả, chọn câu đúng với tranh' : 'Nghe câu hỏi và 3 câu đáp, chọn câu đáp hợp nhất') + '</span></div>';
    if (x.p === 1 && x.img) h += '<img class="ph" src="img/t' + x.t + '/' + x.img + '" alt="Tranh">';
    if (x.p === 5) h += '<div class="q">' + esc(x.q) + '</div>';
    h += '<div class="opts">' + L.map(function (l, k) { return '<button class="opt" data-l="' + l + '"><span class="L">' + l + '</span>' + (x.p === 5 ? '<span>' + esc(x.o[k]) + '</span>' : '<span class="hint">Đáp án ' + l + '</span>') + '</button>'; }).join('') + '</div>';
    h += '<div class="nav" style="justify-content:space-between"><span class="hint">Chọn xong là sang câu tiếp</span>' + (i ? '<button class="btn" style="background:var(--panel2);color:var(--ink)" id="bk">← Câu trước</button>' : '') + '</div></div>';
    main.innerHTML = h; clock();
    if (x.p <= 2) { var pb = document.getElementById('pl'); pb.onclick = function () { play(x); }; if (!plays[i]) play(x); else { pb.disabled = plays[i] >= 2; pb.textContent = plays[i] >= 2 ? 'Đã nghe 2 lần' : '▶ Nghe lại (còn ' + (2 - plays[i]) + ')'; } }
    [].forEach.call(main.querySelectorAll('.opt'), function (b) {
      if (ans[i] === b.dataset.l) b.style.borderColor = 'var(--brand)';
      b.onclick = function () { ans[i] = b.dataset.l; i++; if (i >= SET.length) result(false); else q(); };
    });
    var bk = document.getElementById('bk'); if (bk) bk.onclick = function () { i--; q(); };
  }
  function band(p) {
    if (p < .4) return { k: 1, name: 'Mất gốc / mới bắt đầu', est: 'dưới 300', goal: '350–450' };
    if (p < .6) return { k: 2, name: 'Cơ bản', est: 'khoảng 300–450', goal: '500–550' };
    if (p < .8) return { k: 3, name: 'Trung cấp', est: 'khoảng 450–650', goal: '650–750' };
    return { k: 4, name: 'Khá', est: 'khoảng 650+', goal: '800+' };
  }
  function result(review, auto) {
    clearInterval(tick); au.pause();
    var S = {}, got = 0;
    SET.forEach(function (x, k) { var s = skillOf(x); S[s] = S[s] || { ok: 0, n: 0 }; S[s].n++; if (ans[k] === x.a) { S[s].ok++; got++; } });
    var p = got / SET.length, B = band(p);
    var weak = Object.keys(SK).filter(function (k) { return S[k] && S[k].ok / S[k].n < .6; }).sort(function (a, b) { return S[a].ok / S[a].n - S[b].ok / S[b].n; });
    if (!review) {
      var rec = { at: Date.now(), got: got, total: SET.length, lvl: B.name, weak: weak, ans: ans.slice() };
      put(KEY, rec);
      var url = window.ETSCFG && window.ETSCFG.SCRIPT_URL;
      if (url) try {
        var wrong = SET.map(function (x, k) { return ans[k] === x.a ? null : (k + 1); }).filter(Boolean).join(', ');
        fetch(url, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ kind: 'cam20', name: localStorage.getItem('cam20.name') || '', lop: localStorage.getItem('cam20.lop') || '', test: 'TOEIC · Kiểm tra xếp lớp', part: 'Part 1·2·5', mode: 'Xếp lớp', got: got, total: SET.length, band: B.name + ' (TOEIC ' + B.est + ')', minutes: Math.round((Date.now() - t0) / 60000), wrong: wrong, auto: !!auto, submittedAt: new Date().toISOString(), userAgent: navigator.userAgent.slice(0, 120) }) }).catch(function () {});
      } catch (e) {}
      if (window.MCONFETTI && p >= .6) try { window.MCONFETTI(); } catch (e) {}
    }
    var steps = [];
    if (B.k === 1) {
      steps.push('Bắt đầu từ <a href="nen.html#lam-quen-de-toeic">Làm quen đề TOEIC</a> rồi học lần lượt nhóm <b>Ngữ pháp</b> trong <a href="nen.html">Kiến thức nền</a> — mỗi ngày 1 bài, làm hết quiz cuối bài.');
      steps.push('Mỗi ngày 10 phút <a href="mini.html">Đề mini</a> để quen dạng câu, và lưu từ mới vào <a href="flashcards.html">Flashcard</a>.');
    }
    weak.slice(0, 3).forEach(function (k) {
      var s = SK[k]; steps.push('Lấp chỗ hổng <b>' + s.name + '</b> (' + S[k].ok + '/' + S[k].n + ' câu đúng): học ' + s.les.map(function (l) { return '<a href="nen.html#' + l[0] + '">' + l[1] + '</a>'; }).join(', ') + (s.prac ? ' rồi luyện ở <a href="' + s.prac + '">đây</a>' : '') + '.');
    });
    if (B.k === 2) steps.push('Luyện từng Part không giới hạn giờ: <a href="test.html?t=1&m=p1">Part 1</a>, <a href="test.html?t=1&m=p2">Part 2</a>, <a href="test.html?t=1&m=p5">Part 5</a> — làm xong đọc kỹ giải thích từng câu.');
    if (B.k >= 2) steps.push('Chơi <a href="phan-xa.html">Phản xạ Part 2</a> và <a href="go-tu.html">Gõ từ rơi</a> 5–10 phút mỗi ngày để tăng phản xạ nghe và vốn từ.');
    if (B.k === 3) steps.push('Chuyển sang Part 3, 4 và 7: học <a href="nen.html#part-3-4-hoi-thoai-bai-noi">Hội thoại & bài nói</a>, <a href="nen.html#part-7-doc-hieu">Đọc hiểu Part 7</a>, sau đó làm <b>Chỉ Listening</b> / <b>Chỉ Reading</b> của một đề.');
    if (B.k >= 3) steps.push('Mỗi tuần 1 <a href="./#de-thi">Full test</a> bấm giờ như thi thật, rồi xem <a href="phan-tich.html">Điểm yếu & tiến bộ</a> để biết nên ôn gì tiếp.');
    if (B.k === 4) steps.push('Tập trung câu bẫy: bấm ☆ đánh dấu những câu sai trong đề và ôn lại ở <a href="danh-dau.html">Câu đã đánh dấu</a>.');
    var h = '<div class="card res"><div class="sc">' + got + '/' + SET.length + '</div><div class="lvl">' + B.name + '</div>' +
      '<p>TOEIC ước tính <b>' + B.est + '</b> · mục tiêu gần: <b>' + B.goal + '</b>' + (auto ? '<br><small class="hint">Hết giờ — bài đã tự nộp.</small>' : '') + '</p>' +
      '<p class="hint">Đây là bài kiểm tra ngắn chỉ gồm Part 1, 2, 5 nên điểm chỉ mang tính tham khảo để chọn lộ trình.</p></div>' +
      '<div class="card"><h3 style="margin-top:0">Điểm theo kỹ năng</h3>' + Object.keys(SK).filter(function (k) { return S[k]; }).map(function (k) {
        var f = S[k].ok / S[k].n; return '<div class="sk"><span>' + SK[k].name + '</span><i><s class="' + (f >= .7 ? '' : f >= .4 ? 'mid' : 'low') + '" style="width:' + Math.round(f * 100) + '%"></s></i><b>' + S[k].ok + '/' + S[k].n + '</b></div>';
      }).join('') + '</div>' +
      '<div class="card"><h3 style="margin-top:0">🧭 Lộ trình gợi ý cho bạn</h3><ol class="path">' + steps.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol></div>' +
      '<details class="card"><summary style="cursor:pointer;font-weight:700">Xem lại từng câu</summary>' + SET.map(function (x, k) {
        var ok = ans[k] === x.a, L = ['A', 'B', 'C', 'D'], ai = L.indexOf(x.a);
        return '<div class="rv ' + (ok ? 'ok' : 'bad') + '"><b>' + (k + 1) + '.</b> ' + (x.q ? esc(x.q) : 'Tả tranh') + '<br>' + (ok ? '✓' : '✗ Bạn chọn ' + (ans[k] || '—') + ' ·') + ' Đáp án <b>' + x.a + '</b>: ' + esc(x.o[ai]) + (x.v && x.v[ai] ? ' <small class="hint">(' + esc(x.v[ai]) + ')</small>' : '') + '</div>';
      }).join('') + '</details>' +
      '<p style="text-align:center"><button class="btn" id="again">Làm lại bài kiểm tra</button></p>';
    main.innerHTML = h; window.scrollTo(0, 0);
    document.getElementById('again').onclick = intro;
  }
  intro();
})();

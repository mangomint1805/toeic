/* Starter TOEIC (bài tập theo sách Starter TOEIC 3rd ed.): test.html?t=101…112 = Unit 1…12.
   Nội dung đề + đáp án KHÔNG nằm trong repo: thầy tải lên Firestore starter/u01…u12 (trang /starter-gv.html),
   luật Firestore chỉ cho thầy và học viên đã có trong lớp (có priv/{uid}) đọc. File này chỉ lấy dữ liệu và đổi sang dạng của test.js. */
(function () {
  'use strict';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pad(u) { return (u < 10 ? '0' : '') + u; }
  var L4 = ['A', 'B', 'C', 'D'];
  function accLoad() {
    return new Promise(function (ok, no) {
      if (window.MACC) return ok();
      var s = document.createElement('script'); s.src = 'assets/acc.js?v=10';
      s.onload = function () { window.MACC ? ok() : no({ kind: 'net' }); }; s.onerror = function () { no({ kind: 'net' }); };
      document.head.appendChild(s);
    });
  }
  // đợi Firebase báo trạng thái đăng nhập (đã đăng nhập trên máy này thì mất chừng 1 giây)
  function waitUser(ms) {
    return new Promise(function (ok) {
      var t0 = Date.now();
      (function tick() { var u = window.MACC && window.MACC.user(); if (u || Date.now() - t0 > ms) return ok(u || null); setTimeout(tick, 150); })();
    });
  }
  // đoạn văn chữ thường -> HTML: dòng trống tách đoạn, [[131]] là chỗ trống câu 131
  function para(t) {
    return String(t || '').split(/\n\s*\n/).map(function (b) {
      var h = esc(b.trim()).replace(/\n/g, '<br>').replace(/\[\[(\d{3})\]\]/g, function (m, n) { return '<span class="blank" data-n="' + n + '">-------</span>'; });
      return h ? '<p>' + h + '</p>' : '';
    }).join('');
  }
  var NOTE = 'Sách không in rõ đáp án câu này; đáp án do thầy xác định.';
  function item(q) {
    var o = { n: +q.n, q: String(q.q || ''), opts: (q.o || []).slice(0, 4).map(String), ans: L4.indexOf(q.a) >= 0 ? q.a : 'A', xp: String(q.x || '') };
    if (q.f) o.note = NOTE;
    return o;
  }
  function shape(d) {
    return {
      lc: null,
      rc: {
        p5: (d.p5 || []).map(item),
        p6: (d.p6 || []).map(function (s) { return { ns: s.ns, head: s.head || '', passage: para(s.text), vi: s.vi || '', qs: (s.qs || []).map(item) }; }),
        p7: (d.p7 || []).map(function (s) { return { ns: s.ns, head: s.head || '', passages: (s.texts || []).map(para), vi: s.vi || '', qs: (s.qs || []).map(item) }; })
      },
      title: d.title || ''
    };
  }
  function load(u) {
    return accLoad().then(function () { return window.MACC.fs(); }).then(function (x) {
      return waitUser(x.user ? 0 : 4000).then(function (user) {
        if (!user) throw { kind: 'login' };
        return x.F.getDoc(x.F.doc(x.db, 'starter', 'u' + pad(u))).then(function (sn) {
          if (!sn.exists()) throw { kind: 'none' };
          var d = sn.data(); if (!d || !d.p5) throw { kind: 'none' };
          return shape(d);
        }, function (e) { throw { kind: e && /permission/i.test(e.code || e.message || '') ? 'deny' : 'net', e: e }; });
      });
    }, function (e) { throw e && e.kind ? e : { kind: 'net' }; });
  }
  function fail(err, box, u) {
    var k = (err && err.kind) || 'net', who = window.MACC && window.MACC.user && window.MACC.user();
    var h = '<div class="box"><h3>Starter TOEIC · Unit ' + u + '</h3>';
    if (k === 'login') h += '<p>Bài tập Starter TOEIC chỉ dành cho học viên trong lớp của thầy. <b>Đăng nhập bằng tài khoản Google</b> bạn đã dùng trên web để làm bài nhé.</p><p><button class="btn" type="button" id="stLogin">Đăng nhập Google</button></p>';
    else if (k === 'deny') h += '<p>Tài khoản <b>' + esc(who && who.email || '') + '</b> chưa có trong danh sách lớp nên chưa mở được bài này.</p><p class="hint">Nhắn thầy để thầy ghép tài khoản vào lớp, rồi tải lại trang. Nếu bạn có tài khoản Google khác đã dùng trên web, đăng xuất rồi đăng nhập bằng tài khoản đó.</p>';
    else if (k === 'none') h += '<p>Unit ' + u + ' <b>chưa có dữ liệu</b>: thầy chưa tải bài tập của unit này lên. Bạn quay lại sau nhé.</p>';
    else h += '<p>Không tải được bài (mạng chập chờn?). Kiểm tra mạng rồi <a href="">tải lại trang</a>.</p>';
    h += '<p><a href="./#starter">← Danh sách Starter TOEIC</a></p></div>';
    box.innerHTML = h;
    var b = document.getElementById('stLogin');
    if (b) b.onclick = function () {
      b.disabled = true; b.textContent = 'Đang mở cửa sổ đăng nhập…';
      try { window.MACC.quick(); } catch (e) {}
      waitUser(120000).then(function (us) { if (us) location.reload(); else { b.disabled = false; b.textContent = 'Đăng nhập Google'; } });
    };
  }
  window.MSTARTER = { load: load, fail: fail };
})();

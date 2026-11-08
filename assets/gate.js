/* Đề "cần đăng nhập": nội dung đề + đáp án KHÔNG nằm trong repo mà ở Firestore, ai đăng nhập Google (email đã xác minh) mới đọc được.
   - de/{t}      : đề thi đầy đủ (cùng cấu trúc window.ETSDATA[t] = { lc, rc }), lưu dạng chuỗi JSON chia khúc (xem README).
   - starter/uNN : bài tập sách Starter TOEIC (test.html?t=101…112).
   Thầy tải lên ở /tai-de-gv.html (repo trang chủ). test.js gọi MGATE.loadDe(t) / MGATE.loadStarter(u), lỗi thì MGATE.fail(...). */
(function () {
  'use strict';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pad(u) { return (u < 10 ? '0' : '') + u; }
  var L4 = ['A', 'B', 'C', 'D'];
  var NOTE_LOGIN = '🔒 Đăng nhập bằng Google để xem đề (bấm nút Đăng nhập góc trên).';
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
  function signedIn() { try { return !!localStorage.getItem('mt.acc'); } catch (e) { return false; } }
  // mở Firestore khi đã đăng nhập; chưa đăng nhập thì báo 'login'
  function db() {
    return accLoad().then(function () { return window.MACC.fs(); }).then(function (x) {
      return waitUser(x.user ? 0 : (signedIn() ? 5000 : 2500)).then(function (user) { if (!user) throw { kind: 'login' }; x.user = user; return x; });
    }, function (e) { throw e && e.kind ? e : { kind: 'net' }; });
  }
  function why(e, x) {
    var c = (e && (e.code || e.message)) || '';
    if (/permission/i.test(c)) return { kind: x && x.user && x.user.emailVerified === false ? 'verify' : 'deny', e: e };
    return { kind: 'net', e: e };
  }
  function get(x, col, id) { return x.F.getDoc(x.F.doc(x.db, col, id)); }

  // ---------- de/{t}: đề đầy đủ ----------
  function loadDe(t) {
    return db().then(function (x) {
      return get(x, 'de', String(t)).then(function (sn) {
        if (!sn.exists()) throw { kind: 'none' };
        var d = sn.data(), n = Math.max(1, d.n | 0), rest = [];
        for (var k = 1; k < n; k++) rest.push(get(x, 'de', t + '_' + k));
        return Promise.all(rest).then(function (L) {
          var s = String(d.j || '');
          L.forEach(function (c) { if (!c.exists()) throw { kind: 'none' }; s += String(c.data().j || ''); });
          var D = JSON.parse(s);
          if (!D || !D.rc) throw { kind: 'none' };
          if (d.name) D.name = d.name;
          return D;
        });
      }, function (e) { throw why(e, x); });
    });
  }

  // ---------- starter/uNN: bài tập sách Starter TOEIC ----------
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
  function loadStarter(u) {
    return db().then(function (x) {
      return get(x, 'starter', 'u' + pad(u)).then(function (sn) {
        if (!sn.exists()) throw { kind: 'none' };
        var d = sn.data(); if (!d || !d.p5) throw { kind: 'none' };
        return shape(d);
      }, function (e) { throw why(e, x); });
    });
  }

  // ---------- màn báo lỗi / chưa đăng nhập ----------
  function fail(err, box, name, back) {
    var k = (err && err.kind) || 'net', who = window.MACC && window.MACC.user && window.MACC.user();
    var h = '<div class="box"><h3>' + esc(name) + '</h3>';
    if (k === 'login') h += '<p class="gate-note" style="font-size:17px"><b>' + NOTE_LOGIN + '</b></p><p class="hint">Đề này chỉ hiện khi bạn đã đăng nhập bằng tài khoản Google. Đăng nhập xong trang tự tải đề.</p><p><button class="btn" type="button" id="gateLogin">Đăng nhập Google</button></p>';
    else if (k === 'verify') h += '<p>Tài khoản <b>' + esc(who && who.email || '') + '</b> chưa xác minh email nên chưa xem được đề. Đăng xuất rồi đăng nhập lại bằng <b>tài khoản Google</b> nhé.</p>';
    else if (k === 'deny') h += '<p>Tài khoản <b>' + esc(who && who.email || '') + '</b> chưa mở được đề này. Thử tải lại trang; nếu vẫn vậy, nhắn thầy nhé.</p>';
    else if (k === 'none') h += '<p>Đề này <b>chưa có dữ liệu</b>: thầy chưa tải lên. Bạn quay lại sau nhé.</p>';
    else h += '<p>Không tải được đề (mạng chập chờn?). Kiểm tra mạng rồi <a href="">tải lại trang</a>.</p>';
    h += '<p><a href="' + (back || './') + '">← Về trang chủ</a></p></div>';
    box.innerHTML = h;
    var b = document.getElementById('gateLogin');
    if (b) b.onclick = function () {
      b.disabled = true; b.textContent = 'Đang mở cửa sổ đăng nhập…';
      try { window.MACC.quick(); } catch (e) {}
      waitUser(120000).then(function (us) { if (us) location.reload(); else { b.disabled = false; b.textContent = 'Đăng nhập Google'; } });
    };
    // đăng nhập bằng nút góc trên cũng tự tải lại
    if (k === 'login') accLoad().then(function () { return waitUser(600000); }).then(function (us) { if (us) location.reload(); }, function () {});
  }
  window.MGATE = { loadDe: loadDe, loadStarter: loadStarter, fail: fail, NOTE: NOTE_LOGIN };
  window.MSTARTER = { load: loadStarter, fail: function (e, box, u) { fail(e, box, 'Starter TOEIC · Unit ' + u, './#starter'); } };
})();

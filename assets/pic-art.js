/* Nghe chọn tranh — tranh SVG tự vẽ (người que kiểu phẳng + đồ vật), ghép từ các phần dùng lại.
   Khung 200×150, mặt đất y = 130. window.PICART.svg(tên cảnh) → chuỗi <svg>. Không dùng ảnh ngoài. */
(function () {
  var K = '#3b3b45', SKIN = '#f2c29b', HAIR = '#3a2a20', G = 130;
  function n(v) { return Math.round(v * 10) / 10; }
  function ln(x1, y1, x2, y2, c, w) { return '<line x1="' + n(x1) + '" y1="' + n(y1) + '" x2="' + n(x2) + '" y2="' + n(y2) + '" stroke="' + (c || K) + '" stroke-width="' + (w || 2) + '" stroke-linecap="round"/>'; }
  function pl(pts, c, w, f) { return '<polyline points="' + pts.map(function (p) { return n(p[0]) + ',' + n(p[1]); }).join(' ') + '" fill="' + (f || 'none') + '" stroke="' + (c || K) + '" stroke-width="' + (w || 2) + '" stroke-linecap="round" stroke-linejoin="round"/>'; }
  function pg(pts, f, sw) { return '<polygon points="' + pts.map(function (p) { return n(p[0]) + ',' + n(p[1]); }).join(' ') + '" fill="' + f + '" stroke="' + K + '" stroke-width="' + (sw == null ? 1.6 : sw) + '" stroke-linejoin="round"/>'; }
  function rc(x, y, w, h, f, r, sw) { return '<rect x="' + n(x) + '" y="' + n(y) + '" width="' + n(w) + '" height="' + n(h) + '" rx="' + (r || 0) + '" fill="' + f + '" stroke="' + K + '" stroke-width="' + (sw == null ? 1.6 : sw) + '"/>'; }
  function ci(x, y, r, f, sw) { return '<circle cx="' + n(x) + '" cy="' + n(y) + '" r="' + n(r) + '" fill="' + f + '" stroke="' + K + '" stroke-width="' + (sw == null ? 1.6 : sw) + '"/>'; }
  function pa(d, f, sw, c) { return '<path d="' + d + '" fill="' + (f || 'none') + '" stroke="' + (c || K) + '" stroke-width="' + (sw == null ? 1.6 : sw) + '" stroke-linecap="round" stroke-linejoin="round"/>'; }
  function sc(k, cx, cy, s) { cx = cx == null ? 100 : cx; cy = cy == null ? G : cy; return '<g transform="translate(' + cx + ' ' + cy + ') scale(' + k + ') translate(' + (-cx) + ' ' + (-cy) + ')">' + s + '</g>'; }

  // ---------- nền ----------
  function bg(t) {
    if (t === 'out') return '<rect width="200" height="150" fill="#dcefff"/><rect y="114" width="200" height="36" fill="#cfe6b4"/>' + ln(0, 114, 200, 114, '#9cc283', 1.5);
    if (t === 'street') return '<rect width="200" height="150" fill="#dcefff"/><rect y="112" width="200" height="38" fill="#cfcfd4"/><rect y="108" width="200" height="8" fill="#e9e6df"/>' + ln(10, 140, 40, 140, '#fff', 3) + ln(80, 140, 120, 140, '#fff', 3) + ln(160, 140, 190, 140, '#fff', 3);
    if (t === 'water') return '<rect width="200" height="150" fill="#dcefff"/><rect y="104" width="200" height="46" fill="#8fc6e8"/>' + pa('M10 122 q8 -4 16 0 M70 132 q8 -4 16 0 M140 120 q8 -4 16 0 M120 142 q8 -4 16 0', 'none', 1.6, '#e8f6ff');
    if (t === 'plain') return '<rect width="200" height="150" fill="#f8f5ee"/>' + ln(20, G + 1, 180, G + 1, '#d8cfbe', 2);
    return '<rect width="200" height="150" fill="#f6efe2"/><rect y="118" width="200" height="32" fill="#e3cfae"/>' + ln(0, 118, 200, 118, '#cdb48c', 1.5);
  }

  // ---------- người ----------
  var ARM = {
    down: [[1, 12], [2, 24]], fwd: [[9, 8], [20, 6]], fwdlow: [[7, 11], [17, 16]], up: [[5, -11], [8, -23]],
    wave: [[11, -2], [13, -15]], point: [[11, -3], [25, -6]], ear: [[10, 3], [6, -9]], mouth: [[10, 5], [9, -7]],
    look: [[8, 11], [15, 1]], back: [[-5, 11], [-9, 22]], swing: [[6, 10], [12, 19]], carry: [[8, 9], [18, 6]],
    hand: [[10, 9], [22, 10]], hip: [[7, 10], [4, 20]]
  };
  var POSE = {
    stand: { hip: [0, -30], neck: [0, -56], legs: [[[-3, -15], [-6, 0]], [[3, -15], [6, 0]]], arms: ['down', 'down'] },
    walk: { hip: [0, -30], neck: [1, -56], legs: [[[-5, -15], [-12, 0]], [[6, -16], [11, 0]]], arms: ['back', 'swing'] },
    run: { hip: [0, -34], neck: [5, -59], legs: [[[-8, -22], [-19, -12]], [[12, -26], [13, -8]]], arms: [[[-6, 8], [-13, 14]], [[8, 9], [15, 0]]] },
    sit: { hip: [0, -30], neck: [-2, -56], legs: [[[13, -30], [13, 0]], [[15, -31], [16, 0]]], arms: ['hip', 'hip'] },
    kneel: { hip: [0, -24], neck: [4, -50], legs: [[[-2, -1], [-15, -2]], [[13, -24], [13, 0]]], arms: ['fwdlow', 'fwdlow'] },
    step: { hip: [0, -30], neck: [1, -56], legs: [[[-3, -15], [-6, 0]], [[9, -23], [10, -10]]], arms: ['up', 'fwd'] }
  };
  function arm(a) { return typeof a === 'string' ? ARM[a] : a; }
  // o: pose, c áo, pc quần, f nữ, d hướng (1 phải, -1 trái), hat, arms:[sau, trước], h chiều cao ghế (ngồi), J ghi đè khớp
  function P(x, y, o) {
    o = o || {}; var d = o.d || 1, B = POSE[o.pose || 'stand'], J = {}, k;
    for (k in B) J[k] = B[k]; if (o.J) for (k in o.J) J[k] = o.J[k];
    if (o.h != null && (o.pose === 'sit')) { var dh = o.h - 30; J = { hip: [0, -o.h], neck: [-2, -o.h - 26], legs: [[[13, -o.h], [13, 0]], [[15, -o.h - 1], [16, 0]]], arms: J.arms }; if (o.J) for (k in o.J) J[k] = o.J[k]; }
    var arms = o.arms || J.arms, X = function (p) { return [x + p[0] * d, y + p[1]]; };
    var c = o.c || '#4f86c6', pc = o.pc || '#4a4f63', hip = X(J.hip), nk = X(J.neck), sh = [nk[0], nk[1] + 4], hd = [nk[0] + 1 * d, nk[1] - 11], s = '';
    function leg(L, back) { var kn = X(L[0]), ft = X(L[1]); return pl([hip, kn, ft], back ? shade(pc) : pc, 6) + '<ellipse cx="' + n(ft[0] + 2.5 * d) + '" cy="' + n(ft[1]) + '" rx="4" ry="2.2" fill="' + K + '"/>'; }
    function armS(A, back) { A = arm(A); var e = [sh[0] + A[0][0] * d, sh[1] + A[0][1]], h = [sh[0] + A[1][0] * d, sh[1] + A[1][1]]; return { s: pl([sh, e, h], back ? shade(c) : c, 5) + ci(h[0], h[1], 2.6, SKIN, 1.2), h: h }; }
    var a0 = armS(arms[0], 1), a1 = armS(arms[1], 0);
    s += a0.s + leg(J.legs[0], 1);
    if (o.f) s += rc(hd[0] - 9 - 1 * d, hd[1] - 6, 18, 18, HAIR, 7, 0);
    s += ln(sh[0], sh[1] + 1, hip[0], hip[1], c, 13);
    s += leg(J.legs[1], 0);
    s += ci(hd[0], hd[1], 8, SKIN, 1.4);
    s += pa('M' + n(hd[0] - 8.3) + ' ' + n(hd[1] + 1) + ' Q' + n(hd[0] - 9) + ' ' + n(hd[1] - 10) + ' ' + n(hd[0]) + ' ' + n(hd[1] - 9.5) + ' Q' + n(hd[0] + 9) + ' ' + n(hd[1] - 10) + ' ' + n(hd[0] + 8.3) + ' ' + n(hd[1] - 1) + ' Q' + n(hd[0] - 2 * d) + ' ' + n(hd[1] - 5) + ' ' + n(hd[0] - 8.3) + ' ' + n(hd[1] + 1) + 'Z', HAIR, 0);
    s += ci(hd[0] + 3.5 * d, hd[1], 1.1, K, 0);
    if (o.hat) s += rc(hd[0] - 6, hd[1] - 15, 12, 9, o.hat, 2, 1.4) + ln(hd[0] - 11, hd[1] - 6, hd[0] + 11, hd[1] - 6, K, 2.6);
    s += a1.s;
    return { s: s, h: a1.h, h0: a0.h, hd: hd };
  }
  function shade(hex) { var v = parseInt(hex.slice(1), 16), r = (v >> 16) * .8, g = (v >> 8 & 255) * .8, b = (v & 255) * .8; return 'rgb(' + (r | 0) + ',' + (g | 0) + ',' + (b | 0) + ')'; }

  // ---------- đồ vật (x giữa, y đáy) ----------
  var O = {
    table: function (x, y, w) { w = w || 64; return rc(x - w / 2, y - 36, w, 6, '#b07a45', 2) + rc(x - w / 2 + 4, y - 30, 4, 30, '#9a6838', 1, 1.4) + rc(x + w / 2 - 8, y - 30, 4, 30, '#9a6838', 1, 1.4); },
    chair: function (x, y, d) { d = d || 1; return rc(x - 11, y - 30, 22, 5, '#d08a3c', 1.5) + rc(x - 10 * d - (d < 0 ? 4 : 0), y - 62, 4, 32, '#d08a3c', 1.5) + ln(x - 9, y - 25, x - 9, y, '#8a5a2a', 3) + ln(x + 9, y - 25, x + 9, y, '#8a5a2a', 3); },
    sofa: function (x, y) { return rc(x - 34, y - 44, 68, 22, '#7aa58f', 6) + rc(x - 38, y - 30, 76, 18, '#8fbaa3', 5) + rc(x - 42, y - 36, 10, 26, '#7aa58f', 4) + rc(x + 32, y - 36, 10, 26, '#7aa58f', 4) + ln(x - 32, y - 12, x - 32, y, K, 3) + ln(x + 32, y - 12, x + 32, y, K, 3); },
    bench: function (x, y, w) { w = w || 70; return rc(x - w / 2, y - 48, w, 5, '#b9864f', 2) + rc(x - w / 2, y - 39, w, 5, '#b9864f', 2) + rc(x - w / 2, y - 28, w, 5, '#b9864f', 2) + ln(x - w / 2 + 6, y - 23, x - w / 2 + 6, y, K, 3) + ln(x + w / 2 - 6, y - 23, x + w / 2 - 6, y, K, 3); },
    shelf: function (x, y, w, h) { w = w || 70; h = h || 90; return rc(x - w / 2, y - h, w, h, '#c79a63', 2) + rc(x - w / 2 + 4, y - h + 4, w - 8, h - 8, '#efe1c8', 1, 1.2) + ln(x - w / 2 + 4, y - h / 2, x + w / 2 - 4, y - h / 2, '#c79a63', 4) + ''; },
    books: function (x, y, k, tilt) { var cs = ['#d35f5f', '#4f86c6', '#e3b341', '#5fa36a', '#9a6fc0', '#e07b39'], s = '', bx = x; for (var i = 0; i < k; i++) { var hh = 20 + (i * 7 % 6), ww = 6 + (i % 2); s += rc(bx, y - hh, ww, hh, cs[i % 6], 1, 1.2); bx += ww + 0.5; } return s; },
    stack: function (x, y, k) { var cs = ['#d35f5f', '#4f86c6', '#e3b341', '#5fa36a', '#9a6fc0'], s = ''; for (var i = 0; i < k; i++) s += rc(x - 14 + (i % 2) * 2, y - 6 * (i + 1), 28, 6, cs[i % 5], 1, 1.2); return s; },
    box: function (x, y, w, h, open) { w = w || 30; h = h || 24; var s = rc(x - w / 2, y - h, w, h, '#d9a55b', 1) + ln(x - w / 2, y - h + 7, x + w / 2, y - h + 7, '#b8833d', 1.5); if (open) s += pg([[x - w / 2, y - h], [x - w / 2 - 8, y - h - 9], [x - 2, y - h - 9], [x, y - h]], '#e8b96d') + pg([[x + w / 2, y - h], [x + w / 2 + 8, y - h - 9], [x + 2, y - h - 9], [x, y - h]], '#e8b96d'); else s += ln(x, y - h, x, y - h + 7, '#b8833d', 1.5); return s; },
    door: function (x, y, open) { var s = rc(x - 20, y - 74, 40, 74, '#8a6a4a', 2); if (open) { s += rc(x - 16, y - 70, 32, 70, '#3f3a36', 0) + pg([[x - 16, y - 70], [x - 30, y - 78], [x - 30, y + 6], [x - 16, y]], '#c98f52') + ci(x - 26, y - 34, 1.8, '#f0d27a', 1); } else s += rc(x - 16, y - 70, 32, 70, '#c98f52', 1) + rc(x - 11, y - 64, 22, 24, '#d9a066', 1, 1.2) + rc(x - 11, y - 34, 22, 26, '#d9a066', 1, 1.2) + ci(x + 10, y - 36, 1.8, '#f0d27a', 1); return s; },
    win: function (x, y, open, w, h) { w = w || 44; h = h || 40; var s = rc(x - w / 2 - 3, y - 3, w + 6, h + 6, '#fff', 2) ; if (open) { s += rc(x - w / 2, y, w, h, '#bfe3ff', 0, 1.2) + pa('M' + (x - w / 2 + 6) + ' ' + (y + h - 8) + ' q8 -10 16 -2 q6 -8 14 0', 'none', 1.4, '#7cb36a') + pg([[x + w / 2, y], [x + w / 2 + 14, y - 6], [x + w / 2 + 14, y + h + 6], [x + w / 2, y + h]], '#e8f4ff'); } else s += rc(x - w / 2, y, w, h, '#bfe3ff', 0, 1.2) + ln(x, y, x, y + h, '#fff', 3) + ln(x - w / 2, y + h / 2, x + w / 2, y + h / 2, '#fff', 3) + ln(x - w / 2 + 5, y + 6, x - 5, y + 14, '#fff', 1.4); return s; },
    pot: function (x, y) { return pg([[x - 10, y - 16], [x + 10, y - 16], [x + 7, y], [x - 7, y]], '#c8693f'); },
    plant: function (x, y, k) { k = k || 1; return sc(k, x, y, pa('M' + x + ' ' + (y - 16) + ' C' + (x - 18) + ' ' + (y - 26) + ' ' + (x - 20) + ' ' + (y - 42) + ' ' + (x - 6) + ' ' + (y - 46) + ' C' + (x - 6) + ' ' + (y - 34) + ' ' + (x - 2) + ' ' + (y - 24) + ' ' + x + ' ' + (y - 16) + 'Z', '#5fa36a') + pa('M' + x + ' ' + (y - 16) + ' C' + (x + 18) + ' ' + (y - 26) + ' ' + (x + 20) + ' ' + (y - 42) + ' ' + (x + 6) + ' ' + (y - 46) + ' C' + (x + 6) + ' ' + (y - 34) + ' ' + (x + 2) + ' ' + (y - 24) + ' ' + x + ' ' + (y - 16) + 'Z', '#6cb877') + pa('M' + x + ' ' + (y - 16) + ' C' + (x - 6) + ' ' + (y - 34) + ' ' + (x + 6) + ' ' + (y - 46) + ' ' + x + ' ' + (y - 54) + ' C' + (x + 8) + ' ' + (y - 40) + ' ' + (x + 4) + ' ' + (y - 28) + ' ' + x + ' ' + (y - 16) + 'Z', '#4f9a5c') + O.pot(x, y)); },
    hangplant: function (x, top, y) { return ln(x, top, x - 10, y - 20, K, 1.2) + ln(x, top, x + 10, y - 20, K, 1.2) + pa('M' + (x - 12) + ' ' + (y - 20) + ' q12 14 24 0 Z', '#c8693f') + pa('M' + (x - 10) + ' ' + (y - 16) + ' q-8 12 -4 24 M' + (x - 3) + ' ' + (y - 12) + ' q-2 12 2 22 M' + (x + 6) + ' ' + (y - 14) + ' q8 10 4 22', 'none', 3, '#5fa36a') + pa('M' + (x - 8) + ' ' + (y - 22) + ' q8 -12 16 0', '#6cb877', 1.2); },
    tree: function (x, y, k) { k = k || 1; return sc(k, x, y, rc(x - 5, y - 40, 10, 40, '#8a5a2a', 2) + ci(x, y - 58, 24, '#6cb877') + ci(x - 14, y - 46, 14, '#5fa36a') + ci(x + 14, y - 46, 14, '#5fa36a')); },
    lamp: function (x, y, on) { var s = ''; if (on) s += '<circle cx="' + x + '" cy="' + (y - 78) + '" r="30" fill="#ffe680" opacity=".55"/>' + ln(x - 30, y - 92, x - 38, y - 98, '#e0b000', 2) + ln(x + 30, y - 92, x + 38, y - 98, '#e0b000', 2) + ln(x, y - 106, x, y - 116, '#e0b000', 2); s += ln(x, y - 70, x, y - 2, K, 3) + rc(x - 12, y - 4, 24, 4, K, 2, 0) + pg([[x - 11, y - 70], [x + 11, y - 70], [x + 7, y - 90], [x - 7, y - 90]], on ? '#fff2a8' : '#e9e2d0'); return s; },
    ceilamp: function (x, y) { return ln(x, 0, x, y - 12, K, 1.6) + pa('M' + (x - 14) + ' ' + y + ' Q' + x + ' ' + (y - 24) + ' ' + (x + 14) + ' ' + y + 'Z', '#e9e2d0'); },
    laptop: function (x, y, open) { if (!open) return rc(x - 16, y - 4, 32, 4, '#9aa3ad', 1) + ln(x - 14, y - 4, x + 14, y - 4, '#c5ccd3', 1); return pg([[x - 13, y - 22], [x + 13, y - 22], [x + 15, y - 3], [x - 11, y - 3]], '#9aa3ad') + pg([[x - 11, y - 20], [x + 11, y - 20], [x + 13, y - 5], [x - 9, y - 5]], '#bfe3ff', 1) + rc(x - 18, y - 4, 36, 4, '#9aa3ad', 1); },
    monitor: function (x, y) { return rc(x - 16, y - 30, 32, 22, '#555b66', 2) + rc(x - 13, y - 27, 26, 16, '#bfe3ff', 1, 1) + ln(x, y - 8, x, y - 2, K, 3) + ln(x - 7, y - 1, x + 7, y - 1, K, 3); },
    keyboard: function (x, y) { return rc(x - 14, y - 3, 28, 3, '#cfd4da', 1, 1.2); },
    phone: function (x, y) { return rc(x - 4, y - 3, 12, 3, '#333', 1, 1); },
    phoneUp: function (x, y) { return rc(x - 3, y - 6, 6, 11, '#333', 1.5, 1) + rc(x - 2, y - 4.5, 4, 7, '#8fd0f5', .5, 0); },
    cup: function (x, y, c, steam) { var s = pa('M' + (x - 5) + ' ' + (y - 10) + ' L' + (x + 5) + ' ' + (y - 10) + ' L' + (x + 4) + ' ' + y + ' L' + (x - 4) + ' ' + y + 'Z', c || '#fff') + pa('M' + (x + 5) + ' ' + (y - 8) + ' q5 1 3 5 L' + (x + 4) + ' ' + (y - 3), 'none', 1.5); if (steam) s += pa('M' + (x - 2) + ' ' + (y - 13) + ' q-3 -4 0 -8 M' + (x + 2) + ' ' + (y - 13) + ' q3 -4 0 -8', 'none', 1.2, '#999'); return s; },
    glass: function (x, y, full) { return (full ? pg([[x - 4.5, y - 9], [x + 4.5, y - 9], [x + 4, y], [x - 4, y]], '#8fd0f5', 0) : '') + pa('M' + (x - 5) + ' ' + (y - 14) + ' L' + (x - 4) + ' ' + y + ' L' + (x + 4) + ' ' + y + ' L' + (x + 5) + ' ' + (y - 14), 'none', 1.5); },
    bottle: function (x, y, ang) { return '<g transform="rotate(' + (ang || 0) + ' ' + x + ' ' + y + ')">' + rc(x - 4, y - 18, 8, 18, '#7fc4e8', 2, 1.4) + rc(x - 2, y - 24, 4, 7, '#7fc4e8', 1, 1.4) + '</g>'; },
    cpot: function (x, y, ang) { return '<g transform="rotate(' + (ang || 0) + ' ' + x + ' ' + y + ')">' + pa('M' + (x - 7) + ' ' + (y - 16) + ' L' + (x + 7) + ' ' + (y - 16) + ' L' + (x + 9) + ' ' + y + ' L' + (x - 9) + ' ' + y + 'Z', '#555b66') + pa('M' + (x + 7) + ' ' + (y - 14) + ' l7 -4', 'none', 2.4) + pa('M' + (x - 8) + ' ' + (y - 12) + ' q-6 4 -1 9', 'none', 2) + '</g>'; },
    clock: function (x, y) { return ci(x, y, 12, '#fff', 2) + ln(x, y, x, y - 8, K, 2) + ln(x, y, x + 6, y + 2, K, 2); },
    frame: function (x, y, w, h) { w = w || 40; h = h || 30; return rc(x - w / 2, y, w, h, '#c79a63', 1, 2) + rc(x - w / 2 + 4, y + 4, w - 8, h - 8, '#dcefff', 0, 1) + pg([[x - w / 2 + 4, y + h - 4], [x - 6, y + 10], [x + 2, y + h - 10], [x + 8, y + 14], [x + w / 2 - 4, y + h - 4]], '#7cb36a', 0) + ci(x + w / 2 - 10, y + 10, 3, '#f6c445', 0); },
    ladder: function (x, y, ht, lean) { ht = ht || 90; lean = lean == null ? 16 : lean; var s = ln(x, y, x + lean, y - ht, '#a0703f', 3.2) + ln(x + 16, y, x + 16 + lean, y - ht, '#a0703f', 3.2); for (var i = 1; i < 7; i++) { var t = i / 7; s += ln(x + lean * t, y - ht * t, x + 16 + lean * t, y - ht * t, '#a0703f', 2.4); } return s; },
    bike: function (x, y, d) { d = d || 1; var X = function (v) { return x + v * d; }, s = ci(X(-20), y - 13, 13, 'none', 2.4) + ci(X(20), y - 13, 13, 'none', 2.4) + ci(X(-20), y - 13, 2, K, 0) + ci(X(20), y - 13, 2, K, 0); s += pl([[X(-20), y - 13], [X(-2), y - 13], [X(-8), y - 33], [X(-20), y - 13]], '#d14b4b', 2.6) + pl([[X(-2), y - 13], [X(13), y - 33], [X(-8), y - 33]], '#d14b4b', 2.6) + ln(X(13), y - 33, X(20), y - 13, '#d14b4b', 2.6) + ln(X(13), y - 33, X(12), y - 40, K, 2.2) + ln(X(9), y - 40, X(16), y - 40, K, 2.6) + ln(X(-12), y - 36, X(-4), y - 36, K, 3) + ln(X(-8), y - 33, X(-8), y - 36, K, 2); return s; },
    car: function (x, y, c, d) { c = c || '#e07b39'; return pa('M' + (x - 38) + ' ' + (y - 10) + ' L' + (x - 38) + ' ' + (y - 24) + ' Q' + (x - 36) + ' ' + (y - 28) + ' ' + (x - 28) + ' ' + (y - 29) + ' L' + (x - 18) + ' ' + (y - 44) + ' L' + (x + 16) + ' ' + (y - 44) + ' L' + (x + 26) + ' ' + (y - 29) + ' Q' + (x + 38) + ' ' + (y - 28) + ' ' + (x + 38) + ' ' + (y - 20) + ' L' + (x + 38) + ' ' + (y - 10) + 'Z', c, 2) + pg([[x - 14, y - 40], [x - 1, y - 40], [x - 1, y - 30], [x - 22, y - 30]], '#bfe3ff', 1.2) + pg([[x + 3, y - 40], [x + 14, y - 40], [x + 21, y - 30], [x + 3, y - 30]], '#bfe3ff', 1.2) + ci(x - 22, y - 9, 8, '#444', 2) + ci(x + 22, y - 9, 8, '#444', 2) + ci(x - 22, y - 9, 3, '#bbb', 0) + ci(x + 22, y - 9, 3, '#bbb', 0); },
    bus: function (x, y, open) { var s = rc(x - 60, y - 64, 120, 54, '#f2c230', 6, 2); for (var i = 0; i < 4; i++) s += rc(x - 54 + i * 22, y - 56, 17, 18, '#bfe3ff', 2, 1.2); s += rc(x + 36, y - 56, 18, 44, open ? '#3f3a36' : '#bfe3ff', 1, 1.4) + (open ? '' : ln(x + 45, y - 56, x + 45, y - 12, K, 1.2)) + rc(x - 60, y - 30, 96, 5, '#e09a1a', 0, 0) + ci(x - 36, y - 10, 9, '#444', 2) + ci(x + 22, y - 10, 9, '#444', 2) + ci(x - 36, y - 10, 3, '#bbb', 0) + ci(x + 22, y - 10, 3, '#bbb', 0); return s; },
    boat: function (x, y, k) { return sc(k || 1, x, y, pa('M' + (x - 30) + ' ' + (y - 16) + ' L' + (x + 30) + ' ' + (y - 16) + ' L' + (x + 20) + ' ' + y + ' L' + (x - 22) + ' ' + y + 'Z', '#c8693f', 2) + ln(x, y - 16, x, y - 60, K, 2.4) + pg([[x + 2, y - 58], [x + 26, y - 22], [x + 2, y - 22]], '#fff') + pg([[x - 2, y - 52], [x - 20, y - 22], [x - 2, y - 22]], '#f0f0f0')); },
    pier: function (x, y, w) { w = w || 120; var s = rc(x - w / 2, y - 8, w, 7, '#b9864f', 1, 1.6); for (var i = 0; i < 5; i++) s += rc(x - w / 2 + 6 + i * (w - 16) / 4, y - 1, 5, 18, '#8a5a2a', 1, 1.4); return s; },
    umbOpen: function (x, y, c) { c = c || '#d35f5f'; return pa('M' + (x - 26) + ' ' + y + ' Q' + x + ' ' + (y - 34) + ' ' + (x + 26) + ' ' + y + ' Q' + (x + 17) + ' ' + (y - 5) + ' ' + (x + 9) + ' ' + y + ' Q' + x + ' ' + (y - 5) + ' ' + (x - 9) + ' ' + y + ' Q' + (x - 17) + ' ' + (y - 5) + ' ' + (x - 26) + ' ' + y + 'Z', c, 1.8); },
    umbClosed: function (x, y, c, ang) { c = c || '#d35f5f'; return '<g transform="rotate(' + (ang || 0) + ' ' + x + ' ' + y + ')">' + pa('M' + x + ' ' + (y - 50) + ' L' + (x + 5) + ' ' + (y - 14) + ' L' + (x - 5) + ' ' + (y - 14) + 'Z', c, 1.6) + ln(x, y - 14, x, y - 3, K, 2) + pa('M' + x + ' ' + (y - 3) + ' q0 4 4 3', 'none', 2) + '</g>'; },
    bag: function (x, y, c) { c = c || '#8a5a9a'; return pa('M' + (x - 6) + ' ' + (y - 16) + ' q6 -10 12 0', 'none', 2.2) + rc(x - 11, y - 16, 22, 16, c, 3, 1.6); },
    cart: function (x, y, d, load) { d = d || 1; var X = function (v) { return x + v * d; }, s = ''; if (load) s += O.box(X(-2), y - 26, 18, 14) + O.box(X(10), y - 26, 14, 11); s += pg([[X(-22), y - 44], [X(22), y - 44], [X(16), y - 20], [X(-16), y - 20]], 'rgba(200,210,220,.35)', 2) + ln(X(-10), y - 44, X(-8), y - 20, K, 1.2) + ln(X(2), y - 44, X(2), y - 20, K, 1.2) + ln(X(12), y - 44, X(10), y - 20, K, 1.2) + ln(X(-22), y - 44, X(-30), y - 54, K, 2.4) + ln(X(-16), y - 20, X(-16), y - 8, K, 2) + ln(X(16), y - 20, X(16), y - 8, K, 2) + ci(X(-14), y - 4, 4, '#555', 1.4) + ci(X(14), y - 4, 4, '#555', 1.4); return s; },
    broom: function (x, y, ang) { return '<g transform="rotate(' + (ang || 0) + ' ' + x + ' ' + y + ')">' + ln(x, y - 14, x, y - 76, '#a0703f', 3) + pg([[x - 4, y - 14], [x + 4, y - 14], [x + 10, y], [x - 10, y]], '#e3b341') + '</g>'; },
    wcan: function (x, y, ang) { return '<g transform="rotate(' + (ang || 0) + ' ' + x + ' ' + y + ')">' + rc(x - 9, y - 14, 16, 14, '#5fa3c8', 2) + ln(x + 7, y - 10, x + 18, y - 18, '#5fa3c8', 3) + pa('M' + (x - 5) + ' ' + (y - 14) + ' q4 -8 8 0', 'none', 2) + '</g>'; },
    cat: function (x, y, sleep) { if (sleep) return pa('M' + (x - 14) + ' ' + y + ' Q' + (x - 14) + ' ' + (y - 14) + ' ' + x + ' ' + (y - 14) + ' Q' + (x + 14) + ' ' + (y - 14) + ' ' + (x + 14) + ' ' + y + 'Z', '#f0a04b') + ci(x + 12, y - 7, 6, '#f0a04b') + pg([[x + 8, y - 11], [x + 9, y - 17], [x + 12, y - 12]], '#f0a04b', 1.2) + pa('M' + (x - 14) + ' ' + (y - 2) + ' q-6 -2 -4 -8', 'none', 2.4, '#f0a04b'); return pa('M' + (x - 12) + ' ' + y + ' L' + (x - 10) + ' ' + (y - 14) + ' Q' + x + ' ' + (y - 18) + ' ' + (x + 6) + ' ' + (y - 14) + ' L' + (x + 8) + ' ' + y + 'Z', '#f0a04b') + ci(x + 6, y - 20, 7, '#f0a04b') + pg([[x + 1, y - 25], [x + 2, y - 31], [x + 6, y - 26]], '#f0a04b', 1.2) + pg([[x + 7, y - 26], [x + 11, y - 31], [x + 12, y - 24]], '#f0a04b', 1.2) + ci(x + 8.5, y - 21, 1, K, 0) + pa('M' + (x - 12) + ' ' + (y - 3) + ' q-10 -2 -8 -16', 'none', 2.6, '#f0a04b'); },
    board: function (x, y, w, h, lines) { w = w || 80; h = h || 50; var s = rc(x - w / 2, y, w, h, '#fff', 2, 2); if (lines !== false) s += pl([[x - w / 2 + 10, y + h - 12], [x - 10, y + h - 26], [x + 6, y + h - 18], [x + w / 2 - 10, y + 12]], '#4f86c6', 2.2) + ln(x - w / 2 + 8, y + h - 8, x + w / 2 - 8, y + h - 8, '#999', 1); return s; },
    bldg: function (x, y, w, h) { w = w || 110; h = h || 80; var s = rc(x - w / 2, y - h, w, h, '#e9d8c0', 1, 2); for (var r = 0; r < 2; r++) for (var c = 0; c < 4; c++) s += rc(x - w / 2 + 10 + c * ((w - 20) / 4), y - h + 10 + r * 26, (w - 20) / 4 - 8, 16, '#bfe3ff', 1, 1.2); s += rc(x - 10, y - 26, 20, 26, '#8a6a4a', 1, 1.4); return s; },
    stairs: function (x, y, k) { k = k || 5; var s = '', st = 14; for (var i = 0; i < k; i++) s += rc(x - 40 + i * st, y - (i + 1) * st, 80 - i * st, st, '#d8cfbe', 0, 1.4); return s; },
    sign: function (x, y) { return ln(x, y, x, y - 70, '#666', 3) + rc(x - 12, y - 84, 24, 18, '#2f7fd1', 3) + '<text x="' + x + '" y="' + (y - 71) + '" font-size="10" font-family="sans-serif" font-weight="700" fill="#fff" text-anchor="middle">BUS</text>'; },
    vase: function (x, y, fl) { var s = ''; if (fl) s += ln(x, y - 20, x - 8, y - 40, '#5fa36a', 1.8) + ln(x, y - 20, x + 1, y - 46, '#5fa36a', 1.8) + ln(x, y - 20, x + 9, y - 38, '#5fa36a', 1.8) + ci(x - 8, y - 42, 4, '#e36a8a') + ci(x + 1, y - 48, 4, '#f6c445') + ci(x + 9, y - 40, 4, '#e36a8a'); return s + pa('M' + (x - 5) + ' ' + (y - 22) + ' L' + (x + 5) + ' ' + (y - 22) + ' Q' + (x + 11) + ' ' + (y - 10) + ' ' + (x + 6) + ' ' + y + ' L' + (x - 6) + ' ' + y + ' Q' + (x - 11) + ' ' + (y - 10) + ' ' + (x - 5) + ' ' + (y - 22) + 'Z', '#7aa7d8'); },
    flowers: function (x, y) { return ln(x - 14, y - 2, x + 10, y - 4, '#5fa36a', 1.8) + ln(x - 14, y - 2, x + 12, y + 1, '#5fa36a', 1.8) + ci(x + 12, y - 5, 4, '#e36a8a') + ci(x + 14, y + 1, 4, '#f6c445') + ci(x + 9, y - 1, 3.5, '#e36a8a'); },
    hat: function (x, y, c) { return rc(x - 8, y - 12, 16, 10, c || '#6b4f2a', 2, 1.4) + ln(x - 14, y - 2, x + 14, y - 2, K, 3); },
    specs: function (x, y) { return ci(x - 7, y, 5.5, '#e8f4ff', 2) + ci(x + 7, y, 5.5, '#e8f4ff', 2) + ln(x - 1.5, y, x + 1.5, y, K, 2) + ln(x - 12.5, y - 1, x - 18, y - 3, K, 2) + ln(x + 12.5, y - 1, x + 18, y - 3, K, 2); },
    paper: function (x, y) { return rc(x - 8, y - 10, 16, 12, '#fff', 1, 1.2) + ln(x - 5, y - 6, x + 5, y - 6, '#999', 1) + ln(x - 5, y - 3, x + 3, y - 3, '#999', 1); },
    road: function () { return ''; }
  };
  // sách đang cầm (mở)
  function bookOpen(x, y) { return pg([[x - 9, y - 8], [x, y - 5], [x, y + 5], [x - 9, y + 2]], '#fff', 1.4) + pg([[x + 9, y - 8], [x, y - 5], [x, y + 5], [x + 9, y + 2]], '#fff', 1.4) + rc(x - 9.5, y - 8.5, 19, 0.1, '#d35f5f', 0, 0); }

  // ---------- cảnh ----------
  var C1 = '#4f86c6', C2 = '#d35f5f', C3 = '#5fa36a', C4 = '#9a6fc0', C5 = '#e07b39';
  function man(x, o) { o = o || {}; if (!o.c) o.c = C1; return P(x, o.y || G, o); }
  function wom(x, o) { o = o || {}; o.f = 1; if (!o.c) o.c = C2; return P(x, o.y || G, o); }
  function deskSet(x, open) { return O.table(x, G, 70) + O.laptop(x + 6, G - 36, open !== false); }
  function catScene(where) {
    var s = bg('in') + O.table(80, G, 64) + O.chair(150, G, 1) + O.box(36, G, 30, 22, true);
    if (where === 'on') s += O.cat(80, G - 36);
    if (where === 'under') s += O.cat(80, G, 1);
    if (where === 'chair') s += O.cat(152, G - 30);
    if (where === 'box') s += O.cat(36, G - 14);
    return s;
  }
  function bagScene(where) { var s = bg('in') + O.chair(70, G, 1) + O.table(142, G, 56); if (where === 'on') s += O.bag(72, G - 30); if (where === 'under') s += O.bag(72, G); if (where === 'table') s += O.bag(142, G - 36); return s; }
  function hand(p, f) { return f(p.h[0], p.h[1]); }
  var SC = {
    // --- Cấp 1: đồ vật ---
    o_bike: function () { return bg('plain') + sc(1.6, 100, G, O.bike(100, G)); },
    o_car: function () { return bg('plain') + sc(1.4, 100, G, O.car(100, G)); },
    o_bus: function () { return bg('plain') + sc(1.2, 100, G, O.bus(100, G)); },
    o_cup: function () { return bg('plain') + sc(3.6, 100, G, O.cup(100, G, '#fff', 1)); },
    o_book: function () { return bg('plain') + sc(2.6, 100, G, rc(86, G - 32, 28, 32, C2, 2, 1.4) + rc(90, G - 26, 18, 6, '#fff', 1, 0)); },
    o_chair: function () { return bg('plain') + sc(1.7, 100, G, O.chair(100, G, 1)); },
    o_table: function () { return bg('plain') + sc(1.6, 100, G, O.table(100, G, 70)); },
    o_door: function () { return bg('plain') + sc(1.4, 100, G, O.door(100, G, 0)); },
    o_win: function () { return '<rect width="200" height="150" fill="#f6efe2"/>' + sc(1.6, 100, 75, O.win(100, 55, 0)); },
    o_plant: function () { return bg('plain') + sc(1.8, 100, G, O.plant(100, G)); },
    o_tree: function () { return bg('out') + sc(1.3, 100, G, O.tree(100, G)); },
    o_ladder: function () { return bg('plain') + sc(1.1, 100, G, O.ladder(88, G, 100, 0)); },
    o_laptop: function () { return bg('plain') + sc(3, 100, G, O.laptop(100, G, 1)); },
    o_phone: function () { return bg('plain') + sc(4, 100, G - 30, O.phoneUp(100, G - 30)); },
    o_box: function () { return bg('plain') + sc(2.4, 100, G, O.box(100, G, 30, 24, 0)); },
    o_clock: function () { return '<rect width="200" height="150" fill="#f6efe2"/>' + sc(3.4, 100, 75, O.clock(100, 75)); },
    o_umb: function () { return bg('plain') + sc(2, 100, G, ln(100, G - 2, 100, G - 40, K, 2) + pa('M100 ' + (G - 2) + ' q0 5 5 4', 'none', 2) + O.umbOpen(100, G - 38)); },
    o_bag: function () { return bg('plain') + sc(3, 100, G, O.bag(100, G)); },
    o_lamp: function () { return bg('plain') + sc(1.15, 100, G, O.lamp(100, G, 0)); },
    o_boat: function () { return bg('water') + sc(1.5, 100, 128, O.boat(100, 128)); },
    o_stairs: function () { return bg('plain') + sc(1.3, 100, G, O.stairs(100, G, 6)); },
    o_bench: function () { return bg('out') + sc(1.6, 100, G, O.bench(100, G)); },
    o_shelf: function () { return bg('plain') + sc(1.1, 100, G, O.shelf(100, G, 70, 100) + O.books(72, G - 54, 8) + O.books(74, G - 6, 6)); },
    o_cart: function () { return bg('plain') + sc(1.8, 100, G, O.cart(100, G)); },
    o_glasses: function () { return bg('plain') + sc(3.4, 100, 80, O.specs(100, 80)); },
    o_hat: function () { return bg('plain') + sc(3.4, 100, 100, O.hat(100, 100)); },
    // --- Cấp 1: hành động ---
    a_walk: function () { return bg('out') + sc(1.4, 100, G, man(100, { pose: 'walk' }).s); },
    a_run: function () { return bg('out') + sc(1.4, 100, G, man(100, { pose: 'run', c: C5 }).s); },
    a_sit: function () { return bg('in') + sc(1.4, 100, G, O.chair(96, G, 1) + man(100, { pose: 'sit' }).s); },
    a_read: function () { var p = man(100, { pose: 'sit', arms: ['hand', 'hand'], c: C3 }); return bg('in') + sc(1.4, 100, G, O.chair(96, G, 1) + p.s + bookOpen(p.h[0] - 1, p.h[1] - 3)); },
    a_type: function () { return bg('in') + sc(1.3, 100, G, O.chair(76, G, 1) + man(80, { pose: 'sit', arms: ['hand', 'hand'] }).s + O.table(118, G, 50) + O.laptop(116, G - 36, 1)); },
    a_wave: function () { return bg('out') + sc(1.4, 100, G, wom(100, { arms: ['down', 'wave'] }).s); },
    a_point: function () { return bg('in') + sc(1.4, 100, G, man(90, { arms: ['down', 'point'], c: C4 }).s); },
    a_carry: function () { var p = man(100, { pose: 'walk', arms: ['carry', 'carry'] }); return bg('in') + sc(1.4, 100, G, p.s + O.box(p.h[0] - 3, p.h[1] + 8, 24, 18)); },
    a_drink: function () { var p = wom(100, { arms: ['down', 'mouth'] }); return bg('in') + sc(1.4, 100, G, p.s + O.cup(p.h[0] + 3, p.h[1] + 4, '#fff')); },
    a_phone: function () { var p = man(100, { arms: ['down', 'ear'], c: C3 }); return bg('in') + sc(1.4, 100, G, p.s + O.phoneUp(p.h[0] + 1, p.h[1])); },
    a_climb: function () { return bg('in') + sc(1.25, 110, G, SC.s_climb_core()); },
    a_sweep: function () { return bg('in') + sc(1.4, 95, G, SC.s_sweep_core(C5)); },
    a_ride: function () { return bg('out') + sc(1.5, 100, G, SC.ride_core(100)); },
    // --- phần dùng chung ---
    ride_core: function (x) { var s = O.bike(x, G); s += P(x - 6, G, { c: C1, J: { hip: [-2, -38], neck: [6, -62], legs: [[[8, -26], [6, -8]], [[10, -30], [10, -14]]] }, arms: [[[8, 9], [16, 20]], [[8, 9], [16, 20]]] }).s; return s; },
    s_climb_core: function () { var s = O.ladder(110, G, 100, 18); s += P(120, G - 30, { pose: 'step', c: C5, J: { hip: [0, -30], neck: [3, -56], legs: [[[-1, -15], [-2, 0]], [[8, -22], [9, -12]]] }, arms: [[[6, -8], [10, -20]], [[7, -4], [12, -14]]] }).s; return s; },
    s_sweep_core: function (c) { var p = man(90, { arms: ['fwdlow', 'fwdlow'], c: c || C5 }); return p.s + O.broom(p.h[0] + 8, G, -28); },
    // --- Cấp 2 + 3 ---
    s_ride: function () { return bg('out') + O.tree(30, G, .8) + SC.ride_core(110); },
    s_walk: function () { return bg('out') + O.tree(160, G, .8) + man(80, { pose: 'walk' }).s; },
    s_walk_w: function () { return bg('out') + O.tree(160, G, .8) + wom(80, { pose: 'walk' }).s; },
    s_run_m: function () { return bg('out') + O.tree(40, G, .8) + man(110, { pose: 'run', c: C5 }).s; },
    s_run_w: function () { return bg('out') + O.tree(40, G, .8) + O.tree(170, G, .7) + wom(110, { pose: 'run', c: C4 }).s; },
    s_drive: function () { return bg('street') + O.car(100, G + 4, '#4f86c6') + ci(106, G - 31, 6, SKIN, 1.4) + pa('M100 ' + (G - 33) + ' q6 -8 12 0', HAIR, 0) + ci(110, G - 32, 0.9, K, 0); },
    s_car_parked: function () { return bg('street') + O.tree(160, 110, .7) + O.car(80, G + 4, '#e07b39'); },
    s_bike_parked: function () { return bg('out') + O.tree(150, G, .9) + O.bike(80, G); },
    s_bus: function () { return bg('street') + O.bus(100, G + 4); },
    s_walk_bike: function () { var s = bg('out') + O.tree(30, G, .8) + O.bike(120, G); return s + man(88, { pose: 'walk', arms: ['back', [[9, 6], [21, 2]]] }).s; },
    s_fix_bike: function () { return bg('out') + O.tree(170, G, .8) + O.bike(110, G) + man(66, { pose: 'kneel', arms: [[[9, 10], [20, 14]], [[10, 8], [22, 8]]], c: C3 }).s + ln(88, G - 22, 94, G - 15, '#888', 3); },
    s_read_w: function () { var p = wom(100, { pose: 'sit', arms: ['hand', 'hand'] }); return bg('in') + O.win(160, 34, 0) + O.chair(96, G, 1) + p.s + bookOpen(p.h[0] - 1, p.h[1] - 3); },
    s_read_m: function () { var p = man(100, { pose: 'sit', arms: ['hand', 'hand'], c: C3 }); return bg('in') + O.win(160, 34, 0) + O.chair(96, G, 1) + p.s + bookOpen(p.h[0] - 1, p.h[1] - 3); },
    s_type_w: function () { return bg('in') + O.chair(66, G, 1) + wom(70, { pose: 'sit', arms: ['hand', 'hand'] }).s + O.table(116, G, 60) + O.laptop(108, G - 36, 1); },
    s_type_m: function () { return bg('in') + O.chair(56, G, 1) + man(60, { pose: 'sit', arms: [[[10, 9], [24, 13]], [[10, 9], [26, 13]]] }).s + O.table(110, G, 72) + O.monitor(118, G - 36) + O.keyboard(92, G - 36); },
    s_phone_desk_m: function () { var p = man(60, { pose: 'sit', arms: ['hip', 'ear'] }); return bg('in') + O.chair(56, G, 1) + p.s + O.phoneUp(p.h[0] + 1, p.h[1]) + O.table(110, G, 72) + O.monitor(124, G - 36) + O.keyboard(98, G - 36); },
    s_read_desk_m: function () { var p = man(60, { pose: 'sit', arms: ['hand', 'hand'] }); return bg('in') + O.chair(56, G, 1) + O.table(110, G, 72) + O.monitor(124, G - 36) + O.keyboard(98, G - 36) + p.s + O.paper(p.h[0], p.h[1] - 3); },
    s_desk_empty: function () { return bg('in') + O.chair(56, G, 1) + O.table(110, G, 72) + O.monitor(118, G - 36) + O.keyboard(92, G - 36); },
    s_laptop: function () { return bg('in') + O.win(50, 30, 0) + deskSet(110) + O.chair(160, G, -1); },
    s_laptop_closed: function () { return bg('in') + O.win(50, 30, 0) + deskSet(110, false) + O.chair(160, G, -1); },
    s_cup_laptop: function () { return bg('in') + O.win(50, 30, 0) + deskSet(104) + sc(1.4, 130, G - 36, O.cup(130, G - 36, '#fff', 1)); },
    s_cup_books: function () { return bg('in') + O.win(50, 30, 0) + O.table(104, G, 70) + O.stack(104, G - 36, 3) + sc(1.4, 104, G - 54, O.cup(104, G - 54, '#fff', 1)); },
    s_phone_laptop: function () { return bg('in') + O.win(50, 30, 0) + deskSet(104) + sc(1.4, 130, G - 36, O.phone(130, G - 36)); },
    s_drink_m: function () { var p = man(80, { arms: ['down', 'mouth'] }); return bg('in') + O.table(150, G, 50) + p.s + O.cup(p.h[0] + 3, p.h[1] + 4, '#fff', 1); },
    s_drink_w: function () { var p = wom(80, { arms: ['down', 'mouth'] }); return bg('in') + O.table(150, G, 50) + p.s + O.cup(p.h[0] + 3, p.h[1] + 4, '#fff'); },
    s_phone_w: function () { var p = wom(90, { arms: ['down', 'ear'], c: C4 }); return bg('in') + O.win(160, 34, 0) + p.s + O.phoneUp(p.h[0] + 1, p.h[1]); },
    s_phone_m: function () { var p = man(90, { arms: ['down', 'ear'], c: C3 }); return bg('in') + O.win(160, 34, 0) + p.s + O.phoneUp(p.h[0] + 1, p.h[1]); },
    s_lookphone_w: function () { var p = wom(90, { arms: ['down', 'look'], c: C4 }); return bg('in') + O.win(160, 34, 0) + p.s + O.phoneUp(p.h[0] + 1, p.h[1] - 2); },
    s_phone_table: function () { return bg('in') + O.win(160, 34, 0) + O.table(90, G, 60) + O.phone(90, G - 36); },
    s_wave_w: function () { return bg('out') + O.tree(160, G, .8) + wom(90, { arms: ['down', 'wave'] }).s; },
    s_wave_m: function () { return bg('in') + man(90, { arms: ['down', 'wave'], c: C4 }).s; },
    s_open_door: function () { return bg('in') + O.door(100, G, 1) + man(126, { d: -1, arms: ['down', [[9, 6], [17, 2]]] }).s; },
    s_door_open: function () { return bg('in') + O.plant(160, G, .8) + O.door(100, G, 1); },
    s_door_closed: function () { return bg('in') + O.plant(160, G, .8) + O.door(100, G, 0); },
    s_win_open: function () { return bg('in') + O.win(96, 36, 1, 56, 48) + O.plant(160, G, .8); },
    s_win_closed: function () { return bg('in') + O.win(96, 36, 0, 56, 48) + O.plant(160, G, .8); },
    s_sit_chair_m: function () { return bg('in') + O.chair(96, G, 1) + man(100, { pose: 'sit' }).s; },
    s_sit_chair_w: function () { return bg('in') + O.chair(96, G, 1) + wom(100, { pose: 'sit' }).s; },
    s_water: function () { var p = wom(70, { arms: ['down', 'fwd'], c: C3 }); return bg('out') + O.plant(130, G, .9) + O.plant(165, G, .8) + p.s + O.wcan(p.h[0] + 2, p.h[1] + 10, 28) + pa('M118 99 q3 6 2 12 M121 98 q4 6 4 11', 'none', 1.4, '#5fa3c8'); },
    s_carry_plant: function () { var p = wom(90, { pose: 'walk', arms: ['carry', 'carry'], c: C3 }); return bg('in') + p.s + O.plant(p.h[0] - 3, p.h[1] + 12, .7); },
    s_plant_win: function () { return bg('in') + O.win(100, 34, 0, 56, 44) + O.plant(100, G); },
    s_plant_floor: function () { return bg('in') + O.plant(100, G, 1.2) + O.chair(160, G, -1); },
    s_plant_table: function () { return bg('in') + O.table(100, G, 60) + O.plant(100, G - 36, .8); },
    s_plant_hang: function () { return bg('in') + ln(0, 1, 200, 1, K, 2) + O.hangplant(100, 0, 64) + O.chair(160, G, -1); },
    s_lamp_ceiling: function () { return bg('in') + O.ceilamp(100, 40) + O.table(100, G, 60); },
    s_sweep_w: function () { var p = wom(90, { arms: ['fwdlow', 'fwdlow'], c: C4 }); return bg('in') + p.s + O.broom(p.h[0] + 8, G, -28); },
    s_sweep_m: function () { return bg('in') + O.win(160, 34, 0) + SC.s_sweep_core(); },
    s_broom: function () { return bg('in') + ln(0, 118, 200, 118, '#cdb48c', 1.5) + O.broom(116, G, 14) + O.chair(60, G, 1); },
    s_broom_floor: function () { return bg('in') + O.broom(100, G - 4, -90) + O.chair(160, G, -1); },
    s_bench2: function () { return bg('out') + O.tree(170, G, .8) + O.bench(90, G, 84) + man(72, { pose: 'sit', h: 28 }).s + wom(102, { pose: 'sit', h: 28, c: C5 }).s; },
    s_bench_w: function () { return bg('out') + O.tree(170, G, .8) + O.bench(90, G, 80) + wom(88, { pose: 'sit', h: 28 }).s; },
    s_bench_empty: function () { return bg('out') + O.tree(170, G, .8) + O.bench(90, G, 80); },
    s_stand_bench_w: function () { return bg('out') + O.tree(170, G, .8) + O.bench(80, G, 70) + wom(136, { d: -1 }).s; },
    s_walk2: function () { return bg('out') + O.tree(30, G, .8) + O.tree(175, G, .7) + man(90, { pose: 'walk' }).s + wom(122, { pose: 'walk', c: C5 }).s; },
    s_shake: function () { return bg('in') + man(78, { arms: ['down', [[10, 8], [20, 12]]] }).s + wom(122, { d: -1, c: C3, arms: ['down', [[10, 8], [20, 12]]] }).s; },
    s_wave2: function () { return bg('out') + man(60, { arms: ['down', 'wave'] }).s + wom(140, { d: -1, c: C3, arms: ['down', 'wave'] }).s; },
    s_trees: function () { return bg('out') + O.tree(40, G, .9) + O.tree(100, G, 1) + O.tree(160, G, .9); },
    s_climb: function () { return bg('in') + O.win(50, 30, 0) + SC.s_climb_core(); },
    s_ladder: function () { return bg('in') + O.win(50, 30, 0) + O.ladder(110, G, 100, 18); },
    s_hold_ladder: function () { return bg('in') + O.win(50, 30, 0) + O.ladder(110, G, 100, 18) + man(88, { arms: [[[8, 4], [18, 4]], [[9, 2], [20, -2]]], c: C5 }).s; },
    s_carry_m: function () { var p = man(90, { pose: 'walk', arms: ['carry', 'carry'] }); return bg('in') + p.s + O.box(p.h[0] - 3, p.h[1] + 8, 24, 18); },
    s_carry_w: function () { var p = wom(90, { pose: 'walk', arms: ['carry', 'carry'] }); return bg('in') + p.s + O.box(p.h[0] - 3, p.h[1] + 8, 24, 18); },
    s_boxes_stack: function () { return bg('in') + O.box(100, G, 36, 26) + O.box(100, G - 26, 32, 24) + O.box(100, G - 50, 28, 22); },
    s_boxes_row: function () { return bg('in') + O.box(55, G, 32, 24) + O.box(100, G, 32, 24) + O.box(145, G, 32, 24); },
    s_box_open: function () { return bg('in') + O.box(100, G, 40, 30, 1); },
    s_cart_w: function () { return bg('in') + O.cart(118, G, 1, 1) + wom(76, { pose: 'walk', arms: [[[9, 2], [16, -2]], [[9, 2], [16, -2]]] }).s; },
    s_cart_m: function () { return bg('in') + O.cart(118, G, 1, 1) + man(76, { pose: 'walk', arms: [[[9, 2], [16, -2]], [[9, 2], [16, -2]]] }).s; },
    s_cart: function () { return bg('in') + O.cart(100, G, 1, 1); },
    s_cat_on: function () { return catScene('on'); }, s_cat_under: function () { return catScene('under'); }, s_cat_chair: function () { return catScene('chair'); }, s_cat_box: function () { return catScene('box'); },
    s_bag_on: function () { return bagScene('on'); }, s_bag_under: function () { return bagScene('under'); }, s_bag_table: function () { return bagScene('table'); }, s_chair: function () { return bagScene(''); },
    s_shelf_books: function () { return bg('in') + O.shelf(100, G, 76, 96) + O.books(68, G - 52, 8) + O.books(70, G - 6, 6) + O.plant(160, G, .7); },
    s_shelf_empty: function () { return bg('in') + O.shelf(100, G, 76, 96) + O.plant(160, G, .7); },
    s_books_box: function () { return bg('in') + O.shelf(60, G, 60, 96) + O.box(140, G, 44, 28, 1) + O.books(126, G - 22, 4); },
    s_books_table: function () { return bg('in') + O.table(100, G, 70) + O.stack(100, G - 36, 5); },
    s_reach_shelf: function () { return bg('in') + O.shelf(110, G, 76, 100) + O.books(80, G - 56, 8) + O.books(82, G - 6, 6) + man(56, { arms: ['down', [[9, -9], [22, -18]]], c: C3 }).s; },
    s_stand_shelf: function () { return bg('in') + O.shelf(110, G, 76, 100) + O.books(80, G - 56, 8) + O.books(82, G - 6, 6) + man(50, { c: C3 }).s; },
    s_clock_wall: function () { return bg('in') + O.clock(100, 48) + O.table(100, G, 60); },
    s_clock_table: function () { return bg('in') + O.table(100, G, 60) + sc(.8, 100, G - 36, rc(88, G - 66, 24, 30, '#c79a63', 3) + O.clock(100, G - 51)); },
    s_pic_wall: function () { return bg('in') + O.frame(100, 26, 52, 38) + O.sofa(100, G); },
    s_pic_floor: function () { return bg('in') + O.sofa(70, G) + '<g transform="rotate(-8 150 ' + G + ')">' + O.frame(150, G - 38, 50, 38) + '</g>'; },
    s_umb_w: function () { var p = wom(90, { arms: ['down', [[9, -4], [12, -16]]], c: C3 }); return bg('out') + p.s + ln(p.h[0], p.h[1] + 2, p.h[0], p.h[1] - 32, K, 2) + O.umbOpen(p.h[0], p.h[1] - 30, C4); },
    s_umb_closed: function () { return bg('in') + O.umbClosed(100, G, C4, 10) + O.chair(150, G, -1); },
    s_umb_open: function () { return bg('in') + O.umbOpen(100, G - 6, C4) + ln(100, G - 6, 100, G - 32, K, 2) + O.chair(160, G, -1); },
    s_hold_umb_w: function () { var p = wom(84, { arms: ['down', 'fwdlow'], c: C3 }); return bg('out') + p.s + O.umbClosed(p.h[0] + 4, p.h[1] + 34, C4, -12); },
    s_bag_w: function () { var p = wom(90, { c: C3 }); return bg('out') + p.s + O.bag(p.h[0] + 1, p.h[1] + 16); },
    s_bag: function () { return bg('in') + O.bag(100, G) + O.chair(160, G, -1); },
    s_pour_w: function () { var p = wom(70, { arms: ['down', [[9, 6], [19, 2]]] }); return bg('in') + O.table(110, G, 64) + p.s + O.cpot(p.h[0] + 1, p.h[1] + 8, 40) + O.cup(108, G - 36, '#fff') + pa('M102 ' + (G - 54) + ' q3 6 5 14', 'none', 2, '#7a4a20'); },
    s_cups_table: function () { return bg('in') + O.table(100, G, 64) + O.cup(86, G - 36, '#fff', 1) + O.cup(110, G - 36, '#fff', 1) + O.cpot(126, G - 36); },
    s_pour_glass: function () { var p = wom(70, { arms: ['down', [[9, 6], [19, 2]]], c: C3 }); return bg('in') + O.table(110, G, 64) + p.s + O.bottle(p.h[0] + 2, p.h[1] + 4, 70) + O.glass(108, G - 36, 1) + pa('M106 ' + (G - 58) + ' q2 6 2 16', 'none', 2, '#5fb0e0'); },
    s_drink_glass: function () { var p = wom(80, { arms: ['down', 'mouth'], c: C3 }); return bg('in') + O.table(150, G, 50) + O.bottle(146, G - 36) + p.s + O.glass(p.h[0] + 3, p.h[1] + 6, 1); },
    s_glass_table: function () { return bg('in') + O.table(100, G, 64) + O.glass(90, G - 36, 1) + O.bottle(112, G - 36); },
    s_bottle_hold: function () { var p = wom(80, { c: C3 }); return bg('in') + O.table(150, G, 50) + O.glass(150, G - 36, 0) + p.s + O.bottle(p.h[0] + 1, p.h[1] + 12); },
    s_busstop_m: function () { return bg('street') + O.sign(70, 112) + man(100, { y: 112 }).s + O.tree(170, 110, .7); },
    s_geton_bus: function () { return bg('street') + O.bus(80, G + 2, 1) + man(118, { y: 128, pose: 'walk', d: -1, c: C5, J: { hip: [0, -30], neck: [-2, -56], legs: [[[-3, -15], [-6, 0]], [[9, -22], [12, -14]]] }, arms: ['back', 'swing'] }).s; },
    s_boat: function () { return bg('water') + O.boat(100, 126); },
    s_boats_pier: function () { return bg('water') + O.boat(60, 128, .8) + O.boat(140, 128, .8) + O.pier(100, 112, 190) + ln(78, 112, 78, 120, K, 1.2) + ln(122, 112, 122, 120, K, 1.2); },
    s_pier: function () { return bg('water') + O.pier(100, 112, 190); },
    s_boats_open: function () { return bg('water') + O.boat(50, 118, .6) + O.boat(150, 136, .8); },
    s_bldg: function () { return bg('street') + O.bldg(100, 108); },
    s_car_bldg: function () { return bg('street') + O.bldg(100, 108) + O.car(100, G + 6, '#d35f5f'); },
    s_bus_bldg: function () { return bg('street') + O.bldg(100, 108) + O.bus(100, G + 6); },
    s_car_tree: function () { return bg('street') + O.tree(80, 108, 1) + O.car(110, G + 6, '#d35f5f'); },
    s_cars_row: function () { return bg('street') + sc(.62, 100, 136, O.car(30, 136, '#d35f5f') + O.car(115, 136, '#4f86c6') + O.car(200, 136, '#5fa36a')); },
    s_trees_road: function () { return bg('street') + O.tree(25, 110, .65) + O.tree(75, 110, .65) + O.tree(125, 110, .65) + O.tree(175, 110, .65); },
    s_road: function () { return bg('street') + O.bldg(150, 108, 70, 60); },
    s_tree_one: function () { return bg('out') + O.tree(100, G, 1.1); },
    s_hat_m: function () { return bg('out') + man(100, { hat: '#6b4f2a' }).s; },
    s_hat_w: function () { return bg('out') + wom(100, { hat: '#6b4f2a', c: C3 }).s; },
    s_stand_m: function () { return bg('out') + man(100, {}).s; },
    s_stand_w: function () { return bg('out') + wom(100, { c: C3 }).s; },
    s_hold_hat_m: function () { var p = man(100, { arms: ['down', 'fwd'] }); return bg('out') + p.s + O.hat(p.h[0] + 6, p.h[1] + 4); },
    s_hold_hat_w: function () { var p = wom(100, { arms: ['down', 'fwd'], c: C3 }); return bg('out') + p.s + O.hat(p.h[0] + 6, p.h[1] + 4); },
    s_lamp_on: function () { return bg('in') + O.sofa(70, G) + O.lamp(150, G, 1); },
    s_lamp_off: function () { return bg('in') + O.sofa(70, G) + O.lamp(150, G, 0); },
        s_chairs_stack: function () { return bg('in') + O.chair(100, G, 1) + O.chair(102, G - 9, 1) + O.chair(104, G - 18, 1) + O.table(165, G, 40); },
    s_chairs_row: function () { return bg('in') + O.chair(40, G, 1) + O.chair(80, G, 1) + O.chair(120, G, 1) + O.chair(160, G, 1); },
    s_table: function () { return bg('in') + O.table(100, G, 70); },
    s_point_board: function () { return bg('in') + O.board(110, 30, 90, 56) + man(48, { arms: ['down', [[11, -6], [26, -12]]], c: C4 }).s; },
    s_board: function () { return bg('in') + O.board(110, 30, 90, 56) + O.chair(40, G, 1); },
    s_sit_board: function () { return bg('in') + O.board(120, 30, 90, 56) + O.chair(46, G, 1) + man(50, { pose: 'sit', c: C4 }).s; },
    s_stairs_m: function () { return bg('in') + O.stairs(110, G, 6) + man(100, { y: G - 28, c: C5 }).s; },
    s_stairs: function () { return bg('in') + O.stairs(110, G, 6); },
    s_stand_stairs: function () { return bg('in') + O.stairs(130, G, 6) + man(36, { c: C5 }).s; },
    s_vase_fl: function () { return bg('in') + O.table(100, G, 60) + O.vase(100, G - 36, 1); },
    s_vase_empty: function () { return bg('in') + O.table(100, G, 60) + O.vase(100, G - 36, 0); },
    s_flowers_table: function () { return bg('in') + O.table(100, G, 60) + O.flowers(98, G - 40); }
  };
  // cảnh "ghế quanh bàn": ghế giữa đứng sau bàn (vẽ trước bàn)
  SC.s_chairs_table = function () { return bg('in') + O.chair(100, G - 10, 1) + O.chair(48, G, 1) + O.chair(152, G, -1) + O.table(100, G, 70); };
  var HIDE = { ride_core: 1, s_climb_core: 1, s_sweep_core: 1 };
  function svg(k) { var f = SC[k]; if (!f || HIDE[k]) return ''; return '<svg viewBox="' + (k.charAt(0) === 's' ? '16 16 168 126' : '0 0 200 150') + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">' + f() + '</svg>'; }
  window.PICART = { svg: svg, keys: function () { return Object.keys(SC).filter(function (k) { return !HIDE[k]; }); } };
})();

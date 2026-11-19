/* Luyện phát âm — dùng chung cho web TOEIC và IELTS (file giống hệt ở toeic/assets và cam/shared).
   Chấm phát âm ngay trên máy học viên, không gửi giọng nói đi đâu:
   - Mô hình lapwing-small (GersonHMG, CC BY-NC 4.0, dùng phi thương mại cho học viên) chạy bằng onnxruntime-web,
     tải từ Hugging Face một lần rồi giữ trong bộ nhớ đệm của trình duyệt.
   - Phiên âm chuẩn lấy từ CMU Pronouncing Dictionary (file cmu.txt cùng thư mục với dữ liệu, PA_CFG.dict).
   - Căn âm bằng CTC Viterbi, mỗi âm được chấm theo xác suất mô hình nghe ra đúng âm đó.
   Cấu hình ở window.PA_CFG: { site, dict, sets: [{id, name, load(cb) -> cb([{t, vi, au:{src,s,e}}])}] } */
(function () {
  'use strict';
  var CFG = window.PA_CFG, main = document.getElementById('main');
  var ORT_V = '1.22.0', ORT_BASE = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@' + ORT_V + '/dist/';
  var MODEL = 'https://huggingface.co/GersonHMG/lapwing-small/resolve/b6d0d6bb0696fd943c64e73ac6761a77ac5704e9/model.int8.onnx';
  var MODEL_MB = 38, CACHE = 'mt-pa-model-v1', MAX_SEC = 15;
  var PH = ['<blk>', 'AA', 'AE', 'AH', 'AO', 'AW', 'AY', 'B', 'CH', 'D', 'DH', 'EH', 'ER', 'EY', 'F', 'G', 'HH', 'IH', 'IY', 'JH', 'K', 'L', 'M', 'N', 'NG', 'OW', 'OY', 'P', 'R', 'S', 'SH', 'T', 'TH', 'UH', 'UW', 'V', 'W', 'Y', 'Z', 'ZH'];
  var CODE = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLM';
  var IPA = { AA: 'ɑ', AE: 'æ', AH: 'ʌ', AO: 'ɔ', AW: 'aʊ', AY: 'aɪ', B: 'b', CH: 'tʃ', D: 'd', DH: 'ð', EH: 'e', ER: 'ɝ', EY: 'eɪ', F: 'f', G: 'g', HH: 'h', IH: 'ɪ', IY: 'i', JH: 'dʒ', K: 'k', L: 'l', M: 'm', N: 'n', NG: 'ŋ', OW: 'oʊ', OY: 'ɔɪ', P: 'p', R: 'r', S: 's', SH: 'ʃ', T: 't', TH: 'θ', UH: 'ʊ', UW: 'u', V: 'v', W: 'w', Y: 'j', Z: 'z', ZH: 'ʒ' };
  var VOW = { AA: 1, AE: 1, AH: 1, AO: 1, AW: 1, AY: 1, EH: 1, ER: 1, EY: 1, IH: 1, IY: 1, OW: 1, OY: 1, UH: 1, UW: 1 };
  var TIP = {
    TH: 'Âm /θ/ (think, three): đặt đầu lưỡi giữa hai hàm răng rồi thổi hơi ra. Đừng đọc thành "th" hay "s" tiếng Việt.',
    DH: 'Âm /ð/ (this, the): lưỡi giữa hai hàm răng như /θ/ nhưng rung cổ họng. Đừng đọc thành "đ" hay "d".',
    S: 'Âm /s/: xì hơi nhẹ qua kẽ răng. Ở cuối từ (books, its) người Việt hay bỏ, nhớ đọc ra.',
    Z: 'Âm /z/: giống /s/ nhưng rung cổ họng (đặt tay lên cổ sẽ thấy rung). Hay gặp ở đuôi -s: dogs, is, was.',
    SH: 'Âm /ʃ/ (she, shop): chu môi ra trước, đẩy hơi "suỵt". Khác /s/ ở chỗ môi tròn hơn.',
    ZH: 'Âm /ʒ/ (usually, measure): như /ʃ/ nhưng rung cổ họng.',
    CH: 'Âm /tʃ/ (check, much): chu môi, chạm lưỡi lên nướu rồi bật hơi mạnh. Ở cuối từ vẫn phải bật ra.',
    JH: 'Âm /dʒ/ (job, bridge): chu môi, giống "gi" nhưng bật mạnh và rung. Ở cuối từ vẫn phải đọc ra.',
    V: 'Âm /v/: răng trên chạm nhẹ môi dưới rồi rung. Đừng đọc thành /b/ hay /w/.',
    F: 'Âm /f/: răng trên chạm môi dưới, thổi hơi. Ở cuối từ (off, laugh) nhớ thổi hơi ra.',
    R: 'Âm /r/: cong đầu lưỡi về sau, không chạm vòm miệng, không rung lưỡi như "r" tiếng Việt.',
    L: 'Âm /l/: chạm đầu lưỡi vào chân răng trên. Ở cuối từ (call, will) vẫn giữ lưỡi ở đó, đừng đọc thành "ô".',
    T: 'Âm /t/: chạm lưỡi lên chân răng trên rồi bật hơi. Ở cuối từ đừng nuốt mất.',
    D: 'Âm /d/: chạm lưỡi lên chân răng trên, rung nhẹ. Ở cuối từ (and, used) đừng bỏ.',
    K: 'Âm /k/: cuống lưỡi chạm vòm mềm rồi bật hơi. Ở cuối từ (park, work) nhớ bật nhẹ.',
    G: 'Âm /g/: như /k/ nhưng rung cổ họng.',
    P: 'Âm /p/: mím môi rồi bật hơi mạnh. Ở cuối từ (stop, help) nhớ mở môi bật nhẹ.',
    B: 'Âm /b/: mím môi rồi bật, có rung.',
    N: 'Âm /n/: chạm đầu lưỡi lên chân răng trên.',
    NG: 'Âm /ŋ/ (sing, working): như "ng" tiếng Việt, đừng thêm /g/ hay bỏ mất.',
    M: 'Âm /m/: mím môi, cho hơi ra mũi.',
    HH: 'Âm /h/: thở nhẹ ra như "h" tiếng Việt.',
    W: 'Âm /w/: chu tròn môi rồi mở ra nhanh.',
    Y: 'Âm /j/ (yes, you): như "d" giọng miền Nam trong "da".',
    IY: 'Âm /i/ (see, meet): kéo dài, kéo mép như đang cười.',
    IH: 'Âm /ɪ/ (sit, this): ngắn và thả lỏng hơn /i/, gần với "i" ngắn.',
    EH: 'Âm /e/ (bed, get): mở miệng vừa, như "e" tiếng Việt.',
    AE: 'Âm /æ/ (man, cat): mở miệng rộng, lai giữa "a" và "e".',
    AA: 'Âm /ɑ/ (hot, park): mở rộng miệng, như "a" kéo dài.',
    AH: 'Âm /ʌ/ hay /ə/ (cup, about): như "ơ/â" ngắn, thả lỏng miệng.',
    AO: 'Âm /ɔ/ (call, saw): tròn môi, như "o" kéo dài.',
    UH: 'Âm /ʊ/ (book, good): ngắn, môi hơi tròn, như "ư/u" ngắn.',
    UW: 'Âm /u/ (food, you): chu tròn môi, kéo dài.',
    ER: 'Âm /ɝ/ (work, her): như "ơ" nhưng cong lưỡi về sau.',
    EY: 'Âm /eɪ/ (day, make): "ê" trượt sang "i": đê-i.',
    AY: 'Âm /aɪ/ (my, right): "a" trượt sang "i": a-i.',
    OW: 'Âm /oʊ/ (go, phone): "ô" trượt sang "u": ô-u.',
    AW: 'Âm /aʊ/ (now, out): "a" trượt sang "u": a-u.',
    OY: 'Âm /ɔɪ/ (boy, choice): "o" trượt sang "i": o-i.'
  };
  var ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  var TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  function num(n) {
    n = +n; if (n < 20) return ONES[n];
    if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? ' ' + ONES[n % 10] : '');
    if (n < 1000) return ONES[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' ' + num(n % 100) : '');
    if (n >= 1900 && n < 2000) return num(Math.floor(n / 100)) + ' ' + num(n % 100);
    if (n < 10000) return num(Math.floor(n / 1000)) + ' thousand' + (n % 1000 ? ' ' + num(n % 1000) : '');
    return '';
  }

  function get(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function put(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function $(id) { return document.getElementById(id); }

  /* ---------- tải: từ điển, onnxruntime, mô hình ---------- */
  var DICT = null, dictP = null, ortP = null, sessP = null;
  function loadDict() {
    if (dictP) return dictP;
    dictP = fetch(CFG.dict).then(function (r) { if (!r.ok) throw new Error('dict ' + r.status); return r.text(); }).then(function (txt) {
      var D = Object.create(null);
      txt.split('\n').forEach(function (l) {
        if (!l || l[0] === '#') return; var i = l.indexOf(' ');
        D[l.slice(0, i)] = l.slice(i + 1).split('|').map(function (c) { var a = []; for (var j = 0; j < c.length; j++) a.push(CODE.indexOf(c[j]) + 1); return a; });
      });
      DICT = D; return D;
    });
    dictP.catch(function () { dictP = null; });
    return dictP;
  }
  function loadOrt() {
    if (ortP) return ortP;
    ortP = new Promise(function (ok, no) {
      if (window.ort) return ok(window.ort);
      var s = document.createElement('script'); s.src = ORT_BASE + 'ort.wasm.min.js';
      s.onload = function () { window.ort.env.wasm.wasmPaths = ORT_BASE; window.ort.env.wasm.numThreads = 1; ok(window.ort); };
      s.onerror = function () { ortP = null; no(new Error('ort')); };
      document.head.appendChild(s);
    });
    return ortP;
  }
  function fetchModel(onp) {
    var cache = null;
    var open = window.caches ? caches.open(CACHE).catch(function () { return null; }) : Promise.resolve(null);
    return open.then(function (c) {
      cache = c; return c ? c.match(MODEL).catch(function () { return null; }) : null;
    }).then(function (hit) {
      if (hit) { onp(1); return hit.arrayBuffer(); }
      return fetch(MODEL).then(function (r) {
        if (!r.ok) throw new Error('model ' + r.status);
        var total = +r.headers.get('content-length') || MODEL_MB * 1048576, got = 0, parts = [];
        if (!r.body || !r.body.getReader) return r.arrayBuffer();
        var rd = r.body.getReader();
        return (function pump() {
          return rd.read().then(function (x) {
            if (x.done) { var b = new Uint8Array(got), o = 0; parts.forEach(function (p) { b.set(p, o); o += p.length; }); return b.buffer; }
            parts.push(x.value); got += x.value.length; onp(Math.min(.99, got / total)); return pump();
          });
        })();
      }).then(function (buf) {
        if (cache) cache.put(MODEL, new Response(buf.slice(0), { headers: { 'content-type': 'application/octet-stream' } })).catch(function () {});
        onp(1); return buf;
      });
    });
  }
  function loadSession(onp) {
    if (sessP) return sessP;
    sessP = Promise.all([loadOrt(), fetchModel(onp), loadDict()]).then(function (a) {
      return a[0].InferenceSession.create(new Uint8Array(a[1]), { executionProviders: ['wasm'], graphOptimizationLevel: 'all' });
    });
    sessP.catch(function () { sessP = null; });
    return sessP;
  }

  /* ---------- câu -> chuỗi âm ---------- */
  function wordsOf(text) {
    return String(text).replace(/[’‘]/g, "'").split(/\s+/).filter(Boolean).map(function (tok) {
      var key = tok.toLowerCase().replace(/^[^a-z0-9']+|[^a-z0-9']+$/g, '').replace(/^'+|'+$/g, '');
      var parts = key.split(/[-–—\/]+/).filter(Boolean), alts = [[]], ok = !!parts.length;
      parts.forEach(function (p) {
        var sub = /^\d+$/.test(p) ? num(p).split(' ') : [p], cur = [[]];
        sub.forEach(function (s) {
          var v = DICT[s] || (s.slice(-2) === "'s" && DICT[s.slice(0, -2)] && DICT[s.slice(0, -2)].map(function (a) { return a.concat([/[ptkf]$|th$/.test(s.slice(0, -2)) ? 29 : 38]); }));
          if (!v || !s) { ok = false; return; }
          var nx = []; cur.forEach(function (c) { v.forEach(function (a) { if (nx.length < 3) nx.push(c.concat(a)); }); }); cur = nx;
        });
        var nx2 = []; alts.forEach(function (c) { cur.forEach(function (a) { if (nx2.length < 3) nx2.push(c.concat(a)); }); }); alts = nx2;
      });
      return { tok: tok, alts: ok ? alts : null, pick: 0 };
    });
  }

  /* ---------- CTC Viterbi ---------- */
  function align(lp, T, seq) {
    var V = 40, N = seq.length * 2 + 1, NEG = -1e30, S = new Int32Array(N), i, t, s;
    for (i = 0; i < seq.length; i++) S[2 * i + 1] = seq[i];
    var prev = new Float64Array(N).fill(NEG), cur = new Float64Array(N), bp = new Int32Array(T * N);
    prev[0] = lp[S[0]]; if (N > 1) prev[1] = lp[S[1]];
    for (t = 1; t < T; t++) {
      var o = t * V;
      for (s = 0; s < N; s++) {
        var best = prev[s], b = s;
        if (s >= 1 && prev[s - 1] > best) { best = prev[s - 1]; b = s - 1; }
        if (s >= 2 && S[s] !== 0 && S[s] !== S[s - 2] && prev[s - 2] > best) { best = prev[s - 2]; b = s - 2; }
        cur[s] = best + lp[o + S[s]]; bp[t * N + s] = b;
      }
      var tmp = prev; prev = cur; cur = tmp;
    }
    s = N > 1 && prev[N - 2] > prev[N - 1] ? N - 2 : N - 1;
    var tot = prev[s], segs = []; for (i = 0; i < seq.length; i++) segs.push([]);
    for (t = T - 1; t >= 0; t--) { if (s % 2 === 1) segs[(s - 1) / 2].push(t); if (t > 0) s = bp[t * N + s]; }
    return { tot: tot, segs: segs };
  }
  function seqOf(W) { var q = []; W.forEach(function (w) { if (w.alts) q = q.concat(w.alts[w.pick]); }); return q; }

  function score(W, lp, T) {
    var best = align(lp, T, seqOf(W));
    W.forEach(function (w) {
      if (!w.alts || w.alts.length < 2) return;
      var keep = w.pick;
      for (var k = 0; k < w.alts.length; k++) {
        if (k === keep) continue; w.pick = k; var r = align(lp, T, seqOf(W));
        if (r.tot > best.tot) { best = r; keep = k; }
      }
      w.pick = keep;
    });
    var idx = 0, sum = 0, cnt = 0;
    W.forEach(function (w) {
      if (!w.alts) return;
      var seq = w.alts[w.pick], ph = [];
      seq.forEach(function (p, j) {
        var fr = best.segs[idx++], pmax = 0, heard = 0, hp = 0;
        fr.forEach(function (t) {
          var o = t * 40, pt = Math.exp(lp[o + p]); if (pt > pmax) pmax = pt;
          for (var v = 1; v < 40; v++) { var pv = Math.exp(lp[o + v]); if (pv > hp) { hp = pv; heard = v; } }
        });
        var sc = Math.min(1, pmax / 0.8);
        ph.push({ p: PH[p], sc: sc, heard: heard && heard !== p && hp > pmax + .15 ? PH[heard] : '', last: j === seq.length - 1 && !VOW[PH[p]] });
      });
      w.ph = ph;
      w.sc = Math.round(100 * ph.reduce(function (a, x) { return a + x.sc; }, 0) / ph.length);
      sum += w.sc * ph.length; cnt += ph.length;
    });
    return { score: cnt ? Math.round(sum / cnt) : 0, gate: best.tot / T };
  }

  /* ---------- ghi âm ---------- */
  var rec = null;
  function startRec(onLevel) {
    return navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true } }).then(function (stream) {
      var chunks = [], mr = new MediaRecorder(stream), AC = window.AudioContext || window.webkitAudioContext, ac = new AC(), an = ac.createAnalyser();
      ac.createMediaStreamSource(stream).connect(an); an.fftSize = 512; var buf = new Uint8Array(an.fftSize), raf = 0;
      (function lv() { an.getByteTimeDomainData(buf); var m = 0; for (var i = 0; i < buf.length; i++) m = Math.max(m, Math.abs(buf[i] - 128)); onLevel(m / 128); raf = requestAnimationFrame(lv); })();
      mr.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
      var done = new Promise(function (ok) {
        mr.onstop = function () { cancelAnimationFrame(raf); stream.getTracks().forEach(function (t) { t.stop(); }); try { ac.close(); } catch (e) {} ok(new Blob(chunks, { type: mr.mimeType || 'audio/webm' })); };
      });
      mr.start();
      rec = { stop: function () { if (mr.state !== 'inactive') mr.stop(); return done; }, at: Date.now() };
      return rec;
    });
  }
  function toPcm16k(blob) {
    return blob.arrayBuffer().then(function (ab) {
      var AC = window.AudioContext || window.webkitAudioContext, ac = new AC();
      return new Promise(function (ok, no) { ac.decodeAudioData(ab, ok, no); }).then(function (au) {
        try { ac.close(); } catch (e) {}
        var n = Math.ceil(au.duration * 16000), off = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, n, 16000);
        var src = off.createBufferSource(); src.buffer = au; src.connect(off.destination); src.start();
        return off.startRendering();
      }).then(function (r) {
        var x = r.getChannelData(0), a = 0, b = x.length, W = 320, th = 0, i, pk = 0;
        for (i = 0; i < x.length; i++) pk = Math.max(pk, Math.abs(x[i]));
        th = Math.max(0.01, pk * 0.06);
        function loud(i0) { var m = 0; for (var j = i0; j < Math.min(x.length, i0 + W); j++) m = Math.max(m, Math.abs(x[j])); return m > th; }
        while (a < b && !loud(a)) a += W; while (b > a && !loud(b - W)) b -= W;
        a = Math.max(0, a - 4800); b = Math.min(x.length, b + 4800);
        return { pcm: x.slice(a, b), peak: pk };
      });
    });
  }

  /* ---------- giao diện ---------- */
  var CSS = '.pa-top{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:6px 0 10px}.pa-top select{font:inherit;font-size:15px;padding:8px 10px;border:1.5px solid var(--line);border-radius:10px;background:var(--card);color:var(--ink);max-width:100%}' +
    '.pa-nav{display:flex;gap:6px;align-items:center;margin-left:auto}.pa-nav button{font:inherit;font-weight:700;border:1.5px solid var(--line);background:var(--card);color:var(--brand-ink);border-radius:10px;padding:7px 12px;cursor:pointer}.pa-nav span{font-size:14px;color:var(--dim);min-width:64px;text-align:center}' +
    '.pa-card{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:18px 18px 16px;margin:0 0 12px}' +
    '.pa-s{font:500 clamp(22px,5vw,30px)/1.45 Fraunces,Georgia,serif;margin:0 0 4px;word-wrap:break-word}.pa-s .w{border-radius:6px;padding:0 2px;cursor:default}' +
    '.pa-s .w.g{color:var(--ok)}.pa-s .w.y{color:#a86a00;background:#fdf1d6;cursor:pointer}.pa-s .w.r{color:var(--bad);background:var(--bad-soft);cursor:pointer}.pa-s .w.g{cursor:pointer}.pa-s .w.x{color:var(--dim)}.pa-s .w.on{outline:2px solid var(--brand);outline-offset:1px}' +
    '.pa-vi{color:var(--dim);font-size:15px;margin:0 0 12px}.pa-ipa{color:var(--dim);font-size:14px;margin:-6px 0 12px;font-family:"IBM Plex Sans",sans-serif}' +
    '.pa-btns{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.pa-btns .btn{padding:11px 16px;font-size:15px}' +
    '.pa-mic{position:relative;min-width:170px}.pa-mic.rec{background:var(--bad)}.pa-lv{position:absolute;left:10px;right:10px;bottom:5px;height:3px;border-radius:2px;background:rgba(255,255,255,.35);overflow:hidden}.pa-lv i{display:block;height:100%;width:0;background:#fff}' +
    '.pa-res{display:flex;gap:16px;align-items:center;margin-top:14px;padding-top:14px;border-top:1px dashed var(--line)}' +
    '.pa-ring{--v:0;--c:var(--ok);flex:none;width:84px;height:84px;border-radius:50%;background:conic-gradient(var(--c) calc(var(--v)*1%),var(--panel2) 0);display:grid;place-items:center}' +
    '.pa-ring b{width:66px;height:66px;border-radius:50%;background:var(--card);display:grid;place-items:center;font:600 26px/1 Fraunces,Georgia,serif;color:var(--ink)}' +
    '.pa-msg{font-size:15px}.pa-msg b{font-size:16.5px}.pa-msg small{display:block;color:var(--dim);margin-top:3px}' +
    '.pa-det{margin-top:12px;background:var(--panel2);border-radius:14px;padding:12px 14px}.pa-det h4{margin:0 0 6px;font:600 20px/1.2 Fraunces,Georgia,serif}' +
    '.pa-ph{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 8px}.pa-ph span{font:600 17px/1 "IBM Plex Sans",sans-serif;padding:7px 9px;border-radius:9px;background:var(--card);border:1.5px solid var(--line);text-align:center}' +
    '.pa-ph span small{display:block;font-size:11px;font-weight:600;margin-top:3px}.pa-ph .g{border-color:var(--ok);color:var(--ok)}.pa-ph .y{border-color:#d69a2d;color:#a86a00}.pa-ph .r{border-color:var(--bad);color:var(--bad);background:var(--bad-soft)}' +
    '.pa-det ul{margin:6px 0 0;padding-left:18px}.pa-det li{margin:4px 0;font-size:14.5px}' +
    '.pa-load{background:var(--panel2);border-radius:12px;padding:10px 12px;font-size:14px;margin:0 0 12px}.pa-bar{height:6px;border-radius:3px;background:var(--line);margin-top:6px;overflow:hidden}.pa-bar i{display:block;height:100%;width:0;background:var(--brand);transition:width .2s}' +
    '.pa-own{display:flex;gap:8px;margin:0 0 12px}.pa-own textarea{flex:1;font:inherit;font-size:15px;padding:10px 12px;border:1.5px solid var(--line);border-radius:12px;background:var(--card);color:var(--ink);min-height:48px;resize:vertical}' +
    '@media (max-width:560px){.pa-nav{margin-left:0;width:100%;justify-content:space-between}.pa-res{gap:12px}.pa-ring{width:72px;height:72px}.pa-ring b{width:56px;height:56px;font-size:22px}}';

  var BASIC = [
    ['I like black coffee and hot milk.', 'Tôi thích cà phê đen và sữa nóng. (âm cuối /k/, /t/)'],
    ['She works at a bank next to the park.', 'Cô ấy làm ở ngân hàng cạnh công viên. (âm cuối /ks/, /k/)'],
    ['He asked me to help with the desk.', 'Anh ấy nhờ tôi giúp với cái bàn. (âm cuối /skt/, /lp/, /sk/)'],
    ['We stopped at a small hotel last night.', 'Tối qua chúng tôi dừng ở một khách sạn nhỏ. (đuôi -ed /t/)'],
    ['The books are on the top shelf.', 'Mấy cuốn sách ở kệ trên cùng. (đuôi -s, âm cuối /p/, /f/)'],
    ['They watched the match and laughed a lot.', 'Họ xem trận đấu và cười rất nhiều. (đuôi -ed /t/)'],
    ['Please send the report by Friday.', 'Vui lòng gửi báo cáo trước thứ Sáu. (âm cuối /nd/, /rt/)'],
    ['The prices have changed since last year.', 'Giá đã thay đổi kể từ năm ngoái. (đuôi -s /ɪz/, -ed /d/)'],
    ['I think there are three things on the table.', 'Tôi nghĩ có ba thứ trên bàn. (âm /θ/ và /ð/)'],
    ['This is the third time this month.', 'Đây là lần thứ ba trong tháng này. (âm /ð/, /θ/)'],
    ['Thank you for both of these.', 'Cảm ơn bạn vì cả hai thứ này. (âm /θ/, /ð/)'],
    ['My mother and father live together.', 'Bố mẹ tôi sống cùng nhau. (âm /ð/)'],
    ['She sells fresh fish at the shop.', 'Cô ấy bán cá tươi ở cửa hàng. (âm /s/ và /ʃ/)'],
    ['Please choose the cheaper chair.', 'Hãy chọn cái ghế rẻ hơn. (âm /tʃ/)'],
    ['He usually reads the news on his phone.', 'Anh ấy thường đọc tin tức trên điện thoại. (âm /ʒ/, /z/)'],
    ['The bus was late because of the rain.', 'Xe buýt đến trễ vì trời mưa. (âm /s/, /z/)'],
    ['We have a very nice view of the river.', 'Chúng tôi có tầm nhìn rất đẹp ra sông. (âm /v/, /w/)'],
    ['The lawyer will review the rules.', 'Luật sư sẽ xem lại các quy định. (âm /l/, /r/)'],
    ['Would you like to leave early?', 'Bạn có muốn về sớm không? (âm /w/, /l/, /v/)'],
    ['I really love traveling with my family.', 'Tôi rất thích đi du lịch cùng gia đình. (âm /r/, /l/, /v/)'],
    ['Please sit in this seat.', 'Mời ngồi vào ghế này. (/ɪ/ ngắn và /i/ dài)'],
    ['The man in the black hat is my dad.', 'Người đàn ông đội mũ đen là bố tôi. (âm /æ/)'],
    ['I took a good look at the book.', 'Tôi đã xem kỹ cuốn sách. (âm /ʊ/)'],
    ['Go home and phone me later.', 'Về nhà rồi gọi cho tôi sau nhé. (âm /oʊ/)'],
    ['Let\'s work on the first draft.', 'Mình làm bản nháp đầu tiên nhé. (âm /ɝ/)'],
    ['The meeting has been moved to Thursday.', 'Cuộc họp đã được dời sang thứ Năm.'],
    ['Could you tell me where the station is?', 'Bạn có thể chỉ tôi nhà ga ở đâu không?'],
    ['I\'d like to book a table for two.', 'Tôi muốn đặt bàn cho hai người.']
  ].map(function (x) { return { t: x[0], vi: x[1] }; });
  var SETS = [{ id: 'basic', name: '🗣 Âm khó cho người Việt', load: function (cb) { cb(BASIC); } }].concat(CFG.sets || []), set = null, items = [], cur = 0, W = null, BEST = get('mt.pa.best.' + CFG.site, {}), busy = false, myUrl = '', au = new Audio(), auStop = 0;
  function cls(sc) { return sc >= 80 ? 'g' : sc >= 55 ? 'y' : 'r'; }
  function keyOf(it) { return (set ? set.id : '') + '|' + it.t; }

  function optHtml() {
    var h = '', g = null;
    SETS.forEach(function (s) {
      if ((s.group || null) !== g) { if (g) h += '</optgroup>'; g = s.group || null; if (g) h += '<optgroup label="' + esc(g) + '">'; }
      h += '<option value="' + s.id + '">' + esc(s.name) + '</option>';
    });
    return h + (g ? '</optgroup>' : '');
  }
  function shell() {
    if (!$('pa-css')) { var st = document.createElement('style'); st.id = 'pa-css'; st.textContent = CSS; document.head.appendChild(st); }
    var want = get('mt.pa.set', '');
    main.innerHTML = '<div class="pa-top"><select id="paSet" aria-label="Chọn bộ câu">' + SETS.map(function (s) { return '<option value="' + s.id + '">' + esc(s.name) + '</option>'; }).join('') + '<option value="own">✍️ Tự nhập câu</option></select>' +
      '<div class="pa-nav"><button id="paPrev" type="button" aria-label="Câu trước">◀</button><span id="paPos"></span><button id="paNext" type="button" aria-label="Câu sau">▶</button><button id="paRnd" type="button" title="Câu ngẫu nhiên">🔀</button></div></div>' +
      '<div id="paLoad"></div><div id="paOwn"></div><div id="paCard"></div>' +
      '<p class="hint">Giọng của bạn chỉ được chấm ngay trên máy này, không gửi đi đâu. Lần đầu cần tải bộ chấm khoảng ' + MODEL_MB + ' MB, các lần sau dùng lại luôn. Máy chấm chỉ mang tính tham khảo: nghe mẫu, đọc chậm, rõ từng âm cuối là điểm lên ngay.</p>' +
      '<p class="hint" style="font-size:12px">Bộ chấm: lapwing-small (Gerson H. M. G., giấy phép CC BY-NC 4.0, chỉ dùng phi thương mại) · Phiên âm: CMU Pronouncing Dictionary.</p>';
    var sel = $('paSet');
    sel.value = SETS.some(function (s) { return s.id === want; }) || want === 'own' ? want : SETS[0].id;
    sel.onchange = function () { put('mt.pa.set', sel.value); pickSet(); };
    $('paPrev').onclick = function () { go(cur - 1); }; $('paNext').onclick = function () { go(cur + 1); };
    $('paRnd').onclick = function () { if (items.length > 1) { var n; do { n = Math.floor(Math.random() * items.length); } while (n === cur); go(n); } };
    document.addEventListener('keydown', function (e) {
      if (/INPUT|TEXTAREA|SELECT/.test((e.target || {}).tagName)) return;
      if (e.key === 'ArrowRight') go(cur + 1); else if (e.key === 'ArrowLeft') go(cur - 1);
      else if (e.key === ' ' || e.key === 'r') { e.preventDefault(); var b = $('paMic'); if (b) b.click(); }
    });
    pickSet();
  }
  function pickSet() {
    var id = $('paSet').value;
    if (id === 'own') {
      set = { id: 'own' };
      var last = get('mt.pa.own', 'I think the meeting starts at three o\'clock.');
      $('paOwn').innerHTML = '<div class="pa-own"><textarea id="paTxt" maxlength="200" aria-label="Câu tiếng Anh của bạn">' + esc(last) + '</textarea><button class="btn" id="paUse" type="button">Dùng câu này</button></div>';
      $('paUse').onclick = function () { var t = $('paTxt').value.trim().replace(/\s+/g, ' '); if (!t) return; put('mt.pa.own', t); items = [{ t: t }]; go(0); };
      items = [{ t: last }]; go(0); return;
    }
    $('paOwn').innerHTML = '';
    set = SETS.filter(function (s) { return s.id === id; })[0];
    $('paCard').innerHTML = '<div class="pa-card">Đang mở bộ câu…</div>';
    set.load(function (list) {
      items = (list || []).filter(function (x) { return x && x.t; });
      var P = get('mt.pa.pos', {}); go(Math.min(P[set.id] || 0, Math.max(0, items.length - 1)));
    });
  }
  function go(i) {
    if (!items.length) { $('paCard').innerHTML = '<div class="pa-card">Bộ này chưa có câu nào.</div>'; $('paPos').textContent = ''; return; }
    cur = (i + items.length) % items.length; W = null; myUrl = '';
    if (set && set.id !== 'own') { var P = get('mt.pa.pos', {}); P[set.id] = cur; put('mt.pa.pos', P); }
    $('paPos').textContent = (cur + 1) + ' / ' + items.length;
    stopAudio(); render();
  }
  function render(res) {
    var it = items[cur], b = BEST[keyOf(it)];
    var words = W ? W.map(function (w, i) {
      return w.alts && w.sc != null ? '<span class="w ' + cls(w.sc) + '" data-i="' + i + '" role="button" tabindex="0">' + esc(w.tok) + '</span>' : '<span class="w' + (W && !w.alts ? ' x' : '') + '">' + esc(w.tok) + '</span>';
    }).join(' ') : esc(it.t);
    var h = '<div class="pa-card"><p class="pa-s" id="paS">' + words + '</p>' + (it.vi ? '<p class="pa-vi">' + esc(it.vi) + '</p>' : '') +
      '<div class="pa-btns"><button class="btn alt" id="paHear" type="button">🔊 Nghe mẫu</button><button class="btn alt" id="paSlow" type="button">🐢 Chậm</button>' +
      '<button class="btn pa-mic" id="paMic" type="button">🎤 Bấm để đọc<span class="pa-lv"><i id="paLv"></i></span></button>' +
      (myUrl ? '<button class="btn alt" id="paMine" type="button">▶ Nghe giọng mình</button>' : '') +
      (b != null && !res ? '<span class="hint" style="margin:0">Điểm cao nhất câu này: <b>' + b + '</b></span>' : '') + '</div>';
    if (res) {
      if (res.bad) h += '<div class="pa-res"><div class="pa-msg"><b>' + res.bad + '</b><small>' + (res.sub || '') + '</small></div></div>';
      else {
        var c = res.score >= 80 ? 'var(--ok)' : res.score >= 55 ? '#d69a2d' : 'var(--bad)';
        var weak = W.filter(function (w) { return w.alts && w.sc < 55; }).length;
        h += '<div class="pa-res"><div class="pa-ring" style="--v:' + res.score + ';--c:' + c + '"><b>' + res.score + '</b></div><div class="pa-msg"><b>' +
          (res.score >= 85 ? 'Rất rõ ràng! 🎉' : res.score >= 70 ? 'Khá tốt, sửa thêm vài âm nữa nhé.' : res.score >= 50 ? 'Tạm được, nghe mẫu rồi đọc chậm lại nha.' : 'Chưa rõ lắm, nghe mẫu và đọc chậm từng từ nhé.') + '</b>' +
          '<small>' + (res.rec ? '🏆 Điểm cao nhất mới cho câu này. ' : '') + (weak ? 'Bấm vào từ màu đỏ hoặc vàng để xem âm nào chưa đúng.' : 'Bấm vào một từ để xem từng âm.') + '</small></div></div>';
      }
    }
    h += '<div id="paDet"></div></div>';
    $('paCard').innerHTML = h;
    $('paHear').onclick = function () { hear(1); }; $('paSlow').onclick = function () { hear(.7); };
    $('paMic').onclick = mic;
    if ($('paMine')) $('paMine').onclick = function () { stopAudio(); au.src = myUrl; au.playbackRate = 1; au.play().catch(function () {}); };
    [].forEach.call($('paS').querySelectorAll('[data-i]'), function (el) { el.onclick = el.onkeydown = function (e) { if (e.type === 'keydown' && e.key !== 'Enter') return; detail(+el.dataset.i); }; });
    if (res && !res.bad) { var worst = -1, ws = 101; W.forEach(function (w, i) { if (w.alts && w.sc < ws) { ws = w.sc; worst = i; } }); if (worst >= 0 && ws < 80) detail(worst); }
  }
  function detail(i) {
    var w = W[i]; if (!w || !w.ph) return;
    [].forEach.call($('paS').querySelectorAll('.w'), function (e) { e.classList.toggle('on', +e.dataset.i === i); });
    var tips = [], seen = {};
    w.ph.forEach(function (p) {
      if (p.sc >= .7 || seen[p.p]) return; seen[p.p] = 1;
      var t = TIP[p.p] || '';
      if (p.heard) t = 'Máy nghe ra /' + IPA[p.heard] + '/ thay vì /' + IPA[p.p] + '/. ' + t;
      else if (p.sc < .3) t = (p.last ? 'Âm cuối /' + IPA[p.p] + '/ gần như không nghe thấy. ' : 'Âm /' + IPA[p.p] + '/ chưa nghe rõ. ') + t;
      tips.push(t);
    });
    $('paDet').innerHTML = '<div class="pa-det"><h4>' + esc(w.tok.replace(/^[^A-Za-z0-9']+|[^A-Za-z0-9']+$/g, '')) + ' <small style="font:500 15px \'IBM Plex Sans\',sans-serif;color:var(--dim)">/' + w.ph.map(function (p) { return IPA[p.p]; }).join('') + '/ · ' + w.sc + ' điểm</small></h4>' +
      '<div class="pa-ph">' + w.ph.map(function (p) { var c = p.sc >= .7 ? 'g' : p.sc >= .4 ? 'y' : 'r'; return '<span class="' + c + '">' + IPA[p.p] + '<small>' + (p.heard ? '→ ' + IPA[p.heard] : c === 'g' ? '✓' : c === 'y' ? 'chưa rõ' : 'thiếu') + '</small></span>'; }).join('') + '</div>' +
      (tips.length ? '<ul>' + tips.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' : '<p style="margin:4px 0 0;font-size:14.5px">Các âm trong từ này đều rõ rồi 👍</p>') + '</div>';
  }

  function stopAudio() { try { au.pause(); } catch (e) {} clearTimeout(auStop); if (window.speechSynthesis) speechSynthesis.cancel(); }
  function hear(rate) {
    stopAudio(); var it = items[cur];
    if (it.au && it.au.src) {
      au.src = it.au.src; au.playbackRate = rate; au.preservesPitch = true;
      var go2 = function () { au.currentTime = it.au.s || 0; au.play().catch(function () {}); if (it.au.e) auStop = setTimeout(function () { au.pause(); }, ((it.au.e - (it.au.s || 0)) / rate) * 1000 + 250); };
      if (au.readyState >= 1) go2(); else au.addEventListener('loadedmetadata', go2, { once: true });
      return;
    }
    if (!window.speechSynthesis) return;
    var u = new SpeechSynthesisUtterance(it.t); u.lang = 'en-US'; u.rate = rate < 1 ? .7 : .95;
    var v = speechSynthesis.getVoices().filter(function (x) { return /^en[-_]US/i.test(x.lang); });
    if (v.length) u.voice = v.filter(function (x) { return /natural|google|samantha|aria|jenny/i.test(x.name); })[0] || v[0];
    speechSynthesis.speak(u);
  }

  function showLoad(p, msg) {
    var L = $('paLoad'); if (!L) return;
    if (p == null) { L.innerHTML = ''; return; }
    L.innerHTML = '<div class="pa-load">' + esc(msg) + '<div class="pa-bar"><i style="width:' + Math.round(p * 100) + '%"></i></div></div>';
  }
  function prepare() {
    var first = true;
    return loadSession(function (p) { if (p < 1 || first) showLoad(p, p < 1 ? 'Đang tải bộ chấm phát âm (' + MODEL_MB + ' MB, chỉ tải lần đầu)… ' + Math.round(p * 100) + '%' : 'Đang khởi động bộ chấm…'); first = false; })
      .then(function (s) { showLoad(null); return s; });
  }
  function mic() {
    var btn = $('paMic');
    if (rec) { var r = rec; rec = null; clearTimeout(btn._t); btn.disabled = true; btn.classList.remove('rec'); btn.firstChild.textContent = '⏳ Đang chấm…'; r.stop().then(process); return; }
    if (busy) return;
    if (!navigator.mediaDevices || !window.MediaRecorder) { render({ bad: 'Trình duyệt này chưa ghi âm được.', sub: 'Thử mở bằng Chrome, Edge hoặc Safari mới nhé.' }); return; }
    stopAudio(); prepare().catch(function () {});
    startRec(function (lv) { var e = $('paLv'); if (e) e.style.width = Math.min(100, lv * 160) + '%'; }).then(function () {
      btn.classList.add('rec'); btn.firstChild.textContent = '⏹ Đọc xong, bấm để chấm';
      btn._t = setTimeout(function () { if (rec) mic(); }, MAX_SEC * 1000);
    }).catch(function () { render({ bad: 'Chưa dùng được micro.', sub: 'Bấm cho phép micro khi trình duyệt hỏi, hoặc mở lại quyền micro trong phần cài đặt trang web.' }); });
  }
  function process(blob) {
    busy = true; var it = items[cur];
    myUrl = URL.createObjectURL(blob);
    Promise.all([prepare(), toPcm16k(blob)]).then(function (a) {
      var sess = a[0], x = a[1];
      if (x.peak < 0.02 || x.pcm.length < 16000 * 0.4) { busy = false; render({ bad: 'Máy chưa nghe thấy gì.', sub: 'Đọc to hơn, để micro gần miệng một chút rồi thử lại nhé.' }); return; }
      var pcm = x.pcm.length > 16000 * 30 ? x.pcm.slice(0, 16000 * 30) : x.pcm;
      var feeds = {}; feeds[sess.inputNames[0]] = new window.ort.Tensor('float32', pcm, [1, pcm.length]);
      return sess.run(feeds, ['log_probs']).then(function (out) {
        var t = out.log_probs, T = t.dims[1], lp = t.data;
        W = wordsOf(it.t);
        if (!W.some(function (w) { return w.alts; })) { busy = false; render({ bad: 'Câu này chưa chấm được.', sub: 'Thử câu tiếng Anh khác nhé.' }); return; }
        var r = score(W, lp, T); busy = false;
        if (r.gate < -1.2 || r.score < 15) { W = null; render({ bad: 'Hình như bạn đọc khác câu mẫu, hoặc máy nghe chưa rõ.', sub: 'Đọc đúng cả câu, rõ từng từ, ở chỗ yên tĩnh rồi thử lại nha.' }); return; }
        var k = keyOf(it), prev = BEST[k];
        if (prev == null || r.score > prev) { BEST[k] = r.score; put('mt.pa.best.' + CFG.site, BEST); }
        r.rec = prev != null && r.score > prev;
        render(r);
      });
    }).catch(function (e) {
      busy = false; if (window.console) console.warn('phat-am', e);
      render({ bad: 'Chưa tải được bộ chấm phát âm.', sub: 'Kiểm tra mạng rồi bấm đọc lại nhé (lần đầu cần tải khoảng ' + MODEL_MB + ' MB).' });
    });
  }

  shell();
  window.PA_TEST = { wordsOf: wordsOf, score: score, loadDict: loadDict, prepare: prepare, process: process };
})();

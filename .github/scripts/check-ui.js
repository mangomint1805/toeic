/* ui.js là MỘT file dùng chung cho 4 web (toeic, cam, summary-new, summary-old), phải giống hệt nhau.
   Bước này tải bản ui.js đang có trên GitHub của 3 web còn lại và so với bản trong repo này.
   Lệch thì báo đỏ: sửa ui.js ở một web thì nhớ chép sang cả 3 web kia.
   Đẩy cả 4 repo cùng lúc: chờ tối đa 5 phút cho các repo kia lên xong rồi mới kết luận. */
const fs = require('fs'), crypto = require('crypto');
const ALL = { toeic: 'assets/ui.js', cam: 'shared/ui.js', 'summary-new': 'docs/assets/ui.js', 'summary-old': 'docs/assets/ui.js' };
const SELF = process.env.SELF;
if (!ALL[SELF]) { console.log('SELF không hợp lệ: ' + SELF); process.exit(1); }
const h = (s) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 12);
const mine = h(fs.readFileSync(ALL[SELF]));
async function others() {
  const out = {};
  for (const r of Object.keys(ALL)) {
    if (r === SELF) continue;
    const u = `https://raw.githubusercontent.com/mangomint1805/${r}/main/${ALL[r]}?t=${Date.now()}`;
    try { const res = await fetch(u, { cache: 'no-store' }); out[r] = res.ok ? h(Buffer.from(await res.arrayBuffer())) : 'lỗi ' + res.status; }
    catch (e) { out[r] = 'không tải được'; }
  }
  return out;
}
(async () => {
  let last = {};
  for (let i = 0; i < 11; i++) {
    last = await others();
    const bad = Object.keys(last).filter((r) => last[r] !== mine);
    if (!bad.length) { console.log('✅ ui.js giống hệt ở cả 4 web (' + mine + ')'); return; }
    if (i < 10) { console.log('… đang lệch với ' + bad.join(', ') + ', chờ 30 giây (có thể repo kia chưa đẩy xong)'); await new Promise((r) => setTimeout(r, 30000)); }
  }
  console.log('❌ ui.js ở web này (' + mine + ') khác với:');
  for (const r of Object.keys(last)) if (last[r] !== mine) console.log('   ' + r + ' (' + ALL[r] + '): ' + last[r]);
  console.log('Sửa ui.js ở một web thì chép y nguyên sang cả 4 web: toeic/assets, cam/shared, summary-new/docs/assets, summary-old/docs/assets.');
  process.exit(1);
})();

/* Service worker: mở nhanh và dùng được khi mạng chập chờn. Ưu tiên mạng, lỗi mạng thì lấy bản đã lưu. Không lưu audio. */
const C='site-v3';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const r=e.request, u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin||/\.(mp3|m4a|mp4)$/i.test(u.pathname)||r.headers.has('range')) return;
  e.respondWith(fetch(r,{cache:'no-cache'}).then(res=>{ if(res.ok){ const cp=res.clone(); caches.open(C).then(c=>c.put(r,cp)); } return res; }).catch(()=>caches.match(r,{ignoreSearch:/\.html?$|\/$/.test(u.pathname)}).then(m=>m||caches.match('./'))));
});

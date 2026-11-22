/* Skat Drei – Offline-Zwischenspeicher: lädt die Seite aus dem Netz, wenn möglich, sonst aus dem Speicher */
const C='skat-drei';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  e.respondWith((async()=>{
    const cache=await caches.open(C);
    try{
      const ctl=new AbortController(),t=setTimeout(()=>ctl.abort(),4000);
      const res=await fetch(r,{signal:ctl.signal});clearTimeout(t);
      if(res.ok)cache.put(r,res.clone());return res;
    }catch(err){const m=await cache.match(r,{ignoreSearch:true});if(m)return m;throw err}
  })());
});

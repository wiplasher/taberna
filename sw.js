const C='taberna-v1',A=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(A)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);
  if(e.request.method==='POST'&&u.pathname.endsWith('/share-target')){
    e.respondWith((async()=>{const sc=self.registration.scope;
      try{const fd=await e.request.formData();const files=fd.getAll('cards').filter(f=>f&&f.name);const c=await caches.open(C);
        await Promise.all(files.map((f,i)=>c.put(sc+'shared/'+Date.now()+'-'+i,new Response(f,{headers:{'x-name':encodeURIComponent(f.name),'content-type':f.type||'application/octet-stream'}}))));
        return Response.redirect(sc+'index.html?shared='+files.length,303)}
      catch(err){return Response.redirect(sc+'index.html?shared=0',303)}})());return}
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request)))});

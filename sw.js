const CACHE='dopamine-92f20af4d8fd';
const SHELL=['./','./index.html','./app.js','./app.css','./map-worker.js','./favicon.svg','./data/places.json','./data/inventory.json','./data/countries.geojson'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('dopamine-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin)return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    try{const response=await fetch(request);if(response.ok)await cache.put(request,response.clone());return response;}
    catch{const cached=await cache.match(request);if(cached)return cached;if(request.mode==='navigate')return cache.match('./index.html');return Response.error();}
  })());
});

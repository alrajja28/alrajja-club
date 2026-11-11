// Never cache authentication, APIs or private requests.
const CACHE='alrajja-offline-v2';
async function cacheOptional(cache,url){
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),8000);
 try{const response=await fetch(url,{signal:controller.signal,cache:'reload'});if(response.ok)await cache.put(url,response)}catch{}finally{clearTimeout(timer)}
}
self.addEventListener('install',event=>{event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 await Promise.allSettled(['./offline.html','./icons/icon-192.png'].map(url=>cacheOptional(cache,url)));
 await self.skipWaiting();
})())});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{
 for(const key of await caches.keys())if(key.startsWith('alrajja-offline-')&&key!==CACHE)await caches.delete(key);
 await self.clients.claim();
})())});
self.addEventListener('fetch',event=>{if(event.request.mode==='navigate'&&new URL(event.request.url).origin===self.location.origin)event.respondWith(fetch(event.request).catch(async()=>await caches.match(new URL('./offline.html',self.registration.scope).href)||new Response('اتصل بالإنترنت ثم أعد المحاولة',{headers:{'Content-Type':'text/plain; charset=utf-8'}})))});

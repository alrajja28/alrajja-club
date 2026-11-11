// Network-first navigation. Never cache authentication, APIs or private requests.
const CACHE='alrajja-offline-v1';
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(['./offline.html','./rajaa-logo.png'])).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(self.clients.claim())});
self.addEventListener('fetch',event=>{if(event.request.mode==='navigate'&&new URL(event.request.url).origin===self.location.origin)event.respondWith(fetch(event.request).catch(()=>caches.match(new URL('./offline.html',self.registration.scope).href)))});

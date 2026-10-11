const C='ks-v1',F=['index.html','login.html','dashboard.html','products.html','add-product.html','product-details.html','ai-catalog.html','price-assistant.html','market.html','style.css','app.js'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(F))));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));

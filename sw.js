// ✅ STEP 6.3: Service Worker для кешування PWA
const CACHE_NAME = 'pixelcraft-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/style.css?v=4',
  '/js/app.js?v=2',
  '/js/tools.js?v=2',
  '/js/lang.js?v=2',
  '/images/icon-192.png',
  '/images/icon-512.png'
];

// 1. Встановлення (Кешуємо файли при першому візиті)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('✅ [SW] Файли закешовано');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Активація (Видаляємо старі версії кешу)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) {
          console.log('🗑️ [SW] Старий кеш видалено:', key);
          return caches.delete(key);
        }
      }));
    })
  );
});

// 3. Перехоплення запитів (Працює офлайн)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
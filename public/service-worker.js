const staticCacheName = 'site-static-v3';
const dynamicCacheName = 'site-dynamic-v1';
const assets = [
  '/',
  '/index.html',
  '/js/app.js',
  '/js/script.js',
  '/css/style.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/apple/icon-ios-128x128.png',
  '/icons/apple/icon-ios-512x512.png',
  '/fonts/Inter-Regular.woff2',
  '/fonts/Inter-Bold.woff2',
  '/fonts/Inter-SemiBold.woff2',
  '/fonts/Inter-Medium.woff2',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css',
  'https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap',
  '/fallback.html'
];

//create size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(() => limitCacheSize(name, size));
      }
    });
  });
};
// install event
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      cache.addAll([...assets, '/fallback.html']);
    })
  );
});


// activate service worker
self.addEventListener('activate', evt => {
  // console.log('Service worker has been activated');
  evt.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== staticCacheName)
          .map(key => caches.delete(key))
      )
    )
  );
});


// fetch event
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {

      return cacheRes || fetch(evt.request).then(fetchRes => {
        return caches.open(dynamicCacheName).then(cache => {
          cache.put(evt.request.url, fetchRes.clone());
          limitCacheSize(dynamicCacheName, 15);
          return fetchRes;
        });
      }).catch(() => {
        // If offline and request was a page, show fallback
        if (evt.request.headers.get('accept').includes('text/html')) {
          return caches.match('/fallback.html');
        }
      });
    })
  );
});
// End of service-worker.js//

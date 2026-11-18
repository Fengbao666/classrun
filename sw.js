/* ClassRun Service Worker：离线缓存 + 通知点击处理
 * 只缓存应用外壳；/ocr API 与 ocr/ 大模型不进入缓存，避免几百 MB 的缓存占用。
 */
const CACHE = 'classrun-2026.11.18-2011';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './maskable-192.png',
  './maskable-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

function isCacheable(url) {
  if (url.origin !== location.origin) return false;
  if (url.pathname === '/ocr' || url.pathname.indexOf('/ocr/') === 0) return false;
  if (url.pathname.indexOf('/源码/') >= 0 || url.pathname.indexOf('/发布包/') >= 0) return false;
  return true;
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (!isCacheable(url)) return;

  // 页面导航：网络优先，离线回落缓存
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put('./index.html', copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // 静态资源：缓存优先，后台更新
  e.respondWith(
    caches.match(req).then((hit) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => hit);
      return hit || network;
    })
  );
});

/* 点击通知：聚焦或打开应用 */
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if (c.url.indexOf('index.html') >= 0 || c.url.endsWith('/')) {
          return c.focus();
        }
      }
      return self.clients.openWindow('./index.html');
    })
  );
});

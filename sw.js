// 캠핑스토리 앱 껍데기(화면·아이콘)만 저장. 예약 데이터는 항상 서버에서 새로 받는다.
var CACHE = 'cs-shell-v2';
var SHELL = ['./', 'index.html', 'manifest.webmanifest', 'logo.jpg', 'symbol.jpg', 'icon-192.png', 'icon-512.png', 'favicon.png'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); })); self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }));
  self.clients.claim();
});
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (u.origin !== location.origin) return; // API 요청은 건드리지 않음
  e.respondWith(fetch(e.request).then(function (r) {
    var copy = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, copy); }); return r;
  }).catch(function () { return caches.match(e.request).then(function (r) { return r || caches.match('index.html'); }); }));
});

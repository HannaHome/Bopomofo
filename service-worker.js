// ----- 設定快取名稱 -----
const CACHE_NAME = "bopomofo-keyboard-v1";

// ----- 需要快取的檔案（依你的 index.html + 前端 JS/CSS 自動調整即可）-----
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// ----- 安裝階段：把檔案放進快取 -----
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// ----- 啟用階段：清掉舊版快取 -----
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// ----- 讀取階段：快取優先（離線可用）-----
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => {
      return (
        resp ||
        fetch(event.request).catch(() =>
          caches.match("./index.html") // 离线 fallback
        )
      );
    })
  );
});

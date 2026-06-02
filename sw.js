const CACHE_NAME = "presupuesto-cache-v2";

const urlsToCache = [
    "./",
    "./index.html",
    "./style.css",
    "./js.js",
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap",
    "https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.7.0/dist/tabler-icons.min.css"
];

// Instalación: cachear recursos
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return Promise.all(
                urlsToCache.map((url) =>
                    cache.add(url).catch((err) => {
                        console.warn(`No se pudo cachear: ${url}`, err);
                    })
                )
            );
        })
    );
    self.skipWaiting();
});

// Activación: limpiar caches viejos
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            )
        )
    );
    self.clients.claim();
});

// Fetch: responder con caché, fallback a red
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((cached) => {
            return cached || fetch(event.request).catch(() => {
                // Si no hay red y no está en caché, devolver index como fallback
                return caches.match("./index.html");
            });
        })
    );
});

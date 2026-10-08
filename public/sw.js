// Service Worker for Arrow Up PWA
const CACHE_NAME = "arrow-up-v3";
const OFFLINE_URL = "/offline";

const PRECACHE_ASSETS = [
  OFFLINE_URL,
  "/manifest.webmanifest",
  "/favicon.ico",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/icon-maskable-192x192.png",
  "/icon-maskable-512x512.png",
  "/icon-apple-touch.png",
  "/logo.png",
];

// Install Event: pre-cache the offline page, shell assets, and dynamic offline script/style dependencies
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // 1. Pre-cache basic static assets individually so one failure does not abort install
      await Promise.all(
        PRECACHE_ASSETS.map(async (url) => {
          try {
            await cache.add(url);
          } catch (err) {
            console.warn("[SW] Pre-cache failed for", url, err);
          }
        }),
      );

      // 2. Fetch the offline page to discover and precache all its JS chunks and CSS files
      try {
        const offlineRes = await fetch(OFFLINE_URL);
        if (offlineRes && offlineRes.ok) {
          await cache.put(OFFLINE_URL, offlineRes.clone());
          const html = await offlineRes.text();
          const assetMatches =
            html.match(/(?:src|href)=["'](\/_next\/static\/[^"']+)["']/g) || [];
          const dependencyUrls = new Set();
          for (const matchStr of assetMatches) {
            const cleaned = matchStr
              .replace(/^(?:src|href)=["']/, "")
              .replace(/["']$/, "");
            dependencyUrls.add(cleaned);
          }

          await Promise.all(
            Array.from(dependencyUrls).map(async (depUrl) => {
              try {
                await cache.add(depUrl);
              } catch (e) {
                console.warn(
                  "[SW] Failed to cache offline dependency:",
                  depUrl,
                  e,
                );
              }
            }),
          );
        }
      } catch (err) {
        console.warn("[SW] Offline dependencies extraction error:", err);
      }

      await self.skipWaiting();
    })(),
  );
});

// Activate Event: clean up older caches and claim clients immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME) {
              return caches.delete(name);
            }
          }),
        );
      })
      .then(() => {
        return self.clients.claim();
      }),
  );
});

function offlineResponse() {
  return new Response("Network offline and no cached fallback found.", {
    status: 503,
    statusText: "Service Unavailable",
    headers: { "Content-Type": "text/plain" },
  });
}

// Fetch Event: intelligent caching strategy with offline fallback
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests; mutations (e.g. Server Actions, POST) pass through
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  // Skip browser-extension and unsupported schemes
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return;
  }

  // Never intercept the service worker script itself
  if (url.pathname === "/sw.js") {
    return;
  }

  // 1. HTML Navigation Requests (Full Page Loads)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          // If offline, check if page is already cached
          const cachedResponse = await caches.match(request, {
            ignoreSearch: true,
          });
          if (cachedResponse) {
            return cachedResponse;
          }
          // Otherwise, fall back to the dedicated offline page
          const offlineFallback = await caches.match(OFFLINE_URL, {
            ignoreSearch: true,
          });
          if (offlineFallback) {
            return offlineFallback;
          }
          return offlineResponse();
        }),
    );
    return;
  }

  // 2. Static Next.js chunks, fonts, icons, logo and images
  const isStaticAsset =
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/_next/image") ||
    // url.pathname.startsWith("/icons/") ||
    // url.pathname.startsWith("/images/") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".jpeg") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".ico") ||
    url.pathname.endsWith(".woff2");

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request, { ignoreSearch: true }).then((cachedResponse) => {
        if (cachedResponse) {
          // Stale-while-revalidate for fresh assets in background
          fetch(request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(request, networkResponse);
                });
              }
            })
            .catch(() => {});
          return cachedResponse;
        }

        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(async () => {
            // If offline and requesting the logo or icon, fallback to pre-cached logo
            if (
              url.pathname.includes("logo") ||
              url.pathname.includes("icon")
            ) {
              const fallbackLogo = await caches.match("/logo.png");
              if (fallbackLogo) return fallbackLogo;
            }
            return offlineResponse();
          });
      }),
    );
    return;
  }

  // Default: Network with cache fallback
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          url.origin === self.location.origin
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(request, {
          ignoreSearch: true,
        });
        return cachedResponse || offlineResponse();
      }),
  );
});

// Push Notification Support
self.addEventListener("push", (event) => {
  if (event.data) {
    let payload = {};
    try {
      payload = event.data.json();
    } catch {
      payload = { title: "Arrow Up Notification", body: event.data.text() };
    }

    const options = {
      body: payload.body || "New update from Arrow Up",
      icon: payload.icon || "/icon-192x192.png",
      badge: payload.badge || "/icon-192x192.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        url: payload.url || "/",
        ...payload.data,
      },
    };

    event.waitUntil(
      self.registration.showNotification(payload.title || "Arrow Up", options),
    );
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if (client.url === targetUrl && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      }),
  );
});

// Client messaging for prompt updates
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Internal Complaint System - High Reliability Offline Standby Service Worker
const CACHE_NAME = 'ics-pwa-cache-v2';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/manifest-icon-192.png',
  '/manifest-icon-512.png',
  '/app-icon-gold.png',
  '/favicon-32.png',
  '/favicon-64.png',
  '/favicon-128.png',
  '/logo.png'
];

// Install Event: pre-cache application shell for offline standby
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[ICS SW] Precache non-blocking notice:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event: purge stale caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ICS SW] Purging outdated cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Intelligent Stale-While-Revalidate & Offline Standby
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }

  // 1. Only handle same-origin requests!
  // Cross-origin assets and services (Google Fonts, gstatic, Firebase, EmailJS, OpenStreetMap, Google APIs)
  // must be fetched natively by the browser to avoid CSP connect-src violations, CORS issues, and SW crashes.
  if (url.origin !== self.location.origin) {
    return;
  }

  // 2. Bypass authentication and API endpoints
  if (url.pathname.startsWith('/__/auth') || url.pathname.startsWith('/api')) {
    return;
  }

  // 3. Version checking endpoint: Always fetch fresh from network to detect GitHub deployments
  if (url.pathname === '/version.json') {
    event.respondWith(
      fetch(request, { cache: 'no-store' }).catch(async () => {
        const cached = await caches.match(request);
        return cached || new Response('{"offline":true}', { headers: { 'Content-Type': 'application/json' } });
      })
    );
    return;
  }

  // 4. HTML Navigation Requests (PWA cold starts): Network-first with instant Cache Fallback
  // Prevents "net::ERR_CONNECTION_ABORTED" or "Webpage not available" when opening downloaded PWA!
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(async () => {
          // Network failed or aborted — immediately serve cached index.html
          const cached = await caches.match('/index.html') || await caches.match('/');
          if (cached) return cached;
          return new Response(
            '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>ICS Offline</title></head><body style="background:#070b16;color:#e2e8f0;font-family:sans-serif;padding:24px;text-align:center;"><h2 style="color:#38bdf8;">Internal Complaint System</h2><p>Application is loading from local storage. Please check your connection if live sync is needed.</p><button onclick="location.reload()" style="background:#0284c7;color:#fff;border:none;padding:10px 20px;border-radius:8px;font-weight:bold;cursor:pointer;">Retry Now</button></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // 5. Static Assets (scripts, styles, images): Cache-First with Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached version immediately for super fast loading
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const copy = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      // Not cached yet: fetch from network
      return fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(() => {
          // Never return undefined to event.respondWith(), which causes:
          // "TypeError: Failed to convert value to 'Response'"
          return new Response('', { status: 408, statusText: 'Request Offline' });
        });
    })
  );
});

// Listen for messages from client app (e.g., skipWaiting on update)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// AIVOA CRM v2 — Aggressive Cache Killer Service Worker
// Replaces ANY stale SW (Firebase, Workbox, PWA) on localhost:5173
// and completely wipes all cached files so the real app loads cleanly.

const CACHE_VERSION = 'aivoa-v2'

self.addEventListener('install', (event) => {
  // Take over immediately — don't wait for old SW to stop
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // 1. Claim all open tabs immediately
      await clients.claim()

      // 2. Wipe every cache entry (Firebase, Workbox, etc.)
      const cacheKeys = await caches.keys()
      await Promise.all(cacheKeys.map(key => {
        console.log('[AIVOA SW] Deleting cache:', key)
        return caches.delete(key)
      }))

      // 3. Unregister self so we don't interfere with the real app
      const reg = await self.registration
      if (reg) {
        await reg.unregister()
        console.log('[AIVOA SW] Self-unregistered. All caches cleared.')
      }

      // 4. Tell all clients to hard-reload
      const allClients = await clients.matchAll({ type: 'window', includeUncontrolled: true })
      for (const client of allClients) {
        client.postMessage({ type: 'SW_ACTIVATED', action: 'reload' })
      }
    })()
  )
})

// Passthrough ALL fetches — never cache, never intercept
self.addEventListener('fetch', (event) => {
  // Special: if someone requests the old firebase.js, return an empty valid module
  // This prevents the SyntaxError crash while the browser is still using stale cache
  if (event.request.url.includes('firebase.js') || event.request.url.includes('firebase-app')) {
    event.respondWith(
      new Response('export default {}; export const auth = null; export const db = null;', {
        headers: { 'Content-Type': 'application/javascript' }
      })
    )
    return
  }
  // All other requests: pass through to network
  event.respondWith(fetch(event.request).catch(() => {
    return new Response('', { status: 503 })
  }))
})
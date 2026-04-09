// Unregister any stale service workers immediately
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for (let registration of registrations) {
      registration.unregister()
      console.log('[AIVOA] Unregistered stale service worker:', registration.scope)
    }
  })
  // Also clear all caches
  if ('caches' in window) {
    caches.keys().then(function(cacheNames) {
      cacheNames.forEach(function(cacheName) {
        caches.delete(cacheName)
        console.log('[AIVOA] Cleared cache:', cacheName)
      })
    })
  }
}
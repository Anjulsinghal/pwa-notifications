
const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Install service worker and cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  // Activate the service worker immediately
  self.skipWaiting();
});

// Activate service worker and clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch resources from cache or network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request because it's a one-time use
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(
          (response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response because it's a one-time use
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          }
        ).catch(() => {
          // If fetch fails, return a fallback page if it's a navigation request
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          
          // Otherwise return a generic offline response
          return new Response('Network error happened', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' }
          });
        });
      })
  );
});

// Handle push notifications
self.addEventListener('push', (event) => {
  try {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'New Notification';
    
    // Configure notification options based on the data or use defaults
    const options = {
      body: data.body || 'Something new happened!',
      icon: data.icon || '/icon-192x192.png',
      badge: data.badge || '/icon-192x192.png',
      tag: data.tag || 'default-notification',
      data: data.data || {},
      // Note: vibrate works in browsers but might not be in TypeScript types
      vibrate: data.vibrate || [200, 100, 200]
    };
    
    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  } catch (error) {
    console.error('Error handling push event:', error);
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Get notification data - may contain useful info about what to do
  const notificationData = event.notification.data || {};
  const type = notificationData.type || 'default';
  
  // You can handle different actions based on notification type
  let url = '/';
  
  switch (type) {
    case 'info':
      url = '/?section=info';
      break;
    case 'success':
      url = '/?section=success';
      break;
    case 'warning':
      url = '/?section=warning';
      break;
    case 'error':
      url = '/?section=error';
      break;
    default:
      url = '/';
  }
  
  event.waitUntil(
    clients.matchAll({type: 'window'}).then(windowClients => {
      // Check if there is already a window focused
      for (let client of windowClients) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If no window is open or the URL doesn't match, open a new one
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
s
// Handle periodic sync
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(
      // Perform background sync operations here
      Promise.resolve(console.log('Performing periodic sync'))
    );
  }
});
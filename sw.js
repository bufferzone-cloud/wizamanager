const CACHE_NAME = 'wiza-food-cafe-manager-v2';
const HOME_URL = 'https://bufferzone-cloud.github.io/wizamanager/home.html';
const urlsToCache = [
  HOME_URL,
  'https://bufferzone-cloud.github.io/wizamanager/',
  'https://bufferzone-cloud.github.io/wizamanager/wfc.png',
  'https://bufferzone-cloud.github.io/wizamanager/Notification.mp3',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-storage.js'
];

self.addEventListener('install', function(event) {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache).catch(error => {
          console.log('Cache addAll error:', error);
        });
      })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', function(event) {
  // Only handle same-origin requests and the home page
  if (event.request.url.startsWith('https://bufferzone-cloud.github.io/wizamanager/')) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Return cached version or fetch from network
          if (response) {
            return response;
          }
          
          return fetch(event.request).then(function(response) {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }).catch(function() {
            // If both cache and network fail, show offline page
            if (event.request.destination === 'document') {
              return caches.match(HOME_URL);
            }
          });
        })
    );
  }
});

self.addEventListener('activate', function(event) {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Handle push notifications
self.addEventListener('push', function(event) {
  console.log('Push notification received');
  
  if (!event.data) return;
  
  let data;
  try {
    data = event.data.json();
  } catch (e) {
    data = {
      title: 'WIZA FOOD CAFE',
      body: event.data.text() || 'New order received!'
    };
  }
  
  const options = {
    body: data.body || 'New order received!',
    icon: 'https://bufferzone-cloud.github.io/wizamanager/wfc.png',
    badge: 'https://bufferzone-cloud.github.io/wizamanager/wfc.png',
    vibrate: [100, 50, 100],
    data: {
      url: HOME_URL,
      dateOfArrival: Date.now()
    },
    actions: [
      {
        action: 'view',
        title: 'View Order'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'WIZA FOOD CAFE', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notification clicked:', event.action);
  event.notification.close();
  
  if (event.action === 'view' || event.action === '') {
    event.waitUntil(
      clients.matchAll({type: 'window'}).then(function(windowClients) {
        // Check if there is already a window open
        for (let i = 0; i < windowClients.length; i++) {
          let client = windowClients[i];
          if (client.url === HOME_URL && 'focus' in client) {
            return client.focus();
          }
        }
        
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(HOME_URL);
        }
      })
    );
  }
});

// Handle background sync for offline orders
self.addEventListener('sync', function(event) {
  console.log('Background sync:', event.tag);
  if (event.tag === 'order-sync') {
    event.waitUntil(
      // Implement your background sync logic here
      // This would sync any pending orders when the connection is restored
      syncOrders()
    );
  }
});

async function syncOrders() {
  // This function would handle syncing any pending orders
  // when the device comes back online
  console.log('Syncing orders...');
  // Implementation would depend on your specific sync requirements
}

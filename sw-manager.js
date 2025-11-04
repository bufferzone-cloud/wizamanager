// Enhanced Service Worker for WIZA FOOD CAFE Manager
const CACHE_NAME = 'wiza-food-cafe-manager-v5';
const HOME_URL = 'https://bufferzone-cloud.github.io/wizamanager/home.html';
const MANAGER_URL = 'https://bufferzone-cloud.github.io/wizamanager/wiza.html';

const urlsToCache = [
  HOME_URL,
  MANAGER_URL,
  'https://bufferzone-cloud.github.io/wizamanager/wfc.png',
  'https://bufferzone-cloud.github.io/wizamanager/Notification.mp3',
  'https://bufferzone-cloud.github.io/wizamanager/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-storage.js'
];

// Install event - Cache all essential resources
self.addEventListener('install', function(event) {
  console.log('🛠️ WIZA Manager Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('📦 Opening cache for manager app');
        return cache.addAll(urlsToCache).catch(error => {
          console.log('⚠️ Some resources failed to cache:', error);
          // Continue even if some resources fail to cache
          return Promise.resolve();
        });
      })
      .then(() => {
        console.log('✅ All essential resources cached');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ Cache installation failed:', error);
      })
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', function(event) {
  console.log('🎯 WIZA Manager Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker activated and ready');
      return self.clients.claim();
    })
  );
});

// Fetch event - Enhanced caching strategy
self.addEventListener('fetch', function(event) {
  const request = event.request;
  
  // Handle Firebase requests with network-first strategy
  if (request.url.includes('firebaseio.com')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache successful Firebase responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request);
        })
    );
    return;
  }

  // For navigation requests, use network-first with cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => {
          return caches.match(HOME_URL);
        })
    );
    return;
  }

  // For static assets, use cache-first strategy
  event.respondWith(
    caches.match(request)
      .then(function(response) {
        if (response) {
          return response;
        }
        
        return fetch(request).then(function(response) {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(request, responseToCache);
            });

          return response;
        }).catch(function() {
          // For CSS and JS files, return empty responses rather than failing
          if (request.destination === 'style' || request.destination === 'script') {
            return new Response('', { 
              status: 200, 
              statusText: 'OK',
              headers: { 'Content-Type': 'text/css' }
            });
          }
        });
      })
  );
});

// Enhanced Push Notification Handler
self.addEventListener('push', function(event) {
  console.log('📢 Push notification received in manager');
  
  let data;
  try {
    data = event.data.json();
    console.log('📨 Push data:', data);
  } catch (e) {
    console.log('⚠️ Error parsing push data, using fallback');
    data = {
      title: 'WIZA FOOD CAFE',
      body: event.data.text() || 'New order received!',
      orderId: 'unknown',
      customerName: 'Customer',
      total: 0,
      timestamp: new Date().toISOString()
    };
  }

  const options = {
    body: data.body || `New order from ${data.customerName || 'Customer'} - K${(data.total || 0).toFixed(2)}`,
    icon: 'https://bufferzone-cloud.github.io/wizamanager/wfc.png',
    badge: 'https://bufferzone-cloud.github.io/wizamanager/wfc.png',
    vibrate: [200, 100, 200, 100, 200, 100, 200],
    tag: data.orderId || `order-${Date.now()}`,
    requireInteraction: true,
    timestamp: data.timestamp ? new Date(data.timestamp).getTime() : Date.now(),
    data: {
      url: MANAGER_URL,
      orderId: data.orderId,
      customerName: data.customerName,
      total: data.total,
      timestamp: data.timestamp || new Date().toISOString(),
      action: 'view-order'
    },
    actions: [
      {
        action: 'view',
        title: '📋 View Order'
      },
      {
        action: 'close',
        title: '❌ Close'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || '🍔 New Order - WIZA FOOD CAFE', 
      options
    ).then(() => {
      console.log('✅ Manager notification shown successfully');
    }).catch(error => {
      console.error('❌ Error showing notification:', error);
    })
  );
});

// Notification Click Handler
self.addEventListener('notificationclick', function(event) {
  console.log('🖱️ Notification clicked:', event.action);
  
  event.notification.close();
  
  const action = event.action || 'view';
  const notificationData = event.notification.data;

  event.waitUntil(
    clients.matchAll({ 
      type: 'window',
      includeUncontrolled: true 
    }).then(function(windowClients) {
      // Focus existing manager window if available
      for (let client of windowClients) {
        if (client.url.includes('wizamanager') && 'focus' in client) {
          client.postMessage({
            type: 'NOTIFICATION_ACTION',
            action: action,
            orderId: notificationData.orderId,
            customerName: notificationData.customerName,
            total: notificationData.total
          });
          return client.focus();
        }
      }
      
      // If no existing window, open new one to the manager app
      if (clients.openWindow) {
        return clients.openWindow(MANAGER_URL);
      }
    })
  );
});

// Handle messages from the app
self.addEventListener('message', function(event) {
  const { type, data } = event.data || {};
  
  console.log('📨 Message received in service worker:', type);
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'APP_INSTALLED':
      console.log('🎉 App installation confirmed');
      break;
      
    case 'CHECK_CONNECTION':
      event.ports[0].postMessage({
        type: 'CONNECTION_STATUS',
        online: navigator.onLine,
        timestamp: new Date().toISOString()
      });
      break;
  }
});

// Background Sync for offline functionality
self.addEventListener('sync', function(event) {
  console.log('🔄 Background sync event:', event.tag);
  
  switch (event.tag) {
    case 'order-sync':
      event.waitUntil(syncPendingOrders());
      break;
      
    case 'firebase-sync':
      event.waitUntil(syncFirebaseData());
      break;
  }
});

// Sync pending orders when back online
async function syncPendingOrders() {
  try {
    console.log('🔄 Syncing pending orders...');
    // Implementation for syncing orders would go here
  } catch (error) {
    console.error('❌ Error syncing orders:', error);
  }
}

// Sync Firebase data
async function syncFirebaseData() {
  try {
    console.log('🔄 Syncing Firebase data...');
    // Implementation for syncing Firebase data would go here
  } catch (error) {
    console.error('❌ Error syncing Firebase data:', error);
  }
}

// Enhanced error handling
self.addEventListener('error', (event) => {
  console.error('❌ Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Service Worker unhandled rejection:', event.reason);
});

console.log('🎯 WIZA FOOD CAFE Manager Service Worker v5 loaded successfully');

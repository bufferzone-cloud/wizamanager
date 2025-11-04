// Service Worker for WIZA FOOD CAFE Manager - Enhanced with real-time notifications
const CACHE_NAME = 'wiza-food-cafe-manager-v3';
const HOME_URL = 'https://bufferzone-cloud.github.io/wizamanager/';
const urlsToCache = [
  HOME_URL,
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

// Install event
self.addEventListener('install', function(event) {
  console.log('🛠️ Manager Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('📦 Opened cache for manager');
        return cache.addAll(urlsToCache).catch(error => {
          console.log('⚠️ Cache addAll error:', error);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', function(event) {
  console.log('🎯 Manager Service Worker activating...');
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
    }).then(() => self.clients.claim())
  );
});

// Fetch event
self.addEventListener('fetch', function(event) {
  if (event.request.url.startsWith('https://bufferzone-cloud.github.io/wizamanager/')) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Return cached version
          if (response) {
            return response;
          }
          
          // Fetch from network
          return fetch(event.request).then(function(response) {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }).catch(function() {
            // Fallback to home page for document requests
            if (event.request.destination === 'document') {
              return caches.match(HOME_URL);
            }
          });
        })
    );
  }
});

// Enhanced Push Notification Handler
self.addEventListener('push', function(event) {
  console.log('📢 Push notification received in manager');
  
  if (!event.data) {
    console.log('❌ No data in push event');
    return;
  }
  
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
      customerName: 'Customer'
    };
  }

  const options = {
    body: data.body || `New order from ${data.customerName || 'Customer'}`,
    icon: 'https://bufferzone-cloud.github.io/wizamanager/wfc.png',
    badge: 'https://bufferzone-cloud.github.io/wizamanager/wfc.png',
    vibrate: [200, 100, 200, 100, 200],
    tag: data.orderId || 'new-order',
    requireInteraction: true,
    data: {
      url: HOME_URL,
      orderId: data.orderId,
      customerName: data.customerName,
      timestamp: Date.now(),
      action: 'view-order'
    },
    actions: [
      {
        action: 'view',
        title: '📋 View Order'
      },
      {
        action: 'accept',
        title: '✅ Accept'
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

// Enhanced Notification Click Handler
self.addEventListener('notificationclick', function(event) {
  console.log('🖱️ Notification clicked:', event.action);
  event.notification.close();
  
  const notificationData = event.notification.data;
  const action = event.action;
  
  event.waitUntil(
    clients.matchAll({ 
      type: 'window',
      includeUncontrolled: true 
    }).then(function(windowClients) {
      // Focus existing window or open new one
      for (let client of windowClients) {
        if (client.url.includes('wizamanager') && 'focus' in client) {
          // Send action data to the manager app
          client.postMessage({
            type: 'NOTIFICATION_ACTION',
            action: action,
            orderId: notificationData.orderId,
            customerName: notificationData.customerName,
            timestamp: notificationData.timestamp
          });
          return client.focus();
        }
      }
      
      // If no existing window, open new one
      if (clients.openWindow) {
        return clients.openWindow(HOME_URL);
      }
    })
  );
});

// Background Sync for offline functionality
self.addEventListener('sync', function(event) {
  console.log('🔄 Background sync:', event.tag);
  
  if (event.tag === 'order-sync') {
    event.waitUntil(syncPendingOrders());
  }
  
  if (event.tag === 'notification-sync') {
    event.waitUntil(syncMissedNotifications());
  }
});

// Sync pending orders when back online
async function syncPendingOrders() {
  try {
    console.log('🔄 Syncing pending orders...');
    // Implementation for syncing any pending order actions
    const pendingActions = await getPendingActions();
    
    for (let action of pendingActions) {
      await processPendingAction(action);
    }
    
    console.log('✅ Pending orders synced successfully');
  } catch (error) {
    console.error('❌ Error syncing orders:', error);
  }
}

// Sync missed notifications
async function syncMissedNotifications() {
  try {
    console.log('🔄 Syncing missed notifications...');
    // Check for any missed orders while offline
    // This would query Firebase for recent orders
  } catch (error) {
    console.error('❌ Error syncing notifications:', error);
  }
}

// Helper functions for background sync
async function getPendingActions() {
  // Get pending actions from IndexedDB
  return new Promise((resolve) => {
    resolve([]);
  });
}

async function processPendingAction(action) {
  // Process individual pending action
  return Promise.resolve();
}

// Message handler for communication with manager app
self.addEventListener('message', function(event) {
  const { type, data } = event.data || {};
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'TRIGGER_NOTIFICATION':
      // For testing notifications
      self.registration.showNotification('Test Notification', {
        body: 'This is a test notification from manager',
        icon: 'https://bufferzone-cloud.github.io/wizamanager/wfc.png',
        badge: 'https://bufferzone-cloud.github.io/wizamanager/wfc.png'
      });
      break;
      
    case 'CHECK_UPDATES':
      event.ports[0].postMessage({
        type: 'UPDATE_STATUS',
        updateAvailable: false
      });
      break;
  }
});

console.log('🎯 WIZA FOOD CAFE Manager Service Worker loaded successfully');

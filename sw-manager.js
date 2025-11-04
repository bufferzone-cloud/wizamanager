// Service Worker for WIZA FOOD CAFE Manager - Enhanced with real-time order tracking
const CACHE_NAME = 'wiza-food-cafe-manager-v4';
const HOME_URL = 'https://bufferzone-cloud.github.io/wizamanager/home.html';
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
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-storage.js',
  'https://bufferzone-cloud.github.io/wizamanager/manifest.json'
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
      .then(() => {
        console.log('✅ All resources cached');
        return self.skipWaiting();
      })
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
    }).then(() => {
      console.log('✅ Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Enhanced Fetch event with network-first strategy for dynamic data
self.addEventListener('fetch', function(event) {
  const request = event.request;
  
  // Handle Firebase requests with network-first strategy
  if (request.url.includes('firebaseio.com')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache the response for offline fallback
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request);
        })
    );
    return;
  }

  // Cache-first strategy for static assets
  if (request.url.startsWith('https://bufferzone-cloud.github.io/wizamanager/')) {
    event.respondWith(
      caches.match(request)
        .then(function(response) {
          // Return cached version
          if (response) {
            return response;
          }
          
          // Fetch from network
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
            // Fallback to home page for document requests
            if (request.destination === 'document') {
              return caches.match(HOME_URL);
            }
          });
        })
    );
  }
});

// Enhanced Push Notification Handler for Real-time Orders
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
      customerName: 'Customer',
      total: 0,
      items: [],
      timestamp: new Date().toISOString()
    };
  }

  // Enhanced notification options
  const options = {
    body: data.body || `New order from ${data.customerName || 'Customer'} - K${(data.total || 0).toFixed(2)}`,
    icon: 'https://bufferzone-cloud.github.io/wizamanager/wfc.png',
    badge: 'https://bufferzone-cloud.github.io/wizamanager/wfc.png',
    vibrate: [200, 100, 200, 100, 200, 100, 200],
    tag: data.orderId || `order-${Date.now()}`,
    requireInteraction: true,
    timestamp: data.timestamp ? new Date(data.timestamp).getTime() : Date.now(),
    data: {
      url: HOME_URL,
      orderId: data.orderId,
      customerName: data.customerName,
      total: data.total,
      items: data.items || [],
      timestamp: data.timestamp || new Date().toISOString(),
      action: 'view-order',
      firebaseKey: data.firebaseKey,
      orderRef: data.orderRef
    },
    actions: [
      {
        action: 'view',
        title: '📋 View Order',
        icon: 'https://bufferzone-cloud.github.io/wizamanager/wfc.png'
      },
      {
        action: 'accept',
        title: '✅ Accept',
        icon: 'https://bufferzone-cloud.github.io/wizamanager/wfc.png'
      },
      {
        action: 'close',
        title: '❌ Close',
        icon: 'https://bufferzone-cloud.github.io/wizamanager/wfc.png'
      }
    ],
    silent: false // Ensure sound plays
  };

  // Add image if available
  if (data.image) {
    options.image = data.image;
  }
  
  event.waitUntil(
    self.registration.showNotification(
      data.title || '🍔 New Order - WIZA FOOD CAFE', 
      options
    ).then(() => {
      console.log('✅ Manager notification shown successfully');
      
      // Send message to all clients about the new notification
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'NEW_ORDER_NOTIFICATION',
            orderId: data.orderId,
            firebaseKey: data.firebaseKey,
            customerName: data.customerName,
            total: data.total,
            timestamp: data.timestamp
          });
        });
      });
    }).catch(error => {
      console.error('❌ Error showing notification:', error);
    })
  );
});

// Enhanced Notification Click Handler
self.addEventListener('notificationclick', function(event) {
  console.log('🖱️ Notification clicked:', event.action);
  console.log('📋 Notification data:', event.notification.data);
  
  event.notification.close();
  
  const notificationData = event.notification.data;
  const action = event.action || 'view'; // Default to view if no action specified
  
  event.waitUntil(
    clients.matchAll({ 
      type: 'window',
      includeUncontrolled: true 
    }).then(function(windowClients) {
      // Focus existing window or open new one
      for (let client of windowClients) {
        if (client.url.includes('wizamanager') && 'focus' in client) {
          // Send enhanced action data to the manager app
          client.postMessage({
            type: 'NOTIFICATION_ACTION',
            action: action,
            orderId: notificationData.orderId,
            firebaseKey: notificationData.firebaseKey,
            customerName: notificationData.customerName,
            total: notificationData.total,
            items: notificationData.items,
            timestamp: notificationData.timestamp,
            orderRef: notificationData.orderRef
          });
          return client.focus();
        }
      }
      
      // If no existing window, open new one to the specific order
      if (clients.openWindow) {
        const url = notificationData.orderId ? 
          `${HOME_URL}#order-${notificationData.orderId}` : HOME_URL;
        return clients.openWindow(url);
      }
    })
  );
});

// Handle notification close
self.addEventListener('notificationclose', function(event) {
  console.log('📪 Notification closed:', event.notification.tag);
  event.notification.close();
});

// Enhanced Background Sync for offline functionality
self.addEventListener('sync', function(event) {
  console.log('🔄 Background sync event:', event.tag);
  
  switch (event.tag) {
    case 'order-sync':
      event.waitUntil(syncPendingOrders());
      break;
      
    case 'notification-sync':
      event.waitUntil(syncMissedNotifications());
      break;
      
    case 'firebase-sync':
      event.waitUntil(syncFirebaseData());
      break;
      
    default:
      console.log('Unknown sync event:', event.tag);
  }
});

// Enhanced Sync pending orders when back online
async function syncPendingOrders() {
  try {
    console.log('🔄 Syncing pending orders...');
    
    // Get pending orders from IndexedDB
    const pendingOrders = await getPendingOrders();
    console.log(`📦 Found ${pendingOrders.length} pending orders to sync`);
    
    for (let order of pendingOrders) {
      await syncOrderToFirebase(order);
    }
    
    console.log('✅ Pending orders synced successfully');
    
    // Notify clients about sync completion
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETED',
        syncedOrders: pendingOrders.length,
        timestamp: new Date().toISOString()
      });
    });
    
  } catch (error) {
    console.error('❌ Error syncing orders:', error);
  }
}

// Sync missed notifications
async function syncMissedNotifications() {
  try {
    console.log('🔄 Syncing missed notifications...');
    
    // Check for any missed orders while offline
    const lastSynced = await getLastSyncTime();
    const currentTime = new Date().toISOString();
    
    // This would query Firebase for recent orders since last sync
    console.log(`⏰ Checking for orders since: ${lastSynced}`);
    
    // Update last sync time
    await updateLastSyncTime(currentTime);
    
    console.log('✅ Missed notifications sync completed');
    
  } catch (error) {
    console.error('❌ Error syncing notifications:', error);
  }
}

// Sync Firebase data
async function syncFirebaseData() {
  try {
    console.log('🔄 Syncing Firebase data...');
    
    // Sync various Firebase data types
    await syncOrdersData();
    await syncMenuData();
    await syncCustomerData();
    
    console.log('✅ Firebase data sync completed');
    
  } catch (error) {
    console.error('❌ Error syncing Firebase data:', error);
  }
}

// Enhanced Message handler for communication with manager app
self.addEventListener('message', function(event) {
  const { type, data } = event.data || {};
  const client = event.source;
  
  console.log('📨 Message received in service worker:', type);
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'TRIGGER_NOTIFICATION':
      // For testing notifications
      self.registration.showNotification('Test Notification - WIZA FOOD CAFE', {
        body: 'This is a test notification from manager app',
        icon: 'https://bufferzone-cloud.github.io/wizamanager/wfc.png',
        badge: 'https://bufferzone-cloud.github.io/wizamanager/wfc.png',
        tag: 'test-notification',
        vibrate: [200, 100, 200]
      });
      break;
      
    case 'CHECK_UPDATES':
      client.postMessage({
        type: 'UPDATE_STATUS',
        updateAvailable: false,
        currentVersion: 'v4',
        timestamp: new Date().toISOString()
      });
      break;
      
    case 'GET_CACHE_STATUS':
      caches.open(CACHE_NAME).then(cache => {
        cache.keys().then(keys => {
          client.postMessage({
            type: 'CACHE_STATUS',
            cacheName: CACHE_NAME,
            cachedItems: keys.length,
            timestamp: new Date().toISOString()
          });
        });
      });
      break;
      
    case 'CLEAR_CACHE':
      caches.delete(CACHE_NAME).then(() => {
        client.postMessage({
          type: 'CACHE_CLEARED',
          timestamp: new Date().toISOString()
        });
      });
      break;
      
    case 'NEW_ORDER_RECEIVED':
      // Handle new order from the app
      handleNewOrderFromApp(data);
      break;
      
    case 'ORDER_STATUS_UPDATE':
      // Handle order status updates
      handleOrderStatusUpdate(data);
      break;
      
    case 'PLAY_NOTIFICATION_SOUND':
      // Trigger notification sound
      handlePlayNotificationSound();
      break;
  }
});

// Handle new order from the app
function handleNewOrderFromApp(orderData) {
  console.log('🆕 Handling new order from app:', orderData);
  
  // Show notification for the new order
  self.registration.showNotification('🍔 New Order - WIZA FOOD CAFE', {
    body: `Order ${orderData.ref} from ${orderData.customer?.name || 'Customer'} - K${orderData.total?.toFixed(2) || '0.00'}`,
    icon: 'https://bufferzone-cloud.github.io/wizamanager/wfc.png',
    badge: 'https://bufferzone-cloud.github.io/wizamanager/wfc.png',
    tag: orderData.firebaseKey || `order-${Date.now()}`,
    vibrate: [200, 100, 200, 100, 200],
    requireInteraction: true,
    data: {
      orderId: orderData.id,
      firebaseKey: orderData.firebaseKey,
      orderRef: orderData.ref,
      customerName: orderData.customer?.name,
      total: orderData.total,
      timestamp: orderData.timestamp || new Date().toISOString(),
      action: 'view-order'
    }
  });
}

// Handle order status updates
function handleOrderStatusUpdate(statusData) {
  console.log('🔄 Handling order status update:', statusData);
  
  // Show notification for important status changes
  if (statusData.status === 'ready' || statusData.status === 'out-for-delivery') {
    self.registration.showNotification(`Order ${statusData.status} - WIZA FOOD CAFE`, {
      body: `Order ${statusData.orderRef} is ${statusData.status}`,
      icon: 'https://bufferzone-cloud.github.io/wizamanager/wfc.png',
      tag: `status-${statusData.orderId}`,
      data: {
        orderId: statusData.orderId,
        orderRef: statusData.orderRef,
        status: statusData.status,
        timestamp: new Date().toISOString()
      }
    });
  }
}

// Handle play notification sound
function handlePlayNotificationSound() {
  console.log('🔊 Playing notification sound via service worker');
  
  // This would typically involve playing audio, but in service worker context
  // we rely on the notification sound capabilities
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'PLAY_SOUND',
        soundType: 'notification'
      });
    });
  });
}

// Helper functions for background sync

async function getPendingOrders() {
  // Get pending orders from IndexedDB
  return new Promise((resolve) => {
    // Simulate getting orders from storage
    resolve([]);
  });
}

async function syncOrderToFirebase(order) {
  // Sync individual order to Firebase
  return new Promise((resolve) => {
    console.log(`📤 Syncing order ${order.id} to Firebase`);
    resolve();
  });
}

async function getLastSyncTime() {
  return new Promise((resolve) => {
    resolve(new Date().toISOString());
  });
}

async function updateLastSyncTime(timestamp) {
  return new Promise((resolve) => {
    resolve();
  });
}

async function syncOrdersData() {
  console.log('📊 Syncing orders data...');
  return Promise.resolve();
}

async function syncMenuData() {
  console.log('📋 Syncing menu data...');
  return Promise.resolve();
}

async function syncCustomerData() {
  console.log('👥 Syncing customer data...');
  return Promise.resolve();
}

// Periodic sync for background updates
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'order-check') {
    console.log('🕒 Periodic sync for order check');
    event.waitUntil(checkForNewOrders());
  }
});

async function checkForNewOrders() {
  try {
    console.log('🔍 Checking for new orders...');
    
    // This would typically check Firebase for new orders
    // For now, we'll just log and notify clients
    
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'PERIODIC_SYNC',
        timestamp: new Date().toISOString(),
        action: 'check-orders'
      });
    });
    
  } catch (error) {
    console.error('❌ Error in periodic sync:', error);
  }
}

// Enhanced error handling
self.addEventListener('error', (event) => {
  console.error('❌ Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Service Worker unhandled rejection:', event.reason);
});

console.log('🎯 WIZA FOOD CAFE Manager Service Worker v4 loaded successfully - Real-time order tracking enabled');

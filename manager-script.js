```javascript
// --- Your Firebase Config ---
const firebaseConfig = {
  apiKey: "AIzaSyCZEqWRAHW0tW6j0WfBf8lxj61oExa6BwY",
  authDomain: "wizafoodcafe.firebaseapp.com",
  databaseURL: "https://wizafoodcafe-default-rtdb.firebaseio.com",
  projectId: "wizafoodcafe",
  storageBucket: "wizafoodcafe.firebasestorage.app",
  messagingSenderId: "248334218737",
  appId: "1:248334218737:web:94fabd0bbdf75bb8410050"
};



// Manager App State
const managerState = {
    currentSection: 'dashboard',
    menuItems: [],
    orders: [],
    customers: [],
    promotions: [],
    analytics: {},
    settings: {
        appOnline: true,
        acceptOrders: true,
        deliveryEnabled: true,
        notificationSound: true,
        autoRefresh: true
    },
    restaurantLocation: [-15.402235977316481, 28.329942522202668], // Wiza Food Cafe coordinates
    orderCounter: 1
};

// DOM Elements
let elements = {};

// Notification variables
let newOrderNotification = null;
let notificationSound = null;
let isNotificationActive = false;

// Auto-refresh interval
let autoRefreshInterval = null;
const AUTO_REFRESH_INTERVAL = 2000; // 2 seconds

// Initialize Manager App
document.addEventListener('DOMContentLoaded', function() {
    initializeManagerApp();
});

function initializeManagerApp() {
    initializeElements();
    setupEventListeners();
    loadManagerData();
    setupOrderListener();
    startAutoRefresh();
    
    // Initialize sections
    updateDashboard();
    loadFullMenu();
    loadOrders();
    loadCustomers();
    loadPromotions();
    initializeCharts();
    
    // Initialize notification sound
    createNotificationSound();
    
    showNotification('Manager dashboard loaded successfully!', 'success');
}

function initializeElements() {
    elements = {
        // Navigation
        navItems: document.querySelectorAll('.nav-item'),
        contentSections: document.querySelectorAll('.content-section'),
        logoutBtn: document.getElementById('logoutBtn'),
        
        // Dashboard
        totalRevenue: document.getElementById('totalRevenue'),
        totalOrders: document.getElementById('totalOrders'),
        activeCustomers: document.getElementById('activeCustomers'),
        pendingOrders: document.getElementById('pendingOrders'),
        readyOrders: document.getElementById('readyOrders'),
        pendingOrdersCount: document.getElementById('pendingOrdersCount'),
        orderStatusCounts: document.getElementById('orderStatusCounts'),
        revenueBreakdown: document.getElementById('revenueBreakdown'),
        recentActivity: document.getElementById('recentActivity'),
        
        // Menu Management
        menuItemsGrid: document.getElementById('menuItemsGrid'),
        addMenuItemBtn: document.getElementById('addMenuItemBtn'),
        categoryBtns: document.querySelectorAll('.category-btn'),
        totalMenuItems: document.getElementById('totalMenuItems'),
        availableItems: document.getElementById('availableItems'),
        popularItems: document.getElementById('popularItems'),
        newItems: document.getElementById('newItems'),
        
        // Orders
        ordersList: document.getElementById('ordersList'),
        orderStatusFilter: document.getElementById('orderStatusFilter'),
        tabBtns: document.querySelectorAll('.tab-btn'),
        
        // Customers
        customersTableBody: document.getElementById('customersTableBody'),
        customerSearch: document.getElementById('customerSearch'),
        
        // Promotions
        promotionsGrid: document.getElementById('promotionsGrid'),
        addPromotionBtn: document.getElementById('addPromotionBtn'),
        promotionForm: document.getElementById('promotionForm'),
        
        // Settings
        appStatusToggle: document.getElementById('appStatusToggle'),
        orderingToggle: document.getElementById('orderingToggle'),
        deliveryToggle: document.getElementById('deliveryToggle'),
        notificationToggle: document.getElementById('notificationToggle'),
        autoRefreshToggle: document.getElementById('autoRefreshToggle'),
        
        // Modals
        modals: document.querySelectorAll('.modal'),
        closeModalBtns: document.querySelectorAll('.close-modal'),
        overlay: document.querySelector('.overlay'),
        
        // Order Details Modal
        orderDetailsModal: document.getElementById('orderDetailsModal'),
        orderDetailsContent: document.getElementById('orderDetailsContent'),
        
        // Customer Details Modal
        customerDetailsModal: document.getElementById('customerDetailsModal'),
        customerDetailsContent: document.getElementById('customerDetailsContent'),
        
        // Menu Item Modal
        menuItemModal: document.getElementById('menuItemModal'),
        menuModalTitle: document.getElementById('menuModalTitle'),
        menuItemForm: document.getElementById('menuItemForm'),
        
        // Analytics
        analyticsPeriod: document.getElementById('analyticsPeriod'),
        avgOrderValue: document.getElementById('avgOrderValue'),
        conversionRate: document.getElementById('conversionRate'),
        retentionRate: document.getElementById('retentionRate'),
        peakHours: document.getElementById('peakHours')
    };
}

// NOTIFICATION SYSTEM
function createNotificationSound() {
    try {
        notificationSound = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA');
        notificationSound.volume = 0.7;
    } catch (error) {
        console.error('Error creating notification sound:', error);
    }
}

function showNewOrderNotification(order) {
    if (!managerState.settings.notificationSound) return;
    
    isNotificationActive = true;
    
    // Create notification element
    newOrderNotification = document.createElement('div');
    newOrderNotification.className = 'new-order-notification';
    newOrderNotification.innerHTML = `
        <div class="notification-alert">
            <div class="notification-header">
                <div class="notification-icon">
                    <i class="fas fa-bell"></i>
                </div>
                <h3>NEW ORDER RECEIVED!</h3>
                <button class="close-notification" onclick="closeNotification()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="order-preview">
                <div class="customer-section">
                    <h4 class="section-title">Customer Details</h4>
                    <div class="customer-info-grid">
                        <div class="info-item">
                            <i class="fas fa-user"></i>
                            <div>
                                <strong>Name:</strong>
                                <span>${order.customer.name}</span>
                            </div>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-phone"></i>
                            <div>
                                <strong>Phone:</strong>
                                <span>${order.customer.phone}</span>
                            </div>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-envelope"></i>
                            <div>
                                <strong>Email:</strong>
                                <span>${order.customer.email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="items-section">
                    <h4 class="section-title">Order Items</h4>
                    <div class="order-items-preview">
                        ${order.items.slice(0, 3).map(item => `
                            <div class="order-item-preview">
                                <img src="${getImagePath(item.image)}" alt="${item.name}" class="item-preview-image">
                                <span>${item.quantity}x ${item.name}</span>
                                <span class="item-price">K${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        `).join('')}
                        ${order.items.length > 3 ? `<div class="more-items">+${order.items.length - 3} more items</div>` : ''}
                    </div>
                </div>

                <div class="summary-section">
                    <h4 class="section-title">Order Summary</h4>
                    <div class="summary-grid">
                        <div class="summary-item">
                            <span>Total Amount:</span>
                            <span>K${order.total.toFixed(2)}</span>
                        </div>
                        <div class="summary-item">
                            <span>Delivery Method:</span>
                            <span>${order.delivery ? 'Delivery' : 'Pickup'}</span>
                        </div>
                    </div>
                </div>

                <div class="actions-section">
                    <button class="btn-accept" onclick="acceptNewOrder('${order.id}')">
                        <i class="fas fa-check-circle"></i> Accept Order
                    </button>
                    <button class="btn-reject" onclick="rejectNewOrder('${order.id}')">
                        <i class="fas fa-times-circle"></i> Reject Order
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(newOrderNotification);
    playNotificationSound();
    
    // Auto-close after 30 seconds
    setTimeout(() => {
        if (isNotificationActive) {
            closeNotification();
        }
    }, 30000);
}

function playNotificationSound() {
    if (notificationSound && managerState.settings.notificationSound) {
        notificationSound.currentTime = 0;
        notificationSound.play().catch(error => {
            console.log('Notification sound play failed:', error);
        });
    }
}

function closeNotification() {
    isNotificationActive = false;
    
    if (notificationSound) {
        notificationSound.pause();
        notificationSound.currentTime = 0;
    }
    
    if (newOrderNotification) {
        newOrderNotification.remove();
        newOrderNotification = null;
    }
}

function acceptNewOrder(orderId) {
    updateOrderStatus(orderId, 'preparing');
    closeNotification();
    showNotification('Order accepted successfully!', 'success');
}

function rejectNewOrder(orderId) {
    updateOrderStatus(orderId, 'cancelled');
    closeNotification();
    showNotification('Order rejected successfully!', 'warning');
}

// ENHANCED ORDER LISTENER SYSTEM
// ENHANCED ORDER LISTENER FOR MANAGER APP
// =========================================
// 🧠 FIREBASE REAL-TIME ORDER LISTENER
// =========================================
function setupOrderListener() {
  console.log("📡 Setting up Firebase order listener...");
  const ordersRef = ref(db, "orders");

  // Listen for every new child added to "orders"
  onChildAdded(ordersRef, (snapshot) => {
    const newOrder = snapshot.val();
    console.log("🆕 New order received from Firebase:", newOrder);

    if (newOrder && typeof handleNewOrder === "function") {
      handleNewOrder(newOrder); // Your dashboard’s existing function
    }
  });
}

// ENHANCED ORDER CHECKING
function checkForNewOrders() {
    try {
        // Check localStorage for orders
        const orders = JSON.parse(localStorage.getItem('wizaFoodOrders') || '[]');
        const lastProcessedOrder = parseInt(localStorage.getItem('lastProcessedOrder') || '0');
        
        const newOrders = orders.filter(order => order.id > lastProcessedOrder);
        
        if (newOrders.length > 0) {
            console.log(`🆕 Found ${newOrders.length} new orders`);
            
            newOrders.forEach(order => {
                console.log('Processing new order:', order.ref);
                handleNewOrder(order);
                // Update last processed order
                localStorage.setItem('lastProcessedOrder', order.id.toString());
            });
        }
        
        // Check for immediate order events
        const newOrderEvent = localStorage.getItem('wizaNewOrder');
        if (newOrderEvent) {
            try {
                const order = JSON.parse(newOrderEvent);
                console.log('🚨 Immediate order received:', order.ref);
                handleNewOrder(order);
                localStorage.removeItem('wizaNewOrder');
            } catch (e) {
                console.error('Error parsing immediate order:', e);
                localStorage.removeItem('wizaNewOrder');
            }
        }
        
    } catch (error) {
        console.error('Error checking for new orders:', error);
    }
}


// ENHANCED ORDER HANDLING
function handleNewOrder(order) {
    // Validate order
    if (!order || !order.id) {
        console.error('Invalid order received:', order);
        return;
    }
    
    // Check if order already exists
    const existingOrder = managerState.orders.find(o => o.id === order.id || o.ref === order.ref);
    
    if (!existingOrder) {
        console.log('➕ Adding new order to manager:', order.ref);
        
        // Add timestamp if not present
        if (!order.timestamp) {
            order.timestamp = new Date().toISOString();
        }
        
        // Ensure order has all required fields
        order = enhanceOrderData(order);
        
        // Add to orders array at the beginning
        managerState.orders.unshift(order);
        
        // Update order counter
        if (order.id && order.id >= managerState.orderCounter) {
            managerState.orderCounter = order.id + 1;
        }
        
        // Save data immediately
        saveManagerData();
        
        // Update UI in real-time
        updateUIForNewOrder(order);
        
        // Show notification
        if (managerState.settings.appOnline && managerState.settings.acceptOrders) {
            showNewOrderNotification(order);
        }
        
        console.log('✅ New order processed successfully:', order.ref);
        
    } else {
        console.log('⚠️ Order already exists:', order.ref);
    }
}
// AUTO-REFRESH SYSTEM
function startAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
    
    if (managerState.settings.autoRefresh) {
        autoRefreshInterval = setInterval(() => {
            checkForNewOrders();
            if (managerState.currentSection === 'orders') {
                loadOrders();
            }
            updateDashboard();
            updatePendingOrdersCount();
        }, AUTO_REFRESH_INTERVAL);
    }
}

// ENHANCE ORDER DATA
function enhanceOrderData(order) {
    return {
        id: order.id || generateId(),
        ref: order.ref || `WIZA${(order.id || generateId()).toString().padStart(4, '0')}`,
        items: order.items || [],
        subtotal: order.subtotal || 0,
        deliveryFee: order.deliveryFee || 0,
        serviceFee: order.serviceFee || 0,
        discount: order.discount || 0,
        total: order.total || 0,
        status: order.status || 'pending',
        date: order.date || new Date().toISOString(),
        delivery: order.delivery || false,
        deliveryLocation: order.deliveryLocation || null,
        customer: order.customer || { name: 'Unknown Customer', email: '', phone: '' },
        promoCode: order.promoCode || null,
        paymentMethod: order.paymentMethod || 'Airtel Money',
        paymentScreenshot: order.paymentScreenshot || null,
        timestamp: order.timestamp || new Date().toISOString(),
        // Enhanced fields
        itemsDetailed: order.itemsDetailed || order.items.map(item => ({
            ...item,
            description: item.description || 'Delicious food item',
            image: item.image || 'default-food.jpg'
        }))
    };
}

// UPDATE UI FOR NEW ORDER
function updateUIForNewOrder(order) {
    // Update dashboard if visible
    if (managerState.currentSection === 'dashboard') {
        updateDashboard();
    }
    
    // Update orders list if visible
    if (managerState.currentSection === 'orders') {
        loadOrders();
    }
    
    // Update pending orders count in navigation
    updatePendingOrdersCount();
    
    // Show visual indicator
    showNewOrderIndicator();
}

// VISUAL INDICATOR FOR NEW ORDERS
function showNewOrderIndicator() {
    // Create or update notification badge
    let indicator = document.getElementById('newOrderIndicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'newOrderIndicator';
        indicator.className = 'new-order-indicator';
        indicator.innerHTML = '🆕';
        document.body.appendChild(indicator);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.remove();
            }
        }, 3000);
    }
}

function toggleAutoRefresh() {
    managerState.settings.autoRefresh = elements.autoRefreshToggle.checked;
    saveManagerData();
    
    if (managerState.settings.autoRefresh) {
        startAutoRefresh();
        showNotification('Auto-refresh enabled', 'success');
    } else {
        if (autoRefreshInterval) {
            clearInterval(autoRefreshInterval);
            autoRefreshInterval = null;
        }
        showNotification('Auto-refresh disabled', 'warning');
    }
}

// EVENT LISTENERS
function setupEventListeners() {
    // Navigation
    elements.navItems.forEach(item => {
        item.addEventListener('click', () => navigateToSection(item.dataset.section));
    });

    // Logout
    if (elements.logoutBtn) {
        elements.logoutBtn.addEventListener('click', logout);
    }

    // Menu Management
    if (elements.addMenuItemBtn) {
        elements.addMenuItemBtn.addEventListener('click', () => openMenuItemModal());
    }
    
    if (elements.categoryBtns) {
        elements.categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => filterMenuByCategory(btn.dataset.category));
        });
    }

    // Orders
    if (elements.orderStatusFilter) {
        elements.orderStatusFilter.addEventListener('change', filterOrders);
    }
    
    if (elements.tabBtns) {
        elements.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => switchOrdersTab(btn.dataset.tab));
        });
    }

    // Promotions
    if (elements.addPromotionBtn) {
        elements.addPromotionBtn.addEventListener('click', () => togglePromotionForm());
    }

    // Settings
    if (elements.appStatusToggle) {
        elements.appStatusToggle.addEventListener('change', toggleAppStatus);
    }
    
    if (elements.orderingToggle) {
        elements.orderingToggle.addEventListener('change', toggleOrdering);
    }
    
    if (elements.deliveryToggle) {
        elements.deliveryToggle.addEventListener('change', toggleDelivery);
    }
    
    if (elements.notificationToggle) {
        elements.notificationToggle.addEventListener('change', toggleNotifications);
    }
    
    if (elements.autoRefreshToggle) {
        elements.autoRefreshToggle.addEventListener('change', toggleAutoRefresh);
    }

    // Modals
    elements.closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    if (elements.overlay) {
        elements.overlay.addEventListener('click', closeAllModals);
    }

    // Customer search
    if (elements.customerSearch) {
        elements.customerSearch.addEventListener('input', searchCustomers);
    }

    // Analytics period
    if (elements.analyticsPeriod) {
        elements.analyticsPeriod.addEventListener('change', updateAnalytics);
    }

    // Event delegation for dynamic elements
    document.addEventListener('click', function(e) {
        // View order details
        if (e.target.closest('.view-order-btn')) {
            const button = e.target.closest('.view-order-btn');
            const orderId = button.dataset.id;
            viewOrderDetails(orderId);
        }
        
        // Update order status
        if (e.target.closest('.status-btn')) {
            const button = e.target.closest('.status-btn');
            const orderId = button.dataset.id;
            const status = button.dataset.status;
            updateOrderStatus(orderId, status);
        }
        
        // Edit menu item
        if (e.target.closest('.edit-menu-btn')) {
            const button = e.target.closest('.edit-menu-btn');
            const itemId = button.dataset.id;
            openMenuItemModal(itemId);
        }
        
        // Delete menu item
        if (e.target.closest('.delete-menu-btn')) {
            const button = e.target.closest('.delete-menu-btn');
            const itemId = button.dataset.id;
            deleteMenuItem(itemId);
        }
        
        // Toggle menu item availability
        if (e.target.closest('.toggle-availability-btn')) {
            const button = e.target.closest('.toggle-availability-btn');
            const itemId = button.dataset.id;
            toggleItemAvailability(itemId);
        }
        
        // View customer details
        if (e.target.closest('.view-customer-btn')) {
            const button = e.target.closest('.view-customer-btn');
            const customerId = button.dataset.id;
            viewCustomerDetails(customerId);
        }
    });
}

// DATA MANAGEMENT
function loadManagerData() {
    const savedData = localStorage.getItem('wizaManagerData');
    
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            Object.assign(managerState, data);
            
            // Initialize settings if not present
            if (!managerState.settings) {
                managerState.settings = {
                    appOnline: true,
                    acceptOrders: true,
                    deliveryEnabled: true,
                    notificationSound: true,
                    autoRefresh: true
                };
            }
            
            // Initialize order counter if not present
            if (!managerState.orderCounter) {
                managerState.orderCounter = managerState.orders.length > 0 ? 
                    Math.max(...managerState.orders.map(o => o.id)) + 1 : 1;
            }
            
        } catch (e) {
            console.error('Error parsing saved data:', e);
            initializeDefaultData();
        }
    } else {
        initializeDefaultData();
    }
    
    // Update UI to reflect loaded settings
    updateSettingsUI();
}

function initializeDefaultData() {
    managerState.menuItems = [...completeMenuData];
    managerState.orders = [];
    managerState.customers = [];
    managerState.promotions = [];
    managerState.settings = {
        appOnline: true,
        acceptOrders: true,
        deliveryEnabled: true,
        notificationSound: true,
        autoRefresh: true
    };
    managerState.orderCounter = 1;

    saveManagerData();
}

function saveManagerData() {
    try {
        localStorage.setItem('wizaManagerData', JSON.stringify(managerState));
    } catch (error) {
        console.error('Error saving data:', error);
        showNotification('Error saving data. Storage might be full.', 'error');
    }
}

function updateSettingsUI() {
    if (elements.appStatusToggle) {
        elements.appStatusToggle.checked = managerState.settings.appOnline;
    }
    if (elements.orderingToggle) {
        elements.orderingToggle.checked = managerState.settings.acceptOrders;
    }
    if (elements.deliveryToggle) {
        elements.deliveryToggle.checked = managerState.settings.deliveryEnabled;
    }
    if (elements.notificationToggle) {
        elements.notificationToggle.checked = managerState.settings.notificationSound;
    }
    if (elements.autoRefreshToggle) {
        elements.autoRefreshToggle.checked = managerState.settings.autoRefresh;
    }
}

// NAVIGATION
function navigateToSection(section) {
    // Update navigation
    elements.navItems.forEach(item => item.classList.remove('active'));
    const activeNavItem = document.querySelector(`[data-section="${section}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }

    // Update content
    elements.contentSections.forEach(contentSection => contentSection.classList.remove('active'));
    const activeSection = document.getElementById(section);
    if (activeSection) {
        activeSection.classList.add('active');
    }

    managerState.currentSection = section;

    // Refresh section data
    switch(section) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'menu-management':
            loadFullMenu();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'customers':
            loadCustomers();
            break;
        case 'analytics':
            updateAnalytics();
            break;
        case 'promotions':
            loadPromotions();
            break;
        case 'settings':
            // Settings doesn't need refresh
            break;
    }
}

// DASHBOARD FUNCTIONS
function updateDashboard() {
    const stats = calculateDashboardStats();
    
    // Update main stats
    if (elements.totalRevenue) elements.totalRevenue.textContent = `K${stats.totalRevenue.toFixed(2)}`;
    if (elements.totalOrders) elements.totalOrders.textContent = stats.totalOrders;
    if (elements.activeCustomers) elements.activeCustomers.textContent = stats.activeCustomers;
    if (elements.pendingOrders) elements.pendingOrders.textContent = stats.pendingOrders;
    if (elements.readyOrders) elements.readyOrders.textContent = stats.readyOrders;
    if (elements.pendingOrdersCount) elements.pendingOrdersCount.textContent = stats.pendingOrders;

    updateOrderStatusCounts();
    updateRevenueAnalytics();
    updateRecentActivity();
}

function calculateDashboardStats() {
    const today = new Date().toDateString();
    const todayOrders = managerState.orders.filter(order => 
        new Date(order.date).toDateString() === today
    );
    
    const lastWeek = new Date(Date.now() - 7 * 86400000);
    const weekOrders = managerState.orders.filter(order => 
        new Date(order.date) >= lastWeek
    );

    const lastMonth = new Date(Date.now() - 30 * 86400000);
    const monthOrders = managerState.orders.filter(order => 
        new Date(order.date) >= lastMonth
    );

    return {
        totalRevenue: todayOrders.reduce((sum, order) => sum + order.total, 0),
        totalOrders: todayOrders.length,
        activeCustomers: managerState.customers.filter(c => c.status === 'active').length,
        pendingOrders: managerState.orders.filter(o => o.status === 'pending').length,
        readyOrders: managerState.orders.filter(o => o.status === 'ready').length,
        outForDelivery: managerState.orders.filter(o => o.status === 'out-for-delivery').length,
        weekRevenue: weekOrders.reduce((sum, order) => sum + order.total, 0),
        monthRevenue: monthOrders.reduce((sum, order) => sum + order.total, 0),
        weekOrders: weekOrders.length,
        monthOrders: monthOrders.length
    };
}

function updateOrderStatusCounts() {
    const stats = calculateDashboardStats();
    
    if (elements.orderStatusCounts) {
        elements.orderStatusCounts.innerHTML = `
            <div class="status-count">
                <span class="count">${stats.pendingOrders}</span>
                <span class="label">Pending</span>
            </div>
            <div class="status-count">
                <span class="count">${managerState.orders.filter(o => o.status === 'preparing').length}</span>
                <span class="label">Preparing</span>
            </div>
            <div class="status-count">
                <span class="count">${stats.readyOrders}</span>
                <span class="label">Ready</span>
            </div>
            <div class="status-count">
                <span class="count">${stats.outForDelivery}</span>
                <span class="label">Out for Delivery</span>
            </div>
        `;
    }
}

function updateRevenueAnalytics() {
    const stats = calculateDashboardStats();
    
    if (elements.revenueBreakdown) {
        elements.revenueBreakdown.innerHTML = `
            <div class="revenue-item">
                <span>Today:</span>
                <span>K${stats.totalRevenue.toFixed(2)}</span>
            </div>
            <div class="revenue-item">
                <span>This Week:</span>
                <span>K${stats.weekRevenue.toFixed(2)}</span>
            </div>
            <div class="revenue-item">
                <span>This Month:</span>
                <span>K${stats.monthRevenue.toFixed(2)}</span>
            </div>
        `;
    }
}

function updateRecentActivity() {
    if (!elements.recentActivity) return;

    const recentOrders = managerState.orders
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    if (recentOrders.length === 0) {
        elements.recentActivity.innerHTML = `
            <div class="no-activity">
                <i class="fas fa-clock"></i>
                <p>No recent activity</p>
            </div>
        `;
        return;
    }

    elements.recentActivity.innerHTML = recentOrders.map(order => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas fa-shopping-cart"></i>
            </div>
            <div class="activity-content">
                <p><strong>Order ${order.ref}</strong> - ${order.customer.name}</p>
                <p class="activity-time">${new Date(order.date).toLocaleString()}</p>
            </div>
            <div class="activity-status status-${order.status}">
                ${order.status}
            </div>
        </div>
    `).join('');
}

function updatePendingOrdersCount() {
    const pendingCount = managerState.orders.filter(order => order.status === 'pending').length;
    if (elements.pendingOrdersCount) {
        elements.pendingOrdersCount.textContent = pendingCount;
    }
}

// ORDERS MANAGEMENT
function loadOrders() {
    if (!elements.ordersList) return;

    const statusFilter = elements.orderStatusFilter ? elements.orderStatusFilter.value : 'all';
    let filteredOrders = managerState.orders;

    if (statusFilter !== 'all') {
        filteredOrders = managerState.orders.filter(order => order.status === statusFilter);
    }

    filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (filteredOrders.length === 0) {
        elements.ordersList.innerHTML = `
            <div class="no-orders">
                <i class="fas fa-shopping-cart fa-3x"></i>
                <h3>No Orders Found</h3>
                <p>${statusFilter === 'all' ? 'No orders have been placed yet.' : `No ${statusFilter} orders found.`}</p>
            </div>
        `;
        return;
    }

    elements.ordersList.innerHTML = filteredOrders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div class="order-info">
                    <h4>Order ${order.ref}</h4>
                    <p class="order-customer">
                        <i class="fas fa-user"></i> ${order.customer.name} • 
                        <i class="fas fa-phone"></i> ${order.customer.phone}
                    </p>
                    <p class="order-time">
                        <i class="fas fa-clock"></i> ${new Date(order.date).toLocaleString()}
                    </p>
                </div>
                <div class="order-status-container">
                    <span class="order-status status-${order.status}">
                        <i class="fas fa-${getStatusIcon(order.status)}"></i> ${order.status}
                    </span>
                    <p class="order-total-amount">K${order.total.toFixed(2)}</p>
                </div>
            </div>
            
            <div class="order-items-preview">
                ${order.items.slice(0, 2).map(item => `
                    <div class="order-item-preview">
                        <img src="${getImagePath(item.image)}" alt="${item.name}" class="item-preview-image">
                        <span>${item.quantity}x ${item.name}</span>
                    </div>
                `).join('')}
                ${order.items.length > 2 ? `<div class="more-items">+${order.items.length - 2} more items</div>` : ''}
            </div>

            <div class="order-details-quick">
                <div class="detail-quick">
                    <i class="fas fa-${order.delivery ? 'truck' : 'store'}"></i>
                    ${order.delivery ? 'Delivery' : 'Pickup'}
                </div>
                <div class="detail-quick">
                    <i class="fas fa-money-bill-wave"></i>
                    Total: K${order.total.toFixed(2)}
                </div>
                ${order.promoCode ? `
                <div class="detail-quick">
                    <i class="fas fa-tag"></i>
                    Promo: ${order.promoCode}
                </div>
                ` : ''}
            </div>

            <div class="order-actions">
                <button class="btn-primary view-order-btn" data-id="${order.id}">
                    <i class="fas fa-eye"></i> View Details
                </button>
                
                ${getStatusButtons(order)}
            </div>
        </div>
    `).join('');
}

function getStatusButtons(order) {
    const status = order.status;
    let buttons = '';
    
    switch(status) {
        case 'pending':
            buttons = `
                <button class="btn-success status-btn" data-id="${order.id}" data-status="preparing">
                    <i class="fas fa-check"></i> Accept
                </button>
                <button class="btn-danger status-btn" data-id="${order.id}" data-status="cancelled">
                    <i class="fas fa-times"></i> Reject
                </button>
            `;
            break;
            
        case 'preparing':
            buttons = `
                <button class="btn-warning status-btn" data-id="${order.id}" data-status="ready">
                    <i class="fas fa-check-double"></i> Mark Ready
                </button>
            `;
            break;
            
        case 'ready':
            if (order.delivery) {
                buttons = `
                    <button class="btn-info status-btn" data-id="${order.id}" data-status="out-for-delivery">
                        <i class="fas fa-truck"></i> Out for Delivery
                    </button>
                `;
            } else {
                buttons = `
                    <button class="btn-success status-btn" data-id="${order.id}" data-status="completed">
                        <i class="fas fa-check-circle"></i> Complete
                    </button>
                `;
            }
            break;
            
        case 'out-for-delivery':
            buttons = `
                <button class="btn-success status-btn" data-id="${order.id}" data-status="completed">
                    <i class="fas fa-check-circle"></i> Delivered
                </button>
            `;
            break;
    }
    
    return buttons;
}

function getStatusIcon(status) {
    const icons = {
        'pending': 'clock',
        'preparing': 'utensils',
        'ready': 'check-circle',
        'out-for-delivery': 'truck',
        'completed': 'check-double',
        'cancelled': 'times-circle'
    };
    return icons[status] || 'question';
}

function filterOrders() {
    loadOrders();
}

function switchOrdersTab(tab) {
    elements.tabBtns.forEach(btn => btn.classList.remove('active'));
    const activeTab = document.querySelector(`[data-tab="${tab}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    if (tab === 'history') {
        loadOrderHistory();
    } else {
        loadOrders();
    }
}

function loadOrderHistory() {
    if (!elements.ordersList) return;

    const historicalOrders = managerState.orders.filter(order => 
        order.status === 'completed' || order.status === 'cancelled'
    ).sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (historicalOrders.length === 0) {
        elements.ordersList.innerHTML = `
            <div class="no-orders">
                <i class="fas fa-history fa-3x"></i>
                <h3>No Order History</h3>
                <p>Completed and cancelled orders will appear here</p>
            </div>
        `;
        return;
    }
    
    elements.ordersList.innerHTML = historicalOrders.map(order => `
        <div class="order-card historical">
            <div class="order-header">
                <div class="order-info">
                    <h4>Order ${order.ref}</h4>
                    <p class="order-customer">${order.customer.name} • ${order.customer.phone}</p>
                    <p class="order-time">${new Date(order.date).toLocaleString()}</p>
                </div>
                <div class="order-status-container">
                    <span class="order-status status-${order.status}">${order.status}</span>
                    <p class="order-total-amount">K${order.total.toFixed(2)}</p>
                </div>
            </div>
            
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.quantity}x ${item.name}</span>
                        <span>K${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>

            <div class="order-actions">
                <button class="btn-primary view-order-btn" data-id="${order.id}">
                    <i class="fas fa-eye"></i> View Details
                </button>
                ${order.status === 'completed' ? `
                    <button class="btn-success" onclick="recreateOrder('${order.id}')">
                        <i class="fas fa-redo"></i> Recreate
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function viewOrderDetails(orderId) {
    const order = managerState.orders.find(o => o.id == orderId);
    if (!order) return;

    if (!elements.orderDetailsModal || !elements.orderDetailsContent) return;
    
    elements.orderDetailsContent.innerHTML = `
        <div class="order-detail-section">
            <h4><i class="fas fa-info-circle"></i> Order Information</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <label><i class="fas fa-hashtag"></i> Order Reference:</label>
                    <span>${order.ref}</span>
                </div>
                <div class="detail-item">
                    <label><i class="fas fa-calendar"></i> Order Date:</label>
                    <span>${new Date(order.date).toLocaleString()}</span>
                </div>
                <div class="detail-item">
                    <label><i class="fas fa-flag"></i> Status:</label>
                    <span class="status status-${order.status}">${order.status}</span>
                </div>
                <div class="detail-item">
                    <label><i class="fas fa-shipping-fast"></i> Delivery Method:</label>
                    <span>${order.delivery ? 'Delivery' : 'Self Pickup'}</span>
                </div>
            </div>
        </div>

        <div class="order-detail-section">
            <h4><i class="fas fa-user"></i> Customer Information</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <label><i class="fas fa-user"></i> Name:</label>
                    <span>${order.customer.name}</span>
                </div>
                <div class="detail-item">
                    <label><i class="fas fa-envelope"></i> Email:</label>
                    <span>${order.customer.email}</span>
                </div>
                <div class="detail-item">
                    <label><i class="fas fa-phone"></i> Phone:</label>
                    <span>${order.customer.phone}</span>
                </div>
                ${order.customer.coordinates ? `
                <div class="detail-item">
                    <label><i class="fas fa-map-marker-alt"></i> Coordinates:</label>
                    <span>${order.customer.coordinates.join(', ')}</span>
                </div>
                ` : ''}
                ${order.deliveryLocation ? `
                <div class="detail-item">
                    <label><i class="fas fa-home"></i> Delivery Address:</label>
                    <span>${order.deliveryLocation.address}</span>
                </div>
                <div class="detail-item">
                    <label><i class="fas fa-map-pin"></i> Delivery Coordinates:</label>
                    <span>${order.deliveryLocation.coordinates.join(', ')}</span>
                </div>
                ${order.deliveryLocation.notes ? `
                <div class="detail-item">
                    <label><i class="fas fa-sticky-note"></i> Delivery Notes:</label>
                    <span>${order.deliveryLocation.notes}</span>
                </div>
                ` : ''}
                ` : ''}
            </div>
        </div>

        <div class="order-detail-section">
            <h4><i class="fas fa-utensils"></i> Order Items</h4>
            <div class="order-items-detailed">
                ${order.items.map(item => `
                    <div class="order-item-detailed">
                        <img src="${getImagePath(item.image)}" alt="${item.name}" class="item-image">
                        <div class="item-details">
                            <h5>${item.name}</h5>
                            <p class="item-description">${item.description || 'No description available'}</p>
                            <p class="item-price">K${item.price} × ${item.quantity} = K${(item.price * item.quantity).toFixed(2)}</p>
                            ${item.toppings && item.toppings.length > 0 ? `
                                <p class="item-toppings"><strong>Extras:</strong> ${item.toppings.join(', ')}</p>
                            ` : ''}
                            ${item.instructions ? `
                                <p class="item-instructions"><strong>Special Instructions:</strong> ${item.instructions}</p>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="order-detail-section">
            <h4><i class="fas fa-money-bill-wave"></i> Payment Information</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <label>Subtotal:</label>
                    <span>K${order.subtotal.toFixed(2)}</span>
                </div>
                ${order.delivery ? `
                <div class="detail-item">
                    <label>Delivery Fee:</label>
                    <span>K${order.deliveryFee.toFixed(2)}</span>
                </div>
                ` : ''}
                <div class="detail-item">
                    <label>Service Fee:</label>
                    <span>K${order.serviceFee.toFixed(2)}</span>
                </div>
                ${order.discount > 0 ? `
                <div class="detail-item discount">
                    <label>Discount (${order.promoCode}):</label>
                    <span>-K${order.discount.toFixed(2)}</span>
                </div>
                ` : ''}
                <div class="detail-item total">
                    <label>Total Amount:</label>
                    <span>K${order.total.toFixed(2)}</span>
                </div>
                <div class="detail-item">
                    <label>Payment Method:</label>
                    <span>${order.paymentMethod || 'Airtel Money'}</span>
                </div>
                ${order.paymentScreenshot ? `
                <div class="detail-item">
                    <label>Payment Proof:</label>
                    <div class="payment-screenshot-container">
                        <img src="${order.paymentScreenshot}" alt="Payment Screenshot" class="payment-screenshot">
                    </div>
                </div>
                ` : ''}
            </div>
        </div>

        ${order.delivery && order.deliveryLocation ? `
        <div class="order-detail-section">
            <h4><i class="fas fa-map-marked-alt"></i> Delivery Location</h4>
            <div class="order-map" id="orderMap-${order.id}"></div>
            <button class="map-directions-btn" onclick="openDirections('${order.id}')">
                <i class="fas fa-directions"></i> Get Directions
            </button>
        </div>
        ` : ''}
    `;

    // Initialize map if delivery order
    if (order.delivery && order.deliveryLocation) {
        setTimeout(() => {
            initializeOrderMap(order);
        }, 100);
    }
    
    showModal(elements.orderDetailsModal);
}

function initializeOrderMap(order) {
    const mapElement = document.getElementById(`orderMap-${order.id}`);
    if (!mapElement) return;
    
    // Clear any existing map
    mapElement.innerHTML = '';
    
    try {
        // Create map
        const map = L.map(mapElement).setView(managerState.restaurantLocation, 13);
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Add markers
        const wizaMarker = L.marker(managerState.restaurantLocation).addTo(map)
            .bindPopup('<b>WIZA FOOD CAFE</b><br>Restaurant Location')
            .openPopup();
        
        const customerMarker = L.marker(order.deliveryLocation.coordinates).addTo(map)
            .bindPopup(`<b>Customer:</b> ${order.customer.name}<br>${order.deliveryLocation.address}`);
        
        // Add line between restaurant and customer
        const line = L.polyline([managerState.restaurantLocation, order.deliveryLocation.coordinates], {
            color: 'red',
            weight: 3,
            opacity: 0.7,
            dashArray: '10, 10'
        }).addTo(map);
        
        // Fit map to show both markers
        const group = new L.featureGroup([wizaMarker, customerMarker]);
        map.fitBounds(group.getBounds().pad(0.1));
        
    } catch (error) {
        console.error('Error initializing map:', error);
        mapElement.innerHTML = '<p class="map-error">Unable to load map. Please check your internet connection.</p>';
    }
}

function openDirections(orderId) {
    const order = managerState.orders.find(o => o.id == orderId);
    if (!order || !order.delivery) return;
    
    const origin = `${managerState.restaurantLocation[0]},${managerState.restaurantLocation[1]}`;
    const destination = `${order.deliveryLocation.coordinates[0]},${order.deliveryLocation.coordinates[1]}`;
    
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    window.open(url, '_blank');
}

function updateOrderStatus(orderId, newStatus) {
    const order = managerState.orders.find(o => o.id == orderId);
    if (order) {
        const oldStatus = order.status;
        order.status = newStatus;
        order.statusUpdated = new Date().toISOString();
        saveManagerData();
        loadOrders();
        updateDashboard();
        
        showNotification(`Order ${order.ref} status updated from ${oldStatus} to ${newStatus}`, 'success');
    }
}

function recreateOrder(orderId) {
    const order = managerState.orders.find(o => o.id == orderId);
    if (order) {
        const newOrder = {
            ...JSON.parse(JSON.stringify(order)), // Deep clone
            id: managerState.orderCounter++,
            ref: `WIZA${managerState.orderCounter.toString().padStart(4, '0')}`,
            status: 'pending',
            date: new Date().toISOString(),
            statusUpdated: null
        };
        
        managerState.orders.unshift(newOrder);
        saveManagerData();
        loadOrders();
        updateDashboard();
        
        showNotification(`Order ${newOrder.ref} recreated successfully!`, 'success');
    }
}

// CUSTOMERS MANAGEMENT
function loadCustomers() {
    if (!elements.customersTableBody) return;

    // Update customers from orders
    updateCustomersFromOrders();

    if (managerState.customers.length === 0) {
        elements.customersTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="no-data">
                    <i class="fas fa-users fa-2x"></i>
                    <h4>No Customers Yet</h4>
                    <p>Customer data will appear here after orders are placed</p>
                </td>
            </tr>
        `;
        return;
    }

    elements.customersTableBody.innerHTML = managerState.customers.map(customer => `
        <tr>
            <td>
                <div class="customer-name">
                    <strong>${customer.name}</strong>
                    ${customer.status === 'banned' ? '<span class="banned-badge">BANNED</span>' : ''}
                </div>
            </td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.totalOrders}</td>
            <td>K${customer.totalSpent.toFixed(2)}</td>
            <td>
                <span class="status status-${customer.status}">${customer.status}</span>
            </td>
            <td>
                <div class="customer-actions">
                    <button class="btn-primary view-customer-btn" data-id="${customer.id}" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-${customer.status === 'banned' ? 'success' : 'danger'}" 
                            onclick="toggleCustomerBan('${customer.id}')"
                            title="${customer.status === 'banned' ? 'Unban Customer' : 'Ban Customer'}">
                        <i class="fas fa-${customer.status === 'banned' ? 'check' : 'ban'}"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function updateCustomersFromOrders() {
    const customersMap = new Map();
    
    managerState.orders.forEach(order => {
        const customerKey = order.customer.email || order.customer.phone;
        
        if (customersMap.has(customerKey)) {
            const existingCustomer = customersMap.get(customerKey);
            existingCustomer.totalOrders += 1;
            existingCustomer.totalSpent += order.total;
            existingCustomer.lastOrder = order.date;
        } else {
            customersMap.set(customerKey, {
                id: generateId(),
                name: order.customer.name,
                email: order.customer.email,
                phone: order.customer.phone,
                totalOrders: 1,
                totalSpent: order.total,
                status: "active",
                joinDate: order.date,
                lastOrder: order.date
            });
        }
    });
    
    managerState.customers = Array.from(customersMap.values());
    saveManagerData();
}

function searchCustomers() {
    if (!elements.customerSearch || !elements.customersTableBody) return;

    const searchTerm = elements.customerSearch.value.toLowerCase();
    const filteredCustomers = managerState.customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm) ||
        customer.phone.includes(searchTerm)
    );
    
    if (filteredCustomers.length === 0) {
        elements.customersTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="no-data">
                    <i class="fas fa-search fa-2x"></i>
                    <h4>No Customers Found</h4>
                    <p>Try adjusting your search terms</p>
                </td>
            </tr>
        `;
        return;
    }
    
    elements.customersTableBody.innerHTML = filteredCustomers.map(customer => `
        <tr>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.totalOrders}</td>
            <td>K${customer.totalSpent.toFixed(2)}</td>
            <td>
                <span class="status status-${customer.status}">${customer.status}</span>
            </td>
            <td>
                <button class="btn-primary view-customer-btn" data-id="${customer.id}">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-${customer.status === 'banned' ? 'success' : 'danger'}" 
                        onclick="toggleCustomerBan('${customer.id}')">
                    <i class="fas fa-${customer.status === 'banned' ? 'check' : 'ban'}"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function viewCustomerDetails(customerId) {
    const customer = managerState.customers.find(c => c.id == customerId);
    if (!customer) return;

    if (!elements.customerDetailsModal || !elements.customerDetailsContent) return;
    
    const customerOrders = managerState.orders.filter(order => 
        order.customer.email === customer.email || order.customer.phone === customer.phone
    );
    const totalOrders = customerOrders.length;
    const totalSpent = customerOrders.reduce((sum, order) => sum + order.total, 0);
    const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
    
    elements.customerDetailsContent.innerHTML = `
        <div class="customer-detail-section">
            <h4><i class="fas fa-user-circle"></i> Personal Information</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <label>Name:</label>
                    <span>${customer.name}</span>
                </div>
                <div class="detail-item">
                    <label>Email:</label>
                    <span>${customer.email}</span>
                </div>
                <div class="detail-item">
                    <label>Phone:</label>
                    <span>${customer.phone}</span>
                </div>
                <div class="detail-item">
                    <label>Status:</label>
                    <span class="status status-${customer.status}">${customer.status}</span>
                </div>
                <div class="detail-item">
                    <label>Member Since:</label>
                    <span>${new Date(customer.joinDate).toLocaleDateString()}</span>
                </div>
                <div class="detail-item">
                    <label>Last Order:</label>
                    <span>${customer.lastOrder ? new Date(customer.lastOrder).toLocaleDateString() : 'No orders yet'}</span>
                </div>
            </div>
        </div>

        <div class="customer-detail-section">
            <h4><i class="fas fa-chart-bar"></i> Order Statistics</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <label>Total Orders:</label>
                    <span>${totalOrders}</span>
                </div>
                <div class="detail-item">
                    <label>Total Spent:</label>
                    <span>K${totalSpent.toFixed(2)}</span>
                </div>
                <div class="detail-item">
                    <label>Average Order Value:</label>
                    <span>K${avgOrderValue.toFixed(2)}</span>
                </div>
                <div class="detail-item">
                    <label>Customer Since:</label>
                    <span>${Math.floor((new Date() - new Date(customer.joinDate)) / (1000 * 60 * 60 * 24))} days</span>
                </div>
            </div>
        </div>

        <div class="customer-detail-section">
            <h4><i class="fas fa-history"></i> Recent Orders (Last 5)</h4>
            <div class="recent-orders">
                ${customerOrders.slice(0, 5).map(order => `
                    <div class="recent-order">
                        <div class="order-ref">${order.ref}</div>
                        <div class="order-amount">K${order.total.toFixed(2)}</div>
                        <div class="order-status status-${order.status}">${order.status}</div>
                        <div class="order-date">${new Date(order.date).toLocaleDateString()}</div>
                    </div>
                `).join('')}
                ${customerOrders.length === 0 ? '<p class="no-orders">No orders found</p>' : ''}
            </div>
        </div>

        <div class="customer-actions-full">
            <button class="btn-${customer.status === 'banned' ? 'success' : 'danger'}" 
                    onclick="toggleCustomerBan('${customer.id}'); closeAllModals()">
                <i class="fas fa-${customer.status === 'banned' ? 'check' : 'ban'}"></i>
                ${customer.status === 'banned' ? 'Unban Customer' : 'Ban Customer'}
            </button>
        </div>
    `;

    showModal(elements.customerDetailsModal);
}

function toggleCustomerBan(customerId) {
    const customer = managerState.customers.find(c => c.id == customerId);
    if (customer) {
        customer.status = customer.status === 'banned' ? 'active' : 'banned';
        saveManagerData();
        loadCustomers();
        
        showNotification(`Customer ${customer.name} ${customer.status === 'banned' ? 'banned' : 'unbanned'} successfully!`, 'success');
    }
}

// MENU MANAGEMENT
function loadFullMenu(category = 'all') {
    if (!elements.menuItemsGrid) return;

    let filteredItems = managerState.menuItems;
    
    if (category !== 'all') {
        filteredItems = managerState.menuItems.filter(item => item.category === category);
    }

    updateMenuStats(filteredItems);

    if (filteredItems.length === 0) {
        elements.menuItemsGrid.innerHTML = `
            <div class="no-menu-items">
                <i class="fas fa-utensils fa-3x"></i>
                <h3>No Menu Items</h3>
                <p>${category === 'all' ? 'No menu items found. Add some items to get started.' : `No ${category} items found.`}</p>
            </div>
        `;
        return;
    }

    elements.menuItemsGrid.innerHTML = filteredItems.map(item => `
        <div class="menu-item-card">
            <img src="${getImagePath(item.image)}" alt="${item.name}" class="menu-item-image" onerror="this.src='https://via.placeholder.com/300x200/FF6B35/white?text=Food+Image'">
            <div class="menu-item-content">
                <div class="menu-item-header">
                    <h3 class="menu-item-name">${item.name}</h3>
                    <div class="menu-item-price">
                        ${item.originalPrice ? 
                            `<span class="original-price">K${item.originalPrice}</span>` : ''}
                        <span class="current-price">K${item.price}</span>
                        ${item.discount ? `<span class="discount-badge">${item.discount}% OFF</span>` : ''}
                    </div>
                </div>
                <p class="menu-item-description">${item.description}</p>
                <div class="menu-item-meta">
                    <span class="item-category">${formatCategoryName(item.category)}</span>
                    <span class="item-availability ${item.available ? 'available' : 'unavailable'}">
                        <i class="fas fa-${item.available ? 'check' : 'times'}"></i>
                        ${item.available ? 'Available' : 'Unavailable'}
                    </span>
                    ${item.popular ? `<span class="item-popular"><i class="fas fa-star"></i> Popular</span>` : ''}
                    ${item.new ? `<span class="item-new"><i class="fas fa-certificate"></i> New</span>` : ''}
                    ${item.vegetarian ? `<span class="item-vegetarian"><i class="fas fa-leaf"></i> Vegetarian</span>` : ''}
                    ${item.promo ? `<span class="item-promo"><i class="fas fa-tag"></i> Promotion</span>` : ''}
                </div>
                <div class="menu-item-actions">
                    <button class="btn-edit edit-menu-btn" data-id="${item.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete delete-menu-btn" data-id="${item.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                    <button class="btn-toggle toggle-availability-btn ${item.available ? 'btn-warning' : 'btn-success'}" 
                            data-id="${item.id}">
                        <i class="fas fa-${item.available ? 'eye-slash' : 'eye'}"></i>
                        ${item.available ? 'Hide' : 'Show'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function updateMenuStats(items) {
    if (elements.totalMenuItems) elements.totalMenuItems.textContent = items.length;
    if (elements.availableItems) elements.availableItems.textContent = items.filter(item => item.available).length;
    if (elements.popularItems) elements.popularItems.textContent = items.filter(item => item.popular).length;
    if (elements.newItems) elements.newItems.textContent = items.filter(item => item.new).length;
}

function formatCategoryName(category) {
    const categoryNames = {
        'quick-fills': 'Quick Fills',
        'savory-bites': 'Savory Bites',
        'snacks-treats': 'Snacks & Treats',
        'beverages': 'Beverages',
        'light-fresh': 'Light & Fresh',
        'promo': 'Promotions'
    };
    return categoryNames[category] || category;
}

function filterMenuByCategory(category) {
    elements.categoryBtns.forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`[data-category="${category}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    loadFullMenu(category);
}

function openMenuItemModal(itemId = null) {
    if (!elements.menuItemModal) return;

    if (itemId) {
        if (elements.menuModalTitle) elements.menuModalTitle.textContent = 'Edit Menu Item';
        const item = managerState.menuItems.find(i => i.id == itemId);
        if (item) {
            populateMenuItemForm(item);
        }
    } else {
        if (elements.menuModalTitle) elements.menuModalTitle.textContent = 'Add Menu Item';
        if (elements.menuItemForm) elements.menuItemForm.reset();
    }
    
    if (elements.menuItemForm) {
        elements.menuItemForm.onsubmit = (e) => handleMenuItemSubmit(e, itemId);
    }
    
    showModal(elements.menuItemModal);
}

function populateMenuItemForm(item) {
    const form = elements.menuItemForm;
    if (!form) return;
    
    form.itemName.value = item.name || '';
    form.itemDescription.value = item.description || '';
    form.itemPrice.value = item.price || '';
    form.itemOriginalPrice.value = item.originalPrice || '';
    form.itemCategory.value = item.category || '';
    form.itemAvailable.checked = item.available !== false;
    form.itemPopular.checked = item.popular || false;
    form.itemVegetarian.checked = item.vegetarian || false;
    form.itemNew.checked = item.new || false;
    form.itemPromo.checked = item.promo || false;
    form.itemDiscount.value = item.discount || '';
    form.itemImage.value = item.image || '';
}

function handleMenuItemSubmit(e, itemId = null) {
    e.preventDefault();
    
    const form = elements.menuItemForm;
    if (!form) return;

    const formData = {
        name: form.itemName.value,
        description: form.itemDescription.value,
        price: parseFloat(form.itemPrice.value) || 0,
        originalPrice: form.itemOriginalPrice.value ? parseFloat(form.itemOriginalPrice.value) : null,
        category: form.itemCategory.value,
        available: form.itemAvailable.checked,
        popular: form.itemPopular.checked,
        vegetarian: form.itemVegetarian.checked,
        new: form.itemNew.checked,
        promo: form.itemPromo.checked,
        discount: form.itemDiscount.value ? parseFloat(form.itemDiscount.value) : null,
        image: form.itemImage.value || 'https://via.placeholder.com/300x200/FF6B35/white?text=Food+Image'
    };

    if (itemId) {
        updateMenuItem(itemId, formData);
    } else {
        addNewMenuItem(formData);
    }
    
    closeAllModals();
}

function addNewMenuItem(itemData) {
    const newItem = {
        id: generateId(),
        ...itemData,
        createdAt: new Date().toISOString()
    };
    
    managerState.menuItems.push(newItem);
    saveManagerData();
    loadFullMenu();
    showNotification('Menu item added successfully!', 'success');
}

function updateMenuItem(itemId, updatedData) {
    const itemIndex = managerState.menuItems.findIndex(item => item.id == itemId);
    if (itemIndex !== -1) {
        managerState.menuItems[itemIndex] = {
            ...managerState.menuItems[itemIndex],
            ...updatedData,
            updatedAt: new Date().toISOString()
        };
        saveManagerData();
        loadFullMenu();
        showNotification('Menu item updated successfully!', 'success');
    }
}

function deleteMenuItem(itemId) {
    if (confirm('Are you sure you want to delete this menu item?')) {
        managerState.menuItems = managerState.menuItems.filter(item => item.id != itemId);
        saveManagerData();
        loadFullMenu();
        showNotification('Menu item deleted successfully!', 'success');
    }
}

function toggleItemAvailability(itemId) {
    const item = managerState.menuItems.find(item => item.id == itemId);
    if (item) {
        item.available = !item.available;
        saveManagerData();
        loadFullMenu();
        showNotification(`Item ${item.available ? 'enabled' : 'disabled'} successfully!`, 'success');
    }
}

// PROMOTIONS MANAGEMENT
function loadPromotions() {
    if (!elements.promotionsGrid) return;

    if (managerState.promotions.length === 0) {
        elements.promotionsGrid.innerHTML = `
            <div class="no-promotions">
                <i class="fas fa-tag fa-3x"></i>
                <h3>No Promotions</h3>
                <p>Create promotions to attract more customers</p>
            </div>
        `;
        return;
    }

    elements.promotionsGrid.innerHTML = managerState.promotions.map(promo => `
        <div class="promotion-card">
            <div class="promotion-header">
                <h3>${promo.title}</h3>
                <div class="promotion-actions">
                    <button class="btn-edit" onclick="editPromotion('${promo.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="deletePromotion('${promo.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="promotion-content">
                <div class="promotion-banner">
                    <img src="${getImagePath(promo.image)}" alt="${promo.title}" onerror="this.src='https://via.placeholder.com/300x150/FF6B35/white?text=Promotion'">
                </div>
                <div class="promotion-details">
                    <p><strong>Description:</strong> ${promo.description}</p>
                    <p><strong>Code:</strong> <code>${promo.code}</code></p>
                    <p><strong>Discount:</strong> ${promo.discount}%</p>
                    <p><strong>Status:</strong> <span class="status ${promo.active ? 'active' : 'inactive'}">${promo.active ? 'Active' : 'Inactive'}</span></p>
                    <p><strong>Period:</strong> ${promo.startDate} to ${promo.endDate}</p>
                </div>
            </div>
            <div class="promotion-actions-full">
                <button class="btn-${promo.active ? 'warning' : 'success'}" 
                        onclick="togglePromotionStatus('${promo.id}')">
                    <i class="fas fa-${promo.active ? 'pause' : 'play'}"></i>
                    ${promo.active ? 'Pause' : 'Activate'}
                </button>
            </div>
        </div>
    `).join('');
}

function togglePromotionForm() {
    const form = document.getElementById('addPromotionForm');
    if (form) {
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    }
}

function editPromotion(promotionId) {
    showNotification('Edit promotion functionality coming soon!', 'info');
}

function deletePromotion(promotionId) {
    if (confirm('Are you sure you want to delete this promotion?')) {
        managerState.promotions = managerState.promotions.filter(p => p.id != promotionId);
        saveManagerData();
        loadPromotions();
        showNotification('Promotion deleted successfully!', 'success');
    }
}

function togglePromotionStatus(promotionId) {
    const promotion = managerState.promotions.find(p => p.id == promotionId);
    if (promotion) {
        promotion.active = !promotion.active;
        saveManagerData();
        loadPromotions();
        showNotification(`Promotion ${promotion.active ? 'activated' : 'paused'} successfully!`, 'success');
    }
}

// ANALYTICS
function initializeCharts() {
    // This would initialize charts using Chart.js or similar library
    // For now, we'll just update the analytics data
    updateAnalytics();
}

function updateAnalytics() {
    const period = elements.analyticsPeriod ? elements.analyticsPeriod.value : '7';
    const stats = calculateAnalyticsStats(period);
    
    if (elements.avgOrderValue) elements.avgOrderValue.textContent = `K${stats.avgOrderValue.toFixed(2)}`;
    if (elements.conversionRate) elements.conversionRate.textContent = `${stats.conversionRate}%`;
    if (elements.retentionRate) elements.retentionRate.textContent = `${stats.retentionRate}%`;
    if (elements.peakHours) elements.peakHours.textContent = stats.peakHours;
}

function calculateAnalyticsStats(period) {
    const days = parseInt(period);
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const periodOrders = managerState.orders.filter(order => 
        new Date(order.date) >= cutoffDate
    );
    
    const totalRevenue = periodOrders.reduce((sum, order) => sum + order.total, 0);
    const avgOrderValue = periodOrders.length > 0 ? totalRevenue / periodOrders.length : 0;
    
    // Simplified calculations for demo
    return {
        avgOrderValue: avgOrderValue,
        conversionRate: 75, // Placeholder
        retentionRate: 60,  // Placeholder
        peakHours: '12:00 PM - 2:00 PM' // Placeholder
    };
}

// SETTINGS
function toggleAppStatus() {
    managerState.settings.appOnline = elements.appStatusToggle.checked;
    saveManagerData();
    
    showNotification(`Customer app ${managerState.settings.appOnline ? 'enabled' : 'disabled'}`, 'success');
}

function toggleOrdering() {
    managerState.settings.acceptOrders = elements.orderingToggle.checked;
    saveManagerData();
    showNotification(`New orders ${managerState.settings.acceptOrders ? 'enabled' : 'disabled'}`, 'success');
}

function toggleDelivery() {
    managerState.settings.deliveryEnabled = elements.deliveryToggle.checked;
    saveManagerData();
    showNotification(`Delivery service ${managerState.settings.deliveryEnabled ? 'enabled' : 'disabled'}`, 'success');
}

function toggleNotifications() {
    managerState.settings.notificationSound = elements.notificationToggle.checked;
    saveManagerData();
    showNotification(`Notifications ${managerState.settings.notificationSound ? 'enabled' : 'disabled'}`, 'success');
}

// UTILITY FUNCTIONS
function generateId() {
    const allIds = [
        ...managerState.menuItems.map(item => item.id),
        ...managerState.orders.map(order => order.id),
        ...managerState.customers.map(customer => customer.id),
        ...managerState.promotions.map(promo => promo.id)
    ];
    return allIds.length > 0 ? Math.max(...allIds) + 1 : 1;
}

function getImagePath(imageName) {
    if (imageName.startsWith('http') || imageName.startsWith('/') || imageName.startsWith('./')) {
        return imageName;
    }
    return imageName;
}

function showModal(modal) {
    if (!modal) return;
    
    modal.classList.add('active');
    if (elements.overlay) {
        elements.overlay.classList.add('active');
    }
    document.body.style.overflow = 'hidden';
}

function hideModal(modal) {
    if (!modal) return;
    
    modal.classList.remove('active');
    if (elements.overlay) {
        elements.overlay.classList.remove('active');
    }
    document.body.style.overflow = 'auto';
}

function closeAllModals() {
    elements.modals.forEach(modal => hideModal(modal));
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear any intervals
        if (autoRefreshInterval) {
            clearInterval(autoRefreshInterval);
        }
        
        // Redirect to login page or main site
        window.location.href = 'https://bufferzone-cloud.github.io/wizafoodcafe/';
    }
}

// SAMPLE DATA (You can remove this in production)
const completeMenuData = [
    {
        id: 1,
        name: "Chicken & Chips (Wing)",
        description: "Crispy chicken wings served with golden fries",
        price: 35,
        originalPrice: 40,
        category: "quick-fills",
        image: "Q1.jpg",
        available: true,
        popular: true,
        vegetarian: false,
        discount: 12
    },
    {
        id: 2,
        name: "Chicken & Chips (Breast)",
        description: "Juicy chicken breast with crispy fries",
        price: 40,
        category: "quick-fills",
        image: "Q2.jpg",
        available: true,
        popular: true,
        vegetarian: false
    },
    {
        id: 3,
        name: "Shawarma",
        description: "Delicious wrap with spiced meat and fresh vegetables",
        price: 33,
        category: "savory-bites",
        image: "S1.jpg",
        available: true,
        popular: true,
        vegetarian: false
    },
    {
        id: 4,
        name: "Mojo Drink",
        description: "Refreshing energy drink",
        price: 8,
        category: "beverages",
        image: "https://via.placeholder.com/300x200/4CAF50/white?text=Mojo+Drink",
        available: true,
        popular: false,
        vegetarian: true
    }
];

// Export functions for global access
window.acceptNewOrder = acceptNewOrder;
window.rejectNewOrder = rejectNewOrder;
window.closeNotification = closeNotification;
window.viewOrderDetails = viewOrderDetails;
window.updateOrderStatus = updateOrderStatus;
window.recreateOrder = recreateOrder;
window.toggleCustomerBan = toggleCustomerBan;
window.viewCustomerDetails = viewCustomerDetails;
window.openMenuItemModal = openMenuItemModal;
window.deleteMenuItem = deleteMenuItem;
window.toggleItemAvailability = toggleItemAvailability;
window.editPromotion = editPromotion;
window.deletePromotion = deletePromotion;
window.togglePromotionStatus = togglePromotionStatus;
window.openDirections = openDirections;

// Initialize the app
console.log('WIZA FOOD CAFE Manager App Initialized');
```

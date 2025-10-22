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
        deliveryEnabled: true
    },
    restaurantLocation: [-15.402235977316481, 28.329942522202668] // Wiza Food Cafe coordinates
};

// DOM Elements
let elements = {};

// Notification variables
let newOrderNotification = null;
let notificationSound = null;
let isNotificationActive = false;

// Save timeout
let saveTimeout = null;
const SAVE_DELAY = 500;

// Auto-refresh interval
let autoRefreshInterval = null;

// Initialize Manager App
document.addEventListener('DOMContentLoaded', () => {
    initializeManagerApp();
});

function initializeManagerApp() {
    initializeElements();
    setupEventListeners();
    loadManagerData();
    updateDashboard();
    loadFullMenu();
    loadOrders();
    loadCustomers();
    loadPromotions();
    initializeCharts();
    
    // Initialize notification sound
    createNotificationSound();
    
    // Start auto-refresh for orders
    startAutoRefresh();
    
    showNotification('Manager dashboard loaded successfully!', 'success');
}

function initializeElements() {
    elements = {
        navItems: document.querySelectorAll('.nav-item'),
        contentSections: document.querySelectorAll('.content-section'),
        logoutBtn: document.getElementById('logoutBtn'),
        totalRevenue: document.getElementById('totalRevenue'),
        totalOrders: document.getElementById('totalOrders'),
        activeCustomers: document.getElementById('activeCustomers'),
        pendingOrders: document.getElementById('pendingOrders'),
        readyOrders: document.getElementById('readyOrders'),
        pendingOrdersCount: document.getElementById('pendingOrdersCount'),
        menuItemsGrid: document.getElementById('menuItemsGrid'),
        addMenuItemBtn: document.getElementById('addMenuItemBtn'),
        categoryBtns: document.querySelectorAll('.category-btn'),
        ordersList: document.getElementById('ordersList'),
        orderStatusFilter: document.getElementById('orderStatusFilter'),
        tabBtns: document.querySelectorAll('.tab-btn'),
        addPromotionBtn: document.getElementById('addPromotionBtn'),
        promotionForm: document.getElementById('promotionForm'),
        customersTableBody: document.getElementById('customersTableBody'),
        customerSearch: document.getElementById('customerSearch'),
        appStatusToggle: document.getElementById('appStatusToggle'),
        orderingToggle: document.getElementById('orderingToggle'),
        deliveryToggle: document.getElementById('deliveryToggle'),
        modals: document.querySelectorAll('.modal'),
        closeModalBtns: document.querySelectorAll('.close-modal'),
        overlay: document.querySelector('.overlay')
    };
}

// NOTIFICATION FUNCTIONS
function createNotificationSound() {
    try {
        notificationSound = new Audio('mixkit-marimba-waiting-ringtone-1360.wav');
        notificationSound.loop = true;
        notificationSound.volume = 1.0;
        notificationSound.preload = 'auto';
    } catch (error) {
        console.error('Error creating notification sound:', error);
    }
}

function showNewOrderNotification(order) {
    isNotificationActive = true;
    
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
                <!-- Customer Information -->
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

                <!-- Order Items with Details -->
                <div class="items-section">
                    <h4 class="section-title">Order Items</h4>
                    <div class="order-items-detailed">
                        ${order.items.map(item => `
                            <div class="order-item-detailed">
                                <img src="${getImagePath(item.image)}" alt="${item.name}" class="item-image" onerror="this.src='https://via.placeholder.com/300x200/FF6B35/white?text=Food+Image'">
                                <div class="item-details">
                                    <div class="item-header">
                                        <h5>${item.name}</h5>
                                        <span class="item-price">K${item.price} × ${item.quantity}</span>
                                    </div>
                                    <p class="item-description">${item.description}</p>
                                    ${item.toppings && item.toppings.length > 0 ? `
                                        <div class="item-extras">
                                            <strong>Extras:</strong> ${item.toppings.join(', ')}
                                        </div>
                                    ` : ''}
                                    ${item.instructions ? `
                                        <div class="item-instructions">
                                            <strong>Instructions:</strong> ${item.instructions}
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Order Summary -->
                <div class="summary-section">
                    <h4 class="section-title">Order Summary</h4>
                    <div class="summary-grid">
                        <div class="summary-item">
                            <span>Subtotal:</span>
                            <span>K${order.subtotal.toFixed(2)}</span>
                        </div>
                        ${order.delivery ? `
                        <div class="summary-item">
                            <span>Delivery Fee:</span>
                            <span>K${order.deliveryFee.toFixed(2)}</span>
                        </div>
                        ` : ''}
                        <div class="summary-item">
                            <span>Service Fee:</span>
                            <span>K${order.serviceFee.toFixed(2)}</span>
                        </div>
                        ${order.discount > 0 ? `
                        <div class="summary-item discount">
                            <span>Discount (${order.promoCode}):</span>
                            <span>-K${order.discount.toFixed(2)}</span>
                        </div>
                        ` : ''}
                        <div class="summary-item total">
                            <span>Total Amount:</span>
                            <span>K${order.total.toFixed(2)}</span>
                        </div>
                        <div class="summary-item">
                            <span>Deposit (50%):</span>
                            <span>K${order.deposit.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <!-- Order Details -->
                <div class="details-section">
                    <h4 class="section-title">Order Details</h4>
                    <div class="details-grid">
                        <div class="detail-item">
                            <i class="fas fa-${order.delivery ? 'truck' : 'store'}"></i>
                            <div>
                                <strong>Type:</strong>
                                <span>${order.delivery ? 'Delivery' : 'Pickup'}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-clock"></i>
                            <div>
                                <strong>Status:</strong>
                                <span class="status-pending">Pending</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-hashtag"></i>
                            <div>
                                <strong>Order Ref:</strong>
                                <span>${order.ref}</span>
                            </div>
                        </div>
                        ${order.promoCode ? `
                        <div class="detail-item">
                            <i class="fas fa-tag"></i>
                            <div>
                                <strong>Promo Used:</strong>
                                <span>${order.promoCode}</span>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>

                <!-- Actions -->
                <div class="actions-section">
                    <button class="btn-accept" onclick="acceptNewOrder(${order.id})">
                        <i class="fas fa-check-circle"></i> Accept Order
                    </button>
                    <button class="btn-reject" onclick="rejectNewOrder(${order.id})">
                        <i class="fas fa-times-circle"></i> Reject Order
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(newOrderNotification);
    playNotificationSound();
    
    if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200, 100, 200]);
    }
}

function playNotificationSound() {
    if (notificationSound) {
        notificationSound.currentTime = 0;
        notificationSound.play().catch(error => {
            console.log('Autoplay blocked:', error);
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
    
    if (navigator.vibrate) {
        navigator.vibrate(0);
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

// Auto-refresh functionality
function startAutoRefresh() {
    // Clear existing interval
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
    
    // Set new interval to refresh every 5 seconds
    autoRefreshInterval = setInterval(() => {
        if (managerState.currentSection === 'orders') {
            loadOrders();
        }
        updateDashboard();
        updatePendingOrdersCount();
    }, 5000);
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
    
    if (elements.promotionForm) {
        elements.promotionForm.addEventListener('submit', handlePromotionSubmit);
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

    // Add event listener for cancel promotion button
    const cancelPromotionBtn = document.getElementById('cancelPromotionBtn');
    if (cancelPromotionBtn) {
        cancelPromotionBtn.addEventListener('click', () => {
            const form = document.getElementById('addPromotionForm');
            if (form) form.style.display = 'none';
        });
    }

    // Add event listeners for danger zone buttons
    const clearAllDataBtn = document.getElementById('clearAllData');
    const resetSystemBtn = document.getElementById('resetSystem');
    const exportAllDataBtn = document.getElementById('exportAllData');

    if (clearAllDataBtn) {
        clearAllDataBtn.addEventListener('click', () => confirmAction('clearAllData', 'Are you sure you want to clear all data? This cannot be undone!'));
    }
    if (resetSystemBtn) {
        resetSystemBtn.addEventListener('click', () => confirmAction('resetSystem', 'Are you sure you want to reset the system? All data will be lost!'));
    }
    if (exportAllDataBtn) {
        exportAllDataBtn.addEventListener('click', exportAllData);
    }
}

// DATA MANAGEMENT
function loadManagerData() {
    const savedData = localStorage.getItem('wizaManagerData');
    
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            managerState.menuItems = data.menuItems || completeMenuData;
            managerState.orders = data.orders || [];
            managerState.customers = data.customers || [];
            managerState.promotions = data.promotions || [];
            managerState.settings = data.settings || managerState.settings;
        } catch (e) {
            console.error('Error parsing saved data:', e);
            initializeDefaultData();
            showNotification('Data corrupted. Reset to default menu.', 'error');
        }
    } else {
        initializeDefaultData();
    }
}

function initializeDefaultData() {
    managerState.menuItems = [...completeMenuData];
    managerState.orders = [];
    managerState.customers = [];
    managerState.promotions = [];

    saveManagerData();
}

function saveManagerData() {
    if (saveTimeout) {
        clearTimeout(saveTimeout);
    }
    
    saveTimeout = setTimeout(() => {
        try {
            localStorage.setItem('wizaManagerData', JSON.stringify(managerState));
        } catch (error) {
            console.error('Error saving data:', error);
            showNotification('Error saving data. Storage might be full.', 'error');
        }
    }, SAVE_DELAY);
}

// Fetch orders from the provided URL
async function fetchOrdersFromAPI() {
    try {
        const response = await fetch('https://bufferzone-cloud.github.io/wizafoodcafe/wiza.html');
        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }
        
        const htmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        
        // Extract orders from the HTML
        const orders = extractOrdersFromHTML(doc);
        return orders;
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}

// Extract orders from HTML
function extractOrdersFromHTML(doc) {
    const orders = [];
    
    // Look for order elements in the HTML
    // This is a simplified implementation - you'll need to adjust selectors based on actual HTML structure
    const orderElements = doc.querySelectorAll('.order, [class*="order"], .cart-item, [class*="cart"]');
    
    if (orderElements.length === 0) {
        // If no specific order elements found, create sample orders from the page content
        return createSampleOrdersFromPage(doc);
    }
    
    orderElements.forEach((orderElement, index) => {
        const order = createOrderFromElement(orderElement, index);
        if (order) {
            orders.push(order);
        }
    });
    
    return orders;
}

// Create sample orders when no specific order structure is found
function createSampleOrdersFromPage(doc) {
    const orders = [];
    const menuItems = doc.querySelectorAll('.menu-item, .food-item, [class*="item"]');
    
    // Create 3 sample orders
    for (let i = 0; i < 3; i++) {
        const order = {
            id: generateId(),
            ref: `WIZA${(orders.length + 1).toString().padStart(4, '0')}`,
            customer: {
                name: `Customer ${i + 1}`,
                email: `customer${i + 1}@email.com`,
                phone: `0977${Math.floor(100000 + Math.random() * 900000)}`,
                coordinates: getRandomCoordinates()
            },
            items: [],
            subtotal: 0,
            deliveryFee: 25,
            serviceFee: 2,
            discount: 0,
            total: 0,
            deposit: 0,
            status: "pending",
            delivery: Math.random() > 0.5,
            deliveryLocation: {
                address: `Address ${i + 1}, Lusaka`,
                coordinates: getRandomCoordinates()
            },
            promoCode: "",
            date: new Date().toISOString(),
            paymentScreenshot: "payment-default.jpg"
        };
        
        // Add 1-3 random items
        const itemCount = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < itemCount; j++) {
            const item = createSampleItem(j);
            order.items.push(item);
            order.subtotal += item.price * item.quantity;
        }
        
        // Calculate final totals
        order.total = order.subtotal - order.discount + order.deliveryFee + order.serviceFee;
        order.deposit = order.total * 0.5;
        
        orders.push(order);
    }
    
    return orders;
}

// Create order from HTML element
function createOrderFromElement(element, index) {
    try {
        const order = {
            id: generateId(),
            ref: `WIZA${(index + 1).toString().padStart(4, '0')}`,
            customer: {
                name: extractText(element, '.customer-name, .name, [class*="name"]') || 'Customer ' + (index + 1),
                email: extractText(element, '.customer-email, .email, [class*="email"]') || `customer${index + 1}@email.com`,
                phone: extractText(element, '.customer-phone, .phone, [class*="phone"]') || `0977${Math.floor(100000 + Math.random() * 900000)}`,
                coordinates: getRandomCoordinates()
            },
            items: extractOrderItems(element),
            subtotal: extractPrice(element, '.subtotal, .total, [class*="total"]'),
            deliveryFee: 25,
            serviceFee: 2,
            discount: extractPrice(element, '.discount, [class*="discount"]'),
            total: 0,
            deposit: 0,
            status: "pending",
            delivery: Math.random() > 0.5,
            deliveryLocation: {
                address: extractText(element, '.address, [class*="address"]') || 'Unknown Address, Lusaka',
                coordinates: getRandomCoordinates()
            },
            promoCode: extractText(element, '.promo-code, .voucher, [class*="promo"]') || '',
            date: new Date().toISOString(),
            paymentScreenshot: "payment-default.jpg"
        };
        
        // Calculate final totals
        order.total = order.subtotal - order.discount + order.deliveryFee + order.serviceFee;
        order.deposit = order.total * 0.5;
        
        return order;
    } catch (error) {
        console.error('Error creating order from element:', error);
        return null;
    }
}

// Extract order items from element
function extractOrderItems(element) {
    const items = [];
    const itemElements = element.querySelectorAll('.order-item, .cart-item, .item, [class*="item"]');
    
    itemElements.forEach((itemElement, index) => {
        const item = {
            id: generateId(),
            name: extractText(itemElement, '.item-name, .name, [class*="name"]') || 'Item ' + (index + 1),
            description: extractText(itemElement, '.item-description, .description, [class*="desc"]') || 'No description available',
            price: extractPrice(itemElement, '.item-price, .price, [class*="price"]') || 10 + Math.random() * 40,
            quantity: parseInt(extractText(itemElement, '.quantity, [class*="quantity"]') || '1'),
            image: extractAttribute(itemElement, '.item-image, img', 'src') || 'https://via.placeholder.com/300x200/FF6B35/white?text=Food+Image',
            toppings: extractToppings(itemElement),
            instructions: extractText(itemElement, '.instructions, [class*="instruction"]') || ''
        };
        
        items.push(item);
    });
    
    // If no items found, create sample items
    if (items.length === 0) {
        items.push(createSampleItem(0));
    }
    
    return items;
}

// Create sample menu item
function createSampleItem(index) {
    const sampleItems = [
        { name: "Chicken & Chips", description: "Crispy chicken with golden fries", price: 35 },
        { name: "Shawarma", description: "Delicious wrap with spiced meat", price: 33 },
        { name: "Pizza", description: "Cheesy pizza with your favorite toppings", price: 70 },
        { name: "Burger", description: "Juicy beef burger with fresh veggies", price: 45 },
        { name: "Mojo Drink", description: "Refreshing energy drink", price: 8 }
    ];
    
    const item = sampleItems[index % sampleItems.length];
    return {
        id: generateId(),
        name: item.name,
        description: item.description,
        price: item.price,
        quantity: Math.floor(Math.random() * 3) + 1,
        image: 'https://via.placeholder.com/300x200/FF6B35/white?text=Food+Image',
        toppings: ['Extra Sauce', 'Spicy'],
        instructions: 'Make it extra crispy'
    };
}

// Helper functions for HTML extraction
function extractText(element, selector) {
    const found = element.querySelector(selector);
    return found ? found.textContent.trim() : null;
}

function extractPrice(element, selector) {
    const text = extractText(element, selector);
    if (!text) return 0;
    
    // Extract number from price text (e.g., "K35.00" -> 35.00)
    const match = text.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
}

function extractAttribute(element, selector, attribute) {
    const found = element.querySelector(selector);
    return found ? found.getAttribute(attribute) : null;
}

function extractToppings(element) {
    const toppings = [];
    const toppingElements = element.querySelectorAll('.topping, .extra, [class*="topping"]');
    
    toppingElements.forEach(toppingElement => {
        toppings.push(toppingElement.textContent.trim());
    });
    
    return toppings.length > 0 ? toppings : ['Extra Sauce', 'Spicy'];
}

// Helper function to generate random coordinates near the restaurant
function getRandomCoordinates() {
    const lat = managerState.restaurantLocation[0] + (Math.random() * 0.02 - 0.01);
    const lng = managerState.restaurantLocation[1] + (Math.random() * 0.02 - 0.01);
    return [lat, lng];
}

// Load orders from API
async function loadOrders() {
    if (!elements.ordersList) return;

    // Fetch orders from API
    const apiOrders = await fetchOrdersFromAPI();
    
    // Merge with existing orders
    if (apiOrders.length > 0) {
        let newOrdersCount = 0;
        
        apiOrders.forEach(apiOrder => {
            const existingOrder = managerState.orders.find(order => 
                order.ref === apiOrder.ref || 
                (order.customer.name === apiOrder.customer.name && 
                 Math.abs(new Date(order.date) - new Date(apiOrder.date)) < 60000) // Within 1 minute
            );
            
            if (!existingOrder) {
                managerState.orders.unshift(apiOrder);
                newOrdersCount++;
                
                // Show notification for new orders
                if (managerState.settings.appOnline && managerState.settings.acceptOrders) {
                    setTimeout(() => {
                        showNewOrderNotification(apiOrder);
                    }, 1000);
                }
            }
        });
        
        if (newOrdersCount > 0) {
            saveManagerData();
            showNotification(`${newOrdersCount} new order(s) loaded`, 'success');
        }
    }

    const statusFilter = elements.orderStatusFilter ? elements.orderStatusFilter.value : 'all';
    let filteredOrders = managerState.orders;

    if (statusFilter !== 'all') {
        filteredOrders = managerState.orders.filter(order => order.status === statusFilter);
    }

    filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

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
                    Deposit: K${order.deposit.toFixed(2)}
                </div>
                ${order.promoCode ? `
                <div class="detail-quick">
                    <i class="fas fa-tag"></i>
                    Promo: ${order.promoCode}
                </div>
                ` : ''}
            </div>

            <div class="order-actions">
                <button class="btn-primary" onclick="viewOrderDetails(${order.id})">
                    <i class="fas fa-eye"></i> View Details
                </button>
                
                ${order.status === 'pending' ? `
                    <button class="btn-success" onclick="updateOrderStatus(${order.id}, 'preparing')">
                        <i class="fas fa-check"></i> Accept
                    </button>
                    <button class="btn-danger" onclick="updateOrderStatus(${order.id}, 'cancelled')">
                        <i class="fas fa-times"></i> Reject
                    </button>
                ` : ''}
                
                ${order.status === 'preparing' ? `
                    <button class="btn-warning" onclick="updateOrderStatus(${order.id}, 'ready')">
                        <i class="fas fa-check-double"></i> Mark Ready
                    </button>
                ` : ''}
                
                ${order.status === 'ready' && order.delivery ? `
                    <button class="btn-info" onclick="updateOrderStatus(${order.id}, 'out-for-delivery')">
                        <i class="fas fa-truck"></i> Out for Delivery
                    </button>
                ` : ''}
                
                ${order.status === 'ready' && !order.delivery ? `
                    <button class="btn-success" onclick="updateOrderStatus(${order.id}, 'completed')">
                        <i class="fas fa-check-circle"></i> Complete
                    </button>
                ` : ''}
                
                ${order.status === 'out-for-delivery' ? `
                    <button class="btn-success" onclick="updateOrderStatus(${order.id}, 'completed')">
                        <i class="fas fa-check-circle"></i> Delivered
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
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
                <button class="btn-primary" onclick="viewOrderDetails(${order.id})">
                    <i class="fas fa-eye"></i> View Details
                </button>
                ${order.status === 'completed' ? `
                    <button class="btn-success" onclick="recreateOrder(${order.id})">
                        <i class="fas fa-redo"></i> Recreate
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// View order details with map
function viewOrderDetails(orderId) {
    const order = managerState.orders.find(o => o.id === orderId);
    if (!order) return;

    const modal = document.getElementById('orderDetailsModal');
    if (!modal) return;

    const content = modal.querySelector('.order-details-content');
    if (!content) return;
    
    // Create map HTML
    const mapHtml = order.delivery ? `
        <div class="order-detail-section">
            <h4><i class="fas fa-map-marked-alt"></i> Delivery Location</h4>
            <div class="order-map" id="orderMap-${order.id}"></div>
            <button class="map-directions-btn" onclick="openDirections(${order.id})">
                <i class="fas fa-directions"></i> Get Directions
            </button>
        </div>
    ` : '';
    
    content.innerHTML = `
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
                <div class="detail-item">
                    <label><i class="fas fa-map-marker-alt"></i> Coordinates:</label>
                    <span>${order.customer.coordinates.join(', ')}</span>
                </div>
                ${order.deliveryLocation ? `
                <div class="detail-item">
                    <label><i class="fas fa-home"></i> Delivery Address:</label>
                    <span>${order.deliveryLocation.address}</span>
                </div>
                <div class="detail-item">
                    <label><i class="fas fa-map-pin"></i> Delivery Coordinates:</label>
                    <span>${order.deliveryLocation.coordinates.join(', ')}</span>
                </div>
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
                            <p class="item-description">${item.description}</p>
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
                    <label>Deposit Paid (50%):</label>
                    <span>K${order.deposit.toFixed(2)}</span>
                </div>
                <div class="detail-item">
                    <label>Balance Due:</label>
                    <span>K${(order.total - order.deposit).toFixed(2)}</span>
                </div>
            </div>
        </div>

        ${mapHtml}

        ${order.paymentScreenshot ? `
        <div class="order-detail-section">
            <h4><i class="fas fa-receipt"></i> Payment Proof</h4>
            <img src="${getImagePath(order.paymentScreenshot)}" alt="Payment Screenshot" class="payment-screenshot" onerror="this.style.display='none'">
        </div>
        ` : ''}
    `;

    // Initialize map if delivery order
    if (order.delivery) {
        setTimeout(() => {
            initializeOrderMap(order);
        }, 100);
    }
    
    showModal(modal);
}

// Initialize Leaflet map for order
function initializeOrderMap(order) {
    const mapElement = document.getElementById(`orderMap-${order.id}`);
    if (!mapElement) return;
    
    // Clear any existing map
    mapElement.innerHTML = '';
    
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
}

// Open directions in Google Maps
function openDirections(orderId) {
    const order = managerState.orders.find(o => o.id === orderId);
    if (!order || !order.delivery) return;
    
    const origin = `${managerState.restaurantLocation[0]},${managerState.restaurantLocation[1]}`;
    const destination = `${order.deliveryLocation.coordinates[0]},${order.deliveryLocation.coordinates[1]}`;
    
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    window.open(url, '_blank');
}

function updateOrderStatus(orderId, newStatus) {
    const order = managerState.orders.find(o => o.id === orderId);
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
    const order = managerState.orders.find(o => o.id === orderId);
    if (order) {
        const newOrder = {
            ...order,
            id: generateId(),
            ref: `WIZA${(managerState.orders.length + 1).toString().padStart(4, '0')}`,
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

// Update customer management to use API data
async function loadCustomers() {
    if (!elements.customersTableBody) return;

    // Update customers based on orders
    if (managerState.orders.length > 0) {
        managerState.orders.forEach(order => {
            const existingCustomer = managerState.customers.find(c => 
                c.email === order.customer.email || 
                c.phone === order.customer.phone
            );
            
            if (existingCustomer) {
                // Update existing customer
                existingCustomer.totalOrders += 1;
                existingCustomer.totalSpent += order.total;
                existingCustomer.lastOrder = order.date;
            } else {
                // Add new customer
                const newCustomer = {
                    id: generateId(),
                    name: order.customer.name,
                    email: order.customer.email,
                    phone: order.customer.phone,
                    totalOrders: 1,
                    totalSpent: order.total,
                    status: "active",
                    joinDate: order.date,
                    lastOrder: order.date
                };
                
                managerState.customers.push(newCustomer);
            }
        });
        
        saveManagerData();
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
                    <button class="btn-primary" onclick="viewCustomerDetails(${customer.id})" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-${customer.status === 'banned' ? 'success' : 'danger'}" 
                            onclick="toggleCustomerBan(${customer.id})"
                            title="${customer.status === 'banned' ? 'Unban Customer' : 'Ban Customer'}">
                        <i class="fas fa-${customer.status === 'banned' ? 'check' : 'ban'}"></i>
                    </button>
                    <button class="btn-warning" onclick="deleteCustomer(${customer.id})" title="Delete Customer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function searchCustomers() {
    if (!elements.customerSearch || !elements.customersTableBody) return;

    const searchTerm = elements.customerSearch.value.toLowerCase();
    const filteredCustomers = managerState.customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm) ||
        customer.phone.includes(searchTerm)
    );
    
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
                <button class="btn-primary" onclick="viewCustomerDetails(${customer.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-${customer.status === 'banned' ? 'success' : 'danger'}" 
                        onclick="toggleCustomerBan(${customer.id})">
                    <i class="fas fa-${customer.status === 'banned' ? 'check' : 'ban'}"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function viewCustomerDetails(customerId) {
    const customer = managerState.customers.find(c => c.id === customerId);
    if (!customer) return;

    const modal = document.getElementById('customerDetailsModal');
    if (!modal) return;

    const content = modal.querySelector('.customer-details-content');
    if (!content) return;
    
    const customerOrders = managerState.orders.filter(order => order.customer.email === customer.email);
    const totalOrders = customerOrders.length;
    const totalSpent = customerOrders.reduce((sum, order) => sum + order.total, 0);
    const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
    
    content.innerHTML = `
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
                    onclick="toggleCustomerBan(${customer.id}); closeAllModals()">
                <i class="fas fa-${customer.status === 'banned' ? 'check' : 'ban'}"></i>
                ${customer.status === 'banned' ? 'Unban Customer' : 'Ban Customer'}
            </button>
            <button class="btn-warning" onclick="deleteCustomer(${customer.id}); closeAllModals()">
                <i class="fas fa-trash"></i> Delete Customer
            </button>
        </div>
    `;

    showModal(modal);
}

function toggleCustomerBan(customerId) {
    const customer = managerState.customers.find(c => c.id === customerId);
    if (customer) {
        customer.status = customer.status === 'banned' ? 'active' : 'banned';
        saveManagerData();
        loadCustomers();
        
        showNotification(`Customer ${customer.name} ${customer.status === 'banned' ? 'banned' : 'unbanned'} successfully!`, 'success');
    }
}

function deleteCustomer(customerId) {
    if (confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
        managerState.customers = managerState.customers.filter(c => c.id !== customerId);
        saveManagerData();
        loadCustomers();
        showNotification('Customer deleted successfully!', 'success');
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
    }
}

// DASHBOARD FUNCTIONS
function updateDashboard() {
    const stats = calculateDashboardStats();
    
    if (elements.totalRevenue) elements.totalRevenue.textContent = `K${stats.totalRevenue.toFixed(2)}`;
    if (elements.totalOrders) elements.totalOrders.textContent = stats.totalOrders;
    if (elements.activeCustomers) elements.activeCustomers.textContent = stats.activeCustomers;
    if (elements.pendingOrders) elements.pendingOrders.textContent = stats.pendingOrders;
    if (elements.readyOrders) elements.readyOrders.textContent = stats.readyOrders;
    if (elements.pendingOrdersCount) elements.pendingOrdersCount.textContent = stats.pendingOrders;

    updateRecentActivity();
    updateOrderStatusCounts();
    updateRevenueAnalytics();
}

function calculateDashboardStats() {
    const today = new Date().toDateString();
    
    const todayOrders = managerState.orders.filter(order => 
        new Date(order.date).toDateString() === today
    );
    
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const yesterdayOrders = managerState.orders.filter(order => 
        new Date(order.date).toDateString() === yesterday
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
    
    const statusCountsElement = document.getElementById('orderStatusCounts');
    if (statusCountsElement) {
        statusCountsElement.innerHTML = `
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
    
    const revenueBreakdown = document.getElementById('revenueBreakdown');
    if (revenueBreakdown) {
        revenueBreakdown.innerHTML = `
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
    const activityList = document.getElementById('recentActivity');
    if (!activityList) return;

    const recentOrders = managerState.orders
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10);

    activityList.innerHTML = recentOrders.map(order => `
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
    const pendingOrdersCount = document.getElementById('pendingOrdersCount');
    if (pendingOrdersCount) {
        pendingOrdersCount.textContent = pendingCount;
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
                    <button class="btn-edit" onclick="editMenuItem(${item.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="deleteMenuItem(${item.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                    <button class="btn-toggle ${item.available ? 'btn-warning' : 'btn-success'}" 
                            onclick="toggleItemAvailability(${item.id})">
                        <i class="fas fa-${item.available ? 'eye-slash' : 'eye'}"></i>
                        ${item.available ? 'Hide' : 'Show'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function getImagePath(imageName) {
    if (imageName.startsWith('http') || imageName.startsWith('/') || imageName.startsWith('./')) {
        return imageName;
    }
    return imageName;
}

function updateMenuStats(items) {
    const totalItems = document.getElementById('totalMenuItems');
    const availableItems = document.getElementById('availableItems');
    const popularItems = document.getElementById('popularItems');
    const newItems = document.getElementById('newItems');

    if (totalItems) totalItems.textContent = items.length;
    if (availableItems) availableItems.textContent = items.filter(item => item.available).length;
    if (popularItems) popularItems.textContent = items.filter(item => item.popular).length;
    if (newItems) newItems.textContent = items.filter(item => item.new).length;
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
    const modal = document.getElementById('menuItemModal');
    if (!modal) return;

    const title = document.getElementById('menuModalTitle');
    const form = document.getElementById('menuItemForm');
    
    if (itemId) {
        if (title) title.textContent = 'Edit Menu Item';
        const item = managerState.menuItems.find(i => i.id === itemId);
        if (item) {
            populateMenuItemForm(item);
        }
    } else {
        if (title) title.textContent = 'Add Menu Item';
        if (form) form.reset();
    }
    
    if (form) {
        form.onsubmit = (e) => handleMenuItemSubmit(e, itemId);
    }
    
    showModal(modal);
}

function populateMenuItemForm(item) {
    const nameInput = document.getElementById('itemName');
    const descInput = document.getElementById('itemDescription');
    const priceInput = document.getElementById('itemPrice');
    const origPriceInput = document.getElementById('itemOriginalPrice');
    const categoryInput = document.getElementById('itemCategory');
    const availableInput = document.getElementById('itemAvailable');
    const popularInput = document.getElementById('itemPopular');
    const vegetarianInput = document.getElementById('itemVegetarian');
    const newInput = document.getElementById('itemNew');
    const promoInput = document.getElementById('itemPromo');
    const discountInput = document.getElementById('itemDiscount');

    if (nameInput) nameInput.value = item.name;
    if (descInput) descInput.value = item.description;
    if (priceInput) priceInput.value = item.price;
    if (origPriceInput) origPriceInput.value = item.originalPrice || '';
    if (categoryInput) categoryInput.value = item.category;
    if (availableInput) availableInput.checked = item.available;
    if (popularInput) popularInput.checked = item.popular;
    if (vegetarianInput) vegetarianInput.checked = item.vegetarian;
    if (newInput) newInput.checked = item.new || false;
    if (promoInput) promoInput.checked = item.promo || false;
    if (discountInput) discountInput.value = item.discount || '';
}

function handleMenuItemSubmit(e, itemId = null) {
    e.preventDefault();
    
    const nameInput = document.getElementById('itemName');
    const descInput = document.getElementById('itemDescription');
    const priceInput = document.getElementById('itemPrice');
    const origPriceInput = document.getElementById('itemOriginalPrice');
    const categoryInput = document.getElementById('itemCategory');
    const availableInput = document.getElementById('itemAvailable');
    const popularInput = document.getElementById('itemPopular');
    const vegetarianInput = document.getElementById('itemVegetarian');
    const newInput = document.getElementById('itemNew');
    const promoInput = document.getElementById('itemPromo');
    const discountInput = document.getElementById('itemDiscount');

    const formData = {
        name: nameInput ? nameInput.value : '',
        description: descInput ? descInput.value : '',
        price: priceInput ? parseFloat(priceInput.value) : 0,
        originalPrice: origPriceInput && origPriceInput.value ? 
                      parseFloat(origPriceInput.value) : null,
        category: categoryInput ? categoryInput.value : '',
        available: availableInput ? availableInput.checked : true,
        popular: popularInput ? popularInput.checked : false,
        vegetarian: vegetarianInput ? vegetarianInput.checked : false,
        new: newInput ? newInput.checked : false,
        promo: promoInput ? promoInput.checked : false,
        discount: discountInput && discountInput.value ? 
                 parseFloat(discountInput.value) : null,
        image: 'https://via.placeholder.com/300x200/FF6B35/white?text=Food+Image'
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
    const itemIndex = managerState.menuItems.findIndex(item => item.id === itemId);
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
        managerState.menuItems = managerState.menuItems.filter(item => item.id !== itemId);
        saveManagerData();
        loadFullMenu();
        showNotification('Menu item deleted successfully!', 'success');
    }
}

function toggleItemAvailability(itemId) {
    const item = managerState.menuItems.find(item => item.id === itemId);
    if (item) {
        item.available = !item.available;
        saveManagerData();
        loadFullMenu();
        showNotification(`Item ${item.available ? 'enabled' : 'disabled'} successfully!`, 'success');
    }
}

// PROMOTIONS MANAGEMENT
function loadPromotions() {
    const promotionsGrid = document.getElementById('promotionsGrid');
    if (!promotionsGrid) return;

    promotionsGrid.innerHTML = managerState.promotions.map(promo => `
        <div class="promotion-card">
            <div class="promotion-header">
                <h3>${promo.title}</h3>
                <div class="promotion-actions">
                    <button class="btn-edit" onclick="editPromotion(${promo.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="deletePromotion(${promo.id})">
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
                        onclick="togglePromotionStatus(${promo.id})">
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

function handlePromotionSubmit(e) {
    e.preventDefault();
    
    const titleInput = document.getElementById('promotionTitle');
    const descInput = document.getElementById('promotionDescription');
    const typeInput = document.getElementById('promotionType');
    const codeInput = document.getElementById('promotionCode');
    const discountInput = document.getElementById('promotionDiscount');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const activeInput = document.getElementById('promotionActive');

    const formData = {
        title: titleInput ? titleInput.value : '',
        description: descInput ? descInput.value : '',
        type: typeInput ? typeInput.value : '',
        code: codeInput ? codeInput.value : '',
        discount: discountInput ? parseInt(discountInput.value) : 0,
        startDate: startDateInput ? startDateInput.value : '',
        endDate: endDateInput ? endDateInput.value : '',
        active: activeInput ? activeInput.checked : true,
        image: 'https://via.placeholder.com/300x150/FF6B35/white?text=Promotion'
    };

    addNewPromotion(formData);
    togglePromotionForm();
}

function addNewPromotion(promotionData) {
    const newPromotion = {
        id: generateId(),
        ...promotionData,
        createdAt: new Date().toISOString()
    };
    
    managerState.promotions.push(newPromotion);
    saveManagerData();
    loadPromotions();
    showNotification('Promotion created successfully!', 'success');
}

function editPromotion(promotionId) {
    showNotification('Edit promotion functionality coming soon!', 'info');
}

function deletePromotion(promotionId) {
    if (confirm('Are you sure you want to delete this promotion?')) {
        managerState.promotions = managerState.promotions.filter(p => p.id !== promotionId);
        saveManagerData();
        loadPromotions();
        showNotification('Promotion deleted successfully!', 'success');
    }
}

function togglePromotionStatus(promotionId) {
    const promotion = managerState.promotions.find(p => p.id === promotionId);
    if (promotion) {
        promotion.active = !promotion.active;
        saveManagerData();
        loadPromotions();
        showNotification(`Promotion ${promotion.active ? 'activated' : 'paused'} successfully!`, 'success');
    }
}

// SETTINGS MANAGEMENT
function toggleAppStatus() {
    if (elements.appStatusToggle) {
        managerState.settings.appOnline = elements.appStatusToggle.checked;
        saveManagerData();
        
        const statusText = document.getElementById('appStatus');
        if (statusText) {
            statusText.textContent = managerState.settings.appOnline ? 'Online' : 'Offline';
            statusText.className = `app-status ${managerState.settings.appOnline ? 'online' : 'offline'}`;
        }
        
        showNotification(`Customer app ${managerState.settings.appOnline ? 'enabled' : 'disabled'}`, 'success');
        
        if (!managerState.settings.appOnline) {
            managerState.settings.acceptOrders = false;
            if (elements.orderingToggle) {
                elements.orderingToggle.checked = false;
            }
            closeNotification();
            saveManagerData();
        }
    }
}

function toggleOrdering() {
    if (elements.orderingToggle) {
        managerState.settings.acceptOrders = elements.orderingToggle.checked;
        saveManagerData();
        showNotification(`New orders ${managerState.settings.acceptOrders ? 'enabled' : 'disabled'}`, 'success');
    }
}

function toggleDelivery() {
    if (elements.deliveryToggle) {
        managerState.settings.deliveryEnabled = elements.deliveryToggle.checked;
        saveManagerData();
        showNotification(`Delivery service ${managerState.settings.deliveryEnabled ? 'enabled' : 'disabled'}`, 'success');
    }
}

// DANGER ZONE FUNCTIONS
function confirmAction(action, message) {
    if (confirm(message)) {
        switch(action) {
            case 'clearAllData':
                clearAllData();
                break;
            case 'resetSystem':
                resetSystem();
                break;
        }
    }
}

function clearAllData() {
    if (confirm('WARNING: This will delete ALL data including orders, customers, and promotions. This cannot be undone!')) {
        managerState.orders = [];
        managerState.customers = [];
        managerState.promotions = [];
        saveManagerData();
        loadOrders();
        loadCustomers();
        loadPromotions();
        showNotification('All data cleared successfully!', 'success');
    }
}

function resetSystem() {
    if (confirm('WARNING: This will reset the entire system to factory defaults. ALL data will be lost!')) {
        localStorage.removeItem('wizaManagerData');
        location.reload();
    }
}

function exportAllData() {
    const dataStr = JSON.stringify(managerState, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wiza-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification('All data exported successfully!', 'success');
}

// ANALYTICS FUNCTIONS
function initializeCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        try {
            new Chart(revenueCtx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Revenue',
                        data: [1200, 1900, 1500, 2000, 1800, 2500, 2200],
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return 'K' + value;
                                }
                            }
                        }
                    }
                }
            });
        } catch (e) {
            console.error('Error initializing revenue chart:', e);
        }
    }

    // Orders Chart
    const ordersCtx = document.getElementById('ordersChart');
    if (ordersCtx) {
        try {
            new Chart(ordersCtx.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['Completed', 'Pending', 'Preparing', 'Ready', 'Cancelled'],
                    datasets: [{
                        data: [45, 12, 8, 5, 3],
                        backgroundColor: ['#27ae60', '#f39c12', '#3498db', '#9b59b6', '#e74c3c']
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        } catch (e) {
            console.error('Error initializing orders chart:', e);
        }
    }
}

function updateAnalytics() {
    const periodSelect = document.getElementById('analyticsPeriod');
    const period = periodSelect ? periodSelect.value : '7';
    loadAnalyticsData(period);
}

function loadAnalyticsData(period) {
    const stats = calculateDashboardStats();
    
    const avgOrderValueElem = document.getElementById('avgOrderValue');
    const conversionRateElem = document.getElementById('conversionRate');
    const retentionRateElem = document.getElementById('retentionRate');
    const peakHoursElem = document.getElementById('peakHours');
    
    if (avgOrderValueElem) avgOrderValueElem.textContent = `K${(stats.totalRevenue / Math.max(stats.totalOrders, 1)).toFixed(2)}`;
    if (conversionRateElem) conversionRateElem.textContent = '75%';
    if (retentionRateElem) retentionRateElem.textContent = '60%';
    if (peakHoursElem) peakHoursElem.textContent = '12:00 PM - 2:00 PM';
}

// UTILITY FUNCTIONS
function generateId() {
    const menuIds = managerState.menuItems.map(item => item.id);
    const orderIds = managerState.orders.map(order => order.id);
    const customerIds = managerState.customers.map(customer => customer.id);
    const promotionIds = managerState.promotions.map(promo => promo.id);
    
    const allIds = [...menuIds, ...orderIds, ...customerIds, ...promotionIds];
    return allIds.length > 0 ? Math.max(...allIds) + 1 : 1;
}

function showModal(modal) {
    if (!modal) return;
    
    modal.classList.add('active');
    if (elements.overlay) {
        elements.overlay.classList.add('active');
    }
    document.body.style.overflow = 'hidden';
}

function closeAllModals() {
    elements.modals.forEach(modal => modal.classList.remove('active'));
    if (elements.overlay) {
        elements.overlay.classList.remove('active');
    }
    document.body.style.overflow = 'auto';
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        border-radius: 8px;
        z-index: 3000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideInRight 0.3s ease-out;
        font-size: 14px;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'index.html';
    }
}

// Complete Menu Data (keep your existing menu data)
const completeMenuData = [
    // Quick Fills
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
    // ... (include all your existing menu items here)
];

// Add cleanup function for when page unloads
window.addEventListener('beforeunload', () => {
    if (saveTimeout) {
        clearTimeout(saveTimeout);
        try {
            localStorage.setItem('wizaManagerData', JSON.stringify(managerState));
        } catch (error) {
            console.error('Final save error:', error);
        }
    }
    
    // Clear auto-refresh interval
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
});

// Export functions for global access
window.editMenuItem = openMenuItemModal;
window.deleteMenuItem = deleteMenuItem;
window.toggleItemAvailability = toggleItemAvailability;
window.viewOrderDetails = viewOrderDetails;
window.updateOrderStatus = updateOrderStatus;
window.viewCustomerDetails = viewCustomerDetails;
window.toggleCustomerBan = toggleCustomerBan;
window.deleteCustomer = deleteCustomer;
window.recreateOrder = recreateOrder;
window.editPromotion = editPromotion;
window.deletePromotion = deletePromotion;
window.togglePromotionStatus = togglePromotionStatus;
window.openDirections = openDirections;
window.acceptNewOrder = acceptNewOrder;
window.rejectNewOrder = rejectNewOrder;
window.closeNotification = closeNotification;

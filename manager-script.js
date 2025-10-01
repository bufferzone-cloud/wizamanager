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
        deliveryEnabled: false
    }
};

// Complete Menu Data
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
    {
        id: 2,
        name: "Sausage & Chips",
        description: "Grilled sausage served with crispy chips",
        price: 40,
        category: "quick-fills",
        image: "Q2.jpg",
        available: true,
        popular: true,
        vegetarian: false
    },
    {
        id: 3,
        name: "Chicken Drumsticks",
        description: "Juicy, flavorful chicken drumsticks",
        price: 45,
        category: "quick-fills",
        image: "Q3.jpg",
        available: true,
        popular: true,
        vegetarian: false,
        new: true
    },
    {
        id: 4,
        name: "Plain Chips",
        description: "Crispy golden fries with a pinch of salt",
        price: 20,
        category: "quick-fills",
        image: "Q4.jpg",
        available: true,
        popular: false,
        vegetarian: true
    },
    {
        id: 5,
        name: "Bread & Egg",
        description: "Fresh bread with scrambled eggs",
        price: 15,
        originalPrice: 17,
        category: "quick-fills",
        image: "Q5.jpg",
        available: true,
        popular: false,
        vegetarian: true,
        discount: 10
    },

    // Savory Bites
    {
        id: 6,
        name: "Shawarma",
        description: "Delicious wrap with spiced meat and vegetables",
        price: 33,
        category: "savory-bites",
        image: "P1.jpg",
        available: true,
        popular: true,
        vegetarian: false
    },
    {
        id: 7,
        name: "Shawarma Platter",
        description: "Complete shawarma meal with sides",
        price: 70,
        originalPrice: 82,
        category: "savory-bites",
        image: "P2.jpg",
        available: true,
        popular: true,
        vegetarian: false,
        discount: 15
    },
    {
        id: 8,
        name: "Plain Sausage",
        description: "Grilled sausage, perfect as a snack",
        price: 20,
        category: "savory-bites",
        image: "P3.jpg",
        available: true,
        popular: false,
        vegetarian: false
    },
    {
        id: 9,
        name: "Plain Wings",
        description: "Simple, flavorful chicken wings",
        price: 12,
        category: "savory-bites",
        image: "P4.jpg",
        available: true,
        popular: false,
        vegetarian: false
    },
    {
        id: 10,
        name: "Plain Chapati",
        description: "Soft, unleavened flatbread",
        price: 10,
        category: "savory-bites",
        image: "P5.jpg",
        available: true,
        popular: false,
        vegetarian: true
    },
    {
        id: 11,
        name: "Plain Rice",
        description: "Steamed white rice, perfect with any dish",
        price: 10,
        category: "savory-bites",
        image: "P6.jpg",
        available: true,
        popular: false,
        vegetarian: true
    },
    {
        id: 12,
        name: "Pizza Pie",
        description: "Individual-sized pizza with delicious toppings",
        price: 50,
        category: "savory-bites",
        image: "P7.jpg",
        available: true,
        popular: true,
        vegetarian: false,
        new: true
    },
    {
        id: 13,
        name: "Regular Pizza",
        description: "Full-sized pizza with your choice of toppings",
        price: 70,
        originalPrice: 88,
        category: "savory-bites",
        image: "P8.jpg",
        available: true,
        popular: true,
        vegetarian: false,
        discount: 20
    },

    // Snacks & Treats
    {
        id: 14,
        name: "Popcorn (Small)",
        description: "Freshly popped corn in a small pack",
        price: 3,
        category: "snacks-treats",
        image: "M1.jpg",
        available: true,
        popular: true,
        vegetarian: true
    },
    {
        id: 15,
        name: "Popcorn (Medium)",
        description: "Freshly popped corn in a medium pack",
        price: 6,
        category: "snacks-treats",
        image: "M1.jpg",
        available: true,
        popular: true,
        vegetarian: true
    },
    {
        id: 16,
        name: "Popcorn (Large)",
        description: "Freshly popped corn in a large pack",
        price: 10,
        originalPrice: 11,
        category: "snacks-treats",
        image: "M1.jpg",
        available: true,
        popular: true,
        vegetarian: true,
        discount: 8
    },
    {
        id: 17,
        name: "Cupcake",
        description: "Nice frosty cupcakes with sprinkles",
        price: 10,
        category: "snacks-treats",
        image: "M2.jpg",
        available: true,
        popular: true,
        vegetarian: true
    },
    {
        id: 18,
        name: "Cream Donut",
        description: "Freshly baked donuts with cream",
        price: 12,
        category: "snacks-treats",
        image: "M3.jpg",
        available: true,
        popular: true,
        vegetarian: true,
        new: true
    },
    {
        id: 19,
        name: "Chocolate Muffin",
        description: "Rich chocolate muffin with chocolate chips",
        price: 14,
        originalPrice: 16,
        category: "snacks-treats",
        image: "M4.jpg",
        available: true,
        popular: false,
        vegetarian: true,
        discount: 12
    },
    {
        id: 20,
        name: "Cinnamon Roll",
        description: "Soft, sweet roll with cinnamon and icing",
        price: 15,
        category: "snacks-treats",
        image: "M5.jpg",
        available: true,
        popular: true,
        vegetarian: true
    },

    // Beverages
    {
        id: 21,
        name: "Mojo",
        description: "Refreshing energy drink",
        price: 8,
        category: "beverages",
        image: "B1.jpeg",
        available: true,
        popular: true,
        vegetarian: true
    },
    {
        id: 22,
        name: "Coca Cola",
        description: "Classic cola soft drink",
        price: 8,
        category: "beverages",
        image: "B2.jpg",
        available: true,
        popular: true,
        vegetarian: true
    },
    {
        id: 23,
        name: "Fanta Fruitcana",
        description: "Fruity and refreshing Fanta flavor",
        price: 8,
        category: "beverages",
        image: "B3.jpg",
        available: true,
        popular: true,
        vegetarian: true,
        new: true
    },
    {
        id: 24,
        name: "Water",
        description: "Pure bottled water",
        price: 5,
        category: "beverages",
        image: "B4.jpg",
        available: true,
        popular: false,
        vegetarian: true
    },
    {
        id: 25,
        name: "Fresh Juice",
        description: "Freshly squeezed fruit juice",
        price: 15,
        originalPrice: 17,
        category: "beverages",
        image: "B5.jpg",
        available: true,
        popular: true,
        vegetarian: true,
        discount: 10
    },
    {
        id: 26,
        name: "Coffee",
        description: "Hot or iced coffee options",
        price: 12,
        category: "beverages",
        image: "B6.jpg",
        available: true,
        popular: true,
        vegetarian: true
    },
    {
        id: 27,
        name: "Milkshake",
        description: "Creamy milkshake in chocolate, vanilla or strawberry",
        price: 18,
        category: "beverages",
        image: "B7.jpg",
        available: true,
        popular: true,
        vegetarian: true,
        new: true
    },
    {
        id: 28,
        name: "Smoothie",
        description: "Fresh fruit smoothie with yogurt",
        price: 20,
        originalPrice: 23,
        category: "beverages",
        image: "B8.jpg",
        available: true,
        popular: true,
        vegetarian: true,
        discount: 15
    },

    // Light & Fresh
    {
        id: 29,
        name: "Salads",
        description: "Fresh garden salad with your choice of dressing",
        price: 25,
        category: "light-fresh",
        image: "S1.jpg",
        available: true,
        popular: true,
        vegetarian: true
    },
    {
        id: 30,
        name: "Fruits",
        description: "Seasonal fruit platter",
        price: 20,
        originalPrice: 22,
        category: "light-fresh",
        image: "S2.jpg",
        available: true,
        popular: true,
        vegetarian: true,
        discount: 10
    },
    {
        id: 31,
        name: "Veggie Wrap",
        description: "Fresh vegetables wrapped in a tortilla",
        price: 22,
        category: "light-fresh",
        image: "S3.jpg",
        available: true,
        popular: true,
        vegetarian: true,
        new: true
    },
    {
        id: 32,
        name: "Yogurt Parfait",
        description: "Layers of yogurt, granola, and fresh fruits",
        price: 28,
        originalPrice: 32,
        category: "light-fresh",
        image: "S4.jpg",
        available: true,
        popular: false,
        vegetarian: true,
        discount: 12
    },

    // Promotions
    {
        id: 33,
        name: "Family Meal Deal",
        description: "2 Shawarma Platters, 4 drinks, and 2 snacks",
        price: 180,
        originalPrice: 220,
        category: "promo",
        image: "PR1.jpg",
        available: true,
        popular: true,
        vegetarian: false,
        discount: 18,
        promo: true
    },
    {
        id: 34,
        name: "Burger Combo",
        description: "Burger, chips, and a drink of your choice",
        price: 55,
        originalPrice: 65,
        category: "promo",
        image: "PR2.jpg",
        available: true,
        popular: true,
        vegetarian: false,
        discount: 15,
        promo: true,
        new: true
    },
    {
        id: 35,
        name: "Weekend Special",
        description: "Pizza, 2 sides, and 2 drinks - perfect for weekends",
        price: 120,
        originalPrice: 145,
        category: "promo",
        image: "PR3.jpg",
        available: true,
        popular: true,
        vegetarian: false,
        discount: 17,
        promo: true
    },
    {
        id: 36,
        name: "Breakfast Deal",
        description: "2 Bread & Egg, 2 coffees, and fruit juice",
        price: 45,
        originalPrice: 55,
        category: "promo",
        image: "PR4.jpg",
        available: true,
        popular: false,
        vegetarian: true,
        discount: 18,
        promo: true
    }
];

// DOM Elements
let elements = {};

// Notification variables
let newOrderNotification = null;
let notificationSound = null;
let isNotificationActive = false;

// Save timeout
let saveTimeout = null;
const SAVE_DELAY = 500;

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
    
    // Schedule new order notification after 10 seconds
    setTimeout(() => {
        if (managerState.settings.appOnline && managerState.settings.acceptOrders) {
            createSampleNewOrder();
        }
    }, 10000);
    
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

function createSampleNewOrder() {
    const sampleOrder = {
        id: generateId(),
        ref: `WIZA${(managerState.orders.length + 1).toString().padStart(4, '0')}`,
        customer: {
            name: "Sarah Chanda",
            email: "sarah.chanda@email.com",
            phone: "0977123456",
            coordinates: [-15.4167, 28.2833]
        },
        items: [
            {
                id: 6,
                name: "Shawarma",
                description: "Delicious wrap with spiced meat and vegetables",
                price: 33,
                quantity: 2,
                image: "P1.jpg",
                toppings: ["Extra Garlic Sauce", "Extra Vegetables", "Spicy Mayo"],
                instructions: "Please make it extra spicy and add extra sauce"
            },
            {
                id: 1,
                name: "Chicken & Chips (Wing)",
                description: "Crispy chicken wings served with golden fries",
                price: 35,
                quantity: 1,
                image: "Q1.jpg",
                toppings: ["Extra Chilli", "Lemon Wedge"],
                instructions: "Make it extra crispy with well-done fries"
            },
            {
                id: 21,
                name: "Mojo",
                description: "Refreshing energy drink",
                price: 8,
                quantity: 3,
                image: "B1.jpeg",
                toppings: [],
                instructions: "Serve very cold with ice"
            }
        ],
        subtotal: (33 * 2) + 35 + (8 * 3),
        deliveryFee: 25,
        serviceFee: 2,
        discount: 18.75,
        total: 0,
        deposit: 0,
        status: "pending",
        delivery: true,
        deliveryLocation: {
            address: "78 Independence Avenue, Lusaka",
            coordinates: [-15.4167, 28.2833]
        },
        promoCode: "WIZA15",
        date: new Date().toISOString(),
        paymentScreenshot: "payment-new.jpg"
    };
    
    // Calculate final totals
    sampleOrder.total = sampleOrder.subtotal - sampleOrder.discount + sampleOrder.deliveryFee + sampleOrder.serviceFee;
    sampleOrder.deposit = sampleOrder.total * 0.5;
    
    managerState.orders.unshift(sampleOrder);
    saveManagerData();
    showNewOrderNotification(sampleOrder);
    updateDashboard();
    loadOrders();
    updatePendingOrdersCount();
}

function updatePendingOrdersCount() {
    const pendingCount = managerState.orders.filter(order => order.status === 'pending').length;
    const pendingOrdersCount = document.getElementById('pendingOrdersCount');
    if (pendingOrdersCount) {
        pendingOrdersCount.textContent = pendingCount;
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
            initializeSampleData();
            showNotification('Data corrupted. Reset to default menu.', 'error');
        }
    } else {
        initializeSampleData();
    }
}

function initializeSampleData() {
    managerState.menuItems = [...completeMenuData];

    // Sample orders
    managerState.orders = [
        {
            id: 1,
            ref: "WIZA0001",
            customer: {
                name: "Jubel mobz",
                email: "jubelmobz19@gmail.com.com",
                phone: "0976769537",
                coordinates: [-15.42, 28.28]
            },
            items: [
                {
                    id: 1,
                    name: "Chicken & Chips (Wing)",
                    description: "Crispy chicken wings served with golden fries",
                    price: 35,
                    quantity: 2,
                    image: "Q1.jpg",
                    toppings: ["Extra Sauce", "Extra Chilli"],
                    instructions: "Make it extra spicy please"
                },
                {
                    id: 21,
                    name: "Mojo",
                    description: "Refreshing energy drink",
                    price: 8,
                    quantity: 1,
                    image: "B1.jpeg",
                    toppings: [],
                    instructions: ""
                }
            ],
            subtotal: 78,
            deliveryFee: 25,
            serviceFee: 2,
            total: 105,
            deposit: 52.5,
            status: "pending",
            delivery: true,
            deliveryLocation: {
                address: "123 Main Street, Lusaka",
                coordinates: [-15.42, 28.28]
            },
            promoCode: "WIZA20",
            discount: 15.6,
            date: new Date().toISOString(),
            paymentScreenshot: "payment1.jpg"
        },
        {
            id: 2,
            ref: "WIZA0002",
            customer: {
                name: "Astridah Nyumbu",
                email: "astridahnyumbu@gmail.com",
                phone: "0977654321",
                coordinates: [-15.41, 28.29]
            },
            items: [
                {
                    id: 6,
                    name: "Shawarma",
                    description: "Delicious wrap with spiced meat and vegetables",
                    price: 33,
                    quantity: 1,
                    image: "P1.jpg",
                    toppings: ["Extra Tomato", "Extra Onions"],
                    instructions: "No mayo, add extra garlic sauce"
                }
            ],
            subtotal: 33,
            deliveryFee: 0,
            serviceFee: 2,
            total: 35,
            deposit: 17.5,
            status: "ready",
            delivery: false,
            promoCode: "",
            discount: 0,
            date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            paymentScreenshot: "payment2.jpg"
        }
    ];

    // Sample customers
    managerState.customers = [
        {
            id: 1,
            name: "Jubel Mobela",
            email: "jubelmobz19@gmail.com",
            phone: "0976760537",
            totalOrders: 5,
            totalSpent: 485,
            status: "active",
            joinDate: new Date('2024-01-15').toISOString(),
            lastOrder: new Date().toISOString()
        },
        {
            id: 2,
            name: "Astridah Nyumbu",
            email: "astridahnyumbu@gmail.com",
            phone: "0977654321",
            totalOrders: 3,
            totalSpent: 150,
            status: "active",
            joinDate: new Date('2024-02-01').toISOString(),
            lastOrder: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 3,
            name: "Mike Johnson",
            email: "mike@gmail.com",
            phone: "0975558888",
            totalOrders: 8,
            totalSpent: 720,
            status: "banned",
            joinDate: new Date('2024-01-10').toISOString(),
            lastOrder: new Date('2024-02-20').toISOString()
        }
    ];

    // Sample promotions
    managerState.promotions = [
        {
            id: 1,
            title: "Welcome Offer",
            description: "20% off on your first order",
            type: "banner",
            code: "WIZA20",
            discount: 20,
            startDate: "2024-01-01",
            endDate: "2024-12-31",
            active: true,
            image: "banner1.jpg"
        }
    ];

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

// ORDERS MANAGEMENT
function loadOrders() {
    if (!elements.ordersList) return;

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

function viewOrderDetails(orderId) {
    const order = managerState.orders.find(o => o.id === orderId);
    if (!order) return;

    const modal = document.getElementById('orderDetailsModal');
    if (!modal) return;

    const content = modal.querySelector('.order-details-content');
    if (!content) return;
    
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

        ${order.paymentScreenshot ? `
        <div class="order-detail-section">
            <h4><i class="fas fa-receipt"></i> Payment Proof</h4>
            <img src="${getImagePath(order.paymentScreenshot)}" alt="Payment Screenshot" class="payment-screenshot" onerror="this.style.display='none'">
        </div>
        ` : ''}
    `;

    showModal(modal);
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

// CUSTOMER MANAGEMENT
function loadCustomers() {
    if (!elements.customersTableBody) return;

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
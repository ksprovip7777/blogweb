/**
 * 🌸 LOTUS GLASS - API FUNCTIONS
 * Direct connection to lotus-glass-api.gs
 * No CORS issues in standalone HTML pages
 */

// ====================== CONFIGURATION ======================
const LOTUS_API = {
    BASE_URL: 'https://script.google.com/macros/s/AKfycbwHHMJbwheajr22wVD9xTqs3K-9k5sNtu4qUGF7OtVOWFstFC52ZGwmyzIJmuiptJ7BhQ/exec',
    TIMEOUT: 10000, // 10 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000 // 1 second
};

// ====================== API FUNCTIONS ======================

/**
 * Make API call to Google Apps Script
 * @param {string} action - API action
 * @param {Object} params - Parameters
 * @param {Object} options - Request options
 * @returns {Promise<Object>} API response
 */
async function apiCall(action, params = {}, options = {}) {
    const url = new URL(LOTUS_API.BASE_URL);
    
    // Add action and parameters to URL
    url.searchParams.set('action', action);
    Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
            url.searchParams.set(key, params[key]);
        }
    });
    
    const requestOptions = {
        method: options.method || 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };
    
    // Add body for POST requests
    if (options.method === 'POST' && options.body) {
        requestOptions.body = JSON.stringify(options.body);
    }
    
    console.log(`🔄 API Call: ${action}`, params);
    
    try {
        const response = await fetch(url.toString(), requestOptions);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`✅ API Success: ${action}`, data);
        return data;
        
    } catch (error) {
        console.error(`❌ API Error: ${action}`, error);
        throw error;
    }
}

/**
 * API call with retry logic
 * @param {string} action - API action
 * @param {Object} params - Parameters
 * @param {Object} options - Request options
 * @returns {Promise<Object>} API response
 */
async function apiCallWithRetry(action, params = {}, options = {}) {
    let lastError;
    
    for (let attempt = 1; attempt <= LOTUS_API.RETRY_ATTEMPTS; attempt++) {
        try {
            return await apiCall(action, params, options);
        } catch (error) {
            lastError = error;
            console.warn(`⚠️ API attempt ${attempt} failed:`, error.message);
            
            if (attempt < LOTUS_API.RETRY_ATTEMPTS) {
                await new Promise(resolve => setTimeout(resolve, LOTUS_API.RETRY_DELAY * attempt));
            }
        }
    }
    
    throw lastError;
}

// ====================== PRODUCT API ======================

/**
 * Get featured products
 * @param {number} limit - Number of products to fetch
 * @returns {Promise<Object>} Featured products
 */
async function getFeaturedProducts(limit = 8) {
    return await apiCallWithRetry('getFeaturedProducts', { limit });
}

/**
 * Get all products with pagination
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Products with pagination
 */
async function getProducts(params = {}) {
    const defaultParams = {
        page: 1,
        limit: 12,
        category: '',
        search: '',
        sortBy: 'ThuTuHienThi',
        sortOrder: 'ASC'
    };
    
    return await apiCallWithRetry('getProducts', { ...defaultParams, ...params });
}

/**
 * Get single product by ID
 * @param {string} productId - Product ID
 * @returns {Promise<Object>} Product details
 */
async function getProduct(productId) {
    return await apiCallWithRetry('getProduct', { id: productId });
}

/**
 * Search products
 * @param {string} query - Search query
 * @param {Object} params - Additional parameters
 * @returns {Promise<Object>} Search results
 */
async function searchProducts(query, params = {}) {
    return await getProducts({ ...params, search: query });
}

// ====================== CATEGORY API ======================

/**
 * Get all categories
 * @returns {Promise<Object>} Categories list
 */
async function getCategories() {
    return await apiCallWithRetry('getCategories');
}

// ====================== CONFIGURATION API ======================

/**
 * Get site configuration
 * @returns {Promise<Object>} Site config
 */
async function getSiteConfig() {
    return await apiCallWithRetry('getConfig');
}

// ====================== ORDER API ======================

/**
 * Create new order
 * @param {Object} orderData - Order information
 * @returns {Promise<Object>} Order creation result
 */
async function createOrder(orderData) {
    return await apiCallWithRetry('createOrder', {}, {
        method: 'POST',
        body: { action: 'createOrder', ...orderData }
    });
}

/**
 * Get order by ID
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Order details
 */
async function getOrder(orderId) {
    return await apiCallWithRetry('getOrder', { id: orderId });
}

// ====================== CUSTOMER API ======================

/**
 * Register new customer
 * @param {Object} customerData - Customer information
 * @returns {Promise<Object>} Registration result
 */
async function registerCustomer(customerData) {
    return await apiCallWithRetry('registerCustomer', {}, {
        method: 'POST',
        body: { action: 'registerCustomer', ...customerData }
    });
}

/**
 * Customer login
 * @param {string} email - Customer email
 * @param {string} password - Customer password
 * @returns {Promise<Object>} Login result
 */
async function loginCustomer(email, password) {
    return await apiCallWithRetry('loginCustomer', {}, {
        method: 'POST',
        body: { action: 'loginCustomer', email, password }
    });
}

// ====================== UTILITY FUNCTIONS ======================

/**
 * Format currency (VND)
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

/**
 * Format date
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
function formatDate(date) {
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

/**
 * Show loading state
 * @param {HTMLElement} element - Element to show loading
 */
function showLoading(element) {
    if (element) {
        element.innerHTML = `
            <div class="text-center p-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Đang tải...</span>
                </div>
                <p class="mt-2">Đang tải dữ liệu...</p>
            </div>
        `;
    }
}

/**
 * Show error message
 * @param {HTMLElement} element - Element to show error
 * @param {string} message - Error message
 */
function showError(element, message = 'Có lỗi xảy ra. Vui lòng thử lại.') {
    if (element) {
        element.innerHTML = `
            <div class="alert alert-danger text-center" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i>
                ${message}
                <button class="btn btn-outline-danger btn-sm mt-2" onclick="location.reload()">
                    Thử lại
                </button>
            </div>
        `;
    }
}

/**
 * Show success message
 * @param {string} message - Success message
 */
function showSuccess(message) {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'toast-notification success';
    toast.innerHTML = `
        <i class="fas fa-check-circle me-2"></i>
        ${message}
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

/**
 * Get URL parameters
 * @returns {Object} URL parameters
 */
function getUrlParams() {
    const params = {};
    const urlParams = new URLSearchParams(window.location.search);
    
    for (const [key, value] of urlParams) {
        params[key] = value;
    }
    
    return params;
}

/**
 * Update URL without reload
 * @param {Object} params - Parameters to update
 */
function updateUrl(params) {
    const url = new URL(window.location);
    
    Object.keys(params).forEach(key => {
        if (params[key]) {
            url.searchParams.set(key, params[key]);
        } else {
            url.searchParams.delete(key);
        }
    });
    
    window.history.pushState({}, '', url);
}

// ====================== INITIALIZATION ======================

/**
 * Initialize API module
 */
function initializeAPI() {
    console.log('🌸 Lotus Glass API initialized');
    console.log('🔗 API URL:', LOTUS_API.BASE_URL);
    
    // Test API connection
    getSiteConfig()
        .then(response => {
            if (response.success) {
                console.log('✅ API connection successful');
            } else {
                console.warn('⚠️ API connection issue:', response.message);
            }
        })
        .catch(error => {
            console.error('❌ API connection failed:', error);
        });
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAPI);
} else {
    initializeAPI();
}

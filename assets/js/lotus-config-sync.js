/**
 * 🌸 LOTUS GLASS - CONFIGURATION SYNCHRONIZATION v6.0
 * Ensures frontend-backend compatibility with code-gas.gs
 */

// ====================== API CONFIGURATION ======================

/**
 * Main API Configuration - Synchronized with code-gas.gs
 * Update this URL when deploying new Google Apps Script
 */
window.LOTUS_API_CONFIG = {
    // Primary Google Apps Script Web App URL
    // TODO: Replace with actual deployed URL from Google Apps Script
    // Format: https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
    PRIMARY_API: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID_HERE/exec',

    // Fallback API (if available) - Update with your proxy URL
    FALLBACK_API: 'https://mylotusapiproxy.hieuvq-viettiep.workers.dev/',
    
    // API Settings
    TIMEOUT: 10000, // 10 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
    
    // Cache Settings
    CACHE_DURATION: 300000, // 5 minutes
    ENABLE_CACHE: true,
    
    // Debug Mode
    DEBUG: false
};

// ====================== API ENDPOINTS MAPPING ======================

/**
 * API Actions - Must match exactly with code-gas.gs switch cases
 * These are the available actions in the Google Apps Script
 */
window.LOTUS_API_ACTIONS = {
    // Product Management
    GET_PRODUCTS: 'getProducts',
    GET_PRODUCT: 'getProduct', 
    GET_FEATURED_PRODUCTS: 'getFeaturedProducts',
    GET_CATEGORIES: 'getCategories',
    SEARCH_PRODUCTS: 'searchProducts',
    
    // Order Management
    CREATE_ORDER: 'createOrder',
    GET_ORDERS: 'getOrders',
    GET_ORDER: 'getOrder',
    UPDATE_ORDER_STATUS: 'updateOrderStatus',
    
    // Customer Management
    REGISTER_CUSTOMER: 'registerCustomer',
    LOGIN_CUSTOMER: 'loginCustomer',
    GET_CUSTOMER: 'getCustomer',
    UPDATE_CUSTOMER: 'updateCustomer',
    
    // Analytics & Dashboard
    GET_DASHBOARD_STATS: 'getDashboardStats',
    GET_ANALYTICS: 'getAnalytics',
    
    // Asset Serving
    GET_ASSETS: 'getAssets',
    
    // Pricing & Membership
    GET_PRICE_FOR_CUSTOMER: 'getPriceForCustomer',
    
    // Contact & Support
    SUBMIT_CONTACT: 'submitContact',
    SUBSCRIBE_NEWSLETTER: 'subscribeNewsletter'
};

// ====================== DATA STRUCTURE DEFINITIONS ======================

/**
 * Expected Response Format from code-gas.gs
 */
window.LOTUS_RESPONSE_FORMAT = {
    success: true,
    message: 'string',
    data: {}, // or []
    timestamp: 'ISO string',
    error: 'string (if success: false)'
};

/**
 * Product Data Structure - Must match code-gas.gs
 */
window.LOTUS_PRODUCT_STRUCTURE = {
    MaSanPham: 'string',
    TenSanPham: 'string',
    MoTa: 'string',
    GiaNiemYet: 'number',
    GiaMacDinh: 'number',
    GiaThanhVienBac: 'number',
    GiaThanhVienVang: 'number', 
    GiaThanhVienKimCuong: 'number',
    TonKho: 'number',
    TonKhoTamGiu: 'number',
    HinhAnhChinh: 'string',
    TrangThai: 'string',
    SanPhamNoiBat: 'boolean',
    DanhMuc: 'string',
    NgayTao: 'string',
    NgayCapNhat: 'string'
};

/**
 * Order Data Structure - Must match code-gas.gs
 */
window.LOTUS_ORDER_STRUCTURE = {
    MaDonHang: 'string',
    MaKhachHang: 'string',
    TenKhachHang: 'string',
    Email: 'string',
    SoDienThoai: 'string',
    DiaChi: 'string',
    SanPham: [], // Array of products
    TongTien: 'number',
    TrangThai: 'string',
    NgayDat: 'string',
    GhiChu: 'string'
};

/**
 * Customer Data Structure - Must match code-gas.gs
 */
window.LOTUS_CUSTOMER_STRUCTURE = {
    MaKhachHang: 'string',
    TenKhachHang: 'string',
    Email: 'string',
    SoDienThoai: 'string',
    DiaChi: 'string',
    NgaySinh: 'string',
    GioiTinh: 'string',
    HangThanhVien: 'string', // BRONZE, SILVER, GOLD, DIAMOND
    DiemTichLuy: 'number',
    NgayDangKy: 'string',
    TrangThai: 'string'
};

// ====================== MEMBERSHIP TIERS ======================

/**
 * Membership Tiers - Must match CONFIG.MEMBERSHIP_TIERS in code-gas.gs
 */
window.LOTUS_MEMBERSHIP_TIERS = {
    BRONZE: {
        name: 'Thành viên Đồng',
        priceField: 'GiaMacDinh',
        discount: 0,
        pointsMultiplier: 1,
        benefits: ['Tích điểm cơ bản', 'Hỗ trợ khách hàng']
    },
    SILVER: {
        name: 'Thành viên Bạc', 
        priceField: 'GiaThanhVienBac',
        discount: 5,
        pointsMultiplier: 1.2,
        benefits: ['Giảm giá 5%', 'Tích điểm x1.2', 'Ưu tiên hỗ trợ']
    },
    GOLD: {
        name: 'Thành viên Vàng',
        priceField: 'GiaThanhVienVang', 
        discount: 10,
        pointsMultiplier: 1.5,
        benefits: ['Giảm giá 10%', 'Tích điểm x1.5', 'Miễn phí vận chuyển']
    },
    DIAMOND: {
        name: 'Thành viên Kim Cương',
        priceField: 'GiaThanhVienKimCuong',
        discount: 15,
        pointsMultiplier: 2,
        benefits: ['Giảm giá 15%', 'Tích điểm x2', 'Ưu đãi độc quyền']
    }
};

// ====================== API HELPER FUNCTIONS ======================

/**
 * Make API call to Google Apps Script
 * @param {string} action - API action from LOTUS_API_ACTIONS
 * @param {Object} params - Parameters to send
 * @param {Object} options - Additional options
 * @returns {Promise} API response
 */
window.lotusApiCall = async function(action, params = {}, options = {}) {
    const config = window.LOTUS_API_CONFIG;
    const startTime = Date.now();
    
    // Validate action
    if (!Object.values(window.LOTUS_API_ACTIONS).includes(action)) {
        console.warn(`⚠️ Unknown API action: ${action}`);
    }
    
    // Prepare request
    const requestData = {
        action: action,
        ...params,
        timestamp: new Date().toISOString()
    };
    
    // Try primary API first
    const endpoints = [config.PRIMARY_API, config.FALLBACK_API].filter(Boolean);
    
    for (let i = 0; i < endpoints.length; i++) {
        const endpoint = endpoints[i];
        
        try {
            if (config.DEBUG) {
                console.log(`🔄 API Call: ${action}`, { endpoint, params });
            }
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), config.TIMEOUT);
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(requestData),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            
            if (config.DEBUG) {
                console.log(`✅ API Success: ${action}`, {
                    duration: Date.now() - startTime,
                    endpoint: endpoint.includes('script.google.com') ? 'primary' : 'fallback',
                    result
                });
            }
            
            return result;
            
        } catch (error) {
            console.warn(`⚠️ API endpoint ${i + 1} failed:`, error.message);
            
            if (i === endpoints.length - 1) {
                // Last endpoint failed, return error
                return {
                    success: false,
                    message: 'Tất cả API endpoints đều không khả dụng',
                    error: error.message,
                    timestamp: new Date().toISOString()
                };
            }
        }
    }
};

/**
 * Get current API configuration
 * @returns {Object} Current API config
 */
window.getLotusApiConfig = function() {
    return window.LOTUS_API_CONFIG;
};

/**
 * Update API configuration
 * @param {Object} newConfig - New configuration values
 */
window.updateLotusApiConfig = function(newConfig) {
    Object.assign(window.LOTUS_API_CONFIG, newConfig);
    console.log('🔧 API Configuration updated:', newConfig);
};

/**
 * Validate response format
 * @param {Object} response - API response to validate
 * @returns {boolean} Is valid response
 */
window.validateLotusResponse = function(response) {
    if (!response || typeof response !== 'object') {
        return false;
    }
    
    return 'success' in response && 'message' in response;
};

// ====================== INITIALIZATION ======================

/**
 * Initialize API configuration
 */
(function initializeLotusConfig() {
    console.log('🌸 Lotus Glass API Configuration v6.0 loaded');
    
    // Check if primary API URL is configured
    if (window.LOTUS_API_CONFIG.PRIMARY_API.includes('YOUR_DEPLOYMENT_ID_HERE')) {
        console.warn('⚠️ Primary API URL not configured. Please update LOTUS_API_CONFIG.PRIMARY_API');
    }
    
    // Set global flag
    window.LOTUS_CONFIG_LOADED = true;
    
    // Dispatch ready event
    document.dispatchEvent(new CustomEvent('lotus:configReady', {
        detail: { config: window.LOTUS_API_CONFIG }
    }));
})();

// ====================== EXPORT FOR MODULES ======================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LOTUS_API_CONFIG: window.LOTUS_API_CONFIG,
        LOTUS_API_ACTIONS: window.LOTUS_API_ACTIONS,
        LOTUS_MEMBERSHIP_TIERS: window.LOTUS_MEMBERSHIP_TIERS,
        lotusApiCall: window.lotusApiCall,
        validateLotusResponse: window.validateLotusResponse
    };
}

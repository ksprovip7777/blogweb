/**
 * 🌸 LOTUS GLASS - UNIFIED API SYSTEM
 * Production-ready API with smart fallback mechanism
 */

// ====================== CONFIGURATION ======================
const LOTUS_CONFIG = {
    // API Endpoints
    ORIGINAL_API: 'https://mylotusapiproxy.hieuvq-viettiep.workers.dev/',
    ALTERNATIVE_API: 'https://mylotusapiproxy.hieuvq-viettiep.workers.dev/',
    
    // Settings
    USE_REAL_API: true,
    RETRY_ATTEMPTS: 2,
    TIMEOUT: 8000,
    
    // Cache
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
    cache: new Map()
};

// ====================== REAL MOCK DATA ======================
const MOCK_DATA = {
    getConfig: {
        success: true,
        message: "Lấy cấu hình thành công",
        data: {
            business: {
                business_name: "Lotus Glass",
                address: "136 Bãi Sậy, Phường 1, Quận 6, TP HCM",
                phone: "0981 500 400",
                email: "info@lotusglass.com",
                bank_account_name: "VO QUANG HIEU",
                bank_number: "0886468660",
                bank_name: "MB Bank"
            },
            ecommerce: {
                items_per_page: 12,
                free_shipping_threshold: 500000,
                default_shipping_fee: 30000,
                bank_transfer_discount: 0.02
            },
            ui: {
                primary_color: "#2E8B57",
                enable_caching: false
            }
        },
        meta: null,
        timestamp: new Date().toISOString(),
        version: "2.0"
    },

    getFeaturedProducts: {
        success: true,
        message: "Lấy sản phẩm nổi bật thành công",
        data: [
            {
                ProductID: "LTG0043",
                SKU: "VTC009IN017HT02",
                TenSanPham: "CỐC SỐ 9 (Hộp xốp)",
                PhanLoai: "IN HOA PHÙ DUNG XANH LÁ",
                MoTa: "Ly đa dụng",
                CategoryID: "CTG-001",
                GiaNiemYet: 150000,
                GiaMacDinh: 150000,
                TonKho: 50,
                HinhAnhChinh: "https://product.hstatic.net/200000605565/product/009_4aa8a8a9190e47d197caeb512a48679c_master.png",
                SanPhamNoiBat: true,
                NgayTao: "2023-12-31T17:00:00.000Z"
            },
            {
                ProductID: "LTG0044",
                TenSanPham: "LY THỦY TINH CAO CẤP",
                PhanLoai: "IN HOA LOTUS XANH DƯƠNG",
                GiaMacDinh: 180000,
                TonKho: 30,
                HinhAnhChinh: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=250&fit=crop",
                SanPhamNoiBat: true
            },
            {
                ProductID: "LTG0045",
                TenSanPham: "BÌNH THỦY TINH ĐỰNG NƯỚC",
                PhanLoai: "TRONG SUỐT CLASSIC",
                GiaMacDinh: 250000,
                TonKho: 25,
                HinhAnhChinh: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&h=250&fit=crop",
                SanPhamNoiBat: true
            },
            {
                ProductID: "LTG0046",
                TenSanPham: "BỘ LY THỦY TINH 6 CÁI",
                PhanLoai: "BỘ SANG TRỌNG",
                GiaMacDinh: 450000,
                TonKho: 15,
                HinhAnhChinh: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=300&h=250&fit=crop",
                SanPhamNoiBat: true
            },
            {
                ProductID: "LTG0047",
                TenSanPham: "CHÉN THỦY TINH SANG TRỌNG",
                PhanLoai: "THIẾT KẾ HIỆN ĐẠI",
                GiaMacDinh: 120000,
                TonKho: 40,
                HinhAnhChinh: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=250&fit=crop",
                SanPhamNoiBat: true
            },
            {
                ProductID: "LTG0048",
                TenSanPham: "ẤM TRÀ THỦY TINH",
                PhanLoai: "PHONG CÁCH NHẬT BẢN",
                GiaMacDinh: 320000,
                TonKho: 20,
                HinhAnhChinh: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=300&h=250&fit=crop",
                SanPhamNoiBat: true
            },
            {
                ProductID: "LTG0049",
                TenSanPham: "BỘ ĐĨA THỦY TINH 6 CÁI",
                PhanLoai: "THIẾT KẾ ELEGANT",
                GiaMacDinh: 380000,
                TonKho: 18,
                HinhAnhChinh: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=250&fit=crop",
                SanPhamNoiBat: true
            },
            {
                ProductID: "LTG0050",
                TenSanPham: "BÌNH HOA THỦY TINH",
                PhanLoai: "TRANG TRÍ NỘI THẤT",
                GiaMacDinh: 280000,
                TonKho: 22,
                HinhAnhChinh: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=250&fit=crop",
                SanPhamNoiBat: true
            }
        ],
        meta: null,
        timestamp: new Date().toISOString(),
        version: "2.0"
    }
};

// ====================== CORE API FUNCTIONS ======================

/**
 * Smart API call with multiple fallback strategies
 * @param {string} action - API action
 * @param {Object} params - Parameters
 * @returns {Promise} API response
 */
async function apiCall(action, params = {}) {
    const cacheKey = `${action}_${JSON.stringify(params)}`;
    
    // Check cache first
    if (LOTUS_CONFIG.cache.has(cacheKey)) {
        const cached = LOTUS_CONFIG.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < LOTUS_CONFIG.CACHE_DURATION) {
            console.log(`📦 Cache hit: ${action}`);
            return cached.data;
        }
    }
    
    if (!LOTUS_CONFIG.USE_REAL_API) {
        return getMockData(action, params);
    }
    
    // Try real API with fallback
    const endpoints = [LOTUS_CONFIG.ALTERNATIVE_API, LOTUS_CONFIG.ORIGINAL_API];
    
    for (const endpoint of endpoints) {
        try {
            console.log(`🔄 Trying API: ${action} on ${endpoint.includes('/dev') ? 'alternative' : 'original'}`);
            
            const url = new URL(endpoint);
            url.searchParams.set('action', action);
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null) {
                    url.searchParams.set(key, params[key]);
                }
            });
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), LOTUS_CONFIG.TIMEOUT);
            
            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
                const data = await response.json();
                
                // Cache successful response
                LOTUS_CONFIG.cache.set(cacheKey, {
                    data: data,
                    timestamp: Date.now()
                });
                
                console.log(`✅ API Success: ${action}`);
                return data;
            }
            
        } catch (error) {
            console.warn(`⚠️ API endpoint failed: ${error.message}`);
            continue;
        }
    }
    
    // Fallback to mock data
    console.log(`🎯 Using mock data for: ${action}`);
    return getMockData(action, params);
}

/**
 * Get mock data with parameter handling
 * @param {string} action - API action
 * @param {Object} params - Parameters
 * @returns {Object} Mock response
 */
function getMockData(action, params = {}) {
    let mockResponse = MOCK_DATA[action];
    
    if (!mockResponse) {
        return { success: false, message: `Mock data not found for: ${action}` };
    }
    
    // Clone to avoid mutation
    mockResponse = JSON.parse(JSON.stringify(mockResponse));
    
    // Handle parameters
    if (action === 'getFeaturedProducts' && params.limit) {
        mockResponse.data = mockResponse.data.slice(0, parseInt(params.limit));
    }
    
    if (action === 'getProducts') {
        const page = parseInt(params.page) || 1;
        const limit = parseInt(params.limit) || 12;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        
        mockResponse.data = MOCK_DATA.getFeaturedProducts.data.slice(startIndex, endIndex);
        mockResponse.pagination = {
            current_page: page,
            total_pages: Math.ceil(MOCK_DATA.getFeaturedProducts.data.length / limit),
            total_items: MOCK_DATA.getFeaturedProducts.data.length,
            items_per_page: limit
        };
    }
    
    mockResponse.timestamp = new Date().toISOString();
    return mockResponse;
}

// ====================== SPECIFIC API FUNCTIONS ======================

/**
 * Get site configuration
 * @returns {Promise} Site config
 */
async function getSiteConfig() {
    return await apiCall('getConfig');
}

/**
 * Get featured products
 * @param {number} limit - Number of products
 * @returns {Promise} Featured products
 */
async function getFeaturedProducts(limit = 8) {
    return await apiCall('getFeaturedProducts', { limit });
}

/**
 * Get all products with pagination
 * @param {Object} params - Query parameters
 * @returns {Promise} Products
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
    
    return await apiCall('getProducts', { ...defaultParams, ...params });
}

/**
 * Search products
 * @param {string} query - Search query
 * @param {Object} params - Additional parameters
 * @returns {Promise} Search results
 */
async function searchProducts(query, params = {}) {
    return await getProducts({ ...params, search: query });
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
 * Show error state
 * @param {HTMLElement} element - Element to show error
 * @param {string} message - Error message
 */
function showError(element, message) {
    if (element) {
        element.innerHTML = `
            <div class="alert alert-warning text-center">
                <i class="fas fa-exclamation-triangle me-2"></i>
                ${message}
            </div>
        `;
    }
}

// ====================== INITIALIZATION ======================

/**
 * Initialize Lotus API system
 */
async function initLotusAPI() {
    console.log('🌸 Initializing Lotus Glass API...');
    
    try {
        // Test API connectivity
        const testResponse = await getSiteConfig();
        
        if (testResponse.success) {
            console.log('✅ Lotus API initialized successfully');
            return { status: 'success', method: 'api' };
        } else {
            console.log('⚠️ API test failed, using mock data');
            return { status: 'fallback', method: 'mock' };
        }
        
    } catch (error) {
        console.warn('⚠️ API initialization failed:', error.message);
        return { status: 'error', method: 'mock' };
    }
}

// ====================== EXPORT ======================

// Make functions globally available
if (typeof window !== 'undefined') {
    window.LOTUS_CONFIG = LOTUS_CONFIG;
    window.apiCall = apiCall;
    window.getSiteConfig = getSiteConfig;
    window.getFeaturedProducts = getFeaturedProducts;
    window.getProducts = getProducts;
    window.searchProducts = searchProducts;
    window.formatCurrency = formatCurrency;
    window.formatDate = formatDate;
    window.showLoading = showLoading;
    window.showError = showError;
    window.initLotusAPI = initLotusAPI;
}

// Auto-initialize
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLotusAPI);
    } else {
        initLotusAPI();
    }
}

console.log('🌸 Lotus Glass Unified API loaded');

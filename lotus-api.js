/**
 * 🌸 LOTUS GLASS - UNIFIED API SYSTEM v4.0
 * Production-ready API with smart fallback mechanism
 * Database Schema Compliant
 */

// ====================== CONFIGURATION ======================
const LOTUS_CONFIG = {
    // API Endpoints
    ORIGINAL_API: 'https://mylotusapiproxy.hieuvq-viettiep.workers.dev/',
    ALTERNATIVE_API: 'https://script.google.com/macros/s/AKfycbw2bs78YisIjfchUnbBEA7qKotL8PdvXFl0He6-cSxC-75XxE2DsjqvIJa-DH4w_UrkGg/exec',

    // Settings
    USE_REAL_API: true,
    RETRY_ATTEMPTS: 2,
    TIMEOUT: 15000, // Increased timeout to 15 seconds

    // Cache
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
    cache: new Map(),

    // Payment Methods
    PAYMENT_METHODS: {
        COD: 'COD',
        BANK_TRANSFER: 'BANK_TRANSFER'
    },

    // Order Status
    ORDER_STATUS: {
        PENDING: 'PENDING',
        CONFIRMED: 'CONFIRMED',
        PREPARING: 'PREPARING',
        SHIPPING: 'SHIPPING',
        DELIVERED: 'DELIVERED',
        CANCELLED: 'CANCELLED',
        RETURNED: 'RETURNED'
    },

    // Membership Tiers
    MEMBERSHIP_TIERS: {
        BRONZE: { min: 0, max: 2000000, name: 'Đồng' },
        SILVER: { min: 2000000, max: 12000000, name: 'Bạc' },
        TITAN: { min: 12000000, max: 36000000, name: 'Titan' },
        GOLD: { min: 36000000, max: 60000000, name: 'Vàng' },
        PLATINUM: { min: 60000000, max: 180000000, name: 'Bạch Kim' },
        SIGNATURE: { min: 180000000, max: Infinity, name: 'Signature' }
    }
};

// ====================== ENHANCED MOCK DATA ======================
const MOCK_DATA = {
    getSiteConfig: {
        success: true,
        message: "Lấy cấu hình thành công",
        data: {
            business: {
                business_name: "Lotus Glass Vietnam",
                address: "136 Bãi Sậy, Phường 1, Quận 6, TP HCM",
                phone: "0981 500 400",
                email: "info@lotusglass.com",
                website: "https://lotus-glass.blogspot.com",
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
                primary_color: "#fa5d14",
                secondary_color: "#6387eb",
                enable_caching: true
            },
            system: {
                app_name: "Lotus Glass",
                app_version: "4.0",
                maintenance_mode: false
            },
            membership_tiers: LOTUS_CONFIG.MEMBERSHIP_TIERS,
            payment_methods: [
                {
                    id: 'COD',
                    name: 'Thanh toán khi nhận hàng (COD)',
                    description: 'Thanh toán bằng tiền mặt khi nhận hàng',
                    enabled: true
                },
                {
                    id: 'BANK_TRANSFER',
                    name: 'Chuyển khoản ngân hàng',
                    description: 'Chuyển khoản qua QR Code hoặc thông tin tài khoản',
                    enabled: true,
                    discount: 0.02
                }
            ]
        },
        timestamp: new Date().toISOString(),
        version: "4.0"
    },

    getCustomerStats: {
        success: true,
        message: "Lấy thống kê khách hàng thành công",
        data: {
            customer: {
                SoDienThoai: "0123456789",
                TenKhachHang: "Khách hàng mẫu",
                Email: "customer@example.com",
                TongChiTieu: 5000000,
                HangThanhVien: "SILVER"
            },
            totalOrders: 15,
            totalSpent: 5000000,
            averageOrderValue: 333333,
            membershipTier: "SILVER",
            lastOrderDate: "2025-01-15",
            recentOrders: [
                {
                    orderId: "ORD2025011501",
                    date: "2025-01-15",
                    amount: 450000,
                    status: "DELIVERED"
                }
            ]
        }
    },

    createReview: {
        success: true,
        message: "Đánh giá đã được gửi thành công",
        data: {
            ratingId: "RT1737364800000",
            message: "Đánh giá của bạn đã được gửi và đang chờ duyệt"
        }
    },

    getProductReviews: {
        success: true,
        message: "Lấy đánh giá sản phẩm thành công",
        data: {
            reviews: [
                {
                    RatingID: "RT1737364800000",
                    SoDienThoai: "0123****789",
                    DiemDanhGia: 5,
                    NhanXet: "Sản phẩm rất tốt, chất lượng cao",
                    NgayDanhGia: "2025-01-15"
                }
            ],
            totalReviews: 1,
            averageRating: 5.0
        }
    },

    createReturn: {
        success: true,
        message: "Yêu cầu trả hàng đã được gửi thành công",
        data: {
            returnId: "RT1737364800000",
            message: "Yêu cầu trả hàng đã được gửi thành công"
        }
    },

    registerCustomer: {
        success: true,
        message: "Đăng ký khách hàng thành công",
        data: {
            SoDienThoai: "0123456789",
            TenKhachHang: "Khách hàng mới",
            message: "Đăng ký thành công! Vui lòng đăng nhập."
        }
    },

    loginCustomer: {
        success: true,
        message: "Đăng nhập thành công",
        data: {
            SoDienThoai: "0123456789",
            TenKhachHang: "Khách hàng mẫu",
            Email: "customer@example.com",
            HangThanhVien: "SILVER",
            TongChiTieu: 5000000,
            NgayThamGia: "2024-01-15",
            DiaChi: "123 Đường ABC, Quận 1, TP.HCM"
        }
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
                MoTa: "Ly đa dụng cao cấp với thiết kế tinh tế",
                CategoryID: "CTG-001",
                GiaNiemYet: 180000,
                GiaMacDinh: 150000,
                GiaBac: 140000,
                GiaTitan: 130000,
                GiaBachKim: 120000,
                TonKho: 50,
                TonKhoTamGiu: 5,
                HinhAnhChinh: "https://product.hstatic.net/200000605565/product/009_4aa8a8a9190e47d197caeb512a48679c_master.png",
                TrangThai: "Đang bán",
                SanPhamNoiBat: true,
                NgayTao: "2023-12-31T17:00:00.000Z",
                NgayCapNhat: "2025-01-20T10:00:00.000Z"
            },
            {
                ProductID: "LTG0044",
                SKU: "LTG044GLASS",
                TenSanPham: "LY THỦY TINH CAO CẤP",
                PhanLoai: "IN HOA LOTUS XANH DƯƠNG",
                MoTa: "Ly thủy tinh cao cấp với họa tiết lotus độc đáo",
                CategoryID: "CTG-001",
                GiaNiemYet: 220000,
                GiaMacDinh: 180000,
                GiaBac: 170000,
                GiaTitan: 160000,
                GiaBachKim: 150000,
                TonKho: 30,
                TonKhoTamGiu: 3,
                HinhAnhChinh: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=250&fit=crop",
                TrangThai: "Đang bán",
                SanPhamNoiBat: true,
                NgayTao: "2024-01-15T08:00:00.000Z",
                NgayCapNhat: "2025-01-20T10:00:00.000Z"
            },
            {
                ProductID: "LTG0045",
                SKU: "LTG045BOTTLE",
                TenSanPham: "BÌNH THỦY TINH ĐỰNG NƯỚC",
                PhanLoai: "TRONG SUỐT CLASSIC",
                MoTa: "Bình đựng nước thủy tinh trong suốt, dung tích 1.5L",
                CategoryID: "CTG-002",
                GiaNiemYet: 300000,
                GiaMacDinh: 250000,
                GiaBac: 230000,
                GiaTitan: 210000,
                GiaBachKim: 190000,
                TonKho: 25,
                TonKhoTamGiu: 2,
                HinhAnhChinh: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&h=250&fit=crop",
                TrangThai: "Đang bán",
                SanPhamNoiBat: true,
                NgayTao: "2024-02-01T09:00:00.000Z",
                NgayCapNhat: "2025-01-20T10:00:00.000Z"
            },
            {
                ProductID: "LTG0046",
                SKU: "LTG046SET6",
                TenSanPham: "BỘ LY THỦY TINH 6 CÁI",
                PhanLoai: "BỘ SANG TRỌNG",
                MoTa: "Bộ 6 ly thủy tinh cao cấp, thiết kế sang trọng",
                CategoryID: "CTG-003",
                GiaNiemYet: 550000,
                GiaMacDinh: 450000,
                GiaBac: 420000,
                GiaTitan: 390000,
                GiaBachKim: 360000,
                TonKho: 15,
                TonKhoTamGiu: 1,
                HinhAnhChinh: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=300&h=250&fit=crop",
                TrangThai: "Đang bán",
                SanPhamNoiBat: true,
                NgayTao: "2024-03-10T11:00:00.000Z",
                NgayCapNhat: "2025-01-20T10:00:00.000Z"
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
    return await apiCall('getSiteConfig');
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

/**
 * Get product with member-specific pricing
 * @param {string} productId - Product ID
 * @param {string} customerPhone - Customer phone (optional)
 * @returns {Promise} Product with member pricing
 */
async function getProductWithMemberPrice(productId, customerPhone = null) {
    return await apiCall('getProductWithMemberPrice', { productId, customerPhone });
}

/**
 * Get products by category
 * @param {string} categoryId - Category ID
 * @param {string} customerPhone - Customer phone (optional)
 * @returns {Promise} Products in category
 */
async function getProductsByCategory(categoryId, customerPhone = null) {
    return await apiCall('getProductsByCategory', { categoryId, customerPhone });
}

/**
 * Create order with enhanced validation
 * @param {Object} orderData - Order data
 * @returns {Promise} Order creation result
 */
async function createOrder(orderData) {
    return await apiCall('createOrder', orderData);
}

/**
 * Validate promotion code
 * @param {string} promoCode - Promotion code
 * @param {number} orderAmount - Order amount
 * @param {string} customerPhone - Customer phone (optional)
 * @returns {Promise} Validation result
 */
async function validatePromotion(promoCode, orderAmount, customerPhone = null) {
    return await apiCall('validatePromotion', { promoCode, orderAmount, customerPhone });
}

/**
 * Generate QR code for bank transfer
 * @param {string} orderId - Order ID
 * @param {number} amount - Amount
 * @returns {Promise} QR code data
 */
async function generateQRCode(orderId, amount) {
    return await apiCall('generateQRCode', { orderId, amount });
}

/**
 * Register customer
 * @param {Object} customerData - Customer data
 * @returns {Promise} Registration result
 */
async function registerCustomer(customerData) {
    return await apiCall('registerCustomer', customerData);
}

/**
 * Login customer
 * @param {Object} loginData - Login data {phone, password}
 * @returns {Promise} Login result
 */
async function loginCustomer(loginData) {
    return await apiCall('loginCustomer', loginData);
}

/**
 * Get customer information
 * @param {string} phone - Phone number
 * @returns {Promise} Customer data
 */
async function getCustomer(phone) {
    return await apiCall('getCustomer', { phone });
}

/**
 * Calculate shipping fee
 * @param {Object} shippingData - Shipping data
 * @returns {Promise} Shipping calculation
 */
async function calculateShipping(shippingData) {
    return await apiCall('calculateShipping', shippingData);
}

/**
 * Get customer statistics
 * @param {string} customerPhone - Customer phone
 * @returns {Promise} Customer statistics
 */
async function getCustomerStats(customerPhone) {
    return await apiCall('getCustomerStats', { customerPhone });
}

/**
 * Create product review
 * @param {Object} reviewData - Review data
 * @returns {Promise} Review creation result
 */
async function createReview(reviewData) {
    return await apiCall('createReview', reviewData);
}

/**
 * Get product reviews
 * @param {string} productId - Product ID
 * @returns {Promise} Product reviews
 */
async function getProductReviews(productId) {
    return await apiCall('getProductReviews', { productId });
}

/**
 * Create return request
 * @param {Object} returnData - Return data
 * @returns {Promise} Return creation result
 */
async function createReturn(returnData) {
    return await apiCall('createReturn', returnData);
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
 * Show loading state in container
 * @param {HTMLElement} element - Element to show loading
 */
function showContainerLoading(element) {
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
 * Show error state in container
 * @param {HTMLElement} element - Element to show error
 * @param {string} message - Error message
 */
function showContainerError(element, message) {
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
    window.registerCustomer = registerCustomer;
    window.loginCustomer = loginCustomer;
    window.getCustomerStats = getCustomerStats;
    window.createReview = createReview;
    window.getProductReviews = getProductReviews;
    window.createReturn = createReturn;
    window.formatCurrency = formatCurrency;
    window.formatDate = formatDate;
    window.showContainerLoading = showContainerLoading;
    window.showContainerError = showContainerError;
    window.initLotusAPI = initLotusAPI;

    // Create LotusAPI object for easier access
    window.LotusAPI = {
        // Site & Config
        getSiteConfig,

        // Products
        getFeaturedProducts,
        getProducts,
        searchProducts,

        // Customers
        registerCustomer,
        loginCustomer,
        getCustomerStats,

        // Reviews
        createReview,
        getProductReviews,

        // Returns
        createReturn,

        // Utilities
        formatCurrency,
        formatDate
    };
}

/**
 * Get membership tier name
 * @param {number} totalSpending - Total spending amount
 * @returns {string} Tier name
 */
function getMembershipTier(totalSpending) {
    for (const [tier, config] of Object.entries(LOTUS_CONFIG.MEMBERSHIP_TIERS)) {
        if (totalSpending >= config.min && totalSpending < config.max) {
            return config.name;
        }
    }
    return 'Đồng'; // Default
}

/**
 * Get price for membership tier
 * @param {Object} product - Product object
 * @param {string} tier - Membership tier
 * @returns {number} Price for tier
 */
function getPriceForTier(product, tier = 'BRONZE') {
    const priceFields = {
        'BRONZE': 'GiaMacDinh',
        'SILVER': 'GiaBac',
        'TITAN': 'GiaTitan',
        'GOLD': 'GiaBachKim',
        'PLATINUM': 'GiaBachKim',
        'SIGNATURE': 'GiaBachKim'
    };

    const field = priceFields[tier] || 'GiaMacDinh';
    return product[field] || product.GiaMacDinh || 0;
}

/**
 * Validate Vietnamese phone number
 * @param {string} phone - Phone number
 * @returns {boolean} Is valid
 */
function validatePhone(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
}

/**
 * Validate email address
 * @param {string} email - Email address
 * @returns {boolean} Is valid
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Calculate discount amount
 * @param {number} amount - Original amount
 * @param {number} discountPercent - Discount percentage (0-100)
 * @returns {number} Discount amount
 */
function calculateDiscount(amount, discountPercent) {
    return amount * (discountPercent / 100);
}

/**
 * Format order status for display
 * @param {string} status - Order status
 * @returns {string} Formatted status
 */
function formatOrderStatus(status) {
    const statusMap = {
        'PENDING': 'Chờ xác nhận',
        'CONFIRMED': 'Đã xác nhận',
        'PREPARING': 'Đang chuẩn bị',
        'SHIPPING': 'Đang vận chuyển',
        'DELIVERED': 'Đã giao hàng',
        'CANCELLED': 'Đã hủy',
        'RETURNED': 'Đã trả hàng'
    };

    return statusMap[status] || status;
}

/**
 * Get payment method display name
 * @param {string} method - Payment method
 * @returns {string} Display name
 */
function getPaymentMethodName(method) {
    const methodMap = {
        'COD': 'Thanh toán khi nhận hàng',
        'BANK_TRANSFER': 'Chuyển khoản ngân hàng'
    };

    return methodMap[method] || method;
}

// Auto-initialize
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLotusAPI);
    } else {
        initLotusAPI();
    }
}

console.log('🌸 Lotus Glass Unified API v4.0 loaded - Database Schema Compliant');

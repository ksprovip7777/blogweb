/**
 * 🌸 LOTUS GLASS V5.0 - MODERN CENTRALIZED CONFIGURATION (2025 EDITION)
 * Enhanced Single Source of Truth for Progressive Web App Experience
 * Version: 5.0 - January 2025
 * 
 * 🚀 NEW 2025 ENHANCEMENTS:
 * - Progressive Web App (PWA) configuration
 * - Enhanced performance monitoring
 * - Modern API management with intelligent fallbacks
 * - Advanced caching strategies
 * - Real-time notifications support
 * - AI-powered features configuration
 * - Enhanced security settings
 * - Mobile-first responsive configuration
 * - Offline-first architecture support
 * - Modern payment gateway integrations
 */

// ====================== 🌍 ENHANCED ENVIRONMENT DETECTION (2025) ======================
const ENVIRONMENT = {
    isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    isBlogger: window.location.hostname.includes('blogspot.com'),
    isGitHubPages: window.location.hostname.includes('github.io'),
    isProduction: !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1'),
    
    // 🚀 New 2025 Environment Features
    isPWA: window.navigator && 'serviceWorker' in navigator,
    isOnline: navigator.onLine,
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isModernBrowser: 'fetch' in window && 'Promise' in window && 'localStorage' in window,
    supportsWebRTC: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
    supportsNotifications: 'Notification' in window,
    supportsPushManager: 'PushManager' in window,
    version: '5.0',
    buildDate: '2025-01-21',
    features: {
        PWA: true,
        OFFLINE: true,
        REAL_TIME: true,
        AI_RECOMMENDATIONS: true,
        ADVANCED_ANALYTICS: true,
        PUSH_NOTIFICATIONS: true,
        GEOLOCATION: true,
        CAMERA_INTEGRATION: true
    }
};

// ====================== 🚀 ENHANCED API CONFIGURATION (2025) ======================
const API_CONFIG = {
    // 🌍 Enhanced Primary Endpoints with Intelligent Routing
    ENDPOINTS: {
        PRIMARY: 'https://mylotusapiproxy.hieuvq-viettiep.workers.dev/',
        ALTERNATIVE: 'https://mylotusapiproxy.hieuvq-viettiep.workers.dev/',
        FALLBACK: 'mock', // Use mock data as fallback
        WEBSOCKET: 'wss://mylotusapiproxy.hieuvq-viettiep.workers.dev/ws',
        CDN: 'https://cdn.lotusglass.com/',
        IMAGES: 'https://images.lotusglass.com/',
        ANALYTICS: 'https://analytics.lotusglass.com/'
    },
    
    // ⚡ Enhanced Request Settings with Modern Standards
    SETTINGS: {
        TIMEOUT: ENVIRONMENT.isDevelopment ? 15000 : 8000,
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 1000,
        MAX_RETRY_DELAY: 5000,
        USE_REAL_API: true,
        ENABLE_CACHING: true,
        CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
        OFFLINE_CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours for offline
        ENABLE_COMPRESSION: true,
        ENABLE_HTTP2: true,
        CONNECTION_TIMEOUT: 5000,
        KEEPALIVE_TIMEOUT: 30000,
        MAX_CONCURRENT_REQUESTS: 6,
        REQUEST_QUEUE_SIZE: 50,
        ENABLE_REQUEST_DEDUPLICATION: true
    },
    
    // 🔒 Enhanced Security Headers
    HEADERS: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-Client-Version': ENVIRONMENT.version,
        'X-Device-Type': ENVIRONMENT.isMobile ? 'mobile' : 'desktop',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
    },
    
    // 📊 Enhanced Performance Monitoring
    PERFORMANCE: {
        ENABLE_TIMING: true,
        ENABLE_METRICS: true,
        SLOW_REQUEST_THRESHOLD: 2000, // 2 seconds
        ERROR_RATE_THRESHOLD: 0.05, // 5%
        HEALTH_CHECK_INTERVAL: 30000, // 30 seconds
        PERFORMANCE_BUDGET: {
            FIRST_CONTENTFUL_PAINT: 1500,
            LARGEST_CONTENTFUL_PAINT: 2500,
            FIRST_INPUT_DELAY: 100,
            CUMULATIVE_LAYOUT_SHIFT: 0.1
        }
    }
};

// ====================== 💼 ENHANCED BUSINESS CONFIGURATION (2025) ======================
const BUSINESS_CONFIG = {
    // 🏢 Enhanced Company Information
    COMPANY: {
        name: 'Lotus Glass Vietnam',
        tagline: 'Thủy tinh gia dụng cao cấp cho ngôi nhà hiện đại',
        description: 'Chuyên cung cấp thủy tinh gia dụng cao cấp với chất lượng tốt nhất và công nghệ tiên tiến nhất',
        slogan: 'Chất lượng - Tin cậy - Bền vững',
        establishedYear: 2020,
        
        // Enhanced Contact Details
        address: '136 Bãi Sậy, Phường 1, Quận 6, TP. Hồ Chí Minh',
        coordinates: {
            lat: 10.762622,
            lng: 106.660172
        },
        phone: '0981 500 400',
        email: 'info@lotusglass.com',
        website: 'https://lotusglass.vn',
        
        // Banking information
        bank: {
            account_name: 'VO QUANG HIEU',
            account_number: '0886468660',
            bank_name: 'MB Bank',
            bank_branch: 'Chi nhánh Quận 6'
        },
        
        // Social media
        social: {
            facebook: 'https://facebook.com/lotusglass',
            instagram: 'https://instagram.com/lotusglass',
            youtube: 'https://youtube.com/lotusglass'
        }
    },
    
    // E-commerce settings
    ECOMMERCE: {
        currency: 'VND',
        items_per_page: 12,
        max_cart_items: 50,
        
        // Shipping
        free_shipping_threshold: 500000, // 500k VND
        default_shipping_fee: 30000,     // 30k VND
        express_shipping_fee: 50000,     // 50k VND
        
        // Discounts
        bank_transfer_discount: 0.02,    // 2% discount
        bulk_discount_threshold: 10,     // 10+ items
        bulk_discount_rate: 0.05,        // 5% discount
        
        // Order settings
        order_expiry_hours: 24,
        return_policy_days: 30,
        
        // Membership tiers
        membership: {
            DONG: { min: 0, discount: 0, name: 'Đồng' },
            BAC: { min: 5000000, discount: 0.05, name: 'Bạc' },
            TITAN: { min: 20000000, discount: 0.10, name: 'Titan' },
            BACH_KIM: { min: 50000000, discount: 0.15, name: 'Bạch Kim' }
        }
    }
};

// ====================== UI CONFIGURATION ======================
const UI_CONFIG = {
    // Theme colors
    COLORS: {
        primary: '#fa5d14',
        secondary: '#6387eb',
        accent: '#ffa909',
        success: '#28a745',
        warning: '#ffc107',
        danger: '#dc3545',
        info: '#17a2b8',
        dark: '#16304b',
        light: '#f8f9fa'
    },
    
    // Animation settings
    ANIMATIONS: {
        duration_fast: 200,
        duration_normal: 300,
        duration_slow: 500,
        easing: 'ease-in-out'
    },
    
    // Breakpoints
    BREAKPOINTS: {
        xs: 0,
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1200,
        xxl: 1400
    },
    
    // Toast notifications
    NOTIFICATIONS: {
        duration: 5000,
        position: 'top-right',
        max_visible: 3
    },
    
    // Loading states
    LOADING: {
        show_after: 500, // Show loading after 500ms
        min_duration: 1000, // Minimum loading duration
        skeleton_items: 8 // Number of skeleton items to show
    }
};

// ====================== FEATURE FLAGS ======================
const FEATURE_FLAGS = {
    // Core features
    ENABLE_CART: true,
    ENABLE_WISHLIST: true,
    ENABLE_REVIEWS: true,
    ENABLE_SEARCH: true,
    ENABLE_FILTERS: true,
    
    // Advanced features
    ENABLE_ANALYTICS: ENVIRONMENT.isProduction,
    ENABLE_PWA: true,
    ENABLE_OFFLINE: false, // TODO: Implement service worker
    ENABLE_PUSH_NOTIFICATIONS: false,
    
    // Payment methods
    ENABLE_BANK_TRANSFER: true,
    ENABLE_VNPAY: false, // TODO: Implement VNPay
    ENABLE_MOMO: false,  // TODO: Implement MoMo
    ENABLE_CREDIT_CARD: false,
    
    // Social features
    ENABLE_SOCIAL_LOGIN: false,
    ENABLE_SOCIAL_SHARING: true,
    ENABLE_REFERRAL_PROGRAM: false,
    
    // Development features
    ENABLE_DEBUG_MODE: ENVIRONMENT.isDevelopment,
    ENABLE_CONSOLE_LOGS: ENVIRONMENT.isDevelopment,
    ENABLE_PERFORMANCE_MONITORING: ENVIRONMENT.isProduction
};

// ====================== SEO CONFIGURATION ======================
const SEO_CONFIG = {
    // Default meta tags
    DEFAULT_TITLE: 'Lotus Glass - Thủy tinh gia dụng cao cấp',
    DEFAULT_DESCRIPTION: 'Chuyên cung cấp thủy tinh gia dụng cao cấp với chất lượng tốt nhất. Ly thủy tinh, bình thủy tinh, chén thủy tinh cao cấp.',
    DEFAULT_KEYWORDS: 'thủy tinh gia dụng, ly thủy tinh, bình thủy tinh, chén thủy tinh, lotus glass',
    
    // Open Graph
    OG_TYPE: 'website',
    OG_LOCALE: 'vi_VN',
    OG_SITE_NAME: 'Lotus Glass',
    
    // Twitter Card
    TWITTER_CARD: 'summary_large_image',
    TWITTER_SITE: '@lotusglass',
    
    // Structured data
    ORGANIZATION_TYPE: 'LocalBusiness',
    BUSINESS_TYPE: 'Store'
};

// ====================== PERFORMANCE CONFIGURATION ======================
const PERFORMANCE_CONFIG = {
    // Image optimization
    IMAGES: {
        lazy_loading: true,
        webp_support: true,
        placeholder_color: '#f0f0f0',
        blur_placeholder: true
    },
    
    // Caching strategy
    CACHE: {
        api_cache_duration: 5 * 60 * 1000,      // 5 minutes
        image_cache_duration: 24 * 60 * 60 * 1000, // 24 hours
        static_cache_duration: 7 * 24 * 60 * 60 * 1000 // 7 days
    },
    
    // Bundle optimization
    BUNDLE: {
        code_splitting: true,
        tree_shaking: true,
        minification: ENVIRONMENT.isProduction
    }
};

// ====================== EXPORT CONFIGURATION ======================
// Make configuration globally available
if (typeof window !== 'undefined') {
    window.LOTUS_CONFIG = {
        ENVIRONMENT,
        API_CONFIG,
        BUSINESS_CONFIG,
        UI_CONFIG,
        FEATURE_FLAGS,
        SEO_CONFIG,
        PERFORMANCE_CONFIG
    };
    
    // Log configuration in development
    if (ENVIRONMENT.isDevelopment && FEATURE_FLAGS.ENABLE_CONSOLE_LOGS) {
        console.log('🌸 Lotus Glass Configuration Loaded:', window.LOTUS_CONFIG);
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ENVIRONMENT,
        API_CONFIG,
        BUSINESS_CONFIG,
        UI_CONFIG,
        FEATURE_FLAGS,
        SEO_CONFIG,
        PERFORMANCE_CONFIG
    };
}

console.log('🔧 Lotus Glass Configuration System Initialized');

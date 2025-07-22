/**
 * 🌸 LOTUS GLASS - OPTIMIZED CORE JAVASCRIPT
 * Combined and minified critical functionality for better performance
 * Version: 5.0 Optimized - January 2025
 */

// ====================== PERFORMANCE UTILITIES ======================
const PerfUtils = {
    // Optimized debounce
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Optimized throttle
    throttle: (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // RAF wrapper
    raf: (callback) => {
        return 'requestAnimationFrame' in window ? 
            requestAnimationFrame(callback) : 
            setTimeout(callback, 16);
    }
};

// ====================== OPTIMIZED LAZY LOADING ======================
class OptimizedLazyLoader {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                this.handleIntersection.bind(this),
                { rootMargin: '50px 0px', threshold: 0.01 }
            );
            this.observeImages();
        } else {
            this.loadAllImages();
        }
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadImage(entry.target);
                this.observer.unobserve(entry.target);
            }
        });
    }

    observeImages() {
        document.querySelectorAll('img[data-src]').forEach(img => {
            this.observer.observe(img);
        });
    }

    loadImage(img) {
        const src = img.dataset.src;
        if (src) {
            img.src = src;
            img.classList.add('loaded');
            img.removeAttribute('data-src');
        }
    }

    loadAllImages() {
        document.querySelectorAll('img[data-src]').forEach(img => this.loadImage(img));
    }
}

// ====================== OPTIMIZED CACHE MANAGER ======================
class OptimizedCache {
    constructor(maxSize = 50) {
        this.cache = new Map();
        this.timestamps = new Map();
        this.maxSize = maxSize;
    }

    set(key, value, ttl = 300000) { // 5 minutes default
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
            this.timestamps.delete(firstKey);
        }
        this.cache.set(key, value);
        this.timestamps.set(key, Date.now() + ttl);
    }

    get(key) {
        const timestamp = this.timestamps.get(key);
        if (!timestamp || Date.now() > timestamp) {
            this.cache.delete(key);
            this.timestamps.delete(key);
            return null;
        }
        return this.cache.get(key);
    }

    clear() {
        this.cache.clear();
        this.timestamps.clear();
    }
}

// ====================== OPTIMIZED API CLIENT ======================
class OptimizedAPI {
    constructor() {
        this.cache = new OptimizedCache();
        this.baseURL = window.LOTUS_CONFIG?.API_CONFIG?.ENDPOINTS?.PRIMARY || '';
        this.timeout = window.LOTUS_CONFIG?.API_CONFIG?.SETTINGS?.TIMEOUT || 8000;
    }

    async request(endpoint, options = {}) {
        const cacheKey = `${endpoint}_${JSON.stringify(options)}`;
        const cached = this.cache.get(cacheKey);
        
        if (cached && options.method !== 'POST') {
            return cached;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                ...options,
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            if (options.method !== 'POST') {
                this.cache.set(cacheKey, data);
            }

            return data;
        } catch (error) {
            clearTimeout(timeoutId);
            console.error('API Request failed:', error);
            throw error;
        }
    }

    get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }

    post(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
}

// ====================== OPTIMIZED UI COMPONENTS ======================
class OptimizedUI {
    constructor() {
        this.init();
    }

    init() {
        this.setupSmoothScrolling();
        this.setupFormValidation();
        this.setupTooltips();
        this.setupHeaderFunctionality();
    }

    setupHeaderFunctionality() {
        // Search toggle functionality
        const searchToggle = document.getElementById('searchToggle');
        if (searchToggle) {
            searchToggle.addEventListener('click', this.toggleSearch.bind(this));
        }

        // Update cart badge
        this.updateCartBadge();

        // Update wishlist badge
        this.updateWishlistBadge();

        // Active navigation highlighting
        this.highlightActiveNavigation();

        // Mobile menu enhancements
        this.setupMobileMenu();
    }

    toggleSearch() {
        // Create or show search modal
        let searchModal = document.getElementById('searchModal');
        if (!searchModal) {
            this.createSearchModal();
            searchModal = document.getElementById('searchModal');
        }

        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            const modal = new bootstrap.Modal(searchModal);
            modal.show();
        }
    }

    createSearchModal() {
        const modalHTML = `
            <div class="modal fade" id="searchModal" tabindex="-1" aria-labelledby="searchModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header border-0">
                            <h5 class="modal-title fw-bold" id="searchModalLabel">
                                <i class="fas fa-search me-2 text-primary"></i>
                                Tìm kiếm sản phẩm
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Đóng"></button>
                        </div>
                        <div class="modal-body">
                            <form id="headerSearchForm">
                                <div class="input-group">
                                    <input type="search" class="form-control form-control-lg"
                                           placeholder="Nhập từ khóa tìm kiếm..."
                                           aria-label="Tìm kiếm sản phẩm"
                                           id="headerSearchInput">
                                    <button type="submit" class="btn btn-primary">
                                        <i class="fas fa-search"></i>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Bind search form events
        const searchForm = document.getElementById('headerSearchForm');
        if (searchForm) {
            searchForm.addEventListener('submit', this.handleSearch.bind(this));
        }
    }

    handleSearch(event) {
        event.preventDefault();
        const searchInput = document.getElementById('headerSearchInput');
        const query = searchInput.value.trim();

        if (query) {
            // Close modal
            const searchModal = bootstrap.Modal.getInstance(document.getElementById('searchModal'));
            searchModal.hide();

            // Navigate to store with search query
            if (typeof LotusGlassApp !== 'undefined') {
                LotusGlassApp.navigateToPage('store', { search: query });
            } else {
                // Fallback navigation
                window.location.href = `store.html?search=${encodeURIComponent(query)}`;
            }
        }
    }

    updateCartBadge() {
        const cartBadge = document.getElementById('cartBadge');
        if (cartBadge) {
            // Get cart count from localStorage or app state
            let cartCount = 0;
            try {
                const cart = JSON.parse(localStorage.getItem('lotus_cart') || '[]');
                cartCount = cart.reduce((total, item) => total + (item.quantity || 0), 0);
            } catch (e) {
                console.warn('Error reading cart data:', e);
            }

            if (cartCount > 0) {
                cartBadge.textContent = cartCount > 99 ? '99+' : cartCount;
                cartBadge.style.display = 'flex';
            } else {
                cartBadge.style.display = 'none';
            }
        }
    }

    updateWishlistBadge() {
        const wishlistBadge = document.querySelector('.wishlist-count');
        if (wishlistBadge) {
            // Get wishlist count from localStorage or app state
            let wishlistCount = 0;
            try {
                const wishlist = JSON.parse(localStorage.getItem('lotus_wishlist') || '[]');
                wishlistCount = wishlist.length;
            } catch (e) {
                console.warn('Error reading wishlist data:', e);
            }

            if (wishlistCount > 0) {
                wishlistBadge.textContent = wishlistCount > 99 ? '99+' : wishlistCount;
                wishlistBadge.style.display = 'flex';
            } else {
                wishlistBadge.style.display = 'none';
            }
        }
    }

    highlightActiveNavigation() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-list a, .mobile-nav a');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    setupMobileMenu() {
        // Enhanced mobile menu functionality
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) {
            mobileMenu.addEventListener('show.bs.offcanvas', () => {
                document.body.style.overflow = 'hidden';
            });

            mobileMenu.addEventListener('hide.bs.offcanvas', () => {
                document.body.style.overflow = '';
            });
        }
    }

    setupSmoothScrolling() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    }

    setupFormValidation() {
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.classList.contains('needs-validation')) {
                if (!form.checkValidity()) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                form.classList.add('was-validated');
            }
        });
    }

    setupTooltips() {
        // Simple tooltip implementation
        document.addEventListener('mouseenter', (e) => {
            const element = e.target.closest('[data-tooltip]');
            if (element) {
                this.showTooltip(element);
            }
        });

        document.addEventListener('mouseleave', (e) => {
            const element = e.target.closest('[data-tooltip]');
            if (element) {
                this.hideTooltip(element);
            }
        });
    }

    showTooltip(element) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip-popup';
        tooltip.textContent = element.dataset.tooltip;
        tooltip.style.cssText = `
            position: absolute;
            background: #333;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s;
        `;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
        
        PerfUtils.raf(() => {
            tooltip.style.opacity = '1';
        });
        
        element._tooltip = tooltip;
    }

    hideTooltip(element) {
        if (element._tooltip) {
            element._tooltip.remove();
            delete element._tooltip;
        }
    }

    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#17a2b8'};
        `;
        
        document.body.appendChild(notification);
        
        PerfUtils.raf(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
}

// ====================== OPTIMIZED INITIALIZATION ======================
class LotusOptimized {
    constructor() {
        this.lazyLoader = null;
        this.api = null;
        this.ui = null;
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // Initialize core components
        this.lazyLoader = new OptimizedLazyLoader();
        this.api = new OptimizedAPI();
        this.ui = new OptimizedUI();

        // Setup performance monitoring
        this.setupPerformanceMonitoring();

        console.log('🌸 Lotus Glass Optimized v5.0 initialized');
    }

    setupPerformanceMonitoring() {
        if ('performance' in window && window.LOTUS_CONFIG?.FEATURE_FLAGS?.ENABLE_PERFORMANCE_MONITORING) {
            window.addEventListener('load', () => {
                const navigation = performance.getEntriesByType('navigation')[0];
                const loadTime = navigation.loadEventEnd - navigation.navigationStart;
                
                if (loadTime > 3000) {
                    console.warn(`Slow page load: ${loadTime}ms`);
                }
            });
        }
    }
}

// ====================== GLOBAL EXPORTS ======================
if (typeof window !== 'undefined') {
    window.LotusOptimized = LotusOptimized;
    window.PerfUtils = PerfUtils;
    
    // Auto-initialize
    new LotusOptimized();
}

// Module export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LotusOptimized, PerfUtils, OptimizedAPI, OptimizedUI };
}

console.log('🚀 Lotus Glass Optimized Core Loaded');

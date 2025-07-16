/**
 * 🌸 LOTUS GLASS - COMMON FUNCTIONS
 * Shared functionality across all pages
 */

// ====================== GLOBAL STATE ======================
const LotusApp = {
    // Cart management
    cart: JSON.parse(localStorage.getItem('lotus_cart')) || [],
    wishlist: JSON.parse(localStorage.getItem('lotus_wishlist')) || [],
    user: JSON.parse(localStorage.getItem('lotus_user')) || null,
    
    // UI state
    isLoading: false,
    currentPage: 1,
    
    // Configuration
    config: {},
    
    // Initialize app
    init() {
        this.loadConfig();
        this.updateCartUI();
        this.updateWishlistUI();
        this.setupEventListeners();
        console.log('🌸 Lotus Glass App initialized');
    },
    
    // Load site configuration
    async loadConfig() {
        try {
            const response = await getSiteConfig();
            if (response.success) {
                this.config = response.data;
                this.applyConfig();
            }
        } catch (error) {
            console.error('Failed to load config:', error);
        }
    },
    
    // Apply configuration to UI
    applyConfig() {
        if (this.config.ui) {
            document.documentElement.style.setProperty('--primary-color', this.config.ui.primary_color || '#2E8B57');
        }
    },
    
    // Setup global event listeners
    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
            });
        }
        
        // Search form
        const searchForm = document.querySelector('.search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', this.handleSearch.bind(this));
        }
        
        // Cart icon click
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.addEventListener('click', () => {
                window.location.href = 'cart.html';
            });
        }
    },
    
    // Handle search
    handleSearch(e) {
        e.preventDefault();
        const query = e.target.querySelector('input[name="q"]').value.trim();
        if (query) {
            window.location.href = `store.html?search=${encodeURIComponent(query)}`;
        }
    }
};

// ====================== CART FUNCTIONS ======================

/**
 * Add product to cart
 * @param {string} productId - Product ID
 * @param {number} quantity - Quantity to add
 */
function addToCart(productId, quantity = 1) {
    // Find existing item
    const existingItem = LotusApp.cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        // Get product info (you might want to pass this as parameter)
        LotusApp.cart.push({
            productId,
            quantity,
            addedAt: new Date().toISOString()
        });
    }
    
    // Save to localStorage
    localStorage.setItem('lotus_cart', JSON.stringify(LotusApp.cart));
    
    // Update UI
    LotusApp.updateCartUI();
    
    // Show success message
    showSuccess('Đã thêm sản phẩm vào giỏ hàng!');
    
    console.log('Added to cart:', productId, quantity);
}

/**
 * Remove product from cart
 * @param {string} productId - Product ID
 */
function removeFromCart(productId) {
    LotusApp.cart = LotusApp.cart.filter(item => item.productId !== productId);
    localStorage.setItem('lotus_cart', JSON.stringify(LotusApp.cart));
    LotusApp.updateCartUI();
    showSuccess('Đã xóa sản phẩm khỏi giỏ hàng!');
}

/**
 * Update cart item quantity
 * @param {string} productId - Product ID
 * @param {number} quantity - New quantity
 */
function updateCartQuantity(productId, quantity) {
    const item = LotusApp.cart.find(item => item.productId === productId);
    
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            localStorage.setItem('lotus_cart', JSON.stringify(LotusApp.cart));
            LotusApp.updateCartUI();
        }
    }
}

/**
 * Clear entire cart
 */
function clearCart() {
    LotusApp.cart = [];
    localStorage.setItem('lotus_cart', JSON.stringify(LotusApp.cart));
    LotusApp.updateCartUI();
    showSuccess('Đã xóa tất cả sản phẩm khỏi giỏ hàng!');
}

/**
 * Get cart total
 * @returns {number} Total amount
 */
function getCartTotal() {
    return LotusApp.cart.reduce((total, item) => {
        // You'll need to get product price here
        return total + (item.quantity * (item.price || 0));
    }, 0);
}

// ====================== WISHLIST FUNCTIONS ======================

/**
 * Toggle product in wishlist
 * @param {string} productId - Product ID
 */
function toggleWishlist(productId) {
    const index = LotusApp.wishlist.findIndex(item => item.productId === productId);
    
    if (index > -1) {
        LotusApp.wishlist.splice(index, 1);
        showSuccess('Đã xóa khỏi danh sách yêu thích!');
    } else {
        LotusApp.wishlist.push({
            productId,
            addedAt: new Date().toISOString()
        });
        showSuccess('Đã thêm vào danh sách yêu thích!');
    }
    
    localStorage.setItem('lotus_wishlist', JSON.stringify(LotusApp.wishlist));
    LotusApp.updateWishlistUI();
}

/**
 * Check if product is in wishlist
 * @param {string} productId - Product ID
 * @returns {boolean} Is in wishlist
 */
function isInWishlist(productId) {
    return LotusApp.wishlist.some(item => item.productId === productId);
}

// ====================== UI UPDATE FUNCTIONS ======================

/**
 * Update cart UI elements
 */
LotusApp.updateCartUI = function() {
    const cartBadge = document.querySelector('.cart-badge');
    const cartCount = document.querySelector('.cart-count');
    
    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartBadge) {
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
};

/**
 * Update wishlist UI elements
 */
LotusApp.updateWishlistUI = function() {
    const wishlistBadge = document.querySelector('.wishlist-badge');
    const wishlistCount = document.querySelector('.wishlist-count');
    
    const totalItems = this.wishlist.length;
    
    if (wishlistBadge) {
        wishlistBadge.textContent = totalItems;
        wishlistBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    if (wishlistCount) {
        wishlistCount.textContent = totalItems;
    }
};

// ====================== UTILITY FUNCTIONS ======================

/**
 * Show toast notification
 * @param {string} message - Message to show
 * @param {string} type - Type: success, error, warning, info
 */
function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast-notification');
    existingToasts.forEach(toast => toast.remove());
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${getToastIcon(type)} me-2"></i>
            <span>${message}</span>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles if not exists
    if (!document.querySelector('#toast-styles')) {
        const styles = document.createElement('style');
        styles.id = 'toast-styles';
        styles.textContent = `
            .toast-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                min-width: 300px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                animation: slideInRight 0.3s ease;
            }
            .toast-notification.success { border-left: 4px solid #28a745; }
            .toast-notification.error { border-left: 4px solid #dc3545; }
            .toast-notification.warning { border-left: 4px solid #ffc107; }
            .toast-notification.info { border-left: 4px solid #17a2b8; }
            .toast-content {
                padding: 16px;
                display: flex;
                align-items: center;
            }
            .toast-close {
                margin-left: auto;
                background: none;
                border: none;
                cursor: pointer;
                opacity: 0.7;
            }
            .toast-close:hover { opacity: 1; }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}

/**
 * Get icon for toast type
 * @param {string} type - Toast type
 * @returns {string} Icon class
 */
function getToastIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit time in ms
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Smooth scroll to element
 * @param {string} selector - Element selector
 */
function scrollToElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ====================== INITIALIZATION ======================

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => LotusApp.init());
} else {
    LotusApp.init();
}

// Make functions globally available
window.LotusApp = LotusApp;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.clearCart = clearCart;
window.toggleWishlist = toggleWishlist;
window.isInWishlist = isInWishlist;
window.showToast = showToast;

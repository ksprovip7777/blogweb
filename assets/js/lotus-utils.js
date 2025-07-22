/**
 * Lotus Glass Global Utilities v4.0
 * Common functions and utilities used across the website
 */

// ====================== GLOBAL CONSTANTS ======================
const LOTUS_CONFIG = {
    API_BASE_URL: 'https://api.lotusglass.vn',
    STORAGE_PREFIX: 'lotus_',
    CURRENCY: 'VND',
    PHONE_REGEX: /^[0-9]{10,11}$/,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MEMBER_LEVELS: {
        BRONZE: { name: 'Đồng', discount: 0, color: '#CD7F32' },
        SILVER: { name: 'Bạc', discount: 5, color: '#C0C0C0' },
        GOLD: { name: 'Vàng', discount: 10, color: '#FFD700' },
        PLATINUM: { name: 'Bạch Kim', discount: 15, color: '#E5E4E2' },
        DIAMOND: { name: 'Kim Cương', discount: 20, color: '#B9F2FF' }
    }
};

// ====================== UTILITY FUNCTIONS ======================

/**
 * Format currency to Vietnamese format
 */
function formatCurrency(amount) {
    if (typeof amount !== 'number') {
        amount = parseFloat(amount) || 0;
    }
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

/**
 * Format date to Vietnamese format
 */
function formatDate(dateString) {
    if (!dateString) return 'Không xác định';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Format phone number
 */
function formatPhoneNumber(phone) {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1-$2-$3');
    } else if (cleaned.length === 11) {
        return cleaned.replace(/(\d{4})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    return phone;
}

/**
 * Validate email format
 */
function validateEmail(email) {
    return LOTUS_CONFIG.EMAIL_REGEX.test(email);
}

/**
 * Validate phone number format
 */
function validatePhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return LOTUS_CONFIG.PHONE_REGEX.test(cleaned);
}

/**
 * Generate unique ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Debounce function
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

// ====================== STORAGE FUNCTIONS ======================

/**
 * Local storage wrapper with error handling
 */
const LotusStorage = {
    set(key, value) {
        try {
            localStorage.setItem(LOTUS_CONFIG.STORAGE_PREFIX + key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            return false;
        }
    },

    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(LOTUS_CONFIG.STORAGE_PREFIX + key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Storage get error:', error);
            return defaultValue;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(LOTUS_CONFIG.STORAGE_PREFIX + key);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    },

    clear() {
        try {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(LOTUS_CONFIG.STORAGE_PREFIX)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    }
};

// ====================== NOTIFICATION FUNCTIONS ======================

/**
 * Show toast notification
 */
function showToast(message, type = 'info', duration = 3000) {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.lotus-toast');
    existingToasts.forEach(toast => toast.remove());

    const toast = document.createElement('div');
    toast.className = `lotus-toast lotus-toast-${type}`;
    toast.innerHTML = `
        <div class="lotus-toast-content">
            <i class="fas fa-${getToastIcon(type)} me-2"></i>
            <span>${message}</span>
            <button type="button" class="lotus-toast-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    document.body.appendChild(toast);

    // Auto remove after duration
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, duration);
}

/**
 * Show alert modal
 */
function showAlert(message, type = 'info', title = '') {
    const alertModal = document.createElement('div');
    alertModal.className = 'modal fade';
    alertModal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h5 class="modal-title">
                        <i class="fas fa-${getToastIcon(type)} me-2 text-${type}"></i>
                        ${title || getAlertTitle(type)}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p class="mb-0">${message}</p>
                </div>
                <div class="modal-footer border-0">
                    <button type="button" class="lotus-btn lotus-btn-primary" data-bs-dismiss="modal">
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(alertModal);
    const modal = new bootstrap.Modal(alertModal);
    modal.show();

    // Remove modal after hiding
    alertModal.addEventListener('hidden.bs.modal', () => {
        document.body.removeChild(alertModal);
    });
}

/**
 * Get toast icon based on type
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
 * Get alert title based on type
 */
function getAlertTitle(type) {
    const titles = {
        success: 'Thành công',
        error: 'Lỗi',
        warning: 'Cảnh báo',
        info: 'Thông báo'
    };
    return titles[type] || 'Thông báo';
}

// ====================== CART FUNCTIONS ======================

/**
 * Add item to cart
 */
function addToCart(productId, quantity = 1, options = {}) {
    const cart = LotusStorage.get('cart', []);
    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            productId,
            quantity,
            addedAt: new Date().toISOString(),
            ...options
        });
    }

    LotusStorage.set('cart', cart);
    updateCartCount();
    
    // Trigger cart update event
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }));
    
    return true;
}

/**
 * Remove item from cart
 */
function removeFromCart(productId) {
    const cart = LotusStorage.get('cart', []);
    const updatedCart = cart.filter(item => item.productId !== productId);
    
    LotusStorage.set('cart', updatedCart);
    updateCartCount();
    
    // Trigger cart update event
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: updatedCart } }));
    
    return true;
}

/**
 * Update cart count in UI
 */
function updateCartCount() {
    const cart = LotusStorage.get('cart', []);
    const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    
    const cartCountElements = document.querySelectorAll('.cart-count, .cart-count-mobile');
    cartCountElements.forEach(element => {
        element.textContent = count;
        element.style.display = count > 0 ? 'inline' : 'none';
    });
}

// ====================== WISHLIST FUNCTIONS ======================

/**
 * Toggle item in wishlist
 */
function toggleWishlist(productId) {
    const wishlist = LotusStorage.get('wishlist', []);
    const index = wishlist.indexOf(productId);

    if (index > -1) {
        wishlist.splice(index, 1);
        showToast('Đã xóa khỏi danh sách yêu thích', 'info');
    } else {
        wishlist.push(productId);
        showToast('Đã thêm vào danh sách yêu thích', 'success');
    }

    LotusStorage.set('wishlist', wishlist);
    updateWishlistCount();
    
    // Trigger wishlist update event
    window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: { wishlist } }));
    
    return !index > -1;
}

/**
 * Check if item is in wishlist
 */
function isInWishlist(productId) {
    const wishlist = LotusStorage.get('wishlist', []);
    return wishlist.includes(productId);
}

/**
 * Update wishlist count in UI
 */
function updateWishlistCount() {
    const wishlist = LotusStorage.get('wishlist', []);
    const count = wishlist.length;
    
    const wishlistCountElements = document.querySelectorAll('.wishlist-count, .wishlist-count-mobile');
    wishlistCountElements.forEach(element => {
        element.textContent = count;
        element.style.display = count > 0 ? 'inline' : 'none';
    });
}

// ====================== USER FUNCTIONS ======================

/**
 * Get current user
 */
function getCurrentUser() {
    return LotusStorage.get('user', null);
}

/**
 * Set current user
 */
function setCurrentUser(user) {
    LotusStorage.set('user', user);
    
    // Update UI
    updateUserUI();
    
    // Trigger user update event
    window.dispatchEvent(new CustomEvent('userUpdated', { detail: { user } }));
}

/**
 * Logout user
 */
function logout() {
    LotusStorage.remove('user');
    updateUserUI();
    showToast('Đã đăng xuất thành công', 'success');
    
    // Trigger logout event
    window.dispatchEvent(new CustomEvent('userLoggedOut'));
    
    // Redirect to home if on account page
    if (window.location.pathname.includes('account.html')) {
        window.location.href = 'index.html';
    }
}

/**
 * Update user UI elements
 */
function updateUserUI() {
    const user = getCurrentUser();
    
    // Update navigation user info
    const userInfo = document.getElementById('userInfo');
    const loginButtons = document.getElementById('loginButtons');
    
    if (userInfo && loginButtons) {
        if (user) {
            userInfo.style.display = 'block';
            loginButtons.style.display = 'none';
            
            const userName = document.getElementById('userName');
            const userLevel = document.getElementById('userLevel');
            
            if (userName) userName.textContent = user.name;
            if (userLevel) userLevel.textContent = user.memberLevel || 'Đồng';
        } else {
            userInfo.style.display = 'none';
            loginButtons.style.display = 'flex';
        }
    }
    
    // Update mobile menu
    if (window.mobileMenu) {
        window.mobileMenu.updateUserState();
    }
}

// ====================== INITIALIZATION ======================

/**
 * Initialize global utilities
 */
function initLotusUtils() {
    // Update counts on page load
    updateCartCount();
    updateWishlistCount();
    updateUserUI();
    
    // Listen for storage changes from other tabs
    window.addEventListener('storage', (e) => {
        if (e.key && e.key.startsWith(LOTUS_CONFIG.STORAGE_PREFIX)) {
            updateCartCount();
            updateWishlistCount();
            updateUserUI();
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initLotusUtils);

// Export functions for global access
window.LotusUtils = {
    formatCurrency,
    formatDate,
    formatPhoneNumber,
    validateEmail,
    validatePhone,
    generateId,
    debounce,
    throttle,
    LotusStorage,
    showToast,
    showAlert,
    addToCart,
    removeFromCart,
    updateCartCount,
    toggleWishlist,
    isInWishlist,
    updateWishlistCount,
    getCurrentUser,
    setCurrentUser,
    logout,
    updateUserUI
};

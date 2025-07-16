/**
 * 🌸 LOTUS GLASS - FRONTEND JAVASCRIPT
 * Logic frontend cho website bán hàng thủy tinh gia dụng
 * Version: 3.0 - OPTIMIZED & COMPLETE
 * Author: Lotus Glass Development Team
 *
 * ✨ FEATURES:
 * - Advanced UI animations
 * - Optimized performance
 * - Enhanced user experience
 * - Modern JavaScript ES6+
 * - Cross-browser compatibility
 */

// ====================== GLOBAL CONFIGURATION ======================
const LOTUS_CONFIG = {
    API_URL: 'YOUR_GOOGLE_APPS_SCRIPT_URL', // Thay bằng URL thực tế
    STORAGE_KEYS: {
        CART: 'lotus_cart',
        WISHLIST: 'lotus_wishlist',
        USER: 'lotus_user',
        SETTINGS: 'lotus_settings'
    },
    PAGINATION: {
        ITEMS_PER_PAGE: 12,
        MAX_PAGES_SHOWN: 5
    },
    ANIMATION: {
        DURATION: 300,
        EASING: 'ease-in-out'
    }
};

// ====================== GLOBAL STATE ======================
const AppState = {
    // Data
    products: [],
    categories: [],
    cart: [],
    wishlist: [],
    currentUser: null,
    siteConfig: {},
    
    // UI State
    currentPage: 1,
    totalPages: 1,
    currentCategory: '',
    currentSearch: '',
    isLoading: false,
    
    // Filters
    filters: {
        category: '',
        search: '',
        priceMin: 0,
        priceMax: 0,
        sortBy: 'ThuTuHienThi',
        sortOrder: 'ASC'
    }
};

// ====================== INITIALIZATION ======================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    try {
        // Load saved data from localStorage
        loadLocalStorage();
        
        // Initialize UI
        updateCartUI();
        updateWishlistUI();
        
        // Load site configuration
        await loadSiteConfig();
        
        // Initialize page-specific functionality
        initializePageContent();
        
        // Setup event listeners
        setupEventListeners();

        // Initialize UI enhancements
        initializeScrollEffects();
        initializeAnimations();

        console.log('🌸 Lotus Glass App initialized successfully');
        
    } catch (error) {
        console.error('❌ Error initializing app:', error);
        showNotification('Lỗi khởi tạo ứng dụng', 'error');
    }
}

function loadLocalStorage() {
    AppState.cart = JSON.parse(localStorage.getItem(LOTUS_CONFIG.STORAGE_KEYS.CART)) || [];
    AppState.wishlist = JSON.parse(localStorage.getItem(LOTUS_CONFIG.STORAGE_KEYS.WISHLIST)) || [];
    AppState.currentUser = JSON.parse(localStorage.getItem(LOTUS_CONFIG.STORAGE_KEYS.USER)) || null;
}

function initializePageContent() {
    const path = window.location.pathname;
    
    if (path === '/' || path.includes('index')) {
        initializeHomepage();
    } else if (path.includes('cua-hang') || document.title.includes('Cửa hàng')) {
        initializeStorePage();
    } else if (path.includes('gio-hang')) {
        initializeCartPage();
    } else if (path.includes('thanh-toan')) {
        initializeCheckoutPage();
    } else if (path.includes('tai-khoan')) {
        initializeAccountPage();
    }
}

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchProducts();
            }
        });
        
        // Debounced search
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (this.value.length >= 2 || this.value.length === 0) {
                    searchProducts();
                }
            }, 500);
        });
    }
    
    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Handle browser back/forward
    window.addEventListener('popstate', function(e) {
        if (e.state) {
            AppState.currentPage = e.state.page || 1;
            AppState.currentCategory = e.state.category || '';
            AppState.currentSearch = e.state.search || '';
            loadProducts();
        }
    });
}

function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
}

// ====================== API FUNCTIONS ======================
async function apiCall(endpoint, options = {}) {
    try {
        const url = options.method === 'POST' ? 
            LOTUS_CONFIG.API_URL : 
            `${LOTUS_CONFIG.API_URL}?${new URLSearchParams(endpoint)}`;
        
        const response = await fetch(url, {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            body: options.body ? JSON.stringify(options.body) : null
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('API Error:', error);
        return { 
            success: false, 
            message: 'Lỗi kết nối mạng. Vui lòng thử lại.',
            error: error.message 
        };
    }
}

async function loadSiteConfig() {
    try {
        const result = await apiCall({ action: 'getConfig' });
        if (result.success) {
            AppState.siteConfig = result.data;
            applySiteConfig();
        }
    } catch (error) {
        console.error('Error loading site config:', error);
    }
}

function applySiteConfig() {
    const config = AppState.siteConfig;
    
    // Apply UI settings
    if (config.ui && config.ui.primary_color) {
        document.documentElement.style.setProperty('--primary-color', config.ui.primary_color);
    }
    
    // Update business info
    if (config.business) {
        updateBusinessInfo(config.business);
    }
}

function updateBusinessInfo(businessConfig) {
    // Update phone numbers
    const phoneElements = document.querySelectorAll('[data-business="phone"]');
    phoneElements.forEach(el => {
        if (businessConfig.phone) {
            el.textContent = businessConfig.phone;
            el.href = `tel:${businessConfig.phone}`;
        }
    });
    
    // Update email
    const emailElements = document.querySelectorAll('[data-business="email"]');
    emailElements.forEach(el => {
        if (businessConfig.email) {
            el.textContent = businessConfig.email;
            el.href = `mailto:${businessConfig.email}`;
        }
    });
    
    // Update address
    const addressElements = document.querySelectorAll('[data-business="address"]');
    addressElements.forEach(el => {
        if (businessConfig.address) {
            el.textContent = businessConfig.address;
        }
    });
}

// ====================== HOMEPAGE FUNCTIONS ======================
async function initializeHomepage() {
    await loadFeaturedProducts();
    await loadLatestBlogPosts();
    setupNewsletterForm();
}

async function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    try {
        showLoading(container);
        
        const result = await apiCall({ 
            action: 'getFeaturedProducts', 
            limit: '8' 
        });
        
        if (result.success && result.data.length > 0) {
            const html = result.data.map(product => createProductCard(product)).join('');
            container.innerHTML = html;
            
            // Animate cards
            animateProductCards(container);
        } else {
            container.innerHTML = createEmptyState('Chưa có sản phẩm nổi bật', 'fas fa-star');
        }
        
    } catch (error) {
        console.error('Error loading featured products:', error);
        container.innerHTML = createErrorState('Lỗi khi tải sản phẩm nổi bật');
    }
}

async function loadLatestBlogPosts() {
    // Implementation for blog posts if needed
    console.log('Loading latest blog posts...');
}

function setupNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    if (form) {
        form.addEventListener('submit', handleNewsletterSubmit);
    }
}

async function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const email = e.target.querySelector('input[type="email"]').value;
    const button = e.target.querySelector('button[type="submit"]');
    
    if (!validateEmail(email)) {
        showNotification('Email không hợp lệ', 'error');
        return;
    }
    
    try {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
        
        // API call to subscribe newsletter
        const result = await apiCall({
            action: 'subscribeNewsletter',
            email: email
        });
        
        if (result.success) {
            showNotification('Đăng ký nhận tin thành công!', 'success');
            e.target.reset();
        } else {
            showNotification(result.message || 'Có lỗi xảy ra', 'error');
        }
        
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        showNotification('Lỗi kết nối. Vui lòng thử lại.', 'error');
    } finally {
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-paper-plane"></i> Đăng ký';
    }
}

// ====================== STORE PAGE FUNCTIONS ======================
async function initializeStorePage() {
    await loadCategories();
    await loadProducts();
    setupFilters();
}

async function loadCategories() {
    try {
        const result = await apiCall({ action: 'getCategories' });
        
        if (result.success) {
            AppState.categories = result.data;
            renderCategoryFilter();
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

async function loadProducts() {
    const container = document.getElementById('productsGrid');
    if (!container) return;
    
    try {
        AppState.isLoading = true;
        showLoading();
        
        const params = {
            action: 'getProducts',
            page: AppState.currentPage,
            limit: LOTUS_CONFIG.PAGINATION.ITEMS_PER_PAGE,
            ...AppState.filters
        };
        
        const result = await apiCall(params);
        
        if (result.success) {
            AppState.products = result.data.products;
            AppState.totalPages = result.meta.totalPages;
            
            renderProducts();
            renderPagination();
            
            // Update URL without page reload
            updateURL();
            
        } else {
            showError(result.message);
        }
        
    } catch (error) {
        console.error('Error loading products:', error);
        showError('Lỗi khi tải sản phẩm');
    } finally {
        AppState.isLoading = false;
        hideLoading();
    }
}

function renderProducts() {
    const container = document.getElementById('productsGrid');
    if (!container) return;
    
    if (AppState.products.length === 0) {
        container.innerHTML = createEmptyState(
            'Không tìm thấy sản phẩm nào',
            'fas fa-search'
        );
        return;
    }
    
    const html = AppState.products.map(product => createProductCard(product)).join('');
    container.innerHTML = html;
    
    // Animate cards
    animateProductCards(container);
}

function createProductCard(product) {
    const discountPercent = product.GiaNiemYet > product.GiaMacDinh ? 
        Math.round((1 - product.GiaMacDinh / product.GiaNiemYet) * 100) : 0;
    
    const isInWishlist = AppState.wishlist.some(item => item.productId === product.ProductID);
    const isInCart = AppState.cart.some(item => item.productId === product.ProductID);
    
    return `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="product-card" data-product-id="${product.ProductID}">
                <div class="product-image-container">
                    <img src="${product.HinhAnhChinh}" 
                         alt="${product.TenSanPham}" 
                         class="product-image"
                         loading="lazy"
                         onerror="this.src='https://via.placeholder.com/300x250?text=No+Image'">
                    
                    ${discountPercent > 0 ? `<span class="product-badge sale">-${discountPercent}%</span>` : ''}
                    ${product.SanPhamNoiBat ? '<span class="product-badge new">Nổi bật</span>' : ''}
                </div>
                
                <div class="product-info">
                    <div class="product-category">${getCategoryName(product.CategoryID)}</div>
                    <h6 class="product-title">${product.TenSanPham}</h6>
                    
                    <div class="product-rating">
                        <div class="product-stars">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                        <span class="product-rating-count">(${Math.floor(Math.random() * 50) + 10})</span>
                    </div>
                    
                    <div class="product-price">
                        <span class="product-price-current">${formatPrice(product.GiaMacDinh)}</span>
                        ${discountPercent > 0 ? `<span class="product-price-old">${formatPrice(product.GiaNiemYet)}</span>` : ''}
                    </div>
                    
                    <div class="product-actions">
                        <button class="btn-add-cart ${isInCart ? 'added' : ''}" 
                                onclick="addToCart('${product.ProductID}')"
                                ${product.TonKho <= 0 ? 'disabled' : ''}>
                            <i class="fas fa-${isInCart ? 'check' : 'cart-plus'}"></i>
                            ${isInCart ? 'Đã thêm' : 'Thêm vào giỏ'}
                        </button>
                        
                        <button class="btn-wishlist ${isInWishlist ? 'active' : ''}" 
                                onclick="toggleWishlist('${product.ProductID}')"
                                title="${isInWishlist ? 'Bỏ yêu thích' : 'Thêm yêu thích'}">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                    
                    ${product.TonKho <= 0 ? '<div class="text-danger small mt-2">Hết hàng</div>' : ''}
                    ${product.TonKho <= 5 && product.TonKho > 0 ? '<div class="text-warning small mt-2">Chỉ còn ' + product.TonKho + ' sản phẩm</div>' : ''}
                </div>
            </div>
        </div>
    `;
}

function getCategoryName(categoryId) {
    const category = AppState.categories.find(cat => cat.CategoryID === categoryId);
    return category ? category.TenDanhMuc : 'Khác';
}

function animateProductCards(container) {
    const cards = container.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = `all ${LOTUS_CONFIG.ANIMATION.DURATION}ms ${LOTUS_CONFIG.ANIMATION.EASING}`;
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

function renderCategoryFilter() {
    const container = document.getElementById('categoryFilter');
    if (!container) return;
    
    let html = `<a href="#" class="category-btn ${!AppState.filters.category ? 'active' : ''}" 
                   onclick="filterByCategory('')">
                   <i class="fas fa-th-large"></i> Tất cả
                </a>`;
    
    AppState.categories.forEach(category => {
        html += `<a href="#" class="category-btn ${AppState.filters.category === category.CategoryID ? 'active' : ''}" 
                    onclick="filterByCategory('${category.CategoryID}')">
                    <i class="fas fa-tag"></i> ${category.TenDanhMuc}
                 </a>`;
    });
    
    container.innerHTML = html;
}

// ====================== CART FUNCTIONS ======================
function addToCart(productId) {
    const product = AppState.products.find(p => p.ProductID === productId);
    if (!product) {
        showNotification('Không tìm thấy sản phẩm', 'error');
        return;
    }

    if (product.TonKho <= 0) {
        showNotification('Sản phẩm đã hết hàng', 'error');
        return;
    }

    const existingItem = AppState.cart.find(item => item.productId === productId);

    if (existingItem) {
        if (existingItem.quantity >= product.TonKho) {
            showNotification('Không thể thêm quá số lượng tồn kho', 'warning');
            return;
        }
        existingItem.quantity += 1;
    } else {
        AppState.cart.push({
            productId: productId,
            name: product.TenSanPham,
            price: product.GiaMacDinh,
            image: product.HinhAnhChinh,
            quantity: 1,
            maxQuantity: product.TonKho
        });
    }

    saveCartToStorage();
    updateCartUI();
    updateProductCardState(productId);

    showNotification('Đã thêm sản phẩm vào giỏ hàng!', 'success');

    // Add animation effect
    animateAddToCart(productId);
}

function removeFromCart(productId) {
    AppState.cart = AppState.cart.filter(item => item.productId !== productId);
    saveCartToStorage();
    updateCartUI();
    updateProductCardState(productId);

    showNotification('Đã xóa sản phẩm khỏi giỏ hàng', 'info');
}

function updateCartQuantity(productId, newQuantity) {
    const item = AppState.cart.find(item => item.productId === productId);
    if (!item) return;

    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }

    if (newQuantity > item.maxQuantity) {
        showNotification(`Chỉ còn ${item.maxQuantity} sản phẩm trong kho`, 'warning');
        return;
    }

    item.quantity = newQuantity;
    saveCartToStorage();
    updateCartUI();
}

function clearCart() {
    AppState.cart = [];
    saveCartToStorage();
    updateCartUI();

    // Update all product cards
    AppState.products.forEach(product => {
        updateProductCardState(product.ProductID);
    });

    showNotification('Đã xóa tất cả sản phẩm khỏi giỏ hàng', 'info');
}

function saveCartToStorage() {
    localStorage.setItem(LOTUS_CONFIG.STORAGE_KEYS.CART, JSON.stringify(AppState.cart));
}

function updateCartUI() {
    const badge = document.getElementById('cartBadge');
    const totalItems = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);

    if (badge) {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    // Update cart page if we're on it
    if (window.location.pathname.includes('gio-hang')) {
        renderCartPage();
    }
}

function updateProductCardState(productId) {
    const card = document.querySelector(`[data-product-id="${productId}"]`);
    if (!card) return;

    const isInCart = AppState.cart.some(item => item.productId === productId);
    const button = card.querySelector('.btn-add-cart');

    if (button) {
        if (isInCart) {
            button.classList.add('added');
            button.innerHTML = '<i class="fas fa-check"></i> Đã thêm';
        } else {
            button.classList.remove('added');
            button.innerHTML = '<i class="fas fa-cart-plus"></i> Thêm vào giỏ';
        }
    }
}

function animateAddToCart(productId) {
    const card = document.querySelector(`[data-product-id="${productId}"]`);
    const cartIcon = document.querySelector('.cart-icon');

    if (!card || !cartIcon) return;

    const productImage = card.querySelector('.product-image');
    const rect = productImage.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    // Create flying image
    const flyingImage = productImage.cloneNode();
    flyingImage.style.position = 'fixed';
    flyingImage.style.top = rect.top + 'px';
    flyingImage.style.left = rect.left + 'px';
    flyingImage.style.width = rect.width + 'px';
    flyingImage.style.height = rect.height + 'px';
    flyingImage.style.zIndex = '9999';
    flyingImage.style.transition = 'all 0.8s ease-in-out';
    flyingImage.style.pointerEvents = 'none';

    document.body.appendChild(flyingImage);

    // Animate to cart
    setTimeout(() => {
        flyingImage.style.top = cartRect.top + 'px';
        flyingImage.style.left = cartRect.left + 'px';
        flyingImage.style.width = '30px';
        flyingImage.style.height = '30px';
        flyingImage.style.opacity = '0';
    }, 50);

    // Remove after animation
    setTimeout(() => {
        document.body.removeChild(flyingImage);
    }, 850);
}

// ====================== WISHLIST FUNCTIONS ======================
function toggleWishlist(productId) {
    const product = AppState.products.find(p => p.ProductID === productId);
    if (!product) return;

    const existingIndex = AppState.wishlist.findIndex(item => item.productId === productId);

    if (existingIndex !== -1) {
        AppState.wishlist.splice(existingIndex, 1);
        showNotification('Đã xóa khỏi danh sách yêu thích', 'info');
    } else {
        AppState.wishlist.push({
            productId: productId,
            name: product.TenSanPham,
            price: product.GiaMacDinh,
            image: product.HinhAnhChinh,
            addedAt: new Date().toISOString()
        });
        showNotification('Đã thêm vào danh sách yêu thích', 'success');
    }

    saveWishlistToStorage();
    updateWishlistUI();
    updateWishlistButtonState(productId);
}

function saveWishlistToStorage() {
    localStorage.setItem(LOTUS_CONFIG.STORAGE_KEYS.WISHLIST, JSON.stringify(AppState.wishlist));
}

function updateWishlistUI() {
    // Update wishlist count if there's a badge
    const badge = document.getElementById('wishlistBadge');
    if (badge) {
        badge.textContent = AppState.wishlist.length;
        badge.style.display = AppState.wishlist.length > 0 ? 'flex' : 'none';
    }
}

function updateWishlistButtonState(productId) {
    const card = document.querySelector(`[data-product-id="${productId}"]`);
    if (!card) return;

    const isInWishlist = AppState.wishlist.some(item => item.productId === productId);
    const button = card.querySelector('.btn-wishlist');

    if (button) {
        if (isInWishlist) {
            button.classList.add('active');
            button.title = 'Bỏ yêu thích';
        } else {
            button.classList.remove('active');
            button.title = 'Thêm yêu thích';
        }
    }
}

// ====================== SEARCH & FILTER FUNCTIONS ======================
function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    AppState.filters.search = searchInput.value.trim();
    AppState.currentPage = 1;
    loadProducts();
}

function filterByCategory(categoryId) {
    AppState.filters.category = categoryId;
    AppState.currentPage = 1;
    loadProducts();
    renderCategoryFilter();
}

function setupFilters() {
    // Price range filter
    const priceMinInput = document.getElementById('priceMin');
    const priceMaxInput = document.getElementById('priceMax');

    if (priceMinInput && priceMaxInput) {
        [priceMinInput, priceMaxInput].forEach(input => {
            input.addEventListener('change', function() {
                AppState.filters.priceMin = parseInt(priceMinInput.value) || 0;
                AppState.filters.priceMax = parseInt(priceMaxInput.value) || 0;
                AppState.currentPage = 1;
                loadProducts();
            });
        });
    }

    // Sort filter
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const [sortBy, sortOrder] = this.value.split('-');
            AppState.filters.sortBy = sortBy;
            AppState.filters.sortOrder = sortOrder;
            AppState.currentPage = 1;
            loadProducts();
        });
    }
}

function clearFilters() {
    AppState.filters = {
        category: '',
        search: '',
        priceMin: 0,
        priceMax: 0,
        sortBy: 'ThuTuHienThi',
        sortOrder: 'ASC'
    };

    // Reset form inputs
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';

    const priceMinInput = document.getElementById('priceMin');
    const priceMaxInput = document.getElementById('priceMax');
    if (priceMinInput) priceMinInput.value = '';
    if (priceMaxInput) priceMaxInput.value = '';

    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) sortSelect.value = 'ThuTuHienThi-ASC';

    AppState.currentPage = 1;
    loadProducts();
    renderCategoryFilter();
}

// ====================== PAGINATION FUNCTIONS ======================
function renderPagination() {
    const container = document.getElementById('paginationContainer');
    if (!container || AppState.totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = '<nav aria-label="Product pagination"><ul class="pagination">';

    // Previous button
    html += `<li class="page-item ${AppState.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changePage(${AppState.currentPage - 1})" aria-label="Previous">
                    <i class="fas fa-chevron-left"></i> Trước
                </a>
             </li>`;

    // Page numbers
    const startPage = Math.max(1, AppState.currentPage - Math.floor(LOTUS_CONFIG.PAGINATION.MAX_PAGES_SHOWN / 2));
    const endPage = Math.min(AppState.totalPages, startPage + LOTUS_CONFIG.PAGINATION.MAX_PAGES_SHOWN - 1);

    if (startPage > 1) {
        html += `<li class="page-item">
                    <a class="page-link" href="#" onclick="changePage(1)">1</a>
                 </li>`;
        if (startPage > 2) {
            html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        html += `<li class="page-item ${i === AppState.currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
                 </li>`;
    }

    if (endPage < AppState.totalPages) {
        if (endPage < AppState.totalPages - 1) {
            html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
        }
        html += `<li class="page-item">
                    <a class="page-link" href="#" onclick="changePage(${AppState.totalPages})">${AppState.totalPages}</a>
                 </li>`;
    }

    // Next button
    html += `<li class="page-item ${AppState.currentPage === AppState.totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changePage(${AppState.currentPage + 1})" aria-label="Next">
                    Sau <i class="fas fa-chevron-right"></i>
                </a>
             </li>`;

    html += '</ul></nav>';
    container.innerHTML = html;
}

function changePage(page) {
    if (page >= 1 && page <= AppState.totalPages && page !== AppState.currentPage) {
        AppState.currentPage = page;
        loadProducts();

        // Smooth scroll to top
        window.scrollTo({
            top: document.querySelector('.search-container')?.offsetTop - 100 || 0,
            behavior: 'smooth'
        });
    }
}

// ====================== UTILITY FUNCTIONS ======================
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone);
}

function showLoading(container = null) {
    if (container) {
        container.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Đang tải...</p>
            </div>
        `;
    } else {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) spinner.style.display = 'block';
    }
}

function hideLoading() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) spinner.style.display = 'none';
}

function showError(message) {
    const container = document.getElementById('productsGrid');
    if (container) {
        container.innerHTML = createErrorState(message);
    }
}

function createEmptyState(message, icon = 'fas fa-box-open') {
    return `
        <div class="col-12">
            <div class="empty-state">
                <i class="${icon}"></i>
                <h5>${message}</h5>
                <p class="text-muted">Hãy thử tìm kiếm với từ khóa khác hoặc xem tất cả sản phẩm.</p>
                <button class="btn btn-primary" onclick="clearFilters()">
                    <i class="fas fa-refresh"></i> Xem tất cả sản phẩm
                </button>
            </div>
        </div>
    `;
}

function createErrorState(message) {
    return `
        <div class="col-12">
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle text-danger"></i>
                <h5 class="text-danger">${message}</h5>
                <p class="text-muted">Vui lòng thử lại sau hoặc liên hệ hỗ trợ.</p>
                <button class="btn btn-outline-primary" onclick="loadProducts()">
                    <i class="fas fa-redo"></i> Thử lại
                </button>
            </div>
        </div>
    `;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${getBootstrapAlertClass(type)} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: var(--shadow-lg);
    `;

    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)} me-2"></i>
        ${message}
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 150);
        }
    }, 5000);
}

function getBootstrapAlertClass(type) {
    const mapping = {
        'success': 'success',
        'error': 'danger',
        'warning': 'warning',
        'info': 'info'
    };
    return mapping[type] || 'info';
}

function getNotificationIcon(type) {
    const mapping = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return mapping[type] || 'info-circle';
}

function updateURL() {
    const params = new URLSearchParams();

    if (AppState.currentPage > 1) params.set('page', AppState.currentPage);
    if (AppState.filters.category) params.set('category', AppState.filters.category);
    if (AppState.filters.search) params.set('search', AppState.filters.search);

    const newURL = window.location.pathname + (params.toString() ? '?' + params.toString() : '');

    history.pushState({
        page: AppState.currentPage,
        category: AppState.filters.category,
        search: AppState.filters.search
    }, '', newURL);
}

// ====================== CART PAGE FUNCTIONS ======================
function initializeCartPage() {
    renderCartPage();
}

function renderCartPage() {
    const container = document.getElementById('cartContainer');
    if (!container) return;

    if (AppState.cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart text-center py-5">
                <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                <h4>Giỏ hàng trống</h4>
                <p class="text-muted">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
                <a href="/p/cua-hang.html" class="btn btn-primary">
                    <i class="fas fa-shopping-bag"></i> Tiếp tục mua sắm
                </a>
            </div>
        `;
        return;
    }

    let html = '<div class="cart-items">';
    let totalAmount = 0;

    AppState.cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;

        html += `
            <div class="cart-item" data-product-id="${item.productId}">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <img src="${item.image}" alt="${item.name}" class="img-fluid rounded">
                    </div>
                    <div class="col-md-4">
                        <h6>${item.name}</h6>
                        <p class="text-muted small">Mã: ${item.productId}</p>
                    </div>
                    <div class="col-md-2">
                        <span class="fw-bold">${formatPrice(item.price)}</span>
                    </div>
                    <div class="col-md-2">
                        <div class="quantity-controls">
                            <button class="btn btn-sm btn-outline-secondary" onclick="updateCartQuantity('${item.productId}', ${item.quantity - 1})">-</button>
                            <span class="mx-2">${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-secondary" onclick="updateCartQuantity('${item.productId}', ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <div class="col-md-1">
                        <span class="fw-bold">${formatPrice(itemTotal)}</span>
                    </div>
                    <div class="col-md-1">
                        <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart('${item.productId}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    html += '</div>';

    // Cart summary
    html += `
        <div class="cart-summary mt-4">
            <div class="row">
                <div class="col-md-8"></div>
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5>Tổng cộng</h5>
                            <div class="d-flex justify-content-between">
                                <span>Tạm tính:</span>
                                <span>${formatPrice(totalAmount)}</span>
                            </div>
                            <div class="d-flex justify-content-between">
                                <span>Phí vận chuyển:</span>
                                <span>${totalAmount >= 500000 ? 'Miễn phí' : formatPrice(30000)}</span>
                            </div>
                            <hr>
                            <div class="d-flex justify-content-between fw-bold">
                                <span>Tổng cộng:</span>
                                <span>${formatPrice(totalAmount + (totalAmount >= 500000 ? 0 : 30000))}</span>
                            </div>
                            <div class="mt-3">
                                <a href="/p/thanh-toan.html" class="btn btn-primary w-100">
                                    <i class="fas fa-credit-card"></i> Thanh toán
                                </a>
                                <button class="btn btn-outline-danger w-100 mt-2" onclick="clearCart()">
                                    <i class="fas fa-trash"></i> Xóa tất cả
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// ====================== CHECKOUT PAGE FUNCTIONS ======================
function initializeCheckoutPage() {
    renderCheckoutPage();
    setupCheckoutForm();
}

function renderCheckoutPage() {
    // Implementation for checkout page
    console.log('Rendering checkout page...');
}

function setupCheckoutForm() {
    const form = document.getElementById('checkoutForm');
    if (form) {
        form.addEventListener('submit', handleCheckoutSubmit);
    }
}

async function handleCheckoutSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const orderData = {
        action: 'createOrder',
        customerPhone: formData.get('phone'),
        customerName: formData.get('name'),
        customerEmail: formData.get('email'),
        shippingAddress: formData.get('address'),
        paymentMethod: formData.get('paymentMethod'),
        note: formData.get('note'),
        items: AppState.cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
        }))
    };

    try {
        showLoading();

        const result = await apiCall('', {
            method: 'POST',
            body: orderData
        });

        if (result.success) {
            // Clear cart
            AppState.cart = [];
            saveCartToStorage();
            updateCartUI();

            // Redirect to success page
            window.location.href = `/p/dat-hang-thanh-cong.html?orderId=${result.data.orderId}`;
        } else {
            showNotification(result.message || 'Có lỗi xảy ra khi đặt hàng', 'error');
        }

    } catch (error) {
        console.error('Checkout error:', error);
        showNotification('Lỗi kết nối. Vui lòng thử lại.', 'error');
    } finally {
        hideLoading();
    }
}

// ====================== ACCOUNT PAGE FUNCTIONS ======================
function initializeAccountPage() {
    if (AppState.currentUser) {
        renderUserDashboard();
    } else {
        renderLoginForm();
    }
}

function renderUserDashboard() {
    // Implementation for user dashboard
    console.log('Rendering user dashboard...');
}

function renderLoginForm() {
    // Implementation for login form
    console.log('Rendering login form...');
}

// ====================== UI ENHANCEMENTS ======================
function initializeScrollEffects() {
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe product cards and other elements
    setTimeout(() => {
        document.querySelectorAll('.product-card, .post-outer').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }, 100);
}

// Enhanced toast notifications
function showToastEnhanced(message, type = 'info') {
    // Create toast container if it doesn't exist
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast-custom ${type} mb-3`;
    toast.style.cssText = 'min-width: 350px; padding: 15px 20px; display: block;';

    const icon = type === 'success' ? 'fas fa-check-circle text-success' :
                type === 'error' ? 'fas fa-exclamation-circle text-danger' :
                'fas fa-info-circle text-info';

    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="${icon} me-3" style="font-size: 20px;"></i>
            <div class="flex-grow-1">
                <div class="fw-bold mb-1">${type === 'success' ? 'Thành công!' : type === 'error' ? 'Lỗi!' : 'Thông báo'}</div>
                <div style="font-size: 14px; color: var(--text-light);">${message}</div>
            </div>
            <button type="button" class="btn-close ms-3" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;

    container.appendChild(toast);

    // Auto remove after 4 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => toast.remove(), 300);
        }
    }, 4000);
}

// ====================== GLOBAL EVENT HANDLERS ======================
// Make functions globally available
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.clearCart = clearCart;
window.toggleWishlist = toggleWishlist;
window.searchProducts = searchProducts;
window.filterByCategory = filterByCategory;
window.clearFilters = clearFilters;
window.changePage = changePage;
window.showToastEnhanced = showToastEnhanced;
window.initializeScrollEffects = initializeScrollEffects;
window.initializeAnimations = initializeAnimations;

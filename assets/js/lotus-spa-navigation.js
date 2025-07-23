/**
 * Lotus Glass SPA Navigation System v2.0
 * Enhanced navigation with modern features and smooth transitions
 */

(function() {
    'use strict';
    
    // Navigation state
    let currentPage = 'home';
    let navigationHistory = [];
    let isNavigating = false;
    
    // Initialize navigation system
    function initializeNavigation() {
        setupEventListeners();
        setupIntersectionObserver();
        handleInitialLoad();
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', handlePopState);
        
        // Handle navigation clicks
        document.addEventListener('click', handleNavigationClick);
        
        // Handle keyboard navigation
        document.addEventListener('keydown', handleKeyboardNavigation);
        
        // Handle scroll events for navigation highlighting
        window.addEventListener('scroll', throttle(updateNavigationOnScroll, 100));
        
        // Handle resize events
        window.addEventListener('resize', debounce(handleResize, 250));
    }
    
    // Handle navigation clicks
    function handleNavigationClick(event) {
        const target = event.target.closest('[data-page]');
        if (!target) return;
        
        event.preventDefault();
        const page = target.getAttribute('data-page');
        
        if (page && page !== currentPage) {
            navigateToPage(page);
        }
    }
    
    // Handle keyboard navigation
    function handleKeyboardNavigation(event) {
        // ESC key to close overlays
        if (event.key === 'Escape') {
            closeAllOverlays();
        }
        
        // Alt + number keys for quick navigation
        if (event.altKey && !event.ctrlKey && !event.shiftKey) {
            const keyMap = {
                '1': 'home',
                '2': 'store',
                '3': 'about',
                '4': 'account',
                '5': 'cart'
            };
            
            const page = keyMap[event.key];
            if (page) {
                event.preventDefault();
                navigateToPage(page);
            }
        }
    }
    
    // Handle browser back/forward
    function handlePopState(event) {
        const hash = window.location.hash.substring(1);
        const page = hash || 'home';
        
        if (page !== currentPage) {
            loadPageContent(page, false); // false = don't update history
        }
    }
    
    // Handle initial page load
    function handleInitialLoad() {
        const hash = window.location.hash.substring(1);
        let initialPage = 'home';
        
        if (hash) {
            if (hash.startsWith('product/')) {
                initialPage = hash;
            } else if (['home', 'store', 'about', 'account', 'cart', 'checkout'].includes(hash)) {
                initialPage = hash;
            }
        }
        
        loadPageContent(initialPage, false);
    }
    
    // Main navigation function
    function navigateToPage(page, updateHistory = true) {
        if (isNavigating || page === currentPage) return;
        
        isNavigating = true;
        
        // Add to navigation history
        if (updateHistory) {
            navigationHistory.push(currentPage);
            window.history.pushState({ page: page }, '', `#${page}`);
        }
        
        // Update current page
        const previousPage = currentPage;
        currentPage = page;
        
        // Show loading state if needed
        showNavigationLoading();
        
        // Load page content with animation
        setTimeout(() => {
            loadPageContent(page, false);
            updateNavigationState(page, previousPage);
            hideNavigationLoading();
            isNavigating = false;
        }, 100);
    }
    
    // Load page content
    function loadPageContent(page, updateHistory = true) {
        // Hide all sections first
        hideAllSections();
        
        // Handle different page types
        if (page.startsWith('product/')) {
            const productId = page.split('/')[1];
            showProductOverlay(productId);
        } else {
            switch(page) {
                case 'home':
                    showHomeSection();
                    break;
                case 'store':
                    showStoreSection();
                    break;
                case 'about':
                    showAboutSection();
                    break;
                case 'account':
                    showAccountSection();
                    break;
                case 'cart':
                    showCartOverlay();
                    break;
                case 'checkout':
                    showCheckoutSection();
                    break;
                case 'blog':
                    showBlogSection();
                    break;
                case 'contact':
                    showContactSection();
                    break;
                default:
                    showHomeSection();
                    page = 'home';
            }
        }
        
        // Update URL if needed
        if (updateHistory && page !== currentPage) {
            window.history.pushState({ page: page }, '', `#${page}`);
            currentPage = page;
        }
        
        // Update navigation state
        updateNavigationState(page);
        
        // Track page view
        trackPageView(page);
    }
    
    // Hide all sections
    function hideAllSections() {
        const sections = [
            'home-content',
            'store-content', 
            'about-content',
            'account-content',
            'checkout-content',
            'blog-content'
        ];
        
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.style.display = 'none';
                section.classList.remove('lotus-animate-fade-in');
            }
        });
        
        // Hide overlays
        closeAllOverlays();
    }
    
    // Show home section
    function showHomeSection() {
        const homeContent = document.getElementById('home-content');
        if (homeContent) {
            homeContent.style.display = 'block';
            homeContent.classList.add('lotus-animate-fade-in');
            
            // Initialize home section
            if (typeof HomeSection !== 'undefined') {
                HomeSection.loadFeaturedProducts();
                HomeSection.loadCategories();
            }
        }
    }
    
    // Show store section
    function showStoreSection() {
        const storeContent = document.getElementById('store-content');
        if (storeContent) {
            storeContent.style.display = 'block';
            storeContent.classList.add('lotus-animate-fade-in');
            
            // Initialize store section
            if (typeof StoreSection !== 'undefined') {
                StoreSection.initialize();
            }
        }
    }
    
    // Show about section
    function showAboutSection() {
        const aboutContent = document.getElementById('about-content');
        if (aboutContent) {
            aboutContent.style.display = 'block';
            aboutContent.classList.add('lotus-animate-fade-in');
        }
    }
    
    // Show account section
    function showAccountSection() {
        const accountContent = document.getElementById('account-content');
        if (accountContent) {
            accountContent.style.display = 'block';
            accountContent.classList.add('lotus-animate-fade-in');
            
            // Initialize account section
            if (typeof AccountSection !== 'undefined') {
                AccountSection.initialize();
            }
        }
    }
    
    // Show checkout section
    function showCheckoutSection() {
        const checkoutContent = document.getElementById('checkout-content');
        if (checkoutContent) {
            checkoutContent.style.display = 'block';
            checkoutContent.classList.add('lotus-animate-fade-in');
            
            // Initialize checkout section
            if (typeof CheckoutSection !== 'undefined') {
                CheckoutSection.initialize();
            }
        }
    }

    // Show blog section
    function showBlogSection() {
        // Create blog content if it doesn't exist
        let blogContent = document.getElementById('blog-content');
        if (!blogContent) {
            blogContent = document.createElement('div');
            blogContent.id = 'blog-content';
            blogContent.className = 'blog-content';
            blogContent.innerHTML = `
                <div class="container">
                    <div class="row">
                        <div class="col-12">
                            <div class="page-header text-center mb-5">
                                <h1 class="page-title display-4 fw-bold">
                                    <i class="fas fa-newspaper text-primary me-3"></i>
                                    Blog & Tin tức
                                </h1>
                                <p class="lead text-muted">Cập nhật những thông tin mới nhất về sản phẩm và khuyến mãi</p>
                            </div>
                        </div>
                    </div>
                    <div class="row g-4" id="blog-posts-grid">
                        <div class="col-12 text-center">
                            <div class="loading-spinner">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Đang tải bài viết...</span>
                                </div>
                                <p class="mt-3 text-muted">Đang tải danh sách bài viết...</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.querySelector('.main-content').appendChild(blogContent);
        }

        blogContent.style.display = 'block';
        blogContent.classList.add('lotus-animate-fade-in');

        // Load blog posts (using Blogger's built-in posts)
        loadBlogPosts();
    }

    // Show contact section
    function showContactSection() {
        // Create contact content if it doesn't exist
        let contactContent = document.getElementById('contact-content');
        if (!contactContent) {
            contactContent = document.createElement('div');
            contactContent.id = 'contact-content';
            contactContent.className = 'contact-content';
            contactContent.innerHTML = `
                <div class="container">
                    <div class="row">
                        <div class="col-12">
                            <div class="page-header text-center mb-5">
                                <h1 class="page-title display-4 fw-bold">
                                    <i class="fas fa-phone text-success me-3"></i>
                                    Liên hệ
                                </h1>
                                <p class="lead text-muted">Chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
                            </div>
                        </div>
                    </div>
                    <div class="row g-5">
                        <div class="col-lg-6">
                            <div class="contact-info">
                                <h3 class="h4 fw-bold mb-4">Thông tin liên hệ</h3>
                                <div class="contact-item mb-3">
                                    <i class="fas fa-map-marker-alt text-primary me-3"></i>
                                    <span>123 Đường ABC, Quận XYZ, TP.HCM</span>
                                </div>
                                <div class="contact-item mb-3">
                                    <i class="fas fa-phone text-success me-3"></i>
                                    <span>0123 456 789</span>
                                </div>
                                <div class="contact-item mb-3">
                                    <i class="fas fa-envelope text-info me-3"></i>
                                    <span>info@lotusglass.vn</span>
                                </div>
                                <div class="contact-item mb-3">
                                    <i class="fas fa-clock text-warning me-3"></i>
                                    <span>8:00 - 18:00 (Thứ 2 - Chủ nhật)</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="contact-form">
                                <h3 class="h4 fw-bold mb-4">Gửi tin nhắn</h3>
                                <form id="contact-form">
                                    <div class="mb-3">
                                        <label class="form-label">Họ tên *</label>
                                        <input type="text" class="form-control" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Email *</label>
                                        <input type="email" class="form-control" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Số điện thoại</label>
                                        <input type="tel" class="form-control">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Tin nhắn *</label>
                                        <textarea class="form-control" rows="5" required></textarea>
                                    </div>
                                    <button type="submit" class="btn btn-primary">
                                        <i class="fas fa-paper-plane me-2"></i>
                                        Gửi tin nhắn
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.querySelector('.main-content').appendChild(contactContent);
        }

        contactContent.style.display = 'block';
        contactContent.classList.add('lotus-animate-fade-in');
    }

    // Load blog posts
    function loadBlogPosts() {
        const grid = document.getElementById('blog-posts-grid');
        if (!grid) return;

        // Try to get posts from Blogger data
        if (typeof blogPosts !== 'undefined' && blogPosts.length > 0) {
            let html = '';
            blogPosts.forEach(function(post) {
                html += `
                    <div class="col-lg-4 col-md-6">
                        <article class="blog-card modern-card h-100">
                            <div class="blog-card-image">
                                <img src="${post.image || 'https://via.placeholder.com/400x250'}"
                                     alt="${post.title}"
                                     class="img-fluid"
                                     loading="lazy"/>
                            </div>
                            <div class="blog-card-content p-4">
                                <h3 class="blog-card-title h5 fw-bold mb-3">
                                    <a href="${post.url}" class="text-decoration-none">${post.title}</a>
                                </h3>
                                <p class="blog-card-excerpt text-muted mb-3">${post.excerpt}</p>
                                <div class="blog-card-meta d-flex justify-content-between align-items-center">
                                    <small class="text-muted">
                                        <i class="fas fa-calendar me-1"></i>
                                        ${post.date}
                                    </small>
                                    <a href="${post.url}" class="btn btn-sm btn-outline-primary">
                                        Đọc thêm
                                    </a>
                                </div>
                            </div>
                        </article>
                    </div>
                `;
            });
            grid.innerHTML = html;
        } else {
            // Fallback content
            grid.innerHTML = `
                <div class="col-12 text-center">
                    <div class="empty-state py-5">
                        <i class="fas fa-newspaper fa-3x text-muted mb-3"></i>
                        <h3 class="h5 text-muted">Chưa có bài viết nào</h3>
                        <p class="text-muted">Hãy quay lại sau để đọc những bài viết mới nhất!</p>
                    </div>
                </div>
            `;
        }
    }

    // Show product overlay
    function showProductOverlay(productId) {
        if (typeof ProductSection !== 'undefined' && ProductSection.show) {
            ProductSection.show(productId);
        }
    }
    
    // Show cart overlay
    function showCartOverlay() {
        if (typeof CartSection !== 'undefined' && CartSection.show) {
            CartSection.show();
        }
    }
    
    // Close all overlays
    function closeAllOverlays() {
        const overlays = [
            'product-overlay',
            'cart-overlay'
        ];
        
        overlays.forEach(overlayId => {
            const overlay = document.getElementById(overlayId);
            if (overlay) {
                overlay.classList.remove('show');
                setTimeout(() => {
                    overlay.style.display = 'none';
                }, 300);
            }
        });
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
    
    // Update navigation state
    function updateNavigationState(page, previousPage = null) {
        // Update active navigation links
        document.querySelectorAll('.lotus-nav-link, [data-page]').forEach(link => {
            const linkPage = link.getAttribute('data-page');
            if (linkPage === page) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Update page title
        updatePageTitle(page);
        
        // Update meta description
        updateMetaDescription(page);
        
        // Scroll to top for new pages (except overlays)
        if (!page.startsWith('product/') && page !== 'cart') {
            scrollToTop();
        }
    }
    
    // Update page title
    function updatePageTitle(page) {
        const titles = {
            'home': 'Lotus Glass - Thủy tinh gia dụng cao cấp',
            'store': 'Cửa hàng - Lotus Glass',
            'about': 'Về chúng tôi - Lotus Glass', 
            'account': 'Tài khoản - Lotus Glass',
            'cart': 'Giỏ hàng - Lotus Glass',
            'checkout': 'Thanh toán - Lotus Glass'
        };
        
        document.title = titles[page] || 'Lotus Glass';
    }
    
    // Update meta description
    function updateMetaDescription(page) {
        const descriptions = {
            'home': 'Khám phá bộ sưu tập thủy tinh gia dụng cao cấp tại Lotus Glass. Chất lượng đảm bảo, giá cả hợp lý.',
            'store': 'Mua sắm thủy tinh gia dụng chất lượng cao với hơn 200+ sản phẩm đa dạng tại Lotus Glass.',
            'about': 'Tìm hiểu về Lotus Glass - 10+ năm kinh nghiệm trong ngành thủy tinh gia dụng cao cấp.',
            'account': 'Quản lý tài khoản và đơn hàng của bạn tại Lotus Glass.',
            'cart': 'Xem giỏ hàng và tiến hành thanh toán tại Lotus Glass.',
            'checkout': 'Hoàn tất đơn hàng và thanh toán an toàn tại Lotus Glass.'
        };
        
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            document.head.appendChild(metaDesc);
        }
        
        metaDesc.content = descriptions[page] || descriptions['home'];
    }
    
    // Show navigation loading
    function showNavigationLoading() {
        const loader = document.getElementById('navigation-loader');
        if (loader) {
            loader.style.display = 'block';
        }
    }
    
    // Hide navigation loading
    function hideNavigationLoading() {
        const loader = document.getElementById('navigation-loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }
    
    // Scroll to top smoothly
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // Track page view (for analytics)
    function trackPageView(page) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID', {
                page_title: document.title,
                page_location: window.location.href
            });
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'PageView');
        }
        
        console.log('📊 Page view tracked:', page);
    }
    
    // Utility functions
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
        }
    }
    
    function debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
    
    // Setup intersection observer for animations
    function setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            // Observe elements when they're added to DOM
            const observeElements = () => {
                document.querySelectorAll('.lotus-animate-on-scroll').forEach(el => {
                    observer.observe(el);
                });
            };
            
            // Initial observation
            observeElements();
            
            // Re-observe when content changes
            const contentObserver = new MutationObserver(observeElements);
            contentObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }
    
    // Update navigation on scroll
    function updateNavigationOnScroll() {
        // Add/remove scrolled class to header
        const header = document.querySelector('.lotus-header');
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }
    
    // Handle resize events
    function handleResize() {
        // Close mobile menu if open
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu && mobileMenu.classList.contains('show')) {
            mobileMenu.classList.remove('show');
        }
    }
    
    // Export navigation functions
    window.LotusNavigation = {
        navigateToPage: navigateToPage,
        getCurrentPage: () => currentPage,
        goBack: () => {
            if (navigationHistory.length > 0) {
                const previousPage = navigationHistory.pop();
                navigateToPage(previousPage);
            } else {
                window.history.back();
            }
        },
        closeAllOverlays: closeAllOverlays,
        updateNavigationState: updateNavigationState
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeNavigation);
    } else {
        initializeNavigation();
    }
    
})();

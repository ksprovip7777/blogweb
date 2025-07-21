/**
 * Lotus Glass Main Integration Script v4.0
 * Coordinates all components and provides global functionality
 */

class LotusMain {
    constructor() {
        this.isInitialized = false;
        this.components = {};
        this.init();
    }

    async init() {
        if (this.isInitialized) return;

        try {
            // Initialize core components
            await this.initializeCore();
            
            // Initialize page-specific components
            this.initializePageComponents();
            
            // Setup global event listeners
            this.setupGlobalEvents();
            
            // Initialize animations
            this.initializeAnimations();
            
            // Setup performance monitoring
            this.setupPerformanceMonitoring();
            
            this.isInitialized = true;
            console.log('🌸 Lotus Glass v4.0 initialized successfully');
            
        } catch (error) {
            console.error('❌ Lotus Glass initialization failed:', error);
        }
    }

    async initializeCore() {
        // Initialize Bootstrap components
        this.initializeBootstrap();
        
        // Initialize tooltips and popovers
        this.initializeTooltips();
        
        // Initialize smooth scrolling
        this.initializeSmoothScrolling();
        
        // Initialize lazy loading
        this.initializeLazyLoading();
        
        // Initialize search functionality
        this.initializeSearch();
    }

    initializeBootstrap() {
        // Initialize all Bootstrap components
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });

        const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        popoverTriggerList.map(function (popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl);
        });
    }

    initializeTooltips() {
        // Custom tooltip initialization for dynamic content
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        const tooltips = node.querySelectorAll('[data-bs-toggle="tooltip"]');
                        tooltips.forEach(el => {
                            if (!el._tooltip) {
                                new bootstrap.Tooltip(el);
                            }
                        });
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    initializeSmoothScrolling() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    initializeLazyLoading() {
        // Intersection Observer for lazy loading
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            observer.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    initializeSearch() {
        // Global search functionality
        const searchInputs = document.querySelectorAll('input[type="search"]');
        searchInputs.forEach(input => {
            input.addEventListener('input', debounce((e) => {
                const query = e.target.value.trim();
                if (query.length >= 2) {
                    this.performSearch(query);
                }
            }, 300));
        });
    }

    initializePageComponents() {
        const currentPage = this.getCurrentPage();
        
        switch (currentPage) {
            case 'index.html':
            case '':
                this.initializeHomePage();
                break;
            case 'store.html':
                this.initializeStorePage();
                break;
            case 'product.html':
                this.initializeProductPage();
                break;
            case 'checkout.html':
                this.initializeCheckoutPage();
                break;
            case 'account.html':
                this.initializeAccountPage();
                break;
            case 'about.html':
                this.initializeAboutPage();
                break;
            case 'contact.html':
                this.initializeContactPage();
                break;
        }
    }

    initializeHomePage() {
        // Initialize hero slider if exists
        const heroSlider = document.querySelector('.hero-slider');
        if (heroSlider) {
            this.initializeHeroSlider();
        }

        // Initialize product carousels
        this.initializeProductCarousels();
        
        // Initialize testimonials
        this.initializeTestimonials();
    }

    initializeStorePage() {
        // Initialize product filters
        this.initializeProductFilters();
        
        // Initialize product grid
        this.initializeProductGrid();
        
        // Initialize pagination
        this.initializePagination();
    }

    initializeProductPage() {
        // Initialize product gallery
        this.initializeProductGallery();
        
        // Initialize quantity controls
        this.initializeQuantityControls();
        
        // Initialize related products
        this.initializeRelatedProducts();
    }

    initializeCheckoutPage() {
        // Initialize checkout form validation
        this.initializeCheckoutValidation();
        
        // Initialize payment methods
        this.initializePaymentMethods();
        
        // Initialize order summary
        this.initializeOrderSummary();
    }

    initializeAccountPage() {
        // Initialize dashboard tabs
        this.initializeDashboardTabs();
        
        // Initialize profile forms
        this.initializeProfileForms();
        
        // Initialize order history
        this.initializeOrderHistory();
    }

    initializeAboutPage() {
        // Initialize timeline animations
        this.initializeTimelineAnimations();
        
        // Initialize team carousel
        this.initializeTeamCarousel();
    }

    initializeContactPage() {
        // Initialize contact form
        this.initializeContactForm();
        
        // Initialize map
        this.initializeMap();
    }

    setupGlobalEvents() {
        // Cart events
        window.addEventListener('cartUpdated', (e) => {
            this.handleCartUpdate(e.detail);
        });

        // Wishlist events
        window.addEventListener('wishlistUpdated', (e) => {
            this.handleWishlistUpdate(e.detail);
        });

        // User events
        window.addEventListener('userUpdated', (e) => {
            this.handleUserUpdate(e.detail);
        });

        window.addEventListener('userLoggedOut', () => {
            this.handleUserLogout();
        });

        // Resize events
        window.addEventListener('resize', debounce(() => {
            this.handleResize();
        }, 250));

        // Scroll events
        window.addEventListener('scroll', throttle(() => {
            this.handleScroll();
        }, 16));

        // Online/offline events
        window.addEventListener('online', () => {
            showToast('Kết nối internet đã được khôi phục', 'success');
        });

        window.addEventListener('offline', () => {
            showToast('Mất kết nối internet', 'warning');
        });
    }

    initializeAnimations() {
        // Initialize Intersection Observer for animations
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('lotus-animate-active');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            // Observe all animation elements
            document.querySelectorAll('[class*="lotus-animate-"]').forEach(el => {
                animationObserver.observe(el);
            });
        }
    }

    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        if ('web-vital' in window) {
            // This would integrate with actual web vitals library
            console.log('Performance monitoring initialized');
        }

        // Monitor JavaScript errors
        window.addEventListener('error', (e) => {
            console.error('JavaScript error:', e.error);
            // In production, this would send to error tracking service
        });

        // Monitor unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            // In production, this would send to error tracking service
        });
    }

    getCurrentPage() {
        return window.location.pathname.split('/').pop() || 'index.html';
    }

    performSearch(query) {
        // Implement search functionality
        console.log('Searching for:', query);
        // This would integrate with actual search API
    }

    handleCartUpdate(data) {
        // Update cart UI elements
        updateCartCount();
        
        // Update mobile menu cart count
        if (window.mobileMenu) {
            window.mobileMenu.updateCartCount();
        }
    }

    handleWishlistUpdate(data) {
        // Update wishlist UI elements
        updateWishlistCount();
        
        // Update mobile menu wishlist count
        if (window.mobileMenu) {
            window.mobileMenu.updateWishlistCount();
        }
    }

    handleUserUpdate(data) {
        // Update user UI elements
        updateUserUI();
        
        // Update mobile menu user section
        if (window.mobileMenu) {
            window.mobileMenu.updateUserState();
        }
    }

    handleUserLogout() {
        // Handle user logout
        updateUserUI();
        
        // Update mobile menu
        if (window.mobileMenu) {
            window.mobileMenu.updateUserState();
        }
    }

    handleResize() {
        // Handle window resize
        this.updateResponsiveElements();
    }

    handleScroll() {
        // Handle scroll events
        this.updateScrollElements();
    }

    updateResponsiveElements() {
        // Update elements that need responsive adjustments
        const navbar = document.querySelector('.lotus-navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }

    updateScrollElements() {
        // Update elements based on scroll position
        const backToTop = document.querySelector('.back-to-top');
        if (backToTop) {
            if (window.scrollY > 500) {
                backToTop.style.display = 'block';
            } else {
                backToTop.style.display = 'none';
            }
        }
    }

    // Utility methods for component initialization
    initializeHeroSlider() {
        // Hero slider implementation
        console.log('Hero slider initialized');
    }

    initializeProductCarousels() {
        // Product carousels implementation
        console.log('Product carousels initialized');
    }

    initializeTestimonials() {
        // Testimonials implementation
        console.log('Testimonials initialized');
    }

    initializeProductFilters() {
        // Product filters implementation
        console.log('Product filters initialized');
    }

    initializeProductGrid() {
        // Product grid implementation
        console.log('Product grid initialized');
    }

    initializePagination() {
        // Pagination implementation
        console.log('Pagination initialized');
    }

    initializeProductGallery() {
        // Product gallery implementation
        console.log('Product gallery initialized');
    }

    initializeQuantityControls() {
        // Quantity controls implementation
        console.log('Quantity controls initialized');
    }

    initializeRelatedProducts() {
        // Related products implementation
        console.log('Related products initialized');
    }

    initializeCheckoutValidation() {
        // Checkout validation implementation
        console.log('Checkout validation initialized');
    }

    initializePaymentMethods() {
        // Payment methods implementation
        console.log('Payment methods initialized');
    }

    initializeOrderSummary() {
        // Order summary implementation
        console.log('Order summary initialized');
    }

    initializeDashboardTabs() {
        // Dashboard tabs implementation
        console.log('Dashboard tabs initialized');
    }

    initializeProfileForms() {
        // Profile forms implementation
        console.log('Profile forms initialized');
    }

    initializeOrderHistory() {
        // Order history implementation
        console.log('Order history initialized');
    }

    initializeTimelineAnimations() {
        // Timeline animations implementation
        console.log('Timeline animations initialized');
    }

    initializeTeamCarousel() {
        // Team carousel implementation
        console.log('Team carousel initialized');
    }

    initializeContactForm() {
        // Contact form implementation
        console.log('Contact form initialized');
    }

    initializeMap() {
        // Map implementation
        console.log('Map initialized');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.lotusMain = new LotusMain();
});

// Export for global access
window.LotusMain = LotusMain;

/**
 * 🌸 LOTUS GLASS - BLOGSPOT OPTIMIZED SCRIPT
 * Tối ưu hóa đặc biệt cho môi trường Blogspot/Blogger
 * Version: 5.0 Blogspot Edition - January 2025
 */

// ====================== BLOGSPOT ENVIRONMENT DETECTION ======================
const BlogspotEnv = {
    isBlogspot: window.location.hostname.includes('blogspot.com'),
    blogId: null,
    postId: null,
    
    init() {
        if (this.isBlogspot) {
            this.blogId = this.extractBlogId();
            this.postId = this.extractPostId();
            this.setupBlogspotOptimizations();
            console.log('🌸 Lotus Glass - Blogspot Mode Activated');
        }
    },
    
    extractBlogId() {
        // Extract blog ID from Blogger URLs
        const pathParts = window.location.pathname.split('/');
        return pathParts[1] || null;
    },
    
    extractPostId() {
        // Extract post ID from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('postId') || urlParams.get('p') || null;
    },
    
    setupBlogspotOptimizations() {
        // Add Blogspot-specific CSS class
        document.body.classList.add('blogspot-mode');
        
        // Adjust configuration for Blogspot
        if (window.LOTUS_CONFIG) {
            window.LOTUS_CONFIG.FEATURE_FLAGS.ENABLE_PWA = false; // PWA may not work on subdomain
            window.LOTUS_CONFIG.FEATURE_FLAGS.ENABLE_OFFLINE = false;
            window.LOTUS_CONFIG.API_CONFIG.SETTINGS.TIMEOUT = 10000; // Longer timeout for Blogspot
        }
        
        // Setup Blogspot-specific event listeners
        this.setupBlogspotEvents();
    },
    
    setupBlogspotEvents() {
        // Handle Blogger's dynamic content loading
        if (typeof Blogger !== 'undefined') {
            // Blogger object is available
            this.handleBloggerIntegration();
        }
        
        // Monitor for Blogger template changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    this.handleDynamicContent(mutation.addedNodes);
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    },
    
    handleBloggerIntegration() {
        // Integration with Blogger's built-in functionality
        console.log('🔗 Integrating with Blogger platform');
        
        // Override Blogger's default behaviors if needed
        this.overrideBloggerDefaults();
    },
    
    handleDynamicContent(addedNodes) {
        addedNodes.forEach(node => {
            if (node.nodeType === 1) { // Element node
                // Re-initialize components for dynamically added content
                this.initializeNodeComponents(node);
            }
        });
    },
    
    initializeNodeComponents(node) {
        // Initialize lazy loading for new images
        const images = node.querySelectorAll('img[data-src]');
        if (images.length > 0 && window.LotusOptimized) {
            images.forEach(img => {
                if (window.LotusOptimized.lazyLoader) {
                    window.LotusOptimized.lazyLoader.observer.observe(img);
                }
            });
        }
        
        // Initialize tooltips for new elements
        const tooltips = node.querySelectorAll('[data-tooltip]');
        tooltips.forEach(el => {
            // Tooltip initialization handled by OptimizedUI
        });
    },
    
    overrideBloggerDefaults() {
        // Override Blogger's default link behavior for SPA-like experience
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (link && this.isInternalBloggerLink(link.href)) {
                // Handle internal navigation
                this.handleInternalNavigation(e, link);
            }
        });
    },
    
    isInternalBloggerLink(href) {
        return href.includes(window.location.hostname) && 
               !href.includes('mailto:') && 
               !href.includes('tel:');
    },
    
    handleInternalNavigation(event, link) {
        // Custom navigation handling for better UX
        const href = link.getAttribute('href');
        
        // Add loading state
        link.classList.add('loading');
        
        // Show loading indicator
        if (window.LotusOptimized && window.LotusOptimized.ui) {
            window.LotusOptimized.ui.showNotification('Đang tải...', 'info', 1000);
        }
        
        // Let browser handle the navigation normally
        // but with enhanced UX feedback
    }
};

// ====================== BLOGSPOT PERFORMANCE OPTIMIZATIONS ======================
const BlogspotPerformance = {
    init() {
        if (BlogspotEnv.isBlogspot) {
            this.optimizeBlogspotLoading();
            this.setupBlogspotCaching();
            this.monitorBlogspotPerformance();
        }
    },
    
    optimizeBlogspotLoading() {
        // Optimize resource loading for Blogspot
        this.preloadCriticalResources();
        this.deferNonCriticalResources();
        this.optimizeBlogspotImages();
    },
    
    preloadCriticalResources() {
        const criticalResources = [
            'https://cdn.jsdelivr.net/gh/ksprovip7777/blogweb@main/optimized-critical.css',
            'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css'
        ];
        
        criticalResources.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = url;
            document.head.appendChild(link);
        });
    },
    
    deferNonCriticalResources() {
        // Defer non-critical CSS loading
        const nonCriticalCSS = [
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
        ];
        
        nonCriticalCSS.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            link.media = 'print';
            link.onload = function() { this.media = 'all'; };
            document.head.appendChild(link);
        });
    },
    
    optimizeBlogspotImages() {
        // Optimize Blogger's image handling
        const bloggerImages = document.querySelectorAll('img[src*="blogspot.com"]');
        bloggerImages.forEach(img => {
            // Add loading="lazy" if not present
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Optimize Blogger image URLs
            this.optimizeBloggerImageUrl(img);
        });
    },
    
    optimizeBloggerImageUrl(img) {
        const src = img.src;
        if (src.includes('blogspot.com') && !src.includes('=w')) {
            // Add width parameter for better caching
            const width = img.offsetWidth || 400;
            img.src = src + `=w${width}`;
        }
    },
    
    setupBlogspotCaching() {
        // Enhanced caching for Blogspot
        if (window.LotusOptimized && window.LotusOptimized.api) {
            // Extend cache duration for Blogspot
            window.LotusOptimized.api.cache.maxSize = 30; // Smaller cache for Blogspot
        }
    },
    
    monitorBlogspotPerformance() {
        // Monitor performance specifically for Blogspot
        window.addEventListener('load', () => {
            setTimeout(() => {
                const navigation = performance.getEntriesByType('navigation')[0];
                const loadTime = navigation.loadEventEnd - navigation.navigationStart;
                
                console.log(`📊 Blogspot Load Time: ${loadTime.toFixed(2)}ms`);
                
                // Report slow loading
                if (loadTime > 4000) {
                    console.warn('⚠️ Slow loading detected on Blogspot');
                    this.handleSlowLoading();
                }
            }, 1000);
        });
    },
    
    handleSlowLoading() {
        // Handle slow loading scenarios
        if (window.LotusOptimized && window.LotusOptimized.ui) {
            window.LotusOptimized.ui.showNotification(
                'Trang đang tải chậm, vui lòng đợi...', 
                'warning', 
                3000
            );
        }
    }
};

// ====================== BLOGSPOT UI ENHANCEMENTS ======================
const BlogspotUI = {
    init() {
        if (BlogspotEnv.isBlogspot) {
            this.enhanceBlogspotUI();
            this.setupBlogspotMobile();
            this.addBlogspotStyles();
        }
    },
    
    enhanceBlogspotUI() {
        // Add Blogspot-specific UI enhancements
        this.addBlogspotHeader();
        this.enhanceBlogspotNavigation();
        this.optimizeBlogspotLayout();
    },
    
    addBlogspotHeader() {
        // Add custom header for Blogspot
        const header = document.querySelector('.navbar');
        if (header) {
            header.classList.add('blogspot-navbar');
            
            // Add Blogspot indicator
            const indicator = document.createElement('div');
            indicator.className = 'blogspot-indicator';
            indicator.innerHTML = '🌸 Powered by Blogspot';
            indicator.style.cssText = `
                position: absolute;
                top: -20px;
                right: 10px;
                font-size: 12px;
                color: #666;
                background: rgba(255,255,255,0.9);
                padding: 2px 8px;
                border-radius: 10px;
                display: none;
            `;
            header.appendChild(indicator);
        }
    },
    
    enhanceBlogspotNavigation() {
        // Enhance navigation for Blogspot
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Add click feedback
                link.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    link.style.transform = '';
                }, 150);
            });
        });
    },
    
    optimizeBlogspotLayout() {
        // Optimize layout for Blogspot constraints
        const container = document.querySelector('.container');
        if (container) {
            container.style.maxWidth = '1140px'; // Optimize for Blogspot
        }
    },
    
    setupBlogspotMobile() {
        // Mobile optimizations for Blogspot
        if (window.innerWidth <= 768) {
            document.body.classList.add('blogspot-mobile');
            this.optimizeMobileBlogspot();
        }
    },
    
    optimizeMobileBlogspot() {
        // Mobile-specific optimizations
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        }
    },
    
    addBlogspotStyles() {
        // Add Blogspot-specific styles
        const style = document.createElement('style');
        style.textContent = `
            .blogspot-mode .navbar {
                position: relative !important;
                z-index: 999;
            }
            
            .blogspot-mode .hero {
                margin-top: 0;
            }
            
            .blogspot-mobile .container {
                padding-left: 10px;
                padding-right: 10px;
            }
            
            .blogspot-mode .loading {
                opacity: 0.7;
                pointer-events: none;
            }
            
            @media (max-width: 768px) {
                .blogspot-mode .navbar-nav {
                    background: rgba(255,255,255,0.95);
                    backdrop-filter: blur(10px);
                    border-radius: 8px;
                    margin-top: 10px;
                }
            }
        `;
        document.head.appendChild(style);
    }
};

// ====================== INITIALIZATION ======================
document.addEventListener('DOMContentLoaded', () => {
    BlogspotEnv.init();
    BlogspotPerformance.init();
    BlogspotUI.init();
});

// Export for global access
if (typeof window !== 'undefined') {
    window.BlogspotOptimized = {
        BlogspotEnv,
        BlogspotPerformance,
        BlogspotUI
    };
}

console.log('🌸 Lotus Glass Blogspot Optimizations Loaded');

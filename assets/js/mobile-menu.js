/**
 * Mobile Menu Component for Lotus Glass v4.0
 * Handles mobile navigation, offcanvas menu, and responsive interactions
 */

class MobileMenu {
    constructor() {
        this.isOpen = false;
        this.overlay = null;
        this.menu = null;
        this.toggleButton = null;
        this.init();
    }

    init() {
        this.createMobileMenu();
        this.bindEvents();
        this.updateCartCount();
        this.updateUserState();
    }

    createMobileMenu() {
        // Create mobile menu HTML
        const mobileMenuHTML = `
            <!-- Mobile Menu Offcanvas -->
            <div class="offcanvas offcanvas-end" tabindex="-1" id="mobileMenu" aria-labelledby="mobileMenuLabel">
                <div class="offcanvas-header lotus-glass">
                    <h5 class="offcanvas-title fw-bold" id="mobileMenuLabel">
                        <i class="fas fa-gem me-2 text-primary"></i>
                        Lotus Glass
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Đóng menu"></button>
                </div>
                
                <div class="offcanvas-body p-0">
                    <!-- User Section -->
                    <div class="mobile-user-section p-4 border-bottom" id="mobileUserSection">
                        <!-- User info will be inserted here -->
                    </div>
                    
                    <!-- Main Navigation -->
                    <nav class="mobile-nav">
                        <ul class="list-unstyled mb-0">
                            <li>
                                <a href="index.html" class="mobile-nav-link">
                                    <i class="fas fa-home me-3"></i>
                                    Trang chủ
                                </a>
                            </li>
                            <li>
                                <a href="store.html" class="mobile-nav-link">
                                    <i class="fas fa-store me-3"></i>
                                    Cửa hàng
                                </a>
                            </li>
                            <li>
                                <a href="about.html" class="mobile-nav-link">
                                    <i class="fas fa-info-circle me-3"></i>
                                    Giới thiệu
                                </a>
                            </li>
                            <li>
                                <a href="contact.html" class="mobile-nav-link">
                                    <i class="fas fa-envelope me-3"></i>
                                    Liên hệ
                                </a>
                            </li>
                        </ul>
                    </nav>
                    
                    <!-- Quick Actions -->
                    <div class="mobile-actions p-4 border-top">
                        <div class="row g-2">
                            <div class="col-6">
                                <a href="checkout.html" class="lotus-btn lotus-btn-outline w-100">
                                    <i class="fas fa-shopping-cart me-2"></i>
                                    Giỏ hàng
                                    <span class="badge bg-primary ms-2 cart-count-mobile">0</span>
                                </a>
                            </div>
                            <div class="col-6">
                                <button class="lotus-btn lotus-btn-ghost w-100" onclick="toggleWishlist()">
                                    <i class="fas fa-heart me-2"></i>
                                    Yêu thích
                                    <span class="badge bg-danger ms-2 wishlist-count-mobile">0</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Search Section -->
                    <div class="mobile-search p-4 border-top">
                        <form class="search-form" role="search">
                            <div class="lotus-input-group">
                                <input type="search" 
                                       class="lotus-form-control" 
                                       placeholder="Tìm kiếm sản phẩm..."
                                       aria-label="Tìm kiếm sản phẩm">
                                <div class="lotus-input-group-append">
                                    <button type="submit" class="lotus-btn lotus-btn-primary">
                                        <i class="fas fa-search"></i>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    
                    <!-- Footer Info -->
                    <div class="mobile-footer p-4 border-top text-center">
                        <div class="mb-3">
                            <div class="fw-semibold mb-2">Liên hệ hỗ trợ</div>
                            <div class="d-flex justify-content-center gap-3">
                                <a href="tel:0123456789" class="text-decoration-none">
                                    <i class="fas fa-phone text-success me-1"></i>
                                    0123-456-789
                                </a>
                                <a href="mailto:info@lotusglass.vn" class="text-decoration-none">
                                    <i class="fas fa-envelope text-primary me-1"></i>
                                    Email
                                </a>
                            </div>
                        </div>
                        
                        <div class="social-links">
                            <a href="#" class="text-decoration-none me-3">
                                <i class="fab fa-facebook text-primary"></i>
                            </a>
                            <a href="#" class="text-decoration-none me-3">
                                <i class="fab fa-instagram text-danger"></i>
                            </a>
                            <a href="#" class="text-decoration-none">
                                <i class="fab fa-youtube text-danger"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insert mobile menu into body
        document.body.insertAdjacentHTML('beforeend', mobileMenuHTML);
        
        this.menu = document.getElementById('mobileMenu');
        this.updateActiveNavItem();
    }

    bindEvents() {
        // Update user section when menu opens
        if (this.menu) {
            this.menu.addEventListener('show.bs.offcanvas', () => {
                this.updateUserSection();
                this.updateCartCount();
                this.updateWishlistCount();
            });
        }

        // Handle search form
        const searchForm = document.querySelector('.mobile-search .search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const query = searchForm.querySelector('input').value.trim();
                if (query) {
                    window.location.href = `store.html?search=${encodeURIComponent(query)}`;
                }
            });
        }
    }

    updateUserSection() {
        const userSection = document.getElementById('mobileUserSection');
        const user = JSON.parse(localStorage.getItem('lotus_user') || 'null');
        
        if (user) {
            userSection.innerHTML = `
                <div class="d-flex align-items-center mb-3">
                    <div class="user-avatar me-3">
                        <i class="fas fa-user-circle text-primary" style="font-size: 2.5rem;"></i>
                    </div>
                    <div>
                        <div class="fw-semibold">${user.name}</div>
                        <small class="text-muted">${user.email}</small>
                        <div class="mt-1">
                            <span class="badge bg-primary">
                                <i class="fas fa-crown me-1"></i>
                                ${user.memberLevel || 'Đồng'}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div class="row g-2">
                    <div class="col-6">
                        <a href="account.html" class="lotus-btn lotus-btn-outline lotus-btn-sm w-100">
                            <i class="fas fa-user me-1"></i>
                            Tài khoản
                        </a>
                    </div>
                    <div class="col-6">
                        <button class="lotus-btn lotus-btn-ghost lotus-btn-sm w-100" onclick="logout()">
                            <i class="fas fa-sign-out-alt me-1"></i>
                            Đăng xuất
                        </button>
                    </div>
                </div>
            `;
        } else {
            userSection.innerHTML = `
                <div class="text-center">
                    <div class="mb-3">
                        <i class="fas fa-user-circle text-muted" style="font-size: 3rem;"></i>
                    </div>
                    <div class="mb-3">
                        <div class="fw-semibold mb-1">Chưa đăng nhập</div>
                        <small class="text-muted">Đăng nhập để nhận ưu đãi đặc biệt</small>
                    </div>
                    <div class="row g-2">
                        <div class="col-6">
                            <button class="lotus-btn lotus-btn-outline lotus-btn-sm w-100" 
                                    data-bs-toggle="modal" 
                                    data-bs-target="#loginModal"
                                    data-bs-dismiss="offcanvas">
                                <i class="fas fa-sign-in-alt me-1"></i>
                                Đăng nhập
                            </button>
                        </div>
                        <div class="col-6">
                            <button class="lotus-btn lotus-btn-primary lotus-btn-sm w-100" 
                                    data-bs-toggle="modal" 
                                    data-bs-target="#registerModal"
                                    data-bs-dismiss="offcanvas">
                                <i class="fas fa-user-plus me-1"></i>
                                Đăng ký
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    updateActiveNavItem() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = this.menu.querySelectorAll('.mobile-nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('lotus_cart') || '[]');
        const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);
        
        const cartCountElements = document.querySelectorAll('.cart-count-mobile');
        cartCountElements.forEach(element => {
            element.textContent = count;
            element.style.display = count > 0 ? 'inline' : 'none';
        });
    }

    updateWishlistCount() {
        const wishlist = JSON.parse(localStorage.getItem('lotus_wishlist') || '[]');
        const count = wishlist.length;
        
        const wishlistCountElements = document.querySelectorAll('.wishlist-count-mobile');
        wishlistCountElements.forEach(element => {
            element.textContent = count;
            element.style.display = count > 0 ? 'inline' : 'none';
        });
    }

    updateUserState() {
        // Update user state in mobile menu when user logs in/out
        this.updateUserSection();
    }
}

// Initialize mobile menu when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.mobileMenu = new MobileMenu();
});

// Export for global access
window.MobileMenu = MobileMenu;

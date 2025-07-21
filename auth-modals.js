/**
 * Authentication Modals for Lotus Glass v4.0
 * Login and Registration modal components
 */

class AuthModals {
    constructor() {
        this.init();
    }

    init() {
        this.createModals();
        this.bindEvents();
    }

    createModals() {
        const modalsHTML = `
            <!-- Login Modal -->
            <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header border-0">
                            <h5 class="modal-title fw-bold" id="loginModalLabel">
                                <i class="fas fa-sign-in-alt me-2 text-primary"></i>
                                Đăng nhập
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Đóng"></button>
                        </div>
                        <div class="modal-body">
                            <form id="loginForm" novalidate>
                                <div class="mb-3">
                                    <label class="lotus-form-label required">
                                        <i class="fas fa-envelope me-1"></i>
                                        Email hoặc số điện thoại
                                    </label>
                                    <input type="text" 
                                           class="lotus-form-control" 
                                           name="username" 
                                           required
                                           placeholder="Nhập email hoặc số điện thoại"
                                           autocomplete="username">
                                    <div class="lotus-form-error" id="loginUsernameError"></div>
                                </div>
                                
                                <div class="mb-3">
                                    <label class="lotus-form-label required">
                                        <i class="fas fa-lock me-1"></i>
                                        Mật khẩu
                                    </label>
                                    <div class="position-relative">
                                        <input type="password" 
                                               class="lotus-form-control" 
                                               name="password" 
                                               required
                                               placeholder="Nhập mật khẩu"
                                               autocomplete="current-password">
                                        <button type="button" 
                                                class="btn btn-link position-absolute end-0 top-50 translate-middle-y pe-3" 
                                                onclick="togglePasswordVisibility('loginForm', 'password')">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                    </div>
                                    <div class="lotus-form-error" id="loginPasswordError"></div>
                                </div>
                                
                                <div class="mb-3 form-check">
                                    <input type="checkbox" class="form-check-input" id="rememberMe" name="rememberMe">
                                    <label class="form-check-label" for="rememberMe">
                                        Ghi nhớ đăng nhập
                                    </label>
                                </div>
                                
                                <div class="d-grid mb-3">
                                    <button type="submit" class="lotus-btn lotus-btn-primary lotus-btn-lg">
                                        <span class="btn-text">
                                            <i class="fas fa-sign-in-alt me-2"></i>
                                            Đăng nhập
                                        </span>
                                        <span class="btn-loading d-none">
                                            <div class="spinner-border spinner-border-sm me-2" role="status">
                                                <span class="visually-hidden">Đang xử lý...</span>
                                            </div>
                                            Đang đăng nhập...
                                        </span>
                                    </button>
                                </div>
                                
                                <div class="text-center">
                                    <a href="#" class="text-decoration-none" onclick="showForgotPassword()">
                                        Quên mật khẩu?
                                    </a>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer border-0 justify-content-center">
                            <div class="text-center">
                                <span class="text-muted">Chưa có tài khoản? </span>
                                <a href="#" class="text-decoration-none fw-semibold" 
                                   data-bs-dismiss="modal" 
                                   data-bs-toggle="modal" 
                                   data-bs-target="#registerModal">
                                    Đăng ký ngay
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Register Modal -->
            <div class="modal fade" id="registerModal" tabindex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">
                        <div class="modal-header border-0">
                            <h5 class="modal-title fw-bold" id="registerModalLabel">
                                <i class="fas fa-user-plus me-2 text-primary"></i>
                                Đăng ký tài khoản
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Đóng"></button>
                        </div>
                        <div class="modal-body">
                            <form id="registerForm" novalidate>
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <div class="lotus-form-group">
                                            <label class="lotus-form-label required">
                                                <i class="fas fa-user me-1"></i>
                                                Họ và tên
                                            </label>
                                            <input type="text" 
                                                   class="lotus-form-control" 
                                                   name="name" 
                                                   required
                                                   placeholder="Nhập họ và tên đầy đủ"
                                                   autocomplete="name">
                                            <div class="lotus-form-error" id="registerNameError"></div>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <div class="lotus-form-group">
                                            <label class="lotus-form-label required">
                                                <i class="fas fa-phone me-1"></i>
                                                Số điện thoại
                                            </label>
                                            <input type="tel" 
                                                   class="lotus-form-control" 
                                                   name="phone" 
                                                   required
                                                   placeholder="0123456789"
                                                   pattern="[0-9]{10,11}"
                                                   autocomplete="tel">
                                            <div class="lotus-form-error" id="registerPhoneError"></div>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-12">
                                        <div class="lotus-form-group">
                                            <label class="lotus-form-label required">
                                                <i class="fas fa-envelope me-1"></i>
                                                Email
                                            </label>
                                            <input type="email" 
                                                   class="lotus-form-control" 
                                                   name="email" 
                                                   required
                                                   placeholder="email@example.com"
                                                   autocomplete="email">
                                            <div class="lotus-form-error" id="registerEmailError"></div>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <div class="lotus-form-group">
                                            <label class="lotus-form-label required">
                                                <i class="fas fa-lock me-1"></i>
                                                Mật khẩu
                                            </label>
                                            <div class="position-relative">
                                                <input type="password" 
                                                       class="lotus-form-control" 
                                                       name="password" 
                                                       required
                                                       placeholder="Tối thiểu 6 ký tự"
                                                       minlength="6"
                                                       autocomplete="new-password">
                                                <button type="button" 
                                                        class="btn btn-link position-absolute end-0 top-50 translate-middle-y pe-3" 
                                                        onclick="togglePasswordVisibility('registerForm', 'password')">
                                                    <i class="fas fa-eye"></i>
                                                </button>
                                            </div>
                                            <div class="lotus-form-error" id="registerPasswordError"></div>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <div class="lotus-form-group">
                                            <label class="lotus-form-label required">
                                                <i class="fas fa-lock me-1"></i>
                                                Xác nhận mật khẩu
                                            </label>
                                            <div class="position-relative">
                                                <input type="password" 
                                                       class="lotus-form-control" 
                                                       name="confirmPassword" 
                                                       required
                                                       placeholder="Nhập lại mật khẩu"
                                                       autocomplete="new-password">
                                                <button type="button" 
                                                        class="btn btn-link position-absolute end-0 top-50 translate-middle-y pe-3" 
                                                        onclick="togglePasswordVisibility('registerForm', 'confirmPassword')">
                                                    <i class="fas fa-eye"></i>
                                                </button>
                                            </div>
                                            <div class="lotus-form-error" id="registerConfirmPasswordError"></div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="mt-4">
                                    <div class="form-check mb-3">
                                        <input type="checkbox" class="form-check-input" id="agreeTerms" name="agreeTerms" required>
                                        <label class="form-check-label" for="agreeTerms">
                                            Tôi đồng ý với 
                                            <a href="#" class="text-primary">Điều khoản dịch vụ</a> và 
                                            <a href="#" class="text-primary">Chính sách bảo mật</a>
                                        </label>
                                        <div class="lotus-form-error" id="registerTermsError"></div>
                                    </div>
                                    
                                    <div class="form-check mb-3">
                                        <input type="checkbox" class="form-check-input" id="subscribeNewsletter" name="subscribeNewsletter">
                                        <label class="form-check-label" for="subscribeNewsletter">
                                            Đăng ký nhận thông tin khuyến mãi và sản phẩm mới
                                        </label>
                                    </div>
                                </div>
                                
                                <div class="d-grid">
                                    <button type="submit" class="lotus-btn lotus-btn-primary lotus-btn-lg">
                                        <span class="btn-text">
                                            <i class="fas fa-user-plus me-2"></i>
                                            Đăng ký tài khoản
                                        </span>
                                        <span class="btn-loading d-none">
                                            <div class="spinner-border spinner-border-sm me-2" role="status">
                                                <span class="visually-hidden">Đang xử lý...</span>
                                            </div>
                                            Đang đăng ký...
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer border-0 justify-content-center">
                            <div class="text-center">
                                <span class="text-muted">Đã có tài khoản? </span>
                                <a href="#" class="text-decoration-none fw-semibold" 
                                   data-bs-dismiss="modal" 
                                   data-bs-toggle="modal" 
                                   data-bs-target="#loginModal">
                                    Đăng nhập ngay
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Search Modal -->
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
                            <form id="searchForm">
                                <div class="lotus-input-group">
                                    <input type="search" 
                                           class="lotus-form-control lotus-form-control-lg" 
                                           name="query"
                                           placeholder="Nhập từ khóa tìm kiếm..."
                                           autocomplete="off"
                                           autofocus>
                                    <div class="lotus-input-group-append">
                                        <button type="submit" class="lotus-btn lotus-btn-primary lotus-btn-lg">
                                            <i class="fas fa-search"></i>
                                        </button>
                                    </div>
                                </div>
                            </form>
                            
                            <div class="mt-4">
                                <h6 class="fw-semibold mb-3">Tìm kiếm phổ biến</h6>
                                <div class="d-flex flex-wrap gap-2">
                                    <span class="badge bg-light text-dark border search-suggestion" onclick="searchSuggestion('ly thủy tinh')">ly thủy tinh</span>
                                    <span class="badge bg-light text-dark border search-suggestion" onclick="searchSuggestion('bình hoa')">bình hoa</span>
                                    <span class="badge bg-light text-dark border search-suggestion" onclick="searchSuggestion('chén dĩa')">chén dĩa</span>
                                    <span class="badge bg-light text-dark border search-suggestion" onclick="searchSuggestion('bộ gia vị')">bộ gia vị</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalsHTML);
    }

    bindEvents() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', this.handleRegister.bind(this));
        }

        // Search form
        const searchForm = document.getElementById('searchForm');
        if (searchForm) {
            searchForm.addEventListener('submit', this.handleSearch.bind(this));
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validate form
        if (!this.validateLoginForm(data)) {
            return;
        }
        
        // Show loading
        this.toggleFormLoading(form, true);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Mock successful login
            const user = {
                id: generateId(),
                name: 'Khách hàng',
                email: data.username.includes('@') ? data.username : 'customer@example.com',
                phone: data.username.includes('@') ? '0123456789' : data.username,
                memberLevel: 'Đồng',
                loginAt: new Date().toISOString()
            };
            
            // Save user
            setCurrentUser(user);
            
            // Close modal
            bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
            
            // Show success
            showToast('Đăng nhập thành công!', 'success');
            
        } catch (error) {
            showToast('Có lỗi xảy ra khi đăng nhập', 'error');
        } finally {
            this.toggleFormLoading(form, false);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validate form
        if (!this.validateRegisterForm(data)) {
            return;
        }
        
        // Show loading
        this.toggleFormLoading(form, true);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Mock successful registration
            const user = {
                id: generateId(),
                name: data.name,
                email: data.email,
                phone: data.phone,
                memberLevel: 'Đồng',
                registeredAt: new Date().toISOString()
            };
            
            // Save user
            setCurrentUser(user);
            
            // Close modal
            bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
            
            // Show success
            showToast('Đăng ký thành công! Chào mừng bạn đến với Lotus Glass!', 'success');
            
        } catch (error) {
            showToast('Có lỗi xảy ra khi đăng ký', 'error');
        } finally {
            this.toggleFormLoading(form, false);
        }
    }

    handleSearch(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const query = formData.get('query').trim();
        
        if (query) {
            // Close modal
            bootstrap.Modal.getInstance(document.getElementById('searchModal')).hide();
            
            // Redirect to store with search query
            window.location.href = `store.html?search=${encodeURIComponent(query)}`;
        }
    }

    validateLoginForm(data) {
        let isValid = true;
        
        // Clear previous errors
        document.querySelectorAll('#loginForm .lotus-form-error').forEach(el => {
            el.textContent = '';
            el.previousElementSibling.classList.remove('error');
        });
        
        // Validate username
        if (!data.username.trim()) {
            this.showFieldError('loginUsernameError', 'Vui lòng nhập email hoặc số điện thoại');
            isValid = false;
        }
        
        // Validate password
        if (!data.password.trim()) {
            this.showFieldError('loginPasswordError', 'Vui lòng nhập mật khẩu');
            isValid = false;
        }
        
        return isValid;
    }

    validateRegisterForm(data) {
        let isValid = true;
        
        // Clear previous errors
        document.querySelectorAll('#registerForm .lotus-form-error').forEach(el => {
            el.textContent = '';
            el.previousElementSibling.classList.remove('error');
        });
        
        // Validate name
        if (!data.name.trim()) {
            this.showFieldError('registerNameError', 'Vui lòng nhập họ và tên');
            isValid = false;
        }
        
        // Validate phone
        if (!data.phone.trim()) {
            this.showFieldError('registerPhoneError', 'Vui lòng nhập số điện thoại');
            isValid = false;
        } else if (!validatePhone(data.phone)) {
            this.showFieldError('registerPhoneError', 'Số điện thoại không hợp lệ');
            isValid = false;
        }
        
        // Validate email
        if (!data.email.trim()) {
            this.showFieldError('registerEmailError', 'Vui lòng nhập email');
            isValid = false;
        } else if (!validateEmail(data.email)) {
            this.showFieldError('registerEmailError', 'Email không hợp lệ');
            isValid = false;
        }
        
        // Validate password
        if (!data.password.trim()) {
            this.showFieldError('registerPasswordError', 'Vui lòng nhập mật khẩu');
            isValid = false;
        } else if (data.password.length < 6) {
            this.showFieldError('registerPasswordError', 'Mật khẩu phải có ít nhất 6 ký tự');
            isValid = false;
        }
        
        // Validate confirm password
        if (!data.confirmPassword.trim()) {
            this.showFieldError('registerConfirmPasswordError', 'Vui lòng xác nhận mật khẩu');
            isValid = false;
        } else if (data.password !== data.confirmPassword) {
            this.showFieldError('registerConfirmPasswordError', 'Mật khẩu xác nhận không khớp');
            isValid = false;
        }
        
        // Validate terms
        if (!data.agreeTerms) {
            this.showFieldError('registerTermsError', 'Vui lòng đồng ý với điều khoản dịch vụ');
            isValid = false;
        }
        
        return isValid;
    }

    showFieldError(errorId, message) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = message;
            const input = errorElement.previousElementSibling;
            if (input && input.tagName === 'INPUT') {
                input.classList.add('error');
            }
        }
    }

    toggleFormLoading(form, isLoading) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        if (isLoading) {
            btnText.classList.add('d-none');
            btnLoading.classList.remove('d-none');
            submitBtn.disabled = true;
        } else {
            btnText.classList.remove('d-none');
            btnLoading.classList.add('d-none');
            submitBtn.disabled = false;
        }
    }
}

// Helper functions
function togglePasswordVisibility(formId, fieldName) {
    const form = document.getElementById(formId);
    const input = form.querySelector(`input[name="${fieldName}"]`);
    const button = input.nextElementSibling.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        button.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        button.className = 'fas fa-eye';
    }
}

function showForgotPassword() {
    showAlert('Vui lòng liên hệ hotline 0123-456-789 để được hỗ trợ khôi phục mật khẩu.', 'info', 'Quên mật khẩu');
}

function searchSuggestion(query) {
    const searchInput = document.querySelector('#searchForm input[name="query"]');
    if (searchInput) {
        searchInput.value = query;
        document.getElementById('searchForm').dispatchEvent(new Event('submit'));
    }
}

// Initialize auth modals when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.authModals = new AuthModals();
});

// Export for global access
window.AuthModals = AuthModals;

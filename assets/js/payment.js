/**
 * 🌸 LOTUS GLASS - PAYMENT SYSTEM
 * COD & Bank Transfer with QR Code Generation
 * Version: 4.0 - Database Schema Compliant
 */

// ====================== PAYMENT CONFIGURATION ======================

const PAYMENT_CONFIG = {
    // Payment Methods
    METHODS: {
        COD: {
            id: 'COD',
            name: 'Thanh toán khi nhận hàng (COD)',
            description: 'Thanh toán bằng tiền mặt khi nhận hàng',
            icon: 'fas fa-money-bill-wave',
            enabled: true,
            fee: 0,
            discount: 0
        },
        BANK_TRANSFER: {
            id: 'BANK_TRANSFER',
            name: 'Chuyển khoản ngân hàng',
            description: 'Chuyển khoản qua QR Code hoặc thông tin tài khoản',
            icon: 'fas fa-university',
            enabled: true,
            fee: 0,
            discount: 0.02 // 2% discount
        }
    },
    
    // Bank Information (will be loaded from config)
    BANK_INFO: {
        accountName: 'VO QUANG HIEU',
        accountNumber: '0886468660',
        bankName: 'MB Bank',
        bankCode: '970422'
    },
    
    // QR Code Settings
    QR_CONFIG: {
        baseUrl: 'https://img.vietqr.io/image',
        template: 'compact',
        format: 'png'
    }
};

// ====================== PAYMENT MANAGER ======================

class PaymentManager {
    constructor() {
        this.selectedMethod = null;
        this.orderData = null;
        this.qrCodeData = null;
        this.init();
    }
    
    init() {
        this.loadBankInfo();
        this.setupEventListeners();
    }
    
    /**
     * Load bank information from site config
     */
    async loadBankInfo() {
        try {
            const config = await getSiteConfig();
            if (config.success && config.data.business) {
                PAYMENT_CONFIG.BANK_INFO = {
                    accountName: config.data.business.bank_account_name || 'VO QUANG HIEU',
                    accountNumber: config.data.business.bank_number || '0886468660',
                    bankName: config.data.business.bank_name || 'MB Bank',
                    bankCode: '970422' // MB Bank BIN
                };
                
                // Update discount from config
                PAYMENT_CONFIG.METHODS.BANK_TRANSFER.discount = 
                    config.data.ecommerce?.bank_transfer_discount || 0.02;
            }
        } catch (error) {
            console.warn('Could not load bank info from config:', error);
        }
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Payment method selection
        document.addEventListener('change', (e) => {
            if (e.target.name === 'paymentMethod') {
                this.selectPaymentMethod(e.target.value);
            }
        });
        
        // QR code generation button
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('generate-qr-btn')) {
                this.generateQRCode();
            }
        });
    }
    
    /**
     * Render payment methods
     */
    renderPaymentMethods(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const methodsHtml = Object.values(PAYMENT_CONFIG.METHODS)
            .filter(method => method.enabled)
            .map(method => this.createPaymentMethodHtml(method))
            .join('');
        
        container.innerHTML = `
            <div class="payment-methods">
                <h5 class="mb-3">Chọn phương thức thanh toán</h5>
                ${methodsHtml}
            </div>
        `;
    }
    
    /**
     * Create payment method HTML
     */
    createPaymentMethodHtml(method) {
        const discountText = method.discount > 0 
            ? `<span class="discount-badge">Giảm ${(method.discount * 100)}%</span>` 
            : '';
        
        return `
            <div class="payment-method-item">
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="paymentMethod" 
                           id="${method.id}" value="${method.id}">
                    <label class="form-check-label" for="${method.id}">
                        <div class="payment-method-content">
                            <div class="payment-method-header">
                                <i class="${method.icon}"></i>
                                <span class="method-name">${method.name}</span>
                                ${discountText}
                            </div>
                            <div class="payment-method-description">
                                ${method.description}
                            </div>
                        </div>
                    </label>
                </div>
            </div>
        `;
    }
    
    /**
     * Select payment method
     */
    selectPaymentMethod(methodId) {
        this.selectedMethod = methodId;
        
        // Update UI
        this.updatePaymentMethodUI(methodId);
        
        // Show/hide method-specific content
        this.togglePaymentMethodContent(methodId);
        
        // Recalculate totals if order data exists
        if (this.orderData) {
            this.updateOrderTotals();
        }
    }
    
    /**
     * Update payment method UI
     */
    updatePaymentMethodUI(methodId) {
        // Remove active class from all methods
        document.querySelectorAll('.payment-method-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to selected method
        const selectedItem = document.querySelector(`#${methodId}`).closest('.payment-method-item');
        if (selectedItem) {
            selectedItem.classList.add('active');
        }
    }
    
    /**
     * Toggle payment method specific content
     */
    togglePaymentMethodContent(methodId) {
        // Hide all method content
        document.querySelectorAll('.payment-method-content-detail').forEach(content => {
            content.style.display = 'none';
        });
        
        // Show selected method content
        const selectedContent = document.getElementById(`${methodId}-content`);
        if (selectedContent) {
            selectedContent.style.display = 'block';
        }
        
        // Special handling for bank transfer
        if (methodId === 'BANK_TRANSFER') {
            this.showBankTransferInfo();
        }
    }
    
    /**
     * Show bank transfer information
     */
    showBankTransferInfo() {
        const bankInfoContainer = document.getElementById('bank-transfer-info');
        if (!bankInfoContainer) return;
        
        const bankInfo = PAYMENT_CONFIG.BANK_INFO;
        
        bankInfoContainer.innerHTML = `
            <div class="bank-info-card">
                <h6>Thông tin chuyển khoản</h6>
                <div class="bank-details">
                    <div class="bank-detail-item">
                        <label>Tên tài khoản:</label>
                        <span class="bank-value">${bankInfo.accountName}</span>
                        <button class="btn btn-sm btn-outline-primary copy-btn" 
                                onclick="copyToClipboard('${bankInfo.accountName}')">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <div class="bank-detail-item">
                        <label>Số tài khoản:</label>
                        <span class="bank-value">${bankInfo.accountNumber}</span>
                        <button class="btn btn-sm btn-outline-primary copy-btn" 
                                onclick="copyToClipboard('${bankInfo.accountNumber}')">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <div class="bank-detail-item">
                        <label>Ngân hàng:</label>
                        <span class="bank-value">${bankInfo.bankName}</span>
                    </div>
                </div>
                <div class="qr-code-section">
                    <button class="btn btn-primary generate-qr-btn">
                        <i class="fas fa-qrcode"></i> Tạo mã QR
                    </button>
                    <div id="qr-code-container" class="mt-3"></div>
                </div>
            </div>
        `;
    }
    
    /**
     * Generate QR code for bank transfer
     */
    async generateQRCode() {
        if (!this.orderData) {
            showToast('Vui lòng hoàn tất thông tin đơn hàng trước', 'warning');
            return;
        }
        
        try {
            showLoading(document.getElementById('qr-code-container'));
            
            const result = await generateQRCode(this.orderData.orderId, this.orderData.finalAmount);
            
            if (result.success) {
                this.qrCodeData = result.data;
                this.displayQRCode(result.data);
            } else {
                showError(document.getElementById('qr-code-container'), result.message);
            }
            
        } catch (error) {
            console.error('QR Code generation error:', error);
            showError(document.getElementById('qr-code-container'), 'Không thể tạo mã QR');
        }
    }
    
    /**
     * Display QR code
     */
    displayQRCode(qrData) {
        const container = document.getElementById('qr-code-container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="qr-code-display">
                <div class="qr-image-container">
                    <img src="${qrData.qrUrl}" alt="QR Code" class="qr-image">
                </div>
                <div class="qr-info">
                    <p><strong>Số tiền:</strong> ${formatCurrency(qrData.amount)}</p>
                    <p><strong>Nội dung:</strong> ${qrData.description}</p>
                </div>
                <div class="qr-instructions">
                    <h6>Hướng dẫn thanh toán:</h6>
                    <ol>
                        ${qrData.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
                    </ol>
                </div>
            </div>
        `;
    }
    
    /**
     * Set order data for payment calculation
     */
    setOrderData(orderData) {
        this.orderData = orderData;
        this.updateOrderTotals();
    }
    
    /**
     * Update order totals based on selected payment method
     */
    updateOrderTotals() {
        if (!this.orderData || !this.selectedMethod) return;
        
        const method = PAYMENT_CONFIG.METHODS[this.selectedMethod];
        if (!method) return;
        
        // Calculate discount
        const discountAmount = this.orderData.productAmount * method.discount;
        const finalAmount = this.orderData.productAmount + this.orderData.shippingFee - discountAmount;
        
        // Update order data
        this.orderData.paymentDiscount = discountAmount;
        this.orderData.finalAmount = finalAmount;
        
        // Update UI
        this.updateTotalsDisplay();
    }
    
    /**
     * Update totals display in UI
     */
    updateTotalsDisplay() {
        const elements = {
            productAmount: document.getElementById('product-amount'),
            shippingFee: document.getElementById('shipping-fee'),
            paymentDiscount: document.getElementById('payment-discount'),
            finalAmount: document.getElementById('final-amount')
        };
        
        if (elements.productAmount) {
            elements.productAmount.textContent = formatCurrency(this.orderData.productAmount);
        }
        
        if (elements.shippingFee) {
            elements.shippingFee.textContent = formatCurrency(this.orderData.shippingFee);
        }
        
        if (elements.paymentDiscount) {
            elements.paymentDiscount.textContent = formatCurrency(this.orderData.paymentDiscount || 0);
            elements.paymentDiscount.parentElement.style.display = 
                this.orderData.paymentDiscount > 0 ? 'block' : 'none';
        }
        
        if (elements.finalAmount) {
            elements.finalAmount.textContent = formatCurrency(this.orderData.finalAmount);
        }
    }
    
    /**
     * Get selected payment method
     */
    getSelectedMethod() {
        return this.selectedMethod;
    }
    
    /**
     * Get payment data for order submission
     */
    getPaymentData() {
        return {
            method: this.selectedMethod,
            qrCode: this.qrCodeData,
            bankInfo: PAYMENT_CONFIG.BANK_INFO
        };
    }
}

// ====================== UTILITY FUNCTIONS ======================

/**
 * Copy text to clipboard
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Đã sao chép vào clipboard', 'success');
    }).catch(() => {
        showToast('Không thể sao chép', 'error');
    });
}

// ====================== GLOBAL INSTANCE ======================

// Create global payment manager instance
let paymentManager;

// Initialize when DOM is ready
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            paymentManager = new PaymentManager();
        });
    } else {
        paymentManager = new PaymentManager();
    }
}

console.log('🌸 Lotus Glass Payment System v4.0 loaded');

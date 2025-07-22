/**
 * 🌸 LOTUS GLASS - DATA VALIDATION SYSTEM
 * Comprehensive validation for all data types
 * Version: 4.0 - Database Schema Compliant
 */

// ====================== VALIDATION RULES ======================

const VALIDATION_RULES = {
    // Customer validation
    customer: {
        phone: {
            pattern: /^[0-9]{10}$/,
            message: 'Số điện thoại phải có 10 chữ số'
        },
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Email không hợp lệ'
        },
        name: {
            minLength: 2,
            maxLength: 100,
            message: 'Tên phải từ 2-100 ký tự'
        },
        address: {
            minLength: 10,
            maxLength: 500,
            message: 'Địa chỉ phải từ 10-500 ký tự'
        }
    },
    
    // Product validation
    product: {
        id: {
            pattern: /^LTG[0-9]{4}$/,
            message: 'Mã sản phẩm phải có định dạng LTG0000'
        },
        name: {
            minLength: 5,
            maxLength: 200,
            message: 'Tên sản phẩm phải từ 5-200 ký tự'
        },
        price: {
            min: 1000,
            max: 50000000,
            message: 'Giá sản phẩm phải từ 1,000 - 50,000,000 VNĐ'
        },
        stock: {
            min: 0,
            max: 10000,
            message: 'Tồn kho phải từ 0-10,000'
        }
    },
    
    // Order validation
    order: {
        id: {
            pattern: /^ORD[0-9]{10}$/,
            message: 'Mã đơn hàng phải có định dạng ORD0000000000'
        },
        quantity: {
            min: 1,
            max: 100,
            message: 'Số lượng phải từ 1-100'
        },
        amount: {
            min: 1000,
            max: 100000000,
            message: 'Số tiền phải từ 1,000 - 100,000,000 VNĐ'
        }
    },
    
    // Review validation
    review: {
        rating: {
            min: 1,
            max: 5,
            message: 'Đánh giá phải từ 1-5 sao'
        },
        comment: {
            minLength: 10,
            maxLength: 1000,
            message: 'Nhận xét phải từ 10-1000 ký tự'
        }
    },
    
    // Payment validation
    payment: {
        methods: ['COD', 'BANK_TRANSFER'],
        bankAccount: {
            pattern: /^[0-9]{6,20}$/,
            message: 'Số tài khoản phải từ 6-20 chữ số'
        }
    }
};

// ====================== VALIDATION FUNCTIONS ======================

/**
 * Validate customer data
 */
function validateCustomer(customerData) {
    const errors = [];
    
    // Phone validation
    if (!customerData.phone) {
        errors.push('Số điện thoại là bắt buộc');
    } else if (!VALIDATION_RULES.customer.phone.pattern.test(customerData.phone)) {
        errors.push(VALIDATION_RULES.customer.phone.message);
    }
    
    // Email validation (optional but must be valid if provided)
    if (customerData.email && !VALIDATION_RULES.customer.email.pattern.test(customerData.email)) {
        errors.push(VALIDATION_RULES.customer.email.message);
    }
    
    // Name validation
    if (!customerData.name) {
        errors.push('Tên khách hàng là bắt buộc');
    } else {
        const nameLength = customerData.name.trim().length;
        if (nameLength < VALIDATION_RULES.customer.name.minLength || 
            nameLength > VALIDATION_RULES.customer.name.maxLength) {
            errors.push(VALIDATION_RULES.customer.name.message);
        }
    }
    
    // Address validation
    if (customerData.address) {
        const addressLength = customerData.address.trim().length;
        if (addressLength < VALIDATION_RULES.customer.address.minLength || 
            addressLength > VALIDATION_RULES.customer.address.maxLength) {
            errors.push(VALIDATION_RULES.customer.address.message);
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Validate product data
 */
function validateProduct(productData) {
    const errors = [];
    
    // Product ID validation
    if (!productData.id) {
        errors.push('Mã sản phẩm là bắt buộc');
    } else if (!VALIDATION_RULES.product.id.pattern.test(productData.id)) {
        errors.push(VALIDATION_RULES.product.id.message);
    }
    
    // Name validation
    if (!productData.name) {
        errors.push('Tên sản phẩm là bắt buộc');
    } else {
        const nameLength = productData.name.trim().length;
        if (nameLength < VALIDATION_RULES.product.name.minLength || 
            nameLength > VALIDATION_RULES.product.name.maxLength) {
            errors.push(VALIDATION_RULES.product.name.message);
        }
    }
    
    // Price validation
    if (productData.price === undefined || productData.price === null) {
        errors.push('Giá sản phẩm là bắt buộc');
    } else {
        const price = parseFloat(productData.price);
        if (isNaN(price) || price < VALIDATION_RULES.product.price.min || 
            price > VALIDATION_RULES.product.price.max) {
            errors.push(VALIDATION_RULES.product.price.message);
        }
    }
    
    // Stock validation
    if (productData.stock !== undefined) {
        const stock = parseInt(productData.stock);
        if (isNaN(stock) || stock < VALIDATION_RULES.product.stock.min || 
            stock > VALIDATION_RULES.product.stock.max) {
            errors.push(VALIDATION_RULES.product.stock.message);
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Validate order data
 */
function validateOrder(orderData) {
    const errors = [];
    
    // Customer info validation
    if (!orderData.customerInfo) {
        errors.push('Thông tin khách hàng là bắt buộc');
    } else {
        const customerValidation = validateCustomer(orderData.customerInfo);
        if (!customerValidation.isValid) {
            errors.push(...customerValidation.errors);
        }
    }
    
    // Shipping info validation
    if (!orderData.shippingInfo || !orderData.shippingInfo.address) {
        errors.push('Địa chỉ giao hàng là bắt buộc');
    }
    
    // Items validation
    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
        errors.push('Đơn hàng phải có ít nhất 1 sản phẩm');
    } else {
        orderData.items.forEach((item, index) => {
            if (!item.productId) {
                errors.push(`Sản phẩm ${index + 1}: Mã sản phẩm là bắt buộc`);
            }
            
            const quantity = parseInt(item.quantity);
            if (isNaN(quantity) || quantity < VALIDATION_RULES.order.quantity.min || 
                quantity > VALIDATION_RULES.order.quantity.max) {
                errors.push(`Sản phẩm ${index + 1}: ${VALIDATION_RULES.order.quantity.message}`);
            }
        });
    }
    
    // Payment method validation
    if (!orderData.paymentMethod) {
        errors.push('Phương thức thanh toán là bắt buộc');
    } else if (!VALIDATION_RULES.payment.methods.includes(orderData.paymentMethod)) {
        errors.push('Phương thức thanh toán không hợp lệ');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Validate review data
 */
function validateReview(reviewData) {
    const errors = [];
    
    // Product ID validation
    if (!reviewData.productId) {
        errors.push('Mã sản phẩm là bắt buộc');
    }
    
    // Customer phone validation
    if (!reviewData.customerPhone) {
        errors.push('Số điện thoại khách hàng là bắt buộc');
    } else if (!VALIDATION_RULES.customer.phone.pattern.test(reviewData.customerPhone)) {
        errors.push(VALIDATION_RULES.customer.phone.message);
    }
    
    // Rating validation
    if (reviewData.rating === undefined || reviewData.rating === null) {
        errors.push('Đánh giá sao là bắt buộc');
    } else {
        const rating = parseInt(reviewData.rating);
        if (isNaN(rating) || rating < VALIDATION_RULES.review.rating.min || 
            rating > VALIDATION_RULES.review.rating.max) {
            errors.push(VALIDATION_RULES.review.rating.message);
        }
    }
    
    // Comment validation
    if (!reviewData.comment) {
        errors.push('Nhận xét là bắt buộc');
    } else {
        const commentLength = reviewData.comment.trim().length;
        if (commentLength < VALIDATION_RULES.review.comment.minLength || 
            commentLength > VALIDATION_RULES.review.comment.maxLength) {
            errors.push(VALIDATION_RULES.review.comment.message);
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Validate return request data
 */
function validateReturn(returnData) {
    const errors = [];
    
    // Order ID validation
    if (!returnData.orderId) {
        errors.push('Mã đơn hàng là bắt buộc');
    }
    
    // Customer phone validation
    if (!returnData.customerPhone) {
        errors.push('Số điện thoại khách hàng là bắt buộc');
    } else if (!VALIDATION_RULES.customer.phone.pattern.test(returnData.customerPhone)) {
        errors.push(VALIDATION_RULES.customer.phone.message);
    }
    
    // Reason validation
    if (!returnData.reason) {
        errors.push('Lý do trả hàng là bắt buộc');
    } else if (returnData.reason.trim().length < 5) {
        errors.push('Lý do trả hàng phải có ít nhất 5 ký tự');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Validate membership tier data
 */
function validateMembershipTier(totalSpending) {
    const errors = [];
    
    if (totalSpending === undefined || totalSpending === null) {
        errors.push('Tổng chi tiêu là bắt buộc');
    } else {
        const spending = parseFloat(totalSpending);
        if (isNaN(spending) || spending < 0) {
            errors.push('Tổng chi tiêu phải là số không âm');
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Sanitize input data
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .replace(/['"]/g, '') // Remove quotes
        .substring(0, 1000); // Limit length
}

/**
 * Validate and sanitize form data
 */
function validateAndSanitizeForm(formData, validationType) {
    const sanitizedData = {};
    
    // Sanitize all string inputs
    for (const [key, value] of Object.entries(formData)) {
        sanitizedData[key] = sanitizeInput(value);
    }
    
    // Validate based on type
    let validation;
    switch (validationType) {
        case 'customer':
            validation = validateCustomer(sanitizedData);
            break;
        case 'product':
            validation = validateProduct(sanitizedData);
            break;
        case 'order':
            validation = validateOrder(sanitizedData);
            break;
        case 'review':
            validation = validateReview(sanitizedData);
            break;
        case 'return':
            validation = validateReturn(sanitizedData);
            break;
        default:
            validation = { isValid: true, errors: [] };
    }
    
    return {
        data: sanitizedData,
        validation: validation
    };
}

/**
 * Check data integrity
 */
function checkDataIntegrity(data, schema) {
    const errors = [];
    
    // Check required fields
    if (schema.required) {
        schema.required.forEach(field => {
            if (!(field in data) || data[field] === null || data[field] === undefined) {
                errors.push(`Trường bắt buộc '${field}' bị thiếu`);
            }
        });
    }
    
    // Check field types
    if (schema.types) {
        Object.entries(schema.types).forEach(([field, expectedType]) => {
            if (field in data && typeof data[field] !== expectedType) {
                errors.push(`Trường '${field}' phải có kiểu ${expectedType}`);
            }
        });
    }
    
    // Check field formats
    if (schema.formats) {
        Object.entries(schema.formats).forEach(([field, pattern]) => {
            if (field in data && typeof data[field] === 'string' && !pattern.test(data[field])) {
                errors.push(`Trường '${field}' có định dạng không hợp lệ`);
            }
        });
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// ====================== EXPORT FUNCTIONS ======================

// Make functions globally available
if (typeof window !== 'undefined') {
    window.validateCustomer = validateCustomer;
    window.validateProduct = validateProduct;
    window.validateOrder = validateOrder;
    window.validateReview = validateReview;
    window.validateReturn = validateReturn;
    window.validateMembershipTier = validateMembershipTier;
    window.sanitizeInput = sanitizeInput;
    window.validateAndSanitizeForm = validateAndSanitizeForm;
    window.checkDataIntegrity = checkDataIntegrity;
    window.VALIDATION_RULES = VALIDATION_RULES;
}

console.log('🌸 Lotus Glass Validation System v4.0 loaded');

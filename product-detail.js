// Product Detail Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    loadProductData();
    setupEventListeners();
    updateCartIcon();
});

// Load product data from localStorage
function loadProductData() {
    const productData = JSON.parse(localStorage.getItem('selectedProduct'));
    
    if (!productData) {
        // Redirect back to shop if no product data
        window.location.href = 'shop.html';
        return;
    }
    
    // Update page title
    document.title = `${productData.name} - MIRMIA Natural Wellness & Beauty`;
    
    // Update product information
    document.getElementById('product-name').textContent = productData.name;
    document.getElementById('product-name-breadcrumb').textContent = productData.name;
    document.getElementById('product-price').textContent = productData.price;
    document.getElementById('product-description').textContent = productData.description;
    document.getElementById('detailed-description').textContent = productData.description;
    document.getElementById('product-category').textContent = productData.category;
    document.getElementById('product-category-display').textContent = productData.category;
    
    // Update product icon based on name
    updateProductIcon(productData.name);
    
    // Update SKU based on product name
    updateProductSKU(productData.name);
}

// Update product icon based on product name
function updateProductIcon(productName) {
    const iconMap = {
        'Wellness Elixir': 'fas fa-spa',
        'Immunity Boost Tonic': 'fas fa-leaf',
        'Beauty Serum': 'fas fa-seedling',
        'Glow Face Mask': 'fas fa-gem',
        'Hydrating Moisturizer': 'fas fa-tint',
        'Natural Sunscreen': 'fas fa-sun',
        'Calm Essential Oil': 'fas fa-moon',
        'Energy Boost Oil': 'fas fa-fire',
        'Heart Health Tonic': 'fas fa-heart',
        'Focus & Clarity Blend': 'fas fa-brain',
        'Eye Contour Gel': 'fas fa-eye',
        'Natural Lip Balm': 'fas fa-lips',
        'Gentle Cleanser': 'fas fa-wind',
        'Anti-Aging Night Cream': 'fas fa-magic',
        'Sleep Well Diffuser Blend': 'fas fa-bed',
        'Rose & Lavender Mist': 'fas fa-rose'
    };
    
    const iconClass = iconMap[productName] || 'fas fa-box';
    
    // Update main icon
    const mainIcon = document.getElementById('product-icon');
    if (mainIcon) {
        mainIcon.className = iconClass;
    }
    
    // Update thumbnail icons
    const thumbIcons = [
        document.getElementById('product-icon-thumb1'),
        document.getElementById('product-icon-thumb2'),
        document.getElementById('product-icon-thumb3')
    ];
    
    thumbIcons.forEach((icon, index) => {
        if (icon) {
            // Use different icons for thumbnails
            const thumbIconMap = {
                'fas fa-spa': ['fas fa-spa', 'fas fa-leaf', 'fas fa-seedling'],
                'fas fa-leaf': ['fas fa-leaf', 'fas fa-seedling', 'fas fa-gem'],
                'fas fa-seedling': ['fas fa-seedling', 'fas fa-gem', 'fas fa-tint'],
                'fas fa-gem': ['fas fa-gem', 'fas fa-tint', 'fas fa-sun'],
                'fas fa-tint': ['fas fa-tint', 'fas fa-sun', 'fas fa-moon'],
                'fas fa-sun': ['fas fa-sun', 'fas fa-moon', 'fas fa-fire'],
                'fas fa-moon': ['fas fa-moon', 'fas fa-fire', 'fas fa-heart'],
                'fas fa-fire': ['fas fa-fire', 'fas fa-heart', 'fas fa-brain'],
                'fas fa-heart': ['fas fa-heart', 'fas fa-brain', 'fas fa-eye'],
                'fas fa-brain': ['fas fa-brain', 'fas fa-eye', 'fas fa-lips'],
                'fas fa-eye': ['fas fa-eye', 'fas fa-lips', 'fas fa-wind'],
                'fas fa-lips': ['fas fa-lips', 'fas fa-wind', 'fas fa-magic'],
                'fas fa-wind': ['fas fa-wind', 'fas fa-magic', 'fas fa-bed'],
                'fas fa-magic': ['fas fa-magic', 'fas fa-bed', 'fas fa-rose'],
                'fas fa-bed': ['fas fa-bed', 'fas fa-rose', 'fas fa-spa'],
                'fas fa-rose': ['fas fa-rose', 'fas fa-spa', 'fas fa-leaf']
            };
            
            const thumbIcons = thumbIconMap[iconClass] || [iconClass, 'fas fa-leaf', 'fas fa-seedling'];
            icon.className = thumbIcons[index] || iconClass;
        }
    });
}

// Update product SKU based on product name
function updateProductSKU(productName) {
    const skuMap = {
        'Wellness Elixir': 'MIR-WE-001',
        'Immunity Boost Tonic': 'MIR-IB-002',
        'Beauty Serum': 'MIR-BS-003',
        'Glow Face Mask': 'MIR-GF-004',
        'Hydrating Moisturizer': 'MIR-HM-005',
        'Natural Sunscreen': 'MIR-NS-006',
        'Calm Essential Oil': 'MIR-CE-007',
        'Energy Boost Oil': 'MIR-EB-008',
        'Heart Health Tonic': 'MIR-HH-009',
        'Focus & Clarity Blend': 'MIR-FC-010',
        'Eye Contour Gel': 'MIR-EC-011',
        'Natural Lip Balm': 'MIR-NL-012',
        'Gentle Cleanser': 'MIR-GC-013',
        'Anti-Aging Night Cream': 'MIR-AN-014',
        'Sleep Well Diffuser Blend': 'MIR-SW-015',
        'Rose & Lavender Mist': 'MIR-RL-016'
    };
    
    const sku = skuMap[productName] || 'MIR-001';
    document.getElementById('product-sku').textContent = sku;
}

// Setup event listeners
function setupEventListeners() {
    // Quantity controls
    const quantityInput = document.getElementById('quantity');
    const minusBtn = document.getElementById('quantity-minus');
    const plusBtn = document.getElementById('quantity-plus');
    
    minusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });
    
    plusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < 99) {
            quantityInput.value = currentValue + 1;
        }
    });
    
    // Add to cart button
    const addToCartBtn = document.getElementById('add-to-cart-detail');
    addToCartBtn.addEventListener('click', addToCartFromDetail);
    
    // Wishlist button
    const wishlistBtn = document.getElementById('wishlist-detail');
    wishlistBtn.addEventListener('click', toggleWishlist);
    
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
    
    // Thumbnail image clicks
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            thumbnails.forEach(t => t.classList.remove('active'));
            thumbnail.classList.add('active');
            
            // Update main image (in a real app, this would show different product images)
            const icon = thumbnail.querySelector('i');
            if (icon) {
                document.getElementById('product-icon').className = icon.className;
            }
        });
    });
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (validateEmail(email)) {
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                this.reset();
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }
}

// Add to cart from detail page
function addToCartFromDetail() {
    const productData = JSON.parse(localStorage.getItem('selectedProduct'));
    const quantity = parseInt(document.getElementById('quantity').value);
    
    if (!productData) {
        showNotification('Product data not found. Please try again.', 'error');
        return;
    }
    
    // Parse price
    const price = parseFloat(productData.price.replace('$', ''));
    
    // Add to cart with quantity
    addToCartWithQuantity(productData.name, productData.description, price, quantity);
    
    // Show success notification
    showNotification(`${quantity} ${productData.name} added to cart!`, 'success');
    
    // Update cart icon
    updateCartIcon();
    
    // Add visual feedback
    const addToCartBtn = document.getElementById('add-to-cart-detail');
    addToCartBtn.textContent = 'Added!';
    addToCartBtn.style.background = '#4CAF50';
    
    setTimeout(() => {
        addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
        addToCartBtn.style.background = '';
    }, 2000);
}

// Add to cart with quantity
function addToCartWithQuantity(name, description, price, quantity) {
    let cart = JSON.parse(localStorage.getItem('mirmiaCart')) || [];
    
    // Check if product already exists in cart
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        // Increment quantity if product already exists
        existingItem.quantity += quantity;
    } else {
        // Add new product to cart
        cart.push({
            name: name,
            description: description,
            price: price,
            quantity: quantity
        });
    }
    
    // Save to localStorage
    localStorage.setItem('mirmiaCart', JSON.stringify(cart));
}

// Toggle wishlist
function toggleWishlist() {
    const wishlistBtn = document.getElementById('wishlist-detail');
    const icon = wishlistBtn.querySelector('i');
    
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        wishlistBtn.style.color = '#e74c3c';
        showNotification('Added to wishlist!', 'success');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        wishlistBtn.style.color = '';
        showNotification('Removed from wishlist!', 'info');
    }
}

// Update cart icon with count
function updateCartIcon() {
    const cartIcon = document.querySelector('.fa-shopping-cart');
    if (cartIcon) {
        const cart = JSON.parse(localStorage.getItem('mirmiaCart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        // Remove existing cart count
        const existingCount = cartIcon.parentElement.querySelector('.cart-count');
        if (existingCount) {
            existingCount.remove();
        }
        
        // Add cart count if items exist
        if (totalItems > 0) {
            const cartCount = document.createElement('span');
            cartCount.className = 'cart-count';
            cartCount.textContent = totalItems;
            cartCount.style.cssText = `
                position: absolute;
                top: -8px;
                right: -8px;
                background: #e74c3c;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
            `;
            
            cartIcon.parentElement.style.position = 'relative';
            cartIcon.parentElement.appendChild(cartCount);
        }
    }
}

// Email validation function
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

console.log('Product detail page JavaScript loaded successfully!');

// Cart Page JavaScript

// Cart data structure
let cart = JSON.parse(localStorage.getItem('mirmiaCart')) || [];
let promoCode = localStorage.getItem('mirmiaPromoCode') || '';

// Initialize cart page
document.addEventListener('DOMContentLoaded', function() {
    displayCart();
    updateCartSummary();
    setupEventListeners();
    
    // Update cart icon with count
    updateCartIcon();
});

// Display cart items
function displayCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartSection = document.getElementById('empty-cart');
    const cartContent = document.querySelector('.cart-content');
    
    if (cart.length === 0) {
        // Show empty cart state
        emptyCartSection.style.display = 'block';
        cartContent.style.display = 'none';
        return;
    }
    
    // Show cart content
    emptyCartSection.style.display = 'none';
    cartContent.style.display = 'block';
    
    cartItemsContainer.innerHTML = '';
    
    cart.forEach((item, index) => {
        const cartItem = createCartItemElement(item, index);
        cartItemsContainer.appendChild(cartItem);
    });
}

// Create cart item element
function createCartItemElement(item, index) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.dataset.index = index;
    
    const itemTotal = (item.price * item.quantity).toFixed(2);
    
    cartItem.innerHTML = `
        <div class="cart-item-image">
            <div class="product-placeholder">
                <i class="${getProductIcon(item.name)}"></i>
            </div>
        </div>
        <div class="cart-item-details">
            <h4>${item.name}</h4>
            <p class="cart-item-description">${item.description}</p>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        </div>
        <div class="cart-item-quantity">
            <button class="quantity-btn minus" data-index="${index}">
                <i class="fas fa-minus"></i>
            </button>
            <input type="number" value="${item.quantity}" min="1" max="99" class="quantity-input" data-index="${index}">
            <button class="quantity-btn plus" data-index="${index}">
                <i class="fas fa-plus"></i>
            </button>
        </div>
        <div class="cart-item-total">
            $${itemTotal}
        </div>
        <button class="remove-item" data-index="${index}">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    return cartItem;
}

// Get product icon based on name
function getProductIcon(productName) {
    const iconMap = {
        'Wellness Elixir': 'fas fa-spa',
        'Immunity Boost Tonic': 'fas fa-leaf',
        'Beauty Serum': 'fas fa-seedling',
        'Glow Face Mask': 'fas fa-gem',
        'Hydrating Moisturizer': 'fas fa-tint',
        'Natural Sunscreen': 'fas fa-sun',
        'Calm Essential Oil': 'fas fa-moon',
        'Energy Boost Oil': 'fas fa-fire'
    };
    
    return iconMap[productName] || 'fas fa-box';
}

// Setup event listeners
function setupEventListeners() {
    // Quantity buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.quantity-btn')) {
            const btn = e.target.closest('.quantity-btn');
            const index = parseInt(btn.dataset.index);
            const isPlus = btn.classList.contains('plus');
            
            updateQuantity(index, isPlus ? 1 : -1);
        }
        
        // Remove item
        if (e.target.closest('.remove-item')) {
            const btn = e.target.closest('.remove-item');
            const index = parseInt(btn.dataset.index);
            removeFromCart(index);
        }
    });
    
    // Quantity input
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('quantity-input')) {
            const index = parseInt(e.target.dataset.index);
            const newQuantity = parseInt(e.target.value) || 1;
            setQuantity(index, newQuantity);
        }
    });
    
    // Promo code
    const applyPromoBtn = document.getElementById('apply-promo');
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', applyPromoCode);
    }
    
    // WhatsApp Checkout button
    const whatsappCheckoutBtn = document.getElementById('whatsapp-checkout-btn');
    if (whatsappCheckoutBtn) {
        whatsappCheckoutBtn.addEventListener('click', proceedToWhatsAppCheckout);
    }
    
    // Instagram Checkout button
    const instagramCheckoutBtn = document.getElementById('instagram-checkout-btn');
    if (instagramCheckoutBtn) {
        instagramCheckoutBtn.addEventListener('click', proceedToInstagramCheckout);
    }
    
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

// Update quantity
function updateQuantity(index, change) {
    const newQuantity = cart[index].quantity + change;
    if (newQuantity >= 1 && newQuantity <= 99) {
        cart[index].quantity = newQuantity;
        saveCart();
        displayCart();
        updateCartSummary();
        updateCartIcon();
    }
}

// Set quantity directly
function setQuantity(index, quantity) {
    if (quantity >= 1 && quantity <= 99) {
        cart[index].quantity = quantity;
        saveCart();
        displayCart();
        updateCartSummary();
        updateCartIcon();
    }
}

// Remove item from cart
function removeFromCart(index) {
    const itemName = cart[index].name;
    cart.splice(index, 1);
    saveCart();
    displayCart();
    updateCartSummary();
    updateCartIcon();
    
    showNotification(`${itemName} removed from cart`, 'info');
}

// Update cart summary
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
    const tax = subtotal * 0.08; // 8% tax
    const discount = calculateDiscount(subtotal);
    const total = subtotal + shipping + tax - discount;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Calculate discount based on promo code
function calculateDiscount(subtotal) {
    if (promoCode === 'WELCOME10') {
        return subtotal * 0.10; // 10% discount
    } else if (promoCode === 'SAVE20') {
        return subtotal * 0.20; // 20% discount
    }
    return 0;
}

// Apply promo code
function applyPromoCode() {
    const promoInput = document.getElementById('promo-input');
    const code = promoInput.value.trim().toUpperCase();
    
    const validCodes = ['WELCOME10', 'SAVE20'];
    
    if (validCodes.includes(code)) {
        promoCode = code;
        localStorage.setItem('mirmiaPromoCode', promoCode);
        updateCartSummary();
        showNotification(`Promo code "${code}" applied successfully!`, 'success');
        promoInput.value = '';
    } else {
        showNotification('Invalid promo code. Please try again.', 'error');
    }
}

// Proceed to checkout via WhatsApp
function proceedToWhatsAppCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty. Please add some products first.', 'error');
        return;
    }
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
    const tax = subtotal * 0.08; // 8% tax
    const discount = calculateDiscount(subtotal);
    const total = subtotal + shipping + tax - discount;
    
    // Format cart items for WhatsApp message
    let message = "🛒 *MIRMIA Order*\n\n";
    message += "*Order Details:*\n";
    message += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    
    cart.forEach((item, index) => {
        const itemTotal = (item.price * item.quantity).toFixed(2);
        message += `*${index + 1}. ${item.name}*\n`;
        message += `   Quantity: ${item.quantity}\n`;
        message += `   Price: $${item.price.toFixed(2)} each\n`;
        message += `   Total: $${itemTotal}\n\n`;
    });
    
    message += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    message += `*Subtotal: $${subtotal.toFixed(2)}*\n`;
    message += `*Shipping: ${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}*\n`;
    message += `*Tax: $${tax.toFixed(2)}*\n`;
    
    if (discount > 0) {
        message += `*Discount: -$${discount.toFixed(2)}*\n`;
    }
    
    message += `*Total: $${total.toFixed(2)}*\n\n`;
    message += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    message += "Please provide your shipping address and contact information to complete the order.\n\n";
    message += "Thank you for choosing MIRMIA! 🌿✨";
    
    // Encode message for WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = "01104161598";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Show confirmation dialog
    if (confirm('Proceed to checkout via WhatsApp? This will open WhatsApp with your order details.')) {
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Show success notification
        showNotification('WhatsApp opened with your order details! Please complete your order there.', 'success');
        
        // Clear cart after successful order initiation
        setTimeout(() => {
            cart = [];
            promoCode = '';
            localStorage.removeItem('mirmiaCart');
            localStorage.removeItem('mirmiaPromoCode');
            displayCart();
            updateCartSummary();
            updateCartIcon();
            showNotification('Cart cleared. Thank you for your order!', 'success');
        }, 3000);
    }
}

// Proceed to checkout via Instagram
function proceedToInstagramCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty. Please add some products first.', 'error');
        return;
    }
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
    const tax = subtotal * 0.08; // 8% tax
    const discount = calculateDiscount(subtotal);
    const total = subtotal + shipping + tax - discount;
    
    // Format cart items for Instagram message
    let message = "🛒 MIRMIA Order\n\n";
    message += "Order Details:\n";
    message += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    
    cart.forEach((item, index) => {
        const itemTotal = (item.price * item.quantity).toFixed(2);
        message += `${index + 1}. ${item.name}\n`;
        message += `   Quantity: ${item.quantity}\n`;
        message += `   Price: $${item.price.toFixed(2)} each\n`;
        message += `   Total: $${itemTotal}\n\n`;
    });
    
    message += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    message += `Subtotal: $${subtotal.toFixed(2)}\n`;
    message += `Shipping: ${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}\n`;
    message += `Tax: $${tax.toFixed(2)}\n`;
    
    if (discount > 0) {
        message += `Discount: -$${discount.toFixed(2)}\n`;
    }
    
    message += `Total: $${total.toFixed(2)}\n\n`;
    message += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    message += "Please provide your shipping address and contact information to complete the order.\n\n";
    message += "Thank you for choosing MIRMIA! 🌿✨";
    
    // Instagram profile URL
    const instagramUrl = "https://www.instagram.com/_omar_ahmed_999/";
    
    // Show confirmation dialog
    if (confirm('Proceed to checkout via Instagram? This will open Instagram where you can send your order details.')) {
        // Open Instagram
        window.open(instagramUrl, '_blank');
        
        // Show success notification with instructions
        showNotification('Instagram opened! Please send your order details via direct message.', 'success');
        
        // Show additional instructions
        setTimeout(() => {
            showNotification('Copy and paste your order details in the Instagram DM to complete your order.', 'info');
        }, 2000);
        
        // Clear cart after successful order initiation
        setTimeout(() => {
            cart = [];
            promoCode = '';
            localStorage.removeItem('mirmiaCart');
            localStorage.removeItem('mirmiaPromoCode');
            displayCart();
            updateCartSummary();
            updateCartIcon();
            showNotification('Cart cleared. Thank you for your order!', 'success');
        }, 5000);
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('mirmiaCart', JSON.stringify(cart));
}

// Update cart icon with count
function updateCartIcon() {
    const cartIcon = document.querySelector('.fa-shopping-cart');
    if (cartIcon) {
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

console.log('Cart page JavaScript loaded successfully!');

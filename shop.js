// Shop Page JavaScript

// Product filtering functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productsGrid = document.getElementById('products-grid');
    const products = document.querySelectorAll('.product-card');
    const sortSelect = document.getElementById('sort-select');

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const category = button.getAttribute('data-category');

            // Filter products
            products.forEach(product => {
                if (category === 'all' || product.getAttribute('data-category') === category) {
                    product.style.display = 'block';
                    product.style.animation = 'fadeInUp 0.5s ease-out';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    });

    // Sort functionality
    sortSelect.addEventListener('change', () => {
        const sortValue = sortSelect.value;
        const productsArray = Array.from(products);
        const visibleProducts = productsArray.filter(product => product.style.display !== 'none');

        visibleProducts.sort((a, b) => {
            const nameA = a.querySelector('h3').textContent.toLowerCase();
            const nameB = b.querySelector('h3').textContent.toLowerCase();
            const priceA = parseFloat(a.querySelector('.product-price').textContent.replace('$', ''));
            const priceB = parseFloat(b.querySelector('.product-price').textContent.replace('$', ''));

            switch (sortValue) {
                case 'name':
                    return nameA.localeCompare(nameB);
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                default:
                    return 0;
            }
        });

        // Reorder products in the grid
        visibleProducts.forEach(product => {
            productsGrid.appendChild(product);
        });
    });

    // Product image hover effects
    products.forEach(product => {
        const image = product.querySelector('.product-image');
        
        product.addEventListener('mouseenter', () => {
            image.style.transform = 'scale(1.05)';
        });
        
        product.addEventListener('mouseleave', () => {
            image.style.transform = 'scale(1)';
        });
    });

    // Add to cart functionality with quantity - FIXED to prevent double addition
    products.forEach(product => {
        const addToCartBtn = product.querySelector('.btn-primary');
        if (addToCartBtn && addToCartBtn.textContent === 'Add to Cart') {
            // Remove any existing event listeners by cloning the button
            const newBtn = addToCartBtn.cloneNode(true);
            addToCartBtn.parentNode.replaceChild(newBtn, addToCartBtn);
            
            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation(); // Prevent event bubbling
                
                const productCard = this.closest('.product-card');
                const productName = productCard.querySelector('h3').textContent;
                const productPrice = productCard.querySelector('.product-price').textContent;
                const productDescription = productCard.querySelector('.product-description').textContent;
                
                // Parse price
                const price = parseFloat(productPrice.replace('$', ''));
                
                // Add to cart
                addToCart(productName, productDescription, price);
                
                // Show success notification
                showNotification(`${productName} added to cart!`, 'success');
                
                // Update cart icon
                updateCartIcon();
                
                // Add visual feedback
                this.textContent = 'Added!';
                this.style.background = '#4CAF50';
                
                setTimeout(() => {
                    this.textContent = 'Add to Cart';
                    this.style.background = '';
                }, 2000);
            });
        }
    });

    // Product detail page functionality - Make entire product card clickable
    products.forEach(product => {
        const productImage = product.querySelector('.product-image');
        const addToCartBtn = product.querySelector('.btn-primary');
        
        // Make product image clickable for product details
        productImage.addEventListener('click', (e) => {
            // Don't trigger if clicking on wishlist button
            if (e.target.closest('.wishlist-btn')) {
                return;
            }
            
            const productName = product.querySelector('h3').textContent;
            const productDescription = product.querySelector('.product-description').textContent;
            const productPrice = product.querySelector('.product-price').textContent;
            const productCategory = product.getAttribute('data-category');
            
            // Store product data in localStorage for the detail page
            const productData = {
                name: productName,
                description: productDescription,
                price: productPrice,
                category: productCategory
            };
            localStorage.setItem('selectedProduct', JSON.stringify(productData));
            
            // Navigate to product detail page
            window.location.href = 'product-detail.html';
        });
        
        // Add cursor pointer to product image
        productImage.style.cursor = 'pointer';
    });

    // Wishlist functionality (placeholder)
    products.forEach(product => {
        // Add wishlist button if not exists
        if (!product.querySelector('.wishlist-btn')) {
            const wishlistBtn = document.createElement('button');
            wishlistBtn.className = 'wishlist-btn';
            wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
            wishlistBtn.style.cssText = `
                position: absolute;
                top: 15px;
                left: 15px;
                background: rgba(255, 255, 255, 0.9);
                border: none;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #666;
                transition: all 0.3s ease;
                z-index: 10;
            `;
            
            const productImage = product.querySelector('.product-image');
            productImage.style.position = 'relative';
            productImage.appendChild(wishlistBtn);
            
            wishlistBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const icon = wishlistBtn.querySelector('i');
                
                if (icon.classList.contains('far')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    wishlistBtn.style.color = '#e74c3c';
                    showNotification('Added to wishlist!', 'success');
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    wishlistBtn.style.color = '#666';
                    showNotification('Removed from wishlist!', 'info');
                }
            });
        }
    });

    // Product search functionality (placeholder)
    const searchIcon = document.querySelector('.fa-search');
    if (searchIcon) {
        searchIcon.addEventListener('click', () => {
            showNotification('Search functionality coming soon!', 'info');
        });
    }

    // Newsletter form on shop page
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
});

// Email validation function
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Notification system (if not already defined in main.js)
if (typeof showNotification === 'undefined') {
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
}

// Cart functions
function addToCart(name, description, price) {
    let cart = JSON.parse(localStorage.getItem('mirmiaCart')) || [];
    
    // Check if product already exists in cart
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        // Increment quantity if product already exists
        existingItem.quantity += 1;
    } else {
        // Add new product to cart
        cart.push({
            name: name,
            description: description,
            price: price,
            quantity: 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('mirmiaCart', JSON.stringify(cart));
}

// Update cart icon (if not already defined in main.js)
if (typeof updateCartIcon === 'undefined') {
    function updateCartIcon() {
        const cartIcon = document.querySelector('.fa-shopping-cart');
        if (cartIcon) {
            // Get cart data
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
            
            // Add a small animation
            cartIcon.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cartIcon.style.transform = 'scale(1)';
            }, 200);
        }
    }
}

// Add CSS for wishlist button
const wishlistStyles = document.createElement('style');
wishlistStyles.textContent = `
    .wishlist-btn:hover {
        background: rgba(255, 255, 255, 1) !important;
        transform: scale(1.1);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
    
    .notification-message {
        flex: 1;
    }
`;

document.head.appendChild(wishlistStyles);

console.log('Shop page JavaScript loaded successfully!'); 
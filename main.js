// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link (but don't prevent navigation)
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', (e) => {
    // Only close mobile menu, don't prevent default navigation
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Smooth scrolling for internal anchor links only
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Only prevent default for internal anchor links (not external page links)
        const href = this.getAttribute('href');
        if (href.startsWith('#') && href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Add to cart functionality
document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.btn-primary');
    addToCartButtons.forEach(button => {
        if (button.textContent === 'Add to Cart') {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const productCard = this.closest('.product-card');
                if (productCard) {
                    const productName = productCard.querySelector('h3').textContent;
                    const productDescription = productCard.querySelector('.product-description').textContent;
                    const productPrice = productCard.querySelector('.product-price').textContent;
                    
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
                }
            });
        }
    });
    
    // Update cart icon on page load
    updateCartIcon();
});

// Newsletter form submission
const newsletterForms = document.querySelectorAll('.newsletter-form, .footer-newsletter');
newsletterForms.forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        
        if (validateEmail(email)) {
            showNotification('Thank you for subscribing!', 'success');
            this.reset();
        } else {
            showNotification('Please enter a valid email address.', 'error');
        }
    });
});

// Contact form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;
        
        if (name && email && message && validateEmail(email)) {
            showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
            this.reset();
        } else {
            showNotification('Please fill in all fields correctly.', 'error');
        }
    });
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

// Update cart icon (placeholder function)
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

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .product-card, .service-card, .testimonial-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Product image hover effects
document.querySelectorAll('.product-card').forEach(card => {
    const image = card.querySelector('.product-image');
    
    card.addEventListener('mouseenter', () => {
        image.style.transform = 'scale(1.05)';
    });
    
    card.addEventListener('mouseleave', () => {
        image.style.transform = 'scale(1)';
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Search functionality (placeholder)
const searchIcon = document.querySelector('.fa-search');
if (searchIcon) {
    searchIcon.addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('Search functionality coming soon!', 'info');
    });
}

// User account functionality (placeholder)
const userIcon = document.querySelector('.fa-user');
if (userIcon) {
    userIcon.addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('Account features coming soon!', 'info');
    });
}

// Add loading animation for images (excluding logo)
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img:not(.logo-img)');
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
});

// Form input focus effects
document.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', () => {
        input.parentElement.style.transform = 'scale(1)';
    });
});

// Add CSS for notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
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

document.head.appendChild(notificationStyles);

// Initialize the website
document.addEventListener('DOMContentLoaded', () => {
    console.log('MIRMIA website loaded successfully!');
    
    // Ensure logo is always visible and animated
    const logo = document.querySelector('.logo-link');
    const logoImg = document.querySelector('.logo-img');
    
    if (logo && logoImg) {
        // Make sure logo is visible immediately
        logo.style.opacity = '1';
        logo.style.transform = 'translateY(0)';
        logoImg.style.opacity = '1';
        
        // Add a subtle entrance animation
        logo.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        logoImg.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        // Add a subtle glow effect to the logo
        const currentFilter = logoImg.style.filter || '';
        logoImg.style.filter = currentFilter + ' drop-shadow(0 0 10px rgba(139, 90, 60, 0.1))';
    }
});

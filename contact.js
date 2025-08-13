// Contact Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const firstName = formData.get('firstName');
            const lastName = formData.get('lastName');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const subject = formData.get('subject');
            const message = formData.get('message');
            const newsletter = formData.get('newsletter');
            
            // Validate form
            if (validateContactForm(firstName, lastName, email, subject, message)) {
                // Show success message
                showNotification('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
                
                // Reset form
                this.reset();
                
                // Log form data (in real implementation, this would be sent to server)
                console.log('Contact Form Submission:', {
                    firstName,
                    lastName,
                    email,
                    phone,
                    subject,
                    message,
                    newsletter: newsletter === 'yes'
                });
            }
        });
    }

    // FAQ functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            // Close other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Contact info cards hover effects
    const contactCards = document.querySelectorAll('.contact-info-card');
    contactCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Newsletter form on contact page
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (validateEmail(email)) {
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                this.reset();
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    });

    // Footer newsletter form
    const footerNewsletter = document.querySelector('.footer-newsletter');
    if (footerNewsletter) {
        footerNewsletter.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (validateEmail(email)) {
                showNotification('Thank you for subscribing!', 'success');
                this.reset();
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }

    // Social media links
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                const platform = this.querySelector('i').className.split(' ')[1];
                showNotification(`${platform} link coming soon!`, 'info');
            }
        });
    });

    // Quick links functionality
    const quickLinks = document.querySelectorAll('.quick-links a');
    quickLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const linkText = this.textContent;
            showNotification(`${linkText} page coming soon!`, 'info');
        });
    });

    // Map placeholder click
    const mapPlaceholder = document.querySelector('.map-placeholder');
    if (mapPlaceholder) {
        mapPlaceholder.addEventListener('click', () => {
            showNotification('Interactive map coming soon!', 'info');
        });
    }

    // Form input focus effects
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'scale(1)';
        });
    });

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = `(${value}`;
                } else if (value.length <= 6) {
                    value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                } else {
                    value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                }
            }
            e.target.value = value;
        });
    }

    // Character counter for message textarea
    const messageTextarea = document.getElementById('message');
    if (messageTextarea) {
        const charCounter = document.createElement('div');
        charCounter.className = 'char-counter';
        charCounter.style.cssText = `
            text-align: right;
            font-size: 0.8rem;
            color: #666;
            margin-top: 0.5rem;
        `;
        messageTextarea.parentElement.appendChild(charCounter);
        
        const updateCounter = () => {
            const count = messageTextarea.value.length;
            const maxLength = 1000;
            charCounter.textContent = `${count}/${maxLength} characters`;
            
            if (count > maxLength * 0.9) {
                charCounter.style.color = '#e74c3c';
            } else {
                charCounter.style.color = '#666';
            }
        };
        
        messageTextarea.addEventListener('input', updateCounter);
        updateCounter();
    }

    // Subject dropdown change handler
    const subjectSelect = document.getElementById('subject');
    if (subjectSelect) {
        subjectSelect.addEventListener('change', function() {
            const selectedValue = this.value;
            const messageTextarea = document.getElementById('message');
            
            if (messageTextarea) {
                const placeholders = {
                    'general': 'Please tell us how we can help you...',
                    'product': 'Please describe your product question...',
                    'order': 'Please provide your order number and question...',
                    'return': 'Please provide your order number and reason for return...',
                    'consultation': 'Please tell us about your wellness goals...',
                    'wholesale': 'Please provide details about your business...',
                    'other': 'Please describe your inquiry...'
                };
                
                messageTextarea.placeholder = placeholders[selectedValue] || 'Please tell us how we can help you...';
            }
        });
    }
});

// Contact form validation
function validateContactForm(firstName, lastName, email, subject, message) {
    if (!firstName || firstName.trim().length < 2) {
        showNotification('Please enter a valid first name (at least 2 characters).', 'error');
        return false;
    }
    
    if (!lastName || lastName.trim().length < 2) {
        showNotification('Please enter a valid last name (at least 2 characters).', 'error');
        return false;
    }
    
    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return false;
    }
    
    if (!subject || subject === '') {
        showNotification('Please select a subject.', 'error');
        return false;
    }
    
    if (!message || message.trim().length < 10) {
        showNotification('Please enter a message (at least 10 characters).', 'error');
        return false;
    }
    
    return true;
}

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

// Add CSS for contact page specific styles
const contactStyles = document.createElement('style');
contactStyles.textContent = `
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
    
    .contact-form .form-group {
        transition: transform 0.3s ease;
    }
    
    .map-placeholder {
        cursor: pointer;
        transition: transform 0.3s ease;
    }
    
    .map-placeholder:hover {
        transform: scale(1.02);
    }
    
    .contact-info-card {
        cursor: pointer;
    }
    
    .faq-question {
        cursor: pointer;
    }
    
    .faq-question:hover {
        background: #E8E0D8;
    }
`;

document.head.appendChild(contactStyles);

console.log('Contact page JavaScript loaded successfully!'); 
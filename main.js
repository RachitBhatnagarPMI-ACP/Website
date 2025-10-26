// Enhanced Portfolio Website JavaScript
// Performance-optimized animations and interactions

// Global variables
let isLoaded = false;
let scrollTimeout;
let lastScrollY = 0;
let ticking = false;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Main initialization function
function initializeWebsite() {
    console.log('Initializing Neeti Nausran Portfolio...');
    
    // Initialize all components
    initializeProfileImage();
    initializeAnimations();
    initializeNavigation();
    initializeScrollEffects();
    initializeFormHandling();
    initializeCursor();
    initializePerformanceMonitoring();
    
    // Register service worker
    registerServiceWorker();
    
    // Mark as loaded
    isLoaded = true;
    console.log('Portfolio initialization complete!');
}

// Profile Image Handling
function initializeProfileImage() {
    const profileImg = document.querySelector('.profile-image');
    const fallback = document.querySelector('.profile-fallback');
    
    if (!profileImg) return;
    
    // Image paths to try in order
    const imagePaths = [
        'WhatsApp Image 2025-05-01 at 13.34.27_7e81fe82.jpg',
        './WhatsApp Image 2025-05-01 at 13.34.27_7e81fe82.jpg',
        '/WhatsApp Image 2025-05-01 at 13.34.27_7e81fe82.jpg',
        './public/WhatsApp Image 2025-05-01 at 13.34.27_7e81fe82.jpg',
        'https://stackblitz.com/storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBCQndKaFFFPSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--bd27fe28fdde8e63081a70e3edfdcdbfcb155436//WhatsApp Image 2025-05-01 at 13.34.27_7e81fe82.jpg'
    ];
    
    let currentIndex = 0;
    
    function tryLoadImage() {
        if (currentIndex >= imagePaths.length) {
            // All images failed, show fallback
            console.log('All profile image paths failed, showing fallback');
            if (profileImg) profileImg.style.display = 'none';
            if (fallback) fallback.style.display = 'flex';
            return;
        }
        
        const testImg = new Image();
        testImg.onload = function() {
            console.log('Profile image loaded successfully:', this.src);
            profileImg.src = this.src;
            profileImg.style.opacity = '1';
            profileImg.classList.add('loaded');
            if (fallback) fallback.style.display = 'none';
        };
        
        testImg.onerror = function() {
            console.log('Failed to load image:', imagePaths[currentIndex]);
            currentIndex++;
            tryLoadImage();
        };
        
        testImg.src = imagePaths[currentIndex];
    }
    
    // Start trying to load images
    setTimeout(tryLoadImage, 100);
}

// Animation Initialization
function initializeAnimations() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
            delay: 100
        });
    }
    
    // Initialize scroll reveal animations
    initScrollReveal();
    
    // Initialize counter animations
    initCounterAnimations();
    
    // Initialize floating elements
    initFloatingElements();
}

// Scroll Reveal Animations
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal, [data-aos]');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        // Set initial state
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        revealObserver.observe(element);
    });
}

// Counter Animations
function initCounterAnimations() {
    const counters = document.querySelectorAll('.metric-number, .stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const text = element.textContent;
    const hasNumber = /\d+/.test(text);
    
    if (!hasNumber) return;
    
    const number = parseInt(text.match(/\d+/)[0]);
    const suffix = text.replace(/\d+/, '');
    let current = 0;
    const increment = number / 50;
    const duration = 2000;
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            element.textContent = number + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, stepTime);
}

// Floating Elements Animation
function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach((element, index) => {
        // Random positioning and animation delays
        element.style.left = Math.random() * 100 + '%';
        element.style.top = Math.random() * 100 + '%';
        element.style.animationDelay = Math.random() * 20 + 's';
        element.style.animationDuration = (15 + Math.random() * 10) + 's';
    });
}

// Navigation Handling
function initializeNavigation() {
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const allNavLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('open');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Close mobile menu when clicking a link
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks) navLinks.classList.remove('active');
            if (menuBtn) menuBtn.classList.remove('open');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active navigation highlighting
    initActiveNavigation();
}

// Active Navigation Highlighting
function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveNav() {
        let current = '';
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Throttled scroll handler
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = requestAnimationFrame(updateActiveNav);
    }, { passive: true });
}

// Scroll Effects
function initializeScrollEffects() {
    const header = document.querySelector('header');
    
    function updateScrollEffects() {
        const scrolled = window.scrollY;
        
        // Only update if scroll position changed significantly
        if (Math.abs(scrolled - lastScrollY) > 5) {
            // Header effects
            if (header) {
                if (scrolled > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
            
            // Parallax effect on hero
            const heroContent = document.querySelector('.hero-content');
            if (heroContent && scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.1}px)`;
            }
            
            lastScrollY = scrolled;
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }, { passive: true });
}

// Form Handling
function initializeFormHandling() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    form.addEventListener('submit', handleFormSubmission);
}

async function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('.submit-btn');
    
    // Validation
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    if (!name || !email || !message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    try {
        // Submit form (this will work with Netlify forms)
        const response = await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString()
        });
        
        if (response.ok) {
            showNotification('Thank you for your message! I will get back to you soon.', 'success');
            form.reset();
        } else {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        showNotification('There was an error sending your message. Please try again or contact me directly.', 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Custom Cursor
function initializeCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (!cursor || !follower) return;
    
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    
    // Mouse move handler
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });
    
    // Smooth follower animation
    function animateFollower() {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateFollower);
    }
    animateFollower();
    
    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .skill-tag, .cert-card, .leadership-card');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
            follower.classList.add('cursor-hover');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
            follower.classList.remove('cursor-hover');
        });
    });
}

// Performance Monitoring
function initializePerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                const loadTime = perfData.loadEventEnd - perfData.fetchStart;
                console.log(`Page Load Time: ${loadTime}ms`);
                
                // Log Core Web Vitals if available
                if ('PerformanceObserver' in window) {
                    try {
                        const observer = new PerformanceObserver((list) => {
                            list.getEntries().forEach((entry) => {
                                console.log(`${entry.name}: ${entry.value}ms`);
                            });
                        });
                        observer.observe({ entryTypes: ['measure', 'navigation'] });
                    } catch (e) {
                        console.log('Performance Observer not fully supported');
                    }
                }
            }, 0);
        });
    }
}

// Service Worker Registration
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered successfully:', registration);
                })
                .catch(registrationError => {
                    console.log('Service Worker registration failed:', registrationError);
                });
        });
    }
}

// Lazy Loading for Images
function initializeLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Accessibility Enhancements
function initializeAccessibility() {
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close mobile menu
            const navLinks = document.querySelector('.nav-links');
            const menuBtn = document.querySelector('.menu-btn');
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuBtn.classList.remove('open');
                document.body.classList.remove('menu-open');
            }
        }
    });
    
    // Focus management
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.classList.add('focused');
        });
        
        element.addEventListener('blur', () => {
            element.classList.remove('focused');
        });
    });
}

// Reduced Motion Support
function initializeReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        // Disable animations for users who prefer reduced motion
        document.documentElement.style.setProperty('--transition', 'none');
        document.documentElement.style.setProperty('--animation-duration', '0s');
        
        // Disable AOS animations
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 0,
                once: true,
                disable: true
            });
        }
    }
}

// Error Handling
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // You could send this to an error tracking service
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
    // You could send this to an error tracking service
});

// Initialize accessibility and reduced motion on load
document.addEventListener('DOMContentLoaded', () => {
    initializeAccessibility();
    initializeReducedMotion();
    initializeLazyLoading();
});

// Export functions for global access if needed
window.NeetiPortfolio = {
    showNotification,
    initializeProfileImage,
    isLoaded: () => isLoaded
};


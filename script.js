// Initialize AOS
AOS.init({
    duration: 800,
    easing: 'ease-out',
    once: true
});


// Mobile Menu Toggle
const mobileMenu = document.querySelector('.hamburger');
const navLinks = document.querySelector('.mobile-menu');
const header = document.querySelector('.header');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - header.offsetHeight,
                behavior: 'smooth'
            });
        }
    });
});

// Header Background on Scroll
const images = document.querySelectorAll(".image-slider img");
let currentIndex = 0;

function changeImage() {
    images[currentIndex].classList.remove("active"); // Hide current image
    currentIndex = (currentIndex + 1) % images.length; // Move to next image
    images[currentIndex].classList.add("active"); // Show next image
}

setInterval(changeImage, 3000);

// Active Navigation Link Highlight
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').slice(1) === current) {
            item.classList.add('active');
        }
    });
});

// Enhanced Stats Counter Animation with Easing
function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
}

function animateCounter(element, target, duration = 2500) {
    let startTime = null;
    let currentNumber = 0;

    function updateCounter(currentTime) {
        if (!startTime) startTime = currentTime;
        
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easedProgress = easeOutQuart(progress);
        currentNumber = Math.floor(target * easedProgress);
        
        element.textContent = currentNumber.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    }

    requestAnimationFrame(updateCounter);
}

// Intersection Observer for Stats with Staggered Animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counterElements = entry.target.querySelectorAll('.counter');
            counterElements.forEach((counter, index) => {
                const target = parseInt(counter.closest('.stat-item').dataset.value);
                setTimeout(() => {
                    animateCounter(counter, target);
                }, index * 200); // Stagger each counter by 200ms
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { 
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px' // Trigger slightly before the element is fully visible
});

// Observe stats section
const statsSection = document.querySelector('.stats-grid');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Stats Counter Animation
function initializeStatsCounter() {
    console.log('Initializing stats counter...');
    const stats = document.querySelectorAll('.stat-item');
    console.log('Found stats items:', stats.length);
    let hasAnimated = false;

    function startCounting(stat) {
        console.log('Starting counter for value:', stat.dataset.value);
        const counter = stat.querySelector('.counter');
        const targetValue = parseInt(stat.dataset.value);
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        const startValue = 0;

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutQuad = progress * (2 - progress);
            
            const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuad);
            counter.textContent = currentValue.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }

        requestAnimationFrame(updateCounter);
    }

    function checkIfInView() {
        if (hasAnimated) return;

        const statsSection = document.querySelector('.stats');
        const rect = statsSection.getBoundingClientRect();
        const isInView = (rect.top <= window.innerHeight * 0.75);
        console.log('Stats section in view:', isInView, 'Position:', rect.top);

        if (isInView) {
            console.log('Starting animation for all stats');
            hasAnimated = true;
            stats.forEach(startCounting);
            window.removeEventListener('scroll', checkIfInView);
        }
    }

    // Start animation when stats section comes into view
    window.addEventListener('scroll', checkIfInView);
    // Check initial position
    checkIfInView();
}

// Initialize stats counter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeStatsCounter();
});

// Image Slider Functionality
function initializeImageSlider() {
    const slider = document.querySelector('.image-slider');
    if (!slider) {
        console.log('Slider container not found');
        return;
    }

    const slides = document.querySelectorAll('.slide-image');
    if (slides.length === 0) {
        console.log('No slides found');
        return;
    }

    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');
    const dotsContainer = document.querySelector('.slide-dots');

    if (!prevBtn || !nextBtn || !dotsContainer) {
        console.log('Navigation elements not found');
        return;
    }

    let currentSlide = 0;
    let slideInterval;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function updateSlides() {
        if (!slides[currentSlide]) {
            console.log('Invalid slide index');
            return;
        }

        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlides();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlides();
    }

    function goToSlide(index) {
        if (index >= 0 && index < slides.length) {
            currentSlide = index;
            updateSlides();
            resetInterval();
        }
    }

    function resetInterval() {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
        slideInterval = setInterval(nextSlide, 5000);
    }

    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetInterval();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetInterval();
        });
    }

    // Start automatic sliding
    resetInterval();

    // Pause on hover
    if (slider) {
        slider.addEventListener('mouseenter', () => {
            if (slideInterval) {
                clearInterval(slideInterval);
            }
        });
        
        slider.addEventListener('mouseleave', resetInterval);
    }
}

// Initialize slider when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeImageSlider);

// Form Submission// Form Submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent the default form submission

        const formData = new FormData(contactForm);
        const jsonData = {};

        formData.forEach((value, key) => {
            jsonData[key] = value;
        });

        fetch(contactForm.action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        })
        .then(response => {
            if (response.ok) {
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
            } else {
                alert('Failed to send message.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while sending the message.');
        });
    });
}

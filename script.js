// Initialize AOS
AOS.init({
    duration: 800,
    easing: 'ease-out',
    once: true
});

// Slider Functionality
const slides = document.querySelectorAll('.slide');
const sliderDots = document.querySelector('.slider-dots');
const prevButton = document.querySelector('.prev-slide');
const nextButton = document.querySelector('.next-slide');
let currentSlide = 0;
let isAnimating = false;

// Create dots
slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    sliderDots.appendChild(dot);
});

function updateSlides() {
    if (isAnimating) return;
    isAnimating = true;

    slides.forEach(slide => slide.classList.remove('active'));
    document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
    
    slides[currentSlide].classList.add('active');
    document.querySelectorAll('.dot')[currentSlide].classList.add('active');

    setTimeout(() => {
        isAnimating = false;
    }, 800);
}

function nextSlide() {
    if (!isAnimating) {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlides();
    }
}

function prevSlide() {
    if (!isAnimating) {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlides();
    }
}

function goToSlide(index) {
    if (!isAnimating && index !== currentSlide) {
        currentSlide = index;
        updateSlides();
    }
}

// Event listeners for slider
prevButton.addEventListener('click', prevSlide);
nextButton.addEventListener('click', nextSlide);

// Auto-advance slides with pause on hover
let slideInterval = setInterval(nextSlide, 5000);

const slider = document.querySelector('.slider');
slider.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
});

slider.addEventListener('mouseleave', () => {
    slideInterval = setInterval(nextSlide, 5000);
});

// Image Slider Functionality
const images = document.querySelectorAll('.slide-image');
const dotsContainer = document.querySelector('.slide-dots');
const prevButton = document.querySelector('.prev-slide');
const nextButton = document.querySelector('.next-slide');
let currentImage = 0;

// Create dots
images.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToImage(index));
    dotsContainer.appendChild(dot);
});

function updateDots() {
    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentImage);
    });
}

function goToImage(index) {
    images[currentImage].classList.remove('active');
    currentImage = index;
    images[currentImage].classList.add('active');
    updateDots();
}

function nextImage() {
    const next = (currentImage + 1) % images.length;
    goToImage(next);
}

function prevImage() {
    const prev = (currentImage - 1 + images.length) % images.length;
    goToImage(prev);
}

// Event listeners
prevButton.addEventListener('click', prevImage);
nextButton.addEventListener('click', nextImage);

// Auto advance images
let slideInterval = setInterval(nextImage, 5000);

// Pause auto-advance on hover
const imageSlider = document.querySelector('.image-slider');
imageSlider.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
});

imageSlider.addEventListener('mouseleave', () => {
    slideInterval = setInterval(nextImage, 5000);
});

// Mobile Menu Toggle
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');
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
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

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

// Form Submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add your form submission logic here
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
}

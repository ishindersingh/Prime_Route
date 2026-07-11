// Initialize Feather Icons
feather.replace();

// Navbar scroll effect
const navbar = document.querySelector('.navbar');

function handleScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleScroll);
// Initial check
handleScroll();

// Fade in on scroll using Intersection Observer
const fadeElements = document.querySelectorAll('.fade-in');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

fadeElements.forEach(el => {
    observer.observe(el);
});

// Trigger visible on load for elements already in viewport
setTimeout(() => {
    fadeElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            el.classList.add('visible');
        }
    });
}, 100);

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    item.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all
        faqItems.forEach(faq => faq.classList.remove('active'));
        
        // Open clicked if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Adjust for fixed header
                behavior: 'smooth'
            });
        }
    });
});

// WhatsApp Booking Submission
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const date = document.getElementById('bookDate').value;
        const time = document.getElementById('bookTime').value;
        const pickup = document.getElementById('bookPickup').value;
        const dropoff = document.getElementById('bookDropoff').value;
        const service = document.getElementById('bookService').value;

        const message = `Hi PrimeRoute Logistics, I would like to book a move.\n\n*Date:* ${date}\n*Time:* ${time}\n*Pickup Address:* ${pickup}\n*Drop-off Address:* ${dropoff}\n*Service:* ${service}\n\nPlease confirm availability.`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappNumber = "13065013800";
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
    });
}

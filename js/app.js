/* ==========================================================================
   Sri Vaari Seva - Interactive Scripts
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Hamburger animation
            const spans = menuToggle.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
            
            // Simple visual indicator of hamburger toggle
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu when clicking nav link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // --- Puja Pricing Data & Info ---
    const pujaData = {
        'kumbhabishekam': { name: 'Kumbhabishekam', price: 'TBD', duration: 'Flexible' },
        'grihapravesh': { name: 'Griha Pravesh Puja (Housewarming)', price: '₹8,500', duration: '4 Hours' },
        'satyanarayana': { name: 'Satyanarayana Puja', price: '₹4,500', duration: '3 Hours' },
        'ganapathi': { name: 'Ganapathi Homa', price: '₹6,000', duration: '3.5 Hours' },
        'sudarshana': { name: 'Shudarshana Aradhana & Homa', price: '₹9,500', duration: '4 Hours' },
        'devara_kalyana': { name: 'Devara Kalyana & Unions', price: '₹18,000', duration: '5 Hours' },
        'other': { name: 'Custom Puja Ritual', price: 'TBD', duration: 'Flexible' }
    };

    // --- Booking Modal Logic ---
    const bookingModal = document.getElementById('bookingModal');
    const modalClose = document.querySelector('.modal-close');
    const bookingForm = document.getElementById('bookingForm');
    const pujaSelect = document.getElementById('pujaSelect');
    const summaryTitle = document.getElementById('summaryTitle');
    const summaryDuration = document.getElementById('summaryDuration');
    const summaryPrice = document.getElementById('summaryPrice');
    
    // Open Booking Modal Buttons
    const openModalBtns = document.querySelectorAll('.book-btn');
    
    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            bookingModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Stop scroll
            
            // Check if puja type is preset as a data attribute
            const presetPuja = btn.getAttribute('data-puja');
            if (presetPuja && pujaSelect) {
                pujaSelect.value = presetPuja;
                updateBookingSummary(presetPuja);
            } else if (pujaSelect) {
                // Set default to first option
                updateBookingSummary(pujaSelect.value);
            }
        });
    });

    // Close Modal
    function closeModal() {
        bookingModal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scroll
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Close modal by clicking overlay
    const modalOverlay = document.querySelector('.modal-overlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeLightbox();
        }
    });

    // Handle Puja Select Dropdown Change
    if (pujaSelect) {
        pujaSelect.addEventListener('change', (e) => {
            updateBookingSummary(e.target.value);
        });
    }

    function updateBookingSummary(pujaKey) {
        const data = pujaData[pujaKey];
        if (data && summaryTitle) {
            summaryTitle.textContent = data.name;
            if (summaryPrice) {
                summaryPrice.textContent = data.price;
            }
        }
    }

    // Submit Booking Form
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Extract details for WhatsApp message
            const name = document.getElementById('clientName').value;
            const phone = document.getElementById('clientPhone').value;
            const email = document.getElementById('clientEmail').value;
            const pujaSelectedName = pujaSelect.options[pujaSelect.selectedIndex].text;
            const date = document.getElementById('bookingDate').value;
            const languageSelectEl = document.getElementById('languageSelect');
            const languageSelectedName = languageSelectEl.options[languageSelectEl.selectedIndex].text;
            const notes = document.getElementById('clientNotes').value || 'None';
            
            // Format WhatsApp Message
            const message = `Namaste Sri Vaari Seva,\n\nI would like to book a pooja ceremony with the following details:\n\n` +
                            `• *Name:* ${name}\n` +
                            `• *Phone:* ${phone}\n` +
                            `• *Email:* ${email}\n` +
                            `• *Puja Type:* ${pujaSelectedName}\n` +
                            `• *Date:* ${date}\n` +
                            `• *Language:* ${languageSelectedName}\n` +
                            `• *Instructions:* ${notes}`;
                            
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/916381432319?text=${encodedMessage}`;
            
            // Open WhatsApp in new tab
            window.open(whatsappUrl, '_blank');
            
            bookingForm.reset();
            closeModal();
        });
    }

    // --- Gallery Lightbox Logic ---
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('.gallery-img');
            if (img && lightbox && lightboxImg) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            if (!bookingModal.classList.contains('active')) {
                document.body.style.overflow = 'auto';
            }
        }
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    const lightboxOverlay = document.querySelector('.lightbox-overlay');
    if (lightboxOverlay) {
        lightboxOverlay.addEventListener('click', closeLightbox);
    }

    // --- FAQ Accordion Logic ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        const body = item.querySelector('.faq-body');
        
        if (header && body) {
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items first
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherBody = otherItem.querySelector('.faq-body');
                    if (otherBody) otherBody.style.maxHeight = null;
                });
                
                // Toggle clicked item
                if (!isActive) {
                    item.classList.add('active');
                    body.style.maxHeight = body.scrollHeight + "px";
                }
            });
        }
    });

    // --- Scroll Animations Observer ---
    const fadeElements = document.querySelectorAll('.fade-in');
    
    if ('IntersectionObserver' in window) {
        const appearanceOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };
        
        const appearanceObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('appear');
                    observer.unobserve(entry.target); // Trigger once
                }
            });
        }, appearanceOptions);
        
        fadeElements.forEach(element => {
            appearanceObserver.observe(element);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        fadeElements.forEach(element => {
            element.classList.add('appear');
        });
    }

    // --- Falling Flower Petals Effect ---
    const flowerContainer = document.getElementById('heroFlowerContainer');
    if (flowerContainer) {
        const petalColors = ['#ff9933', '#e65c00', '#ffd700', '#ff4500']; // marigold orange, dark orange, gold, orange-red
        const spawnCount = 30; // total concurrent petals
        
        for (let i = 0; i < spawnCount; i++) {
            createPetal(true); // Initial load: distribute vertically so they don't all start at the top
        }
        
        function createPetal(initial = false) {
            const petal = document.createElement('div');
            petal.className = 'petal';
            
            // Randomize size
            const size = Math.random() * 12 + 6; // 6px to 18px
            petal.style.width = `${size}px`;
            petal.style.height = `${size * 1.5}px`; // slightly elongated shape
            
            // Randomize color
            petal.style.backgroundColor = petalColors[Math.floor(Math.random() * petalColors.length)];
            
            // Randomize starting horizontal position
            petal.style.left = `${Math.random() * 100}%`;
            
            // Randomize animation duration and delay
            const duration = Math.random() * 8 + 6; // 6s to 14s fall time
            const delay = initial ? -(Math.random() * duration) : 0; // if initial, stagger them vertically
            
            petal.style.animationName = 'fall, sway';
            petal.style.animationDuration = `${duration}s, ${Math.random() * 4 + 3}s`;
            if (delay) petal.style.animationDelay = `${delay}s, ${delay}s`;
            petal.style.animationTimingFunction = 'linear, ease-in-out';
            petal.style.animationIterationCount = 'infinite, infinite';
            
            // Randomize rotation
            petal.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            // Append to container
            flowerContainer.appendChild(petal);
            
            // Remove petal after animation and respawn
            setTimeout(() => {
                petal.remove();
                createPetal(false);
            }, (duration + (delay ? delay : 0)) * 1000);
        }
    }

    // --- Auto-open Booking Modal after 2 seconds ---
    setTimeout(() => {
        if (bookingModal && !bookingModal.classList.contains('active')) {
            bookingModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (pujaSelect) {
                updateBookingSummary(pujaSelect.value);
            }
        }
    }, 2000);
});

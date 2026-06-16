document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       SCROLL INDICATOR & STICKY NAVBAR
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTop = document.getElementById('back-to-top');

    const handleScroll = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // 1. Update Scroll Progress Bar
        const scrolledPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = `${scrolledPercent}%`;

        // 2. Sticky Navbar Styling
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // 3. Back to Top Button Visibility
        if (scrollTop > 400) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger initial scroll check

    // Smooth Scroll to Top
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    /* ==========================================================================
       MOBILE NAVIGATION MENU
       ========================================================================== */
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        navbar.classList.toggle('menu-open');
    };

    const closeMenu = () => {
        navbar.classList.remove('menu-open');
    };

    navToggle.addEventListener('click', toggleMenu);

    // Close mobile menu when a nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close mobile menu if clicked outside
    document.addEventListener('click', (event) => {
        const isClickInsideNav = navbar.contains(event.target);
        if (!isClickInsideNav && navbar.classList.contains('menu-open')) {
            closeMenu();
        }
    });

    /* ==========================================================================
       ACTIVE SECTION HIGHLIGHTING IN NAVBAR
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    
    const highlightNavSection = () => {
        const scrollPosition = window.scrollY + 120; // Offset for sticky navbar

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const targetLink = document.getElementById(`link-${sectionId}`);

            if (targetLink) {
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    targetLink.classList.add('active');
                }
            }
        });
    };

    window.addEventListener('scroll', highlightNavSection);
    highlightNavSection();

    /* ==========================================================================
       SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, {
        threshold: 0.15, // Reveal when 15% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Adjust reveal height boundary
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    /* ==========================================================================
       DYNAMIC TYPING EFFECT
       ========================================================================== */
    const typingSpan = document.getElementById('typing');
    const words = ["Frontend Websites", "Responsive UI/UX Layouts", "Clean Code Solutions", "Premium User Experiences"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const typeEffect = () => {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            charIndex--;
            typingSpeed = 50; // Deleting is faster
        } else {
            charIndex++;
            typingSpeed = 100;
        }

        typingSpan.textContent = currentWord.substring(0, charIndex);

        // Word completed typing
        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end of word
        } 
        // Word fully deleted
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length; // Move to next word
            typingSpeed = 500; // Brief pause before typing next word
        }

        setTimeout(typeEffect, typingSpeed);
    };

    if (typingSpan) {
        typeEffect();
    }

    /* ==========================================================================
       CONTACT FORM VALIDATION & SIMULATION
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('form-submit-btn');
    const toastContainer = document.getElementById('toast-container');

    // Email verification regex
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Show Toast Notifications
    const showToast = (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const iconClass = type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation';
        toast.innerHTML = `
            <i class="fa-solid ${iconClass} toast-icon"></i>
            <span class="toast-message">${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Trigger exit fade-out
        setTimeout(() => {
            toast.classList.add('fade-out');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 4000);
    };

    // Input Validation
    const validateField = (inputElement, errorElement, validationFn, defaultMsg) => {
        const parent = inputElement.closest('.form-group');
        const value = inputElement.value.trim();
        
        let isValid = true;
        let msg = defaultMsg;

        if (value === '') {
            isValid = false;
        } else if (validationFn && !validationFn(value)) {
            isValid = false;
            msg = 'Please enter a valid format';
        }

        if (!isValid) {
            parent.classList.add('error');
            errorElement.textContent = msg;
        } else {
            parent.classList.remove('error');
        }

        return isValid;
    };

    if (contactForm) {
        const fields = [
            {
                input: document.getElementById('form-name'),
                error: document.getElementById('name-error'),
                defaultMsg: 'Please enter your name'
            },
            {
                input: document.getElementById('form-email'),
                error: document.getElementById('email-error'),
                validation: isValidEmail,
                defaultMsg: 'Please enter your email address'
            },
            {
                input: document.getElementById('form-subject'),
                error: document.getElementById('subject-error'),
                defaultMsg: 'Please enter a subject'
            },
            {
                input: document.getElementById('form-message'),
                error: document.getElementById('message-error'),
                defaultMsg: 'Please enter your message'
            }
        ];

        // Real-time error removal on input
        fields.forEach(field => {
            field.input.addEventListener('input', () => {
                const parent = field.input.closest('.form-group');
                parent.classList.remove('error');
            });
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let formHasErrors = false;

            fields.forEach(field => {
                const isFieldValid = validateField(field.input, field.error, field.validation, field.defaultMsg);
                if (!isFieldValid) {
                    formHasErrors = true;
                }
            });

            if (formHasErrors) {
                showToast('Please correct the highlighted errors in the form.', 'error');
                return;
            }

            // Simulate Form Submission
            submitBtn.disabled = true;
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.innerHTML = `
                <span>Sending Message...</span>
                <i class="fa-solid fa-circle-notch fa-spin"></i>
            `;

            setTimeout(() => {
                // Success feedback
                showToast('Thank you! Your message has been sent successfully.', 'success');
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
            }, 1800);
        });
    }
});

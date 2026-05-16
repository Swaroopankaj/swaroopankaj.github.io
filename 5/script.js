document.addEventListener('DOMContentLoaded', () => {
    const cursorGlow = document.querySelector('.cursor-glow');
    const nav = document.getElementById('navbar');
    const revealElements = document.querySelectorAll('.reveal');

    // Cursor Glow Movement
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        
        cursorGlow.style.left = x + 'px';
        cursorGlow.style.top = y + 'px';

        // Subtle magnetic effect for primary buttons
        const magneticBtns = document.querySelectorAll('.btn.primary');
        magneticBtns.forEach(btn => {
            const rect = btn.getBoundingClientRect();
            const btnX = rect.left + rect.width / 2;
            const btnY = rect.top + rect.height / 2;
            const dist = Math.sqrt(Math.pow(x - btnX, 2) + Math.pow(y - btnY, 2));

            if (dist < 100) {
                const moveX = (x - btnX) * 0.2;
                const moveY = (y - btnY) * 0.2;
                btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
            } else {
                btn.style.transform = '';
            }
        });
    });

    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Intersection Observer for Reveal Animations
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Form Submission (Mock)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            
            btn.innerText = 'Sending...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerText = 'Message Sent!';
                btn.style.background = '#27C93F';
                contactForm.reset();
                
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});

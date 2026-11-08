/**
 * Megan Daoust - Personal Portfolio Script
 * Handles Theme toggling, project filtering, and navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. Theme (Dark / Light)
    // -------------------------------------------------------------
    // Default to 'dark' for modern developer aesthetic
    let savedTheme = 'dark';
    try { savedTheme = localStorage.getItem('theme') === 'light' ? 'light' : 'dark'; } catch {}
    applyTheme(savedTheme);

    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(nextTheme);
        });
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        try { localStorage.setItem('theme', theme); } catch {}
        updateThemeIcon(theme);
    }

    function updateThemeIcon(theme) {
        const iconWrapper = document.getElementById('theme-icon');
        if (!iconWrapper) return;
        if (theme === 'light') {
            // Moon icon to switch to dark
            iconWrapper.innerHTML = `
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width:20px;height:20px;">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                </svg>
            `;
        } else {
            // Sun icon to switch to light
            iconWrapper.innerHTML = `
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width:20px;height:20px;">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
            `;
        }
    }

    // -------------------------------------------------------------
    // 2. Sticky Header & Active Nav Link Highlighting
    // -------------------------------------------------------------
    const header = document.querySelector('.site-header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }

        // Active link tracking
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 140;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // -------------------------------------------------------------
    // 3. Mobile Navigation Menu
    // -------------------------------------------------------------
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-links');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            mobileToggle.setAttribute('aria-expanded', String(isOpen));
            mobileToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });
    }

    function closeMenu() {
        navMenu?.classList.remove('open');
        mobileToggle?.setAttribute('aria-expanded', 'false');
        mobileToggle?.setAttribute('aria-label', 'Open navigation menu');
    }
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && navMenu?.classList.contains('open')) {
            closeMenu();
            mobileToggle?.focus();
        }
    });

    // -------------------------------------------------------------
    // 4. Project Filtering
    // -------------------------------------------------------------
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');

            const filter = btn.getAttribute('data-filter') || 'all';

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category') || '';
                if (filter === 'all' || category.split(' ').includes(filter)) {
                    card.classList.remove('is-hidden');
                } else {
                    card.classList.add('is-hidden');
                }
            });
        });
    });

    // -------------------------------------------------------------
    // 5. Interactive Copy Email with Toast Feedback
    // -------------------------------------------------------------
    const copyEmailBtns = document.querySelectorAll('.copy-email-trigger');
    const toast = document.getElementById('toast-notice');

    copyEmailBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = btn.getAttribute('data-email') || 'megandaoust9@gmail.com';

            if (!navigator.clipboard?.writeText) {
                window.location.href = `mailto:${email}`;
                return;
            }
            navigator.clipboard.writeText(email).then(() => {
                showToast(`Copied ${email} to clipboard!`);
                btn.classList.add('copied');
                const label = btn.querySelector('.btn-label');
                const originalText = label ? label.textContent : '';
                if (label) label.textContent = 'Copied to Clipboard!';
                setTimeout(() => {
                    btn.classList.remove('copied');
                    if (label && originalText) label.textContent = originalText;
                }, 2500);
            }).catch(() => {
                window.location.href = `mailto:${email}`;
            });
        });
    });

    function showToast(message) {
        if (!toast) return;
        const msgSpan = toast.querySelector('.toast-msg');
        if (msgSpan) msgSpan.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // -------------------------------------------------------------
    // 6. Interactive 3D Card Sheen / Tilt Effect
    // -------------------------------------------------------------
    const interactiveCards = document.querySelectorAll('.bento-card, .project-card, .profile-card');

    if (window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        interactiveCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -3;
                const rotateY = ((x - centerX) / centerX) * 3;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // -------------------------------------------------------------
    // 7. Scroll to Top
    // -------------------------------------------------------------
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
            });
        });
    }
});

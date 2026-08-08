/* ==========================================================================
   SUNNY BALANI & CO. - MAIN APPLICATION COORDINATOR
   ========================================================================== */

// Google Sheet Webhook URL (Replace this with your deployed Google Apps Script Web App URL)
window.GOOGLE_SHEET_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbyBfDGaHFEU0_KJwXbFCwp5cph2OfLzQeipH3pK_O1QseVD2nRjcs00MWaYHxbJqKOg/exec";

// --- UTM Parameters & Referral Source Capture ---
(function() {
    function captureUTMParameters() {
        if (sessionStorage.getItem('lead_utm_data')) {
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const utmData = {
            utm_source: urlParams.get('utm_source') || '',
            utm_medium: urlParams.get('utm_medium') || '',
            utm_campaign: urlParams.get('utm_campaign') || '',
            utm_term: urlParams.get('utm_term') || '',
            utm_content: urlParams.get('utm_content') || '',
            gclid: urlParams.get('gclid') || '',
            fbclid: urlParams.get('fbclid') || '',
            referrer: document.referrer || 'direct'
        };

        // Fallback: guess UTM source from document referrer if none present
        if (!utmData.utm_source) {
            const ref = utmData.referrer.toLowerCase();
            if (ref.includes('google.')) {
                utmData.utm_source = 'google';
                utmData.utm_medium = 'organic';
            } else if (ref.includes('facebook.com') || ref.includes('instagram.com')) {
                utmData.utm_source = 'facebook';
                utmData.utm_medium = 'social';
            } else if (ref.includes('linkedin.com')) {
                utmData.utm_source = 'linkedin';
                utmData.utm_medium = 'social';
            } else if (ref && ref !== 'direct') {
                utmData.utm_source = 'referral';
                utmData.utm_medium = 'web';
            } else {
                utmData.utm_source = 'direct';
                utmData.utm_medium = 'none';
            }
        }

        sessionStorage.setItem('lead_utm_data', JSON.stringify(utmData));
    }

    captureUTMParameters();

    window.getUTMData = function() {
        try {
            const stored = sessionStorage.getItem('lead_utm_data');
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.warn('Failed to parse UTM data:', e);
        }
        return {
            utm_source: 'direct',
            utm_medium: 'none',
            utm_campaign: '',
            utm_term: '',
            utm_content: '',
            gclid: '',
            fbclid: '',
            referrer: 'direct'
        };
    };
})();

document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const viewSections = document.querySelectorAll('.view-section');
    const themeToggle = document.getElementById('theme-toggle');
    const logoLink = document.getElementById('logo-link');
    
    // Mobile menu toggle elements
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileNav = document.getElementById('mobile-nav');

    // Services tab elements
    const serviceTabBtns = document.querySelectorAll('.tab-btn');
    const serviceTabContents = document.querySelectorAll('.tab-content');

    // Stats counting elements
    const statNumbers = document.querySelectorAll('.stat-number');

    // --- Navigation Link Active State Sync (Multi-page) ---
    const path = window.location.pathname.split('/').pop() || 'index.html';
    const pageMap = {
        'index.html': 'home',
        'about.html': 'about',
        'services.html': 'services',
        'knowledge.html': 'knowledge',
        'contact.html': 'contact',
        'careers.html': 'careers'
    };
    const activeView = pageMap[path] || 'home';

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === path || (path === 'index.html' && linkPath === 'index.html') || (path === '' && linkPath === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    mobileLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === path || (path === 'index.html' && linkPath === 'index.html') || (path === '' && linkPath === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // --- Services Tab Initialization (Deep Links) ---
    if (path.includes('services.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const tab = urlParams.get('tab');
        if (tab) {
            const tabBtn = document.querySelector(`.tab-btn[data-tab="${tab}"]`);
            const tabContent = document.getElementById(tab);
            if (tabBtn && tabContent) {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                tabBtn.classList.add('active');
                tabContent.classList.add('active');
            }
        }

        const serviceTabButtons = document.querySelectorAll('.tab-btn');
        serviceTabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.getAttribute('data-tab');
                if (tabName) {
                    window.history.replaceState(null, '', `?tab=${tabName}`);
                }
            });
        });
    }

    // --- Mobile Menu Toggle ---
    if (mobileMenuBtn && mobileMenuClose && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNav.classList.add('open');
        });

        mobileMenuClose.addEventListener('click', () => {
            mobileNav.classList.remove('open');
        });

        // Close when clicking outside content container
        mobileNav.addEventListener('click', (e) => {
            if (e.target === mobileNav) {
                mobileNav.classList.remove('open');
            }
        });

        // Close menu drawer when clicking a link
        if (mobileLinks) {
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileNav.classList.remove('open');
                });
            });
        }
    }

    // --- Dark / Light Theme Toggling ---
    if (themeToggle) {
        // Default theme class initialized in HTML: dark-theme
        themeToggle.addEventListener('click', () => {
            const body = document.body;
            body.classList.toggle('light-theme');
            body.classList.toggle('dark-theme');
            
            // Swap icon inside button
            const icon = themeToggle.querySelector('i');
            if (body.classList.contains('light-theme')) {
                icon.className = 'fa-solid fa-sun';
                themeToggle.title = "Switch to Dark Mode";
            } else {
                icon.className = 'fa-solid fa-moon';
                themeToggle.title = "Switch to Light Mode";
            }
        });
    }

    // --- Services view - Sub Tabs Toggling ---
    serviceTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            serviceTabBtns.forEach(b => b.classList.remove('active'));
            serviceTabContents.forEach(c => c.classList.remove('active'));

            // Set active states
            btn.classList.add('active');
            const targetTab = btn.getAttribute('data-tab');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // --- Stats Counter countUp animation ---
    function animateCounters() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            let count = 0;
            const duration = 1500; // 1.5s total animation duration
            const increment = target / (duration / 16); // ~60fps step size

            function updateCounter() {
                count += increment;
                if (count < target) {
                    stat.textContent = Math.floor(count);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target; // Ensure exact final value is set
                }
            }
            updateCounter();
        });
    }

    // Intersection Observer to trigger counters on scroll visibility
    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) {
        let countAnimationTriggered = false;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countAnimationTriggered) {
                    animateCounters();
                    countAnimationTriggered = true; // prevent duplicate animations
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(statsSection);
    }

    // --- Interactive Chatbot Promo Speech Bubble ---
    const chatPromo = document.getElementById('chat-promo');
    const closeChatPromo = document.getElementById('close-chat-promo');
    const chatBubble = document.getElementById('chat-bubble');

    if (chatPromo) {
        // Show promo bubble after 2 seconds
        setTimeout(() => {
            if (!sessionStorage.getItem('dismissed-chat-promo')) {
                chatPromo.classList.add('visible');
            }
        }, 2000);

        // Click promo to trigger chatbot open
        chatPromo.addEventListener('click', (e) => {
            if (e.target.id === 'close-chat-promo') return;
            chatPromo.classList.remove('visible');
            if (chatBubble) {
                chatBubble.click();
            }
        });

        // Close promo bubble
        if (closeChatPromo) {
            closeChatPromo.addEventListener('click', (e) => {
                e.stopPropagation();
                chatPromo.classList.remove('visible');
                sessionStorage.setItem('dismissed-chat-promo', 'true');
            });
        }
    }



    // --- Scroll Reveal Animation Observer ---
    const revealElements = document.querySelectorAll('.reveal-element');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target); // Animate once
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        revealElements.forEach(el => revealObserver.observe(el));
    }

    // --- Scroll Indicator fade listener for Mobile Horizontal Sidebar ---
    const calcSidebars = document.querySelectorAll('.calc-sidebar');
    calcSidebars.forEach(sidebar => {
        const container = sidebar.closest('.calc-sidebar-container');
        if (!container) return;
        const scrollIndicator = container.querySelector('.scroll-indicator-right');
        if (!scrollIndicator) return;

        sidebar.addEventListener('scroll', () => {
            if (sidebar.scrollLeft > 15) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        });
    });

    // --- FAQ Accordion Interactivity ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const answer = item.querySelector('.faq-answer');
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = '0px';
                        otherAnswer.style.opacity = '0';
                    }
                }
            });
            
            // Toggle active state
            if (isActive) {
                item.classList.remove('active');
                if (answer) {
                    answer.style.maxHeight = '0px';
                    answer.style.opacity = '0';
                }
            } else {
                item.classList.add('active');
                if (answer) {
                    answer.style.maxHeight = answer.scrollHeight + "px";
                    answer.style.opacity = '1';
                }
            }
        });
    });

    // --- Stats Counter Animation Observer ---
    function initStatsCounter() {
        const statNums = document.querySelectorAll('.stats-gradient-bar .num');
        const container = document.querySelector('.stats-gradient-bar');
        if (!container || statNums.length === 0) return;

        // Parse targets and set initial content to 0
        const targets = [];
        statNums.forEach(el => {
            const text = el.textContent.trim();
            const numVal = parseInt(text.replace(/\D/g, ''), 10) || 0;
            const suffix = text.replace(/[0-9]/g, ''); // Extract + or %
            targets.push({ el, numVal, suffix });
            el.textContent = '0' + suffix;
        });

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    obs.unobserve(entry.target); // Run only once
                }
            });
        }, { threshold: 0.15 });

        observer.observe(container);

        function animateCounters() {
            targets.forEach(item => {
                let start = 0;
                const end = item.numVal;
                const duration = 1600; // 1.6 seconds animation duration
                const startTime = performance.now();

                function update(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Smooth ease-out quadratic progress
                    const easeProgress = progress * (2 - progress);
                    const currentVal = Math.floor(easeProgress * end);
                    
                    item.el.textContent = currentVal + item.suffix;

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        item.el.textContent = end + item.suffix;
                    }
                }
                
                requestAnimationFrame(update);
            });
        }
    }
    
    initStatsCounter();

});

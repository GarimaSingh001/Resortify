document.addEventListener('DOMContentLoaded', () => {

    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.style.overflow = '';
        }, 2200);
    });
    document.body.style.overflow = 'hidden';

    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    function animateRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll('a, button, .col-card, .offer-card, .dm-card, .exc-card, .rest-item, .ev-card, .mag-item, .mag-featured, .bfield, .d-pill, .b-tab').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });


    const navbar = document.getElementById('navbar');
    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        if (scrollY > lastScrollY && scrollY > 300) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }
        lastScrollY = scrollY;

        // Back to top
        const backBtn = document.getElementById('backToTop');
        if (scrollY > 600) {
            backBtn.classList.add('visible');
        } else {
            backBtn.classList.remove('visible');
        }
    });

    document.getElementById('backToTop').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    // ==================== FULLSCREEN SEARCH ====================
    const searchToggle = document.getElementById('searchToggle');
    const fullscreenSearch = document.getElementById('fullscreenSearch');
    const closeSearch = document.getElementById('closeSearch');
    const searchInput = document.getElementById('searchInput');

    searchToggle.addEventListener('click', () => {
        fullscreenSearch.classList.add('open');
        setTimeout(() => searchInput.focus(), 300);
    });

    closeSearch.addEventListener('click', () => fullscreenSearch.classList.remove('open'));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') fullscreenSearch.classList.remove('open');
    });


    // ==================== HERO SLIDESHOW ====================
    const slides = document.querySelectorAll('.hero-slide');
    const slideDots = document.querySelectorAll('.slide-dot');
    let currentSlide = 0;
    let slideInterval;

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        slideDots[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        slideDots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }

    slideInterval = setInterval(nextSlide, 7000);

    slideDots.forEach(dot => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            goToSlide(parseInt(dot.dataset.index));
            slideInterval = setInterval(nextSlide, 7000);
        });
    });


    // ==================== HERO COUNTER ANIMATION ====================
    const statNums = document.querySelectorAll('.stat-num');

    function animateCounter(el) {
        const target = parseInt(el.dataset.target);
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target + '+';
        }
        requestAnimationFrame(update);
    }

    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNums.forEach(el => animateCounter(el));
                heroObserver.disconnect();
            }
        });
    }, { threshold: 0.5 });

    if (document.querySelector('.hero-stats')) {
        heroObserver.observe(document.querySelector('.hero-stats'));
    }


    
    document.querySelectorAll('.b-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.b-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });


    const destField = document.getElementById('dest-field');
    const destDropdown = document.getElementById('destDropdown');
    const destVal = document.getElementById('dest-val');

    destField.addEventListener('click', (e) => {
        e.stopPropagation();
        destDropdown.classList.toggle('open');
        document.getElementById('guestPanel').classList.remove('open');
    });

    document.querySelectorAll('.dest-opt').forEach(opt => {
        opt.addEventListener('click', (e) => {
            e.stopPropagation();
            destVal.textContent = opt.dataset.place;
            destDropdown.classList.remove('open');
        });
    });

    // Guest panel
    let guests = { adults: 2, children: 0, rooms: 1 };

    const guestField = document.getElementById('guestField');
    const guestPanel = document.getElementById('guestPanel');
    const guestVal = document.getElementById('guest-val');

    guestField.addEventListener('click', (e) => {
        e.stopPropagation();
        guestPanel.classList.toggle('open');
        destDropdown.classList.remove('open');
    });

    document.querySelectorAll('.g-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const type = btn.dataset.type;
            const action = btn.dataset.action;
            if (action === 'plus') {
                if (type === 'adults') guests.adults = Math.min(guests.adults + 1, 10);
                if (type === 'children') guests.children = Math.min(guests.children + 1, 6);
                if (type === 'rooms') guests.rooms = Math.min(guests.rooms + 1, 5);
            } else {
                if (type === 'adults') guests.adults = Math.max(guests.adults - 1, 1);
                if (type === 'children') guests.children = Math.max(guests.children - 1, 0);
                if (type === 'rooms') guests.rooms = Math.max(guests.rooms - 1, 1);
            }
            document.getElementById('g-adults').textContent = guests.adults;
            document.getElementById('g-children').textContent = guests.children;
            document.getElementById('g-rooms').textContent = guests.rooms;
        });
    });

    document.getElementById('applyGuests').addEventListener('click', (e) => {
        e.stopPropagation();
        guestVal.textContent = `${guests.adults} Adults · ${guests.children} Children · ${guests.rooms} Room${guests.rooms > 1 ? 's' : ''}`;
        guestPanel.classList.remove('open');
    });

    document.addEventListener('click', () => {
        destDropdown.classList.remove('open');
        guestPanel.classList.remove('open');
    });

    // Date defaults
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 4);

    const checkin = document.getElementById('checkin');
    const checkout = document.getElementById('checkout');
    checkin.min = today.toISOString().split('T')[0];
    checkin.value = tomorrow.toISOString().split('T')[0];
    checkout.value = dayAfter.toISOString().split('T')[0];

    checkin.addEventListener('change', () => {
        checkout.min = checkin.value;
        if (checkout.value <= checkin.value) {
            const nextDay = new Date(checkin.value);
            nextDay.setDate(nextDay.getDate() + 1);
            checkout.value = nextDay.toISOString().split('T')[0];
        }
    });

    // Booking submit
    document.getElementById('bookingSubmit').addEventListener('click', () => {
        const dest = destVal.textContent;
        const cin = checkin.value;
        const cout = checkout.value;

        if (dest === 'Select Location') {
            showAlert('DESTINATION REQUIRED', 'Please select your destination to check availability.', 'error');
            return;
        }
        if (!cin || !cout) {
            showAlert('DATES REQUIRED', 'Please select your check-in and check-out dates.', 'error');
            return;
        }

        const btn = document.getElementById('bookingSubmit');
        btn.querySelector('span').textContent = 'SEARCHING...';
        btn.style.background = '#333';

        setTimeout(() => {
            btn.querySelector('span').textContent = 'CHECK AVAILABILITY';
            btn.style.background = '';
            showAlert('AVAILABILITY CONFIRMED', `We have luxury accommodations available in <strong>${dest}</strong> for ${guests.adults} Adults${guests.children > 0 ? ', ' + guests.children + ' Children' : ''} from ${formatDate(cin)} to ${formatDate(cout)}.`, 'success');
        }, 1500);
    });

    function formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }


    function showAlert(title, body, type) {
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);backdrop-filter:blur(8px);z-index:999999;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.3s';
        
        const box = document.createElement('div');
        box.style.cssText = `background:#fff;padding:50px;text-align:center;max-width:460px;border-top:4px solid ${type === 'success' ? '#b59410' : '#e74c3c'};transform:scale(0.9);transition:transform 0.4s cubic-bezier(0.25,1,0.5,1)`;
        
        box.innerHTML = `
            <div style="font-size:10px;letter-spacing:3px;color:${type === 'success' ? '#b59410' : '#e74c3c'};margin-bottom:15px">${type === 'success' ? '✓ CONFIRMED' : '✗ ACTION REQUIRED'}</div>
            <h2 style="font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:400;margin-bottom:15px;letter-spacing:2px">${title}</h2>
            <p style="font-size:13px;color:#666;line-height:1.8;margin-bottom:35px">${body}</p>
            <button id="alertClose" style="padding:14px 45px;background:#0d0d0d;color:#fff;border:none;font-family:'Montserrat',sans-serif;font-size:11px;letter-spacing:2px;cursor:pointer;transition:background 0.3s">PROCEED</button>
        `;
        
        overlay.appendChild(box);
        document.body.appendChild(overlay);
        
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            box.style.transform = 'scale(1)';
        });
        
        document.getElementById('alertClose').addEventListener('click', () => {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 300);
        });
        
        document.getElementById('alertClose').addEventListener('mouseenter', () => {
            document.getElementById('alertClose').style.background = '#b59410';
        });
        document.getElementById('alertClose').addEventListener('mouseleave', () => {
            document.getElementById('alertClose').style.background = '#0d0d0d';
        });
    }


    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal-item').forEach((el, index) => {
        el.dataset.delay = (index % 4) * 100;
        revealObserver.observe(el);
    });


    const offersTrack = document.getElementById('offersTrack');
    const cardWidth = 280;

    document.getElementById('offersPrev').addEventListener('click', () => {
        offersTrack.scrollBy({ left: -cardWidth * 2, behavior: 'smooth' });
    });
    document.getElementById('offersNext').addEventListener('click', () => {
        offersTrack.scrollBy({ left: cardWidth * 2, behavior: 'smooth' });
    });

    let isDown = false, startX, scrollLeft;
    offersTrack.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - offersTrack.offsetLeft;
        scrollLeft = offersTrack.scrollLeft;
    });
    offersTrack.addEventListener('mouseleave', () => isDown = false);
    offersTrack.addEventListener('mouseup', () => isDown = false);
    offersTrack.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - offersTrack.offsetLeft;
        offersTrack.scrollLeft = scrollLeft - (x - startX) * 2;
    });


    const pills = document.querySelectorAll('.d-pill');
    const dmCards = document.querySelectorAll('.dm-card');

    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const filter = pill.dataset.filter;
            dmCards.forEach(card => {
                const cats = card.dataset.cat || '';
                if (filter === 'all' || cats.includes(filter)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });


    const testSlides = document.querySelectorAll('.test-slide');
    const testDots = document.querySelectorAll('.test-dot');
    let currentTest = 0;
    let testInterval;

    function goToTestimonial(index) {
        testSlides[currentTest].classList.remove('active');
        testDots[currentTest].classList.remove('active');
        currentTest = index;
        testSlides[currentTest].classList.add('active');
        testDots[currentTest].classList.add('active');
    }

    testInterval = setInterval(() => goToTestimonial((currentTest + 1) % testSlides.length), 5000);

    testDots.forEach(dot => {
        dot.addEventListener('click', () => {
            clearInterval(testInterval);
            goToTestimonial(parseInt(dot.dataset.index));
            testInterval = setInterval(() => goToTestimonial((currentTest + 1) % testSlides.length), 5000);
        });
    });


    const conciergeBtn = document.getElementById('conciergeBtn');
    const conciergePanel = document.getElementById('conciergePanel');
    const cpClose = document.getElementById('cpClose');
    const cpMessages = document.getElementById('cpMessages');
    const cpInput = document.getElementById('cpInput');
    const cpSend = document.getElementById('cpSend');

    const botResponses = {
        greeting: "Good day! I'm your personal Resortify Concierge. How may I curate an extraordinary experience for you today?",
        keywords: {
            'book|stay|reservation|room': "Certainly! I'd be delighted to assist with a reservation. May I know your preferred destination and travel dates? You can also use our booking widget above for instant availability.",
            'wedding|marry|ceremony': "Congratulations on your upcoming celebration! Our Timeless Weddings team specializes in creating magical moments across our most iconic properties. Would you like a specialist to reach out?",
            'spa|wellness|massage|relax': "Our J Wellness Circle offers an exquisite blend of ancient Ayurvedic traditions and modern therapies. Shall I share our current treatment menu?",
            'food|eat|dinner|restaurant|dining': "Our legendary restaurant brands — from Wasabi's Japanese cuisine to Varq's contemporary Indian — offer truly world-class culinary journeys. Would you like to make a reservation?",
            'offer|deal|discount|price|cost': "We have several exclusive offers currently available, including up to 30% for Neupass members. Would you like me to highlight our best current promotions?",
            'membership|neupass|join|member': "The Neupass membership unlocks a world of privileges — from room upgrades to spa credits and personalized services. Shall I walk you through the tier benefits?",
            'maldives|goa|udaipur|dubai|london': "An exceptional destination choice! We have multiple properties there with breathtaking settings. May I help you plan your perfect stay?",
            'cancel|refund|policy': "Our cancellation policies vary by property and rate. For the most accurate information about your specific booking, please contact our reservations team at 1-800-111-825 or reservations@resortify.com.",
        },
        default: "That's a wonderful inquiry. Let me connect you with our specialized team who can assist with that personally. You may also reach us at 1-800-111-825 or reservations@resortify.com for immediate assistance."
    };

    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `cp-msg ${sender}`;
        div.innerHTML = text;
        cpMessages.appendChild(div);
        cpMessages.scrollTop = cpMessages.scrollHeight;
    }

    function showTyping() {
        const t = document.createElement('div');
        t.id = 'typing-ind';
        t.className = 'cp-msg bot';
        t.innerHTML = '<em style="color:#aaa;font-size:12px">Concierge is typing...</em>';
        cpMessages.appendChild(t);
        cpMessages.scrollTop = cpMessages.scrollHeight;
    }

    function getResponse(input) {
        const lower = input.toLowerCase();
        for (const [pattern, response] of Object.entries(botResponses.keywords)) {
            if (new RegExp(pattern).test(lower)) return response;
        }
        return botResponses.default;
    }

    function processMessage() {
        const text = cpInput.value.trim();
        if (!text) return;
        addMessage(text, 'user');
        cpInput.value = '';
        showTyping();
        setTimeout(() => {
            document.getElementById('typing-ind')?.remove();
            addMessage(getResponse(text), 'bot');
        }, 1200 + Math.random() * 600);
    }

    conciergeBtn.addEventListener('click', () => {
        conciergePanel.classList.toggle('open');
        if (conciergePanel.classList.contains('open') && cpMessages.children.length === 0) {
            setTimeout(() => addMessage(botResponses.greeting, 'bot'), 600);
        }
    });
    cpClose.addEventListener('click', () => conciergePanel.classList.remove('open'));
    cpSend.addEventListener('click', processMessage);
    cpInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') processMessage(); });


    document.getElementById('nlForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('nlEmail').value;
        if (!email.includes('@') || !email.includes('.')) {
            document.getElementById('nlEmail').style.border = '1px solid #e74c3c';
            return;
        }
        document.getElementById('nlEmail').style.border = '';
        showAlert('WELCOME TO OUR WORLD', `Thank you for subscribing with <strong>${email}</strong>. Expect curated travel inspiration, exclusive offers, and early access to new collections in your inbox.`, 'success');
        document.getElementById('nlEmail').value = '';
    });


    const heroContent = document.querySelector('.hero-content');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.35}px)`;
        }
    });


    const heroLine1 = document.querySelector('.hero-title .line-1');
    const heroLine2 = document.querySelector('.hero-title .line-2');


    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '80px';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = '#fff';
        navLinks.style.padding = '20px';
        navLinks.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
        navLinks.style.zIndex = '999';
    });

});

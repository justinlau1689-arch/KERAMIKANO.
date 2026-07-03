/**
 * KOKERAMIKO — Corporate Ceramic Website
 * Vanilla JavaScript — No dependencies except AOS
 */

(function () {
  'use strict';

  /* ==================== DOM ELEMENTS ==================== */
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav__link');
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');
  const timelineLine = document.getElementById('timelineLine');
  const processLine = document.getElementById('processLine');
  const counterElements = document.querySelectorAll('[data-count]');

  /* ==================== AOS INITIALIZATION ==================== */
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
      disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'phone' : false
    });
  }

  /* ==================== STICKY NAVBAR ==================== */
  function handleNavbarScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  /* ==================== SCROLL PROGRESS BAR ==================== */
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }

  /* ==================== BACK TO TOP ==================== */
  function handleBackToTop() {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ==================== MOBILE NAVIGATION ==================== */
  const navOverlay = document.getElementById('navOverlay');

  function openNav() {
    navMenu.classList.add('open');
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    if (navOverlay) {
      navOverlay.classList.add('visible');
      navOverlay.setAttribute('aria-hidden', 'false');
    }
    document.body.classList.add('nav-open');
  }

  function closeNav() {
    navMenu.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    if (navOverlay) {
      navOverlay.classList.remove('visible');
      navOverlay.setAttribute('aria-hidden', 'true');
    }
    document.body.classList.remove('nav-open');
  }

  function toggleNav(e) {
    if (e) e.preventDefault();
    if (navMenu.classList.contains('open')) {
      closeNav();
    } else {
      openNav();
    }
  }

  function scrollToSection(targetId) {
    const target = document.querySelector(targetId);
    if (!target) return;

    const headerHeight = header ? header.offsetHeight : 72;
    const targetTop = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

    window.scrollTo({
      top: targetTop,
      behavior: 'smooth'
    });
  }

  navToggle.addEventListener('click', toggleNav);

  if (navOverlay) {
    navOverlay.addEventListener('click', closeNav);
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const wasOpen = navMenu.classList.contains('open');
      if (wasOpen) {
        closeNav();
      }

      // Scroll after menu closes so body overflow doesn't block scrolling on mobile
      setTimeout(function () {
        scrollToSection(targetId);

        navLinks.forEach(function (l) {
          l.classList.remove('active');
        });
        link.classList.add('active');
      }, wasOpen ? 320 : 0);
    });
  });

  /* ==================== ACTIVE NAV LINK ==================== */
  const sections = document.querySelectorAll('section[id]');

  function setActiveNavLink() {
    const scrollY = window.scrollY + 100;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  /* ==================== SMOOTH SCROLLING ==================== */
  document.querySelectorAll('a[href^="#"]:not(.nav__link)').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        scrollToSection(targetId);
      }
    });
  });

  /* ==================== BUTTON RIPPLE EFFECT ==================== */
  document.querySelectorAll('.btn--ripple').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = size + 'px';
      ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      setTimeout(function () {
        ripple.remove();
      }, 600);
    });
  });

  /* ==================== ANIMATED COUNTERS ==================== */
  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'), 10);
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 2000;
    const startTime = performance.now();

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const current = Math.floor(easedProgress * target);

      element.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counterElements.forEach(function (el) {
    counterObserver.observe(el);
  });

  /* ==================== TIMELINE ANIMATION ==================== */
  const timelineObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && timelineLine) {
          timelineLine.style.width = '100%';
          timelineObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  const timeline = document.querySelector('.timeline');
  if (timeline) {
    timelineObserver.observe(timeline);
  }

  /* ==================== PROCESS TIMELINE ANIMATION ==================== */
  const processObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && processLine) {
          processLine.style.setProperty('--process-progress', '100%');
          processObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  const processTimeline = document.querySelector('.process-timeline');
  if (processTimeline) {
    processObserver.observe(processTimeline);
  }

  /* ==================== CLIENT GRID ROW ANIMATION ==================== */
  function staggerClientCards() {
    const grid = document.getElementById('clientsGrid');
    if (!grid) return;

    const cards = grid.querySelectorAll('.client-card');
    const columns = window.innerWidth >= 992 ? 4 : window.innerWidth >= 768 ? 3 : 2;

    cards.forEach(function (card, index) {
      const row = Math.floor(index / columns);
      card.setAttribute('data-aos-delay', String(row * 100 + (index % columns) * 50));
    });
  }

  staggerClientCards();
  window.addEventListener('resize', debounce(staggerClientCards, 250));

  /* ==================== CONTACT FORM VALIDATION ==================== */
  const validationRules = {
    name: {
      validate: function (value) {
        return value.trim().length >= 2;
      },
      message: 'Please enter your full name (min. 2 characters).'
    },
    company: {
      validate: function (value) {
        return value.trim().length >= 2;
      },
      message: 'Please enter your company name.'
    },
    phone: {
      validate: function (value) {
        return /^[\d\s\-+()]{8,}$/.test(value.trim());
      },
      message: 'Please enter a valid phone number.'
    },
    email: {
      validate: function (value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
      },
      message: 'Please enter a valid email address.'
    },
    message: {
      validate: function (value) {
        return value.trim().length >= 10;
      },
      message: 'Please enter a message (min. 10 characters).'
    }
  };

  function validateField(fieldName) {
    const input = document.getElementById(fieldName);
    const errorEl = document.getElementById(fieldName + 'Error');
    const rule = validationRules[fieldName];

    if (!input || !rule) return true;

    const isValid = rule.validate(input.value);

    if (isValid) {
      input.classList.remove('error');
      if (errorEl) errorEl.textContent = '';
    } else {
      input.classList.add('error');
      if (errorEl) errorEl.textContent = rule.message;
    }

    return isValid;
  }

  Object.keys(validationRules).forEach(function (fieldName) {
    const input = document.getElementById(fieldName);
    if (input) {
      input.addEventListener('blur', function () {
        validateField(fieldName);
      });

      input.addEventListener('input', function () {
        if (input.classList.contains('error')) {
          validateField(fieldName);
        }
      });
    }
  });

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    let isFormValid = true;
    Object.keys(validationRules).forEach(function (fieldName) {
      if (!validateField(fieldName)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) return;

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    formSuccess.classList.remove('visible');

    setTimeout(function () {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      formSuccess.classList.add('visible');
      contactForm.reset();

      Object.keys(validationRules).forEach(function (fieldName) {
        const input = document.getElementById(fieldName);
        const errorEl = document.getElementById(fieldName + 'Error');
        if (input) input.classList.remove('error');
        if (errorEl) errorEl.textContent = '';
      });
    }, 2000);
  });

  /* ==================== HOVER MICRO-INTERACTIONS ==================== */
  document.querySelectorAll('.why-card, .product-card, .client-card, .info-card').forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      card.style.willChange = 'transform';
    });
    card.addEventListener('mouseleave', function () {
      card.style.willChange = 'auto';
    });
  });

  /* ==================== SCROLL HANDLER (THROTTLED) ==================== */
  function onScroll() {
    handleNavbarScroll();
    updateScrollProgress();
    handleBackToTop();
    setActiveNavLink();
  }

  let scrollTicking = false;
  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      requestAnimationFrame(function () {
        onScroll();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  /* ==================== UTILITY: DEBOUNCE ==================== */
  function debounce(fn, delay) {
    let timer;
    return function () {
      const args = arguments;
      const context = this;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  }

  /* ==================== RESIZE HANDLER ==================== */
  window.addEventListener('resize', debounce(function () {
    if (window.innerWidth >= 768) {
      closeNav();
    }
  }, 200));

  /* ==================== INITIAL RUN ==================== */
  onScroll();

})();

/**
 * KERAMIKANO — Products Gallery Page
 */

(function () {
  'use strict';

  const TOTAL_PRODUCTS = 100;
  const ITEMS_PER_PAGE = 12;
  const TOTAL_PAGES = Math.ceil(TOTAL_PRODUCTS / ITEMS_PER_PAGE);

  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav__link');
  const navOverlay = document.getElementById('navOverlay');
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');
  const galleryGrid = document.getElementById('galleryGrid');
  const galleryPagination = document.getElementById('galleryPagination');
  const galleryCount = document.getElementById('galleryCount');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentPage = 1;
  let currentLightboxIndex = 0;
  let allProducts = [];

  /* ==================== AOS ==================== */
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 60 });
  }

  /* ==================== NAV ==================== */
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

  if (navToggle) {
    navToggle.addEventListener('click', function (e) {
      e.preventDefault();
      navMenu.classList.contains('open') ? closeNav() : openNav();
    });
  }

  if (navOverlay) navOverlay.addEventListener('click', closeNav);

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () { closeNav(); });
  });

  /* ==================== SCROLL ==================== */
  function onScroll() {
    if (scrollProgress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.style.width = (docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0) + '%';
    }
    if (backToTop) {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    }
  }

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ==================== BUILD PRODUCT DATA ==================== */
  function buildProducts() {
    allProducts = [];
    for (let i = 1; i <= TOTAL_PRODUCTS; i++) {
      const num = String(i).padStart(2, '0');
      allProducts.push({
        id: i,
        label: 'Product ' + num,
        /* Replace with your image path, e.g. src: 'gallery/product-' + num + '.jpg' */
        src: ''
      });
    }
  }

  /* ==================== RENDER GALLERY ==================== */
  function renderGallery(page) {
    currentPage = page;
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = Math.min(start + ITEMS_PER_PAGE, TOTAL_PRODUCTS);
    const items = allProducts.slice(start, end);

    galleryGrid.innerHTML = '';
    galleryGrid.style.opacity = '0';

    items.forEach(function (product, index) {
      const globalIndex = start + index;
      const article = document.createElement('article');
      article.className = 'gallery-item';
      article.setAttribute('data-index', globalIndex);
      article.setAttribute('tabindex', '0');
      article.setAttribute('role', 'button');
      article.setAttribute('aria-label', product.label);

      const imageHtml = product.src
        ? '<img src="' + product.src + '" alt="' + product.label + '">'
        : '<div class="gallery-item__placeholder"><span>' + product.label + '</span><small>Replace image</small></div>';

      article.innerHTML =
        '<div class="gallery-item__image">' +
          imageHtml +
          '<div class="gallery-item__overlay" aria-hidden="true">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35M11 8v6M8 11h6"/></svg>' +
          '</div>' +
        '</div>';

      article.addEventListener('click', function () { openLightbox(globalIndex); });
      article.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(globalIndex);
        }
      });

      galleryGrid.appendChild(article);

      setTimeout(function () {
        article.classList.add('visible');
      }, index * 60);
    });

    requestAnimationFrame(function () {
      galleryGrid.style.transition = 'opacity 0.4s ease';
      galleryGrid.style.opacity = '1';
    });

    if (galleryCount) {
      galleryCount.textContent = 'Showing ' + (start + 1) + '–' + end + ' of ' + TOTAL_PRODUCTS + ' products';
    }

    renderPagination(page);
    window.scrollTo({ top: galleryGrid.offsetTop - 120, behavior: 'smooth' });
  }

  /* ==================== PAGINATION ==================== */
  function renderPagination(page) {
    galleryPagination.innerHTML = '';

    var prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'gallery-pagination__btn gallery-pagination__arrow';
    prevBtn.innerHTML = '&#8592;';
    prevBtn.setAttribute('aria-label', 'Previous page');
    prevBtn.disabled = page === 1;
    prevBtn.addEventListener('click', function () { if (page > 1) renderGallery(page - 1); });
    galleryPagination.appendChild(prevBtn);

    var pages = getPageNumbers(page, TOTAL_PAGES);
    pages.forEach(function (p) {
      if (p === '...') {
        var ellipsis = document.createElement('span');
        ellipsis.className = 'gallery-pagination__ellipsis';
        ellipsis.textContent = '...';
        galleryPagination.appendChild(ellipsis);
        return;
      }

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gallery-pagination__btn' + (p === page ? ' active' : '');
      btn.textContent = p;
      btn.setAttribute('aria-label', 'Page ' + p);
      if (p === page) btn.setAttribute('aria-current', 'page');
      btn.addEventListener('click', function () { renderGallery(p); });
      galleryPagination.appendChild(btn);
    });

    var nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'gallery-pagination__btn gallery-pagination__arrow';
    nextBtn.innerHTML = '&#8594;';
    nextBtn.setAttribute('aria-label', 'Next page');
    nextBtn.disabled = page === TOTAL_PAGES;
    nextBtn.addEventListener('click', function () { if (page < TOTAL_PAGES) renderGallery(page + 1); });
    galleryPagination.appendChild(nextBtn);
  }

  function getPageNumbers(current, total) {
    if (total <= 7) {
      return Array.from({ length: total }, function (_, i) { return i + 1; });
    }
    var pages = [1];
    if (current > 3) pages.push('...');
    for (var i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i);
    }
    if (current < total - 2) pages.push('...');
    pages.push(total);
    return pages;
  }

  /* ==================== LIGHTBOX ==================== */
  function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightboxContent();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    var product = allProducts[currentLightboxIndex];
    if (product.src) {
      lightboxImage.innerHTML = '<img src="' + product.src + '" alt="' + product.label + '">';
    } else {
      lightboxImage.innerHTML =
        '<div class="lightbox__placeholder">' +
          '<svg width="64" height="64" viewBox="0 0 64 64" fill="none"><rect x="8" y="16" width="48" height="36" rx="4" stroke="currentColor" stroke-width="2"/><circle cx="24" cy="30" r="6" stroke="currentColor" stroke-width="2"/></svg>' +
          '<span>' + product.label + '</span>' +
          '<small>Replace with your image</small>' +
        '</div>';
    }
    lightboxCaption.textContent = product.label;
  }

  function navigateLightbox(direction) {
    currentLightboxIndex += direction;
    if (currentLightboxIndex < 0) currentLightboxIndex = TOTAL_PRODUCTS - 1;
    if (currentLightboxIndex >= TOTAL_PRODUCTS) currentLightboxIndex = 0;
    updateLightboxContent();
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', function () { navigateLightbox(-1); });
  if (lightboxNext) lightboxNext.addEventListener('click', function () { navigateLightbox(1); });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  /* ==================== INIT ==================== */
  buildProducts();
  renderGallery(1);

  window.addEventListener('resize', function () {
    if (window.innerWidth >= 768) closeNav();
  });

})();

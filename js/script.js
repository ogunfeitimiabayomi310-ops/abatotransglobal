/* AbatoTransGlobal – Core Interactions */
(function () {
  'use strict';

  // Reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Sticky header
  const header = document.querySelector('.header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Mobile menu
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.overlay');
  if (hamburger && mobileMenu && overlay) {
    const toggle = () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      overlay.classList.toggle('show');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    };
    hamburger.addEventListener('click', toggle);
    overlay.addEventListener('click', toggle);
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', toggle));
  }

  // Scroll reveal
  if (!prefersReduced) {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

  // Animated counters
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && !prefersReduced) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          const duration = 1800;
          const start = performance.now();
          const isDecimal = target % 1 !== 0;
          const animate = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const value = isDecimal
              ? (target * ease).toFixed(1)
              : Math.floor(target * ease);
            el.textContent = value + suffix;
            if (progress < 1) requestAnimationFrame(animate);
            else el.textContent = target + suffix;
          };
          requestAnimationFrame(animate);
          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => countObserver.observe(c));
  }

  // Language filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const langCards = document.querySelectorAll('.lang-card');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        langCards.forEach(card => {
          if (filter === 'all' || card.dataset.region === filter) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // Form validation & submit simulation
  const form = document.getElementById('quote-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach(field => {
        const group = field.closest('.form-group');
        if (!field.value.trim()) {
          group.classList.add('error');
          valid = false;
        } else {
          group.classList.remove('error');
        }
      });
      const email = form.querySelector('[type="email"]');
      if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.closest('.form-group').classList.add('error');
        valid = false;
      }
      if (!valid) return;

      form.classList.add('form-loading');
      // CONFIGURATION: Replace this with your real form endpoint
      // Example: fetch('https://formspree.io/f/YOUR_ID', { method: 'POST', body: new FormData(form) })
      setTimeout(() => {
        form.classList.remove('form-loading');
        form.querySelector('.form-fields').style.display = 'none';
        form.querySelector('.form-success').classList.add('show');
      }, 1200);
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
      }
    });
  });

  // Back to top
  const backBtn = document.querySelector('.back-to-top');
  if (backBtn) {
    window.addEventListener('scroll', () => {
      backBtn.classList.toggle('show', window.scrollY > 600);
    }, { passive: true });
    backBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  }

  // Active nav highlight (simple page-based)
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

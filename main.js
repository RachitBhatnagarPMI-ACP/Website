/* main.js — Cleaned, robust and tailored for Rachit Bhatnagar website
   - Image loader with fallback
   - Smooth nav, AOS init, counters, cursor
   - Notification system
*/

(() => {
  'use strict';

  let isLoaded = false;

  document.addEventListener('DOMContentLoaded', () => {
    initializeWebsite();
  });

  function initializeWebsite() {
    initializeProfileImage();
    initializeAOS();
    initializeNavigation();
    initializeScrollEffects();
    initializeFormHandling();
    initializeCursor();
    initializeLazyLoading();
    initializeAccessibility();
    initializeReducedMotion();
    isLoaded = true;
  }

  /* PROFILE IMAGE LOADER (tries provided image path and falls back) */
  function initializeProfileImage() {
    const profileImg = document.querySelector('.profile-image');
    const fallback = document.querySelector('.profile-fallback');
    if (!profileImg) return;

    const imagePaths = [
      'Rachit Bhatnagar 10x pic1.jpg',           // exact name as provided
      './Rachit Bhatnagar 10x pic1.jpg',
      '/Rachit Bhatnagar 10x pic1.jpg'
    ];

    let idx = 0;
    function tryLoad() {
      if (idx >= imagePaths.length) {
        profileImg.style.display = 'none';
        if (fallback) fallback.style.display = 'flex';
        return;
      }
      const test = new Image();
      test.onload = function () {
        profileImg.src = this.src;
        profileImg.classList.add('loaded');
        if (fallback) fallback.style.display = 'none';
      };
      test.onerror = function () {
        idx++;
        tryLoad();
      };
      test.src = imagePaths[idx];
    }
    // small delay for perceived performance
    setTimeout(tryLoad, 80);
  }

  /* AOS — animate on scroll init if available */
  function initializeAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 700,
        easing: 'ease-in-out',
        once: true,
        offset: 80
      });
    }
  }

  /* NAVIGATION (mobile toggle, smooth scroll, active highlight) */
  function initializeNavigation() {
    const menuBtn = document.querySelector('.menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuBtn && navLinksContainer) {
      menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('open');
        navLinksContainer.classList.toggle('active');
        const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
        menuBtn.setAttribute('aria-expanded', String(!expanded));
      });
    }

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const header = document.querySelector('header');
          const headerH = header ? header.offsetHeight + 12 : 20;
          const top = target.getBoundingClientRect().top + window.scrollY - headerH;
          window.scrollTo({ top, behavior: 'smooth' });

          // close mobile menu
          if (navLinksContainer && navLinksContainer.classList.contains('active')) {
            navLinksContainer.classList.remove('active');
            if (menuBtn) menuBtn.classList.remove('open');
          }
        }
      });
    });

    // Active link highlight on scroll
    const sections = document.querySelectorAll('section[id]');
    function updateActive() {
      const scrollY = window.scrollY;
      let currentId = '';
      sections.forEach(section => {
        const top = section.offsetTop - 160;
        if (scrollY >= top) currentId = section.id;
      });
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (currentId && link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
    updateActive();
    window.addEventListener('scroll', throttle(updateActive, 150), { passive: true });
  }

  /* scroll effects (header shadow etc.) */
  function initializeScrollEffects() {
    const header = document.querySelector('header');
    function onScroll() {
      const scrolled = window.scrollY;
      if (header) {
        if (scrolled > 40) header.style.boxShadow = '0 12px 30px rgba(2,6,23,0.06)';
        else header.style.boxShadow = 'var(--shadow-subtle)';
      }
    }
    window.addEventListener('scroll', throttle(onScroll, 80), { passive: true });
    onScroll();
  }

  /* Form handling (Netlify friendly) */
  function initializeFormHandling() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    form.addEventListener('submit', handleFormSubmission);
  }

  async function handleFormSubmission(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('.submit-btn');
    const formData = new FormData(form);

    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const message = formData.get('message')?.trim();
    if (!name || !email || !message) {
      showNotification('Please fill in all required fields.', 'error');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification('Please enter a valid email address.', 'error');
      return;
    }

    const original = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    try {
      // Netlify-friendly POST
      const body = new URLSearchParams();
      formData.forEach((v, k) => body.append(k, v));
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString()
      });
      if (res.ok || res.status === 200) {
        showNotification('Thanks — message received. I will get back to you soon.', 'success');
        form.reset();
      } else {
        showNotification('There was a problem sending the message. Try again later.', 'error');
      }
    } catch (err) {
      console.error(err);
      showNotification('Network error while sending message.', 'error');
    } finally {
      submitBtn.innerHTML = original;
      submitBtn.disabled = false;
    }
  }

  /* Notifications (re-usable) */
  function showNotification(message, type = 'info') {
    const root = document.getElementById('notification-root') || document.body;
    // remove old
    document.querySelectorAll('.notification').forEach(n => n.remove());

    const n = document.createElement('div');
    n.className = `notification ${type}`;
    n.setAttribute('role', 'status');
    n.innerHTML = `<div style="display:flex;align-items:center;gap:12px">
      <div style="font-size:18px">${type === 'success' ? '✔' : type === 'error' ? '⚠' : 'ℹ'}</div>
      <div style="flex:1">${escapeHtml(message)}</div>
      <button class="notification-close" aria-label="Close">✕</button>
    </div>`;
    root.appendChild(n);

    // animate in
    requestAnimationFrame(() => n.style.transform = 'translateX(0)');

    // close actions
    n.querySelector('.notification-close').addEventListener('click', () => n.remove());

    // auto remove
    setTimeout(() => {
      n.style.transform = 'translateX(400px)';
      setTimeout(() => n.remove(), 300);
    }, 5000);
  }

  // Escape helper
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  }

  /* Cursor */
  function initializeCursor() {
    const cursor = document.querySelector('.cursor');

    // hover interactions
    const hoverables = document.querySelectorAll('a,button,.skill-tag,.cert-card,.leadership-card');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover');
        follower.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
        follower.classList.remove('cursor-hover');
      });
    });
  }

  /* Lazy load images using IntersectionObserver */
  function initializeLazyLoading() {
    const imgs = document.querySelectorAll('img[loading="lazy"], img');
    if (!('IntersectionObserver' in window)) {
      imgs.forEach(i => i.classList.add('loaded'));
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('loaded');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '200px' });
    imgs.forEach(img => obs.observe(img));
  }

  /* Accessibility */
  function initializeAccessibility() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const nav = document.querySelector('.nav-links');
        const btn = document.querySelector('.menu-btn');
        if (nav && nav.classList.contains('active')) {
          nav.classList.remove('active');
          if (btn) btn.classList.remove('open');
        }
      }
    });

    // Manage focused styles
    const focusables = document.querySelectorAll('a,button,input,textarea,select,[tabindex]');
    focusables.forEach(el => {
      el.addEventListener('focus', () => el.classList.add('focused'));
      el.addEventListener('blur', () => el.classList.remove('focused'));
    });
  }

  /* Reduced motion */
  function initializeReducedMotion() {
    const preferReduced = window.matchMedia('(prefers-reduced-motion:reduce)');
    if (preferReduced.matches) {
      document.documentElement.style.setProperty('--transition', 'none');
      if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 0, once: true, disable: true });
      }
    }
  }

  /* throttle util */
  function throttle(fn, wait) {
    let last = 0;
    return function (...args) {
      const now = Date.now();
      if (now - last >= wait) {
        last = now;
        fn.apply(this, args);
      }
    };
  }

})();


/**
 * Script for Aura Landing Page
 * Vanilla JavaScript Implementation
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Fixed Navbar Scroll Interaction ---
  const header = document.querySelector('header');
  
  const handleNavbarScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  handleNavbarScroll();
  window.addEventListener('scroll', handleNavbarScroll);


  // --- 2. Hamburger Mobile Menu Toggle ---
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMenu = () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  };

  const closeMenu = () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  };

  hamburger.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (event) => {
    const isClickInside = hamburger.contains(event.target) || navMenu.contains(event.target);
    if (!isClickInside && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });


  // --- 3. Active Nav Link Highlighting on Scroll ---
  const sections = document.querySelectorAll('section[id]');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach(section => observer.observe(section));


  // --- 4. Smooth Scrolling ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const offset = header.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });


  // --- 5. Contact Form Submission ---
  const contactForm = document.querySelector('.contact-form');
  const alertContainer = document.querySelector('.success-alert');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name')?.value;
      const email = document.getElementById('form-email')?.value;
      const message = document.getElementById('form-message')?.value;

      const submitBtn = contactForm.querySelector('.btn-submit');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending message...';
      submitBtn.disabled = true;

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message })
        });

        const data = await res.json();
        contactForm.reset();

        if (alertContainer) {
          alertContainer.innerText = res.ok ? data.message : (data.error || 'Something went wrong. Please try again.');
          alertContainer.style.display = 'block';
          alertContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          setTimeout(() => { alertContainer.style.display = 'none'; }, 6000);
        }
      } catch {
        if (alertContainer) {
          alertContainer.innerText = 'Network error. Please try again.';
          alertContainer.style.display = 'block';
        }
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }
});

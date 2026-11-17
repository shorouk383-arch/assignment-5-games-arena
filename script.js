(() => {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const navLinks = [...document.querySelectorAll('.nav-link')];

  const setMenuOpen = (open) => {
    if (!menuToggle || !mainNav) return;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    mainNav.classList.toggle('open', open);
  };

  menuToggle?.addEventListener('click', () => {
    setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  const setActiveLink = (hash) => {
    navLinks.forEach((link) => {
      const active = link.getAttribute('href') === hash;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      setActiveLink(link.getAttribute('href'));
      setMenuOpen(false);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mainNav?.classList.contains('open')) {
      setMenuOpen(false);
      menuToggle?.focus();
    }
  });

  document.addEventListener('pointerdown', (event) => {
    if (!mainNav?.classList.contains('open')) return;
    if (mainNav.contains(event.target) || menuToggle?.contains(event.target)) return;
    setMenuOpen(false);
  });

  const revealItems = [...document.querySelectorAll('.reveal')];
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const supportsIntersectionObserver = typeof window.IntersectionObserver === 'function';
  if (supportsIntersectionObserver && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    revealItems.forEach((element) => revealObserver.observe(element));
  } else {
    revealItems.forEach((element) => element.classList.add('is-visible'));
  }

  const sections = [...document.querySelectorAll('main section[id], main section:not([id])')];
  if (supportsIntersectionObserver) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const targetHash = entry.target.id ? `#${entry.target.id}` : '#home';
        setActiveLink(targetHash);
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach((section) => sectionObserver.observe(section));
  }


  document.querySelectorAll('.team-card > img').forEach((image) => {
    const card = image.closest('.team-card');
    if (!card) return;
    image.addEventListener('error', () => {
      if (!image.dataset.retryAttempted) {
        image.dataset.retryAttempted = 'true';
        window.setTimeout(() => {
          const retryUrl = new URL(image.currentSrc || image.src, window.location.href);
          retryUrl.searchParams.set('retry', '1');
          image.src = retryUrl.href;
        }, 450);
        return;
      }
      card.classList.add('image-fallback');
    });
    image.addEventListener('load', () => card.classList.remove('image-fallback'));
  });

  const touchDevice = window.matchMedia?.('(hover: none)').matches ?? false;
  if (touchDevice) {
    document.querySelectorAll('.team-card').forEach((card) => {
      card.addEventListener('click', (event) => {
        if (event.target.closest('a')) return;
        const shouldOpen = !card.classList.contains('touch-active');
        document.querySelectorAll('.team-card.touch-active').forEach((item) => item.classList.remove('touch-active'));
        if (shouldOpen) card.classList.add('touch-active');
      });
    });
  }

  const contactForm = document.getElementById('contactForm');
  contactForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const name = String(data.get('firstName') || '').trim();
    const feedback = contactForm.querySelector('.form-feedback');
    if (!feedback) return;
    feedback.textContent = `Thanks${name ? `, ${name}` : ''}! This demo form is not connected to a server, so your message has not been sent.`;
  });
})();

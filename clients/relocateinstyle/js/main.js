(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ── Loader (home only) ── */
  const loader = $('#loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.add('loaded');
      }, 1400);
    });
  } else {
    document.body.classList.add('loaded');
  }

  /* ── Custom cursor ── */
  const dot = $('#cursor-dot');
  const ring = $('#cursor-ring');
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  if (dot && ring && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    $$('a, button, [data-tilt], .approach-card, .exp-card, .teaser-card, .service-card, .immersive-thumbs img, .hero-gallery-main, .hero-gallery-item, .scroll-card, .lifestyle-doc').forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
  }

  /* ── Scroll progress ── */
  const progress = $('#scroll-progress');
  if (progress) {
    window.addEventListener('scroll', () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (window.scrollY / h) * 100 + '%';
    }, { passive: true });
  }

  /* ── Nav ── */
  const nav = $('#nav');
  const navLinks = $('#nav-links');
  const navToggle = $('#nav-toggle');
  const currentPage = document.body.dataset.page;

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
  }

  $$('[data-page]').forEach((link) => {
    if (link.dataset.page === currentPage) {
      link.classList.add('active');
    }
    link.addEventListener('click', () => {
      navLinks?.classList.remove('open');
      navToggle?.classList.remove('active');
    });
  });

  /* ── Smooth scroll buttons ── */
  $$('[data-scroll]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const sel = btn.getAttribute('data-scroll') || btn.dataset.scroll;
      const target = sel ? $(sel) : null;
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ── Reveal on scroll ── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  $$('.reveal').forEach((el) => revealObserver.observe(el));

  /* ── Counter animation ── */
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const numEl = $('.stat-num', el);
      let current = 0;
      const step = () => {
        current += Math.ceil(target / 30);
        if (current >= target) {
          numEl.textContent = target + suffix;
          return;
        }
        numEl.textContent = current + suffix;
        requestAnimationFrame(step);
      };
      step();
      statObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  $$('.stat').forEach((s) => statObserver.observe(s));

  /* ── Scroll effects (rAF loop) ── */
  const hero = $('#hero');
  const heroImg = $('#hero-parallax');
  const scrollCards = $$('[data-scroll-card]');
  let heroMouseX = 0, heroMouseY = 0;

  if (heroImg) {
    document.addEventListener('mousemove', (e) => {
      heroMouseX = (e.clientX / window.innerWidth - 0.5) * 28;
      heroMouseY = (e.clientY / window.innerHeight - 0.5) * 28;
    }, { passive: true });
  }

  function updateScrollEffects() {
    const vh = window.innerHeight;

    if (hero && heroImg) {
      const rect = hero.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height * 0.9, 1)));
      const scale = 1.04 + progress * 0.12;
      const y = progress * 140 + heroMouseY * 0.6;
      const x = heroMouseX * 0.6;
      heroImg.style.transform = `scale(${scale}) translate(${x}px, ${y}px)`;
    }

    scrollCards.forEach((card) => {
      const img = $('.teaser-card-img', card);
      if (!img) return;

      const rect = card.getBoundingClientRect();
      const center = rect.top + rect.height * 0.5;
      const dist = (center - vh * 0.5) / vh;
      const progress = Math.max(0, 1 - Math.abs(dist) * 1.2);

      const scale = 1.12 + progress * 0.16;
      const y = dist * -36;
      img.style.transform = `scale(${scale}) translateY(${y}px)`;
    });
  }

  function onScrollFrame() {
    updateScrollEffects();
    requestAnimationFrame(onScrollFrame);
  }

  if (heroImg || scrollCards.length) {
    requestAnimationFrame(onScrollFrame);
    window.addEventListener('scroll', updateScrollEffects, { passive: true });
    window.addEventListener('resize', updateScrollEffects, { passive: true });
    updateScrollEffects();
  }

  /* ── Card tilt ── */
  $$('[data-tilt]').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── Horizontal drag scroll ── */
  const hScroll = $('#h-scroll');
  const hTrack = $('#h-scroll-track');
  if (hScroll && hTrack) {
    let isDown = false, startX, scrollLeft;

    hScroll.addEventListener('mousedown', (e) => {
      isDown = true;
      hScroll.classList.add('dragging');
      startX = e.pageX - hScroll.offsetLeft;
      scrollLeft = hScroll.scrollLeft;
    });

    hScroll.addEventListener('mouseleave', () => { isDown = false; hScroll.classList.remove('dragging'); });
    hScroll.addEventListener('mouseup', () => { isDown = false; hScroll.classList.remove('dragging'); });

    hScroll.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - hScroll.offsetLeft;
      hScroll.scrollLeft = scrollLeft - (x - startX) * 1.5;
    });

    let touchStartX = 0, touchScrollLeft = 0;
    hScroll.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].pageX;
      touchScrollLeft = hScroll.scrollLeft;
    }, { passive: true });

    hScroll.addEventListener('touchmove', (e) => {
      const x = e.touches[0].pageX;
      hScroll.scrollLeft = touchScrollLeft - (x - touchStartX);
    }, { passive: true });
  }

  /* ── Journey timeline ── */
  const journeySteps = $$('.j-step');
  const journeyFill = $('#journey-fill');

  if (journeySteps.length) {
    const journeyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('active', entry.isIntersecting);
      });
      const active = journeySteps.filter((s) => s.classList.contains('active')).length;
      if (journeyFill) {
        journeyFill.style.height = (active / journeySteps.length) * 100 + '%';
      }
    }, { threshold: 0.6 });

    journeySteps.forEach((step) => journeyObserver.observe(step));
  }

  /* ── Approach flip cards ── */
  $$('[data-approach]').forEach((card) => {
    const toggle = () => {
      $$('[data-approach]').forEach((c) => {
        if (c !== card) c.classList.remove('flipped');
      });
      card.classList.toggle('flipped');
    };
    card.addEventListener('click', toggle);
    $('.approach-more', card)?.addEventListener('click', (e) => {
      e.stopPropagation();
      toggle();
    });
  });

  /* ── Ticino parallax + thumb swap ── */
  const ticinoBg = $('#ticino-parallax');
  const thumbs = $$('.immersive-thumbs img');

  if (ticinoBg) {
    window.addEventListener('scroll', () => {
      const section = $('#ticino');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (rect.top / window.innerHeight) * 60;
        ticinoBg.style.transform = `translateY(${offset}px) scale(1.05)`;
      }
    }, { passive: true });

    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const src = thumb.getAttribute('src');
        ticinoBg.style.opacity = '0';
        setTimeout(() => {
          ticinoBg.src = src;
          ticinoBg.style.opacity = '1';
        }, 300);
      });
    });
    ticinoBg.style.transition = 'opacity 0.4s ease, transform 0.15s linear';
  }

  /* ── Contact form ── */
  const form = $('#contact-form');
  const formSuccess = $('#form-success');

  if (new URLSearchParams(window.location.search).get('sent') === '1' && formSuccess) {
    formSuccess.hidden = false;
    if (form) form.hidden = true;
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* ── Video lightbox (Lifestyle / Marbella) ── */
  const videoModals = $$('.video-modal');
  if (videoModals.length) {
    const openVideoModal = (modal) => {
      if (!modal) return;
      modal.hidden = false;
      document.body.classList.add('video-modal-open');
      const video = $('video', modal);
      if (video) {
        video.load();
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {});
        }
      }
      $('.video-modal-close', modal)?.focus();
    };

    const closeVideoModal = (modal) => {
      if (!modal || modal.hidden) return;
      modal.hidden = true;
      document.body.classList.remove('video-modal-open');
      const video = $('video', modal);
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    };

    $$('[data-video-open]').forEach((btn) => {
      btn.addEventListener('click', () => {
        openVideoModal($('#' + btn.getAttribute('data-video-open')));
      });
    });

    videoModals.forEach((modal) => {
      modal.querySelectorAll('[data-video-close]').forEach((el) => {
        el.addEventListener('click', () => closeVideoModal(modal));
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      videoModals.forEach((modal) => closeVideoModal(modal));
    });
  }

  /* ── Image gallery lightbox (Swiss villages) ── */
  const galleryModals = $$('.gallery-modal');
  if (galleryModals.length) {
    galleryModals.forEach((modal) => {
      let index = 0;
      let images = [];
      try {
        images = JSON.parse(modal.getAttribute('data-gallery-images') || '[]');
      } catch (err) {
        images = [];
      }

      const imgEl = $('[data-gallery-image]', modal);
      const countEl = $('[data-gallery-count]', modal);

      const render = () => {
        if (!images.length || !imgEl) return;
        const item = images[index];
        imgEl.src = item.src;
        imgEl.alt = item.alt || '';
        if (countEl) countEl.textContent = `${index + 1} / ${images.length}`;
      };

      const open = (start = 0) => {
        if (!images.length) return;
        index = Math.max(0, Math.min(start, images.length - 1));
        modal.hidden = false;
        document.body.classList.add('gallery-modal-open');
        render();
        $('.gallery-modal-close', modal)?.focus();
      };

      const close = () => {
        if (modal.hidden) return;
        modal.hidden = true;
        document.body.classList.remove('gallery-modal-open');
      };

      const next = () => {
        if (!images.length) return;
        index = (index + 1) % images.length;
        render();
      };

      const prev = () => {
        if (!images.length) return;
        index = (index - 1 + images.length) % images.length;
        render();
      };

      modal._galleryApi = { open, close, next, prev };

      modal.querySelectorAll('[data-gallery-close]').forEach((el) => {
        el.addEventListener('click', close);
      });
      $('[data-gallery-next]', modal)?.addEventListener('click', next);
      $('[data-gallery-prev]', modal)?.addEventListener('click', prev);
    });

    $$('[data-gallery-open]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const modal = $('#' + btn.getAttribute('data-gallery-open'));
        modal?._galleryApi?.open(0);
      });
    });

    document.addEventListener('keydown', (e) => {
      const openModal = galleryModals.find((m) => !m.hidden);
      if (!openModal || !openModal._galleryApi) return;
      if (e.key === 'Escape') openModal._galleryApi.close();
      if (e.key === 'ArrowRight') openModal._galleryApi.next();
      if (e.key === 'ArrowLeft') openModal._galleryApi.prev();
    });
  }

})();
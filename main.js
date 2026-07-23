/* ==========================================================================
   Hatch Palette — Premium Logic and Interaction Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Organic Wave Canvas Animation (Wind Over Sand Concept)
  const canvas = document.getElementById('bg-wave-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Handle high DPI displays for crisp wave rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Resize Handler
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    });

    // Waves Setup
    // Extremely low frequency and speed to simulate sand dunes shifting
    const waves = [
      {
        y: height * 0.70,
        length: 0.0006,
        amplitude: 45,
        speed: 0.0018,
        phase: 0,
        color: 'rgba(245, 241, 234, 0.40)' // Soft Ivory
      },
      {
        y: height * 0.78,
        length: 0.0004,
        amplitude: 55,
        speed: -0.0012,
        phase: Math.PI * 0.5,
        color: 'rgba(245, 241, 234, 0.65)' // Soft Ivory slightly darker overlap
      },
      {
        y: height * 0.85,
        length: 0.0003,
        amplitude: 70,
        speed: 0.0008,
        phase: Math.PI,
        color: 'rgba(220, 201, 174, 0.09)' // Sand tint
      }
    ];

    function animateWaves() {
      // Clear canvas and paint base Off White
      ctx.fillStyle = '#F8F5F0';
      ctx.fillRect(0, 0, width, height);

      waves.forEach(wave => {
        ctx.beginPath();
        ctx.moveTo(0, height);

        for (let x = 0; x < width; x++) {
          // Combination of sine and cosine waves to create a more natural organic outline
          const y = wave.y +
            Math.sin(x * wave.length + wave.phase) * wave.amplitude +
            Math.cos(x * wave.length * 0.4 + wave.phase * 0.65) * (wave.amplitude * 0.35);
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = wave.color;
        ctx.fill();

        // Increment phase very slowly
        wave.phase += wave.speed;
      });

      requestAnimationFrame(animateWaves);
    }

    // Start canvas animation
    animateWaves();
  }

  // 2. Scroll Reveal Animations (using IntersectionObserver)
  const revealElements = document.querySelectorAll('.reveal-element');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve to trigger entrance animation once only (printed brochure style)
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.08
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // 3. ScrollSpy Side Navigation Highlight
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length > 0 && navLinks.length > 0) {
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      root: null,
      rootMargin: '-35% 0px -45% 0px', // Focus region in the center vertical of the viewport
      threshold: 0
    });

    sections.forEach(sec => spyObserver.observe(sec));
  }

  // 4. Parallax Scroll Effect for Editorial Images
  const parallaxContainers = document.querySelectorAll('.parallax-image');

  function handleParallax() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const viewportHeight = window.innerHeight;

    parallaxContainers.forEach(container => {
      const rect = container.getBoundingClientRect();
      const containerHeight = rect.height;

      // Only perform transforms if element is visible on screen
      if (rect.top < viewportHeight && rect.bottom > 0) {
        const speed = parseFloat(container.getAttribute('data-speed')) || 0.05;
        // Center position of container relative to viewport center
        const centerPos = (rect.top + containerHeight / 2) - (viewportHeight / 2);

        const img = container.querySelector('img');
        if (img) {
          // Adjust translation factor
          const translateY = centerPos * speed;
          // Maintain a 1.05 scale to ensure image borders are hidden inside the overflow-hidden container
          img.style.transform = `translateY(${translateY}px) scale(1.05)`;
        }
      }
    });
  }

  // Throttled scroll listener using requestAnimationFrame for optimal FPS
  let isScrolling = false;
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        handleParallax();
        isScrolling = false;
      });
      isScrolling = true;
    }
  });

  // Run initial calculations
  handleParallax();

  // 5. Smooth Scroll navigation with keyboard accessibility support
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();

        // Scroll to the targeted section
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // Accessibility: managing keyboard focus
        if (!targetElement.hasAttribute('tabindex')) {
          targetElement.setAttribute('tabindex', '-1');
        }
        targetElement.focus({ preventScroll: true });

        // Clean up focus styling on blur
        targetElement.addEventListener('blur', function removeFocusState() {
          targetElement.removeAttribute('tabindex');
          targetElement.removeEventListener('blur', removeFocusState);
        });
      }
    });
  });
  // Side Navigation: reveal on cursor near right edge
  const sideNav = document.querySelector('.side-navigation');
  if (sideNav) {
    const EDGE_THRESHOLD = 100; // pixels from right edge
    document.addEventListener('mousemove', (e) => {
      const distFromRight = window.innerWidth - e.clientX;
      if (distFromRight <= EDGE_THRESHOLD) {
        sideNav.classList.add('is-visible');
      } else if (!sideNav.matches(':hover')) {
        sideNav.classList.remove('is-visible');
      }
    });

    // Also hide when mouse leaves the nav after moving away from the edge
    sideNav.addEventListener('mouseleave', () => {
      sideNav.classList.remove('is-visible');
    });
  }
});

/* ==========================================================================
   Hatch Palette — Premium Full-Screen Launch System Controller
   ========================================================================== */
(function initHatchLaunchSystem() {
  // Target Launch Time: 23 July 2026 at 6:30:00 PM IST (Asia/Kolkata timezone offset +05:30)
  const LAUNCH_TARGET_ISO = '2026-07-23T18:30:00+05:30';
  const targetTimestamp = new Date(LAUNCH_TARGET_ISO).getTime();

  // Transition Timing Configuration (in milliseconds)
  const FADE_OUT_COUNTDOWN_MS = 800; // Fade out countdown over 800ms
  const LAUNCHING_ANIM_MS = 1500;     // Show premium "Launching..." animation for 1.5s
  const FADE_IN_WEBSITE_MS = 800;    // Fade in hidden website smoothly

  let countdownInterval = null;
  let particleAnimFrame = null;
  let isSequenceRunning = false;

  function getElements() {
    return {
      launchScreen: document.getElementById('launch-screen'),
      websiteContent: document.getElementById('website-content'),
      countdownView: document.getElementById('launch-countdown-view'),
      revealingView: document.getElementById('launch-revealing-view'),
      daysEl: document.getElementById('cd-days'),
      hoursEl: document.getElementById('cd-hours'),
      minutesEl: document.getElementById('cd-minutes'),
      secondsEl: document.getElementById('cd-seconds'),
      particleCanvas: document.getElementById('launch-particle-canvas')
    };
  }

  function bypassCountdown() {
    const els = getElements();
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';

    if (els.launchScreen) {
      els.launchScreen.classList.add('is-hidden');
      els.launchScreen.style.display = 'none';
    }
    if (els.websiteContent) {
      els.websiteContent.classList.remove('is-hidden');
      els.websiteContent.classList.add('is-revealed');
    }
  }

  function updateCountdown() {
    const els = getElements();
    if (!els.daysEl) return;

    const now = Date.now();
    const diff = targetTimestamp - now;

    if (diff <= 0) {
      if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
      }
      if (!isSequenceRunning) {
        triggerLaunchSequence();
      }
      return;
    }

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    els.daysEl.textContent = String(days).padStart(2, '0');
    els.hoursEl.textContent = String(hours).padStart(2, '0');
    els.minutesEl.textContent = String(minutes).padStart(2, '0');
    els.secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  function triggerLaunchSequence() {
    if (isSequenceRunning) return;
    isSequenceRunning = true;

    const els = getElements();
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }

    if (els.countdownView) {
      els.countdownView.classList.add('fade-out');
    }

    setTimeout(() => {
      if (els.countdownView) {
        els.countdownView.style.display = 'none';
      }
      if (els.revealingView) {
        els.revealingView.style.display = 'flex';
        void els.revealingView.offsetWidth; // Force layout recalculation
        els.revealingView.classList.add('active');
      }

      setTimeout(() => {
        if (els.websiteContent) {
          els.websiteContent.classList.remove('is-hidden');
          els.websiteContent.classList.add('is-revealed');
        }
        if (els.launchScreen) {
          els.launchScreen.style.opacity = '0';
        }

        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';

        setTimeout(() => {
          if (els.launchScreen) {
            els.launchScreen.classList.add('is-hidden');
            els.launchScreen.style.display = 'none';
          }
          if (particleAnimFrame) {
            cancelAnimationFrame(particleAnimFrame);
            particleAnimFrame = null;
          }

          window.dispatchEvent(new Event('resize'));
          window.dispatchEvent(new Event('scroll'));
        }, FADE_IN_WEBSITE_MS);

      }, LAUNCHING_ANIM_MS);

    }, FADE_OUT_COUNTDOWN_MS);
  }

  function initParticleCanvas() {
    const canvas = document.getElementById('launch-particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      if (canvas.offsetParent === null) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = Math.min(Math.floor(window.innerWidth / 16), 60);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.8,
        alpha: Math.random() * 0.5 + 0.2,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35 - 0.15,
        phase: Math.random() * Math.PI * 2
      });
    }

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        p.phase += 0.02;
        const currentAlpha = p.alpha + Math.sin(p.phase) * 0.15;
        const boundedAlpha = Math.max(0.1, Math.min(0.85, currentAlpha));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(184, 154, 114, ${boundedAlpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(184, 154, 114, 0.25)';
        ctx.fill();
      });

      particleAnimFrame = requestAnimationFrame(renderParticles);
    }

    renderParticles();
  }

  function startLaunchSystem() {
    const els = getElements();
    const now = Date.now();

    if (now >= targetTimestamp) {
      bypassCountdown();
    } else {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      if (els.websiteContent) {
        els.websiteContent.classList.add('is-hidden');
      }
      initParticleCanvas();
      updateCountdown();
      if (countdownInterval) clearInterval(countdownInterval);
      countdownInterval = setInterval(updateCountdown, 1000);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startLaunchSystem);
  } else {
    startLaunchSystem();
  }

  // Developer / Testing API available on window
  window.HATCH_LAUNCH_SYSTEM = {
    triggerLaunch: triggerLaunchSequence,
    bypassLaunch: bypassCountdown,
    getTargetTime: () => new Date(LAUNCH_TARGET_ISO).toString()
  };
})();

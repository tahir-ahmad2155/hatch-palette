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

  // 6. Full-Screen Coming Soon Launch Lock Overlay Logic
  const TARGET_ISO_STRING = "2026-07-23T11:11:00+05:30";
  const TARGET_TIMESTAMP = new Date(TARGET_ISO_STRING).getTime();
  const csWrapper = document.getElementById('cs-launch-wrapper');

  if (csWrapper) {
    const urlParams = new URLSearchParams(window.location.search);
    const isPreview = urlParams.has('preview');
    const now = Date.now();

    if (now < TARGET_TIMESTAMP && !isPreview) {
      document.body.classList.add('coming-soon-body');
      csWrapper.style.display = 'flex';

      const daysEl = document.getElementById('cs-days');
      const hoursEl = document.getElementById('cs-hours');
      const minutesEl = document.getElementById('cs-minutes');
      const secondsEl = document.getElementById('cs-seconds');
      const transitionOverlay = document.getElementById('cs-transition-overlay');
      let isTransitioning = false;

      function padZero(num) {
        return num < 10 ? '0' + num : '' + num;
      }

      function updateCardValue(element, newValue) {
        if (element && element.textContent !== newValue) {
          element.classList.add('cs-pop');
          element.textContent = newValue;
          setTimeout(() => element.classList.remove('cs-pop'), 250);
        }
      }

      function unlockMainSite() {
        if (isTransitioning) return;
        isTransitioning = true;

        if (transitionOverlay) {
          transitionOverlay.classList.add('active');
        }

        setTimeout(() => {
          document.body.classList.remove('coming-soon-body');
          document.documentElement.classList.remove('is-locked');
          csWrapper.style.display = 'none';

          if (transitionOverlay) {
            transitionOverlay.classList.remove('active');
          }
        }, 3200);
      }

      function updateIndexCountdown() {
        const currentNow = Date.now();
        const diff = TARGET_TIMESTAMP - currentNow;

        if (diff <= 0) {
          updateCardValue(daysEl, '00');
          updateCardValue(hoursEl, '00');
          updateCardValue(minutesEl, '00');
          updateCardValue(secondsEl, '00');
          unlockMainSite();
          return;
        }

        const totalSeconds = Math.floor(diff / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);

        updateCardValue(daysEl, padZero(days));
        updateCardValue(hoursEl, padZero(hours));
        updateCardValue(minutesEl, padZero(minutes));
        updateCardValue(secondsEl, padZero(seconds));
      }

      updateIndexCountdown();
      setInterval(updateIndexCountdown, 1000);

      // Particle Engine for Index Overlay
      const canvas = document.getElementById('cs-particle-canvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
          width = canvas.width = window.innerWidth;
          height = canvas.height = window.innerHeight;
        });

        const particleCount = Math.min(Math.floor(width * 0.05), 65);
        const particles = [];

        for (let i = 0; i < particleCount; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.8 + 0.5,
            color: Math.random() > 0.4 ? 'rgba(218, 197, 164, ' : 'rgba(255, 255, 255, ',
            alpha: Math.random() * 0.4 + 0.1,
            vx: (Math.random() - 0.5) * 0.25,
            vy: -Math.random() * 0.3 - 0.1,
            pulse: Math.random() * 0.02
          });
        }

        function animateParticles() {
          if (csWrapper.style.display === 'none') return;
          ctx.clearRect(0, 0, width, height);

          for (let p of particles) {
            p.x += p.vx;
            p.y += p.vy;

            if (p.y < 0) {
              p.y = height + 10;
              p.x = Math.random() * width;
            }
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;

            p.alpha += Math.sin(Date.now() * 0.001) * p.pulse * 0.01;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color + Math.max(0.05, Math.min(0.5, p.alpha)) + ')';
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(218, 197, 164, 0.4)';
            ctx.fill();
          }

          requestAnimationFrame(animateParticles);
        }

        requestAnimationFrame(animateParticles);
      }
    } else {
      document.documentElement.classList.remove('is-locked');
      csWrapper.style.display = 'none';
    }
  }
});

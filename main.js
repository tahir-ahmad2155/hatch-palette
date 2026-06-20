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
});

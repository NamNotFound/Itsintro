/* ============================================================
   CLB TIN HỌC — script.js
   Features: Loader, Particle Canvas, Navbar, Scroll Reveal,
             Active Nav highlight, Mobile Menu
   ============================================================ */

/* ── LOADER ── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  // Hide loader after CSS animation finishes (~1.4s)
  setTimeout(() => {
    loader.classList.add('hidden');
    // Trigger first-visible reveals
    checkReveals();
  }, 1500);
});


/* ── PARTICLE CANVAS ── */
(function initParticles() {
  const canvas  = document.getElementById('particleCanvas');
  const ctx     = canvas.getContext('2d');
  let W, H, particles = [];

  const CONFIG = {
    count:         70,
    minRadius:     1,
    maxRadius:     2.5,
    speed:         0.25,
    lineDistance:  130,
    accentColor:   '0, 229, 255',   // --accent RGB
    dimColor:      '80, 120, 160',
  };

  // Resize canvas to fill section
  function resize() {
    const section = document.getElementById('hero');
    W = canvas.width  = section.offsetWidth;
    H = canvas.height = section.offsetHeight;
  }

  // Create particles
  function createParticles() {
    particles = [];
    for (let i = 0; i < CONFIG.count; i++) {
      particles.push({
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * CONFIG.speed,
        vy: (Math.random() - 0.5) * CONFIG.speed,
        r:  CONFIG.minRadius + Math.random() * (CONFIG.maxRadius - CONFIG.minRadius),
        alpha: 0.2 + Math.random() * 0.5,
      });
    }
  }

  // Draw frame
  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.lineDistance) {
          const alpha = (1 - dist / CONFIG.lineDistance) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${CONFIG.accentColor}, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${CONFIG.accentColor}, ${p.alpha})`;
      ctx.fill();

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off walls
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    requestAnimationFrame(draw);
  }

  // Init
  resize();
  createParticles();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
})();


/* ── NAVBAR: scroll styling + active section highlight ── */
const navbar  = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link[data-section]');
const sections = document.querySelectorAll('section[id]');

function updateNavbar() {
  // Scrolled style
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active link based on current section in view
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.dataset.section === current) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar(); // Run on load


/* ── MOBILE MENU TOGGLE ── */
const navToggle  = document.getElementById('navToggle');
const navLinksEl = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinksEl.classList.toggle('open');
});

// Close mobile menu when a link is clicked
navLinksEl.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinksEl.classList.remove('open');
  });
});


/* ── DEPARTMENTS MARQUEE: clone one set for seamless loop ── */
(function initDepartmentsMarquee() {
  const track = document.getElementById('deptTrack');
  const set = document.getElementById('deptSet');
  if (!track || !set || track.dataset.ready === 'true') return;

  const clone = set.cloneNode(true);
  clone.removeAttribute('id');
  clone.setAttribute('aria-hidden', 'true');
  clone.querySelectorAll('.reveal').forEach(el => el.classList.remove('reveal'));
  track.appendChild(clone);
  track.dataset.ready = 'true';
})();

/* ── ACHIEVEMENTS MARQUEE: clone one set for seamless loop ── */
(function initAchievementsMarquee() {
  const track = document.getElementById('achTrack');
  const set = document.getElementById('achSet');
  if (!track || !set || track.dataset.ready === 'true') return;

  const clone = set.cloneNode(true);
  clone.removeAttribute('id');
  clone.setAttribute('aria-hidden', 'true');
  clone.querySelectorAll('.reveal').forEach(el => el.classList.remove('reveal'));
  track.appendChild(clone);
  track.dataset.ready = 'true';
})();


/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll('.reveal');

function checkReveals() {
  const trigger = window.innerHeight * 0.88;
  revealEls.forEach((el, i) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < trigger) {
      // Stagger siblings by index within parent
      const siblings = Array.from(el.parentElement.querySelectorAll('.reveal'));
      const sibIdx   = siblings.indexOf(el);
      el.style.transitionDelay = sibIdx * 0.08 + 's';
      el.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', checkReveals, { passive: true });
// Also check on resize
window.addEventListener('resize', checkReveals);


/* ── SMOOTH SCROLL for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h')) || 68;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* ── CURSOR GLOW (subtle) ── */
(function initCursorGlow() {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 9998;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,229,255,0.04) 0%, transparent 65%);
    transform: translate(-50%, -50%);
    transition: opacity 0.4s ease;
    top: 0; left: 0;
  `;
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0;
  let curX = 0, curY = 0;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateGlow() {
    curX += (mouseX - curX) * 0.08;
    curY += (mouseY - curY) * 0.08;
    glow.style.left = curX + 'px';
    glow.style.top  = curY + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  // Hide on mobile
  if ('ontouchstart' in window) glow.style.display = 'none';
})();

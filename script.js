
//CUSTOM CURSOR 
const dot  = document.createElement('div');
const ring = document.createElement('div');
dot.className  = 'cursor-dot';
ring.className = 'cursor-ring';
document.body.appendChild(dot);
document.body.appendChild(ring);

let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left  = mx + 'px';
  dot.style.top   = my + 'px';
  // cursor glow follows
  const glow = document.getElementById('cursorGlow');
  if (glow) { glow.style.left = mx + 'px'; glow.style.top = my + 'px'; }
});

(function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animateRing);
})();

document.querySelectorAll('a, button, .tbadge, .tl-card, .contact-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    dot.style.width  = '14px'; dot.style.height = '14px';
    dot.style.background = 'transparent';
    dot.style.border = '2px solid var(--cyan)';
    ring.style.width  = '48px'; ring.style.height = '48px';
    ring.style.borderColor = 'var(--cyan)';
  });
  el.addEventListener('mouseleave', () => {
    dot.style.width  = '8px'; dot.style.height = '8px';
    dot.style.background = 'var(--cyan)';
    dot.style.border = 'none';
    ring.style.width  = '32px'; ring.style.height = '32px';
    ring.style.borderColor = 'rgba(0,212,255,.5)';
  });
});


//CANVAS PARTICLE NETWORK
const canvas = document.getElementById('heroCanvas');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];

function resizeCanvas() {
  W = canvas.width  = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const NUM = 80;
for (let i = 0; i < NUM; i++) {
  particles.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - .5) * .4,
    vy: (Math.random() - .5) * .4,
    r: Math.random() * 1.5 + .5,
    alpha: Math.random() * .5 + .2
  });
}

function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  // lines
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 130) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,212,255,${.08 * (1 - dist/130)})`;
        ctx.lineWidth = .5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  // dots
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,212,255,${p.alpha})`;
    ctx.fill();
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();


//TYPEWRITER TAG 
const phrases = [
  'Software Engineering',
  'Web Developer',
  'Flutter Enthusiast',
  'Problem Solver',
  'Open to Opportunities'
];
let pi = 0, ci = 0, deleting = false;
const tagEl = document.getElementById('typedTag');

function typewriter() {
  if (!tagEl) return;
  const phrase = phrases[pi];
  if (!deleting) {
    tagEl.textContent = phrase.slice(0, ++ci);
    if (ci === phrase.length) { deleting = true; setTimeout(typewriter, 2000); return; }
    setTimeout(typewriter, 65);
  } else {
    tagEl.textContent = phrase.slice(0, --ci);
    if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(typewriter, 400); return; }
    setTimeout(typewriter, 35);
  }
}
typewriter();


//NAV: scroll state & hamburger 
const nav       = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav__links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  const open  = navLinks.classList.contains('open');
  spans[0].style.transform = open ? 'rotate(45deg) translate(5px, 5px)' : '';
  spans[1].style.opacity   = open ? '0' : '';
  spans[2].style.transform = open ? 'rotate(-45deg) translate(5px, -5px)' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});


//INTERSECTION OBSERVER: reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


//SKILL BARS 
const skillBars = document.querySelectorAll('.skill-bar');
const sbObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const fill  = e.target.querySelector('.sb-fill');
      const level = e.target.dataset.level;
      const idx   = [...skillBars].indexOf(e.target);
      setTimeout(() => { fill.style.width = level + '%'; }, idx * 70);
      sbObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
skillBars.forEach(b => sbObserver.observe(b));


//ACTIVE NAV LINKS
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav__links a[href^="#"]');

new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--cyan)' : '';
      });
    }
  });
}, { threshold: 0.4 }).observe && sections.forEach(s =>
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navAnchors.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${e.target.id}` ? 'var(--cyan)' : '';
        });
      }
    });
  }, { threshold: 0.4 }).observe(s)
);


//FLOATING BUTTONS: delayed entrance
const floatBtns = document.querySelector('.float-btns');
setTimeout(() => floatBtns.classList.add('visible'), 1800);


//HERO REVEALS ON LOAD 
window.addEventListener('load', () => {
  document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('visible'));
});

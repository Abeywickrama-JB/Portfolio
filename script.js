// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
});

function animateFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    if (follower) {
        follower.style.left = fx + 'px';
        follower.style.top = fy + 'px';
    }
    requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .project-card, .about-card, .tech-tag').forEach(el => {
    el.addEventListener('mouseenter', () => {
        if(cursor) { cursor.style.width = '20px'; cursor.style.height = '20px'; }
        if(follower) { follower.style.width = '55px'; follower.style.height = '55px'; }
    });
    el.addEventListener('mouseleave', () => {
        if(cursor) { cursor.style.width = '10px'; cursor.style.height = '10px'; }
        if(follower) { follower.style.width = '36px'; follower.style.height = '36px'; }
    });
});

// ===== PARTICLES CANVAS =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const count = Math.min(80, Math.floor(window.innerWidth / 18));

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.4 + 0.05;
        this.color = Math.random() > 0.5 ? '99,102,241' : '16,185,129';
    }
    update() {
        this.x += this.speedX; this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
        ctx.fill();
    }
}

for (let i = 0; i < count; i++) particles.push(new Particle());

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
            const d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d < 120) {
                ctx.beginPath();
                ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = `rgba(99,102,241,${0.06 * (1 - d/120)})`;
                ctx.lineWidth = 0.5; ctx.stroke();
            }
        });
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ===== HEADER SCROLL =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

// ===== TYPED EFFECT =====
const words = ['AI Solutions.', 'ML Models.', 'Web Platforms.', 'Mobile Apps.', 'Smart Systems.'];
const typedEl = document.getElementById('typed');
let wordIdx = 0, charIdx = 0, deleting = false;

function typeEffect() {
    const word = words[wordIdx];
    if (!deleting) {
        typedEl.textContent = word.slice(0, ++charIdx);
        if (charIdx === word.length) { deleting = true; setTimeout(typeEffect, 1800); return; }
    } else {
        typedEl.textContent = word.slice(0, --charIdx);
        if (charIdx === 0) { deleting = false; wordIdx = (wordIdx + 1) % words.length; }
    }
    setTimeout(typeEffect, deleting ? 60 : 95);
}
typeEffect();

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 80);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

// ===== SKILL BARS =====
// Restructure bars to add track wrapper
document.querySelectorAll('.skill-bar').forEach(bar => {
    const pct = bar.dataset.pct;
    const fill = bar.querySelector('.bar-fill');
    const label = bar.querySelector('.bar-label');
    const pctSpan = bar.querySelector('.bar-pct');
    bar.innerHTML = '';
    const top = document.createElement('div');
    top.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:0.45rem;';
    top.appendChild(label); top.appendChild(pctSpan);
    const track = document.createElement('div');
    track.className = 'bar-track';
    track.appendChild(fill);
    bar.appendChild(top); bar.appendChild(track);

    const skillObs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            fill.style.width = pct + '%';
            skillObs.unobserve(bar);
        }
    }, { threshold: 0.5 });
    skillObs.observe(bar);
});

// ===== PROJECT FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        cards.forEach(card => {
            const cats = card.dataset.category || '';
            if (f === 'all' || cats.includes(f)) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// ===== CONTACT FORM =====
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    setTimeout(() => {
        form.reset();
        btn.textContent = 'Message Sent!';
        formSuccess.classList.add('show');
        setTimeout(() => {
            btn.textContent = 'Send Message';
            btn.disabled = false;
            formSuccess.classList.remove('show');
        }, 4000);
    }, 1200);
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(sec => {
        if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
            document.querySelectorAll('.nav-link').forEach(a => {
                a.style.color = '';
                if (a.getAttribute('href') === '#' + sec.id) a.style.color = '#6366f1';
            });
        }
    });
});

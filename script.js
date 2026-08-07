/* ============================================================
   MATRIX PORTFOLIO — COMPLETE JAVASCRIPT ENGINE
   Sumit Kumar — Data Analyst Portfolio
   ============================================================ */

(function () {
  'use strict';

  // Force scroll to top on page reload so intro always starts correctly
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  // ── 1. MATRIX RAIN ──────────────────────────────────────────
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;  // If canvas is missing, exit

  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  document.body.classList.add('no-scroll');

  const fontSize = 14;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = [];
  for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -100;
  }

  const chars = '01';
  let matrixRunning = true;

  function drawMatrix() {
    if (!matrixRunning) return;
    ctx.fillStyle = 'rgba(10, 10, 10, 0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + 'px Share Tech Mono';

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      // Mix of green and red
      ctx.fillStyle = Math.random() > 0.92 ? '#ff0040' : '#00ff41';
      ctx.fillText(char, x, y);

      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
    requestAnimationFrame(drawMatrix);
  }
  requestAnimationFrame(drawMatrix);

  // Fade out matrix after 4 seconds
  setTimeout(function () {
    canvas.classList.add('matrix-fade');
  }, 4000);

  // Remove canvas after 5 seconds and start terminal
  setTimeout(function () {
    matrixRunning = false;
    if (canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);  // Safe removal
    }
    document.body.classList.remove('no-scroll');
    const terminal = document.getElementById('terminal-section');
    if (terminal) {
      startTypewriter();
    }
  }, 5000);

  // ── 2. TYPEWRITER ───────────────────────────────────────────
  function startTypewriter() {
    const output = document.getElementById('terminal-output');
    if (!output) return;

    const line1 = '>>> print("Welcome to my portfolio SumitKumar")';
    const line2 = 'Welcome to my portfolio SumitKumar';
    let idx = 0;

    const span1 = document.createElement('span');
    span1.className = 'terminal-line';
    output.appendChild(span1);

    function typeLine1() {
      if (idx < line1.length) {
        span1.textContent += line1[idx];
        idx++;
        setTimeout(typeLine1, 45);
      } else {
        setTimeout(function () {
          const span2 = document.createElement('span');
          span2.className = 'terminal-output-line';
          span2.textContent = line2;
          output.appendChild(span2);

          setTimeout(function () {
            const indicator = document.getElementById('scroll-indicator');
            if (indicator) {
              indicator.style.opacity = '1';
              indicator.addEventListener('click', function () {
                const parallax = document.getElementById('parallax-container');
                if (parallax) parallax.scrollIntoView({ behavior: 'smooth' });
              });
            }
          }, 500);
        }, 300);
      }
    }
    typeLine1();
  }

  // ── 3. DATA POPULATION ENGINE ──────────────────────────────
  function initPortfolioData() {
    // Check that the data.js file defined the global object
    if (typeof portfolioData === 'undefined') {
      console.error("portfolioData not found");
      return;
    }
    const D = portfolioData;
    const P = D.personal || {};

    setText('hero-name', P.name);
    setText('hero-designation', P.designation);
    setText('hero-tagline', P.tagline);
    setText('bio-text', P.bio);

    populateExperience(D.experience);
    populateList('roles-list', D.roles, function (role) {
      const li = document.createElement('li');
      li.textContent = role;
      return li;
    });
    populateSkills(D.skills);
    populateAchievements(D.achievements);
    populateCerts(D.certifications);
    populateEducation(D.education);
    populateHobbies(D.hobbies);
    populateProjects(D.projects);
    populateContact(D.contact);

    initScrollAnimations();
    initCTAButtons();
  }

  // ── HELPERS: DOM Insertion ───────────────────────────────────
  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text || '';
  }

  function populateList(id, items, createFn) {
    const container = document.getElementById(id);
    if (!container || !items) return;
    items.forEach(function (item) {
      container.appendChild(createFn(item));
    });
  }

  // Experience
  function populateExperience(experience) {
    const container = document.getElementById('experience-container');
    if (!container || !experience) return;
    experience.forEach(function (exp) {
      const card = document.createElement('div');
      card.className = 'exp-card';
      let html = '<h3>' + esc(exp.role) + '</h3>';
      html += '<p class="exp-company">' + esc(exp.company) + '</p>';
      html += '<p class="exp-period">' + esc(exp.duration) + '</p>';

      if (exp.description && exp.description.length > 0) {
        html += '<ul>';
        exp.description.forEach(function (r) {
          html += '<li>' + esc(r) + '</li>';
        });
        html += '</ul>';
      }
      card.innerHTML = html;
      container.appendChild(card);
    });
  }

  // Skills
  function populateSkills(skills) {
    const container = document.getElementById('skills-container');
    if (!container || !skills) return;
    skills.forEach(function (group) {
      const div = document.createElement('div');
      div.className = 'skill-group';
      let html = '<h3>' + esc(group.category) + '</h3><div class="skill-tags">';
      group.items.forEach(function (item) {
        html += '<span class="skill-tag">' + esc(item) + '</span>';
      });
      html += '</div>';
      div.innerHTML = html;
      container.appendChild(div);
    });
  }

  // Achievements
  function populateAchievements(achievements) {
    const container = document.getElementById('achievements-list');
    if (!container || !achievements) return;
    achievements.forEach(function (a) {
      const div = document.createElement('div');
      div.className = 'achievement-item';
      div.innerHTML = '<strong>' + esc(a.title) + '</strong>: ' + esc(a.description);
      container.appendChild(div);
    });
  }

  // Certifications
  function populateCerts(certs) {
    const container = document.getElementById('certs-container');
    if (!container || !certs) return;
    certs.forEach(function (cert) {
      const card = document.createElement('div');
      card.className = 'cert-card';
      card.innerHTML =
        '<h4>' + esc(cert.title) + '</h4>' +
        '<p>' + esc(cert.issuer) + '</p>' +
        '<small>' + esc(cert.year) + '</small>';
      container.appendChild(card);
    });
  }

  // Education
  function populateEducation(education) {
    const container = document.getElementById('education-container');
    if (!container || !education) return;
    education.forEach(function (edu) {
      const item = document.createElement('div');
      item.className = 'education-item';
      let html = '<h4>' + esc(edu.degree) + '</h4>';
      html += '<p>' + esc(edu.institute) + '</p>';
      html += '<small>Score: ' + esc(edu.score) + '</small>';
      item.innerHTML = html;
      container.appendChild(item);
    });
  }

  // Hobbies
  function populateHobbies(hobbies) {
    const container = document.getElementById('hobbies-container');
    if (!container || !hobbies) return;
    const iconMap = {
      'Cricket': '🏏',
      'Football': '⚽',
      'Reading Books': '📚',
      'Listening Music': '🎵',
      'Learning New Technologies': '💻'
    };
    hobbies.forEach(function (h) {
      const div = document.createElement('div');
      div.className = 'hobby-item';
      const icon = iconMap[h] || '✨';
      div.innerHTML = '<span>' + icon + '</span><p>' + esc(h) + '</p>';
      container.appendChild(div);
    });
  }

  // Projects
  function populateProjects(projects) {
    const grid = document.getElementById('projects-grid');
    if (!grid || !projects) return;
    projects.forEach(function (proj) {
      const card = document.createElement('div');
      card.className = 'project-card';
      let html = '<h3 class="project-name">' + esc(proj.title) + '</h3>';
      html += '<p class="project-desc">' + esc(proj.description) + '</p>';
      html += '<div class="project-tech">';
      proj.technologies.forEach(function (t) {
        html += '<span class="tech-tag">' + esc(t) + '</span>';
      });
      html += '</div><div class="project-links">';
      if (proj.github) {
        html += '<a href="' + esc(proj.github) + '" target="_blank" rel="noopener" class="github-link">';
        html += '<svg viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>';
        html += 'GitHub</a>';
      }
      if (proj.demo) {
        html += '<a href="' + esc(proj.demo) + '" target="_blank" rel="noopener" class="github-link">Live Demo</a>';
      }
      html += '</div>';
      card.innerHTML = html;
      grid.appendChild(card);
    });
  }

  // Contact
  function populateContact(contact) {
    const grid = document.getElementById('contact-grid');
    if (!grid || !contact) return;
    contact.forEach(function (c) {
      if (!c.value) return;
      const card = document.createElement('a');
      card.className = 'contact-card';
      card.href = c.link || '#';
      if (c.link && c.link !== '#') {
        card.target = '_blank';
        card.rel = 'noopener';
      }
      card.innerHTML =
        '<span class="contact-icon">' + c.icon + '</span>' +
        '<span class="contact-label">' + esc(c.title) + '</span>' +
        '<span class="contact-value">' + esc(c.value) + '</span>';
      grid.appendChild(card);
    });
  }

  // ── 4. SCROLL ANIMATIONS ───────────────────────────────────
  function initScrollAnimations() {
    const parallaxContainer = document.getElementById('parallax-container');
    const animatingPhoto = document.getElementById('animating-photo');
    const photoFull = document.getElementById('photo-full');

    if (parallaxContainer && animatingPhoto) {
      window.addEventListener('scroll', function () {
        const rect = parallaxContainer.getBoundingClientRect();
        const scrollDistance = -rect.top;
        const windowHeight = window.innerHeight;
        let progress = scrollDistance / windowHeight;
        if (progress < 0) progress = 0;
        if (progress > 1) progress = 1;

        let photoProgress = Math.min(1, progress * 2.0);
        const isMobile = window.innerWidth <= 768;

        if (!isMobile) {
          const leftTarget = 50 - (photoProgress * 28);
          animatingPhoto.style.left = leftTarget + '%';
        } else {
          animatingPhoto.style.left = '50%';
        }

        if (photoFull) photoFull.style.opacity = '1';
      }, { passive: true });
    }

    // Detail blocks intersection reveal
    const detailBlocks = document.querySelectorAll('.detail-block');
    if (detailBlocks.length > 0) {
      const detailObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            detailObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });

      detailBlocks.forEach(function (block) {
        detailObserver.observe(block);
      });
    }

    // Projects animation
    const projectCards = document.querySelectorAll('.project-card');
    if (projectCards.length > 0) {
      const projectsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            projectsObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      projectCards.forEach(function (card) {
        projectsObserver.observe(card);
      });
    }
  }

  // ── 5. CTA BUTTONS ─────────────────────────────────────────
  function initCTAButtons() {
    const btnContact = document.getElementById('btn-contact');
    const btnProjects = document.getElementById('btn-projects');
    const hub = document.getElementById('contact-hub');

    if (btnContact && hub) {
      btnContact.addEventListener('click', function () {
        hub.classList.toggle('active');
        btnContact.textContent = hub.classList.contains('active') ? 'Close' : 'Get in Touch';
      });
    }

    if (btnProjects) {
      btnProjects.addEventListener('click', function () {
        const projects = document.getElementById('projects-section');
        if (projects) projects.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  // ── 6. METEOR BACKGROUND ───────────────────────────────────
  function createMeteors() {
    const container = document.getElementById('meteor-container');
    if (!container) return;
    const numMeteors = 30;
    for (let i = 0; i < numMeteors; i++) {
      const meteor = document.createElement('div');
      meteor.classList.add('meteor');
      const top = -10 + Math.random() * 120;
      const left = -10 + Math.random() * 120;
      const delay = Math.random() * 8;
      const duration = 2.5 + Math.random() * 4;
      meteor.style.top = top + '%';
      meteor.style.left = left + '%';
      meteor.style.animationDelay = delay + 's';
      meteor.style.animationDuration = duration + 's';
      container.appendChild(meteor);
    }
  }

  // ── HTML ESCAPE HELPER ─────────────────────────────────────
  function esc(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── INITIALIZATION ON DOM READY ─────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    createMeteors();
    initPortfolioData();
  });
})();

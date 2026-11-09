/**
 * Muhammadyusuf — Portfolio Scripts
 * Zamonaviy interaktiv funksiyalar:
 * 1. Dark/Light mavzu almashtirish va xotirada saqlash
 * 2. Accent rangini tanlash va saqlash
 * 3. Tepada o'qish/scroll progress bari
 * 4. Mobil menyu ochish/yopish
 * 5. Loyihalarni toifalar bo'yicha filtrlash
 * 6. Jonli Andijon vaqti (soat)
 * 7. Email va havolalarni nusxalash (Toast bildirishnomasi bilan)
 * 8. Interaktiv aloqa formasi
 * 9. Scroll-to-top tugmasi
 * 10. Sahifa elementlarining silliq paydo bo'lishi (Reveal animations)
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initAccentColors();
  initScrollProgress();
  initMobileMenu();
  initClock();
  initProjectFilters();
  initCopyButtons();
  initContactForm();
  initBackToTop();
  initScrollAnimations();
});

/* ========================================================
   1. MAVZU (DARK / LIGHT MODE)
======================================================== */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Standart rejim: foydalanuvchi tanlovi yoki qorong'i rejim
  const activeTheme = savedTheme || (prefersDark ? 'dark' : 'dark');
  document.documentElement.setAttribute('data-theme', activeTheme);
  updateThemeIcon(activeTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('portfolio-theme', next);
      updateThemeIcon(next);
      showToast(next === 'dark' ? '🌙 Tungi rejim yoqildi' : '☀️ Kunduzgi rejim yoqildi');
    });
  }
}

function updateThemeIcon(theme) {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;
  const sunIcon = toggleBtn.querySelector('.icon-sun');
  const moonIcon = toggleBtn.querySelector('.icon-moon');
  if (sunIcon && moonIcon) {
    if (theme === 'dark') {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    } else {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    }
  }
}

/* ========================================================
   2. ACCENT RANG TANLASH (COLOR SWATCHES)
======================================================== */
function initAccentColors() {
  const swatches = document.querySelectorAll('.swatch-btn');
  const codeValueDisplay = document.getElementById('accent-code');
  const savedColor = localStorage.getItem('portfolio-accent') || '#6366f1';

  applyAccentColor(savedColor);

  swatches.forEach(btn => {
    const color = btn.dataset.color;
    if (color === savedColor) {
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
    }

    btn.addEventListener('click', () => {
      swatches.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      applyAccentColor(color);
      localStorage.setItem('portfolio-accent', color);
      showToast(`Rang o'zgartirildi: ${btn.title || color}`);
    });
  });

  function applyAccentColor(color) {
    document.documentElement.style.setProperty('--accent', color);
    if (codeValueDisplay) {
      codeValueDisplay.textContent = `'${color}'`;
    }
  }
}

/* ========================================================
   3. SCROLL PROGRESS BAR
======================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  }, { passive: true });
}

/* ========================================================
   4. MOBIL MENYU
======================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('menu-btn');
  const navMenu = document.getElementById('site-nav');
  const navLinks = navMenu ? navMenu.querySelectorAll('a') : [];

  if (!menuBtn || !navMenu) return;

  function toggleMenu(forceOpen) {
    const isOpen = typeof forceOpen === 'boolean' ? forceOpen : !navMenu.classList.contains('active');
    navMenu.classList.toggle('active', isOpen);
    menuBtn.classList.toggle('active', isOpen);
    menuBtn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  menuBtn.addEventListener('click', () => toggleMenu());

  navLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      toggleMenu(false);
    }
  });
}

/* ========================================================
   5. JONLI ANDIJON VAQTI
======================================================== */
function initClock() {
  const clockEl = document.getElementById('live-clock');
  if (!clockEl) return;

  function updateClock() {
    try {
      const now = new Date();
      // O'zbekiston (UTC+5) vaqti
      const options = {
        timeZone: 'Asia/Tashkent',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const formatter = new Intl.DateTimeFormat('uz-UZ', options);
      clockEl.textContent = formatter.format(now);
    } catch {
      const d = new Date();
      const pad = n => String(n).padStart(2, '0');
      clockEl.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ========================================================
   6. LOYIHALAR FILTRLASH
======================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.classList.add('fade-in');
          setTimeout(() => card.classList.remove('fade-in'), 300);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ========================================================
   7. NUSXALASH VA TOAST BILDIRISHNOMA
======================================================== */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('[data-copy]');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const textToCopy = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast(`📋 Nusxalandi: ${textToCopy}`);
      } catch {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`📋 Nusxalandi: ${textToCopy}`);
      }
    });
  });
}

function showToast(message, duration = 3000) {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.innerHTML = `<span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => toast.classList.add('visible'), 10);

  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ========================================================
   8. ALOQA FORMASI
======================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = form.querySelector('#contact-name');
    const msgInput = form.querySelector('#contact-message');

    if (!nameInput.value.trim() || !msgInput.value.trim()) {
      showToast('⚠️ Iltimos, ismingiz va xabaringizni kiriting!');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Yuborilmoqda...</span>`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Xabar yuborildi! ✓</span>`;
      showToast('🎉 Rahmat! Xabaringiz qabul qilindi. Tez orada javob beraman!');
      form.reset();

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
      }, 3000);
    }, 800);
  });
}

/* ========================================================
   9. TEPAGA QAYTISH TUGMASI (BACK TO TOP)
======================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ========================================================
   10. SCROLL REVEAL ANIMATSIYALARI
======================================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

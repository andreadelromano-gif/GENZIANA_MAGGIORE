/* MAGGIORE — Viewer fotografico homepage, versione stabile con schermo intero */
(() => {
  'use strict';

  const labels = [
    'fronte', 'tre quarti destro', 'lato destro',
    'retro', 'lato sinistro', 'tre quarti sinistro'
  ];
  const urls = labels.map((_, i) => '/bottiglia360/' + (i + 1) + '.webp');
  const images = urls.map(src => {
    const image = new Image();
    image.decoding = 'async';
    image.src = src;
    return image;
  });

  let index = 0;
  let rendered = 0;
  let mainImage = null;
  let fullscreen = null;
  let openButton = null;
  let announcement = null;
  let previousOverflow = '';
  let previousFocus = null;
  let setupStarted = false;

  const wrap = n => ((n % urls.length) + urls.length) % urls.length;

  function paint(frame) {
    rendered = frame;
    mainImage.src = urls[frame];
    mainImage.alt = 'Bottiglia MAGGIORE MCMXXXI: vista ' + labels[frame];
    if (fullscreen) {
      fullscreen.image.src = urls[frame];
      fullscreen.image.alt = mainImage.alt;
    }
    if (announcement) announcement.textContent = 'Vista ' + labels[frame];
  }

  function select(step) {
    const target = wrap(index + step);
    const candidate = images[target];
    if (candidate.complete && candidate.naturalWidth === 0) {
      if (announcement) announcement.textContent = 'Vista temporaneamente non disponibile';
      return;
    }
    index = target;
    if (candidate.complete && candidate.naturalWidth > 0) {
      paint(target);
      return;
    }
    candidate.addEventListener('load', () => {
      if (index === target && mainImage) paint(target);
    }, { once: true });
    candidate.addEventListener('error', () => {
      if (index === target) index = rendered;
    }, { once: true });
  }

  function wireStage(stage) {
    let pointerId = null;
    let lastX = 0;
    const release = () => {
      pointerId = null;
      stage.classList.remove('is-dragging');
    };

    stage.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      pointerId = event.pointerId;
      lastX = event.clientX;
      stage.classList.add('is-dragging');
      try { stage.setPointerCapture(event.pointerId); } catch (_) { /* fallback: arrows */ }
    });

    stage.addEventListener('pointermove', event => {
      if (event.pointerId !== pointerId) return;
      const threshold = event.pointerType === 'touch' ? 36 : 48;
      const dx = event.clientX - lastX;
      const steps = Math.trunc(dx / threshold);
      if (steps) {
        select(steps);
        lastX += steps * threshold;
      }
    });

    stage.addEventListener('pointerup', release);
    stage.addEventListener('pointercancel', release);
    stage.addEventListener('lostpointercapture', release);
    stage.addEventListener('dragstart', event => event.preventDefault());

    stage.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        select(event.key === 'ArrowLeft' ? -1 : 1);
      }
      if (event.key === 'Home') {
        event.preventDefault();
        select(-index);
      }
    });
  }

  function closeFullscreen() {
    if (!fullscreen) return;
    const overlay = fullscreen.overlay;
    fullscreen = null;
    if (document.fullscreenElement === overlay && document.exitFullscreen) {
      Promise.resolve(document.exitFullscreen()).catch(() => {});
    }
    overlay.remove();
    document.body.classList.remove('maggiore-360-modal-open');
    document.body.style.overflow = previousOverflow;
    if (previousFocus && previousFocus.isConnected) {
      previousFocus.focus({ preventScroll: true });
    } else if (openButton) {
      openButton.focus({ preventScroll: true });
    }
  }

  function handleModalKeys(event) {
    if (!fullscreen) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeFullscreen();
      return;
    }
    if (event.key !== 'Tab') return;
    const { stage, close } = fullscreen;
    if (event.shiftKey && document.activeElement === stage) {
      event.preventDefault();
      close.focus();
    } else if (!event.shiftKey && document.activeElement === close) {
      event.preventDefault();
      stage.focus();
    } else if (!fullscreen.overlay.contains(document.activeElement)) {
      event.preventDefault();
      stage.focus();
    }
  }

  function openFullscreen() {
    if (fullscreen || !mainImage) return;
    previousFocus = document.activeElement;
    previousOverflow = document.body.style.overflow;
    const overlay = document.createElement('section');
    overlay.className = 'maggiore-360-modal';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Bottiglia MAGGIORE a schermo intero');
    overlay.innerHTML =
      '<div class="maggiore-360-modal-stage" tabindex="0" aria-label="Trascina per ruotare la bottiglia; usa i tasti freccia">' +
      '<img draggable="false" alt="Bottiglia MAGGIORE" decoding="async"></div>' +
      '<button class="maggiore-360-modal-close" type="button" aria-label="Chiudi schermo intero">×</button>' +
      '<span class="maggiore-360-modal-hint" aria-hidden="true">← TRASCINA PER RUOTARE →</span>';
    const stage = overlay.querySelector('.maggiore-360-modal-stage');
    const image = stage.querySelector('img');
    const close = overlay.querySelector('.maggiore-360-modal-close');
    image.src = urls[rendered];
    image.alt = mainImage.alt;
    fullscreen = { overlay, stage, image, close, native: false };
    wireStage(stage);
    close.addEventListener('click', closeFullscreen);
    document.body.append(overlay);
    document.body.classList.add('maggiore-360-modal-open');
    document.body.style.overflow = 'hidden';
    stage.focus({ preventScroll: true });

    // Safari su iPhone: la finestra fissa a schermo copre comunque l'intero viewport.
    // Nei browser che lo supportano usiamo anche la Fullscreen API.
    if (typeof overlay.requestFullscreen === 'function') {
      try {
        Promise.resolve(overlay.requestFullscreen()).then(() => {
          if (fullscreen && fullscreen.overlay === overlay) {
            fullscreen.native = true;
          } else if (document.fullscreenElement === overlay && document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
          }
        }).catch(() => {});
      } catch (_) { /* resta disponibile la modalità viewport */ }
    }
  }

  document.addEventListener('keydown', handleModalKeys, true);
  document.addEventListener('fullscreenchange', () => {
    if (fullscreen && fullscreen.native && document.fullscreenElement !== fullscreen.overlay) {
      closeFullscreen();
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && fullscreen) closeFullscreen();
  });

  function install(host) {
    if (host.querySelector('.maggiore-hero360')) return;
    const viewer = document.createElement('div');
    viewer.className = 'maggiore-hero360';
    viewer.setAttribute('role', 'group');
    viewer.setAttribute('aria-label', 'Bottiglia MAGGIORE a sei viste');
    viewer.innerHTML =
      '<div class="maggiore-hero360-stage" tabindex="0" aria-label="Trascina per ruotare la bottiglia">' +
      '<img draggable="false" alt="Bottiglia MAGGIORE MCMXXXI, vista fronte" decoding="async"></div>' +
      '<div class="maggiore-hero360-actions">' +
      '<button type="button" data-action="prev" aria-label="Vista precedente">←</button>' +
      '<span class="maggiore-hero360-help" aria-hidden="true">TRASCINA PER RUOTARE</span>' +
      '<button type="button" data-action="next" aria-label="Vista successiva">→</button>' +
      '<button type="button" class="maggiore-hero360-expand" data-action="expand" aria-label="Visualizza la bottiglia a schermo intero">⛶ <span>SCHERMO INTERO</span></button>' +
      '</div><span class="maggiore-360-announcement" aria-live="polite"></span>';
    const stage = viewer.querySelector('.maggiore-hero360-stage');
    mainImage = stage.querySelector('img');
    mainImage.src = urls[0];
    const prev = viewer.querySelector('[data-action="prev"]');
    const next = viewer.querySelector('[data-action="next"]');
    openButton = viewer.querySelector('[data-action="expand"]');
    announcement = viewer.querySelector('.maggiore-360-announcement');
    prev.addEventListener('click', () => select(-1));
    next.addEventListener('click', () => select(1));
    openButton.addEventListener('click', openFullscreen);
    wireStage(stage);
    host.replaceChildren(viewer);
  }

  function mountWhenReady() {
    const host = document.querySelector('.hero .hero-product');
    if (!host || setupStarted) return Boolean(host);
    setupStarted = true;
    const first = images[0];
    // Se il file principale non carica, rimane la bottiglia originale del sito.
    if (first.complete && first.naturalWidth > 0) {
      install(host);
    } else if (!first.complete) {
      first.addEventListener('load', () => install(host), { once: true });
    }
    return true;
  }

  if (!mountWhenReady()) {
    const observer = new MutationObserver(() => {
      if (mountWhenReady()) observer.disconnect();
    });
    observer.observe(document.documentElement, { subtree: true, childList: true });
    window.addEventListener('load', () => {
      if (mountWhenReady()) observer.disconnect();
    }, { once: true });
  }
})();

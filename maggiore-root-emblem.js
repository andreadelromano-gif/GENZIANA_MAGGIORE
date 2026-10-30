/* MAGGIORE · sez. 03: restauro simbolo ufficiale senza alterare la brand identity.
   La texture contiene un emblema con due puntini; la maschera sfuma solamente
   quel dettaglio e sopra mostra ESATTAMENTE l'immagine del logo ufficiale. */
(() => {
  'use strict';
  const reference = { width: 1189, height: 696, x: 545, y: 552 };
  let installed = false;

  function initialize() {
    const section = document.querySelector('.root-section');
    const backdrop = section?.querySelector('img.cover');
    const official = document.querySelector('.site-header .brand img');
    if (!section || !backdrop || !official?.src) return false;
    if (installed) return true;
    installed = true;

    // Se React ha gia' creato il marchio corretto, non duplicarlo.
    let emblem = section.querySelector('.maggiore-root-official');
    if (!emblem) {
      emblem = document.createElement('div');
      emblem.className = 'maggiore-root-official';
      const img = document.createElement('img');
      img.src = official.currentSrc || official.src;
      img.alt = 'Simbolo originale MAGGIORE: M con radici, senza puntini';
      img.decoding = 'async';
      img.draggable = false;
      emblem.append(img);
      section.insertBefore(emblem, section.querySelector('.root-content'));
    }

    function position() {
      const r = backdrop.getBoundingClientRect();
      const nw = backdrop.naturalWidth, nh = backdrop.naturalHeight;
      if (!nw || !nh || !r.width || !r.height) return;

      // Coordinate dell'emblema sbagliato misurate sull'immagine del sito.
      // Ricalcolo il crop di object-fit:cover su schermi di diversa proporzione.
      const s0 = Math.max(reference.width / nw, reference.height / nh);
      const ox0 = (reference.width - nw * s0) / 2;
      const oy0 = (reference.height - nh * s0) / 2;
      const sourceX = (reference.x - ox0) / s0;
      const sourceY = (reference.y - oy0) / s0;
      const s = Math.max(r.width / nw, r.height / nh);
      const cropX = (r.width - nw * s) / 2;
      const cropY = (r.height - nh * s) / 2;
      const left = cropX + sourceX * s;
      const top = cropY + sourceY * s;
      const k = s / s0;

      section.style.setProperty('--root-logo-x', left.toFixed(2) + 'px');
      section.style.setProperty('--root-logo-y', top.toFixed(2) + 'px');
      section.style.setProperty('--root-logo-size', (246 * k).toFixed(2) + 'px');
      section.style.setProperty('--root-mask-x', (166 * k).toFixed(2) + 'px');
      section.style.setProperty('--root-mask-y', (177 * k).toFixed(2) + 'px');
    }

    if (backdrop.complete) position();
    else backdrop.addEventListener('load', position, { once: true });
    window.addEventListener('resize', position, { passive: true });
    window.addEventListener('orientationchange', position, { passive: true });
    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(position).observe(section);
    }
    return true;
  }

  if (!initialize()) {
    const observer = new MutationObserver(() => {
      if (initialize()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener('load', () => {
      if (initialize()) observer.disconnect();
    }, { once: true });
  }
})();
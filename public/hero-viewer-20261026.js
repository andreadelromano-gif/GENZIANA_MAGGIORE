/* MAGGIORE · visualizzatore fotografico nella prima schermata · sei foto approvate */
(() => {
  'use strict';
  const labels = ['fronte','tre quarti destro','lato destro','retro','lato sinistro','tre quarti sinistro'];
  const frames = labels.map((_,i) => '/bottiglia360/' + (i+1) + '.webp?v=hero-261026');
  function mount() {
    const host = document.querySelector('.hero .hero-product');
    if (!host) return false;
    if (host.querySelector('.maggiore-hero360')) return true;
    const root = document.createElement('div');
    root.className = 'maggiore-hero360';
    root.setAttribute('role','group');
    root.setAttribute('aria-label','Bottiglia MAGGIORE, sei viste fotografiche');
    root.innerHTML = '<div class="maggiore-hero360-stage" tabindex="0" aria-label="Trascina a destra o sinistra per ruotare la bottiglia"><img src="' + frames[0] + '" alt="Bottiglia MAGGIORE MCMXXXI, vista fronte" draggable="false" decoding="async"></div><div class="maggiore-hero360-controls"><button type="button" aria-label="Vista precedente">←</button><span>TRASCINA PER RUOTARE</span><button type="button" aria-label="Vista successiva">→</button></div><span class="maggiore-hero360-sr" aria-live="polite"></span>';
    host.replaceChildren(root);
    const stage = root.querySelector('.maggiore-hero360-stage');
    const img = stage.querySelector('img');
    const live = root.querySelector('.maggiore-hero360-sr');
    const buttons = root.querySelectorAll('button');
    let index = 0, pointer = null, lastX = 0;
    function change(step, announce=true) {
      index = (index + step % frames.length + frames.length) % frames.length;
      img.src = frames[index];
      img.alt = 'Bottiglia MAGGIORE MCMXXXI, vista ' + labels[index];
      if (announce) live.textContent = 'Vista ' + labels[index];
    }
    buttons[0].addEventListener('click', () => change(-1));
    buttons[1].addEventListener('click', () => change(1));
    stage.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight') { event.preventDefault(); change(1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); change(-1); }
    });
    stage.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      pointer = event.pointerId; lastX = event.clientX;
      stage.classList.add('dragging');
      stage.setPointerCapture(event.pointerId);
    });
    stage.addEventListener('pointermove', event => {
      if (pointer !== event.pointerId) return;
      const threshold = event.pointerType === 'touch' ? 38 : 48;
      const delta = event.clientX - lastX;
      const steps = Math.trunc(delta / threshold);
      if (steps) { change(steps, false); lastX += steps * threshold; }
    });
    const stop = () => { pointer = null; stage.classList.remove('dragging'); };
    stage.addEventListener('pointerup', stop);
    stage.addEventListener('pointercancel', stop);
    stage.addEventListener('lostpointercapture', stop);
    stage.addEventListener('dragstart', event => event.preventDefault());
    frames.slice(1).forEach(src => { const preloaded = new Image(); preloaded.src = src; });
    return true;
  }
  if (!mount()) {
    const observer = new MutationObserver(() => { if (mount()) observer.disconnect(); });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener('load', () => { if (mount()) observer.disconnect(); }, { once: true });
  }
})();
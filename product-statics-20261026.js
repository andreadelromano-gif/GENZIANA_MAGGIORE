/* MAGGIORE MCMXXXI — statiche fronte/retro nella sezione 06 (build pubblicata) */
(() => {
  'use strict';
  const srcs = ['/bottiglia360/1.webp', '/bottiglia360/4.webp'];
  const titles = [
    'MAGGIORE MCMXXXI — bottiglia da 50 cl, vista frontale',
    'MAGGIORE MCMXXXI — bottiglia da 50 cl, vista posteriore'
  ];
  let done = false;
  let pending = false;
  function swap() {
    const visual = document.querySelector('.product .product-visual');
    if (!visual) return false;
    if (visual.querySelector('.maggiore-static-duo')) return true;
    if (pending) return true;
    pending = true;
    // Il vecchio visual resta visibile se un'immagine nuova non è disponibile.
    Promise.all(srcs.map(src => new Promise((resolve,reject) => {
      const image = new Image();
      image.onload = () => resolve(src);
      image.onerror = () => reject(new Error('Immagine non disponibile: ' + src));
      image.src = src;
      if (image.complete && image.naturalWidth) resolve(src);
    }))).then(() => {
      if (!visual.isConnected || visual.querySelector('.maggiore-static-duo')) return;
      const group = document.createElement('div');
      group.className = 'maggiore-static-duo';
      group.setAttribute('role', 'group');
      group.setAttribute('aria-label', 'Bottiglia MAGGIORE: fronte e retro');
      srcs.forEach((src,i) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = titles[i];
        img.loading = 'lazy';
        img.decoding = 'async';
        img.draggable = false;
        img.width = 540;
        img.height = 810;
        group.append(img);
      });
      visual.replaceChildren(group);
      done = true;
    }).catch(() => { pending = false; });
    return true;
  }
  if (!swap()) {
    const observer = new MutationObserver(() => {
      if (swap()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList:true, subtree:true });
    window.addEventListener('load', () => {
      if (swap()) observer.disconnect();
    }, { once:true });
  }
})();
// Task 4 — Simboli vettoriali originali stile Sphinx (disegnati via Canvas 2D).
// Nessun asset copiato: forme originali ispirate ai riferimenti (faraone, horus, anubis...).
window.EgittoSymbols = (() => {
  function base(ctx, cx, cy, s, fn) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    fn(s);
    ctx.restore();
  }

  // F — Faraone: nemes a strisce oro/lapis + volto oro
  function faraone(ctx, cx, cy, s) {
    base(ctx, cx, cy, s, (u) => {
      // nemes (copricapo)
      ctx.fillStyle = '#1e4fa3';
      ctx.strokeStyle = '#3a2a10'; ctx.lineWidth = u * 0.05;
      ctx.beginPath();
      ctx.moveTo(-u * 0.42, -u * 0.42);
      ctx.lineTo(u * 0.42, -u * 0.42);
      ctx.lineTo(u * 0.34, u * 0.30);
      ctx.lineTo(-u * 0.34, u * 0.30);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // strisce oro nemes
      ctx.strokeStyle = '#d4af37'; ctx.lineWidth = u * 0.07;
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(i * u * 0.18 - u * 0.08, -u * 0.40);
        ctx.lineTo(i * u * 0.18 - u * 0.02, u * 0.28);
        ctx.stroke();
      }
      // volto
      ctx.fillStyle = '#e8b64c';
      ctx.strokeStyle = '#3a2a10'; ctx.lineWidth = u * 0.045;
      ctx.beginPath();
      ctx.ellipse(0, -u * 0.02, u * 0.24, u * 0.28, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      // occhi stile egizio
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.ellipse(-u * 0.10, -u * 0.04, u * 0.075, u * 0.05, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(u * 0.10, -u * 0.04, u * 0.075, u * 0.05, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#141414';
      ctx.beginPath(); ctx.arc(-u * 0.10, -u * 0.04, u * 0.025, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(u * 0.10, -u * 0.04, u * 0.025, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#141414'; ctx.lineWidth = u * 0.035;
      ctx.beginPath(); ctx.moveTo(-u * 0.19, -u * 0.05); ctx.lineTo(-u * 0.03, -u * 0.03); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(u * 0.19, -u * 0.05); ctx.lineTo(u * 0.03, -u * 0.03); ctx.stroke();
      // barba rituale + collare
      ctx.fillStyle = '#1e4fa3';
      ctx.fillRect(-u * 0.035, u * 0.24, u * 0.07, u * 0.14);
      ctx.fillStyle = '#b83232';
      ctx.beginPath(); ctx.ellipse(0, u * 0.36, u * 0.20, u * 0.07, 0, 0, Math.PI); ctx.fill();
    });
  }

  // O — Occhio di Horus
  function horus(ctx, cx, cy, s) {
    base(ctx, cx, cy, s, (u) => {
      // sopracciglio viola
      ctx.strokeStyle = '#5b2d8e'; ctx.lineWidth = u * 0.10;
      ctx.beginPath(); ctx.moveTo(-u * 0.38, -u * 0.18); ctx.quadraticCurveTo(0, -u * 0.42, u * 0.38, -u * 0.14); ctx.stroke();
      // occhio bianco
      ctx.fillStyle = '#fff'; ctx.strokeStyle = '#141414'; ctx.lineWidth = u * 0.045;
      ctx.beginPath();
      ctx.moveTo(-u * 0.34, 0);
      ctx.quadraticCurveTo(0, -u * 0.26, u * 0.34, -u * 0.02);
      ctx.quadraticCurveTo(0, u * 0.22, -u * 0.34, 0);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // iride verde
      ctx.fillStyle = '#2f9e44';
      ctx.beginPath(); ctx.arc(0, -u * 0.02, u * 0.11, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#141414';
      ctx.beginPath(); ctx.arc(0, -u * 0.02, u * 0.05, 0, Math.PI * 2); ctx.fill();
      // lacrima + spirale
      ctx.strokeStyle = '#5b2d8e'; ctx.lineWidth = u * 0.06;
      ctx.beginPath(); ctx.moveTo(-u * 0.08, u * 0.16); ctx.lineTo(-u * 0.08, u * 0.38); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(u * 0.10, u * 0.14); ctx.quadraticCurveTo(u * 0.34, u * 0.22, u * 0.28, u * 0.38); ctx.stroke();
    });
  }

  // S — Anubis (sciacallo nero sdraiato, profilo)
  function anubis(ctx, cx, cy, s) {
    base(ctx, cx, cy, s, (u) => {
      ctx.fillStyle = '#1c1c1c'; ctx.strokeStyle = '#000'; ctx.lineWidth = u * 0.03;
      // corpo
      ctx.beginPath(); ctx.ellipse(-u * 0.05, u * 0.18, u * 0.32, u * 0.13, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      // zampe
      ctx.fillRect(-u * 0.30, u * 0.26, u * 0.50, u * 0.07);
      // collo + testa profilo verso destra
      ctx.beginPath();
      ctx.moveTo(u * 0.12, u * 0.16);
      ctx.lineTo(u * 0.22, -u * 0.12);
      ctx.lineTo(u * 0.34, -u * 0.10);
      ctx.lineTo(u * 0.30, u * 0.18);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // muso
      ctx.beginPath();
      ctx.moveTo(u * 0.30, -u * 0.08);
      ctx.lineTo(u * 0.44, -u * 0.02);
      ctx.lineTo(u * 0.30, u * 0.06);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // orecchie lunghe
      ctx.beginPath();
      ctx.moveTo(u * 0.16, -u * 0.12); ctx.lineTo(u * 0.12, -u * 0.40); ctx.lineTo(u * 0.22, -u * 0.14); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(u * 0.26, -u * 0.12); ctx.lineTo(u * 0.30, -u * 0.40); ctx.lineTo(u * 0.34, -u * 0.12); ctx.closePath(); ctx.fill(); ctx.stroke();
      // occhio + collare oro
      ctx.fillStyle = '#ffd75e';
      ctx.beginPath(); ctx.arc(u * 0.26, -u * 0.02, u * 0.035, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(u * 0.14, u * 0.10, u * 0.14, u * 0.06);
    });
  }

  // A — Ankh oro
  function ankh(ctx, cx, cy, s) {
    base(ctx, cx, cy, s, (u) => {
      ctx.strokeStyle = '#3a2a10'; ctx.lineWidth = u * 0.11;
      ctx.beginPath(); ctx.ellipse(0, -u * 0.20, u * 0.13, u * 0.16, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -u * 0.04); ctx.lineTo(0, u * 0.40); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-u * 0.22, u * 0.06); ctx.lineTo(u * 0.22, u * 0.06); ctx.stroke();
      ctx.strokeStyle = '#e8b64c'; ctx.lineWidth = u * 0.07;
      ctx.beginPath(); ctx.ellipse(0, -u * 0.20, u * 0.13, u * 0.16, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -u * 0.04); ctx.lineTo(0, u * 0.40); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-u * 0.22, u * 0.06); ctx.lineTo(u * 0.22, u * 0.06); ctx.stroke();
    });
  }

  // P — Piramidi + sole
  function piramide(ctx, cx, cy, s) {
    base(ctx, cx, cy, s, (u) => {
      // sole
      ctx.fillStyle = '#e8821e';
      ctx.beginPath(); ctx.arc(u * 0.16, -u * 0.26, u * 0.14, 0, Math.PI * 2); ctx.fill();
      // piramide grande
      ctx.fillStyle = '#8a5a2b'; ctx.strokeStyle = '#3a2a10'; ctx.lineWidth = u * 0.04;
      ctx.beginPath();
      ctx.moveTo(-u * 0.38, u * 0.30); ctx.lineTo(-u * 0.02, -u * 0.18); ctx.lineTo(u * 0.30, u * 0.30); ctx.closePath();
      ctx.fill(); ctx.stroke();
      // faccia in luce
      ctx.fillStyle = '#c98f4a';
      ctx.beginPath();
      ctx.moveTo(-u * 0.02, -u * 0.18); ctx.lineTo(u * 0.30, u * 0.30); ctx.lineTo(-u * 0.02, u * 0.30); ctx.closePath(); ctx.fill();
      // piramide piccola
      ctx.fillStyle = '#6e451f';
      ctx.beginPath();
      ctx.moveTo(u * 0.10, u * 0.30); ctx.lineTo(u * 0.34, u * 0.02); ctx.lineTo(u * 0.46, u * 0.30); ctx.closePath(); ctx.fill(); ctx.stroke();
      // sabbia
      ctx.fillStyle = '#e3c878';
      ctx.fillRect(-u * 0.44, u * 0.30, u * 0.88, u * 0.10);
    });
  }

  // V — Ventaglio blu
  function ventaglio(ctx, cx, cy, s) {
    base(ctx, cx, cy, s, (u) => {
      // manico
      ctx.strokeStyle = '#5a3a1a'; ctx.lineWidth = u * 0.07;
      ctx.beginPath(); ctx.moveTo(0, u * 0.10); ctx.lineTo(0, u * 0.42); ctx.stroke();
      // ventaglio
      ctx.fillStyle = '#2b6cb0'; ctx.strokeStyle = '#14305c'; ctx.lineWidth = u * 0.04;
      ctx.beginPath();
      ctx.moveTo(0, u * 0.10);
      ctx.arc(0, u * 0.10, u * 0.38, Math.PI, 0);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // nervature oro
      ctx.strokeStyle = '#d4af37'; ctx.lineWidth = u * 0.035;
      for (let a = 180; a <= 360; a += 30) {
        const r = a * Math.PI / 180;
        ctx.beginPath();
        ctx.moveTo(0, u * 0.10);
        ctx.lineTo(Math.cos(r) * u * 0.36, u * 0.10 + Math.sin(r) * u * 0.36);
        ctx.stroke();
      }
      ctx.fillStyle = '#d4af37';
      ctx.beginPath(); ctx.arc(0, u * 0.10, u * 0.06, 0, Math.PI * 2); ctx.fill();
    });
  }

  // R — Moneta d'oro (geroglifico)
  function moneta(ctx, cx, cy, s) {
    base(ctx, cx, cy, s, (u) => {
      ctx.fillStyle = '#8a6d1c';
      ctx.beginPath(); ctx.arc(0, 0, u * 0.36, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffd75e';
      ctx.beginPath(); ctx.arc(0, 0, u * 0.30, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#7a5a00'; ctx.lineWidth = u * 0.04;
      ctx.beginPath(); ctx.arc(0, 0, u * 0.30, 0, Math.PI * 2); ctx.stroke();
      // mini-ankh inciso
      ctx.strokeStyle = '#8a5a00'; ctx.lineWidth = u * 0.045;
      ctx.beginPath(); ctx.arc(0, -u * 0.10, u * 0.07, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -u * 0.03); ctx.lineTo(0, u * 0.20); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-u * 0.10, u * 0.05); ctx.lineTo(u * 0.10, u * 0.05); ctx.stroke();
    });
  }

  // X — Sfinge (Scatter): corpo leonino + volto dorato
  function sfinge(ctx, cx, cy, s) {
    base(ctx, cx, cy, s, (u) => {
      // corpo leonino
      ctx.fillStyle = '#c98f4a'; ctx.strokeStyle = '#3a2a10'; ctx.lineWidth = u * 0.04;
      ctx.beginPath(); ctx.ellipse(0, u * 0.22, u * 0.34, u * 0.15, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      // zampe anteriori
      ctx.fillRect(-u * 0.22, u * 0.26, u * 0.10, u * 0.12);
      ctx.fillRect(u * 0.12, u * 0.26, u * 0.10, u * 0.12);
      // testa dorata
      ctx.fillStyle = '#e8b64c';
      ctx.beginPath(); ctx.arc(0, -u * 0.12, u * 0.20, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      // nemes laterali
      ctx.fillStyle = '#1e4fa3';
      ctx.fillRect(-u * 0.26, -u * 0.28, u * 0.10, u * 0.30);
      ctx.fillRect(u * 0.16, -u * 0.28, u * 0.10, u * 0.30);
      // occhi
      ctx.fillStyle = '#141414';
      ctx.beginPath(); ctx.arc(-u * 0.07, -u * 0.12, u * 0.025, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(u * 0.07, -u * 0.12, u * 0.025, 0, Math.PI * 2); ctx.fill();
    });
  }

  const MAP = { F: faraone, O: horus, S: anubis, A: ankh, P: piramide, V: ventaglio, R: moneta, X: sfinge };

  // — Task 11: immagini SVG dettagliate con fallback vettoriale —
  // — Task 18 (zero SVG sui rulli): 4 ALTI con badge + 4 BASSI plain
  //   (stesso motivo, valore dallo sfondo) + Wild + Anubis a colonna intera.
  // — Task 22: i 4 ALTI diventano i Gemini (Faraone/Sfinge/Piramide/Cleopatra,
  //   cornice oro propria su scacchiera finta → flag framed: contain + clip
  //   arrotondata). I plain restano i low Kemet.
  // — Task 23: Gemini sostituiti dai 4 PNG definitivi (vera trasparenza,
  //   stessa cornice oro → resta il ramo framed per sicurezza).
  const symbolData = [
    { id: 'O', file: 'assets/kemet/faraone.png', emoji: '👑', framed: true },
    { id: 'A', file: 'assets/kemet/sfinge.png', emoji: '🦁', framed: true },
    { id: 'P', file: 'assets/kemet/piramidi.png', emoji: '🔺', framed: true },
    { id: 'V', file: 'assets/kemet/cleopatra.png', emoji: '👸', framed: true },
    { id: 'J', file: 'assets/kemet/symbol-eye-plain.png', emoji: '🃏' },
    { id: 'Q', file: 'assets/kemet/symbol-ankh-plain.png', emoji: '🃏' },
    { id: 'K', file: 'assets/kemet/symbol-scarab-plain.png', emoji: '🃏' },
    { id: 'T', file: 'assets/kemet/symbol-necklace-plain.png', emoji: '🃏' },
    // Task 25: B = Sarcofago (trigger pick 3+ ovunque) — arte definitiva
    { id: 'B', file: 'assets/kemet/sarcofago.png', emoji: '⚰️', framed: true },
    { id: 'S', file: 'assets/kemet/anubis-frame.png', emoji: '🐺' },
    { id: 'W', file: 'assets/kemet/wild.png', emoji: '✨' }
  ];
  const images = {};
  let imagesLoaded = false;

  // Precarica tutti i PNG prima del rendering; onerror => fallback, mai blocchi.
  function preloadSymbolImages(onDone) {
    return new Promise((resolve) => {
      let pending = symbolData.length;
      if (!pending) { imagesLoaded = false; resolve(false); return; }
      const oneDone = () => {
        pending--;
        if (pending <= 0) {
          imagesLoaded = Object.keys(images).some((k) => images[k].loaded);
          if (onDone) { try { onDone(imagesLoaded); } catch (e) {} }
          resolve(imagesLoaded);
        }
      };
      symbolData.forEach((s) => {
        const img = new Image();
        images[s.id] = { img, loaded: false, trim: null };
        img.onload = () => {
          images[s.id].loaded = true;
          images[s.id].trim = computeTrim(img); // Task 19: bbox arte una tantum
          oneDone();
        };
        img.onerror = () => { images[s.id].loaded = false; oneDone(); };
        img.src = s.file;
      });
    });
  }

  function isLoaded(id) { return !!(images[id] && images[id].loaded); }

  // Task 19: ritaglia i margini completamente trasparenti (il pack preserva
  // margini ampi attorno all'arte). Calcolato UNA volta al preload, così il
  // draw cover riempie davvero la cella invece di mostrare il padding.
  function computeTrim(img) {
    try {
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      if (!w || !h) return null;
      const cv = document.createElement('canvas');
      cv.width = w; cv.height = h;
      const c = cv.getContext('2d', { willReadFrequently: true });
      if (!c) return null;
      c.drawImage(img, 0, 0);
      const d = c.getImageData(0, 0, w, h).data;
      let x0 = w, y0 = h, x1 = -1, y1 = -1;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          if (d[(y * w + x) * 4 + 3] > 8) {
            if (x < x0) x0 = x;
            if (x > x1) x1 = x;
            if (y < y0) y0 = y;
            if (y > y1) y1 = y;
          }
        }
      }
      if (x1 < x0) return null;
      x0 = Math.max(0, x0 - 1); y0 = Math.max(0, y0 - 1);
      x1 = Math.min(w - 1, x1 + 1); y1 = Math.min(h - 1, y1 + 1);
      return { sx: x0, sy: y0, sw: x1 - x0 + 1, sh: y1 - y0 + 1 };
    } catch (e) { return null; }
  }
  // Task 22: clip arrotondata (con fallback manuale per browser datati) —
  // serve ai Gemini: la scacchiera finta agli angoli va tagliata via.
  function roundClip(ctx, x, y, w, h, r) {
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(x, y, w, h, r);
    } else {
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }
    ctx.clip();
  }

  // Task 19: COVER — l'arte (già trimmata) riempie il riquadro.
  // Task 22: via di mezzo — box al 90% della cella; i framed (Gemini) in
  // contain con clip arrotondata (hanno già la cornice oro disegnata).
  // Ritorna false se l'immagine non è disponibile.
  function drawPng(ctx, id, cx, cy, size) {
    const entry = images[id];
    if (!entry || !entry.loaded) return false;
    try {
      const spec = symbolData.find((s) => s.id === id);
      const framed = !!(spec && spec.framed);
      const boxScale = framed ? 0.94 : 0.9;
      const bw0 = size * boxScale, bh0 = size * boxScale;
      const bx0 = cx - bw0 / 2, by0 = cy - bh0 / 2;
      const iw = entry.img.naturalWidth || entry.img.width || 1;
      const ih = entry.img.naturalHeight || entry.img.height || 1;
      ctx.save();
      if (framed) {
        // Contain: l'immagine quadrata riempie il box; angoli arrotondati
        roundClip(ctx, bx0, by0, bw0, bh0, bw0 * 0.20);
        ctx.drawImage(entry.img, bx0, by0, bw0, bh0);
      } else {
        let sx = 0, sy = 0, sw = iw, sh = ih;
        if (entry.trim) { sx = entry.trim.sx; sy = entry.trim.sy; sw = entry.trim.sw; sh = entry.trim.sh; }
        const scale = Math.max(bw0 / sw, bh0 / sh);
        const bw = sw * scale, bh = sh * scale;
        const bx = bx0 + (bw0 - bw) / 2, by = by0 + (bh0 - bh) / 2;
        ctx.beginPath();
        ctx.rect(bx0, by0, bw0, bh0);
        ctx.clip();
        ctx.drawImage(entry.img, sx, sy, sw, sh, bx, by, bw, bh);
      }
      // Gloss: luce radente superiore per effetto 3D lucido
      const g = ctx.createLinearGradient(0, by0, 0, by0 + bh0);
      g.addColorStop(0, 'rgba(255,255,255,0.22)');
      g.addColorStop(0.4, 'rgba(255,255,255,0)');
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = g;
      ctx.fillRect(bx0, by0, bw0, bh0 * 0.5);
      ctx.restore();
      return true;
    } catch (e) { return false; }
  }

  function draw(ctx, id, cx, cy, size) {
    if (drawPng(ctx, id, cx, cy, size)) return; // PNG se caricato
    const fn = MAP[id] || moneta;
    fn(ctx, cx, cy, size); // fallback vettoriale (ex-emoji stilizzata)
  }

  // Task 18: Anubis a colonna intera (un'unica immagine su 3 celle).
  // Task 19: COVER sul rettangolo — riempie tutto, ritaglia l'eccesso.
  function drawSpan(ctx, id, x, y, w, h) {
    const entry = images[id];
    if (!entry || !entry.loaded) { draw(ctx, id, x + w / 2, y + h / 2, Math.min(w, h)); return; }
    try {
      const iw = entry.img.naturalWidth || entry.img.width || 1;
      const ih = entry.img.naturalHeight || entry.img.height || 1;
      let sx = 0, sy = 0, sw = iw, sh = ih;
      if (entry.trim) { sx = entry.trim.sx; sy = entry.trim.sy; sw = entry.trim.sw; sh = entry.trim.sh; }
      const scale = Math.max(w / sw, h / sh);
      const bw = sw * scale, bh = sh * scale;
      const bx = x + (w - bw) / 2, by = y + (h - bh) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.clip();
      ctx.drawImage(entry.img, sx, sy, sw, sh, bx, by, bw, bh);
      ctx.restore();
      return true;
    } catch (e) {
      draw(ctx, id, x + w / 2, y + h / 2, Math.min(w, h));
      return false;
    }
  }

  return {
    draw, drawSpan, symbolData, preloadSymbolImages, isLoaded,
    get imagesLoaded() { return imagesLoaded; }
  };
})();

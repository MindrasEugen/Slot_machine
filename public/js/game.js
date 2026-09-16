// Task 8 — Motore di spinning meccanico 5x3 (Vanilla JS, Canvas).
// Scorrimento verticale fluido a 60 FPS con reelOffsets, riciclo colonna
// quando l'offset supera una cella, stop a cascata sinistra→destra e
// allineamento perfetto alla griglia finale con offset azzerato.
window.EgittoGame = (() => {
  const easeOutCubic = (p) => 1 - Math.pow(1 - p, 3);

  // Colonna di lavoro: [bufTop, v0, v1, v2, bufBottom] (alto→basso).
  // A offset=0 le celle v0..v2 occupano esattamente le 3 righe.
  function makeColumn(currentCol, pick) {
    return [pick(), currentCol[0], currentCol[1], currentCol[2], pick()];
  }

  function spin(opts) {
    const canvas = opts.canvas;
    const ctx = opts.ctx;
    const COLS = opts.cols;
    const ROWS = opts.rows; // sempre 3
    const fromGrid = opts.fromGrid; // ROWSxCOLS (visibile a t=0)
    const toGrid = opts.toGrid; // ROWSxCOLS (finale del generatore)
    const pick = opts.pick; // () => id simbolo temporaneo
    const drawCell = opts.drawCell; // (x, y, cw, rh, symbolId) => void
    const onDone = opts.onDone || (() => {});
    const onReelStop = opts.onReelStop || (() => {}); // Task 20: (colIndex) => void
    const baseMs = opts.baseMs || 1000;
    const staggerMs = opts.staggerMs || 350;
    const landMs = opts.landMs || 180;
    // Velocità costante: celle al secondo durante la corsa
    const speedCellsPerSec = opts.speedCellsPerSec || 12;

    const W = canvas.width, H = canvas.height;
    const cw = W / COLS, rh = H / ROWS;

    // Stato per rullo
    const cols = [];
    const reelOffsets = new Array(COLS).fill(0);
    const state = new Array(COLS).fill('run'); // run -> land -> stop
    const stopAt = [];
    const landFrom = new Array(COLS).fill(0);
    const landT0 = new Array(COLS).fill(0);
    const t0 = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();

    for (let c = 0; c < COLS; c++) {
      cols.push(makeColumn([fromGrid[0][c], fromGrid[1][c], fromGrid[2][c]], pick));
      stopAt.push(t0 + baseMs + c * staggerMs);
    }

    let raf = 0;
    let last = t0;
    let done = false;

    function cycleColumn(c) {
      // L'offset ha superato una cella: scivola i simboli (via il basso, nuovo in cima)
      const col = cols[c];
      col.pop();
      col.unshift(pick());
      reelOffsets[c] -= rh;
    }

    function beginLanding(c, now) {
      // Blocca la colonna sulla griglia finale, poi azzera l'offset con micro-tween
      const f = [toGrid[0][c], toGrid[1][c], toGrid[2][c]];
      cols[c] = [pick(), f[0], f[1], f[2], pick()];
      state[c] = 'land';
      landFrom[c] = reelOffsets[c];
      landT0[c] = now;
      try { onReelStop(c); } catch (e) {}
    }

    function frame(now) {
      if (typeof now !== 'number') now = t0;
      const dtMs = Math.min(50, Math.max(0, now - last));
      last = now;

      // Sfondo rulli (il cabinet è trasparente, le celle hanno il loro fondo)
      ctx.fillStyle = '#170b1d';
      ctx.fillRect(0, 0, W, H);
      ctx.fillRect(0, 0, W, H);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, W, H);
      ctx.clip();

      let allStopped = true;
      for (let c = 0; c < COLS; c++) {
        if (state[c] === 'run') {
          allStopped = false;
          // 1. Scorrimento fluido a velocità costante (dall'alto verso il basso)
          reelOffsets[c] += (speedCellsPerSec * rh * dtMs) / 1000;
          // 2. Riciclo colonna quando l'offset supera una cella
          while (reelOffsets[c] >= rh) cycleColumn(c);
          // 3. Stop a cascata: scade il tempo del rullo
          if (now >= stopAt[c]) beginLanding(c, now);
        } else if (state[c] === 'land') {
          allStopped = false;
          const p = Math.min(1, (now - landT0[c]) / landMs);
          reelOffsets[c] = landFrom[c] * (1 - easeOutCubic(p));
          if (p >= 1) {
            reelOffsets[c] = 0; // offset azzerato, griglia perfetta
            state[c] = 'stop';
          }
        }

        // 4. Rendering continuo: righe extra sopra/sotto per coprire l'offset
        const col = cols[c];
        const x = c * cw;
        for (let i = 0; i < col.length; i++) {
          const y = (i - 1) * rh + reelOffsets[c];
          if (y < -rh || y > H) continue; // fuori schermo
          drawCell(x, y, cw, rh, col[i]);
        }
      }
      ctx.restore();

      if (!allStopped) {
        raf = requestAnimationFrame(frame);
      } else if (!done) {
        done = true;
        onDone();
      }
    }

    raf = requestAnimationFrame(frame);
    return { cancel: () => { try { cancelAnimationFrame(raf); } catch (e) {} done = true; } };
  }

  // — Task 10/17: vincite bonus e free spin (Scatter Anubis da Task 17) —
  // Stato globale del bonus (la griglia è ROWSxCOLS di id simbolo).
  let freeSpinsRemaining = 0;
  let isFreeSpinMode = false;

  function bonusCfg() {
    const c = window.EgittoConfig;
    return (c && c.BONUS) || { SCATTER_ID: 'S', SCATTER_MIN: 1, FREE_SPINS_BY_COUNT: { 1: 5, 2: 10, 3: 15 } };
  }

  // — Task 25: trigger pick-bonus separato (simbolo B, 3+ ovunque) —
  // Ritorna true se il pick-bonus sarcofagi deve aprirsi (solo premio
  // istantaneo, niente free spin — quelli vengono solo da Anubis).
  function checkPickTrigger(finalGrid) {
    const bonus = bonusCfg();
    const pickId = (bonus && bonus.PICK_ID) || 'B';
    const pickMin = (bonus && bonus.PICK_MIN) || 3;
    let n = 0;
    for (let r = 0; r < finalGrid.length; r++) {
      for (let c = 0; c < finalGrid[r].length; c++) {
        if (finalGrid[r][c] === pickId) n++;
      }
    }
    return n >= pickMin;
  }

  // — Task 18: Anubis a colonna intera triggera i free spin con scala —
  // Si contano le COLONNE completamente Anubis (mai celle singole, vedi
  // engine.js): 1→5, 2→10, 3→15 free spin retriggerabili.
  // Ritorna gli spin assegnati (0 se nessun trigger).
  function checkBonusTrigger(finalGrid) {
    const { SCATTER_ID, SCATTER_MIN, FREE_SPINS_BY_COUNT } = bonusCfg();
    const rows = finalGrid.length;
    const cols = rows ? finalGrid[0].length : 0;
    let fullCols = 0;
    for (let c = 0; c < cols; c++) {
      let full = true;
      for (let r = 0; r < rows; r++) {
        if (finalGrid[r][c] !== SCATTER_ID) { full = false; break; }
      }
      if (full) fullCols++;
    }
    const min = (SCATTER_MIN == null) ? 1 : SCATTER_MIN;
    if (fullCols >= min) {
      const awarded = (FREE_SPINS_BY_COUNT && FREE_SPINS_BY_COUNT[fullCols]) || 0;
      if (awarded > 0) {
        isFreeSpinMode = true;
        freeSpinsRemaining += awarded;
        return awarded;
      }
    }
    return 0;
  }

  // Chiamato a inizio spin: se in modalità bonus consuma un giro gratis.
  // Ritorna true se il giro è gratuito (nessun addebito bet).
  function beginSpin() {
    if (isFreeSpinMode && freeSpinsRemaining > 0) {
      freeSpinsRemaining--;
      return true;
    }
    return false;
  }

  // Chiamato a fine spin: esce dalla modalità quando i giri sono esauriti.
  function endSpin() {
    if (isFreeSpinMode && freeSpinsRemaining <= 0) {
      isFreeSpinMode = false;
      freeSpinsRemaining = 0;
    }
  }

  return { spin, checkBonusTrigger, checkPickTrigger, beginSpin, endSpin,
    get freeSpinsRemaining() { return freeSpinsRemaining; },
    get isFreeSpinMode() { return isFreeSpinMode; } };
})();

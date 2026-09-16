// Task 2 — Motore RNG + valutazione vincite (client-side, crediti virtuali).
// RTP teorico = EV per linea ≈ 0.9538 (pay min 3, vedi rtp_min3c.js).
window.EgittoEngine = (() => {
  const cfg = () => window.EgittoConfig;

  // Estrazione pesata di un simbolo per cella (indipendente per cella)
  function pickSymbol() {
    const { SYMBOLS } = cfg();
    const ids = Object.keys(SYMBOLS);
    let tot = 0;
    for (const id of ids) tot += SYMBOLS[id].peso;
    let r = Math.random() * tot;
    for (const id of ids) {
      r -= SYMBOLS[id].peso;
      if (r < 0) return id;
    }
    return ids[ids.length - 1];
  }

  // Griglia ROWSxCOLS di id simbolo.
  // Task 18: Anubis (SCATTER_ID) non appare mai in singola cella (peso 0 in
  // config) — atterra SOLO come colonna intera da 3 celle, con probabilità
  // COLUMN_P per colonna. Tetto SCATTER_MAX colonne (mescolate, poi prime 3),
  // così la scala free spin 1→5/2→10/3→15 copre tutti i casi possibili.
  function spinGrid() {
    const { ROWS, COLS } = cfg();
    const grid = [];
    for (let r = 0; r < ROWS; r++) {
      const row = [];
      for (let c = 0; c < COLS; c++) row.push(pickSymbol());
      grid.push(row);
    }
    const bonus = cfg().BONUS;
    const scatterId = bonus && bonus.SCATTER_ID;
    if (scatterId) {
      const colP = (bonus && bonus.COLUMN_P) || 0;
      const maxCols = (bonus && bonus.SCATTER_MAX) || 3;
      const candidates = [];
      for (let c = 0; c < COLS; c++) {
        if (Math.random() < colP) candidates.push(c);
      }
      // Mescola i candidati e tieni al massimo maxCols colonne
      for (let i = candidates.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = candidates[i]; candidates[i] = candidates[j]; candidates[j] = t;
      }
      candidates.slice(0, maxCols).forEach((c) => {
        for (let r = 0; r < ROWS; r++) grid[r][c] = scatterId;
      });
    }
    return grid;
  }

  // Simbolo con pay più alto in PAYS (esclusi Wild e Scatter) per un conteggio
  // dato — Task 17: serve per le linee interamente Wild.
  function bestPayingSymbol(count) {
    const { PAYS } = cfg();
    const bonus = cfg().BONUS;
    const wild = cfg().WILD_ID || 'W';
    const scatter = (bonus && bonus.SCATTER_ID) || null;
    let best = null, bestPay = -1;
    for (const id of Object.keys(PAYS)) {
      if (id === wild || id === scatter) continue;
      const pay = (PAYS[id] && PAYS[id][count - 2]) || 0;
      if (pay > bestPay) { bestPay = pay; best = id; }
    }
    return best;
  }

  // Valuta le 10 linee: consecutivi uguali da sinistra, minimo 3 (Task 5).
  // Task 17: il Wild sostituisce qualsiasi simbolo tranne lo scatter —
  // il simbolo di riferimento è il primo non-Wild della sequenza consecutiva;
  // linea tutta Wild → pay del simbolo più alto per quel conteggio.
  // lineBet = betTotale / numLinee (intero per i BETS concordati).
  function evaluateGrid(grid, lineBet) {
    const { PAYLINES, PAYS } = cfg();
    const bonus = cfg().BONUS;
    const wild = cfg().WILD_ID || 'W';
    const scatter = (bonus && bonus.SCATTER_ID) || null;
    let totalWin = 0;
    const wins = [];
    PAYLINES.forEach((line, li) => {
      const seq = line.map((row, col) => grid[row][col]);
      const ref = seq.find((s) => s !== wild) || null;
      if (!ref) {
        // Linea interamente Wild
        const count = seq.length;
        const best = bestPayingSymbol(count);
        const pay = (best && PAYS[best] && PAYS[best][count - 2]) || 0;
        if (count >= 3 && pay > 0) {
          const amount = pay * lineBet;
          totalWin += amount;
          wins.push({ linea: li + 1, simbolo: best, count, amount, wild: true });
        }
        return;
      }
      let count = 1;
      for (let i = 1; i < seq.length; i++) {
        if (seq[i] === ref || seq[i] === wild) count++;
        else break;
      }
      if (count >= 3) {
        const pay = (PAYS[ref] && PAYS[ref][count - 2]) || 0;
        if (pay > 0) {
          const amount = pay * lineBet;
          totalWin += amount;
          wins.push({ linea: li + 1, simbolo: ref, count, amount, wild: seq.slice(0, count).some((s) => s === wild) });
        }
      }
    });
    return { totalWin, wins };
  }

  return { pickSymbol, spinGrid, evaluateGrid };
})();

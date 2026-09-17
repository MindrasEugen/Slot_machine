// Task 2 — Configurazione gioco (Vanilla JS, no moduli per compatibilità PWA/file).
// Griglia 5x3, 10 linee fisse, vincita min 3.
// Task 17 (Kemet v2, revertibile — backup in Temp/opencode/task17-backup).
// Task 18 (revertibile — backup in Temp/opencode/task18-backup):
// 10 simboli Kemet, zero SVG sui rulli — 4 ALTI con badge + 4 BASSI plain
// (stesso motivo, valore dallo sfondo) + Wild + Anubis scatter a colonna intera.
// Faraone/Moneta/Sfinge rimossi dal gioco.
window.EgittoConfig = (() => {
  // Task 18 — pesi/pay calibrati via simulazione (500k spin, vedi PLAN.md):
  // pesi concentrati sui low (profilo C), alti x1.3, plain con 3x fermo a
  // 10/9/8/7 e 4x/5x potenziati. Linee ~90,9% + bonus ~3,3% = TOT ~94,2%.
  // Task 22: i 4 ALTI sono i Gemini (stessi pesi/pay dei badge che sostituiscono).
  // Task 25: nuovo simbolo B = Sarcofago (trigger pick-bonus 3+ ovunque).
  // ARTE PROVVISORIA (symbol-eye badged) finché l'utente consegna sarcofago.png.
  // Anubis → solo free spin; pick → solo premio istantaneo (niente FS).
  const SYMBOLS = {
    O: { emoji: '👑', nome: 'Faraone', peso: 2 },
    A: { emoji: '🦁', nome: 'Sfinge', peso: 3 },
    P: { emoji: '🔺', nome: 'Piramide', peso: 4 },
    V: { emoji: '👸', nome: 'Cleopatra', peso: 6 },
    J: { emoji: '🃏', nome: 'Occhio plain', peso: 8 },
    Q: { emoji: '🃏', nome: 'Ankh plain', peso: 12 },
    K: { emoji: '🃏', nome: 'Scarabeo plain', peso: 16 },
    T: { emoji: '🃏', nome: 'Collana plain', peso: 22 },
    B: { emoji: '⚰️', nome: 'Sarcofago (Bonus)', peso: 2 },
    S: { emoji: '🐺', nome: 'Anubis (Scatter)', peso: 0 }, // mai in singola cella: solo colonne intere (engine.js)
    W: { emoji: '✨', nome: 'Wild', peso: 0.7 } // Task 25c: Wild ~1/8 spin; compensa il blocker di B
  };

  // Pagamenti in unità di LINE-BET (lineBet = betTotale / 10).
  // Formato: [pay2, pay3, pay4, pay5] — pay2 a 0: vincita minima 3 simboli.
  // Alti invariati; plain = fascia low sotto ex-Moneta; S/W non pagano su linea.
  const PAYS = {
    O: [0, 65, 228, 884],
    A: [0, 27, 109, 377],
    P: [0, 22, 75, 267],
    V: [0, 20, 65, 176],
    J: [0, 10, 40, 150],
    Q: [0, 9, 35, 130],
    K: [0, 8, 30, 120],
    T: [0, 7, 28, 110],
    B: [0, 0, 0, 0], // Bonus: nessun pay su linea (solo trigger pick 3+ ovunque)
    S: [0, 0, 0, 0], // Scatter: nessun pay su linea (solo trigger free spin)
    W: [0, 0, 0, 0] // Wild: paga solo per sostituzione (vedi engine.js)
  };

  // 10 linee fisse: ogni riga = indice riga per ciascun rullo (0=top,1=mid,2=bot)
  const PAYLINES = [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
    [2, 2, 2, 2, 2],
    [0, 1, 2, 1, 0],
    [2, 1, 0, 1, 2],
    [1, 0, 0, 0, 1],
    [1, 2, 2, 2, 1],
    [0, 0, 1, 0, 0],
    [2, 2, 1, 2, 2],
    [1, 0, 1, 2, 1]
  ];

  const BETS = [10, 20, 50, 100, 250, 500]; // Task 27: max bet 500
  const START_CREDITS = 1000;
  const REFILL_CREDITS = 1000;
  const STORAGE_KEY = 'egitto_credits';

  // Bonus (Task 18): Anubis atterra SOLO come colonna intera da 3 celle
  // (mai in singola cella) — 1 colonna→5, 2→10, 3→15 free spin retriggerabili
  // + pick 1 di 5 sarcofagi (premio = moltiplicatore × TOTAL BET).
  // COLUMN_P = probabilità per colonna (calibrata via simulazione, ~1% trigger).
  // Mai più di 3 colonne Anubis per spin: tetto garantito in engine.js.
  // Task 25c: premi pick alzati (media 6.6x) per compensare il blocker di B.
  // B resta puro trigger (pay 0 su linea). RTP totale ~95% (sim 300k).
  const BONUS = { SCATTER_ID: 'S', SCATTER_MIN: 1, SCATTER_MAX: 3, FREE_SPINS_BY_COUNT: { 1: 5, 2: 10, 3: 15 }, PICK_MULTS: [3, 4, 6, 8, 12], COLUMN_P: 0.002, PICK_ID: 'B', PICK_MIN: 3 };
  const WILD_ID = 'W';

  return { SYMBOLS, PAYS, PAYLINES, BETS, START_CREDITS, REFILL_CREDITS, STORAGE_KEY, BONUS, WILD_ID, COLS: 5, ROWS: 3 };
})();

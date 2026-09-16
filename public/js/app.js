// Task 3 — Restyle Sphinx: celle pergamena, linee vincita oro, overlay BIG WIN.
// Logica RTP invariata dal Task 2.
(() => {
  const cfg = window.EgittoConfig;
  const engine = window.EgittoEngine;
  const { COLS, ROWS, BETS, START_CREDITS, REFILL_CREDITS, STORAGE_KEY } = cfg;

  const canvas = document.getElementById('reels');
  const ctx = canvas.getContext('2d');
  const balanceEl = document.getElementById('balance');
  const betEl = document.getElementById('bet');
  const winEl = document.getElementById('win-val');
  const lineBetEl = document.getElementById('linebet-val');
  const coinEl = document.getElementById('coin-val');
  const winMsg = document.getElementById('win-msg');
  const bigwinEl = document.getElementById('bigwin');
  // Task 17: importo dentro lo span (il resto del markup è l'artwork Kemet)
  const bigwinAmount = document.getElementById('bigwin-amount');
  const btnSpin = document.getElementById('btn-spin');
  const btnMax = document.getElementById('btn-maxbet');

  let balance = parseInt(localStorage.getItem(STORAGE_KEY) || String(START_CREDITS), 10);
  if (Number.isNaN(balance)) balance = START_CREDITS;
  let bet = BETS[0];
  let grid = engine.spinGrid();
  let lastWinCells = new Set();
  let lastResult = { totalWin: 0, wins: [] };
  let spinning = false;

  // Task 18/22: celle con sfondo prugna + bordo oro (il cabinet è trasparente,
  // le icone restano nei loro riquadri). Box simboli al 90% (Task 22).
  const CELL_BG = '#3c1e39';
  const CELL_BG_WIN = '#6b2f5e';
  const CELL_EDGE = '#caa14f';
  const CELL_EDGE_WIN = '#ffb02e';
  const REEL_BG = '#170b1d';

  function goldBg(x, y, cw, rh) {
    const g = ctx.createLinearGradient(0, y, 0, y + rh);
    g.addColorStop(0, '#ffe98a');
    g.addColorStop(0.5, '#dca83e');
    g.addColorStop(1, '#9a742a');
    ctx.fillStyle = g;
    ctx.fillRect(x, y, cw, rh);
  }

  function drawCell(x, y, cw, rh, symbolId, isWin) {
    // Task 30: il Sarcofago (B) ha sempre sfondo oro per evidenziarlo
    if (symbolId === 'B') goldBg(x, y, cw, rh);
    else {
      ctx.fillStyle = isWin ? CELL_BG_WIN : CELL_BG;
      ctx.fillRect(x, y, cw, rh);
    }
    window.EgittoSymbols.draw(ctx, symbolId, x + cw / 2, y + rh / 2, Math.min(cw, rh));
    ctx.strokeStyle = isWin ? CELL_EDGE_WIN : CELL_EDGE;
    ctx.lineWidth = isWin ? 4 : 2;
    ctx.strokeRect(x + 2, y + 2, cw - 4, rh - 4);
  }

  function drawWinLines() {
    if (!lastResult.wins.length) return;
    const cw = canvas.width / COLS, rh = canvas.height / ROWS;
    ctx.save();
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#ff8c00';
    ctx.shadowBlur = 8;
    lastResult.wins.slice(0, 5).forEach((w) => {
      const line = cfg.PAYLINES[w.linea - 1];
      ctx.beginPath();
      for (let i = 0; i < w.count; i++) {
        const cx = i * cw + cw / 2;
        const cy = line[i] * rh + rh / 2;
        if (i === 0) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
      }
      ctx.stroke();
    });
    ctx.restore();
  }

  function drawStatic(highlight) {
    const W = canvas.width, H = canvas.height;
    const cw = W / COLS, rh = H / ROWS;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = REEL_BG;
    ctx.fillRect(0, 0, W, H);
    for (let c = 0; c < COLS; c++) {
      // Task 18: colonna tutta Anubis → un'unica immagine verticale intera
      if (grid[0][c] === 'S' && grid[1][c] === 'S' && grid[2][c] === 'S' &&
          window.EgittoSymbols.drawSpan) {
        ctx.fillStyle = CELL_BG;
        ctx.fillRect(c * cw, 0, cw, H);
        window.EgittoSymbols.drawSpan(ctx, 'S', c * cw, 0, cw, H);
        ctx.strokeStyle = CELL_EDGE;
        ctx.lineWidth = 2;
        ctx.strokeRect(c * cw + 2, 2, cw - 4, H - 4);
        continue;
      }
      for (let r = 0; r < ROWS; r++) {
        drawCell(c * cw, r * rh, cw, rh, grid[r][c], highlight && highlight.has(`${c},${r}`));
      }
    }
    drawWinLines();
  }

  function renderPanel() {
    const coin = bet / cfg.PAYLINES.length;
    balanceEl.textContent = balance;
    betEl.textContent = bet;
    if (winEl) winEl.textContent = lastResult.totalWin;
    if (lineBetEl) lineBetEl.textContent = coin;
    if (coinEl) coinEl.textContent = coin.toFixed(2);
    localStorage.setItem(STORAGE_KEY, String(balance));
    // Task 21/29: push saldo — su profilo se loggato, altrimenti anonimo
    if (window.EgittoAuth && window.EgittoAuth.isLogged()) window.EgittoAuth.push(balance);
    else if (window.EgittoCloud) window.EgittoCloud.push(balance);
  }

  function setButtons(enabled) {
    btnSpin.disabled = !enabled;
    btnMax.disabled = !enabled;
    btnSpin.style.opacity = enabled ? '1' : '0.5';
  }

  const easeOutCubic = (p) => 1 - Math.pow(1 - p, 3);

  function updateBonusUI() {
    const banner = document.getElementById('freespin-banner');
    const count = document.getElementById('freespin-count');
    const cabinet = document.querySelector('.cabinet');
    const active = window.EgittoGame.isFreeSpinMode;
    if (active) {
      banner.classList.remove('hidden');
      count.textContent = window.EgittoGame.freeSpinsRemaining;
      cabinet.classList.add('bonus-mode');
    } else {
      banner.classList.add('hidden');
      cabinet.classList.remove('bonus-mode');
    }
  }

  // Task 13: pick-bonus sarcofagi (premio istantaneo, poi free spin)
  let pendingPick = false;
  function showPickBonus() {
    const mults = [...cfg.BONUS.PICK_MULTS].sort(() => Math.random() - 0.5);
    document.querySelectorAll('#sarc-row .sarc').forEach((b, i) => {
      b.classList.remove('open', 'dim');
      b.disabled = false;
      b.dataset.mult = mults[i];
    });
    document.getElementById('bonus-win').classList.add('hidden');
    document.getElementById('bonus-collect').classList.add('hidden');
    document.getElementById('bonus-overlay').classList.remove('hidden');
    pendingPick = true;
    if (window.EgittoAudio) window.EgittoAudio.win(true);
  }
  document.querySelectorAll('#sarc-row .sarc').forEach((b) => b.addEventListener('click', () => {
    if (!pendingPick || b.disabled) return;
    pendingPick = false;
    if (window.EgittoAudio) window.EgittoAudio.click();
    const prize = parseInt(b.dataset.mult, 10) * bet;
    balance += prize;
    b.classList.add('open');
    document.querySelectorAll('#sarc-row .sarc').forEach((o) => { o.disabled = true; if (o !== b) o.classList.add('dim'); });
    document.getElementById('bonus-amount').textContent = prize;
    document.getElementById('bonus-win').classList.remove('hidden');
    document.getElementById('bonus-collect').classList.remove('hidden');
    renderPanel();
  }));
  document.getElementById('bonus-collect').addEventListener('click', () => {
    if (window.EgittoAudio) window.EgittoAudio.click();
    document.getElementById('bonus-overlay').classList.add('hidden');
    updateBonusUI();
    renderPanel();
    setButtons(true);
  });

  // Task 28: ricarica bonus +1000 riscattabile una sola volta ogni 24 ore.
  const REFILL_KEY = 'egitto_last_refill';
  const REFILL_DAY_MS = 24 * 3600 * 1000;

  function doSpin() {
    if (spinning) return;
    // Task 10: in modalità bonus il giro è gratuito (nessun addebito bet)
    const isFree = window.EgittoGame.beginSpin();
    if (!isFree) {
      if (balance < bet) {
        const now = Date.now();
        let last = 0;
        try { last = parseInt(localStorage.getItem(REFILL_KEY) || '0', 10) || 0; } catch (e) {}
        if (now - last >= REFILL_DAY_MS) {
          try { localStorage.setItem(REFILL_KEY, String(now)); } catch (e) {}
          balance += REFILL_CREDITS;
          winMsg.textContent = `Bonus giornaliero +${REFILL_CREDITS}! Prossima ricarica tra 24 ore.`;
          renderPanel();
        } else {
          const left = REFILL_DAY_MS - (now - last);
          const h = Math.floor(left / 3600000);
          const m = Math.ceil((left % 3600000) / 60000);
          winMsg.textContent = `Crediti insufficienti — bonus giornaliero già riscosso, torna tra ${h}h ${m}min.`;
          renderPanel();
        }
        return;
      }
      balance -= bet;
    }
    lastResult = { totalWin: 0, wins: [] };
    renderPanel();
    winMsg.textContent = '…';
    bigwinEl.classList.add('hidden');
    lastWinCells = new Set();
    setButtons(false);
    spinning = true;
    if (window.EgittoAudio) window.EgittoAudio.spin();

    const finalGrid = engine.spinGrid();
    const lineBet = bet / cfg.PAYLINES.length;
    const result = engine.evaluateGrid(finalGrid, lineBet);

    // Task 8: spinning meccanico via game.js (reelOffsets, stop a cascata).
    const rh = canvas.height / ROWS;
    const cw = canvas.width / COLS;

    function animCell(x, y, cw2, rh2, sym) {
      if (sym === 'B') goldBg(x, y, cw2, rh2);
      else {
        ctx.fillStyle = CELL_BG;
        ctx.fillRect(x, y, cw2, rh2);
      }
      window.EgittoSymbols.draw(ctx, sym, x + cw2 / 2, y + rh2 / 2, Math.min(cw2, rh2));
      ctx.strokeStyle = 'rgba(202,161,79,0.8)';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 2, y + 2, cw2 - 4, rh2 - 4);
    }

    function finishSpin() {
      spinning = false;
      grid = finalGrid;
      lastResult = result;
      balance += result.totalWin;
      // Task 25: trigger separati — Anubis (colonne) → solo free spin,
      // B (3+ ovunque) → solo pick-bonus sarcofagi (premio istantaneo).
      const awarded = window.EgittoGame.checkBonusTrigger(finalGrid);
      const pick = window.EgittoGame.checkPickTrigger(finalGrid);
      window.EgittoGame.endSpin();
      updateBonusUI();
      // evidenzia celle vincenti (primi `count` della linea)
      result.wins.forEach((w) => {
        const line = cfg.PAYLINES[w.linea - 1];
        for (let i = 0; i < w.count; i++) lastWinCells.add(`${i},${line[i]}`);
      });
      drawStatic(lastWinCells);
      const freeTag = isFree ? ' (GRATIS)' : '';
      const bonusTag = awarded > 0 ? ` · 🐺 ANUBIS: +${awarded} FREE SPINS!` : '';
      const pickTag = pick ? ' · ⚰️ SARCOFAGI!' : '';
      if (result.totalWin > 0) {
        const isBig = result.totalWin >= bet * 3; // Task 33: big win da 3x la scommessa
        winMsg.textContent = `Vinci ${result.totalWin} (${result.wins.length} linee)${freeTag}${isBig ? ' 🏆 BIG WIN!' : ''}${bonusTag}${pickTag}`;
        if (bigwinAmount) bigwinAmount.textContent = result.totalWin;
        else bigwinEl.textContent = result.totalWin;
        bigwinEl.classList.remove('hidden');
        if (!isBig) setTimeout(() => bigwinEl.classList.add('hidden'), 1800);
        if (window.EgittoAudio) window.EgittoAudio.win(isBig);
      } else {
        winMsg.textContent = awarded > 0 ? `🐺 ANUBIS! +${awarded} FREE SPINS${pick ? ' + sarcofagi' : ''}${freeTag}` : (pick ? `⚰️ BONUS! Scegli un sarcofago${freeTag}` : `Nessuna vincita — riprova${freeTag}`);
        bigwinEl.classList.add('hidden');
      }
      renderPanel();
      if (pick) {
        showPickBonus(); // solo premio istantaneo (niente free spin dal pick)
        return;
      }
      setButtons(true);
    }

    window.EgittoGame.spin({
      canvas, ctx, cols: COLS, rows: ROWS,
      fromGrid: grid, toGrid: finalGrid,
      pick: engine.pickSymbol,
      drawCell: animCell,
      onReelStop: () => { if (window.EgittoAudio) window.EgittoAudio.reelStop(); },
      onDone: finishSpin
    });
  }

  const bonusActive = () => window.EgittoGame.isFreeSpinMode;
  const clickSnd = () => { if (window.EgittoAudio) window.EgittoAudio.click(); };
  btnSpin.addEventListener('click', doSpin);
  btnMax.addEventListener('click', () => { clickSnd(); if (!spinning && !bonusActive()) { bet = BETS[BETS.length - 1]; renderPanel(); } });
  document.getElementById('btn-minus').addEventListener('click', () => {
    clickSnd();
    if (spinning || bonusActive()) return; // puntata bloccata durante il bonus
    bet = BETS[Math.max(0, BETS.indexOf(bet) - 1)]; renderPanel();
  });
  document.getElementById('btn-plus').addEventListener('click', () => {
    clickSnd();
    if (spinning || bonusActive()) return;
    bet = BETS[Math.min(BETS.length - 1, BETS.indexOf(bet) + 1)]; renderPanel();
  });
  // Task 20: pulsante mute con stato persistito
  const btnMute = document.getElementById('btn-mute');
  if (btnMute) {
    const paintMute = () => { btnMute.textContent = (window.EgittoAudio && window.EgittoAudio.muted) ? '🔇' : '🔊'; };
    paintMute();
    btnMute.addEventListener('click', () => {
      if (window.EgittoAudio) window.EgittoAudio.toggleMute();
      else clickSnd();
      paintMute();
      if (window.EgittoAudio) window.EgittoAudio.click();
    });
  }

  renderPanel();
  updateBonusUI();
  drawStatic(null);
  // Task 21/29: reconcile saldo — prima l'account (se loggato), poi l'anonimo
  function paintAccountBtn() {
    const b = document.getElementById('btn-account');
    if (!b) return;
    b.textContent = (window.EgittoAuth && window.EgittoAuth.isLogged())
      ? `👤 ${(window.EgittoAuth.getNickname() || '?').slice(0, 10)}` : '👤';
  }
  function refreshAfterSync() {
    renderPanel();
    if (!spinning) drawStatic(lastWinCells.size ? lastWinCells : null);
  }
  if (window.EgittoAuth) {
    window.EgittoAuth.init(balance).then((r) => {
      if (r && r.ok) {
        if (typeof r.balance === 'number' && r.balance !== balance) balance = r.balance;
        paintAccountBtn();
        refreshAfterSync();
        return;
      }
      cloudSync();
    }).catch(cloudSync);
  } else {
    cloudSync();
  }
  function cloudSync() {
    if (window.EgittoCloud) {
      window.EgittoCloud.init(balance).then((r) => {
        if (r && r.ok && typeof r.balance === 'number' && r.balance !== balance) {
          balance = r.balance;
          refreshAfterSync();
        }
      }).catch(() => {});
    }
  }

  // Task 29: modale account (login / registrazione / logout)
  const accOverlay = document.getElementById('account-overlay');
  const accMsg = document.getElementById('account-msg');
  const accForms = document.getElementById('account-forms');
  const accProfile = document.getElementById('account-profile');
  const say = (t) => { if (accMsg) accMsg.textContent = t || ''; };
  function syncAccountModal() {
    const logged = !!(window.EgittoAuth && window.EgittoAuth.isLogged());
    if (accForms) accForms.classList.toggle('hidden', logged);
    if (accProfile) accProfile.classList.toggle('hidden', !logged);
    if (logged) {
      const nm = document.getElementById('acc-name');
      if (nm) nm.textContent = window.EgittoAuth.getNickname() || '?';
    }
    paintAccountBtn();
  }
  const btnAccount = document.getElementById('btn-account');
  if (btnAccount) btnAccount.addEventListener('click', () => {
    clickSnd(); say(''); syncAccountModal();
    if (accOverlay) accOverlay.classList.remove('hidden');
  });
  const accClose = document.getElementById('account-close');
  if (accClose) accClose.addEventListener('click', () => { if (accOverlay) accOverlay.classList.add('hidden'); });
  if (accOverlay) accOverlay.addEventListener('click', (e) => { if (e.target === accOverlay) accOverlay.classList.add('hidden'); });
  const doAuth = async (mode) => {
    if (!window.EgittoAuth) { say('Servizio non disponibile.'); return; }
    const email = (document.getElementById('acc-email') || {}).value || '';
    const pass = (document.getElementById('acc-pass') || {}).value || '';
    const nick = (document.getElementById('acc-nick') || {}).value || '';
    if (!email || !pass) { say('Inserisci email e password.'); return; }
    say('…');
    try {
      const r = mode === 'register'
        ? await window.EgittoAuth.register(email.trim(), pass, nick.trim(), balance)
        : await window.EgittoAuth.login(email.trim(), pass, balance);
      if (r && r.ok) {
        if (typeof r.balance === 'number') balance = r.balance;
        say(mode === 'register' ? `Benvenuto, ${r.nickname}! Bonus +1000 🎁` : `Bentornato, ${r.nickname}!`);
        refreshAfterSync();
        syncAccountModal();
      } else if (r && r.needConfirm) {
        say('Controlla la tua email per confermare la registrazione, poi accedi.');
      } else {
        say((r && r.error) || 'Errore, riprova.');
      }
    } catch (e) { say('Errore di rete, riprova.'); }
  };
  const accLogin = document.getElementById('acc-login');
  if (accLogin) accLogin.addEventListener('click', () => doAuth('login'));
  const accRegister = document.getElementById('acc-register');
  if (accRegister) accRegister.addEventListener('click', () => doAuth('register'));
  const accLogout = document.getElementById('acc-logout');
  if (accLogout) accLogout.addEventListener('click', async () => {
    if (window.EgittoAuth) await window.EgittoAuth.logout();
    say('');
    syncAccountModal();
    if (accOverlay) accOverlay.classList.add('hidden');
  });
  paintAccountBtn();
  // Task 7: precarica i PNG; al completamento ridisegna (fallback se mancano).
  if (window.EgittoSymbols && window.EgittoSymbols.preloadSymbolImages) {
    window.EgittoSymbols.preloadSymbolImages().then(() => {
      if (!spinning) drawStatic(lastWinCells.size ? lastWinCells : null);
    }).catch(() => {});
  }
})();

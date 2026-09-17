# Slot Antico Egitto — Sphinx

🎰 **Gioca online**: https://slot-machine-g6qm.onrender.com/

Slot machine web-based a tema Antico Egitto, distribuita come **PWA** (link diretto, nessuna app store).
Solo **moneta virtuale**: puro intrattenimento, senza denaro reale né vincite convertibili.

## Caratteristiche

- Griglia **5×3** su Canvas, **10 linee** fisse, vincita da **3+ simboli**, RTP ~95%.
- 11 simboli: Faraone, Sfinge, Piramide, Cleopatra, 4 plain, Wild, Anubis (free spin a colonna intera), Sarcofago (pick-bonus).
- Big Win sopra 5x, Nice Win tra 3x e 5x, popup Free Spin a ogni trigger Anubis, popup Bonus a ogni trigger sarcofagi, free spin 5/10/15, bonus orario +1000 ogni ora.
- Account email+password (nickname + saldo su Supabase), audio Howler, pagine Paytable e Shop dedicate.

## Stack tecnologico

- **Frontend**: HTML5 + CSS3 + Vanilla JS (no framework, no TypeScript), Canvas 2D, Howler.js (audio), Supabase JS v2 (auth + database)
- **Backend**: Node.js + Express (statici + API `/health`, `/balance`, `/config`)
- **Database/Auth**: Supabase Postgres — sync saldi anonimi + profili
- **PWA**: manifest + Service Worker (installabile, online-first)
- **Pagamenti**: Stripe Checkout test-mode EUR (da cablare)

## Avvio

```bash
npm install
npm start
# http://localhost:3000
```

Vedi `PLAN.md` per stato lavori e cose da fare.

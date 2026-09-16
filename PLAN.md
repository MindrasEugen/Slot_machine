# PLAN — Slot Antico Egitto (Sphinx)

## Stato attuale

- Griglia 5×3 su Canvas, 10 linee fisse, vincita min 3 simboli, **RTP ~95%**, max bet 500.
- **11 simboli**: Faraone, Sfinge, Piramide, Cleopatra (alti) · 4 plain (bassi) · Wild (sostituisce tutto tranne Anubis) · Anubis scatter (colonna intera: 1→5, 2→10, 3→15 free spin) · Sarcofago Bonus (3+ ovunque → pick 1 di 5).
- Big Win da 3x la scommessa; bonus orario +1000 una volta ogni ora.
- Pagine: `index.html` (gioco) · `paytable.html` · `shop.html` (anteprima, checkout da cablare).
- Audio Howler (5 effetti sintetizzati) + mute; PWA installabile (icone + SW).
- Supabase (`cinema-vicino-app`): `"AAA2_balances"` (anonimi) + `"AAA2_profiles"` (nickname + saldo, bonus 1000 alla creazione); sync al max locale/remoto, offline-safe.
- Mobile fix (2026-09-16): spin fuori dal box tra rulli e plancia (touch 88px), rulli full-bleed senza cornice su ≤640px, freccia spin centrata, deck a 3 celle con stepper su BET.

## Regole di ingaggio

- Un solo task alla volta, attesa del via prima di proseguire.
- Dopo ogni modifica, aggiornare questo file.
- Stack: HTML5 + CSS3 + Vanilla JS, Canvas, Howler.js, Node + Express, PWA.
- Solo moneta virtuale + disclaimer fisso (no denaro reale).

## File chiave

- `server.js` — Express statico + `/api/health`, `/api/balance` (placeholder), `/api/config` (chiavi publishable).
- `public/index.html` — topbar (balance/shop/audio/account) + cabinet + deck compatta.
- `public/js/config.js` — pesi, PAYS, BETS, BONUS (Anubis/pick).
- `public/js/engine.js` — `spinGrid` (colonne Anubis), `evaluateGrid` (Wild).
- `public/js/symbols.js` — loader PNG (trim + cover/framed) + fallback Canvas.
- `public/js/game.js` — spin meccanico + trigger bonus/pick.
- `public/js/app.js` — wiring UI, overlay, audio, cloud.
- `public/js/audio.js` · `auth.js` · `supabase-sync.js` — audio, account, sync anonima.

## Da fare

1. **Shop Stripe (IN PAUSA — pagamenti non abilitati)**: checkout test-mode EUR + webhook accredito (serve `sk_test` dell'utente). Shop mostra avviso + pulsanti disabilitati.
2. **Test e deploy**: prova mobile/desktop, hosting HTTPS per PWA installabile.

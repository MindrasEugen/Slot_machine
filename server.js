// Task 1 — Backend minimo funzionante (Express static + API placeholder)
// Stack: Node.js + Express. Nessuna logica di gioco qui nel Task 1.
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Health-check (usato per verifica Task 1)
app.get('/api/health', (req, res) => {
  res.json({ ok: true, game: 'slot-antico-egitto', task: 1 });
});

// Placeholder saldo — Task 1: ritorna solo il default concordato (1000).
// Supabase + Stripe verranno cablati nei Task successivi.
app.get('/api/balance', (req, res) => {
  res.json({ credits: 1000, source: 'placeholder-task1' });
});

// Task 21: config pubblica per il client (chiave publishable, sicura da esporre).
app.get('/api/config', (req, res) => {
  res.json({
    supabaseUrl: process.env.SUPABASE_URL || null,
    supabaseKey: process.env.SUPABASE_ANON_KEY || null
  });
});

// Fallback SPA/PWA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[Task1] Slot Antico Egitto su http://localhost:${PORT}`);
});

// Genera public/js/public-config.js dal .env per l'app nativa (Capacitor):
// lì non c'è il server Express, quindi /api/config non esiste.
// Solo valori pubblici: URL Supabase + chiave publishable. Mai segreti qui.
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const url = process.env.SUPABASE_URL || null;
const key = process.env.SUPABASE_ANON_KEY || null;
if (key && !key.startsWith('sb_publishable_')) {
  console.error('[public-config] SUPABASE_ANON_KEY non è una chiave publishable: interrotto.');
  process.exit(1);
}
const out = path.join(__dirname, '..', 'public', 'js', 'public-config.js');
const body = `// File generato da scripts/build-public-config.js — non modificare a mano.
window.EgittoPublicConfig = ${JSON.stringify({ supabaseUrl: url, supabaseKey: key })};
`;
fs.writeFileSync(out, body);
console.log(`[public-config] scritto ${path.relative(process.cwd(), out)}${url ? '' : ' (senza Supabase: solo gioco locale)'}`);
